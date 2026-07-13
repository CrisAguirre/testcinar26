<script lang="ts">
  import { isAuthenticated, currentUser, isAdmin } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { gradesApi } from '$lib/api';
  import { preloadedGrades } from '$lib/stores/preloaded';

  let { data } = $props();

  let grades: any[] = $state(data.grades || []);
  let loading = $state(!data.grades || data.grades.length === 0);
  let error = $state('');

  let showForm = $state(false);
  let editingId: string | null = $state(null);
  let formData = $state({ student: '', subject: '', score: 0, max_score: 100, period: '', comments: '' });

  let showReview = $state(false);
  let reviewGrade: any = $state(null);
  let reviewData: any = $state(null);
  let openScores = $state<Record<number, number>>({});
  let savingReview = $state(false);
  let resetting = $state(false);

  onMount(async () => {
    if (!$isAuthenticated) return;
    if (grades.length > 0) { loading = false; return; }
    try {
      grades = await gradesApi.getAll({});
      preloadedGrades.set(grades);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar datos';
    } finally {
      loading = false;
    }
  });

  function openCreate() {
    editingId = null;
    formData = { student: '', subject: '', score: 0, max_score: 100, period: '', comments: '' };
    showForm = true;
  }

  function openEdit(grade: any) {
    editingId = grade._id;
    formData = {
      student: grade.student?._id || grade.student,
      subject: grade.subject,
      score: grade.score,
      max_score: grade.max_score,
      period: grade.period,
      comments: grade.comments || ''
    };
    showForm = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    try {
      if (editingId) {
        await gradesApi.update(editingId, formData);
      } else {
        await gradesApi.create(formData);
      }
      showForm = false;
      grades = await gradesApi.getAll({});
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al guardar';
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta calificación?')) return;
    try {
      await gradesApi.delete(id);
      grades = await gradesApi.getAll({});
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al eliminar';
    }
  }

  function parseExamData(grade: any): any | null {
    if (grade.examData) {
      try {
        return typeof grade.examData === 'string' ? JSON.parse(grade.examData) : grade.examData;
      } catch { return null; }
    }
    return null;
  }

  function hasExamData(grade: any): boolean {
    return !!parseExamData(grade);
  }

  function openReview(grade: any) {
    reviewGrade = grade;
    reviewData = parseExamData(grade);
    openScores = {};

    if (reviewData?.questions) {
      for (const q of reviewData.questions) {
        if (q.type === 'open') {
          if (q.openScore !== null && q.openScore !== undefined) {
            openScores[q.id] = q.openScore;
          } else {
            openScores[q.id] = 0;
          }
        }
      }
    }

    showReview = true;
  }

  function getMcCorrectCount(data: any): number {
    if (!data?.questions) return 0;
    return data.questions.filter((q: any) => q.type === 'mc' && q.isCorrect).length;
  }

  function getMcTotalCount(data: any): number {
    if (!data?.questions) return 0;
    return data.questions.filter((q: any) => q.type === 'mc').length;
  }

  function getOpenTotalCount(data: any): number {
    if (!data?.questions) return 0;
    return data.questions.filter((q: any) => q.type === 'open').length;
  }

  function getTotalOpenScore(): number {
    return Object.values(openScores).reduce((a, b) => a + b, 0);
  }

  function getTotalOpenMax(): number {
    if (!reviewData?.questions) return 0;
    return reviewData.questions
      .filter((q: any) => q.type === 'open')
      .reduce((a: number, q: any) => a + (q.openMaxScore || 5), 0);
  }

  function getOpenReviewedCount(data: any): number {
    if (!data?.questions) return 0;
    return data.questions.filter((q: any) => q.type === 'open' && openScores[q.id] > 0).length;
  }

  async function saveReview() {
    if (!reviewGrade || !reviewData) return;
    savingReview = true;

    try {
      const mcCorrect = getMcCorrectCount(reviewData);
      const mcTotal = getMcTotalCount(reviewData);
      const openScore = getTotalOpenScore();
      const openMax = getTotalOpenMax();

      for (const q of reviewData.questions) {
        if (q.type === 'open') {
          q.openScore = openScores[q.id] || 0;
        }
      }

      const baseComment = reviewGrade.comments?.replace(/\s*\|\s*Revisado.*$/, '') || '';
      const reviewNote = ` | Revisado - Abiertas: ${openScore}/${openMax}`;

      await gradesApi.update(reviewGrade._id, {
        student: reviewGrade.student?._id || reviewGrade.student,
        subject: reviewGrade.subject,
        score: mcCorrect + openScore,
        max_score: mcTotal + openMax,
        period: reviewGrade.period,
        comments: baseComment + reviewNote,
        examData: JSON.stringify(reviewData)
      });

      showReview = false;
      grades = await gradesApi.getAll({});
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al guardar revisión';
    } finally {
      savingReview = false;
    }
  }

  function formatTime(seconds: number): string {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  async function resetAttempts() {
    const examGrades = grades.filter(
      (g: any) => g.subject === 'Desarrollo Web 1 - Parcial 1' && g.student?._id !== $currentUser?.id
    );
    const adminGrade = grades.find(
      (g: any) => g.subject === 'Desarrollo Web 1 - Parcial 1' && g.student?._id === $currentUser?.id
    );
    const toDelete = examGrades.length;
    if (toDelete === 0) {
      if (!confirm('No hay calificaciones de estudiantes para "Desarrollo Web 1 - Parcial 1" en el servidor.')) return;
    } else {
      if (!confirm(`¿Eliminar ${toDelete} calificaciones de estudiantes para "Desarrollo Web 1 - Parcial 1" y reiniciar los intentos? (tu calificación como admin se conserva)`)) return;
    }

    resetting = true;
    try {
      for (const g of examGrades) {
        await gradesApi.delete(g._id);
      }
      localStorage.removeItem('parcial1_attempts');
      localStorage.removeItem('parcial1_details');
      grades = await gradesApi.getAll({});
      alert(`Intentos reiniciados. Se eliminaron ${toDelete} registros del servidor (se conservó ${adminGrade ? '1 registro del administrador' : '0 del administrador'}).`);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al reiniciar intentos';
    } finally {
      resetting = false;
    }
  }
</script>

<svelte:head>
  <title>Calificaciones - Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <div class="header">
    <h1>Gestión de Calificaciones</h1>
    <div class="header-actions">
      {#if $isAdmin}
        <button onclick={resetAttempts} disabled={resetting} class="btn-reset">
          {resetting ? 'Reiniciando...' : '🔄 Reiniciar Intentos Parcial 1'}
        </button>
        <button onclick={openCreate} class="btn-primary">+ Nueva Calificación</button>
      {/if}
    </div>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if showForm && $isAdmin}
    <div class="modal-overlay" onclick={() => showForm = false}>
      <div class="modal" onclick={(e) => e.stopPropagation()}>
        <h2>{editingId ? 'Editar' : 'Nueva'} Calificación</h2>
        <form onsubmit={handleSubmit}>
          <label>Materia <input type="text" bind:value={formData.subject} required /></label>
          <label>Nota <input type="number" bind:value={formData.score} min="0" max={formData.max_score} required /></label>
          <label>Nota Máxima <input type="number" bind:value={formData.max_score} min="1" /></label>
          <label>Período <input type="text" bind:value={formData.period} placeholder="Ej: 2026-1" required /></label>
          <label>Comentarios <textarea bind:value={formData.comments}></textarea></label>
          <div class="form-actions">
            <button type="button" onclick={() => showForm = false} class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  {#if showReview && reviewData && $isAdmin}
    <div class="modal-overlay" onclick={() => showReview = false}>
      <div class="modal modal-wide" onclick={(e) => e.stopPropagation()}>
        <h2>Ver Detalle - {reviewGrade?.subject || 'Examen'}</h2>
        <div class="review-meta">
          <span><strong>Estudiante:</strong> {reviewGrade?.student?.full_name || 'N/A'}</span>
          <span><strong>Intento:</strong> {reviewData.attemptNumber || '—'}</span>
          <span><strong>Tiempo:</strong> {formatTime(reviewData.timeUsed)}</span>
          <span><strong>Cambios pestaña:</strong> {reviewData.tabSwitches || 0}</span>
        </div>

        <div class="review-summary">
          <div class="review-summary-card">
            <div class="review-summary-value">{getMcCorrectCount(reviewData)}/{getMcTotalCount(reviewData)}</div>
            <div class="review-summary-label">Selección múltiple</div>
          </div>
          <div class="review-summary-card">
            <div class="review-summary-value">{getTotalOpenScore()}/{getTotalOpenMax()}</div>
            <div class="review-summary-label">Abiertas {getOpenReviewedCount(reviewData) > 0 ? `(revisadas: ${getOpenReviewedCount(reviewData)})` : '(por revisar)'}</div>
          </div>
          <div class="review-summary-card">
            <div class="review-summary-value">{getMcCorrectCount(reviewData) + getTotalOpenScore()}/{getMcTotalCount(reviewData) + getTotalOpenMax()}</div>
            <div class="review-summary-label">Total</div>
          </div>
        </div>

        <div class="review-questions">
          {#each reviewData.questions as q, i}
            <div class="review-question {q.type === 'open' ? 'open-review' : ''}">
              <div class="review-q-header">
                <span class="review-q-num">Pregunta {i + 1}</span>
                <span class="review-q-badge {q.type === 'mc' ? 'badge-mc' : 'badge-open'}">
                  {q.type === 'mc' ? 'Selección Múltiple' : 'Abierta'}
                </span>
                <span class="review-q-tema">Tema {q.tema}</span>
              </div>
              <p class="review-q-text">{q.question}</p>

              {#if q.type === 'mc'}
                <div class="review-mc-options">
                  {#each q.options as opt, oi}
                    <div class="review-option {q.studentAnswer === oi ? 'review-selected' : ''} {oi === q.correctAnswer ? 'review-correct' : ''}">
                      <span class="review-option-indicator">
                        {#if oi === q.correctAnswer}✓{:else if q.studentAnswer === oi && !q.isCorrect}✗{:else}&bull;{/if}
                      </span>
                      <span>{opt}</span>
                      {#if oi === q.correctAnswer}
                        <span class="review-correct-label">Correcta</span>
                      {/if}
                    </div>
                  {/each}
                </div>
                <div class="review-mc-result">
                  {#if q.isCorrect}
                    <span class="result-correct">✓ Correcta</span>
                  {:else if q.studentAnswer !== undefined && q.studentAnswer !== ''}
                    <span class="result-incorrect">✗ Incorrecta</span>
                  {:else}
                    <span class="result-unanswered">— Sin responder</span>
                  {/if}
                </div>
              {:else}
                <div class="review-open-answer">
                  <strong>Respuesta del estudiante:</strong>
                  <p class="review-student-answer">{q.studentAnswer || '—'}</p>
                </div>
                <div class="review-open-score">
                  <label>
                    Calificación (0-{q.openMaxScore || 5}):
                    <input
                      type="number"
                      min="0"
                      max={q.openMaxScore || 5}
                      bind:value={openScores[q.id]}
                      oninput={() => openScores[q.id] = Math.min(Math.max(Number(openScores[q.id]) || 0, 0), q.openMaxScore || 5)}
                    />
                    <span class="open-max">/ {q.openMaxScore || 5}</span>
                  </label>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <div class="form-actions">
          <button type="button" onclick={() => showReview = false} class="btn-cancel">Cerrar</button>
          <button onclick={saveReview} disabled={savingReview} class="btn-primary">
            {savingReview ? 'Guardando...' : 'Guardar Calificaciones'}
          </button>
        </div>
      </div>
    </div>
  {/if}

  {#if loading}
    <p class="loading">Cargando...</p>
  {:else if grades.length === 0}
    <p class="empty">No hay calificaciones registradas.</p>
  {:else}
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Materia</th>
            <th>Nota</th>
            <th>Máx</th>
            <th>%</th>
            <th>Período</th>
            {#if $isAdmin}<th>Acciones</th>{/if}
          </tr>
        </thead>
        <tbody>
          {#each grades as grade}
            <tr>
              <td>{grade.student?.full_name || 'N/A'}</td>
              <td>{grade.subject}</td>
              <td>{grade.score}</td>
              <td>{grade.max_score}</td>
              <td>{grade.percentage}%</td>
              <td>{grade.period}</td>
              {#if $isAdmin}
                <td class="actions">
                  {#if hasExamData(grade)}
                    <button onclick={() => openReview(grade)} class="btn-sm btn-review">Ver Detalle</button>
                  {/if}
                  <button onclick={() => openEdit(grade)} class="btn-sm">Editar</button>
                  <button onclick={() => handleDelete(grade._id)} class="btn-sm btn-danger">Eliminar</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .page {
    padding: 1rem 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .header h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .btn-reset {
    background: #dc2626;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-reset:hover {
    opacity: 0.9;
  }

  .btn-reset:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading, .empty, .error {
    text-align: center;
    padding: 2rem;
    color: #888;
  }

  .error {
    color: #dc2626;
    background: #fef2f2;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .table-wrapper {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  th {
    text-align: left;
    padding: 0.6rem 0.85rem;
    border-bottom: 2px solid #e5e7eb;
    font-weight: 700;
    color: #555;
  }

  td {
    padding: 0.6rem 0.85rem;
    border-bottom: 1px solid #e5e7eb;
  }

  tr:last-child td { border-bottom: none; }

  .actions {
    display: flex;
    gap: 0.4rem;
  }

  .btn-sm {
    padding: 0.3rem 0.65rem;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 5px;
    font-size: 0.78rem;
    cursor: pointer;
  }

  .btn-sm:hover { background: #f9fafb; }
  .btn-danger { color: #dc2626; border-color: #fca5a5; }
  .btn-danger:hover { background: #fef2f2; }
  .btn-review { color: #1d4ed8; border-color: #93c5fd; }
  .btn-review:hover { background: #eff6ff; }

  .btn-primary {
    padding: 0.6rem 1.2rem;
    background: var(--color-theme-1);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-primary:hover { opacity: 0.9; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-cancel {
    padding: 0.6rem 1.2rem;
    background: none;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 1rem;
  }

  .modal {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-wide {
    max-width: 720px;
  }

  .modal h2 {
    margin: 0 0 1.25rem;
    font-size: 1.2rem;
  }

  .modal form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .modal label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .modal input, .modal textarea {
    padding: 0.55rem 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.95rem;
  }

  .modal input:focus, .modal textarea:focus {
    outline: none;
    border-color: var(--color-theme-1);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .review-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .review-summary {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .review-summary-card {
    flex: 1;
    min-width: 120px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.75rem;
    text-align: center;
  }

  .review-summary-value {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--color-theme-1);
  }

  .review-summary-label {
    font-size: 0.72rem;
    color: #888;
    font-weight: 600;
    margin-top: 0.15rem;
  }

  .review-questions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .review-question {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 1rem;
  }

  .review-question.open-review {
    border-left: 4px solid #f59e0b;
  }

  .review-q-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
    flex-wrap: wrap;
  }

  .review-q-num {
    font-weight: 700;
    font-size: 0.82rem;
    color: #444;
  }

  .review-q-badge {
    padding: 0.15rem 0.5rem;
    border-radius: 12px;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .badge-mc {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .badge-open {
    background: #fef3c7;
    color: #92400e;
  }

  .review-q-tema {
    font-size: 0.72rem;
    color: #888;
  }

  .review-q-text {
    font-size: 0.92rem;
    line-height: 1.5;
    color: #1f2937;
    margin: 0 0 0.75rem;
  }

  .review-mc-options {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .review-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.65rem;
    border-radius: 6px;
    font-size: 0.85rem;
    border: 1px solid #e5e7eb;
  }

  .review-option.review-correct {
    background: #f0fdf4;
    border-color: #86efac;
  }

  .review-option.review-selected:not(.review-correct) {
    background: #fef2f2;
    border-color: #fca5a5;
  }

  .review-option-indicator {
    font-weight: bold;
    width: 16px;
    text-align: center;
  }

  .review-correct-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #16a34a;
    margin-left: auto;
  }

  .review-mc-result {
    margin-top: 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .result-correct { color: #16a34a; }
  .result-incorrect { color: #dc2626; }
  .result-unanswered { color: #9ca3af; }

  .review-open-answer {
    margin-bottom: 0.75rem;
  }

  .review-open-answer strong {
    font-size: 0.82rem;
    color: #444;
  }

  .review-student-answer {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #1f2937;
    background: #f9fafb;
    padding: 0.75rem;
    border-radius: 6px;
    margin: 0.35rem 0 0;
    white-space: pre-wrap;
  }

  .review-open-score label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    font-size: 0.85rem;
    color: #444;
  }

  .review-open-score input {
    width: 70px;
    padding: 0.35rem;
    border: 2px solid #e5e7eb;
    border-radius: 5px;
    font-size: 0.9rem;
    text-align: center;
  }

  .review-open-score input:focus {
    outline: none;
    border-color: var(--color-theme-1);
  }

  .open-max {
    font-weight: 400;
    color: #888;
  }

  @media (max-width: 600px) {
    .page {
      padding: 0.5rem 0;
    }

    .header {
      flex-direction: column;
      gap: 0.75rem;
    }

    .header h1 {
      font-size: 1.2rem;
    }

    .header-actions {
      width: 100%;
    }

    .header-actions button {
      flex: 1;
      text-align: center;
      font-size: 0.78rem;
      padding: 0.5rem 0.75rem;
    }

    .table-wrapper {
      padding: 0.5rem;
    }

    th, td {
      padding: 0.45rem 0.5rem;
      font-size: 0.75rem;
    }

    .actions {
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .actions button {
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
    }

    .modal {
      padding: 1rem;
    }

    .modal-wide {
      max-width: 100%;
    }

    .review-summary-card {
      min-width: 80px;
      padding: 0.5rem;
    }

    .review-summary-value {
      font-size: 1rem;
    }

    .review-question {
      padding: 0.75rem;
    }

    .review-q-header {
      font-size: 0.78rem;
    }

    .review-q-text {
      font-size: 0.85rem;
    }

    .review-option {
      font-size: 0.78rem;
      padding: 0.35rem 0.5rem;
    }

    .review-open-score label {
      flex-wrap: wrap;
      font-size: 0.8rem;
    }

    .review-open-score input {
      width: 60px;
    }

    .review-student-answer {
      font-size: 0.82rem;
      padding: 0.5rem;
    }

    .form-actions {
      flex-wrap: wrap;
    }

    .form-actions button {
      flex: 1;
      text-align: center;
    }
  }
</style>
