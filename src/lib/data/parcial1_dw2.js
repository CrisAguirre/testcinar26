/**
 * Banco Parcial 1 — Desarrollo Web 2 (15/10/2026).
 * Solo teoría de la sección Actividad de la semana (Clases 1-5, Svelte)
 * + arquitectura del Proyecto Colaborativo TrueX Trade.
 *
 * Clasificación: primero por temática (Arquitectura | Svelte) y luego por tipo.
 * - Arquitectura: 13 abiertas + 12 selección múltiple = 25
 * - Svelte:       12 abiertas + 13 selección múltiple = 25
 * Total: 50 (25 abiertas + 25 MC). El examen toma 5 de cada grupo (20).
 */

export const examConfig = {
  title: 'Parcial 1 - Desarrollo Web 2',
  dateLabel: 'Miércoles 14/10/2026 · todo el día (preparación desde ya hasta el 13/10)',
  perBucket: 5,
  buckets: ['arq-mc', 'arq-open', 'svelte-mc', 'svelte-open']
};

export const questionBank = [
  // ============ ARQUITECTURA TrueX Trade · MC (12) ============
  {
    id: 1, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Sobre el stack de TrueX Trade, ¿cuál afirmación es correcta?',
    options: [
      'Frontend en Svelte, backend en PHP y base de datos MySQL',
      'Frontend en React, backend en Node + Express y base de datos MongoDB (Atlas)',
      'Todo el sistema es una sola página HTML sin backend',
      'Frontend en Angular, backend en Java y base de datos Oracle'
    ],
    answer: 1,
    explanation: 'El proyecto usa React (frontend), Node + Express (backend) y MongoDB Atlas, desplegado en Vercel + Render + Atlas.'
  },
  {
    id: 2, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Respecto al despliegue de TrueX Trade, relaciona cada capa con su plataforma:',
    options: [
      'Frontend en Render, backend en Vercel y datos en localStorage',
      'Frontend en Vercel, backend en Render y datos en MongoDB Atlas',
      'Todo desplegado únicamente en MongoDB Atlas',
      'Frontend y backend en el mismo hosting compartido sin API'
    ],
    answer: 1,
    explanation: 'La tira de despliegue es Vercel (frontend React) + Render (API Node) + Atlas (datos).'
  },
  {
    id: 3, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'El equipo acordó "contrato API primero". ¿Qué significa y por qué importa?',
    options: [
      'Firmar un contrato legal antes de programar, por temas de licencias',
      'Definir endpoints, datos y formatos antes de codificar, para que frontend y backend avancen en paralelo sin romperse',
      'Contratar primero al backend y después al frontend por orden de llegada',
      'Probar la API solo al final, cuando todo está integrado'
    ],
    answer: 1,
    explanation: 'El contrato (modelo + endpoints) permite trabajo en paralelo; si cambia, se avisa el mismo día.'
  },
  {
    id: 4, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En TrueX Trade, ¿quién cumple el rol de Project Manager y cuál es su función?',
    options: [
      'Jeison, que programa todo el frontend',
      'El docente, que prioriza el backlog, valida la integración semanal y coordina la demo',
      'Diego y Harold, que solo hacen despliegues',
      'William, que lidera el equipo de mercadeo'
    ],
    answer: 1,
    explanation: 'El docente es PM (backlog, integración, demo). William quedó fuera del proyecto.'
  },
  {
    id: 5, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Los entregables del analista en semana 1 son:',
    options: [
      'Solo el logo y la paleta de colores',
      'Modelo de datos en Mongo, contrato de API y wireframes de pantallas clave',
      'El despliegue final y el video pitch',
      'Las calificaciones de los intercambios'
    ],
    answer: 1,
    explanation: 'Jeison (analista/tech lead) normaliza modelo Mongo, contrato API y wireframes en semana 1.'
  },
  {
    id: 6, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Según el cronograma, ¿qué se construye en la Semana 4?',
    options: [
      'Logos y paleta de colores',
      'El flujo de intercambio: enviar, aceptar y rechazar solicitudes, más calificaciones',
      'El matching automático definitivo con IA',
      'La congelación del código y los ensayos'
    ],
    answer: 1,
    explanation: 'S4 = flujo de intercambio + calificaciones + panel admin básico + primera integración.'
  },
  {
    id: 7, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Si el tiempo apremia, ¿qué decidió recortar el equipo y por qué?',
    options: [
      'El registro de usuarios, porque nadie lo usa',
      'El chat en tiempo real (extra, sustituible por mensajes por solicitud) y el matching completo (versión simple por categoría)',
      'La base de datos, para ir más rápido',
      'El frontend, dejando solo la API'
    ],
    answer: 1,
    explanation: 'Acuerdos: chat realtime es extra y el matching queda en regla simple por categoría/etiquetas.'
  },
  {
    id: 8, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Sobre el trabajo con ramas e integración, el acuerdo es:',
    options: [
      'Una sola rama main donde todos suben directo sin revisión',
      'Ramas por módulo, main protegida, PR con revisión de otro equipo e integración cada viernes',
      'Cada estudiante trabaja en su computador sin subir nada hasta la semana 6',
      'Ramas por persona que se mezclan solo en la demo final'
    ],
    answer: 1,
    explanation: 'Nada se queda en rama más de una semana; main protegida con PR revisado.'
  },
  {
    id: 9, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'El ciclo de vida de un trueque (RF-19) incluye estos estados:',
    options: [
      'Borrador y publicado únicamente',
      'Pendiente, aceptado, rechazado, cancelado y completado, con fechas de confirmación',
      'En carrito, pagado y enviado',
      'Activo e inactivo'
    ],
    answer: 1,
    explanation: 'RF-19 exige controlar pendiente → aceptado/rechazado/cancelado → completado, con fechas.'
  },
  {
    id: 10, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: '¿Qué validaciones impiden propuestas de trueque inválidas (RF-18)?',
    options: [
      'Solo pedir contraseña dos veces',
      'Verificar disponibilidad previa del producto e impedir propuestas duplicadas en estado pendiente',
      'Pedir tarjeta de crédito antes de proponer',
      'Limitar el número de fotos por publicación'
    ],
    answer: 1,
    explanation: 'RF-18: verificar disponibilidad e impedir duplicadas en pendiente.'
  },
  {
    id: 11, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En seguridad (RF-30) y roles (RF-5), el sistema debe:',
    options: [
      'Guardar contraseñas en texto plano para recuperarlas fácil',
      'Aplicar hashing a contraseñas, autorización por rol y que cada usuario controle su propia información',
      'Dar a todos los usuarios permisos de administrador',
      'Evitar el inicio de sesión para ir más rápido'
    ],
    answer: 1,
    explanation: 'Hashing + autorización + control de la propia información; hay usuarios estándar y administrador.'
  },
  {
    id: 12, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Sobre el rol de Mercadeo y Lanzamiento (Danilo), ¿qué le corresponde?',
    options: [
      'Programar los endpoints de autenticación',
      'Difusión y piezas promocionales, video pitch, presentación de lanzamiento y métricas de la demo',
      'Calificar los exámenes de los compañeros',
      'Administrar la base de datos Atlas'
    ],
    answer: 1,
    explanation: 'Mercadeo (semanas 2–6): que TrueX Trade se entienda, se vea bien y llegue a usuarios.'
  },
  // ============ ARQUITECTURA TrueX Trade · ABIERTAS (13) ============
  {
    id: 13, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Describe el stack completo de TrueX Trade indicando qué hace cada capa y dónde se despliega.',
    rubric: 'Menciona React (frontend/Vercel), Node+Express (API/Render) y MongoDB (datos/Atlas). 5 pts.'
  },
  {
    id: 14, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Explica con tus palabras qué significa "contrato API primero" y qué consecuencias tiene cambiar un endpoint sin avisar.',
    rubric: 'Define endpoints/datos/formatos previos; rompería frontend/backend en paralelo; avisar el mismo día. 5 pts.'
  },
  {
    id: 15, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Narra el ciclo de vida completo de una propuesta de trueque, desde que se envía hasta que se completa, indicando estados y fechas.',
    rubric: 'Pendiente → aceptado/rechazado/cancelado → completado + fechas de confirmación e historial. 5 pts.'
  },
  {
    id: 16, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: '¿Qué validaciones implementarías para impedir propuestas de trueque duplicadas o sobre productos no disponibles? Justifica.',
    rubric: 'Disponibilidad previa + bloqueo de duplicadas en pendiente (RF-18). 5 pts.'
  },
  {
    id: 17, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Justifica la estrategia de ramas por módulo con integración cada viernes frente a integrar todo al final.',
    rubric: 'Detecta fallos temprano, main protegida, PR revisado, nada >1 semana en rama. 5 pts.'
  },
  {
    id: 18, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Si solo quedaran dos semanas, ¿qué recortarías del alcance (chat, matching, reportes) y por qué? Argumenta con los acuerdos del equipo.',
    rubric: 'Chat realtime→mensajes por solicitud; matching simple; reportes opcionales. 5 pts.'
  },
  {
    id: 19, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Enumera los entregables del analista en semana 1 y explica cómo los usa cada rol después.',
    rubric: 'Modelo Mongo, contrato API, wireframes; frontend maqueta, backend implementa, QA prueba. 5 pts.'
  },
  {
    id: 20, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: '¿Por qué QA/DevOps es transversal desde la semana 1 y no solo al final? Da dos razones.',
    rubric: 'Evita acumular pruebas/despliegue; estabilización continua + datos demo a tiempo. 5 pts.'
  },
  {
    id: 21, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Diseña a grandes rasgos el matching simple de semana 5: ¿qué datos cruza y qué notifica?',
    rubric: 'Cruza oferta vs búsqueda por categoría/etiquetas/ubicación + wishlist; alerta al coincidir. 5 pts.'
  },
  {
    id: 22, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Explica cómo se combinan autenticación, roles y hashing para proteger TrueX Trade.',
    rubric: 'Login seguro, roles estándar/admin, hashing de claves, autorización y control propio (RF-5/30). 5 pts.'
  },
  {
    id: 23, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: '¿Qué debe gestionar el panel admin básico y qué reportes quedarían como opcionales?',
    rubric: 'Usuarios y publicaciones (básico); reportes avanzados opcionales. 5 pts.'
  },
  {
    id: 24, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Propón el aporte de mercadeo al lanzamiento: piezas, pitch y métricas. ¿Cómo mide si funcionó?',
    rubric: 'Piezas/pitch/demo + métricas (visitas, registros). 5 pts.'
  },
  {
    id: 25, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Compara una publicación de trueque frente a una de venta: ¿qué campos y filtros cambian y cómo afecta al modelo de datos?',
    rubric: 'Motivo de trueque/características deseadas vs precio; filtros por tipo; campos condicionales. 5 pts.'
  },
  // ============ SVELTE Clases 1-5 · MC (13) ============
  {
    id: 26, tema: 'Svelte', area: 'svelte', clase: 1, type: 'mc',
    question: 'En SvelteKit, ¿qué es el file-based routing?',
    options: [
      'Escribir todas las rutas en un archivo routes.js gigante',
      'Cada carpeta en src/routes/ se convierte automáticamente en una URL de la app',
      'Instalar un plugin de pago para crear rutas',
      'Definir rutas solo con expresiones regulares'
    ],
    answer: 1,
    explanation: 'El sistema de archivos define las rutas: carpetas = segmentos URL (Clase 1).'
  },
  {
    id: 27, tema: 'Svelte', area: 'svelte', clase: 1, type: 'mc',
    question: '¿Qué archivo define el contenido visual de una ruta y cuál comparte estructura entre rutas?',
    options: [
      '+page.svelte define el contenido; +layout.svelte comparte Header/Footer entre hijas',
      '+layout.svelte define el contenido; +page.svelte comparte estructura',
      'Ambos hacen exactamente lo mismo',
      'Ninguno: se usa solo index.html'
    ],
    answer: 0,
    explanation: '+page.svelte = vista de la ruta; +layout.svelte = plantilla que envuelve a las hijas (Clase 1).'
  },
  {
    id: 28, tema: 'Svelte', area: 'svelte', clase: 1, type: 'mc',
    question: '¿Para qué sirve goto() de $app/navigation y cuándo se usa?',
    options: [
      'Para dar estilos a los botones del Header',
      'Para navegar programáticamente (ej. al cerrar sesión ir a /login) en vez de recargar la página',
      'Para conectarse a MongoDB desde el frontend',
      'Para validar formularios automáticamente'
    ],
    answer: 1,
    explanation: 'goto() redirige por código, como en el logout del Header (Clase 1).'
  },
  {
    id: 29, tema: 'Svelte', area: 'svelte', clase: 2, type: 'mc',
    question: 'Un componente .svelte se compone de tres secciones. ¿Cuáles son?',
    options: [
      'PHP, MySQL y Apache',
      'Script (lógica), markup (HTML) y style (CSS encapsulado)',
      'Header, body y footer obligatorios',
      'Rutas, tiendas y guardianes'
    ],
    answer: 1,
    explanation: 'Todo componente Svelte tiene lógica, marcado y estilos propios (Clase 2, ej. SubjectCard).'
  },
  {
    id: 30, tema: 'Svelte', area: 'svelte', clase: 2, type: 'mc',
    question: '¿Qué es el scoped CSS de Svelte y qué ventaja da?',
    options: [
      'CSS que se aplica a todo internet por igual',
      'Estilos que solo afectan a su propio componente, evitando que se pisen entre sí',
      'CSS que solo funciona en modo oscuro',
      'Un reemplazo de JavaScript para la lógica'
    ],
    answer: 1,
    explanation: 'El encapsulado evita fugas de estilos entre componentes (Clase 2).'
  },
  {
    id: 31, tema: 'Svelte', area: 'svelte', clase: 2, type: 'mc',
    question: 'En redes sociales, cada Tweet se renderiza con el mismo componente pero con datos distintos. ¿Qué concepto lo permite?',
    options: [
      'Copiar y pegar el HTML miles de veces',
      'Reutilización modular: un componente + datos distintos por instancia',
      'Usar una base de datos diferente por tweet',
      'Recargar la página en cada scroll'
    ],
    answer: 1,
    explanation: 'La estructura modular permite reutilizar <Tweet /> con datos distintos (Clase 2).'
  },
  {
    id: 32, tema: 'Svelte', area: 'svelte', clase: 3, type: 'mc',
    question: 'En Svelte 5, ¿cómo recibe un componente datos de su padre?',
    options: [
      'Con export let, igual que en Svelte 4 sin cambios',
      'Con la runa $props(), desestructurando lo que envía el padre',
      'Con variables globales window siempre',
      'No puede recibir datos externos'
    ],
    answer: 1,
    explanation: '$props() reemplaza a export let en Svelte 5 (Clase 3).'
  },
  {
    id: 33, tema: 'Svelte', area: 'svelte', clase: 3, type: 'mc',
    question: 'En `let { href = \'/\' } = $props()`, ¿qué significa `= \'/\'` y el `?` en `href?: string`?',
    options: [
      'Son errores de sintaxis que rompen la app',
      'Valor por defecto si el padre no envía nada, y prop opcional según TypeScript',
      'Obligan al padre a enviar siempre el dato dos veces',
      'Solo sirven como comentarios decorativos'
    ],
    answer: 1,
    explanation: 'Defaults + props tipadas opcionales dan seguridad (Clase 3, ej. SubjectCard).'
  },
  {
    id: 34, tema: 'Svelte', area: 'svelte', clase: 3, type: 'mc',
    question: 'Sobre el flujo de datos con props, ¿cuál es la regla correcta?',
    options: [
      'Los datos fluyen del padre al hijo; el hijo no debe mutar directamente la prop',
      'El hijo modifica las props del padre libremente sin avisar',
      'Las props viajan del hijo al padre por defecto',
      'No existe dirección: todo es global'
    ],
    answer: 0,
    explanation: 'Flujo unidireccional padre → hijo (Clase 3, ej. VideoCard de YouTube).'
  },
  {
    id: 35, tema: 'Svelte', area: 'svelte', clase: 4, type: 'mc',
    question: '¿Para qué sirven las variables CSS (custom properties) en :root?',
    options: [
      'Para guardar contraseñas del backend',
      'Para centralizar colores, fuentes y medidas y cambiar temas (claro/oscuro) sin Bootstrap',
      'Para acelerar el WiFi del usuario',
      'Para reemplazar a JavaScript por completo'
    ],
    answer: 1,
    explanation: 'Un cambio en :root se propaga a toda la app, como los temas de Spotify (Clase 4).'
  },
  {
    id: 36, tema: 'Svelte', area: 'svelte', clase: 4, type: 'mc',
    question: 'Diferencia entre estilos encapsulados y :global() en Svelte:',
    options: [
      'No hay diferencia, son sinónimos',
      'Encapsulados solo afectan a su componente; :global() permite estilos que cruzan componentes o vienen de .css externos',
      ':global() borra todos los estilos de la app',
      'Los encapsulados no permiten usar variables CSS'
    ],
    answer: 1,
    explanation: 'Scoped por defecto; :global() o .css externo para lo compartido (Clase 4).'
  },
  {
    id: 37, tema: 'Svelte', area: 'svelte', clase: 5, type: 'mc',
    question: '¿Cuál importación sigue buenas prácticas en este proyecto?',
    options: [
      `import { x } from '../../../../stores/auth'`,
      `import { x } from '$lib/stores/auth'`,
      `import { x } from 'C:/Users/proyecto/src/lib/stores/auth'`,
      `import x from 'http://localhost:5173/stores/auth'`
    ],
    answer: 1,
    explanation: 'El alias $lib evita el "infierno de los puntos" y no se rompe al mover archivos (Clase 5).'
  },
  {
    id: 38, tema: 'Svelte', area: 'svelte', clase: 5, type: 'mc',
    question: 'Según las buenas prácticas vistas (ej. Airbnb), ¿cómo se organiza una app escalable?',
    options: [
      'Todo el código en un solo archivo gigante',
      'Separar UI pura ("tonta") de contenedores con lógica, extraer datos estáticos a $lib/data/ y nombrar descriptivo',
      'Mezclar estilos, datos y lógica en cada línea para ahorrar archivos',
      'Nombrar todo con una sola letra para escribir más rápido'
    ],
    answer: 1,
    explanation: 'Separación datos/vista (enlacesData.ts), PascalCase y componentes puros vs contenedores (Clase 5).'
  },
  // ============ SVELTE Clases 1-5 · ABIERTAS (12) ============
  {
    id: 39, tema: 'Svelte', area: 'svelte', clase: 1, type: 'open',
    question: 'Explica el file-based routing con un ejemplo real de rutas de esta plataforma.',
    rubric: 'Carpetas=URL; ejemplo /desarrollo-web-2/actividad-de-la-semana y ruta dinámica [id]. 5 pts.'
  },
  {
    id: 40, tema: 'Svelte', area: 'svelte', clase: 1, type: 'open',
    question: 'Diferencia +layout.svelte de +page.svelte usando el Header y el inicio como ejemplo.',
    rubric: 'Layout envuelve con Header/Footer; page es el contenido de cada ruta. 5 pts.'
  },
  {
    id: 41, tema: 'Svelte', area: 'svelte', clase: 1, type: 'open',
    question: '¿Cuándo usarías goto() en vez de un <a>? Da el ejemplo del cierre de sesión.',
    rubric: 'Navegación programática tras una acción (logout→/login) vs enlace estático. 5 pts.'
  },
  {
    id: 42, tema: 'Svelte', area: 'svelte', clase: 2, type: 'open',
    question: 'Describe la anatomía de SubjectCard.svelte: qué va en script, markup y style.',
    rubric: 'Script: props/lógica; markup: tarjeta con icon/título; style: CSS propio encapsulado. 5 pts.'
  },
  {
    id: 43, tema: 'Svelte', area: 'svelte', clase: 2, type: 'open',
    question: '¿Qué problema resuelve el scoped CSS? Ilústralo con dos componentes que usen la clase .card.',
    rubric: 'Evita fugas/colisiones de estilos entre componentes. 5 pts.'
  },
  {
    id: 44, tema: 'Svelte', area: 'svelte', clase: 3, type: 'open',
    question: 'Explica el flujo de props padre→hijo con el ejemplo de SubjectCard o VideoCard de YouTube.',
    rubric: 'Padre pasa atributos; hijo los lee con $props; distintas instancias, distintos datos. 5 pts.'
  },
  {
    id: 45, tema: 'Svelte', area: 'svelte', clase: 3, type: 'open',
    question: '¿Para qué sirven los valores por defecto y el tipado en $props()? Da un ejemplo con href.',
    rubric: 'Evitan errores si falta la prop; TS documenta y valida (href?: string, href = "/"). 5 pts.'
  },
  {
    id: 46, tema: 'Svelte', area: 'svelte', clase: 4, type: 'open',
    question: 'Explica cómo implementarías modo claro/oscuro solo con variables CSS, sin Bootstrap.',
    rubric: ':root con paleta; var() en componentes; cambiar variables = cambia todo (ej. Spotify). 5 pts.'
  },
  {
    id: 47, tema: 'Svelte', area: 'svelte', clase: 4, type: 'open',
    question: 'Argumenta por qué este proyecto usa Flexbox/Grid nativo en vez de Bootstrap. Da un caso.',
    rubric: 'Layouts responsivos livianos sin dependencia pesada; ej. grids de tarjetas. 5 pts.'
  },
  {
    id: 48, tema: 'Svelte', area: 'svelte', clase: 5, type: 'open',
    question: 'Explica la separación datos/vista con el ejemplo de enlacesData.ts y su página.',
    rubric: 'Datos puros en $lib/data; la página solo itera y renderiza. 5 pts.'
  },
  {
    id: 49, tema: 'Svelte', area: 'svelte', clase: 5, type: 'open',
    question: '¿Qué es el "infierno de los puntos" en los imports y cómo lo evita el alias $lib?',
    rubric: 'Rutas relativas frágiles ../../..; $lib apunta a src/lib desde cualquier nivel. 5 pts.'
  },
  {
    id: 50, tema: 'Svelte', area: 'svelte', clase: 5, type: 'open',
    question: 'Diferencia componentes "tontos" de contenedores y explica las convenciones de nombres del proyecto.',
    rubric: 'UI pura vs lógica; PascalCase componentes, camelCase funciones (ej. Airbnb). 5 pts.'
  }
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(pool, n) {
  return shuffle(pool).slice(0, n);
}

/**
 * Examen de 20: 5 por grupo (temática × tipo), MC primero y abiertas después.
 * Grupos: arq-mc, arq-open, svelte-mc, svelte-open.
 */
export function selectRandomQuestions() {
  const mcArq = pick(questionBank.filter((q) => q.area === 'arq' && q.type === 'mc'), examConfig.perBucket);
  const mcSvelte = pick(questionBank.filter((q) => q.area === 'svelte' && q.type === 'mc'), examConfig.perBucket);
  const openArq = pick(questionBank.filter((q) => q.area === 'arq' && q.type === 'open'), examConfig.perBucket);
  const openSvelte = pick(questionBank.filter((q) => q.area === 'svelte' && q.type === 'open'), examConfig.perBucket);
  return [...shuffle([...mcArq, ...mcSvelte]), ...shuffle([...openArq, ...openSvelte])];
}

export function getBucketCounts(questions) {
  const c = { 'arq-mc': 0, 'arq-open': 0, 'svelte-mc': 0, 'svelte-open': 0 };
  for (const q of questions) c[`${q.area}-${q.type}`]++;
  return c;
}
