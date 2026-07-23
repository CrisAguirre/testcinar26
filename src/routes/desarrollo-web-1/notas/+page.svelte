<script lang="ts">
  import { isAuthenticated, isAdmin, currentUser } from '$lib/stores/auth';
  import { gradesApi } from '$lib/api';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  interface StudentRow {
    name: string;
    score: number | null;
    max: number | null;
    pct: number | null;
    scale5: number | null;
  }

  let students = $state<StudentRow[]>([]);
  let loading = $state(true);
  let error = $state('');

  async function loadGrades() {
    loading = true;
    error = '';
    try {
      const all = await gradesApi.getAll({});
      const examGrades = all.filter((g: any) => g.subject === 'Desarrollo Web 1 - Parcial 1');

      const byStudent: Record<string, any[]> = {};
      for (const g of examGrades) {
        const name = g.student?.full_name || 'Unknown';
        if (!byStudent[name]) byStudent[name] = [];
        byStudent[name].push(g);
      }

      const rows: StudentRow[] = [];
      for (const [name, entries] of Object.entries(byStudent)) {
        entries.sort((a: any, b: any) => new Date(b.created_at || b.createdAt || 0).getTime() - new Date(a.created_at || a.createdAt || 0).getTime());
        const last = entries[0];
        const score = last.score;
        const max = last.max_score;
        const pct = max > 0 ? parseFloat(((score / max) * 100).toFixed(1)) : null;
        const scale5 = max > 0 ? parseFloat(((score / max) * 5).toFixed(2)) : null;
        rows.push({ name, score, max, pct, scale5 });
      }

      rows.sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));

      students = rows;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar datos';
    } finally {
      loading = false;
    }
  }

  onMount(loadGrades);

  function pctClass(pct: number | null): string {
    if (pct === null) return '';
    if (pct >= 90) return 'pct-high';
    if (pct >= 70) return 'pct-mid';
    return 'pct-low';
  }

  function scaleClass(val: number | null): string {
    if (val === null) return '';
    if (val >= 4.5) return 'scale-high';
    if (val >= 3.5) return 'scale-mid';
    return 'scale-low';
  }

  let avgPct = $derived(students.length > 0 ? students.reduce((s, r) => s + (r.pct ?? 0), 0) / students.length : 0);
  let avgScale = $derived(students.length > 0 ? students.reduce((s, r) => s + (r.scale5 ?? 0), 0) / students.length : 0);
  let presented = $derived(students.filter(s => s.score !== null).length);
</script>

<svelte:head>
  <title>Notas - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/desarrollo-web-1')}>
    <span>←</span> Volver a Desarrollo Web 1
  </button>

  <div class="header">
    <span class="header-icon">📊</span>
    <h1>Notas — Parcial 1</h1>
    <p class="header-desc">Resultados finales del Parcial 1 de Desarrollo Web 1</p>
    {#if $isAdmin}
      <button onclick={loadGrades} class="refresh-btn" disabled={loading}>
        {loading ? 'Cargando...' : '🔄 Actualizar'}
      </button>
    {/if}
  </div>

  {#if loading}
    <p class="loading-text">Cargando calificaciones...</p>
  {:else if error}
    <div class="error-msg">⚠ {error}</div>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th class="col-name">Estudiante</th>
            <th class="col-score">Puntaje</th>
            <th class="col-pct">Porcentaje</th>
            <th class="col-scale">Escala 0-5</th>
          </tr>
        </thead>
        <tbody>
          {#each students as s, i}
            <tr class="{s.score === null ? 'row-missing' : ''} {i % 2 === 0 ? 'row-even' : 'row-odd'}">
              <td class="col-num">{i + 1}</td>
              <td class="col-name">{s.name}</td>
              <td class="col-score">
                {#if s.score !== null}
                  <span class="score-value">{s.score}</span>
                  <span class="score-divider">/</span>
                  <span class="score-max">{s.max}</span>
                {:else}
                  <span class="missing">—</span>
                {/if}
              </td>
              <td class="col-pct">
                {#if s.pct !== null}
                  <span class="pct-badge {pctClass(s.pct)}">{s.pct}%</span>
                {:else}
                  <span class="missing">No presentó</span>
                {/if}
              </td>
              <td class="col-scale">
                {#if s.scale5 !== null}
                  <span class="scale-badge {scaleClass(s.scale5)}">{s.scale5.toFixed(2)}</span>
                {:else}
                  <span class="missing">—</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="summary-bar">
      <div class="summary-item">
        <span class="summary-label">Presentaron</span>
        <span class="summary-value">{presented}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">No presentaron</span>
        <span class="summary-value">{students.length - presented}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Promedio grupo</span>
        <span class="summary-value highlight">{avgPct.toFixed(1)}%</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Promedio escala</span>
        <span class="summary-value highlight">{avgScale.toFixed(2)}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
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

  .header {
    text-align: center;
    margin-bottom: 2rem;
    position: relative;
  }

  .header-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
  }

  .header-desc {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .refresh-btn {
    margin-top: 0.75rem;
    padding: 0.4rem 1rem;
    background: var(--color-accent, #ff3e00);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .refresh-btn:hover { opacity: 0.9; }
  .refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .loading-text, .error-msg {
    text-align: center;
    padding: 2rem;
    font-size: 0.95rem;
  }

  .error-msg {
    color: #dc2626;
    background: #fef2f2;
    border-radius: 8px;
  }

  .table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  thead th {
    background: #1e3a5f;
    color: white;
    padding: 0.85rem 1rem;
    font-weight: 700;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-align: left;
  }

  tbody td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f1f5f9;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .row-even td { background: #f8fafc; }
  .row-odd td { background: white; }
  .row-missing td { opacity: 0.7; }

  .col-num { width: 40px; text-align: center; color: #94a3b8; font-weight: 600; }
  .col-name { font-weight: 600; color: #1e293b; }
  .col-score { text-align: center; }

  .score-value { font-weight: 800; font-size: 1.05rem; color: #1d4ed8; }
  .score-divider { color: #94a3b8; margin: 0 2px; }
  .score-max { color: #64748b; font-weight: 600; }

  .col-pct { text-align: center; }

  .pct-badge {
    display: inline-block;
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .pct-high { background: #dcfce7; color: #16a34a; }
  .pct-mid { background: #fef3c7; color: #d97706; }
  .pct-low { background: #fef2f2; color: #dc2626; }

  .col-scale { text-align: center; }

  .scale-badge {
    display: inline-block;
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .scale-high { background: #dcfce7; color: #16a34a; }
  .scale-mid { background: #fef3c7; color: #d97706; }
  .scale-low { background: #fef2f2; color: #dc2626; }

  .missing { color: #94a3b8; font-style: italic; font-size: 0.85rem; }

  .summary-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }

  .summary-item {
    background: white;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }

  .summary-label {
    display: block;
    font-size: 0.72rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 0.3rem;
  }

  .summary-value {
    display: block;
    font-size: 1.3rem;
    font-weight: 800;
    color: #1e293b;
  }

  .summary-value.highlight { color: #1d4ed8; }

  @media (max-width: 640px) {
    table { font-size: 0.78rem; }
    thead th, tbody td { padding: 0.5rem 0.6rem; }
    .summary-bar { grid-template-columns: repeat(2, 1fr); }
    .col-scale { display: none; }
  }
</style>
