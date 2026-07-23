<script lang="ts">
  import { login as authLogin, currentUser } from '$lib/stores/auth';
  import { authApi } from '$lib/api';
  import { goto } from '$app/navigation';
  import Logo from '../../logo.png';

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

<div class="login-wrapper">
  <div class="login-bg"></div>
  <div class="login-container">
    <div class="login-card">
      <h3 class="login-brand">Cinar Sistemas</h3>
      <img src={Logo} alt="Cinar Sistemas" class="login-logo" />
      <h1>Plataforma Educativa</h1>
      <h2>Iniciar Sesión</h2>
      <div class="login-divider"></div>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      <form onsubmit={handleSubmit}>
        <label>
          Usuario
          <input type="text" bind:value={username} placeholder="Ingrese su usuario" disabled={loading} />
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
  <footer class="login-footer">
    <img src="/logo.png" alt="Cinar" class="footer-shield" />
    <span>Cinar Sistemas 2026 - Todos los derechos reservados</span>
  </footer>
</div>

<style>
  .login-wrapper {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-bg {
    position: absolute;
    inset: 0;
    background: url('/bkg.jpg') center/cover no-repeat;
    z-index: 0;
  }

  .login-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,102,255,0.15));
    z-index: 0;
  }

  .login-container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    width: 100%;
  }

  .login-card {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-radius: 20px;
    padding: 2.5rem;
    width: 100%;
    max-width: 400px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow:
      0 8px 40px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .login-logo {
    display: block;
    margin: 0 auto 1rem;
    max-width: 120px;
    height: auto;
  }

  .login-brand {
    font-size: 1.3rem;
    font-weight: 600;
    color: white;
    text-align: center;
    margin: 0 0 0.5rem;
    text-shadow: 0 1px 6px rgba(0,0,0,0.15);
  }

  h1 {
    font-size: 1.2rem;
    color: #1e293b;
    text-align: center;
    margin: 0 0 0.25rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  h2 {
    font-size: 1.15rem;
    text-align: center;
    margin: 0 0 0.25rem;
    color: white;
    font-weight: 400;
    letter-spacing: -0.01em;
    text-shadow: 0 1px 8px rgba(0,0,0,0.15);
  }

  .login-divider {
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, #0066FF, #93c5fd);
    border-radius: 2px;
    margin: 0.75rem auto 1.5rem;
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
    border: 2px solid var(--color-border);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
    background: white;
  }

  input:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  button {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: var(--color-accent);
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

  @media (max-width: 600px) {
    .login-container {
      padding: 1rem;
    }

    .login-card {
      padding: 1.5rem;
    }

    .login-logo {
      max-width: 80px;
    }

    h1 {
      font-size: 1rem;
    }

    h2 {
      font-size: 1.2rem;
    }

    input {
      padding: 0.55rem 0.75rem;
      font-size: 0.95rem;
    }

    button {
      padding: 0.65rem;
      font-size: 0.95rem;
    }
  }

  .login-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 12px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    z-index: 1;
  }

  .footer-shield {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
</style>
