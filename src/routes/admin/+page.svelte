<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) { goto('/login'); return; }
    const role = $currentUser?.role;
    if (role !== 'admin' && role !== 'coordinator' && role !== 'teacher') {
      goto('/');
    }
  });

  const sections = [
    { href: '/admin/planeacion', icon: '📅', label: 'Planeación', desc: 'Horarios, agenda trimestral, temáticas y capacitaciones a impartir' },
    { href: '/admin/registro-academico', icon: '📋', label: 'Registro Académico', desc: 'Notas, contenidos temáticos, cronograma y asistencia' },
    { href: '/admin/capacitaciones', icon: '🎓', label: 'Capacitaciones', desc: 'Cursos para docentes, evaluaciones, certificados y bienvenida' },
    { href: '/admin/normativa', icon: '📜', label: 'Normativa Vigente', desc: 'Normas del MEN, descargas y estado institucional' },
    { href: '/admin/soporte', icon: '🛟', label: 'Soporte y Ayuda', desc: 'Asistencia remota, funcionalidades y resolución de errores' }
  ];
</script>

<svelte:head>
  <title>Funciones Administrativas — Cinar Sistemas</title>
</svelte:head>

<div class="banner">
  <div class="banner-bg"></div>
  <div class="banner-inner">
    <button class="back-btn" onclick={() => goto('/')}>
      <span>←</span> Volver al inicio
    </button>
    <div class="banner-content">
      <img class="banner-logo" src="/logo.png" alt="Cinar Sistemas" />
      <div class="banner-text">
        <span class="banner-icon">⚙️</span>
        <h1>Funciones Administrativas</h1>
        <p class="banner-desc">Gestión docente e institucional de Cinar Sistemas</p>
      </div>
    </div>
    <div class="banner-decor">
      <span class="code-sym sym-1">📊</span>
      <span class="code-sym sym-2">📋</span>
      <span class="code-sym sym-3">🎓</span>
      <span class="code-sym sym-4">📜</span>
      <span class="code-sym sym-5">🛟</span>
      <span class="code-sym sym-6">📅</span>
      <span class="code-sym sym-7">⚙️</span>
      <span class="code-sym sym-8">🏫</span>
    </div>
  </div>
</div>

<div class="page">
  <div class="cards">
    {#each sections as section, i}
      <a href={section.href} class="card" style="--i: {i}">
        <span class="card-shine"></span>
        <span class="card-bounce">{section.icon}</span>
        <span class="card-label">{section.label}</span>
        <span class="card-desc">{section.desc}</span>
        <span class="card-arrow">→</span>
      </a>
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
    background: linear-gradient(135deg, #8B5CF6, #7C3AED, #4C1D95, #7C3AED, #8B5CF6);
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
  }

  .banner-logo {
    width: 72px;
    height: 72px;
    object-fit: contain;
    border-radius: 16px;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.25));
    animation: logoFloat 4s ease-in-out infinite;
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .banner-text {
    flex: 1;
  }

  .banner-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.25rem;
  }

  h1 {
    font-weight: 700;
    font-size: 1.55rem;
    color: white;
    margin: 0 0 0.25rem;
    letter-spacing: -0.02em;
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.25));
  }

  .banner-desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.75);
    margin: 0;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.75);
    padding: 0;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 1rem;
    transition: color 0.2s ease;
  }

  .back-btn:hover {
    color: white;
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
    font-size: 1.2rem;
    opacity: 0.1;
    animation: codeDrift 8s ease-in-out infinite;
  }

  .sym-1 { top: 8%; left: 8%; animation-delay: 0.5s; }
  .sym-2 { bottom: 12%; left: 20%; animation-delay: 1.2s; }
  .sym-3 { top: 45%; left: 5%; animation-delay: 2s; }
  .sym-4 { bottom: 20%; right: 25%; animation-delay: 0.8s; }
  .sym-5 { top: 25%; right: 8%; animation-delay: 1.8s; }
  .sym-6 { bottom: 8%; right: 35%; animation-delay: 3s; }
  .sym-7 { top: 50%; left: 50%; animation-delay: 0.3s; }
  .sym-8 { top: 15%; right: 40%; animation-delay: 1.5s; }

  @keyframes codeDrift {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-12px) rotate(2deg); }
    50% { transform: translateY(-6px) rotate(-1deg); }
    75% { transform: translateY(-16px) rotate(1deg); }
  }

  .page {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1rem 3rem;
  }

  .cards {
    display: grid;
    gap: 1rem;
  }

  .card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: white;
    border-radius: 16px;
    text-decoration: none;
    color: #0f172a;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
    animation-delay: calc(var(--i) * 0.08s);
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.12), 0 0 0 1px rgba(124, 58, 237, 0.1);
    border-color: rgba(124, 58, 237, 0.15);
  }

  .card-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(124, 58, 237, 0.04) 50%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card:hover .card-shine {
    opacity: 1;
  }

  .card-bounce {
    font-size: 2rem;
    flex-shrink: 0;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card:hover .card-bounce {
    transform: scale(1.15);
  }

  .card-label {
    font-weight: 600;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .card-desc {
    font-size: 0.8rem;
    color: #64748b;
    flex: 1;
    min-width: 0;
  }

  .card-arrow {
    font-size: 1.1rem;
    color: #94a3b8;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card:hover .card-arrow {
    color: #7c3aed;
    transform: translateX(4px);
  }

  @media (max-width: 600px) {
    .card {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .card-desc {
      width: 100%;
      order: 3;
    }

    .banner-content {
      flex-direction: column;
      text-align: center;
    }

    h1 {
      font-size: 1.3rem;
    }
  }
</style>
