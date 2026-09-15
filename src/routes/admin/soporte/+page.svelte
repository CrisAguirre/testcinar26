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
</script>

<svelte:head>
  <title>Soporte y Ayuda — Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/admin')}>
    <span>←</span> Volver a Funciones Administrativas
  </button>

  <div class="hero">
    <span class="hero-icon">🛟</span>
    <h1>Soporte y Ayuda</h1>
    <p class="hero-desc">Asistencia técnica, manuales y resolución de errores frecuentes</p>
  </div>

  <div class="tabs">
    <button class="tab" class:active={activeTab === 'asistencia'} onclick={() => activeTab = 'asistencia'}>Asistencia Remota</button>
    <button class="tab" class:active={activeTab === 'manuales'} onclick={() => activeTab = 'manuales'}>Manuales de Uso</button>
    <button class="tab" class:active={activeTab === 'faq'} onclick={() => activeTab = 'faq'}>Resolución de Errores</button>
  </div>

  {#if activeTab === 'asistencia'}
    <div class="card">
      <h2>Solicitar Asistencia Remota</h2>
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
    <div class="card">
      <h2>Manual de Funcionalidades</h2>
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
    <div class="card">
      <h2>Preguntas Frecuentes y Errores (FAQ)</h2>
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
  .form-group select:focus, .form-group textarea:focus { border-color: #7c3aed; }
  
  .submit-btn {
    background: #7c3aed; color: white; border: none; padding: 0.75rem;
    border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s;
  }
  .submit-btn:hover { background: #6d28d9; }
  
  .success-msg {
    background: #dcfce7; color: #166534; padding: 1rem; border-radius: 8px;
    border: 1px solid #bbf7d0; text-align: center;
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
    h1 { font-size: 1.5rem; }
    .tabs { gap: 0.25rem; }
    .tab { padding: 0.5rem 0.8rem; font-size: 0.8rem; }
    .doc-list li { flex-wrap: wrap; }
  }
</style>
