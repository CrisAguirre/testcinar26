<script lang="ts">
  import { selectRandomQuestions } from '$lib/data/parcial1';
  import { onMount, onDestroy } from 'svelte';

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

  const totalQuestions = 20;
  const totalTime = 45 * 60;

  $effect(() => {
    if (timeLeft <= 0 && started && !finished) {
      handleSubmit();
    }
  });

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function getProgressPercent(): number {
    const answered = Object.keys(answers).length;
    return (answered / totalQuestions) * 100;
  }

  function startExam() {
    questions = selectRandomQuestions(totalQuestions);
    started = true;
    finished = false;
    answers = {};
    currentIndex = 0;
    timeLeft = totalTime;
    tabSwitchCount = 0;

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
      currentIndex = index;
    }
  }

  function handleAnswer(value: any) {
    answers[questions[currentIndex].id] = value;
  }

  function isQuestionAnswered(qId: number): boolean {
    return answers[qId] !== undefined && answers[qId] !== '';
  }

  function handleSubmit() {
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
  }

  onDestroy(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    document.removeEventListener('visibilitychange', handleVisibility);
  });
</script>

<svelte:head>
  <title>Parcial 1 - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  {#if !started && !finished}
    <div class="welcome-screen">
      <div class="welcome-card">
        <div class="welcome-icon">📋</div>
        <h1>Parcial 1 - Desarrollo Web 1</h1>
        <p class="welcome-subtitle">Evaluación de conocimientos</p>

        <div class="recommendations">
          <h2>📌 Recomendaciones importantes</h2>
          <ul>
            <li>
              <strong>⏱ Tiempo límite:</strong> Dispondrás de <strong>45 minutos</strong> para completar las 20 preguntas.
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
              <strong>✅ Navegación:</strong> Puedes navegar entre preguntas usando los botones Anterior/Siguiente
              o el índice de preguntas. Las preguntas respondidas se marcarán en verde.
            </li>
            <li>
              <strong>📊 Progreso:</strong> Revisa la barra de progreso para saber cuántas preguntas has respondido.
            </li>
          </ul>
        </div>

        <button onclick={startExam} class="start-btn">
          Comenzar Examen
        </button>
      </div>
    </div>

  {:else if finished}
    <div class="finish-screen">
      <div class="finish-card">
        <div class="finish-icon">✅</div>
        <h1>Examen Finalizado</h1>
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

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">Preguntas respondidas</span>
            <span class="summary-value">{Object.keys(answers).length} / {totalQuestions}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Tiempo utilizado</span>
            <span class="summary-value">{formatTime(totalTime - timeLeft)}</span>
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

        <a href="/" class="back-btn">Volver al Inicio</a>
      </div>
    </div>

  {:else}
    <div class="exam-screen">
      <div class="exam-header">
        <div class="exam-header-left">
          <h1>Parcial 1</h1>
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
        <div class="question-nav">
          {#each questions as q, i}
            <button
              class="nav-dot {i === currentIndex ? 'active' : ''} {isQuestionAnswered(q.id) ? 'answered' : ''}"
              onclick={() => goToQuestion(i)}
              title="Pregunta {i + 1}"
            >
              {i + 1}
            </button>
          {/each}
        </div>

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
            <button class="nav-btn" onclick={() => goToQuestion(currentIndex + 1)}>
              Siguiente →
            </button>
          {:else}
            <button class="submit-btn" onclick={handleSubmit}>
              Finalizar Examen
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

  .question-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    padding: 0.75rem;
    border-radius: 10px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  }

  .nav-dot {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    background: white;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    color: #666;
  }

  .nav-dot:hover {
    border-color: var(--color-theme-1, #3b82f6);
    color: var(--color-theme-1, #3b82f6);
  }

  .nav-dot.active {
    border-color: var(--color-theme-1, #3b82f6);
    background: var(--color-theme-1, #3b82f6);
    color: white;
  }

  .nav-dot.answered {
    border-color: #22c55e;
    background: #f0fdf4;
    color: #16a34a;
  }

  .nav-dot.active.answered {
    background: var(--color-theme-1, #3b82f6);
    border-color: var(--color-theme-1, #3b82f6);
    color: white;
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
</style>
