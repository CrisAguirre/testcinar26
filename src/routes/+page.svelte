<script lang="ts">
  import { isAuthenticated, currentUser, isAdmin } from '$lib/stores/auth';
  import { onMount } from 'svelte';
  import { gradesApi } from '$lib/api';

  let grades: any[] = $state([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    if (!$isAuthenticated) return;
    try {
      const data = await gradesApi.getMine();
      grades = data;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar datos';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Inicio - Cinar Sistemas</title>
</svelte:head>

{#if $isAuthenticated}
  <div class="dashboard">
    <h1>Bienvenido, {$currentUser?.full_name || $currentUser?.username}</h1>
    <p class="role-badge">Rol: {$currentUser?.role}</p>

    <div class="card">
      <h2>Mis Calificaciones</h2>

      {#if loading}
        <p class="loading">Cargando...</p>
      {:else if error}
        <p class="error">{error}</p>
      {:else if grades.length === 0}
        <p class="empty">No hay calificaciones registradas.</p>
      {:else}
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Materia</th>
                <th>Nota</th>
                <th>Máximo</th>
                <th>Porcentaje</th>
                <th>Período</th>
              </tr>
            </thead>
            <tbody>
              {#each grades as grade}
                <tr>
                  <td>{grade.subject}</td>
                  <td>{grade.score}</td>
                  <td>{grade.max_score}</td>
                  <td>{grade.percentage}%</td>
                  <td>{grade.period}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .dashboard {
    padding: 1rem 0;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.35rem;
  }

  .role-badge {
    display: inline-block;
    background: var(--color-theme-2);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0 0 1.5rem;
  }

  .card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .card h2 {
    font-size: 1.15rem;
    margin: 0 0 1rem;
  }

  .loading, .empty, .error {
    text-align: center;
    padding: 2rem;
    color: #888;
  }

  .error {
    color: #dc2626;
  }

  .table-wrapper {
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

  tr:last-child td {
    border-bottom: none;
  }
</style>
