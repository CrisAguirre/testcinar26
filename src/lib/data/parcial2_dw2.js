export const questionBank = [
  // Tema 1: Despliegue en la nube (6 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Qué es Render en el contexto de despliegue de aplicaciones web?',
    options: [
      'Un lenguaje de programación',
      'Una plataforma en la nube para desplegar aplicaciones web',
      'Un framework de CSS',
      'Un editor de código'
    ],
    answer: 1,
    explanation: 'Render es una plataforma cloud (similar a Heroku, Railway) que permite desplegar aplicaciones web, APIs, bases de datos y servicios estáticos.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Qué archivo es esencial para desplegar una aplicación Node.js en Render?',
    options: ['`render.yaml`', '`package.json` con scripts de start', '`Dockerfile`', '`server.js`'],
    answer: 1,
    explanation: 'Render necesita `package.json` con un script `start` que defina cómo iniciar la aplicación. Opcionalmente se puede usar `render.yaml` para configuración avanzada.'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Qué variable de entorno es necesaria para conectar una app Node.js a MongoDB Atlas?',
    options: ['`DATABASE_URL`', '`MONGODB_URI`', '`MONGO_URL`', '`DB_CONNECTION`'],
    answer: 1,
    explanation: 'MongoDB Atlas proporciona una `MONGODB_URI` (o `MONGODB_URL`) que contiene la cadena de conexión completa con credenciales.'
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Qué significa "environment" en el contexto de despliegue?',
    options: [
      'El sistema operativo del servidor',
      'El conjunto de configuraciones (variables, servicios) donde corre la aplicación',
      'El lenguaje de programación usado',
      'El tamaño de la aplicación'
    ],
    answer: 1,
    explanation: 'Environment (entorno) se refiere a la configuración: desarrollo (dev), producción (prod), testing. Cada uno tiene sus propias variables y servicios.'
  },
  {
    id: 5, tema: 1, type: 'mc',
    question: '¿Cuál es la diferencia entre variables de entorno y constantes en el código?',
    options: [
      'Son lo mismo',
      'Las variables de entorno se configuran fuera del código y cambian según el environment',
      'Las constantes se cargan desde la base de datos',
      'Las variables de entorno solo existen en desarrollo'
    ],
    answer: 1,
    explanation: 'Las constantes están hardcodeadas en el código. Las variables de entorno (`process.env.*`) se configuran externamente y permiten que el mismo código funcione en diferentes environments.'
  },
  {
    id: 6, tema: 1, type: 'mc',
    question: '¿Qué servicio cloud es comúnmente usado para alojar bases de datos MongoDB?',
    options: ['AWS Lambda', 'MongoDB Atlas', 'Google Drive', 'Docker Hub'],
    answer: 1,
    explanation: 'MongoDB Atlas es el servicio managed de MongoDB en la nube. Ofrece clusters gratuitos (Atlas Free Tier) con replicas automáticas.'
  },

  // Tema 2: Full Stack Architecture (6 MC)
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Qué es una API REST?',
    options: [
      'Un tipo de base de datos',
      'Una convención para construir servicios web que usan HTTP',
      'Un lenguaje de programación',
      'Un framework de frontend'
    ],
    answer: 1,
    explanation: 'REST (Representational State Transfer) es un estilo arquitectónico para APIs web. Usa los métodos HTTP (GET, POST, PUT, DELETE) de forma estándar para interactuar con recursos.'
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Cuál es la responsabilidad del backend en una aplicación full stack?',
    options: [
      'Solo renderizar la interfaz de usuario',
      'Gestionar la lógica de negocio, base de datos y autenticación',
      'Solo servir archivos estáticos',
      'El frontend y backend son lo mismo'
    ],
    answer: 1,
    explanation: 'El backend maneja la lógica de negocio, se comunica con la base de datos, implementa autenticación/autorización, y provee endpoints API.'
  },
  {
    id: 9, tema: 2, type: 'mc',
    question: '¿Qué significa CORS en el contexto de aplicaciones web?',
    options: [
      'Un protocolo de base de datos',
      'Un mecanismo de seguridad que controla peticiones de un dominio a otro',
      'Un tipo de cifrado',
      'Un framework de CSS'
    ],
    answer: 1,
    explanation: 'CORS (Cross-Origin Resource Sharing) es un header HTTP que permite o restringe peticiones desde dominios diferentes al del servidor.'
  },
  {
    id: 10, tema: 2, type: 'mc',
    question: '¿Qué es un middleware en Express.js?',
    options: [
      'Un tipo de base de datos',
      'Una función que se ejecuta entre la petición y la respuesta',
      'Un componente de frontend',
      'Un lenguaje de programación'
    ],
    answer: 1,
    explanation: 'Los middleware en Express son funciones que procesan requests antes de que lleguen a las rutas. Ejemplos: cors, json parser, autenticación.'
  },
  {
    id: 11, tema: 2, type: 'mc',
    question: '¿Qué es el modelo MVC?',
    options: [
      'Un lenguaje de programación',
      'Un patrón de arquitectura: Model-View-Controller',
      'Un protocolo de red',
      'Un framework de CSS'
    ],
    answer: 1,
    explanation: 'MVC separa responsabilidades: Model (datos/lógica), View (presentación), Controller (peticiones/respuestas). Es común en frameworks como Express.'
  },
  {
    id: 12, tema: 2, type: 'mc',
    question: '¿Por qué es importante separar el frontend del backend?',
    options: [
      'No es importante, es mejor todo junto',
      'Permite escalabilidad, mantenimiento y desarrollo independiente de equipos',
      'Solo se hace por estética',
      'Los navegadores no soportan apps monolithic'
    ],
    answer: 1,
    explanation: 'Separar permite que diferentes equipos trabajen en paralelo, escalar independientemente cada parte, y reusar APIs para múltiples clientes.'
  },

  // Tema 3: Formularios y validación (6 MC)
  {
    id: 13, tema: 3, type: 'mc',
    question: '¿Qué método HTML se usa para enviar datos de un formulario al servidor?',
    options: ['`GET` y `POST`', 'Solo `POST`', 'Solo `GET`', '`SUBMIT`'],
    answer: 0,
    explanation: 'Los formularios pueden usar `method="GET"` (datos en URL) o `method="POST"` (datos en body). La elección depende del tipo de operación.'
  },
  {
    id: 14, tema: 3, type: 'mc',
    question: '¿Qué hace el atributo `required` en un input HTML?',
    options: [
      'Envía el formulario automáticamente',
      'Impide el envío del formulario si el campo está vacío',
      'Borra el campo después de enviar',
      'Cifra el valor del input'
    ],
    answer: 1,
    explanation: 'El atributo `required` es validación del lado del cliente que previene el envío si el campo está vacío o no cumple el formato.'
  },
  {
    id: 15, tema: 3, type: 'mc',
    question: '¿Por qué es importante validar datos en el backend si ya se validan en el frontend?',
    options: [
      'No es importante, la validación frontend es suficiente',
      'El frontend puede ser manipulado, el backend es la última línea de defensa',
      'Los navegadores no soportan validación',
      'La validación backend es más rápida'
    ],
    answer: 1,
    explanation: 'Cualquiera puede manipular las peticiones HTTP directamente (curl, Postman, DevTools). El backend debe validar siempre para seguridad e integridad de datos.'
  },
  {
    id: 16, tema: 3, type: 'mc',
    question: '¿Qué es un token JWT?',
    options: [
      'Un tipo de base de datos',
      'Un token de autenticación que contiene información del usuario',
      'Un método de cifrado',
      'Un protocolo de red'
    ],
    answer: 1,
    explanation: 'JWT (JSON Web Token) es un estándar para crear tokens de autenticación. Contiene claims (usuario, permisos, expiración) firmados digitalmente.'
  },
  {
    id: 17, tema: 3, type: 'mc',
    question: '¿Dónde se almacena típicamente un token JWT en el cliente?',
    options: ['En una variable global de JavaScript', 'En localStorage o cookies httpOnly', 'En el código fuente', 'En el DOM directamente'],
    answer: 1,
    explanation: 'localStorage es accesible via JS (vulnerable a XSS). Cookies httpOnly son más seguras (inaccesibles via JS, pero vulnerables a CSRF).'
  },
  {
    id: 18, tema: 3, type: 'mc',
    question: '¿Qué significa "stateless" en el contexto de autenticación JWT?',
    options: [
      'Que el servidor no guarda información',
      'Que cada request incluye toda la información necesaria, sin estado en el servidor',
      'Que la sesión expira inmediatamente',
      'Que no se puede usar cookies'
    ],
    answer: 1,
    explanation: 'JWT es stateless: el servidor no almacena sesiones. Cada request incluye el token, y el servidor lo valida sin consultar estado previo.'
  },

  // Tema 4: Buenas prácticas de código (4 MC)
  {
    id: 19, tema: 4, type: 'mc',
    question: '¿Qué significa "DRY" en programación?',
    options: [
      'Don\'t Repeat Yourself',
      'Delete and Repeat Yields',
      'Data Record Yes',
      'Debug Response Yield'
    ],
    answer: 0,
    explanation: 'DRY (Don\'t Repeat Yourself) es un principio que busca evitar la duplicación de código, extractando lógica repetida en funciones o componentes.'
  },
  {
    id: 20, tema: 4, type: 'mc',
    question: '¿Qué son las "named exports" en JavaScript?',
    options: [
      'Exportaciones que no tienen nombre',
      'Exportaciones con un nombre específico: `export { funcion }`',
      'Exportaciones por defecto',
      'Exportaciones que solo funcionan en producción'
    ],
    answer: 1,
    explanation: 'Named exports usan `export { nombre }` y se importan con `import { nombre }`. Permiten exportar múltiples items por archivo.'
  },
  {
    id: 21, tema: 4, type: 'mc',
    question: '¿Por qué es importante usar async/await en lugar de callbacks?',
    options: [
      'No hay diferencia',
      'Mejora la legibilidad y manejo de errores en operaciones asíncronas',
      'Es más rápido',
      'Los callbacks están deprecados'
    ],
    answer: 1,
    explanation: 'async/await hace el código asíncrono parecer síncrono, facilitando lectura y manejo de errores con try/catch.'
  },
  {
    id: 22, tema: 4, type: 'mc',
    question: '¿Qué es el "short-circuit evaluation" en JavaScript?',
    options: [
      'Evaluación de expresiones booleanas de izquierda a derecha deteniéndose tempranamente',
      'Un tipo de bucle',
      'Una función matemática',
      'Un método de cifrado'
    ],
    answer: 0,
    explanation: '`&&` y `||` evalúan de izquierda a derecha y retornan el primer valor que determina el resultado, sin evaluar el resto.'
  },

  // Tema 5: Testing básico (4 MC)
  {
    id: 23, tema: 5, type: 'mc',
    question: '¿Qué es Vitest?',
    options: [
      'Un framework de CSS',
      'Un framework de testing para JavaScript/Vite',
      'Un linter de código',
      'Un bundler'
    ],
    answer: 1,
    explanation: 'Vitest es un framework de testing (como Jest) optimizado para Vite. Es el recomendado para proyectos SvelteKit.'
  },
  {
    id: 24, tema: 5, type: 'mc',
    question: '¿Qué significa "mock" en testing?',
    options: [
      'Copiar código de internet',
      'Crear versiones falsas de funciones o módulos para testing aislado',
      'Un tipo de bug',
      'Un método de deploy'
    ],
    answer: 1,
    explanation: 'Los mocks sustituyen dependencias reales con versiones controladas. Permite testear unidades sin depender de APIs, DB, etc.'
  },
  {
    id: 25, tema: 5, type: 'mc',
    question: '¿Qué es un test unitario?',
    options: [
      'Un test que prueba toda la aplicación',
      'Un test que verifica el funcionamiento correcto de una unidad individual de código',
      'Un test de rendimiento',
      'Un test de seguridad'
    ],
    answer: 1,
    explanation: 'Los tests unitarios verifican funciones o componentes aislados. Son rápidos y facilitan identificar dónde algo falla.'
  },
  {
    id: 26, tema: 5, type: 'mc',
    question: '¿Cuál es la diferencia entre `describe`, `it` y `expect` en Jest/Vitest?',
    options: [
      'Son iguales',
      '`describe` agrupa tests, `it` define un test individual, `expect` hace aserciones',
      '`describe` es para funciones, `it` es para componentes',
      'No existen esas funciones'
    ],
    answer: 1,
    explanation: '`describe("suite", () => { it("test", () => { expect(actual).toBe(expected); }); });` Estructura estándar de tests.'
  },

  // Preguntas abiertas (8)
  {
    id: 27, tema: 1, type: 'open',
    question: 'Explica paso a paso cómo desplegarías una aplicación SvelteKit con backend Express y MongoDB Atlas en Render.'
  },
  {
    id: 28, tema: 2, type: 'open',
    question: 'Diseña la arquitectura de una aplicación full stack para un sistema de notas. Menciona frontend, backend, base de datos y flujo de datos.'
  },
  {
    id: 29, tema: 3, type: 'open',
    question: 'Crea un formulario de registro con validación tanto en frontend como en backend. Incluye: nombre, email, contraseña.'
  },
  {
    id: 30, tema: 3, type: 'open',
    question: 'Explica el flujo completo de autenticación con JWT: desde el login hasta el acceso a rutas protegidas.'
  },
  {
    id: 31, tema: 4, type: 'open',
    question: 'Refactoriza este código para seguir el principio DRY: function getUserName(user) { return user.name; } function getAdminName(admin) { return admin.name; }'
  },
  {
    id: 32, tema: 5, type: 'open',
    question: 'Escribe un test unitario para una función que calcula el promedio de un array de números.'
  },
  {
    id: 33, tema: 4, type: 'open',
    question: '¿Qué son las default exports y named exports? Provide ejemplos de cuándo usarías cada una.'
  },
  {
    id: 34, tema: 2, type: 'open',
    question: 'Explica qué es CORS y cómo configurarlo en Express para permitir peticiones desde tu frontend en SvelteKit.'
  }
];

export function selectRandomQuestions(count = 20) {
  const baseDistribution = [
    { tema: 1, count: 3 },
    { tema: 2, count: 3 },
    { tema: 3, count: 3 },
    { tema: 4, count: 2 },
    { tema: 5, count: 2 }
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
export const SIMULACRO_END = new Date('2026-08-15T23:59:59-05:00');
export const EVAL_START = new Date('2026-08-19T18:45:00-05:00');
export const EVAL_END = new Date('2026-08-19T20:00:00-05:00');
export const MAX_SIMULACROS = 3;
export const MAX_EVALUACIONES = 1;
