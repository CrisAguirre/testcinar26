<script lang="ts">
  import { isAuthenticated, currentUser } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { introContent, algorithms, ALGORITMIA_SUBJECT, getAlgorithmById } from '$lib/data/algoritmia';
  import { gradesApi } from '$lib/api';
  import { preloadedMyGrades } from '$lib/stores/preloaded';
  import { get } from 'svelte/store';

  onMount(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let expanded = $state<Record<number, boolean>>({});
  let showFlow = $state<Record<number, boolean>>({});
  let showPractice = $state<Record<number, boolean>>({});
  let pseudocodeInput = $state<Record<number, string>>({});
  let submitting = $state<Record<number, boolean>>({});
  let submitStatus = $state<Record<number, 'idle' | 'success' | 'error'>>({});
  let submitMsg = $state<Record<number, string>>({});
  let completedAlgos = $state<Set<number>>(new Set());
  let loadingProgress = $state(true);

  function toggle(id: number) {
    expanded[id] = !expanded[id];
  }

  function toggleFlow(id: number) {
    showFlow[id] = !showFlow[id];
  }

  function openPractice(id: number) {
    showPractice[id] = true;
    if (!pseudocodeInput[id]) {
      pseudocodeInput[id] = getAlgorithmById(id)?.practicePrompt
        ? `// ${getAlgorithmById(id)?.practicePrompt}\n\n`
        : '';
    }
  }

  function closePractice(id: number) {
    showPractice[id] = false;
    submitStatus[id] = 'idle';
  }

  async function submitPractice(id: number) {
    const algo = getAlgorithmById(id);
    if (!algo || !pseudocodeInput[id]?.trim()) return;

    submitting[id] = true;
    submitStatus[id] = 'idle';

    try {
      const user = get(currentUser);
      await gradesApi.submitMine({
        subject: ALGORITMIA_SUBJECT,
        score: 1,
        max_score: algorithms.length,
        period: '2026-1',
        comments: `Algoritmo: ${algo.title} — Pseudocódigo enviado`,
        examData: JSON.stringify({
          algorithmId: algo.id,
          algorithmTitle: algo.title,
          pseudocode: pseudocodeInput[id].trim(),
          submittedAt: new Date().toISOString()
        })
      });
      submitStatus[id] = 'success';
      submitMsg[id] = '¡Práctica enviada correctamente!';
      completedAlgos.add(id);
      completedAlgos = new Set(completedAlgos);
      const cached = get(preloadedMyGrades);
      if (cached) {
        const all = await gradesApi.getMine();
        preloadedMyGrades.set(all);
      }
    } catch (err) {
      submitStatus[id] = 'error';
      submitMsg[id] = err instanceof Error ? err.message : 'Error al enviar';
    } finally {
      submitting[id] = false;
    }
  }

  async function loadProgress() {
    if (!$currentUser?.id) { loadingProgress = false; return; }
    try {
      const all = get(preloadedMyGrades);
      const grades = all && all.length > 0 ? all : await gradesApi.getMine();
      preloadedMyGrades.set(grades);
      const algoGrades = grades.filter((g: any) => g.subject === ALGORITMIA_SUBJECT);
      const done = new Set<number>();
      for (const g of algoGrades) {
        if (g.examData) {
          try {
            const data = typeof g.examData === 'string' ? JSON.parse(g.examData) : g.examData;
            if (data?.algorithmId) done.add(data.algorithmId);
          } catch {}
        }
      }
      completedAlgos = done;
    } catch {
    } finally {
      loadingProgress = false;
    }
  }

  $effect(() => {
    if ($currentUser) loadProgress();
  });
</script>

<svelte:head>
  <title>Algoritmia - Desarrollo Web 1</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <a href="/desarrollo-web-1" class="back-link">← Volver a Desarrollo Web 1</a>
    <div class="title-row">
      <h1>Algoritmia</h1>
      {#if !loadingProgress}
        <span class="progress-badge">{completedAlgos.size}/{algorithms.length} practicados</span>
      {/if}
    </div>
    <p class="page-subtitle">Desarrollo Web 1 — Fundamentos de lógica y algoritmos</p>
  </div>

  <section class="intro-card">
    <div class="intro-icon">&#129302;</div>
    <h2>{introContent.title}</h2>
    <p class="intro-subtitle">{introContent.subtitle}</p>
    {#each introContent.paragraphs as p}
      <p class="intro-text">{p}</p>
    {/each}
    <div class="concepts-grid">
      {#each introContent.keyConcepts as c}
        <div class="concept-chip">
          <strong>{c.term}:</strong> {c.desc}
        </div>
      {/each}
    </div>
  </section>

  <section class="algorithms-section">
    <h2>Algoritmos de referencia</h2>
    <p class="section-desc">
      Cada algoritmo presenta un caso práctico, la secuencia lógica de pasos, su diagrama de flujo y la solución en pseudocódigo.
      Expande cada tarjeta para explorar y practicar.
    </p>

    <div class="algorithms-grid">
      {#each algorithms as algo}
        <div class="algo-card" class:expanded={expanded[algo.id]}>
          <button class="algo-header" onclick={() => toggle(algo.id)}>
            <span class="algo-icon">{algo.icon}</span>
            <span class="algo-title">{algo.title}</span>
            <span class="algo-badges">
              {#if completedAlgos.has(algo.id)}
                <span class="completed-badge">✓ Practicado</span>
              {/if}
            </span>
            <span class="algo-arrow">{expanded[algo.id] ? '▲' : '▼'}</span>
          </button>

          {#if expanded[algo.id]}
            <div class="algo-body">
              <div class="algo-section">
                <h4>Problema</h4>
                <p class="algo-desc">{algo.problem.scenario}</p>
                <div class="algo-example">
                  <strong>Ejemplo:</strong> {algo.problem.example}
                </div>
              </div>

              <div class="algo-section">
                <h4>Secuencia de solución</h4>
                <div class="sequence-list">
                  {#each algo.sequence as s}
                    <div class="sequence-step">
                      <span class="step-num">{s.step}</span>
                      <span class="step-desc">{s.desc}</span>
                    </div>
                  {/each}
                </div>
              </div>

              <div class="algo-section">
                <h4>Solución en pseudocódigo</h4>
                <pre class="code-block"><code>{algo.solution}</code></pre>
              </div>

              <div class="algo-section">
                <h4>Conceptos clave</h4>
                <div class="tags">
                  {#each algo.conceptosClave as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              </div>

              <div class="algo-actions">
                <button class="btn-flow" onclick={() => toggleFlow(algo.id)}>
                  {showFlow[algo.id] ? 'Ocultar' : 'Ver'} diagrama de flujo
                </button>
                <button class="btn-practice" onclick={() => openPractice(algo.id)} disabled={submitting[algo.id]}>
                  {completedAlgos.has(algo.id) ? '✓ Practicar de nuevo' : 'Practicar'}
                </button>
              </div>

              {#if showFlow[algo.id]}
                <div class="algo-section flowchart-section">
                  <h4>Diagrama de flujo</h4>
                  <div class="flowchart">
                    {#each algo.flowchart as node, i}
                      {#if i > 0}
                        <div class="flow-arrow">
                          <svg width="12" height="24" viewBox="0 0 12 24">
                            <line x1="6" y1="0" x2="6" y2="18" stroke="#94a3b8" stroke-width="2"/>
                            <polyline points="2,14 6,22 10,14" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      {/if}
                      <div class="flow-node flow-{node.type}">
                        <span class="flow-label">{node.type === 'start' ? 'Inicio' : node.type === 'end' ? 'Fin' : ''}</span>
                        <span class="flow-text">{node.text}</span>
                        {#if node.branch}
                          <span class="flow-branch">{node.branch}</span>
                        {/if}
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if showPractice[algo.id]}
                <div class="algo-section practice-section">
                  <h4>Practica: {algo.title}</h4>
                  <p class="practice-desc">{algo.practicePrompt}</p>
                  <textarea
                    class="pseudocode-editor"
                    bind:value={pseudocodeInput[algo.id]}
                    placeholder="Escribe tu pseudocódigo aquí..."
                    rows="10"
                    disabled={submitting[algo.id]}
                  ></textarea>
                  <div class="practice-actions">
                    <button class="btn-cancel" onclick={() => closePractice(algo.id)} disabled={submitting[algo.id]}>
                      Cancelar
                    </button>
                    <button
                      class="btn-submit"
                      onclick={() => submitPractice(algo.id)}
                      disabled={submitting[algo.id] || !pseudocodeInput[algo.id]?.trim()}
                    >
                      {submitting[algo.id] ? 'Enviando...' : 'Enviar práctica'}
                    </button>
                  </div>
                  {#if submitStatus[algo.id] === 'success'}
                    <div class="submit-feedback success">{submitMsg[algo.id]}</div>
                  {:else if submitStatus[algo.id] === 'error'}
                    <div class="submit-feedback error">{submitMsg[algo.id]}</div>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .page {
    padding: 1.5rem 0;
    max-width: 52rem;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-block;
    font-size: 0.85rem;
    color: var(--color-theme-1, #3b82f6);
    text-decoration: none;
    font-weight: 600;
    margin-bottom: 0.75rem;
    transition: opacity 0.2s;
  }

  .back-link:hover { opacity: 0.8; }

  .title-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  h1 {
    font-size: 2rem;
    margin: 0;
    color: #1f2937;
  }

  .progress-badge {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 0.3rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .page-subtitle {
    color: #888;
    font-size: 0.95rem;
    margin: 0.25rem 0 0;
  }

  .intro-card {
    background: linear-gradient(135deg, #1e3a5f, #2c5f8a);
    color: white;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(44, 95, 138, 0.3);
  }

  .intro-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }

  .intro-card h2 {
    font-size: 1.4rem;
    margin: 0 0 0.25rem;
    color: white;
  }

  .intro-subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 1rem;
    font-weight: 600;
  }

  .intro-text {
    font-size: 0.92rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 0.75rem;
  }

  .intro-text:last-of-type { margin-bottom: 1.25rem; }

  .concepts-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .concept-chip {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 8px;
    padding: 0.5rem 0.85rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.4;
  }

  .concept-chip strong { color: white; }

  .algorithms-section h2 {
    font-size: 1.3rem;
    margin: 0 0 0.5rem;
    color: #1f2937;
  }

  .section-desc {
    color: #888;
    font-size: 0.9rem;
    margin: 0 0 1.5rem;
    line-height: 1.5;
  }

  .algorithms-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .algo-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .algo-card.expanded { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }

  .algo-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem 1.25rem;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    font-family: inherit;
    text-align: left;
    color: #1f2937;
    transition: background 0.15s;
  }

  .algo-header:hover { background: #f8fafc; }

  .algo-icon { font-size: 1.5rem; flex-shrink: 0; }
  .algo-title { flex: 1; font-weight: 700; font-size: 1rem; }

  .algo-badges {
    display: flex;
    gap: 0.3rem;
    flex-shrink: 0;
  }

  .completed-badge {
    background: #dcfce7;
    color: #16a34a;
    padding: 0.2rem 0.55rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .algo-arrow {
    font-size: 0.8rem;
    color: #9ca3af;
    transition: transform 0.2s;
    flex-shrink: 0;
  }

  .algo-body {
    border-top: 1px solid #e5e7eb;
    padding: 1.25rem;
    animation: fadeIn 0.25s ease-out;
  }

  .algo-section { margin-bottom: 1.25rem; }
  .algo-section:last-child { margin-bottom: 0; }

  .algo-section h4 {
    font-size: 0.85rem;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 0 0 0.6rem;
  }

  .algo-desc {
    font-size: 0.92rem;
    line-height: 1.5;
    color: #444;
    margin: 0 0 0.6rem;
  }

  .algo-example {
    background: #f0f7ff;
    border-left: 3px solid var(--color-theme-1, #3b82f6);
    padding: 0.6rem 0.85rem;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #444;
    font-family: monospace;
  }

  .sequence-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .sequence-step {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.4rem 0;
  }

  .step-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .step-desc {
    font-size: 0.9rem;
    color: #444;
    line-height: 1.5;
    padding-top: 0.15rem;
  }

  .code-block {
    background: #1e293b;
    color: #e2e8f0;
    border-radius: 10px;
    padding: 1.25rem;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.6;
    font-family: 'Fira Mono', monospace;
    margin: 0;
  }

  .code-block code { white-space: pre; }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    background: #eff6ff;
    color: #1d4ed8;
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .algo-actions {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .btn-flow, .btn-practice {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-flow {
    background: white;
    border: 2px solid #e5e7eb;
    color: #444;
  }

  .btn-flow:hover { border-color: var(--color-theme-1); color: var(--color-theme-1); }

  .btn-practice {
    background: var(--color-theme-1, #3b82f6);
    border: none;
    color: white;
  }

  .btn-practice:hover { opacity: 0.9; }
  .btn-practice:disabled { opacity: 0.5; cursor: not-allowed; }

  .flowchart-section { margin-top: 1rem; }

  .flowchart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 10px;
  }

  .flow-arrow {
    display: flex;
    justify-content: center;
    line-height: 0;
  }

  .flow-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.4;
    min-width: 120px;
    max-width: 200px;
    position: relative;
    white-space: pre-line;
    border: 2px solid transparent;
  }

  .flow-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.6;
    margin-bottom: 0.15rem;
  }

  .flow-start, .flow-end {
    background: #dcfce7;
    border-color: #86efac;
    color: #166534;
    border-radius: 50px;
    padding: 0.5rem 2rem;
  }

  .flow-process {
    background: #eff6ff;
    border-color: #93c5fd;
    color: #1e40af;
  }

  .flow-decision {
    background: #fef3c7;
    border-color: #fcd34d;
    color: #92400e;
    transform: rotate(0deg);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    padding: 1.5rem 2rem;
  }

  .flow-decision .flow-text {
    transform: scale(0.85);
  }

  .flow-branch {
    position: absolute;
    font-size: 0.65rem;
    font-weight: 700;
    color: #94a3b8;
    right: -3.5rem;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    background: #f8fafc;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
  }

  .practice-section {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px dashed #e5e7eb;
  }

  .practice-desc {
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 0.75rem;
    line-height: 1.5;
  }

  .pseudocode-editor {
    width: 100%;
    min-height: 200px;
    padding: 0.85rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'Fira Mono', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    resize: vertical;
    box-sizing: border-box;
    background: #1e293b;
    color: #e2e8f0;
    transition: border-color 0.2s;
  }

  .pseudocode-editor:focus {
    outline: none;
    border-color: var(--color-theme-1, #3b82f6);
  }

  .pseudocode-editor::placeholder {
    color: #64748b;
  }

  .practice-actions {
    display: flex;
    gap: 0.6rem;
    justify-content: flex-end;
    margin-top: 0.75rem;
  }

  .btn-cancel {
    padding: 0.55rem 1.2rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    color: #444;
    transition: all 0.2s;
  }

  .btn-cancel:hover { border-color: #9ca3af; }
  .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-submit {
    padding: 0.55rem 1.2rem;
    border: none;
    border-radius: 8px;
    background: var(--color-theme-1, #3b82f6);
    color: white;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-submit:hover { opacity: 0.9; }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .submit-feedback {
    margin-top: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .submit-feedback.success {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #86efac;
  }

  .submit-feedback.error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fca5a5;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .page { padding: 1rem 0; }
    h1 { font-size: 1.5rem; }
    .intro-card { padding: 1.25rem; }
    .intro-card h2 { font-size: 1.2rem; }
    .algo-header { padding: 0.85rem 1rem; }
    .algo-body { padding: 1rem; }
    .code-block { padding: 0.85rem; font-size: 0.78rem; }
    .step-num { width: 20px; height: 20px; font-size: 0.65rem; }
    .step-desc { font-size: 0.85rem; }
    .flow-node { min-width: 80px; font-size: 0.75rem; padding: 0.4rem 0.8rem; }
    .flow-decision { padding: 1.2rem 1.5rem; }
    .pseudocode-editor { font-size: 0.78rem; min-height: 150px; }
  }
</style>
