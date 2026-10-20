import { describe, it, expect } from 'vitest';
import {
  parseExamData,
  getMcStats,
  getOpenStats,
  hasPendingOpen,
  applyOpenScores,
  buildGradeUpdate,
  buildReviewComments,
  stripReviewNote,
  formatAttemptWindow
} from '../dw2Review';

/** @returns {any} */
function baseData() {
  return {
    attemptNumber: 1,
    mcScore: 1,
    mcTotal: 2,
    questions: [
      { id: 1, type: 'mc', studentAnswer: 0, isCorrect: true },
      { id: 2, type: 'mc', studentAnswer: 1, isCorrect: false },
      {
        id: 13,
        type: 'open',
        question: '¿Qué es el stack?',
        studentAnswer: 'React + Node + Mongo',
        openScore: null,
        openMaxScore: 5
      },
      {
        id: 14,
        type: 'open',
        question: '¿Qué es contrato API primero?',
        studentAnswer: 'Definir endpoints antes',
        openScore: null,
        openMaxScore: 5
      }
    ]
  };
}

describe('dw2Review', () => {
  it('parsea examData string y rechaza JSON inválido', () => {
    expect(parseExamData(JSON.stringify({ a: 1 }))).toEqual({ a: 1 });
    expect(parseExamData('{roto')).toBeNull();
    expect(parseExamData(null)).toBeNull();
  });

  it('cuenta MC con flags isCorrect', () => {
    expect(getMcStats(baseData())).toEqual({ correct: 1, total: 2 });
  });

  it('usa mcScore/mcTotal si el examen viejo no trae isCorrect', () => {
    const data = { mcScore: 6, mcTotal: 10, questions: [{ id: 1, type: 'mc' }] };
    expect(getMcStats(data)).toEqual({ correct: 6, total: 10 });
  });

  it('detecta abiertas pendientes y suma solo las calificadas', () => {
    const data = baseData();
    expect(getOpenStats(data)).toEqual({ total: 2, graded: 0, pending: 2, score: 0, max: 10 });
    expect(hasPendingOpen(data)).toBe(true);

    data.questions[2].openScore = 0;
    data.questions[3].openScore = 3.5;
    expect(getOpenStats(data)).toEqual({ total: 2, graded: 2, pending: 0, score: 3.5, max: 10 });
    expect(hasPendingOpen(data)).toBe(false);
  });

  it('aplica notas, respeta el máximo y no toca las respuestas', () => {
    const data = baseData();
    const updated = applyOpenScores(data, { 13: 9, 14: 2.5 });
    expect(updated.questions[2].openScore).toBe(5);
    expect(updated.questions[3].openScore).toBe(2.5);
    expect(updated.questions[2].studentAnswer).toBe('React + Node + Mongo');
    expect(data.questions[2].openScore).toBeNull(); // no muta el original
  });

  it('calcula la nota total sobre 60 y guarda la auditoría de revisión', () => {
    const data = baseData();
    const result = buildGradeUpdate(data, { 13: 4, 14: 5 }, 'admin');
    expect(result.score).toBe(10); // 1 MC + 9 abiertas
    expect(result.max_score).toBe(12);
    expect(result.open).toEqual({ total: 2, graded: 2, pending: 0, score: 9, max: 10 });
    expect(result.examData.review.reviewedBy).toBe('admin');
    expect(result.examData.review.reviewedAt).toBeTruthy();
  });

  it('compone y reemplaza la nota de revisión en comentarios', () => {
    expect(buildReviewComments('Intento 1 (Preparación) | MC: 6/10', 30, 50)).toBe(
      'Intento 1 (Preparación) | MC: 6/10 | Revisado - Abiertas: 30/50'
    );
    expect(stripReviewNote('Intento 1 | Revisado - Abiertas: 30/50')).toBe('Intento 1');
    expect(buildReviewComments('', 30, 50)).toBe('Revisado - Abiertas: 30/50');
    expect(buildReviewComments(null, 0, 50)).toBe('Revisado - Abiertas: 0/50');
  });

  it('etiqueta la ventana según la fecha del intento', () => {
    expect(formatAttemptWindow('2026-10-13T10:00:00-05:00')).toBe('Preparación');
    expect(formatAttemptWindow('2026-10-20T12:00:00-05:00')).toBe('Evaluación');
    expect(formatAttemptWindow(null)).toBe('—');
  });
});
