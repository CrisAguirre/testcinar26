<script lang="ts">
  let { href, icon, label, delay = 0 }: { href: string; icon: string; label: string; delay?: number } = $props();
</script>

<a {href} class="exam-card" style="--delay: {delay}s">
  <span class="exam-shine"></span>
  <span class="exam-icon">{icon}</span>
  <span class="exam-label">{label}</span>
  <span class="exam-arrow">&#8594;</span>
</a>

<style>
  .exam-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    padding: 0.85rem 1rem;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    animation: cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation-delay: var(--delay);
    transition:
      background 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes cardEnter {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .exam-card:hover {
    background: rgba(255, 255, 255, 0.22);
    transform: translateY(-3px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .exam-card:active {
    transform: translateY(-1px) scale(1);
  }

  .exam-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%);
    background-size: 200% 200%;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  .exam-card:hover .exam-shine {
    opacity: 1;
    animation: shineSweep 0.8s ease forwards;
  }

  @keyframes shineSweep {
    0% { background-position: 200% 200%; }
    100% { background-position: -200% -200%; }
  }

  .exam-icon {
    font-size: 1.3rem;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 1;
  }

  .exam-card:hover .exam-icon {
    animation: iconPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes iconPulse {
    0% { transform: scale(1) rotate(0deg); }
    40% { transform: scale(1.3) rotate(-8deg); }
    70% { transform: scale(1.1) rotate(4deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  .exam-label {
    flex: 1;
    font-weight: 600;
    font-size: 0.95rem;
    position: relative;
    z-index: 1;
  }

  .exam-arrow {
    font-size: 1.1rem;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 1;
  }

  .exam-card:hover .exam-arrow {
    animation: arrowSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes arrowSlide {
    0% { transform: translateX(0); opacity: 1; }
    50% { transform: translateX(8px); opacity: 0; }
    51% { transform: translateX(-4px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
</style>
