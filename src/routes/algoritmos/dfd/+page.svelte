<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { parseDfd, serializeDfd } from '$lib/dfd/parser';
  import { buildRenderData } from '$lib/dfd/renderer';
  import { DfdExecutor } from '$lib/dfd/executor';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let dfdContent = $state('');
  let currentFileName = $state('ejercicio.dfd');
  
  let ast = $state(null);
  let renderData = $state(null);
  
  let consoleOutput = $state<string[]>([]);
  let isExecuting = $state(false);
  
  // Custom Prompt State
  let promptVisible = $state(false);
  let promptMessage = $state('');
  let promptValue = $state('');
  let resolvePrompt = $state<((value: string) => void) | null>(null);

  // Drag and drop / Canvas interaction states
  let isDragging = $state(false);
  
  $effect(() => {
    if (dfdContent) {
      try {
        const parsed = parseDfd(dfdContent);
        if (!parsed.error) {
          ast = parsed;
          renderData = buildRenderData(ast);
        }
      } catch (err) {
        console.error("Parse error", err);
      }
    } else {
      ast = null;
      renderData = null;
    }
  });

  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    currentFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      dfdContent = (e.target?.result as string) || '';
      consoleOutput = ['--- Archivo cargado exitosamente ---'];
    };
    reader.readAsText(file);
  }

  function handleSave() {
    // If we modified AST visually (future feature), serialize it back.
    // For now, just save dfdContent
    let contentToSave = dfdContent;
    if (ast) {
       contentToSave = serializeDfd(ast);
    }
    
    const blob = new Blob([contentToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  async function handleRun() {
    if (!ast) return;
    
    isExecuting = true;
    consoleOutput = ['--- Iniciando Ejecución ---'];
    
    try {
      const executor = new DfdExecutor(
        ast, 
        async (promptText) => {
          promptMessage = promptText;
          promptValue = '';
          promptVisible = true;
          return new Promise<string>((resolve) => {
            resolvePrompt = resolve;
          });
        },
        async (text) => {
          consoleOutput = [...consoleOutput, text];
        }
      );
      
      await executor.execute();
    } catch (e) {
      console.error(e);
      consoleOutput = [...consoleOutput, `[Error de Motor]: ${e.message || e}`];
    } finally {
      isExecuting = false;
    }
  }

  function renderShape(shape) {
    const rx = shape.type === 'terminal' ? 25 : 4;
    return `
      <g transform="translate(${shape.x - shape.width/2}, ${shape.y})">
        ${
          shape.type === 'input' ? `<polygon points="20,0 ${shape.width},0 ${shape.width-20},${shape.height} 0,${shape.height}" class="shape-input"/>` :
          shape.type === 'output' ? `<polygon points="0,0 ${shape.width-15},0 ${shape.width},${shape.height/2} ${shape.width-15},${shape.height} 0,${shape.height}" class="shape-output"/>` :
          shape.type === 'decision' ? `<polygon points="${shape.width/2},0 ${shape.width},${shape.height/2} ${shape.width/2},${shape.height} 0,${shape.height/2}" class="shape-decision"/>` :
          `<rect width="${shape.width}" height="${shape.height}" rx="${rx}" class="shape-${shape.type}"/>`
        }
        <foreignObject x="10" y="10" width="${shape.width - 20}" height="${shape.height - 20}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;font-size:12px;font-family:sans-serif;word-break:break-word;color:#333;">
            ${shape.text}
          </div>
        </foreignObject>
      </g>
    `;
  }
  
  function generatePath(link) {
    if (link.isLoop) {
      const off = link.loopOffsetX || 100;
      return `M ${link.sourceX} ${link.sourceY} 
              L ${link.sourceX + off} ${link.sourceY}
              L ${link.sourceX + off} ${link.targetY - 20}
              L ${link.targetX} ${link.targetY - 20}
              L ${link.targetX} ${link.targetY - 5}`; // -5 to make arrowhead look good
    }
    
    if (Math.abs(link.sourceX - link.targetX) < 5) {
      return `M ${link.sourceX} ${link.sourceY} L ${link.targetX} ${link.targetY - 3}`;
    }
    
    const midY = link.sourceY + Math.max(15, (link.targetY - link.sourceY) / 2);
    return `M ${link.sourceX} ${link.sourceY} 
            L ${link.sourceX} ${midY}
            L ${link.targetX} ${midY}
            L ${link.targetX} ${link.targetY - 3}`;
  }

  function submitPrompt() {
    if (resolvePrompt) {
      resolvePrompt(promptValue);
      resolvePrompt = null;
    }
    promptVisible = false;
  }
</script>

<svelte:head>
  <title>Editor Visual DFD - Algoritmos</title>
</svelte:head>

<div class="page">
  <div class="top-nav">
    <button class="back-btn" onclick={() => goto('/algoritmos')}>
      <span>←</span> Menú Principal
    </button>
    <div class="file-controls">
      <span class="file-icon">📄</span>
      <input type="text" bind:value={currentFileName} class="filename-input" />
      <label class="btn btn-secondary">
        📂 Abrir
        <input type="file" accept=".dfd,.txt" onchange={handleFileUpload} style="display: none;" />
      </label>
      <button class="btn btn-secondary" onclick={handleSave}>💾 Guardar</button>
      <button class="btn btn-primary run-btn" onclick={handleRun} disabled={isExecuting || !ast}>
        {isExecuting ? '⏳ Ejecutando...' : '▶ Ejecutar'}
      </button>
    </div>
  </div>

  <div class="layout">
    <!-- Left Sidebar: Palette -->
    <div class="sidebar">
      <h3>Componentes</h3>
      <p class="sidebar-help">Próximamente: Arrastra elementos para crear algoritmos</p>
      <div class="palette">
        <div class="palette-item"><div class="palette-shape start"></div> Inicio/Fin</div>
        <div class="palette-item"><div class="palette-shape input"></div> Lectura</div>
        <div class="palette-item"><div class="palette-shape output"></div> Salida</div>
        <div class="palette-item"><div class="palette-shape process"></div> Asignación</div>
        <div class="palette-item"><div class="palette-shape decision"></div> Decisión</div>
      </div>
      
      <h3 style="margin-top: 2rem;">Código Fuente (.dfd)</h3>
      <textarea 
        class="code-editor" 
        bind:value={dfdContent} 
        placeholder="Código DFD..."
        spellcheck="false"
      ></textarea>
    </div>

    <!-- Center: Visual Canvas -->
    <div class="canvas-container">
      {#if renderData}
        <svg class="dfd-canvas" viewBox="0 0 {renderData.width} {renderData.height}">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>
          
          <!-- Links -->
          {#each renderData.links as link}
            <path 
              d={generatePath(link)}
              fill="none" 
              stroke="#64748b" 
              stroke-width="2" 
              marker-end="url(#arrowhead)" 
              stroke-linejoin="round"
            />
            {#if link.label}
              <rect x="{(link.sourceX + link.targetX)/2 - 12}" y="{(link.sourceY + link.targetY)/2 - 10}" width="24" height="16" fill="#f8fafc" rx="4" />
              <text x="{(link.sourceX + link.targetX)/2}" y="{(link.sourceY + link.targetY)/2 + 3}" class="link-label" text-anchor="middle">{link.label}</text>
            {/if}
          {/each}

          <!-- Shapes -->
          {#each renderData.shapes as shape}
            {@html renderShape(shape)}
          {/each}
        </svg>
      {:else}
        <div class="empty-state">
          <h3>No hay un algoritmo cargado</h3>
          <p>Usa "Abrir" para cargar un archivo .dfd existente.</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Bottom: Console Output -->
  <div class="console">
    <div class="console-header">💻 Consola de Ejecución</div>
    <div class="console-body">
      {#each consoleOutput as line}
        <div class="console-line">{line}</div>
      {/each}
      {#if consoleOutput.length === 0}
        <div class="console-placeholder">Presiona ▶ Ejecutar para ver los resultados aquí.</div>
      {/if}
    </div>
  </div>
</div>

{#if promptVisible}
  <div class="modal-overlay">
    <div class="modal-content">
      <h4>Entrada requerida</h4>
      <p>{promptMessage}</p>
      <!-- svelte-ignore a11y_autofocus -->
      <input 
        type="text" 
        class="modal-input" 
        bind:value={promptValue} 
        onkeydown={(e) => e.key === 'Enter' && submitPrompt()}
        autofocus 
      />
      <button class="btn btn-primary modal-btn" onclick={submitPrompt}>Continuar</button>
    </div>
  </div>
{/if}

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f1f5f9;
  }

  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
    background: white;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    z-index: 10;
  }

  .file-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .filename-input {
    border: 1px solid transparent;
    border-radius: 6px;
    padding: 0.35rem 0.5rem;
    font-size: 0.9rem;
    width: 180px;
    background: #f8fafc;
    transition: all 0.2s;
  }
  
  .filename-input:focus, .filename-input:hover {
    border-color: #cbd5e1;
    background: white;
    outline: none;
  }

  .btn {
    padding: 0.4rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease-in-out;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: inherit;
  }

  .btn-secondary {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid transparent;
  }

  .btn-secondary:hover { 
    background: #e2e8f0; 
    color: #1e293b;
  }

  .btn-primary {
    background: #0f172a;
    color: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }

  .btn-primary:hover:not(:disabled) { 
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid rgba(0,0,0,0.06);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar h3 {
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }

  .sidebar-help {
    font-size: 0.85rem;
    color: #94a3b8;
    margin-bottom: 1.5rem;
    line-height: 1.4;
  }

  .palette {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .palette-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    color: #334155;
    cursor: grab;
    background: #f8fafc;
    transition: all 0.2s;
  }
  
  .palette-item:hover {
    background: white;
    border-color: #e2e8f0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  .palette-shape {
    width: 24px;
    height: 16px;
    background: #bae6fd;
    border: 1px solid #38bdf8;
  }

  .palette-shape.start { border-radius: 12px; background: #dcfce7; border-color: #4ade80; }
  .palette-shape.decision { transform: rotate(45deg); width: 14px; height: 14px; background: #fef08a; border-color: #facc15; margin-left: 4px; }
  .palette-shape.input { transform: skewX(-15deg); background: #f3e8ff; border-color: #c084fc; }

  .code-editor {
    flex: 1;
    min-height: 200px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 13px;
    resize: none;
    background: #f8fafc;
    color: #334155;
    transition: border-color 0.2s;
  }
  
  .code-editor:focus {
    outline: none;
    border-color: #94a3b8;
    background: white;
  }

  .canvas-container {
    flex: 1;
    position: relative;
    overflow: auto;
    background: #f8fafc;
    background-image: radial-gradient(#cbd5e1 1px, transparent 0);
    background-size: 24px 24px;
  }

  .dfd-canvas {
    min-width: 100%;
    min-height: 100%;
    display: block;
  }

  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #64748b;
  }

  /* SVG Shapes CSS */
  :global(.shape-terminal) { fill: #bbf7d0; stroke: #22c55e; stroke-width: 2; }
  :global(.shape-process) { fill: #bae6fd; stroke: #38bdf8; stroke-width: 2; }
  :global(.shape-input) { fill: #e9d5ff; stroke: #a855f7; stroke-width: 2; }
  :global(.shape-output) { fill: #fed7aa; stroke: #f97316; stroke-width: 2; }
  :global(.shape-decision) { fill: #fef08a; stroke: #eab308; stroke-width: 2; }
  :global(.link-label) { font-size: 11px; fill: #64748b; font-weight: bold; font-family: sans-serif; }

  .console {
    height: 200px;
    background: #1e293b;
    display: flex;
    flex-direction: column;
    border-top: 4px solid #3b82f6;
  }

  .console-header {
    padding: 0.5rem 1rem;
    background: #0f172a;
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .console-body {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    color: #e2e8f0;
  }

  .console-line {
    margin-bottom: 0.25rem;
    line-height: 1.4;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .console-placeholder {
    color: #475569;
    font-style: italic;
  }

  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    width: 320px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    animation: popIn 0.2s ease-out;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .modal-content h4 {
    margin: 0;
    font-size: 1.1rem;
    color: #0f172a;
  }

  .modal-content p {
    margin: 0;
    font-size: 0.9rem;
    color: #475569;
  }

  .modal-input {
    padding: 0.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .modal-input:focus {
    border-color: #3b82f6;
  }

  .modal-btn {
    align-self: flex-end;
    margin-top: 0.5rem;
  }
</style>
