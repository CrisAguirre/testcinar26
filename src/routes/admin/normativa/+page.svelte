<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) { goto('/login'); return; }
    const role = $currentUser?.role;
    if (role !== 'admin' && role !== 'coordinator' && role !== 'teacher') goto('/');
  });

  let activeTab = $state('estado');

  const normas = [
    { nombre: 'Ley 115 de 1994', descripcion: 'Ley General de Educación', entidad: 'Ministerio de Educación', estado: 'Vigente' },
    { nombre: 'Decreto 1075 de 2015', descripcion: 'Decreto Único Reglamentario del Sector Educación', entidad: 'Ministerio de Educación', estado: 'Vigente' },
    { nombre: 'Resolución 001 de 2026', descripcion: 'Actualización lineamientos TIC', entidad: 'Secretaría de Educación', estado: 'En revisión' }
  ];

  const cumplimiento = [
    { programa: 'Técnico en Sistemas', norma: 'Ley 115 de 1994', estado: 'Cumple 100%', accion: 'Ninguna' },
    { programa: 'Técnico en Sistemas', norma: 'Resolución 001 de 2026', estado: 'Cumple 80%', accion: 'Actualizar sílabos de programación' },
    { programa: 'Técnico en Diseño Gráfico', norma: 'Decreto 1075 de 2015', estado: 'Cumple 100%', accion: 'Ninguna' }
  ];
</script>

<svelte:head>
  <title>Normativa Vigente — Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/admin')}>
    <span>←</span> Volver a Funciones Administrativas
  </button>

  <div class="hero">
    <span class="hero-icon">📜</span>
    <h1>Normativa Vigente</h1>
    <p class="hero-desc">Leyes y directrices del MEN y Secretaría de Educación</p>
  </div>

  <div class="tabs">
    <button class="tab" class:active={activeTab === 'estado'} onclick={() => activeTab = 'estado'}>Estado de Normas</button>
    <button class="tab" class:active={activeTab === 'descargas'} onclick={() => activeTab = 'descargas'}>Descargas</button>
    <button class="tab" class:active={activeTab === 'instituto'} onclick={() => activeTab = 'instituto'}>Estado del Instituto</button>
  </div>

  {#if activeTab === 'estado'}
    <div class="card">
      <h2>Estado Actual de Normativas</h2>
      <p class="card-text">Leyes y decretos vigentes que rigen los programas académicos.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Norma</th>
              <th>Descripción</th>
              <th>Entidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each normas as n}
              <tr>
                <td><strong>{n.nombre}</strong></td>
                <td>{n.descripcion}</td>
                <td>{n.entidad}</td>
                <td>
                  <span class="badge {n.estado === 'Vigente' ? 'badge-green' : 'badge-yellow'}">
                    {n.estado}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeTab === 'descargas'}
    <div class="card">
      <h2>Documentos Descargables</h2>
      <p class="card-text">Acceso rápido a normativas oficiales y formatos institucionales.</p>
      <ul class="doc-list">
        <li>
          <span class="doc-icon">📥</span>
          <div class="doc-info">
            <strong>Compendio de Leyes Educativas (PDF)</strong>
            <span>Versión 2026 actualizada con las últimas resoluciones.</span>
          </div>
          <button class="action-btn">Descargar</button>
        </li>
        <li>
          <span class="doc-icon">📥</span>
          <div class="doc-info">
            <strong>PEI - Proyecto Educativo Institucional</strong>
            <span>Documento maestro de Cinar Sistemas.</span>
          </div>
          <button class="action-btn">Descargar</button>
        </li>
      </ul>
    </div>
  {/if}

  {#if activeTab === 'instituto'}
    <div class="card">
      <h2>Estado de Cinar Sistemas frente a Normativas</h2>
      <p class="card-text">Seguimiento de cumplimiento por programa académico.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Programa Académico</th>
              <th>Norma Aplicada</th>
              <th>Nivel de Cumplimiento</th>
              <th>Plan de Acción</th>
            </tr>
          </thead>
          <tbody>
            {#each cumplimiento as c}
              <tr>
                <td><strong>{c.programa}</strong></td>
                <td>{c.norma}</td>
                <td>
                  <span class="badge {c.estado.includes('100%') ? 'badge-green' : 'badge-yellow'}">
                    {c.estado}
                  </span>
                </td>
                <td>{c.accion}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<style>
  .page { max-width: 720px; margin: 0 auto; width: 100%; padding-bottom: 3rem; }

  .back-btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: transparent; border: none; color: #64748b;
    padding: 0; font-size: 0.85rem; font-weight: 500;
    cursor: pointer; margin-bottom: 2rem; transition: color 0.2s ease;
  }
  .back-btn:hover { color: #0f172a; }

  .hero { margin-bottom: 2rem; }
  .hero-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
  h1 { font-size: 1.75rem; letter-spacing: -0.02em; margin: 0 0 0.5rem; color: #0f172a; font-weight: 600; }
  .hero-desc { font-size: 1rem; color: #64748b; margin: 0; }

  .tabs {
    display: flex; gap: 0.5rem; margin-bottom: 1.5rem;
    border-bottom: 2px solid #e2e8f0; padding-bottom: 0;
    overflow-x: auto;
  }

  .tab {
    padding: 0.6rem 1.2rem; border: none; background: transparent;
    font-size: 0.85rem; font-weight: 500; color: #64748b;
    cursor: pointer; border-bottom: 2px solid transparent;
    margin-bottom: -2px; transition: all 0.2s ease; white-space: nowrap;
  }
  .tab:hover { color: #0f172a; }
  .tab.active { color: #7c3aed; border-bottom-color: #7c3aed; font-weight: 600; }

  .card {
    background: white; border-radius: 16px; padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.025);
    border: 1px solid rgba(0,0,0,0.04);
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .card h2 { margin: 0 0 0.5rem; font-size: 1.15rem; color: #0f172a; font-weight: 600; }
  .card-text { font-size: 0.9rem; color: #64748b; margin: 0 0 1.5rem; }

  .table-wrapper { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  thead { background: #f8fafc; }
  th { text-align: left; padding: 0.75rem 1rem; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
  td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; }
  tr:hover { background: #fafbfd; }

  .badge {
    display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px;
    font-size: 0.75rem; font-weight: 600;
  }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }

  .action-btn {
    background: #f1f5f9; color: #475569; border: none; padding: 0.4rem 0.8rem;
    border-radius: 6px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
  }
  .action-btn:hover { background: #e2e8f0; color: #0f172a; }

  .doc-list { list-style: none; padding: 0; margin: 0; }
  .doc-list li {
    display: flex; align-items: center; gap: 1rem; padding: 1rem 0;
    border-bottom: 1px solid #f1f5f9;
  }
  .doc-list li:last-child { border-bottom: none; }
  .doc-icon { font-size: 1.5rem; }
  .doc-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
  .doc-info strong { color: #0f172a; font-size: 0.95rem; }
  .doc-info span { color: #64748b; font-size: 0.85rem; }

  @media (max-width: 600px) {
    .card { padding: 1.5rem; }
    h1 { font-size: 1.5rem; }
    .tabs { gap: 0.25rem; }
    .tab { padding: 0.5rem 0.8rem; font-size: 0.8rem; }
    .doc-list li { flex-wrap: wrap; }
  }
</style>
