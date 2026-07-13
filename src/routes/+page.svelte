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

    <div class="subject-card" onclick={() => window.location.href='/desarrollo-web-1'}>
      <div class="subject-card-inner">
        <div class="subject-icon">&#128218;</div>
        <h2>Desarrollo Web 1</h2>
        <p class="subject-desc">Ingresa a la asignatura para ver tus evaluaciones</p>
        <div class="subject-exams">
          <div class="exam-card" onclick={(e) => { e.stopPropagation(); window.location.href='/desarrollo-web-1/parcial-1'; }}>
            <span class="exam-icon">&#128221;</span>
            <span class="exam-label">Parcial 1</span>
            <span class="exam-arrow">&#8594;</span>
          </div>
        </div>
      </div>
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

  .subject-card {
    margin-top: 1.5rem;
    perspective: 1000px;
    animation: fadeInUp 0.6s ease-out;
  }

  .subject-card-inner {
    background: linear-gradient(135deg, var(--color-theme-2), #2c5f8a);
    border-radius: 16px;
    padding: 2rem;
    color: white;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 20px rgba(64, 117, 166, 0.3);
    position: relative;
    overflow: hidden;
  }

  .subject-card-inner::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .subject-card-inner:hover::before {
    opacity: 1;
  }

  .subject-card-inner:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(64, 117, 166, 0.4);
  }

  .subject-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .subject-card h2 {
    font-size: 1.3rem;
    margin: 0 0 0.25rem;
    color: white;
  }

  .subject-desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 1.25rem;
  }

  .subject-exams {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .exam-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
  }

  .exam-card:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(6px);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .exam-icon {
    font-size: 1.3rem;
  }

  .exam-label {
    flex: 1;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .exam-arrow {
    font-size: 1.1rem;
    transition: transform 0.3s ease;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>