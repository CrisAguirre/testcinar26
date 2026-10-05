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

// Fecha de apertura del Taller 1 de Algoritmos: Martes 6 de Octubre de 2026
// Se habilita de 6:30 PM a 8:30 PM hora Colombia (UTC-5)
export const TALLER_ALGO_OPEN = new Date('2026-10-06T18:30:00-05:00');
export const TALLER_ALGO_CLOSE = new Date('2026-10-06T20:30:00-05:00');

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
 * Admin siempre puede acceder. Estudiantes solo el 6 de octubre.
 * @param {{ role?: string } | null | undefined} user
 */
export function isTallerAlgoLockedFor(user) {
  if (isStrictAdmin(user)) return false;
  return !isTallerAlgoOpen();
}

export const EXAM_LOCK_MESSAGE =
  'Parciales y taller bloqueados: todavía no son las fechas. Solo el administrador puede acceder.';
