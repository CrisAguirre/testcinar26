<script lang="ts">
  import { isAuthenticated, currentUser, isAdmin } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { gradesApi } from '$lib/api';

  let grades: any[] = $state([]);
  let students: any[] = $state([]);
  let loading = $state(true);
  let error = $state('');

  let showForm = $state(false);
  let editingId: string | null = $state(null);
  let formData = $state({ student: '', subject: '', score: 0, max_score: 100, period: '', comments: '' });

  onMount(async () => {
    if (!$isAuthenticated) return;
    try {
      grades = await gradesApi.getAll({});
      if ($isAdmin) {
        students = await authApi.profile();
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar datos';
    } finally {
      loading = false;
    }
  });

  function openCreate() {
    editingId = null;
    formData = { student: '', subject: '', score: 0, max_score: 100, period: '', comments: '' };
    showForm = true;
  }

  function openEdit(grade: any) {
    editingId = grade._id;
    formData = {
      student: grade.student?._id || grade.student,
      subject: grade.subject,
      score: grade.score,
      max_score: grade.max_score,
      period: grade.period,
      comments: grade.comments || ''
    };
    showForm = true;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    try {
      if (editingId) {
        await gradesApi.update(editingId, formData);
      } else {
        await gradesApi.create(formData);
      }
      showForm = false;
      grades = await gradesApi.getAll({});
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al guardar';
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta calificación?')) return;
    try {
      await gradesApi.delete(id);
      grades = await gradesApi.getAll({});
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al eliminar';
    }
  }
</script>

<svelte:head>
  <title>Calificaciones - Cinar Sistemas</title>
</svelte:head>

<div class="page">
  <div class="header">
    <h1>Gestión de Calificaciones</h1>
    {#if $isAdmin}
      <button onclick={openCreate} class="btn-primary">+ Nueva Calificación</button>
    {/if}
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if showForm && $isAdmin}
    <div class="modal-overlay" onclick={() => showForm = false}>
      <div class="modal" onclick={(e) => e.stopPropagation()}>
        <h2>{editingId ? 'Editar' : 'Nueva'} Calificación</h2>
        <form onsubmit={handleSubmit}>
          <label>Materia <input type="text" bind:value={formData.subject} required /></label>
          <label>Nota <input type="number" bind:value={formData.score} min="0" max={formData.max_score} required /></label>
          <label>Nota Máxima <input type="number" bind:value={formData.max_score} min="1" /></label>
          <label>Período <input type="text" bind:value={formData.period} placeholder="Ej: 2026-1" required /></label>
          <label>Comentarios <textarea bind:value={formData.comments}></textarea></label>
          <div class="form-actions">
            <button type="button" onclick={() => showForm = false} class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-primary">{editingId ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  {#if loading}
    <p class="loading">Cargando...</p>
  {:else if grades.length === 0}
    <p class="empty">No hay calificaciones registradas.</p>
  {:else}
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Materia</th>
            <th>Nota</th>
            <th>Máx</th>
            <th>%</th>
            <th>Período</th>
            {#if $isAdmin}<th>Acciones</th>{/if}
          </tr>
        </thead>
        <tbody>
          {#each grades as grade}
            <tr>
              <td>{grade.student?.full_name || 'N/A'}</td>
              <td>{grade.subject}</td>
              <td>{grade.score}</td>
              <td>{grade.max_score}</td>
              <td>{grade.percentage}%</td>
              <td>{grade.period}</td>
              {#if $isAdmin}
                <td class="actions">
                  <button onclick={() => openEdit(grade)} class="btn-sm">Editar</button>
                  <button onclick={() => handleDelete(grade._id)} class="btn-sm btn-danger">Eliminar</button>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .page {
    padding: 1rem 0;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .header h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  .loading, .empty, .error {
    text-align: center;
    padding: 2rem;
    color: #888;
  }

  .error {
    color: #dc2626;
    background: #fef2f2;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .table-wrapper {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  th {
    text-align: left;
    padding: 0.6rem 0.85rem;
    border-bottom: 2px solid #e5e7eb;
    font-weight: 700;
    color: #555;
  }

  td {
    padding: 0.6rem 0.85rem;
    border-bottom: 1px solid #e5e7eb;
  }

  tr:last-child td { border-bottom: none; }

  .actions {
    display: flex;
    gap: 0.4rem;
  }

  .btn-sm {
    padding: 0.3rem 0.65rem;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 5px;
    font-size: 0.78rem;
    cursor: pointer;
  }

  .btn-sm:hover { background: #f9fafb; }
  .btn-danger { color: #dc2626; border-color: #fca5a5; }
  .btn-danger:hover { background: #fef2f2; }

  .btn-primary {
    padding: 0.6rem 1.2rem;
    background: var(--color-theme-1);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-primary:hover { opacity: 0.9; }

  .btn-cancel {
    padding: 0.6rem 1.2rem;
    background: none;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    padding: 1rem;
  }

  .modal {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal h2 {
    margin: 0 0 1.25rem;
    font-size: 1.2rem;
  }

  .modal form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .modal label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .modal input, .modal textarea {
    padding: 0.55rem 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    font-size: 0.95rem;
  }

  .modal input:focus, .modal textarea:focus {
    outline: none;
    border-color: var(--color-theme-1);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
</style>
