<script lang="ts">
  import { isAuthenticated, currentUser, logout } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Logotipo from '../Logotipo.png';

  function handleLogout() {
    logout();
    goto('/login');
  }
</script>

<header>
  <div class="brand">
    <img src={Logotipo} alt="Cinar Sistemas" class="logotipo" />
  </div>

  <nav>
    {#if $isAuthenticated}
      <ul>
        <li><a href="/">Inicio</a></li>
        {#if $currentUser?.role === 'admin'}
          <li><a href="/dashboard">Calificaciones</a></li>
        {/if}
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

  @media (max-width: 600px) {
    header {
      flex-wrap: wrap;
      padding: 0.5rem 1rem;
      gap: 0.5rem;
    }

    nav {
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem;
    }

    ul {
      flex: 1;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .user-info {
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .username {
      font-size: 0.78rem;
    }

    .logout-btn {
      padding: 0.35rem 0.7rem;
      font-size: 0.75rem;
    }
  }
</style>
