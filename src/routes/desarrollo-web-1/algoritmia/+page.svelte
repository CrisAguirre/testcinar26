<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$isAuthenticated) goto('/login');
  });
</script>

<svelte:head>
  <title>Algoritmia - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  <div class="card">
    <div class="card-icon">&#129302;</div>
    <h1>Algoritmia</h1>
    <p class="subtitle">Desarrollo Web 1 — Próximamente</p>
    <p class="desc">Esta evaluación estará disponible pronto. Vuelve más tarde.</p>
    <a href="/" class="back-btn">Volver al Inicio</a>
  </div>
</div>

<style>
  .page {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 3rem;
    text-align: center;
    max-width: 480px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  }

  .card-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.8rem;
    margin: 0 0 0.25rem;
  }

  .subtitle {
    color: var(--color-theme-1, #3b82f6);
    font-weight: 600;
    margin: 0 0 1rem;
    font-size: 0.95rem;
  }

  .desc {
    color: #888;
    margin: 0 0 2rem;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .back-btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.95rem;
    transition: opacity 0.2s;
  }

  .back-btn:hover {
    opacity: 0.9;
  }
</style>
