<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { problemsN1, problemsN2, problemsN3 } from '$lib/data/dfdExercises';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let nivel = $state<'n1' | 'n2' | 'n3'>('n1');
  let analisisAbierto = $state<string | null>(null);

  let problems = $derived.by(() => {
    if (nivel === 'n1') return problemsN1;
    if (nivel === 'n2') return problemsN2;
    return problemsN3;
  });

  function analisisN1(p: { id: number }) {
    return `Revisar (secuencial): 1) Leer: ¿qué datos pide? 2) Asignar: ¿qué fórmula usa? 3) Escribir: ¿qué mensaje muestra? Carga en el editor con "Abrir en Editor DFD", ejecuta Paso a paso y anota variables. Problema ${p.id}.`;
  }
  function analisisN2(p: { id: number }) {
    return `Analizar (condicional Si/No): 1) Leer entradas. 2) Condición del rombo: ¿qué compara? 3) Rama Sí (izquierda) vs Rama No (derecha). Prueba 2 casos: uno que cumpla y otro que no. Carga con "Abrir en Editor DFD" y mira el verde en Paso a paso. Problema N2-${p.id}.`;
  }
  function analisisN3(p: { id: number }) {
    return `Analizar (ciclo): 1) ¿Qué datos se leen antes del ciclo? 2) ¿Qué instrucción se repite y cuál es la condición de salida? 3) ¿Dónde se actualiza el contador o acumulador? Prueba con un valor pequeño (por ejemplo N = 3) usando "Paso a paso" y observa las variables. Ejercicio N3-${p.id}.`;
  }
  function getAnalisis(p: { id: number }) {
    if (nivel === 'n1') return analisisN1(p);
    if (nivel === 'n2') return analisisN2(p);
    return analisisN3(p);
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
    <span class="hero-icon">💻</span>
    <h1>Actividad de la semana</h1>
    <p class="hero-desc">Ejercicios DFD — Nivel 1: Operadores, Nivel 2: Condicionales y Nivel 3: Ciclos</p>
  </div>

  <div class="info-banner">
    <span class="info-banner-icon">💡</span>
    <div>
      <strong>Práctica Semanal:</strong> Revisa el enunciado, abre el ejercicio en el editor y analízalo con
      <b>Paso a paso</b>. Los marcados como
      <span class="badge badge-propuesto">Propuesto</span> los desarrolla el estudiante.
      Nivel 1 = secuencial (Leer → Calcular → Mostrar). Nivel 2 = condicional (Si / No).
      Nivel 3 = ciclos (Mientras / Repetir hasta).
    </div>
  </div>

  <div class="level-tabs" role="tablist" aria-label="Elegir nivel">
    <button
      type="button"
      role="tab"
      aria-selected={nivel === 'n1'}
      class="level-tab"
      class:active={nivel === 'n1'}
      onclick={() => { nivel = 'n1'; analisisAbierto = null; }}
    >
      🟦 Nivel 1 — Operadores (16)
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={nivel === 'n2'}
      class="level-tab"
      class:active={nivel === 'n2'}
      onclick={() => { nivel = 'n2'; analisisAbierto = null; }}
    >
      🟨 Nivel 2 — Condicionales (22)
    </button>
    <button
      type="button"
      role="tab"
      aria-selected={nivel === 'n3'}
      class="level-tab"
      class:active={nivel === 'n3'}
      onclick={() => { nivel = 'n3'; analisisAbierto = null; }}
    >
      🟩 Nivel 3 — Ciclos (12)
    </button>
  </div>

  <div class="problems-grid">
    {#each problems as problem}
      <div class="problem-card">
        <div class="problem-header">
          <span class="problem-id">{nivel === 'n1' ? `Problema ${problem.id}` : `${nivel.toUpperCase()}-Problema ${problem.id}`}</span>
          {#if problem.propuesto}
            <span class="badge badge-propuesto">Propuesto</span>
          {:else}
            <span class="badge badge-resuelto">Resuelto</span>
          {/if}
        </div>
        <p class="problem-text">{problem.text}</p>

        <div class="problem-action">
          <button class="solve-btn" onclick={() => goto(`/algoritmos/dfd?load=${nivel.toUpperCase()}-${problem.id}`)}>
            Abrir en Editor DFD →
          </button>
          <button
            class="analyze-btn"
            onclick={() => analisisAbierto = analisisAbierto === `${nivel}-${problem.id}` ? null : `${nivel}-${problem.id}`}
            aria-expanded={analisisAbierto === `${nivel}-${problem.id}`}
          >
            {analisisAbierto === `${nivel}-${problem.id}` ? 'Ocultar análisis ▲' : 'Revisar y analizar ▼'}
          </button>
          {#if analisisAbierto === `${nivel}-${problem.id}`}
            <p class="analysis-text">{getAnalisis(problem)}</p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .page {
    max-width: 800px;
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
    margin-bottom: 2rem;
    transition: color 0.2s ease;
  }

  .back-btn:hover {
    color: #0f172a;
  }

  .hero {
    text-align: center;
    margin-bottom: 2rem;
  }

  .hero-icon {
    font-size: 2.8rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: fadeIn 2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  h1 {
    font-size: 1.65rem;
    letter-spacing: -0.02em;
    margin: 0 0 0.4rem;
    color: #0f172a;
    font-weight: 700;
  }

  .hero-desc {
    font-size: 1rem;
    color: #64748b;
    margin: 0;
  }

  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 2.5rem;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #166534;
  }

  .info-banner-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .badge {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .badge-propuesto {
    background: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
  }

  .badge-resuelto {
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
  }

  .problems-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .level-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.75rem;
  }

  .level-tab {
    flex: 1;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 0.88rem;
    font-weight: 700;
    color: #475569;
    cursor: pointer;
  }

  .level-tab.active {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
  }

  .analyze-btn {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.6rem;
    background: white;
    color: #1d4ed8;
    border: 1px dashed #93c5fd;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
  }

  .analyze-btn:hover {
    background: #eff6ff;
  }

  .analysis-text {
    margin: 0.6rem 0 0 0;
    font-size: 0.85rem;
    line-height: 1.55;
    color: #334155;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.7rem 0.8rem;
  }

  .problem-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.025);
    border: 1px solid rgba(0,0,0,0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .problem-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    border-color: #cbd5e1;
  }

  .problem-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .problem-id {
    font-weight: 700;
    color: #0f172a;
    font-size: 1.1rem;
  }

  .problem-text {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #475569;
    flex: 1;
    margin: 0 0 1.5rem 0;
  }

  .problem-action {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .solve-btn {
    width: 100%;
    padding: 0.75rem;
    background: #f8fafc;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .solve-btn:hover {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
  }

  @media (max-width: 600px) {
    .problems-grid {
      grid-template-columns: 1fr;
    }
    .level-tabs {
      flex-direction: column;
    }
    .level-tab {
      font-size: 0.82rem;
      padding: 0.6rem 0.7rem;
    }
  }
</style>
