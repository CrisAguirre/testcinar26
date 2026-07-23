<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const students = [
    { name: 'DAVID ALEJANDRO GARCIA ENRIQUEZ', score: 48, max: 48, pct: 100.0, scale5: 5.00 },
    { name: 'JAIRO DANIEL ZAMBRANO VALLEID', score: 39, max: 40, pct: 97.5, scale5: 4.88 },
    { name: 'HAROLD ESTEBAN QUIROZ ALVAREZ', score: 29, max: 32, pct: 90.6, scale5: 4.53 },
    { name: 'WILLIAM DAVID SALAS LASSO', score: 21, max: 24, pct: 87.5, scale5: 4.38 },
    { name: 'ANDRES FELIPE MEZA LEON', score: 39, max: 44, pct: 88.6, scale5: 4.43 },
    { name: 'DIEGO SEBASTIAN AZAIN MORAN', score: 19, max: 24, pct: 79.2, scale5: 3.96 },
    { name: 'JEISON STIVEN MARTINEZ ZAMBRA', score: 27, max: 40, pct: 67.5, scale5: 3.38 }
  ];

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
  </div>

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
      <span class="summary-value">7</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">No presentaron</span>
      <span class="summary-value">0</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Promedio grupo</span>
      <span class="summary-value highlight">{(100.0 + 97.5 + 90.6 + 87.5 + 88.6 + 79.2 + 67.5) / 7}%</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Promedio escala</span>
      <span class="summary-value highlight">{(5.00 + 4.88 + 4.53 + 4.38 + 4.43 + 3.96 + 3.38) / 7}</span>
    </div>
  </div>
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

  .row-even td {
    background: #f8fafc;
  }

  .row-odd td {
    background: white;
  }

  .row-missing td {
    opacity: 0.7;
  }

  .col-num {
    width: 40px;
    text-align: center;
    color: #94a3b8;
    font-weight: 600;
  }

  .col-name {
    font-weight: 600;
    color: #1e293b;
  }

  .col-score {
    text-align: center;
  }

  .score-value {
    font-weight: 800;
    font-size: 1.05rem;
    color: #1d4ed8;
  }

  .score-divider {
    color: #94a3b8;
    margin: 0 2px;
  }

  .score-max {
    color: #64748b;
    font-weight: 600;
  }

  .col-pct {
    text-align: center;
  }

  .pct-badge {
    display: inline-block;
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .pct-high {
    background: #dcfce7;
    color: #16a34a;
  }

  .pct-mid {
    background: #fef3c7;
    color: #d97706;
  }

  .pct-low {
    background: #fef2f2;
    color: #dc2626;
  }

  .col-scale {
    text-align: center;
  }

  .scale-badge {
    display: inline-block;
    padding: 0.2rem 0.7rem;
    border-radius: 20px;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .scale-high {
    background: #dcfce7;
    color: #16a34a;
  }

  .scale-mid {
    background: #fef3c7;
    color: #d97706;
  }

  .scale-low {
    background: #fef2f2;
    color: #dc2626;
  }

  .missing {
    color: #94a3b8;
    font-style: italic;
    font-size: 0.85rem;
  }

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

  .summary-value.highlight {
    color: #1d4ed8;
  }

  @media (max-width: 640px) {
    table {
      font-size: 0.78rem;
    }

    thead th, tbody td {
      padding: 0.5rem 0.6rem;
    }

    .summary-bar {
      grid-template-columns: repeat(2, 1fr);
    }

    .col-scale {
      display: none;
    }
  }
</style>
