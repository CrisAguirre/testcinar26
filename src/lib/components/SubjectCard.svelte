<script lang="ts">
  let {
    icon,
    title,
    description,
    href = '/'
  }: {
    icon: string;
    title: string;
    description: string;
    href?: string;
  } = $props();
</script>

<a {href} class="subject-card">
  <div class="subject-glow"></div>
  <div class="subject-content">
    <div class="subject-icon">{icon}</div>
    <h2>{title}</h2>
    <p class="subject-desc">{description}</p>
    <span class="subject-cta">Entrar <span class="cta-arrow">→</span></span>
  </div>
</a>

<style>
  .subject-card {
    display: block;
    position: relative;
    perspective: 1000px;
    animation: cardRise 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    text-decoration: none;
    color: inherit;
  }

  @keyframes cardRise {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .subject-glow {
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
    opacity: 0;
    transition: opacity 0.6s ease;
    pointer-events: none;
    z-index: 0;
  }

  .subject-card:hover .subject-glow {
    opacity: 1;
    animation: glowPulse 2s ease-in-out infinite alternate;
  }

  @keyframes glowPulse {
    0% { opacity: 0.3; }
    100% { opacity: 0.8; }
  }

  .subject-content {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    border-radius: var(--radius-xl);
    padding: 2rem;
    color: white;
    position: relative;
    overflow: hidden;
    transition:
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 20px rgba(64, 117, 166, 0.3);
    cursor: pointer;
  }

  .subject-card:hover .subject-content {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(64, 117, 166, 0.4);
  }

  .subject-card:active .subject-content {
    transform: translateY(-1px);
  }

  .subject-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    display: inline-block;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .subject-card:hover .subject-icon {
    animation: iconWobble 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes iconWobble {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.15) rotate(-5deg); }
    50% { transform: scale(1.2) rotate(5deg); }
    75% { transform: scale(1.08) rotate(-2deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  h2 {
    font-size: 1.3rem;
    margin: 0 0 0.25rem;
    color: white;
  }

  .subject-desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 1.25rem;
  }

  .subject-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 0.15rem;
    transition: all 0.3s ease;
  }

  .subject-card:hover .subject-cta {
    color: white;
    border-bottom-color: rgba(255, 255, 255, 0.7);
    gap: 0.6rem;
  }

  .cta-arrow {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .subject-card:hover .cta-arrow {
    transform: translateX(4px);
  }

  @media (max-width: 600px) {
    .subject-content {
      padding: 1.25rem;
    }

    h2 {
      font-size: 1.1rem;
    }
  }
</style>
