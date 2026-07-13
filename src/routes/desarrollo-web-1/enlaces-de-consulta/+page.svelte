<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let searchQuery = $state('');

  const categories = [
    {
      title: 'Documentación y Tutoriales',
      icon: '📚',
      color: '#3b82f6',
      links: [
        { title: 'Svelte — Documentación Oficial', url: 'https://svelte.dev/tutorial/svelte/welcome-to-svelte', desc: 'Guía oficial y tutorial interactivo de Svelte 5', tag: 'Svelte' },
        { title: 'Tutorial Completo de Svelte', url: 'https://www.youtube.com/watch?v=pze2JJj82XA&list=PLTd5ehIj0goM-5mQxXLmCr5nHZX_yc2QT', desc: 'Lista de reproducción con tutorial paso a paso de Svelte', tag: 'Video' },
        { title: 'Component Party — Svelte 5', url: 'https://component-party.dev/?f=svelte5#templating.loop', desc: 'Comparativa visual de componentes entre frameworks', tag: 'Referencia' },
        { title: 'Opencode — Tutorial', url: 'https://www.youtube.com/watch?v=ZZq4TpNgnvg&t=900s', desc: 'Aprende a usar Opencode como asistente de desarrollo', tag: 'Video' }
      ]
    },
    {
      title: 'IA y Aprendizaje',
      icon: '🤖',
      color: '#8b5cf6',
      links: [
        { title: 'Anthropic Skilljar — Tutoriales de IA', url: 'https://anthropic.skilljar.com/', desc: 'Cursos oficiales de Anthropic sobre inteligencia artificial', tag: 'IA' },
        { title: 'Novedades ES2024 — ES2025', url: 'https://www.youtube.com/watch?v=v6WZI1Zs9aY', desc: 'Las últimas características de JavaScript explicadas', tag: 'Video' },
        { title: 'FreeCodeCamp — 10 Comandos de Git', url: 'https://www.freecodecamp.org/espanol/news/10-comandos-de-git-que-todo-desarrollador-deberia-saber/', desc: 'Guía esencial de comandos de Git para desarrolladores', tag: 'Git' },
        { title: 'Guía Scrum', url: 'https://drive.google.com/file/d/19is_XbX2ml9Du1tJ9jspwOCiwj6loLeu/view?usp=sharing', desc: 'Documento completo con la guía de metodología Scrum', tag: 'PDF' }
      ]
    },
    {
      title: 'Herramientas y Utilidades',
      icon: '🛠️',
      color: '#059669',
      links: [
        { title: 'SEO Studio Tools', url: 'https://seostudio.tools/es', desc: 'Suite de herramientas SEO para análisis y optimización web', tag: 'SEO' },
        { title: 'Coddy — Aprende Programación', url: 'https://coddy.tech/', desc: 'Plataforma interactiva para aprender a programar', tag: 'Opcional' },
        { title: 'Exercism — Trazabilidad de Componentes', url: 'https://exercism.org/', desc: 'Ejercicios prácticos de programación en múltiples lenguajes', tag: 'Práctica' },
        { title: 'Portal de Evaluaciones', url: 'https://examscinar2026.vercel.app/', desc: 'Acceso al portal de evaluaciones y exámenes', tag: 'Herramienta' }
      ]
    },
    {
      title: 'Repositorios del Proyecto',
      icon: '💻',
      color: '#dc2626',
      links: [
        { title: 'Front-end — testcinar26', url: 'https://github.com/CrisAguirre/testcinar26', desc: 'Repositorio del frontend con SvelteKit', tag: 'GitHub' },
        { title: 'Back-end — testcinar26bknd', url: 'https://github.com/CrisAguirre/testcinar26bknd', desc: 'Repositorio del backend con Express y MongoDB', tag: 'GitHub' }
      ]
    }
  ];

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let allLinks = $derived(categories.flatMap(c => c.links));
  let totalLinks = $derived(allLinks.length);

  let filteredCategories = $derived.by(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.map(c => ({
      ...c,
      links: c.links.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.desc.toLowerCase().includes(q) ||
        l.tag.toLowerCase().includes(q)
      )
    })).filter(c => c.links.length > 0);
  });

  function getTagClass(tag: string) {
    const map: Record<string, string> = {
      'Svelte': 'tag-svelte',
      'Video': 'tag-video',
      'Referencia': 'tag-ref',
      'IA': 'tag-ai',
      'Git': 'tag-git',
      'PDF': 'tag-pdf',
      'SEO': 'tag-seo',
      'Opcional': 'tag-opt',
      'Práctica': 'tag-practice',
      'Herramienta': 'tag-tool',
      'GitHub': 'tag-gh'
    };
    return map[tag] || '';
  }
</script>

<svelte:head>
  <title>Enlaces de Consulta — Cinar Sistemas</title>
</svelte:head>

<div class="links-page">
  <div class="hero">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <button class="back-btn" onclick={() => goto('/')}>
        <span>←</span> Volver al inicio
      </button>
      <div class="hero-icon">🔗</div>
      <h1>Enlaces de Consulta</h1>
      <p class="hero-sub">
        {totalLinks} recursos organizados para potenciar tu aprendizaje
      </p>
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="search-input"
          placeholder="Buscar recursos por nombre, descripción o etiqueta..."
          bind:value={searchQuery}
        />
        {#if searchQuery}
          <button class="search-clear" onclick={() => searchQuery = ''}>✕</button>
        {/if}
      </div>
    </div>
  </div>

  <div class="categories">
    {#each filteredCategories as cat}
      <div class="category" style="--cat-color: {cat.color}">
        <div class="category-header">
          <span class="category-icon">{cat.icon}</span>
          <h2>{cat.title}</h2>
          <span class="category-count">{cat.links.length}</span>
        </div>
        <div class="category-links">
          {#each cat.links as link, i}
            <a href={link.url} target="_blank" rel="noopener noreferrer" class="link-card" style="animation-delay: {i * 0.05}s">
              <div class="link-body">
                <span class="link-title">{link.title}</span>
                <span class="link-desc">{link.desc}</span>
              </div>
              <div class="link-meta">
                <span class="link-tag {getTagClass(link.tag)}">{link.tag}</span>
                <span class="link-arrow">↗</span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/each}

    {#if filteredCategories.length === 0}
      <div class="no-results">
        <span class="no-results-icon">🔎</span>
        <p>No se encontraron resultados para "<strong>{searchQuery}</strong>"</p>
        <button class="reset-btn" onclick={() => searchQuery = ''}>Limpiar búsqueda</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .links-page {
    min-height: 100vh;
  }

  .hero {
    position: relative;
    padding: 3rem 1.5rem 2.5rem;
    text-align: center;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-theme-2, #1e3a5f), #2c5f8a, #1e3a5f);
    z-index: 0;
  }

  .hero-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(139,92,246,0.1) 0%, transparent 50%),
      radial-gradient(circle at 50% 100%, rgba(5,150,105,0.1) 0%, transparent 40%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 640px;
    margin: 0 auto;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.85);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1.25rem;
  }
  .back-btn:hover {
    background: rgba(255,255,255,0.22);
    color: white;
  }

  .hero-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
  }

  h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem;
    color: white;
    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .hero-sub {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.7);
    margin: 0 0 1.5rem;
  }

  .search-wrapper {
    position: relative;
    max-width: 480px;
    margin: 0 auto;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.85rem 2.5rem 0.85rem 2.8rem;
    border: none;
    border-radius: 12px;
    font-size: 0.9rem;
    background: rgba(255,255,255,0.15);
    color: white;
    backdrop-filter: blur(8px);
    outline: none;
    transition: all 0.3s;
    box-sizing: border-box;
  }
  .search-input::placeholder {
    color: rgba(255,255,255,0.45);
  }
  .search-input:focus {
    background: rgba(255,255,255,0.25);
    box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
  }

  .search-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.15);
    border: none;
    color: rgba(255,255,255,0.7);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .search-clear:hover {
    background: rgba(255,255,255,0.3);
    color: white;
  }

  .categories {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .category {
    animation: fadeInUp 0.5s ease-out both;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.85rem;
    padding-bottom: 0.6rem;
    border-bottom: 2px solid var(--cat-color);
  }

  .category-icon {
    font-size: 1.4rem;
  }

  .category-header h2 {
    flex: 1;
    font-size: 1.08rem;
    margin: 0;
    color: #1f2937;
  }

  .category-count {
    background: var(--cat-color);
    color: white;
    font-size: 0.72rem;
    font-weight: 800;
    padding: 0.15rem 0.6rem;
    border-radius: 12px;
    min-width: 24px;
    text-align: center;
  }

  .category-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .link-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.25s ease;
    animation: fadeInUp 0.35s ease-out both;
    animation-delay: inherit;
  }
  .link-card:hover {
    border-color: var(--cat-color);
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    transform: translateX(6px);
  }

  .link-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }

  .link-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: #1f2937;
  }

  .link-desc {
    font-size: 0.78rem;
    color: #6b7280;
    line-height: 1.4;
  }

  .link-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-shrink: 0;
  }

  .link-tag {
    padding: 0.15rem 0.55rem;
    border-radius: 8px;
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .tag-svelte { background: #dbeafe; color: #1d4ed8; }
  .tag-video { background: #fce7f3; color: #be185d; }
  .tag-ref { background: #e0e7ff; color: #4338ca; }
  .tag-ai { background: #ede9fe; color: #6d28d9; }
  .tag-git { background: #fef3c7; color: #92400e; }
  .tag-pdf { background: #fee2e2; color: #b91c1c; }
  .tag-seo { background: #d1fae5; color: #047857; }
  .tag-opt { background: #f3e8ff; color: #7c3aed; }
  .tag-practice { background: #ffedd5; color: #c2410c; }
  .tag-tool { background: #e0f2fe; color: #0369a1; }
  .tag-gh { background: #f3f4f6; color: #374151; }

  .link-arrow {
    font-size: 1rem;
    color: #9ca3af;
    transition: transform 0.2s;
  }
  .link-card:hover .link-arrow {
    transform: translate(2px, -2px);
    color: var(--cat-color);
  }

  .no-results {
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
  }
  .no-results-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.75rem;
  }
  .no-results p {
    font-size: 0.95rem;
    margin: 0 0 1rem;
  }

  .reset-btn {
    padding: 0.5rem 1.25rem;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .reset-btn:hover {
    opacity: 0.9;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    .hero {
      padding: 2rem 1rem 1.5rem;
    }
    h1 {
      font-size: 1.4rem;
    }
    .hero-sub {
      font-size: 0.82rem;
    }
    .categories {
      padding: 0 1rem 2rem;
      gap: 1.5rem;
    }
    .link-card {
      padding: 0.7rem 0.85rem;
    }
    .link-title {
      font-size: 0.82rem;
    }
    .link-desc {
      font-size: 0.72rem;
    }
    .link-tag {
      font-size: 0.6rem;
    }
  }
</style>
