<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { categories as importedCategories, getTagClass as getTagClassFn, filterCategories, getAllLinks } from '$lib/data/enlacesData';

  let searchQuery = $state('');
  let visibleCategories = $state<Set<number>>(new Set());
  let categoryRefs = new Map<number, HTMLElement>();
  let heroGlowX = $state(50);
  let heroGlowY = $state(50);

  const categories = importedCategories;

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let allLinks = $derived(getAllLinks(categories));
  let totalLinks = $derived(allLinks.length);

  let filteredCategories = $derived(filterCategories(categories, searchQuery));

  function getTagClass(tag: string) {
    return getTagClassFn(tag);
  }

  let observer: IntersectionObserver | null = null;

  function setCatRef(node: HTMLElement, index: number) {
    node.setAttribute('data-cat-index', String(index));
    categoryRefs.set(index, node);
    if (observer) observer.observe(node);
    return {
      destroy() {
        categoryRefs.delete(index);
        if (observer) observer.unobserve(node);
      }
    };
  }

  $effect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute('data-cat-index'));
          if (entry.isIntersecting) {
            visibleCategories.add(idx);
            visibleCategories = new Set(visibleCategories);
          }
        }
      },
      { threshold: 0.15 }
    );

    for (const [, el] of categoryRefs) observer.observe(el);

    return () => observer?.disconnect();
  });

  function handleMouseMove(e: MouseEvent) {
    const rect = document.querySelector('.hero')?.getBoundingClientRect();
    if (!rect) return;
    heroGlowX = ((e.clientX - rect.left) / rect.width) * 100;
    heroGlowY = ((e.clientY - rect.top) / rect.height) * 100;
  }
</script>

<svelte:head>
  <title>Enlaces de Consulta — Cinar Sistemas</title>
</svelte:head>

<div class="links-page">
  <div class="hero" onmousemove={handleMouseMove} style="--mx: {heroGlowX}%; --my: {heroGlowY}%">
    <div class="hero-bg"></div>
    <div class="hero-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="hero-particles">
      {#each Array(20) as _, i}
        <div class="particle" style="--delay: {i * 0.7}s; --x: {((i * 137.5) % 100)}%; --y: {((i * 73.1) % 100)}%; --size: {4 + (i % 4) * 2}px; --duration: {8 + (i % 5) * 3}s"></div>
      {/each}
    </div>
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
    {#each filteredCategories as cat, catIdx}
      <div
        class="category"
        style="--cat-color: {cat.color}; --cat-delay: {catIdx * 0.15}s"
        use:setCatRef={catIdx}
        class:visible={visibleCategories.has(catIdx)}
      >
        <div class="category-header">
          <span class="category-icon">{cat.icon}</span>
          <h2>{cat.title}</h2>
          <span class="category-count">{cat.links.length}</span>
        </div>
        <div class="category-links">
          {#each cat.links as link, i}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
              style="--link-delay: {i * 0.06}s"
              ontouchstart={null}
            >
              <div class="link-card-glow"></div>
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
    background: var(--color-bg-1);
  }

  /* ── Hero ── */
  .hero {
    position: relative;
    padding: 1rem 1.5rem 1.25rem;
    text-align: center;
    overflow: hidden;
    isolation: isolate;
    border-radius: 0 0 32px 32px;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0f172a, #1e3a5f, #0f172a);
    background-size: 200% 200%;
    animation: heroShift 12s ease-in-out infinite alternate;
    z-index: 0;
    border-radius: inherit;
  }

  @keyframes heroShift {
    0%   { background-position: 0% 0%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 100%; }
  }

  /* ── Orbs ── */
  .hero-orbs {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;
    animation: orbFloat 10s ease-in-out infinite alternate;
    will-change: transform, opacity;
  }

  .orb-1 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(59,130,246,0.5), transparent);
    top: -20%;
    left: calc(var(--mx, 50) * 1%);
    transform: translateX(-50%);
    animation-duration: 14s;
  }

  .orb-2 {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(139,92,246,0.4), transparent);
    bottom: -30%;
    right: calc((100 - var(--mx, 50)) * 1%);
    transform: translateX(50%);
    animation-duration: 11s;
    animation-delay: -3s;
  }

  .orb-3 {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(5,150,105,0.3), transparent);
    top: 30%;
    left: calc(var(--mx, 50) * 0.5%);
    animation-duration: 17s;
    animation-delay: -6s;
  }

  @keyframes orbFloat {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(30px, -20px) scale(1.1); }
    66%  { transform: translate(-20px, 15px) scale(0.95); }
    100% { transform: translate(10px, -10px) scale(1.05); }
  }

  /* ── Particles ── */
  .hero-particles {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    width: var(--size);
    height: var(--size);
    left: var(--x);
    top: var(--y);
    background: rgba(255,255,255,0.25);
    border-radius: 50%;
    animation: particleDrift var(--duration) ease-in-out infinite alternate;
    animation-delay: var(--delay);
  }

  @keyframes particleDrift {
    0%   { transform: translate(0, 0) scale(1); opacity: 0.2; }
    50%  { transform: translate(40px, -30px) scale(1.3); opacity: 0.6; }
    100% { transform: translate(-30px, 20px) scale(0.8); opacity: 0.15; }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 640px;
    margin: 0 auto;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.75);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 0.5rem;
  }
  .back-btn:hover {
    background: rgba(255,255,255,0.18);
    border-color: rgba(255,255,255,0.35);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  }
  .back-btn:active {
    transform: translateY(0);
  }

  .hero-icon {
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
    filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));
    animation: iconPulse 3s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25%      { transform: scale(1.08) rotate(-3deg); }
    75%      { transform: scale(1.08) rotate(3deg); }
  }

  h1 {
    font-size: 1.3rem;
    margin: 0 0 0.25rem;
    color: white;
    text-shadow: 0 2px 20px rgba(0,0,0,0.3);
    animation: titleGlow 4s ease-in-out infinite alternate;
  }

  @keyframes titleGlow {
    0%   { text-shadow: 0 2px 20px rgba(0,0,0,0.3); }
    50%  { text-shadow: 0 2px 30px rgba(59,130,246,0.3), 0 2px 20px rgba(0,0,0,0.3); }
    100% { text-shadow: 0 2px 20px rgba(0,0,0,0.3); }
  }

  .hero-sub {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.65);
    margin: 0 0 0.75rem;
  }

  /* ── Search ── */
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
    z-index: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.85rem 2.5rem 0.85rem 2.8rem;
    border: 2px solid transparent;
    border-radius: 12px;
    font-size: 0.9rem;
    background: rgba(255,255,255,0.1);
    color: white;
    outline: none;
    transition: all 0.35s ease;
    box-sizing: border-box;
  }
  .search-input::placeholder {
    color: rgba(255,255,255,0.4);
  }
  .search-input:focus {
    background: rgba(255,255,255,0.18);
    border-color: rgba(255,255,255,0.35);
    box-shadow:
      0 0 0 3px rgba(59,130,246,0.2),
      0 8px 32px rgba(0,0,0,0.15);
    transform: scale(1.01);
  }

  .search-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.12);
    border: none;
    color: rgba(255,255,255,0.6);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
  }
  .search-clear:hover {
    background: rgba(255,255,255,0.25);
    color: white;
    transform: translateY(-50%) scale(1.1);
  }

  /* ── Categories ── */
  .categories {
    max-width: 900px;
    margin: 2rem auto 0;
    padding: 0 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: relative;
    z-index: 1;
  }

  .category {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    transition-delay: var(--cat-delay);
  }

  .category.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.85rem;
    padding-bottom: 0.6rem;
    border-bottom: 2px solid transparent;
    background-image: linear-gradient(90deg, var(--cat-color) 0%, var(--cat-color) 100%);
    background-size: 0% 2px;
    background-repeat: no-repeat;
    background-position: left bottom;
    transition: background-size 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .category.visible .category-header {
    background-size: 100% 2px;
  }

  .category-icon {
    font-size: 1.4rem;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .category.visible .category-icon {
    animation: iconBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    animation-delay: calc(var(--cat-delay) + 0.3s);
  }

  @keyframes iconBounce {
    0%   { transform: scale(0); }
    50%  { transform: scale(1.25); }
    100% { transform: scale(1); }
  }

  .category-header h2 {
    flex: 1;
    font-size: 1.08rem;
    margin: 0;
    color: var(--color-text-primary);
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
    transition: transform 0.3s ease;
  }

  .category:hover .category-count {
    transform: scale(1.15);
  }

  .category-links {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  /* ── Link Cards ── */
  .link-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.1rem;
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    animation: cardEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: calc(var(--cat-delay) + 0.25s + var(--link-delay));
  }

  @keyframes cardEnter {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .link-card-glow {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    opacity: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%);
    background-size: 200% 200%;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .link-card:hover .link-card-glow {
    opacity: 1;
    animation: cardShine 0.8s ease forwards;
  }

  @keyframes cardShine {
    0%   { background-position: 200% 200%; }
    100% { background-position: -200% -200%; }
  }

  .link-card::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 13px;
    background: var(--cat-color);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.35s ease;
    filter: blur(4px);
  }

  .link-card:hover {
    border-color: var(--cat-color);
    transform: translateY(-3px) scale(1.01);
    box-shadow:
      0 8px 30px rgba(0,0,0,0.1),
      0 0 0 1px var(--cat-color);
  }

  .link-card:hover::before {
    opacity: 0.25;
  }

  .link-card:active {
    transform: translateY(-1px) scale(1);
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
    color: var(--color-text-primary);
    transition: color 0.25s;
  }

  .link-card:hover .link-title {
    color: var(--cat-color);
  }

  .link-desc {
    font-size: 0.78rem;
    color: var(--color-text-secondary);
    line-height: 1.4;
    transition: color 0.25s;
  }

  .link-card:hover .link-desc {
    color: var(--color-text-primary);
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
    transition: all 0.3s ease;
  }

  .link-card:hover .link-tag {
    transform: scale(1.08);
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
    color: var(--color-text-muted);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .link-card:hover .link-arrow {
    transform: translate(3px, -3px) scale(1.15);
    color: var(--cat-color);
  }

  /* ── No results ── */
  .no-results {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-text-muted);
    animation: fadeInUp 0.4s ease-out;
  }
  .no-results-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.75rem;
    animation: iconPulse 2s ease-in-out infinite;
  }
  .no-results p {
    font-size: 0.95rem;
    margin: 0 0 1rem;
  }

  .reset-btn {
    padding: 0.5rem 1.25rem;
    background: var(--color-info);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .reset-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.35);
  }
  .reset-btn:active {
    transform: translateY(0);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .hero {
      padding: 0.75rem 1rem 1rem;
    }
    h1 {
      font-size: 1.1rem;
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
    .orb-1, .orb-2, .orb-3 {
      opacity: 0.2;
    }
    .particle {
      display: none;
    }
  }
</style>
