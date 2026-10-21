import { describe, it, expect } from 'vitest';
import { sameQuestionSet, mergeDraftWithLocal, isResumableDraft } from '../examDraft.js';

const QS = [{ id: 1 }, { id: 2 }, { id: 3 }];

describe('sameQuestionSet', () => {
  it('true con los mismos ids en distinto orden', () => {
    expect(sameQuestionSet(QS, [{ id: 3 }, { id: 1 }, { id: 2 }])).toBe(true);
  });

  it('false si cambia la cantidad o un id', () => {
    expect(sameQuestionSet(QS, [{ id: 1 }, { id: 2 }])).toBe(false);
    expect(sameQuestionSet(QS, [{ id: 1 }, { id: 2 }, { id: 99 }])).toBe(false);
  });
});

describe('mergeDraftWithLocal', () => {
  it('sin borrador del servidor devuelve el local', () => {
    const local = { questions: QS, answers: { 1: 'A' }, savedAt: 100 };
    expect(mergeDraftWithLocal(null, local)).toBe(local);
  });

  it('sin snapshot local devuelve el servidor', () => {
    const server = { questions: QS, answers: { 1: 'A' }, updatedAt: '2026-10-21T10:00:00.000Z' };
    expect(mergeDraftWithLocal(server, null)).toBe(server);
  });

  it('si el servidor es más reciente, conserva su pregunta y tiempo', () => {
    const server = {
      questions: QS,
      answers: { 1: 'A', 2: 'B' },
      currentIndex: 2,
      timeLeft: 5000,
      tabSwitchCount: 1,
      uploadedFileNames: { 3: 'a.dfd' },
      updatedAt: '2026-10-21T10:10:00.000Z'
    };
    const local = {
      questions: QS,
      answers: { 1: 'A', 2: 'B', 3: 'C' },
      currentIndex: 0,
      timeLeft: 4000,
      tabSwitchCount: 3,
      uploadedFileNames: {},
      savedAt: new Date('2026-10-21T10:05:00.000Z').getTime()
    };
    const merged = mergeDraftWithLocal(server, local);
    expect(merged.currentIndex).toBe(2);
    expect(merged.timeLeft).toBe(5000);
    expect(merged.answers[3]).toBe('C'); // respuesta solo local no se pierde
    expect(merged.tabSwitchCount).toBe(3);
    expect(merged.uploadedFileNames[3]).toBe('a.dfd'); // no se pisa con local vacío
    expect(merged.mergedFromLocal).toBe(false);
  });

  it('si el local es más reciente, toma su pregunta y tiempo', () => {
    const server = {
      questions: QS,
      answers: { 1: 'A' },
      currentIndex: 0,
      timeLeft: 7000,
      tabSwitchCount: 0,
      updatedAt: '2026-10-21T10:00:00.000Z'
    };
    const local = {
      questions: QS,
      answers: { 1: 'A', 2: 'B' },
      currentIndex: 2,
      timeLeft: 6000,
      tabSwitchCount: 2,
      savedAt: new Date('2026-10-21T10:20:00.000Z').getTime()
    };
    const merged = mergeDraftWithLocal(server, local);
    expect(merged.currentIndex).toBe(2);
    expect(merged.timeLeft).toBe(6000);
    expect(merged.answers[2]).toBe('B');
    expect(merged.tabSwitchCount).toBe(2);
    expect(merged.mergedFromLocal).toBe(true);
  });

  it('si el set de preguntas cambió, prioriza el servidor (no mezcla intentos)', () => {
    const server = { questions: QS, answers: { 1: 'A' }, updatedAt: '2026-10-21T10:00:00.000Z' };
    const local = { questions: [{ id: 9 }], answers: { 9: 'Z' }, savedAt: Date.now() };
    expect(mergeDraftWithLocal(server, local)).toBe(server);
  });
});

describe('isResumableDraft', () => {
  it('true con preguntas y en progreso', () => {
    expect(isResumableDraft({ questions: QS, status: 'in_progress' })).toBe(true);
  });

  it('false sin preguntas o ya enviado', () => {
    expect(isResumableDraft(null)).toBe(false);
    expect(isResumableDraft({ questions: [], status: 'in_progress' })).toBe(false);
    expect(isResumableDraft({ questions: QS, status: 'submitted' })).toBe(false);
  });
});
