# Cinar - Estado Actual de la Plataforma (24 Septiembre 2026)

## Estructura del Proyecto

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
│   │   │   │   ├── parcial-1/
│   │   │   │   ├── parcial-2/
│   │   │   │   ├── taller/          
│   │   │   │   ├── notas/
│   │   │   │   ├── enlaces-de-consulta/
│   │   │   │   ├── actividad-de-la-semana/  # Simplificada y con ejemplos prácticos externos.
│   │   │   │   └── proyecto-colaborativo/   # TrueX Trade (Intercambios P2P): React front + roles asignados (6+docente) + cronograma 6 sem. Maquetado ordenado 01/02/03.
│   │   │   └── algoritmos/         # Algoritmos
│   │   │       ├── parcial-1/
│   │   │       ├── parcial-2/
│   │   │       ├── taller/           
│   │   │       ├── notas/
│   │   │       ├── enlaces-de-consulta/  # Usa $lib/data/enlacesData.ts (IA y Aprendizaje +3: UNAD Cisco, MongoDB University, Capacítate).
│   │   │       ├── actividad-de-la-semana/  # Ejercicios DFD Nivel 1 con carga automática.
│   │   │       ├── dfd/             # Editor visual DFD: pseudocódigo legible + drag&drop + panel propiedades.
│   │   │       └── proyecto-personal/       # Asignación de proyectos por estudiante (13: 11 base + Jairo + Julián).
│   │   ├── lib/
│   │   │   ├── data/                # Bancos de preguntas (DW2 y Algo) + enlacesData.ts
│   │   │   ├── dfd/                 # parser.js (parse/serialize + return/call/merge), renderer.js (path por figura), executor.js, pseudocode.js
│   │   │   ├── stores/              # Auth, preloaded (preloadedMyEnrollments)
│   │   │   ├── components/          # SubjectCard, etc
│   │   │   └── api.js               # authApi, gradesApi, enrollmentApi
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
│   │   │   ├── User.js
│   │   │   ├── Grade.js
│   │   │   └── Enrollment.js    # Sistema de inscripciones con projectIdea
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── gradeController.js
│   │   │   └── enrollmentController.js  # getMine(), saveProjectIdea()
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── index.js
│   └── eslint.config.js         # Backend auditado con ESLint (100% limpio).
└── package.json workspaces (seed.js ejecuta en start de render)
```

## Reglas de Acceso por Curso

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
   - Jairo (verificado en BD `projectIdea` 14/09 vía `GET /api/enrollments/course/algoritmos`): "Estrategia para atraer clientes en el campo de la compraventa de oro" (Angular/Node/Mongo). Julián: placeholder por definir (React/Node/Mongo).
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

5. **Editor Visual DFD (Algoritmos `/algoritmos/dfd`) — Iteración actual**
   - **Código Fuente legible**: pestañas `📖 Legible` (default, `generatePseudocode()` en `src/lib/dfd/pseudocode.js`: `Algoritmo X / Inicio / Leer / Escribir / <- / Si-Sino-FinSi / Mientras-FinMientras / Fin`) + `⚙️ .DFD` (crudo FreeDFD editable). Verificado en Problemas 1, 2, 10.
   - **Drag & Drop completo**: paleta arrastrable + clic `+` (Lectura, Salida, Asignación, Decisión, Mientras; Inicio/Fin auto), `dropZones` azules `+ soltar aquí` con `targetList+index` (incluye ramas Sí/No y cuerpo Mientras), `handleCanvasDrop` al final, `🆕 Nuevo` (lienzo vacío), `↩ Deshacer` (30 pasos), `🗑 Último`, lista Pasos con ↑↓✕ y reordenamiento. `serializeDfd` extendido con `return→3`, `call→12`, `merge→skip`; `renderShape` con `while` morado y `merge` invisible.
   - **Panel Propiedades**: clic en figura o paso → panel derecho editable en lenguaje natural (variables coma-separadas, texto salida, variable+fórmula con sanitizado, condiciones decisión/mientras), `pushHistory` al enfocar + `serialize` al escribir. Mapeo figura→nodo por `path` en `renderer.js` (`placeNodes(..., basePath)`, `shape.path`, `getNodeByPath`, `data-path`, resaltado azul). Roundtrip edición→serialize→parse→execute verificado.

4. **Auditoría del Sistema y Refactorización (Impeccable Style & ESLint)**
   - **Backend**: Auditado con ESLint. Código completamente limpio (0 Errores).
   - **Frontend**: Refactorizado siguiendo los principios A11y (accesibilidad) de Impeccable Style y la reactividad correcta de **Svelte 5** (Runes):
     - Corregidos errores de `totalTime` que perdían reactividad en los exámenes.
     - Ajustada la inicialización de estados capturados por prop `$props().data` en parciales y talleres usando encadenamiento opcional `??` e inicialización inline.
     - Asignados roles `presentation` en la página `enlaces-de-consulta` para cumplir estándares ARIA.
     - Limpiados los warnings de TypeScript respecto a variables potencialmente `null` en la obtención de notas.

6. **Bitácora 24/09/2026 (sesión docente)**
   - `seed.js`: alta de Julián (algo13) solo algoritmos; 7 DW omitidos (no tocar); regla general todo otro `student` → solo algoritmos con limpieza DW; reparar `canPresent:false→true`. Pendiente `npm start` en Render para aplicar en BD prod.
   - Sondeo prod `testcinar26bknd.onrender.com`: login admin OK; 76 enrollments en algoritmos (muchos test); 10 `projectIdea` no vacías (Jairo = compraventa oro; algo10 = "."; sin idea algo9/algo12/jd.reina).
   - DW2 TrueX Trade: roles y stacks actualizados en página; PM = docente (tú).

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Grades
- `GET /api/grades` - Todas las notas
- `POST /api/grades` - Crear nota
- `PUT /api/grades/:id` - Actualizar nota
- `GET /api/grades/mine` - Notas del usuario actual

### Enrollments
- `GET /api/enrollments/mine` - Obtener inscripciones del usuario actual (vital para renderizado del Dashboard).
- `POST /api/enrollments/project-idea` - Guarda/Actualiza la Actividad de la Semana (`projectIdea`).
- `POST /api/enrollments` - Inscribir usuario manualmente.
- `GET /api/enrollments/:course` - Inscritos en un curso.

## Credenciales

- **Admin**: `admin@cinar.com` / `Janis724@#$%` (role: 'admin')
- **Coordinador**: `coordinacion@cinarsistemas.edu.co` (role: 'coordinator')

## Dependencias Conocidas

### Frontend (testcinar26)
- SvelteKit 2.x
- Svelte 5 (Runes `$state`, `$derived`, `$effect`)
- Vite

### Backend (testcinar26bknd)
- Express
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## Vulnerabilidades y Deuda Técnica
- Existen algunas vulnerabilidades low severity en frontend por la cookie herencia de @sveltejs/kit (no crítico para producción, no forzar `npm audit fix` para no romper el workspace).
