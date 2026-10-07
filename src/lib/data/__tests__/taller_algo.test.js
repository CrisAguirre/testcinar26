import { describe, it, expect } from 'vitest';
import { questionBank, examConfig, selectRandomQuestions } from '../taller_algo.js';

describe('taller_algo questionBank', () => {
  it('tiene 7 preguntas (5 mc + 2 file)', () => {
    expect(questionBank.length).toBe(7);
    expect(questionBank.filter((q) => q.type === 'mc').length).toBe(5);
    expect(questionBank.filter((q) => q.type === 'file').length).toBe(2);
  });

  it('preguntas 6 y 7 son ejercicios DFD (monedas y zapatería)', () => {
    const q6 = questionBank.find((q) => q.id === 6);
    const q7 = questionBank.find((q) => q.id === 7);
    expect(q6.type).toBe('file');
    expect(q7.type).toBe('file');
    expect(q6.question).toMatch(/Dólares/i);
    expect(q7.question).toMatch(/zapatos/i);
  });

  it('cada mc tiene answer válido dentro de options', () => {
    for (const q of questionBank.filter((q) => q.type === 'mc')) {
      expect(q.options.length).toBeGreaterThan(1);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
    }
  });
});

describe('examConfig', () => {
  it('dura 90 minutos y 7 puntos máximos', () => {
    expect(examConfig.duration).toBe(90 * 60);
    expect(examConfig.maxScore).toBe(70);
  });

  it('reparte 2 + 3 + 2 por tema', () => {
    expect(examConfig.questionsToSelect).toEqual({ 1: 2, 2: 3, 3: 2 });
  });
});

describe('selectRandomQuestions', () => {
  it('siempre devuelve 7 con los file al final', () => {
    for (let i = 0; i < 10; i++) {
      const qs = selectRandomQuestions();
      expect(qs.length).toBe(7);
      expect(qs.filter((q) => q.type === 'mc').length).toBe(5);
      expect(qs.slice(-2).every((q) => q.type === 'file')).toBe(true);
      expect(qs.slice(-2).map((q) => q.id)).toEqual([6, 7]);
    }
  });

  it('no duplica preguntas mc en un mismo examen', () => {
    const qs = selectRandomQuestions();
    const ids = qs.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
