export const STORAGE_KEY = 'parcial1_attempts';
export const DETAIL_KEY = 'parcial1_details';

export const EXAM_DATE = new Date(2027, 0, 1);
export const WINDOW1_END = new Date(2027, 0, 1, 0, 0);
export const WINDOW2_START = new Date(2027, 0, 1, 0, 0);
export const WINDOW2_END = new Date(2027, 0, 1, 0, 0);

export const TOTAL_QUESTIONS = 20;
export const TOTAL_TIME = 45 * 60;

// Parcial 1 DW2: evaluación habilitada desde el lunes 19/10 hasta el miércoles 21/10 a medianoche (hora Colombia).
// Preparación (histórica) hasta el 13/10 23:59 + Evaluación (2 intentos) disponible 19–21/10.
// 10 MC (2 min c/u) + 10 abiertas (5 min c/u) = 70 min de examen.
export const DW2P1_PREP_OPEN = new Date('2026-10-08T00:00:00-05:00');
export const DW2P1_PREP_CLOSE = new Date('2026-10-13T23:59:59-05:00');
export const DW2P1_OPEN = new Date('2026-10-19T00:00:00-05:00');
export const DW2P1_CLOSE = new Date('2026-10-21T23:59:59-05:00');

export const TIME_PER_MC = 2 * 60;
export const TIME_PER_OPEN = 5 * 60;

export function calculateTotalTime(questions) {
  const mcCount = questions.filter(q => q.type === 'mc').length;
  const openCount = questions.filter(q => q.type === 'open').length;
  return mcCount * TIME_PER_MC + openCount * TIME_PER_OPEN;
}

export function getAttemptType(n) {
  return n <= 2 ? 'Preparación' : 'Evaluación';
}

export function getAttemptLabel(n) {
  return `Intento ${n} (${getAttemptType(n)})`;
}

export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '—';
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

export const SYNC_QUEUE_KEY = 'parcial1_sync_queue';

// Claves propias de DW2 P1. DW1 P1 y DW2 P1 comparten este módulo; antes
// ambos usaban `parcial1_*` y podían reanudar el borrador del otro o enviar
// su cola con la materia equivocada.
export const DW2P1_SUBJECT = 'Desarrollo Web 2 - Parcial 1';
export const DW2P1_STORAGE_KEY = 'dw2_p1_attempts';
export const DW2P1_DETAIL_KEY = 'dw2_p1_details';
export const DW2P1_SYNC_QUEUE_KEY = 'dw2_p1_sync_queue';
export const DW2P1_SAVED_ANSWERS_KEY = 'dw2_p1_saved_answers';
export const DW2P1_HEALTH_CHECK_KEY = 'dw2_p1_last_health_check';

/** @param {string} key @returns {any[]} */
function readQueue(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

/** @param {any} entry @returns {boolean} */
function isDw2QueueEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if (entry.subject) return entry.subject === DW2P1_SUBJECT;
  try {
    const data = typeof entry.examData === 'string' ? JSON.parse(entry.examData) : entry.examData;
    const questions = Array.isArray(data?.questions) ? data.questions : [];
    // DW2 usa temas string (`Arquitectura`, `Svelte`) y `area`; DW1 usa
    // temas numéricos. Así recuperamos las entradas viejas sin sujeto.
    for (const q of questions) {
      if (typeof q?.tema === 'string' || q?.area) return true;
    }
    return false;
  } catch { return false; }
}

// Mueve a la cola de DW2 las entradas antiguas que quedaron en la cola
// compartida. Es idempotente y conserva las entradas de DW1.
export function migrateDw2Queue() {
  try {
    const shared = readQueue(SYNC_QUEUE_KEY);
    if (shared.length === 0) return;
    const dw2 = shared.filter(isDw2QueueEntry);
    if (dw2.length === 0) return;
    const rest = shared.filter((/** @type {any} */ entry) => !isDw2QueueEntry(entry));
    const own = readQueue(DW2P1_SYNC_QUEUE_KEY);
    const seen = new Set(own.map((/** @type {any} */ entry) => entry.createdAt));
    const merged = [...own, ...dw2.filter((/** @type {any} */ entry) => !seen.has(entry.createdAt))];
    localStorage.setItem(DW2P1_SYNC_QUEUE_KEY, JSON.stringify(merged));
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(rest));
  } catch {}
}

/** @param {string} [key] @returns {any[]} */
export function getSyncQueue(key = SYNC_QUEUE_KEY) {
  // Cualquier lectura de la cola compartida (DW1) separa primero lo de DW2.
  migrateDw2Queue();
  return readQueue(key);
}

/** @param {any} entry @param {string} [key] */
export function addToSyncQueue(entry, key = SYNC_QUEUE_KEY) {
  const queue = getSyncQueue(key);
  queue.push({ ...entry, createdAt: Date.now() });
  localStorage.setItem(key, JSON.stringify(queue));
}

/** @param {number} createdAt @param {string} [key] */
export function removeFromSyncQueue(createdAt, key = SYNC_QUEUE_KEY) {
  const queue = getSyncQueue(key).filter((/** @type {any} */ e) => e.createdAt !== createdAt);
  localStorage.setItem(key, JSON.stringify(queue));
}

/** @param {string} [key] */
export function clearSyncQueue(key = SYNC_QUEUE_KEY) {
  localStorage.removeItem(key);
}

export const CHECK_BEFORE_START_KEY = 'parcial1_last_health_check';
/** @param {string} [key] */
export function setHealthCheckOk(key = CHECK_BEFORE_START_KEY) {
  try { localStorage.setItem(key, Date.now().toString()); } catch {}
}
/** @param {string} [key] @returns {boolean} */
export function isHealthCheckRecent(key = CHECK_BEFORE_START_KEY) {
  try {
    const last = localStorage.getItem(key);
    if (!last) return false;
    return Date.now() - Number(last) < 60000;
  } catch { return false; }
}

export const SAVED_ANSWERS_KEY = 'parcial1_saved_answers';
/**
 * @param {any} questions
 * @param {any} answers
 * @param {any} timeLeft
 * @param {any} currentIndex
 * @param {any} tabSwitchCount
 * @param {string} [key]
 */
export function saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount, key = SAVED_ANSWERS_KEY) {
  try {
    const snapshot = {
      questions,
      answers,
      timeLeft,
      currentIndex,
      tabSwitchCount,
      savedAt: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(snapshot));
  } catch {}
}
/** @param {string} [key] */
export function clearSavedAnswers(key = SAVED_ANSWERS_KEY) {
  try { localStorage.removeItem(key); } catch {}
}

// Recupera el borrador DW2 que haya quedado en la clave compartida.
export function migrateDw2SavedAnswers() {
  try {
    const raw = localStorage.getItem(SAVED_ANSWERS_KEY);
    if (!raw) return;
    const snapshot = JSON.parse(raw);
    const questions = Array.isArray(snapshot?.questions) ? snapshot.questions : [];
    let isDw2 = false;
    for (const q of questions) {
      if (typeof q?.tema === 'string' || q?.area) { isDw2 = true; break; }
    }
    if (!isDw2) return;
    let existing = null;
    try {
      const existingRaw = localStorage.getItem(DW2P1_SAVED_ANSWERS_KEY);
      existing = existingRaw ? JSON.parse(existingRaw) : null;
    } catch {}
    if (!existing || (Number(snapshot?.savedAt) || 0) > (Number(existing?.savedAt) || 0)) {
      localStorage.setItem(DW2P1_SAVED_ANSWERS_KEY, raw);
    }
    localStorage.removeItem(SAVED_ANSWERS_KEY);
  } catch {}
}

/** @param {string} [key] @returns {any | null} */
export function getSavedAnswers(key = SAVED_ANSWERS_KEY) {
  // Al leer la clave compartida, primero se aparta cualquier borrador DW2.
  if (key === SAVED_ANSWERS_KEY) migrateDw2SavedAnswers();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
