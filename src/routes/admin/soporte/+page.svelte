<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) { goto('/login'); return; }
    const role = $currentUser?.role;
    if (role !== 'admin' && role !== 'coordinator' && role !== 'teacher') goto('/');
  });

  let activeTab = $state('asistencia');
  let formEnviado = $state(false);

  function handleSubmit(e: Event) {
    e.preventDefault();
    formEnviado = true;
    setTimeout(() => {
      formEnviado = false;
    }, 3000);
  }

  const faq = [
    { pregunta: '¿Cómo subo las notas finales de un curso?', respuesta: 'Ve a "Registro Académico" > "Notas" y verifica que todas las actividades estén calificadas. El sistema calcula el porcentaje final automáticamente.' },
    { pregunta: '¿Qué hago si un estudiante no aparece inscrito?', respuesta: 'Verifica con el administrador que el estudiante tenga el curso asignado en su matrícula y que el rol sea correcto en el sistema.' },
    { pregunta: '¿Puedo modificar una nota después de ingresada?', respuesta: 'Sí, mientras el ciclo académico esté abierto. Si el ciclo cerró (ver Cronograma), debes solicitar autorización al coordinador.' }
  ];

  const tabs = [
    { id: 'asistencia', icon: '🎧', label: 'Asistencia Remota' },
    { id: 'manuales', icon: '📖', label: 'Manuales de Uso' },
    { id: 'faq', icon: '❓', label: 'Resolución de Errores' }
  ];
</script>

<svelte:head>
  <title>Soporte y Ayuda — Cinar Sistemas</title>
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
        <span class="banner-icon">🛟</span>
        <h1>Soporte y Ayuda</h1>
        <p class="banner-desc">Asistencia técnica, manuales y resolución de errores frecuentes</p>
      </div>
    </div>
    <div class="banner-decor">
      <span class="code-sym sym-1">🎧</span>
      <span class="code-sym sym-2">🔧</span>
      <span class="code-sym sym-3">❓</span>
      <span class="code-sym sym-4">💡</span>
      <span class="code-sym sym-5">📖</span>
      <span class="code-sym sym-6">🛟</span>
      <span class="code-sym sym-7">✓</span>
      <span class="code-sym sym-8">⚙️</span>
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

  {#if activeTab === 'asistencia'}
    <div class="card fade-in">
      <h2>🎧 Solicitar Asistencia Remota</h2>
      <p class="card-text">Llena este formulario para que el equipo de soporte técnico se ponga en contacto contigo e inicie una sesión remota.</p>
      
      {#if formEnviado}
        <div class="success-msg">
          ✅ <strong>Solicitud enviada.</strong> El equipo de soporte técnico te contactará en breve.
        </div>
      {:else}
        <form class="support-form" onsubmit={handleSubmit}>
          <div class="form-group">
            <label for="asunto">Asunto o Módulo con problemas:</label>
            <select id="asunto" required>
              <option value="">Selecciona una opción...</option>
              <option value="notas">Registro de Notas</option>
              <option value="acceso">Problemas de Acceso</option>
              <option value="plataforma">Fallo general de la plataforma</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="descripcion">Descripción del problema:</label>
            <textarea id="descripcion" rows="4" placeholder="Describe brevemente el error que estás experimentando..." required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Enviar Solicitud</button>
        </form>
      {/if}
    </div>
  {/if}

  {#if activeTab === 'manuales'}
    <div class="card fade-in">
      <h2>📖 Manual de Funcionalidades</h2>
      <p class="card-text">Guías paso a paso para el uso correcto de cada módulo de la plataforma.</p>
      <ul class="doc-list">
        <li>
          <span class="doc-icon">📖</span>
          <div class="doc-info">
            <strong>Guía: Gestión de Notas y Evaluaciones</strong>
            <span>PDF interactivo con el paso a paso.</span>
          </div>
          <button class="action-btn">Ver Manual</button>
        </li>
        <li>
          <span class="doc-icon">📖</span>
          <div class="doc-info">
            <strong>Guía: Modificación de Cronogramas</strong>
            <span>Cómo ajustar fechas de entregas y parciales.</span>
          </div>
          <button class="action-btn">Ver Manual</button>
        </li>
      </ul>
    </div>
  {/if}

  {#if activeTab === 'faq'}
    <div class="card fade-in">
      <h2>❓ Preguntas Frecuentes y Errores (FAQ)</h2>
      <p class="card-text">Soluciones rápidas a las consultas más comunes.</p>
      
      <div class="faq-list">
        {#each faq as f}
          <div class="faq-item">
            <h3 class="faq-q">{f.pregunta}</h3>
            <p class="faq-a">{f.respuesta}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* ── Banner ── */
  .banner { position: relative; width: 100vw; margin-left: calc(-50vw + 50%); overflow: hidden; }
  .banner-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #EC4899, #DB2777, #BE185D, #DB2777, #EC4899);
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
    background: linear-gradient(135deg, #fff, #fbcfe8, #f9a8d4, #fff); background-size: 300% 300%;
    color: #0f172a;
    animation: bannerTitleGrad 5s ease infinite; filter: drop-shadow(0 0 12px rgba(249,168,212,0.3));
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
    color: #db2777; background: white; font-weight: 600;
    box-shadow: 0 2px 8px rgba(219,39,119,0.12), 0 1px 3px rgba(0,0,0,0.06);
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

  .support-form {
    display: flex; flex-direction: column; gap: 1.25rem;
    background: #f8fafc; padding: 1.5rem; border-radius: 12px;
    border: 1px solid #e2e8f0;
  }
  
  .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
  .form-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
  .form-group select, .form-group textarea {
    padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 8px;
    font-family: inherit; font-size: 0.9rem; outline: none; transition: border-color 0.2s;
  }
  .form-group select:focus, .form-group textarea:focus { border-color: #db2777; }
  
  .submit-btn {
    background: #db2777; color: white; border: none; padding: 0.75rem;
    border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .submit-btn:hover { background: #be185d; }
  
  .success-msg {
    background: #dcfce7; color: #166534; padding: 1rem; border-radius: 8px;
    border: 1px solid #bbf7d0; text-align: center; margin-bottom: 1rem;
  }

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

  .faq-list { display: flex; flex-direction: column; gap: 1rem; }
  .faq-item { background: #f8fafc; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0; }
  .faq-q { margin: 0 0 0.5rem; font-size: 1rem; color: #0f172a; }
  .faq-a { margin: 0; font-size: 0.9rem; color: #475569; line-height: 1.5; }

  @media (max-width: 600px) {
    .card { padding: 1.5rem; }
    .tabs { gap: 0.2rem; padding: 0.25rem; }
    .tab { padding: 0.45rem 0.7rem; font-size: 0.78rem; }
    .banner-content { flex-direction: column; text-align: center; }
    h1 { font-size: 1.3rem; }
    .doc-list li { flex-wrap: wrap; }
  }
</style>
