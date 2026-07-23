<script lang="ts">
  import { isAuthenticated, currentUser, logout } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { theme } from '$lib/stores/theme';
  import Logotipo from '../Logotipo.png';

  function handleLogout() {
    logout();
    goto('/login');
  }
</script>

<header>
  <div class="brand">
    <a href="/"><img src={Logotipo} alt="Cinar Sistemas" class="logotipo" /></a>
  </div>

  <nav>
    {#if $isAuthenticated}
      <ul>
        {#if $currentUser?.role === 'admin' || $currentUser?.role === 'coordinator'}
          <li><a href="/dashboard">Calificaciones</a></li>
        {/if}
      </ul>
      <div class="user-info">
        <span class="username">{$currentUser?.full_name || $currentUser?.username}</span>
        <button onclick={() => theme.set($theme === 'dark' ? 'light' : 'dark')} class="theme-btn" aria-label="Cambiar tema">
          {#if $theme === 'dark'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          {/if}
        </button>
        <button onclick={handleLogout} class="logout-btn">Cerrar Sesión</button>
      </div>
    {:else}
      <ul>
        <li><a href="/login">Cinar Sistemas</a></li>
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
    background: var(--color-primary);
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

  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
    padding: 0;
  }

  .theme-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: white;
  }

  @media (max-width: 600px) {
    header {
      flex-wrap: wrap;
      padding: 0.5rem 1rem;
      gap: 0.5rem;
    }

    .brand {
      width: 100%;
      justify-content: center;
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
