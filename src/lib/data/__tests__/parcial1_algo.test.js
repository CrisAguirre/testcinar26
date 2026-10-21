import { describe, it, expect } from 'vitest';
import { questionBank, examConfig, selectRandomQuestions, getBucketCounts } from '../parcial1_algo.js';

describe('banco parcial 1 Algoritmos', () => {
  it('tiene al menos 50 teóricas y al menos 20 prácticas', () => {
    expect(questionBank.filter((q) => q.type === 'mc').length).toBeGreaterThanOrEqual(50);
    expect(questionBank.filter((q) => q.type === 'file').length).toBeGreaterThanOrEqual(20);
  });

  it('ids únicos', () => {
    const ids = questionBank.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada teoría tiene opciones válidas y respuesta dentro del rango', () => {
    for (const q of questionBank.filter((x) => x.type === 'mc')) {
      expect([2, 4]).toContain(q.options.length);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });

  it('mezcla de selección única: al menos 12 de 4 opciones y 8 de 2 opciones', () => {
    const mc = questionBank.filter((q) => q.type === 'mc');
    expect(mc.filter((q) => q.options.length === 4).length).toBeGreaterThanOrEqual(12);
    expect(mc.filter((q) => q.options.length === 2).length).toBeGreaterThanOrEqual(8);
  });

  it('cada nivel tiene al menos 5 teóricas y 2 prácticas', () => {
    const counts = getBucketCounts();
    for (const nivel of [1, 2, 3]) {
      expect(counts.theory[nivel]).toBeGreaterThanOrEqual(5);
      expect(counts.practical[nivel]).toBeGreaterThanOrEqual(2);
    }
  });

  it('las prácticas son DFD (tipo file) con enunciado', () => {
    for (const q of questionBank.filter((x) => x.type === 'file')) {
      expect(q.question.length).toBeGreaterThan(40);
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.answer).toBeNull();
    }
  });

  it('el examen saca 20: 15 teóricas (5 por nivel) + 5 prácticas (1+ por nivel)', () => {
    for (let r = 0; r < 20; r++) {
      const picked = selectRandomQuestions();
      expect(picked.length).toBe(examConfig.totalQuestions);

      const theory = picked.slice(0, 15);
      const practical = picked.slice(15);
      expect(theory.every((q) => q.type === 'mc')).toBe(true);
      expect(practical.every((q) => q.type === 'file')).toBe(true);

      for (const nivel of [1, 2, 3]) {
        expect(theory.filter((q) => q.tema === nivel).length).toBe(examConfig.theoryPerLevel);
        expect(practical.some((q) => q.tema === nivel)).toBe(true);
      }

      const ids = new Set(picked.map((q) => q.id));
      expect(ids.size).toBe(20);
    }
  });

  it('examConfig: 20 preguntas, 120 min (2 h) y ventana 19-25/10', () => {
    expect(examConfig.totalQuestions).toBe(20);
    expect(examConfig.duration).toBe(120 * 60);
    expect(examConfig.dateLabel).toMatch(/19 al domingo 25\/10/);
  });
});
