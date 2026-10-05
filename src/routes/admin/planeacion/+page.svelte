<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import AvailabilityForm from '$lib/components/admin/AvailabilityForm.svelte';
  import ClassPlanForm from '$lib/components/admin/ClassPlanForm.svelte';

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

  const tabs = [
    { id: 'horario', icon: '🕐', label: 'Horario / Agenda' },
    { id: 'tematicas', icon: '📖', label: 'Temáticas y Cursos' },
    { id: 'disponibilidad', icon: '📋', label: 'Disponibilidad Docente' },
    { id: 'planeador', icon: '📝', label: 'Planeador de Clase' },
    { id: 'oferta', icon: '🎓', label: 'Oferta Capacitaciones' }
  ];
</script>

<svelte:head>
  <title>Planeación — Cinar Sistemas</title>
</svelte:head>

<div class="banner">
  <div class="banner-bg"></div>
  <div class="banner-inner">
    <nav class="admin-top-nav">
      <button class="nav-btn" onclick={() => goto('/admin')}><span>🏠</span> Panel</button>
      <button class="nav-btn" onclick={() => goto('/admin/planeacion')}><span>📅</span> Planeación</button>
      <button class="nav-btn" onclick={() => goto('/admin/registro-academico')}><span>📝</span> Registro</button>
      <button class="nav-btn" onclick={() => goto('/admin/capacitaciones')}><span>🎓</span> Capacitaciones</button>
      <button class="nav-btn" onclick={() => goto('/admin/normativa')}><span>📜</span> Normativa</button>
      <button class="nav-btn" onclick={() => goto('/admin/soporte')}><span>🛟</span> Soporte</button>
    </nav>
    <div class="banner-content">
      <img class="banner-logo" src="/logo.png" alt="Cinar Sistemas" />
      <div class="banner-text">
        <span class="banner-icon">📅</span>
        <h1>Planeación</h1>
        <p class="banner-desc">Horarios, temáticas y oferta de capacitaciones para el trimestre vigente</p>
      </div>
    </div>
    <div class="banner-decor">
      <span class="code-sym sym-1">📊</span>
      <span class="code-sym sym-2">📋</span>
      <span class="code-sym sym-3">🕐</span>
      <span class="code-sym sym-4">📝</span>
      <span class="code-sym sym-5">📖</span>
      <span class="code-sym sym-6">🎓</span>
      <span class="code-sym sym-7">⚙️</span>
      <span class="code-sym sym-8">🏫</span>
    </div>
  </div>
</div>

<div class="page">
  <div class="tabs">
    {#each tabs as tab}
      <button class="tab" class:active={activeTab === tab.id} onclick={() => activeTab = tab.id}>
        <span class="tab-icon">{tab.icon}</span>
        {tab.label}
      </button>
    {/each}
  </div>

  {#if activeTab === 'horario'}
    <div class="card fade-in">
      <h2>🕐 Horario / Agenda Trimestral</h2>
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
            {#each horario as h, i}
              <tr style="--row-i: {i}">
                <td>{h.dia}</td>
                <td>{h.franja}</td>
                <td>
                  <span class="badge {h.disponible ? 'badge-green' : 'badge-red'}">
                    {h.disponible ? '✅ Disponible' : '❌ Ocupado'}
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
    <div class="card fade-in">
      <h2>📖 Temáticas y Cursos que Dicta el Docente</h2>
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
                <td><span class="badge badge-purple">{t.trimestre}</span></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeTab === 'oferta'}
    <div class="card fade-in">
      <h2>🎓 Oferta de Capacitaciones a Impartir</h2>
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

  {#if activeTab === 'disponibilidad'}
    <div class="card fade-in" style="padding: 1.5rem;">
      <AvailabilityForm />
    </div>
  {/if}

  {#if activeTab === 'planeador'}
    <div class="card fade-in" style="padding: 1.5rem;">
      <ClassPlanForm />
    </div>
  {/if}
</div>

<style>
  /* ── Banner (same as courses) ── */
  .banner { position: relative; width: 100vw; margin-left: calc(-50vw + 50%); overflow: hidden; }
  .banner-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #8B5CF6, #7C3AED, #4C1D95, #7C3AED, #8B5CF6);
    background-size: 400% 400%; animation: gradientShift 15s ease infinite; z-index: 0;
  }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .banner-inner { position: relative; z-index: 1; max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem 2rem; }
  .banner-content { display: flex; align-items: center; justify-content: center; gap: 1.5rem; text-align: left; }
  .banner-logo { width: 72px; height: 72px; object-fit: contain; border-radius: 16px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.15)); animation: logoFloat 4s ease-in-out infinite, logoGlow 3s ease-in-out infinite; }
  @keyframes logoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes logoGlow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.15)); } 50% { filter: drop-shadow(0 0 18px rgba(255,255,255,0.35)); } }
  .banner-text { flex: 1; color: white; }
  .banner-icon { font-size: 2rem; display: block; margin-bottom: 0.35rem; animation: bannerIconFloat 3s ease-in-out infinite; filter: drop-shadow(0 0 6px rgba(255,255,255,0.2)); }
  @keyframes bannerIconFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.1); } }
  h1 {
    font-size: 1.55rem; margin: 0 0 0.35rem; font-weight: 700; letter-spacing: -0.02em;
    background: linear-gradient(135deg, #fff, #c4b5fd, #93c5fd, #fff); background-size: 300% 300%;
    color: #0f172a;
    animation: bannerTitleGrad 5s ease infinite; filter: drop-shadow(0 0 12px rgba(196,181,253,0.3));
  }
  @keyframes bannerTitleGrad { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  .banner-desc { font-size: 0.85rem; color: rgba(255,255,255,0.75); margin: 0; animation: descFadeIn 1s 0.3s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes descFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .admin-top-nav { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
  .nav-btn {
    display: inline-flex; align-items: center; gap: 0.35rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85); padding: 0.35rem 0.8rem; border-radius: 20px;
    font-size: 0.78rem; cursor: pointer; transition: all 0.2s; font-weight: 500;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.2); color: white; transform: translateY(-2px); border-color: rgba(255,255,255,0.5); }

  .banner-decor { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .code-sym { position: absolute; font-size: 1.2rem; opacity: 0.1; }
  .sym-1 { top: 8%; left: 8%; animation: codeDrift 7s 0.5s ease-in-out infinite; }
  .sym-2 { bottom: 12%; left: 20%; animation: codeDrift 8s 1.2s ease-in-out infinite; }
  .sym-3 { top: 45%; left: 5%; animation: codeDrift 6s 2s ease-in-out infinite; }
  .sym-4 { bottom: 20%; right: 25%; animation: codeDrift 9s 0.8s ease-in-out infinite; }
  .sym-5 { top: 25%; right: 8%; animation: codeDrift 7.5s 1.8s ease-in-out infinite; }
  .sym-6 { bottom: 8%; right: 35%; animation: codeDrift 8.5s 3s ease-in-out infinite; }
  .sym-7 { top: 50%; left: 50%; animation: codeDrift 10s 0.3s ease-in-out infinite; }
  .sym-8 { top: 15%; right: 40%; animation: codeDrift 9s 1.5s ease-in-out infinite; }
  @keyframes codeDrift { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-12px) rotate(2deg); } 50% { transform: translateY(-6px) rotate(-1deg); } 75% { transform: translateY(-16px) rotate(1deg); } }

  /* ── Page ── */
  .page { max-width: 720px; margin: 0 auto; width: 100%; padding: 1.5rem 1rem 3rem; }

  /* ── Tabs (premium) ── */
  .tabs {
    display: flex; gap: 0.35rem; margin-bottom: 1.5rem; padding: 0.35rem;
    background: #f1f5f9; border-radius: 12px; overflow-x: auto;
  }
  .tab {
    padding: 0.55rem 1rem; border: none; background: transparent;
    font-size: 0.82rem; font-weight: 500; color: #64748b;
    cursor: pointer; border-radius: 8px; transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    white-space: nowrap; display: flex; align-items: center; gap: 0.35rem;
  }
  .tab:hover { color: #0f172a; background: rgba(255,255,255,0.5); }
  .tab.active {
    color: #7c3aed; background: white; font-weight: 600;
    box-shadow: 0 2px 8px rgba(124,58,237,0.12), 0 1px 3px rgba(0,0,0,0.06);
  }
  .tab-icon { font-size: 0.95rem; }

  /* ── Card ── */
  .card {
    background: white; border-radius: 16px; padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.025);
    border: 1px solid rgba(0,0,0,0.04);
  }
  .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16,1,0.3,1); }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .card h2 { margin: 0 0 0.5rem; font-size: 1.15rem; color: #0f172a; font-weight: 600; }
  .card-text { font-size: 0.9rem; color: #64748b; margin: 0 0 1.5rem; }

  /* ── Table ── */
  .table-wrapper { overflow-x: auto; border-radius: 10px; border: 1px solid #e2e8f0; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  thead { background: linear-gradient(135deg, #f8fafc, #f1f5f9); }
  th { text-align: left; padding: 0.75rem 1rem; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
  td { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; color: #334155; }
  tr { transition: background 0.15s; }
  tr:hover { background: #faf5ff; }

  .badge {
    display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.65rem; border-radius: 999px;
    font-size: 0.75rem; font-weight: 600;
  }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-red { background: #fef2f2; color: #991b1b; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }
  .badge-purple { background: #f3e8ff; color: #6b21a8; }

  @media (max-width: 600px) {
    .card { padding: 1.5rem; }
    .tabs { gap: 0.2rem; padding: 0.25rem; }
    .tab { padding: 0.45rem 0.7rem; font-size: 0.78rem; }
    .banner-content { flex-direction: column; text-align: center; }
    h1 { font-size: 1.3rem; }
  }
</style>
