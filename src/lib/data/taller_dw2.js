export const questionBank = [
  // Tema 1: Componentes con Bootstrap (4 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Cuál es la clase de Bootstrap para crear un contenedor responsive?',
    options: ['`box`', '`container` o `container-fluid`', '`wrapper`', '`layout`'],
    answer: 1,
    explanation: 'Bootstrap ofrece `container` (ancho fijo con breakpoints) y `container-fluid` (100% ancho). Ambos proveen padding horizontal y centering.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Qué clase de Bootstrap crea una fila (row)?',
    options: ['`<row>`', '`class="grid"`', '`class="row"`', '`class="flex-row"`'],
    answer: 2,
    explanation: '`class="row"` crea una fila que contiene columnas (col-*). Las filas抵消 el padding de los containers con margin negativo.'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Cómo se define una columna que ocupa 6 de las 12 unidades en Bootstrap?',
    options: ['`class="col-6"`', '`class="col6"`', '`class="columns-6"`', '`class="span-6"`'],
    answer: 0,
    explanation: 'Bootstrap usa un sistema de 12 columnas. `col-6` ocupa la mitad del row. También existe `col-md-6`, `col-lg-6` para responsive.'
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Qué componente Bootstrap es ideal para agrupar contenido relacionado?',
    options: ['`jumbotron`', '`card`', '`panel`', '`group`'],
    answer: 1,
    explanation: 'Las cards (`card`, `card-body`, `card-title`, `card-text`) son el componente perfecto para agrupar contenido con header, body y footer opcional.'
  },

  // Tema 2: Props y estado en Svelte 5 (4 MC)
  {
    id: 5, tema: 2, type: 'mc',
    question: '¿Cómo se define un prop con valor por defecto en Svelte 5?',
    options: [
      '`export let name = "valor"`',
      '`let { name = "valor" } = $props()`',
      '`const props = useProps({ default: "valor" })`',
      '`$prop("name", "valor")`'
    ],
    answer: 1,
    explanation: 'En Svelte 5 se usa destructuring con `$props()`: `let { name = "default" } = $props()`. Si el padre no pasa `name`, será "default".'
  },
  {
    id: 6, tema: 2, type: 'mc',
    question: '¿Qué es `$state` en Svelte 5?',
    options: [
      'Un prop del componente',
      'Una función para crear estado reactivo',
      'Un hook de React',
      'Un store de Svelte'
    ],
    answer: 1,
    explanation: '`$state(value)` crea estado reactivo en Svelte 5. Cuando el valor cambia, el DOM se actualiza automáticamente.'
  },
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Cómo se pasa un objeto de props a un componente en Svelte?',
    options: [
      '`<Component props={obj} />`',
      '`<Component {...obj} />`',
      '`<Component value={obj} />`',
      '`<Component prop={obj} />`'
    ],
    answer: 1,
    explanation: 'El spread operator `{...obj}` pasa todas las propiedades del objeto como props individuales al componente.'
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Cuál es la diferencia entre `let` y `const` para declarar props?',
    options: [
      '`const` es para props requerida, `let` para opcionales',
      '`const` no se puede usar para props',
      'No hay diferencia para props',
      '`let` crea props reactivas, `const` no'
    ],
    answer: 0,
    explanation: '`const` implica que la prop es requerida y no cambiará. `let` permite que el componente reasigne la prop internamente (no recomendado).'
  },

  // Tema 3: Slots (4 MC)
  {
    id: 9, tema: 3, type: 'mc',
    question: '¿Cómo se define un slot por defecto en Svelte?',
    options: [
      '`<slot name="default" />`',
      '`<slot />`',
      '`<slot fallback />`',
      '`<default> contenido </default>`'
    ],
    answer: 1,
    explanation: '`<slot />` define un slot sin nombre (default). El contenido entre las etiquetas del componente se inserta ahí.'
  },
  {
    id: 10, tema: 3, type: 'mc',
    question: '¿Cómo se pasa contenido a un slot nombrado llamado "header"?',
    options: [
      '`<Component slot="header">Texto</Component>`',
      '`<Component><span slot="header">Texto</span></Component>`',
      '`<Component header="Texto" />`',
      '`<Component><header>Texto</header></Component>`'
    ],
    answer: 1,
    explanation: 'Se usa el atributo `slot="nombre"` en el elemento que quieres asignar a ese slot: `<div slot="header"> contenido </div>`'
  },
  {
    id: 11, tema: 3, type: 'mc',
    question: '¿Para qué sirve el contenido entre `<slot>contenido</slot>`?',
    options: [
      'No tiene función',
      'Es el contenido fallback que se muestra si no hay contenido del padre',
      'Solo funciona en desarrollo',
      'Es el contenido inicial que siempre se muestra'
    ],
    answer: 1,
    explanation: 'El contenido fallback dentro de `<slot>` se renderiza cuando el componente padre no provee contenido para ese slot.'
  },
  {
    id: 12, tema: 3, type: 'mc',
    question: '¿Cuántos slots puede tener un componente Svelte?',
    options: ['1', '2', '3', 'Ilimitados (1 default + múltiples nombrados)'],
    answer: 3,
    explanation: 'Un componente puede tener 1 slot por defecto (sin nombre) y múltiples slots nombrados usando el atributo `name` o `slot="nombre"`.'
  },

  // Tema 4: localStorage (4 MC)
  {
    id: 13, tema: 4, type: 'mc',
    question: '¿Qué método de localStorage se usa para guardar un valor?',
    options: [
      '`localStorage.save("key", value)`',
      '`localStorage.setItem("key", value)`',
      '`localStorage.write("key", value)`',
      '`localStorage.push("key", value)`'
    ],
    answer: 1,
    explanation: '`localStorage.setItem("key", value)` guarda un par clave-valor. El valor se convierte a string automáticamente.'
  },
  {
    id: 14, tema: 4, type: 'mc',
    question: '¿Cómo se recupera un objeto guardado en localStorage?',
    options: [
      '`localStorage.getItem("key")` y ya está',
      '`JSON.parse(localStorage.getItem("key"))`',
      '`localStorage.read("key")`',
      '`localStorage.object("key")`'
    ],
    answer: 1,
    explanation: '`localStorage` solo almacena strings. Para guardar objetos: `setItem("key", JSON.stringify(obj))`. Para recuperarlos: `JSON.parse(getItem("key"))`.'
  },
  {
    id: 15, tema: 4, type: 'mc',
    question: '¿Cuál es la diferencia entre localStorage y sessionStorage?',
    options: [
      'localStorage tiene más capacidad',
      'sessionStorage se borra al cerrar el navegador/tab, localStorage persiste',
      'Son idénticos',
      'localStorage es más rápido'
    ],
    answer: 1,
    explanation: 'sessionStorage tiene el mismo API pero los datos persisten solo durante la sesión (hasta cerrar el tab). localStorage no expira.'
  },
  {
    id: 16, tema: 4, type: 'mc',
    question: '¿Qué sucede si intentas guardar `undefined` en localStorage?',
    options: [
      'Guarda la cadena "undefined"',
      'Se convierte a "undefined" como string',
      'Lanza un error',
      'No guarda nada'
    ],
    answer: 0,
    explanation: '`localStorage.setItem` convierte todos los valores a string. `undefined` se convierte en la cadena "undefined". Usar `null` si necesitas representar vacío.'
  },

  // Taller práctico (4 ejercicios abiertos)
  {
    id: 17, tema: 1, type: 'open',
    question: 'TALLER PRÁCTICO: Crea un componente Card.svelte que: 1) Use Svelte 5 con $props() 2) Acepte props: title, description, image 3) Use Bootstrap para el diseño (card, card-img-top, card-body) 4) Tenga un slot para contenido adicional. Incluye el código completo.'
  },
  {
    id: 18, tema: 2, type: 'open',
    question: 'TALLER PRÁCTICO: Crea una lista de tareas (TodoList) que: 1) Permita agregar tareas 2) Permita marcar tareas como completadas 3) Persista las tareas en localStorage 4) Muestre el número de tareas pendientes. Usa Svelte 5 y Bootstrap.'
  },
  {
    id: 19, tema: 3, type: 'open',
    question: 'TALLER PRÁCTICO: Crea un componente Modal.svelte que: 1) Use slots para el header, body y footer 2) Tenga un botón para cerrar 3) Se abra/cierre según una prop `open` 4) Tenga transición fade. El padre debe poder pasar contenido arbitrario a cada slot.'
  },
  {
    id: 20, tema: 4, type: 'open',
    question: 'TALLER PRÁCTICO: Implementa un contador de visitas simple: 1) Muestre "Esta página ha sido visitada X veces" 2) El contador persista en localStorage 3) Se incremente cada vez que se monte el componente 4) Use $effect para sincronizar con localStorage.'
  }
];

export function selectRandomQuestions(count = 8) {
  const mcQuestions = questionBank.filter(q => q.type === 'mc').sort(() => Math.random() - 0.5);
  const openQuestions = questionBank.filter(q => q.type === 'open');

  const mcCount = Math.min(4, count);
  const openCount = count - mcCount;

  return [...mcQuestions.slice(0, mcCount), ...openQuestions.slice(0, openCount)];
}

export const TOTAL_QUESTIONS = questionBank.length;
export const TOTAL_TIME = 30 * 60;
export const TIME_PER_MC = 45;
export const TIME_PER_OPEN = 300;
export const DEADLINE = new Date('2026-08-22T23:59:59-05:00');
export const MAX_ATTEMPTS = 2;
