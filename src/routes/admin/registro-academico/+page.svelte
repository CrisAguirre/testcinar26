<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { gradesApi } from '$lib/api';

  $effect(() => {
    if (!$isAuthenticated) { goto('/login'); return; }
    const role = $currentUser?.role;
    if (role !== 'admin' && role !== 'coordinator' && role !== 'teacher') goto('/');
  });

  let activeTab = $state('notas');
  let notas = $state<any[]>([]);
  let loadingNotas = $state(true);

  onMount(async () => {
    if ($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator' || $currentUser?.role === 'teacher') {
      try {
        const response = await gradesApi.getAll();
        // Agrupar por curso/estudiante si fuera necesario, o simplemente listar
        notas = response;
      } catch (e) {
        console.error("Error al cargar notas:", e);
      } finally {
        loadingNotas = false;
      }
    }
  });

  const contenidos = [
    { materia: 'Desarrollo Web 1', modulo: 'Módulo 1: Fundamentos de Svelte', estado: 'Completado' },
    { materia: 'Desarrollo Web 1', modulo: 'Módulo 2: SvelteKit Routing', estado: 'En curso' },
    { materia: 'Desarrollo Web 2', modulo: 'Módulo 1: Arquitectura y API', estado: 'En curso' },
    { materia: 'Algoritmos', modulo: 'Módulo 1: Lógica y Estructuras', estado: 'Completado' }
  ];

  const cronograma = [
    { fecha: '2026-10-01', evento: 'Inicio de trimestre', tipo: 'Académico' },
    { fecha: '2026-10-15', evento: 'Primer Parcial - Algoritmos', tipo: 'Evaluación' },
    { fecha: '2026-11-10', evento: 'Entrega de Proyecto Web', tipo: 'Evaluación' },
    { fecha: '2026-12-15', evento: 'Cierre de notas', tipo: 'Administrativo' }
  ];

  const asistencia = [
    { estudiante: 'Juan Pérez', materia: 'Desarrollo Web 1', fecha: '2026-09-10', estado: 'Presente' },
    { estudiante: 'María García', materia: 'Algoritmos', fecha: '2026-09-12', estado: 'Falta Justificada' },
    { estudiante: 'Carlos López', materia: 'Desarrollo Web 2', fecha: '2026-09-14', estado: 'Ausente' }
  ];
</script>

<svelte:head>
  <title>Registro Académico — Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/admin')}>
    <span>←</span> Volver a Funciones Administrativas
  </button>

  <div class="hero">
    <span class="hero-icon">📋</span>
    <h1>Registro Académico</h1>
    <p class="hero-desc">Gestión de notas, contenidos, cronograma y asistencia de estudiantes</p>
  </div>

  <div class="tabs">
    <button class="tab" class:active={activeTab === 'notas'} onclick={() => activeTab = 'notas'}>Notas</button>
    <button class="tab" class:active={activeTab === 'contenidos'} onclick={() => activeTab = 'contenidos'}>Contenidos</button>
    <button class="tab" class:active={activeTab === 'cronograma'} onclick={() => activeTab = 'cronograma'}>Cronograma</button>
    <button class="tab" class:active={activeTab === 'asistencia'} onclick={() => activeTab = 'asistencia'}>Asistencia</button>
  </div>

  {#if activeTab === 'notas'}
    <div class="card">
      <h2>Registro General de Notas</h2>
      <p class="card-text">Listado de evaluaciones presentadas por los estudiantes.</p>
      
      {#if loadingNotas}
        <p class="loading">Cargando notas...</p>
      {:else if notas.length === 0}
        <p class="empty">No hay notas registradas en el sistema.</p>
      {:else}
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Materia/Evaluación</th>
                <th>Puntaje</th>
                <th>Máximo</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {#each notas as n}
                <tr>
                  <td><strong>{n.student?.full_name || n.student?.username || 'Estudiante'}</strong></td>
                  <td>{n.subject}</td>
                  <td>{n.score}</td>
                  <td>{n.max_score}</td>
                  <td>{n.percentage}%</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/if}

  {#if activeTab === 'contenidos'}
    <div class="card">
      <h2>Contenidos Temáticos</h2>
      <p class="card-text">Seguimiento del progreso de los módulos por curso.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Materia</th>
              <th>Módulo/Tema</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each contenidos as c}
              <tr>
                <td><strong>{c.materia}</strong></td>
                <td>{c.modulo}</td>
                <td>
                  <span class="badge {c.estado === 'Completado' ? 'badge-green' : 'badge-yellow'}">
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

  {#if activeTab === 'cronograma'}
    <div class="card">
      <h2>Cronograma Académico</h2>
      <p class="card-text">Fechas importantes para el trimestre vigente.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Evento</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {#each cronograma as c}
              <tr>
                <td><strong>{c.fecha}</strong></td>
                <td>{c.evento}</td>
                <td>
                  <span class="badge {c.tipo === 'Evaluación' ? 'badge-red' : c.tipo === 'Académico' ? 'badge-green' : 'badge-purple'}">
                    {c.tipo}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeTab === 'asistencia'}
    <div class="card">
      <h2>Registro de Asistencia</h2>
      <p class="card-text">Listado reciente de control de asistencia.</p>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Materia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {#each asistencia as a}
              <tr>
                <td>{a.fecha}</td>
                <td><strong>{a.estudiante}</strong></td>
                <td>{a.materia}</td>
                <td>
                  <span class="badge {a.estado === 'Presente' ? 'badge-green' : a.estado === 'Ausente' ? 'badge-red' : 'badge-yellow'}">
                    {a.estado}
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
  .badge-purple { background: #f3e8ff; color: #6b21a8; }
  
  .loading { text-align: center; color: #64748b; font-style: italic; margin: 2rem 0; }
  .empty { text-align: center; color: #64748b; padding: 2rem 0; border: 1px dashed #cbd5e1; border-radius: 8px; }

  @media (max-width: 600px) {
    .card { padding: 1.5rem; }
    h1 { font-size: 1.5rem; }
    .tabs { gap: 0.25rem; }
    .tab { padding: 0.5rem 0.8rem; font-size: 0.8rem; }
  }
</style>
