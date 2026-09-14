export const questionBank = [
  // Tema 7: createEventDispatcher y Eventos
  {
    id: 1, tema: 7, type: 'mc',
    question: 'En Svelte, ¿cuál es el propósito principal de la función `createEventDispatcher`?',
    options: [
      'Enviar peticiones HTTP al backend (Express/Node)',
      'Despachar eventos personalizados desde un componente hijo para que sean escuchados por el componente padre',
      'Crear eventos globales que cualquier componente de la aplicación puede escuchar',
      'Despachar acciones en una tienda (store) de Redux'
    ],
    answer: 1,
    explanation: '`createEventDispatcher` permite a un componente hijo notificar a su componente padre sobre una acción o enviarle datos, emitiendo un evento que el padre escucha usando la directiva `on:nombreEvento`.'
  },
  {
    id: 2, tema: 7, type: 'mc',
    question: 'Supongamos que nuestro `SubjectCard.svelte` emite un evento personalizado cuando se hace clic, usando `dispatch("seleccionado", { cursoId: 5 })`. ¿Cómo capturaría el componente padre este evento y sus datos?',
    options: [
      'En el padre: `<SubjectCard on:seleccionado={(evento) => console.log(evento.detail.cursoId)} />`',
      'En el padre: `<SubjectCard onclick={(evento) => console.log(evento.detail.cursoId)} />`',
      'En el padre: `<SubjectCard bind:seleccionado={miVariable} />`',
      'En el padre: `<SubjectCard on:click={() => getDispatcher("seleccionado")} />`'
    ],
    answer: 0,
    explanation: 'El padre utiliza la sintaxis `on:[nombreDelEvento]` para escuchar eventos despachados por el hijo. Los datos enviados se encuentran en la propiedad `detail` del evento.'
  },
  {
    id: 3, tema: 7, type: 'mc',
    question: '¿Qué ventaja tiene usar eventos personalizados en la comunicación entre componentes (Hijo -> Padre) en lugar de pasar directamente una función por Prop?',
    options: [
      'Hace que la aplicación sea más pesada y lenta, pero más segura',
      'Svelte obliga a usar eventos; pasar funciones por Prop lanza error de compilación',
      'Mantiene una clara separación de responsabilidades y sigue el patrón DOM estándar de emisión de eventos, haciendo que el componente hijo sea más reutilizable y acoplado débilmente',
      'Ninguna, de hecho Svelte 5 eliminó por completo los eventos personalizados'
    ],
    answer: 2,
    explanation: 'Aunque en Svelte 5 se ha vuelto común pasar funciones como Callbacks (props), el uso de eventos personalizados (dispatch) sigue el estándar del DOM y promueve un bajo acoplamiento (el hijo no necesita saber qué hace el padre con la información).'
  },

  // Tema 8: Slots y Slots Personalizados
  {
    id: 4, tema: 8, type: 'mc',
    question: '¿Qué es y para qué sirve un `<slot>` en la construcción de componentes en Svelte?',
    options: [
      'Es un espacio reservado dentro del HTML del componente hijo, donde el componente padre puede inyectar contenido dinámico',
      'Es una etiqueta especial para declarar variables locales (slots de memoria)',
      'Es un componente integrado para manejar animaciones y transiciones de UI',
      'Es una función para interceptar llamadas al servidor'
    ],
    answer: 0,
    explanation: 'La etiqueta `<slot></slot>` actúa como un marcador de posición que indica dónde se debe renderizar el contenido HTML que el padre anida dentro del hijo.'
  },
  {
    id: 5, tema: 8, type: 'mc',
    question: 'En Svelte 5, ¿cuál es el equivalente funcional más cercano para inyectar contenido al slot predeterminado (default slot) utilizando Snippets?',
    options: [
      '`{@render children()}` asumiendo que `children` fue extraído de `$props()`',
      '`<slot name="default" />` obligatoriamente',
      '`{@html slot}`',
      '`{#if children}`'
    ],
    answer: 0,
    explanation: 'En Svelte 5, el concepto de slots evoluciona fuertemente hacia "Snippets". El contenido predeterminado que un padre pasa a un hijo se recibe como la prop `children` (un snippet) y se renderiza usando `{@render children()}`.'
  },
  {
    id: 6, tema: 8, type: 'mc',
    question: 'Si en el layout principal de la plataforma necesitamos un slot específico para insertar un menú lateral y otro para el contenido principal, ¿qué mecanismo tradicional de Svelte usamos?',
    options: [
      'Slots de componentes dinámicos (`<svelte:component>`)',
      'Slots nombrados (Named Slots) definiendo atributos como `<slot name="sidebar">` en el hijo y `slot="sidebar"` en el padre',
      'Ciclo de vida `onMount`',
      'Context API (`setContext` / `getContext`)'
    ],
    answer: 1,
    explanation: 'Los Named Slots (Slots Nombrados) permiten a un componente exponer múltiples áreas de inyección de contenido, dándole un nombre a cada una para que el padre pueda dirigirse a ellas específicamente.'
  },

  // Tema 9: Ciclo de vida (onMount / $effect)
  {
    id: 7, tema: 9, type: 'mc',
    question: 'Analizando el código del Dashboard de nuestra plataforma (`src/routes/dashboard/+page.svelte`), vemos que usa la runa `$effect(() => { if (!$isAuthenticated) goto("/login"); });`. ¿Qué propósito cumple aquí `$effect` (que reemplaza lógicas del antiguo onMount/afterUpdate)?',
    options: [
      'Cargar el diseño visual de Bootstrap antes de renderizar la página',
      'Ejecutar código secundario (efecto colateral) de manera reactiva: verifica automáticamente si el usuario sigue autenticado cada vez que cambia el estado y lo redirige si no lo está',
      'Detener la ejecución del código hasta que el usuario inicie sesión',
      'Destruir el componente cuando el usuario sale de la página'
    ],
    answer: 1,
    explanation: '`$effect` se ejecuta una vez que el componente se ha montado y vuelve a ejecutarse automáticamente cada vez que las dependencias reactivas dentro de su bloque (como `$isAuthenticated`) cambian.'
  },
  {
    id: 8, tema: 9, type: 'mc',
    question: 'En versiones anteriores de Svelte (Svelte 3/4), ¿qué función del ciclo de vida se utilizaba obligatoriamente para ejecutar código solo en el cliente una vez que el componente se ha insertado en el DOM?',
    options: [
      '`beforeUpdate`',
      '`onDestroy`',
      '`onMount`',
      '`afterUpdate`'
    ],
    answer: 2,
    explanation: '`onMount` es la función del ciclo de vida tradicional que garantiza que el DOM está listo y que el código se ejecuta únicamente en el navegador (no durante el Server-Side Rendering - SSR).'
  },
  {
    id: 9, tema: 9, type: 'mc',
    question: 'Al programar un componente Svelte que inicializa un temporizador periódico (`setInterval`), ¿en qué momento o función del ciclo de vida deberíamos limpiar/detener (`clearInterval`) ese temporizador para evitar fugas de memoria (memory leaks)?',
    options: [
      'En `onMount` antes de iniciarlo',
      'En `onDestroy` (en Svelte 4) o retornando una función de limpieza desde dentro de un `$effect` (en Svelte 5)',
      'Svelte limpia los temporizadores automáticamente, no es necesario',
      'En el evento `onsubmit` del formulario'
    ],
    answer: 1,
    explanation: 'Es crucial liberar recursos cuando el componente se desmonta. Esto se hace en el callback de limpieza de `$effect` o en la función `onDestroy`.'
  }
];

export const examConfig = {
  title: 'Parcial 2 - Desarrollo Web 2',
  duration: 45 * 60,
  maxScore: 50,
  passingScore: 30,
  questionsToSelect: {
    7: 3, // 3 preguntas de createEventDispatcher
    8: 3, // 3 preguntas de Slots
    9: 3  // 3 preguntas de Ciclo de vida
  }
};
