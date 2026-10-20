<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentUser } from '$lib/stores/auth';
  import { gradesApi } from '$lib/api';
  import { questionBank } from '$lib/data/parcial1_dw2';
  import {
    DW2_P1_SUBJECT,
    parseExamData,
    getMcStats,
    getOpenQuestions,
    getOpenStats,
    hasPendingOpen,
    getTotals,
    buildGradeUpdate,
    buildReviewComments,
    formatAttemptWindow,
    openMax
  } from '$lib/dw2Review';

  let userRole = $derived($currentUser?.role);
  let canGrade = $derived(
    userRole === 'admin' || userRole === 'coordinator' || userRole === 'teacher'
  );

  let grades = $state<any[]>([]);
  let loading = $state(true);
  let pageError = $state('');
  let notice = $state('');
  let search = $state('');
  let filter = $state<'all' | 'pending' | 'graded'>('all');

  let showReview = $state(false);
  let selected = $state<any>(null);
  let reviewData = $state<any>(null);
  let openScores = $state<Record<number, any>>({});
  let saving = $state(false);
  let saveError = $state('');

  const rubricById = new Map<number, string>(
    questionBank
      .filter((q: any) => q.type === 'open')
      .map((q: any) => [Number(q.id), q.rubric])
  );

  $effect(() => {
    if (!$currentUser) {
      goto('/login');
      return;
    }
    if (!canGrade) goto('/');
  });

  let rows = $derived.by(() =>
    grades.map((grade) => ({ grade, data: parseExamData(grade.examData) }))
  );

  let summary = $derived.by(() => {
    const pending = rows.filter((r) => r.data && hasPendingOpen(r.data)).length;
    const graded = rows.filter((r) => r.data && !hasPendingOpen(r.data)).length;
    const students = new Set(
      rows.map((r) => r.grade.student?._id || r.grade.student || r.grade._id)
    ).size;
    return { total: rows.length, pending, graded, students };
  });

  let filteredRows = $derived.by(() => {
    const q = search.trim().toLowerCase();
    let list = rows;
    if (filter === 'pending') list = list.filter((r) => r.data && hasPendingOpen(r.data));
    if (filter === 'graded') list = list.filter((r) => r.data && !hasPendingOpen(r.data));
    if (q) {
      list = list.filter((r) => {
        const s = r.grade.student;
        return [s?.full_name, s?.username, s?.email]
          .some((value) => String(value || '').toLowerCase().includes(q));
      });
    }
    return [...list].sort((a, b) => {
      const pa = a.data && hasPendingOpen(a.data) ? 0 : 1;
      const pb = b.data && hasPendingOpen(b.data) ? 0 : 1;
      if (filter === 'all' && pa !== pb) return pa - pb;
      const na = a.grade.student?.full_name || '';
      const nb = b.grade.student?.full_name || '';
      if (na !== nb) return na.localeCompare(nb);
      const dateA = new Date(a.data?.submittedAt || a.grade.created_at).getTime();
      const dateB = new Date(b.data?.submittedAt || b.grade.created_at).getTime();
      return dateB - dateA;
    });
  });

  let reviewOpenQuestions = $derived.by(() =>
    reviewData ? getOpenQuestions(reviewData) : []
  );

  let reviewMc = $derived.by(() => getMcStats(reviewData));
  let liveOpen = $derived.by(() => {
    const open = reviewOpenQuestions;
    let score = 0;
    let graded = 0;
    for (const q of open) {
      const value = openScores[q.id];
      if (value === '' || value === null || value === undefined) continue;
      const numeric = Number(value);
      if (Number.isFinite(numeric)) {
        score += Math.min(Math.max(numeric, 0), openMax(q));
        graded++;
      }
    }
    return {
      total: open.length,
      graded,
      pending: open.length - graded,
      score,
      max: open.reduce((sum: number, q: any) => sum + openMax(q), 0)
    };
  });

  async function load() {
    if (!$currentUser) return;
    loading = true;
    pageError = '';
    try {
      const all = await gradesApi.getAll({ subject: DW2_P1_SUBJECT });
      grades = (Array.isArray(all) ? all : []).filter(
        (grade: any) => grade.subject === DW2_P1_SUBJECT
      );
    } catch (error) {
      pageError = error instanceof Error ? error.message : 'No se pudieron cargar los intentos';
    } finally {
      loading = false;
    }
  }

  onMount(load);

  function studentName(grade: any): string {
    return grade.student?.full_name || grade.student?.username || 'N/A';
  }

  function studentHandle(grade: any): string {
    return grade.student?.username || grade.student?.email || '';
  }

  function formatDate(value: unknown): string {
    if (!value) return '—';
    const date = new Date(value as string);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
  }

  function formatDuration(seconds: unknown): string {
    const total = Number(seconds);
    if (!Number.isFinite(total) || total < 0) return '—';
    const minutes = Math.floor(total / 60);
    const rest = Math.floor(total % 60);
    return `${minutes}:${String(rest).padStart(2, '0')}`;
  }

  function percent(score: number, max: number): number {
    return max > 0 ? Math.round((score / max) * 100) : 0;
  }

  function attemptTitle(row: any): string {
    const number = row.data?.attemptNumber;
    return number ? `Intento ${number}` : 'Intento';
  }

  function statusOf(row: any): 'pending' | 'graded' | 'missing' {
    if (!row.data) return 'missing';
    return hasPendingOpen(row.data) ? 'pending' : 'graded';
  }

  function statusLabel(row: any): string {
    const status = statusOf(row);
    if (status === 'missing') return 'Sin respuestas';
    if (status === 'graded') return 'Calificada';
    return `Pendiente (${getOpenStats(row.data).pending})`;
  }

  function openReview(row: any) {
    if (!row.data) return;
    selected = row.grade;
    reviewData = row.data;
    openScores = {};
    for (const q of getOpenQuestions(reviewData)) {
      openScores[q.id] = q.openScore ?? '';
    }
    saveError = '';
    notice = '';
    showReview = true;
  }

  function closeReview() {
    if (saving) return;
    showReview = false;
    selected = null;
    reviewData = null;
    openScores = {};
    saveError = '';
  }

  function clampScore(q: any) {
    const value = openScores[q.id];
    if (value === '' || value === null || value === undefined) {
      openScores[q.id] = '';
      return;
    }
    const number = Number(value);
    openScores[q.id] = Number.isFinite(number)
      ? Math.min(Math.max(number, 0), openMax(q))
      : '';
  }

  function quickScore(q: any, value: number) {
    openScores[q.id] = value;
  }

  function rubricOf(q: any): string {
    return q.rubric || rubricById.get(Number(q.id)) || '';
  }

  function questionPosition(q: any): number | string {
    const index = (reviewData?.questions || []).findIndex(
      (item: any) => Number(item.id) === Number(q.id)
    );
    return index >= 0 ? index + 1 : '—';
  }

  async function saveReview() {
    if (!selected || !reviewData || saving) return;
    const pending = reviewOpenQuestions.filter((q: any) => {
      const value = openScores[q.id];
      if (value === '' || value === null || value === undefined) return true;
      return !Number.isFinite(Number(value));
    });
    if (pending.length > 0) {
      saveError = `Faltan ${pending.length} pregunta(s) por calificar. Asigna una nota de 0 a ${openMax(pending[0])}.`;
      return;
    }

    saving = true;
    saveError = '';
    try {
      const scores: Record<number, number> = {};
      for (const q of reviewOpenQuestions) scores[q.id] = Number(openScores[q.id]);
      const update = buildGradeUpdate(
        reviewData,
        scores,
        $currentUser?.username || $currentUser?.full_name || null
      );

      await gradesApi.update(selected._id, {
        student: selected.student?._id || selected.student,
        subject: selected.subject,
        score: update.score,
        max_score: update.max_score,
        period: selected.period,
        comments: buildReviewComments(selected.comments, update.open.score, update.open.max),
        examData: JSON.stringify(update.examData)
      });

      showReview = false;
      selected = null;
      reviewData = null;
      notice = `Guardado: abiertas ${update.open.score}/${update.open.max} · nota ${update.score}/${update.max_score} (${percent(update.score, update.max_score)}%).`;
      await load();
    } catch (error) {
      saveError = error instanceof Error ? error.message : 'No se pudo guardar la calificación';
    } finally {
      saving = false;
    }
  }
</script>

<svelte:head>
  <title>Calificar abiertas DW2 — Cinar Sistemas</title>
</svelte:head>

<div class="banner">
  <div class="banner-inner">
    <button class="back-link" onclick={() => goto('/admin')}>← Panel administrativo</button>
    <div class="banner-content">
      <span class="banner-icon">📝</span>
      <div>
        <h1>Calificar abiertas — DW2 Parcial 1</h1>
        <p>10 preguntas abiertas (5 pts c/u) + 10 de selección múltiple (1 pt c/u) = 60 pts</p>
      </div>
    </div>
  </div>
</div>

<div class="page">
  <div class="summary-grid">
    <div class="summary-card">
      <span class="summary-value">{summary.total}</span>
      <span class="summary-label">Intentos recibidos</span>
    </div>
    <div class="summary-card summary-pending">
      <span class="summary-value">{summary.pending}</span>
      <span class="summary-label">Pendientes de abiertas</span>
    </div>
    <div class="summary-card summary-done">
      <span class="summary-value">{summary.graded}</span>
      <span class="summary-label">Calificadas</span>
    </div>
    <div class="summary-card">
      <span class="summary-value">{summary.students}</span>
      <span class="summary-label">Estudiantes</span>
    </div>
  </div>

  {#if notice}
    <div class="notice">✅ {notice}</div>
  {/if}
  {#if pageError}
    <div class="error">⚠ {pageError}</div>
  {/if}

  <div class="toolbar">
    <div class="filters">
      <button class="filter-btn" class:active={filter === 'all'} onclick={() => (filter = 'all')}>
        Todas ({summary.total})
      </button>
      <button class="filter-btn" class:active={filter === 'pending'} onclick={() => (filter = 'pending')}>
        Pendientes ({summary.pending})
      </button>
      <button class="filter-btn" class:active={filter === 'graded'} onclick={() => (filter = 'graded')}>
        Calificadas ({summary.graded})
      </button>
    </div>
    <div class="toolbar-right">
      <input
        class="search"
        type="search"
        placeholder="Buscar estudiante…"
        bind:value={search}
      />
      <button class="refresh-btn" onclick={load} disabled={loading}>
        {loading ? 'Cargando…' : '🔄 Actualizar'}
      </button>
    </div>
  </div>

  {#if loading}
    <p class="loading-text">Cargando intentos de Desarrollo Web 2…</p>
  {:else if filteredRows.length === 0}
    <div class="empty">
      <p>No hay intentos que coincidan con el filtro.</p>
      {#if summary.total === 0}
        <p class="empty-hint">Cuando los estudiantes envíen el Parcial 1, aparecerán aquí.</p>
      {/if}
    </div>
  {:else}
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Intento</th>
            <th>Fecha</th>
            <th>MC</th>
            <th>Abiertas</th>
            <th>Nota</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each filteredRows as row (row.grade._id)}
            {@const mc = getMcStats(row.data)}
            {@const open = getOpenStats(row.data)}
            {@const totals = getTotals(row.data)}
            <tr>
              <td>
                <strong>{studentName(row.grade)}</strong>
                <span class="handle">{studentHandle(row.grade)}</span>
              </td>
              <td>
                <span class="attempt-title">{attemptTitle(row)}</span>
                <span class="attempt-window">{formatAttemptWindow(row.data?.submittedAt || row.grade.created_at)}</span>
              </td>
              <td class="nowrap">{formatDate(row.data?.submittedAt || row.grade.created_at)}</td>
              <td class="nowrap">{mc.correct}/{mc.total}</td>
              <td class="nowrap">
                {#if row.data}
                  <strong>{open.graded}/{open.total}</strong>
                  <span class="muted">{open.score}/{open.max} pts</span>
                {:else}
                  <span class="muted">—</span>
                {/if}
              </td>
              <td class="nowrap">
                {#if row.data}
                  <strong>{totals.score}/{totals.max}</strong>
                  <span class="muted">{percent(totals.score, totals.max)}%</span>
                {:else}
                  <span class="muted">—</span>
                {/if}
              </td>
              <td>
                <span class="status {statusOf(row)}">{statusLabel(row)}</span>
              </td>
              <td class="actions">
                {#if row.data}
                  <button class="btn-review" onclick={() => openReview(row)}>
                    {hasPendingOpen(row.data) ? 'Calificar' : 'Revisar'}
                  </button>
                {:else}
                  <span class="missing-hint" title="La calificación no tiene respuestas guardadas">Sin datos</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

{#if showReview && reviewData && selected}
  <div class="modal-overlay" onclick={closeReview} role="presentation">
    <div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <div class="modal-header">
        <div>
          <h2>{studentName(selected)}</h2>
          <p class="modal-subtitle">
            {attemptTitle({ data: reviewData })} · {formatAttemptWindow(reviewData.submittedAt || selected.created_at)}
            · {formatDate(reviewData.submittedAt || selected.created_at)}
            {#if studentHandle(selected)}· {studentHandle(selected)}{/if}
          </p>
        </div>
        <button class="icon-btn" onclick={closeReview} aria-label="Cerrar">✕</button>
      </div>

      <div class="review-summary">
        <div class="review-card">
          <span class="review-value">{reviewMc.correct}/{reviewMc.total}</span>
          <span class="review-label">Selección múltiple</span>
        </div>
        <div class="review-card">
          <span class="review-value">{liveOpen.score}/{liveOpen.max}</span>
          <span class="review-label">Abiertas ({liveOpen.graded}/{liveOpen.total})</span>
        </div>
        <div class="review-card review-total">
          <span class="review-value">{reviewMc.correct + liveOpen.score}/{reviewMc.total + liveOpen.max}</span>
          <span class="review-label">Nota total</span>
        </div>
      </div>

      <div class="review-meta">
        <span><strong>Tiempo:</strong> {formatDuration(reviewData.timeUsed)}</span>
        <span><strong>Cambios de pestaña:</strong> {reviewData.tabSwitches || 0}</span>
        {#if reviewData.review?.reviewedAt}
          <span><strong>Última revisión:</strong> {formatDate(reviewData.review.reviewedAt)}</span>
        {/if}
      </div>

      {#if saveError}
        <div class="error modal-error">⚠ {saveError}</div>
      {/if}

      <div class="open-list">
        {#each reviewOpenQuestions as q, index (q.id)}
          <div class="open-card">
            <div class="open-head">
              <div>
                <span class="open-number">Pregunta {questionPosition(q)}</span>
                <span class="open-tema">Tema {q.tema || '—'}</span>
              </div>
              <span class="open-points">{openMax(q)} pts</span>
            </div>

            <p class="open-question">{q.question}</p>

            {#if rubricOf(q)}
              <div class="rubric">
                <span class="rubric-label">Criterio de calificación</span>
                <p>{rubricOf(q)}</p>
              </div>
            {/if}

            <div class="student-answer">
              <span class="answer-label">Respuesta del estudiante</span>
              {#if q.studentAnswer !== undefined && q.studentAnswer !== null && String(q.studentAnswer).trim() !== ''}
                <p>{q.studentAnswer}</p>
              {:else}
                <p class="no-answer">Sin respuesta</p>
              {/if}
            </div>

            <div class="score-row">
              <label>
                Nota
                <input
                  type="number"
                  min="0"
                  max={openMax(q)}
                  step="0.5"
                  bind:value={openScores[q.id]}
                  onblur={() => clampScore(q)}
                />
                <span class="score-max">/ {openMax(q)}</span>
              </label>
              <div class="quick-scores">
                {#each [0, 1, 2, 3, 4, 5] as value}
                  <button
                    type="button"
                    class="quick-btn"
                    class:active={openScores[q.id] === value}
                    onclick={() => quickScore(q, value)}
                  >
                    {value}
                  </button>
                {/each}
              </div>
              <span class="question-index">{index + 1} de {reviewOpenQuestions.length}</span>
            </div>
          </div>
        {/each}
      </div>

      <div class="modal-footer">
        <div class="footer-summary">
          <span>Abiertas: <strong>{liveOpen.score}/{liveOpen.max}</strong></span>
          <span>Total: <strong>{reviewMc.correct + liveOpen.score}/{reviewMc.total + liveOpen.max}</strong></span>
          {#if liveOpen.pending > 0}
            <span class="pending-note">Faltan {liveOpen.pending} por calificar</span>
          {/if}
        </div>
        <div class="footer-actions">
          <button class="btn-cancel" onclick={closeReview} disabled={saving}>Cancelar</button>
          <button class="btn-save" onclick={saveReview} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar calificación'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .banner {
    background: linear-gradient(135deg, #8b5cf6, #6d28d9 55%, #4c1d95);
    color: white;
    padding: 1.5rem 1rem 2rem;
    margin-left: calc(-50vw + 50%);
    width: 100vw;
  }

  .banner-inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  .back-link {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    margin-bottom: 0.9rem;
  }

  .back-link:hover { color: white; }

  .banner-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .banner-icon { font-size: 2.4rem; }

  .banner h1 {
    margin: 0;
    font-size: 1.45rem;
    letter-spacing: -0.02em;
  }

  .banner p {
    margin: 0.25rem 0 0;
    color: rgba(255, 255, 255, 0.78);
    font-size: 0.85rem;
  }

  .page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1.5rem 1rem 3rem;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .summary-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  }

  .summary-value {
    font-size: 1.5rem;
    font-weight: 800;
    color: #4c1d95;
  }

  .summary-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 600;
  }

  .summary-pending .summary-value { color: #b45309; }
  .summary-done .summary-value { color: #15803d; }

  .notice,
  .error {
    border-radius: 8px;
    padding: 0.7rem 1rem;
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .notice {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  }

  .error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  .filters { display: flex; gap: 0.4rem; flex-wrap: wrap; }

  .filter-btn,
  .refresh-btn {
    border: 1px solid #e5e7eb;
    background: white;
    color: #374151;
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
  }

  .filter-btn.active {
    background: #f3e8ff;
    border-color: #c4b5fd;
    color: #6d28d9;
  }

  .filter-btn:hover, .refresh-btn:hover { background: #f9fafb; }
  .refresh-btn:disabled { opacity: 0.6; cursor: wait; }

  .toolbar-right { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }

  .search {
    border: 1px solid #e5e7eb;
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    font-size: 0.82rem;
    min-width: 210px;
  }

  .search:focus { outline: 2px solid #c4b5fd; border-color: transparent; }

  .loading-text, .empty {
    text-align: center;
    color: #6b7280;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 2.5rem 1rem;
  }

  .empty-hint { font-size: 0.82rem; color: #9ca3af; margin-top: 0.4rem; }

  .table-wrapper {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    overflow-x: auto;
  }

  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }

  th {
    text-align: left;
    padding: 0.7rem 0.8rem;
    border-bottom: 2px solid #e5e7eb;
    color: #6b7280;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  td {
    padding: 0.7rem 0.8rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  tbody tr:last-child td { border-bottom: none; }
  tbody tr:hover { background: #fcfcfd; }

  td strong { display: block; color: #111827; }
  .handle { display: block; color: #9ca3af; font-size: 0.72rem; margin-top: 0.1rem; }
  .muted { display: block; color: #9ca3af; font-size: 0.72rem; margin-top: 0.1rem; }
  .nowrap { white-space: nowrap; }

  .attempt-title { display: block; font-weight: 600; color: #374151; }
  .attempt-window { display: block; color: #9ca3af; font-size: 0.72rem; }

  .status {
    display: inline-block;
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .status.pending { background: #fef3c7; color: #92400e; }
  .status.graded { background: #dcfce7; color: #166534; }
  .status.missing { background: #f1f5f9; color: #64748b; }

  .actions { text-align: right; }

  .btn-review {
    border: 1px solid #c4b5fd;
    background: #f5f3ff;
    color: #6d28d9;
    padding: 0.35rem 0.7rem;
    border-radius: 7px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-review:hover { background: #ede9fe; }

  .missing-hint { color: #9ca3af; font-size: 0.75rem; cursor: help; }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 100;
  }

  .modal {
    background: #f8fafc;
    border-radius: 14px;
    width: min(900px, 100%);
    max-height: 92vh;
    overflow-y: auto;
    padding: 1.5rem;
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .modal-header h2 { margin: 0; font-size: 1.25rem; color: #111827; }
  .modal-subtitle { margin: 0.2rem 0 0; font-size: 0.8rem; color: #6b7280; }

  .icon-btn {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    color: #6b7280;
    flex-shrink: 0;
  }

  .icon-btn:hover { background: #f3f4f6; }

  .review-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.6rem;
    margin-bottom: 0.75rem;
  }

  .review-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 0.6rem;
    text-align: center;
  }

  .review-total { border-color: #c4b5fd; background: #faf5ff; }
  .review-value { display: block; font-size: 1.15rem; font-weight: 800; color: #4c1d95; }
  .review-label { display: block; font-size: 0.7rem; color: #6b7280; font-weight: 600; margin-top: 0.1rem; }

  .review-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    font-size: 0.78rem;
    color: #6b7280;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-error { margin-bottom: 0.75rem; }

  .open-list { display: flex; flex-direction: column; gap: 0.85rem; }

  .open-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem;
  }

  .open-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .open-number { font-weight: 800; color: #4c1d95; font-size: 0.9rem; }
  .open-tema { color: #9ca3af; font-size: 0.72rem; margin-left: 0.45rem; }

  .open-points {
    background: #f3e8ff;
    color: #6d28d9;
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .open-question {
    font-size: 0.92rem;
    line-height: 1.5;
    color: #1f2937;
    margin: 0 0 0.6rem;
  }

  .rubric {
    background: #f8fafc;
    border-left: 3px solid #c4b5fd;
    border-radius: 0 6px 6px 0;
    padding: 0.5rem 0.65rem;
    margin-bottom: 0.6rem;
  }

  .rubric-label {
    display: block;
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #7c3aed;
    margin-bottom: 0.15rem;
  }

  .rubric p { margin: 0; font-size: 0.8rem; color: #475569; line-height: 1.4; }

  .answer-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    color: #6b7280;
    margin-bottom: 0.2rem;
  }

  .student-answer {
    background: #f9fafb;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
    padding: 0.65rem;
    margin-bottom: 0.6rem;
  }

  .student-answer p {
    margin: 0;
    font-size: 0.87rem;
    line-height: 1.5;
    color: #1f2937;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .no-answer { color: #9ca3af !important; font-style: italic; }

  .score-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .score-row label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: #374151;
  }

  .score-row input {
    width: 68px;
    padding: 0.35rem;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    text-align: center;
    font-size: 0.9rem;
  }

  .score-row input:focus { outline: none; border-color: #8b5cf6; }
  .score-max { color: #9ca3af; font-weight: 500; }

  .quick-scores { display: flex; gap: 0.25rem; flex-wrap: wrap; }

  .quick-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #4b5563;
    cursor: pointer;
  }

  .quick-btn:hover { background: #f9fafb; }
  .quick-btn.active { background: #6d28d9; border-color: #6d28d9; color: white; }

  .question-index { margin-left: auto; font-size: 0.7rem; color: #9ca3af; }

  .modal-footer {
    position: sticky;
    bottom: -1.5rem;
    background: #f8fafc;
    margin: 1rem -1.5rem -1.5rem;
    padding: 0.9rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .footer-summary { display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.82rem; color: #4b5563; }
  .footer-summary strong { color: #111827; }
  .pending-note { color: #b45309; font-weight: 700; }

  .footer-actions { display: flex; gap: 0.5rem; }

  .btn-cancel, .btn-save {
    border-radius: 8px;
    padding: 0.55rem 1rem;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-cancel { background: white; border: 1px solid #e5e7eb; color: #374151; }
  .btn-save { background: #6d28d9; border: 1px solid #6d28d9; color: white; }
  .btn-save:hover { background: #5b21b6; }
  .btn-save:disabled, .btn-cancel:disabled { opacity: 0.6; cursor: wait; }

  @media (max-width: 780px) {
    .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .banner-content { align-items: flex-start; }
    .banner h1 { font-size: 1.15rem; }
    .modal { padding: 1rem; }
    .modal-footer { margin: 1rem -1rem -1rem; padding: 0.8rem 1rem; bottom: -1rem; }
    .question-index { width: 100%; margin-left: 0; }
  }

  @media (max-width: 520px) {
    .summary-grid { grid-template-columns: 1fr 1fr; }
    .toolbar-right { width: 100%; }
    .search { flex: 1; min-width: 0; }
    .review-summary { grid-template-columns: 1fr; }
    .modal { max-height: 96vh; }
  }
</style>
