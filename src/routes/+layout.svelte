<script lang="ts">
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import './layout.css';
  import { startPreloader } from '$lib/loaders/preloader';
  import { wakeUpStatus, preloadingStatus } from '$lib/stores/preloaded';
  import { isAuthenticated } from '$lib/stores/auth';

  let { children } = $props();

  onMount(() => {
    startPreloader();
  });
</script>

<div class="app">
  <Header />

  {#if $isAuthenticated && $wakeUpStatus === 'waking'}
    <div class="wake-indicator">
      <span class="wake-dot"></span>
      Conectando con el servidor...
    </div>
  {/if}

  {#if $isAuthenticated && $preloadingStatus === 'loading'}
    <div class="wake-indicator wake-data">
      <span class="wake-dot wake-dot-data"></span>
      Cargando datos...
    </div>
  {/if}

  <main>
    {@render children()}
  </main>

  <footer>
    <p>Cinar Sistemas 2026 - Todos los derechos reservados</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }

  .wake-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.35rem 0;
    background: linear-gradient(135deg, #1e40af, #3b82f6);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    animation: slideDown 0.3s ease-out;
  }

  .wake-data {
    background: linear-gradient(135deg, #15803d, #22c55e);
  }

  .wake-dot {
    width: 8px;
    height: 8px;
    background: #93c5fd;
    border-radius: 50%;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .wake-dot-data {
    background: #86efac;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.3); }
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>
