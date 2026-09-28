/**
 * Bloqueo temporal de parciales y talleres.
 * Mientras EXAM_LOCK_ACTIVE sea true, solo el usuario con role 'admin'
 * puede entrar a parciales y talleres de los 3 cursos.
 * (Coordinadores y estudiantes ven "Bloqueado": aún no son las fechas.)
 */

export const EXAM_LOCK_ACTIVE = true;

/** @param {{ role?: string } | null | undefined} user */
export function isStrictAdmin(user) {
  return !!user && user.role === 'admin';
}

/** @param {{ role?: string } | null | undefined} user */
export function isExamLockedFor(user) {
  if (!EXAM_LOCK_ACTIVE) return false;
  return !isStrictAdmin(user);
}

export const EXAM_LOCK_MESSAGE =
  'Parciales y taller bloqueados: todavía no son las fechas. Solo el administrador puede acceder.';
