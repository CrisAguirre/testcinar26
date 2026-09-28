<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let nivel = $state<'n1' | 'n2'>('n1');
  let analisisAbierto = $state<string | null>(null);

  const problemsN1 = [
    { id: 1, text: 'Pedir 2 números al usuario y sumarlos, restarlos, multiplicarlos y dividirlos.', propuesto: false },
    { id: 2, text: 'Convertir Grados Celsius a Grados Fahrenheit', propuesto: true },
    { id: 3, text: 'Sacar la hipotenusa de un triángulo rectángulo, pidiendo al usuario el valor de los 2 catetos.', propuesto: false },
    { id: 4, text: 'Hacer un Programa que calcule longitudes de Circunferencia.', propuesto: true },
    { id: 5, text: 'Hacer un Programa que calcule áreas de trapecios.', propuesto: false },
    { id: 6, text: 'Calcule la media aritmética de 3 números cualesquiera.', propuesto: true },
    { id: 7, text: 'Una tienda ofrece un descuento del 15% sobre el total de la compra y un cliente desea saber cuánto deberá pagar finalmente por su compra.', propuesto: false },
    { id: 8, text: 'Dadas las horas trabajadas de una persona y el valor por hora. Calcular su salario e imprimirlo.', propuesto: true },
    { id: 9, text: 'Calcular el nuevo salario de un obrero si obtuvo un incremento del 25% sobre su salario anterior.', propuesto: false },
    { id: 10, text: 'Un alumno desea saber cuál será su calificación final en la materia de Algoritmos. Dicha calificación se compone de los siguientes porcentajes: 55% del promedio de sus tres calificaciones parciales, 30% de la calificación del examen final, 15% de la calificación de un trabajo final.', propuesto: true },
    { id: 11, text: 'Calcular la cantidad de segundos que están incluidos en el número de horas, minutos y segundos ingresados por el usuario.', propuesto: false },
    { id: 12, text: 'Hacer un Programa que obtenga la media geométrica de tres numeros.', propuesto: true },
    { id: 13, text: 'Un maestro desea saber que porcentaje de hombres y que porcentaje de mujeres hay en un grupo de estudiantes.', propuesto: false },
    { id: 14, text: 'Volumen y Área de un Cubo.', propuesto: true },
    { id: 15, text: 'Tres personas deciden invertir su dinero para fundar un empresa. Cada una de ellas invierte una cantidad distinta. Obtener el porcentaje que cada quien invierte con respecto a la cantidad total invertida.', propuesto: false },
    { id: 16, text: 'Volumen y Área de una Esfera.', propuesto: true }
  ];

  const problemsN2 = [
    { id: 1, text: 'Determinar si un alumno aprueba o reprueba un curso, sabiendo que aprobará si su promedio de tres calificaciones es mayor o igual a 10.5; reprueba en caso contrario.', propuesto: false },
    { id: 2, text: 'Mostrar el resultado de la suma de 2 números enteros, si esta supera a 10.', propuesto: true },
    { id: 3, text: 'Determinar si un número es par, impar o cero.', propuesto: false },
    { id: 4, text: 'Dado 3 números calcular el mayor.', propuesto: true },
    { id: 5, text: 'Ingrese 2 números desde el teclado e imprima solo los positivos.', propuesto: false },
    { id: 6, text: 'Un obrero necesita calcular su salario semanal: si trabaja 40 horas o menos se le paga $16 por hora; si trabaja más de 40 horas se le paga $16 por las primeras 40 y $20 por cada hora extra.', propuesto: true },
    { id: 7, text: 'Ingresar por teclado el nombre y el signo de cualquier persona e imprima el nombre solo si la persona es signo Aries.', propuesto: false },
    { id: 8, text: 'Ingresar nombre, edad y sexo e imprima, solo si es masculino y mayor de edad, el nombre de la persona.', propuesto: true },
    { id: 9, text: 'Calcule el total a pagar por camisas: 3 o más 20% de descuento, menos de 3 un 10%.', propuesto: false },
    { id: 10, text: 'Supermercado: número al azar; si es menor que 74 descuento 15%, si es mayor o igual a 74 descuento 20%. Calcular descuento.', propuesto: true },
    { id: 11, text: 'Llantera: cada llanta $800 si se compran menos de 5 y $700 si son 5 o más. Calcular total.', propuesto: false },
    { id: 12, text: 'Almacén: 20% de descuento si la compra supera $1000. ¿Cuánto pagará?', propuesto: true },
    { id: 13, text: 'Ecuaciones de segundo grado: Ax^2 + Bx + C. Calcular raíces.', propuesto: false },
    { id: 14, text: 'Leer 2 números e imprimirlos en forma ascendente.', propuesto: true },
    { id: 15, text: 'Simular el lanzamiento de una moneda (cara / sello).', propuesto: false },
    { id: 16, text: 'Motos: Honda 5%, Yamaha 8%, Suzuki 10%, otras marcas 2% de descuento.', propuesto: true },
    { id: 17, text: 'Bolita: blanca 0%, verde 10%, amarilla 25%, azul 50%, roja 100% de descuento sobre la compra.', propuesto: false },
    { id: 18, text: 'Pedir tres números y detectar si están en orden creciente.', propuesto: true },
    { id: 19, text: 'Pedir tres números e indicar si el tercero es igual a la suma de los dos primeros.', propuesto: false },
    { id: 20, text: 'Tomar tres números y decir si la multiplicación de los dos primeros es igual al tercero.', propuesto: true },
    { id: 21, text: 'Leer hora en horas:minutos:segundos y decir la hora un segundo después.', propuesto: false },
    { id: 22, text: 'Tomar dos números y decir si ambos son pares o impares.', propuesto: true }
  ];

  let problems = $derived.by(() => (nivel === 'n1' ? problemsN1 : problemsN2));

  function analisisN1(p) {
    return `Revisar (secuencial): 1) Leer: ¿qué datos pide? 2) Asignar: ¿qué fórmula usa? 3) Escribir: ¿qué mensaje muestra? Carga en el editor con "Abrir en Editor DFD", ejecuta Paso a paso y anota variables. Problema ${p.id}.`;
  }
  function analisisN2(p) {
    return `Analizar (condicional Si/No): 1) Leer entradas. 2) Condición del rombo: ¿qué compara? 3) Rama Sí (izquierda) vs Rama No (derecha). Prueba 2 casos: uno que cumpla y otro que no. Carga con "Abrir en Editor DFD" y mira el verde en Paso a paso. Problema N2-${p.id}.`;
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
    <p class="hero-desc">Ejercicios DFD — Nivel 1: Operadores y Nivel 2: Condicionales</p>
  </div>

  <div class="info-banner">
    <span class="info-banner-icon">💡</span>
    <div>
      <strong>Práctica Semanal:</strong> Revisa el enunciado, abre el ejercicio en el editor y analízalo con
      <b>Paso a paso</b>. Los marcados como
      <span class="badge badge-propuesto">Propuesto</span> los desarrolla el estudiante.
      Nivel 1 = secuencial (Leer → Calcular → Mostrar). Nivel 2 = condicional (Si / No).
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
  </div>

  <div class="problems-grid">
    {#each problems as problem}
      <div class="problem-card">
        <div class="problem-header">
          <span class="problem-id">{nivel === 'n1' ? `Problema ${problem.id}` : `N2-Problema ${problem.id}`}</span>
          {#if problem.propuesto}
            <span class="badge badge-propuesto">Propuesto</span>
          {:else}
            <span class="badge badge-resuelto">Resuelto</span>
          {/if}
        </div>
        <p class="problem-text">{problem.text}</p>

        <div class="problem-action">
          <button class="solve-btn" onclick={() => goto(nivel === 'n1' ? `/algoritmos/dfd?load=N1-${problem.id}` : `/algoritmos/dfd?load=N2-${problem.id}`)}>
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
            <p class="analysis-text">{nivel === 'n1' ? analisisN1(problem) : analisisN2(problem)}</p>
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
    animation: bounce 2s infinite;
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
  }
</style>
