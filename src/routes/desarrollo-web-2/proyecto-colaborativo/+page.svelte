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

  const roles = [
    {
      icon: '🧭',
      title: 'Project Manager',
      who: 'Docente',
      count: '1 persona',
      focus: 'Backlog, cronograma 6 semanas, desbloqueo e integración semanal.',
      tasks: ['Prioriza el backlog y define qué se recorta', 'Valida la integración de cada semana', 'Coordina la demo final y la documentación']
    },
    {
      icon: '📐',
      title: 'Analista de Requerimientos / Tech Lead',
      who: '1 estudiante',
      count: 'Semana 1 fuerte, luego integración',
      focus: 'Define y normaliza requerimientos técnicos: modelo Mongo, contrato API y wireframes.',
      tasks: ['Modelo de datos y endpoints (contrato API)', 'Wireframes de pantallas clave y convenciones', 'Desde semana 2 apoya integración y panel admin']
    },
    {
      icon: '🎨',
      title: 'Frontend Dev',
      who: '2 estudiantes',
      count: 'En paralelo semanas 2–3',
      focus: 'Svelte: maquetación, búsqueda, filtros, favoritos, perfiles y solicitudes.',
      tasks: ['Pantallas principales y diseño general', 'Búsqueda, filtros, favoritos y perfiles', 'Consumo de la API según contrato']
    },
    {
      icon: '🔧',
      title: 'Backend Dev',
      who: '2 estudiantes',
      count: 'En paralelo semanas 2–4',
      focus: 'Node + Express + MongoDB: auth, publicaciones, solicitudes, calificaciones.',
      tasks: ['Registro, login y perfiles (API)', 'Publicaciones, solicitudes y calificaciones', 'Panel admin API y coincidencias simples']
    },
    {
      icon: '🧪',
      title: 'QA / DevOps (Testing y Despliegues)',
      who: '1 estudiante',
      count: 'Transversal desde semana 1',
      focus: 'Plan de pruebas, integración continua y despliegues Vercel + Render + Atlas.',
      tasks: ['Pruebas y corrección desde la semana 2', 'Despliegues y datos de demostración', 'Guion de demo y estabilización semana 5']
    }
  ];
</script>

<svelte:head>
  <title>Proyecto Colaborativo - Desarrollo Web 2</title>
</svelte:head>

<div class="page" in:fade={{duration: 200}}>
  <button class="back-btn" onclick={() => goto('/desarrollo-web-2')}>
    <span>←</span> Volver a Desarrollo Web 2
  </button>

  <header class="hero">
    <span class="hero-badge">🤝 Proyecto colaborativo · DW2</span>
    <h1>TRUEQ <span>Intercambios P2P</span></h1>
    <p>
      Plataforma para intercambiar objetos en desuso: búsqueda, filtros, favoritos, perfiles,
      solicitudes, calificaciones, coincidencias simples y panel admin. Chat en tiempo real solo como extra.
    </p>
    <div class="hero-meta">
      <span>📅 6 semanas</span>
      <span>👥 6 estudiantes + docente PM</span>
      <span>🔥 Svelte · Node · MongoDB</span>
    </div>
  </header>

  <section class="block">
    <span class="eyebrow">01 — Base técnica</span>
    <h2>Stack tecnológico</h2>
    <div class="stack-grid">
      <div class="stack-card svelte">
        <div class="stack-icon">🔥</div>
        <h3>Frontend</h3>
        <p>Svelte</p>
        <span class="stack-note">Búsqueda · Filtros · Perfiles</span>
      </div>
      <div class="stack-card node">
        <div class="stack-icon">🟢</div>
        <h3>Backend</h3>
        <p>Node + Express</p>
        <span class="stack-note">Auth · API · Solicitudes</span>
      </div>
      <div class="stack-card mongo">
        <div class="stack-icon">🍃</div>
        <h3>Base de datos</h3>
        <p>MongoDB</p>
        <span class="stack-note">Atlas · Modelo TRUEQ</span>
      </div>
    </div>
    <div class="deploy-strip">
      <span>🚀 Despliegue:</span>
      <strong>Vercel</strong><span class="dot">·</span>
      <strong>Render</strong><span class="dot">·</span>
      <strong>MongoDB Atlas</strong>
    </div>
  </section>

  <section class="block">
    <span class="eyebrow">02 — Equipo</span>
    <h2>Roles (7 personas)</h2>
    <p class="roles-intro">
      Docente como Project Manager. El analista normaliza en semana 1 y luego se suma a integración;
      QA/DevOps es transversal desde el inicio para no acumular pruebas ni despliegue al final.
    </p>
    <div class="roles-grid">
      {#each roles as role, ri}
        <div class="role-card" class:lead={ri === 0}>
          <div class="role-top">
            <span class="role-icon">{role.icon}</span>
            <div>
              <h3>{role.title}</h3>
              <span class="role-who">{role.who} · {role.count}</span>
            </div>
          </div>
          <p class="role-focus">{role.focus}</p>
          <ul>
            {#each role.tasks as t}
              <li>{t}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </section>

  <div class="main-content">
    <section class="block timeline-section">
      <span class="eyebrow">03 — Plan</span>
      <h2>Cronograma (6 semanas)</h2>
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
      <div class="info-card work">
        <div class="card-header">
          <span class="card-icon">📌</span>
          <h3>Acuerdos de trabajo</h3>
        </div>
        <ul>
          <li><strong>Integración cada viernes:</strong> nada se queda en rama más de una semana.</li>
          <li><strong>Ramas por módulo</strong> + <code>main</code> protegida; PR con revisión de otro equipo.</li>
          <li><strong>Contrato API primero:</strong> si cambia un endpoint, se avisa en el grupo el mismo día.</li>
        </ul>
      </div>

      <div class="info-card warning">
        <div class="card-header">
          <span class="card-icon">✂️</span>
          <h3>¿Qué recortar?</h3>
        </div>
        <ul>
          <li><strong>Reportes avanzados</strong> del admin → opcional.</li>
          <li><strong>Chat realtime</strong> → extra; alternativa: mensajes por solicitud.</li>
          <li><strong>Matching</strong> → regla simple por categoría/etiquetas.</li>
        </ul>
      </div>

      <div class="info-card tips">
        <div class="card-header">
          <span class="card-icon">⏱️</span>
          <h3>Recomendaciones</h3>
        </div>
        <ul>
          <li>Integración semanal para no descubrir fallos en semana 5.</li>
          <li>Responsables de integración y despliegue desde el día 1.</li>
          <li>2 estudiantes por módulo (frontend/backend) + diseño y pruebas cubiertos.</li>
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
    margin-bottom: 2.5rem;
    background: linear-gradient(to bottom, #fef2f2, transparent);
    border: 1px solid #fecaca;
    border-radius: 20px;
    padding: 2.5rem 1.5rem 2rem;
  }

  .hero-badge {
    display: inline-block;
    font-size: 0.78rem;
    font-weight: 700;
    color: #b91c1c;
    background: white;
    border: 1px solid #fecaca;
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    margin-bottom: 1rem;
  }

  .hero h1 {
    font-size: 2.5rem;
    color: #0f172a;
    margin: 0 0 0.75rem 0;
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
    font-size: 1.05rem;
    max-width: 720px;
    margin: 0 auto 1.25rem;
    line-height: 1.6;
  }

  .hero-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .hero-meta span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #334155;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    padding: 0.35rem 0.85rem;
  }

  .block {
    margin-bottom: 2.5rem;
  }

  .block h2 {
    font-size: 1.4rem;
    color: #1e293b;
    margin: 0.35rem 0 1rem 0;
  }

  .eyebrow {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #DC2626;
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

  .stack-note {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 500;
  }

  .deploy-strip {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 12px;
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }

  .deploy-strip .dot {
    opacity: 0.4;
  }

  .main-content {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 2rem;
    align-items: start;
  }

  @media (max-width: 860px) {
    .main-content {
      grid-template-columns: 1fr;
    }
  }

  .timeline-section h2 {
    font-size: 1.4rem;
    color: #1e293b;
    margin: 0.35rem 0 1rem 0;
  }

  .roles-intro {
    color: #475569;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  .roles-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 700px) {
    .roles-grid {
      grid-template-columns: 1fr;
    }
  }

  .role-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.1rem 1.2rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  .role-card.lead {
    grid-column: 1 / -1;
    border-left: 4px solid #DC2626;
    background: linear-gradient(to right, #fef2f2, #ffffff);
  }

  .role-top {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 0.6rem;
  }

  .role-icon {
    font-size: 1.6rem;
  }

  .role-card h3 {
    margin: 0;
    font-size: 1rem;
    color: #0f172a;
  }

  .role-who {
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 600;
  }

  .role-focus {
    font-size: 0.88rem;
    color: #334155;
    margin: 0 0 0.6rem 0;
    line-height: 1.5;
  }

  .role-card ul {
    margin: 0;
    padding-left: 1.1rem;
    color: #475569;
    font-size: 0.85rem;
    line-height: 1.55;
  }

  .role-card li {
    margin-bottom: 0.3rem;
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

  .info-card.work {
    border-top: 4px solid #16a34a;
    background: linear-gradient(to bottom, #f0fdf4, #ffffff);
  }

  .info-card code {
    background: #f1f5f9;
    padding: 0.1rem 0.35rem;
    border-radius: 6px;
    font-size: 0.8rem;
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
