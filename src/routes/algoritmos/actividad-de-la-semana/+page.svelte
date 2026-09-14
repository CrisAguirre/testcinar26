<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { authApi } from '$lib/api';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let projectIdea = $state('');
  let isSaving = $state(false);
  let saveSuccess = $state(false);
  let saveError = $state('');

  async function handleSave() {
    if (!projectIdea.trim()) {
      saveError = 'Por favor, escribe tu idea de proyecto antes de guardar.';
      return;
    }

    isSaving = true;
    saveError = '';
    saveSuccess = false;

    try {
      await authApi.post('/api/enrollments/project-idea', {
        course: 'algoritmos',
        projectIdea: projectIdea.trim()
      });
      saveSuccess = true;
    } catch (error) {
      console.error(error);
      saveError = 'Ocurrió un error al guardar. Por favor, inténtalo de nuevo.';
    } finally {
      isSaving = false;
    }
  }
</script>

<svelte:head>
  <title>Actividad de la semana - Algoritmos</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/algoritmos')}>
    <span>←</span> Volver a Algoritmos
  </button>

  <div class="hero">
    <span class="hero-icon">💡</span>
    <h1>Actividad de la semana</h1>
    <p class="hero-desc">Idea de Proyecto para Aplicación Web</p>
  </div>

  <div class="card">
    <div class="card-header">
      <span class="card-step">🎯 Objetivo</span>
      <h2>Plantea tu idea de proyecto</h2>
    </div>
    <p class="card-text">
      Es momento de pensar en grande. Escribe a continuación tu idea para una aplicación web.
      Este es un tema libre que desarrollarás a lo largo del trimestre en el curso. No importa si
      aún no tienes todos los detalles técnicos resueltos, ¡lo importante es la idea principal!
    </p>

    <div class="textarea-wrapper">
      <textarea 
        bind:value={projectIdea} 
        placeholder="Ejemplo: Una plataforma para adoptar mascotas donde los usuarios puedan buscar por ciudad y tamaño..."
        rows="6"
        disabled={isSaving}
      ></textarea>
    </div>

    {#if saveSuccess}
      <div class="alert success">
        ✅ Tu idea ha sido guardada exitosamente en la base de datos.
      </div>
    {/if}

    {#if saveError}
      <div class="alert error">
        ⚠ {saveError}
      </div>
    {/if}

    <button class="save-btn" onclick={handleSave} disabled={isSaving}>
      {isSaving ? 'Guardando...' : 'Guardar Idea'}
    </button>
  </div>
</div>

<style>
  .page {
    max-width: 720px;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 2rem;
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

  .hero {
    text-align: center;
    margin-bottom: 2rem;
  }

  .hero-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: float 3.5s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
  }

  .hero-desc {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }

  .card-header {
    margin-bottom: 0.75rem;
  }

  .card-step {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #1d4ed8;
    margin-bottom: 0.3rem;
  }

  .card-header h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #1e293b;
  }

  .card-text {
    font-size: 0.92rem;
    line-height: 1.6;
    color: #475569;
    margin: 0 0 1.5rem 0;
  }

  .textarea-wrapper {
    margin-bottom: 1.5rem;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    resize: vertical;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  textarea:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }

  .save-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0.85rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .save-btn:hover:not(:disabled) {
    background: #2563eb;
  }

  .save-btn:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }

  .alert {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }

  .success {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.25rem;
    }
  }
</style>
