<script lang="ts">
  import { selectRandomQuestions } from '$lib/data/taller_algo';
  import { gradesApi, API_URL, apiUploadFile } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { isStrictAdmin, isTallerAlgoLockedFor, TALLER_ALGO_OPEN, TALLER_ALGO_CLOSE } from '$lib/guards/examLock';

  // Ventana 06/10 + extra 07/10 hasta medianoche (o admin). No borra historial.
  let tallerLocked = $derived(isTallerAlgoLockedFor($currentUser));
  $effect(() => {
    if (!$currentUser) { goto('/login'); return; }
    if (tallerLocked) goto('/algoritmos');
  });

  import {
    STORAGE_KEY, TOTAL_QUESTIONS, TOTAL_TIME,
    getAttemptLabel, formatTime, getProgressPercent,
    getAttemptCount, SYNC_QUEUE_KEY, getSyncQueue,
    addToSyncQueue, removeFromSyncQueue, setHealthCheckOk,
    isHealthCheckRecent, SAVED_ANSWERS_KEY, saveAnswersSnapshot,
    clearSavedAnswers, calculateScore, buildExamData, getLocalAttempts
  } from '$lib/exam_taller_algo';
  import { preloadedMyGrades } from '$lib/stores/preloaded';

  let started = $state(false);
  let finished = $state(false);
  let questions = $state<any[]>([]);
  let answers = $state<Record<string, any>>({});
  let currentIndex = $state(0);
  let timeLeft = $state(TOTAL_TIME);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let tabSwitchCount = $state(0);
  let finalScore = $state(0);
  let results = $state<Record<string, { correct: boolean }>>({});

  let currentAttemptNumber = $state(0);
  let serverAttempts = $state(0);
  let serverGrades = $state<any[]>([]);
  let loadingServer = $state(true);
  let saveError = $state('');
  let saveSuccess = $state(false);
  let isSaving = $state(false);
  let serverCheckOk = $state(false);
  let checkingServer = $state(false);
  let pendingSyncCount = $state(0);
  let syncingInProgress = $state(false);

  // File upload state (independiente del Grade: puede reintentarse sin gradeId)
  let uploadedFiles = $state<Record<string, File>>({});
  let uploadedFileNames = $state<Record<string, string>>({});
  let uploadStatuses = $state<Record<string, string>>({});
  let uploadErrors = $state<Record<string, string>>({});
  let lastGradeId = $state<string | undefined>(undefined);
  let dfdUploadError = $state('');
  let isUploadingDfd = $state(false);

  let isUnlimited = $derived($currentUser?.email === 'coordinacion@cinarsistemas.edu.co');

  // Exentos de DFD (ya presentaron Ej. 6 y 7 en clase): solo responden P1-P5 teóricas.
  const MCQ_ONLY_EMAILS = ['jd.reina@cinar.edu.co'];
  let isMcqOnly = $derived(MCQ_ONLY_EMAILS.includes(($currentUser?.email || '').toLowerCase()));
  let examTotal = $derived(questions.length > 0 ? questions.length : TOTAL_QUESTIONS);

  function getSlots() {
    const used = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer);
    // Reinicio 07/10: 2 intentos frescos (claves v2). Julian presenta hoy, Jairo retoma tarde/noche.
    const total = 2;
    return {
      total,
      used,
      remaining: Math.max(0, total - used),
      enabled: used < total
    };
  }
  let slots = $derived.by(() => getSlots());

  $effect(() => {
    if (timeLeft <= 0 && started && !finished) handleSubmit();
  });

  onMount(() => {
    loadServerAttempts();
    pendingSyncCount = getSyncQueue().length;
    checkBackendHealth();
  });

  $effect(() => {
    if ($currentUser) loadServerAttempts();
  });

  async function loadServerAttempts() {
    if (!$currentUser?.id) { loadingServer = false; return; }
    try {
      let all = $preloadedMyGrades;
      if (!all || all.length === 0) {
        all = await gradesApi.getMine();
        preloadedMyGrades.set(all);
      }
      const examGrades = all.filter((g: any) => g.subject === 'Algoritmos - Taller 1');
      serverGrades = examGrades;
      serverAttempts = examGrades.length;
    } catch {
      serverAttempts = getLocalAttempts().length;
    } finally {
      loadingServer = false;
    }
  }

  async function checkBackendHealth() {
    if (isHealthCheckRecent()) return true;
    checkingServer = true;
    const baseUrl = getHealthUrl();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      await fetch(baseUrl, { signal: controller.signal, mode: 'cors' });
      clearTimeout(timeout);
      setHealthCheckOk();
      serverCheckOk = true;
      return true;
    } catch {
      serverCheckOk = false;
      return false;
    } finally {
      checkingServer = false;
    }
  }

  async function startExam() {
    const healthy = await checkBackendHealth();
    if (!healthy) {
      const proceed = confirm('El servidor no responde. Las respuestas se guardarán localmente y se sincronizarán después. ¿Continuar?');
      if (!proceed) return;
    }

    const saved = (() => {
      try {
        const raw = localStorage.getItem(SAVED_ANSWERS_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    })();

    if (saved && saved.questions && saved.answers && Object.keys(saved.answers).length > 0) {
      const resume = confirm(`Tienes un taller en progreso (${Object.keys(saved.answers).length} respuestas). ¿Continuar?`);
      if (resume) {
        questions = saved.questions;
        answers = saved.answers;
        currentIndex = saved.currentIndex || 0;
        timeLeft = saved.timeLeft || TOTAL_TIME;
        tabSwitchCount = saved.tabSwitchCount || 0;
        if (saved.uploadedFileNames) uploadedFileNames = saved.uploadedFileNames;
        started = true;
        finished = false;
        currentAttemptNumber = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;
        timerInterval = setInterval(() => { timeLeft--; }, 1000);
        document.addEventListener('visibilitychange', handleVisibility);
        return;
      }
    }

    const picked = selectRandomQuestions();
    questions = isMcqOnly ? picked.filter((q) => q.type !== 'file') : picked;
    answers = {};
    currentIndex = 0;
    uploadedFiles = {};
    uploadedFileNames = {};
    uploadStatuses = {};
    uploadErrors = {};
    timeLeft = TOTAL_TIME;
    tabSwitchCount = 0;
    currentAttemptNumber = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;
    timerInterval = setInterval(() => { timeLeft--; }, 1000);
    document.addEventListener('visibilitychange', handleVisibility);
    started = true;
    finished = false;
  }

  function handleVisibility() {
    if (document.hidden && started && !finished) tabSwitchCount++;
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < examTotal) {
      const currentQ = questions[currentIndex];
      if (index > currentIndex) {
        if (currentQ?.type === 'file') {
          // File question: allow advancing if file is uploaded
          if (!uploadedFileNames[currentQ.id]) return;
        } else {
          if (answers[currentQ?.id] === undefined) return;
        }
      }
      currentIndex = index;
    }
  }

  function handleAnswer(value: any) {
    answers[questions[currentIndex].id] = value;
    autoSaveAnswers();
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    const qId = questions[currentIndex].id;
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
    // Mark this question as answered
    answers[qId] = 'file-selected';
    autoSaveAnswers();
  }

  async function uploadDfdFile(gradeId?: string) {
    if (Object.keys(uploadedFiles).length === 0) return { success: false, error: 'No hay archivos seleccionados. Vuelve a seleccionarlos (.dfd) e intenta de nuevo.' };

    let allSuccess = true;
    let firstError = '';
    const attemptNum = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;

    for (const [qId, file] of Object.entries(uploadedFiles)) {
      uploadStatuses[qId] = 'uploading';
      uploadErrors[qId] = '';
      // 3 intentos por archivo con backoff: Render free se duerme y el primer POST suele dar timeout
      let ok = false;
      let lastErr = '';
      for (let r = 0; r < 3 && !ok; r++) {
        try {
          await apiUploadFile('/dfd/upload', file, {
            examType: 'taller-1',
            period: '2026-3',
            attemptNumber: String(gradeId ? attemptNum : currentAttemptNumber || attemptNum),
            ...(gradeId || lastGradeId ? { gradeId: gradeId || lastGradeId } : {})
          });
          uploadStatuses[qId] = 'success';
          ok = true;
        } catch (err: any) {
          lastErr = err?.message || 'Error al subir el archivo';
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
      dfdUploadError = 'No hay archivos en memoria. Reabre el taller, selecciona de nuevo tus .dfd (preguntas 6 y 7) y reintenta. Tus archivos .dfd siguen en tu computador.';
      return;
    }
    isUploadingDfd = true;
    const res = await uploadDfdFile(lastGradeId);
    isUploadingDfd = false;
    if (!res.success) dfdUploadError = res.error || 'Error al subir DFDs';
  }

  function autoSaveAnswers() {
    if (!started || finished) return;
    saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount, uploadedFileNames);
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
          subject: 'Algoritmos - Taller 1',
          score: entry.score,
          max_score: entry.maxScore ?? TOTAL_QUESTIONS,
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
      } catch { break; }
    }
    syncingInProgress = false;
    pendingSyncCount = getSyncQueue().length;
    if (pendingSyncCount > 0) loadServerAttempts();
  }

  async function attemptSubmitWithRetry(maxRetries = 3) {
    const attemptNumLocal = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const mcTotal = questions.filter(q => q.type !== 'file').length;
        const dfdNote = isMcqOnly ? 'DFDs 6-7 presentados en clase (exento subida)' : `DFDs: ${Object.values(uploadedFileNames).join(', ') || 'No subidos'}`;
        const res = await gradesApi.submitMine({
          subject: 'Algoritmos - Taller 1',
          score: finalScore,
          max_score: questions.length,
          period: '2026-3',
          comments: `${getAttemptLabel(attemptNumLocal)} | MC: ${finalScore}/${mcTotal} | ${dfdNote} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(TOTAL_TIME - timeLeft)}`,
          submittedAt: Date.now()
        });
        const grade = res.grade || res;
        if (grade && grade._id) {
          const examDataForServer = buildExamData(attemptNumLocal, tabSwitchCount, TOTAL_TIME - timeLeft, questions, answers, uploadedFileNames);
          try {
            await gradesApi.updateMine(grade._id, { examData: JSON.stringify(examDataForServer) });
          } catch {}
          // Subida DFD independiente: no bloquea la nota. Si falla, queda reintentable desde la pantalla final.
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
        if (i < maxRetries - 1) await new Promise(r => setTimeout(r, 3000 * (i + 1)));
        else return { success: false, error: err instanceof Error ? err.message : 'Error de conexión' };
      }
    }
    return { success: false, error: 'No se pudo conectar' };
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
      if (result.dfdSuccess === false) {
        dfdUploadError = result.dfdError || 'La nota se guardó pero los DFDs fallaron. Usa “Reintentar subida DFD”.';
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

    let score = 0;
    const res: Record<string, { correct: boolean }> = {};

    for (const q of questions) {
      if (q.type === 'file') {
        res[q.id] = { correct: !!uploadedFileNames[q.id] };
        continue;
      }
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) score++;
      res[q.id] = { correct: isCorrect };
    }

    finalScore = score;
    results = res;
    finished = true;

    const attemptNum = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;
    const mcTotal = questions.filter(q => q.type !== 'file').length;
    const localRecord = { date: new Date().toISOString(), score, total: questions.length, tabSwitches: tabSwitchCount, timeUsed: TOTAL_TIME - timeLeft, gradeId: undefined as string | undefined };
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
          dfdUploadError = `${result.dfdError || 'Falló la subida DFD'}. La nota sí quedó guardada. Reintenta abajo sin perder el intento.`;
        }
      } else {
        saveError = `No se pudo guardar: ${result.error}. Las respuestas están guardadas localmente.`;
        // Aunque falle la nota, intenta dejar los DFDs subidos (quedan huérfanos pero recuperables por email/fecha).
        if (Object.keys(uploadedFiles).length > 0) {
          const up = await uploadDfdFile(undefined);
          if (!up.success) dfdUploadError = `${up.error || 'Falló subida DFD'}. Guarda tus .dfd, podrás re-subirlos hoy hasta medianoche.`;
        }
        addToSyncQueue({
          score, maxScore: questions.length,
          comments: `${getAttemptLabel(attemptNum)} | MC: ${score}/${mcTotal} | ${isMcqOnly ? 'DFDs 6-7 presentados en clase (exento subida)' : `DFDs: ${Object.values(uploadedFileNames).join(', ') || 'No subidos'}`} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(TOTAL_TIME - timeLeft)}`,
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
    if (timerInterval) clearInterval(timerInterval);
    if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', handleVisibility);
  });
</script>

<svelte:head>
  <title>Taller 1 - Algoritmos (Niveles 1 y 2)</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/algoritmos')}>
    <span>←</span> Volver a Algoritmos
  </button>

  {#if !started && !finished}
    <div class="welcome-screen">
      <div class="welcome-card">
        <div class="welcome-icon">📐</div>
        <h1>Taller 1 — Algoritmos</h1>
        <p class="welcome-subtitle">Diagramas de Flujo: Nivel 1 (Secuencial) y Nivel 2 (Condicionales)</p>

        <div class="attempts-section">
          <h2>🎯 Intentos disponibles</h2>
          <p class="attempts-info">
            {#if isUnlimited}
              Dispones de <strong>intentos ilimitados</strong> como coordinador.
            {:else}
              Dispones de <strong>2 intentos</strong> en total (reiniciados 07/10, hasta medianoche).
            {/if}
          </p>
          <div class="attempts-grid">
            <div class="attempt-card {getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) >= 1 ? 'used' : 'available'}">
              <div class="attempt-number">{getAttemptLabel(1)}</div>
              <div class="attempt-type-badge prep">Preparación</div>
              <div class="attempt-status">
                {#if isUnlimited || getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) < 1}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="used-badge">✓ Utilizado</span>
                {/if}
              </div>
            </div>
            <div class="attempt-card {getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) >= 2 ? 'used' : 'available'}">
              <div class="attempt-number">{getAttemptLabel(2)}</div>
              <div class="attempt-type-badge eval">Evaluación</div>
              <div class="attempt-status">
                {#if isUnlimited || getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) < 2}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="used-badge">✓ Utilizado</span>
                {/if}
              </div>
            </div>
          </div>
        </div>

        {#if serverGrades.length > 0}
          <div class="previous-attempts">
            <h2>📊 Intentos anteriores</h2>
            {#each serverGrades as g, i}
              <div class="attempt-history-item">
                <span class="attempt-label">{getAttemptLabel(i + 1)}</span>
                <span class="attempt-meta">{new Date(g.createdAt || g.date).toLocaleString('es-CO')}</span>
                <span class="attempt-meta">Puntaje: {g.score}/{g.max_score}</span>
              </div>
            {/each}
          </div>
        {/if}

        {#if loadingServer}
          <p class="loading-text">Cargando datos del servidor...</p>
        {:else if slots.remaining > 0}
          <div class="recommendations">
            <h2>📌 Instrucciones del Taller</h2>
            <ul>
              <li><strong>⏱ Tiempo límite:</strong> Dispones de <strong>90 minutos</strong> para completar el taller.</li>
              <li><strong>📝 Parte 1 — Selección múltiple (5 preguntas):</strong> Preguntas sobre algoritmos de Nivel 1 (secuencial) y Nivel 2 (condicionales). Corrección automática.</li>
              {#if isMcqOnly}
                <li><strong>✅ Solo teoría:</strong> Tus ejercicios DFD (6 y 7) ya fueron presentados en clase. Solo respondes las 5 teóricas, sobre 5 puntos.</li>
              {:else}
                <li><strong>📐 Parte 2 — Ejercicio Práctico DFD (2 ejercicios):</strong> Deberás resolver dos ejercicios (uno de cada nivel) en el editor de DFD y <strong>subir los archivos .dfd</strong> correspondientes desde tu computador.</li>
              {/if}
              <li><strong>🚫 Sin consultas externas:</strong> No está permitido cambiar de pestaña durante el examen.</li>
              <li><strong>📁 Archivo .dfd:</strong> Asegúrate de guardar tus diagramas antes de subirlos. Solo se acepta formato <code>.dfd</code>.</li>
            </ul>
          </div>

          {#if pendingSyncCount > 0}
            <div class="sync-notice">
              ⏳ Tienes <strong>{pendingSyncCount} intento(s)</strong> pendiente(s) por sincronizar.
              <button onclick={processSyncQueue} disabled={syncingInProgress} class="sync-btn">
                {syncingInProgress ? 'Sincronizando...' : 'Sincronizar ahora'}
              </button>
            </div>
          {/if}

          <button onclick={startExam} class="start-btn" disabled={checkingServer}>
            {checkingServer ? 'Verificando...' : (getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) === 0 ? 'Comenzar Taller' : `Iniciar ${getAttemptLabel(getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1)}`)}
          </button>
        {:else}
          <div class="no-attempts">
            <p>Has completado todos tus intentos para este taller.</p>
          </div>
        {/if}
      </div>
    </div>

  {:else if finished}
    <div class="finish-screen">
      <div class="finish-card">
        <div class="finish-icon">✅</div>
        <h1>{getAttemptLabel(currentAttemptNumber)} — Finalizado</h1>
        {#if tabSwitchCount > 0}
          <p class="tab-warning">⚠ Se detectaron {tabSwitchCount} cambio(s) de pestaña.</p>
        {/if}

        <div class="score-section">
          <div class="score-card">
            <div class="score-value">{finalScore}/{questions.filter(q => q.type !== 'file').length}</div>
            <div class="score-label">Selección Múltiple</div>
          </div>
          <div class="score-card">
            <div class="score-value">{Object.keys(uploadedFileNames).length === questions.filter(q => q.type === 'file').length ? '✅' : '❌'}</div>
            <div class="score-label">Archivos DFD</div>
          </div>
        </div>

        {#if saveSuccess}
          <div class="save-success">✅ Calificación guardada exitosamente.</div>
        {/if}
        {#if isSaving}
          <div class="save-progress">
            <div class="spinner"></div>
            <span>Guardando calificación y subiendo archivos DFD (6 y 7)...</span>
          </div>
        {/if}
        {#if saveError}
          <div class="save-error">⚠ {saveError}</div>
          <button onclick={retrySave} disabled={isSaving} class="retry-btn">
            {isSaving ? 'Guardando...' : '🔄 Reintentar guardado'}
          </button>
        {/if}
        {#if dfdUploadError}
          <div class="save-error">📐 {dfdUploadError}</div>
        {/if}
        {#if Object.keys(uploadedFileNames).length > 0}
          <div class="summary" style="margin-bottom:1rem">
            {#each Object.entries(uploadStatuses) as [qid, st]}
              <div class="summary-item">
                <span class="summary-label">Pregunta {qid} — {uploadedFileNames[qid] || ''}</span>
                <span class="summary-value">{st === 'success' ? '✅ Subido' : st === 'uploading' || isUploadingDfd ? '⏳ Subiendo...' : '❌ Pendiente'}</span>
                {#if uploadErrors[qid]}<span class="summary-label">{uploadErrors[qid]}</span>{/if}
              </div>
            {/each}
          </div>
          <button onclick={retryDfdUpload} disabled={isUploadingDfd || isSaving} class="retry-btn" style="background:#6366f1">
            {isUploadingDfd ? 'Subiendo DFDs...' : '📐 Reintentar subida DFD (no gasta intento)'}
          </button>
        {/if}

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">Tiempo utilizado</span>
            <span class="summary-value">{formatTime(TOTAL_TIME - timeLeft)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Archivos subidos</span>
            <span class="summary-value">{Object.values(uploadedFileNames).join(', ') || 'Ninguno'}</span>
          </div>
        </div>

        {#if slots.remaining > 0}
          <button onclick={() => { finished = false; }} class="start-btn" style="margin-bottom:0.75rem">
            Realizar {getAttemptLabel(getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1)}
          </button>
        {/if}
        <a href="/algoritmos" class="back-btn" style="text-decoration:none; margin-top:0.5rem">Volver al Menú</a>
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
            <span class="tab-warning-badge">⚠ {tabSwitchCount}</span>
          {/if}
          <div class="timer {timeLeft <= 300 ? 'timer-warning' : ''}">
            <span class="timer-icon">⏱</span>
            <span class="timer-text">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="transform: scaleX({((Object.keys(answers).length / examTotal))})"></div>
      </div>

      <div class="exam-body">
        {#if questions[currentIndex]?.type === 'file'}
          <!-- Ejercicio práctico: subir archivo .dfd -->
          <div class="question-card file-question">
            <div class="file-question-header">
              <span class="file-badge">📐 Ejercicio Práctico</span>
            </div>
            <div class="file-question-text">
              {@html questions[currentIndex].question.replace(/\n/g, '<br/>')}
            </div>
            
            <div class="file-upload-area">
              <div class="upload-instructions">
                <p>📂 <strong>Instrucciones:</strong></p>
                <ol>
                  <li>Abre el <a href="/algoritmos/dfd" target="_blank" rel="noopener">Editor de DFD</a> y resuelve el ejercicio que prefieras (Opción A o B).</li>
                  <li>Guarda el diagrama desde el editor (Menú → Guardar .dfd).</li>
                  <li>Sube el archivo <code>.dfd</code> aquí abajo.</li>
                </ol>
              </div>

              <label class="file-drop-zone {uploadedFileNames[questions[currentIndex].id] ? 'has-file' : ''}">
                <input
                  type="file"
                  accept=".dfd"
                  onchange={handleFileSelect}
                  style="display:none"
                />
                {#if uploadedFileNames[questions[currentIndex].id]}
                  <div class="file-selected">
                    <span class="file-icon">📄</span>
                    <span class="file-name">{uploadedFileNames[questions[currentIndex].id]}</span>
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

              {#if uploadErrors[questions[currentIndex].id]}
                <div class="upload-error">❌ {uploadErrors[questions[currentIndex].id]}</div>
              {/if}
            </div>
          </div>
        {:else}
          <!-- Pregunta de selección múltiple -->
          <div class="question-card">
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
          </div>
        {/if}

        <div class="exam-actions">
          <button class="nav-btn" onclick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}>← Anterior</button>
          {#if currentIndex < examTotal - 1}
            {#if questions[currentIndex]?.type === 'file'}
              <button class="nav-btn" onclick={() => goToQuestion(currentIndex + 1)} disabled={!uploadedFileNames[questions[currentIndex].id]}>Siguiente →</button>
            {:else}
              <button class="nav-btn" onclick={() => goToQuestion(currentIndex + 1)} disabled={answers[questions[currentIndex]?.id] === undefined}>Siguiente →</button>
            {/if}
          {:else}
            <button class="submit-btn" onclick={handleSubmit}>Finalizar Taller</button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .page { padding: 1rem 0; flex: 1; display: flex; flex-direction: column; max-width: 800px; margin: 0 auto; width: 100%; }
  .back-btn { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--color-theme-1, #10B981); background: none; border: none; padding: 0; cursor: pointer; font-weight: 600; margin-bottom: 1rem; transition: opacity 0.2s; }
  .back-btn:hover { opacity: 0.8; }
  .welcome-screen, .finish-screen { flex: 1; display: flex; justify-content: center; align-items: flex-start; padding-top: 1rem; }
  .welcome-card, .finish-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 680px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); }
  .welcome-icon, .finish-icon { font-size: 3rem; text-align: center; margin-bottom: 0.75rem; }
  .welcome-card h1, .finish-card h1 { font-size: 1.6rem; text-align: center; margin: 0 0 0.25rem; }
  .welcome-subtitle { text-align: center; color: #888; margin: 0 0 1.5rem; font-size: 0.95rem; }
  .attempts-section { margin-bottom: 1.5rem; }
  .attempts-section h2 { font-size: 1.1rem; margin: 0 0 0.5rem; color: #333; }
  .attempts-info { font-size: 0.9rem; color: #555; margin: 0 0 1rem; }
  .attempts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
  .attempt-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .attempt-card.available { border-color: #93c5fd; background: #eff6ff; }
  .attempt-card.used { opacity: 0.6; }
  .attempt-number { font-weight: 700; font-size: 0.95rem; color: #1e293b; }
  .attempt-type-badge { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 12px; }
  .prep { background: #e0e7ff; color: #4338ca; }
  .eval { background: #ffedd5; color: #c2410c; }
  .ready-badge { color: #2563eb; font-weight: 700; font-size: 0.8rem; }
  .used-badge { color: #16a34a; font-weight: 700; font-size: 0.8rem; }
  .start-btn { width: 100%; padding: 1rem; background: #10B981; color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .start-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
  .start-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .recommendations { background: #f8fafc; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .recommendations h2 { font-size: 1.1rem; margin: 0 0 1rem; color: #333; }
  .recommendations ul { margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #444; }
  .recommendations li { margin-bottom: 0.5rem; line-height: 1.5; }
  .recommendations code { background: #e2e8f0; padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.85rem; }
  .exam-screen { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem; }
  .exam-header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 1.25rem 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .exam-header-left h1 { font-size: 1.2rem; margin: 0 0 0.2rem; }
  .question-counter { font-size: 0.85rem; color: #64748b; font-weight: 600; }
  .exam-header-right { display: flex; align-items: center; gap: 1rem; }
  .tab-warning-badge { background: #fef2f2; color: #ef4444; padding: 0.3rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700; border: 1px solid #fca5a5; }
  .timer { display: flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 8px; font-family: monospace; font-size: 1.2rem; font-weight: 700; color: #334155; }
  .timer-warning { background: #fef2f2; color: #ef4444; animation: pulse 1s infinite; }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
  .progress-bar-container { height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
  .progress-bar { height: 100%; width: 100%; background: #10B981; transform-origin: left; transition: transform 0.3s ease; }
  .question-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
  .question-text { font-size: 1.1rem; line-height: 1.6; color: #1e293b; margin: 0 0 1.5rem; font-weight: 500; }
  .options { display: flex; flex-direction: column; gap: 0.75rem; }
  .option-label { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: #fff; }
  .option-label:hover { border-color: #cbd5e1; background: #f8fafc; }
  .option-label.selected { border-color: #10B981; background: #f0fdf4; }
  .option-label input { margin-top: 0.2rem; }
  .option-text { font-size: 1rem; color: #334155; line-height: 1.4; }
  .exam-actions { display: flex; justify-content: space-between; margin-top: 1rem; }
  .nav-btn, .submit-btn { padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .nav-btn { background: white; border: 2px solid #e2e8f0; color: #475569; }
  .nav-btn:hover:not(:disabled) { border-color: #cbd5e1; background: #f8fafc; }
  .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .submit-btn { background: #10b981; color: white; border: none; }
  .submit-btn:hover { background: #059669; }
  .score-section { display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; }
  .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; text-align: center; flex: 1; }
  .score-value { font-size: 2.5rem; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 0.5rem; }
  .score-label { font-size: 0.9rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .summary-item { background: #f8fafc; padding: 1rem; border-radius: 8px; display: flex; flex-direction: column; gap: 0.25rem; }
  .summary-label { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
  .summary-value { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
  .previous-attempts { background: #f8fafc; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .previous-attempts h2 { font-size: 1.1rem; margin: 0 0 1rem; }
  .attempt-history-item { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
  .attempt-history-item:last-child { border-bottom: none; padding-bottom: 0; }
  .attempt-label { font-weight: 600; color: #334155; }
  .attempt-meta { color: #64748b; }
  .sync-notice { background: #fffbeb; border: 1px solid #fcd34d; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; color: #92400e; }
  .sync-btn { background: #f59e0b; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
  .save-success { background: #dcfce7; color: #166534; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 600; text-align: center; }
  .save-error { background: #fef2f2; color: #991b1b; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-weight: 600; }
  .save-progress { display: flex; align-items: center; gap: 0.75rem; background: #eff6ff; border: 1px solid #bfdbfe; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; color: #1e40af; font-weight: 600; }
  .spinner { width: 20px; height: 20px; border: 3px solid #bfdbfe; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .retry-btn { width: 100%; padding: 0.75rem; background: #10B981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; }
  .retry-btn:disabled { opacity: 0.6; }
  .no-attempts { background: #f8fafc; border-radius: 12px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem; }
  .loading-text { text-align: center; color: #64748b; padding: 1rem; }
  .tab-warning { text-align: center; color: #ef4444; font-size: 0.9rem; margin: 0.5rem 0; }

  /* File upload styles */
  .file-question { padding: 2rem; }
  .file-question-header { margin-bottom: 1rem; }
  .file-badge { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; }
  .file-question-text { font-size: 1.05rem; line-height: 1.8; color: #1e293b; margin-bottom: 1.5rem; white-space: pre-wrap; }
  .file-upload-area { margin-top: 1rem; }
  .upload-instructions { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; }
  .upload-instructions p { margin: 0 0 0.5rem; font-size: 0.95rem; }
  .upload-instructions ol { margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #15803d; }
  .upload-instructions li { margin-bottom: 0.4rem; line-height: 1.5; }
  .upload-instructions a { color: #2563eb; font-weight: 600; }
  .file-drop-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px dashed #cbd5e1; border-radius: 16px; padding: 2rem; cursor: pointer; transition: all 0.3s ease; background: #f8fafc; min-height: 120px; }
  .file-drop-zone:hover { border-color: #6366f1; background: #f5f3ff; }
  .file-drop-zone.has-file { border-color: #10B981; background: #f0fdf4; border-style: solid; }
  .file-selected { display: flex; align-items: center; gap: 0.75rem; }
  .file-icon { font-size: 2rem; }
  .file-name { font-weight: 700; font-size: 1.1rem; color: #0f172a; }
  .file-check { font-size: 1.5rem; }
  .file-prompt { text-align: center; }
  .upload-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
  .file-prompt p { margin: 0; color: #475569; }
  .file-hint { font-size: 0.8rem; color: #94a3b8; margin-top: 0.5rem; }
  .upload-error { background: #fef2f2; color: #dc2626; padding: 0.75rem; border-radius: 8px; margin-top: 0.75rem; font-weight: 600; font-size: 0.9rem; }
</style>
