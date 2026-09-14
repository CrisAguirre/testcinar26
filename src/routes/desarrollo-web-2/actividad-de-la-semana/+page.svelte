<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });
</script>

<svelte:head>
  <title>Actividad de la semana - Desarrollo Web 2</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/desarrollo-web-2')}>
    <span>←</span> Volver a Desarrollo Web 2
  </button>

  <div class="hero">
    <span class="hero-icon">📺</span>
    <h1>Actividad de la semana</h1>
    <p class="hero-desc">Diagramas de Arquitectura con Archify</p>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-step">🎯 Objetivo</span>
      <h2>Implementar la librería Archify en tu proyecto</h2>
    </div>
    <p class="card-text">
      ¿Te acuerdas de tu proyecto personal del anterior trimestre? Bueno, pues la idea es 
      implementar esta librería de Node llamada <strong>Archify</strong>, para generar el 
      informe de diagramas de arquitectura (flujos de trabajo, estados y secuencias) a tu 
      proyecto personal.
    </p>
    <div class="info-box" style="margin-top: 1rem; margin-bottom: 0;">
      <span class="info-icon">💡</span>
      <p>
        <strong>Recomendación:</strong> Esta actividad se revisará en la clase NO. 2. De manera 
        opcional, se recomienda utilizar la IA de Opus o Gemini integrada en Antigravity para hacer 
        acompañamiento y lograr el resultado deseado.
      </p>
    </div>
  </div>

  <div class="video-container">
    <div class="video-wrapper">
      <video controls preload="metadata" width="100%">
        <source src="/actividad_1.mp4" type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
      </video>
    </div>
    <p class="video-caption">🔊 Video explicativo — Archify en tu proyecto personal</p>
  </div>
</div>

<style>
  .page {
    max-width: 720px;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 2rem;
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
    font-size: 0.95rem;
    line-height: 1.6;
    color: #475569;
    margin: 0;
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

  .video-container {
    margin-bottom: 2rem;
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .video-wrapper video {
    display: block;
    width: 100%;
    max-height: 500px;
  }

  .video-caption {
    text-align: center;
    font-size: 0.85rem;
    color: #64748b;
    margin: 0.6rem 0 0;
  }
</style>
