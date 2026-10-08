import { describe, it, expect } from 'vitest';
import { questionBank, examConfig, selectRandomQuestions, getBucketCounts } from '../parcial1_dw2.js';

describe('banco parcial 1 DW2', () => {
  it('tiene 50 preguntas con ids únicos 1-50', () => {
    expect(questionBank.length).toBe(50);
    const ids = questionBank.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
  });

  it('25 abiertas + 25 MC, 25 arquitectura + 25 svelte', () => {
    expect(questionBank.filter((q) => q.type === 'open').length).toBe(25);
    expect(questionBank.filter((q) => q.type === 'mc').length).toBe(25);
    expect(questionBank.filter((q) => q.area === 'arq').length).toBe(25);
    expect(questionBank.filter((q) => q.area === 'svelte').length).toBe(25);
  });

  it('cada grupo temática×tipo tiene al menos 10 (para no repetir entre 8 estudiantes)', () => {
    for (const area of ['arq', 'svelte']) {
      for (const type of ['mc', 'open']) {
        expect(questionBank.filter((q) => q.area === area && q.type === type).length).toBeGreaterThanOrEqual(10);
      }
    }
  });

  it('toda MC tiene 4 opciones, respuesta válida y explicación', () => {
    for (const q of questionBank.filter((q) => q.type === 'mc')) {
      expect(q.options.length).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
    }
  });

  it('toda abierta trae rúbrica de calificación', () => {
    for (const q of questionBank.filter((q) => q.type === 'open')) {
      expect(q.rubric).toBeTruthy();
    }
  });

  it('svelte cubre las Clases 1-5', () => {
    const clases = new Set(questionBank.filter((q) => q.area === 'svelte').map((q) => q.clase));
    expect([...clases].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('selectRandomQuestions (examen de 20)', () => {
  it('devuelve 5 por grupo: arq-mc, arq-open, svelte-mc, svelte-open', () => {
    for (let i = 0; i < 10; i++) {
      const qs = selectRandomQuestions();
      expect(qs.length).toBe(20);
      expect(getBucketCounts(qs)).toEqual({ 'arq-mc': 5, 'arq-open': 5, 'svelte-mc': 5, 'svelte-open': 5 });
    }
  });

  it('MC primero y abiertas después, sin ids repetidos', () => {
    const qs = selectRandomQuestions();
    expect(qs.slice(0, 10).every((q) => q.type === 'mc')).toBe(true);
    expect(qs.slice(10).every((q) => q.type === 'open')).toBe(true);
    expect(new Set(qs.map((q) => q.id)).size).toBe(20);
  });

  it('varía entre sorteos (banco suficiente para 8 estudiantes)', () => {
    const a = selectRandomQuestions().map((q) => q.id).join(',');
    const b = selectRandomQuestions().map((q) => q.id).join(',');
    expect(a === b && selectRandomQuestions().map((q) => q.id).join(',') === a).toBe(false);
  });
});

describe('examConfig', () => {
  it('fecha 14/10 y 5 por grupo', () => {
    expect(examConfig.perBucket).toBe(5);
    expect(examConfig.dateLabel).toMatch(/14\/10/);
  });
});
