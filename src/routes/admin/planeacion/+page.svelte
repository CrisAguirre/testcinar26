<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) { goto('/login'); return; }
    const role = $currentUser?.role;
    if (role !== 'admin' && role !== 'coordinator' && role !== 'teacher') goto('/');
  });

  let activeTab = $state('horario');

  const horario = [
    { dia: 'Lunes', franja: '08:00 - 10:00', disponible: true },
    { dia: 'Lunes', franja: '10:00 - 12:00', disponible: false },
    { dia: 'Lunes', franja: '14:00 - 16:00', disponible: true },
    { dia: 'Martes', franja: '08:00 - 10:00', disponible: true },
    { dia: 'Martes', franja: '10:00 - 12:00', disponible: true },
    { dia: 'Martes', franja: '14:00 - 16:00', disponible: false },
    { dia: 'Miércoles', franja: '08:00 - 10:00', disponible: false },
    { dia: 'Miércoles', franja: '10:00 - 12:00', disponible: true },
    { dia: 'Miércoles', franja: '14:00 - 16:00', disponible: true },
    { dia: 'Jueves', franja: '08:00 - 10:00', disponible: true },
    { dia: 'Jueves', franja: '10:00 - 12:00', disponible: false },
    { dia: 'Jueves', franja: '14:00 - 16:00', disponible: true },
    { dia: 'Viernes', franja: '08:00 - 10:00', disponible: true },
    { dia: 'Viernes', franja: '10:00 - 12:00', disponible: true },
    { dia: 'Viernes', franja: '14:00 - 16:00', disponible: false }
  ];

  const tematicas = [
    { materia: 'Desarrollo Web 1', temas: 'Svelte 5, SvelteKit, Componentes, Routing', trimestre: '2026-3' },
    { materia: 'Desarrollo Web 2', temas: 'Eventos, Slots, Ciclo de vida, API REST', trimestre: '2026-3' },
    { materia: 'Algoritmos', temas: 'Operadores, Condicionales, Ciclos, Funciones, Arreglos', trimestre: '2026-3' }
  ];

  const capacitacionesOferta = [
    { nombre: 'Desarrollo Web Full Stack con Svelte', duracion: '40 horas', modalidad: 'Virtual', estado: 'Disponible' },
    { nombre: 'Pensamiento Algorítmico con DFD', duracion: '20 horas', modalidad: 'Presencial', estado: 'Disponible' },
    { nombre: 'Despliegue en la Nube (Render, Vercel)', duracion: '16 horas', modalidad: 'Virtual', estado: 'En preparación' }
  ];
</script>

<svelte:head>
  <title>Planeación — Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/admin')}>
    <span>←</span> Volver a Funciones Administrativas
  </button>

  <div class="hero">
    <span class="hero-icon">📅</span>
    <h1>Planeación</h1>
    <p class="hero-desc">Horarios, temáticas y oferta de capacitaciones para el trimestre vigente</p>
  </div>

  <div class="tabs">
    <button class="tab" class:active={activeTab === 'horario'} onclick={() => activeTab = 'horario'}>Horario / Agenda</button>
    <button class="tab" class:active={activeTab === 'tematicas'} onclick={() => activeTab = 'tematicas'}>Temáticas y Cursos</button>
    <button class="tab" class:active={activeTab === 'oferta'} onclick={() => activeTab = 'oferta'}>Oferta de Capacitaciones</button>
  </div>

  {#if activeTab === 'horario'}
    <div class="card">
      <h2>Horario / Agenda Trimestral</h2>
      <p class="card-text">Franjas horarias disponibles del docente para asignación de materias.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Día</th>
              <th>Franja</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each horario as h}
              <tr>
                <td>{h.dia}</td>
                <td>{h.franja}</td>
                <td>
                  <span class="badge {h.disponible ? 'badge-green' : 'badge-red'}">
                    {h.disponible ? 'Disponible' : 'Ocupado'}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeTab === 'tematicas'}
    <div class="card">
      <h2>Temáticas y Cursos que Dicta el Docente</h2>
      <p class="card-text">Materias asignadas y contenido temático para el trimestre vigente.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Materia</th>
              <th>Temáticas</th>
              <th>Trimestre</th>
            </tr>
          </thead>
          <tbody>
            {#each tematicas as t}
              <tr>
                <td><strong>{t.materia}</strong></td>
                <td>{t.temas}</td>
                <td>{t.trimestre}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeTab === 'oferta'}
    <div class="card">
      <h2>Oferta de Capacitaciones a Impartir</h2>
      <p class="card-text">Capacitaciones que el docente puede ofrecer según su área de experiencia.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Capacitación</th>
              <th>Duración</th>
              <th>Modalidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each capacitacionesOferta as c}
              <tr>
                <td><strong>{c.nombre}</strong></td>
                <td>{c.duracion}</td>
                <td>{c.modalidad}</td>
                <td>
                  <span class="badge {c.estado === 'Disponible' ? 'badge-green' : 'badge-yellow'}">
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
  .badge-red { background: #fef2f2; color: #991b1b; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }

  @media (max-width: 600px) {
    .card { padding: 1.5rem; }
    h1 { font-size: 1.5rem; }
    .tabs { gap: 0.25rem; }
    .tab { padding: 0.5rem 0.8rem; font-size: 0.8rem; }
  }
</style>
