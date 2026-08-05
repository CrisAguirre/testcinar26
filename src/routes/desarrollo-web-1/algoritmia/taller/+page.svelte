<script lang="ts">
  import { tallerQuestions } from '$lib/data/tallerAlgoritmia';
  import { gradesApi, API_URL } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    TALLER_STORAGE_KEY, TALLER_TOTAL_QUESTIONS, TALLER_TOTAL_TIME, 
    getTallerAttemptLabel, getTallerAttemptType, formatTallerTime, 
    getTallerProgressPercent, getTallerAttemptCount, getTallerAvailableSlots, 
    getTallerLocalAttempts, TALLER_SYNC_QUEUE_KEY, getTallerSyncQueue, 
    addTallerToSyncQueue, removeTallerFromSyncQueue, setTallerHealthCheckOk, 
    isTallerHealthCheckRecent, TALLER_SAVED_ANSWERS_KEY, saveTallerAnswersSnapshot, 
    clearTallerSavedAnswers 
  } from '$lib/tallerConfig';
  import { preloadedMyGrades } from '$lib/stores/preloaded';

  let started = $state(false);
  let finished = $state(false);
  let questions = $state<any[]>(tallerQuestions);
  let answers = $state<Record<string, any>>({});
  let currentIndex = $state(0);

  let timeLeft = $state(TALLER_TOTAL_TIME);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let tabSwitchCount = $state(0);
  let finalScore = $state(0);
  let results = $state<Record<string, { correct: boolean; userAnswer: any; correctAnswer: any }>>({});

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

  let isUnlimited = $derived($currentUser?.email === 'coordinacion@cinarsistemas.edu.co');

  async function loadServerAttempts() {
    if (!$currentUser?.id) { loadingServer = false; return; }
    try {
      let all = $preloadedMyGrades;
      if (!all || all.length === 0) {
        all = await gradesApi.getMine();
        preloadedMyGrades.set(all);
      }
      const examGrades = all.filter((g: any) => g.subject === 'Desarrollo Web 1 - Taller Algoritmia');
      serverGrades = examGrades;
      serverAttempts = examGrades.length;
    } catch {
      serverAttempts = getTallerLocalAttempts().length;
    } finally {
      loadingServer = false;
    }
  }

  let slots = $derived.by(() => getTallerAvailableSlots(new Date(), getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer)));

  $effect(() => {
    if (timeLeft <= 0 && started && !finished) {
      handleSubmit();
    }
  });

  onMount(() => {
    loadServerAttempts();
    pendingSyncCount = getTallerSyncQueue().length;
  });

  $effect(() => {
    if ($currentUser) loadServerAttempts();
  });

  async function startExam() {
    const healthy = await checkBackendHealth();
    if (!healthy) {
      const proceed = confirm('El servidor no responde. Puedes comenzar, pero las respuestas se guardarán localmente y se sincronizarán después. ¿Deseas continuar?');
      if (!proceed) return;
    }

    const saved = (() => {
      try {
        const raw = localStorage.getItem(TALLER_SAVED_ANSWERS_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    })();

    if (saved && saved.questions && saved.answers && Object.keys(saved.answers).length > 0) {
      const resume = confirm(`Tienes un taller en progreso guardado (${Object.keys(saved.answers).length} preguntas respondidas). ¿Deseas continuar?`);
      if (resume) {
        questions = saved.questions;
        answers = saved.answers;
        currentIndex = saved.currentIndex || 0;
        timeLeft = saved.timeLeft || TALLER_TOTAL_TIME;
        tabSwitchCount = saved.tabSwitchCount || 0;
        started = true;
        finished = false;
        currentAttemptNumber = getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) + 1;
        timerInterval = setInterval(() => { timeLeft--; }, 1000);
        document.addEventListener('visibilitychange', handleVisibility);
        return;
      }
    }
    clearTallerSavedAnswers();

    questions = tallerQuestions;
    started = true;
    finished = false;
    answers = {};
    currentIndex = 0;
    timeLeft = TALLER_TOTAL_TIME;
    tabSwitchCount = 0;

    currentAttemptNumber = getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) + 1;

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
    if (index >= 0 && index < TALLER_TOTAL_QUESTIONS) {
      if (index > currentIndex && !isQuestionAnswered(questions[currentIndex]?.id)) return;
      currentIndex = index;
    }
  }

  function handleAnswer(value: any) {
    answers[questions[currentIndex].id] = value;
    autoSaveAnswers();
  }

  function isQuestionAnswered(qId: string): boolean {
    return answers[qId] !== undefined && answers[qId] !== '';
  }

  function autoSaveAnswers() {
    if (!started || finished) return;
    saveTallerAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount);
  }

  async function checkBackendHealth(): Promise<boolean> {
    if (isTallerHealthCheckRecent()) return true;
    checkingServer = true;
    const baseUrl = API_URL.replace('/api', '');
    try {
      for (let i = 0; i < 3; i++) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 25000);
          await fetch(baseUrl, { signal: controller.signal, mode: 'cors' });
          clearTimeout(timeout);
          setTallerHealthCheckOk();
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
    const queue = getTallerSyncQueue();
    if (queue.length === 0) return;
    syncingInProgress = true;
    pendingSyncCount = queue.length;

    for (const entry of queue) {
      if (!$currentUser?.id) break;
      try {
        const res = await gradesApi.submitMine({
          subject: 'Desarrollo Web 1 - Taller Algoritmia',
          score: entry.score,
          max_score: entry.maxScore,
          period: '2026-1',
          comments: entry.comments
        });
        const grade = res.grade || res;
        if (grade && grade._id && entry.examData) {
          await gradesApi.updateMine(grade._id, { examData: entry.examData });
        }
        removeTallerFromSyncQueue(entry.createdAt);
        pendingSyncCount--;
      } catch {
        break;
      }
    }
    syncingInProgress = false;
    pendingSyncCount = getTallerSyncQueue().length;
    if (pendingSyncCount > 0) loadServerAttempts();
  }

  async function attemptSubmitWithRetry(maxRetries = 3): Promise<{ success: boolean; gradeId?: string; error?: string }> {
    const attemptNumLocal = getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) + 1;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await gradesApi.submitMine({
          subject: 'Desarrollo Web 1 - Taller Algoritmia',
          score: finalScore,
          max_score: TALLER_TOTAL_QUESTIONS,
          period: '2026-1',
          comments: `${getTallerAttemptLabel(attemptNumLocal)} | Score: ${finalScore}/${TALLER_TOTAL_QUESTIONS} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTallerTime(TALLER_TOTAL_TIME - timeLeft)}`
        });
        const grade = res.grade || res;
        if (grade && grade._id) {
          try {
            const examDataForServer = {
              attemptNumber: attemptNumLocal,
              tabSwitches: tabSwitchCount,
              timeUsed: TALLER_TOTAL_TIME - timeLeft,
              mcScore: finalScore, mcTotal: TALLER_TOTAL_QUESTIONS,
              questions: questions.map(q => ({
                id: q.id, tema: 'Taller', type: 'mc', question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                studentAnswer: answers[q.id],
                isCorrect: answers[q.id] === q.correctAnswer
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
      const localList = getTallerLocalAttempts();
      if (localList.length > 0) {
        localList[localList.length - 1].gradeId = result.gradeId;
        localStorage.setItem(TALLER_STORAGE_KEY, JSON.stringify(localList));
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
    const res: Record<string, { correct: boolean; userAnswer: any; correctAnswer: any }> = {};

    for (const q of questions) {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      res[q.id] = { correct: isCorrect, userAnswer, correctAnswer: q.correctAnswer };
    }

    finalScore = score;
    results = res;
    finished = true;

    const attemptNum = getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) + 1;
    const localRecord = { date: new Date().toISOString(), score, total: TALLER_TOTAL_QUESTIONS, tabSwitches: tabSwitchCount, timeUsed: TALLER_TOTAL_TIME - timeLeft, gradeId: undefined as string | undefined };

    const examData = {
      attemptNumber: attemptNum,
      tabSwitches: tabSwitchCount,
      timeUsed: TALLER_TOTAL_TIME - timeLeft,
      mcScore: score,
      mcTotal: TALLER_TOTAL_QUESTIONS,
      questions: questions.map(q => ({
        id: q.id,
        tema: 'Taller',
        type: 'mc',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        studentAnswer: answers[q.id],
        isCorrect: answers[q.id] === q.correctAnswer
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
        addTallerToSyncQueue({
          score, maxScore: TALLER_TOTAL_QUESTIONS,
          comments: `${getTallerAttemptLabel(attemptNum)} | Score: ${score}/${TALLER_TOTAL_QUESTIONS} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTallerTime(TALLER_TOTAL_TIME - timeLeft)}`,
          examData: JSON.stringify(examData)
        });
      }
    }

    const localList = getTallerLocalAttempts();
    localList.push(localRecord);
    localStorage.setItem(TALLER_STORAGE_KEY, JSON.stringify(localList));
    if (gradeId) await loadServerAttempts();

    clearTallerSavedAnswers();
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
  <title>Taller de Algoritmia - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/desarrollo-web-1')}>
    <span>←</span> Volver a Desarrollo Web 1
  </button>
  
  {#if !started && !finished}
    <div class="welcome-screen">
      <div class="welcome-card">
        <div class="welcome-icon">🧠</div>
        <h1>Taller de Algoritmia</h1>
        <p class="welcome-subtitle">Evaluación de lógica y diagramas de flujo</p>

        <div class="attempts-section">
          <h2>🎯 Intentos disponibles</h2>
          <p class="attempts-info">
            {#if isUnlimited}
              Dispones de <strong>intentos ilimitados</strong> como coordinador.
            {:else}
              Dispones de <strong>2 intentos</strong> en total: <strong>1 de Preparación</strong> (hasta las 18:00 H) y <strong>1 de Evaluación</strong> (18:45 H a 20:00 H).
            {/if}
          </p>
          <div class="attempts-grid">
            <div class="attempt-card {isUnlimited || (slots.remaining > 0 && slots.used < 1) ? 'available' : 'used'}">
              <div class="attempt-number">{getTallerAttemptLabel(1)}</div>
              <div class="attempt-type-badge prep">Preparación</div>
              <div class="attempt-status">
                {#if isUnlimited}
                  <span class="ready-badge">Disponible</span>
                {:else if getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) >= 1}
                  <span class="used-badge">✓ Utilizado</span>
                {:else if slots.remaining > 0 && slots.used < 1}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="blocked-badge">—</span>
                {/if}
              </div>
            </div>
            <div class="attempt-card {isUnlimited || (slots.enabled && slots.used >= 1) ? 'available' : (getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) >= 2 ? 'used' : 'blocked')}">
              <div class="attempt-number">{getTallerAttemptLabel(2)}</div>
              <div class="attempt-type-badge eval">Evaluación</div>
              <div class="attempt-status">
                {#if isUnlimited}
                  <span class="ready-badge">Disponible</span>
                {:else if getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) >= 2}
                  <span class="used-badge">✓ Utilizado</span>
                {:else if slots.enabled && slots.used >= 1}
                  <span class="ready-badge">Disponible</span>
                {:else}
                  <span class="blocked-badge">Bloqueado</span>
                {/if}
              </div>
            </div>
          </div>
          {#if !isUnlimited}
          <div class="window-info">
            <strong>📅 Ventana 1 — Preparación:</strong> Hoy hasta las 18:00 H<br>
            <strong>📅 Ventana 2 — Evaluación:</strong> Hoy de 18:45 H a 20:00 H
          </div>
          {/if}
        </div>

        {#if serverGrades.length > 0}
          <div class="previous-attempts">
            <h2>📊 Intentos anteriores</h2>
            {#each serverGrades as g, i}
              <div class="attempt-history-item">
                <span class="attempt-label">{getTallerAttemptLabel(i + 1)}</span>
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
                <strong>⏱ Tiempo límite:</strong> Dispondrás de <strong>30 minutos</strong> para completar el taller.
                El sistema enviará tu respuesta automáticamente cuando el tiempo termine.
              </li>
              <li>
                <strong>✅ Corrección automática:</strong> Las 10 preguntas son de selección múltiple y se calificarán de forma inmediata al finalizar.
              </li>
              <li>
                <strong>🚫 Sin consultas externas:</strong> No está permitido cambiar de pestaña. El sistema lo detectará automáticamente.
              </li>
            </ul>
          </div>

          {#if checkingServer}
            <p class="server-check">Verificando conexión con el servidor...</p>
          {:else if !isUnlimited && !serverCheckOk && getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) === 0}
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
            {checkingServer ? 'Verificando...' : (getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) === 0 ? 'Comenzar Taller' : `Iniciar ${getTallerAttemptLabel(getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) + 1)}`)}
          </button>
        {:else}
          <div class="no-attempts">
            <p>No tienes intentos disponibles en este momento.</p>
          </div>
          <a href="/desarrollo-web-1" class="back-btn" style="text-decoration:none">Volver al Menú Principal</a>
        {/if}
      </div>
    </div>

  {:else if finished}
    <div class="finish-screen">
      <div class="finish-card">
        <div class="finish-icon">✅</div>
        <h1>{getTallerAttemptLabel(currentAttemptNumber)} — Finalizado</h1>
        {#if tabSwitchCount > 0}
          <p class="tab-warning">
            ⚠ Se detectaron {tabSwitchCount} cambio(s) de pestaña.
          </p>
        {/if}
        <p class="finish-info">Has completado el Taller de Algoritmia.</p>

        <div class="score-section">
          <div class="score-card">
            <div class="score-value">{finalScore}/{TALLER_TOTAL_QUESTIONS}</div>
            <div class="score-label">Puntaje Final</div>
            <div class="score-status auto">✓ Corregido automáticamente</div>
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
            <span class="summary-label">Tiempo utilizado</span>
            <span class="summary-value">{formatTallerTime(TALLER_TOTAL_TIME - timeLeft)}</span>
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
              {#if results[q.id]?.correct}
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
          <button onclick={() => { finished = false; }} class="start-btn" style="margin-bottom:0.75rem">
            {slots.remaining > 0 ? `Realizar ${getTallerAttemptLabel(getTallerAttemptCount(serverAttempts, getTallerLocalAttempts().length, loadingServer) + 1)}` : ''}
          </button>
        {/if}
        <a href="/desarrollo-web-1" class="back-btn" style="text-decoration:none">Volver al Menú Principal</a>
      </div>
    </div>

  {:else}
    <div class="exam-screen">
      <div class="exam-header">
        <div class="exam-header-left">
          <h1>{getTallerAttemptLabel(currentAttemptNumber)}</h1>
          <span class="question-counter">Pregunta {currentIndex + 1} de {TALLER_TOTAL_QUESTIONS}</span>
        </div>
        <div class="exam-header-right">
          {#if tabSwitchCount > 0}
            <span class="tab-warning-badge">⚠ {tabSwitchCount} cambio(s)</span>
          {/if}
          <div class="timer {timeLeft <= 300 ? 'timer-warning' : ''}">
            <span class="timer-icon">⏱</span>
            <span class="timer-text">{formatTallerTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: {getTallerProgressPercent(Object.keys(answers).length)}%"></div>
      </div>

      <div class="exam-body">
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

        <div class="exam-actions">
          <button
            class="nav-btn"
            onclick={() => goToQuestion(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            ← Anterior
          </button>

          {#if currentIndex < TALLER_TOTAL_QUESTIONS - 1}
            <button
              class="nav-btn"
              onclick={() => goToQuestion(currentIndex + 1)}
              disabled={!isQuestionAnswered(questions[currentIndex]?.id)}
            >
              Siguiente →
            </button>
          {:else}
            <button class="submit-btn" onclick={handleSubmit}>
              Finalizar {getTallerAttemptType(currentAttemptNumber)}
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* The styles will mirror the exam page */
  .page {
    padding: 1rem 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--color-theme-1, #3b82f6);
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 1rem;
    transition: opacity 0.2s;
  }
  .back-btn:hover { opacity: 0.8; }

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
    font-size: 1.1rem;
    margin: 0 0 0.5rem;
    color: #333;
  }
  .attempts-info {
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 1rem;
  }

  .attempts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .attempt-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
  }
  .attempt-card.available {
    border-color: #93c5fd;
    background: #eff6ff;
  }
  .attempt-card.used { opacity: 0.6; }
  .attempt-card.blocked { opacity: 0.5; background: #f1f5f9; }

  .attempt-number { font-weight: 700; font-size: 0.95rem; color: #1e293b; }

  .attempt-type-badge {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 12px;
  }
  .prep { background: #e0e7ff; color: #4338ca; }
  .eval { background: #ffedd5; color: #c2410c; }

  .ready-badge { color: #2563eb; font-weight: 700; font-size: 0.8rem; }
  .used-badge { color: #16a34a; font-weight: 700; font-size: 0.8rem; }
  .blocked-badge { color: #64748b; font-weight: 700; font-size: 0.8rem; }

  .window-info {
    background: #f1f5f9;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #475569;
    line-height: 1.5;
  }

  .start-btn {
    width: 100%;
    padding: 1rem;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }
  .start-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
  .start-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .recommendations {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .recommendations h2 { font-size: 1.1rem; margin: 0 0 1rem; color: #333; }
  .recommendations ul { margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #444; }
  .recommendations li { margin-bottom: 0.5rem; line-height: 1.5; }

  .exam-screen {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .exam-header-left h1 { font-size: 1.2rem; margin: 0 0 0.2rem; }
  .question-counter { font-size: 0.85rem; color: #64748b; font-weight: 600; }

  .exam-header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .tab-warning-badge {
    background: #fef2f2;
    color: #ef4444;
    padding: 0.3rem 0.6rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    border: 1px solid #fca5a5;
  }

  .timer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f1f5f9;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: monospace;
    font-size: 1.2rem;
    font-weight: 700;
    color: #334155;
  }
  .timer-warning { background: #fef2f2; color: #ef4444; animation: pulse 1s infinite; }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

  .progress-bar-container {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-bar {
    height: 100%;
    background: var(--color-theme-1, #3b82f6);
    transition: width 0.3s ease;
  }

  .question-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }

  .question-text {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #1e293b;
    margin: 0 0 1.5rem;
    font-weight: 500;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
  }
  .option-label:hover { border-color: #cbd5e1; background: #f8fafc; }
  .option-label.selected { border-color: var(--color-theme-1, #3b82f6); background: #eff6ff; }
  
  .option-label input { margin-top: 0.2rem; }
  .option-text { font-size: 1rem; color: #334155; line-height: 1.4; }

  .exam-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .nav-btn, .submit-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .nav-btn {
    background: white;
    border: 2px solid #e2e8f0;
    color: #475569;
  }
  .nav-btn:hover:not(:disabled) { border-color: #cbd5e1; background: #f8fafc; }
  .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .submit-btn {
    background: #10b981;
    color: white;
    border: none;
  }
  .submit-btn:hover { background: #059669; }

  .score-section { display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; }
  .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; text-align: center; flex: 1; }
  .score-value { font-size: 2.5rem; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 0.5rem; }
  .score-label { font-size: 0.9rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  .score-status { margin-top: 0.75rem; font-size: 0.8rem; font-weight: 700; padding: 0.3rem 0.6rem; border-radius: 12px; display: inline-block; }
  .score-status.auto { background: #dcfce7; color: #166534; }

  .answers-review { margin-top: 2rem; }
  .answers-review h2 { font-size: 1.1rem; margin-bottom: 1rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
  .review-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid #f1f5f9; }
  .review-num { font-weight: 600; font-size: 0.9rem; }
  .review-status { font-size: 0.85rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 6px; }
  .review-status.correct { background: #dcfce7; color: #166534; }
  .review-status.incorrect { background: #fef2f2; color: #991b1b; }
  .review-status.unanswered { background: #f1f5f9; color: #64748b; }

  .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .summary-item { background: #f8fafc; padding: 1rem; border-radius: 8px; display: flex; flex-direction: column; gap: 0.25rem; }
  .summary-label { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; }
  .summary-value { font-size: 1.1rem; font-weight: 700; color: #0f172a; }

  .previous-attempts {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .previous-attempts h2 {
    font-size: 1.1rem;
    margin: 0 0 1rem;
  }
  .attempt-history-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e2e8f0;
    font-size: 0.9rem;
  }
  .attempt-history-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .attempt-label { font-weight: 600; color: #334155; }
  .attempt-meta { color: #64748b; }

  .sync-notice {
    background: #fffbeb;
    border: 1px solid #fcd34d;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #92400e;
  }
  .sync-btn {
    background: #f59e0b;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
  }

  .save-success { background: #dcfce7; color: #166534; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 600; text-align: center; }
  .save-error { background: #fef2f2; color: #991b1b; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-weight: 600; }
  .retry-btn { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; }
  .retry-btn:disabled { opacity: 0.6; }

</style>
