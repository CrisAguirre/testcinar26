<script lang="ts">
  import { isAuthenticated, currentUser, isAdmin } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { gradesApi } from '$lib/api';

  let grades: any[] = $state([]);
  let loading = $state(true);
  let error = $state('');

  let showDetail = $state(false);
  let detailGrade: any = $state(null);
  let detailData: any = $state(null);

  onMount(async () => {
    if (!$isAuthenticated) return;
    try {
      const data = await gradesApi.getMine();
      grades = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar datos';
    } finally {
      loading = false;
    }
  });

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
    <h1>Bienvenido, {$currentUser?.full_name || $currentUser?.username}</h1>
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
                <tr class="{hasExamData(grade) ? 'clickable-row' : ''}" onclick={hasExamData(grade) ? () => openDetail(grade) : undefined}>
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
      <div class="modal-overlay" onclick={() => showDetail = false}>
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

    <div class="subject-card" onclick={() => window.location.href='/desarrollo-web-1'}>
      <div class="subject-card-inner">
        <div class="subject-icon">&#128218;</div>
        <h2>Desarrollo Web 1</h2>
        <p class="subject-desc">Ingresa a la asignatura para ver tus evaluaciones</p>
        <div class="subject-exams">
          <div class="exam-card" onclick={(e) => { e.stopPropagation(); window.location.href='/desarrollo-web-1/parcial-1'; }}>
            <span class="exam-icon">&#128221;</span>
            <span class="exam-label">Parcial 1</span>
            <span class="exam-arrow">&#8594;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .dashboard {
    padding: 1rem 0;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.35rem;
  }

  .role-badge {
    display: inline-block;
    background: var(--color-theme-2);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0 0 1.5rem;
  }

  .card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .card h2 {
    font-size: 1.15rem;
    margin: 0 0 1rem;
  }

  .loading, .empty, .error {
    text-align: center;
    padding: 2rem;
    color: #888;
  }

  .error {
    color: #dc2626;
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
    border-bottom: 2px solid #e5e7eb;
    font-weight: 700;
    color: #555;
  }

  td {
    padding: 0.6rem 0.85rem;
    border-bottom: 1px solid #e5e7eb;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .clickable-row {
    cursor: pointer;
    transition: background 0.15s;
  }

  .clickable-row:hover {
    background: #f8fafc;
  }

  .detail-link {
    color: var(--color-theme-1, #3b82f6);
    font-weight: 600;
    font-size: 0.8rem;
  }

  .subject-card {
    margin-top: 1.5rem;
    perspective: 1000px;
    animation: fadeInUp 0.6s ease-out;
  }

  .subject-card-inner {
    background: linear-gradient(135deg, var(--color-theme-2), #2c5f8a);
    border-radius: 16px;
    padding: 2rem;
    color: white;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 20px rgba(64, 117, 166, 0.3);
    position: relative;
    overflow: hidden;
  }

  .subject-card-inner::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .subject-card-inner:hover::before {
    opacity: 1;
  }

  .subject-card-inner:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(64, 117, 166, 0.4);
  }

  .subject-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .subject-card h2 {
    font-size: 1.3rem;
    margin: 0 0 0.25rem;
    color: white;
  }

  .subject-desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 1.25rem;
  }

  .subject-exams {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .exam-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
  }

  .exam-card:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(6px);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .exam-icon {
    font-size: 1.3rem;
  }

  .exam-label {
    flex: 1;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .exam-arrow {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
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
    color: #666;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
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
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 0.75rem;
    text-align: center;
  }

  .detail-summary-value {
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--color-theme-1, #3b82f6);
  }

  .detail-summary-label {
    font-size: 0.72rem;
    color: #888;
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
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 1rem;
  }

  .detail-question.open-q {
    border-left: 4px solid #f59e0b;
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
    color: #444;
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
    color: #888;
  }

  .detail-q-result {
    margin-left: auto;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .result-correct { color: #16a34a; }
  .result-incorrect { color: #dc2626; }
  .result-unanswered { color: #9ca3af; }
  .result-graded { color: #16a34a; }
  .result-pending { color: #d97706; }

  .detail-q-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #1f2937;
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
    border: 1px solid #e5e7eb;
  }

  .detail-option.correct {
    background: #f0fdf4;
    border-color: #86efac;
  }

  .detail-option.selected:not(.correct) {
    background: #fef2f2;
    border-color: #fca5a5;
  }

  .detail-option-indicator {
    font-weight: bold;
    width: 16px;
    text-align: center;
  }

  .detail-correct-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: #16a34a;
    margin-left: auto;
  }

  .detail-open-answer {
    margin-top: 0.5rem;
  }

  .detail-open-answer strong {
    font-size: 0.8rem;
    color: #444;
  }

  .detail-student-answer {
    font-size: 0.88rem;
    line-height: 1.5;
    color: #1f2937;
    background: #f9fafb;
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
    color: #444;
  }

  .grade-value {
    font-weight: 800;
    color: var(--color-theme-1, #3b82f6);
    font-size: 1rem;
  }

  .detail-open-pending {
    margin-top: 0.5rem;
    font-size: 0.82rem;
    color: #d97706;
    font-weight: 600;
    padding: 0.4rem 0.65rem;
    background: #fef3c7;
    border-radius: 6px;
    display: inline-block;
  }

  .close-btn {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .close-btn:hover {
    opacity: 0.9;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
