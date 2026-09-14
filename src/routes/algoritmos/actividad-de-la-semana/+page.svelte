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
    max-width: 640px;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 3rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: none;
    color: #64748b;
    padding: 0;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 2.5rem;
    transition: color 0.2s ease;
  }

  .back-btn:hover {
    color: #0f172a;
  }

  .hero {
    margin-bottom: 2.5rem;
  }

  .hero-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  h1 {
    font-size: 1.75rem;
    letter-spacing: -0.02em;
    margin: 0 0 0.5rem;
    color: #0f172a;
    font-weight: 600;
  }

  .hero-desc {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
  }

  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.025);
    border: 1px solid rgba(0,0,0,0.04);
  }

  .card-header {
    margin-bottom: 1rem;
  }

  .card-step {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #475569;
    margin-bottom: 0.5rem;
  }

  .card-header h2 {
    margin: 0;
    font-size: 1.15rem;
    color: #0f172a;
    font-weight: 500;
  }

  .card-text {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #475569;
    margin: 0 0 1.75rem 0;
  }

  .textarea-wrapper {
    margin-bottom: 1.5rem;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1.5;
    resize: vertical;
    transition: all 0.2s ease;
    background: #f8fafc;
    color: #1e293b;
  }

  textarea:hover {
    border-color: #94a3b8;
  }

  textarea:focus {
    outline: none;
    border-color: #0f172a;
    background: white;
    box-shadow: 0 0 0 1px #0f172a;
  }

  textarea:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    border-color: #e2e8f0;
  }

  .save-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0.85rem;
    background: #0f172a;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .save-btn:hover:not(:disabled) {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }

  .save-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .alert {
    padding: 0.85rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .success {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  }

  .error {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  @media (max-width: 600px) {
    .card {
      padding: 1.5rem;
      border-radius: 12px;
    }
    
    h1 {
      font-size: 1.5rem;
    }
  }
</style>
