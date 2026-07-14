<script lang="ts">
  import { motion } from '@humanspeak/svelte-motion';

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

  function tilt(node: HTMLElement) {
    function handleMouseMove(e: MouseEvent) {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const tx = ((e.clientY - centerY) / rect.height) * -15;
      const ty = ((e.clientX - centerX) / rect.width) * 15;
      node.style.setProperty('--tx', `${tx}deg`);
      node.style.setProperty('--ty', `${ty}deg`);
    }
    function handleMouseLeave() {
      node.style.setProperty('--tx', '0deg');
      node.style.setProperty('--ty', '0deg');
    }
    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    return {
      destroy() {
        node.removeEventListener('mousemove', handleMouseMove);
        node.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<a
  {href}
  class="subject-card"
  use:tilt
>
  <motion.div
    class="subject-glow"
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
  />
  <motion.div
    class="subject-glow-border"
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  />
  <div class="subject-content">
    <div class="subject-text">
      <motion.span
        class="subject-icon"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <motion.p
        class="subject-desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        {description}
      </motion.p>
      <motion.span
        class="subject-cta"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileHover={{ gap: '0.7rem' }}
      >
        Entrar <span class="cta-arrow">→</span>
      </motion.span>
    </div>
    <img
      class="subject-logo"
      src="/svelte.webp"
      alt="logo"
    />
    <div class="subject-decor">
      <span class="shooting-star s1"></span>
      <span class="shooting-star s2"></span>
      <span class="shooting-star s3"></span>
      <span class="code-sym sym-1">&lt;/&gt;</span>
      <span class="code-sym sym-2">{'{\u00A0}'}</span>
      <span class="code-sym sym-3">//</span>
      <span class="code-sym sym-4">&lt;!-- --&gt;</span>
      <span class="code-sym sym-5">JS</span>
      <span class="code-sym sym-6">CSS</span>
    </div>
  </div>
</a>

<style>
  .subject-card {
    display: block;
    position: relative;
    perspective: 800px;
    text-decoration: none;
    color: inherit;
    transform: rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg));
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    outline: none;
  }

  .subject-card:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 20px;
  }

  .subject-glow {
    position: absolute;
    inset: -4px;
    border-radius: 20px;
    background: radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.25) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    filter: blur(8px);
  }

  .subject-glow-border {
    position: absolute;
    inset: -2px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(59,130,246,0.15) 60%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }

  .subject-content {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
    border-radius: var(--radius-xl);
    padding: 2.5rem;
    color: white;
    position: relative;
    overflow: hidden;
    z-index: 1;
    box-shadow: 0 4px 20px rgba(64, 117, 166, 0.3);
    transition: box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .subject-card:hover .subject-content {
    box-shadow:
      0 12px 40px rgba(64, 117, 166, 0.4),
      0 0 30px rgba(59, 130, 246, 0.15);
  }

  .subject-card:active .subject-content {
    transform: translateY(-1px);
  }

  .subject-text {
    flex: 1;
    min-width: 0;
  }

  .subject-logo {
    width: 96px;
    height: 96px;
    object-fit: contain;
    flex-shrink: 0;
    border-radius: 16px;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
    animation: logoFloat 4s ease-in-out infinite, logoGlow 3s ease-in-out infinite;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .subject-card:hover .subject-logo {
    transform: scale(1.12) rotate(-4deg);
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  @keyframes logoGlow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15)); }
    50% { filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.35)); }
  }

  .subject-card:hover .subject-logo {
    animation-duration: 2s, 1.5s;
  }

  .subject-icon {
    font-size: 2.8rem;
    margin-bottom: 0.75rem;
    display: inline-block;
  }

  h2 {
    font-size: 1.4rem;
    margin: 0 0 0.35rem;
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
    font-size: 0.9rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 0.15rem;
  }

  .subject-card:hover .subject-cta {
    color: white;
    border-bottom-color: rgba(255, 255, 255, 0.7);
  }

  .cta-arrow {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .subject-card:hover .cta-arrow {
    transform: translateX(4px);
  }

  .subject-decor {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  .shooting-star {
    position: absolute;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.3);
    opacity: 0;
  }

  .shooting-star::before {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    width: 70px;
    height: 1.5px;
    background: linear-gradient(to left, rgba(255, 255, 255, 0.6), transparent);
    transform: translateY(-50%);
  }

  .s1 {
    top: 10%;
    right: 5%;
    animation: shootStar 3s 1s infinite;
  }

  .s2 {
    top: 30%;
    right: 30%;
    animation: shootStar 4s 2.5s infinite;
  }

  .s3 {
    top: 55%;
    right: 15%;
    animation: shootStar 3.5s 4s infinite;
  }

  @keyframes shootStar {
    0% {
      transform: translate(0, 0);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    25% {
      transform: translate(-200px, 200px);
      opacity: 1;
    }
    30% {
      transform: translate(-240px, 240px);
      opacity: 0;
    }
    100% {
      transform: translate(-240px, 240px);
      opacity: 0;
    }
  }

  .code-sym {
    position: absolute;
    font-family: 'Fira Mono', 'Courier New', monospace;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.08);
    pointer-events: none;
    user-select: none;
    font-size: 1rem;
    transition: opacity 0.4s ease;
  }

  .subject-card:hover .code-sym {
    color: rgba(255, 255, 255, 0.15);
  }

  .sym-1 {
    top: 8%;
    left: 8%;
    font-size: 1.3rem;
    animation: codeDrift 7s 0.5s ease-in-out infinite;
  }

  .sym-2 {
    bottom: 12%;
    left: 20%;
    font-size: 1.1rem;
    animation: codeDrift 8s 1.2s ease-in-out infinite;
  }

  .sym-3 {
    top: 45%;
    left: 5%;
    font-size: 0.9rem;
    animation: codeDrift 6s 2s ease-in-out infinite;
  }

  .sym-4 {
    bottom: 20%;
    right: 25%;
    font-size: 0.85rem;
    animation: codeDrift 9s 0.8s ease-in-out infinite;
  }

  .sym-5 {
    top: 25%;
    right: 8%;
    font-size: 1rem;
    animation: codeDrift 7.5s 1.8s ease-in-out infinite;
  }

  .sym-6 {
    bottom: 8%;
    right: 35%;
    font-size: 0.9rem;
    animation: codeDrift 8.5s 3s ease-in-out infinite;
  }

  @keyframes codeDrift {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-12px) rotate(2deg);
    }
    50% {
      transform: translateY(-6px) rotate(-1deg);
    }
    75% {
      transform: translateY(-16px) rotate(1deg);
    }
  }

  @media (max-width: 600px) {
    .subject-content {
      padding: 1.5rem;
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .subject-logo {
      width: 72px;
      height: 72px;
    }

    h2 {
      font-size: 1.15rem;
    }

    .subject-cta {
      justify-content: center;
    }
  }
</style>
