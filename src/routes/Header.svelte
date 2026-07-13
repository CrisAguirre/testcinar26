<script lang="ts">
  import { isAuthenticated, currentUser, logout } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Logotipo from '../Logotipo.png';

  function handleLogout() {
    logout();
    goto('/');
  }
</script>

<header>
  <div class="brand">
    <img src={Logotipo} alt="Cinar Sistemas" class="logotipo" />
    <h1>Cinar Sistemas</h1>
  </div>

  <nav>
    {#if $isAuthenticated}
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/dashboard">Calificaciones</a></li>
      </ul>
      <div class="user-info">
        <span class="username">{$currentUser?.full_name || $currentUser?.username}</span>
        <button onclick={handleLogout} class="logout-btn">Cerrar Sesión</button>
      </div>
    {:else}
      <ul>
        <li><a href="/login">Iniciar Sesión</a></li>
      </ul>
    {/if}
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: var(--color-theme-2);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logotipo {
    height: 32px;
    width: auto;
  }

  .brand h1 {
    font-size: 1.1rem;
    margin: 0;
    color: white;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    transition: opacity 0.2s;
  }

  a:hover {
    opacity: 0.8;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .username {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.85);
  }

  .logout-btn {
    padding: 0.4rem 0.85rem;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
  }

  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: white;
  }
</style>
