export const questionBank = [
  // Tema 1: Rutas avanzadas
  {
    id: 1, tema: 1, type: 'mc',
    question: 'En nuestro proyecto, el archivo `src/routes/+layout.svelte` se utiliza para:',
    options: [
      'Definir estilos que solo aplican a la página de inicio',
      'Establecer la estructura base y los menús de navegación que envuelven a todas las páginas de la aplicación',
      'Configurar la conexión a la base de datos de MongoDB',
      'Definir rutas dinámicas usando parámetros como [id]'
    ],
    answer: 1,
    explanation: 'El archivo `+layout.svelte` funciona como una plantilla maestra que envuelve todas las páginas (o rutas hijas) a través de la etiqueta `<slot />` o `{@render children()}` en Svelte 5.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: 'Si en nuestra plataforma quisieras crear una ruta dinámica para ver el perfil de cualquier estudiante, ¿cómo deberías nombrar la carpeta dentro de `src/routes/`?',
    options: [
      '`estudiantes/perfil/id`',
      '`estudiantes/perfil/:id`',
      '`estudiantes/perfil/[id]`',
      '`estudiantes/perfil/{id}`'
    ],
    answer: 2,
    explanation: 'En SvelteKit, los parámetros de ruta dinámicos se definen envolviendo el nombre del parámetro entre corchetes, por ejemplo `[id]`.'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Qué ventaja principal nos brinda SvelteKit al utilizar enrutamiento basado en el sistema de archivos (Filesystem Routing)?',
    options: [
      'No tenemos que instalar bases de datos',
      'Las rutas se definen automáticamente creando carpetas y archivos `+page.svelte`, evitando configurar un archivo de ruteo complejo',
      'Permite programar en Python dentro del Frontend',
      'Aumenta automáticamente el ancho de banda del servidor'
    ],
    answer: 1,
    explanation: 'SvelteKit escanea la estructura de carpetas de `src/routes` para generar las rutas de la aplicación de manera intuitiva y automática.'
  },

  // Tema 2: Componentes avanzados (Props)
  {
    id: 4, tema: 2, type: 'mc',
    question: 'Revisando nuestro componente `SubjectCard.svelte`, observamos la línea `let { title, icon, href } = $props();`. ¿Qué hace esta instrucción en Svelte 5?',
    options: [
      'Exporta estas variables para que sean funciones globales',
      'Desestructura las propiedades (props) que el componente padre le pasa a la tarjeta, reemplazando el antiguo `export let`',
      'Crea un estado reactivo local que no puede ser modificado desde afuera',
      'Define estilos CSS encapsulados para la tarjeta'
    ],
    answer: 1,
    explanation: 'La runa `$props()` es la nueva forma en Svelte 5 de declarar y recibir datos externos desde el componente padre, permitiendo desestructuración limpia.'
  },
  {
    id: 5, tema: 2, type: 'mc',
    question: 'En nuestro componente `SubjectCard.svelte`, la propiedad `boldTitle = false` se define dentro del `$props()`. ¿Qué significa esto?',
    options: [
      'Que el título siempre será en negrita obligatoriamente',
      'Que la variable generará un error si no se envía desde el padre',
      'Es un valor por defecto; si el padre no envía `boldTitle`, el componente asumirá que es `false`',
      'Que el componente solo admite datos booleanos'
    ],
    answer: 2,
    explanation: 'Al desestructurar `$props()`, podemos asignar valores por defecto a las propiedades para evitar errores si el componente padre no las provee.'
  },
  {
    id: 6, tema: 2, type: 'mc',
    question: 'Si quisieras reutilizar el `SubjectCard` para mostrar el curso de Matemáticas, ¿cómo le pasarías las props desde el componente padre?',
    options: [
      '`<SubjectCard title="Matemáticas" icon="🧮" />`',
      '`SubjectCard.title = "Matemáticas"`',
      '`<SubjectCard { title: "Matemáticas", icon: "🧮" } />`',
      '`<SubjectCard data-title="Matemáticas" />`'
    ],
    answer: 0,
    explanation: 'Las props se pasan como atributos HTML regulares dentro de la etiqueta del componente.'
  },

  // Tema 3: Integración de UI y Cards (Bootstrap/Estilos)
  {
    id: 7, tema: 3, type: 'mc',
    question: 'En nuestra plataforma, el componente `SubjectCard.svelte` tiene clases CSS como `subject-card`. Si estuviéramos usando clases puras de Bootstrap para hacer esta tarjeta, ¿qué clases base utilizaríamos?',
    options: [
      '`box box-primary box-text`',
      '`card card-body card-title`',
      '`panel panel-content panel-header`',
      '`container row col`'
    ],
    answer: 1,
    explanation: 'En el ecosistema de Bootstrap, el componente base para tarjetas se estructura usando las clases `card`, `card-body` y `card-title`.'
  },
  {
    id: 8, tema: 3, type: 'mc',
    question: 'Si queremos organizar tres `SubjectCard` una al lado de la otra en una pantalla grande usando el grid de Bootstrap, ¿qué estructura envolvente es la más adecuada?',
    options: [
      '`<div class="row">` con hijos `<div class="col-md-4">`',
      '`<div class="grid">` con hijos `<div class="item-3">`',
      '`<div class="container">` con hijos `<div class="flex-1">`',
      '`<div class="card-group">` sin columnas'
    ],
    answer: 0,
    explanation: 'El sistema de Grid de Bootstrap utiliza `row` para definir filas y `col-md-4` para dividir las 12 columnas disponibles entre 3 tarjetas (12/3 = 4).'
  },
  {
    id: 9, tema: 3, type: 'mc',
    question: 'Al construir tarjetas reutilizables (Cards) para un Dashboard educativo, ¿por qué es importante separar el diseño visual (CSS) de la lógica de datos?',
    options: [
      'Para que el código sea más lento',
      'Permite que el mismo componente (como SubjectCard) pueda renderizar múltiples cursos distintos cambiando solo sus Props (datos), manteniendo la misma apariencia visual',
      'Porque Bootstrap prohíbe mezclar HTML y CSS',
      'Para evitar el uso de bases de datos'
    ],
    answer: 1,
    explanation: 'La separación de diseño y datos a través de componentes permite reutilizar la UI en toda la aplicación inyectando datos diferentes.'
  }
];

export const examConfig = {
  title: 'Parcial 1 - Desarrollo Web 2',
  duration: 45 * 60,
  maxScore: 50,
  passingScore: 30,
  questionsToSelect: {
    1: 3, // 3 preguntas de Rutas
    2: 3, // 3 preguntas de Props
    3: 3  // 3 preguntas de UI/Cards
  }
};
