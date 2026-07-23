<script lang="ts">
  import { selectRandomQuestions } from '$lib/data/parcial1';
  import { gradesApi, authApi, API_URL } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { STORAGE_KEY, DETAIL_KEY, WINDOW1_END, WINDOW2_START, WINDOW2_END, TOTAL_QUESTIONS, TOTAL_TIME, TIME_PER_MC, TIME_PER_OPEN, calculateTotalTime, formatTime, getAttemptLabel, getAttemptType, calculateScore, buildExamData, SYNC_QUEUE_KEY, getSyncQueue, addToSyncQueue, removeFromSyncQueue, setHealthCheckOk, isHealthCheckRecent, SAVED_ANSWERS_KEY, saveAnswersSnapshot, clearSavedAnswers } from '$lib/exam';
  import { preloadedMyGrades, preloadingStatus, wakeUpStatus } from '$lib/stores/preloaded';

  let { data } = $props();

  let started = $state(false);
  let finished = $state(false);
  let questions = $state<any[]>([]);
  let answers = $state<Record<number, any>>({});
  let currentIndex = $state(0);

  let timeLeft = $state(45 * 60);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let tabSwitchCount = $state(0);
  let mcScore = $state(0);
  let mcTotal = $state(0);
  let pendingOpen = $state(0);
  let results = $state<Record<number, { correct: boolean; userAnswer: any; correctAnswer: any }>>({});

  let currentAttemptNumber = $state(0);
  let serverAttempts = $state(0);
  let serverGrades = $state<any[]>(data.serverGrades || []);
  let loadingServer = $state(!data.serverGrades);
  let saveError = $state('');
  let saveSuccess = $state(false);
  let isSaving = $state(false);
  let serverCheckOk = $state(false);
  let checkingServer = $state(false);
  let pendingSyncCount = $state(0);
  let syncingInProgress = $state(false);

  const totalQuestions = 20;
  let totalTime = 45 * 60;
  let isUnlimited = $derived($currentUser?.email === 'coordinacion@cinarsistemas.edu.co');

  function getLocalAttempts(): any[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  function getAttemptCount(): number {
    if (loadingServer) return getLocalAttempts().length;
    if (serverAttempts === 0) {
      try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(DETAIL_KEY); } catch {}
      return 0;
    }
    return Math.max(serverAttempts, getLocalAttempts().length);
  }

  async function loadServerAttempts() {
    if (!$currentUser?.id) { loadingServer = false; return; }
    try {
      let all = data.serverGrades;
      if (!all || all.length === 0) {
        all = await gradesApi.getMine();
        preloadedMyGrades.set(all);
      }
      const examGrades = all.filter((g: any) => g.subject === 'Desarrollo Web 1 - Parcial 1');
      serverGrades = examGrades;
      serverAttempts = examGrades.length;
    } catch {
      serverAttempts = getLocalAttempts().length;
    } finally {
      loadingServer = false;
      slots = getAvailableSlots();
    }
  }

  function getAvailableSlots(): { total: number; used: number; remaining: number; windowLabel: string; enabled: boolean } {
    const now = new Date();
    const used = getAttemptCount();

    if (isUnlimited) {
      return { total: Infinity, used, remaining: Infinity, windowLabel: 'Intentos ilimitados (coordinador)', enabled: true };
    }

    if (now < WINDOW1_END) {
      return { total: 2, used: Math.min(used, 2), remaining: Math.max(0, 2 - used), windowLabel: 'Antes del examen (hasta 18:45)', enabled: used < 2 };
    } else if (now >= WINDOW2_START && now < WINDOW2_END) {
      const usedInWindow2 = Math.max(0, used - 2);
      return { total: 2, used: usedInWindow2, remaining: Math.max(0, 2 - usedInWindow2), windowLabel: 'Ventana de examen (18:45 - 20:00)', enabled: used < 4 };
    } else {
      return { total: 4, used, remaining: 0, windowLabel: 'Fuera de la ventana de examen', enabled: false };
    }
  }

  let slots = $state(getAvailableSlots());

  $effect(() => {
    if (timeLeft <= 0 && started && !finished) {
      handleSubmit();
    }
  });

  onMount(() => {
    loadServerAttempts();
  });

  $effect(() => {
    if ($currentUser) loadServerAttempts();
  });

  function getProgressPercent(): number {
    const answered = Object.keys(answers).length;
    return (answered / totalQuestions) * 100;
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
      const resume = confirm(`Tienes un examen en progreso guardado (${Object.keys(saved.answers).length} preguntas respondidas). ¿Deseas continuar?`);
      if (resume) {
        questions = saved.questions;
        answers = saved.answers;
        currentIndex = saved.currentIndex || 0;
        timeLeft = saved.timeLeft || calculateTotalTime(saved.questions);
        tabSwitchCount = saved.tabSwitchCount || 0;
        totalTime = timeLeft;
        started = true;
        finished = false;
        currentAttemptNumber = getAttemptCount() + 1;
        timerInterval = setInterval(() => { timeLeft--; }, 1000);
        document.addEventListener('visibilitychange', handleVisibility);
        return;
      }
    }
    clearSavedAnswers();

    questions = selectRandomQuestions(totalQuestions);
    const dynamicTime = calculateTotalTime(questions);
    totalTime = dynamicTime;
    started = true;
    finished = false;
    answers = {};
    currentIndex = 0;
    timeLeft = dynamicTime;
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
    if (index >= 0 && index < totalQuestions) {
      if (index > currentIndex && !isQuestionAnswered(questions[currentIndex]?.id)) return;
      currentIndex = index;
    }
  }

  function handleAnswer(value: any) {
    answers[questions[currentIndex].id] = value;
    autoSaveAnswers();
  }

  function isQuestionAnswered(qId: number): boolean {
    return answers[qId] !== undefined && answers[qId] !== '';
  }

  function autoSaveAnswers() {
    if (!started || finished) return;
    saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount);
  }

  async function checkBackendHealth(): Promise<boolean> {
    if (isHealthCheckRecent()) return true;
    checkingServer = true;
    const baseUrl = API_URL.replace('/api', '');
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
          subject: 'Desarrollo Web 1 - Parcial 1',
          score: entry.score,
          max_score: entry.maxScore,
          period: '2026-1',
          comments: entry.comments
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

  async function attemptSubmitWithRetry(maxRetries = 3): Promise<{ success: boolean; gradeId?: string; error?: string }> {
    const attemptNumLocal = getAttemptCount() + 1;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await gradesApi.submitMine({
          subject: 'Desarrollo Web 1 - Parcial 1',
          score: mcScore,
          max_score: mcTotal,
          period: '2026-1',
          comments: `${getAttemptLabel(attemptNumLocal)} | MC: ${mcScore}/${mcTotal} | Abiertas: ${pendingOpen} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(totalTime - timeLeft)}`
        });
        const grade = res.grade || res;
        if (grade && grade._id) {
          try {
            const examDataForServer = {
              attemptNumber: attemptNumLocal,
              tabSwitches: tabSwitchCount,
              timeUsed: totalTime - timeLeft,
              mcScore, mcTotal,
              questions: questions.map(q => ({
                id: q.id, tema: q.tema, type: q.type, question: q.question,
                options: q.type === 'mc' ? q.options : undefined,
                correctAnswer: q.type === 'mc' ? q.answer : undefined,
                studentAnswer: answers[q.id],
                isCorrect: q.type === 'mc' ? answers[q.id] === q.answer : undefined,
                openScore: null, openMaxScore: q.type === 'open' ? 5 : undefined
              }))
            };
            await gradesApi.updateMine(grade._id, { examData: JSON.stringify(examDataForServer) });
          } catch {}
          return { success: true, gradeId: grade._id };
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
    saveSuccess = false;
    isSaving = true;
    const result = await attemptSubmitWithRetry(3);
    isSaving = false;
    if (result.success) {
      saveSuccess = true;
      const localList = getLocalAttempts();
      if (localList.length > 0) {
        localList[localList.length - 1].gradeId = result.gradeId;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localList));
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
    let totalMc = 0;
    let openCount = 0;
    const res: Record<number, { correct: boolean; userAnswer: any; correctAnswer: any }> = {};

    for (const q of questions) {
      if (q.type === 'mc') {
        totalMc++;
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.answer;
        if (isCorrect) score++;
        res[q.id] = { correct: isCorrect, userAnswer, correctAnswer: q.answer };
      } else {
        openCount++;
      }
    }

    mcScore = score;
    mcTotal = totalMc;
    pendingOpen = openCount;
    results = res;
    finished = true;

    const attemptNum = getAttemptCount() + 1;
    const localRecord = { date: new Date().toISOString(), mcScore: score, mcTotal: totalMc, openCount, tabSwitches: tabSwitchCount, timeUsed: totalTime - timeLeft, gradeId: undefined as string | undefined };

    const examData = {
      attemptNumber: attemptNum,
      tabSwitches: tabSwitchCount,
      timeUsed: totalTime - timeLeft,
      mcScore: score,
      mcTotal: totalMc,
      questions: questions.map(q => ({
        id: q.id,
        tema: q.tema,
        type: q.type,
        question: q.question,
        options: q.type === 'mc' ? q.options : undefined,
        correctAnswer: q.type === 'mc' ? q.answer : undefined,
        studentAnswer: answers[q.id],
        isCorrect: q.type === 'mc' ? answers[q.id] === q.answer : undefined,
        openScore: null,
        openMaxScore: q.type === 'open' ? 5 : undefined
      }))
    };

    let gradeId: string | undefined;
    if ($currentUser?.id) {
      isSaving = true;
      const result = await attemptSubmitWithRetry(3);
      isSaving = false;
      if (result.success) {
        gradeId = result.gradeId;
        localRecord.gradeId = result.gradeId;
        saveSuccess = true;
      } else {
        saveError = `No se pudo guardar en el servidor: ${result.error}. Las respuestas están guardadas localmente. Se reintentará automáticamente.`;
        addToSyncQueue({
          score, maxScore: totalMc, openCount,
          comments: `${getAttemptLabel(attemptNum)} | MC: ${score}/${totalMc} | Abiertas: ${openCount} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(totalTime - timeLeft)}`,
          examData: JSON.stringify(examData)
        });
      }
    }

    const localList = getLocalAttempts();
    localList.push(localRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localList));
    if (gradeId) await loadServerAttempts();

    clearSavedAnswers();
    slots = getAvailableSlots();
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
  <title>Parcial 1 - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/desarrollo-web-1')}>
    <span>←</span> Volver a Desarrollo Web 1
  </button>
  {#if !started && !finished}
    <div class="welcome-screen">
      <div class="welcome-card">
        <div class="welcome-icon">📋</div>
        <h1>Parcial 1 - Desarrollo Web 1</h1>
        <p class="welcome-subtitle">Evaluación de conocimientos</p>

        <div class="attempts-section">
          <h2>🎯 Intentos disponibles</h2>
          <p class="attempts-info">
            {#if isUnlimited}
              Dispones de <strong>intentos ilimitados</strong> como coordinador.
            {:else}
              Dispones de <strong>4 intentos</strong> en total: <strong>2 de Preparación</strong> (antes del examen) y <strong>2 de Evaluación</strong> (durante el examen).
            {/if}
          </p>
          <div class="attempts-grid">
            <div class="attempt-card {isUnlimited || (slots.remaining > 0 && slots.used < 2) ? 'available' : 'used'}">
              <div class="attempt-number">{getAttemptLabel(1)}</div>
              <div class="attempt-type-badge prep">Preparación</div>
              <div class="attempt-status">
                {#if isUnlimited}
                  <span class="ready-badge">Disponible</span>
                {:else if getAttemptCount() >= 1}
                  <span class="used-badge">✓ Utilizado</span>
                {:else if slots.remaining > 0 && slots.used < 2}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="blocked-badge">—</span>
                {/if}
              </div>
            </div>
            <div class="attempt-card {isUnlimited || (slots.remaining > 0 && slots.used < 2) ? 'available' : 'used'}">
              <div class="attempt-number">{getAttemptLabel(2)}</div>
              <div class="attempt-type-badge prep">Preparación</div>
              <div class="attempt-status">
                {#if isUnlimited}
                  <span class="ready-badge">Disponible</span>
                {:else if getAttemptCount() >= 2}
                  <span class="used-badge">✓ Utilizado</span>
                {:else if slots.remaining > 0 && slots.used < 2}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="blocked-badge">—</span>
                {/if}
              </div>
            </div>
            <div class="attempt-card {isUnlimited || (slots.enabled && slots.used >= 2) ? 'available' : (getAttemptCount() >= 3 ? 'used' : 'blocked')}">
              <div class="attempt-number">{getAttemptLabel(3)}</div>
              <div class="attempt-type-badge eval">Evaluación</div>
              <div class="attempt-status">
                {#if isUnlimited}
                  <span class="ready-badge">Disponible</span>
                {:else if getAttemptCount() >= 3}
                  <span class="used-badge">✓ Utilizado</span>
                {:else if slots.enabled && slots.used >= 2}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="blocked-badge">Bloqueado</span>
                {/if}
              </div>
            </div>
            <div class="attempt-card {isUnlimited || (slots.enabled && slots.used >= 3) ? 'available' : (getAttemptCount() >= 4 ? 'used' : 'blocked')}">
              <div class="attempt-number">{getAttemptLabel(4)}</div>
              <div class="attempt-type-badge eval">Evaluación</div>
              <div class="attempt-status">
                {#if isUnlimited}
                  <span class="ready-badge">Disponible</span>
                {:else if getAttemptCount() >= 4}
                  <span class="used-badge">✓ Utilizado</span>
                {:else if slots.enabled && slots.used >= 3}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="blocked-badge">Bloqueado</span>
                {/if}
              </div>
            </div>
          </div>
          {#if !isUnlimited}
          <div class="window-info">
            <strong>📅 Ventana 1 — Preparación (Intentos 1-2):</strong> Hasta el 22 de julio, 18:45<br>
            <strong>📅 Ventana 2 — Evaluación (Intentos 3-4):</strong> 22 de julio, 18:45 - 20:00
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
                <strong>⏱ Tiempo límite:</strong> Dispondrás de aproximadamente <strong>1 hora</strong> para completar las 20 preguntas.
                El tiempo por pregunta es de <strong>{Math.floor(TIME_PER_MC / 60)} min</strong> para selección múltiple y <strong>{Math.floor(TIME_PER_OPEN / 60)} min</strong> para abiertas.
                El examen se enviará automáticamente al cumplirse el tiempo.
              </li>
              <li>
                <strong>📝 Tipos de preguntas:</strong> El examen incluye preguntas de <strong>selección múltiple</strong>
                (con una única respuesta correcta) y preguntas <strong>abiertas</strong> (respuesta escrita).
              </li>
              <li>
                <strong>✅ Corrección automática (selección múltiple):</strong> Al finalizar el examen, las preguntas
                de selección múltiple se calificarán automáticamente y verás tu resultado de inmediato.
              </li>
              <li>
                <strong>⏳ Revisión manual (abiertas):</strong> Las preguntas abiertas serán revisadas y calificadas
                posteriormente por el administrador del sitio.
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
                <strong>📊 Progreso:</strong> Revisa la barra de progreso para saber cuántas preguntas has respondido.
              </li>
              <li>
                <strong>💾 Auto-guardado:</strong> Tus respuestas se guardan automáticamente al responder cada pregunta.
                Si cierras el examen sin terminar, podrás retomarlo.
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
            {checkingServer ? 'Verificando...' : (getAttemptCount() === 0 ? 'Comenzar Examen' : `Iniciar ${getAttemptLabel(getAttemptCount() + 1)}`)}
          </button>
        {:else}
          <div class="no-attempts">
            <p>No tienes intentos disponibles en este momento.</p>
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
        <p class="finish-info">Has completado el Parcial 1 de Desarrollo Web 1.</p>

        <div class="score-section">
          <div class="score-card">
            <div class="score-value">{mcScore}/{mcTotal}</div>
            <div class="score-label">Selección múltiple</div>
            <div class="score-status auto">✓ Corregido automáticamente</div>
          </div>
          <div class="score-card">
            <div class="score-value">{pendingOpen}</div>
            <div class="score-label">Preguntas abiertas</div>
            <div class="score-status pending">⏳ Pendiente de revisión</div>
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

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">Preguntas respondidas</span>
            <span class="summary-value">{Object.keys(answers).length} / {totalQuestions}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Tiempo utilizado</span>
            <span class="summary-value">{formatTime(totalTime - timeLeft)}</span>
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
              {#if q.type === 'mc'}
                {#if results[q.id]?.correct}
                  <span class="review-status correct">✓ Correcta</span>
                {:else if isQuestionAnswered(q.id)}
                  <span class="review-status incorrect">✗ Incorrecta</span>
                {:else}
                  <span class="review-status unanswered">— Sin responder</span>
                {/if}
              {:else}
                {#if isQuestionAnswered(q.id)}
                  <span class="review-status pending-review">⏳ Por revisar</span>
                {:else}
                  <span class="review-status unanswered">— Sin responder</span>
                {/if}
              {/if}
            </div>
          {/each}
        </div>

        {#if slots.remaining > 0}
          <button onclick={() => { finished = false; }} class="start-btn" style="margin-bottom:0.75rem">
            {slots.remaining > 0 ? `Realizar ${getAttemptLabel(getAttemptCount() + 1)}` : ''}
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
          <span class="question-counter">Pregunta {currentIndex + 1} de {totalQuestions}</span>
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
        <div class="progress-bar" style="width: {getProgressPercent()}%"></div>
      </div>

      <div class="exam-body">
  <div class="question-card">
          <div class="question-header">
            <span class="question-type-badge {questions[currentIndex]?.type === 'mc' ? 'mc' : 'open'}">
              {questions[currentIndex]?.type === 'mc' ? 'Selección Múltiple' : 'Pregunta Abierta'}
            </span>
            <span class="question-tema">Tema {questions[currentIndex]?.tema}</span>
          </div>

          <p class="question-text">{questions[currentIndex]?.question}</p>

          {#if questions[currentIndex]?.type === 'mc'}
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
          {:else}
            <textarea
              class="open-answer"
              placeholder="Escribe tu respuesta aquí..."
              value={answers[questions[currentIndex]?.id] || ''}
              oninput={(e) => handleAnswer((e.target as HTMLTextAreaElement).value)}
            ></textarea>
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

          {#if currentIndex < totalQuestions - 1}
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
    grid-template-columns: repeat(4, 1fr);
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

  .attempt-card.blocked {
    border-color: #fca5a5;
    background: #fef2f2;
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
    color: #9ca3af;
  }

  .blocked-badge {
    color: #dc2626;
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
    border-left: 4px solid var(--color-theme-1, #3b82f6);
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
    background: var(--color-theme-1, #3b82f6);
    border-radius: 3px;
    transition: width 0.3s ease;
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

  .open-answer {
    width: 100%;
    min-height: 160px;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 0.95rem;
    font-family: inherit;
    line-height: 1.6;
    resize: vertical;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .open-answer:focus {
    outline: none;
    border-color: var(--color-theme-1, #3b82f6);
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
    color: #9ca3af;
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
      grid-template-columns: repeat(2, 1fr);
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

    .open-answer {
      min-height: 120px;
      padding: 0.75rem;
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
</style>
