# Cinar - Estado Actual de la Plataforma (Septiembre 2026)

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
│   │   │   │   └── proyecto-colaborativo/   # NUEVO: Plataforma TRUEQ (Intercambios P2P).
│   │   │   └── algoritmos/         # Algoritmos
│   │   │       ├── parcial-1/
│   │   │       ├── parcial-2/
│   │   │       ├── taller/           
│   │   │       ├── notas/
│   │   │       ├── enlaces-de-consulta/
│   │   │       ├── actividad-de-la-semana/  # Ejercicios DFD Nivel 1 con carga automática.
│   │   │       └── proyecto-personal/       # NUEVO: Asignación de proyectos por estudiante.
│   │   ├── lib/
│   │   │   ├── data/                # Bancos de preguntas (DW2 y Algo)
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
   - Listado consolidado y asignación de temas y stacks tecnológicos para los 11 estudiantes (incluido "Pasto Limpio" de Andrés Felipe Mena). 
   - Buscador en tiempo real y tags categorizados.

2. **Proyecto Colaborativo (Desarrollo Web 2)**
   - Ruta `/desarrollo-web-2/proyecto-colaborativo`.
   - Presenta el proyecto **TRUEQ** (Plataforma de Intercambios).
   - Incluye cronograma interactivo de 6 semanas y directrices claras de alcance ("Qué recortar" y "Recomendaciones Clave").
   - Stack definido: Svelte (Frontend), Node+Express (Backend), MongoDB (Database).

3. **Actividad de la Semana (Mejoras)**
   - **Algoritmos**: Integrados los enunciados en PDF para los ejercicios DFD de Nivel 1. Los archivos `.dfd` ahora se cargan automáticamente en el editor al hacer clic en los menús para mejorar la experiencia del estudiante.
   - **DW2**: Limpieza de UI (se retiraron los tags de horas y el prefijo de clases). Se añadieron **Ejemplos Prácticos externos** al final de cada temática (E-commerce, Social Media, etc). Solucionado el error 500 inyectando scripts HTML parseados a hexadecimal.

4. **Auditoría del Sistema y Refactorización (Impeccable Style & ESLint)**
   - **Backend**: Auditado con ESLint. Código completamente limpio (0 Errores).
   - **Frontend**: Refactorizado siguiendo los principios A11y (accesibilidad) de Impeccable Style y la reactividad correcta de **Svelte 5** (Runes):
     - Corregidos errores de `totalTime` que perdían reactividad en los exámenes.
     - Ajustada la inicialización de estados capturados por prop `$props().data` en parciales y talleres usando encadenamiento opcional `??` e inicialización inline.
     - Asignados roles `presentation` en la página `enlaces-de-consulta` para cumplir estándares ARIA.
     - Limpiados los warnings de TypeScript respecto a variables potencialmente `null` en la obtención de notas.

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

- **Admin**: `admin@cinar.com` / `Janis724@` (role: 'admin')
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
