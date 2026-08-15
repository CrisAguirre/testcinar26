export const questionBank = [
  // Tema 1: Navegación en la aplicación (6 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Qué tipo de enrutamiento utiliza SvelteKit para definir las rutas de la aplicación?',
    options: [
      'Enrutamiento basado en configuración JSON',
      'Enrutamiento basado en el sistema de archivos (filesystem-based routing)',
      'Enrutamiento manual con un router global',
      'Enrutamiento mediante anotaciones decoradoras'
    ],
    answer: 1
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Qué archivo define una página navegable dentro de una ruta en SvelteKit?',
    options: ['`page.svelte`', '`+page.svelte`', '`index.svelte`', '`route.svelte`'],
    answer: 1
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Qué archivo envuelve a las páginas hijas con una estructura común (header, footer, etc.)?',
    options: ['`+layout.svelte`', '`+page.svelte`', '`+error.svelte`', '`+server.ts`'],
    answer: 0
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Cómo se realiza navegación programática en SvelteKit?',
    options: [
      '`window.location = "/ruta"`',
      '`navigate("/ruta")` desde `$app/router`',
      '`goto("/ruta")` desde `$app/navigation`',
      '`redirect("/ruta")` en el template'
    ],
    answer: 2
  },
  {
    id: 5, tema: 1, type: 'mc',
    question: '¿Para qué se usa `redirect(303, "/ruta")` en SvelteKit?',
    options: [
      'Navegación en el cliente tras un clic',
      'Redirección desde las load functions (server-side)',
      'Cargar una imagen de forma diferida',
      'Mostrar un error 404'
    ],
    answer: 1
  },
  {
    id: 6, tema: 1, type: 'mc',
    question: 'Dada la estructura `src/routes/usuario/[id]/+page.svelte`, ¿qué URL resuelve?',
    options: ['`/usuario/id`', '`/usuario/[id]`', '`/usuario/123`', '`/123/usuario`'],
    answer: 2
  },

  // Tema 2: Configuración de la página y SEO (6 MC)
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Qué archivo es la plantilla HTML raíz de un proyecto SvelteKit?',
    options: ['`index.html`', '`app.html`', '`main.html`', '`document.html`'],
    answer: 1
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Qué componente permite inyectar etiquetas en el `<head>` desde cualquier página?',
    options: ['`<svelte:meta>`', '`<svelte:title>`', '`<svelte:head>`', '`<head-tag>`'],
    answer: 2
  },
  {
    id: 9, tema: 2, type: 'mc',
    question: '¿Qué placeholder de `app.html` es reemplazado por el contenido renderizado de la aplicación?',
    options: ['`%sveltekit.head%`', '`%sveltekit.body%`', '`%sveltekit.assets%`', '`%sveltekit.app%`'],
    answer: 1
  },
  {
    id: 10, tema: 2, type: 'mc',
    question: '¿Cuál es el propósito de la etiqueta `<meta name="description">` dentro de `<svelte:head>`?',
    options: [
      'Cambiar el color de fondo de la página',
      'Proveer una descripción que los buscadores muestran en los resultados (SEO)',
      'Cargar una hoja de estilos externa',
      'Definir el idioma del documento'
    ],
    answer: 1
  },
  {
    id: 11, tema: 2, type: 'mc',
    question: '¿Cuál es la diferencia principal entre `+page.ts` y `+page.server.ts`?',
    options: [
      'No hay diferencia, ambos son idénticos',
      '`+page.ts` corre en el cliente (CSR) y `+page.server.ts` en el servidor (SSR)',
      '`+page.ts` solo sirve para estilos',
      '`+page.server.ts` solo funciona con bases de datos'
    ],
    answer: 1
  },
  {
    id: 12, tema: 2, type: 'mc',
    question: '¿En qué archivo conviene ejecutar lógica que use secretos o tokens del servidor?',
    options: ['`+page.ts`', '`+layout.ts`', '`+page.server.ts`', 'Cualquiera, es lo mismo'],
    answer: 2
  },

  // Tema 3: Manejo de datos (6 MC)
  {
    id: 13, tema: 3, type: 'mc',
    question: 'En Svelte 5, ¿qué rune se usa para declarar una variable reactiva?',
    options: ['`$state()`', '`$props()`', '`$derived()`', '`$effect()`'],
    answer: 0
  },
  {
    id: 14, tema: 3, type: 'mc',
    question: '¿Qué rune calcula un valor derivado que se recalcula cuando cambian sus dependencias?',
    options: ['`$state()`', '`$derived()`', '`$props()`', '`$effect()`'],
    answer: 1
  },
  {
    id: 15, tema: 3, type: 'mc',
    question: '¿Cómo se reciben las propiedades (props) del componente padre en Svelte 5?',
    options: ['`export let prop`', '`let prop = $props()`', '`let { prop } = $props()`', '`@Prop prop`'],
    answer: 2
  },
  {
    id: 16, tema: 3, type: 'mc',
    question: '¿Qué directiva crea un enlace bidireccional entre un input y una variable?',
    options: ['`on:input`', '`bind:value`', '`model:value`', '`sync:value`'],
    answer: 1
  },
  {
    id: 17, tema: 3, type: 'mc',
    question: '¿Qué función de `svelte/store` crea un store global escribible?',
    options: ['`readable()`', '`derived()`', '`writable()`', '`store()`'],
    answer: 2
  },
  {
    id: 18, tema: 3, type: 'mc',
    question: '¿Cómo se accede al valor de un store dentro del template de Svelte?',
    options: [
      'Con paréntesis: `(miStore)`',
      'Con el prefijo `$`: `{$miStore}`',
      'Con `await miStore`',
      'Con `miStore.value`'
    ],
    answer: 1
  },

  // Tema 4: Interactividad (6 MC)
  {
    id: 19, tema: 4, type: 'mc',
    question: '¿Qué directiva se usa para escuchar un clic en Svelte?',
    options: ['`@click`', '`on:click`', '`onclick={handler}`', '`(click)`'],
    answer: 2
  },
  {
    id: 20, tema: 4, type: 'mc',
    question: '¿Qué modificador evita el comportamiento por defecto del envío de un formulario?',
    options: [
      '`onsubmit|stopPropagation`',
      '`onsubmit|preventDefault`',
      '`onsubmit|self`',
      '`onsubmit|once`'
    ],
    answer: 1
  },
  {
    id: 21, tema: 4, type: 'mc',
    question: '¿Qué función del ciclo de vida se ejecuta una sola vez al montar el componente?',
    options: ['`onMount(fn)`', '`onDestroy(fn)`', '`$effect(fn)`', '`onUpdate(fn)`'],
    answer: 0
  },
  {
    id: 22, tema: 4, type: 'mc',
    question: 'En Svelte 5, ¿qué reemplaza a las declaraciones reactivas `$:` de Svelte 4?',
    options: ['`$state()`', '`$derived()`', '`$effect()`', '`$props()`'],
    answer: 2
  },
  {
    id: 23, tema: 4, type: 'mc',
    question: '¿Qué directiva permite detectar que el usuario presiona una tecla?',
    options: ['`onkeydown={handler}`', '`oninput={handler}`', '`onchange={handler}`', '`onfocus={handler}`'],
    answer: 0
  },
  {
    id: 24, tema: 4, type: 'mc',
    question: '¿Qué se debe hacer típicamente en `onDestroy`?',
    options: [
      'Inicializar el estado global',
      'Limpiar recursos: `clearInterval` y `removeEventListener`',
      'Renderizar el DOM inicial',
      'Hacer la primera petición fetch'
    ],
    answer: 1
  },

  // Tema 5: Estructuras de control (6 MC + 2 open)
  {
    id: 25, tema: 5, type: 'mc',
    question: '¿Qué bloque se usa para renderizado condicional en Svelte?',
    options: ['`{#if}`', '`{#each}`', '`{#await}`', '`{@html}`'],
    answer: 0
  },
  {
    id: 26, tema: 5, type: 'mc',
    question: '¿Qué bloque se usa para iterar sobre un array en Svelte?',
    options: ['`{#if}`', '`{#each}`', '`{#loop}`', '`{@each}`'],
    answer: 1
  },
  {
    id: 27, tema: 5, type: 'mc',
    question: '¿Cómo se renderiza HTML crudo en Svelte?',
    options: ['`{@html contenido}`', '`{html}`', '`<div>{{contenido}}</div>`', '`{@render contenido}`'],
    answer: 0
  },
  {
    id: 28, tema: 5, type: 'mc',
    question: 'En Svelte 5, ¿cómo se renderiza el contenido de un slot dentro de un layout?',
    options: ['`<slot />`', '`{@render children()}`', '`{@html children}`', '`{children}`'],
    answer: 1
  },
  {
    id: 29, tema: 5, type: 'mc',
    question: '¿Qué bloque permite manejar el estado de una promesa (cargando/resuelta/error)?',
    options: ['`{#if}`', '`{#each}`', '`{#await}`', '`{@promise}`'],
    answer: 2
  },
  {
    id: 30, tema: 5, type: 'mc',
    question: 'En `{#each items as item, i}`, ¿qué representa `i`?',
    options: ['El valor del elemento', 'El índice (posición) del elemento', 'El largo del array', 'Un identificador único'],
    answer: 1
  },
  {
    id: 31, tema: 5, type: 'open',
    question: 'Explica la diferencia entre `{#if}` y `{#each}` en Svelte y describe una situación en la que usarías cada uno.'
  },
  {
    id: 32, tema: 5, type: 'open',
    question: '¿Qué es un slot en un componente de Svelte y cómo se renderiza en Svelte 5? Da un ejemplo breve.'
  },

  // Tema 6: Conexión con datos externos (6 MC + 2 open)
  {
    id: 33, tema: 6, type: 'mc',
    question: '¿Qué API nativa de JavaScript se usa para consumir datos de un servidor?',
    options: ['`fetch()`', '`http()`', '`request()`', '`axios()`'],
    answer: 0
  },
  {
    id: 34, tema: 6, type: 'mc',
    question: '¿Qué header HTTP se usa para enviar un token JWT al servidor?',
    options: [
      '`Authorization: Bearer <token>`',
      '`Token: <token>`',
      '`X-Auth: <token>`',
      '`Auth: <token>`'
    ],
    answer: 0
  },
  {
    id: 35, tema: 6, type: 'mc',
    question: '¿Qué método permite ejecutar varias promesas en paralelo y esperar a todas?',
    options: ['`Promise.race()`', '`Promise.all()`', '`Promise.any()`', '`Promise.serial()`'],
    answer: 1
  },
  {
    id: 36, tema: 6, type: 'mc',
    question: 'En este proyecto, ¿dónde se guarda el token de autenticación en el navegador?',
    options: ['`sessionStorage`', '`localStorage`', 'Una cookie httpOnly', 'En la URL'],
    answer: 1
  },
  {
    id: 37, tema: 6, type: 'mc',
    question: '¿Qué patrón se recomienda para el manejo de errores en operaciones asíncronas?',
    options: ['`if/else`', '`try/catch/finally`', '`switch/case`', '`for/while`'],
    answer: 1
  },
  {
    id: 38, tema: 6, type: 'mc',
    question: '¿Qué prefijo deben tener las variables de entorno para quedar expuestas al cliente en Vite?',
    options: ['`VITE_`', '`PUBLIC_`', '`ENV_`', '`CLIENT_`'],
    answer: 0
  },
  {
    id: 39, tema: 6, type: 'open',
    question: 'Describe el flujo completo de una petición autenticada: desde el login del usuario hasta la respuesta del servidor (token → request → response).'
  },
  {
    id: 40, tema: 6, type: 'open',
    question: '¿Qué es una API REST y cuáles son sus verbos HTTP principales? Da un ejemplo con Express.js.'
  }
];

export function selectRandomQuestions(count = 20) {
  const baseDistribution = [
    { tema: 1, count: 3 },
    { tema: 2, count: 3 },
    { tema: 3, count: 3 },
    { tema: 4, count: 3 },
    { tema: 5, count: 4 },
    { tema: 6, count: 4 }
  ];

  const totalBase = baseDistribution.reduce((s, d) => s + d.count, 0);

  let distribution;
  if (count !== totalBase) {
    const factor = count / totalBase;
    distribution = baseDistribution.map(d => ({
      tema: d.tema,
      count: Math.max(1, Math.round(d.count * factor))
    }));
    let diff = count - distribution.reduce((s, d) => s + d.count, 0);
    let i = 0;
    while (diff !== 0) {
      const idx = i % distribution.length;
      if (diff > 0) {
        const pool = questionBank.filter(q => q.tema === distribution[idx].tema);
        if (distribution[idx].count < pool.length) {
          distribution[idx].count++;
          diff--;
        }
      } else {
        if (distribution[idx].count > 1) {
          distribution[idx].count--;
          diff++;
        }
      }
      i++;
    }
  } else {
    distribution = baseDistribution;
  }

  const selected = [];

  for (const dist of distribution) {
    const pool = questionBank.filter(q => q.tema === dist.tema);
    if (pool.length < dist.count) {
      throw new Error(`No hay suficientes preguntas para tema ${dist.tema}: se requieren ${dist.count}, hay ${pool.length}`);
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, dist.count));
  }

  return selected.sort(() => Math.random() - 0.5);
}
