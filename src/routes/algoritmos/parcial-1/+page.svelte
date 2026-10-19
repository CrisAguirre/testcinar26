<script lang="ts">
  import { selectRandomQuestions, examConfig } from '$lib/data/parcial1_algo';
  import { gradesApi, apiUploadFile, getHealthUrl } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAlgoP1LockedFor, ALGO_P1_OPEN, ALGO_P1_CLOSE } from '$lib/guards/examLock';

  // Bloqueo temporal: Parcial 1 de Algoritmos habilitado lunes 19 y martes 20/10 (o admin).
  let examLocked = $derived(isAlgoP1LockedFor($currentUser));
  $effect(() => {
    if (!$currentUser) { goto('/login'); return; }
    if (examLocked) goto('/algoritmos');
  });
  import {
    STORAGE_KEY, TOTAL_QUESTIONS, TOTAL_TIME, MAX_ATTEMPTS,
    getAttemptLabel, getAttemptType, formatTime,
    getAttemptCount as getTotalAttempts, getSyncQueue,
    addToSyncQueue, removeFromSyncQueue, setHealthCheckOk,
    isHealthCheckRecent, SAVED_ANSWERS_KEY, saveAnswersSnapshot,
    clearSavedAnswers, calculateScore, buildExamData, getLocalAttempts
  } from '$lib/exam_algo_p1';
  import { preloadedMyGrades } from '$lib/stores/preloaded';

  let { data } = $props();

  let started = $state(false);
  let finished = $state(false);
  let questions = $state<any[]>([]);
  let answers = $state<Record<number, any>>({});
  let currentIndex = $state(0);

  let timeLeft = $state(TOTAL_TIME);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let tabSwitchCount = $state(0);
  let finalScore = $state(0);
  let mcTotal = $state(0);
  let results = $state<Record<number, { correct: boolean; userAnswer: any; correctAnswer: any }>>({});

  let currentAttemptNumber = $state(0);
  let serverAttempts = $state(0);
  let serverGrades = $state<any[]>(data.serverGrades || []);
  let loadingServer = $state(!data.serverGrades);
  let saveError = $state('');
  let saveSuccess = $state(false);
  let isSaving = $state(false);
  let serverCheckOk = $state(false);
  // Empieza en true: evita que el aviso "No se pudo verificar el servidor"
  // aparezca en el HTML inicial (SSR) antes del primer chequeo de salud.
  let checkingServer = $state(true);
  let pendingSyncCount = $state(0);
  let syncingInProgress = $state(false);

  // Ejercicios prácticos DFD: subida de archivos .dfd (independiente del Grade; reintentable)
  let uploadedFiles = $state<Record<string, File>>({});
  let uploadedFileNames = $state<Record<string, string>>({});
  let uploadStatuses = $state<Record<string, string>>({});
  let uploadErrors = $state<Record<string, string>>({});
  let lastGradeId = $state<string | undefined>(undefined);
  let dfdUploadError = $state('');
  let isUploadingDfd = $state(false);

  let isUnlimited = $derived($currentUser?.email === 'coordinacion@cinarsistemas.edu.co');
  let examTotal = $derived(questions.length > 0 ? questions.length : TOTAL_QUESTIONS);

  function getAttemptCount(): number {
    return getTotalAttempts(serverAttempts, getLocalAttempts().length, loadingServer);
  }

  async function loadServerAttempts() {
    if (!$currentUser?.id) { loadingServer = false; return; }
    try {
      let all = data.serverGrades;
      if (!all || all.length === 0) {
        all = await gradesApi.getMine();
        preloadedMyGrades.set(all);
      }
      const examGrades = all.filter((g: any) => g.subject === 'Algoritmos - Parcial 1');
      serverGrades = examGrades;
      serverAttempts = examGrades.length;
    } catch {
      serverAttempts = getLocalAttempts().length;
    } finally {
      loadingServer = false;
    }
  }

  function getAvailableSlots(): { total: number; used: number; remaining: number; windowLabel: string; enabled: boolean } {
    const used = getAttemptCount();

    if (isUnlimited) {
      return { total: Infinity, used, remaining: Infinity, windowLabel: 'Intentos ilimitados (coordinador)', enabled: true };
    }

    const now = new Date();
    const inWindow = now >= ALGO_P1_OPEN && now <= ALGO_P1_CLOSE;
    return {
      total: MAX_ATTEMPTS,
      used,
      remaining: Math.max(0, MAX_ATTEMPTS - used),
      windowLabel: inWindow ? 'Habilitado: lunes 19 y martes 20/10 (todo el día)' : 'Fuera de la ventana del parcial',
      enabled: used < MAX_ATTEMPTS
    };
  }

  let slots = $derived.by(() => getAvailableSlots());

  $effect(() => {
    if (timeLeft <= 0 && started && !finished) {
      handleSubmit();
    }
  });

  onMount(() => {
    loadServerAttempts();
    pendingSyncCount = getSyncQueue().length;
    checkBackendHealth();
  });

  $effect(() => {
    if ($currentUser) loadServerAttempts();
  });

  function getProgressPercent(): number {
    const answered = Object.keys(answers).length;
    return (answered / examTotal) * 100;
  }

  function getLevelLabel(tema: unknown): string {
    const labels: Record<number, string> = examConfig.levelLabels;
    return (typeof tema === 'number' && labels[tema]) || `Tema ${tema ?? ''}`;
  }

  async function startExam() {
    const healthy = await checkBackendHealth();
    if (!healthy) {
      const proceed = confirm('El servidor no responde. Puedes comenzar, pero las respuestas se guardarán localmente y se sincronizarán después. ¿Deseas continuar?');
      if (!proceed) return;
    }

    const saved = (() => {
      try {
        const raw = localStorage.getItem(SAVED_ANSWERS_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    })();

    if (saved && saved.questions && saved.answers && Object.keys(saved.answers).length > 0) {
      const resume = confirm(`Tienes un parcial en progreso guardado (${Object.keys(saved.answers).length} preguntas respondidas). ¿Deseas continuar?`);
      if (resume) {
        questions = saved.questions;
        answers = saved.answers;
        currentIndex = saved.currentIndex || 0;
        timeLeft = saved.timeLeft || TOTAL_TIME;
        tabSwitchCount = saved.tabSwitchCount || 0;
        if (saved.uploadedFileNames) uploadedFileNames = saved.uploadedFileNames;
        started = true;
        finished = false;
        currentAttemptNumber = getAttemptCount() + 1;
        timerInterval = setInterval(() => { timeLeft--; }, 1000);
        document.addEventListener('visibilitychange', handleVisibility);
        return;
      }
    }
    clearSavedAnswers();

    questions = selectRandomQuestions();
    uploadedFiles = {};
    uploadedFileNames = {};
    uploadStatuses = {};
    uploadErrors = {};
    started = true;
    finished = false;
    answers = {};
    currentIndex = 0;
    timeLeft = TOTAL_TIME;
    tabSwitchCount = 0;

    currentAttemptNumber = getAttemptCount() + 1;

    timerInterval = setInterval(() => {
      timeLeft--;
    }, 1000);

    document.addEventListener('visibilitychange', handleVisibility);
  }

  function handleVisibility() {
    if (document.hidden && started && !finished) {
      tabSwitchCount++;
    }
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < examTotal) {
      if (index > currentIndex && !isQuestionAnswered(questions[currentIndex]?.id)) return;
      currentIndex = index;
    }
  }

  function handleAnswer(value: any) {
    answers[questions[currentIndex].id] = value;
    autoSaveAnswers();
  }

  function isQuestionAnswered(qId: number): boolean {
    const q = questions.find((qq) => qq.id === qId);
    if (q?.type === 'file') return !!uploadedFileNames[String(qId)];
    return answers[qId] !== undefined && answers[qId] !== '';
  }

  function autoSaveAnswers() {
    if (!started || finished) return;
    saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount, uploadedFileNames);
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    const qId = String(questions[currentIndex].id);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.dfd')) {
      uploadErrors[qId] = 'Solo se permiten archivos .dfd';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      uploadErrors[qId] = 'El archivo no puede superar 2 MB';
      return;
    }

    uploadedFiles[qId] = file;
    uploadedFileNames[qId] = file.name;
    uploadErrors[qId] = '';
    uploadStatuses[qId] = '';
    // Marca la pregunta como respondida
    answers[questions[currentIndex].id] = 'file-selected';
    autoSaveAnswers();
  }

  async function uploadDfdFile(gradeId?: string) {
    if (Object.keys(uploadedFiles).length === 0) {
      return { success: false, error: 'No hay archivos seleccionados. Vuelve a seleccionarlos (.dfd) e intenta de nuevo.' };
    }

    let allSuccess = true;
    let firstError = '';
    const attemptNum = currentAttemptNumber || (getAttemptCount() + 1);

    for (const [qId, file] of Object.entries(uploadedFiles)) {
      uploadStatuses[qId] = 'uploading';
      uploadErrors[qId] = '';
      // 3 intentos por archivo: el primer POST suele dar timeout si el servidor estaba dormido
      let ok = false;
      let lastErr = '';
      for (let r = 0; r < 3 && !ok; r++) {
        try {
          await apiUploadFile('/dfd/upload', file, {
            examType: 'parcial-1',
            period: '2026-3',
            attemptNumber: String(attemptNum),
            ...(gradeId ? { gradeId } : {})
          });
          uploadStatuses[qId] = 'success';
          ok = true;
        } catch (err) {
          lastErr = err instanceof Error ? err.message : 'Error al subir el archivo';
          if (r < 2) await new Promise(res => setTimeout(res, 2000 * (r + 1)));
        }
      }
      if (!ok) {
        uploadStatuses[qId] = 'error';
        uploadErrors[qId] = lastErr;
        if (!firstError) firstError = lastErr;
        allSuccess = false;
      }
    }
    return { success: allSuccess, error: allSuccess ? undefined : firstError };
  }

  async function retryDfdUpload() {
    dfdUploadError = '';
    if (Object.keys(uploadedFiles).length === 0) {
      dfdUploadError = 'No hay archivos en memoria. Tus .dfd siguen en tu computador: vuelve a iniciar el parcial, selecciónalos de nuevo y podrás reintentar la subida sin gastar un intento adicional.';
      return;
    }
    isUploadingDfd = true;
    const res = await uploadDfdFile(lastGradeId);
    isUploadingDfd = false;
    if (!res.success) dfdUploadError = res.error || 'Error al subir los DFD';
  }

  async function checkBackendHealth(): Promise<boolean> {
    if (isHealthCheckRecent()) {
      // Chequeo reciente: el servidor está OK; marcar explícitamente para no
      // dejar encendido el aviso de "No se pudo verificar el servidor".
      serverCheckOk = true;
      checkingServer = false;
      return true;
    }
    checkingServer = true;
    const baseUrl = getHealthUrl();
    try {
      for (let i = 0; i < 3; i++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 25000);
          await fetch(baseUrl, { signal: controller.signal, mode: 'cors' });
          clearTimeout(timeout);
          setHealthCheckOk();
          serverCheckOk = true;
          return true;
        } catch {
          if (i < 2) await new Promise(r => setTimeout(r, 3000));
        }
      }
      serverCheckOk = false;
      return false;
    } finally {
      checkingServer = false;
    }
  }

  async function processSyncQueue() {
    if (syncingInProgress) return;
    const queue = getSyncQueue();
    if (queue.length === 0) return;
    syncingInProgress = true;
    pendingSyncCount = queue.length;

    for (const entry of queue) {
      if (!$currentUser?.id) break;
      try {
        const res = await gradesApi.submitMine({
          subject: 'Algoritmos - Parcial 1',
          score: entry.score,
          max_score: entry.maxScore,
          period: '2026-3',
          comments: entry.comments,
          submittedAt: entry.createdAt || Date.now()
        });
        const grade = res.grade || res;
        if (grade && grade._id && entry.examData) {
          await gradesApi.updateMine(grade._id, { examData: entry.examData });
        }
        removeFromSyncQueue(entry.createdAt);
        pendingSyncCount--;
      } catch {
        break;
      }
    }
    syncingInProgress = false;
    pendingSyncCount = getSyncQueue().length;
    if (pendingSyncCount > 0) loadServerAttempts();
  }

  async function attemptSubmitWithRetry(maxRetries = 3): Promise<{ success: boolean; gradeId?: string; error?: string; dfdSuccess?: boolean; dfdError?: string }> {
    const attemptNumLocal = getAttemptCount() + 1;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const mcCount = questions.filter(q => q.type !== 'file').length;
        const res = await gradesApi.submitMine({
          subject: 'Algoritmos - Parcial 1',
          score: finalScore,
          max_score: questions.length,
          period: '2026-3',
          comments: `${getAttemptLabel(attemptNumLocal)} | MC: ${finalScore}/${mcCount} | DFDs: ${Object.values(uploadedFileNames).join(', ') || 'No subidos'} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(TOTAL_TIME - timeLeft)}`,
          submittedAt: Date.now()
        });
        const grade = res.grade || res;
        if (grade && grade._id) {
          try {
            const examDataForServer = buildExamData(attemptNumLocal, tabSwitchCount, TOTAL_TIME - timeLeft, questions, answers, uploadedFileNames);
            await gradesApi.updateMine(grade._id, { examData: JSON.stringify(examDataForServer) });
          } catch {}
          // Subida DFD independiente: no bloquea la nota; si falla se puede reintentar desde la pantalla final
          let dfdSuccess = true;
          let dfdError: string | undefined;
          if (Object.keys(uploadedFiles).length > 0) {
            const up = await uploadDfdFile(grade._id);
            dfdSuccess = up.success;
            dfdError = up.error;
          }
          return { success: true, gradeId: grade._id, dfdSuccess, dfdError };
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error de conexión';
        if (i < maxRetries - 1) {
          await new Promise(r => setTimeout(r, 3000 * (i + 1)));
        } else {
          return { success: false, error: msg };
        }
      }
    }
    return { success: false, error: 'No se pudo conectar después de varios intentos' };
  }

  async function retrySave() {
    saveError = '';
    dfdUploadError = '';
    saveSuccess = false;
    isSaving = true;
    const result = await attemptSubmitWithRetry(3);
    isSaving = false;
    if (result.success) {
      saveSuccess = true;
      lastGradeId = result.gradeId;
      const localList = getLocalAttempts();
      if (localList.length > 0) {
        localList[localList.length - 1].gradeId = result.gradeId;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localList));
      }
      if (result.dfdSuccess === false) {
        dfdUploadError = result.dfdError || 'La nota se guardó, pero los DFD fallaron. Usa "Reintentar subida DFD".';
      }
      await loadServerAttempts();
    } else {
      saveError = result.error || 'Error al guardar';
    }
  }

  async function handleSubmit() {
    saveError = '';
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const score = calculateScore(questions, answers);
    mcTotal = questions.filter(q => q.type !== 'file').length;
    const res: Record<number, { correct: boolean; userAnswer: any; correctAnswer: any }> = {};

    for (const q of questions) {
      if (q.type === 'file') {
        res[q.id] = { correct: !!uploadedFileNames[String(q.id)], userAnswer: uploadedFileNames[String(q.id)] || null, correctAnswer: null };
        continue;
      }
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.answer;
      res[q.id] = { correct: isCorrect, userAnswer, correctAnswer: q.answer };
    }

    finalScore = score;
    results = res;
    finished = true;

    const attemptNum = getAttemptCount() + 1;
    const localRecord = { date: new Date().toISOString(), score, total: questions.length, mcScore: score, mcTotal, tabSwitches: tabSwitchCount, timeUsed: TOTAL_TIME - timeLeft, gradeId: undefined as string | undefined };
    const examData = buildExamData(attemptNum, tabSwitchCount, TOTAL_TIME - timeLeft, questions, answers, uploadedFileNames);

    let gradeId: string | undefined;
    if ($currentUser?.id) {
      isSaving = true;
      const result = await attemptSubmitWithRetry(3);
      isSaving = false;
      if (result.success) {
        gradeId = result.gradeId;
        lastGradeId = result.gradeId;
        localRecord.gradeId = result.gradeId;
        saveSuccess = true;
        if (result.dfdSuccess === false) {
          dfdUploadError = `${result.dfdError || 'Falló la subida DFD'}. La nota sí quedó guardada: reintenta la subida abajo (no gasta intento).`;
        }
      } else {
        saveError = `No se pudo guardar en el servidor: ${result.error}. Las respuestas están guardadas localmente y se reintentará automáticamente.`;
        // Aunque falle la nota, intenta dejar los DFD subidos (quedan recuperables por estudiante/fecha)
        if (Object.keys(uploadedFiles).length > 0) {
          const up = await uploadDfdFile(undefined);
          if (!up.success) dfdUploadError = `${up.error || 'Falló la subida DFD'}. Guarda tus .dfd y reintenta hoy.`;
        }
        addToSyncQueue({
          score,
          maxScore: questions.length,
          comments: `${getAttemptLabel(attemptNum)} | MC: ${score}/${mcTotal} | DFDs: ${Object.values(uploadedFileNames).join(', ') || 'No subidos'} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(TOTAL_TIME - timeLeft)}`,
          examData: JSON.stringify(examData)
        });
      }
    }

    const localList = getLocalAttempts();
    localList.push(localRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localList));
    if (gradeId) await loadServerAttempts();

    clearSavedAnswers();
  }

  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', handleVisibility);
    }
  });
</script>

<svelte:head>
  <title>Parcial 1 - Algoritmos</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/algoritmos')}>
    <span>←</span> Volver a Algoritmos
  </button>
  {#if !started && !finished}
    <div class="welcome-screen">
      <div class="welcome-card">
        <div class="welcome-icon">📋</div>
        <h1>Parcial 1 - Algoritmos</h1>
        <p class="welcome-subtitle">Niveles 1, 2 y 3 — Teoría + Ejercicios DFD</p>

        <div class="attempts-section">
          <h2>🎯 Intentos disponibles</h2>
          <p class="attempts-info">
            {#if isUnlimited}
              Dispones de <strong>intentos ilimitados</strong> como coordinador.
            {:else}
              Dispones de <strong>2 intentos</strong> en total: <strong>Intento 1 de Preparación</strong> e <strong>Intento 2 de Evaluación</strong>.
            {/if}
          </p>
          <div class="attempts-grid">
            <div class="attempt-card {isUnlimited || getAttemptCount() < 1 ? 'available' : 'used'}">
              <div class="attempt-number">{getAttemptLabel(1)}</div>
              <div class="attempt-type-badge prep">Preparación</div>
              <div class="attempt-status">
                {#if isUnlimited || getAttemptCount() < 1}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="used-badge">✓ Utilizado</span>
                {/if}
              </div>
            </div>
            <div class="attempt-card {isUnlimited || getAttemptCount() < 2 ? 'available' : 'used'}">
              <div class="attempt-number">{getAttemptLabel(2)}</div>
              <div class="attempt-type-badge eval">Evaluación</div>
              <div class="attempt-status">
                {#if isUnlimited || getAttemptCount() < 2}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="used-badge">✓ Utilizado</span>
                {/if}
              </div>
            </div>
          </div>
          {#if !isUnlimited}
          <div class="window-info">
            <strong>📅 Ventana única (Intentos 1-2):</strong> Lunes 19 y martes 20 de octubre, todo el día<br>
            <strong>📝 20 preguntas:</strong> 15 teóricas (5 por nivel) + 5 ejercicios prácticos DFD · <strong>⏱ 2 horas</strong>
          </div>
          {/if}
        </div>

        {#if serverGrades.length > 0}
          <div class="previous-attempts">
            <h2>📊 Intentos anteriores</h2>
            {#each serverGrades as g, i}
              <div class="attempt-history-item">
                <span class="attempt-label">{getAttemptLabel(i + 1)}</span>
                <span class="attempt-meta">{new Date(g.createdAt || g.date).toLocaleString('es-CO')}</span>
                <span class="attempt-meta">Puntaje: {g.score}/{g.max_score}</span>
                <span class="attempt-meta">{(g.comments || '').split('|')[0] || ''}</span>
              </div>
            {/each}
          </div>
        {/if}

        {#if loadingServer}
          <p class="loading-text">Cargando datos del servidor...</p>
        {:else if slots.remaining > 0}
          <div class="recommendations">
            <h2>📌 Recomendaciones importantes</h2>
            <ul>
              <li>
                <strong>⏱ Tiempo límite:</strong> Dispondrás de <strong>2 horas (120 minutos)</strong> para completar las 20 preguntas
                (15 teóricas + 5 prácticas), contadas desde que inicies el intento. El examen se enviará automáticamente al cumplirse el tiempo.
              </li>
              <li>
                <strong>📝 Parte 1 — Teóricas (15 preguntas):</strong> Selección única sobre los 3 niveles:
                Operadores, Condicionales y Ciclos. Corrección automática al finalizar.
              </li>
              <li>
                <strong>📐 Parte 2 — Prácticas DFD (5 ejercicios):</strong> Resuelve cada ejercicio en el
                <a href="/algoritmos/dfd" target="_blank" rel="noopener">Editor de DFD</a> y sube el archivo <code>.dfd</code>
                (máximo 2 MB) desde tu computador. Serán revisados por el docente.
              </li>
              <li>
                <strong>✅ Corrección automática (teóricas):</strong> Al finalizar verás de inmediato tu resultado en la parte teórica.
              </li>
              <li>
                <strong>🚫 Sin consultas externas:</strong> No está permitido cambiar de pestaña o ventana para consultar
                en Google u otros recursos. El sistema detectará los cambios de pestaña.
              </li>
              <li>
                <strong>✅ Navegación secuencial:</strong> Debes responder cada pregunta para poder avanzar a la siguiente.
                Puedes volver atrás con el botón Anterior.
              </li>
              <li>
                <strong>💾 Auto-guardado:</strong> Tus respuestas se guardan automáticamente al responder cada pregunta.
                Si cierras el examen sin terminar, podrás retomarlo (los .dfd deberás seleccionarlos de nuevo).
              </li>
            </ul>
          </div>

          {#if checkingServer}
            <p class="server-check">Verificando conexión con el servidor...</p>
          {:else if !isUnlimited && !serverCheckOk && getAttemptCount() === 0}
            <p class="server-warning">⚠ No se pudo verificar el servidor. Si continúas, las respuestas se guardarán localmente.</p>
          {/if}

          {#if pendingSyncCount > 0}
            <div class="sync-notice">
              ⏳ Tienes <strong>{pendingSyncCount} intento(s)</strong> pendiente(s) por sincronizar.
              <button onclick={processSyncQueue} disabled={syncingInProgress} class="sync-btn">
                {syncingInProgress ? 'Sincronizando...' : 'Sincronizar ahora'}
              </button>
            </div>
          {/if}

          <button onclick={startExam} class="start-btn" disabled={checkingServer}>
            {checkingServer ? 'Verificando...' : (getAttemptCount() === 0 ? 'Comenzar Parcial' : `Iniciar ${getAttemptLabel(getAttemptCount() + 1)}`)}
          </button>
        {:else}
          <div class="no-attempts">
            <p>Has completado todos los intentos de este parcial. Si necesitas una revisión, contacta a tu docente.</p>
          </div>
          <a href="/" class="back-btn">Volver al Inicio</a>
        {/if}
      </div>
    </div>

  {:else if finished}
    <div class="finish-screen">
      <div class="finish-card">
        <div class="finish-icon">✅</div>
        <h1>{getAttemptLabel(currentAttemptNumber)} — Finalizado</h1>
        {#if tabSwitchCount > 0}
          <p class="tab-warning">
            ⚠ Se detectaron {tabSwitchCount} cambio(s) de pestaña durante el examen.
          </p>
        {/if}
        <p class="finish-info">Has completado el Parcial 1 de Algoritmos.</p>

        <div class="score-section">
          <div class="score-card">
            <div class="score-value">{finalScore}/{mcTotal}</div>
            <div class="score-label">Teóricas (selección única)</div>
            <div class="score-status auto">✓ Corregido automáticamente</div>
          </div>
          <div class="score-card">
            <div class="score-value">{Object.keys(uploadedFileNames).length}/{questions.filter(q => q.type === 'file').length}</div>
            <div class="score-label">Ejercicios DFD subidos</div>
            <div class="score-status pending">⏳ Revisión docente</div>
          </div>
        </div>

        {#if saveSuccess}
          <div class="save-success">✅ Calificación guardada exitosamente en el servidor.</div>
        {/if}
        {#if saveError}
          <div class="save-error">⚠ {saveError}</div>
          <button onclick={retrySave} disabled={isSaving} class="retry-btn">
            {isSaving ? 'Guardando...' : '🔄 Reintentar guardado'}
          </button>
        {/if}
        {#if isSaving}
          <p class="save-note">Guardando calificación y subiendo archivos DFD...</p>
        {/if}

        {#if Object.keys(uploadedFileNames).length > 0}
          <div class="dfd-summary">
            <h2>📐 Archivos DFD</h2>
            {#each questions.filter(q => q.type === 'file') as q}
              <div class="review-item">
                <span class="review-num">Ejercicio {q.id}</span>
                {#if uploadedFileNames[String(q.id)]}
                  <span class="review-status pending-review">📄 {uploadedFileNames[String(q.id)]}</span>
                {:else}
                  <span class="review-status unanswered">— Sin subir</span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}

        {#if dfdUploadError}
          <div class="save-error">⚠ {dfdUploadError}</div>
          <button onclick={retryDfdUpload} disabled={isUploadingDfd} class="retry-btn">
            {isUploadingDfd ? 'Subiendo DFD...' : '📤 Reintentar subida DFD'}
          </button>
        {/if}

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">Preguntas respondidas</span>
            <span class="summary-value">{Object.keys(answers).length} / {examTotal}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Tiempo utilizado</span>
            <span class="summary-value">{formatTime(TOTAL_TIME - timeLeft)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Intentos restantes</span>
            <span class="summary-value">{slots.remaining}</span>
          </div>
        </div>

        <div class="answers-review">
          <h2>Detalle de respuestas</h2>
          {#each questions as q, i}
            <div class="review-item">
              <span class="review-num">Pregunta {i + 1}</span>
              {#if q.type === 'file'}
                {#if uploadedFileNames[String(q.id)]}
                  <span class="review-status pending-review">📐 Subido</span>
                {:else}
                  <span class="review-status unanswered">— Sin subir</span>
                {/if}
              {:else if results[q.id]?.correct}
                <span class="review-status correct">✓ Correcta</span>
              {:else if isQuestionAnswered(q.id)}
                <span class="review-status incorrect">✗ Incorrecta</span>
              {:else}
                <span class="review-status unanswered">— Sin responder</span>
              {/if}
            </div>
          {/each}
        </div>

        {#if slots.remaining > 0}
          <button onclick={() => { finished = false; started = false; }} class="start-btn" style="margin-bottom:0.75rem">
            Realizar {getAttemptLabel(getAttemptCount() + 1)}
          </button>
        {/if}
        <a href="/" class="back-btn">Volver al Inicio</a>
      </div>
    </div>

  {:else}
    <div class="exam-screen">
      <div class="exam-header">
        <div class="exam-header-left">
          <h1>{getAttemptLabel(currentAttemptNumber)}</h1>
          <span class="question-counter">
            {#if questions[currentIndex]?.type === 'file'}
              Ejercicio Práctico (Pregunta {currentIndex + 1} de {examTotal})
            {:else}
              Pregunta {currentIndex + 1} de {examTotal}
            {/if}
          </span>
        </div>
        <div class="exam-header-right">
          {#if tabSwitchCount > 0}
            <span class="tab-warning-badge">⚠ {tabSwitchCount} cambio(s)</span>
          {/if}
          <div class="timer {timeLeft <= 300 ? 'timer-warning' : ''}">
            <span class="timer-icon">⏱</span>
            <span class="timer-text">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="transform: scaleX({getProgressPercent() / 100})"></div>
      </div>

      <div class="exam-body">
  <div class="question-card">
          <div class="question-header">
            <span class="question-type-badge {questions[currentIndex]?.type === 'file' ? 'open' : 'mc'}">
              {questions[currentIndex]?.type === 'file' ? 'Ejercicio Práctico (DFD)' : 'Selección Múltiple'}
            </span>
            <span class="question-tema">{getLevelLabel(questions[currentIndex]?.tema)}</span>
          </div>

          {#if questions[currentIndex]?.type === 'file'}
            <div class="file-question-text">
              {@html questions[currentIndex].question.replace(/\n/g, '<br/>')}
            </div>
            <div class="file-upload-area">
              <div class="upload-instructions">
                <strong>📂 ¿Cómo responder?</strong>
                <ol>
                  <li>Abre el <a href="/algoritmos/dfd" target="_blank" rel="noopener">Editor de DFD</a>, resuelve el ejercicio y guarda tu archivo.</li>
                  <li>Sube aquí el archivo <code>.dfd</code> (máximo 2 MB).</li>
                </ol>
              </div>
              <label class="file-drop-zone {uploadedFileNames[String(questions[currentIndex].id)] ? 'has-file' : ''}">
                <input type="file" accept=".dfd" onchange={handleFileSelect} style="display:none" />
                {#if uploadedFileNames[String(questions[currentIndex].id)]}
                  <div class="file-selected">
                    <span class="file-icon">📄</span>
                    <span class="file-name">{uploadedFileNames[String(questions[currentIndex].id)]}</span>
                    <span class="file-check">✅</span>
                  </div>
                  <p class="file-hint">Haz clic para cambiar el archivo</p>
                {:else}
                  <div class="file-prompt">
                    <span class="upload-icon">📤</span>
                    <p><strong>Haz clic para seleccionar tu archivo .dfd</strong></p>
                    <p class="file-hint">Máximo 2 MB · Solo archivos .dfd</p>
                  </div>
                {/if}
              </label>
              {#if uploadErrors[String(questions[currentIndex].id)]}
                <div class="upload-error">❌ {uploadErrors[String(questions[currentIndex].id)]}</div>
              {/if}
            </div>
          {:else}
            <p class="question-text">{questions[currentIndex]?.question}</p>
            <div class="options">
              {#each questions[currentIndex].options as option, optIndex}
                <label class="option-label {answers[questions[currentIndex]?.id] === optIndex ? 'selected' : ''}">
                  <input
                    type="radio"
                    name="question-{questions[currentIndex]?.id}"
                    value={optIndex}
                    checked={answers[questions[currentIndex]?.id] === optIndex}
                    onchange={() => handleAnswer(optIndex)}
                  />
                  <span class="option-text">{option}</span>
                </label>
              {/each}
            </div>
          {/if}
        </div>

        <div class="exam-actions">
          <button
            class="nav-btn"
            onclick={() => goToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            ← Anterior
          </button>

          {#if currentIndex < examTotal - 1}
            <button
              class="nav-btn"
              onclick={() => goToQuestion(currentIndex + 1)}
              disabled={!isQuestionAnswered(questions[currentIndex]?.id)}
            >
              Siguiente →
            </button>
          {:else}
            <button class="submit-btn" onclick={handleSubmit}>
              Finalizar {getAttemptType(currentAttemptNumber)}
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .page {
    padding: 1rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .welcome-screen, .finish-screen {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 1rem;
  }

  .welcome-card, .finish-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 680px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  }

  .welcome-icon, .finish-icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 0.75rem;
  }

  .welcome-card h1, .finish-card h1 {
    font-size: 1.6rem;
    text-align: center;
    margin: 0 0 0.25rem;
  }

  .welcome-subtitle {
    text-align: center;
    color: #888;
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
  }

  .attempts-section {
    margin-bottom: 1.5rem;
  }

  .attempts-section h2 {
    font-size: 1.05rem;
    margin: 0 0 0.5rem;
  }

  .attempts-info {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 1rem;
  }

  .attempts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  .attempt-card {
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    padding: 0.75rem;
    text-align: center;
    background: #f9fafb;
  }

  .attempt-card.available {
    border-color: #22c55e;
    background: #f0fdf4;
  }

  .attempt-card.used {
    border-color: #e5e7eb;
    background: #f3f4f6;
    opacity: 0.7;
  }

  .attempt-number {
    font-size: 0.82rem;
    font-weight: 700;
    color: #444;
    margin-bottom: 0.2rem;
  }

  .attempt-type-badge {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.1rem 0.45rem;
    border-radius: 10px;
    display: inline-block;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .attempt-type-badge.prep {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .attempt-type-badge.eval {
    background: #dcfce7;
    color: #16a34a;
  }

  .attempt-status {
    font-size: 0.72rem;
    font-weight: 600;
  }

  .ready-badge {
    color: #16a34a;
  }

  .used-badge {
    color: #4b5563;
  }

  .window-info {
    font-size: 0.8rem;
    color: #888;
    line-height: 1.6;
    background: #f8fafc;
    padding: 0.6rem 0.85rem;
    border-radius: 8px;
  }

  .previous-attempts {
    margin-bottom: 1.5rem;
  }

  .previous-attempts h2 {
    font-size: 1rem;
    margin: 0 0 0.6rem;
  }

  .attempt-history-item {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.45rem 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.82rem;
    flex-wrap: wrap;
  }

  .attempt-label {
    font-weight: 700;
    color: #444;
    min-width: 80px;
  }

  .attempt-meta {
    color: #888;
  }

  .no-attempts {
    text-align: center;
    padding: 2rem;
    color: #dc2626;
    font-weight: 600;
    background: #fef2f2;
    border-radius: 10px;
    margin-bottom: 1rem;
  }

  .recommendations {
    background: #f0f7ff;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-top: 2px solid var(--cat-color, #e2e8f0);
  }

  .recommendations h2 {
    font-size: 1.05rem;
    margin: 0 0 1rem;
    color: var(--color-theme-1, #3b82f6);
  }

  .recommendations ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .recommendations li {
    font-size: 0.92rem;
    line-height: 1.5;
    color: #444;
    padding-left: 0.25rem;
  }

  .start-btn, .back-btn {
    display: block;
    width: 100%;
    padding: 1rem;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
    text-align: center;
    text-decoration: none;
  }

  .start-btn:hover, .back-btn:hover {
    opacity: 0.9;
  }

  .exam-screen {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .exam-header-left h1 {
    font-size: 1.3rem;
    margin: 0;
  }

  .question-counter {
    font-size: 0.85rem;
    color: #888;
  }

  .exam-header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .tab-warning-badge {
    background: #fef3c7;
    color: #92400e;
    padding: 0.3rem 0.65rem;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
  }

  .timer {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: #f0fdf4;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1.1rem;
    font-variant-numeric: tabular-nums;
  }

  .timer-warning {
    background: #fef2f2;
    color: #dc2626;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .timer-icon {
    font-size: 1.1rem;
  }

  .progress-bar-container {
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    width: 100%;
    background: var(--color-theme-1, #3b82f6);
    border-radius: 3px;
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  .exam-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

.question-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 14px;
    padding: 2rem;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    flex: 1;
  }

  .question-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }

  .question-type-badge {
    padding: 0.25rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .question-type-badge.mc {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .question-type-badge.open {
    background: #fef3c7;
    color: #92400e;
  }

  .question-tema {
    font-size: 0.78rem;
    color: #888;
    font-weight: 600;
  }

  .question-text {
    font-size: 1.05rem;
    line-height: 1.6;
    color: #1f2937;
    margin: 0 0 1.5rem;
    font-weight: 500;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .option-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .option-label:hover {
    border-color: #93c5fd;
    background: #f8fafc;
  }

  .option-label.selected {
    border-color: var(--color-theme-1, #3b82f6);
    background: #eff6ff;
  }

  .option-label input[type="radio"] {
    margin-top: 0.15rem;
    accent-color: var(--color-theme-1, #3b82f6);
  }

  .option-text {
    flex: 1;
  }

  .exam-actions {
    display: flex;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .nav-btn {
    padding: 0.7rem 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    background: white;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #444;
  }

  .nav-btn:hover:not(:disabled) {
    border-color: var(--color-theme-1, #3b82f6);
    color: var(--color-theme-1, #3b82f6);
  }

  .nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .submit-btn {
    padding: 0.7rem 1.5rem;
    background: #16a34a;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .submit-btn:hover {
    opacity: 0.9;
  }

  .finish-card {
    text-align: center;
  }

  .tab-warning {
    background: #fef3c7;
    color: #92400e;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.9rem;
    margin: 1rem 0;
  }

  .finish-info {
    color: #666;
    margin: 0.5rem 0 1.5rem;
  }

  .save-error {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
  }

  .summary {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .summary-label {
    font-size: 0.82rem;
    color: #888;
    font-weight: 600;
  }

  .summary-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1f2937;
  }

  .answers-review {
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .answers-review h2 {
    font-size: 1rem;
    margin: 0 0 0.75rem;
  }

  .review-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.88rem;
  }

  .review-num {
    font-weight: 600;
    color: #444;
  }

  .review-status {
    font-weight: 600;
  }

  .score-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .score-card {
    background: #f8fafc;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    text-align: center;
    flex: 1;
    min-width: 180px;
    max-width: 260px;
  }

  .score-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-theme-1, #3b82f6);
  }

  .score-label {
    font-size: 0.85rem;
    color: #666;
    font-weight: 600;
    margin: 0.25rem 0 0.5rem;
  }

  .score-status {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    display: inline-block;
  }

  .score-status.auto {
    background: #dcfce7;
    color: #16a34a;
  }

  .score-status.pending {
    background: #fef3c7;
    color: #92400e;
  }

  .review-status.unanswered {
    color: #4b5563;
  }

  .review-status.correct {
    color: #16a34a;
  }

  .review-status.incorrect {
    color: #dc2626;
  }

  .review-status.pending-review {
    color: #d97706;
  }

  @media (max-width: 600px) {
    .welcome-card, .finish-card {
      padding: 1.25rem;
    }

    .welcome-card h1, .finish-card h1 {
      font-size: 1.2rem;
    }

    .attempts-grid {
      grid-template-columns: 1fr;
    }

    .attempt-card {
      padding: 0.5rem;
    }

    .attempt-number {
      font-size: 0.75rem;
    }

    .exam-header {
      flex-direction: column;
      align-items: stretch;
    }

    .exam-header-right {
      justify-content: space-between;
    }

    .exam-header-left h1 {
      font-size: 1.1rem;
    }

    .timer {
      font-size: 0.95rem;
      padding: 0.4rem 0.75rem;
    }

    .question-card {
      padding: 1rem;
    }

    .question-text {
      font-size: 0.95rem;
    }

    .option-label {
      padding: 0.65rem 0.85rem;
      font-size: 0.88rem;
    }

    .exam-actions {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .exam-actions .nav-btn,
    .exam-actions .submit-btn {
      flex: 1;
      min-width: 0;
      text-align: center;
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
    }

    .exam-actions .submit-btn {
      width: 100%;
    }

    .score-section {
      flex-direction: column;
      align-items: stretch;
    }

    .score-card {
      min-width: 0;
      max-width: none;
    }

    .score-value {
      font-size: 1.5rem;
    }

    .summary {
      gap: 1rem;
    }

    .summary-value {
      font-size: 1.1rem;
    }

    .recommendations {
      padding: 1rem;
    }

    .recommendations li {
      font-size: 0.85rem;
    }

    .previous-attempts {
      font-size: 0.82rem;
    }

    .attempt-history-item {
      font-size: 0.75rem;
      gap: 0.4rem;
    }

    .attempt-label {
      min-width: 60px;
    }

    .window-info {
      font-size: 0.72rem;
    }

    .tab-warning-badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
    }
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.82rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
    transition: border-color 0.2s ease, transform 0.15s ease;
  }

  .back-btn:hover {
    color: var(--color-text-primary);
    border-color: var(--color-accent);
    transform: translateX(-3px);
  }

  .back-btn:active {
    transform: scale(0.96);
  }

  .server-check, .server-warning {
    text-align: center;
    padding: 0.6rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .server-check { background: #eff6ff; color: #1d4ed8; }
  .server-warning { background: #fef3c7; color: #92400e; }

  .sync-notice {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: #fefce8;
    border: 1px solid #fde68a;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .sync-btn {
    padding: 0.4rem 0.85rem;
    background: #1d4ed8;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .sync-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .save-success {
    background: #f0fdf4;
    border: 1px solid #86efac;
    color: #16a34a;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
  }

  .retry-btn {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: opacity 0.2s;
  }

  .retry-btn:hover { opacity: 0.9; }
  .retry-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .start-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .save-note {
    font-size: 0.85rem;
    color: #6b7280;
    text-align: center;
    margin: 0.25rem 0 1rem;
  }

  .dfd-summary {
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .dfd-summary h2 {
    font-size: 1rem;
    margin: 0 0 0.75rem;
    color: #374151;
  }

  .file-question-text {
    font-size: 1rem;
    line-height: 1.7;
    color: #1f2937;
    background: #f8fafc;
    border-left: 4px solid #2563eb;
    padding: 1rem 1.15rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: left;
  }

  .file-upload-area {
    margin-top: 1rem;
  }

  .upload-instructions {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 0.85rem 1rem;
    font-size: 0.88rem;
    color: #1e40af;
    text-align: left;
    margin-bottom: 0.85rem;
  }

  .upload-instructions ol {
    margin: 0.4rem 0 0;
    padding-left: 1.2rem;
    line-height: 1.6;
  }

  .upload-instructions a {
    color: #1d4ed8;
    font-weight: 600;
  }

  .upload-instructions code {
    background: #dbeafe;
    padding: 0.05rem 0.35rem;
    border-radius: 4px;
    font-size: 0.82rem;
  }

  .file-drop-zone {
    display: block;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    background: #f9fafb;
    transition: border-color 0.2s, background 0.2s;
  }

  .file-drop-zone:hover {
    border-color: #2563eb;
    background: #eff6ff;
  }

  .file-drop-zone.has-file {
    border-color: #16a34a;
    background: #f0fdf4;
    border-style: solid;
  }

  .file-prompt p {
    margin: 0.25rem 0;
  }

  .upload-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.4rem;
  }

  .file-hint {
    font-size: 0.78rem;
    color: #6b7280;
    margin: 0.2rem 0 0;
  }

  .file-selected {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    font-weight: 600;
    color: #166534;
    flex-wrap: wrap;
  }

  .file-icon { font-size: 1.4rem; }
  .file-name { word-break: break-all; }
  .file-check { font-size: 1.1rem; }

  .upload-error {
    margin-top: 0.6rem;
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    border-radius: 8px;
    padding: 0.55rem 0.8rem;
    font-size: 0.85rem;
    font-weight: 600;
  }
</style>
