<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade, slide } from 'svelte/transition';

  let activeWeek = $state<number | null>(1);

  const schedule = [
    {
      week: 1,
      title: 'Semana 1: Base y acuerdos',
      tasks: [
        'Definir el modelo de datos, los endpoints de la API y los wireframes de las pantallas clave.',
        'Repartir equipos por módulo y dejar el repositorio, la base de datos y la estructura del proyecto listos.',
        'Acordar convenciones: ramas, estilos, formato de respuestas de la API.'
      ]
    },
    {
      week: 2,
      title: 'Semanas 2–3: Núcleo en paralelo',
      tasks: [
        'Registro, login y perfiles.',
        'Publicación de objetos con fotos, descripción, categoría y "qué busco a cambio".',
        'Búsqueda, filtros y favoritos.',
        'Maquetación del diseño general y de las pantallas principales.'
      ]
    },
    {
      week: 4,
      title: 'Semana 4: Flujo de intercambio',
      tasks: [
        'Solicitudes de intercambio (enviar, aceptar, rechazar).',
        'Calificaciones tras un intercambio completado.',
        'Panel admin básico: gestionar usuarios y publicaciones.',
        'Al final de la semana, primera integración de todos los módulos.'
      ]
    },
    {
      week: 5,
      title: 'Semana 5: Extras y estabilización',
      tasks: [
        'Coincidencias automáticas en versión simple: cruzar lo que ofrece cada usuario con lo que busca otro por categoría y etiquetas.',
        'Chat, solo si el núcleo ya funciona. Una alternativa más ligera son mensajes dentro de cada solicitud, sin tiempo real.',
        'Pruebas, corrección de errores y despliegue.'
      ]
    },
    {
      week: 6,
      title: 'Semana 6: Cierre',
      tasks: [
        'Congelar el código (solo se corrigen errores).',
        'Preparar los datos de demostración y el guion de la demo.',
        'Ensayos de la presentación y documentación final.'
      ]
    }
  ];

  function toggleWeek(week: number) {
    activeWeek = activeWeek === week ? null : week;
  }
</script>

<svelte:head>
  <title>Proyecto Colaborativo - Desarrollo Web 2</title>
</svelte:head>

<div class="page" in:fade={{duration: 200}}>
  <button class="back-btn" onclick={() => goto('/desarrollo-web-2')}>
    <span>←</span> Volver a Desarrollo Web 2
  </button>

  <header class="hero">
    <div class="hero-icon">🤝</div>
    <h1>Proyecto Colaborativo: <span>TRUEQ</span></h1>
    <p>
      Una plataforma web donde las personas pueden intercambiar objetos que ya no utilizan.
      Cuenta con búsqueda, filtros, favoritos, perfiles, chat, solicitudes de intercambio, calificaciones 
      y un sistema de coincidencias automáticas. También incluye un panel administrativo completo.
    </p>
  </header>

  <section class="stack-section">
    <h2>Stack Tecnológico</h2>
    <div class="stack-grid">
      <div class="stack-card svelte">
        <div class="stack-icon">🔥</div>
        <h3>Frontend</h3>
        <p>Svelte JS</p>
      </div>
      <div class="stack-card node">
        <div class="stack-icon">🟢</div>
        <h3>Backend</h3>
        <p>Node + Express</p>
      </div>
      <div class="stack-card mongo">
        <div class="stack-icon">🍃</div>
        <h3>Base de Datos</h3>
        <p>MongoDB</p>
      </div>
    </div>
  </section>

  <div class="main-content">
    <section class="timeline-section">
      <h2>Cronograma (6 Semanas)</h2>
      <div class="timeline">
        {#each schedule as item}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="timeline-item" class:active={activeWeek === item.week} onclick={() => toggleWeek(item.week)}>
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h3>{item.title}</h3>
                <span class="chevron" class:open={activeWeek === item.week}>▼</span>
              </div>
              {#if activeWeek === item.week}
                <div class="timeline-body" transition:slide={{duration: 250}}>
                  <ul>
                    {#each item.tasks as task}
                      <li>{task}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>

    <aside class="recommendations-sidebar">
      <div class="info-card warning">
        <div class="card-header">
          <span class="card-icon">✂️</span>
          <h3>¿Qué recortar para ser realistas?</h3>
        </div>
        <ul>
          <li>Las <strong>estadísticas avanzadas y los reportes</strong> del panel admin pasan a ser opcionales.</li>
          <li>El <strong>chat en tiempo real (WebSockets)</strong> queda como extra, no como requisito.</li>
          <li>Las <strong>coincidencias automáticas</strong> empiezan con una regla simple; si sobra tiempo se mejoran.</li>
        </ul>
      </div>

      <div class="info-card tips">
        <div class="card-header">
          <span class="card-icon">⏱️</span>
          <h3>Recomendaciones Clave</h3>
        </div>
        <ul>
          <li>Hacer una <strong>integración al final de cada semana</strong>, para no descubrir problemas en la semana 5.</li>
          <li>Tener un responsable de integración y otro de despliegue desde el inicio.</li>
          <li>Si el grupo es grande, asignar <strong>2 o 3 alumnos por módulo</strong> y asegurar que uno de los equipos se encargue del diseño y de las pruebas.</li>
        </ul>
      </div>
    </aside>
  </div>
</div>

<style>
  .page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1.5rem 5rem;
    width: 100%;
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
    transition: color 0.2s;
  }

  .back-btn:hover {
    color: #DC2626;
  }

  .hero {
    text-align: center;
    margin-bottom: 4rem;
  }

  .hero-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: inline-block;
  }

  .hero h1 {
    font-size: 2.5rem;
    color: #0f172a;
    margin: 0 0 1rem 0;
    letter-spacing: -0.03em;
  }

  .hero h1 span {
    color: #DC2626;
    background: linear-gradient(135deg, #DC2626, #f87171);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero p {
    color: #475569;
    font-size: 1.15rem;
    max-width: 750px;
    margin: 0 auto;
    line-height: 1.6;
  }

  .stack-section {
    margin-bottom: 4rem;
  }

  .stack-section h2 {
    text-align: center;
    font-size: 1.5rem;
    color: #1e293b;
    margin-bottom: 1.5rem;
  }

  .stack-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .stack-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .stack-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  }

  .stack-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .stack-card h3 {
    margin: 0 0 0.5rem 0;
    color: #334155;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stack-card p {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .svelte p { color: #ff3e00; }
  .node p { color: #16a34a; }
  .mongo p { color: #0d9488; }

  .main-content {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 3rem;
  }

  @media (max-width: 800px) {
    .main-content {
      grid-template-columns: 1fr;
    }
  }

  .timeline-section h2 {
    font-size: 1.5rem;
    color: #1e293b;
    margin-bottom: 2rem;
  }

  .timeline {
    position: relative;
    padding-left: 2rem;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e2e8f0;
  }

  .timeline-item {
    position: relative;
    margin-bottom: 1.5rem;
    cursor: pointer;
  }

  .timeline-marker {
    position: absolute;
    left: -2rem;
    top: 0.25rem;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    border: 3px solid #cbd5e1;
    transition: all 0.2s;
  }

  .timeline-item.active .timeline-marker {
    border-color: #DC2626;
    background: #fef2f2;
    transform: scale(1.2);
  }

  .timeline-content {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s;
  }

  .timeline-item.active .timeline-content {
    border-color: #fca5a5;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.05);
  }

  .timeline-header {
    padding: 1.25rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
  }

  .timeline-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #0f172a;
  }

  .chevron {
    color: #94a3b8;
    font-size: 0.8rem;
    transition: transform 0.3s ease;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  .timeline-body {
    padding: 0 1.5rem 1.5rem 1.5rem;
    background: white;
  }

  .timeline-body ul {
    margin: 1rem 0 0 0;
    padding-left: 1.25rem;
    color: #475569;
    line-height: 1.6;
  }

  .timeline-body li {
    margin-bottom: 0.5rem;
  }

  .timeline-body li:last-child {
    margin-bottom: 0;
  }

  .recommendations-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .info-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .info-card.warning {
    border-top: 4px solid #f59e0b;
    background: linear-gradient(to bottom, #fffbeb, #ffffff);
  }

  .info-card.tips {
    border-top: 4px solid #3b82f6;
    background: linear-gradient(to bottom, #eff6ff, #ffffff);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .card-header h3 {
    margin: 0;
    font-size: 1.15rem;
    color: #0f172a;
  }

  .card-icon {
    font-size: 1.5rem;
  }

  .info-card ul {
    margin: 0;
    padding-left: 1.25rem;
    color: #475569;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .info-card li {
    margin-bottom: 0.75rem;
  }
</style>
