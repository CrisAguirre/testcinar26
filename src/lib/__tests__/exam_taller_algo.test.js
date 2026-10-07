import { describe, it, expect, beforeEach } from 'vitest';
import {
  TOTAL_QUESTIONS,
  TOTAL_TIME,
  MAX_ATTEMPTS,
  getAttemptType,
  getAttemptLabel,
  formatTime,
  getProgressPercent,
  getAttemptCount,
  calculateScore,
  buildExamData,
  getLocalAttempts,
  getSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue
} from '../exam_taller_algo.js';
import { questionBank } from '../data/taller_algo.js';

function mockLocalStorage() {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; }
  };
}

describe('constantes del taller', () => {
  it('7 preguntas, 90 minutos, 2 intentos (reinicio 07/10)', () => {
    expect(TOTAL_QUESTIONS).toBe(7);
    expect(TOTAL_TIME).toBe(90 * 60);
    expect(MAX_ATTEMPTS).toBe(2);
  });
});

describe('getAttemptType / getAttemptLabel', () => {
  it('intento 1 es Preparación y 2 Evaluación', () => {
    expect(getAttemptType(1)).toBe('Preparación');
    expect(getAttemptType(2)).toBe('Evaluación');
    expect(getAttemptLabel(1)).toBe('Intento 1 (Preparación)');
    expect(getAttemptLabel(2)).toBe('Intento 2 (Evaluación)');
  });
});

describe('formatTime', () => {
  it('formatea minutos y segundos con padding', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(90 * 60)).toBe('90:00');
  });

  it('devuelve — sin valor', () => {
    expect(formatTime(undefined)).toBe('—');
    expect(formatTime(null)).toBe('—');
  });
});

describe('getProgressPercent', () => {
  it('calcula sobre 7 preguntas', () => {
    expect(getProgressPercent(0)).toBe(0);
    expect(getProgressPercent(7)).toBe(100);
    expect(getProgressPercent(5)).toBeCloseTo((5 / 7) * 100);
  });
});

describe('getAttemptCount', () => {
  it('en carga usa solo local', () => {
    expect(getAttemptCount(5, 2, true)).toBe(2);
  });

  it('toma el máximo entre servidor y local (no borra historial)', () => {
    expect(getAttemptCount(0, 1, false)).toBe(1);
    expect(getAttemptCount(1, 1, false)).toBe(1);
    expect(getAttemptCount(2, 0, false)).toBe(2);
  });
});

describe('calculateScore', () => {
  it('solo califica mc e ignora file (6 y 7 van manual)', () => {
    const qs = questionBank;
    const answers = { 1: 1, 2: 2, 3: 1, 4: 2, 5: 2, 6: 'file-selected', 7: 'file-selected' };
    expect(calculateScore(qs, answers)).toBe(5);
  });

  it('cuenta 0 si todo está mal', () => {
    const qs = questionBank;
    expect(calculateScore(qs, {})).toBe(0);
  });
});

describe('buildExamData', () => {
  it('marca file como No subido cuando falta el DFD', () => {
    const qs = questionBank.filter((q) => q.id === 6 || q.id === 1);
    const data = buildExamData(1, 0, 60, qs, { 1: 1 }, { 6: 'monedas.dfd' });
    expect(data.mcScore).toBe(1);
    expect(data.mcTotal).toBe(1);
    expect(data.uploadedFileNames).toEqual({ 6: 'monedas.dfd' });
    const fileRow = data.questions.find((q) => q.id === 6);
    expect(fileRow.studentAnswer).toBe('monedas.dfd');
    expect(fileRow.isCorrect).toBeNull();
  });

  it('marca No subido si no hay archivo', () => {
    const qs = questionBank.filter((q) => q.id === 7);
    const data = buildExamData(2, 1, 120, qs, {}, {});
    expect(data.questions[0].studentAnswer).toBe('No subido');
  });
});

describe('sync queue (localStorage)', () => {
  beforeEach(() => mockLocalStorage());

  it('encola y retira por createdAt', () => {
    expect(getLocalAttempts()).toEqual([]);
    expect(getSyncQueue()).toEqual([]);
    addToSyncQueue({ score: 4, comments: 'Intento 1' });
    const q = getSyncQueue();
    expect(q.length).toBe(1);
    removeFromSyncQueue(q[0].createdAt);
    expect(getSyncQueue()).toEqual([]);
  });
});
