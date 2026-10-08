import { describe, it, expect } from 'vitest';
import { TALLER1_META, TALLER1_MCQ, getTaller1Rows, getTaller1Avg } from '../taller1_notas.js';

describe('TALLER1_META', () => {
  it('cubre 5 MCQ + ejercicios 6 (monedas) y 7 (zapatería)', () => {
    expect(TALLER1_META.mcMax).toBe(5);
    expect(TALLER1_META.dfdQuestions.length).toBe(2);
    expect(TALLER1_META.dfdQuestions.map((q) => q.id)).toEqual([6, 7]);
  });
});

describe('TALLER1_MCQ (Excel 06/10 + Julián 08/10)', () => {
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

  it('marca el ? como nombre pendiente de confirmar', () => {
    const unknown = TALLER1_MCQ.filter((r) => r.pendingName);
    expect(unknown.length).toBe(1);
    expect(unknown[0].mc).toBe(4);
  });

  it('todos los DFD 6 y 7 inician en revisión (null)', () => {
    for (const r of TALLER1_MCQ) {
      expect(r.dfd6).toBeNull();
      expect(r.dfd7).toBeNull();
    }
  });
});

describe('getTaller1Rows', () => {
  it('resuelve nombre completo y marca el pendiente', () => {
    const rows = getTaller1Rows();
    expect(rows.length).toBe(11);
    expect(rows[0].displayName).toBe('Claudia Verónica Angulo');
    const pending = rows.find((r) => r.pendingName);
    expect(pending.displayName).toMatch(/por confirmar/);
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
