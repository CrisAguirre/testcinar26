<script lang="ts">
  import { motion } from '@humanspeak/svelte-motion';

  let { href, icon, label, delay = 0 }: { href: string; icon: string; label: string; delay?: number } = $props();
</script>

<motion.a
  {href}
  class="exam-card"
  initial={{ opacity: 0, y: 24, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  whileHover={{ y: -6, scale: 1.03, borderColor: 'var(--color-accent)' }}
  whileTap={{ scale: 0.98, y: -2 }}
>
  <motion.span
    class="exam-shine"
    initial={{ opacity: 0 }}
    whileHover={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  />
  <motion.span
    class="exam-icon"
    whileHover={{ rotate: [0, -10, 8, -5, 0], scale: 1.25 }}
    transition={{ duration: 0.5 }}
  >
    {icon}
  </motion.span>
  <span class="exam-label">{label}</span>
  <motion.span
    class="exam-arrow"
    whileHover={{ x: [0, 6, 0] }}
    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
  >
    &#8594;
  </motion.span>
</motion.a>

<style>
  .exam-card {
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
    transition: box-shadow 0.3s ease;
  }

  .exam-card:hover {
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.1),
      0 0 20px color-mix(in srgb, var(--color-accent) 10%, transparent);
  }

  .exam-shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 40%, color-mix(in srgb, var(--color-accent) 8%, transparent) 50%, transparent 60%);
    background-size: 200% 200%;
    pointer-events: none;
  }

  .exam-icon {
    font-size: 1.3rem;
    position: relative;
    z-index: 1;
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
    position: relative;
    z-index: 1;
  }
</style>
