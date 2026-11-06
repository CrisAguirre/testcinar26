/**
 * Banco Parcial 2 — Desarrollo Web 2.
 * Evaluación unificada y expandida:
 * - Teoría de la sección Actividad de la semana (Clases 6-10, Svelte):
 *     Clase 6: Persistencia de datos (localStorage, borradores, Sync Queue, JSON)
 *     Clase 7: Interactividad avanzada (Inputs personalizados, bind:value, $bindable, validaciones)
 *     Clase 8: Comunicación entre componentes (createEventDispatcher, eventos personalizados, Callbacks)
 *     Clase 9: Reutilización avanzada (Slots tradicionales, named slots, Snippets y {@render children()})
 *     Clase 10: Optimización de la aplicación (Ciclo de vida, onMount, $effect con cleanup, memory leaks, SSR)
 * - Arquitectura avanzada y Fase 2 del Proyecto Colaborativo TrueX Trade:
 *     Requerimientos funcionales y no funcionales (RF-18, RF-19, RF-20, RF-30, RNF-11, RNF-12, RNF-16, RNF-21)
 *     Flujo de trueque, matching, transacciones, seguridad, roles, testing y despliegue.
 *
 * Clasificación idéntica a Parcial 1:
 * - Arquitectura: 13 abiertas + 12 selección múltiple = 25
 * - Svelte:       12 abiertas + 13 selección múltiple = 25
 * Total: 50 (25 abiertas + 25 MC). El examen toma 5 de cada grupo (20 preguntas en total).
 */

export const examConfig = {
  title: 'Parcial 2 - Desarrollo Web 2',
  dateLabel: 'Segundo Parcial · Desarrollo Web 2 (Evaluación Habilitada)',
  duration: 45 * 60,
  maxScore: 50,
  passingScore: 30,
  perBucket: 5,
  buckets: ['arq-mc', 'arq-open', 'svelte-mc', 'svelte-open']
};

export const questionBank = [
  // ============ ARQUITECTURA TrueX Trade (Fase 2) · MC (12) ============
  {
    id: 1, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En TrueX Trade, ¿cuál es la secuencia correcta del ciclo de vida de un intercambio (RF-19)?',
    options: [
      'Aceptado → Pendiente → Borrador → Archivado',
      'Pendiente → Aceptado o Rechazado o Cancelado → Completado (con fechas de confirmación)',
      'Directamente Completado sin validación previa del propietario',
      'Borrador → En revisión de administrador → Publicado → Vendido'
    ],
    answer: 1,
    explanation: 'RF-19 establece que una propuesta inicia en estado pendiente, pasa a aceptado, rechazado o cancelado, y finalmente a completado cuando ambas partes confirman la entrega.'
  },
  {
    id: 2, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Respecto a las validaciones de trueque (RF-18), ¿qué regla de negocio debe asegurar el backend?',
    options: [
      'Permitir que un producto reciba infinitas ofertas iguales del mismo usuario',
      'Verificar la disponibilidad previa del producto e impedir propuestas duplicadas en estado pendiente',
      'Exigir que todo trueque incluya dinero en efectivo obligatorio',
      'Rechazar automáticamente cualquier propuesta enviada después de las 6:00 p.m.'
    ],
    answer: 1,
    explanation: 'RF-18 exige verificar disponibilidad e impedir ofertas duplicadas en pendiente sobre el mismo producto.'
  },
  {
    id: 3, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'El sistema de coincidencias y alertas automáticas (RNF-16) de TrueX Trade funciona cruzando:',
    options: [
      'Solo el número de documento de identidad de los usuarios',
      'La oferta publicada con las listas de deseos (Wishlist), categorías, ubicación y características deseadas',
      'Los precios en dólares fijados por una API de cotizaciones',
      'Las publicaciones con las calificaciones escolares de los alumnos'
    ],
    answer: 1,
    explanation: 'RNF-16 cruza categorías, ubicación y wishlists (RNF-15) para disparar notificaciones de matching relevante.'
  },
  {
    id: 4, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En el sistema de calificaciones y reputación (RNF-21), ¿cuándo se habilita la evaluación entre usuarios?',
    options: [
      'En cualquier momento, incluso sin haber realizado ningún intercambio',
      'Únicamente tras completar exitosamente un intercambio confirmado por ambas partes',
      'Solo cuando el administrador aprueba una solicitud por correo',
      'Al momento de registrarse por primera vez en la plataforma'
    ],
    answer: 1,
    explanation: 'Las reseñas y puntuaciones (1 a 5 estrellas) se habilitan solo tras el cierre formal de un trueque completado (RNF-21).'
  },
  {
    id: 5, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Para evitar vulnerabilidades de tipo IDOR (Insecure Direct Object Reference) en la eliminación de publicaciones (RF-8), el backend debe:',
    options: [
      'Confiar ciegamente en el ID de usuario que envía el cliente en el cuerpo de la petición',
      'Verificar que el ID de usuario autenticado en el token JWT coincida con el propietario del producto en MongoDB',
      'Permitir que cualquier usuario registrado borre cualquier producto para agilizar la moderación',
      'Eliminar las comprobaciones de autorización para mejorar el tiempo de respuesta'
    ],
    answer: 1,
    explanation: 'La autorización estricta en servidor verifica que el usuario autenticado (extraído del JWT validado) sea el dueño del recurso.'
  },
  {
    id: 6, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En la gestión de imágenes de productos (RF-27), ¿cuál es la mejor práctica de arquitectura para la plataforma?',
    options: [
      'Almacenar fotos pesadas en resolución 4K directamente en Base64 dentro del documento de MongoDB',
      'Subir las imágenes a almacenamiento optimizado en la nube (ej. Cloudinary/S3) y guardar solo la URL pública en MongoDB',
      'Obligar al usuario a enviar las fotos por correo electrónico al docente',
      'No admitir imágenes en las publicaciones para ahorrar espacio'
    ],
    answer: 1,
    explanation: 'Guardar binarios pesados en MongoDB satura la RAM del cluster Atlas; se deben almacenar URLs hacia servicios de almacenamiento optimizados.'
  },
  {
    id: 7, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Al implementar la paginación y ordenamiento del catálogo (RNF-12) en la API REST de Express con MongoDB:',
    options: [
      'Se traen todos los 100.000 productos a la memoria de React y se cortan con un slice() en el navegador',
      'Se usan los métodos .skip() y .limit() de Mongoose junto con índices para devolver únicamente la página solicitada',
      'Se reinicia la base de datos en cada cambio de página',
      'Se deshabilita la paginación porque las conexiones modernas son infinitas'
    ],
    answer: 1,
    explanation: 'La paginación server-side con skip() y limit() reduce drásticamente el consumo de red y memoria tanto en backend como en frontend.'
  },
  {
    id: 8, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Sobre el despliegue a producción de TrueX Trade, ¿qué infraestructura aloja cada capa?',
    options: [
      'Frontend en Vercel, backend API en Render y base de datos en MongoDB Atlas (Cluster0)',
      'Todo alojado en un pendrive USB local compartido en el aula',
      'Base de datos en Render, backend en Vercel y frontend en un servidor FTP de 2005',
      'Frontend y base de datos en Vercel sin servidor backend'
    ],
    answer: 0,
    explanation: 'La arquitectura en la nube de TrueX Trade se despliega en Vercel (React), Render (Node/Express API) y Atlas (Cluster0 Mongo).'
  },
  {
    id: 9, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En el flujo de trabajo de Git del equipo de TrueX Trade, ¿cuál es el protocolo obligatorio acordado?',
    options: [
      'Todos los estudiantes hacen push forzado (git push -f) directamente a la rama main cada hora',
      'Trabajo en ramas por módulo (feature/módulo), Pull Request revisado e integración semanal obligatoria los viernes',
      'Enviar los archivos comprimidos en un archivo .zip por WhatsApp',
      'No utilizar control de versiones hasta el último día del semestre'
    ],
    answer: 1,
    explanation: 'El equipo acordó ramas por módulo con integración obligatoria cada viernes para evitar desajustes catastróficos de código.'
  },
  {
    id: 10, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En la división de responsabilidades del equipo TrueX Trade, ¿qué rol lideran Diego Azain y Harold Quiroz?',
    options: [
      'Diseño exclusivo del logotipo en Illustrator',
      'QA / DevOps testing: pruebas de endpoints, datos de prueba (seed), estabilización y verificación de despliegues',
      'Dirección general de finanzas y ventas',
      'Redacción del manual de usuario en papel'
    ],
    answer: 1,
    explanation: 'Diego y Harold tienen a su cargo QA/DevOps, asegurando que los endpoints y despliegues no fallen antes de la demo.'
  },
  {
    id: 11, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'Si antes de la entrega final el equipo detecta que el tiempo no alcanza, ¿cuál fue la directriz de contingencia?',
    options: [
      'Eliminar por completo el inicio de sesión y la base de datos',
      'Recortar funcionalidades secundarias (como chat en vivo reemplazado por notas en la propuesta) y priorizar el flujo central del trueque',
      'Suspender el proyecto y presentar diapositivas vacías',
      'Hacer que un solo estudiante programe todo el fin de semana sin dormir'
    ],
    answer: 1,
    explanation: 'El acuerdo de contingencia establece proteger el núcleo transaccional (trueque) y simplificar extras como el chat realtime a mensajes por propuesta.'
  },
  {
    id: 12, tema: 'Arquitectura', area: 'arq', type: 'mc',
    question: 'En la fase de cierre y demo (Semanas 5 y 6), ¿cuál es el rol principal de Danilo López (Mercadeo)?',
    options: [
      'Programar los controladores de Mongoose en Node.js',
      'Diseñar piezas de difusión, video pitch, presentación de lanzamiento y consolidar las métricas de impacto de la demo',
      'Administrar las contraseñas de los servidores de producción',
      'Calificar los exámenes de sus compañeros de grupo'
    ],
    answer: 1,
    explanation: 'Danilo lidera mercadeo y lanzamiento: presentación, pitch, piezas de comunicación y métricas de validación con usuarios.'
  },

  // ============ ARQUITECTURA TrueX Trade (Fase 2) · ABIERTAS (13) ============
  {
    id: 13, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Describe el flujo de estados completo de una propuesta de trueque (RF-19) y qué validación debe ejecutarse cuando se marca como "completada".',
    rubric: 'Menciona estados: pendiente, aceptada/rechazada/cancelada, completada. Al completar: ambos productos pasan a no disponibles y se habilitan calificaciones. 5 pts.'
  },
  {
    id: 14, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Explica cómo implementarías el control anti-duplicados de ofertas de trueque (RF-18) en la base de datos o controlador de Express.',
    rubric: 'Verificar existencia de propuesta previa en estado "pendiente" entre los mismos productos antes de insertar; rechazar con código HTTP 400/409. 5 pts.'
  },
  {
    id: 15, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Diseña la lógica del algoritmo de matching (RNF-16): ¿qué campos de la publicación del usuario A se comparan con la Wishlist del usuario B?',
    rubric: 'Compara categoría, palabras clave, ubicación y características deseadas; genera notificación al existir coincidencia alta. 5 pts.'
  },
  {
    id: 16, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Explica el mecanismo de seguridad (RF-30) necesario para proteger los endpoints privados de la API frente a usuarios no autenticados o con rol no autorizado.',
    rubric: 'Middleware auth (verificación de token JWT en header o cookie httpOnly) + validación de rol (admin vs standard) + bloqueo 401/403. 5 pts.'
  },
  {
    id: 17, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: '¿Por qué no es recomendable cargar todos los registros en el frontend y cómo se implementa paginación eficiente en MongoDB con skip y limit (RNF-12)?',
    rubric: 'Explica consumo de ancho de banda y memoria; detalla cálculo de skip = (page - 1) * limit y limit en consulta Mongoose. 5 pts.'
  },
  {
    id: 18, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Compara almacenar imágenes en Base64 dentro de MongoDB frente a un almacenamiento externo (Cloudinary/S3). ¿Qué impacto tiene en la base de datos Atlas?',
    rubric: 'Base64 incrementa tamaño x1.33, satura límite de 16MB por documento y satura RAM en Atlas; servicio externo guarda solo URL liviana. 5 pts.'
  },
  {
    id: 19, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Explica cómo el sistema de calificaciones y reputación (RNF-21) previene fraudes en una plataforma de intercambio colaborativo peer-to-peer.',
    rubric: 'Puntuación histórica visible, comentarios reales tras intercambio confirmado, desincentiva usuarios malintencionados o productos defectuosos. 5 pts.'
  },
  {
    id: 20, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Si a 5 días del lanzamiento el backend falla en el chat en tiempo real con WebSockets, ¿qué solución de contingencia acordó el equipo y por qué?',
    rubric: 'Sustituir chat en vivo por mensajes o notas asociadas a la propuesta de trueque; protege la entrega de la funcionalidad crítica. 5 pts.'
  },
  {
    id: 21, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: '¿Cuál es la función del archivo seed.js en el backend y por qué es indispensable para el trabajo coordinado de QA y Frontend?',
    rubric: 'Poblar la base de datos con usuarios y publicaciones iniciales consistentes; permite a frontend y QA probar flujos sin crear datos manuales. 5 pts.'
  },
  {
    id: 22, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Explica las ventajas de la política de integración semanal de los viernes y ramas por módulo frente a integrar todo el código la noche anterior a la entrega.',
    rubric: 'Detecta conflictos tempranos, mantiene la rama main estable y desplegable en Vercel/Render, y reduce estrés de integración final. 5 pts.'
  },
  {
    id: 23, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Diseña la estructura de una consulta con filtros combinados (RNF-11) en MongoDB para buscar productos por categoría, ciudad y texto libre.',
    rubric: 'Uso de operadores $and, $regex o texto para nombre, y coincidencias exactas para categoría y ciudad en filtro de find(). 5 pts.'
  },
  {
    id: 24, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Desde la perspectiva de Mercadeo y Lanzamiento (Danilo), ¿qué métricas de la demo permiten validar si TrueX Trade tiene tracción con usuarios reales?',
    rubric: 'Número de usuarios registrados, cantidad de publicaciones creadas, porcentaje de propuestas de trueque aceptadas y feedback cualitativo. 5 pts.'
  },
  {
    id: 25, tema: 'Arquitectura', area: 'arq', type: 'open',
    question: 'Explica qué significa "contrato API primero" en la integración entre el backend de Node y el frontend de React en TrueX Trade.',
    rubric: 'Acordar rutas, verbos HTTP, parámetros y esquemas JSON antes de codificar; permite desarrollo en paralelo sin bloqueo entre áreas. 5 pts.'
  },

  // ============ SVELTE Clases 6-10 · MC (13) ============
  {
    id: 26, tema: 'Svelte', area: 'svelte', clase: 6, type: 'mc',
    question: 'En Svelte, ¿cuál es la característica principal de localStorage para la persistencia de datos (Clase 6)?',
    options: [
      'Los datos se eliminan automáticamente cuando el usuario cambia de componente',
      'Los datos permanecen almacenados en el navegador incluso si se cierra la pestaña o se apaga el equipo',
      'Solo puede almacenar archivos de video de más de 100 MB',
      'Se sincroniza instantáneamente con todas las computadoras del mundo sin internet'
    ],
    answer: 1,
    explanation: 'localStorage ofrece persistencia síncrona en el cliente que sobrevive al cierre del navegador (Clase 6).'
  },
  {
    id: 27, tema: 'Svelte', area: 'svelte', clase: 6, type: 'mc',
    question: 'Dado que localStorage solo almacena cadenas de texto (strings), ¿qué métodos son indispensables para guardar y recuperar objetos o arrays?',
    options: [
      'JSON.toText() y JSON.fromText()',
      'JSON.stringify() para guardar y JSON.parse() para recuperar',
      'toString() y toArray() nativos de HTML',
      'encodeURIComponent() únicamente'
    ],
    answer: 1,
    explanation: 'JSON.stringify convierte el objeto/array a string y JSON.parse reconstruye la estructura original en JavaScript (Clase 6).'
  },
  {
    id: 28, tema: 'Svelte', area: 'svelte', clase: 6, type: 'mc',
    question: 'En los parciales de esta plataforma, ¿cuál es el objetivo de la cola de sincronización (Sync Queue)?',
    options: [
      'Impedir que el estudiante termine el examen antes de tiempo',
      'Guardar localmente las respuestas si falla la conexión y sincronizarlas automáticamente cuando el servidor vuelve a responder',
      'Aumentar el consumo de batería del portátil',
      'Descargar copias piratas de los exámenes'
    ],
    answer: 1,
    explanation: 'La cola de sincronización offline (Sync Queue) retiene las notas/respuestas ante caídas de red y las envía al reconectar (Clase 6).'
  },
  {
    id: 29, tema: 'Svelte', area: 'svelte', clase: 7, type: 'mc',
    question: 'En Svelte, ¿qué beneficio proporciona la vinculación bidireccional mediante la directiva `bind:value` (Clase 7)?',
    options: [
      'Obliga a escribir manejadores de eventos manuales oninput para cada tecla',
      'Mantiene sincronizado automáticamente el estado de la variable de JavaScript con el valor visible en el input del DOM en ambas direcciones',
      'Solo funciona para inputs de solo lectura',
      'Convierte el texto en mayúsculas automáticamente'
    ],
    answer: 1,
    explanation: 'bind:value sincroniza automáticamente cambios del DOM a la variable y cambios de la variable al DOM (Clase 7).'
  },
  {
    id: 30, tema: 'Svelte', area: 'svelte', clase: 7, type: 'mc',
    question: 'En Svelte 5, si queremos que un componente hijo (`CustomInput.svelte`) exponga una prop que el padre pueda enlazar con `bind:value`, ¿qué runa debemos usar?',
    options: [
      'let { value = $state(\'\') } = $props()',
      'let { value = $bindable(\'\') } = $props()',
      'let { value = $derived(\'\') } = $props()',
      'export let value sin runas'
    ],
    answer: 1,
    explanation: '$bindable() en Svelte 5 declara explícitamente que una prop es enlazable bidireccionalmente por el componente padre (Clase 7).'
  },
  {
    id: 31, tema: 'Svelte', area: 'svelte', clase: 7, type: 'mc',
    question: 'Para validar un formulario de registro en tiempo real y habilitar el botón de envío solo cuando los campos cumplan las condiciones, la mejor práctica en Svelte 5 es:',
    options: [
      'Usar una función recursiva infinita con setTimeout',
      'Declarar una variable calculada reactiva con $derived(valido)',
      'Hacer una petición a la base de datos por cada letra presionada',
      'Recargar toda la página web con cada tecla'
    ],
    answer: 1,
    explanation: '$derived calcula automáticamente la validez booleana del formulario cada vez que sus inputs reactivos cambian (Clase 7).'
  },
  {
    id: 32, tema: 'Svelte', area: 'svelte', clase: 8, type: 'mc',
    question: 'En la comunicación hijo → padre, ¿cuál es el propósito de `createEventDispatcher` en Svelte (Clase 8)?',
    options: [
      'Conectarse directamente a una base de datos MySQL',
      'Permitir que un componente hijo despache eventos personalizados que el componente padre puede escuchar con la directiva on:[evento]',
      'Crear rutas automáticas en el sistema de archivos',
      'Eliminar estilos CSS de la página'
    ],
    answer: 1,
    explanation: 'createEventDispatcher emite eventos personalizados hacia arriba en el árbol de componentes (Clase 8).'
  },
  {
    id: 33, tema: 'Svelte', area: 'svelte', clase: 8, type: 'mc',
    question: 'Si un componente hijo ejecuta `dispatch(\'seleccionado\', { cursoId: 10 })`, ¿en qué propiedad del evento recibe el padre esos datos?',
    options: [
      'evento.target.value',
      'evento.detail.cursoId',
      'evento.data.payload',
      'evento.body.cursoId'
    ],
    answer: 1,
    explanation: 'Los eventos personalizados despachados en Svelte siguen el estándar CustomEvent del DOM y viajan en la propiedad detail (Clase 8).'
  },
  {
    id: 34, tema: 'Svelte', area: 'svelte', clase: 8, type: 'mc',
    question: 'En Svelte 5, ¿cuál es el estándar moderno recomendado para comunicar eventos de un hijo al padre de forma fuertemente tipada?',
    options: [
      'Callback Props: pasar funciones manejadoras como props (ej. onSelect, onAction) y ejecutarlas en el hijo',
      'Usar variables globales window para todo',
      'Copiar y pegar el código del padre en el hijo',
      'Usar únicamente alert() y prompt()'
    ],
    answer: 0,
    explanation: 'En Svelte 5, las callback props tipadas (ej. onSelect?: (id: number) => void) son el estándar más limpio y eficiente (Clase 8).'
  },
  {
    id: 35, tema: 'Svelte', area: 'svelte', clase: 9, type: 'mc',
    question: 'En Svelte 5, ¿cómo se proyecta el contenido por defecto del componente padre dentro del hijo (reemplazo moderno de `<slot />`)?',
    options: [
      'Recibiendo la prop children desde $props() y renderizándola con {@render children()}',
      'Escribiendo obligatoriamente <slot name="default" />',
      'Usando {@html children}',
      'Con una etiqueta <iframe>'
    ],
    answer: 0,
    explanation: 'En Svelte 5, los slots evolucionaron a Snippets: el contenido predeterminado se recibe como prop children y se renderiza con {@render children()} (Clase 9).'
  },
  {
    id: 36, tema: 'Svelte', area: 'svelte', clase: 9, type: 'mc',
    question: '¿Qué ventaja ofrecen los Named Slots o Snippets con nombre en un componente como un Modal o Tarjeta?',
    options: [
      'Hacen que el componente sea más pesado sin ningún beneficio',
      'Permiten definir múltiples zonas independientes de inyección (ej. cabecera, cuerpo y pie) manteniendo el diseño exterior consistente',
      'Impiden que el componente reciba estilos CSS',
      'Solo se pueden usar una vez en toda la aplicación'
    ],
    answer: 1,
    explanation: 'Los slots/snippets nombrados permiten inyectar contenido en diferentes zonas específicas del contenedor sin romper su estructura (Clase 9).'
  },
  {
    id: 37, tema: 'Svelte', area: 'svelte', clase: 10, type: 'mc',
    question: '¿Por qué la función de ciclo de vida `onMount` es crítica al interactuar con APIs del navegador como `localStorage` o `window` (Clase 10)?',
    options: [
      'Porque onMount corre únicamente en el servidor y oculta las credenciales',
      'Porque onMount se ejecuta exclusivamente en el navegador tras insertarse el DOM, protegiendo al Server-Side Rendering (SSR) de errores ReferenceError',
      'Porque borra el contenido de la página para que cargue más rápido',
      'Porque es obligatoria para poder usar variables numéricas'
    ],
    answer: 1,
    explanation: 'onMount solo corre en el cliente, evitando que el servidor falle al intentar acceder a objetos que no existen en Node.js (Clase 10).'
  },
  {
    id: 38, tema: 'Svelte', area: 'svelte', clase: 10, type: 'mc',
    question: 'Al programar un temporizador periódico (`setInterval`) en Svelte 5 dentro de un `$effect`, ¿cómo se evitan fugas de memoria (memory leaks)?',
    options: [
      'Svelte destruye los temporizadores automáticamente sin necesidad de código',
      'Retornando una función de limpieza desde dentro del $effect que ejecute clearInterval(id)',
      'Aumentando el tiempo del temporizador a 10 horas',
      'Declarando el intervalo dentro de una etiqueta <style>'
    ],
    answer: 1,
    explanation: 'La función retornada por $effect es la función de limpieza (cleanup) que Svelte ejecuta al desmontar el componente o antes de re-ejecutar el efecto (Clase 10).'
  },

  // ============ SVELTE Clases 6-10 · ABIERTAS (12) ============
  {
    id: 39, tema: 'Svelte', area: 'svelte', clase: 6, type: 'open',
    question: 'Explica cómo se implementó la persistencia de autenticación en src/lib/stores/auth.js mediante localStorage. ¿Cuándo se escribe y cuándo se limpia?',
    rubric: 'Menciona lectura inicial para restaurar sesión, escritura en login() (token y usuario), y limpieza con removeItem en logout(). 5 pts.'
  },
  {
    id: 40, tema: 'Svelte', area: 'svelte', clase: 6, type: 'open',
    question: '¿Por qué es indispensable usar JSON.stringify() y JSON.parse() al persistir borradores de examen o carritos de compra en localStorage? Ejemplifica.',
    rubric: 'Explica que localStorage solo soporta cadenas de texto; objetos o arrays directos se convierten a "[object Object]" inutilizable; parse los reconstruye. 5 pts.'
  },
  {
    id: 41, tema: 'Svelte', area: 'svelte', clase: 6, type: 'open',
    question: 'Diseña la estructura de una cola de sincronización offline (Sync Queue): ¿qué datos debe almacenar localmente y cuándo debe intentar procesarse?',
    rubric: 'Array de objetos con payload, fecha de intento y endpoint; procesa al cargar página, evento online o reconexión exitosa. 5 pts.'
  },
  {
    id: 42, tema: 'Svelte', area: 'svelte', clase: 7, type: 'open',
    question: 'Compara el flujo de datos de un input con enlace unidireccional (value={x}) frente a uno bidireccional (bind:value={x}). ¿Cuándo es necesario cada uno?',
    rubric: 'Unidireccional: solo lectura o requiere evento oninput explícito; bidireccional: formularios donde el usuario modifica el estado directamente. 5 pts.'
  },
  {
    id: 43, tema: 'Svelte', area: 'svelte', clase: 7, type: 'open',
    question: 'Explica cómo la runa $bindable() de Svelte 5 permite crear componentes de entrada modulares (ej. CustomInput.svelte) reutilizables en múltiples vistas.',
    rubric: 'Permite que el hijo reciba la prop y el padre use bind:value en la etiqueta del componente, propagando cambios en doble vía limpiamente. 5 pts.'
  },
  {
    id: 44, tema: 'Svelte', area: 'svelte', clase: 8, type: 'open',
    question: 'Describe el ciclo completo de comunicación usando createEventDispatcher: ¿qué hace el hijo al despachar y cómo responde el padre al capturar el evento?',
    rubric: 'Hijo importa y ejecuta dispatch("nombre", payload); padre usa directiva on:nombre={(e) => ...} y lee e.detail. 5 pts.'
  },
  {
    id: 45, tema: 'Svelte', area: 'svelte', clase: 8, type: 'open',
    question: 'Compara createEventDispatcher frente al paso de Callback Props (funciones por prop) en Svelte 5. ¿Por qué este último es el preferido en arquitecturas modernas?',
    rubric: 'Callback props son tipadas por TypeScript, siguen el flujo estándar de JavaScript, no dependen del sistema CustomEvent del DOM y son más legibles. 5 pts.'
  },
  {
    id: 46, tema: 'Svelte', area: 'svelte', clase: 9, type: 'open',
    question: 'Explica el principio de inversión de control de interfaz gráfica utilizando slots o snippets con el ejemplo del layout global (+layout.svelte).',
    rubric: 'Layout provee la estructura fija (Header, contenedor, Footer), pero delega el contenido variable a través de {@render children()}. 5 pts.'
  },
  {
    id: 47, tema: 'Svelte', area: 'svelte', clase: 9, type: 'open',
    question: '¿Cómo diseñarías un componente ModalCard modular con Snippets de Svelte 5 que permita inyectar cabecera personalizada, cuerpo y botones de acción?',
    rubric: 'Define props header, children y footer como Snippets opcionales/obligatorios; renderiza cada uno con {@render ...} en su sección visual. 5 pts.'
  },
  {
    id: 48, tema: 'Svelte', area: 'svelte', clase: 10, type: 'open',
    question: '¿Por qué ocurre un error 500 en servidores SSR (como Vercel o Node) si se llama a window o localStorage en el script principal y cómo lo previene onMount?',
    rubric: 'En el servidor no existe el objeto window ni el DOM; onMount garantiza ejecución diferida en el cliente una vez que el navegador está activo. 5 pts.'
  },
  {
    id: 49, tema: 'Svelte', area: 'svelte', clase: 10, type: 'open',
    question: 'Explica qué es una fuga de memoria (memory leak) provocada por un setInterval en una aplicación de una sola página y cómo se soluciona en Svelte.',
    rubric: 'El temporizador sigue ejecutándose en segundo plano aunque el usuario cambie de ruta, consumiendo CPU/RAM; se destruye con clearInterval en el retorno del $effect u onDestroy. 5 pts.'
  },
  {
    id: 50, tema: 'Svelte', area: 'svelte', clase: 10, type: 'open',
    question: 'Analiza la implementación del temporizador del Parcial 1/2 en esta plataforma: ¿cómo gestiona los estados de iniciado, decremento y auto-envío al llegar a 0?',
    rubric: 'Variable timeLeft reactiva, intervalo de 1s con decremento si started && !finished, auto-ejecución de handleSubmit al llegar a 0, y limpieza de intervalo. 5 pts.'
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
export function selectRandomQuestions(count = 20) {
  const perBucket = Math.floor(count / 4);
  const mcArq = pick(questionBank.filter((q) => q.area === 'arq' && q.type === 'mc'), perBucket);
  const mcSvelte = pick(questionBank.filter((q) => q.area === 'svelte' && q.type === 'mc'), perBucket);
  const openArq = pick(questionBank.filter((q) => q.area === 'arq' && q.type === 'open'), perBucket);
  const openSvelte = pick(questionBank.filter((q) => q.area === 'svelte' && q.type === 'open'), perBucket);
  return [...shuffle([...mcArq, ...mcSvelte]), ...shuffle([...openArq, ...openSvelte])];
}

export function getBucketCounts(questions) {
  const c = { 'arq-mc': 0, 'arq-open': 0, 'svelte-mc': 0, 'svelte-open': 0 };
  for (const q of questions) c[`${q.area}-${q.type}`]++;
  return c;
}
