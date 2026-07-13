import { describe, it, expect } from 'vitest';
import { introContent, algorithms, ALGORITMIA_SUBJECT, getAlgorithmById } from '../algoritmia.js';

describe('introContent', () => {
  it('tiene título y subtítulo', () => {
    expect(introContent.title).toBeTruthy();
    expect(introContent.subtitle).toBeTruthy();
  });

  it('tiene al menos 2 párrafos', () => {
    expect(introContent.paragraphs.length).toBeGreaterThanOrEqual(2);
  });

  it('tiene 4 conceptos clave', () => {
    expect(introContent.keyConcepts.length).toBe(4);
  });

  it('cada concepto tiene term y desc', () => {
    for (const c of introContent.keyConcepts) {
      expect(c.term).toBeTruthy();
      expect(c.desc).toBeTruthy();
    }
  });
});

describe('ALGORITMIA_SUBJECT', () => {
  it('es la constante correcta', () => {
    expect(ALGORITMIA_SUBJECT).toBe('Desarrollo Web 1 - Algoritmia');
  });
});

describe('algorithms', () => {
  it('tiene exactamente 10 algoritmos', () => {
    expect(algorithms.length).toBe(10);
  });

  it('cada algoritmo tiene id único', () => {
    const ids = algorithms.map(a => a.id);
    expect(new Set(ids).size).toBe(algorithms.length);
  });

  it('cada algoritmo tiene los campos requeridos', () => {
    for (const a of algorithms) {
      expect(a.id).toBeGreaterThanOrEqual(1);
      expect(a.title).toBeTruthy();
      expect(a.icon).toBeTruthy();
      expect(a.practicePrompt).toBeTruthy();
      expect(a.problem).toBeDefined();
      expect(a.problem.scenario).toBeTruthy();
      expect(a.problem.example).toBeTruthy();
      expect(Array.isArray(a.sequence)).toBe(true);
      expect(a.solution).toBeTruthy();
      expect(Array.isArray(a.conceptosClave)).toBe(true);
      expect(a.conceptosClave.length).toBeGreaterThanOrEqual(2);
      expect(Array.isArray(a.flowchart)).toBe(true);
    }
  });

  it('cada paso de sequence tiene step y desc', () => {
    for (const a of algorithms) {
      for (const s of a.sequence) {
        expect(s.step).toBeGreaterThanOrEqual(1);
        expect(s.desc).toBeTruthy();
      }
    }
  });

  it('cada nodo de flowchart tiene type y text', () => {
    for (const a of algorithms) {
      for (const n of a.flowchart) {
        expect(['start', 'end', 'process', 'decision']).toContain(n.type);
        expect(n.text).toBeTruthy();
      }
    }
  });

  it('cada flowchart empieza con start y termina con end', () => {
    for (const a of algorithms) {
      expect(a.flowchart[0].type).toBe('start');
      expect(a.flowchart[a.flowchart.length - 1].type).toBe('end');
    }
  });

  it('sequence está numerada correlativamente desde 1', () => {
    for (const a of algorithms) {
      for (let i = 0; i < a.sequence.length; i++) {
        expect(a.sequence[i].step).toBe(i + 1);
      }
    }
  });
});

describe('getAlgorithmById', () => {
  it('retorna el algoritmo correcto', () => {
    const algo = getAlgorithmById(3);
    expect(algo).toBeDefined();
    expect(algo.title).toBe('Números primos');
  });

  it('retorna undefined para id inexistente', () => {
    expect(getAlgorithmById(99)).toBeUndefined();
  });

  it('retorna el primer algoritmo para id 1', () => {
    const algo = getAlgorithmById(1);
    expect(algo.id).toBe(1);
    expect(algo.title).toBe('Promedio de calificaciones');
  });

  it('retorna el último algoritmo para id 10', () => {
    const algo = getAlgorithmById(10);
    expect(algo.id).toBe(10);
    expect(algo.title).toBe('Suma de dígitos');
  });
});
