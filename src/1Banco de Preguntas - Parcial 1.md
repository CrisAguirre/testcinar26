# Banco de Preguntas - Parcial 1
## Guía de Estudio —Desarrollo Web 1

**60 preguntas (45 selección múltiple + 15 abiertas) con respuestas y justificación**

---

## Tema 1: Introducción a Svelte — Creación de nuevo proyecto (6 preguntas)

**Pregunta 1** — ¿Qué comando se utiliza para crear un nuevo proyecto Svelte con la CLI oficial?
a) `svelte create my-app`
b) `sv create my-app`
c) `npx svelte init my-app`
d) `npm create svelte-app my-app`

**Respuesta:** b) `sv create my-app`
**Justificación:** La CLI oficial de Svelte se llama `sv`. El comando `sv create` reemplaza al antiguo `npm create svelte@latest` y permite crear proyectos con diferentes templates.

---

**Pregunta 2** — ¿Qué archivo se genera automáticamente al crear un proyecto SvelteKit con TypeScript?
a) `tsconfig.json`
b) `typescript.config.json`
c) `jsconfig.json`
d) `svelte.config.ts`

**Respuesta:** a) `tsconfig.json`
**Justificación:** Al elegir TypeScript (`--types ts`), SvelteKit genera automáticamente el archivo `tsconfig.json` para configurar el compilador de TypeScript, junto con `vite.config.ts`.

---

**Pregunta 3** — ¿Cuál es la diferencia principal entre Svelte y frameworks como React o Vue?
a) Svelte usa un DOM virtual
b) Svelte compila los componentes en tiempo de build, no en tiempo de ejecución
c) Svelte solo funciona con TypeScript
d) Svelte no permite crear componentes reutilizables

**Respuesta:** b) Svelte compila los componentes en tiempo de build, no en tiempo de ejecución
**Justificación:** Svelte es un compilador, no un framework de runtime. Transforma los componentes `.svelte` en JavaScript puro y eficiente durante el build, eliminando la necesidad de un DOM virtual o librerías en tiempo de ejecución.

---

**Pregunta 4** — ¿Qué bandera se usa en `sv create` para instalar las dependencias automáticamente?
a) `--auto-install`
b) `--install`
c) `--npm`
d) `--deps`

**Respuesta:** b) `--install`
**Justificación:** La bandera `--install` acepta el gestor de paquetes deseado (`npm`, `pnpm`, `yarn`, `bun`, `deno`). Sin ella, el CLI pregunta interactivamente.

---

**Pregunta 5** — ¿Cuál de los siguientes NO es un template disponible en `sv create`?
a) `demo`
b) `minimal`
c) `enterprise`
d) `library`

**Respuesta:** c) `enterprise`
**Justificación:** Los templates oficiales son: `minimal` (estructura básica), `demo` (proyecto con ejemplos como juego Sverdle), `library` (para crear librerías Svelte) y `addon`. No existe un template "enterprise".

---

**Pregunta 6** — ¿Qué significa que Svelte sea un "compilador" en lugar de un "framework de runtime"?
a) Que necesita un servidor para ejecutarse
b) Que transforma los componentes en JavaScript puro durante el build
c) Que solo funciona con TypeScript
d) Que no se puede usar con Node.js

**Respuesta:** b) Que transforma los componentes en JavaScript puro durante el build
**Justificación:** A diferencia de React (que usa un DOM virtual en el navegador) o Vue (que usa un runtime reactivo), Svelte convierte cada componente en código JavaScript imperativo optimizado durante la compilación. Esto da como resultado bundles más pequeños y mejor rendimiento.

---

## Tema 2: Estructura de carpetas Svelte y organización del proyecto (6 preguntas)

**Pregunta 7** — ¿Cuál es la función de la carpeta `src/routes/` en un proyecto SvelteKit?
a) Almacenar imágenes y archivos estáticos
b) Definir el enrutamiento basado en el sistema de archivos
c) Contener los estilos globales de la aplicación
d) Almacenar las dependencias del proyecto

**Respuesta:** b) Definir el enrutamiento basado en el sistema de archivos
**Justificación:** SvelteKit usa enrutamiento basado en archivos (filesystem-based routing). Cada archivo `.svelte` dentro de `src/routes/` se convierte automáticamente en una ruta de la aplicación.

---

**Pregunta 8** — ¿Qué archivo actúa como plantilla HTML principal en SvelteKit?
a) `index.html`
b) `app.html`
c) `main.html`
d) `layout.html`

**Respuesta:** b) `app.html`
**Justificación:** `src/app.html` es la plantilla HTML base. Contiene los placeholders `%sveltekit.head%` y `%sveltekit.body%` donde SvelteKit inyecta el contenido de la aplicación.

---

**Pregunta 9** — ¿Dónde se deben colocar los archivos estáticos como imágenes o fuentes en un proyecto SvelteKit?
a) `src/lib/`
b) `src/static/`
c) `static/`
d) `public/`

**Respuesta:** c) `static/`
**Justificación:** La carpeta `static/` es para archivos estáticos que se sirven tal cual (imágenes, fuentes, favicon, etc.). Se acceden desde la raíz del proyecto (ej: `/imagen.png`).

---

**Pregunta 10** — ¿Qué convención de nombres se usa para definir el componente de layout en SvelteKit?
a) `layout.svelte`
b) `+layout.svelte`
c) `_layout.svelte`
d) `app-layout.svelte`

**Respuesta:** b) `+layout.svelte`
**Justificación:** SvelteKit usa el prefijo `+` para archivos especiales: `+layout.svelte` (layout compartido), `+page.svelte` (página), `+server.js` (endpoint), etc.

---

**Pregunta 11** — ¿Cuál es el propósito de la carpeta `src/lib/` en SvelteKit?
a) Almacenar componentes y módulos reutilizables
b) Definir las rutas de la aplicación
c) Contener archivos estáticos
d) Almacenar las dependencias npm

**Respuesta:** a) Almacenar componentes y módulos reutilizables
**Justificación:** `src/lib/` es el lugar para componentes, utilidades y módulos que se reutilizan en toda la aplicación. Se acceden con el alias `$lib/` (ej: `import Componente from '$lib/Componente.svelte'`).

---

**Pregunta 12** — En la estructura de SvelteKit, ¿qué archivo se usa para configurar el comportamiento del servidor de desarrollo y build?
a) `svelte.config.js`
b) `vite.config.ts`
c) `app.html`
d) `package.json`

**Respuesta:** b) `vite.config.ts`
**Justificación:** SvelteKit usa Vite como bundler. El archivo `vite.config.ts` configura plugins, optimizaciones, alias y el comportamiento del servidor de desarrollo. Aunque `svelte.config.js` también existe para opciones específicas de Svelte, la configuración del servidor y build se maneja en `vite.config.ts`.

---

## Tema 3: Principios de diseño web responsive (6 preguntas)

**Pregunta 13** — ¿Cuál de los siguientes NO es un principio fundamental del diseño responsive?
a) Rejillas flexibles
b) Imágenes flexibles
c) Uso exclusivo de píxeles fijos
d) Media queries

**Respuesta:** c) Uso exclusivo de píxeles fijos
**Justificación:** El diseño responsive se basa en rejillas flexibles, imágenes flexibles y media queries. Usar exclusivamente píxeles fijos impide que el diseño se adapte a diferentes tamaños de pantalla.

---

**Pregunta 14** — ¿Qué etiqueta HTML es esencial en el `<head>` para habilitar el diseño responsive en dispositivos móviles?
a) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
b) `<meta name="responsive" content="true">`
c) `<meta name="mobile" content="enabled">`
d) `<meta name="device" content="responsive">`

**Respuesta:** a) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
**Justificación:** Esta metaetiqueta le dice al navegador que el ancho de la ventana es igual al ancho del dispositivo y establece el nivel de zoom inicial. Sin ella, los móviles renderizan la página como si fuera de escritorio y hacen zoom out.

---

**Pregunta 15** — ¿Qué unidad CSS es relativa al tamaño de la ventana gráfica (viewport)?
a) `px`
b) `em`
c) `vh` / `vw`
d) `pt`

**Respuesta:** c) `vh` / `vw`
**Justificación:** `vh` (viewport height) es el 1% de la altura del viewport y `vw` (viewport width) es el 1% del ancho. `px` es absoluta, `em` es relativa al font-size del elemento padre y `pt` es absoluta (puntos).

---

**Pregunta 16** — ¿Cuál es el enfoque recomendado al diseñar responsive?
a) Desktop-first
b) Mobile-first, porque facilita la escalabilidad y el rendimiento
c) Da igual, ambos producen el mismo resultado
d) Ninguno

**Respuesta:** b) Mobile-first
**Justificación:** El enfoque mobile-first consiste en diseñar primero para pantallas pequeñas y luego añadir mejoras para pantallas más grandes con media queries `min-width`. Esto fuerza a priorizar el contenido esencial y mejora el rendimiento en dispositivos móviles.

---

**Pregunta 17** — ¿Qué significa CSS Grid en diseño responsive?
a) Un sistema de diseño unidimensional para filas
b) Un sistema de diseño bidimensional para filas y columnas
c) Una propiedad para ocultar elementos
d) Un framework de diseño

**Respuesta:** b) Un sistema de diseño bidimensional para filas y columnas
**Justificación:** CSS Grid Layout permite crear diseños bidimensionales (filas y columnas simultáneamente), facilitando la creación de layouts responsive complejos sin necesidad de frameworks externos.

---

**Pregunta 18** — ¿Cuál es la ventaja principal de usar unidades relativas (%, em, rem) sobre unidades absolutas (px)?
a) Son más rápidas de escribir
b) Se adaptan automáticamente al tamaño del contenedor o fuente base
c) Son compatibles con todos los navegadores
d) No requieren media queries

**Respuesta:** b) Se adaptan automáticamente al tamaño del contenedor o fuente base
**Justificación:** Las unidades relativas permiten que los elementos escalen proporcionalmente cuando cambia el tamaño del contenedor o la fuente base del usuario, lo que es esencial para el diseño responsive y la accesibilidad.

---

## Tema 4: Componentes básicos y estructura funcional Svelte (6 preguntas)

**Pregunta 19** — ¿Qué etiqueta se usa dentro de un componente `.svelte` para escribir la lógica JavaScript?
a) `<js>`
b) `<logic>`
c) `<script>`
d) `<javascript>`

**Respuesta:** c) `<script>`
**Justificación:** En Svelte, la lógica del componente se escribe dentro de una etiqueta `<script>` (similar a HTML tradicional). Todo el código JavaScript allí definido se ejecuta al crear el componente.

---

**Pregunta 20** — ¿Cómo se declara una prop (propiedad) en un componente Svelte?
a) `let prop = $prop()`
b) `export let prop`
c) `import let prop`
d) `@prop let prop`

**Respuesta:** b) `export let prop`
**Justificación:** En Svelte, se usa `export let` para declarar una prop. Esto permite que el componente padre pase valores al componente hijo. Svelte convierte esta exportación en una propiedad recibida desde fuera.

---

**Pregunta 21** — ¿Qué directiva se usa en Svelte para enlazar un valor de un input a una variable reactiva?
a) `on:input`
b) `bind:value`
c) `model:value`
d) `:value`

**Respuesta:** b) `bind:value`
**Justificación:** La directiva `bind:value` crea un enlace bidireccional entre el valor de un input y una variable. Cuando el usuario escribe, la variable se actualiza automáticamente, y viceversa.

---

**Pregunta 22** — ¿Qué hace `$:` en Svelte?
a) Declara una variable global
b) Define una declaración reactiva que se re-ejecuta cuando cambian sus dependencias
c) Importa un componente
d) Define un evento

**Respuesta:** b) Define una declaración reactiva que se re-ejecuta cuando cambian sus dependencias
**Justificación:** `$:` es la sintaxis de etiqueta de JavaScript que Svelte usa para declarar código reactivo. Cuando cualquiera de sus dependencias cambia, el código se re-ejecuta automáticamente.

---

**Pregunta 23** — ¿Cómo se aplican estilos específicos a un componente en Svelte?
a) Los estilos son globales por defecto
b) Los estilos dentro de `<style>` tienen alcance (scoped) al componente automáticamente
c) Se usa `style scoped` como en Vue
d) No se pueden aplicar estilos a componentes

**Respuesta:** b) Los estilos dentro de `<style>` tienen alcance (scoped) al componente automáticamente
**Justificación:** Svelte scopes (aisla) los estilos de cada componente por defecto. Añade un atributo único a los elementos del componente y modifica los selectores CSS para que solo afecten a esos elementos, evitando colisiones.

---

**Pregunta 24** — ¿Qué etiqueta se usa para renderizar contenido condicionalmente en Svelte?
a) `@if`
b) `{#if}`
c) `<If>`
d) `*ngIf`

**Respuesta:** b) `{#if}`
**Justificación:** Svelte usa la sintaxis de bloques con llaves: `{#if condición}...{/if}`. También soporta `{:else}` y `{:else if}`. Esta sintaxis es parte del lenguaje de templates de Svelte.

---

## Tema 5: Metodología Scrum Agile (9 preguntas)

**Pregunta 25** — ¿Qué es SCRUM?
a) Un lenguaje de programación
b) Un proceso iterativo e incremental para el desarrollo de software
c) Una herramienta de testing
d) Un tipo de base de datos

**Respuesta:** b) Un proceso iterativo e incremental para el desarrollo de software
**Justificación:** SCRUM es un marco de trabajo ágil que organiza el desarrollo en iteraciones cortas llamadas Sprints. Se enfoca en entregar valor incrementalmente, adaptándose a los cambios.

---

**Pregunta 26** — ¿Cuál es el rol del Product Owner en SCRUM?
a) Asegurar que el equipo siga la metodología
b) Conocer y marcar las prioridades del proyecto o producto
c) Escribir todo el código del equipo
d) Realizar las pruebas de aceptación

**Respuesta:** b) Conocer y marcar las prioridades del proyecto o producto
**Justificación:** El Product Owner es el responsable de maximizar el valor del producto. Gestiona el Product Backlog, define las prioridades y se asegura de que el equipo trabaje en las funcionalidades más importantes.

---

**Pregunta 27** — ¿Cómo se llama el artefacto que contiene la lista maestra con toda la funcionalidad deseada en el producto?
a) Sprint Backlog
b) Product Backlog
c) Burndown Chart
d) Definition of Done

**Respuesta:** b) Product Backlog
**Justificación:** El Product Backlog es una lista ordenada por prioridad de todo lo que se necesita en el producto. Es dinámica y evoluciona constantemente. El Product Owner la gestiona.

---

**Pregunta 28** — ¿Qué artefacto muestra un acumulativo del trabajo hecho día a día?
a) Product Backlog
b) Sprint Backlog
c) Burndown Chart
d) Kanban Board

**Respuesta:** c) Burndown Chart
**Justificación:** El Burndown Chart (gráfico de trabajo pendiente) muestra la cantidad de trabajo restante a lo largo del tiempo. Permite visualizar si el equipo va al ritmo esperado para completar el Sprint.

---

**Pregunta 29** — ¿Quién es la persona que asegura el seguimiento de la metodología SCRUM y guía las reuniones?
a) Product Owner
b) Scrum Master
c) Scrum Team
d) Usuario final

**Respuesta:** b) Scrum Master
**Justificación:** El Scrum Master es el facilitador del proceso. Se asegura de que se sigan las prácticas de SCRUM, elimina impedimentos y protege al equipo de distracciones externas.

---

**Pregunta 30** — ¿Cuál de los siguientes es un principio de SCRUM?
a) Entregar rápido
b) Documentación exhaustiva
c) Contratos rigurosos
d) Roles jerárquicos estrictos

**Respuesta:** a) Entregar rápido
**Justificación:** "Entregar rápido" es uno de los principios de SCRUM. Busca entregar valor al cliente lo antes posible mediante iteraciones cortas. Los otros principios incluyen eliminar desperdicio, construir calidad desde el inicio, diferir decisiones y optimizar el todo.

---

**Pregunta 31** — ¿Qué tipo de requerimientos se recomienda para aplicar SCRUM?
a) Requerimientos estáticos y bien definidos desde el inicio
b) Requerimientos dinámicos donde el "caos" es una constante
c) Proyectos con equipos de más de 50 personas
d) Proyectos con contratos fijos e inamovibles

**Respuesta:** b) Requerimientos dinámicos donde el "caos" es una constante
**Justificación:** SCRUM está diseñado para entornos donde los requerimientos cambian frecuentemente o no están completamente definidos al inicio. Su naturaleza iterativa permite adaptarse a cambios sin afectar drásticamente el plan.

---

**Pregunta 32 (Abierta)** — ¿Cuáles son los componentes de una metodología Scrum? Menciona y explica brevemente los roles, artefactos y eventos principales.

**Respuesta modelo:**
SCRUM se compone de tres pilares:

**Roles:**
- **Product Owner:** Define y prioriza los requisitos del producto. Gestiona el Product Backlog y maximiza el valor del producto.
- **Scrum Master:** Facilita el proceso, asegura que se siga la metodología, elimina impedimentos y protege al equipo.
- **Scrum Team:** Equipo autoorganizado responsable de implementar las funcionalidades. Generalmente de 5-9 personas.

**Artefactos:**
- **Product Backlog:** Lista priorizada de todo el trabajo pendiente del producto.
- **Sprint Backlog:** Subconjunto del Product Backlog seleccionado para un Sprint específico.
- **Burndown Chart:** Gráfico que muestra el progreso del trabajo completado vs. el pendiente.

**Eventos:**
- **Sprint:** Iteración de 1-4 semanas donde se produce un incremento de software funcional.
- **Sprint Planning:** Reunión para planificar qué se hará en el Sprint.
- **Daily Scrum:** Reunión diaria de 15 minutos para sincronizar al equipo.
- **Sprint Review:** Revisión del incremento con stakeholders.
- **Sprint Retrospective:** Reflexión del equipo para mejorar el proceso.

---

**Pregunta 33 (Abierta)** — ¿Qué es una metodología de desarrollo? Explica su importancia en la ingeniería de software.

**Respuesta modelo:**
Una metodología de desarrollo de software es un conjunto de procesos, prácticas, reglas y filosofías que guían el desarrollo de un proyecto de software. Define cómo se organiza el trabajo, cómo se comunican los miembros del equipo, qué artefactos se producen y cómo se mide el progreso.

**Importancia:**
- **Organización:** Proporciona una estructura clara para el equipo, evitando el caos.
- **Calidad:** Establece controles y prácticas que mejoran la calidad del producto final.
- **Eficiencia:** Reduce el riesgo de retrabajos costosos al detectar problemas temprano.
- **Comunicación:** Facilita la comunicación entre stakeholders, desarrolladores y usuarios.
- **Previsibilidad:** Permite estimar tiempos y costos con mayor precisión.
- **Mejora continua:** Proporciona mecanismos para reflexionar y mejorar el proceso.

Ejemplos de metodologías: SCRUM, XP (Extreme Programming), Kanban, Cascada (Waterfall).

---

## Tema 6: Conceptos fundamentales de Git (9 preguntas)

**Pregunta 34** — ¿Qué comando de Git se usa para crear una copia local de un repositorio remoto?
a) `git clone`
b) `git fork`
c) `git copy`
d) `git remote`

**Respuesta:** a) `git clone`
**Justificación:** `git clone <url>` descarga un repositorio remoto completo (con todo su historial) a tu máquina local. `fork` es una operación de GitHub, no un comando de Git.

---

**Pregunta 35** — ¿Qué comando permite ver el estado actual del repositorio (archivos modificados, agregados, etc.)?
a) `git check`
b) `git status`
c) `git log`
d) `git diff`

**Respuesta:** b) `git status`
**Justificación:** `git status` muestra qué archivos han sido modificados, cuáles están en staging listos para commit y cuáles no tienen seguimiento (untracked).

---

**Pregunta 36** — ¿Cómo se agregan todos los archivos modificados al área de staging?
a) `git add .`
b) `git commit -a`
c) `git push .`
d) `git stage all`

**Respuesta:** a) `git add .`
**Justificación:** `git add .` agrega todos los archivos modificados y nuevos del directorio actual al área de staging (índice), preparándolos para el próximo commit.

---

**Pregunta 37** — ¿Qué comando guarda los cambios en el repositorio local con un mensaje descriptivo?
a) `git save -m "mensaje"`
b) `git commit -m "mensaje"`
c) `git push -m "mensaje"`
d) `git store -m "mensaje"`

**Respuesta:** b) `git commit -m "mensaje"`
**Justificación:** `git commit` toma los archivos del área de staging y crea un nuevo commit en el historial local. La bandera `-m` permite añadir un mensaje descriptivo.

---

**Pregunta 38** — ¿Cuál es la diferencia entre `git pull` y `git fetch`?
a) No hay diferencia
b) `git pull` trae cambios y los fusiona automáticamente; `git fetch` solo descarga los cambios sin fusionar
c) `git fetch` trae cambios y los fusiona; `git pull` solo descarga
d) `git pull` funciona solo con repositorios públicos

**Respuesta:** b) `git pull` trae cambios y los fusiona automáticamente; `git fetch` solo descarga los cambios sin fusionar
**Justificación:** `git fetch` descarga los cambios del remoto pero no modifica tu working directory. `git pull` es equivalente a `git fetch` seguido de `git merge`, integrando los cambios automáticamente.

---

**Pregunta 39** — ¿Qué comando se usa para enviar los commits locales al repositorio remoto?
a) `git send`
b) `git upload`
c) `git push`
d) `git remote`

**Respuesta:** c) `git push`
**Justificación:** `git push` sube los commits del repositorio local al repositorio remoto (ej: GitHub, GitLab). Sin `git push`, los commits solo existen en tu máquina local.

---

**Pregunta 40** — ¿Qué comando permite crear una nueva rama (branch) en Git?
a) `git branch nombre-rama`
b) `git new-branch nombre-rama`
c) `git checkout --branch nombre-rama`
d) `git create nombre-rama`

**Respuesta:** a) `git branch nombre-rama`
**Justificación:** `git branch` crea una nueva rama en el commit actual. Para moverse a ella se usa `git switch nombre-rama` o `git checkout nombre-rama`. La forma abreviada es `git checkout -b nombre-rama`.

---

**Pregunta 41** — ¿Qué comando se usa para cambiar de una rama a otra en Git?
a) `git switch nombre-rama`
b) `git change nombre-rama`
c) `git move nombre-rama`
d) `git go nombre-rama`

**Respuesta:** a) `git switch nombre-rama`
**Justificación:** `git switch` (introducido en Git 2.23) es el comando moderno para cambiar entre ramas. También funciona `git checkout nombre-rama`. `switch` es más específico y menos propenso a errores.

---

**Pregunta 42 (Abierta)** — ¿Qué es un repositorio? Explica la diferencia entre un repositorio local y uno remoto en Git.

**Respuesta modelo:**
Un **repositorio** es un almacén donde Git guarda todas las versiones del proyecto, incluyendo el historial completo de cambios, ramas, etiquetas y metadatos. Es la estructura de datos fundamental de Git.

**Repositorio local:**
- Está en tu máquina (disco duro).
- Contiene todo el historial del proyecto.
- Puedes trabajar sin conexión a internet.
- Los comandos `git commit`, `git branch`, `git log` trabajan sobre el local.
- Solo tú tienes acceso directo a él.

**Repositorio remoto:**
- Está en un servidor (GitHub, GitLab, Bitbucket, etc.).
- Es una copia del repositorio que comparten todos los miembros del equipo.
- Permite sincronizar el trabajo: subir (`git push`) y descargar (`git pull`) cambios.
- Actúa como respaldo centralizado y punto de colaboración.
- Requiere conexión a internet para sincronizar.

---

## Tema 7: Concepto de stack y arquitectura de software (18 preguntas)

**Pregunta 43** — ¿Qué significa el término "stack tecnológico" en desarrollo de software?
a) La pila de ejecución de un programa
b) El conjunto de tecnologías usadas para construir una aplicación
c) La cantidad de memoria RAM utilizada por el sistema
d) El orden en que se ejecutan las pruebas

**Respuesta:** b) El conjunto de tecnologías usadas para construir una aplicación
**Justificación:** Un stack tecnológico (o tech stack) es la combinación de lenguajes, frameworks, bases de datos, servidores y herramientas que se usan para desarrollar y ejecutar una aplicación. Ej: MERN (MongoDB, Express, React, Node.js).

---

**Pregunta 44** — ¿Cuál de los siguientes es un ejemplo de stack tecnológico completo?
a) MERN (MongoDB, Express, React, Node.js)
b) HTML + CSS
c) Windows + Linux
d) MySQL únicamente

**Respuesta:** a) MERN (MongoDB, Express, React, Node.js)
**Justificación:** MERN es un stack completo que cubre base de datos (MongoDB), backend (Express/Node.js) y frontend (React). HTML+CSS son solo lenguajes de marcado/estilo, no un stack completo.

---

**Pregunta 45** — En una arquitectura de tres capas (three-tier), ¿cuáles son las capas?
a) Usuario, administrador, superusuario
b) Presentación, lógica de negocio, datos
c) Frontend, backend, DevOps
d) Cliente, servidor, router

**Respuesta:** b) Presentación, lógica de negocio, datos
**Justificación:** La arquitectura three-tier separa la aplicación en: capa de presentación (interfaz de usuario), capa de lógica de negocio (procesamiento de reglas) y capa de datos (almacenamiento y acceso a datos).

---

**Pregunta 46** — ¿Qué tipo de arquitectura divide la aplicación en servicios independientes y autónomos?
a) Arquitectura monolítica
b) Arquitectura de microservicios
c) Arquitectura cliente-servidor
d) Arquitectura en capas

**Respuesta:** b) Arquitectura de microservicios
**Justificación:** En microservicios, cada funcionalidad es un servicio independiente con su propia base de datos y lógica, comunicándose mediante APIs. Esto permite escalar, desplegar y mantener cada servicio por separado.

---

**Pregunta 47** — ¿Cuáles son los verbos HTTP más comunes en una API REST?
a) RUN, STOP, START, DELETE
b) GET, POST, PUT, DELETE
c) READ, WRITE, UPDATE, DELETE
d) ADD, REMOVE, MODIFY, GET

**Respuesta:** b) GET, POST, PUT, DELETE
**Justificación:** REST usa los verbos HTTP estándar: GET (leer), POST (crear), PUT (actualizar/reemplazar) y DELETE (eliminar). Cada verbo tiene un significado semántico específico en el protocolo HTTP.

---

**Pregunta 48** — ¿Qué es Node.js?
a) Un framework frontend como React
b) Un entorno de ejecución de JavaScript del lado del servidor
c) Una base de datos NoSQL
d) Un sistema operativo

**Respuesta:** b) Un entorno de ejecución de JavaScript del lado del servidor
**Justificación:** Node.js permite ejecutar JavaScript fuera del navegador, en el servidor. Está basado en el motor V8 de Chrome y es la base de la mayoría de stacks modernos (MERN, MEAN, etc.).

---

**Pregunta 49 (Abierta)** — ¿Qué es frontend? Explica su función en una aplicación web.

**Respuesta modelo:**
El **frontend** (o lado del cliente) es la parte de una aplicación web con la que el usuario interactúa directamente. Es todo lo que se ve y se toca en el navegador.

**Funciones principales:**
- **Interfaz de usuario (UI):** Renderiza elementos visuales como botones, formularios, menús, tablas, etc.
- **Experiencia de usuario (UX):** Gestiona la navegación, animaciones y la forma en que el usuario interactúa con la aplicación.
- **Presentación de datos:** Muestra la información que viene del backend de forma organizada y atractiva.
- **Validación del lado del cliente:** Verifica datos antes de enviarlos al servidor (ej: campos obligatorios, formato de email).

**Tecnologías comunes:** HTML, CSS, JavaScript, y frameworks como Svelte, React, Vue, Angular.

---

**Pregunta 50 (Abierta)** — ¿Qué es backend? Explica su función en una aplicación web.

**Respuesta modelo:**
El **backend** (o lado del servidor) es la parte de la aplicación que no ve el usuario. Es el "motor" que procesa la lógica, gestiona datos y se comunica con la base de datos.

**Funciones principales:**
- **Lógica de negocio:** Procesa reglas del negocio (cálculos, validaciones, autorizaciones).
- **Gestión de bases de datos:** Lee, escribe, actualiza y elimina datos.
- **Autenticación y autorización:** Verifica la identidad del usuario y sus permisos.
- **APIs:** Expone endpoints para que el frontend pueda comunicarse con el servidor.
- **Seguridad:** Protege contra accesos no autorizados, inyecciones SQL, etc.

**Tecnologías comunes:** Node.js (Express), Python (Django, Flask), Java (Spring), PHP (Laravel), Ruby (Rails), C# (.NET).

---

**Pregunta 51 (Abierta)** — ¿Qué tipos de bases de datos existen? Menciona y explica brevemente al menos tres tipos.

**Respuesta modelo:**

1. **Bases de datos relacionales (SQL):** Almacenan datos en tablas con filas y columnas. Usan SQL para consultas. Son ideales para datos estructurados con relaciones definidas.
   - Ejemplos: MySQL, PostgreSQL, SQLite, SQL Server, Oracle.

2. **Bases de datos NoSQL (documentales):** Almacenan datos en documentos flexibles (generalmente JSON). No requieren un esquema fijo. Ideales para datos semiestructurados o con esquemas variables.
   - Ejemplos: MongoDB, CouchDB, Firebase Firestore.

3. **Bases de datos clave-valor:** Almacenan datos como pares clave-valor. Son extremadamente rápidas para lecturas/escrituras simples. Ideales para cachés, sesiones y configuraciones.
   - Ejemplos: Redis, DynamoDB, Memcached.

4. **Bases de datos orientadas a grafos:** Almacenan datos como nodos y relaciones (aristas). Ideales para datos altamente interconectados como redes sociales, recomendaciones o motores de búsqueda.
   - Ejemplos: Neo4j, Amazon Neptune.

---

**Pregunta 52 (Abierta)** — ¿Qué es un framework? Da un ejemplo de framework frontend y uno backend.

**Respuesta modelo:**
Un **framework** es un conjunto de herramientas, librerías, convenciones y patrones de diseño que facilitan el desarrollo de software al proporcionar una estructura base y abstraer tareas complejas. Básicamente, es un "esqueleto" sobre el cual se construye la aplicación.

**Ejemplos:**
- **Frontend:** **Svelte** — Framework/compilador para construir interfaces de usuario reactivas. Otros: React, Vue, Angular.
- **Backend:** **Express.js** — Framework minimalista para Node.js que facilita la creación de APIs y servidores web. Otros: Django (Python), Spring Boot (Java), Laravel (PHP), Ruby on Rails (Ruby).

**Ventajas de usar frameworks:** Código más organizado, reutilización, seguridad integrada, comunidad activa, desarrollo más rápido.

---

**Pregunta 53 (Abierta)** — ¿Qué es un lenguaje de programación? Menciona al menos tres que conozcas.

**Respuesta modelo:**
Un **lenguaje de programación** es un conjunto de reglas sintácticas y semánticas que permite a un programador comunicarse con una computadora, dándole instrucciones para realizar tareas específicas. Es el medio para escribir software.

**Ejemplos:**
1. **JavaScript:** Lenguaje interpretado, multiparadigma. Es el lenguaje nativo del navegador. Se usa en frontend (web) y backend (Node.js). Es débilmente tipado.
2. **Python:** Lenguaje interpretado, de alto nivel, con sintaxis clara y legible. Muy usado en ciencia de datos, inteligencia artificial, backend y automatización. Es fuertemente tipado con tipado dinámico.
3. **TypeScript:** Superconjunto de JavaScript que añade tipado estático opcional. Se compila a JavaScript. Muy popular en proyectos grandes por su seguridad y herramientas de desarrollo.
4. **Java:** Lenguaje compilado, orientado a objetos, multiplataforma (JVM). Muy usado en aplicaciones empresariales, Android y sistemas grandes.
5. **C#:** Lenguaje orientado a objetos de Microsoft. Usado en aplicaciones Windows, juegos (Unity) y backend (.NET).

---

**Pregunta 54 (Abierta)** — ¿Qué es un editor de código? Menciona al menos dos que conozcas o hayas utilizado.

**Respuesta modelo:**
Un **editor de código** es una aplicación diseñada específicamente para escribir, editar y gestionar código fuente. A diferencia de un bloc de notas, ofrece herramientas como resaltado de sintaxis, autocompletado, depuración integrada, control de versiones y extensiones.

**Ejemplos:**
1. **Visual Studio Code (VS Code):** Editor gratuito y de código abierto de Microsoft. Es el más popular actualmente. Soporta cientos de extensiones, integración con Git, terminal integrada, depurador y soporte para prácticamente todos los lenguajes.
2. **WebStorm:** IDE comercial de JetBrains especializado en desarrollo web (JavaScript, TypeScript, HTML, CSS). Ofrece refactorización avanzada, navegación inteligente y herramientas integradas.
3. **Sublime Text:** Editor ligero y rápido. Muy personalizable. Popular por su velocidad y su sistema de paquetes.
4. **Vim:** Editor modal que se usa desde la terminal. Tiene una curva de aprendizaje pronunciada pero es extremadamente eficiente una vez dominado.

---

**Pregunta 55 (Abierta)** — ¿Cuáles son las IAs que conoce o con las que ha trabajado? Menciona al menos tres y explica brevemente para qué las has usado.

**Respuesta modelo:**
Las inteligencias artificiales son herramientas que utilizan modelos de lenguaje y aprendizaje automático para asistir en diversas tareas.

1. **ChatGPT (OpenAI):** Asistente conversacional. Usos comunes: resolver dudas de programación, generar código, explicar conceptos técnicos, redactar documentación, depurar errores.
2. **GitHub Copilot:** Asistente de código que se integra en editores como VS Code. Sugiere código en tiempo real mientras escribes. Muy útil para autocompletar funciones, escribir tests y acelerar el desarrollo.
3. **Claude (Anthropic):** Asistente de IA similar a ChatGPT. Usos: análisis de código, revisión de documentación, resolución de problemas complejos y tareas de razonamiento.
4. **Gemini (Google):** Asistente multimodal de Google. Usos: búsqueda de información técnica, generación de código, análisis de imágenes y documentos.
5. **Midjourney / DALL-E:** IAs generativas de imágenes. Usos: crear imágenes conceptuales, diseños UI/UX, assets gráficos para proyectos.

---

**Pregunta 56 (Abierta)** — ¿Qué plataformas de despliegue conoce o ha trabajado? Menciona al menos dos y explica su propósito.

**Respuesta modelo:**
Las plataformas de despliegue permiten publicar aplicaciones web para que sean accesibles por internet.

1. **Vercel:** Plataforma especializada en frontend y funciones serverless. Ideal para frameworks como SvelteKit, Next.js, React. Ofrece despliegue automático desde GitHub, SSL gratuito, CDN global y previews por cada commit.
2. **Netlify:** Similar a Vercel. Soporta sitios estáticos y funciones serverless. Tiene integración con Git, formularios nativos, autenticación y despliegue continuo. Muy popular para proyectos JAMstack.
3. **Heroku:** Plataforma como servicio (PaaS) que simplifica el despliegue de aplicaciones completas (frontend + backend + BD). Soporta múltiples lenguajes. Ya no tiene plan gratuito.
4. **GitHub Pages:** Servicio gratuito de GitHub para alojar sitios estáticos directamente desde un repositorio. Ideal para documentación, landing pages y proyectos pequeños.
5. **AWS (Amazon Web Services):** Conjunto completo de servicios cloud (EC2, S3, Lambda, RDS). Ofrece máxima flexibilidad pero requiere más configuración. Ideal para aplicaciones empresariales.
6. **Railway / Render:** Alternativas modernas a Heroku con planes generosos y despliegue simple desde repositorios Git. Soportan múltiples lenguajes y bases de datos integradas.

---

**Pregunta 57 (Abierta)** — ¿Qué es un stack tecnológico? Explica con un ejemplo concreto.

**Respuesta modelo:**
Un **stack tecnológico** (tech stack) es la combinación de tecnologías, lenguajes, frameworks, bases de datos y herramientas que se utilizan para construir y ejecutar una aplicación de software.

**Ejemplo concreto — Stack MERN:**
- **MongoDB:** Base de datos NoSQL documental. Almacena los datos en formato JSON flexible.
- **Express.js:** Framework backend para Node.js. Maneja rutas, middleware y lógica del servidor.
- **React:** Librería frontend para construir interfaces de usuario basadas en componentes.
- **Node.js:** Entorno de ejecución de JavaScript del lado del servidor.

**Cómo se relacionan:**
1. El usuario interactúa con la UI de **React** en el navegador.
2. React envía peticiones HTTP a la API de **Express**.
3. Express procesa la lógica de negocio y consulta **MongoDB**.
4. MongoDB devuelve los datos a Express, que los envía de vuelta a React para mostrarlos al usuario.

Otros ejemplos: LAMP (Linux, Apache, MySQL, PHP), MEAN (MongoDB, Express, Angular, Node.js), JAMstack (JavaScript, APIs, Markup).

---

**Pregunta 58 (Abierta)** — ¿Qué tipo de proyecto le gustaría crear para aplicar los conceptos de stack y arquitectura? Describe brevemente la idea.

**Respuesta modelo (ejemplo para orientar al estudiante):**
Un proyecto ideal para aplicar conceptos de arquitectura sería una **aplicación web de gestión de tareas (Task Manager) con stack moderno**.

**Descripción:**
- **Frontend:** Aplicación SPA construida con Svelte/SvelteKit. Interfaz responsive con tablero Kanban para organizar tareas por estado (pendiente, en progreso, completada).
- **Backend:** API REST con Node.js y Express. Maneja autenticación de usuarios, CRUD de tareas, y lógica de negocio (asignación, fechas límite, prioridades).
- **Base de datos:** PostgreSQL (relacional) para datos estructurados como usuarios y tareas, más Redis (caché) para sesiones y notificaciones rápidas.
- **Despliegue:** Frontend en Vercel, backend en Railway, base de datos en Neon (PostgreSQL cloud) y Redis Cloud.
- **Testing:** Pruebas unitarias con Vitest, pruebas de integración con Playwright.

**Conceptos aplicados:** Arquitectura three-tier (presentación → lógica → datos), API RESTful, frontend/backend separation of concerns, responsive design, testing, CI/CD.

---

**Pregunta 59 (Abierta)** — ¿Qué es el testing en desarrollo de software? Explica su importancia.

**Respuesta modelo:**
El **testing** (pruebas de software) es el proceso de evaluar y verificar que un sistema o aplicación funciona correctamente, cumple con los requisitos especificados y no tiene errores. Es una parte fundamental del ciclo de desarrollo.

**Importancia:**
- **Detección temprana de errores:** Encontrar bugs en etapas tempranas reduce drásticamente el costo de corregirlos (Ley de Boehm: cuanto más tarde se detecta un error, más caro es repararlo).
- **Calidad del software:** Asegura que el producto cumple con los estándares de calidad y funcionalidad esperados.
- **Seguridad:** Identifica vulnerabilidades que podrían ser explotadas.
- **Confianza:** Proporciona seguridad al equipo para hacer cambios sin miedo a romper funcionalidades existentes.
- **Documentación:** Los tests sirven como documentación viva del comportamiento esperado del sistema.
- **Ahorro de costos:** Previene fallos en producción que podrían causar pérdidas económicas o de reputación.

**Tipos de testing:** Unitario (prueba componentes individuales), Integración (prueba interacción entre componentes), End-to-End (prueba flujos completos del usuario), Aceptación (verifica que cumple requisitos del cliente).

---

**Pregunta 60 (Abierta)** — ¿Qué es un algoritmo? Da un ejemplo de la vida cotidiana.

**Respuesta modelo:**
Un **algoritmo** es un conjunto ordenado y finito de pasos o instrucciones diseñadas para resolver un problema o realizar una tarea específica. Todo algoritmo debe ser preciso (sin ambigüedades), definido (producir el mismo resultado siempre con las mismas entradas) y finito (terminar en algún momento).

**Ejemplo cotidiano — Receta de cocina (Hacer café):**
1. Inicio
2. Llenar la cafetera con agua hasta la marca deseada
3. Colocar el filtro de papel en el portafiltro
4. Agregar 2 cucharadas de café molido por cada taza
5. Encender la cafetera
6. Esperar a que termine de filtrar el agua
7. Servir el café en una taza
8. Fin

**Ejemplo en programación — Algoritmo para encontrar el número mayor en una lista:**
1. Inicio
2. Suponer que el primer elemento es el mayor
3. Para cada elemento restante:
   - Si el elemento es mayor que el mayor actual, actualizar el mayor
4. Devolver el mayor encontrado
5. Fin

Los algoritmos son la base de todo software: desde ordenar una lista hasta recomendar contenido en redes sociales o procesar pagos bancarios.

---

## Resumen de distribución

| Tema | En evaluación | En banco | MC | Abiertas |
|:-----|:------------:|:--------:|:--:|:--------:|
| 1. Introducción a Svelte | 2 | 6 | 6 | 0 |
| 2. Estructura de carpetas Svelte | 2 | 6 | 6 | 0 |
| 3. Principios de diseño responsive | 2 | 6 | 6 | 0 |
| 4. Componentes y estructura Svelte | 2 | 6 | 6 | 0 |
| 5. Metodología Scrum Agile | 3 | 9 | 7 | 2 |
| 6. Conceptos fundamentales de Git | 3 | 9 | 8 | 1 |
| 7. Stack y arquitectura de software | 6 | 18 | 6 | 12 |
| **Total** | **20** | **60** | **45** | **15** |
