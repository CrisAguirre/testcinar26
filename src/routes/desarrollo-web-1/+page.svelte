<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const links = [
    { href: '/desarrollo-web-1/parcial-1', icon: '📝', label: 'Parcial 1' },
    { href: null, icon: '📝', label: 'Parcial 2', disabled: true },
    { href: '/desarrollo-web-1/algoritmia', icon: '🧠', label: 'Algoritmia' },
    { href: '/desarrollo-web-1/enlaces-de-consulta', icon: '🔗', label: 'Enlaces de Consulta' },
    { href: '/desarrollo-web-1/notas', icon: '📊', label: 'Notas' },
    { href: '/desarrollo-web-1/actividad-de-la-semana', icon: '📺', label: 'Actividad de la semana' }
  ];
</script>

<svelte:head>
  <title>Desarrollo Web 1 — Cinar Sistemas</title>
</svelte:head>

<div class="banner">
  <div class="banner-bg"></div>
  <div class="banner-inner">
    <button class="back-btn" onclick={() => goto('/')}>
      <span>←</span> Volver al inicio
    </button>
    <div class="banner-content">
      <img class="banner-logo" src="/svelte.webp" alt="logo" />
      <div class="banner-text">
        <span class="banner-icon">📚</span>
        <h1 style="font-weight: 700; font-size: 1.55rem;">Desarrollo Web 1</h1>
        <p class="banner-desc">Accede a tus contenidos, evaluaciones y notas desde los siguientes accesos:</p>
      </div>
    </div>
    <div class="banner-decor">
      <span class="code-sym sym-1">&lt;/&gt;</span>
      <span class="code-sym sym-2">{'{\u00A0}'}</span>
      <span class="code-sym sym-3">//</span>
      <span class="code-sym sym-4">&lt;!-- --&gt;</span>
      <span class="code-sym sym-5">JS</span>
      <span class="code-sym sym-6">CSS</span>
      <span class="code-sym sym-7">☁️</span>
      <span class="code-sym sym-8">📱</span>
    </div>
  </div>
</div>

<div class="page">
  <div class="cards">
    {#each links as link, i}
      {#if link.disabled}
        <div class="card card--disabled" style="--i: {i}">
          <span class="card-bounce">{link.icon}</span>
          <span class="card-label">{link.label}</span>
          <span class="card-badge">Próximamente</span>
        </div>
      {:else}
        <a
          href={link.href}
          class="card"
          style="--i: {i}"
        >
          <span class="card-shine"></span>
          <span class="card-bounce">{link.icon}</span>
          <span class="card-label">{link.label}</span>
          <span class="card-arrow">→</span>
        </a>
      {/if}
    {/each}
  </div>
</div>

<style>
  .banner {
    position: relative;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    overflow: hidden;
  }

  .banner-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0066FF, #003399, #001a4d, #003399, #0066FF);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    z-index: 0;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .banner-inner {
    position: relative;
    z-index: 1;
    max-width: 720px;
    margin: 0 auto;
    padding: 1.5rem 1rem 2rem;
  }

  .banner-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    text-align: left;
  }

  .banner-logo {
    width: 96px;
    height: 96px;
    object-fit: contain;
    flex-shrink: 0;
    border-radius: 16px;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
    animation: logoFloat 4s ease-in-out infinite, logoGlow 3s ease-in-out infinite;
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes logoGlow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15)); }
    50% { filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.35)); }
  }

  .banner-text {
    flex: 1;
    color: white;
  }

  .banner-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.35rem;
    animation: bannerIconFloat 3s ease-in-out infinite, bannerIconGlow 2.5s ease-in-out infinite;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.2));
  }

  @keyframes bannerIconFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-8px) scale(1.1); }
  }

  @keyframes bannerIconGlow {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.2)); }
    50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)); }
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.35rem;
    color: white;
    background: linear-gradient(135deg, #fff, #93c5fd, #c4b5fd, #fff);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: bannerTitleGrad 5s ease infinite, bannerTitleSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    letter-spacing: -0.02em;
    filter: drop-shadow(0 0 12px rgba(147, 197, 253, 0.3));
  }

  @keyframes bannerTitleGrad {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes bannerTitleSlide {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .banner-desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.75);
    margin: 0;
    animation: descFadeIn 1s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes descFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.82rem;
    cursor: pointer;
    margin-bottom: 1.25rem;
    transition: border-color 0.2s ease, transform 0.15s ease, background 0.2s ease;
  }

  .back-btn:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-3px);
  }

  .back-btn:active {
    transform: scale(0.96);
  }

  .banner-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  .code-sym {
    position: absolute;
    font-family: 'Fira Mono', 'Courier New', monospace;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.08);
    pointer-events: none;
    user-select: none;
    font-size: 1rem;
  }

  .sym-1 { top: 8%; left: 8%; font-size: 1.3rem; animation: codeDrift 7s 0.5s ease-in-out infinite; }
  .sym-2 { bottom: 12%; left: 20%; font-size: 1.1rem; animation: codeDrift 8s 1.2s ease-in-out infinite; }
  .sym-3 { top: 45%; left: 5%; font-size: 0.9rem; animation: codeDrift 6s 2s ease-in-out infinite; }
  .sym-4 { bottom: 20%; right: 25%; font-size: 0.85rem; animation: codeDrift 9s 0.8s ease-in-out infinite; }
  .sym-5 { top: 25%; right: 8%; font-size: 1rem; animation: codeDrift 7.5s 1.8s ease-in-out infinite; }
  .sym-6 { bottom: 8%; right: 35%; font-size: 0.9rem; animation: codeDrift 8.5s 3s ease-in-out infinite; }
  .sym-7 { top: 50%; left: 50%; font-size: 1.2rem; animation: codeDrift 10s 0.3s ease-in-out infinite; }
  .sym-8 { top: 15%; right: 40%; font-size: 1.1rem; animation: codeDrift 9s 1.5s ease-in-out infinite; }

  @keyframes codeDrift {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-12px) rotate(2deg); }
    50% { transform: translateY(-6px) rotate(-1deg); }
    75% { transform: translateY(-16px) rotate(1deg); }
  }

  .page {
    max-width: 640px;
    margin: 2rem auto;
    width: 100%;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 0.85rem 1rem;
    color: var(--color-text-primary);
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition:
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.3s ease,
      border-color 0.25s ease;
    animation: cardEnter 0.5s calc(var(--i, 0) * 0.12s) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes cardEnter {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .card:hover {
    transform: translateY(-6px) scale(1.03);
    border-color: var(--color-accent);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.1),
      0 0 20px color-mix(in srgb, var(--color-accent) 10%, transparent);
  }

  .card:active {
    transform: translateY(-2px) scale(0.98);
  }

  .card--disabled {
    opacity: 0.6;
    cursor: default;
    pointer-events: none;
  }

  .card-badge {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: var(--color-accent);
    color: white;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    position: relative;
    z-index: 1;
  }

  .card-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent 40%,
      color-mix(in srgb, var(--color-accent) 8%, transparent) 50%,
      transparent 60%
    );
    background-size: 200% 200%;
    pointer-events: none;
    transition: background-position 0.6s ease;
    background-position: 100% 100%;
  }

  .card:hover .card-shine {
    background-position: 0% 0%;
  }

  .card-bounce {
    font-size: 1.3rem;
    position: relative;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .card:hover .card-bounce {
    transform: scale(1.25);
  }

  .card-label {
    flex: 1;
    font-weight: 600;
    font-size: 0.95rem;
    position: relative;
    z-index: 1;
  }

  .card-arrow {
    font-size: 1.1rem;
    position: relative;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .card:hover .card-arrow {
    transform: translateX(6px);
  }

  @media (max-width: 600px) {
    .banner-inner {
      padding: 1rem 0.75rem 1.5rem;
    }

    .banner-content {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .banner-logo {
      width: 72px;
      height: 72px;
    }

    .banner-icon {
      font-size: 1.6rem;
    }

    h1 {
      font-size: 1.25rem;
    }

    .page {
      margin: 1.5rem auto;
    }
  }
</style>
