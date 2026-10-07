/**
 * Bloqueo temporal de parciales y talleres.
 * 
 * EXAM_LOCK_ACTIVE controla el bloqueo GLOBAL de todos los parciales/talleres.
 * TALLER_ALGO_UNLOCK controla la habilitación específica del Taller 1 de Algoritmos.
 * 
 * Mientras EXAM_LOCK_ACTIVE sea true, solo el usuario con role 'admin'
 * puede entrar a parciales y talleres de los 3 cursos,
 * EXCEPTO el taller de algoritmos que tiene su propia fecha de apertura.
 */

// Taller 1 Algoritmos: apertura 6 Oct 2026 + horario extra 7 Oct hasta medianoche (hora Colombia)
// Ventana: 06/10 14:00 hasta 07/10 23:59:59. No borrar historial de intentos.
export const TALLER_ALGO_OPEN = new Date('2026-10-06T14:00:00-05:00');
export const TALLER_ALGO_CLOSE = new Date('2026-10-07T23:59:59-05:00');

export const EXAM_LOCK_ACTIVE = true;

/** @param {{ role?: string } | null | undefined} user */
export function isStrictAdmin(user) {
  return !!user && user.role === 'admin';
}

/** Verifica si el Taller de Algoritmos está habilitado por fecha */
export function isTallerAlgoOpen() {
  const now = new Date();
  return now >= TALLER_ALGO_OPEN && now <= TALLER_ALGO_CLOSE;
}

/** @param {{ role?: string } | null | undefined} user */
export function isExamLockedFor(user) {
  if (!EXAM_LOCK_ACTIVE) return false;
  return !isStrictAdmin(user);
}

/**
 * Verifica si el taller de algoritmos está bloqueado para un usuario.
 * Admin siempre puede acceder. Estudiantes 6-7 octubre (incluye extra hasta medianoche del 7).
 * @param {{ role?: string } | null | undefined} user
 */
export function isTallerAlgoLockedFor(user) {
  if (isStrictAdmin(user)) return false;
  return !isTallerAlgoOpen();
}

export const EXAM_LOCK_MESSAGE =
  'Parciales y taller bloqueados: todavía no son las fechas. Solo el administrador puede acceder.';
