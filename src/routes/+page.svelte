<script lang="ts">
  import { isAuthenticated, currentUser, isAdmin } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { gradesApi } from '$lib/api';
  import { goto } from '$app/navigation';
  import { preloadedMyGrades } from '$lib/stores/preloaded';
  import SubjectCard from '$lib/components/SubjectCard.svelte';

  let { data } = $props();

  let grades: any[] = $state(data.grades || []);
  let loading = $state(!data.grades || data.grades.length === 0);
  let error = $state('');

  let showDetail = $state(false);
  let detailGrade: any = $state(null);
  let detailData: any = $state(null);

  onMount(async () => {
    if (!$isAuthenticated) {
      goto('/login');
      return;
    }
    if (grades.length > 0) { loading = false; return; }
    try {
      const result = await gradesApi.getMine();
      grades = result;
      preloadedMyGrades.set(result);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar datos';
    } finally {
      loading = false;
    }
  });

  function handleRowKeydown(e: KeyboardEvent, grade: any) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(grade);
    }
  }

  function handleOverlayKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') showDetail = false;
  }

  function parseExamData(grade: any): any | null {
    if (!grade.examData) return null;
    try {
      return typeof grade.examData === 'string' ? JSON.parse(grade.examData) : grade.examData;
    } catch { return null; }
  }

  function hasExamData(grade: any): boolean {
    return !!parseExamData(grade);
  }

  function openDetail(grade: any) {
    detailGrade = grade;
    detailData = parseExamData(grade);
    showDetail = true;
  }

  function getAttemptType(n: number): string {
    return n <= 2 ? 'Preparación' : 'Evaluación';
  }

  function formatTime(seconds: number): string {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function getMcCorrect(data: any): number {
    return data?.questions?.filter((q: any) => q.type === 'mc' && q.isCorrect).length || 0;
  }

  function getMcTotal(data: any): number {
    return data?.questions?.filter((q: any) => q.type === 'mc').length || 0;
  }

  function getOpenReviewed(data: any): number {
    return data?.questions?.filter((q: any) => q.type === 'open' && q.openScore !== null && q.openScore !== undefined).length || 0;
  }

  function getOpenTotal(data: any): number {
    return data?.questions?.filter((q: any) => q.type === 'open').length || 0;
  }

  function getOpenScoreSum(data: any): number {
    return data?.questions?.filter((q: any) => q.type === 'open' && q.openScore !== null && q.openScore !== undefined)
      .reduce((a: number, q: any) => a + q.openScore, 0) || 0;
  }

  function getOpenMax(data: any): number {
    return data?.questions?.filter((q: any) => q.type === 'open')
      .reduce((a: number, q: any) => a + (q.openMaxScore || 5), 0) || 0;
  }
</script>

<svelte:head>
  <title>Inicio - Cinar Sistemas</title>
</svelte:head>

{#if $isAuthenticated}
  <div class="dashboard">
    <h1>Bienvenid@, {$currentUser?.full_name || $currentUser?.username}</h1>
    <p class="role-badge">Rol: {$currentUser?.role}</p>

    <div class="card">
      <h2>Mis Calificaciones</h2>

      {#if loading}
        <p class="loading">Cargando...</p>
      {:else if error}
        <p class="error">{error}</p>
      {:else if grades.length === 0}
        <p class="empty">No hay calificaciones registradas.</p>
      {:else}
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Materia</th>
                <th>Nota</th>
                <th>Máximo</th>
                <th>Porcentaje</th>
                <th>Período</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each grades as grade}
                <tr class="{hasExamData(grade) ? 'clickable-row' : ''}" onclick={hasExamData(grade) ? () => openDetail(grade) : undefined} onkeydown={hasExamData(grade) ? (e: KeyboardEvent) => handleRowKeydown(e, grade) : undefined} tabindex={hasExamData(grade) ? 0 : undefined} role={hasExamData(grade) ? 'button' : undefined}>
                  <td>{grade.subject}</td>
                  <td>{grade.score}</td>
                  <td>{grade.max_score}</td>
                  <td>{grade.percentage}%</td>
                  <td>{grade.period}</td>
                  <td>
                    {#if hasExamData(grade)}
                      <span class="detail-link">Ver detalle →</span>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>

    {#if showDetail && detailData}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div class="modal-overlay" onclick={() => showDetail = false} onkeydown={handleOverlayKeydown} tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal modal-wide" onclick={(e) => e.stopPropagation()}>
          <h2>{detailGrade.subject}</h2>
          <div class="detail-meta">
            <span><strong>Intento:</strong> {detailData.attemptNumber || '—'} ({getAttemptType(detailData.attemptNumber)})</span>
            <span><strong>Tiempo usado:</strong> {formatTime(detailData.timeUsed)}</span>
            <span><strong>Cambios de pestaña:</strong> {detailData.tabSwitches || 0}</span>
          </div>

          <div class="detail-summary">
            <div class="detail-summary-card">
              <div class="detail-summary-value">{getMcCorrect(detailData)}/{getMcTotal(detailData)}</div>
              <div class="detail-summary-label">Selección múltiple</div>
            </div>
            <div class="detail-summary-card">
              <div class="detail-summary-value">
                {#if getOpenTotal(detailData) > 0}
                  {getOpenReviewed(detailData)}/{getOpenTotal(detailData)}
                {:else}
                  —
                {/if}
              </div>
              <div class="detail-summary-label">
                {#if getOpenReviewed(detailData) === getOpenTotal(detailData) && getOpenTotal(detailData) > 0}
                  Abiertas (revisadas: {getOpenScoreSum(detailData)}/{getOpenMax(detailData)})
                {:else if getOpenTotal(detailData) > 0}
                  Abiertas (por revisar)
                {:else}
                  Sin abiertas
                {/if}
              </div>
            </div>
            <div class="detail-summary-card">
              <div class="detail-summary-value">{detailGrade.score}/{detailGrade.max_score}</div>
              <div class="detail-summary-label">Total</div>
            </div>
          </div>

          <div class="detail-questions">
            {#each detailData.questions as q, i}
              <div class="detail-question {q.type === 'open' ? 'open-q' : ''}">
                <div class="detail-q-header">
                  <span class="detail-q-num">Pregunta {i + 1}</span>
                  <span class="detail-q-badge {q.type === 'mc' ? 'badge-mc' : 'badge-open'}">
                    {q.type === 'mc' ? 'Selección Múltiple' : 'Abierta'}
                  </span>
                  <span class="detail-q-tema">Tema {q.tema}</span>
                  <span class="detail-q-result">
                    {#if q.type === 'mc'}
                      {#if q.isCorrect}
                        <span class="result-correct">✓ Correcto</span>
                      {:else if q.studentAnswer !== undefined && q.studentAnswer !== ''}
                        <span class="result-incorrect">✗ Incorrecto</span>
                      {:else}
                        <span class="result-unanswered">— Sin responder</span>
                      {/if}
                    {:else}
                      {#if q.openScore !== null && q.openScore !== undefined}
                        <span class="result-graded">Calificado: {q.openScore}/{q.openMaxScore || 5}</span>
                      {:else}
                        <span class="result-pending">⏳ Pendiente</span>
                      {/if}
                    {/if}
                  </span>
                </div>
                <p class="detail-q-text">{q.question}</p>

                {#if q.type === 'mc'}
                  <div class="detail-mc-options">
                    {#each q.options as opt, oi}
                      <div class="detail-option {q.studentAnswer === oi ? 'selected' : ''} {oi === q.correctAnswer ? 'correct' : ''}">
                        <span class="detail-option-indicator">
                          {#if oi === q.correctAnswer}✓{:else if q.studentAnswer === oi && !q.isCorrect}✗{:else}&bull;{/if}
                        </span>
                        <span>{opt}</span>
                        {#if oi === q.correctAnswer}
                          <span class="detail-correct-label">Correcta</span>
                        {/if}
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="detail-open-answer">
                    <strong>Tu respuesta:</strong>
                    <p class="detail-student-answer">{q.studentAnswer || '—'}</p>
                  </div>
                  {#if q.openScore !== null && q.openScore !== undefined}
                    <div class="detail-open-graded">
                      <strong>Calificación del profesor:</strong>
                      <span class="grade-value">{q.openScore}/{q.openMaxScore || 5}</span>
                    </div>
                  {:else}
                    <div class="detail-open-pending">
                      ⏳ Pendiente de revisión por el administrador
                    </div>
                  {/if}
                {/if}
              </div>
            {/each}
          </div>

          <button onclick={() => showDetail = false} class="close-btn">Cerrar</button>
        </div>
      </div>
    {/if}

    <div class="subject-section">
      <SubjectCard
        icon="📚"
        title="Desarrollo Web 1"
        description="Accede a tus contenidos y evaluaciones"
        href="/desarrollo-web-1"
      />
    </div>
  </div>
{/if}

<style>
  .dashboard {
    padding: 1rem 0;
  }

  .subject-section {
    margin-top: 2rem;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.35rem;
  }

  .role-badge {
    display: inline-block;
    background: var(--color-primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0 0 1.5rem;
  }

  .card {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
  }

  .card h2 {
    font-size: 1.15rem;
    margin: 0 0 1rem;
  }

  .loading, .empty {
    text-align: center;
    padding: 2rem;
    color: var(--color-text-muted);
  }

  .error {
    text-align: center;
    padding: 2rem;
    color: var(--color-error);
  }

  .table-wrapper {
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
    border-bottom: 2px solid var(--color-border);
    font-weight: 700;
    color: var(--color-text-secondary);
  }

  td {
    padding: 0.6rem 0.85rem;
    border-bottom: 1px solid var(--color-border);
  }

  tr:last-child td {
    border-bottom: none;
  }

  .clickable-row {
    cursor: pointer;
    transition: background 0.15s;
  }

  .clickable-row:hover {
    background: var(--color-surface-hover);
  }

  .detail-link {
    color: var(--color-accent);
    font-weight: 600;
    font-size: 0.8rem;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, var(--color-text-primary) 40%, transparent);
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
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-wide {
    max-width: 720px;
  }

  .modal h2 {
    margin: 0 0 0.75rem;
    font-size: 1.2rem;
  }

  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .detail-summary {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .detail-summary-card {
    flex: 1;
    min-width: 120px;
    background: var(--color-surface-hover);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 0.75rem;
    text-align: center;
  }

  .detail-summary-value {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--color-accent);
  }

  .detail-summary-label {
    font-size: 0.72rem;
    color: var(--color-text-muted);
    font-weight: 600;
    margin-top: 0.15rem;
  }

  .detail-questions {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 1rem;
  }

  .detail-question {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1rem;
  }

  .detail-question.open-q {
    border-left: 4px solid var(--color-warning);
  }

  .detail-q-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .detail-q-num {
    font-weight: 700;
    font-size: 0.82rem;
    color: var(--color-text-secondary);
  }

  .detail-q-badge {
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

  .detail-q-tema {
    font-size: 0.72rem;
    color: var(--color-text-muted);
  }

  .detail-q-result {
    margin-left: auto;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .result-correct { color: var(--color-success); }
  .result-incorrect { color: var(--color-error); }
  .result-unanswered { color: var(--color-text-secondary); }
  .result-graded { color: var(--color-success); }
  .result-pending { color: var(--color-warning); }

  .detail-q-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--color-text-primary);
    margin: 0 0 0.65rem;
  }

  .detail-mc-options {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .detail-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    font-size: 0.82rem;
    border: 1px solid var(--color-border);
  }

  .detail-option.correct {
    background: color-mix(in srgb, var(--color-success) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-success) 40%, transparent);
  }

  .detail-option.selected:not(.correct) {
    background: color-mix(in srgb, var(--color-error) 10%, transparent);
    border-color: color-mix(in srgb, var(--color-error) 40%, transparent);
  }

  .detail-option-indicator {
    font-weight: bold;
    width: 16px;
    text-align: center;
  }

  .detail-correct-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--color-success);
    margin-left: auto;
  }

  .detail-open-answer {
    margin-top: 0.5rem;
  }

  .detail-open-answer strong {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }

  .detail-student-answer {
    font-size: 0.88rem;
    line-height: 1.5;
    color: var(--color-text-primary);
    background: var(--color-surface-alt);
    padding: 0.65rem;
    border-radius: 6px;
    margin: 0.3rem 0 0;
    white-space: pre-wrap;
  }

  .detail-open-graded {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .detail-open-graded strong {
    color: var(--color-text-secondary);
  }

  .grade-value {
    font-weight: 800;
    color: var(--color-accent);
    font-size: 1rem;
  }

  .detail-open-pending {
    margin-top: 0.5rem;
    font-size: 0.82rem;
    color: var(--color-warning);
    font-weight: 600;
    padding: 0.4rem 0.65rem;
    background: #fef3c7;
    border-radius: var(--radius-sm);
    display: inline-block;
  }

  .close-btn {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .close-btn:hover {
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    .dashboard {
      padding: 0.5rem 0;
    }

    h1 {
      font-size: 1.2rem;
    }

    .card {
      padding: 1rem;
    }

    th, td {
      padding: 0.5rem;
      font-size: 0.78rem;
    }

    .modal {
      padding: 1rem;
    }

    .detail-summary-card {
      min-width: 90px;
      padding: 0.5rem;
    }

    .detail-summary-value {
      font-size: 1rem;
    }

    .detail-question {
      padding: 0.75rem;
    }

    .detail-q-header {
      font-size: 0.78rem;
    }

    .detail-q-result {
      width: 100%;
      margin-left: 0;
      margin-top: 0.3rem;
    }

    .detail-option {
      font-size: 0.78rem;
      padding: 0.35rem 0.5rem;
    }
  }
</style>
