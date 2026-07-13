<script lang="ts">
  import Header from './Header.svelte';
  import './layout.css';
  import { isAuthenticated } from '$lib/stores/auth';
  import { page } from '$app/stores';

  let { children } = $props();
</script>

<div class="app">
  <Header />

  <main>
    {#if $isAuthenticated || $page.url.pathname === '/login'}
      {@render children()}
    {:else}
      <div class="welcome">
        <h1>Bienvenido a Cinar Sistemas 2026</h1>
        <p>Plataforma de gestión de calificaciones</p>
        <a href="/login" class="btn">Iniciar Sesión</a>
      </div>
    {/if}
  </main>

  <footer>
    <p>Cinar Sistemas 2026 &mdash;Desarrollo Web 1</p>
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

  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    text-align: center;
    gap: 1rem;
  }

  .welcome h1 {
    font-size: 2rem;
    margin: 0;
  }

  .welcome p {
    font-size: 1.1rem;
    color: #666;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: var(--color-theme-1);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 700;
    transition: opacity 0.2s;
  }

  .btn:hover {
    opacity: 0.9;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
    font-size: 0.85rem;
    color: #888;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
