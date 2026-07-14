<script lang="ts">
  import { motion } from '@humanspeak/svelte-motion';
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import ExamCard from '$lib/components/ExamCard.svelte';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  const links = [
    { href: '/desarrollo-web-1/parcial-1', icon: '📝', label: 'Parcial 1' },
    { href: '/desarrollo-web-1/algoritmia', icon: '🧠', label: 'Algoritmia' },
    { href: '/desarrollo-web-1/enlaces-de-consulta', icon: '🔗', label: 'Enlaces de Consulta' }
  ];
</script>

<svelte:head>
  <title>Desarrollo Web 1 — Cinar Sistemas</title>
</svelte:head>

<motion.div
  class="page"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
>
  <motion.button
    class="back-btn"
    onclick={() => goto('/')}
    whileHover={{ x: -3, borderColor: 'var(--color-accent)' }}
    whileTap={{ scale: 0.96 }}
  >
    <span>←</span> Volver al inicio
  </motion.button>

  <motion.div
    class="header"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.5 }}
  >
    <motion.span
      class="header-icon"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      📚
    </motion.span>
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      Desarrollo Web 1
    </motion.h1>
    <motion.p
      class="header-desc"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      Accede a tus contenidos y evaluaciones desde los siguientes accesos:
    </motion.p>
  </motion.div>

  <motion.div
    class="cards"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.12 } }
    }}
  >
    {#each links as link, i}
      <ExamCard {href} icon={link.icon} label={link.label} delay={i * 0.12} />
    {/each}
  </motion.div>
</motion.div>

<style>
  .page {
    max-width: 640px;
    margin: 0 auto;
    width: 100%;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text-secondary);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.82rem;
    cursor: pointer;
    margin-bottom: 1.5rem;
  }

  .back-btn:hover {
    color: var(--color-text-primary);
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
  }

  .header-desc {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 1.25rem;
    }
    .header-icon {
      font-size: 2.5rem;
    }
  }
</style>
