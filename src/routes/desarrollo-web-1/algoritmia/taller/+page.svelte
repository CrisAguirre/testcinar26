<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { tallerQuestions } from '$lib/data/tallerAlgoritmia';
  import { gradesApi } from '$lib/api';
  import { preloadedMyGrades } from '$lib/stores/preloaded';
  import { get } from 'svelte/store';

  onMount(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const TALLER_SUBJECT = 'Desarrollo Web 1 - Taller Algoritmia';

  let answers = $state<Record<string, number>>({});
  let submitting = $state(false);
  let submitted = $state(false);
  let errorMsg = $state('');
  let finalScore = $state(0);
  let results = $state<any[]>([]);

  function toggleAnswer(questionId: string, optionIndex: number) {
    if (submitted) return;
    answers[questionId] = optionIndex;
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < tallerQuestions.length) {
      errorMsg = 'Por favor responde todas las preguntas antes de enviar.';
      return;
    }
    
    errorMsg = '';
    submitting = true;

    // Calcular nota
    let score = 0;
    const examQuestions = tallerQuestions.map(q => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        id: q.id,
        type: 'mc',
        tema: 'Taller',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        studentAnswer: answers[q.id],
        isCorrect
      };
    });

    finalScore = score;
    results = examQuestions;

    try {
      await gradesApi.submitMine({
        subject: TALLER_SUBJECT,
        score: finalScore,
        max_score: tallerQuestions.length,
        period: '2026-1',
        comments: `Taller Automático enviado - Puntuación: ${finalScore}/${tallerQuestions.length}`,
        examData: JSON.stringify({
          questions: examQuestions,
          submittedAt: new Date().toISOString()
        })
      });
      
      submitted = true;
      // Invalidate cache
      const cached = get(preloadedMyGrades);
      if (cached) {
        const all = await gradesApi.getMine();
        preloadedMyGrades.set(all);
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : 'Error al enviar el taller';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Taller de Algoritmia - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <a href="/desarrollo-web-1/algoritmia" class="back-link">← Volver a Algoritmia</a>
    <h1>Taller de Algoritmia</h1>
    <p class="page-subtitle">Pon a prueba tu lógica de programación resolviendo estos ejercicios.</p>
  </div>

  {#if submitted}
    <div class="results-banner">
      <h2>¡Taller completado exitosamente!</h2>
      <div class="score-display">
        <span class="score-number">{finalScore}</span>
        <span class="score-total">/ {tallerQuestions.length}</span>
      </div>
      <p>Tu calificación ha sido guardada en la base de datos.</p>
    </div>
  {/if}

  {#if errorMsg}
    <div class="error-banner">{errorMsg}</div>
  {/if}

  <div class="questions-list">
    {#each tallerQuestions as q, i}
      <div class="question-card" class:correct={submitted && results[i].isCorrect} class:incorrect={submitted && !results[i].isCorrect}>
        <h3>{q.question}</h3>
        <div class="options-list">
          {#each q.options as opt, optIdx}
            {@const isSelected = answers[q.id] === optIdx}
            {@const isCorrectAns = q.correctAnswer === optIdx}
            <button
              class="option-btn"
              class:selected={isSelected}
              class:show-correct={submitted && isCorrectAns}
              class:show-incorrect={submitted && isSelected && !isCorrectAns}
              onclick={() => toggleAnswer(q.id, optIdx)}
              disabled={submitted || submitting}
            >
              <div class="option-indicator">
                {#if submitted}
                  {#if isCorrectAns}✓{:else if isSelected}✗{:else}&bull;{/if}
                {:else}
                  {#if isSelected}●{:else}○{/if}
                {/if}
              </div>
              <span class="option-text">{opt}</span>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  {#if !submitted}
    <div class="actions">
      <button class="btn-submit" onclick={handleSubmit} disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar Respuestas'}
      </button>
    </div>
  {:else}
    <div class="actions">
      <a href="/desarrollo-web-1/algoritmia" class="btn-back-home">Volver al Módulo</a>
    </div>
  {/if}
</div>

<style>
  .page {
    padding: 1.5rem 0;
    max-width: 52rem;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-block;
    font-size: 0.85rem;
    color: var(--color-theme-1, #3b82f6);
    text-decoration: none;
    font-weight: 600;
    margin-bottom: 0.75rem;
    transition: opacity 0.2s;
  }

  .back-link:hover { opacity: 0.8; }

  h1 {
    font-size: 2rem;
    margin: 0 0 0.25rem;
    color: #1f2937;
  }

  .page-subtitle {
    color: #888;
    font-size: 0.95rem;
    margin: 0;
  }

  .error-banner {
    background: #fef2f2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-weight: 600;
    font-size: 0.9rem;
    border-left: 4px solid #ef4444;
  }

  .results-banner {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #166534;
  }

  .results-banner h2 { margin: 0 0 1rem; font-size: 1.5rem; }
  .results-banner p { margin: 1rem 0 0; font-weight: 600; }

  .score-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.25rem;
  }

  .score-number { font-size: 3rem; font-weight: 800; color: #15803d; line-height: 1; }
  .score-total { font-size: 1.5rem; font-weight: 700; color: #22c55e; }

  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .question-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border: 2px solid transparent;
  }

  .question-card.correct { border-color: #86efac; background: #fafdfb; }
  .question-card.incorrect { border-color: #fca5a5; background: #fffcfc; }

  .question-card h3 {
    margin: 0 0 1rem;
    font-size: 1.05rem;
    color: #1f2937;
    line-height: 1.5;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .option-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    font-size: 0.95rem;
    color: #374151;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }

  .option-btn:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .option-btn.selected {
    border-color: var(--color-theme-1, #3b82f6);
    background: #eff6ff;
  }

  .option-btn.show-correct {
    background: #f0fdf4 !important;
    border-color: #22c55e !important;
    color: #15803d;
  }

  .option-btn.show-incorrect {
    background: #fef2f2 !important;
    border-color: #ef4444 !important;
    color: #b91c1c;
  }

  .option-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .option-btn:disabled {
    cursor: default;
  }

  .actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }

  .btn-submit {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-submit:hover:not(:disabled) { opacity: 0.9; }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-back-home {
    padding: 0.75rem 2rem;
    border: 2px solid var(--color-theme-1, #3b82f6);
    border-radius: 8px;
    background: white;
    color: var(--color-theme-1, #3b82f6);
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-back-home:hover {
    background: #eff6ff;
  }
</style>
