export const questionBank = [
  // Tema 1: Rutas avanzadas en Svelte.js (6 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Qué archivo en SvelteKit define el layout raíz de la aplicación?',
    options: ['`+layout.svelte`', '`+page.svelte`', '`+layout.js`', '`app.html`'],
    answer: 0,
    explanation: 'El archivo `+layout.svelte` en la raíz de `src/routes/` define el layout principal que se aplica a todas las páginas. Los layouts pueden anidarse usando subcarpetas.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Cuál es la diferencia entre una ruta estática y una dinámica en SvelteKit?',
    options: [
      'Las rutas estáticas usan `+page.svelte` y las dinámicas usan `+page.js`',
      'Las rutas estáticas se compilan en tiempo de build, las dinámicas se resolved en tiempo de ejecución',
      'No hay diferencia, ambos tipos funcionan igual',
      'Las rutas dinámicas requieren autenticación'
    ],
    answer: 1,
    explanation: 'Las rutas estáticas generan HTML en tiempo de compilación, mientras que las dinámicas (con [param]) se resolved cuando el usuario las accede. Esto afecta el rendimiento y la estrategia de rendering.'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Cómo se define un parámetro dinámico en una ruta de SvelteKit?',
    options: ['`/users/{id}`', '`/users:[id]`', '`/users/[id]`', '`/users?{id}`'],
    answer: 2,
    explanation: 'Los parámetros dinámicos se definen usando corchetes, por ejemplo `/users/[id]` donde `id` será accesible en `page.params.id` en el componente.'
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Qué archivo se usa para cargar datos antes de renderizar una página en SvelteKit?',
    options: ['`+page.svelte`', '`+page.js` o `+page.ts`', '`+layout.js`', '`load.js`'],
    answer: 1,
    explanation: 'El archivo `+page.js` (o `+page.ts`) exporta una función `load` que recibe `data` como prop en el componente. Se ejecuta antes de renderizar la página.'
  },
  {
    id: 5, tema: 1, type: 'mc',
    question: '¿Qué hook de SvelteKit permite ejecutar código en el servidor antes de cargar la página?',
    options: ['`onMount`', '`beforeNavigate`', '`+page.server.js` con `load`', '`$effect`'],
    answer: 2,
    explanation: 'El archivo `+page.server.js` se ejecuta exclusivamente en el servidor. Su función `load` recibe `event` con request, cookies y params directamente del servidor.'
  },
  {
    id: 6, tema: 1, type: 'mc',
    question: '¿Para qué sirve el archivo `+error.svelte` en SvelteKit?',
    options: [
      'Para manejar errores de compilación',
      'Para mostrar una página de error personalizada cuando ocurre un error en la ruta',
      'Para registrar errores en un log',
      'Para validar formularios'
    ],
    answer: 1,
    explanation: 'El archivo `+error.svelte` es el componente de error para una ruta específica. Se muestra cuando `throw error()` se lanza en `+page.js` o durante el rendering.'
  },

  // Tema 2: Componentes avanzados (6 MC)
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Cuál es la forma correcta de definir props en un componente Svelte 5?',
    options: ['`export let propName`', '`let { propName } = $props()`', '`const props = defineProps()`', '`this.props.propName`'],
    answer: 1,
    explanation: 'En Svelte 5 se usa la sintaxis `let { propName } = $props()` dentro del bloque `<script>`. Esto reemplaza a `export let` de Svelte 4.'
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Qué es `$props()` en Svelte 5?',
    options: [
      'Una función para definir estado reactivo',
      'Una función que desestructura las propiedades pasadas al componente',
      'Un store de Svelte',
      'Un método para crear eventos personalizados'
    ],
    answer: 1,
    explanation: '`$props()` es una función que retorna un objeto con todas las props pasadas al componente, permitiendo destructuring y valores por defecto.'
  },
  {
    id: 9, tema: 2, type: 'mc',
    question: '¿Cómo se declaran las props como opcionales con valor por defecto en Svelte 5?',
    options: [
      '`let { name = "default" } = $props()`',
      '`export let name: string = "default"`',
      '`const props = useProps({ default: "default" })`',
      '`$prop("name", { default: "default" })`'
    ],
    answer: 0,
    explanation: 'Se usa destructuring con valor por defecto: `let { name = "default" } = $props()`. Si no se pasa `name` al usar el componente, será "default".'
  },
  {
    id: 10, tema: 2, type: 'mc',
    question: '¿Qué es el prop spreading en Svelte?',
    options: [
      'Una técnica para animaciones',
      'Pasar múltiples props a un componente usando `{...props}`',
      'Un tipo de evento',
      'Un método para crear slots dinámicos'
    ],
    answer: 1,
    explanation: 'El prop spreading permite pasar un objeto de props a un componente: `<Component {...props} />`. Es útil cuando se tienen muchas props o se reusan objetos de configuración.'
  },
  {
    id: 11, tema: 2, type: 'mc',
    question: '¿Cuál es la diferencia entre `$props()` y `$state()` en Svelte 5?',
    options: [
      'Ambos definen props',
      '`$props()` es para datos externos, `$state()` es para estado interno del componente',
      'Son equivalentes',
      '`$state()` solo se usa en componentes padre'
    ],
    answer: 1,
    explanation: '`$props()` recibe datos del componente padre (externos), mientras que `$state()`管理 componentes internos datos que pueden cambiar (estado local).'
  },
  {
    id: 12, tema: 2, type: 'mc',
    question: '¿Qué significa que un componente sea "transparente" en cuanto a props?',
    options: [
      'Que no acepta props',
      'Que re-exporta todas las props que recibe sin modificarlas',
      'Que solo acepta props de tipo string',
      'Que sus props son todas opcionales'
    ],
    answer: 1,
    explanation: 'Un componente transparente (wrapper) recibe props y las pasa a un componente hijo sin procesarlas. Se usa para crear capas de abstracción.'
  },

  // Tema 3: Bootstrap en Svelte (6 MC)
  {
    id: 13, tema: 3, type: 'mc',
    question: '¿Cómo se integra Bootstrap en un proyecto SvelteKit?',
    options: [
      'Solo se puede usar via CDN en `app.html`',
      'Se instala con `npm install bootstrap` y se importa en `+layout.svelte`',
      'No es compatible con Svelte',
      'Se usa un componente especial `<Bootstrap>`'
    ],
    answer: 1,
    explanation: 'Bootstrap se instala via npm (`npm install bootstrap`) y se importa el CSS en el layout principal: `import "bootstrap/dist/css/bootstrap.min.css"`.'
  },
  {
    id: 14, tema: 3, type: 'mc',
    question: '¿Cuál es la clase de Bootstrap para crear una tarjeta (card)?',
    options: ['`<div class="box">`', '`<div class="card">`', '`<div class="panel">`', '`<div class="container">`'],
    answer: 1,
    explanation: 'Bootstrap usa la clase `card` para crear tarjetas. La estructura típica incluye `card`, `card-body`, `card-title`, `card-text`.'
  },
  {
    id: 15, tema: 3, type: 'mc',
    question: '¿Qué clase de Bootstrap se usa para crear una fila (row) que contiene columnas?',
    options: ['`row`', '`container`', '`grid`', '`flex`'],
    answer: 0,
    explanation: 'La clase `row` crea una fila que puede contener hasta 12 columnas definidas con `col-*`. Ejemplo: `<div class="row"><div class="col-6"></div></div>`'
  },
  {
    id: 16, tema: 3, type: 'mc',
    question: '¿Qué clase de Bootstrap centra horizontalmente el contenido?',
    options: ['`mx-auto`', '`text-center`', '`d-flex justify-center`', 'Todas las anteriores son válidas según el contexto'],
    answer: 3,
    explanation: '`mx-auto` centra elementos block con ancho fijo, `text-center` centra texto, y `d-flex justify-center` centra contenido flex. La elección depende del tipo de elemento.'
  },
  {
    id: 17, tema: 3, type: 'mc',
    question: '¿Cómo se crea un botón primario con Bootstrap?',
    options: ['`<button class="btn primary">`', '`<button class="btn btn-primary">`', '`<button class="button primary">`', '`<button type="primary">`'],
    answer: 1,
    explanation: 'Bootstrap usa clases utilitarias: `btn` para el estilo base y `btn-primary` para el color. Otros variantes incluyen `btn-secondary`, `btn-success`, `btn-danger`.'
  },
  {
    id: 18, tema: 3, type: 'mc',
    question: '¿Qué clase de Bootstrap crea un contenedor responsive con padding?',
    options: ['`container-fluid` y `container`', 'Solo `container`', 'Solo `box`', '`div-container`'],
    answer: 0,
    explanation: '`container` tiene anchos máximos predefinidos por breakpoint, `container-fluid` ocupa 100% del ancho. Ambos agregan padding horizontal automáticamente.'
  },

  // Tema 4: Modularización (4 MC)
  {
    id: 19, tema: 4, type: 'mc',
    question: '¿Cuál es el beneficio principal de modularizar componentes en Svelte?',
    options: [
      'Hace el código más difícil de leer',
      'Reutilización, mantenibilidad y separación de responsabilidades',
      'Aumenta el tamaño del bundle final',
      'Requiere más dependencias'
    ],
    answer: 1,
    explanation: 'La modularización permite reutilizar componentes, facilita el mantenimiento (cambios localizados), y separa responsabilidades lógicas del código.'
  },
  {
    id: 20, tema: 4, type: 'mc',
    question: '¿Dónde se recomienda colocar componentes reutilizables en SvelteKit?',
    options: ['`src/routes/components/`', '`src/lib/components/`', '`src/shared/`', '`public/components/`'],
    answer: 1,
    explanation: 'Los componentes reutilizables van en `src/lib/components/` o subcarpetas. El alias `$lib/components/` facilita las importaciones.'
  },
  {
    id: 21, tema: 4, type: 'mc',
    question: '¿Qué son los archivos de utilidades (utils) en SvelteKit?',
    options: [
      'Componentes visuales pequeños',
      'Funciones auxiliares que no son componentes (formatters, validators)',
      'Rutas de la aplicación',
      'Estilos CSS'
    ],
    answer: 1,
    explanation: 'Las utilidades son funciones helper que se colocan en `src/lib/utils/` o similar. Ejemplos: formateo de fechas, validación de datos, constantes.'
  },
  {
    id: 22, tema: 4, type: 'mc',
    question: '¿Qué convención de nomenclatura se usa para archivos de utilidades en JavaScript/TypeScript?',
    options: ['`utilidades.js`', '`utils.js` o `formatters.js`', '`helpers.module.js`', '`functions.common.js`'],
    answer: 1,
    explanation: 'Se usan nombres descriptivos en plural o según su función: `utils.js`, `formatters.js`, `validators.js`, `constants.js`.'
  },

  // Tema 5: Persistencia de datos (4 MC)
  {
    id: 23, tema: 5, type: 'mc',
    question: '¿Qué API del navegador permite guardar datos localmente en el cliente?',
    options: ['`localStorage`', '`sessionStorage`', 'Ambas, dependiendo de la necesidad', 'Ninguna, los datos deben guardarse en el servidor'],
    answer: 2,
    explanation: '`localStorage` persiste hasta que se limpie explícitamente; `sessionStorage` se borra al cerrar el tab. Ambas almacenan strings, usar JSON.stringify/parse.'
  },
  {
    id: 24, tema: 5, type: 'mc',
    question: '¿Cuál es la diferencia principal entre localStorage y sessionStorage?',
    options: [
      '`localStorage` es más seguro',
      '`sessionStorage` se borra al cerrar el navegador, `localStorage` persiste',
      '`localStorage` tiene más capacidad',
      'No hay diferencia'
    ],
    answer: 1,
    explanation: '`sessionStorage` se elimina cuando se cierra la pestaña/navegador. `localStorage` persiste indefinidamente hasta que se elimine manualmente o el código lo borre.'
  },
  {
    id: 25, tema: 5, type: 'mc',
    question: '¿Cómo se guarda un objeto JavaScript en localStorage?',
    options: [
      '`localStorage.setItem("key", objeto)`',
      '`localStorage.setItem("key", JSON.stringify(objeto))`',
      '`localStorage.save("key", objeto)`',
      'No es posible guardar objetos'
    ],
    answer: 1,
    explanation: 'localStorage solo almacena strings. Para guardar objetos se usa `JSON.stringify()` al guardar y `JSON.parse()` al recuperar.'
  },
  {
    id: 26, tema: 5, type: 'mc',
    question: '¿Qué método de SvelteKit se usa para acceder a cookies en el servidor?',
    options: ['`document.cookie`', '`event.cookies` en el load de `+page.server.js`', '`window.localStorage`', '`$page.data`'],
    answer: 1,
    explanation: 'En `+page.server.js`, el objeto `event` tiene `event.cookies` que permite leer, escribir y eliminar cookies en el servidor.'
  },

  // Tema 6: Slots y comunicación (6 MC)
  {
    id: 27, tema: 6, type: 'mc',
    question: '¿Qué son los slots en Svelte?',
    options: [
      'Eventos personalizados',
      'Espacios en componentes donde se puede insertar contenido desde el padre',
      'Variables de estado',
      'Rutas dinámicas'
    ],
    answer: 1,
    explanation: 'Los slots permiten que un componente padre pase contenido a un componente hijo. El hijo define dónde se inserta usando `<slot />`.'
  },
  {
    id: 28, tema: 6, type: 'mc',
    question: '¿Qué es un slot nombrado (named slot) en Svelte?',
    options: [
      'Un slot con un nombre obligatorio',
      'Un slot que permite múltiples áreas de contenido en un mismo componente',
      'Un slot que no se puede eliminar',
      'Un slot con validación de tipo'
    ],
    answer: 1,
    explanation: 'Los slots nombrados permiten definir múltiples áreas de contenido: `<slot name="header" />` y en el padre `<Component><span slot="header">Contenido</span></Component>`'
  },
  {
    id: 29, tema: 6, type: 'mc',
    question: '¿Para qué sirve createEventDispatcher en Svelte?',
    options: [
      'Para crear elementos DOM',
      'Para comunicar eventos desde un componente hijo hacia el padre',
      'Para definir props dinámicas',
      'Para crear slots'
    ],
    answer: 1,
    explanation: '`createEventDispatcher` permite que un componente hijo emita eventos hacia el padre: `const dispatch = createEventDispatcher(); dispatch("eventName", { data });`'
  },
  {
    id: 30, tema: 6, type: 'mc',
    question: '¿Cómo recibe el componente padre un evento emitido por el hijo con createEventDispatcher?',
    options: [
      'Usando `on:eventName`',
      'Usando `bind:eventName`',
      'El padre no puede recibir eventos del hijo',
      'Usando `emit:eventName`'
    ],
    answer: 0,
    explanation: 'El padre escucha el evento con la directiva `on:eventName` directamente en la etiqueta del componente hijo.'
  },
  {
    id: 31, tema: 6, type: 'mc',
    question: '¿Qué es un slot con fallback (default slot content)?',
    options: [
      'Un slot que no puede estar vacío',
      'Contenido que se muestra cuando el padre no provee nada para ese slot',
      'Un slot que solo acepta strings',
      'Un slot que se renderiza primero'
    ],
    answer: 1,
    explanation: 'El contenido fallback se define dentro de `<slot>contenido por defecto</slot>` y se muestra si el componente padre no provee contenido para ese slot.'
  },
  {
    id: 32, tema: 6, type: 'mc',
    question: '¿Cuál es la diferencia entre props y eventos en la comunicación padre-hijo?',
    options: [
      'Props fluyen del padre al hijo, eventos del hijo al padre',
      'Son exactamente lo mismo',
      'Props son para strings, eventos para números',
      'No hay comunicación posible'
    ],
    answer: 0,
    explanation: 'Las props se pasan del padre al hijo para transmitir datos. Los eventos (via createEventDispatcher) permiten que el hijo notifique acciones al padre.'
  },

  // Tema 7: Ciclo de vida y optimización (4 MC)
  {
    id: 33, tema: 7, type: 'mc',
    question: '¿Qué función de Svelte 5 reemplaza a onMount?',
    options: [
      '`$effect` con cleanup',
      '`$derived`',
      'No hay reemplazo, onMount sigue existiendo',
      '`onMount` es la única opción'
    ],
    answer: 0,
    explanation: 'En Svelte 5, `$effect` puede realizar el mismo trabajo que `onMount`, incluyendo cleanup al retornar una función.'
  },
  {
    id: 34, tema: 7, type: 'mc',
    question: '¿Qué hace el cleanup en un efecto de Svelte?',
    options: [
      'Limpia el código muerto',
      'Ejecuta código cuando el efecto se destruye o antes de ejecutarse de nuevo',
      'Elimina el componente del DOM',
      'Reinicia el servidor'
    ],
    answer: 1,
    explanation: 'El cleanup se retorna desde `$effect` como una función: `$effect(() => { /* código */ return () => { /* cleanup */ }; })`. Se ejecuta antes de que el efecto se re-ejecute o se destruya.'
  },
  {
    id: 35, tema: 7, type: 'mc',
    question: '¿Cuál es una práctica recomendada para optimizar el rendimiento en Svelte?',
    options: [
      'Usar muchos `$state` en cada componente',
      'Minimizar reactivity innecesaria y usar `$derived` para valores calculados',
      'No usar componentes, todo en un solo archivo',
      'Evitar el uso de props'
    ],
    answer: 1,
    explanation: '`$derived` calcula valores derivados solo cuando sus dependencias cambian, evitando cálculos redundantes. Minimizar `$state` que no necesitan reactivity.'
  },
  {
    id: 36, tema: 7, type: 'mc',
    question: '¿Cuándo se ejecuta `$effect` en Svelte 5?',
    options: [
      'Solo una vez al montar el componente',
      'Después del render inicial y cuando sus dependencias cambian',
      'Solo cuando el usuario interactúa',
      'Nunca, es solo para desarrollo'
    ],
    answer: 1,
    explanation: '`$effect` se ejecuta después del render inicial y se re-ejecuta cuando cualquiera de sus dependencias (props, state) cambia.'
  },

  // Preguntas abiertas (8)
  {
    id: 37, tema: 1, type: 'open',
    question: 'Explica la diferencia entre renderizado del lado del servidor (SSR) y del lado del cliente (CSR). ¿Cuándo usarías cada uno?'
  },
  {
    id: 38, tema: 2, type: 'open',
    question: 'Crea un componente Card en Svelte que reciba props para título, contenido e imagen, y use Bootstrap para su diseño.'
  },
  {
    id: 39, tema: 3, type: 'open',
    question: 'Diseña una cuadrícula de 3 columnas responsive usando Bootstrap. Explica qué sucede en cada breakpoint.'
  },
  {
    id: 40, tema: 4, type: 'open',
    question: 'Nombra 3 buenas prácticas para organizar un proyecto SvelteKit con múltiples rutas y componentes.'
  },
  {
    id: 41, tema: 5, type: 'open',
    question: '¿Cómo implementarías un carrito de compras que persista entre sesiones usando localStorage?'
  },
  {
    id: 42, tema: 6, type: 'open',
    question: 'Crea un ejemplo donde un componente hijo (Button) emita un evento hacia su componente padre (App) usando createEventDispatcher.'
  },
  {
    id: 43, tema: 7, type: 'open',
    question: 'Explica qué es el ciclo de vida de un componente y menciona al menos 3 situaciones donde necesitarías ejecutar código en el cleanup.'
  },
  {
    id: 44, tema: 7, type: 'open',
    question: '¿Qué estrategias conoces para reducir el tamaño del bundle de una aplicación SvelteKit?'
  }
];

export function selectRandomQuestions(count = 20) {
  const baseDistribution = [
    { tema: 1, count: 3 },
    { tema: 2, count: 3 },
    { tema: 3, count: 3 },
    { tema: 4, count: 2 },
    { tema: 5, count: 2 },
    { tema: 6, count: 3 },
    { tema: 7, count: 2 }
  ];

  const totalBase = baseDistribution.reduce((s, d) => s + d.count, 0);
  const openCount = count - totalBase;

  const selectedQuestions = [];

  for (const dist of baseDistribution) {
    const temaQuestions = questionBank.filter(q => q.tema === dist.tema);
    const shuffled = [...temaQuestions].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, dist.count));
  }

  const openQuestions = questionBank.filter(q => q.type === 'open').sort(() => Math.random() - 0.5);
  selectedQuestions.push(...openQuestions.slice(0, Math.max(0, openCount)));

  return selectedQuestions.sort(() => Math.random() - 0.5);
}

export const TOTAL_QUESTIONS = questionBank.length;
export const TOTAL_TIME = 45 * 60;
export const TIME_PER_MC = 60;
export const TIME_PER_OPEN = 180;
export const WINDOW1_END = new Date('2026-03-28T21:00:00-05:00');
export const WINDOW2_START = new Date('2026-03-31T18:45:00-05:00');
export const WINDOW2_END = new Date('2026-03-31T20:00:00-05:00');
