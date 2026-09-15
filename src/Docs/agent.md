# Cinar DW2 - Estado Actual de la Plataforma

## Estructura del Proyecto

```
Cinar DW2/
├── testcinar26/           # Frontend (SvelteKit)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── desarrollo-web-1/   # DW1 (solo contenido, examenes bloqueados para estudiantes)
│   │   │   │   ├── parcial-1/       # Examen habilitado solo para admin/coordinador
│   │   │   │   ├── parcial-2/       # Examen habilitado solo para admin/coordinador
│   │   │   │   ├── algoritmia/
│   │   │   │   │   └── taller/      # Taller habilitado solo para admin/coordinador
│   │   │   │   ├── notas/
│   │   │   │   ├── enlaces-de-consulta/
│   │   │   │   └── actividad-de-la-semana/
│   │   │   ├── desarrollo-web-2/   # DW2
│   │   │   │   ├── parcial-1/
│   │   │   │   ├── parcial-2/
│   │   │   │   ├── taller/          # Taller práctico
│   │   │   │   ├── notas/
│   │   │   │   ├── enlaces-de-consulta/
│   │   │   │   └── actividad-de-la-semana/
│   │   │   └── algoritmos/
│   │   │       ├── parcial-1/
│   │   │       ├── parcial-2/
│   │   │       ├── taller/           # Taller práctico
│   │   │       ├── notas/
│   │   │       ├── enlaces-de-consulta/
│   │   │       └── actividad-de-la-semana/
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
│   └── eslint.config.js
└── package.json workspaces (seed.js ejecuta en start de render)
```

## Reglas de Acceso por Curso

### Desarrollo Web 1
- **Todos los usuarios autenticados** pueden acceder al contenido
- **Examenes bloqueados** para usuarios normales (ven "Curso Finalizado")
- **Admin/Coordinador** (`role: 'admin'` o `'coordinator'`) pueden presentar examenes
- No requiere inscripción estricta.

### Desarrollo Web 2 y Algoritmos
- **Acceso mediante Enrollments**: Ahora requiere inscripción explícita.
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

## Estado de Funcionalidades
- **Seguridad CSP / Evaluaciones**: Solucionado el fallo en Actividad de la Semana reemplazando llamadas a endpoints inexistentes e integrando la `enrollmentApi` correctamente.
- **Actividad de la Semana**: Completamente operativa, usa variables `$state` para mostrar UI en modo Solo Lectura si el registro existe y habilita modo Edición.
- **Bancos de Preguntas**: Todos revisados y en conformidad con los requerimientos temáticos.

## Vulnerabilidades y Deuda Técnica
- Existen 3 vulnerabilidades low severity en frontend por la cookie herencia de @sveltejs/kit (no crítico para producción, no forzar `npm audit fix` para no romper el workspace).
