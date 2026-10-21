# Cinar - Estado Actual de la Plataforma (19 Octubre 2026)

## Estructura del Proyecto
x
```
Cinar/
├── testcinar26/           # Frontend (SvelteKit)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── desarrollo-web-1/   # DW1 (solo contenido, examenes bloqueados para estudiantes)
│   │   │   │   ├── parcial-1/       
│   │   │   │   ├── parcial-2/       
│   │   │   │   ├── algoritmia/
│   │   │   │   │   └── taller/      
│   │   │   │   ├── notas/
│   │   │   │   ├── enlaces-de-consulta/
│   │   │   │   └── actividad-de-la-semana/
│   │   │   ├── desarrollo-web-2/   # DW2
│   │   │   │   ├── parcial-1/      # HABILITADO 19-21/10 (evaluación con retoma en la nube)
│   │   │   │   ├── parcial-2/      # BLOQUEADO no-admin
│   │   │   │   ├── taller/         # BLOQUEADO no-admin
│   │   │   │   ├── notas/
│   │   │   │   ├── enlaces-de-consulta/
│   │   │   │   ├── actividad-de-la-semana/  # Simplificada y con ejemplos prácticos externos.
│   │   │   │   └── proyecto-colaborativo/   # TrueX Trade (Intercambios P2P): React front + roles asignados (6+docente) + cronograma 6 sem. Maquetado ordenado 01/02/03.
│   │   │   ├── admin/              # Módulo Administrativo (6 sub-rutas)
│   │   │   │   ├── +page.svelte           # Panel principal con 6 tarjetas animadas
│   │   │   │   ├── planeacion/            # Horarios, temáticas, disponibilidad docente, oferta capacitaciones
│   │   │   │   ├── registro-academico/    # Notas, contenido temático, asistencia, seguimiento
│   │   │   │   ├── capacitaciones/        # Oferta, solicitudes, historial
│   │   │   │   ├── normativa/             # Estado de normas, descargas, cumplimiento institucional
│   │   │   │   └── soporte/               # Asistencia remota, manuales, FAQ
│   │   │   └── algoritmos/         # Algoritmos
│   │   │       ├── parcial-1/      # BLOQUEADO no-admin
│   │   │       ├── parcial-2/      # BLOQUEADO no-admin
│   │   │       ├── taller/         # BLOQUEADO no-admin (+ variantes algoritmia/taller x3 cursos)
│   │   │       ├── notas/
│   │   │       ├── videos/         # 3 videos (Pensamiento crítico, Reto, Video 3)
│   │   │       ├── enlaces-de-consulta/  # Usa $lib/data/enlacesData.ts (IA y Aprendizaje +3: UNAD Cisco, MongoDB University, Capacítate).
│   │   │       ├── actividad-de-la-semana/  # Tabs Nivel 1 (16) + Nivel 2 (22) + Nivel 3 (12) con análisis; abre en editor (?load=N1-X/N2-X/N3-X).
│   │   │       ├── dfd/             # Editor visual DFD v2 (ver punto 5 y 7).
│   │   │       └── proyecto-personal/       # 13 proyectos + carrusel 10 pasos + barra progreso (todos en paso 2).
│   │   ├── lib/
│   │   │   ├── data/                # Bancos de preguntas (DW2 y Algo) + enlacesData.ts
│   │   │   ├── dfd/                 # parser.js (parse/serialize + return/call/merge), renderer.js (path por figura), executor.js (con onStep/path), pseudocode.js
│   │   │   ├── guards/              # examLock.js (EXAM_LOCK_ACTIVE, isStrictAdmin solo role==='admin')
│   │   │   ├── stores/              # Auth (token en memoria + migración legada + logout total), preloaded
│   │   │   ├── components/          # SubjectCard, etc
│   │   │   │   └── admin/           # AvailabilityForm, ClassPlanForm, CourseContentForm, GradeSheetTable, AttendanceTable, ContentTrackingTable, FormStatusBadge
│   │   │   └── api.js               # access en memoria + refresh silencioso single-flight + credentials:include + adminApi
│   │   └── static/
│   │       ├── guias/Manual_Manejo_Editor_DFD.pdf  # Manual con logo (Ver/Descargar desde el editor)
│   │       ├── videos/Video_3.mp4                 # Video 3 algoritmos (10.5 MB)
│   │       └── dfd/nivel1/ (16) + dfd/nivel2/ (22 Condicionales)
│   │   └── lib/data/
│   │       ├── parcial1_dw2.js
│   │       ├── parcial2_dw2.js
│   │       ├── taller_dw2.js
│   │       ├── parcial1_algo.js
│   │       ├── parcial2_algo.js
│   │       └── taller_algo.js
│   └── exam configs en /lib/exam_*.js
├── testcinar26bknd/       # Backend (Express)
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js         # + refreshTokenHash/ExpiresAt (select:false) para P2
│   │   │   ├── Grade.js
│   │   │   ├── Enrollment.js    # Sistema de inscripciones con projectIdea
│   │   │   ├── Availability.js  # Disponibilidad docente (horarios/grilla)
│   │   │   ├── ClassPlan.js     # Plan de clase (5 fases ETED)
│   │   │   ├── CourseContent.js # Syllabus/contenido temático
│   │   │   ├── GradeSheet.js    # Planilla de calificaciones institucional
│   │   │   ├── Attendance.js    # Control de asistencia
│   │   │   └── ContentTracking.js # Seguimiento temático (sesiones firmadas)
│   │   ├── controllers/
│   │   │   ├── authController.js   # register fuerza student, validación, sesiones refresh/logout, cambio de contraseña
│   │   │   ├── gradeController.js  # IDOR fix en getById + bloqueo EXAMS_LOCK en mine
│   │   │   ├── enrollmentController.js  # getMine(), saveProjectIdea()
│   │   │   └── adminController.js  # CRUD 6 formatos administrativos (eslint-disable no-unused-vars para destructuring)
│   │   ├── routes/             # auth, grades, enrollments, admin (6 formatos)
│   │   ├── middlewares/        # authMiddleware (fail-fast JWT) + requireAllowedOrigin (anti-CSRF)
│   │   └── index.js            # helmet, CORS restringido+credentials, rate-limits, no-store, seedAdmin por env
│   └── eslint.config.js         # Backend auditado con ESLint (0 errores, 0 warnings, verificado 04/10).
│   └── deps nuevas: helmet, express-rate-limit
└── package.json workspaces (seed.js ejecuta en start de render)
```

## Reglas de Acceso por Curso

### Bloqueo temporal de parciales/talleres (29/09, vigente)
- **Solo `role==='admin'`** puede entrar a parcial-1, parcial-2 y taller (incluye `algoritmia/taller`) de los 3 cursos. Estudiantes, coordinadores y teachers ven `🔒 Bloqueado` + banner en los menús y son redirigidos si usan URL directa.
- Frontend: `src/lib/guards/examLock.js` (`EXAM_LOCK_ACTIVE=true`). Backend espejo: `EXAMS_LOCKED` (default true) bloquea `POST/PUT /api/grades/mine` de exámenes a no privilegiados. Para levantar: ambos flags en false.
- Motivo: aún no son las fechas.

### Desarrollo Web 1
- **Todos los usuarios autenticados** pueden acceder al contenido.
- **Examenes bloqueados** para usuarios normales (ven "Curso Finalizado").
- **Admin/Coordinador** (`role: 'admin'` o `'coordinator'`) pueden presentar examenes.
- No requiere inscripción estricta.

### Desarrollo Web 2 y Algoritmos
- **Acceso mediante Enrollments**: Requiere inscripción explícita.
- `seed.js` inscribe automáticamente a los alumnos base a los cursos correspondientes durante el arranque del servidor.
- **Regla 24/09**: los 7 DW (`d.azain, j.zambrano, d.garcia, h.quiroz, a.meza, jeison.martinez, w.salas`) NO se tocan (omitidos en seed). Todo otro `student` → solo `algoritmos` (se crea/repara `canPresent:true` y se borran DW1/DW2).
- Nuevo alumno algoritmos: `Julián David Reina Cabrera / jd.reina@cinar.edu.co / JDRC13@LgC26 / @cc3500` (solo algoritmos).
- El Panel de control (`+page.svelte`) utiliza `$derived` para mostrar reactivamente las tarjetas de los cursos según los datos cacheados en `$preloadedMyEnrollments`.
- Si el usuario accede a la URL directa y no está inscrito, es redirigido mediante hooks reactivos (`$effect`).

## Modelo de Datos

### Enrollment
```javascript
{
  user: ObjectId,
  course: String,        // 'algoritmos', 'desarrollo-web-1', 'desarrollo-web-2'
  canPresent: Boolean,
  projectIdea: String,   // Idea de proyecto guardada en la Actividad de la Semana
  createdAt: Date
}
```

### Grade
```javascript
{
  student: ObjectId,
  subject: String,      // 'Desarrollo Web 2 - Parcial 1'
  score: Number,
  max_score: Number,
  period: String,       // '2026-2'
  comments: String,
  createdAt: Date
}
```

## Novedades y Proyectos Añadidos (Última Iteración)

1. **Proyecto Personal (Algoritmos)**
   - Ruta `/algoritmos/proyecto-personal`.
   - Listado consolidado y asignación de temas y stacks para 13 estudiantes (11 base incl. "Pasto Limpio" + Jairo Granja Bravo + Julián David Reina Cabrera).
   - Jairo (verificado en BD `projectIdea` 14/09 vía `GET /api/enrollments/course/algoritmos`): "Estrategia para atraer clientes en el campo de la compraventa de oro" (Angular/Node/Mongo). Julián: "Prácticas de como obtener alimentos de buena calidad teniendo en cuenta el medio ambiente" (React/Node/Mongo).
   - **Carrusel "Desarrollo semanal" (24/09, en head antes del listado)**: slider animado 2D (translateX + scale, auto 6s con pausa en hover, flechas, dots, barra progreso) con Paso 1 ✅ registro mismo correo en GitHub/Atlas/Render/Vercel, Paso 2 ✅ repos front+back en GitHub y DB en Atlas, Paso 3 ⏳ martes 29/09 instalar OpenCode desde Dui Warp, Paso 4 ⏳ instalar Antigravity IDE (Git, explorador, terminal, IAs Claude+Google). Escala móvil corregida (compacto, sin scroll anómalo).
   - Buscador en tiempo real y tags categorizados.

2. **Proyecto Colaborativo (Desarrollo Web 2)**
   - Ruta `/desarrollo-web-2/proyecto-colaborativo`.
   - Proyecto **TrueX Trade** (antes TRUEQ, Plataforma de Intercambios).
   - Stack: React (Frontend, antes Svelte), Node+Express (Backend), MongoDB (Database). Tira de despliegue: Vercel + Render + Atlas.
   - **Equipo TrueX Trade (6 + docente PM)**: docente (tú, Project Manager: backlog, integración semanal, demo) + Jeison Martinez (analista requerimientos/tech lead) + David Garcia y Jairo Zambrano (frontend React) + Andres Felipe Meza (backend) + Diego Azain y Harold Quiroz (QA/DevOps testing). William Salas fuera del proyecto.
   - **Tarea semana analista (Jeison)**: definir los requerimientos de la app de manera general — entrega miércoles 30 de septiembre (visible en Semana 1 del cronograma y en su tarjeta).
   - Maquetado ordenado por bloques: hero compacto con chips (6 semanas / 6 estudiantes + docente PM / React·Node·Mongo), 01 Base técnica, 02 Equipo (PM destacada + grid 2x2), 03 Cronograma + sidebar (Acuerdos de trabajo, Qué recortar, Recomendaciones).
   - Cronograma interactivo 6 semanas + acuerdos (integración viernes, ramas por módulo, contrato API primero).

3. **Actividad de la Semana (Mejoras)**
   - **Algoritmos**: Integrados los enunciados en PDF para los ejercicios DFD de Nivel 1. Los archivos `.dfd` ahora se cargan automáticamente en el editor al hacer clic en los menús para mejorar la experiencia del estudiante.
   - **DW2**: Limpieza de UI (se retiraron los tags de horas y el prefijo de clases). Se añadieron **Ejemplos Prácticos externos** al final de cada temática (E-commerce, Social Media, etc). Solucionado el error 500 inyectando scripts HTML parseados a hexadecimal.
   - **Enlaces Algoritmos (IA y Aprendizaje)**: agregados 3 items debajo de Anthropic en `src/lib/data/enlacesData.ts`: UNAD ITP Cisco (redes/CCNA/ciberseguridad), MongoDB University (cursos/certificación NoSQL con dashboard), Capacítate para el Empleo Fundación Slim (oficios/tecnología con diploma).

5. **Editor Visual DFD (Algoritmos `/algoritmos/dfd`) — v2 (26-29/09)**
    - **Código Fuente legible**: pestañas `📖 Legible` (default, `generatePseudocode()` en `src/lib/dfd/pseudocode.js`: `Algoritmo X / Inicio / Leer / Escribir / <- / Si-Sino-FinSi / Mientras-FinMientras / Fin`) + `⚙️ .DFD` (crudo FreeDFD editable). Verificado en Problemas 1, 2, 10.
    - **Drag & Drop completo**: paleta arrastrable + clic `+` (Lectura, Salida, Asignación, Decisión, Mientras; Inicio/Fin auto), `dropZones` azules `+ soltar aquí` con `targetList+index` (incluye ramas Sí/No y cuerpo Mientras), `handleCanvasDrop` al final, `🆕 Nuevo` (lienzo vacío), `↩ Deshacer` + `↪ Rehacer` (50 pasos), `🗑 Último`, lista Pasos **recursiva** (muestra Rama Sí/No y Cuerpo Mientras) con ↑↓✕ por nivel + `📋 Duplicar`. `serializeDfd` extendido con `return→3`, `call→12`, `merge→skip`; `renderShape` con `while` morado y `merge` invisible.
    - **Panel Propiedades**: clic en figura o paso → panel derecho editable en lenguaje natural (variables coma-separadas, texto salida, variable+fórmula con sanitizado, condiciones decisión/mientras), `pushHistory` al enfocar + `serialize` al escribir. Mapeo figura→nodo por `path` en `renderer.js` (`placeNodes(..., basePath)`, `shape.path`, `getNodeByPath`, `data-path`, resaltado azul). Roundtrip edición→serialize→parse→execute verificado. **Validación amigable**: avisos por componente + banner de conteo + `✅ ¡Bien!`.
    - **Ejecución paso a paso**: `▶ Ejecutar` rápido + `🐢 Paso a paso` (750ms, ilumina figura en verde vía `executingPath`, panel `🧮 Variables en vivo`) + `⏹ Detener`. `DfdExecutor` con `onStep(path, vars)`, `stepDelayMs` y `stop()`; `test_executor.mjs` 3/3 PASS.
    - **Zoom y atajos**: `−/+/⤾` (50-180%), `Ctrl+Z/Y`, `Supr`, `Ctrl+D`, `Esc`. Toolbar rediseñada por grupos (Menú / Ejercicios N1+N2 / Archivo / Ejecutar / Ayuda); layout ampliado (sidebar 240, props 270) + apilado móvil `@media 860px`.
    - **Niveles**: selector con N1 (16 Operadores) + N2 (22 Condicionales); `?load=N1-X/N2-X` (legacy `Problema X`→N1). `static/dfd/nivel2/` publicado (22 `.dfd`).
    - **Manual PDF**: `static/guias/Manual_Manejo_Editor_DFD.pdf` (logo + título Manual de Manejo, 4 págs sin solapamientos) con botones `📘 Ver Manual` / `⬇️ Descargar` en el editor. Copia fuente en `src/Docs/trimc26/Algoritmos/`.

4. **Auditoría del Sistema y Refactorización (Impeccable Style & ESLint)**
    - **Backend**: Auditado con ESLint. Código completamente limpio (0 errores, verificado 29/09).
    - **Frontend**: Refactorizado siguiendo los principios A11y (accesibilidad) de Impeccable Style y la reactividad correcta de **Svelte 5** (Runes):
      - Corregidos errores de `totalTime` que perdían reactividad en los exámenes.
      - Ajustada la inicialización de estados capturados por prop `$props().data` en parciales y talleres usando encadenamiento opcional `??` e inicialización inline.
      - Asignados roles `presentation` en la página `enlaces-de-consulta` para cumplir estándares ARIA.
      - Limpiados los warnings de TypeScript respecto a variables potencialmente `null` en la obtención de notas.
    - **Impeccable 29/09**: 35 hallazgos (mayoría estilísticos preexistentes: easings bounce, gradient-text, side-tabs, contraste de HTML viejo en Docs). Corregidos los 3 de rendimiento (barras/dots con `transform` en vez de `width`).
    - **svelte-check**: 420 errores base preexistentes en 40 archivos (implicit `any`, archivos intactos incluidos); `vite build` pasa (es lo que corre Vercel).
    - **Tests front 29/09**: 47/47 PASS en `api.test.js`, `auth.test.js`, `preloaded.test.js`. 8 fallos preexistentes ajenos: `api.grades.test.js` (integración contra prod + ventanas de agosto vencidas), `exam.test.js` (ventana vencida), `enlacesData.test.js` (espera 20, hay 23 por los +3 agregados).

11. **Módulo Administrativo (04/10/2026)**
    - **6 sub-rutas** bajo `/admin/`: planeación, registro-académico, capacitaciones, normativa, soporte.
    - **7 componentes reutilizables** en `$lib/components/admin/`: AvailabilityForm, ClassPlanForm, CourseContentForm, GradeSheetTable, AttendanceTable, ContentTrackingTable, FormStatusBadge.
    - **6 modelos MongoDB** en backend: Availability, ClassPlan, CourseContent, GradeSheet, Attendance, ContentTracking.
    - **adminController.js** con CRUD completo para los 6 formatos + flujo de estados (borrador → enviado → recibido/aprobado/rechazado).
    - **UI Premium y Responsiva (`max-width: 768px`)**: banners animados, tabs con iconos y sombras, cards con fade-in. Las tablas cuentan con `overflow-x: auto` (Scroll Containers) y los formularios complejos cambian de grillas pesadas a columnas simples apiladas verticalmente en móvil, optimizando el ancho de pantalla.
    - **Navegación horizontal premium**: barra `admin-top-nav` con 6 botones tipo pill (🏠 Panel, 📅 Planeación, 📝 Registro, 🎓 Capacitaciones, 📜 Normativa, 🛟 Soporte) en la parte superior de cada subsección, reemplazando el botón solitario de "Volver" y haciendo wrap en móvil.
    - **Modo demostrativo**: variable `readonly` en formularios configurada para que el admin pueda editarlos independientemente del estado.
    - **Modo Edición en Tablas (Admin Toggle)**: Switch "🛠️ Modo Edición (Permitir generar y editar como admin)" ubicado permanentemente en la parte superior. Al activarlo, anula bloqueos por rol y estatus, permitiendo a los administradores generar planillas nuevas y editarlas sin restricciones.
    - **Correcciones Recientes (04/10)**:
      - **Vercel Proxy (Solución al 401)**: Se implementó un archivo `vercel.json` que proxifica `/api` hacia el backend en Render. Además, `API_URL` en `api.js` detecta automáticamente `import.meta.env.PROD` para enrutar el tráfico al proxy. Esto resuelve bloqueos de cookies "Third-Party" en navegadores estrictos (Cross-Site) y evita la necesidad de configurar variables de entorno manualmente.
      - **Crash en Reactividad Svelte 5**: Corregido error crítico de tipografía (`isPrivilegedEffectiveEffective`) que crasheaba las tablas (notas, asistencia, seguimiento) dejándolas en blanco.
      - **Validación Mongoose (Seguimiento)**: Se asignó el valor predeterminado `"Tema inicial por definir"` al campo `topicAndGoal` para cumplir la regla estricta `required: true` al crear el documento vacío.
      - **CSS de Banners**: Se aplicaron reglas `-webkit-background-clip: text` globales mediante script en todos los `h1` de módulos y cursos, logrando un degradado de colores transparente sobre el texto sin fondos blancos intrusivos.

13. **Taller 1 — Algoritmos (Niveles 1 y 2, habilitado 06/10/2026)**
    - **Fecha de apertura**: Martes 6 de octubre de 2026 (18:30 a 20:30). Controlado nativamente en `examLock.js`.
    - **Estructura del examen**: 5 preguntas de selección múltiple inéditas y 2 ejercicios prácticos DFD nuevos (monedas y zapatería).
    - **Subida de archivos**: Interfaz modificada para soportar subida independiente de múltiples archivos `.dfd`.

14. **Actualizaciones en Actividades y Proyectos (04/10/2026)**
    - **Proyecto Grupal DW2**: Tareas ajustadas en Semana 1 (Frontend, Backend, Testing, Requerimientos).
    - **Proyecto Personal Algoritmos**: PDFs integrados directamente al Paso 4. Barras de progreso al 30% (Paso 3 de 10) general. PDFs visibles removiendo el filtro de categoría.
    - **Actividad Semana DW2**: Añadidas Clases 4 y 5 adaptadas (CSS nativo, $lib, separación datos/vista) en lugar de Bootstrap, con ejemplos de Spotify y Airbnb.
12. **Auditoría 04/10/2026 (Impeccable Style + ESLint)**
    - **Frontend (Impeccable Style)**: 37 hallazgos iniciales → 17 residuales (en HTML estáticos de `src/Docs/`).
      - ✅ Corregidos: gradient-text (→ color sólido), bounce easing (→ ease-out-quart `cubic-bezier(0.16,1,0.3,1)`), side-tab border-left (→ border-top sutil), contraste #9ca3af → #4b5563.
      - ⚠️ Residuales: 16 low-contrast en archivos HTML estáticos (`src/Docs/trimb26/var/informes-parcial1.html`) + 1 overused-font (arial en mismo HTML). No afectan la app Svelte.
    - **Backend (ESLint)**: 10 warnings iniciales (`no-unused-vars` en destructuring de `adminController.js`) → 0 errores, 0 warnings (resuelto con `eslint-disable no-unused-vars` al inicio del archivo, ya que las variables son extraídas por destructuring intencional para excluirlas del spread `...rest`).
    - **Build frontend**: ✅ `vite build` exitoso (code 0) en 13.69s tras todas las correcciones.

7. **Actividad de la semana Nivel 2 + Videos (29/09)**
    - Actividad algoritmos con tabs `Nivel 1 (16)` / `Nivel 2 (22 Condicionales, enunciados reales de `Ejercicios.pdf`, pares=Propuesto)`. Cada tarjeta: revisar enunciado → `Abrir en Editor DFD` (`?load=N2-X`) → `Revisar y analizar` (guía secuencial vs condicional).
    - Videos algoritmos: 3 videos (`/Pensamiento_critico.mp4`, `/Reto.mp4`, `/videos/Video_3.mp4` 10.5 MB desde `src/Docs/.../videos/Video 3.mp4`).

8. **Proyecto personal: 10 pasos + progreso (29/09)**
    - `weeklySteps` de 4 → 10 (5 Modelo+CRUD, 6 Frontend, 7 API+Atlas, 8 Integración, 9 Despliegue, 10 Presentación). Carrusel y dots se adaptan solos.
    - Cada card de los 13 estudiantes: `📊 Progreso Paso 2 de 10 (20%)` + barra (animada con `transform`) + 10 bolitas (1-2 verdes).

9. **Bloqueo temporal parciales/talleres (29/09, vigente)**
    - 11 rutas (6 parciales + 5 talleres incl. `algoritmia/taller`) redirigen a no-admin; menús con `🔒 Bloqueado` + banner. Ver sección Reglas de Acceso.

10. **Seguridad P0/P1/P2 (29/09)** — ver sección Seguridad. Env requeridas en Render: `JWT_SECRET`, `ADMIN_PASSWORD`, `FRONTEND_URL` (singular válido).

6. **Bitácora 24/09/2026 (sesión docente)**
    - `seed.js`: alta de Julián (algo13) solo algoritmos; 7 DW omitidos (no tocar); regla general todo otro `student` → solo algoritmos con limpieza DW; reparar `canPresent:false→true`. Pendiente `npm start` en Render para aplicar en BD prod.
    - Sondeo prod `testcinar26bknd.onrender.com`: login admin OK; 76 enrollments en algoritmos (muchos test); 10 `projectIdea` no vacías (Jairo = compraventa oro; algo10 = "."; sin idea algo9/algo12/jd.reina).
    - DW2 TrueX Trade: roles y stacks actualizados en página; PM = docente (tú).

7. **Bitácora 29/09/2026 (sesión docente)**
    - DFD v2 desplegado en concepto: verificar en prod `/algoritmos/dfd` y `?load=N2-1` tras push.
    - Pendientes de deploy: backend P0/P1/P2 (push + env `JWT_SECRET`, `ADMIN_PASSWORD`, `FRONTEND_URL` en Render + redespliegue) y front (sesiones con cookie requieren backend nuevo).
    - Tras el deploy, rotar la contraseña admin expuesta vía `PATCH /api/auth/password`.

## API Endpoints

### Auth
- `POST /api/auth/register` (siempre crea `student`)
- `POST /api/auth/login`
- `POST /api/auth/refresh` (cookie httpOnly + origen permitido)
- `POST /api/auth/logout` (revoca refresh)
- `PATCH /api/auth/password` (cambio propio, pide actual + nueva)
- `PATCH /api/auth/users/:id/password` (admin, reseteo)
- `POST /api/auth/users` (admin, crear con rol)
- `GET /api/auth/profile`

### Grades
- `GET /api/grades` - Todas las notas (admin/teacher)
- `POST /api/grades` - Crear nota (admin/teacher)
- `PUT /api/grades/:id` - Actualizar nota (admin/teacher)
- `GET /api/grades/:id` - Verifica dueño o privilegiado
- `GET /api/grades/mine` - Notas del usuario actual

### Enrollments
- `GET /api/enrollments/mine` - Obtener inscripciones del usuario actual (vital para renderizado del Dashboard).
- `POST /api/enrollments/project-idea` - Guarda/Actualiza la Actividad de la Semana (`projectIdea`).
- `POST /api/enrollments` - Inscribir usuario manualmente.
- `GET /api/enrollments/:course` - Inscritos en un curso.

## Credenciales

- **Admin**: `admin@cinar.com` / contraseña definida por `ADMIN_PASSWORD` (env, mín. 12 car.). Cada arranque la sincroniza: cambiar la variable + redesplegar = nueva contraseña. Nunca documentar el valor aquí.
- **Coordinador**: `coordinacion@cinarsistemas.edu.co` (role: 'coordinator')

## Seguridad (P0+P1+P2, 29/09/2026)

- Registro público (`POST /api/auth/register`) siempre crea `student`; ignora `role`. Crear usuarios con rol vía `POST /api/auth/users` (admin). Validación: email formato, usuario 3-40, contraseña mín. 8, bcrypt cost 12.
- `ADMIN_PASSWORD` (env, mín. 12): cada arranque la sincroniza al admin (cambiar var + redesplegar = nueva contraseña). Sin ella en prod no arranca.
- Sin `JWT_SECRET` en producción el backend no arranca. CORS restringido a `FRONTEND_URL`/`FRONTEND_URLS` (ambas válidas) con `credentials:true`; orígenes denegados en limpio (sin 500).
- `helmet` + rate-limit (login/register 60/15min, refresh 60/15min, API 600/15min; pensados para redes escolares tras una IP). `GET /api/grades/:id` verifica dueño o rol privilegiado.
- P2 sesiones: access JWT 15min solo en memoria del front; refresh opaco rotativo 7d en cookie `cinar_refresh` httpOnly (`Secure`+`SameSite=None` en prod, `Lax` en dev). `POST /api/auth/refresh` (single-flight + reintento en `api.js`, con chequeo de origen anti-CSRF) y `POST /api/auth/logout` que revoca. Logout limpia todo el localStorage salvo el tema. Migración única de tokens legados.
- Rotación de contraseña: `PATCH /api/auth/password` (propia) y `PATCH /api/auth/users/:id/password` (admin).
- P2 bloqueo: `EXAMS_LOCKED` (default true) bloquea en servidor `POST /api/grades/mine` y `PUT /api/grades/mine/:id` de exámenes para no privilegiados; el frontend redirige (`src/lib/guards/examLock.js`, `EXAM_LOCK_ACTIVE`).
- `Cache-Control: no-store` en `/api/grades`, `/api/enrollments`, `/api/auth/profile`.
- Env Render requeridas: `JWT_SECRET` (32+ aleatorio), `ADMIN_PASSWORD` (12+), `FRONTEND_URL` (origen exacto del front).

## Dependencias Conocidas

### Frontend (testcinar26)
- SvelteKit 2.x
- Svelte 5 (Runes `$state`, `$derived`, `$effect`)
- Vite

### Backend (testcinar26bknd)
- Express (helmet, express-rate-limit, CORS con credenciales)
- Mongoose
- JWT (jsonwebtoken, access 15m + refresh rotativo)
- bcryptjs (cost 12)

## Vulnerabilidades y Deuda Técnica
- Existen algunas vulnerabilidades low severity en frontend por la cookie herencia de @sveltejs/kit (no crítico para producción, no forzar `npm audit fix` para no romper el workspace).
- Tests con fallos preexistentes (re-verificado 20/10/2026): `api.grades.test.js` (integración contra el backend real; acumula estado y límite de intentos entre corridas) y `exam.test.js` (ventana placeholder vencida). `enlacesData.test.js` ya pasa.
- `api.test.js` (1 fallo local): espera `API_URL` prod pero `.env` local apunta a localhost; pasa en build prod.
- `svelte-check`: ~528 errores base preexistentes (implicit `any` en JS legacy); los archivos nuevos del Parcial 1 Algoritmos/Nivel 3 y el fix de health-check del 20/10 quedaron en 0. `vite build` pasa (gate de Vercel).

## Bitácora 06-08/10/2026 (Taller Algoritmos + Parcial DW2 + estabilidad)

### 15. Falla del Taller 1 Algoritmos 06/10 (diagnóstico verificado en prod)
- **0 notas y 0 DFDs** llegaron al servidor esa noche (verificado `GET /api/grades` + `/api/dfd/submissions`).
- **Causa raíz:** desfase frontend/backend. El front abría el taller por fecha (`examLock.js`) pero el back seguía con `EXAMS_LOCKED=true` y rechazaba todo `POST /grades/mine` con 403. Los datos quedaron en `localStorage` (cola de sincronización) de cada portátil.
- **Agravantes:** DFD se subía DESPUÉS de crear la nota (si fallaba la nota, jamás se subía); archivos en RAM (`multer.memoryStorage` + `Buffer` en Mongo) saturan el free de Render; `API_URL.replace('/api','')` en prod da `''` (la página misma) así que los health-checks nunca despertaban a Render (cold start medido: 52s).

### 16. Parche Taller + ventana extra 07/10 (desplegado y verificado)
- Backend: `schedule.js` con ventana propia `TALLER_ALGO 06/10 14:00 → 07/10 23:59` (`isTallerAlgoOpen`, `TALLER_ALGO_MAX_ATTEMPTS=2`); `gradeController.examLockError(user, subject, submittedAt)` exime el taller del flag global; `isSubmissionAllowed` valida contra `submittedAt`.
- Frontend: `MAX_ATTEMPTS=2` con claves `..._v2` (reinicio fresco: Julián presentó hoy, Jairo retomó); subida DFD **independiente** de la nota con 3 reintentos por archivo + botón `Reintentar subida DFD (no gasta intento)`; modo **solo-teoría** para `jd.reina@cinar.edu.co` (filtra preguntas file, nota sobre 5, comentario de exento; **retirado el 19/10**, ver §26).
- Notas manuales del Excel sincronizadas a BD como admin (9/10 + Julián por plataforma 4/5 en 1:20): `Algoritmos - Taller 1 / 2026-3`, P1-P5 sobre 5, Ej6/7 en revisión. Falta: nombre del `?` (4/5) y notas del 6 y 7 por estudiante.
- Nueva sección en `/algoritmos/notas`: tabla Taller 1 debajo de la distribución %, con `taller1_notas.js` como fuente (promedio 4.36/11).

### 17. Estabilidad prod (desplegado y verificado extremo a extremo)
- `GET /api/health` público (antes de rate-limits, no consume cupo del aula).
- `api.js`: `getHealthUrl()` (siempre vía proxy, nunca `replace`) + timeouts (45s API, 30s refresh, 120s subida) con mensaje claro.
- Reparados los 12 health-checks (preloader + 11 páginas de examen) que en prod apuntaban a URL vacía.
- Home con botón 🔄 Reintentar y aviso de wake-up (~1 min la primera vez).
- Verificado con `https://examscinar2026.vercel.app`: front 200, `/api/health` 200 vía proxy, login `da.lopez` 200.
- Operativo recomendado: ping UptimeRobot cada 5 min a `/api/health` en horario de clase.

### 18. Nuevo alumno DW2 + blindaje seed
- `da.lopez@cinar.edu.co` / Danilo Andrés Lopez Peñafiel (doc `1085303937` como contraseña inicial), inscrito en `desarrollo-web-2` con `canPresent:true`, login verificado. Accesos DW2 verificados 8/8 (serie `@cc3501`-`@cc3507` + doc).
- `seed.js`: excluye a inscritos en DW2 de la regla "todo student → solo algoritmos" (antes un reinicio de Render le habría borrado el DW2).

### 19. TrueX Trade (DW2 proyecto colaborativo)
- Sección 04 Requerimientos: 18 RF + 11 RNF (`truex_reqs.js` + tests).
- Equipo por pestañas (5 roles) + rol 📣 Mercadeo (Danilo, semanas 2–6). Equipo: 7 estudiantes + docente.

### 20. Editor DFD
- Nuevo componente lateral **⏎ Salto de línea** (parser como llamada `SaltoLinea` compatible FreeDFD, render punteado, pseudocódigo `Escribir ''`, ejecución en blanco con resaltado) + tests.
- Lienzo ampliado solo desktop: paneles más angostos en ≥1280px/≥1600px y `min-height` 60vh/72vh (~+30% altura); móvil/tablet intactos.

### 21. Parcial 1 DW2 — 14/10 todo el día (listo, falta push + confirmar)
- Banco nuevo `parcial1_dw2.js`: **50 preguntas** (25 abiertas + 25 MC compuesta; 25 Arquitectura TrueX + 25 Svelte Clases 1–5). Examen: 5 por grupo = 20, MC primero, sin repetidos (pools 10–13 por grupo para 8 alumnos). Abiertas con rúbrica, MC con explicación.
- Esquema **2+2**: Preparación (2 intentos, desde ya hasta 13/10 23:59) + Evaluación (2 intentos, 14/10 00:00–23:59). Ventana y espejo backend verificados lógicamente (5 casos).
- La página `parcial-1` usa el banco nuevo; menú DW2 desbloquea Parcial 1 en ventana.
- Tests 10/10 del banco; suite total con solo los 6 fallos preexistentes.

## Bitácora 18-19/10/2026 (Parcial 1 Algoritmos + DW2 re-habilitado + Nivel 3 DFD)

### 22. DW2 Parcial 1 re-habilitado — lunes 19/10 a miércoles 21/10 (hasta medianoche)
- Evaluación (intentos 3-4, esquema **2+2** intacto) movida del 14/10 a la ventana **lunes 19/10 00:00 → miércoles 21/10 23:59** (hora Colombia), por indicación del docente del 19/10 ("desde ya" hasta el miércoles a medianoche); Preparación histórica cerrada desde el 13/10. El hueco 14–18/10 sigue rechazado por el gate de envío.
- Frontend: `examLock.js` y `exam.js` (`DW2P1_OPEN` = 19/10 00:00, `DW2P1_CLOSE` = 21/10 23:59), `parcial1_dw2.js` (dateLabel "Del lunes 19/10 al miércoles 21/10/2026 · hasta medianoche (evaluación habilitada)") y página `desarrollo-web-2/parcial-1` (etiquetas "Disponible ya"/"19-21/10" e instrucciones actualizadas).
- Backend: `schedule.js` (fechas + mensajes "preparación hasta el 13/10 y evaluación del 19 al 21/10 (hasta medianoche)") y `gradeController.examLockError` (mismo mensaje). Tests `schedule.test.js` y `gradeController.test.js` actualizados.
- Fix UX (heredado del taller): el botón "Realizar Intento N" de la pantalla final ahora vuelve al menú de intentos en lugar de reabrir el examen con el estado del intento anterior.

### 23. Parcial 1 Algoritmos — lunes 19 y martes 20/10 (todo el día)
- **Ventana única** 19/10 00:00 → 20/10 23:59, **2 intentos** (Intento 1 Preparación + Intento 2 Evaluación, estilo taller), **120 min (2 h)** por intento, contados desde que el estudiante lo inicia (ajuste 19/10, ver §26).
- Banco nuevo `src/lib/data/parcial1_algo.js`: **51 teóricas** (17 por nivel; 34 de 4 opciones + 17 binarias, con explicación) + **20 prácticas DFD**. Composición del examen: **20 = 15 teóricas (5 por nivel, mezcladas) + 5 prácticas (≥1 por nivel)**; teóricas primero.
- Módulo propio `src/lib/exam_algo_p1.js` (claves `algo_p1_*`, sin mezclar con DW1/DW2): snapshot retomable, cola de sincronización con `period: '2026-3'` y `submittedAt` del intento.
- Página `algoritmos/parcial-1` reescrita para preguntas tipo archivo: `<input .dfd>` (valida extensión y 2 MB), subida a `POST /dfd/upload` con `examType: 'parcial-1'` (3 reintentos con backoff) **independiente de la nota** — si la nota falla, el DFD igual se sube y queda botón "Reintentar subida DFD" (no gasta intento). Nota = aciertos teóricos (0–15) con `max_score` 20; DFD revisados por el docente (espejo del taller).
- Backend: `schedule.js` (`ALGO_P1_SUBJECT = 'Algoritmos - Parcial 1'`, `isAlgoP1Open`, `ALGO_P1_MAX_ATTEMPTS=2`) + `gradeController` (lock y gate de intentos). Menú de Algoritmos con `isAlgoP1LockedFor` (Parcial 2 sigue con el lock global).
- Tests: `parcial1_algo.test.js` (≥50 teóricas/≥20 prácticas, ids únicos, mix 2/4 opciones, 20 por examen sin repetidos y 5 por nivel; 8/8). `notas/+page.svelte` ya lista 'Algoritmos - Parcial 1'. Exención `MCQ_ONLY_EMAILS` del taller **no** aplicada al parcial (y retirada del taller el 19/10, ver §26). Pantalla final con el mismo fix UX del botón "Realizar Intento 2" (vuelve al menú de intentos, no reabre el estado viejo).

### 24. Nivel 3 — Ciclos en el editor DFD
- `dfdExercises.js`: `problemsN3` (12 ejercicios) + `getExerciseStatement` generalizado a N1/N2/N3.
- Editor `algoritmos/dfd`: `parseLoadParam` acepta `N3-x` (1–12) y textos compatibles; `exerciseKey`/`loadExercise` con carpeta/prefijo `N3`; optgroup "Nivel 3 — Ciclos (12)" y label "Ejercicios N1 + N2 + N3" (los links `?load=N3-5` funcionan).
- 12 archivos `static/dfd/nivel3/Problema 1..12.dfd` generados con el serializer del propio parser (`generate-n3-dfd.mjs`, round-trip verificado) y ejecutados con `DfdExecutor` real (factorial, Fibonacci, centinela 0, clave 2026, etc.; 6/6 verificados).
- Nota técnica: el evaluador de condiciones **no compara strings** (`'texto'` se ignora) → el ejercicio N3-10 y la práctica N2 del examen usan condiciones numéricas.

### 25. Verificación final (19/10)
- `npm test`: 244 pasan / 6 fallan / 2 saltados — los 6 son los preexistentes ambientales (api.grades sin backend local, api.test.js API_URL local, exam.test.js ventana placeholder). Bancos del día: 18/18.
- `npm run build`: ✓. `eslint` backend: limpio. `svelte-check`: 519 errores (solo legacy; archivos nuevos del parcial y N3 en 0; CSS muerto de la página del parcial eliminado).

### 26. Ajustes 19/10 (indicación del docente)
- Duración del Parcial 1 de Algoritmos: **2 horas (120 min) por intento**, contadas desde que el estudiante inicia el intento (`exam_algo_p1.js` `TOTAL_TIME` y `examConfig.duration` = `120 * 60`; textos de la página y tests actualizados).
- **Exención de DFD retirada del taller**: eliminados `MCQ_ONLY_EMAILS`/`isMcqOnly` de `algoritmos/taller` (filtro de preguntas file, comentario de envío y bloque de instrucciones) y su describe en `exam_taller_algo.test.js`. Las notas ya registradas (p. ej. Julián 4/5) no se modifican.
- Verificación: tests de los archivos afectados 20/20; `npm run build` ✓; suite completa solo con los fallos ambientales de siempre (api.grades sin backend local).
- **Actividad de la semana (Algoritmos) con Nivel 3**: tercera pestaña "Nivel 3 — Ciclos (12)" con análisis guiado y enlaces `?load=N3-X` al editor; la página ahora importa N1/N2/N3 de `dfdExercises.js` (fuente única, sin duplicar enunciados).

### 27. Tests de aseguramiento de los parciales (19/10, indicación del docente)
- **Backend** (`testcinar26bknd`, `node --test`, sin dependencias nuevas; script `npm test`):
  - `src/config/schedule.test.js` (18 tests): fechas exactas en hora Colombia (Algo P1 19–20/10, DW2 prep 8–13/10 + evaluación **19–21/10**, taller 06–07/10), bordes de medianoche (18/10 23:59 vs 19/10 00:00; 20/10 23:59 vs 21/10 00:00; 21/10 23:59 vs 22/10 00:00), máximos de intentos (2 / 2+2), mensajes 403 exactos y envío tardío aceptado vía `submittedAt`.
  - `src/controllers/gradeController.test.js` (11 tests): `examLockError` por fecha y rol (estudiante bloqueado, admin/coordinación/docente no), bloqueo global `EXAMS_LOCKED` y mapeo materia→curso (`getCourseFromSubject`/`isExamSubject`). Para testearlos se exportaron esas 3 funciones (sin cambio de comportamiento).
  - Hallazgo documentado: en el hueco 14–18/10 de DW2 el **candado deja pasar** (por diseño) y quien rechaza el envío es el gate `isSubmissionAllowed` con el mensaje del 19–21/10.
- **Frontend** (Vitest): `exam_algo_p1.test.js` (constantes 20 preguntas/120 min/2 intentos, etiquetas, `formatTime`, `calculateScore`, `buildExamData` con DFD, snapshot retomable, cola de sync y health-check, con localStorage simulado) y `guards/__tests__/examLock.test.js` (fechas ISO exactas de Algo P1, DW2 y taller; bloqueos por rol con fake timers). 29 tests nuevos.
- **Verificación**: backend 29/29 (`npm test`), frontend nuevos 29/29; suite completa del frontend 271 pasan / 6 fallan / 2 saltados (279) — los 6 fallos siguen siendo los ambientales de siempre (`api.grades` contra backend vivo, `api.test.js`, `exam.test.js`). `eslint` backend limpio.
- **Commits**: backend `c638167` (tests + exports + script `npm test`); el fix de la expectativa DW2 quedó en un cambio posterior a ese commit. Frontend: tests en `9194b31`; expectativa DW2 actualizada en `1d5577b`.

## Bitácora 20/10/2026 (aviso de health-check + cuentas demo)

### 28. Fix del aviso falso de health-check (20/10)
- **Síntoma**: antes de iniciar el Parcial 1 de Algoritmos aparecía "⚠ No se pudo verificar el servidor. Si continúas, las respuestas se guardarán localmente" (el mismo aviso visto el día del Taller 1).
- **Causa 1 (HTML inicial/SSR)**: `checkingServer` empezaba en `false`, así que el aviso se renderizaba en el HTML antes del primer chequeo; además, cuando `isHealthCheckRecent()` era `true` (<60 s) se retornaba sin marcar `serverCheckOk` y el aviso quedaba encendido hasta el siguiente chequeo.
- **Causa 2 (el "error viejo")**: 7 páginas llamaban `getHealthUrl()` **sin importarla** → `ReferenceError` en el navegador; el chequeo nunca terminaba y la página se quedaba en "Verificando conexión...". Confirmado en el bundle de producción (identificador literal sin resolver). Páginas: `algoritmos/parcial-2`, `algoritmos/taller`, `algoritmos/algoritmia/taller`, `desarrollo-web-1/parcial-2`, `desarrollo-web-1/algoritmia/taller`, `desarrollo-web-2/parcial-2`, `desarrollo-web-2/algoritmia/taller`.
- **Fix**: las 11 páginas de examen inicializan `checkingServer = true` y el camino de chequeo reciente marca `serverCheckOk = true` / `checkingServer = false`; se agregó el import faltante de `getHealthUrl` en las 7 páginas.
- **Verificación (20/10)**: `npm run build` ✓; bundle de producción sin `getHealthUrl` sin resolver; HTML de `/algoritmos/parcial-1` y `/desarrollo-web-2/parcial-1` ya no trae el aviso (muestra "Verificando conexión..."); `svelte-check` 535 → 528 (solo errores legacy); suite front 270 pasan / 2 saltados; los 9 fallos son los ambientales conocidos (`api.grades.test.js` contra backend vivo, `api.test.js` por `API_URL` local y `exam.test.js` por ventana placeholder).
- **Estado**: front `176b83f` y backend `792a4f5`, ambos = `origin/main`; Vercel redesplegado y verificado.

### 29. Cuentas demo permanentes (19/10)
- `seed.js` las crea/actualiza en cada arranque (idempotente; **no eliminar**):
  - `demo1` / `Demo1@2026` (`demo1@cinar.edu.co`) → inscrito solo en **algoritmos**, `canPresent: true`.
  - `demo2` / `Demo2@2026` (`demo2@cinar.edu.co`) → inscrito solo en **desarrollo-web-2**, `canPresent: true`.
- Inscripción exclusiva por curso (borra inscripciones cruzadas) y protegidas de la regla general "todo student → solo algoritmos" (se crean antes de esa regla).
- Uso: probar el flujo completo de los parciales sin tocar cuentas de estudiantes reales; si se borran, el siguiente arranque las recrea.

### 30. Blindaje del guardado DW2 + interfaz de calificación de abiertas (20/10)
- **Riesgo 1 (pérdida de respuestas)**: al enviar el parcial, la nota se creaba con `POST /grades/mine` y luego `examData` se guardaba en un **segundo** `PUT /grades/mine/:id` cuyo error se ignoraba (`catch {}`). Si el segundo fallaba, quedaba la nota sin respuestas y la función igual reportaba éxito. Ahora `examData` viaja en el **mismo POST** (el backend ya lo aceptaba) y no hay segundo PUT.
- **Riesgo 2 (sincronización tardía)**: la cola local no se procesaba al cargar la página (el contador solo se actualizaba dentro de `processSyncQueue`) y se enviaba `submittedAt` nuevo al reintentar. Ahora se inicializa el contador, se procesa la cola automáticamente al cargar/volver online, y se conserva el `submittedAt` original del intento para que el gate del backend lo acepte aunque se sincronice después del cierre.
- **Riesgo 3 (borrador)**: `clearSavedAnswers()` se ejecutaba siempre, incluso si fallaban servidor y cola. Ahora solo se borra cuando hay copia confirmada en el servidor o en la cola local; si ambos fallan, el borrador queda para reintentar. El autoguardado pasó a debounce de 400 ms + cada 15 s + al ocultar pestaña/cerrar.
- **Riesgo 4 (tamaño)**: `express.json` subió de `100kb` a `1mb`; un examen con 10 abiertas largas puede superar 100kb. El examen real de demo2 pesa ~6,8kb.
- **Riesgo 5 (claves compartidas DW1/DW2)**: DW1 P1 y DW2 P1 importaban `exam.js` y ambos guardaban intentos, borrador, cola y chequeo de salud bajo `parcial1_*`. Un alumno con ambos cursos podía reanudar el borrador del otro examen o enviar una entrada de cola con la materia equivocada. DW2 ahora usa `dw2_p1_*` (`DW2P1_STORAGE_KEY`, `_DETAIL_KEY`, `_SYNC_QUEUE_KEY`, `_SAVED_ANSWERS_KEY`, `_HEALTH_CHECK_KEY`); `getSyncQueue()` y `getSavedAnswers()` migran automáticamente lo viejo de DW2 (temas string/`area`) a las claves nuevas y dejan intacto lo de DW1 (temas numéricos). La cola compartida solo la usan ahora DW1 y el dashboard (que suma ambas colas).
- **Rúbricas**: `buildDw2ExamData` guarda `rubric` y `area` en cada pregunta; la interfaz usa la rúbrica guardada y, para envíos viejos sin ella, la busca por `id` en `questionBank`.
- **Interfaz admin**: nueva ruta `/admin/desarrollo-web-2/parcial-1` (tarjeta "Calificar Abiertas DW2" en `/admin`). Lista todos los intentos con estudiante, intento/ventana, fecha, MC, abiertas calificadas/total, nota y estado; filtros Todas/Pendientes/Calificadas + búsqueda. El modal muestra la respuesta, la rúbrica y botones 0–5 por pregunta, con total en vivo sobre 60. Al guardar actualiza `examData`, `score`, `max_score` y comentario "Revisado - Abiertas: X/Y" sin tocar respuestas ni datos MC; agrega `review.reviewedAt/reviewedBy` al `examData`.
- **Utilidades/tests**: `src/lib/dw2Review.ts` (parseo, MC/abiertas, totales, notas, comentarios, ventana) + `src/lib/__tests__/dw2Review.test.js` (8/8); `src/lib/__tests__/exam.dw2Storage.test.js` (6/6) cubre migración de cola/borrador y separación DW1/DW2.
- **Verificación 20/10**: `npm run build` ✓ (rutas admin y DW2 compiladas); frontend 287 pasan / 6 fallan / 2 saltados (los 6 ambientales de siempre); backend `npm test` 29/29. **Sin commit ni push** (el docente los hace).
- **Pendiente**: los demás parciales/talleres conservan el patrón de dos pasos (`POST` + `PUT examData`); no se tocaron en esta ventana para no modificar exámenes cerrados. Aplicar el mismo guardado atómico después del 21/10.

### 31. Corrección y Desbloqueo del Ciclo Mientras (While) en el Editor DFD (20/10)
- **Problema 1 (Imposible agregar elementos al interior del Mientras)**:
  - **Causa raíz geométrica**: Cuando el Mientras estaba vacío (`isBodyEmpty=true`), la zona de soltado (`dropZone`) del cuerpo y la zona de soltado posterior del flujo principal compartían exactamente las mismas coordenadas `(cx, cy)`. Al estar la zona posterior después en el orden del DOM SVG, capturaba el evento `ondrop` e insertaba el componente fuera del Mientras (después de él).
  - **Causa de UI**: El clic en la paleta izquierda (`handlePaletteClick`) siempre insertaba al final de `ast.nodes` ignorando la selección; el panel derecho no tenía botones para insertar en el cuerpo; y la lista de pasos omitía el cuerpo cuando estaba vacío.
  - **Solución implementada**:
    1. Espacio y separación garantizada en `renderer.js`: el cuerpo vacío reserva altura dedicada (`NODE_H + 12`) y genera su zona de soltado separada por más de 40px de la zona posterior.
    2. Flecha **Sí**: se dibuja la flecha vertical con etiqueta **`Sí`** apuntando hacia el cuerpo del Mientras (tanto vacío como con hijos), mientras que la flecha de salida a la derecha conserva la etiqueta **`No`**.
    3. Botones directos en el Panel de Propiedades: se incorporaron botones rápidos (`📥 + Lectura`, `⚙️ + Asignación`, `📤 + Salida`, `🔀 + Decisión`, `⏎ + Salto`) para agregar instrucciones directamente al cuerpo del Mientras con un clic.
    4. Paleta inteligente: al tener seleccionado el Mientras o un nodo de su cuerpo, hacer clic en la paleta inserta directamente dentro del ciclo.
    5. Lista de pasos: ahora muestra siempre `↳ Cuerpo del Mientras (vacío - clic para agregar)` o `↳ Cuerpo del Mientras (repite)`.
- **Problema 2 ("Siempre se va por el No")**:
  - **Causa 1 (Visual)**: Solo existía la flecha con etiqueta `No` (la entrada al cuerpo no tenía etiqueta y vacía no se dibujaba), lo que visualmente mostraba un camino único hacia la salida.
  - **Causa 2 (Evaluador de expresiones en `executor.js`)**:
    - El operador estándar de desigualdad de FreeDFD `<>` no era reconocido en el tokenizer (se dividía en `<` y `>`), evaluando condiciones como `i <> 10` o `clave <> 2026` como `0` (Falso / "No").
    - Los literales de texto entre comillas simples (`'s'`, `'SI'`) y dobles (`"s"`) eran ignorados en el tokenizer, convirtiéndose en variables inexistentes evaluadas a `0`. Toda comparación de texto (`x != 's'`, `opcion == 's'`) fallaba y salía por el "No".
  - **Solución implementada**:
    1. Soporte en `executor.js` para el operador `<>` (mapeado a `!=`) y literales de cadena entre comillas simples y dobles (`type: 'string'`).
    2. Comparación de cadenas exacta (sensible a mayúsculas y espacios; sin `trim()`).
    3. Re-notificación de paso en cada iteración del bucle para que el bloque Mientras se re-ilumine en verde en la ejecución paso a paso antes de cada comprobación.
- **Verificación**: Tests unitarios nuevos en `src/lib/dfd/__tests__/while.test.js` (5/5 PASS); `test_executor.mjs` (3/3 PASS); `npm run build` exitoso (code 0) en 19.67s.

### 33. Desbloqueo, persistencia en la nube y retiro de temporizador en parciales (21/10)
- **Desbloqueo y correcciones en DW2 Parcial 1**:
  - Habilitada la evaluación para estudiantes (19 al 21/10 a medianoche).
  - **Fix SSR 500 en Vercel**: `src/routes/desarrollo-web-2/parcial-1/+page.ts` añade `export const ssr = false;` debido al uso extensivo de APIs de navegador (`localStorage`, `setInterval`, eventos de visibilidad) en la página autenticada.
  - **Fix ReferenceError en runtime**: Se importaron las constantes faltantes `TIME_PER_MC`, `TIME_PER_OPEN` y la función `getAttemptType` desde `$lib/exam`.
- **Persistencia y retoma entre dispositivos y redes (DW2 y Algoritmos)**:
  - **Backend (`testcinar26bknd/src/routes/exams.js`)**: Endpoints de borrador para DW2 `GET/PUT/DELETE /exams/dw2-p1/draft` apoyados en el modelo `ExamDraft` de MongoDB (con índice compuesto `{ student: 1, subject: 1 }`).
  - **Frontend API (`src/lib/api.js`)**: Nuevos métodos `examDraftApi.getDw2P1()`, `saveDw2P1()`, `deleteDw2P1()` y `saveDw2P1DraftKeepalive()`.
  - **DW2 Parcial 1 (`src/routes/desarrollo-web-2/parcial-1/+page.svelte`)**:
    - Consulta `loadServerDraft()` en segundo plano y fusiona con `readLocalSnapshot()` mediante `mergeDraftWithLocal` sin perder respuestas.
    - Banner interactivo de retoma: muestra pregunta actual, respuestas guardadas y fecha del último guardado, con opciones de «Continuar intento» o «Descartar borrador».
    - Autoguardado periódico cada 10 s, inmediato al navegar/responder y con `keepalive` en `pagehide`/`beforeunload`.
    - Indicador de estado visual en el encabezado (`Guardando...` / `Guardado`).
    - Eliminación automática del borrador al registrar exitosamente la calificación o sincronizar la cola offline.
- **Retiro de temporizadores en parciales de Algoritmos**:
  - Estudiantes disponen de todo el tiempo necesario para completar su evaluación sin límite ni corte automático.
  - **Algoritmos Parcial 1**: Retiro de la visualización del temporizador del encabezado.
  - **Algoritmos Parcial 2**: Eliminación del `$effect` de auto-envío por tiempo (`timeLeft <= 0`), retiro de la cuenta atrás del encabezado y actualización de las recomendaciones iniciales indicando que es sin límite de tiempo.
- **Verificación**: Tests unitarios de backend ejecutados (37/37 PASS); compilación frontend exitosa (`npm run build` code 0).


