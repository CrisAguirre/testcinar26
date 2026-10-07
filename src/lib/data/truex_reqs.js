/**
 * Lista consolidada de requerimientos TrueX Trade (DW2 · Proyecto colaborativo).
 * Fuente: levantamiento del Analista de Requerimientos (Jeison, semana 1).
 * Se conservan los números originales del documento del equipo.
 */

export const TRUEX_RF = [
  { id: 1, title: 'Registro de usuarios', detail: 'Creación de cuenta con datos personales, ubicación y foto de perfil.' },
  { id: 2, title: 'Inicio de sesión', detail: 'Autenticación segura de usuarios.' },
  { id: 4, title: 'Gestión de perfil', detail: 'Consulta y edición de datos personales, foto y descripción.' },
  { id: 5, title: 'Roles y permisos', detail: 'Usuarios estándar y administrador con control de acceso sobre su propia información.' },
  { id: 7, title: 'Publicación de productos', detail: 'Registro con datos básicos (nombre, categoría, descripción, fotos, estado, ubicación) y adicionales (código único, antigüedad de uso, motivo de trueque y características deseadas).' },
  { id: 8, title: 'Edición y eliminación de publicaciones', detail: 'Gestión de productos por parte de su propietario.' },
  { id: 10, title: 'Búsqueda de productos', detail: 'Filtrado por palabras clave, nombres, categorías o descripciones.' },
  { id: 18, title: 'Validaciones de trueque', detail: 'Verificación de disponibilidad previa e impedimento de propuestas duplicadas en estado pendiente.' },
  { id: 19, title: 'Estados del intercambio', detail: 'Control del ciclo de vida del trueque (pendiente, aceptado, rechazado, cancelado, completado) con registro de fechas de confirmación.' },
  { id: 20, title: 'Historial "Mis intercambios"', detail: 'Consulta del estado de todas las propuestas.' },
  { id: 22, title: 'Mensajería directa', detail: 'Sistema de chat integrado entre usuarios.' },
  { id: 27, title: 'Gestión de imágenes', detail: 'Almacenamiento de fotos de productos y perfiles.' },
  { id: 28, title: 'Base de datos', detail: 'Persistencia estructurada para toda la información del sistema.' },
  { id: 29, title: 'API REST/GraphQL', detail: 'Comunicación desvinculada entre el frontend y backend.' },
  { id: 30, title: 'Seguridad', detail: 'Cifrado (hashing) de contraseñas y protección de accesos por autorización.' },
  { id: 31, title: 'Validación de datos', detail: 'Control de entradas en formularios previo al almacenamiento.' },
  { id: 32, title: 'Diseño adaptativo (responsive)', detail: 'Interfaz optimizada para móviles, tablets y computadores.' },
  { id: 34, title: 'Rendimiento', detail: 'Tiempos de respuesta eficientes en consultas y transacciones.' }
];

export const TRUEX_RNF = [
  { id: 3, title: 'Recuperación de contraseña', detail: 'Restablecimiento de acceso mediante correo electrónico.' },
  { id: 6, title: 'Seguimiento de perfiles', detail: 'Opción de seguir a otros usuarios para recibir actualizaciones de sus publicaciones.' },
  { id: 9, title: 'Panel "Mis publicaciones"', detail: 'Consulta y administración del catálogo propio.' },
  { id: 11, title: 'Filtros avanzados', detail: 'Búsqueda por categoría, ubicación, estado del producto y tipo de publicación (trueque/venta).' },
  { id: 12, title: 'Paginación y ordenamiento', detail: 'Mapeo de resultados por partes y criterios de orden (fecha o relevancia).' },
  { id: 13, title: 'Vistas de publicación', detail: 'Alternar modo de visualización entre tarjetas y lista.' },
  { id: 14, title: 'Lista de favoritos', detail: 'Guardado de productos de interés dentro de la plataforma.' },
  { id: 15, title: 'Lista de deseos (Wishlist)', detail: 'Registro de productos no disponibles actualmente en la plataforma.' },
  { id: 16, title: 'Sistema de coincidencias y alertas', detail: 'Algoritmo de matching y notificaciones automáticas según categoría, ubicación, características y lista de deseos.' },
  { id: 21, title: 'Calificaciones y reseñas', detail: 'Evaluación con puntuación y comentarios tras completar un intercambio.' },
  { id: 24, title: 'Sistema de notificaciones', detail: 'Avisos de mensajes, propuestas, cambios de estado y alertas de coincidencia.' }
];

export function getTruexReqCounts() {
  return { rf: TRUEX_RF.length, rnf: TRUEX_RNF.length, total: TRUEX_RF.length + TRUEX_RNF.length };
}
