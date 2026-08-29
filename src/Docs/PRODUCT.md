# Cinar Sistemas — Plataforma Educativa

## Purpose
Plataforma educativa para gestión de calificaciones, evaluaciones parciales y recursos de aprendizaje para estudiantes de Desarrollo Web 1.

## Register
product — app UI / dashboard / herramientas educativas

## Platform
web

## Language
es

## Users
- **Estudiantes**: Visualizan sus calificaciones, presentan evaluaciones (parciales, algoritmia), acceden a recursos (enlaces de consulta)
- **Coordinador/Admin**: Gestiona calificaciones, revisa respuestas abiertas, administra el sistema

## Key Features
- Autenticación con JWT (login/register)
- Dashboard con calificaciones y detalle de evaluaciones
- Examen Parcial 1 (20 preguntas, 7 temas, MC + abiertas)
- Módulo de Algoritmia (10 algoritmos con secuencia, pseudocódigo, diagrama de flujo)
- Enlaces de Consulta (14 recursos educativos categorizados con búsqueda)
- Preloader que despierta backend en Render y carga perfil/calificaciones
- Coordinador con permisos de administrador

## Technical Stack
- **Frontend**: SvelteKit 5, TypeScript
- **Backend**: Express.js, MongoDB Atlas, JWT
- **Testing**: Vitest (146 tests, 8 suites)
- **Deploy**: Frontend en Vercel, Backend en Render (free tier, hiberna)
