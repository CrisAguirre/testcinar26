<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const VIDEO_ID = 'ZZq4TpNgnvg';
  const VIDEO_START = 900;
</script>

<svelte:head>
  <title>Actividad de la semana - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/desarrollo-web-1')}>
    <span>←</span> Volver a Desarrollo Web 1
  </button>

  <div class="hero">
    <span class="hero-icon">📺</span>
    <h1>Actividad de la semana</h1>
    <p class="hero-desc">Instalación de Opencode desde el editor Warp</p>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-step">🎯 Objetivo</span>
      <h2>Instalar Opencode en tu computador usando Warp</h2>
    </div>
    <p class="card-text">
      Opencode es un asistente de desarrollo que te permite escribir, refactorizar y entender código
      directamente desde tu terminal. En esta actividad aprenderás a instalarlo usando <strong>Warp</strong>,
      un editor de terminal moderno y rápido.
    </p>
  </div>

  <div class="video-container">
    <div class="video-wrapper">
      <iframe
        src="https://www.youtube.com/embed/{VIDEO_ID}?start={VIDEO_START}&autoplay=0&rel=0"
        title="Tutorial Opencode en Warp"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <p class="video-caption">🔊 Video explicativo — Configura Opencode desde Warp (minuto 15:00)</p>
  </div>

  <div class="steps">
    <h2>Pasos rápidos</h2>
    <div class="steps-grid">
      <div class="step-card">
        <span class="step-num">1</span>
        <h3>Descarga Warp</h3>
        <p>Ve a <a href="https://www.warp.dev" target="_blank" rel="noopener">warp.dev</a> e instala el terminal Warp en tu sistema operativo.</p>
      </div>
      <div class="step-card">
        <span class="step-num">2</span>
        <h3>Abre Warp</h3>
        <p>Inicia Warp y abre una nueva terminal. Warp ofrece autocompletado inteligente y edición tipo IDE.</p>
      </div>
      <div class="step-card">
        <span class="step-num">3</span>
        <h3>Instala Opencode</h3>
        <p>Ejecuta en la terminal: <code class="inline-code">npm install -g @opencode/cli</code></p>
      </div>
      <div class="step-card">
        <span class="step-num">4</span>
        <h3>Verifica</h3>
        <p>Ejecuta <code class="inline-code">opencode --version</code> para confirmar que quedó instalado correctamente.</p>
      </div>
    </div>
  </div>

  <div class="info-box">
    <span class="info-icon">💡</span>
    <p><strong>Nota:</strong> Si ya tienes Opencode instalado, asegúrate de tener la versión más reciente con <code class="inline-code">npm update -g @opencode/cli</code>.</p>
  </div>
</div>

<style>
  .page {
    max-width: 720px;
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

  .hero {
    text-align: center;
    margin-bottom: 2rem;
  }

  .hero-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: float 3.5s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
  }

  .hero-desc {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    margin-bottom: 1.5rem;
  }

  .card-header {
    margin-bottom: 0.75rem;
  }

  .card-step {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #1d4ed8;
    margin-bottom: 0.3rem;
  }

  .card-header h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #1e293b;
  }

  .card-text {
    font-size: 0.92rem;
    line-height: 1.6;
    color: #475569;
    margin: 0;
  }

  .video-container {
    margin-bottom: 2rem;
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    background: #000;
  }

  .video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  .video-caption {
    text-align: center;
    font-size: 0.85rem;
    color: #64748b;
    margin: 0.6rem 0 0;
  }

  .steps {
    margin-bottom: 2rem;
  }

  .steps h2 {
    font-size: 1.15rem;
    margin: 0 0 1rem;
    color: #1e293b;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }

  .step-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1.15rem;
    position: relative;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .step-card:hover {
    border-color: #93c5fd;
    box-shadow: 0 2px 12px rgba(59,130,246,0.1);
  }

  .step-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: #1d4ed8;
    color: white;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .step-card h3 {
    margin: 0 0 0.35rem;
    font-size: 0.95rem;
    color: #1e293b;
  }

  .step-card p {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.5;
    color: #64748b;
  }

  .step-card a {
    color: #1d4ed8;
    text-decoration: underline;
  }

  .inline-code {
    background: #f1f5f9;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    font-size: 0.82rem;
    font-family: 'Fira Mono', monospace;
    color: #dc2626;
  }

  .info-box {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: #fefce8;
    border: 1px solid #fde68a;
    border-radius: 10px;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
  }

  .info-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
    line-height: 1.4;
  }

  .info-box p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.5;
    color: #713f12;
  }

  @media (max-width: 600px) {
    .steps-grid {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: 1.25rem;
    }
  }
</style>
