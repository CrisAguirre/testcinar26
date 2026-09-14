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
    
    const executor = new DfdExecutor(
      ast, 
      async (promptText) => {
        // Simple window.prompt for now, could be a custom modal
        return window.prompt(promptText) || '';
      },
      async (text) => {
        consoleOutput = [...consoleOutput, text];
      }
    );
    
    try {
      await executor.execute();
    } catch (e) {
      consoleOutput = [...consoleOutput, `[Error]: ${e.message}`];
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
              d="M {link.sourceX} {link.sourceY} 
                 C {link.sourceX} {link.sourceY + 20}, 
                   {link.targetX} {link.targetY - 20}, 
                   {link.targetX} {link.targetY}"
              fill="none" 
              stroke="#64748b" 
              stroke-width="2" 
              marker-end="url(#arrowhead)" 
            />
            {#if link.label}
              <text x="{(link.sourceX + link.targetX)/2 + 10}" y="{(link.sourceY + link.targetY)/2}" class="link-label">{link.label}</text>
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
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    z-index: 10;
  }

  .file-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .filename-input {
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 0.35rem 0.5rem;
    font-size: 0.9rem;
    width: 180px;
  }

  .btn {
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .btn-secondary {
    background: #e2e8f0;
    color: #334155;
  }

  .btn-secondary:hover { background: #cbd5e1; }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) { background: #2563eb; }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .layout {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 280px;
    background: white;
    border-right: 1px solid #e2e8f0;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar h3 {
    font-size: 0.9rem;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 1rem 0;
  }

  .sidebar-help {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-bottom: 1rem;
    font-style: italic;
  }

  .palette {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .palette-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #334155;
    cursor: grab;
    background: #f8fafc;
  }

  .palette-shape {
    width: 24px;
    height: 16px;
    background: #bae6fd;
    border: 1px solid #38bdf8;
  }

  .palette-shape.start { border-radius: 10px; background: #bbf7d0; border-color: #22c55e; }
  .palette-shape.decision { transform: rotate(45deg); width: 14px; height: 14px; background: #fef08a; border-color: #eab308; margin-left: 4px; }
  .palette-shape.input { transform: skewX(-15deg); background: #e9d5ff; border-color: #a855f7; }

  .code-editor {
    flex: 1;
    min-height: 200px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.75rem;
    font-family: monospace;
    font-size: 12px;
    resize: none;
    background: #f8fafc;
    color: #334155;
  }

  .canvas-container {
    flex: 1;
    position: relative;
    overflow: auto;
    background: radial-gradient(#e2e8f0 1px, transparent 1px);
    background-size: 20px 20px;
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
  }

  .console-placeholder {
    color: #475569;
    font-style: italic;
  }
</style>
