import { describe, it, expect } from 'vitest';
import {
  TALLER1_META,
  TALLER1_MCQ,
  getTaller1Rows,
  getTaller1Avg,
  getTaller1DfdStats
} from '../taller1_notas.js';

describe('TALLER1_META', () => {
  it('cubre 5 MCQ + ejercicios 6 (monedas) y 7 (zapatería) sobre 5', () => {
    expect(TALLER1_META.mcMax).toBe(5);
    expect(TALLER1_META.dfdMax).toBe(5);
    expect(TALLER1_META.dfdQuestions.length).toBe(2);
    expect(TALLER1_META.dfdQuestions.map((q) => q.id)).toEqual([6, 7]);
  });
});

describe('TALLER1_MCQ (Excel 06/10 + Julián 08/10, actualizado 19/10)', () => {
  it('tiene los 10 del Excel más Julián Reina', () => {
    expect(TALLER1_MCQ.length).toBe(11);
    expect(TALLER1_MCQ.find((r) => r.short === 'Julián Reina').mc).toBe(4);
  });

  it('todas las notas MCQ están entre 0 y 5', () => {
    for (const r of TALLER1_MCQ) {
      expect(r.mc).toBeGreaterThanOrEqual(0);
      expect(r.mc).toBeLessThanOrEqual(5);
    }
  });

  it('resuelve el nombre pendiente como Juan Carlos Bastidas Montilla', () => {
    const juan = TALLER1_MCQ.find((r) => r.short === 'Juan Carlos');
    expect(juan.full).toBe('Juan Carlos Bastidas Montilla');
    expect(juan.mc).toBe(4);
    expect(juan.dfd6).toBe(3);
    expect(juan.dfd7).toBeNull();
    expect(TALLER1_MCQ.some((r) => r.pendingName)).toBe(false);
  });

  it('registra las notas DFD del Excel y deja null las pendientes', () => {
    const byShort = Object.fromEntries(TALLER1_MCQ.map((r) => [r.short, r]));

    expect(byShort.Veronica.dfd7).toBe(3);
    expect(byShort.Lisseth.dfd6).toBe(5);
    expect(byShort.Lisseth.dfd7).toBe(1);
    expect(byShort.Jhohan.dfd6).toBe(5);
    expect(byShort.Jairo.dfd6).toBe(4);
    expect(byShort.Jairo.dfd7).toBe(2);
    expect(byShort['Oscar Rodriguez'].dfd6).toBe(5);
    expect(byShort['Oscar Rodriguez'].dfd7).toBe(5);

    expect(byShort.Ivan.dfd6).toBeNull();
    expect(byShort.Ivan.dfd7).toBeNull();
    expect(byShort['David Narvaez'].dfd6).toBeNull();
  });

  it('todas las notas DFD registradas están entre 0 y 5', () => {
    for (const r of TALLER1_MCQ) {
      for (const val of [r.dfd6, r.dfd7]) {
        if (val !== null) {
          expect(val).toBeGreaterThanOrEqual(0);
          expect(val).toBeLessThanOrEqual(TALLER1_META.dfdMax);
        }
      }
    }
  });
});

describe('getTaller1DfdStats', () => {
  it('cuenta 9 DFD calificados y 13 pendientes de 22', () => {
    expect(getTaller1DfdStats()).toEqual({ graded: 9, pending: 13, total: 22 });
  });
});

describe('getTaller1Rows', () => {
  it('resuelve el nombre completo de todos los estudiantes', () => {
    const rows = getTaller1Rows();
    expect(rows.length).toBe(11);
    expect(rows[0].displayName).toBe('Claudia Verónica Angulo');
    expect(rows.find((r) => r.short === 'Juan Carlos').displayName).toBe(
      'Juan Carlos Bastidas Montilla'
    );
    expect(rows.some((r) => r.displayName.includes('por confirmar'))).toBe(false);
  });

  it('calcula el % de P1–P5', () => {
    const rows = getTaller1Rows();
    expect(rows.find((r) => r.short === 'Veronica').mcPct).toBe(100);
    expect(rows.find((r) => r.short === 'David Narvaez').mcPct).toBe(60);
  });
});

describe('getTaller1Avg', () => {
  it('promedia las 11 notas MCQ (48/11 = 4.36)', () => {
    expect(getTaller1Avg()).toBe(4.36);
  });
});
