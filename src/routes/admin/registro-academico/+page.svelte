<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import GradeSheetTable from '$lib/components/admin/GradeSheetTable.svelte';
  import CourseContentForm from '$lib/components/admin/CourseContentForm.svelte';
  import AttendanceTable from '$lib/components/admin/AttendanceTable.svelte';
  import ContentTrackingTable from '$lib/components/admin/ContentTrackingTable.svelte';

  $effect(() => {
    if (!$isAuthenticated) { goto('/login'); return; }
    const role = $currentUser?.role;
    if (role !== 'admin' && role !== 'coordinator' && role !== 'teacher') goto('/');
  });

  let activeTab = $state('notas');

  const tabs = [
    { id: 'notas', icon: '📝', label: 'Planilla de Notas' },
    { id: 'contenidos', icon: '📚', label: 'Contenido Temático' },
    { id: 'asistencia', icon: '👥', label: 'Asistencia' },
    { id: 'seguimiento', icon: '📈', label: 'Seguimiento Temático' }
  ];
</script>

<svelte:head>
  <title>Registro Académico — Cinar Sistemas</title>
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
        <span class="banner-icon">📋</span>
        <h1>Registro Académico</h1>
        <p class="banner-desc">Evaluaciones, asistencia, syllabus y seguimiento de clases</p>
      </div>
    </div>
    <div class="banner-decor">
      <span class="code-sym sym-1">📝</span>
      <span class="code-sym sym-2">📚</span>
      <span class="code-sym sym-3">📅</span>
      <span class="code-sym sym-4">👥</span>
      <span class="code-sym sym-5">📈</span>
      <span class="code-sym sym-6">📋</span>
      <span class="code-sym sym-7">A+</span>
      <span class="code-sym sym-8">100</span>
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

  {#if activeTab === 'notas'}
    <div class="card fade-in" style="padding: 1.5rem;">
      <GradeSheetTable />
    </div>
  {/if}

  {#if activeTab === 'contenidos'}
    <div class="card fade-in" style="padding: 1.5rem;">
      <CourseContentForm />
    </div>
  {/if}

  {#if activeTab === 'asistencia'}
    <div class="card fade-in" style="padding: 1.5rem;">
      <AttendanceTable />
    </div>
  {/if}

  {#if activeTab === 'seguimiento'}
    <div class="card fade-in" style="padding: 1.5rem;">
      <ContentTrackingTable />
    </div>
  {/if}
</div>

<style>
  /* ── Banner ── */
  .banner { position: relative; width: 100vw; margin-left: calc(-50vw + 50%); overflow: hidden; }
  .banner-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #3B82F6, #2563EB, #1D4ED8, #2563EB, #3B82F6);
    background-size: 400% 400%; animation: gradientShift 15s ease infinite; z-index: 0;
  }
  @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .banner-inner { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 1.5rem 1rem 2rem; }
  .banner-content { display: flex; align-items: center; justify-content: center; gap: 1.5rem; text-align: left; }
  .banner-logo { width: 72px; height: 72px; object-fit: contain; border-radius: 16px; filter: drop-shadow(0 0 8px rgba(255,255,255,0.15)); animation: logoFloat 4s ease-in-out infinite, logoGlow 3s ease-in-out infinite; }
  @keyframes logoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes logoGlow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(255,255,255,0.15)); } 50% { filter: drop-shadow(0 0 18px rgba(255,255,255,0.35)); } }
  .banner-text { flex: 1; color: white; }
  .banner-icon { font-size: 2rem; display: block; margin-bottom: 0.35rem; animation: bannerIconFloat 3s ease-in-out infinite; filter: drop-shadow(0 0 6px rgba(255,255,255,0.2)); }
  @keyframes bannerIconFloat { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.1); } }
  h1 {
    font-size: 1.55rem; margin: 0 0 0.35rem; font-weight: 700; letter-spacing: -0.02em;
    background: linear-gradient(135deg, #fff, #bfdbfe, #93c5fd, #fff); background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    animation: bannerTitleGrad 5s ease infinite; filter: drop-shadow(0 0 12px rgba(147,197,253,0.3));
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
  .page { max-width: 1000px; margin: 0 auto; width: 100%; padding: 1.5rem 1rem 3rem; }

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
  .tab:hover { -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent; background: rgba(255,255,255,0.5); }
  .tab.active {
    color: #2563eb; background: white; font-weight: 600;
    box-shadow: 0 2px 8px rgba(37,99,235,0.12), 0 1px 3px rgba(0,0,0,0.06);
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

  @media (max-width: 600px) {
    .card { padding: 1.5rem; }
    .tabs { gap: 0.2rem; padding: 0.25rem; }
    .tab { padding: 0.45rem 0.7rem; font-size: 0.78rem; }
    .banner-content { flex-direction: column; text-align: center; }
    h1 { font-size: 1.3rem; }
  }
</style>
