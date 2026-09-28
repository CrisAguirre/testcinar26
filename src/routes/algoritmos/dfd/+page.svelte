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
  let selectedExerciseId = $state<string | ''>('');
  let sourceTab = $state<'legible' | 'dfd'>('legible');
  let isInitialLoad = $state(true);
  let history = $state<string[]>([]);
  let redoHistory = $state<string[]>([]);
  let activeDropIndex = $state(-1);
  let selectedPath = $state<(number | string)[] | null>(null);
  let editArmed = $state(false);
  // Mejoras UI/manejo: zoom, guía, ejecución paso a paso, validación
  let zoom = $state(1);
  let showGuide = $state(false);
  let executingPath = $state<(number | string)[] | null>(null);
  let liveVariables = $state<Record<string, string | number>>({});
  let currentExecutor = $state<any>(null);
  let showVariables = $state(true);

  function parseLoadParam(loadParam: string | null): { nivel: 'nivel1' | 'nivel2'; id: number } | null {
    if (!loadParam) return null;
    // Nuevos: N1-5, N2-12
    let m = loadParam.match(/^N([12])-(\d{1,2})$/i);
    if (m) {
      const nivel = m[1] === '2' ? 'nivel2' : 'nivel1';
      const id = parseInt(m[2]);
      const max = nivel === 'nivel1' ? 16 : 22;
      if (!isNaN(id) && id >= 1 && id <= max) return { nivel, id };
      return null;
    }
    // Compatibles: "Problema 5" (N1), "N2-Problema 5", "Problema N2-5"
    m = loadParam.match(/Problema\s+N?2?-?(\d{1,2})/i);
    if (m) {
      const id = parseInt(m[1]);
      const isN2 = /N2/i.test(loadParam);
      if (isN2 && id >= 1 && id <= 22) return { nivel: 'nivel2', id };
      if (!isN2 && id >= 1 && id <= 16) return { nivel: 'nivel1', id };
    }
    return null;
  }

  function exerciseKey(nivel: 'nivel1' | 'nivel2', id: number) {
    return nivel === 'nivel1' ? `N1-${id}` : `N2-${id}`;
  }

  $effect(() => {
    if (isInitialLoad && $page.url.searchParams.has('load')) {
      const parsed = parseLoadParam($page.url.searchParams.get('load'));
      if (parsed) {
        selectedExerciseId = exerciseKey(parsed.nivel, parsed.id);
        loadExercise(parsed.id, parsed.nivel);
      }
      isInitialLoad = false;
    }
  });

  async function loadExercise(id: number, nivel: 'nivel1' | 'nivel2' = 'nivel1') {
    if (!id) return;
    try {
      const filename = `Problema ${id}.dfd`;
      const folder = nivel === 'nivel1' ? 'nivel1' : 'nivel2';
      const label = nivel === 'nivel1' ? `N1-Problema ${id}` : `N2-Problema ${id}`;
      const res = await fetch(`/dfd/${folder}/${filename}`);
      if (!res.ok) throw new Error('No se pudo cargar el archivo');
      dfdContent = await res.text();
      currentFileName = nivel === 'nivel1' ? filename : `N2-${filename}`;
      selectedPath = null;
      editArmed = false;
      executingPath = null;
      liveVariables = {};
      consoleOutput = [`--- ${label} cargado: revisa el pseudocódigo Legible y ejecútalo en Paso a paso ---`];
    } catch (err) {
      console.error(err);
      consoleOutput = ['--- Error al cargar el ejercicio: verifica Nivel 1 (1-16) o Nivel 2 (1-22) ---'];
    }
  }
  
  let parseResult = $derived.by(() => {
    if (!dfdContent) return { ast: null, error: '' };
    try {
      const parsed = parseDfd(dfdContent);
      if (parsed.error) return { ast: null, error: parsed.error };
      return { ast: parsed, error: '' };
    } catch (err) {
      console.error('Parse error', err);
      return { ast: null, error: 'No pude leer el codigo .DFD. Revisa la pestana .DFD o pulsa Nuevo.' };
    }
  });

  let ast = $derived.by(() => parseResult.ast);
  let parseErrorMsg = $derived.by(() => parseResult.error);

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

  function getParentList(root, path) {
    if (!root || !path || path.length === 0) return null;
    if (path.length === 1) return root.nodes;
    const parentPath = path.slice(0, -1);
    let list = root.nodes;
    let node = null;
    for (let k = 0; k < parentPath.length; k++) {
      const seg = parentPath[k];
      if (typeof seg === 'number') {
        node = list?.[seg] ?? null;
        if (!node) return null;
      } else {
        if (!node) return null;
        if (seg === 'true') list = node.trueBranch;
        else if (seg === 'false') list = node.falseBranch;
        else if (seg === 'body') list = node.body;
        else return null;
        node = null;
      }
    }
    return list;
  }

  function describeNodeShort(node) {
    if (!node) return 'vacío';
    if (node.type === 'input') return `📥 Leer ${(node.variables || []).join(', ') || '…'}`;
    if (node.type === 'output') return `📤 Escribir ${(node.text || '').slice(0, 28) || '…'}`;
    if (node.type === 'assignment')
      return `⚙️ ${(node.assignments?.[0]?.variable ?? 'x')} ← ${(node.assignments?.[0]?.expression ?? '…')}`;
    if (node.type === 'decision') return `🔀 Si ${node.condition || '(falta condición)'}`;
    if (node.type === 'while') return `🔁 Mientras ${node.condition || '(falta condición)'}`;
    return node.type;
  }

  function flattenSteps(nodes, basePath = [], depth = 0, acc = []) {
    nodes.forEach((node, i) => {
      if (node.type === 'end' || node.type === 'return') return;
      const path = [...basePath, i];
      acc.push({ node, path, depth });
      if (node.type === 'decision') {
        if (node.trueBranch?.length) {
          acc.push({ label: '↳ Rama Sí', isLabel: true, depth: depth + 1 });
          flattenSteps(node.trueBranch, [...path, 'true'], depth + 1, acc);
        }
        if (node.falseBranch?.length) {
          acc.push({ label: '↳ Rama No', isLabel: true, depth: depth + 1 });
          flattenSteps(node.falseBranch, [...path, 'false'], depth + 1, acc);
        }
      } else if (node.type === 'while' && node.body?.length) {
        acc.push({ label: '↳ Cuerpo del Mientras', isLabel: true, depth: depth + 1 });
        flattenSteps(node.body, [...path, 'body'], depth + 1, acc);
      }
    });
    return acc;
  }

  let flatSteps = $derived.by(() => {
    if (!ast?.nodes) return [];
    try {
      return flattenSteps(ast.nodes);
    } catch {
      return [];
    }
  });

  let stepCount = $derived.by(() => flatSteps.filter((s) => !s.isLabel).length);

  const VAR_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  function validateNode(node) {
    const warnings = [];
    if (!node) return warnings;
    if (node.type === 'input') {
      if (!node.variables || node.variables.length === 0 || node.variables.every((v) => !v))
        warnings.push('Agrega al menos una variable, ej: n1, n2.');
      else
        for (const v of node.variables) {
          if (v && !VAR_RE.test(v)) warnings.push(`"${v}" no es un nombre válido. Usa letras, números y _.`);
        }
    } else if (node.type === 'output') {
      if (!node.text || !node.text.trim()) warnings.push('Escribe qué mostrar, ej: \'La suma es: \', suma.');
    } else if (node.type === 'assignment') {
      for (const a of node.assignments || []) {
        if (!a.variable || !VAR_RE.test(a.variable))
          warnings.push(`Variable "${a.variable || 'vacía'}" inválida. Ej: suma.`);
        if (!a.expression || !a.expression.trim())
          warnings.push(`Falta la fórmula para ${a.variable || 'la variable'}. Ej: n1+n2.`);
      }
    } else if (node.type === 'decision' || node.type === 'while') {
      if (!node.condition || !node.condition.trim())
        warnings.push('Escribe la condición, ej: n1 > n2.');
    }
    return warnings;
  }

  let selectedWarnings = $derived.by(() => validateNode(selectedNode));

  let totalWarnings = $derived.by(() => {
    if (!ast?.nodes) return 0;
    let n = 0;
    const walk = (nodes) => {
      for (const node of nodes) {
        if (node.type === 'end' || node.type === 'return') continue;
        n += validateNode(node).length;
        if (node.type === 'decision') {
          walk(node.trueBranch || []);
          walk(node.falseBranch || []);
        } else if (node.type === 'while') walk(node.body || []);
      }
    };
    try {
      walk(ast.nodes);
    } catch {
      // ignorar
    }
    return n;
  });

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

  function selectStep(path) {
    selectedPath = Array.isArray(path) ? [...path] : [path];
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
    let contentToSave = dfdContent;
    if (ast) {
      contentToSave = serializeDfd(ast);
    }

    const blob = new Blob([contentToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName.endsWith('.dfd') ? currentFileName : `${currentFileName}.dfd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    consoleOutput = [...consoleOutput, `💾 Archivo "${a.download}" guardado. Puedes volver a abrirlo con 📂 Abrir Local.`];
  }

  async function runExecutor(stepDelayMs, modeLabel) {
    if (!ast) {
      consoleOutput = ['⚠️ Primero carga o crea un algoritmo. Pulsa 🆕 Nuevo o elige un Problema 1-16.'];
      return;
    }
    if (totalWarnings > 0) {
      consoleOutput = [
        `⚠️ Tienes ${totalWarnings} aviso(s) en los componentes. Revísalos en el panel derecho antes de ejecutar. Igual intento ejecutar…`
      ];
    } else {
      consoleOutput = [`--- ${modeLabel} ---`];
    }
    isExecuting = true;
    executingPath = null;
    liveVariables = {};

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
        },
        async (path, vars) => {
          executingPath = path;
          liveVariables = vars || {};
        },
        stepDelayMs
      );
      currentExecutor = executor;
      await executor.execute();
    } catch (e) {
      console.error(e);
      consoleOutput = [...consoleOutput, `[Error de Motor]: ${e.message || e}`];
    } finally {
      isExecuting = false;
      currentExecutor = null;
      // mantener el último resaltado 1.2s para que el estudiante vea dónde terminó
      const lastPath = executingPath;
      if (lastPath) setTimeout(() => { if (!isExecuting) executingPath = null; }, 1200);
    }
  }

  async function handleRun() {
    await runExecutor(0, '▶ Ejecución rápida iniciada');
  }

  async function handleStepRun() {
    await runExecutor(750, '🐢 Paso a paso: mira cómo se ilumina cada figura y cambian las variables →');
  }

  function handleStop() {
    try {
      currentExecutor?.stop?.();
    } catch {
      // ignorar
    }
    isExecuting = false;
    consoleOutput = [...consoleOutput, '⏹ Ejecución detenida por el usuario.'];
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
    const isExec = executingPath && shape.path && pathKey(executingPath) === pathKey(shape.path);
    let selStyle = '';
    if (isExec) selStyle = ' stroke:#16a34a; stroke-width:5; filter:drop-shadow(0 0 6px #22c55e);';
    else if (isSel) selStyle = ' stroke:#1d4ed8; stroke-width:4;';
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
    if (type === 'output') return { type: 'output', text: "'Resultado: ', x" };
    if (type === 'input') return { type: 'input', variables: ['n1'] };
    if (type === 'process') return { type: 'assignment', assignments: [{ variable: 'x', expression: '0' }] };
    if (type === 'decision') return { type: 'decision', condition: 'x > 0', trueBranch: [], falseBranch: [], flag: 0 };
    if (type === 'while') return { type: 'while', condition: 'contador <= 5', body: [] };
    return null;
  }

  function componentLabel(type) {
    if (type === 'input') return 'Lectura 📥 (pedir dato)';
    if (type === 'output') return 'Salida 📤 (mostrar resultado)';
    if (type === 'process') return 'Asignación ⚙️ (calcular)';
    if (type === 'decision') return 'Decisión 🔀 (pregunta Sí/No)';
    if (type === 'while') return 'Mientras 🔁 (repetir)';
    return type;
  }

  function pushHistory() {
    history = [...history.slice(-49), dfdContent];
    redoHistory = [];
  }

  function ensureAst() {
    if (ast) return true;
    pushHistory();
    dfdContent = serializeDfd({ variables: [], nodes: [{ type: 'end' }] });
    consoleOutput = ['✨ Creé un algoritmo vacío. Paso 1: arrastra una Lectura 📥. Paso 2: agrega una Salida 📤. Paso 3: pulsa ▶ Ejecutar.'];
    return true;
  }

  function insertNodeAt(targetList, index, type) {
    if (!ast && !ensureAst()) return;
    const newNode = createNode(type);
    if (!newNode || !targetList) return;
    pushHistory();
    const safeIndex = Math.max(0, Math.min(index, targetList.length));
    targetList.splice(safeIndex, 0, newNode);
    dfdContent = serializeDfd(ast);
    consoleOutput = [`✅ ${componentLabel(type)} agregado en la posición ${safeIndex + 1}. Clic en la figura para editar sus datos →`];
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

  // Clic en paleta agrega al final del flujo principal (accesible y táctil)
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
    insertNodeAt(ast.nodes, Math.max(0, ast.nodes.length - 1), type);
  }

  function handleNew() {
    pushHistory();
    selectedExerciseId = '';
    currentFileName = 'nuevo.dfd';
    selectedPath = null;
    editArmed = false;
    executingPath = null;
    liveVariables = {};
    dfdContent = serializeDfd({ variables: [], nodes: [{ type: 'end' }] });
    consoleOutput = ['🆕 Lienzo vacío listo. Guía rápida: 1) Arrastra 📥 Lectura 2) Arrastra ⚙️ Asignación 3) Arrastra 📤 Salida 4) ▶ Ejecutar.'];
  }

  function handleUndo() {
    if (history.length === 0) return;
    const prev = history.pop();
    if (prev !== undefined) {
      redoHistory = [...redoHistory.slice(-49), dfdContent];
      dfdContent = prev;
    }
    selectedPath = null;
    editArmed = false;
  }

  function handleRedo() {
    if (redoHistory.length === 0) return;
    const next = redoHistory.pop();
    if (next !== undefined) {
      history = [...history.slice(-49), dfdContent];
      dfdContent = next;
    }
    selectedPath = null;
    editArmed = false;
  }

  function handleDeleteLast() {
    if (!ast || ast.nodes.length <= 1) {
      consoleOutput = ['ℹ️ No hay pasos para borrar. Agrega componentes desde la izquierda.'];
      return;
    }
    pushHistory();
    const idx = ast.nodes.findIndex((n) => n.type === 'end' || n.type === 'return');
    const removeAt = idx > 0 ? idx - 1 : ast.nodes.length - 1;
    const removed = ast.nodes[removeAt];
    ast.nodes.splice(removeAt, 1);
    dfdContent = serializeDfd(ast);
    consoleOutput = [`🗑 Eliminado: ${describeNodeShort(removed)}. Puedes ↩ Deshacer si fue un error.`];
  }

  function handleDeletePath(path) {
    if (!ast || !path) return;
    const list = getParentList(ast, path);
    const idx = path[path.length - 1];
    if (!Array.isArray(list) || typeof idx !== 'number' || !list[idx]) return;
    pushHistory();
    const removed = list[idx];
    list.splice(idx, 1);
    dfdContent = serializeDfd(ast);
    selectedPath = null;
    editArmed = false;
    consoleOutput = [`🗑 Eliminado: ${describeNodeShort(removed)}. Tip: usa Duplicar para probar variantes.`];
  }

  function handleDeleteAt(index) {
    handleDeletePath([index]);
  }

  function handleDeleteSelected() {
    if (!selectedPath) {
      consoleOutput = ['👆 Primero haz clic en una figura del lienzo o en un paso de la lista para seleccionarlo.'];
      return;
    }
    handleDeletePath(selectedPath);
  }

  function handleDuplicateSelected() {
    if (!ast || !selectedPath) {
      consoleOutput = ['👆 Selecciona un componente para duplicarlo (clic en la figura).'];
      return;
    }
    const list = getParentList(ast, selectedPath);
    const idx = selectedPath[selectedPath.length - 1];
    if (!Array.isArray(list) || typeof idx !== 'number' || !list[idx]) return;
    pushHistory();
    const copy = JSON.parse(JSON.stringify(list[idx]));
    list.splice(idx + 1, 0, copy);
    dfdContent = serializeDfd(ast);
    consoleOutput = [`📋 Duplicado: ${describeNodeShort(copy)} justo debajo del original.`];
  }

  function handleMovePath(path, dir) {
    if (!ast || !path) return;
    const list = getParentList(ast, path);
    const idx = path[path.length - 1];
    if (!Array.isArray(list) || typeof idx !== 'number') return;
    const j = idx + dir;
    if (j < 0 || j >= list.length) return;
    // No mover terminales
    if (list[idx]?.type === 'end' || list[idx]?.type === 'return') return;
    if (list[j]?.type === 'end' || list[j]?.type === 'return') return;
    pushHistory();
    const [item] = list.splice(idx, 1);
    list.splice(j, 0, item);
    dfdContent = serializeDfd(ast);
    const newPath = [...path.slice(0, -1), j];
    selectedPath = newPath;
  }

  function handleMove(index, dir) {
    handleMovePath([index], dir);
  }

  function handleMoveSelected(dir) {
    if (!selectedPath) return;
    handleMovePath(selectedPath, dir);
  }

  function zoomIn() {
    zoom = Math.min(1.8, Math.round((zoom + 0.15) * 100) / 100);
  }
  function zoomOut() {
    zoom = Math.max(0.5, Math.round((zoom - 0.15) * 100) / 100);
  }
  function zoomReset() {
    zoom = 1;
  }

  function handleGlobalKeydown(e) {
    const target = e.target as HTMLElement;
    const tag = (target?.tagName || '').toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }
    if ((mod && e.key.toLowerCase() === 'y') || (mod && e.shiftKey && e.key.toLowerCase() === 'z')) {
      e.preventDefault();
      handleRedo();
      return;
    }
    if (isTyping) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedPath) {
        e.preventDefault();
        handleDeleteSelected();
      }
    } else if (e.key === 'Escape') {
      selectedPath = null;
      promptVisible = false;
    } else if (mod && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      handleDuplicateSelected();
    }
  }
</script>

<svelte:head>
  <title>Editor Visual DFD - Algoritmos</title>
</svelte:head>

<svelte:window onkeydown={handleGlobalKeydown} />

<div class="page">
  <header class="toolbar" aria-label="Barra principal del editor DFD">
    <div class="toolbar-row">
      <div class="tool-group" aria-label="Navegación">
        <span class="group-label">Menú</span>
        <button class="back-btn" onclick={() => goto('/algoritmos')}>
          <span>←</span> Algoritmos
        </button>
      </div>

      <div class="tool-group group-exercise" aria-label="Ejercicios">
        <span class="group-label">Ejercicios N1 + N2</span>
        <select class="btn btn-secondary exercise-select" bind:value={selectedExerciseId} onchange={() => { if (selectedExerciseId) { const [n, idStr] = String(selectedExerciseId).split('-'); loadExercise(parseInt(idStr), n === 'N2' ? 'nivel2' : 'nivel1'); } }} aria-label="Elegir ejercicio Nivel 1 o Nivel 2">
          <option value="">-- Elegir --</option>
          <optgroup label="Nivel 1 — Operadores (16)">
            {#each Array.from({ length: 16 }, (_, i) => i + 1) as i}
              <option value={`N1-${i}`}>N1 · Problema {i}</option>
            {/each}
          </optgroup>
          <optgroup label="Nivel 2 — Condicionales (22)">
            {#each Array.from({ length: 22 }, (_, i) => i + 1) as i}
              <option value={`N2-${i}`}>N2 · Problema {i}</option>
            {/each}
          </optgroup>
        </select>
      </div>

      <div class="tool-group" aria-label="Archivo">
        <span class="group-label">Archivo</span>
        <span class="file-wrap" title="Nombre del archivo .dfd">
          <span class="file-icon" aria-hidden="true">📄</span>
          <input type="text" id="dfd-filename" name="dfd-filename" bind:value={currentFileName} class="filename-input" aria-label="Nombre del archivo" />
        </span>
        <label class="btn btn-secondary" title="Abrir un .dfd de tu PC">
          📂 Abrir
          <input type="file" id="dfd-file-upload" name="dfd-file-upload" accept=".dfd,.txt" onchange={handleFileUpload} style="display: none;" />
        </label>
        <button class="btn btn-secondary" onclick={handleSave} title="Descargar el algoritmo como .dfd">💾 Guardar</button>
      </div>

      <div class="tool-group group-run" aria-label="Ejecución">
        <span class="group-label">Ejecutar</span>
        {#if isExecuting}
          <button class="btn btn-danger" onclick={handleStop} title="Detener la ejecución actual">⏹ Detener</button>
        {:else}
          <button class="btn btn-primary run-btn" onclick={handleRun} disabled={!ast} title="Ejecutar rápido sin pausas">
            ▶ Ejecutar
          </button>
          <button class="btn btn-step" onclick={handleStepRun} disabled={!ast} title="Ejecutar despacio iluminando cada figura">
            🐢 Paso a paso
          </button>
        {/if}
      </div>

      <div class="tool-group" aria-label="Ayuda">
        <span class="group-label">Ayuda</span>
        <button class="btn btn-secondary" onclick={() => showGuide = true} title="Ver guía paso a paso para estudiantes">
          ❓ Guía
        </button>
        <a
          class="btn btn-secondary"
          href="/guias/Manual_Manejo_Editor_DFD.pdf"
          target="_blank"
          rel="noopener"
          title="Abrir Manual de Manejo en PDF en pestaña nueva"
        >
          📘 Manual
        </a>
        <a
          class="btn btn-secondary"
          href="/guias/Manual_Manejo_Editor_DFD.pdf"
          download="Manual_Manejo_Editor_DFD.pdf"
          title="Descargar Manual de Manejo en PDF"
        >
          ⬇️ PDF
        </a>
      </div>
    </div>
  </header>
  {#if parseErrorMsg}
    <div class="error-banner" role="alert">
      ⚠️ {parseErrorMsg}
      <button class="mini-btn" onclick={handleNew}>🆕 Empezar de cero</button>
    </div>
  {:else if totalWarnings > 0 && ast}
    <div class="warn-banner" role="status">
      💡 Tienes {totalWarnings} aviso(s): haz clic en cada paso de la lista para completarlo. Ejemplo: toda Decisión necesita condición como <code>n1 &gt; n2</code>.
    </div>
  {/if}

  <div class="layout">
    <!-- Left Sidebar: Palette -->
    <div class="sidebar">
      <h3>1️⃣ Componentes — arrastra o toca +</h3>
      <p class="sidebar-help">
        <strong>Para estudiantes:</strong> arrastra al lienzo y suelta en la zona azul <em>"+ soltar aquí"</em>.
        O haz clic en <strong>+</strong> para agregar al final. Después haz clic en la figura para escribir sus datos.
      </p>
      <div class="palette">
        <div class="palette-item palette-static" title="Inicio y Fin se crean solos"><div class="palette-shape start"></div> Inicio/Fin <span class="palette-tag">auto</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'input')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('input')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('input')} title="Pide un dato al usuario. Ej: n1"><div class="palette-shape input"></div> <span><strong>Lectura</strong><br /><small>pide dato ej: n1</small></span> <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'output')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('output')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('output')} title="Muestra un resultado. Ej: 'La suma es: ', suma"><div class="palette-shape output"></div> <span><strong>Salida</strong><br /><small>muestra ej: suma</small></span> <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'process')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('process')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('process')} title="Calcula y guarda. Ej: suma <- n1+n2"><div class="palette-shape process"></div> <span><strong>Asignación</strong><br /><small>calcula ej: suma</small></span> <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'decision')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('decision')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('decision')} title="Pregunta con dos caminos: Sí (izquierda) / No (derecha)"><div class="palette-shape decision"></div> <span><strong>Decisión</strong><br /><small>pregunta Sí/No</small></span> <span class="palette-add">+</span></div>
        <div class="palette-item" role="button" tabindex="0" draggable="true" ondragstart={(e) => handleDragStart(e, 'while')} ondragend={handleDragEnd} onclick={() => handlePaletteClick('while')} onkeydown={(e) => e.key === 'Enter' && handlePaletteClick('while')} title="Repite mientras se cumpla la condición"><div class="palette-shape while"></div> <span><strong>Mientras</strong><br /><small>repite ej: i&lt;=5</small></span> <span class="palette-add">+</span></div>
      </div>

      <div class="canvas-actions">
        <button class="mini-btn" onclick={handleNew} title="Lienzo vacío">🆕 Nuevo</button>
        <button class="mini-btn" onclick={handleUndo} disabled={history.length === 0} title="Deshacer (Ctrl+Z)">↩ Deshacer</button>
        <button class="mini-btn" onclick={handleRedo} disabled={redoHistory.length === 0} title="Rehacer (Ctrl+Y)">↪ Rehacer</button>
        <button class="mini-btn" onclick={handleDeleteLast} title="Eliminar último paso">🗑 Último</button>
      </div>
      <p class="code-hint">⌨️ Atajos: <code>Ctrl+Z</code> deshacer, <code>Ctrl+Y</code> rehacer, <code>Supr</code> borrar seleccionado, <code>Ctrl+D</code> duplicar, <code>Esc</code> soltar selección.</p>

      {#if ast}
        <h3 style="margin-top: 1.25rem;">2️⃣ Pasos ({stepCount}) — clic para editar</h3>
        {#if flatSteps.length === 0}
          <p class="code-hint">Aún no hay pasos. Arrastra tu primer componente 📥.</p>
        {:else}
        <ol class="steps-list">
          {#each flatSteps as item}
            {#if item.isLabel}
              <li class="branch-label" style="padding-left: {item.depth * 12}px;">{item.label}</li>
            {:else}
              <li class="step-item" class:selected={selectedPath && pathKey(selectedPath) === pathKey(item.path)} class:executing={executingPath && pathKey(executingPath) === pathKey(item.path)} style="margin-left: {item.depth * 12}px;">
                <button class="step-label-btn" onclick={() => selectStep(item.path)} title="Clic para editar propiedades en el panel derecho">
                  <span class="step-label">{describeNodeShort(item.node)}</span>
                </button>
                <span class="step-btns">
                  <button class="icon-btn" onclick={() => handleMovePath(item.path, -1)} aria-label="Subir paso">↑</button>
                  <button class="icon-btn" onclick={() => handleMovePath(item.path, 1)} aria-label="Bajar paso">↓</button>
                  <button class="icon-btn danger" onclick={() => handleDeletePath(item.path)} aria-label="Eliminar paso">✕</button>
                </span>
              </li>
            {/if}
          {/each}
        </ol>
        <p class="code-hint">💡 Incluye ramas Sí/No y cuerpo del Mientras. Clic en un paso o figura para editarlo →</p>
        {/if}
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
      <div class="canvas-toolbar" role="toolbar" aria-label="Controles del lienzo">
        <span class="toolbar-title">3️⃣ Lienzo — diagrama</span>
        <span class="zoom-group">
          <button class="icon-btn" onclick={zoomOut} aria-label="Reducir zoom" title="Reducir zoom">−</button>
          <span class="zoom-label">{Math.round(zoom * 100)}%</span>
          <button class="icon-btn" onclick={zoomIn} aria-label="Ampliar zoom" title="Ampliar zoom">+</button>
          <button class="icon-btn" onclick={zoomReset} aria-label="Zoom 100%" title="Volver a 100%">⤾</button>
        </span>
        {#if executingPath}
          <span class="exec-badge">🟢 Ejecutando… figura iluminada en verde</span>
        {/if}
      </div>
      {#if renderData}
        {#if isDragging}
          <div class="drop-hint">👇 Suelta sobre una zona azul para colocar el componente justo ahí (también dentro de Sí/No o Mientras)</div>
        {/if}
        <svg class="dfd-canvas" viewBox="0 0 {renderData.width} {renderData.height}" style="width: {Math.round(renderData.width * zoom)}px; max-width: none;" onclick={handleShapeClick} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleShapeClick(e); }} role="img" aria-label="Diagrama de flujo del algoritmo">
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
          <h3>👋 ¡Empieza tu primer algoritmo!</h3>
          <p>1) Pulsa <strong>🆕 Crear lienzo</strong> &nbsp; 2) Arrastra 📥 Lectura &nbsp; 3) Agrega 📤 Salida &nbsp; 4) Pulsa ▶ Ejecutar</p>
          <p class="code-hint">O elige un Problema 1-16 arriba para ver un ejemplo resuelto.</p>
          <button class="btn btn-primary" onclick={handleNew}>🆕 Crear lienzo vacío</button>
          {#if parseErrorMsg}<p class="error-text">{parseErrorMsg}</p>{/if}
        </div>
      {/if}
    </div>

    {#if selectedNode}
      <aside class="props-panel" aria-label="Propiedades del componente seleccionado">
        <div class="props-header">
          <strong>
            {#if selectedNode.type === 'input'}📥 Lectura — pedir dato
            {:else if selectedNode.type === 'output'}📤 Salida — mostrar resultado
            {:else if selectedNode.type === 'assignment'}⚙️ Asignación — calcular
            {:else if selectedNode.type === 'decision'}🔀 Decisión — pregunta Sí/No
            {:else if selectedNode.type === 'while'}🔁 Mientras — repetir
            {:else}🧩 Componente{/if}
          </strong>
          <button class="icon-btn" onclick={() => selectedPath = null} aria-label="Cerrar propiedades">✕</button>
        </div>
        <p class="props-hint">✏️ Edita con palabras simples. El dibujo y el pseudocódigo 📖 se actualizan solos.</p>
        {#if selectedWarnings.length > 0}
          <div class="props-warnings" role="alert">
            {#each selectedWarnings as w}
              <div class="warn-line">⚠️ {w}</div>
            {/each}
          </div>
        {:else}
          <div class="props-ok">✅ ¡Bien! Este componente está completo.</div>
        {/if}

        {#if selectedNode.type === 'input'}
          <label class="props-label" for="prop-input-vars">1) ¿Qué variables quieres pedir? (separadas por coma)</label>
          <input id="prop-input-vars" class="props-input" value={(selectedNode.variables || []).join(', ')} onfocus={armEdit} oninput={(e) => { selectedNode.variables = e.currentTarget.value.split(',').map((v) => v.trim()).filter(Boolean); commitEdit(); }} placeholder="ej: n1, n2" />
          <p class="props-example">✍️ Escribe: <code>n1, n2</code> → el programa hará <code>Leer n1, n2</code> y preguntará los valores al ejecutar.</p>
        {:else if selectedNode.type === 'output'}
          <label class="props-label" for="prop-output-text">1) ¿Qué quieres mostrar en pantalla?</label>
          <input id="prop-output-text" class="props-input" value={selectedNode.text || ''} onfocus={armEdit} oninput={(e) => { selectedNode.text = e.currentTarget.value; commitEdit(); }} placeholder="ej: 'La suma es: ', suma" />
          <p class="props-example">✍️ Texto entre comillas simples + variables con coma. Ej: <code>'La suma es: ', suma</code></p>
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
          <p class="props-example">✍️ Variable a la izquierda, fórmula a la derecha. Genera <code>suma &lt;- n1+n2</code>. Puedes usar + - * / % y paréntesis.</p>
        {:else if selectedNode.type === 'decision'}
          <label class="props-label" for="prop-decision-cond">1) Escribe la pregunta (condición)</label>
          <input id="prop-decision-cond" class="props-input" value={selectedNode.condition || ''} onfocus={armEdit} oninput={(e) => { selectedNode.condition = e.currentTarget.value; commitEdit(); }} placeholder="ej: n1 > n2" />
          <p class="props-example">✍️ Ej: <code>n1 &gt; n2</code>, <code>nota &gt;= 3</code>. Si es verdad va a la <strong>izquierda (Sí)</strong>, si no a la <strong>derecha (No)</strong>. Arrastra componentes a cada rama con las zonas azules.</p>
        {:else if selectedNode.type === 'while'}
          <label class="props-label" for="prop-while-cond">1) ¿Cuándo debe repetirse?</label>
          <input id="prop-while-cond" class="props-input" value={selectedNode.condition || ''} onfocus={armEdit} oninput={(e) => { selectedNode.condition = e.currentTarget.value; commitEdit(); }} placeholder="ej: contador <= 5" />
          <p class="props-example">✍️ Ej: <code>contador &lt;= 5</code>. Todo lo que arrastres al cuerpo azul se repetirá. ¡No olvides aumentar el contador dentro o será infinito!</p>
        {/if}
        <div class="props-actions">
          <button class="mini-btn" onclick={() => handleMoveSelected(-1)} title="Subir dentro de su lista">↑ Subir</button>
          <button class="mini-btn" onclick={() => handleMoveSelected(1)} title="Bajar dentro de su lista">↓ Bajar</button>
          <button class="mini-btn" onclick={handleDuplicateSelected} title="Duplicar (Ctrl+D)">📋 Duplicar</button>
          <button class="mini-btn danger-btn" onclick={handleDeleteSelected} title="Eliminar (Supr)">🗑 Borrar</button>
        </div>
      </aside>
    {/if}
  </div>

  <!-- Bottom: Console + Variables -->
  <div class="bottom-panel">
    <div class="console">
      <div class="console-header">💻 4️⃣ Consola — pulsa ▶ Ejecutar o 🐢 Paso a paso para ver el resultado</div>
      <div class="console-body">
        {#each consoleOutput as line}
          <div class="console-line">{line}</div>
        {/each}
        {#if consoleOutput.length === 0}
          <div class="console-placeholder">Ejemplo: si tu algoritmo lee n1=5 y muestra la suma, aquí verás los mensajes. Prueba con 🐢 Paso a paso para ver cómo se ilumina cada figura.</div>
        {/if}
      </div>
    </div>
    <div class="variables-panel">
      <div class="variables-header">
        <span>🧮 Variables en vivo</span>
        <button class="icon-btn" onclick={() => showVariables = !showVariables} aria-label="Mostrar u ocultar variables">{showVariables ? '−' : '+'}</button>
      </div>
      {#if showVariables}
        <div class="variables-body">
          {#if Object.keys(liveVariables).length === 0}
            <div class="console-placeholder">Aquí aparecerán los valores mientras ejecutas 🐢 Paso a paso. Ej: n1=5, suma=10.</div>
          {:else}
            {#each Object.entries(liveVariables) as [k, v]}
              <div class="var-chip"><strong>{k}</strong> = {String(v)}</div>
            {/each}
          {/if}
          {#if executingPath}
            <div class="exec-hint">🟢 Iluminado en verde = paso actual</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

{#if showGuide}
  <div class="modal-overlay" role="dialog" aria-modal="true" aria-label="Guía del editor DFD">
    <div class="modal-content guide-modal">
      <h4>📘 Guía rápida — Editor DFD (5 minutos)</h4>
      <ol class="guide-list">
        <li><strong>1️⃣ Agrega:</strong> arrastra 📥 Lectura, ⚙️ Asignación y 📤 Salida al lienzo. Suelta en la zona azul.</li>
        <li><strong>2️⃣ Edita:</strong> haz clic en cada figura y escribe datos simples. Ej: Lectura <code>n1, n2</code>, Asignación <code>suma &lt;- n1+n2</code>, Salida <code>'La suma es: ', suma</code>.</li>
        <li><strong>3️⃣ Decide:</strong> 🔀 Decisión pregunta Sí (izquierda) / No (derecha). Ej: <code>n1 &gt; n2</code>. Arrastra pasos dentro de cada rama.</li>
        <li><strong>4️⃣ Repite:</strong> 🔁 Mientras repite su cuerpo. Ej: <code>contador &lt;= 5</code>. Recuerda aumentar el contador dentro.</li>
        <li><strong>5️⃣ Ejecuta:</strong> ▶ rápido o 🐢 paso a paso (ilumina en verde + muestra variables). Mira la consola 💻.</li>
        <li><strong>⌨️ Atajos:</strong> Ctrl+Z deshacer, Ctrl+Y rehacer, Supr borrar, Ctrl+D duplicar, Esc soltar.</li>
      </ol>
      <button class="btn btn-primary modal-btn" onclick={() => showGuide = false}>¡Entendido, a crear! 🚀</button>
    </div>
  </div>
{/if}

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

  .toolbar {
    background: white;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    z-index: 10;
    padding: 0.6rem 1rem;
  }

  .toolbar-row {
    display: flex;
    align-items: stretch;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .tool-group {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.4rem 0.6rem;
  }

  .group-label {
    font-size: 0.62rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #64748b;
    white-space: nowrap;
  }

  .group-exercise {
    flex: 0 1 auto;
    min-width: 0;
  }

  .group-run {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  .file-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 0.15rem 0.5rem;
  }

  .file-icon {
    font-size: 0.9rem;
  }

  .exercise-select {
    max-width: 190px;
    text-overflow: ellipsis;
  }

  .filename-input {
    border: none;
    border-radius: 6px;
    padding: 0.3rem 0.4rem;
    font-size: 0.85rem;
    width: 150px;
    background: transparent;
    transition: all 0.2s;
  }

  .filename-input:focus {
    background: white;
    outline: 1px solid #cbd5e1;
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
    min-height: 0;
  }

  .sidebar {
    width: 240px;
    flex-shrink: 0;
    background: white;
    border-right: 1px solid rgba(0,0,0,0.06);
    padding: 1.1rem 1rem;
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
    width: 270px;
    flex-shrink: 0;
    background: white;
    border-left: 1px solid rgba(0,0,0,0.06);
    padding: 1rem;
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
    flex: 1 1 auto;
    min-width: 0;
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
    margin: 0 auto;
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

  .back-btn { padding: 0.4rem 0.9rem; border-radius: 6px; border: 1px solid #e2e8f0; background: white; color: #334155; font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .back-btn:hover { background: #f1f5f9; }
  .btn-step { background: #16a34a; color: white; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
  .btn-step:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); }
  .btn-step:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-danger { background: #dc2626; color: white; }
  .btn-danger:hover { background: #b91c1c; }
  .error-banner { display: flex; align-items: center; gap: 0.75rem; background: #fef2f2; color: #991b1b; border-bottom: 1px solid #fecaca; padding: 0.6rem 1.5rem; font-size: 0.85rem; }
  .warn-banner { background: #fffbeb; color: #92400e; border-bottom: 1px solid #fde68a; padding: 0.6rem 1.5rem; font-size: 0.85rem; }
  .warn-banner code { background: #fef3c7; padding: 0.1rem 0.3rem; border-radius: 4px; }
  .canvas-toolbar { position: sticky; top: 0; z-index: 6; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; background: rgba(255,255,255,0.95); backdrop-filter: blur(4px); border-bottom: 1px solid #e2e8f0; padding: 0.5rem 0.9rem; }
  .toolbar-title { font-size: 0.8rem; font-weight: 700; color: #334155; }
  .zoom-group { display: flex; align-items: center; gap: 0.35rem; }
  .zoom-label { font-size: 0.75rem; font-weight: 700; color: #475569; min-width: 44px; text-align: center; }
  .exec-badge { font-size: 0.75rem; font-weight: 700; color: #15803d; background: #dcfce7; border: 1px solid #86efac; padding: 0.2rem 0.6rem; border-radius: 999px; }
  .branch-label { list-style: none; font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.3rem; }
  .step-item.executing { border-color: #22c55e; background: #f0fdf4; box-shadow: 0 0 0 2px #bbf7d0; }
  .props-warnings { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 0.6rem; margin-bottom: 0.6rem; }
  .warn-line { font-size: 0.78rem; color: #92400e; margin-bottom: 0.25rem; }
  .props-ok { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 0.78rem; font-weight: 600; border-radius: 8px; padding: 0.5rem 0.6rem; margin-bottom: 0.6rem; }
  .props-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-top: 1rem; }
  .danger-btn { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
  .danger-btn:hover:not(:disabled) { background: #fee2e2; }
  .bottom-panel { display: flex; gap: 0; border-top: 4px solid #3b82f6; background: #1e293b; height: 210px; }
  .bottom-panel .console { flex: 2; height: 100%; border-top: none; }
  .variables-panel { flex: 1; min-width: 240px; max-width: 360px; background: #0f172a; border-left: 1px solid #334155; display: flex; flex-direction: column; }
  .variables-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 1rem; color: #e2e8f0; font-size: 0.85rem; font-weight: 700; }
  .variables-body { flex: 1; overflow-y: auto; padding: 0.75rem 1rem; display: flex; flex-wrap: wrap; gap: 0.4rem; align-content: flex-start; }
  .var-chip { background: #1e293b; border: 1px solid #334155; color: #e2e8f0; font-size: 0.78rem; font-family: monospace; padding: 0.3rem 0.6rem; border-radius: 999px; }
  .var-chip strong { color: #93c5fd; }
  .exec-hint { width: 100%; font-size: 0.75rem; color: #86efac; margin-top: 0.4rem; }
  .error-text { color: #dc2626; font-size: 0.8rem; font-weight: 600; }
  .guide-modal { width: 460px; max-width: 92vw; }
  .guide-list { margin: 0; padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.86rem; color: #334155; line-height: 1.5; }
  .guide-list code { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.78rem; }
  .palette-item small { color: #64748b; font-weight: 400; font-size: 0.72rem; }
  @media (max-width: 1100px) {
    .sidebar { width: 220px; }
    .props-panel { width: 250px; }
    .bottom-panel { flex-direction: column; height: auto; }
    .variables-panel { max-width: none; }
    .toolbar-row { gap: 0.5rem; }
    .tool-group { flex: 1 1 100%; justify-content: flex-start; flex-wrap: wrap; }
    .exercise-select { max-width: none; flex: 1; }
  }
</style>
