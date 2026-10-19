import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY,
  TOTAL_QUESTIONS,
  TOTAL_TIME,
  MAX_ATTEMPTS,
  getAttemptType,
  getAttemptLabel,
  formatTime,
  getProgressPercent,
  getAttemptCount,
  SYNC_QUEUE_KEY,
  SAVED_ANSWERS_KEY,
  HEALTH_CHECK_KEY,
  getLocalAttempts,
  getSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
  setHealthCheckOk,
  isHealthCheckRecent,
  saveAnswersSnapshot,
  clearSavedAnswers,
  calculateScore,
  buildExamData
} from '../exam_algo_p1.js';

// Banco mínimo de prueba: 2 teóricas + 1 práctica (no depende del banco real).
const QS = [
  { id: 1, tema: 1, type: 'mc', question: '¿Pregunta 1?', options: [1, 2, 3, 4], answer: 2 },
  { id: 2, tema: 1, type: 'mc', question: '¿Pregunta 2?', options: [1, 2], answer: 0 },
  { id: 15, tema: 3, type: 'file', question: 'DFD: factorial', options: [] }
];

function mockLocalStorage() {
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; }
  };
}

describe('constantes del Parcial 1 de Algoritmos', () => {
  it('20 preguntas (15 teóricas + 5 prácticas), 120 minutos y 2 intentos', () => {
    expect(STORAGE_KEY).toBe('algo_p1_attempts');
    expect(TOTAL_QUESTIONS).toBe(20);
    expect(TOTAL_TIME).toBe(120 * 60);
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
  it('formatea minutos y segundos; 120 minutos completos', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(90)).toBe('01:30');
    expect(formatTime(TOTAL_TIME)).toBe('120:00');
  });

  it('devuelve — sin valor', () => {
    expect(formatTime(undefined)).toBe('—');
    expect(formatTime(null)).toBe('—');
  });
});

describe('getProgressPercent', () => {
  it('calcula sobre 20 preguntas por defecto', () => {
    expect(getProgressPercent(0)).toBe(0);
    expect(getProgressPercent(15)).toBe(75);
    expect(getProgressPercent(20)).toBe(100);
    expect(getProgressPercent(5, 10)).toBe(50);
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
  it('solo califica teóricas e ignora el archivo DFD', () => {
    expect(calculateScore(QS, { 1: 2, 2: 1, 15: 'ignorado' })).toBe(1);
    expect(calculateScore(QS, { 1: 2, 2: 0 })).toBe(2);
  });

  it('cuenta 0 si todo está mal', () => {
    expect(calculateScore(QS, {})).toBe(0);
  });
});

describe('buildExamData', () => {
  it('arma las filas con respuesta correcta y nombre del DFD', () => {
    const data = buildExamData(2, 3, 300, QS, { 1: 2, 2: 1 }, { 15: 'factorial.dfd' });
    expect(data.attemptNumber).toBe(2);
    expect(data.tabSwitches).toBe(3);
    expect(data.timeUsed).toBe(300);
    expect(data.mcScore).toBe(1);
    expect(data.mcTotal).toBe(2);
    expect(data.uploadedFileNames).toEqual({ 15: 'factorial.dfd' });

    const q1 = data.questions.find((q) => q.id === 1);
    expect(q1.correctAnswer).toBe(2);
    expect(q1.studentAnswer).toBe(2);
    expect(q1.isCorrect).toBe(true);

    const fileRow = data.questions.find((q) => q.id === 15);
    expect(fileRow.correctAnswer).toBeNull();
    expect(fileRow.isCorrect).toBeNull();
    expect(fileRow.studentAnswer).toBe('factorial.dfd');
  });

  it('marca No subido cuando falta el DFD', () => {
    const data = buildExamData(1, 0, 60, QS, { 1: 2 }, {});
    const fileRow = data.questions.find((q) => q.id === 15);
    expect(fileRow.studentAnswer).toBe('No subido');
  });
});

describe('almacenamiento local y cola de sincronización', () => {
  beforeEach(() => mockLocalStorage());

  it('lee intentos locales y tolera JSON corrupto', () => {
    expect(getLocalAttempts()).toEqual([]);
    localStorage.setItem(STORAGE_KEY, 'no-json');
    expect(getLocalAttempts()).toEqual([]);
  });

  it('encola y retira envíos pendientes por createdAt', () => {
    expect(getSyncQueue()).toEqual([]);
    addToSyncQueue({ score: 15, maxScore: 20, comments: 'Intento 1' });
    const q = getSyncQueue();
    expect(q.length).toBe(1);
    expect(typeof q[0].createdAt).toBe('number');
    expect(q[0].score).toBe(15);
    removeFromSyncQueue(q[0].createdAt);
    expect(getSyncQueue()).toEqual([]);
  });

  it('tolera cola corrupta', () => {
    localStorage.setItem(SYNC_QUEUE_KEY, '{rota');
    expect(getSyncQueue()).toEqual([]);
  });
});

describe('health-check y snapshot de respuestas', () => {
  beforeEach(() => mockLocalStorage());

  it('health-check: falso al inicio, verdadero tras marcar ok y falso si es viejo', () => {
    expect(isHealthCheckRecent()).toBe(false);
    setHealthCheckOk();
    expect(isHealthCheckRecent()).toBe(true);
    localStorage.setItem(HEALTH_CHECK_KEY, String(Date.now() - 120000));
    expect(isHealthCheckRecent()).toBe(false);
  });

  it('guarda snapshot retomable con timeLeft, índice, pestañas y DFDs', () => {
    saveAnswersSnapshot(QS, { 1: 2 }, 7150, 4, 2, { 15: 'a.dfd' });
    const snap = JSON.parse(localStorage.getItem(SAVED_ANSWERS_KEY));
    expect(snap.questions).toHaveLength(3);
    expect(snap.answers).toEqual({ 1: 2 });
    expect(snap.timeLeft).toBe(7150);
    expect(snap.currentIndex).toBe(4);
    expect(snap.tabSwitchCount).toBe(2);
    expect(snap.uploadedFileNames).toEqual({ 15: 'a.dfd' });
    expect(typeof snap.savedAt).toBe('number');
  });

  it('limpia el snapshot al terminar', () => {
    saveAnswersSnapshot(QS, {}, 100, 0, 0, {});
    clearSavedAnswers();
    expect(localStorage.getItem(SAVED_ANSWERS_KEY)).toBeNull();
  });
});
