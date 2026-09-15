<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) { goto('/login'); return; }
    const role = $currentUser?.role;
    if (role !== 'admin' && role !== 'coordinator' && role !== 'teacher') goto('/');
  });

  let activeTab = $state('cursos');

  const cursosDocentes = [
    { nombre: 'Metodologías Ágiles en la Educación', area: 'Pedagogía', horas: 20 },
    { nombre: 'Integración de IA en el Aula', area: 'Tecnología', horas: 30 },
    { nombre: 'Evaluación por Competencias', area: 'Pedagogía', horas: 15 }
  ];

  const certificados = [
    { docente: 'Juan Pérez', curso: 'Metodologías Ágiles en la Educación', fecha: '2026-08-15', estado: 'Emitido' },
    { docente: 'María García', curso: 'Integración de IA en el Aula', fecha: '2026-09-01', estado: 'Emitido' },
    { docente: 'Carlos López', curso: 'Evaluación por Competencias', fecha: '-', estado: 'En proceso' }
  ];
</script>

<svelte:head>
  <title>Capacitaciones — Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/admin')}>
    <span>←</span> Volver a Funciones Administrativas
  </button>

  <div class="hero">
    <span class="hero-icon">🎓</span>
    <h1>Capacitaciones</h1>
    <p class="hero-desc">Cursos para docentes, evaluaciones y certificados institucionales</p>
  </div>

  <div class="tabs">
    <button class="tab" class:active={activeTab === 'cursos'} onclick={() => activeTab = 'cursos'}>Cursos para Docentes</button>
    <button class="tab" class:active={activeTab === 'certificados'} onclick={() => activeTab = 'certificados'}>Certificados</button>
    <button class="tab" class:active={activeTab === 'bienvenida'} onclick={() => activeTab = 'bienvenida'}>Bienvenida y Onboarding</button>
  </div>

  {#if activeTab === 'cursos'}
    <div class="card">
      <h2>Catálogo de Cursos para Docentes</h2>
      <p class="card-text">Programas de formación continua disponibles para el cuerpo docente.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nombre del Curso</th>
              <th>Área</th>
              <th>Horas</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {#each cursosDocentes as c}
              <tr>
                <td><strong>{c.nombre}</strong></td>
                <td>{c.area}</td>
                <td>{c.horas}h</td>
                <td><button class="action-btn">Ver Detalles</button></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeTab === 'certificados'}
    <div class="card">
      <h2>Emisión de Certificados</h2>
      <p class="card-text">Historial de certificaciones obtenidas tras culminar capacitaciones.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Docente</th>
              <th>Curso</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each certificados as c}
              <tr>
                <td><strong>{c.docente}</strong></td>
                <td>{c.curso}</td>
                <td>{c.fecha}</td>
                <td>
                  <span class="badge {c.estado === 'Emitido' ? 'badge-green' : 'badge-yellow'}">
                    {c.estado}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeTab === 'bienvenida'}
    <div class="card">
      <h2>Bienvenida a Nuevos Docentes</h2>
      <p class="card-text">Documentación esencial para la inducción de nuevos integrantes del equipo.</p>
      <ul class="doc-list">
        <li>
          <span class="doc-icon">📄</span>
          <div class="doc-info">
            <strong>Manual de Inducción Docente</strong>
            <span>Guía paso a paso sobre los procesos académicos y administrativos.</span>
          </div>
          <button class="action-btn">Descargar</button>
        </li>
        <li>
          <span class="doc-icon">📄</span>
          <div class="doc-info">
            <strong>Lineamientos Institucionales</strong>
            <span>Visión, misión, valores y modelo pedagógico de Cinar Sistemas.</span>
          </div>
          <button class="action-btn">Descargar</button>
        </li>
        <li>
          <span class="doc-icon">📺</span>
          <div class="doc-info">
            <strong>Uso de la Plataforma (Video)</strong>
            <span>Tutorial sobre cómo subir notas y gestionar contenidos.</span>
          </div>
          <button class="action-btn">Ver Video</button>
        </li>
      </ul>
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
