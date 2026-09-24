<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade, slide } from 'svelte/transition';
  import { onMount } from 'svelte';

  interface WeeklyStep {
    n: string;
    title: string;
    status: 'done' | 'next';
    badge: string;
    desc: string;
    items: string[];
    icon: string;
  }

  const weeklySteps: WeeklyStep[] = [
    {
      n: 'Paso 1',
      title: 'Registro en plataformas',
      status: 'done',
      badge: '✅ Completada',
      desc: 'Cada estudiante se registró con su mismo correo en las 4 plataformas del flujo.',
      items: ['GitHub', 'MongoDB Atlas', 'Render', 'Vercel'],
      icon: '📝'
    },
    {
      n: 'Paso 2',
      title: 'Repos + base de datos',
      status: 'done',
      badge: '✅ Completada',
      desc: 'Se crearon los repositorios front y back en GitHub y la base de datos de la app en Mongo Atlas.',
      items: ['Repo frontend en GitHub', 'Repo backend en GitHub', 'Database en Mongo Atlas'],
      icon: '🗂️'
    },
    {
      n: 'Paso 3 · martes 29 de septiembre',
      title: 'Instalar OpenCode y codificar',
      status: 'next',
      badge: '⏳ Próximo',
      desc: 'Vamos a instalar OpenCode desde Dui Warp para empezar a codificar la app.',
      items: ['Instalar OpenCode (Dui Warp)', 'Conectar repos + Atlas', 'Primer commit de la app'],
      icon: '💻'
    }
  ];

  let activeStep = $state(0);
  let paused = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  function nextStep() {
    activeStep = (activeStep + 1) % weeklySteps.length;
  }

  function prevStep() {
    activeStep = (activeStep - 1 + weeklySteps.length) % weeklySteps.length;
  }

  function goStep(i: number) {
    activeStep = i;
  }

  onMount(() => {
    timer = setInterval(() => {
      if (!paused) nextStep();
    }, 6000);
    return () => {
      if (timer) clearInterval(timer);
    };
  });

  interface Project {
    student: string;
    idea: string;
    frontend: string;
    backend: string;
    database: string;
  }

  const projects: Project[] = [
    {
      student: 'David Santiago Erazo Moncayo',
      idea: 'Sistema de organización de libros de una biblioteca.',
      frontend: 'Angular',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Oscar Rodriguez',
      idea: 'Desarrollar una aplicación web educativa sobre ciberseguridad, donde se puedan consultar lecciones y videos sobre diferentes temas de seguridad informática.',
      frontend: 'Angular',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Claudia Verónica',
      idea: 'Crear una página web para vender accesorios en bisutería.',
      frontend: 'React',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'David felipe Narváez',
      idea: 'Rutas seguras: Crear un app móvil para reportar zonas de riesgos y recibir alertas en tiempo real.',
      frontend: 'React',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Juan Carlos Bastidas',
      idea: 'App que permita a los usuarios registrados conocer en tiempo real el valor con descuentos extraordinarios o promociones en productos de alta calidad.',
      frontend: 'React',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Jeferson Hernández',
      idea: 'App de conceptos, ayudas y normas de seguridad y salud en el trabajo.',
      frontend: 'Vue',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Ivan Felipe Guancha Galindres',
      idea: 'Un tutor virtual (app) Inglés-Español. Un mini robot que pueda orientar y ayudar con herramientas de escritura y escucha, diseñado para ser creativo y entretenido para niños.',
      frontend: 'React',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Andrea liseth',
      idea: 'Página donde un depósito de cerveza pueda tener más facilidad con sus clientes de diferentes pueblos, manejando pedidos, envíos, pagos y catálogos.',
      frontend: 'Angular',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Jhojan rodriguez',
      idea: 'Una plataforma que pueda ayudar al usuario a ensamblar una computadora o celulares con información y ayuda virtual de ensamblaje.',
      frontend: 'React',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Andrés Felipe Mena',
      idea: 'Pasto Limpio – Recordatorio de recolección de residuos. Aplicación móvil que permita registrar dirección y día de recolección, generando recordatorios automáticos para sacar los residuos.',
      frontend: 'Vue',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Brayan Buesaquillo',
      idea: 'Plataforma enfocada en el diagnóstico y asistencia para equipos electrónicos. Permite seleccionar el equipo, describir la falla y a través de un algoritmo de preguntas y respuestas, proporciona posibles causas y recomendaciones.',
      frontend: 'React',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Jairo Granja Bravo',
      idea: 'Estrategia para atraer clientes en el campo de la compraventa de oro.',
      frontend: 'Angular',
      backend: 'Node-express',
      database: 'Mongo'
    },
    {
      student: 'Julián David Reina Cabrera',
      idea: 'Proyecto personal por definir — pendiente de asignación por el estudiante.',
      frontend: 'React',
      backend: 'Node-express',
      database: 'Mongo'
    }
  ];

  let searchQuery = $state('');
  
  let filteredProjects = $derived(
    projects.filter(p => 
      p.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.idea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.frontend.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function getTechColor(tech: string) {
    const t = tech.toLowerCase();
    if (t.includes('react')) return 'tech-react';
    if (t.includes('angular')) return 'tech-angular';
    if (t.includes('vue')) return 'tech-vue';
    if (t.includes('node') || t.includes('express')) return 'tech-node';
    if (t.includes('mongo')) return 'tech-mongo';
    return 'tech-default';
  }
</script>

<svelte:head>
  <title>Proyecto Personal - Algoritmos</title>
</svelte:head>

<div class="page" in:fade={{duration: 200}}>
  <button class="back-btn" onclick={() => goto('/algoritmos')}>
    <span>←</span> Volver a Algoritmos
  </button>

  <header class="hero">
    <div class="hero-icon">🚀</div>
    <h1>Proyectos Personales</h1>
    <p>Consolidado de elección de proyectos y stack tecnológico para la asignatura de Algoritmos.</p>
  </header>

  <section
    class="carousel"
    aria-label="Avance semanal del proyecto"
    onmouseenter={() => paused = true}
    onmouseleave={() => paused = false}
  >
    <div class="carousel-head">
      <span class="carousel-eyebrow">🛠️ Desarrollo semanal</span>
      <h2>Tareas completadas</h2>
      <p>Desliza para ver el avance del proyecto paso a paso.</p>
    </div>
    <div class="carousel-viewport">
      <div class="carousel-track" style="transform: translateX(-{activeStep * 100}%);">
        {#each weeklySteps as step}
          <article class="carousel-slide {step.status}">
            <div class="slide-icon">{step.icon}</div>
            <span class="slide-n">{step.n}</span>
            <h3>{step.title}</h3>
            <span class="slide-badge {step.status}">{step.badge}</span>
            <p class="slide-desc">{step.desc}</p>
            <ul>
              {#each step.items as item}
                <li>{item}</li>
              {/each}
            </ul>
          </article>
        {/each}
      </div>
      <button class="carousel-arrow left" onclick={prevStep} aria-label="Anterior">‹</button>
      <button class="carousel-arrow right" onclick={nextStep} aria-label="Siguiente">›</button>
    </div>
    <div class="carousel-dots">
      {#each weeklySteps as _, i}
        <button
          class="dot {i === activeStep ? 'active' : ''}"
          onclick={() => goStep(i)}
          aria-label="Ir al paso {i + 1}"
        ></button>
      {/each}
    </div>
    <div class="carousel-progress">
      <div class="carousel-progress-bar" style="width: {((activeStep + 1) / weeklySteps.length) * 100}%;"></div>
    </div>
  </section>

  <div class="search-container">
    <input 
      type="text" 
      bind:value={searchQuery} 
      placeholder="Buscar por estudiante, idea o tecnología..."
      class="search-input"
    />
    <span class="search-icon">🔍</span>
  </div>

  <div class="projects-grid">
    {#each filteredProjects as project (project.student)}
      <div class="project-card" transition:slide={{duration: 200}}>
        <div class="card-header">
          <div class="avatar">{project.student.charAt(0).toUpperCase()}</div>
          <h2 class="student-name">{project.student}</h2>
        </div>
        
        <div class="card-body">
          <div class="idea-section">
            <span class="section-icon">💡</span>
            <p>{project.idea}</p>
          </div>
          
          <div class="stack-section">
            <h3 class="stack-title">Stack de Desarrollo</h3>
            <div class="tech-tags">
              <span class="tech-tag {getTechColor(project.frontend)}">
                <span class="tech-label">Frontend</span>
                <strong>{project.frontend}</strong>
              </span>
              <span class="tech-tag {getTechColor(project.backend)}">
                <span class="tech-label">Backend</span>
                <strong>{project.backend}</strong>
              </span>
              <span class="tech-tag {getTechColor(project.database)}">
                <span class="tech-label">DB</span>
                <strong>{project.database}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="no-results" in:fade>
        <span class="no-results-icon">🤔</span>
        <p>No se encontraron proyectos que coincidan con tu búsqueda.</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .page {
    max-width: 900px;
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
    color: #10B981;
  }

  .hero {
    text-align: center;
    margin-bottom: 3rem;
  }

  .hero-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    display: inline-block;
    animation: bounce 2s infinite ease-in-out;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .hero h1 {
    font-size: 2.5rem;
    color: #0f172a;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.03em;
  }

  .hero p {
    color: #64748b;
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.5;
  }

  .search-container {
    position: relative;
    max-width: 600px;
    margin: 0 auto 3rem;
  }

  .search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 1rem;
    color: #334155;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .search-input:focus {
    outline: none;
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 1.2rem;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
  }

  .project-card {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    border-color: #cbd5e1;
  }

  .card-header {
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #10B981;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .student-name {
    margin: 0;
    font-size: 1.15rem;
    color: #0f172a;
    font-weight: 600;
  }

  .card-body {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .idea-section {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .section-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  .idea-section p {
    margin: 0;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .stack-title {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    margin: 0 0 0.75rem 0;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-tag {
    display: flex;
    flex-direction: column;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-size: 0.85rem;
    border: 1px solid transparent;
  }

  .tech-label {
    font-size: 0.7rem;
    opacity: 0.8;
    margin-bottom: 0.1rem;
    text-transform: uppercase;
  }

  /* Tech Colors */
  .tech-react { background: #eff6ff; color: #1e3a8a; border-color: #bfdbfe; }
  .tech-angular { background: #fef2f2; color: #7f1d1d; border-color: #fecaca; }
  .tech-vue { background: #f0fdf4; color: #14532d; border-color: #bbf7d0; }
  .tech-node { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
  .tech-mongo { background: #f0fdfa; color: #134e4a; border-color: #bfdbfe; }
  .tech-default { background: #f1f5f9; color: #475569; border-color: #e2e8f0; }

  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 16px;
    border: 1px dashed #cbd5e1;
  }

  .no-results-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  .no-results p {
    color: #64748b;
    font-size: 1.1rem;
    margin: 0;
  }

  .carousel {
    background: linear-gradient(135deg, #ecfdf5, #ffffff 60%, #eff6ff);
    border: 1px solid #d1fae5;
    border-radius: 20px;
    padding: 1.75rem 1.5rem 1.5rem;
    margin-bottom: 2.5rem;
    box-shadow: 0 10px 30px -12px rgba(16, 185, 129, 0.35);
    overflow: hidden;
  }

  .carousel-head {
    text-align: center;
    margin-bottom: 1.25rem;
  }

  .carousel-eyebrow {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #047857;
    background: white;
    border: 1px solid #a7f3d0;
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    margin-bottom: 0.6rem;
  }

  .carousel-head h2 {
    margin: 0 0 0.25rem;
    font-size: 1.6rem;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .carousel-head p {
    margin: 0;
    color: #64748b;
    font-size: 0.95rem;
  }

  .carousel-viewport {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
  }

  .carousel-track {
    display: flex;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .carousel-slide {
    flex: 0 0 100%;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.5rem 3.5rem;
    text-align: center;
    transform: scale(0.98);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }

  .carousel-slide:hover {
    transform: scale(1) translateY(-3px);
    box-shadow: 0 14px 30px -14px rgba(15, 23, 42, 0.25);
  }

  .carousel-slide.next {
    border-color: #fcd34d;
    background: linear-gradient(to bottom, #fffbeb, #ffffff 70%);
  }

  .slide-icon {
    font-size: 2.5rem;
    animation: slideFloat 3s ease-in-out infinite;
  }

  @keyframes slideFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-6px) scale(1.08); }
  }

  .slide-n {
    display: block;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #10b981;
    margin: 0.5rem 0 0.15rem;
  }

  .carousel-slide h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    color: #0f172a;
  }

  .slide-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 0.25rem 0.8rem;
    border-radius: 999px;
    margin-bottom: 0.75rem;
  }

  .slide-badge.done {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
  }

  .slide-badge.next {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fcd34d;
  }

  .slide-desc {
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.6;
    max-width: 560px;
    margin: 0 auto 1rem;
  }

  .carousel-slide ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .carousel-slide li {
    font-size: 0.82rem;
    font-weight: 600;
    color: #334155;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 0.35rem 0.8rem;
    border-radius: 999px;
  }

  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) scale(1);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: white;
    color: #0f172a;
    font-size: 1.4rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
    transition: transform 0.2s ease, background 0.2s ease;
    line-height: 1;
  }

  .carousel-arrow:hover {
    transform: translateY(-50%) scale(1.12);
    background: #10b981;
    color: white;
    border-color: #10b981;
  }

  .carousel-arrow.left { left: 0.6rem; }
  .carousel-arrow.right { right: 0.6rem; }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    border: none;
    background: #cbd5e1;
    cursor: pointer;
    padding: 0;
    transition: transform 0.25s ease, background 0.25s ease, width 0.25s ease;
  }

  .dot.active {
    width: 28px;
    background: #10b981;
    transform: scale(1.05);
  }

  .carousel-progress {
    height: 6px;
    background: #e2e8f0;
    border-radius: 999px;
    margin-top: 0.85rem;
    overflow: hidden;
  }

  .carousel-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #3b82f6);
    border-radius: 999px;
    transition: width 0.5s ease;
  }

  @media (max-width: 600px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }

    .carousel {
      padding: 1.25rem 1rem 1.1rem;
    }

    .carousel-slide {
      padding: 1.25rem 2.75rem;
    }
  }
</style>
