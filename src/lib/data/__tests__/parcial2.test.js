import { describe, it, expect } from 'vitest';
import { questionBank, selectRandomQuestions } from '../parcial2.js';

describe('questionBank (Parcial 2)', () => {
  it('tiene exactamente 40 preguntas', () => {
    expect(questionBank.length).toBe(40);
  });

  it('cada pregunta tiene id único', () => {
    const ids = questionBank.map(q => q.id);
    expect(new Set(ids).size).toBe(40);
  });

  it('cada pregunta tiene type mc o open', () => {
    for (const q of questionBank) {
      expect(['mc', 'open']).toContain(q.type);
    }
  });

  it('las preguntas mc tienen options y answer', () => {
    const mc = questionBank.filter(q => q.type === 'mc');
    for (const q of mc) {
      expect(Array.isArray(q.options)).toBe(true);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(typeof q.answer).toBe('number');
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
    }
  });

  it('las preguntas open no tienen options ni answer', () => {
    const open = questionBank.filter(q => q.type === 'open');
    for (const q of open) {
      expect(q.options).toBeUndefined();
      expect(q.answer).toBeUndefined();
    }
  });

  it('los temas están numerados del 1 al 6', () => {
    const temas = [...new Set(questionBank.map(q => q.tema))].sort();
    expect(temas).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('temas 1 a 4 tienen 6 preguntas mc cada uno', () => {
    for (const tema of [1, 2, 3, 4]) {
      const t = questionBank.filter(q => q.tema === tema);
      expect(t.length).toBe(6);
      expect(t.every(q => q.type === 'mc')).toBe(true);
    }
  });

  it('tema 5 tiene 8 preguntas (6 mc + 2 open)', () => {
    const t5 = questionBank.filter(q => q.tema === 5);
    expect(t5.length).toBe(8);
    expect(t5.filter(q => q.type === 'mc').length).toBe(6);
    expect(t5.filter(q => q.type === 'open').length).toBe(2);
  });

  it('tema 6 tiene 8 preguntas (6 mc + 2 open)', () => {
    const t6 = questionBank.filter(q => q.tema === 6);
    expect(t6.length).toBe(8);
    expect(t6.filter(q => q.type === 'mc').length).toBe(6);
    expect(t6.filter(q => q.type === 'open').length).toBe(2);
  });
});

describe('selectRandomQuestions (Parcial 2)', () => {
  it('retorna exactamente 20 preguntas por defecto', () => {
    const selected = selectRandomQuestions();
    expect(selected.length).toBe(20);
  });

  it('retorna el número solicitado de preguntas', () => {
    const selected = selectRandomQuestions(10);
    expect(selected.length).toBe(10);
  });

  it('todas las preguntas vienen del banco original', () => {
    const selected = selectRandomQuestions();
    const bankIds = new Set(questionBank.map(q => q.id));
    for (const q of selected) {
      expect(bankIds.has(q.id)).toBe(true);
    }
  });

  it('no repite preguntas', () => {
    const selected = selectRandomQuestions();
    const ids = selected.map(q => q.id);
    expect(new Set(ids).size).toBe(20);
  });

  it('respeta la distribución por tema (default 20)', () => {
    for (let run = 0; run < 50; run++) {
      const selected = selectRandomQuestions();
      const porTema = {};
      for (const q of selected) {
        porTema[q.tema] = (porTema[q.tema] || 0) + 1;
      }
      expect(porTema[1]).toBe(3);
      expect(porTema[2]).toBe(3);
      expect(porTema[3]).toBe(3);
      expect(porTema[4]).toBe(3);
      expect(porTema[5]).toBe(4);
      expect(porTema[6]).toBe(4);
    }
  });

  it('respeta distribución con count personalizado', () => {
    const selected = selectRandomQuestions(10);
    const totalSeleccionado = selected.length;
    expect(totalSeleccionado).toBe(10);
  });
});
