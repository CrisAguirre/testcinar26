import { describe, it, expect } from 'vitest';
import { questionBank, selectRandomQuestions } from '../parcial1.js';

describe('questionBank', () => {
  it('tiene exactamente 60 preguntas', () => {
    expect(questionBank.length).toBe(60);
  });

  it('cada pregunta tiene id único', () => {
    const ids = questionBank.map(q => q.id);
    expect(new Set(ids).size).toBe(60);
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

  it('los temas están numerados del 1 al 7', () => {
    const temas = [...new Set(questionBank.map(q => q.tema))].sort();
    expect(temas).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('tema 1 tiene 6 preguntas mc', () => {
    const t1 = questionBank.filter(q => q.tema === 1);
    expect(t1.length).toBe(6);
    expect(t1.every(q => q.type === 'mc')).toBe(true);
  });

  it('tema 2 tiene 6 preguntas mc', () => {
    const t2 = questionBank.filter(q => q.tema === 2);
    expect(t2.length).toBe(6);
    expect(t2.every(q => q.type === 'mc')).toBe(true);
  });

  it('tema 3 tiene 6 preguntas mc', () => {
    const t3 = questionBank.filter(q => q.tema === 3);
    expect(t3.length).toBe(6);
    expect(t3.every(q => q.type === 'mc')).toBe(true);
  });

  it('tema 4 tiene 6 preguntas mc', () => {
    const t4 = questionBank.filter(q => q.tema === 4);
    expect(t4.length).toBe(6);
    expect(t4.every(q => q.type === 'mc')).toBe(true);
  });

  it('tema 5 tiene 9 preguntas (7 mc + 2 open)', () => {
    const t5 = questionBank.filter(q => q.tema === 5);
    expect(t5.length).toBe(9);
    expect(t5.filter(q => q.type === 'mc').length).toBe(7);
    expect(t5.filter(q => q.type === 'open').length).toBe(2);
  });

  it('tema 6 tiene 9 preguntas (8 mc + 1 open)', () => {
    const t6 = questionBank.filter(q => q.tema === 6);
    expect(t6.length).toBe(9);
    expect(t6.filter(q => q.type === 'mc').length).toBe(8);
    expect(t6.filter(q => q.type === 'open').length).toBe(1);
  });

  it('tema 7 tiene 18 preguntas (6 mc + 12 open)', () => {
    const t7 = questionBank.filter(q => q.tema === 7);
    expect(t7.length).toBe(18);
    expect(t7.filter(q => q.type === 'mc').length).toBe(6);
    expect(t7.filter(q => q.type === 'open').length).toBe(12);
  });
});

describe('selectRandomQuestions', () => {
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
      expect(porTema[1]).toBe(2);
      expect(porTema[2]).toBe(2);
      expect(porTema[3]).toBe(2);
      expect(porTema[4]).toBe(2);
      expect(porTema[5]).toBe(3);
      expect(porTema[6]).toBe(3);
      expect(porTema[7]).toBe(6);
    }
  });

  it('incluye preguntas mc y open según la distribución', () => {
    let totalOpen = 0;
    for (let run = 0; run < 50; run++) {
      const selected = selectRandomQuestions();
      const mcCount = selected.filter(q => q.type === 'mc').length;
      const openCount = selected.filter(q => q.type === 'open').length;
      expect(mcCount + openCount).toBe(20);
      expect(mcCount).toBeGreaterThanOrEqual(10);
      totalOpen += openCount;
    }
    expect(totalOpen / 50).toBeGreaterThanOrEqual(3);
  });

  it('cada ejecución retorna preguntas en orden diferente (probabilístico)', () => {
    const resultados = [];
    for (let run = 0; run < 20; run++) {
      resultados.push(selectRandomQuestions().map(q => q.id).join(','));
    }
    const unicos = new Set(resultados);
    expect(unicos.size).toBeGreaterThan(1);
  });

  it('respeta distribución con count personalizado', () => {
    const selected = selectRandomQuestions(10);
    const porTema = {};
    for (const q of selected) {
      porTema[q.tema] = (porTema[q.tema] || 0) + 1;
    }
    expect(selected.length).toBe(10);
    const totalSeleccionado = Object.values(porTema).reduce((a, b) => a + b, 0);
    expect(totalSeleccionado).toBe(10);
  });
});
