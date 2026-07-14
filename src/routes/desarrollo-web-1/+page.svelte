<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import ExamCard from '$lib/components/ExamCard.svelte';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const links = [
    { href: '/desarrollo-web-1/parcial-1', icon: '📝', label: 'Parcial 1' },
    { href: '/desarrollo-web-1/algoritmia', icon: '🧠', label: 'Algoritmia' },
    { href: '/desarrollo-web-1/enlaces-de-consulta', icon: '🔗', label: 'Enlaces de Consulta' }
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
    <p class="header-desc">Accede a tus contenidos y evaluaciones desde los siguientes accesos:</p>
  </div>

  <div class="cards">
    {#each links as link, i}
      <ExamCard {href} icon={link.icon} label={link.label} delay={i * 0.1} />
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
    transition: all 0.3s ease;
    margin-bottom: 1.5rem;
  }

  .back-btn:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-text-muted);
    color: var(--color-text-primary);
    transform: translateY(-1px);
  }

  .back-btn:active {
    transform: translateY(0);
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: iconFloat 3s ease-in-out infinite;
  }

  @keyframes iconFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
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

  @media (max-width: 600px) {
    h1 {
      font-size: 1.25rem;
    }
    .header-icon {
      font-size: 2.5rem;
    }
  }
</style>
