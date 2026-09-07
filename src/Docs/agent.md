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
│   │   │   ├── desarrollo-web-2/   # DW2 (usuarios con notas DW1 heredan acceso)
│   │   │   │   ├── parcial-1/
│   │   │   │   ├── parcial-2/
│   │   │   │   ├── taller/          # Taller práctico
│   │   │   │   ├── notas/
│   │   │   │   ├── enlaces-de-consulta/
│   │   │   │   └── actividad-de-la-semana/
│   │   │   └── algoritmos/          # Requiere inscripción explícita
│   │   │       ├── parcial-1/
│   │   │       ├── parcial-2/
│   │   │       ├── taller/           # Taller práctico
│   │   │       ├── notas/
│   │   │       ├── enlaces-de-consulta/
│   │   │       └── actividad-de-la-semana/
│   │   ├── lib/
│   │   │   ├── data/                # Bancos de preguntas
│   │   │   ├── stores/              # Auth, preload
│   │   │   ├── components/          # SubjectCard, etc
│   │   │   └── api.js
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
│   │   │   └── Enrollment.js    # Sistema de inscripciones
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── gradeController.js
│   │   │   └── enrollmentController.js  # checkEnrollment()
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── index.js
│   └── eslint.config.js
└── package.json workspaces
```

## Reglas de Acceso por Curso

### Desarrollo Web 1
- **Todos los usuarios autenticados** pueden acceder al contenido
- **Examenes bloqueados** para usuarios normales (ven "Curso Finalizado")
- **Admin/Coordinador** (`role: 'admin'` o `'coordinator'`) pueden presentar examenes
- No requiere inscripción

### Desarrollo Web 2
- **Usuarios con notas en DW1** heredan acceso automáticamente
- Pueden presentar parciales y taller
- **Backend**: `checkEnrollment()` verifica que tenga `dw1Grades > 0`
- No requiere inscripción manual

### Algoritmos
- **Solo usuarios con inscripción explícita** en tabla Enrollment
- Requiere llamar `POST /api/enrollments` con `{ userId, course: 'algoritmos', canPresent: true }`
- La API `checkEnrollment()` busca enrollment activo

## Modelo de Datos

### Enrollment
```javascript
{
  user: ObjectId,
  course: String,        // 'algoritmos'
  canPresent: Boolean,
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
- `GET /api/enrollments` - Todas las inscripciones
- `POST /api/enrollments` - Inscribir usuario
- `DELETE /api/enrollments/:userId/:course` - Desinscribir
- `GET /api/enrollments/:course` - Inscritos en curso

## Credenciales

- **Admin**: `admin@cinar.com` / `Janis724@` (role: 'admin')
- **Coordinador**: `coordinacion@cinarsistemas.edu.co` (role: 'coordinator')

## Dependencias Conocidas

### Frontend (testcinar26)
- SvelteKit 2.x
- @sveltejs/adapter-auto
- Vite
- Svelte Motion

### Backend (testcinar26bknd)
- Express
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- cors

### Vulnerabilidades Pendientes
- 3 low severity en frontend (cookie heredado de @sveltejs/kit) - no crítico

## Tareas Pendientes o Incompletas

1. **Vulnerabilidades frontend**: Las 3 low severity requieren `npm audit fix --force` que rompe el workspace protocol
2. **Algoritmos taller**: Creado en `/algoritmos/taller/+page.svelte`
3. **DW2 taller**: Creado en `/desarrollo-web-2/taller/+page.svelte`

## Notas Importantes

- El card de DW1 en homepage usa `noButton` para que toda la card sea clickeable
- Los examenes de DW1 verifican `$isAdmin` para permitir acceso
- El Enrollment controller tiene lógica `checkEnrollment()` para DW1, DW2 y Algoritmos
- Bancos de preguntas incluyen campo `explanation` para respuestas de selección múltiple
