<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let dfdContent = $state('');
  let currentFileName = $state('ejercicio.dfd');

  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    currentFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      dfdContent = (e.target?.result as string) || '';
    };
    reader.readAsText(file);
  }

  function handleSave() {
    const blob = new Blob([dfdContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>Editor DFD - Algoritmos</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/algoritmos')}>
    <span>←</span> Volver a Algoritmos
  </button>

  <div class="hero">
    <span class="hero-icon">💻</span>
    <h1>Editor DFD</h1>
    <p class="hero-desc">Carga, edita y guarda tus archivos de diagramas de flujo (.dfd)</p>
  </div>

  <div class="editor-container">
    <div class="toolbar">
      <div class="file-info">
        <span class="file-icon">📄</span>
        <input type="text" bind:value={currentFileName} class="filename-input" />
      </div>
      <div class="actions">
        <label class="btn btn-secondary">
          Cargar Archivo
          <input type="file" accept=".dfd,.txt" onchange={handleFileUpload} style="display: none;" />
        </label>
        <button class="btn btn-primary" onclick={handleSave}>
          Guardar / Descargar
        </button>
      </div>
    </div>
    
    <textarea 
      class="code-editor" 
      bind:value={dfdContent} 
      placeholder="El contenido de tu archivo DFD aparecerá aquí...&#10;&#10;También puedes escribir el código manualmente y descargarlo."
      spellcheck="false"
    ></textarea>
  </div>
</div>

<style>
  .page {
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 2rem;
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
    transition: border-color 0.2s ease, transform 0.15s ease;
  }

  .back-btn:hover {
    color: var(--color-text-primary);
    border-color: var(--color-accent);
    transform: translateX(-3px);
  }

  .hero {
    text-align: center;
    margin-bottom: 2rem;
  }

  .hero-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: var(--color-text-primary);
  }

  .hero-desc {
    font-size: 0.95rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .editor-container {
    background: #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    height: 65vh;
    min-height: 500px;
  }

  .toolbar {
    background: #2d2d2d;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #404040;
  }

  .file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .file-icon {
    font-size: 1.2rem;
  }

  .filename-input {
    background: transparent;
    border: 1px solid transparent;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    width: 200px;
    transition: all 0.2s;
  }

  .filename-input:focus, .filename-input:hover {
    border-color: #555;
    background: #333;
    outline: none;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    display: inline-block;
  }

  .btn-secondary {
    background: #444;
    color: #fff;
  }

  .btn-secondary:hover {
    background: #555;
  }

  .btn-primary {
    background: #3b82f6;
    color: #fff;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .code-editor {
    flex: 1;
    background: #1e1e1e;
    color: #d4d4d4;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 1.5rem;
    border: none;
    resize: none;
    width: 100%;
    outline: none;
  }
</style>
