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
    max-width: 640px;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 3rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: none;
    color: #64748b;
    padding: 0;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 2.5rem;
    transition: color 0.2s ease;
  }

  .back-btn:hover {
    color: #0f172a;
  }

  .hero {
    margin-bottom: 2.5rem;
  }

  .hero-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  h1 {
    font-size: 1.75rem;
    letter-spacing: -0.02em;
    margin: 0 0 0.5rem;
    color: #0f172a;
    font-weight: 600;
  }

  .hero-desc {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
  }

  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.025);
    border: 1px solid rgba(0,0,0,0.04);
    margin-bottom: 2rem;
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .card-step {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #475569;
    margin-bottom: 0.5rem;
  }

  .card-header h2 {
    margin: 0;
    font-size: 1.15rem;
    color: #0f172a;
    font-weight: 500;
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
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 1.25rem;
    margin-top: 1.5rem !important;
  }

  .info-icon {
    font-size: 1.3rem;
    flex-shrink: 0;
    line-height: 1.4;
    opacity: 0.8;
  }

  .info-box p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #334155;
  }

  .video-container {
    margin-bottom: 2.5rem;
  }

  .video-wrapper {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.04);
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .video-wrapper video {
    display: block;
    width: 100%;
    max-height: 500px;
    background: #0f172a;
  }

  .video-caption {
    text-align: center;
    font-size: 0.85rem;
    color: #64748b;
    margin: 0.75rem 0 0;
    font-weight: 500;
  }
  
  @media (max-width: 600px) {
    .card {
      padding: 1.5rem;
      border-radius: 12px;
    }
    
    h1 {
      font-size: 1.5rem;
    }
  }
</style>
