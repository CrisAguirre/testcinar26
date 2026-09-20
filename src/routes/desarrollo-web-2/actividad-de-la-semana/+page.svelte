<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let activeClass = $state(1);
  let expandedExample = $state<string | null>(null);

  function toggleExample(id: string) {
    expandedExample = expandedExample === id ? null : id;
  }

  const classes = [
    {
      id: 1,
      number: 'Clase 1',
      title: 'Introducción a conceptos avanzados',
      hours: '2 horas',
      objective: 'Comprender el manejo avanzado de rutas en Svelte.js para construir aplicaciones dinámicas.',
      icon: '🗺️',
      color: '#3b82f6',
      concepts: [
        { term: 'File-based routing', desc: 'Cada carpeta dentro de src/routes/ se convierte automáticamente en una ruta de la aplicación.' },
        { term: 'Rutas anidadas', desc: 'Las subcarpetas crean rutas hijas, por ejemplo /desarrollo-web-2/actividad-de-la-semana.' },
        { term: '+page.svelte', desc: 'El archivo que define el contenido visual de cada ruta.' },
        { term: '+layout.svelte', desc: 'Permite compartir estructura (Header, Footer) entre todas las páginas hijas.' },
        { term: 'goto()', desc: 'Función de SvelteKit para navegar programáticamente entre rutas.' }
      ],
      codeExamples: [
        {
          id: 'routes-structure',
          title: '📁 Estructura de rutas del proyecto',
          description: 'Así se organizan las rutas en nuestro proyecto. Cada carpeta es una URL:',
          code: `src/routes/
├── +layout.svelte          → Layout global (Header + Footer)
├── +page.svelte            → Página de inicio (/)
├── login/
│   └── +page.svelte        → /login
├── desarrollo-web-2/
│   ├── +page.svelte        → /desarrollo-web-2
│   ├── actividad-de-la-semana/
│   │   └── +page.svelte    → /desarrollo-web-2/actividad-de-la-semana
│   ├── parcial-1/
│   │   └── +page.svelte    → /desarrollo-web-2/parcial-1
│   ├── parcial-2/
│   │   └── +page.svelte    → /desarrollo-web-2/parcial-2
│   └── notas/
│       └── +page.svelte    → /desarrollo-web-2/notas
├── algoritmos/
│   └── ...                 → Rutas de Algoritmos
└── admin/
    └── ...                 → Rutas administrativas`,
          file: 'src/routes/'
        },
        {
          id: 'goto-example',
          title: '🔀 Navegación programática con goto()',
          description: 'En Header.svelte y en cada página usamos goto() para navegar:',
          code: `// En Header.svelte — redirigir al cerrar sesión
import { goto } from '$app/navigation';

function handleLogout() {
  logout();
  goto('/login');  // ← Navega a /login
}

// En esta misma página — botón "Volver"
<button onclick={() => goto('/desarrollo-web-2')}>
  ← Volver a Desarrollo Web 2
</button>`,
          file: 'src/routes/Header.svelte → línea 9'
        },
        {
          id: 'layout-example',
          title: '🏗️ Layout compartido entre rutas',
          description: 'El +layout.svelte envuelve TODAS las páginas con Header y Footer:',
          code: `<!-- src/routes/+layout.svelte -->
\\x3Cscript\\x3E
  import Header from './Header.svelte';
  let { children } = $props();
\\x3C/script\\x3E

<div class="app">
  <Header />          <!-- ← Aparece en TODAS las páginas -->
  <main>
    {@render children()}  <!-- ← Aquí se renderiza cada +page.svelte -->
  </main>
  <footer>
    Cinar Sistemas 2026
  </footer>
</div>`,
          file: 'src/routes/+layout.svelte → líneas 1-41'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: E-commerce',
        description: 'Imagina una tienda en línea como Amazon. Usan enrutamiento basado en archivos o parámetros para manejar millones de productos. Cuando visitas /producto/123, el sistema usa una ruta dinámica (ej: /producto/[id]) para cargar el componente del producto y obtener la información de la base de datos usando el ID de la URL.',
        link: 'https://svelte.dev/docs/kit/routing'
      }
    },
    {
      id: 2,
      number: 'Clase 2',
      title: 'Profundización en componentes',
      hours: '2 horas',
      objective: 'Explorar características avanzadas de componentes en Svelte.js y su estructura modular.',
      icon: '🧩',
      color: '#8b5cf6',
      concepts: [
        { term: 'Componente', desc: 'Archivo .svelte reutilizable con su propio HTML, CSS y JavaScript encapsulado.' },
        { term: 'Estructura modular', desc: 'Separar la UI en piezas independientes que se pueden combinar como bloques LEGO.' },
        { term: 'Scoped CSS', desc: 'Los estilos de cada componente solo afectan a ese componente, no al resto de la app.' },
        { term: 'Encapsulación', desc: 'Cada componente maneja su propia lógica, estado y estilos de forma independiente.' },
        { term: '$lib/components/', desc: 'Carpeta del proyecto donde se almacenan los componentes reutilizables.' }
      ],
      codeExamples: [
        {
          id: 'components-structure',
          title: '📁 Componentes reutilizables del proyecto',
          description: 'Nuestro proyecto tiene estos componentes en $lib/components/:',
          code: `src/lib/components/
├── SubjectCard.svelte   → Tarjeta de materia (usada en la página de inicio)
└── ExamCard.svelte      → Tarjeta de examen (usada en páginas de parciales)

También hay componentes de página como:
src/routes/Header.svelte → Barra de navegación global`,
          file: 'src/lib/components/'
        },
        {
          id: 'subjectcard-structure',
          title: '🧩 Anatomía de SubjectCard.svelte',
          description: 'Un componente tiene 3 secciones: script (lógica), markup (HTML) y style (CSS):',
          code: `<!-- SubjectCard.svelte — Estructura de un componente -->

\\x3Cscript lang="ts"\\x3E
  // ① LÓGICA: Variables, imports, funciones
  import { goto } from '$app/navigation';
  let { icon, title, description, href, color } = $props();
\\x3C/script\\x3E

<!-- ② MARKUP: La estructura HTML -->
<div class="card" use:tilt>
  <span class="card-icon">{icon}</span>
  <h3>{title}</h3>
  <p>{description}</p>
</div>

<style>
  /* ③ ESTILOS: CSS encapsulado (scoped) */
  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    /* Estos estilos SOLO aplican a este componente */
  }
</style>`,
          file: 'src/lib/components/SubjectCard.svelte → líneas 1-78'
        },
        {
          id: 'component-usage',
          title: '🔌 Usando componentes en otras páginas',
          description: 'En +page.svelte (inicio), importamos y usamos SubjectCard así:',
          code: `<!-- src/routes/+page.svelte — Página de inicio -->
\\x3Cscript\\x3E
  // Importar el componente
  import SubjectCard from '$lib/components/SubjectCard.svelte';
\\x3C/script\\x3E

<!-- Usar el componente (como una etiqueta HTML personalizada) -->
<SubjectCard
  icon="🌐"
  title="Desarrollo Web 2"
  description="Segundo nivel de Svelte JS..."
  href="/desarrollo-web-2"
  color="red"
/>

<!-- El mismo componente, con datos diferentes -->
<SubjectCard
  icon="🧮"
  title="Algoritmos"
  description="Problemas de lógica..."
  href="/algoritmos"
  color="green"
/>`,
          file: 'src/routes/+page.svelte → líneas 277-308'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Redes Sociales',
        description: 'En aplicaciones como Twitter o Instagram, cada publicación ("Tweet" o "Post") no se escribe desde cero en el código HTML de la página. En su lugar, los ingenieros construyen un único componente <Tweet /> con su lógica para likes, retweets y comentarios. Ese componente se reutiliza miles de veces en tu feed de inicio, inyectándole datos distintos.',
        link: 'https://svelte.dev/docs/svelte/components'
      }
    },
    {
      id: 3,
      number: 'Clase 3',
      title: 'Propiedades en componentes',
      hours: '2 horas',
      objective: 'Aplicar el uso de props para el paso de datos entre componentes en Svelte.js.',
      icon: '📦',
      color: '#10b981',
      concepts: [
        { term: '$props()', desc: 'Función de Svelte 5 que permite a un componente recibir datos desde su padre.' },
        { term: 'Props tipados', desc: 'Se pueden definir los tipos de datos esperados usando TypeScript para mayor seguridad.' },
        { term: 'Valores por defecto', desc: 'Las props pueden tener un valor predeterminado si el padre no las envía.' },
        { term: 'Flujo unidireccional', desc: 'Los datos fluyen del componente padre → hacia el componente hijo.' },
        { term: 'Desestructuración', desc: 'Se extraen las props individuales del objeto para usarlas directamente.' }
      ],
      codeExamples: [
        {
          id: 'props-definition',
          title: '📦 Definición de props en SubjectCard',
          description: 'SubjectCard.svelte define las props que espera recibir:',
          code: `// SubjectCard.svelte — Definición de props con tipos y valores por defecto
let {
  icon,                    // Obligatorio: emoji de la materia
  title,                   // Obligatorio: nombre de la materia
  description,             // Obligatorio: texto descriptivo
  href = '/',              // Opcional: ruta destino (default: '/')
  boldTitle = false,       // Opcional: título en negrita (default: false)
  noButton = false,        // Opcional: sin botón (default: false)
  color = 'blue',          // Opcional: esquema de color (default: 'blue')
  customLogo = null,       // Opcional: logo personalizado (default: null)
  disabled = false         // Opcional: deshabilitada (default: false)
}: {
  icon: string;
  title: string;
  description: string;
  href?: string;           // El ? indica que es opcional
  boldTitle?: boolean;
  noButton?: boolean;
  color?: 'blue' | 'red' | 'green' | 'purple';
  customLogo?: string | null;
  disabled?: boolean;
} = $props();              // ← $props() recibe todo del padre`,
          file: 'src/lib/components/SubjectCard.svelte → líneas 5-25'
        },
        {
          id: 'props-passing',
          title: '📤 Paso de props desde el padre',
          description: 'La página de inicio pasa diferentes datos a cada SubjectCard:',
          code: `<!-- src/routes/+page.svelte — Cada materia pasa sus propios datos -->

<!-- DW1: color azul, sin logo personalizado -->
<SubjectCard
  icon="📚"
  title="Desarrollo Web 1 - Svelte JS"
  description="Curso de fundamentos de Svelte JS..."
  href="/desarrollo-web-1"
  boldTitle
  noButton
  color="blue"
/>

<!-- Algoritmos: color verde, CON logo personalizado -->
<SubjectCard
  icon="🧮"
  title="Algoritmos"
  description="Problemas de lógica..."
  href="/algoritmos"
  color="green"
  customLogo="/algo.png"
/>

<!-- Admin: color púrpura, CON logo personalizado -->
<SubjectCard
  icon="⚙️"
  title="Funciones Administrativas"
  href="/admin"
  color="purple"
  customLogo="/logo.png"
/>`,
          file: 'src/routes/+page.svelte → líneas 277-321'
        },
        {
          id: 'props-examcard',
          title: '🎯 Props en ExamCard (otro ejemplo)',
          description: 'ExamCard.svelte es más simple, pero usa el mismo patrón de props:',
          code: `// ExamCard.svelte — Props simples con valor por defecto
let {
  href,             // Obligatorio: URL del examen
  icon,             // Obligatorio: emoji del examen
  label,            // Obligatorio: texto del botón
  delay = 0         // Opcional: delay de animación (default: 0)
}: {
  href: string;
  icon: string;
  label: string;
  delay?: number;
} = $props();

// USO en una página de parcial:
<ExamCard href="/desarrollo-web-2/parcial-1" icon="📝" label="Parcial 1" delay={0.1} />
<ExamCard href="/desarrollo-web-2/parcial-2" icon="📝" label="Parcial 2" delay={0.2} />`,
          file: 'src/lib/components/ExamCard.svelte → línea 4'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Tarjetas de YouTube',
        description: 'En YouTube, cada video que ves en la portada es un componente. Pero para que cada uno muestre una miniatura, título y canal diferente, YouTube utiliza Props. El componente padre (la página de inicio) le pasa a la <VideoCard /> las propiedades: { thumbnail="gatos.jpg", title="Videos graciosos", views="1M" }. Así, con un solo componente se muestran infinitos videos distintos.',
        link: 'https://svelte.dev/docs/svelte/$props'
      }
    }
  ];

  const currentClass = $derived(classes.find(c => c.id === activeClass)!);
</script>

<svelte:head>
  <title>Actividad de la semana - Desarrollo Web 2</title>
</svelte:head>

<div class="page">
  <button class="back-btn" onclick={() => goto('/desarrollo-web-2')}>
    <span>←</span> Volver a Desarrollo Web 2
  </button>

  <div class="hero">
    <span class="hero-icon">🔬</span>
    <h1>Actividad de la semana</h1>
    <p class="hero-desc">Temáticas evidenciadas en este proyecto</p>
  </div>

  <div class="info-banner">
    <span class="info-banner-icon">💡</span>
    <div>
      <strong>Aprende desde el código real.</strong> Estas 3 temáticas no son teoría abstracta: están
      implementadas en esta misma plataforma que estás usando. Cada ejemplo apunta a archivos reales
      del proyecto.
    </div>
  </div>

  <!-- Class selector tabs -->
  <div class="class-tabs">
    {#each classes as cls}
      <button
        class="class-tab"
        class:active={activeClass === cls.id}
        style="--tab-color: {cls.color}"
        onclick={() => { activeClass = cls.id; expandedExample = null; }}
      >
        <span class="tab-icon">{cls.icon}</span>
        <span class="tab-info">
          <span class="tab-title">{cls.title}</span>
        </span>
      </button>
    {/each}
  </div>

  <!-- Active class content -->
  {#key currentClass.id}
  <div class="class-content" style="--accent: {currentClass.color}">
    <!-- Objective -->
    <div class="objective-card">
      <div class="objective-header">
        <span class="objective-icon">{currentClass.icon}</span>
        <div>
          <span class="objective-label">🎯 Objetivo de la clase</span>
          <h2>{currentClass.title}</h2>
        </div>
      </div>
      <p class="objective-text">{currentClass.objective}</p>
    </div>

    <!-- Key concepts -->
    <div class="concepts-section">
      <h3 class="section-title">Conceptos clave</h3>
      <div class="concepts-grid">
        {#each currentClass.concepts as concept, i}
          <div class="concept-chip" style="--delay: {i * 0.06}s">
            <span class="concept-term">{concept.term}</span>
            <span class="concept-desc">{concept.desc}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Code examples -->
    <div class="examples-section">
      <h3 class="section-title">📂 Evidencia en el código fuente</h3>
      <p class="section-desc">
        Haz clic en cada ejemplo para ver exactamente dónde se aplica este concepto en nuestro proyecto:
      </p>

      {#each currentClass.codeExamples as example}
        <div class="example-card" class:expanded={expandedExample === example.id}>
          <button class="example-header" onclick={() => toggleExample(example.id)}>
            <span class="example-title">{example.title}</span>
            <span class="example-toggle">{expandedExample === example.id ? '▲' : '▼'}</span>
          </button>

          {#if expandedExample === example.id}
            <div class="example-body">
              <p class="example-desc">{example.description}</p>
              <div class="code-block">
                <div class="code-file">
                  <span class="file-icon">📄</span>
                  <span>{example.file}</span>
                </div>
                <pre><code>{example.code}</code></pre>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- External Example -->
    {#if currentClass.externalExample}
      <div class="external-example-card">
        <div class="external-header">
          <h3>{currentClass.externalExample.title}</h3>
        </div>
        <p>{currentClass.externalExample.description}</p>
        {#if currentClass.externalExample.link}
          <a href={currentClass.externalExample.link} target="_blank" rel="noopener noreferrer" class="external-link">
            Saber más sobre este concepto →
          </a>
        {/if}
      </div>
    {/if}

    <!-- Progress indicator -->
    <div class="progress-bar">
      {#each classes as cls}
        <div
          class="progress-dot"
          class:active={cls.id === activeClass}
          class:completed={cls.id < activeClass}
          style="--dot-color: {cls.color}"
        ></div>
      {/each}
    </div>
  </div>
  {/key}
</div>

<style>
  .page {
    max-width: 740px;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 3rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: transparent;
    border: none;
    color: #64748b;
    padding: 0;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    margin-bottom: 2rem;
    transition: color 0.2s ease;
  }

  .back-btn:hover {
    color: #0f172a;
  }

  /* Hero */
  .hero {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .hero-icon {
    font-size: 2.8rem;
    display: block;
    margin-bottom: 0.5rem;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  h1 {
    font-size: 1.65rem;
    letter-spacing: -0.02em;
    margin: 0 0 0.4rem;
    color: #0f172a;
    font-weight: 700;
  }

  .hero-desc {
    font-size: 0.95rem;
    color: #64748b;
    margin: 0;
  }

  /* Info banner */
  .info-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: linear-gradient(135deg, #eff6ff, #f0fdf4);
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #1e3a5f;
  }

  .info-banner-icon {
    font-size: 1.4rem;
    flex-shrink: 0;
    margin-top: 0.1rem;
  }

  /* Class tabs */
  .class-tabs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .class-tab {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    width: 100%;
    padding: 0.85rem 1.15rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: left;
  }

  .class-tab:hover {
    border-color: var(--tab-color);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .class-tab.active {
    border-color: var(--tab-color);
    background: color-mix(in srgb, var(--tab-color) 5%, white);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--tab-color) 15%, transparent);
  }

  .tab-icon {
    font-size: 1.6rem;
    flex-shrink: 0;
  }

  .tab-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tab-number {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
  }

  .class-tab.active .tab-number {
    color: var(--tab-color);
  }

  .tab-title {
    font-size: 0.92rem;
    font-weight: 600;
    color: #1e293b;
  }

  .tab-hours {
    font-size: 0.75rem;
    font-weight: 600;
    color: #94a3b8;
    background: #f1f5f9;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .class-tab.active .tab-hours {
    background: color-mix(in srgb, var(--tab-color) 12%, white);
    color: var(--tab-color);
  }

  /* Class content */
  .class-content {
    animation: slideIn 0.35s ease-out;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Objective card */
  .objective-card {
    background: white;
    border-radius: 16px;
    padding: 1.75rem;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.025);
    border: 1px solid rgba(0,0,0,0.04);
    margin-bottom: 1.75rem;
    border-top: 3px solid var(--accent);
  }

  .objective-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .objective-icon {
    font-size: 2rem;
    flex-shrink: 0;
    line-height: 1;
  }

  .objective-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent);
    margin-bottom: 0.3rem;
  }

  .objective-card h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #0f172a;
    font-weight: 600;
    line-height: 1.3;
  }

  .objective-text {
    font-size: 0.92rem;
    line-height: 1.6;
    color: #475569;
    margin: 0;
    padding-left: 3rem;
  }

  /* Concepts */
  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 1rem;
  }

  .section-desc {
    font-size: 0.88rem;
    color: #64748b;
    margin: 0 0 1rem;
    line-height: 1.5;
  }

  .concepts-section {
    margin-bottom: 2rem;
  }

  .concepts-grid {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .concept-chip {
    display: flex;
    gap: 0.75rem;
    align-items: baseline;
    padding: 0.65rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    animation: chipIn 0.3s ease-out both;
    animation-delay: var(--delay);
    transition: border-color 0.2s ease;
  }

  .concept-chip:hover {
    border-color: var(--accent);
  }

  @keyframes chipIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .concept-term {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, white);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    white-space: nowrap;
    flex-shrink: 0;
    font-family: 'Fira Mono', 'Cascadia Code', monospace;
  }

  .concept-desc {
    font-size: 0.85rem;
    color: #475569;
    line-height: 1.4;
  }

  /* Examples */
  .examples-section {
    margin-bottom: 2rem;
  }

  .example-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 0.6rem;
    overflow: hidden;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .example-card:hover {
    border-color: #cbd5e1;
  }

  .example-card.expanded {
    border-color: var(--accent);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--accent) 10%, transparent);
  }

  .example-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.9rem 1.15rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
    transition: background 0.15s ease;
  }

  .example-header:hover {
    background: #f8fafc;
  }

  .example-toggle {
    font-size: 0.7rem;
    color: #94a3b8;
    transition: transform 0.25s ease;
  }

  .example-body {
    padding: 0 1.15rem 1.15rem;
    animation: expandIn 0.25s ease-out;
  }

  @keyframes expandIn {
    from { opacity: 0; max-height: 0; }
    to { opacity: 1; max-height: 800px; }
  }

  .example-desc {
    font-size: 0.87rem;
    color: #64748b;
    margin: 0 0 0.85rem;
    line-height: 1.5;
  }

  .code-block {
    background: #0f172a;
    border-radius: 10px;
    overflow: hidden;
  }

  .code-file {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    background: #1e293b;
    font-size: 0.72rem;
    font-weight: 600;
    color: #94a3b8;
    border-bottom: 1px solid #334155;
    font-family: 'Fira Mono', 'Cascadia Code', monospace;
  }

  .file-icon {
    font-size: 0.85rem;
  }

  pre {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
  }

  code {
    font-family: 'Fira Mono', 'Cascadia Code', 'Courier New', monospace;
    font-size: 0.78rem;
    line-height: 1.6;
    color: #e2e8f0;
    white-space: pre;
  }

  /* Progress */
  .progress-bar {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 2rem;
  }

  .progress-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #e2e8f0;
    transition: all 0.3s ease;
  }

  .progress-dot.active {
    background: var(--dot-color);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--dot-color) 25%, transparent);
    transform: scale(1.2);
  }

  .progress-dot.completed {
    background: var(--dot-color);
    opacity: 0.5;
  }

  /* Responsive */
  @media (max-width: 600px) {
    h1 {
      font-size: 1.35rem;
    }

    .objective-text {
      padding-left: 0;
    }

    .objective-header {
      flex-direction: column;
      gap: 0.5rem;
    }

    .class-tab {
      padding: 0.7rem 0.9rem;
    }

    .tab-title {
      font-size: 0.82rem;
    }

    code {
      font-size: 0.7rem;
    }
  }
  .external-example-card {
    background: linear-gradient(to right, #f8fafc, #f1f5f9);
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    padding: 1.5rem;
    margin-top: 2rem;
    position: relative;
    overflow: hidden;
  }

  .external-example-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--accent);
  }

  .external-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #0f172a;
  }

  .external-example-card p {
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 0 1rem 0;
  }

  .external-link {
    display: inline-block;
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    background: white;
    border: 1px solid #cbd5e1;
    transition: all 0.2s ease;
  }

  .external-link:hover {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }
</style>
