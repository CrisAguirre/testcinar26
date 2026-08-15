import { describe, it, expect } from 'vitest';
import {
  getAttemptType, getAttemptLabel, formatTime, getProgressPercent,
  getAttemptCount, getAvailableSlots, calculateScore, buildExamData,
  isMcCorrect, TOTAL_QUESTIONS, TOTAL_TIME,
  SIMULACRO_END, EVAL_START, EVAL_END, STORAGE_KEY,
  MAX_SIMULACROS, MAX_EVALUACIONES
} from '../exam2.js';

describe('getAttemptType', () => {
  it('retorna Simulacro para intentos 1, 2 y 3', () => {
    expect(getAttemptType(1)).toBe('Simulacro');
    expect(getAttemptType(2)).toBe('Simulacro');
    expect(getAttemptType(3)).toBe('Simulacro');
  });

  it('retorna Evaluación para el intento 4', () => {
    expect(getAttemptType(4)).toBe('Evaluación');
  });
});

describe('getAttemptLabel', () => {
  it('formatea correctamente', () => {
    expect(getAttemptLabel(1)).toBe('Intento 1 (Simulacro)');
    expect(getAttemptLabel(4)).toBe('Intento 4 (Evaluación)');
  });
});

describe('formatTime', () => {
  it('formatea 0 segundos', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formatea 45 minutos', () => {
    expect(formatTime(45 * 60)).toBe('45:00');
  });

  it('formatea valores con minutos y segundos', () => {
    expect(formatTime(125)).toBe('02:05');
  });
});

describe('getProgressPercent', () => {
  it('retorna 0 cuando no hay respuestas', () => {
    expect(getProgressPercent(0)).toBe(0);
  });

  it('retorna 50 cuando la mitad está respondida', () => {
    expect(getProgressPercent(10, 20)).toBe(50);
  });

  it('retorna 100 cuando todo está respondido', () => {
    expect(getProgressPercent(20, 20)).toBe(100);
  });
});

describe('getAttemptCount', () => {
  it('usa localStorage cuando loadingServer es true', () => {
    expect(getAttemptCount(5, 3, true)).toBe(3);
  });

  it('usa Math.max cuando no está cargando', () => {
    expect(getAttemptCount(5, 3, false)).toBe(5);
    expect(getAttemptCount(2, 4, false)).toBe(4);
  });
});

describe('getAvailableSlots', () => {
  it('simulacros: antes de las 18:45 hay 3 disponibles', () => {
    const now = new Date(SIMULACRO_END.getTime() - 1);
    const slots = getAvailableSlots(now, 0);
    expect(slots.enabled).toBe(true);
    expect(slots.remaining).toBe(MAX_SIMULACROS);
    expect(slots.total).toBe(MAX_SIMULACROS);
    expect(slots.windowLabel).toContain('Simulacros');
  });

  it('simulacros: sin intentos restantes si ya usó 3', () => {
    const now = new Date(SIMULACRO_END.getTime() - 1);
    const slots = getAvailableSlots(now, 3);
    expect(slots.enabled).toBe(false);
    expect(slots.remaining).toBe(0);
  });

  it('evaluación: entre 18:45 y 20:00 hay 1 evaluación tras 3 simulacros', () => {
    const now = new Date(EVAL_START.getTime() + 1);
    const slots = getAvailableSlots(now, 3);
    expect(slots.enabled).toBe(true);
    expect(slots.remaining).toBe(MAX_EVALUACIONES);
    expect(slots.windowLabel).toContain('Evaluación');
  });

  it('evaluación: sin intentos si ya usó 4', () => {
    const now = new Date(EVAL_START.getTime() + 1);
    const slots = getAvailableSlots(now, 4);
    expect(slots.enabled).toBe(false);
    expect(slots.remaining).toBe(0);
  });

  it('fuera de ventana: deshabilitado', () => {
    const now = new Date(EVAL_END.getTime() + 10000);
    const slots = getAvailableSlots(now, 1);
    expect(slots.enabled).toBe(false);
    expect(slots.remaining).toBe(0);
    expect(slots.windowLabel).toContain('Fuera de la ventana');
  });
});

describe('calculateScore', () => {
  const mcQuestions = [
    { id: 1, type: 'mc', answer: 0 },
    { id: 2, type: 'mc', answer: 1 },
    { id: 3, type: 'mc', answer: 2 },
  ];
  const openQuestions = [
    { id: 4, type: 'open' },
  ];
  const allQuestions = [...mcQuestions, ...openQuestions];

  it('calcula puntuación correcta', () => {
    const answers = { 1: 0, 2: 1, 3: 2 };
    const result = calculateScore(allQuestions, answers);
    expect(result.score).toBe(3);
    expect(result.total).toBe(3);
    expect(result.openCount).toBe(1);
  });

  it('no cuenta respuestas incorrectas', () => {
    const answers = { 1: 2, 2: 0, 3: 0 };
    const result = calculateScore(allQuestions, answers);
    expect(result.score).toBe(0);
  });
});

describe('buildExamData', () => {
  const questions = [
    { id: 1, tema: 1, type: 'mc', question: 'MC?', options: ['a', 'b'], answer: 0 },
    { id: 2, tema: 5, type: 'open', question: 'Open?' },
  ];

  it('construye examData para preguntas MC', () => {
    const data = buildExamData(questions, { 1: 0, 2: 'mi respuesta' });
    const mc = data.find(d => d.id === 1);
    expect(mc.type).toBe('mc');
    expect(mc.studentAnswer).toBe(0);
    expect(mc.correctAnswer).toBe(0);
    expect(mc.isCorrect).toBe(true);
    expect(mc.options).toEqual(['a', 'b']);
  });

  it('construye examData para preguntas abiertas', () => {
    const data = buildExamData(questions, { 1: 0, 2: 'mi respuesta' });
    const open = data.find(d => d.id === 2);
    expect(open.type).toBe('open');
    expect(open.studentAnswer).toBe('mi respuesta');
    expect(open.isCorrect).toBeUndefined();
    expect(open.openScore).toBeNull();
    expect(open.openMaxScore).toBe(5);
  });
});

describe('isMcCorrect', () => {
  it('retorna true si la respuesta es correcta', () => {
    expect(isMcCorrect({ type: 'mc', answer: 2 }, 2)).toBe(true);
  });

  it('retorna false si la respuesta es incorrecta', () => {
    expect(isMcCorrect({ type: 'mc', answer: 2 }, 0)).toBe(false);
  });

  it('retorna undefined para preguntas abiertas', () => {
    expect(isMcCorrect({ type: 'open' }, 'respuesta')).toBeUndefined();
  });
});
