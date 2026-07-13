export const STORAGE_KEY = 'parcial1_attempts';
export const DETAIL_KEY = 'parcial1_details';

export const EXAM_DATE = new Date(2026, 6, 15);
export const WINDOW1_END = new Date(2026, 6, 15, 18, 45);
export const WINDOW2_START = new Date(2026, 6, 15, 18, 45);
export const WINDOW2_END = new Date(2026, 6, 15, 20, 0);

export const TOTAL_QUESTIONS = 20;
export const TOTAL_TIME = 45 * 60;

export function getAttemptType(n) {
  return n <= 2 ? 'Preparación' : 'Evaluación';
}

export function getAttemptLabel(n) {
  return `Intento ${n} (${getAttemptType(n)})`;
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getProgressPercent(answered, total = TOTAL_QUESTIONS) {
  return (answered / total) * 100;
}

export function getAttemptCount(serverAttempts, localAttempts, loadingServer) {
  if (loadingServer) return localAttempts;
  return Math.max(serverAttempts, localAttempts);
}

export function getAvailableSlots(now, used) {
  if (now < WINDOW1_END) {
    return { total: 2, used: Math.min(used, 2), remaining: Math.max(0, 2 - used), windowLabel: 'Antes del examen (hasta 18:45)', enabled: used < 2 };
  } else if (now >= WINDOW2_START && now < WINDOW2_END) {
    const usedInWindow2 = Math.max(0, used - 2);
    return { total: 2, used: usedInWindow2, remaining: Math.max(0, 2 - usedInWindow2), windowLabel: 'Ventana de examen (18:45 - 20:00)', enabled: used < 4 };
  } else {
    return { total: 4, used, remaining: 0, windowLabel: 'Fuera de la ventana de examen', enabled: false };
  }
}

export function calculateScore(questions, answers) {
  const mcQuestions = questions.filter(q => q.type === 'mc');
  let correct = 0;
  for (const q of mcQuestions) {
    if (answers[q.id] !== undefined && answers[q.id] === q.answer) {
      correct++;
    }
  }
  return {
    score: correct,
    total: mcQuestions.length,
    openCount: questions.filter(q => q.type === 'open').length
  };
}

export function getLocalAttempts(storageKey = STORAGE_KEY) {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function buildExamData(questions, answers) {
  return questions.map(q => ({
    id: q.id,
    tema: q.tema,
    type: q.type,
    question: q.question,
    options: q.type === 'mc' ? q.options : undefined,
    correctAnswer: q.type === 'mc' ? q.answer : undefined,
    studentAnswer: answers[q.id],
    isCorrect: q.type === 'mc' ? answers[q.id] === q.answer : undefined,
    openScore: null,
    openMaxScore: q.type === 'open' ? 5 : undefined
  }));
}

export function isMcCorrect(question, answer) {
  if (question.type !== 'mc') return undefined;
  return answer === question.answer;
}
