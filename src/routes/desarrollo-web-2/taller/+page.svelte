<script lang="ts">
  import { selectRandomQuestions } from '$lib/data/taller_dw2';
  import { gradesApi, API_URL } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    STORAGE_KEY, TOTAL_QUESTIONS, TOTAL_TIME,
    getAttemptLabel, formatTime, getProgressPercent,
    getAttemptCount, SYNC_QUEUE_KEY, getSyncQueue,
    addToSyncQueue, removeFromSyncQueue, setHealthCheckOk,
    isHealthCheckRecent, SAVED_ANSWERS_KEY, saveAnswersSnapshot,
    clearSavedAnswers, calculateScore, buildExamData, getLocalAttempts
  } from '$lib/exam_taller_dw2';
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

  let isUnlimited = $derived($currentUser?.email === 'coordinacion@cinarsistemas.edu.co');

  function getSlots() {
    const used = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer);
    return {
      total: 2,
      used,
      remaining: Math.max(0, 2 - used),
      enabled: used < 2
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
      const examGrades = all.filter((g: any) => g.subject === 'Desarrollo Web 2 - Taller Práctico');
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
    const baseUrl = API_URL.replace('/api', '');
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
      const resume = confirm(`Tienes un taller en progreso (${Object.keys(saved.answers).length} preguntas). ¿Continuar?`);
      if (resume) {
        questions = saved.questions;
        answers = saved.answers;
        currentIndex = saved.currentIndex || 0;
        timeLeft = saved.timeLeft || TOTAL_TIME;
        tabSwitchCount = saved.tabSwitchCount || 0;
        started = true;
        finished = false;
        currentAttemptNumber = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;
        timerInterval = setInterval(() => { timeLeft--; }, 1000);
        document.addEventListener('visibilitychange', handleVisibility);
        return;
      }
    }
    clearSavedAnswers();

    questions = selectRandomQuestions(TOTAL_QUESTIONS);
    started = true;
    finished = false;
    answers = {};
    currentIndex = 0;
    timeLeft = TOTAL_TIME;
    tabSwitchCount = 0;
    currentAttemptNumber = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;
    timerInterval = setInterval(() => { timeLeft--; }, 1000);
    document.addEventListener('visibilitychange', handleVisibility);
  }

  function handleVisibility() {
    if (document.hidden && started && !finished) tabSwitchCount++;
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < TOTAL_QUESTIONS) {
      if (index > currentIndex && !answers[questions[currentIndex]?.id]) return;
      currentIndex = index;
    }
  }

  function handleAnswer(value: any) {
    answers[questions[currentIndex].id] = value;
    autoSaveAnswers();
  }

  function autoSaveAnswers() {
    if (!started || finished) return;
    saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount);
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
          subject: 'Desarrollo Web 2 - Taller Práctico',
          score: entry.score,
          max_score: TOTAL_QUESTIONS,
          period: '2026-2',
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
        const res = await gradesApi.submitMine({
          subject: 'Desarrollo Web 2 - Taller Práctico',
          score: finalScore,
          max_score: TOTAL_QUESTIONS,
          period: '2026-2',
          comments: `${getAttemptLabel(attemptNumLocal)} | Score: ${finalScore}/${TOTAL_QUESTIONS} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(TOTAL_TIME - timeLeft)}`,
          submittedAt: Date.now()
        });
        const grade = res.grade || res;
        if (grade && grade._id) {
          const examDataForServer = buildExamData(attemptNumLocal, tabSwitchCount, TOTAL_TIME - timeLeft, questions, answers);
          await gradesApi.updateMine(grade._id, { examData: JSON.stringify(examDataForServer) });
          return { success: true, gradeId: grade._id };
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
    saveSuccess = false;
    isSaving = true;
    const result = await attemptSubmitWithRetry(3);
    isSaving = false;
    if (result.success) {
      saveSuccess = true;
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
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      res[q.id] = { correct: isCorrect };
    }

    finalScore = score;
    results = res;
    finished = true;

    const attemptNum = getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1;
    const localRecord = { date: new Date().toISOString(), score, total: TOTAL_QUESTIONS, tabSwitches: tabSwitchCount, timeUsed: TOTAL_TIME - timeLeft, gradeId: undefined as string | undefined };
    const examData = buildExamData(attemptNum, tabSwitchCount, TOTAL_TIME - timeLeft, questions, answers);

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
        saveError = `No se pudo guardar: ${result.error}. Las respuestas están guardadas localmente.`;
        addToSyncQueue({
          score, maxScore: TOTAL_QUESTIONS,
          comments: `${getAttemptLabel(attemptNum)} | Score: ${score}/${TOTAL_QUESTIONS} | Cambios: ${tabSwitchCount} | Tiempo: ${formatTime(TOTAL_TIME - timeLeft)}`,
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
  <title>Taller Práctico - Desarrollo Web 2</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/desarrollo-web-2')}>
    <span>←</span> Volver a Desarrollo Web 2
  </button>

  {#if !started && !finished}
    <div class="welcome-screen">
      <div class="welcome-card">
        <div class="welcome-icon">⚙️</div>
        <h1>Taller Práctico</h1>
        <p class="welcome-subtitle">Componentes, Bootstrap, Slots y Persistencia en Svelte 5</p>

        <div class="attempts-section">
          <h2>🎯 Intentos disponibles</h2>
          <p class="attempts-info">
            {#if isUnlimited}
              Dispones de <strong>intentos ilimitados</strong> como coordinador.
            {:else}
              Dispones de <strong>2 intentos</strong> en total.
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
            <h2>📌 Recomendaciones importantes</h2>
            <ul>
              <li><strong>⏱ Tiempo límite:</strong> Dispones de <strong>30 minutos</strong> para completar el taller.</li>
              <li><strong>✅ Corrección automática:</strong> Las preguntas son de selección múltiple.</li>
              <li><strong>🚫 Sin consultas externas:</strong> No está permitido cambiar de pestaña.</li>
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
            <p>Una vez se asigne la fecha del taller o parcial en cuestión, ya se anunciará y se habilitará el acceso.</p>
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
            <div class="score-value">{finalScore}/{TOTAL_QUESTIONS}</div>
            <div class="score-label">Puntaje Final</div>
          </div>
        </div>

        {#if saveSuccess}
          <div class="save-success">✅ Calificación guardada exitosamente.</div>
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
            <span class="summary-value">{formatTime(TOTAL_TIME - timeLeft)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Intentos restantes</span>
            <span class="summary-value">{slots.remaining}</span>
          </div>
        </div>

        {#if slots.remaining > 0}
          <button onclick={() => { finished = false; }} class="start-btn" style="margin-bottom:0.75rem">
            Realizar {getAttemptLabel(getAttemptCount(serverAttempts, getLocalAttempts().length, loadingServer) + 1)}
          </button>
        {/if}
        <a href="/desarrollo-web-2" class="back-btn" style="text-decoration:none; margin-top:0.5rem">Volver al Menú</a>
      </div>
    </div>

  {:else}
    <div class="exam-screen">
      <div class="exam-header">
        <div class="exam-header-left">
          <h1>{getAttemptLabel(currentAttemptNumber)}</h1>
          <span class="question-counter">Pregunta {currentIndex + 1} de {TOTAL_QUESTIONS}</span>
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
        <div class="progress-bar" style="transform: scaleX({getProgressPercent(Object.keys(answers).length) / 100})"></div>
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
          <button class="nav-btn" onclick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}>← Anterior</button>
          {#if currentIndex < TOTAL_QUESTIONS - 1}
            <button class="nav-btn" onclick={() => goToQuestion(currentIndex + 1)} disabled={!answers[questions[currentIndex]?.id]}>Siguiente →</button>
          {:else}
            <button class="submit-btn" onclick={handleSubmit}>Finalizar</button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .page { padding: 1rem 0; flex: 1; display: flex; flex-direction: column; max-width: 800px; margin: 0 auto; width: 100%; }
  .back-btn { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--color-theme-1, #DC2626); background: none; border: none; padding: 0; cursor: pointer; font-weight: 600; margin-bottom: 1rem; transition: opacity 0.2s; }
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
  .start-btn { width: 100%; padding: 1rem; background: #DC2626; color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .start-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-2px); }
  .start-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .recommendations { background: #f8fafc; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .recommendations h2 { font-size: 1.1rem; margin: 0 0 1rem; color: #333; }
  .recommendations ul { margin: 0; padding-left: 1.25rem; font-size: 0.9rem; color: #444; }
  .recommendations li { margin-bottom: 0.5rem; line-height: 1.5; }
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
  .progress-bar { height: 100%; width: 100%; background: #DC2626; transform-origin: left; transition: transform 0.3s ease; }
  .question-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
  .question-text { font-size: 1.1rem; line-height: 1.6; color: #1e293b; margin: 0 0 1.5rem; font-weight: 500; }
  .options { display: flex; flex-direction: column; gap: 0.75rem; }
  .option-label { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: #fff; }
  .option-label:hover { border-color: #cbd5e1; background: #f8fafc; }
  .option-label.selected { border-color: #DC2626; background: #fef2f2; }
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
  .retry-btn { width: 100%; padding: 0.75rem; background: #DC2626; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-bottom: 1.5rem; }
  .retry-btn:disabled { opacity: 0.6; }
  .no-attempts { background: #f8fafc; border-radius: 12px; padding: 1.5rem; text-align: center; margin-bottom: 1.5rem; }
  .loading-text { text-align: center; color: #64748b; padding: 1rem; }
  .tab-warning { text-align: center; color: #ef4444; font-size: 0.9rem; margin: 0.5rem 0; }
</style>
