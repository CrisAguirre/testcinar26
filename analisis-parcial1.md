# Análisis de incidentes — Parcial 1

## Estado de la base de datos

| Estudiante | Intentos en BD | Último intento | Revisado |
|-----------|:---:|:---:|:---:|
| HAROLD ESTEBAN QUIROZ ALVAREZ | 3 | Intento 3 (Evaluación) — 29/32 + Abiertas 15/15 | ✅ |
| DAVID ALEJANDRO GARCIA ENRIQUEZ | 4 | Intento 4 (Evaluación) — 48/48 | ✅ |
| JAIRO DANIEL ZAMBRANO VALLEID | 2 | Intento 2 — 39/40 + Abiertas 25/25 | ✅ |
| ANDRES FELIPE MEZA LEON | 1 | Intento 1 — 39/44 + Abiertas 28/30 | ✅ |
| JEISON STIVEN MARTINEZ ZAMBRA | 1 | Intento 1 — 27/40 + Abiertas 14/25 | ✅ |
| **DIEGO SEBASTIAN AZAIN MORAN** | **0** | — | ❌ |
| **WILLIAM DAVID SALAS LASSO** | **0** | — | ❌ |

## Diagnóstico de fallos

### William — Usuario registrado a última hora

El usuario **SÍ existe en BD** (ID: `6a590a7b95b501785460600d`), pero no tiene ninguna calificación. Posibles causas:

1. **Registro exitoso pero sin auto-login**: Tras registrarse, la app devuelve el token. Si hubo un error al almacenar el token en `localStorage`, el usuario quedó autenticado en la vista pero sin token válido. Al enviar el examen, `$currentUser?.id` existe pero el token es inválido, causando error 403 del backend.

2. **Backend hibernando**: Render free tier hiberna después de inactividad. El preloader despierta el backend, pero si William era uno de los primeros usuarios, el backend pudo haber estado dormido y el POST `/grades/mine` falló por timeout.

3. **Fallo silencioso**: El `handleSubmit()` captura el error y guarda SOLO en localStorage. Si William cerró la página sin reintentar, el dato nunca llegó al servidor.

### Diego — Usuario regular sin registro

El usuario **SÍ existe en BD** (ID: `6a545e9ad0a53068e51ce291`) desde antes, pero tiene **0 calificaciones**. Causas más probables:

1. **Error de conexión/token**: Si su token expiró o hubo un error de red, el envío falló y el error se manejó silenciosamente.

2. **Navegación secuencial**: El examen tiene navegación secuencial obligatoria. Si Diego no respondió alguna pregunta, no pudo avanzar a la siguiente y nunca llegó a "Finalizar".

3. **Cierre del navegador antes de enviar**: Si cerró la pestaña antes de finalizar, los datos solo existen en memoria.

### Problema común: Falta de sincronización

El mayor problema es que **no hay un mecanismo de reintento ni sincronización**. El flujo es:
- Intento guardar en servidor → si falla → guardar solo en localStorage
- Si el usuario cierra el navegador, el dato local se pierde (o queda huérfano)

## Recomendaciones para Parcial 2

### 1.    Mecanismo de reintento automático
- Agregar un "sync queue" que guarde los intentos pendientes en localStorage
- Al cargar la app, verificar si hay intentos sin sincronizar y reintentar automáticamente
- Mostrar indicador visual de "sincronizando..."

### 2.    Verificar backend antes del examen
- Al hacer clic en "Comenzar", hacer un `GET /api/auth/profile` para verificar que el token y el backend están vivos
- Si falla, mostrar mensaje claro: "El servidor no está disponible, intenta de nuevo en unos segundos"

### 3.    Mejor feedback de error
- En lugar de un texto pequeño, mostrar un banner prominente si el guardado falla
- Opción de "Reintentar guardado" visible incluso después de ver resultados

### 4.    Protección contra pérdida de datos
- Guardar respuestas en localStorage en cada pregunta (no solo al final)
- Al recuperar sesión, permitir retomar el examen donde quedó

### 5.    Health check / Wake-up mejorado
- El preloader actual (wake-up) solo hace un GET a la raíz del backend
- Agregar un segundo intento después de 5 segundos si el primero falla
- Mostrar estado del servidor antes de permitir comenzar

### 6.    Registro de eventos (logging)
- Agregar console.log con estructura JSON en cada paso del envío
- En el backend, registrar cada `submitMine` con timestamp, userId y status

### 7.    Tiempo de gracia en el servidor
- El examen se envía automáticamente cuando `timeLeft <= 0`
- Si en ese momento el backend está caído, reintentar el envío periódicamente (cada 5s, hasta 3 intentos)

### 8.    Panel de administración mejorado
- Mostrar en el dashboard los intentos que están solo en localStorage (no sincronizados)
- Indicador visual si un estudiante inició pero no completó el examen
