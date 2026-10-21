// Guardas de fecha (frontend) de los parciales/talleres: deben coincidir con el
// candado del backend (testcinar26bknd/src/config/schedule.js).
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  TALLER_ALGO_OPEN,
  TALLER_ALGO_CLOSE,
  ALGO_P1_OPEN,
  ALGO_P1_CLOSE,
  DW2P1_PREP_OPEN,
  DW2P1_PREP_CLOSE,
  DW2P1_OPEN,
  DW2P1_CLOSE,
  EXAM_LOCK_ACTIVE,
  EXAM_LOCK_MESSAGE,
  isStrictAdmin,
  isAlgoP1Open,
  isAlgoP1LockedFor,
  isDW2P1Open,
  isDW2P1LockedFor,
  isTallerAlgoOpen,
  isTallerAlgoLockedFor,
  isExamLockedFor
} from '../examLock.js';

const setTime = (iso) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
};

afterEach(() => vi.useRealTimers());

const ESTUDIANTE = { role: 'student' };
const ADMIN = { role: 'admin' };

describe('constantes de fecha (hora Colombia, UTC-5)', () => {
  it('Algoritmos P1: 19/10 00:00 → 25/10 23:59:59', () => {
    expect(ALGO_P1_OPEN.toISOString()).toBe('2026-10-19T05:00:00.000Z');
    expect(ALGO_P1_CLOSE.toISOString()).toBe('2026-10-26T04:59:59.000Z');
  });

  it('DW2 P1: prep 8–13/10 y evaluación del 19 al 21/10 (hasta medianoche)', () => {
    expect(DW2P1_PREP_OPEN.toISOString()).toBe('2026-10-08T05:00:00.000Z');
    expect(DW2P1_PREP_CLOSE.toISOString()).toBe('2026-10-14T04:59:59.000Z');
    expect(DW2P1_OPEN.toISOString()).toBe('2026-10-19T05:00:00.000Z');
    expect(DW2P1_CLOSE.toISOString()).toBe('2026-10-22T04:59:59.000Z');
  });

  it('Taller Algoritmos: 06/10 14:00 → 07/10 23:59:59', () => {
    expect(TALLER_ALGO_OPEN.toISOString()).toBe('2026-10-06T19:00:00.000Z');
    expect(TALLER_ALGO_CLOSE.toISOString()).toBe('2026-10-08T04:59:59.000Z');
  });

  it('bloqueo global activo y con mensaje', () => {
    expect(EXAM_LOCK_ACTIVE).toBe(true);
    expect(EXAM_LOCK_MESSAGE).toMatch(/bloqueados/);
  });
});

describe('isAlgoP1Open / isAlgoP1LockedFor', () => {
  it('abre exactamente el 19/10 00:00 y cierra al terminar el 25/10', () => {
    setTime('2026-10-18T23:59:59-05:00');
    expect(isAlgoP1Open()).toBe(false);
    setTime('2026-10-19T00:00:00-05:00');
    expect(isAlgoP1Open()).toBe(true);
    setTime('2026-10-20T12:00:00-05:00');
    expect(isAlgoP1Open()).toBe(true);
    setTime('2026-10-25T23:59:59-05:00');
    expect(isAlgoP1Open()).toBe(true);
    setTime('2026-10-26T00:00:00-05:00');
    expect(isAlgoP1Open()).toBe(false);
  });

  it('bloquea al estudiante solo fuera de la ventana; el admin nunca se bloquea', () => {
    setTime('2026-10-15T10:00:00-05:00');
    expect(isAlgoP1LockedFor(ESTUDIANTE)).toBe(true);
    expect(isAlgoP1LockedFor(null)).toBe(true);
    expect(isAlgoP1LockedFor(ADMIN)).toBe(false);
    setTime('2026-10-19T10:00:00-05:00');
    expect(isAlgoP1LockedFor(ESTUDIANTE)).toBe(false);
  });
});

describe('isDW2P1Open / isDW2P1LockedFor', () => {
  it('cubre preparación y evaluación (el hueco 14–18/10 lo avisa la página, no esta guarda)', () => {
    setTime('2026-10-07T23:59:59-05:00');
    expect(isDW2P1Open()).toBe(false);
    setTime('2026-10-08T00:00:00-05:00');
    expect(isDW2P1Open()).toBe(true);
    setTime('2026-10-13T23:59:59-05:00');
    expect(isDW2P1Open()).toBe(true);
    setTime('2026-10-16T12:00:00-05:00');
    expect(isDW2P1Open()).toBe(true);
    setTime('2026-10-21T00:00:00-05:00');
    expect(isDW2P1Open()).toBe(true);
    setTime('2026-10-21T23:59:59-05:00');
    expect(isDW2P1Open()).toBe(true);
    setTime('2026-10-22T00:00:00-05:00');
    expect(isDW2P1Open()).toBe(false);
  });

  it('bloquea al estudiante antes del 8/10 y desde el 22/10; el admin nunca se bloquea', () => {
    setTime('2026-10-07T10:00:00-05:00');
    expect(isDW2P1LockedFor(ESTUDIANTE)).toBe(true);
    expect(isDW2P1LockedFor(ADMIN)).toBe(false);
    setTime('2026-10-16T12:00:00-05:00');
    expect(isDW2P1LockedFor(ESTUDIANTE)).toBe(false);
    setTime('2026-10-22T00:00:01-05:00');
    expect(isDW2P1LockedFor(ESTUDIANTE)).toBe(true);
  });
});

describe('isTallerAlgoOpen / isTallerAlgoLockedFor', () => {
  it('ventana 06/10 14:00 → 07/10 23:59:59', () => {
    setTime('2026-10-06T13:59:59-05:00');
    expect(isTallerAlgoOpen()).toBe(false);
    setTime('2026-10-06T14:00:00-05:00');
    expect(isTallerAlgoOpen()).toBe(true);
    setTime('2026-10-07T23:59:59-05:00');
    expect(isTallerAlgoOpen()).toBe(true);
    setTime('2026-10-08T00:00:00-05:00');
    expect(isTallerAlgoOpen()).toBe(false);
  });

  it('bloquea al estudiante fuera de ventana; el admin nunca se bloquea', () => {
    setTime('2026-10-06T13:00:00-05:00');
    expect(isTallerAlgoLockedFor(ESTUDIANTE)).toBe(true);
    expect(isTallerAlgoLockedFor(ADMIN)).toBe(false);
    setTime('2026-10-06T15:00:00-05:00');
    expect(isTallerAlgoLockedFor(ESTUDIANTE)).toBe(false);
  });
});

describe('isExamLockedFor / isStrictAdmin', () => {
  it('el bloqueo global aplica a estudiantes y anónimos, no al admin', () => {
    setTime('2026-10-19T10:00:00-05:00');
    expect(isExamLockedFor(ESTUDIANTE)).toBe(true);
    expect(isExamLockedFor(null)).toBe(true);
    expect(isExamLockedFor(ADMIN)).toBe(false);
  });

  it('isStrictAdmin solo reconoce el rol admin', () => {
    expect(isStrictAdmin({ role: 'admin' })).toBe(true);
    expect(isStrictAdmin({ role: 'teacher' })).toBe(false);
    expect(isStrictAdmin({ role: 'coordinator' })).toBe(false);
    expect(isStrictAdmin({ role: 'student' })).toBe(false);
    expect(isStrictAdmin(null)).toBe(false);
    expect(isStrictAdmin(undefined)).toBe(false);
  });
});
