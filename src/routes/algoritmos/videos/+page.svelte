<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const videos = [
    {
      title: 'Pensamiento Crítico',
      description: 'Video introductorio sobre la importancia del pensamiento crítico en la resolución de problemas algorítmicos.',
      src: '/Pensamiento_critico.mp4'
    },
    {
      title: 'Reto',
      description: 'Reto práctico para poner a prueba tus habilidades de lógica y algoritmia.',
      src: '/Reto.mp4'
    }
  ];
</script>

<svelte:head>
  <title>Videos - Algoritmos</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/algoritmos')}>
    <span>←</span> Volver a Algoritmos
  </button>

  <div class="hero">
    <span class="hero-icon">🎬</span>
    <h1>Videos del Curso</h1>
    <p class="hero-desc">Material audiovisual complementario para el curso de Algoritmos</p>
  </div>

  <div class="video-list">
    {#each videos as video, i}
      <div class="video-card" style="--i: {i}">
        <div class="video-header">
          <span class="video-number">{i + 1}</span>
          <div class="video-info">
            <h2>{video.title}</h2>
            <p>{video.description}</p>
          </div>
        </div>
        <div class="video-player">
          <video controls preload="metadata" width="100%">
            <source src={video.src} type="video/mp4" />
            Tu navegador no soporta la reproducción de video.
          </video>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .page {
    max-width: 800px;
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

  .video-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .video-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    animation: cardEnter 0.5s calc(var(--i, 0) * 0.15s) cubic-bezier(0.16, 1, 0.3, 1) both;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .video-card:hover {
    border-color: var(--color-accent);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }

  @keyframes cardEnter {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .video-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .video-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    font-weight: 800;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .video-info h2 {
    font-size: 1.1rem;
    margin: 0 0 0.25rem;
    color: var(--color-text-primary);
  }

  .video-info p {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .video-player {
    border-top: 1px solid var(--color-border);
    background: #000;
  }

  .video-player video {
    display: block;
    width: 100%;
    max-height: 450px;
  }
</style>
