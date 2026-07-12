<script lang="ts">
  import { login as authLogin, currentUser } from '$lib/stores/auth';
  import { authApi } from '$lib/api';
  import { goto } from '$app/navigation';

  let username = $state('admin');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = '';
    loading = true;

    try {
      const data = await authApi.login(username, password);
      authLogin(data.user, data.token);
      goto('/');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al iniciar sesión';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Iniciar Sesión</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <h1>Cinar Sistemas 2026</h1>
    <h2>Iniciar Sesión</h2>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    <form onsubmit={handleSubmit}>
      <label>
        Usuario
        <input type="text" bind:value={username} placeholder="admin" disabled={loading} />
      </label>
      <label>
        Contraseña
        <input type="password" bind:value={password} placeholder="Ingrese su contraseña" disabled={loading} />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 2rem;
  }

  .login-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 2.5rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  }

  h1 {
    font-size: 1.2rem;
    color: var(--color-theme-1);
    text-align: center;
    margin: 0 0 0.25rem;
  }

  h2 {
    font-size: 1.5rem;
    text-align: center;
    margin: 0 0 1.5rem;
    color: var(--color-text);
  }

  .error {
    background: #fef2f2;
    color: #dc2626;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
  }

  input {
    padding: 0.65rem 0.85rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
    background: white;
  }

  input:focus {
    outline: none;
    border-color: var(--color-theme-1);
  }

  button {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: var(--color-theme-1);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 0.9;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
