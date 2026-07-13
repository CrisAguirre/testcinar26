export const questionBank = [
  // Tema 1: Introducción a Svelte — Creación de nuevo proyecto (6 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Qué comando se utiliza para crear un nuevo proyecto Svelte con la CLI oficial?',
    options: ['`svelte create my-app`', '`sv create my-app`', '`npx svelte init my-app`', '`npm create svelte-app my-app`'],
    answer: 1
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Qué archivo se genera automáticamente al crear un proyecto SvelteKit con TypeScript?',
    options: ['`tsconfig.json`', '`typescript.config.json`', '`jsconfig.json`', '`svelte.config.ts`'],
    answer: 0
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Cuál es la diferencia principal entre Svelte y frameworks como React o Vue?',
    options: [
      'Svelte usa un DOM virtual',
      'Svelte compila los componentes en tiempo de build, no en tiempo de ejecución',
      'Svelte solo funciona con TypeScript',
      'Svelte no permite crear componentes reutilizables'
    ],
    answer: 1
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Qué bandera se usa en `sv create` para instalar las dependencias automáticamente?',
    options: ['`--auto-install`', '`--install`', '`--npm`', '`--deps`'],
    answer: 1
  },
  {
    id: 5, tema: 1, type: 'mc',
    question: '¿Cuál de los siguientes NO es un template disponible en `sv create`?',
    options: ['`demo`', '`minimal`', '`enterprise`', '`library`'],
    answer: 2
  },
  {
    id: 6, tema: 1, type: 'mc',
    question: '¿Qué significa que Svelte sea un "compilador" en lugar de un "framework de runtime"?',
    options: [
      'Que necesita un servidor para ejecutarse',
      'Que transforma los componentes en JavaScript puro durante el build',
      'Que solo funciona con TypeScript',
      'Que no se puede usar con Node.js'
    ],
    answer: 1
  },

  // Tema 2: Estructura de carpetas Svelte (6 MC)
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Cuál es la función de la carpeta `src/routes/` en un proyecto SvelteKit?',
    options: [
      'Almacenar imágenes y archivos estáticos',
      'Definir el enrutamiento basado en el sistema de archivos',
      'Contener los estilos globales de la aplicación',
      'Almacenar las dependencias del proyecto'
    ],
    answer: 1
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Qué archivo actúa como plantilla HTML principal en SvelteKit?',
    options: ['`index.html`', '`app.html`', '`main.html`', '`layout.html`'],
    answer: 1
  },
  {
    id: 9, tema: 2, type: 'mc',
    question: '¿Dónde se deben colocar los archivos estáticos como imágenes o fuentes en un proyecto SvelteKit?',
    options: ['`src/lib/`', '`src/static/`', '`static/`', '`public/`'],
    answer: 2
  },
  {
    id: 10, tema: 2, type: 'mc',
    question: '¿Qué convención de nombres se usa para definir el componente de layout en SvelteKit?',
    options: ['`layout.svelte`', '`+layout.svelte`', '`_layout.svelte`', '`app-layout.svelte`'],
    answer: 1
  },
  {
    id: 11, tema: 2, type: 'mc',
    question: '¿Cuál es el propósito de la carpeta `src/lib/` en SvelteKit?',
    options: [
      'Almacenar componentes y módulos reutilizables',
      'Definir las rutas de la aplicación',
      'Contener archivos estáticos',
      'Almacenar las dependencias npm'
    ],
    answer: 0
  },
  {
    id: 12, tema: 2, type: 'mc',
    question: 'En la estructura de SvelteKit, ¿qué archivo se usa para configurar el comportamiento del servidor de desarrollo y build?',
    options: ['`svelte.config.js`', '`vite.config.ts`', '`app.html`', '`package.json`'],
    answer: 1
  },

  // Tema 3: Principios de diseño web responsive (6 MC)
  {
    id: 13, tema: 3, type: 'mc',
    question: '¿Cuál de los siguientes NO es un principio fundamental del diseño responsive?',
    options: ['Rejillas flexibles', 'Imágenes flexibles', 'Uso exclusivo de píxeles fijos', 'Media queries'],
    answer: 2
  },
  {
    id: 14, tema: 3, type: 'mc',
    question: '¿Qué etiqueta HTML es esencial en el `<head>` para habilitar el diseño responsive en dispositivos móviles?',
    options: [
      '`<meta name="viewport" content="width=device-width, initial-scale=1.0">`',
      '`<meta name="responsive" content="true">`',
      '`<meta name="mobile" content="enabled">`',
      '`<meta name="device" content="responsive">`'
    ],
    answer: 0
  },
  {
    id: 15, tema: 3, type: 'mc',
    question: '¿Qué unidad CSS es relativa al tamaño de la ventana gráfica (viewport)?',
    options: ['`px`', '`em`', '`vh` / `vw`', '`pt`'],
    answer: 2
  },
  {
    id: 16, tema: 3, type: 'mc',
    question: '¿Cuál es el enfoque recomendado al diseñar responsive?',
    options: [
      'Desktop-first',
      'Mobile-first, porque facilita la escalabilidad y el rendimiento',
      'Da igual, ambos producen el mismo resultado',
      'Ninguno'
    ],
    answer: 1
  },
  {
    id: 17, tema: 3, type: 'mc',
    question: '¿Qué significa CSS Grid en diseño responsive?',
    options: [
      'Un sistema de diseño unidimensional para filas',
      'Un sistema de diseño bidimensional para filas y columnas',
      'Una propiedad para ocultar elementos',
      'Un framework de diseño'
    ],
    answer: 1
  },
  {
    id: 18, tema: 3, type: 'mc',
    question: '¿Cuál es la ventaja principal de usar unidades relativas (%, em, rem) sobre unidades absolutas (px)?',
    options: [
      'Son más rápidas de escribir',
      'Se adaptan automáticamente al tamaño del contenedor o fuente base',
      'Son compatibles con todos los navegadores',
      'No requieren media queries'
    ],
    answer: 1
  },

  // Tema 4: Componentes básicos y estructura funcional Svelte (6 MC)
  {
    id: 19, tema: 4, type: 'mc',
    question: '¿Qué etiqueta se usa dentro de un componente `.svelte` para escribir la lógica JavaScript?',
    options: ['`<js>`', '`<logic>`', '`<script>`', '`<javascript>`'],
    answer: 2
  },
  {
    id: 20, tema: 4, type: 'mc',
    question: '¿Cómo se declara una prop (propiedad) en un componente Svelte?',
    options: ['`let prop = $prop()`', '`export let prop`', '`import let prop`', '`@prop let prop`'],
    answer: 1
  },
  {
    id: 21, tema: 4, type: 'mc',
    question: '¿Qué directiva se usa en Svelte para enlazar un valor de un input a una variable reactiva?',
    options: ['`on:input`', '`bind:value`', '`model:value`', '`:value`'],
    answer: 1
  },
  {
    id: 22, tema: 4, type: 'mc',
    question: '¿Qué hace `$:` en Svelte?',
    options: [
      'Declara una variable global',
      'Define una declaración reactiva que se re-ejecuta cuando cambian sus dependencias',
      'Importa un componente',
      'Define un evento'
    ],
    answer: 1
  },
  {
    id: 23, tema: 4, type: 'mc',
    question: '¿Cómo se aplican estilos específicos a un componente en Svelte?',
    options: [
      'Los estilos son globales por defecto',
      'Los estilos dentro de `<style>` tienen alcance (scoped) al componente automáticamente',
      'Se usa `style scoped` como en Vue',
      'No se pueden aplicar estilos a componentes'
    ],
    answer: 1
  },
  {
    id: 24, tema: 4, type: 'mc',
    question: '¿Qué etiqueta se usa para renderizar contenido condicionalmente en Svelte?',
    options: ['`@if`', '`{#if}`', '`<If>`', '`*ngIf`'],
    answer: 1
  },

  // Tema 5: Metodología Scrum Agile (7 MC + 2 Open)
  {
    id: 25, tema: 5, type: 'mc',
    question: '¿Qué es SCRUM?',
    options: [
      'Un lenguaje de programación',
      'Un proceso iterativo e incremental para el desarrollo de software',
      'Una herramienta de testing',
      'Un tipo de base de datos'
    ],
    answer: 1
  },
  {
    id: 26, tema: 5, type: 'mc',
    question: '¿Cuál es el rol del Product Owner en SCRUM?',
    options: [
      'Asegurar que el equipo siga la metodología',
      'Conocer y marcar las prioridades del proyecto o producto',
      'Escribir todo el código del equipo',
      'Realizar las pruebas de aceptación'
    ],
    answer: 1
  },
  {
    id: 27, tema: 5, type: 'mc',
    question: '¿Cómo se llama el artefacto que contiene la lista maestra con toda la funcionalidad deseada en el producto?',
    options: ['Sprint Backlog', 'Product Backlog', 'Burndown Chart', 'Definition of Done'],
    answer: 1
  },
  {
    id: 28, tema: 5, type: 'mc',
    question: '¿Qué artefacto muestra un acumulativo del trabajo hecho día a día?',
    options: ['Product Backlog', 'Sprint Backlog', 'Burndown Chart', 'Kanban Board'],
    answer: 2
  },
  {
    id: 29, tema: 5, type: 'mc',
    question: '¿Quién es la persona que asegura el seguimiento de la metodología SCRUM y guía las reuniones?',
    options: ['Product Owner', 'Scrum Master', 'Scrum Team', 'Usuario final'],
    answer: 1
  },
  {
    id: 30, tema: 5, type: 'mc',
    question: '¿Cuál de los siguientes es un principio de SCRUM?',
    options: ['Entregar rápido', 'Documentación exhaustiva', 'Contratos rigurosos', 'Roles jerárquicos estrictos'],
    answer: 0
  },
  {
    id: 31, tema: 5, type: 'mc',
    question: '¿Qué tipo de requerimientos se recomienda para aplicar SCRUM?',
    options: [
      'Requerimientos estáticos y bien definidos desde el inicio',
      'Requerimientos dinámicos donde el "caos" es una constante',
      'Proyectos con equipos de más de 50 personas',
      'Proyectos con contratos fijos e inamovibles'
    ],
    answer: 1
  },
  {
    id: 32, tema: 5, type: 'open',
    question: '¿Cuáles son los componentes de una metodología Scrum? Menciona y explica brevemente los roles, artefactos y eventos principales.'
  },
  {
    id: 33, tema: 5, type: 'open',
    question: '¿Qué es una metodología de desarrollo? Explica su importancia en la ingeniería de software.'
  },

  // Tema 6: Conceptos fundamentales de Git (8 MC + 1 Open)
  {
    id: 34, tema: 6, type: 'mc',
    question: '¿Qué comando de Git se usa para crear una copia local de un repositorio remoto?',
    options: ['`git clone`', '`git fork`', '`git copy`', '`git remote`'],
    answer: 0
  },
  {
    id: 35, tema: 6, type: 'mc',
    question: '¿Qué comando permite ver el estado actual del repositorio (archivos modificados, agregados, etc.)?',
    options: ['`git check`', '`git status`', '`git log`', '`git diff`'],
    answer: 1
  },
  {
    id: 36, tema: 6, type: 'mc',
    question: '¿Cómo se agregan todos los archivos modificados al área de staging?',
    options: ['`git add .`', '`git commit -a`', '`git push .`', '`git stage all`'],
    answer: 0
  },
  {
    id: 37, tema: 6, type: 'mc',
    question: '¿Qué comando guarda los cambios en el repositorio local con un mensaje descriptivo?',
    options: ['`git save -m "mensaje"`', '`git commit -m "mensaje"`', '`git push -m "mensaje"`', '`git store -m "mensaje"`'],
    answer: 1
  },
  {
    id: 38, tema: 6, type: 'mc',
    question: '¿Cuál es la diferencia entre `git pull` y `git fetch`?',
    options: [
      'No hay diferencia',
      '`git pull` trae cambios y los fusiona automáticamente; `git fetch` solo descarga los cambios sin fusionar',
      '`git fetch` trae cambios y los fusiona; `git pull` solo descarga',
      '`git pull` funciona solo con repositorios públicos'
    ],
    answer: 1
  },
  {
    id: 39, tema: 6, type: 'mc',
    question: '¿Qué comando se usa para enviar los commits locales al repositorio remoto?',
    options: ['`git send`', '`git upload`', '`git push`', '`git remote`'],
    answer: 2
  },
  {
    id: 40, tema: 6, type: 'mc',
    question: '¿Qué comando permite crear una nueva rama (branch) en Git?',
    options: ['`git branch nombre-rama`', '`git new-branch nombre-rama`', '`git checkout --branch nombre-rama`', '`git create nombre-rama`'],
    answer: 0
  },
  {
    id: 41, tema: 6, type: 'mc',
    question: '¿Qué comando se usa para cambiar de una rama a otra en Git?',
    options: ['`git switch nombre-rama`', '`git change nombre-rama`', '`git move nombre-rama`', '`git go nombre-rama`'],
    answer: 0
  },
  {
    id: 42, tema: 6, type: 'open',
    question: '¿Qué es un repositorio? Explica la diferencia entre un repositorio local y uno remoto en Git.'
  },

  // Tema 7: Concepto de stack y arquitectura de software (6 MC + 12 Open)
  {
    id: 43, tema: 7, type: 'mc',
    question: '¿Qué significa el término "stack tecnológico" en desarrollo de software?',
    options: [
      'La pila de ejecución de un programa',
      'El conjunto de tecnologías usadas para construir una aplicación',
      'La cantidad de memoria RAM utilizada por el sistema',
      'El orden en que se ejecutan las pruebas'
    ],
    answer: 1
  },
  {
    id: 44, tema: 7, type: 'mc',
    question: '¿Cuál de los siguientes es un ejemplo de stack tecnológico completo?',
    options: [
      'MERN (MongoDB, Express, React, Node.js)',
      'HTML + CSS',
      'Windows + Linux',
      'MySQL únicamente'
    ],
    answer: 0
  },
  {
    id: 45, tema: 7, type: 'mc',
    question: 'En una arquitectura de tres capas (three-tier), ¿cuáles son las capas?',
    options: [
      'Usuario, administrador, superusuario',
      'Presentación, lógica de negocio, datos',
      'Frontend, backend, DevOps',
      'Cliente, servidor, router'
    ],
    answer: 1
  },
  {
    id: 46, tema: 7, type: 'mc',
    question: '¿Qué tipo de arquitectura divide la aplicación en servicios independientes y autónomos?',
    options: ['Arquitectura monolítica', 'Arquitectura de microservicios', 'Arquitectura cliente-servidor', 'Arquitectura en capas'],
    answer: 1
  },
  {
    id: 47, tema: 7, type: 'mc',
    question: '¿Cuáles son los verbos HTTP más comunes en una API REST?',
    options: ['RUN, STOP, START, DELETE', 'GET, POST, PUT, DELETE', 'READ, WRITE, UPDATE, DELETE', 'ADD, REMOVE, MODIFY, GET'],
    answer: 1
  },
  {
    id: 48, tema: 7, type: 'mc',
    question: '¿Qué es Node.js?',
    options: [
      'Un framework frontend como React',
      'Un entorno de ejecución de JavaScript del lado del servidor',
      'Una base de datos NoSQL',
      'Un sistema operativo'
    ],
    answer: 1
  },
  {
    id: 49, tema: 7, type: 'open',
    question: '¿Qué es frontend? Explica su función en una aplicación web.'
  },
  {
    id: 50, tema: 7, type: 'open',
    question: '¿Qué es backend? Explica su función en una aplicación web.'
  },
  {
    id: 51, tema: 7, type: 'open',
    question: '¿Qué tipos de bases de datos existen? Menciona y explica brevemente al menos tres tipos.'
  },
  {
    id: 52, tema: 7, type: 'open',
    question: '¿Qué es un framework? Da un ejemplo de framework frontend y uno backend.'
  },
  {
    id: 53, tema: 7, type: 'open',
    question: '¿Qué es un lenguaje de programación? Menciona al menos tres que conozcas.'
  },
  {
    id: 54, tema: 7, type: 'open',
    question: '¿Qué es un editor de código? Menciona al menos dos que conozcas o hayas utilizado.'
  },
  {
    id: 55, tema: 7, type: 'open',
    question: '¿Cuáles son las IAs que conoce o con las que ha trabajado? Menciona al menos tres y explica brevemente para qué las has usado.'
  },
  {
    id: 56, tema: 7, type: 'open',
    question: '¿Qué plataformas de despliegue conoce o ha trabajado? Menciona al menos dos y explica su propósito.'
  },
  {
    id: 57, tema: 7, type: 'open',
    question: '¿Qué es un stack tecnológico? Explica con un ejemplo concreto.'
  },
  {
    id: 58, tema: 7, type: 'open',
    question: '¿Qué tipo de proyecto le gustaría crear para aplicar los conceptos de stack y arquitectura? Describe brevemente la idea.'
  },
  {
    id: 59, tema: 7, type: 'open',
    question: '¿Qué es el testing en desarrollo de software? Explica su importancia.'
  },
  {
    id: 60, tema: 7, type: 'open',
    question: '¿Qué es un algoritmo? Da un ejemplo de la vida cotidiana.'
  }
];

export function selectRandomQuestions(count = 20) {
  const distribution = [
    { tema: 1, count: 2 },
    { tema: 2, count: 2 },
    { tema: 3, count: 2 },
    { tema: 4, count: 2 },
    { tema: 5, count: 3 },
    { tema: 6, count: 3 },
    { tema: 7, count: 6 }
  ];

  const selected = [];

  for (const dist of distribution) {
    const pool = questionBank.filter(q => q.tema === dist.tema);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, dist.count));
  }

  return selected.sort(() => Math.random() - 0.5);
}
