<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { parseDfd, serializeDfd } from '$lib/dfd/parser';
  import { buildRenderData } from '$lib/dfd/renderer';
  import { generatePseudocode } from '$lib/dfd/pseudocode';
  import { DfdExecutor } from '$lib/dfd/executor';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let dfdContent = $state('');
  let currentFileName = $state('ejercicio.dfd');
  let selectedExerciseId = $state<number | ''>('');
  let sourceTab = $state<'legible' | 'dfd'>('legible');
  let isInitialLoad = $state(true);
  let history = $state<string[]>([]);
  let activeDropIndex = $state(-1);
  let selectedPath = $state<(number | string)[] | null>(null);
  let editArmed = $state(false);
  
  $effect(() => {
    if (isInitialLoad && $page.url.searchParams.has('load')) {
      const loadParam = $page.url.searchParams.get('load');
      if (loadParam && loadParam.startsWith('Problema ')) {
        const id = parseInt(loadParam.replace('Problema ', ''));
        if (!isNaN(id) && id >= 1 && id <= 16) {
          selectedExerciseId = id;
          loadExercise(id);
        }
      }
      isInitialLoad = false;
    }
  });

  async function loadExercise(id: number) {
    if (!id) return;
    try {
      const filename = `Problema ${id}.dfd`;
      const res = await fetch(`/dfd/nivel1/${filename}`);
      if (!res.ok) throw new Error('No se pudo cargar el archivo');
      dfdContent = await res.text();
      currentFileName = filename;
      selectedPath = null;
      editArmed = false;
      consoleOutput = [`--- Ejercicio ${id} cargado automáticamente ---`];
    } catch (err) {
      console.error(err);
      consoleOutput = ['--- Error al cargar el ejercicio ---'];
    }
  }
  
  let ast = $derived.by(() => {
    if (!dfdContent) return null;
    try {
      const parsed = parseDfd(dfdContent);
      return parsed.error ? null : parsed;
    } catch (err) {
      console.error("Parse error", err);
      return null;
    }
  });

  let renderData = $derived.by(() => {
    if (!ast) return null;
    try {
      return buildRenderData(ast);
    } catch (err) {
      console.error("Render error", err);
      return null;
    }
  });

  let pseudocode = $derived.by(() => {
    if (!ast) return '// Sin algoritmo cargado.\n// Selecciona un ejercicio del Nivel 1.';
    try {
      return generatePseudocode(ast, currentFileName);
    } catch (err) {
      console.error("Pseudocode error", err);
      return '// No se pudo generar el pseudocódigo.';
    }
  });

  let consoleOutput = $state<string[]>([]);
  let isExecuting = $state(false);

  function getNodeByPath(root, path) {
    if (!root || !path) return null;
    let list = root.nodes;
    let node = null;
    for (let k = 0; k < path.length; k++) {
      const seg = path[k];
      if (typeof seg === 'number') {
        node = list?.[seg] ?? null;
        if (!node) return null;
        if (k === path.length - 1) return node;
      } else {
        if (!node) return null;
        if (seg === 'true') list = node.trueBranch;
        else if (seg === 'false') list = node.falseBranch;
        else if (seg === 'body') list = node.body;
        else return null;
        node = null;
      }
    }
    return node;
  }

  let selectedNode = $derived.by(() => {
    if (!ast || !selectedPath) return null;
    try {
      return getNodeByPath(ast, selectedPath);
    } catch {
      return null;
    }
  });

  function pathKey(p) {
    return JSON.stringify(p);
  }

  function armEdit() {
    if (!editArmed) {
      pushHistory();
      editArmed = true;
    }
  }

  function commitEdit() {
    if (!ast) return;
    editArmed = false;
    dfdContent = serializeDfd(ast);
  }

  function handleShapeClick(e) {
    const target = e.target as Element;
    const g = target?.closest?.('g[data-path]');
    if (!g) {
      selectedPath = null;
      return;
    }
    try {
      selectedPath = JSON.parse(g.getAttribute('data-path') || 'null');
      editArmed = false;
    } catch {
      selectedPath = null;
    }
  }

  function selectStep(i) {
    selectedPath = [i];
    editArmed = false;
  }
  
  // Custom Prompt State
  let promptVisible = $state(false);
  let promptMessage = $state('');
  let promptValue = $state('');
  let resolvePrompt: ((value: string) => void) | null = null;

  // Drag and drop / Canvas interaction states
  let isDragging = $state(false);

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
    // Nodos virtuales de unión: no se dibujan
    if (shape.type === 'merge' || shape.width === 0) return '';
    // Terminales Inicio/Fin no son editables
    if (shape.id === 'start' || shape.id === 'end') {
      const rx = 25;
      const safeText = String(shape.text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `
      <g transform="translate(${shape.x - shape.width/2}, ${shape.y})">
        <rect width="${shape.width}" height="${shape.height}" rx="${rx}" class="shape-terminal"/>
        <foreignObject x="10" y="10" width="${shape.width - 20}" height="${shape.height - 20}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;font-size:12px;font-family:sans-serif;word-break:break-word;color:#333;">
            ${safeText}
          </div>
        </foreignObject>
      </g>
    `;
    }
    const rx = 4;
    const safeText = String(shape.text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const isSel = selectedPath && shape.path && pathKey(selectedPath) === pathKey(shape.path);
    const selStyle = isSel ? ' stroke:#1d4ed8; stroke-width:4;' : '';
    const pathAttr = shape.path ? ` data-path='${JSON.stringify(shape.path)}'` : '';
    return `
      <g transform="translate(${shape.x - shape.width/2}, ${shape.y})"${pathAttr} style="cursor:pointer;">
        ${
          shape.type === 'input' ? `<polygon points="20,0 ${shape.width},0 ${shape.width-20},${shape.height} 0,${shape.height}" class="shape-input" style="${selStyle}"/>` :
          shape.type === 'output' ? `<polygon points="0,0 ${shape.width-15},0 ${shape.width},${shape.height/2} ${shape.width-15},${shape.height} 0,${shape.height}" class="shape-output" style="${selStyle}"/>` :
          shape.type === 'decision' ? `<polygon points="${shape.width/2},0 ${shape.width},${shape.height/2} ${shape.width/2},${shape.height} 0,${shape.height/2}" class="shape-decision" style="${selStyle}"/>` :
          shape.type === 'while' ? `<polygon points="${shape.width/2},0 ${shape.width},${shape.height/2} ${shape.width/2},${shape.height} 0,${shape.height/2}" class="shape-while" style="${selStyle}"/>` :
          `<rect width="${shape.width}" height="${shape.height}" rx="${rx}" class="shape-${shape.type}" style="${selStyle}"/>`
        }
        <foreignObject x="10" y="10" width="${shape.width - 20}" height="${shape.height - 20}" style="pointer-events:none;">
          <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;font-size:12px;font-family:sans-serif;word-break:break-word;color:#333;">
            ${safeText}
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

  function handleDragStart(e, type) {
    isDragging = true;
    activeDropIndex = -1;
    if (e.dataTransfer) {
      e.dataTransfer.setData('dfd-type', type);
      e.dataTransfer.setData('text/plain', type);
      e.dataTransfer.effectAllowed = 'copy';
    }
  }

  function handleDragEnd() {
    isDragging = false;
    activeDropIndex = -1;
  }

  function createNode(type) {
    if (type === 'output') return { type: 'output', text: "'Nuevo mensaje'" };
    if (type === 'input') return { type: 'input', variables: ['var1'] };
    if (type === 'process') return { type: 'assignment', assignments: [{ variable: 'x', expression: '0' }] };
    if (type === 'decision') return { type: 'decision', condition: 'x > 0', trueBranch: [], falseBranch: [], flag: 0 };
    if (type === 'while') return { type: 'while', condition: 'x > 0', body: [] };
    return null;
  }

  function pushHistory() {
    history = [...history.slice(-29), dfdContent];
  }

  function ensureAst() {
    if (ast) return true;
    // Si no hay algoritmo, crear uno vacío para poder arrastrar
    pushHistory();
    dfdContent = serializeDfd({ variables: [], nodes: [{ type: 'end' }] });
    consoleOutput = ['--- Nuevo algoritmo creado, ahora arrastra componentes ---'];
    return true;
  }

  function insertNodeAt(targetList, index, type) {
    if (!ast && !ensureAst()) return;
    const newNode = createNode(type);
    if (!newNode || !targetList) return;
    pushHistory();
    targetList.splice(index, 0, newNode);
    dfdContent = serializeDfd(ast);
    const label = type === 'input' ? 'Lectura' : type === 'output' ? 'Salida' : type === 'process' ? 'Asignación' : type === 'decision' ? 'Decisión' : 'Mientras';
    consoleOutput = [`--- Componente "${label}" insertado en la posición ${index + 1} ---`];
  }

  function handleDrop(e, zone) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
    activeDropIndex = -1;
    const type = e.dataTransfer?.getData('dfd-type') || e.dataTransfer?.getData('text/plain');
    if (!type || !['input', 'output', 'process', 'decision', 'while'].includes(type)) return;
    insertNodeAt(zone.targetList, zone.index, type);
  }

  // Fallback táctil / accesible: clic en paleta agrega al final del flujo principal
  function handlePaletteClick(type) {
    if (!ast && !ensureAst()) return;
    insertNodeAt(ast.nodes, Math.max(0, ast.nodes.length - 1), type);
  }

  function handleCanvasDrop(e) {
    e.preventDefault();
    isDragging = false;
    activeDropIndex = -1;
    const type = e.dataTransfer?.getData('dfd-type') || e.dataTransfer?.getData('text/plain');
    if (!type || !['input', 'output', 'process', 'decision', 'while'].includes(type)) return;
    if (!ast) {
      ensureAst();
      return;
    }
    // Soltado fuera de una zona precisa: agregar al final (antes del Fin)
    insertNodeAt(ast.nodes, Math.max(0, ast.nodes.length - 1), type);
  }

  function handleNew() {
    pushHistory();
    selectedExerciseId = '';
    currentFileName = 'nuevo.dfd';
    selectedPath = null;
    editArmed = false;
    dfdContent = serializeDfd({ variables: [], nodes: [{ type: 'end' }] });
    consoleOutput = ['--- Lienzo nuevo. Arrastra componentes desde la izquierda ---'];
  }

  function handleUndo() {
    const prev = history.pop();
    if (prev !== undefined) dfdContent = prev;
    selectedPath = null;
    editArmed = false;
  }

  function handleDeleteLast() {
    if (!ast || ast.nodes.length <= 1) return;
    pushHistory();
    // Eliminar último nodo real (antes del 'end')
    const idx = ast.nodes.findIndex((n) => n.type === 'end' || n.type === 'return');
    const removeAt = idx > 0 ? idx - 1 : ast.nodes.length - 1;
    ast.nodes.splice(removeAt, 1);
    dfdContent = serializeDfd(ast);
  }

  function handleDeleteAt(index) {
    if (!ast) return;
    pushHistory();
    ast.nodes.splice(index, 1);
    dfdContent = serializeDfd(ast);
  }

  function handleMove(index, dir) {
    if (!ast) return;
    const j = index + dir;
    if (j < 0 || j >= ast.nodes.length) return;
    pushHistory();
    const [item] = ast.nodes.splice(index, 1);
    ast.nodes.splice(j, 0, item);
    dfdContent = serializeDfd(ast);
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
      <input type="text" id="dfd-filename" name="dfd-filename" bind:value={currentFileName} class="filename-input" />
      <select class="btn btn-secondary exercise-select" bind:value={selectedExerciseId} onchange={() => { if (selectedExerciseId) loadExercise(selectedExerciseId as number); }}>
        <option value="">-- Ejercicios Nivel 1 --</option>
        {#each Array.from({ length: 16 }, (_, i) => i + 1) as i}
          <option value={i}>Problema {i}</option>
        {/each}
      </select>
      <label class="btn btn-secondary">
        📂 Abrir Local
        <input type="file" id="dfd-file-upload" name="dfd-file-upload" accept=".dfd,.txt" onchange={handleFileUpload} style="display: none;" />
      </label>
      <button class="btn btn-secondary" onclick={handleSave}>💾 Guardar</button>
      <button class="btn btn-primary run-btn" onclick={handleRun} disabled={!ast}>
        {isExecuting ? '⏳ Ejecutando...' : '▶ Ejecutar'}
      </button>
    </div>
  </div>

  <div class="layout">
    <!-- Left Sidebar: Palette -->
    <div class="sidebar">
      <h3>Componentes</h3>
      <p class="sidebar-help">Arrastra al lienzo o haz clic en + para agregar al final. Las zonas azules marcan el engranaje entre pasos.</p>
      <div class="palette">
        <div class="palette-item palette-static"><div class="palette-shape start"></div> Inicio/Fin <span class="palette-tag">auto</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'input')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('input')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('input')} title="Arrastrar o clic para agregar Lectura"><div class="palette-shape input"></div> Lectura <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'output')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('output')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('output')} title="Arrastrar o clic para agregar Salida"><div class="palette-shape output"></div> Salida <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'process')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('process')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('process')} title="Arrastrar o clic para agregar Asignación"><div class="palette-shape process"></div> Asignación <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'decision')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('decision')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('decision')} title="Arrastrar o clic para agregar Decisión"><div class="palette-shape decision"></div> Decisión <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'while')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('while')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('while')} title="Arrastrar o clic para agregar Mientras"><div class="palette-shape while"></div> Mientras <span class="palette-add">+</span></div>
      </div>

      <div class="canvas-actions">
        <button class="mini-btn" onclick={handleNew} title="Lienzo vacío">🆕 Nuevo</button>
        <button class="mini-btn" onclick={handleUndo} disabled={history.length === 0} title="Deshacer último cambio">↩ Deshacer</button>
        <button class="mini-btn" onclick={handleDeleteLast} title="Eliminar último paso">🗑 Último</button>
      </div>

      {#if ast && ast.nodes.length > 1}
        <h3 style="margin-top: 1.25rem;">Pasos ({ast.nodes.filter((n) => n.type !== 'end' && n.type !== 'return').length})</h3>
        <ol class="steps-list">
          {#each ast.nodes as node, i}
            {#if node.type !== 'end' && node.type !== 'return'}
              <li class="step-item" class:selected={selectedPath && JSON.stringify(selectedPath) === JSON.stringify([i])}>
                <button class="step-label-btn" onclick={() => selectStep(i)} title="Clic para editar propiedades">
                  <span class="step-label">{i + 1}. {node.type === 'input' ? `Leer ${(node.variables || []).join(',')}` : node.type === 'output' ? `Escribir ${(node.text || '').slice(0, 24)}` : node.type === 'assignment' ? `${(node.assignments?.[0]?.variable ?? 'x')} <- ${(node.assignments?.[0]?.expression ?? '')}` : node.type === 'decision' ? `Si ${node.condition}` : node.type === 'while' ? `Mientras ${node.condition}` : node.type}</span>
                </button>
                <span class="step-btns">
                  <button class="icon-btn" onclick={() => handleMove(i, -1)} aria-label="Subir paso {i + 1}">↑</button>
                  <button class="icon-btn" onclick={() => handleMove(i, 1)} aria-label="Bajar paso {i + 1}">↓</button>
                  <button class="icon-btn danger" onclick={() => handleDeleteAt(i)} aria-label="Eliminar paso {i + 1}">✕</button>
                </span>
              </li>
            {/if}
          {/each}
        </ol>
        <p class="code-hint">💡 Clic en un paso o en una figura del lienzo para editarlo.</p>
      {/if}
      
      <h3 style="margin-top: 2rem;">Código Fuente</h3>
      <div class="source-tabs" role="tablist" aria-label="Vista de código fuente">
        <button
          type="button"
          role="tab"
          aria-selected={sourceTab === 'legible'}
          class="source-tab"
          class:active={sourceTab === 'legible'}
          onclick={() => sourceTab = 'legible'}
        >📖 Legible</button>
        <button
          type="button"
          role="tab"
          aria-selected={sourceTab === 'dfd'}
          class="source-tab"
          class:active={sourceTab === 'dfd'}
          onclick={() => sourceTab = 'dfd'}
        >⚙️ .DFD</button>
      </div>
      {#if sourceTab === 'legible'}
        <pre class="code-view" aria-label="Pseudocódigo legible del diagrama">{pseudocode}</pre>
        <p class="code-hint">Vista explicativa generada del diagrama. Para editar, usa la pestaña .DFD.</p>
      {:else}
        <textarea
          id="dfd-source-code"
          name="dfd-source-code"
          class="code-editor"
          bind:value={dfdContent}
          placeholder="Código DFD crudo (formato FreeDFD)..."
          spellcheck="false"
        ></textarea>
        <p class="code-hint">Formato interno FreeDFD (códigos 1,4,5,6...). Solo para avanzados.</p>
      {/if}
    </div>

    <!-- Center: Visual Canvas -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="canvas-container"
      class:dragging={isDragging}
      ondragover={(e) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; }}
      ondrop={handleCanvasDrop}
    >
      {#if renderData}
        {#if isDragging}
          <div class="drop-hint">Suelta sobre una zona azul para engranar el componente en ese punto del flujo</div>
        {/if}
        <svg class="dfd-canvas" viewBox="0 0 {renderData.width} {renderData.height}" onclick={handleShapeClick} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleShapeClick(e); }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>

          <text x="16" y="20" font-size="12" fill="#94a3b8">💡 Clic en una figura para editar sus propiedades →</text>
          
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
          
          <!-- Drop Zones: engranaje entre componentes -->
          {#each renderData.dropZones as zone, zi}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <g>
              {#if isDragging}
                <rect
                  x={zone.cx - 60}
                  y={zone.cy - 16}
                  width="120"
                  height="32"
                  fill={activeDropIndex === zi ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.2)'}
                  stroke="#3b82f6"
                  stroke-width="2"
                  stroke-dasharray="5"
                  rx="8"
                  class="drop-zone-rect"
                  ondragover={(e) => { e.preventDefault(); e.stopPropagation(); activeDropIndex = zi; if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; }}
                  ondragleave={() => { if (activeDropIndex === zi) activeDropIndex = -1; }}
                  ondrop={(e) => handleDrop(e, zone)}
                />
                <text x={zone.cx} y={zone.cy + 4} text-anchor="middle" font-size="11" fill="#1d4ed8" font-weight="bold" style="pointer-events:none;">+ soltar aquí</text>
              {/if}
            </g>
          {/each}
        </svg>
      {:else}
        <div
          class="empty-state"
          ondragover={(e) => { e.preventDefault(); }}
          ondrop={handleCanvasDrop}
        >
          <h3>No hay un algoritmo cargado</h3>
          <p>Usa "Abrir" para cargar un .dfd, elige un ejercicio Nivel 1, o crea uno nuevo.</p>
          <button class="btn btn-primary" onclick={handleNew}>🆕 Crear lienzo vacío</button>
        </div>
      {/if}
    </div>

    {#if selectedNode}
      <aside class="props-panel" aria-label="Propiedades del componente seleccionado">
        <div class="props-header">
          <strong>
            {#if selectedNode.type === 'input'}📥 Lectura
            {:else if selectedNode.type === 'output'}📤 Salida
            {:else if selectedNode.type === 'assignment'}⚙️ Asignación
            {:else if selectedNode.type === 'decision'}🔀 Decisión
            {:else if selectedNode.type === 'while'}🔁 Mientras
            {:else}🧩 Componente{/if}
          </strong>
          <button class="icon-btn" onclick={() => selectedPath = null} aria-label="Cerrar propiedades">✕</button>
        </div>
        <p class="props-hint">Edita en lenguaje natural. El diagrama y el pseudocódigo se actualizan solos.</p>

        {#if selectedNode.type === 'input'}
          <label class="props-label" for="prop-input-vars">Variables a leer (separadas por coma)</label>
          <input id="prop-input-vars" class="props-input" value={(selectedNode.variables || []).join(', ')} onfocus={armEdit} oninput={(e) => { selectedNode.variables = e.currentTarget.value.split(',').map((v) => v.trim()).filter(Boolean); commitEdit(); }} placeholder="ej: n1, n2" />
          <p class="props-example">Ej: <code>n1, n2</code> → genera <code>Leer n1, n2</code></p>
        {:else if selectedNode.type === 'output'}
          <label class="props-label" for="prop-output-text">Qué mostrar (texto entre ' ' y variables con comas)</label>
          <input id="prop-output-text" class="props-input" value={selectedNode.text || ''} onfocus={armEdit} oninput={(e) => { selectedNode.text = e.currentTarget.value; commitEdit(); }} placeholder="ej: 'La suma es: ', suma" />
          <p class="props-example">Ej: <code>'La suma es: ', suma</code></p>
        {:else if selectedNode.type === 'assignment'}
          {#each selectedNode.assignments as a, ai}
            <div class="props-row">
              <div>
                <label class="props-label" for={`prop-var-${ai}`}>Variable</label>
                <input id={`prop-var-${ai}`} class="props-input" value={a.variable} onfocus={armEdit} oninput={(e) => { a.variable = e.currentTarget.value.replace(/[^a-zA-Z0-9_]/g, ''); commitEdit(); }} placeholder="suma" />
              </div>
              <div>
                <label class="props-label" for={`prop-expr-${ai}`}>Fórmula</label>
                <input id={`prop-expr-${ai}`} class="props-input" value={a.expression} onfocus={armEdit} oninput={(e) => { a.expression = e.currentTarget.value; commitEdit(); }} placeholder="n1+n2" />
              </div>
            </div>
          {/each}
          <p class="props-example">Genera <code>suma &lt;- n1+n2</code></p>
        {:else if selectedNode.type === 'decision'}
          <label class="props-label" for="prop-decision-cond">Condición (Sí / No)</label>
          <input id="prop-decision-cond" class="props-input" value={selectedNode.condition || ''} onfocus={armEdit} oninput={(e) => { selectedNode.condition = e.currentTarget.value; commitEdit(); }} placeholder="ej: n1 > n2" />
          <p class="props-example">Ej: <code>n1 &gt; n2</code>, <code>nota &gt;= 3</code>. Rama izquierda = Sí, derecha = No.</p>
        {:else if selectedNode.type === 'while'}
          <label class="props-label" for="prop-while-cond">Condición para repetir</label>
          <input id="prop-while-cond" class="props-input" value={selectedNode.condition || ''} onfocus={armEdit} oninput={(e) => { selectedNode.condition = e.currentTarget.value; commitEdit(); }} placeholder="ej: contador <= 5" />
          <p class="props-example">Ej: <code>contador &lt;= 5</code>. Arrastra componentes dentro del cuerpo usando las zonas azules.</p>
        {/if}
      </aside>
    {/if}
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
        id="dfd-prompt-input"
        name="dfd-prompt-input"
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
  .palette-shape.while { transform: rotate(45deg); width: 14px; height: 14px; background: #ddd6fe; border-color: #8b5cf6; margin-left: 4px; }
  .palette-shape.input { transform: skewX(-15deg); background: #f3e8ff; border-color: #c084fc; }
  .palette-shape.output { background: #fed7aa; border-color: #f97316; }
  .palette-shape.process { background: #bae6fd; border-color: #38bdf8; }

  .palette-item:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
  .palette-static { cursor: default; opacity: 0.8; }
  .palette-tag { margin-left: auto; font-size: 0.65rem; color: #94a3b8; border: 1px solid #e2e8f0; border-radius: 999px; padding: 0.1rem 0.5rem; }
  .palette-add { margin-left: auto; font-weight: 800; color: #3b82f6; }

  .canvas-actions { display: flex; gap: 0.4rem; margin-top: 0.9rem; }
  .mini-btn { flex: 1; padding: 0.4rem; font-size: 0.75rem; font-weight: 600; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #334155; cursor: pointer; }
  .mini-btn:hover:not(:disabled) { background: #e2e8f0; }
  .mini-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .steps-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
  .step-item { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 0.78rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.4rem 0.5rem; }
  .step-item.selected { border-color: #3b82f6; background: #eff6ff; }
  .step-label-btn { flex: 1; min-width: 0; background: none; border: none; padding: 0; text-align: left; cursor: pointer; font: inherit; }
  .step-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #334155; }
  .step-btns { display: flex; gap: 0.2rem; }
  .icon-btn { border: 1px solid #e2e8f0; background: white; border-radius: 6px; font-size: 0.7rem; padding: 0.15rem 0.4rem; cursor: pointer; color: #475569; }
  .icon-btn:hover { background: #e2e8f0; }
  .icon-btn.danger { color: #dc2626; }

  .drop-hint { position: sticky; top: 0; z-index: 5; margin: 0.75rem auto; width: fit-content; background: #1d4ed8; color: white; font-size: 0.8rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: 999px; box-shadow: 0 4px 10px rgba(29,78,216,0.3); }
  .canvas-container.dragging { outline: 3px dashed #3b82f6; outline-offset: -6px; background: #eff6ff; }
  .drop-zone-rect { cursor: copy; }

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

  .source-tabs {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.6rem;
  }

  .source-tab {
    flex: 1;
    padding: 0.4rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
  }

  .source-tab.active {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
  }

  .props-panel {
    width: 300px;
    background: white;
    border-left: 1px solid rgba(0,0,0,0.06);
    padding: 1.25rem;
    overflow-y: auto;
    box-shadow: -4px 0 12px rgba(0,0,0,0.04);
  }

  .props-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.95rem;
    color: #0f172a;
    margin-bottom: 0.5rem;
  }

  .props-hint {
    font-size: 0.78rem;
    color: #64748b;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }

  .props-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    margin: 0.75rem 0 0.35rem 0;
  }

  .props-input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.55rem 0.65rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.85rem;
    font-family: inherit;
    color: #0f172a;
    background: #f8fafc;
  }

  .props-input:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
  }

  .props-row {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 0.5rem;
  }

  .props-example {
    font-size: 0.75rem;
    color: #64748b;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 0.6rem;
    margin: 0.75rem 0 0 0;
  }

  .props-example code {
    background: #e2e8f0;
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    font-size: 0.72rem;
  }

  .code-view {
    flex: 1;
    min-height: 200px;
    max-height: 420px;
    overflow: auto;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12.5px;
    line-height: 1.6;
    background: #0f172a;
    color: #e2e8f0;
    white-space: pre-wrap;
    margin: 0;
  }

  .code-hint {
    font-size: 0.75rem;
    color: #94a3b8;
    margin: 0.5rem 0 0 0;
    line-height: 1.4;
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
  :global(.shape-call) { fill: #bae6fd; stroke: #0369a1; stroke-width: 2; stroke-dasharray: 5; }
  :global(.shape-input) { fill: #e9d5ff; stroke: #a855f7; stroke-width: 2; }
  :global(.shape-output) { fill: #fed7aa; stroke: #f97316; stroke-width: 2; }
  :global(.shape-decision) { fill: #fef08a; stroke: #eab308; stroke-width: 2; }
  :global(.shape-while) { fill: #ddd6fe; stroke: #8b5cf6; stroke-width: 2; }
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
