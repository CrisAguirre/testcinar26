import { describe, it, expect, beforeEach } from 'vitest';
import {
  SYNC_QUEUE_KEY,
  SAVED_ANSWERS_KEY,
  DW2P1_SYNC_QUEUE_KEY,
  DW2P1_SAVED_ANSWERS_KEY,
  getSyncQueue,
  addToSyncQueue,
  saveAnswersSnapshot,
  clearSavedAnswers,
  migrateDw2SavedAnswers,
  getSavedAnswers
} from '../exam.js';

// localStorage en memoria para probar la separación DW1/DW2 sin navegador.
const store = new Map();

beforeEach(() => {
  store.clear();
  globalThis.localStorage = /** @type {any} */ ({
    getItem: (/** @type {string} */ key) => (store.has(key) ? store.get(key) : null),
    setItem: (/** @type {string} */ key, /** @type {string} */ value) => store.set(key, String(value)),
    removeItem: (/** @type {string} */ key) => store.delete(key),
    clear: () => store.clear()
  });
});

/** @param {number} createdAt @returns {any} */
function dw1Entry(createdAt) {
  return {
    createdAt,
    score: 4,
    maxScore: 10,
    comments: 'Intento 1 (Preparación) | MC: 4/10',
    examData: JSON.stringify({
      questions: [{ id: 1, tema: 1, type: 'mc', studentAnswer: 0 }]
    })
  };
}

/** @param {number} createdAt @returns {any} */
function dw2Entry(createdAt) {
  return {
    createdAt,
    score: 6,
    maxScore: 10,
    comments: 'Intento 1 (Preparación) | MC: 6/10',
    examData: JSON.stringify({
      questions: [
        { id: 1, tema: 'Arquitectura', area: 'arq', type: 'mc', studentAnswer: 0 },
        { id: 14, tema: 'Arquitectura', area: 'arq', type: 'open', studentAnswer: 'API' }
      ]
    })
  };
}

describe('separación de almacenamiento DW1/DW2', () => {
  it('mueve solo las entradas DW2 de la cola compartida', () => {
    localStorage.setItem(
      SYNC_QUEUE_KEY,
      JSON.stringify([dw1Entry(100), dw2Entry(200)])
    );

    /** @type {any[]} */
    const shared = getSyncQueue();
    expect(shared.map((e) => e.createdAt)).toEqual([100]);
    expect(getSyncQueue(DW2P1_SYNC_QUEUE_KEY).map((e) => e.createdAt)).toEqual([200]);
    expect(JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]')).toHaveLength(1);
  });

  it('no duplica entradas si la migración corre dos veces', () => {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([dw2Entry(200)]));
    getSyncQueue();
    getSyncQueue();
    expect(getSyncQueue(DW2P1_SYNC_QUEUE_KEY)).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]')).toEqual([]);
  });

  it('las entradas nuevas de DW2 llevan subject y no tocan la cola de DW1', () => {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([dw1Entry(100)]));
    addToSyncQueue({ subject: 'Desarrollo Web 2 - Parcial 1', score: 6 }, DW2P1_SYNC_QUEUE_KEY);

    expect(getSyncQueue()).toHaveLength(1);
    expect(getSyncQueue(DW2P1_SYNC_QUEUE_KEY)).toHaveLength(1);
    expect(getSyncQueue(DW2P1_SYNC_QUEUE_KEY)[0].subject).toBe('Desarrollo Web 2 - Parcial 1');
  });

  it('migra el borrador DW2 de la clave compartida sin tocar el de DW1', () => {
    localStorage.setItem(
      SAVED_ANSWERS_KEY,
      JSON.stringify({
        savedAt: 10,
        questions: [{ id: 14, tema: 'Arquitectura', area: 'arq', type: 'open' }],
        answers: { 14: 'respuesta' }
      })
    );
    migrateDw2SavedAnswers();
    expect(localStorage.getItem(SAVED_ANSWERS_KEY)).toBeNull();
    expect(JSON.parse(localStorage.getItem(DW2P1_SAVED_ANSWERS_KEY) || '{}').answers[14]).toBe('respuesta');

    // Un borrador de DW1 usa temas numéricos: no se toca.
    localStorage.setItem(
      SAVED_ANSWERS_KEY,
      JSON.stringify({
        savedAt: 20,
        questions: [{ id: 1, tema: 1, type: 'mc' }],
        answers: { 1: 0 }
      })
    );
    migrateDw2SavedAnswers();
    expect(localStorage.getItem(SAVED_ANSWERS_KEY)).not.toBeNull();
  });

  it('getSavedAnswers nunca entrega un borrador DW2 a DW1', () => {
    localStorage.setItem(
      SAVED_ANSWERS_KEY,
      JSON.stringify({
        savedAt: 10,
        questions: [{ id: 14, tema: 'Arquitectura', area: 'arq', type: 'open' }],
        answers: { 14: 'respuesta' }
      })
    );
    expect(getSavedAnswers()).toBeNull();
    expect(JSON.parse(localStorage.getItem(DW2P1_SAVED_ANSWERS_KEY) || '{}').answers[14]).toBe('respuesta');
  });

  it('guarda y borra el borrador DW2 solo en su clave', () => {
    saveAnswersSnapshot([{ id: 14, tema: 'Arquitectura' }], { 14: 'x' }, 60, 0, 0, DW2P1_SAVED_ANSWERS_KEY);
    expect(localStorage.getItem(DW2P1_SAVED_ANSWERS_KEY)).toBeTruthy();
    expect(localStorage.getItem(SAVED_ANSWERS_KEY)).toBeNull();

    clearSavedAnswers(DW2P1_SAVED_ANSWERS_KEY);
    expect(localStorage.getItem(DW2P1_SAVED_ANSWERS_KEY)).toBeNull();
  });
});
