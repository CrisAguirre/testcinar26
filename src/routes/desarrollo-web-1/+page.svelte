<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const links = [
    { href: '/desarrollo-web-1/parcial-1', icon: '📝', label: 'Parcial 1' },
    { href: '/desarrollo-web-1/algoritmia', icon: '🧠', label: 'Algoritmia' },
    { href: '/desarrollo-web-1/enlaces-de-consulta', icon: '🔗', label: 'Enlaces de Consulta' },
    { href: null, icon: '📋', label: 'Notas', disabled: true }
  ];
</script>

<svelte:head>
  <title>Desarrollo Web 1 — Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/')}>
    <span>←</span> Volver al inicio
  </button>

  <div class="header">
    <span class="header-icon">📚</span>
    <h1>Desarrollo Web 1</h1>
    <p class="header-desc">
      Accede a tus contenidos, evaluaciones y notas desde los siguientes accesos:
    </p>
  </div>

  <div class="cards">
    {#each links as link, i}
      {#if link.disabled}
        <div class="card card--disabled" style="--i: {i}">
          <span class="card-bounce">{link.icon}</span>
          <span class="card-label">{link.label}</span>
          <span class="card-badge">Próximamente</span>
        </div>
      {:else}
        <a
          href={link.href}
          class="card"
          style="--i: {i}"
        >
          <span class="card-shine"></span>
          <span class="card-bounce">{link.icon}</span>
          <span class="card-label">{link.label}</span>
          <span class="card-arrow">→</span>
        </a>
      {/if}
    {/each}
  </div>
</div>

<style>
  .page {
    max-width: 640px;
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

  .back-btn:active {
    transform: scale(0.96);
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: float 3.5s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
  }

  .header-desc {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 0.85rem 1rem;
    color: var(--color-text-primary);
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition:
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.3s ease,
      border-color 0.25s ease;
    animation: cardEnter 0.5s calc(var(--i, 0) * 0.12s) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardEnter {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .card:hover {
    transform: translateY(-6px) scale(1.03);
    border-color: var(--color-accent);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.1),
      0 0 20px color-mix(in srgb, var(--color-accent) 10%, transparent);
  }

  .card:active {
    transform: translateY(-2px) scale(0.98);
  }

  .card--disabled {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
  }

  .card-badge {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: var(--color-accent);
    color: white;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    position: relative;
    z-index: 1;
  }

  .card-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      color-mix(in srgb, var(--color-accent) 8%, transparent) 50%,
      transparent 60%
    );
    background-size: 200% 200%;
    pointer-events: none;
    transition: background-position 0.6s ease;
    background-position: 100% 100%;
  }

  .card:hover .card-shine {
    background-position: 0% 0%;
  }

  .card-bounce {
    font-size: 1.3rem;
    position: relative;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .card:hover .card-bounce {
    transform: scale(1.25);
  }

  .card-label {
    flex: 1;
    font-weight: 600;
    font-size: 0.95rem;
    position: relative;
    z-index: 1;
  }

  .card-arrow {
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .card:hover .card-arrow {
    transform: translateX(6px);
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.25rem;
    }
    .header-icon {
      font-size: 2.5rem;
    }
  }
</style>
