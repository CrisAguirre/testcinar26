export const questionBank = [
  // Tema 4: Modularización y Organización
  {
    id: 1, tema: 4, type: 'mc',
    question: 'En la arquitectura de nuestra plataforma, encontramos componentes como `SubjectCard.svelte` guardados en la carpeta `src/lib/components`. ¿Cuál es la ventaja de ubicar componentes en `src/lib`?',
    options: [
      'Los archivos en lib solo se ejecutan en el backend',
      'Nos permite importar estos componentes fácilmente desde cualquier ruta de la aplicación usando el alias `$lib/components/...`',
      'Automáticamente les asigna estilos de Bootstrap',
      'Es un requisito obligatorio de MongoDB'
    ],
    answer: 1,
    explanation: 'El directorio `src/lib` en SvelteKit está configurado automáticamente con el alias `$lib`, lo que facilita la modularización e importación de código reutilizable sin importar la profundidad de la ruta actual.'
  },
  {
    id: 2, tema: 4, type: 'mc',
    question: 'Si el componente `ExamCard` crece demasiado (más de 500 líneas de código con mucha lógica), ¿cuál es la mejor práctica de modularización?',
    options: [
      'Borrar comentarios para reducir el tamaño del archivo',
      'Separar responsabilidades dividiéndolo en componentes más pequeños (ej. `ExamHeader.svelte`, `ExamBody.svelte`)',
      'Mover todo el código a `+layout.svelte`',
      'Dejarlo así, ya que Svelte está diseñado para componentes monolíticos'
    ],
    answer: 1,
    explanation: 'La modularización consiste en dividir componentes grandes en piezas más pequeñas, manejables y con responsabilidades únicas.'
  },
  {
    id: 3, tema: 4, type: 'mc',
    question: '¿Qué convención de nomenclatura de Svelte se sugiere para archivos que representan componentes UI reutilizables (como los botones o tarjetas de nuestro dashboard)?',
    options: [
      'CamelCase comenzando con minúscula (ej. `subjectCard.svelte`)',
      'PascalCase comenzando con mayúscula (ej. `SubjectCard.svelte`)',
      'kebab-case (ej. `subject-card.svelte`)',
      'snake_case (ej. `subject_card.svelte`)'
    ],
    answer: 1,
    explanation: 'Por convención en el ecosistema Svelte, los componentes se nombran usando PascalCase (ej. `Button.svelte`, `SubjectCard.svelte`), para diferenciarlos de las etiquetas HTML estándar en los templates.'
  },

  // Tema 5: Formularios para guardar registros
  {
    id: 4, tema: 5, type: 'mc',
    question: 'Si estuviéramos creando un formulario en Svelte para guardar un nuevo "Post" o comentario en el foro del curso, ¿cómo enlazamos (bind) el valor de un campo `<input>` a una variable de estado en Svelte 5?',
    options: [
      '`<input value={miVariable} />`',
      '`<input ng-model="miVariable" />`',
      '`<input bind:value={miVariable} />`',
      '`<input on:change={miVariable} />`'
    ],
    answer: 2,
    explanation: 'La directiva `bind:value` establece una vinculación bidireccional (two-way binding) entre el elemento del DOM y la variable de estado del componente.'
  },
  {
    id: 5, tema: 5, type: 'mc',
    question: 'Al procesar el evento de envío de un formulario de registro de posts (`<form onsubmit={guardarPost}>`), ¿cómo evitamos que el navegador recargue la página automáticamente?',
    options: [
      'Usando `event.preventDefault()` dentro de la función `guardarPost`',
      'Añadiendo el modificador `|preventDefault` en el HTML de Svelte 4, o llamando a `event.preventDefault()` en Svelte 5',
      'Usando un `<button type="button">` en lugar de `type="submit"`',
      'Todas las anteriores son técnicas válidas en Svelte'
    ],
    answer: 3,
    explanation: 'Tanto modificar el tipo de botón, como invocar `event.preventDefault()` directamente en la función manejadora (el estándar en Svelte 5), evitan la recarga completa del navegador.'
  },

  // Tema 6: Inputs Personalizados
  {
    id: 6, tema: 6, type: 'mc',
    question: 'Supongamos que modularizamos nuestros formularios creando un componente `CustomInput.svelte`. ¿Cómo pasamos la etiqueta (label) y el valor enlazado (value) desde el formulario padre hacia `CustomInput`?',
    options: [
      'El padre no puede enviar el valor, debe guardarlo en MongoDB primero',
      'Mediante eventos personalizados',
      'Pasando el label como Prop y usando `bind:value` en la etiqueta del componente, permitiendo que el componente propague los cambios hacia arriba',
      'Usando el ciclo de vida `$effect`'
    ],
    answer: 2,
    explanation: 'En Svelte, podemos usar `bind:value` incluso en componentes personalizados (ej. `<CustomInput label="Nombre" bind:value={nombre} />`), siempre y cuando el componente hijo también bindeé su propio `<input bind:value={value} />` interno a la prop `value`.'
  },
  {
    id: 7, tema: 6, type: 'open',
    question: 'Taller Práctico: Imagina que quieres agregar una sección de "Foro Estudiantil" en la plataforma. Escribe a grandes rasgos cómo estructurarías el componente "NuevoPost.svelte" para que tenga un input personalizado para el título, un textarea para el contenido y un botón de guardar que al hacer clic imprima los datos en la consola.'
  }
];

export const examConfig = {
  title: 'Taller Práctico - Desarrollo Web 2',
  duration: 60 * 60,
  maxScore: 50,
  passingScore: 30,
  questionsToSelect: {
    4: 2, // 2 preguntas Modularización
    5: 2, // 2 preguntas Formularios
    6: 2  // 2 preguntas Inputs
  }
};
