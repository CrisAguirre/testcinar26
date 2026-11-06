<script lang="ts">
  import { isAuthenticated } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  $effect(() => {
    if (!$isAuthenticated) goto('/login');
  });

  let activeClass = $state(1);
  let expandedExample = $state<string | null>(null);
  let selectedPeriod = $state<'all' | 'p1' | 'p2'>('all');

  function toggleExample(id: string) {
    expandedExample = expandedExample === id ? null : id;
  }

  function setPeriodFilter(period: 'all' | 'p1' | 'p2') {
    selectedPeriod = period;
    expandedExample = null;
    if (period === 'p1' && activeClass > 5) {
      activeClass = 1;
    } else if (period === 'p2' && activeClass <= 5) {
      activeClass = 6;
    }
  }

  const classes = [
    {
      id: 1,
      number: 'Clase 1',
      period: '1er Parcial',
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
      period: '1er Parcial',
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
      period: '1er Parcial',
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
    },
    {
      id: 4,
      number: 'Clase 4',
      period: '1er Parcial',
      title: 'Integración de diseño con CSS puro y variables',
      hours: '2 horas',
      objective: 'Adaptar interfaces usando CSS puro (Vanilla CSS) y variables globales en un entorno Svelte.',
      icon: '🎨',
      color: '#ec4899',
      concepts: [
        { term: 'Variables CSS (Custom Properties)', desc: 'Permiten definir colores, fuentes y medidas de forma global en :root para mantener coherencia en toda la app.' },
        { term: 'Scoped CSS en Svelte', desc: 'Svelte encapsula automáticamente los estilos por componente, pero permite estilos globales con :global() o archivos .css externos.' },
        { term: 'Animaciones', desc: 'Uso de librerías como svelte-motion o transiciones nativas de Svelte para interactividad fluida.' },
        { term: 'Flexbox & Grid', desc: 'Uso de CSS moderno para crear layouts responsivos sin necesidad de librerías pesadas (ej. Bootstrap).' }
      ],
      codeExamples: [
        {
          id: 'css-variables',
          title: '🎨 Variables CSS Globales',
          description: 'En lugar de Bootstrap, este proyecto usa CSS nativo con variables centralizadas (como en app.css):',
          code: `/* Ejemplo de Sistema de diseño personalizado */
:root {
  /* Paleta de colores principal */
  --color-bg-1: #0f172a;
  --color-surface: #1e293b;
  --color-accent: #3b82f6;
  --color-text-primary: #f8fafc;
  
  /* Radios de borde y sombras uniformes */
  --radius-lg: 16px;
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

body {
  background-color: var(--color-bg-1);
  color: var(--color-text-primary);
  font-family: 'Inter', sans-serif;
}`,
          file: 'CSS Base (Variables)'
        },
        {
          id: 'css-scoped',
          title: '👗 Estilos encapsulados por componente',
          description: 'Cada componente usa esas variables globales sin afectar a otros componentes:',
          code: `<!-- En cualquier componente .svelte -->
\\x3Cstyle\\x3E
  .card {
    /* Uso de variables globales */
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    transition: transform 0.2s;
  }
  
  .card:hover {
    transform: translateY(-5px);
    /* Color dinámico desde variable global */
    border-color: var(--color-accent); 
  }
\\x3C/style\\x3E`,
          file: 'Componentes Varios (Estilos encapsulados)'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Spotify Web',
        description: 'Plataformas como Spotify utilizan un sistema de diseño propio basado en Variables CSS (Custom Properties) para soportar temas (claro/oscuro) de forma nativa. Al cambiar una variable en la raíz, toda la interfaz cambia de color instantáneamente sin necesidad de cargar nuevas hojas de estilo pesadas como Bootstrap.',
        link: 'https://developer.mozilla.org/es/docs/Web/CSS/Using_CSS_custom_properties'
      }
    },
    {
      id: 5,
      number: 'Clase 5',
      period: '1er Parcial',
      title: 'Buenas prácticas en organización',
      hours: '2 horas',
      objective: 'Identificar e implementar patrones de arquitectura limpia y estructura de directorios en SvelteKit.',
      icon: '🏗️',
      color: '#f59e0b',
      concepts: [
        { term: 'Alias de rutas ($lib)', desc: 'SvelteKit provee el alias $lib para evitar importaciones relativas confusas.' },
        { term: 'Separación de responsabilidades', desc: 'Mantener la lógica (ts/js), la vista (html) y el estilo (css) estructurados, delegando datos a stores.' },
        { term: 'Archivos de constantes/datos', desc: 'Extraer datos estáticos (como menús o listas) a archivos independientes en $lib/data/.' },
        { term: 'Nombres descriptivos', desc: 'Nombrar componentes con PascalCase (SubjectCard.svelte) y funciones con camelCase.' }
      ],
      codeExamples: [
        {
          id: 'alias-lib',
          title: '🔗 Uso del alias $lib',
          description: 'Evitar el "infierno de los puntos" usando $lib para importar desde cualquier nivel (se ve en todos nuestros componentes):',
          code: `// ❌ Mala práctica: Importación relativa frágil (se rompe si mueves el archivo)
import { isAuthenticated } from '../../../../stores/auth';
import Header from '../../components/Header.svelte';

// ✅ Buena práctica: Uso de $lib en este proyecto
import { isAuthenticated } from '$lib/stores/auth';
import Header from '$lib/components/Header.svelte';

// $lib siempre apunta a la carpeta src/lib/ sin importar dónde estés`,
          file: 'Archivos .svelte'
        },
        {
          id: 'data-separation',
          title: '🗂️ Separación de datos y vistas',
          description: 'En lugar de poner líneas de datos estáticos en el componente, se extraen a $lib/data/:',
          code: `/* src/lib/data/enlacesData.ts — Solo Datos puros (TypeScript) */
export const categories = [
  { title: 'Documentación', links: [...] },
  { title: 'Herramientas', links: [...] }
];

<!-- src/routes/.../enlaces-de-consulta/+page.svelte — Solo Vista -->
\\x3Cscript\\x3E
  // El componente queda limpio, solo se dedica a iterar y renderizar
  import { categories } from '$lib/data/enlacesData';
\\x3C/script\\x3E

{#each categories as cat}
  <h2>{cat.title}</h2>
{/each}`,
          file: 'src/lib/data/enlacesData.ts'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Airbnb',
        description: 'Equipos grandes como Airbnb escalan sus aplicaciones separando estrictamente los "Componentes Tontos" (UI pura como un botón, sin lógica de negocio) de los "Contenedores" (Lógica). Además, extraen toda la configuración estática a archivos independientes. Esto permite que el equipo de diseño actualice la UI sin miedo a romper la lógica de pagos o reservas.',
        link: 'https://es.reactjs.org/docs/faq-structure.html'
      }
    },
    {
      id: 6,
      number: 'Clase 6',
      period: '2do Parcial',
      title: 'Persistencia de datos',
      hours: '2 horas',
      objective: 'Implementar la persistencia de datos (como borradores, respuestas y credenciales) utilizando memoria reactiva, almacenamiento local (localStorage) y resiliencia offline en Svelte.',
      icon: '💾',
      color: '#0284c7',
      concepts: [
        { term: 'localStorage', desc: 'API web nativa para almacenar pares clave-valor de forma persistente en el navegador entre recargas y sesiones.' },
        { term: 'JSON.stringify / parse', desc: 'Funciones para serializar estructuras de datos complejas (objetos, arrays) en strings y deserializarlas al recuperarlas.' },
        { term: 'Autoguardado resiliente', desc: 'Patrón de persistencia periódica o ante eventos (input, pagehide) que previene la pérdida de avance en formularios extensos.' },
        { term: 'Cola offline (Sync Queue)', desc: 'Estrategia para retener envíos pendientes localmente ante cortes de red y sincronizarlos automáticamente al reconectar.' },
        { term: 'Manejo defensivo de cuotas', desc: 'Protección mediante try/catch para evitar bloqueos por almacenamiento saturado o modos de navegación privada estrictos.' }
      ],
      codeExamples: [
        {
          id: 'auth-localstorage',
          title: '🔑 Persistencia de sesión con localStorage',
          description: 'En src/lib/stores/auth.js guardamos el token JWT y los datos del usuario para restaurar la sesión automáticamente al recargar:',
          code: `// src/lib/stores/auth.js — Restauración y guardado persistente
import { writable } from 'svelte/store';

// 1. Leer token almacenado previamente en el navegador
const storedToken = typeof localStorage !== 'undefined' 
  ? localStorage.getItem('token') 
  : null;

export const token = writable(storedToken);

// 2. Función de login: guarda en disco local y actualiza los stores
export function login(userData, tokenValue) {
  localStorage.setItem('token', tokenValue);
  localStorage.setItem('user', JSON.stringify(userData));
  token.set(tokenValue);
  currentUser.set(userData);
}

// 3. Función de logout: elimina del almacenamiento local
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  token.set(null);
  currentUser.set(null);
}`,
          file: 'src/lib/stores/auth.js → líneas 1-35'
        },
        {
          id: 'exam-autosave-sync',
          title: '📝 Autoguardado local y cola de sincronización',
          description: 'En los parciales de nuestra plataforma, cada respuesta se persiste localmente para asegurar que no se pierdan datos por fallos de red:',
          code: `// src/lib/exam.js — Persistencia local de respuestas y cola offline
export function saveAnswersLocal(examId, answers) {
  try {
    const payload = JSON.stringify({
      answers,
      timestamp: new Date().toISOString()
    });
    // Guarda el borrador bajo una clave única por examen
    localStorage.setItem(\`dw2_p1_saved_answers_\${examId}\`, payload);
  } catch (err) {
    console.warn('Almacenamiento local no disponible:', err);
  }
}

// Encolar envío si el servidor no responde
export function enqueueOfflineSubmission(submission) {
  const queue = JSON.parse(localStorage.getItem('dw2_sync_queue') || '[]');
  queue.push({ ...submission, queuedAt: Date.now() });
  localStorage.setItem('dw2_sync_queue', JSON.stringify(queue));
}`,
          file: 'src/lib/exam.js → Persistencia y resiliencia offline'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: MercadoLibre / Carritos de Compra',
        description: 'Cuando agregas productos al carrito en MercadoLibre o Amazon sin haber iniciado sesión, los artículos no desaparecen al refrescar la página. La aplicación los guarda en el localStorage del navegador. Cuando finalmente inicias sesión, el sistema lee ese almacenamiento local y fusiona los artículos con tu cuenta en la nube.',
        link: 'https://developer.mozilla.org/es/docs/Web/API/Window/localStorage'
      }
    },
    {
      id: 7,
      number: 'Clase 7',
      period: '2do Parcial',
      title: 'Interactividad avanzada',
      hours: '2 horas',
      objective: 'Diseñar componentes de inputs personalizados reutilizables y gestionar su comportamiento con vinculación bidireccional (two-way binding) y validación en Svelte.',
      icon: '🎛️',
      color: '#059669',
      concepts: [
        { term: 'Two-way binding (bind:value)', desc: 'Directiva que mantiene sincronizados automáticamente el estado de la variable de JavaScript y el valor en el DOM.' },
        { term: 'Inputs como componentes', desc: 'Encapsulación de etiquetas label, estilos, estados de error y accesibilidad dentro de un archivo .svelte independiente.' },
        { term: 'Runa $bindable()', desc: 'Característica de Svelte 5 que permite declarar que una prop recibida por un componente hijo puede enlazarse bidireccionalmente por el padre.' },
        { term: 'Directivas bind múltiples', desc: 'Uso de bind:checked para casillas booleanas, bind:group para selectores de opción (radio) y bind:files para archivos.' },
        { term: 'Validación reactiva', desc: 'Comprobación instantánea con $derived del estado del formulario para retroalimentar al usuario antes del envío.' }
      ],
      codeExamples: [
        {
          id: 'login-bind-example',
          title: '📋 Formulario interactivo con bind:value reactivo',
          description: 'En src/routes/login/+page.svelte sincronizamos los inputs con el estado reactivo del componente para validar en vivo:',
          code: `<!-- src/routes/login/+page.svelte -->
\\x3Cscript lang="ts"\\x3E
  let username = $state('');
  let password = $state('');
  let loading = $state(false);

  // Validación reactiva automática con $derived
  let isValid = $derived(username.trim().length >= 3 && password.length >= 6);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!isValid || loading) return;
    loading = true;
    // Proceso de autenticación con authApi...
  }
\\x3C/script\\x3E

<form onsubmit={handleSubmit}>
  <div class="field">
    <label for="usr">Usuario o Correo</label>
    <input id="usr" type="text" bind:value={username} placeholder="ej. usuario@cinar.edu.co" />
  </div>

  <div class="field">
    <label for="pwd">Contraseña</label>
    <input id="pwd" type="password" bind:value={password} />
  </div>

  <button type="submit" disabled={!isValid || loading}>
    {loading ? 'Ingresando...' : 'Iniciar Sesión'}
  </button>
</form>`,
          file: 'src/routes/login/+page.svelte → líneas 40-75'
        },
        {
          id: 'custom-input-bindable',
          title: '🎛️ Componente CustomInput modular con $bindable()',
          description: 'En Svelte 5, creamos inputs reutilizables que propagan automáticamente los cambios al componente padre mediante $bindable():',
          code: `<!-- src/lib/components/CustomInput.svelte -->
\\x3Cscript lang="ts"\\x3E
  let {
    label,
    value = $bindable(''),      // ← Permite bind:value en el componente padre
    type = 'text',
    placeholder = '',
    error = ''
  }: {
    label: string;
    value?: string;
    type?: string;
    placeholder?: string;
    error?: string;
  } = $props();
\\x3C/script\\x3E

<div class="custom-field">
  <label class="field-label">{label}</label>
  <input
    {type}
    {placeholder}
    bind:value={value}
    class:error-border={!!error}
  />
  {#if error}
    <span class="field-error">{error}</span>
  {/if}
</div>

<!-- USO EN CUALQUIER PÁGINA PADRE: -->
<!-- <CustomInput label="Título del Post" bind:value={postTitle} error={titleError} /> -->`,
          file: 'src/lib/components/CustomInput.svelte (Patrón Modular)'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Stripe Checkout / Formularios Bancarios',
        description: 'Las plataformas de pago como Stripe o Mercado Pago nunca usan inputs HTML crudos. Crean componentes de entrada altamente especializados (como <CardNumberInput />, <ExpiryInput /> y <CvcInput />). Cada componente formatea los números con espacios, valida el algoritmo de tarjeta en vivo y propaga el valor limpio hacia el formulario principal de checkout.',
        link: 'https://svelte.dev/docs/svelte/bind'
      }
    },
    {
      id: 8,
      number: 'Clase 8',
      period: '2do Parcial',
      title: 'Comunicación entre componentes',
      hours: '2 horas',
      objective: 'Implementar comunicación desacoplada y emisión de eventos entre componentes hijos y padres utilizando createEventDispatcher, eventos personalizados y callback props en Svelte.',
      icon: '📡',
      color: '#6366f1',
      concepts: [
        { term: 'createEventDispatcher', desc: 'Función de Svelte para crear un despachador que emite eventos personalizados hacia el componente padre.' },
        { term: 'event.detail', desc: 'Propiedad del objeto CustomEvent que transporta los datos o parámetros enviados por el componente hijo.' },
        { term: 'Directiva on:[evento]', desc: 'Sintaxis en el componente padre para escuchar y responder a un evento despachado por el hijo.' },
        { term: 'Callback Props (Svelte 5)', desc: 'Paso de funciones manejadoras como propiedades (ej. onSelect, onAction), el estándar moderno más limpio y tipado.' },
        { term: 'Desacoplamiento arquitectónico', desc: 'Principio donde el componente hijo solo notifica que algo ocurrió sin asumir cómo el padre procesará la acción.' }
      ],
      codeExamples: [
        {
          id: 'event-dispatcher-pattern',
          title: '📡 createEventDispatcher y eventos personalizados',
          description: 'El patrón clásico de eventos en Svelte (evaluado en el banco de preguntas del Parcial 2):',
          code: `<!-- Componente Hijo: CourseCard.svelte -->
\\x3Cscript\\x3E
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let { curso } = $props();

  function handleClick() {
    // Despacha evento 'seleccionado' con carga de datos en detail
    dispatch('seleccionado', { cursoId: curso.id, nombre: curso.title });
  }
\\x3C/script\\x3E

<button onclick={handleClick} class="course-btn">
  Ver {curso.title}
</button>

<!-- Componente Padre: Dashboard.svelte -->
<!-- Escucha el evento con la directiva on:seleccionado -->
<CourseCard
  {curso}
  on:seleccionado={(evento) => {
    console.log('Curso seleccionado:', evento.detail.cursoId);
  }}
/>`,
          file: 'Patrón de Comunicación createEventDispatcher → Parcial 2'
        },
        {
          id: 'callback-props-pattern',
          title: '🔄 Comunicación directa con Callback Props (Svelte 5)',
          description: 'En Svelte 5, pasar funciones por prop es el estándar para notificar acciones con soporte TypeScript de primer nivel:',
          code: `<!-- Componente Hijo: ActionButton.svelte -->
\\x3Cscript lang="ts"\\x3E
  let { 
    label, 
    onAction 
  }: { 
    label: string; 
    onAction?: (actionName: string) => void;
  } = $props();
\\x3C/script\\x3E

<button onclick={() => onAction?.(label)} class="action-btn">
  {label}
</button>

<!-- En el Padre (Header o Layout): -->
<ActionButton 
  label="Cerrar Sesión" 
  onAction={(name) => {
    logout();
    goto('/login');
  }} 
/>`,
          file: 'src/lib/components/SubjectCard.svelte → Integración de acciones'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Trello / Tableros Kanban',
        description: 'En una aplicación como Trello, cada tarjeta de tarea (<KanbanCard />) es un componente hijo independiente. Al hacer clic en "Mover a Completado", la tarjeta no hace la petición a la base de datos ni modifica el tablero. Despacha un evento "cardMoved" con el ID de la tarjeta y la columna destino. El componente padre (<Board />) escucha el evento y actualiza el estado general.',
        link: 'https://svelte.dev/docs/svelte/v4-migration-guide#event-directives'
      }
    },
    {
      id: 9,
      number: 'Clase 9',
      period: '2do Parcial',
      title: 'Reutilización avanzada',
      hours: '2 horas',
      objective: 'Construir componentes dinámicos y altamente flexibles utilizando slots tradicionales, slots nombrados y la sintaxis moderna de Snippets (children) en Svelte.',
      icon: '🔲',
      color: '#d946ef',
      concepts: [
        { term: 'Elemento <slot>', desc: 'Marcador de posición en Svelte 3/4 que permite proyectar contenido HTML arbitrario dentro de un componente hijo.' },
        { term: 'Slots nombrados (Named)', desc: 'Permiten habilitar múltiples áreas de inyección en un solo componente (ej. cabecera, contenido principal y pie de página).' },
        { term: 'Snippets (Svelte 5)', desc: 'Bloques de marcado reutilizables y parametrizables definidos con {#snippet nombre()} y consumidos con {@render nombre()}.' },
        { term: 'Prop children', desc: 'En Svelte 5, el contenido por defecto del slot se recibe como la prop children y se renderiza con {@render children()}.' },
        { term: 'Inversión de control visual', desc: 'El componente contenedor provee la estructura, sombras y comportamiento, mientras la vista consumidora provee el contenido.' }
      ],
      codeExamples: [
        {
          id: 'layout-render-children',
          title: '🏗️ Layout principal con {@render children()}',
          description: 'El layout global src/routes/+layout.svelte utiliza la prop children para proyectar cada página activa dentro de la estructura base:',
          code: `<!-- src/routes/+layout.svelte — Layout de nuestra plataforma -->
\\x3Cscript lang="ts"\\x3E
  import Header from './Header.svelte';
  
  // En Svelte 5, los slots se reciben como prop 'children'
  let { children } = $props();
\\x3C/script\\x3E

<div class="app">
  <Header />
  
  <main class="page-container">
    <!-- Aquí se inyecta dinámicamente cada +page.svelte -->
    {@render children()}
  </main>

  <footer class="footer">
    Cinar Sistemas 2026
  </footer>
</div>`,
          file: 'src/routes/+layout.svelte → líneas 80-95'
        },
        {
          id: 'named-snippets-modal',
          title: '🔲 Contenedores modulares con Snippets en Svelte 5',
          description: 'Patrón para componentes complejos con múltiples zonas de inyección (cabecera personalizada, cuerpo y pie):',
          code: `<!-- src/lib/components/ModalCard.svelte -->
\\x3Cscript lang="ts"\\x3E
  import type { Snippet } from 'svelte';

  let {
    header,
    children,
    footer
  }: {
    header?: Snippet;
    children: Snippet;      // Contenido principal obligatorio
    footer?: Snippet;
  } = $props();
\\x3C/script\\x3E

<div class="modal-card">
  {#if header}
    <div class="card-header">
      {@render header()}
    </div>
  {/if}

  <div class="card-body">
    {@render children()}
  </div>

  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>`,
          file: 'src/lib/components/ → Patrón de Snippets modulares'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Modales y Diálogos de Bootstrap / Tailwind',
        description: 'Imagina que creas un componente <Modal />. La animación de aparición, el fondo oscuro semitransparente (backdrop) y el botón de cerrar son siempre iguales. Sin embargo, en una página quieres mostrar un formulario de registro y en otra una confirmación para eliminar un archivo. Con slots o snippets, el componente modal da la caja y cada vista inyecta su propio contenido.',
        link: 'https://svelte.dev/docs/svelte/snippet'
      }
    },
    {
      id: 10,
      number: 'Clase 10',
      period: '2do Parcial',
      title: 'Optimización de la aplicación',
      hours: '2 horas',
      objective: 'Dominar el ciclo de vida de los componentes con onMount, $effect y funciones de limpieza para optimizar el rendimiento, sincronizar APIs y prevenir fugas de memoria.',
      icon: '⚡',
      color: '#f97316',
      concepts: [
        { term: 'Ciclo de vida (Lifecycle)', desc: 'Secuencia completa por la que transita un componente: creación, montaje en el DOM, actualización reactiva y destrucción.' },
        { term: 'onMount', desc: 'Hook que se ejecuta únicamente en el navegador tras insertarse el componente en el DOM; esencial para peticiones HTTP y DOM directo.' },
        { term: 'Runa $effect y limpieza', desc: 'Ejecuta efectos secundarios reactivos. Si retorna una función, Svelte la ejecuta automáticamente al desmontarse para limpiar recursos.' },
        { term: 'Fugas de memoria (Memory Leaks)', desc: 'Degeneración de rendimiento que ocurre cuando intervalos (setInterval) o listeners no son cancelados al salir de una página.' },
        { term: 'Seguridad en SSR vs CSR', desc: 'Evitar errores 500 en el servidor ejecutando APIs del navegador (window, localStorage, document) solo en el cliente.' }
      ],
      codeExamples: [
        {
          id: 'effect-timer-cleanup',
          title: '⏱️ Temporizador reactivo con limpieza de memoria',
          description: 'En los parciales de la plataforma (ej. Parcial 1 DW2), el temporizador utiliza una función de retorno en $effect para prevenir fugas de CPU:',
          code: `<!-- src/routes/desarrollo-web-2/parcial-1/+page.svelte -->
\\x3Cscript lang="ts"\\x3E
  let timeLeft = $state(45 * 60); // 45 minutos en segundos
  let started = $state(true);
  let finished = $state(false);

  $effect(() => {
    if (!started || finished) return;

    // Iniciar intervalo cada segundo
    const intervalId = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
      }
    }, 1000);

    // FUNCIÓN DE LIMPIEZA (Cleanup):
    // Svelte la ejecuta automáticamente cuando el usuario cambia de página.
    // Esto evita que el temporizador siga consumiendo ciclos de procesador.
    return () => {
      clearInterval(intervalId);
    };
  });
\\x3C/script\\x3E`,
          file: 'src/routes/desarrollo-web-2/parcial-1/+page.svelte → Temporizador'
        },
        {
          id: 'onmount-safe-fetch',
          title: '🌐 Carga segura en cliente con onMount y protección SSR',
          description: 'En el dashboard y páginas de notas, los datos se consultan dentro de onMount para garantizar que el DOM está listo y el código corre en el cliente:',
          code: `<!-- src/routes/desarrollo-web-2/notas/+page.svelte -->
\\x3Cscript lang="ts"\\x3E
  import { onMount } from 'svelte';
  import { gradesApi } from '$lib/api';

  let grades = $state<any[]>([]);
  let loading = $state(true);

  onMount(async () => {
    // onMount NUNCA se ejecuta en el servidor (SSR), protegiendo la app
    try {
      const data = await gradesApi.getMine();
      grades = data;
    } catch (err) {
      console.error('Error al obtener calificaciones:', err);
    } finally {
      loading = false;
    }
  });
\\x3C/script\\x3E`,
          file: 'src/routes/desarrollo-web-2/notas/+page.svelte → onMount'
        }
      ],
      externalExample: {
        title: '🌐 Ejemplo Práctico: Google Maps / Gráficos en Tiempo Real',
        description: 'Cuando abres una página que dibuja un mapa interactivo (Google Maps / Mapbox) o gráficos financieros en vivo (TradingView / Chart.js), la librería no puede ejecutarse en el servidor porque no existe el objeto "window". Debe iniciarse dentro de onMount. Cuando el usuario navega a otra pantalla, es indispensable llamar a map.destroy() en la función de limpieza para evitar que el navegador consuma toda la memoria RAM.',
        link: 'https://svelte.dev/docs/svelte/$effect'
      }
    }
  ];

  const filteredClasses = $derived(
    selectedPeriod === 'all'
      ? classes
      : selectedPeriod === 'p1'
        ? classes.filter(c => c.id <= 5)
        : classes.filter(c => c.id > 5)
  );

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
    <p class="hero-desc">10 temáticas evidenciadas en este proyecto · Parcial 1 y Parcial 2</p>
  </div>

  <div class="info-banner">
    <span class="info-banner-icon">💡</span>
    <div>
      <strong>Aprende desde el código real.</strong> Estas 10 temáticas no son teoría abstracta: están
      implementadas en esta misma plataforma que estás usando. Cada ejemplo apunta a archivos reales
      del proyecto. Las clases 1-5 corresponden al primer parcial y las clases 6-10 al segundo parcial.
    </div>
  </div>

  <!-- Period filter -->
  <div class="period-filter">
    <button
      class="period-btn"
      class:active={selectedPeriod === 'all'}
      onclick={() => setPeriodFilter('all')}
    >
      📋 Todas (10)
    </button>
    <button
      class="period-btn"
      class:active={selectedPeriod === 'p1'}
      onclick={() => setPeriodFilter('p1')}
    >
      📝 1er Parcial (1-5)
    </button>
    <button
      class="period-btn"
      class:active={selectedPeriod === 'p2'}
      onclick={() => setPeriodFilter('p2')}
    >
      📝 2do Parcial (6-10)
    </button>
  </div>

  <!-- Class selector tabs -->
  <div class="class-tabs">
    {#each filteredClasses as cls}
      <button
        class="class-tab"
        class:active={activeClass === cls.id}
        style="--tab-color: {cls.color}"
        onclick={() => { activeClass = cls.id; expandedExample = null; }}
      >
        <span class="tab-icon">{cls.icon}</span>
        <span class="tab-info">
          <span class="tab-number">{cls.number}</span>
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
          <span class="objective-label">🎯 {currentClass.number} · {currentClass.period}</span>
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
      {#each filteredClasses as cls}
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

  /* Period filter */
  .period-filter {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .period-btn {
    flex: 1;
    min-width: 120px;
    padding: 0.6rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    background: white;
    font-size: 0.82rem;
    font-weight: 600;
    color: #475569;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .period-btn:hover {
    border-color: #94a3b8;
    background: #f8fafc;
  }

  .period-btn.active {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #1d4ed8;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  }

  /* Tab number */
  .tab-number {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--tab-color);
    opacity: 0.8;
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

    .period-filter {
      flex-direction: column;
    }

    .period-btn {
      min-width: unset;
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

  .external-example-card {
    border-top: 2px solid var(--accent);
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
