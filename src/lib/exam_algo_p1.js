// Parcial 1 — Algoritmos: claves y helpers propios para no mezclar intentos
// con otros parciales (DW1/DW2 usan `parcial1_*`).
// Ventana: lunes 19 y martes 20 de octubre de 2026, todo el día (hora Colombia).
// Examen: 15 teóricas (selección única, 4 o 2 opciones) + 5 prácticas DFD (.dfd).
export const STORAGE_KEY = 'algo_p1_attempts';
export const DETAIL_KEY = 'algo_p1_details';
export const TOTAL_QUESTIONS = 20; // 15 teóricas + 5 prácticas
// Legado: se conserva para convertir snapshots antiguos que guardaban tiempo
// restante. El Parcial 1 ya no tiene límite de tiempo ni autoenvío por reloj.
export const TOTAL_TIME = 120 * 60;

export const MAX_ATTEMPTS = 2; // 2 intentos: Intento 1 (Preparación) + Intento 2 (Evaluación)

/** @param {number} n */
export function getAttemptType(n) {
  if (n === 1) return 'Preparación';
  return 'Evaluación';
}

/** @param {number} n */
export function getAttemptLabel(n) {
  return `Intento ${n} (${getAttemptType(n)})`;
}

/** @param {number} seconds */
export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * @param {number} answered
 * @param {number} [total]
 */
export function getProgressPercent(answered, total = TOTAL_QUESTIONS) {
  return (answered / total) * 100;
}

/**
 * @param {number} serverAttempts
 * @param {number} localAttempts
 * @param {boolean} loadingServer
 */
export function getAttemptCount(serverAttempts, localAttempts, loadingServer) {
  if (loadingServer) return localAttempts;
  return Math.max(serverAttempts, localAttempts);
}

export const SYNC_QUEUE_KEY = 'algo_p1_sync_queue';
export const SAVED_ANSWERS_KEY = 'algo_p1_saved_answers';
export const HEALTH_CHECK_KEY = 'algo_p1_last_health_check';

export function getLocalAttempts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

/**
 * @typedef {{ score: number, maxScore: number, comments: string, examData?: string, gradeId?: string, createdAt: number }} SyncEntry
 */

/** @returns {SyncEntry[]} */
export function getSyncQueue() {
  try {
    const data = localStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

/** @param {Omit<SyncEntry, 'createdAt'>} entry */
export function addToSyncQueue(entry) {
  const queue = getSyncQueue();
  queue.push({ ...entry, createdAt: Date.now() });
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

/** @param {number} createdAt */
export function removeFromSyncQueue(createdAt) {
  const queue = getSyncQueue().filter(e => e.createdAt !== createdAt);
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export function setHealthCheckOk() {
  try { localStorage.setItem(HEALTH_CHECK_KEY, Date.now().toString()); } catch {}
}

export function isHealthCheckRecent() {
  try {
    const last = localStorage.getItem(HEALTH_CHECK_KEY);
    if (!last) return false;
    return Date.now() - Number(last) < 60000;
  } catch { return false; }
}

/**
 * @param {any[]} questions
 * @param {any} answers
 * @param {number} timeLeft
 * @param {number} currentIndex
 * @param {number} tabSwitchCount
 * @param {Record<string, string>} [uploadedFileNames]
 * @param {{ gradeId?: string, attemptNumber?: number }} [extra]
 */
export function saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount, uploadedFileNames, extra = {}) {
  try {
    const snapshot = {
      questions,
      answers,
      timeLeft,
      currentIndex,
      tabSwitchCount,
      uploadedFileNames: uploadedFileNames || {},
      ...extra,
      savedAt: Date.now()
    };
    localStorage.setItem(SAVED_ANSWERS_KEY, JSON.stringify(snapshot));
  } catch {}
}

export function clearSavedAnswers() {
  try { localStorage.removeItem(SAVED_ANSWERS_KEY); } catch {}
}

/**
 * @param {any[]} questions
 * @param {any} answers
 * @returns {number}
 */
export function calculateScore(questions, answers) {
  let score = 0;
  for (const q of questions) {
    if (q.type === 'file') continue; // El archivo se revisa manualmente
    if (answers[q.id] === q.answer) score++;
  }
  return score;
}

/**
 * @param {number} attemptNum
 * @param {number} tabSwitches
 * @param {number} timeUsed
 * @param {any[]} questions
 * @param {any} answers
 * @param {Record<string, string>} [uploadedFileNames]
 */
export function buildExamData(attemptNum, tabSwitches, timeUsed, questions, answers, uploadedFileNames) {
  return {
    attemptNumber: attemptNum,
    tabSwitches,
    timeUsed,
    mcScore: calculateScore(questions, answers),
    mcTotal: questions.filter(q => q.type !== 'file').length,
    uploadedFileNames: uploadedFileNames || {},
    questions: questions.map(q => ({
      id: q.id, tema: q.tema, type: q.type, question: q.question,
      options: q.options || [],
      correctAnswer: q.type !== 'file' ? q.answer : null,
      studentAnswer: q.type === 'file' ? (uploadedFileNames && uploadedFileNames[q.id] ? uploadedFileNames[q.id] : 'No subido') : answers[q.id],
      isCorrect: q.type === 'file' ? null : answers[q.id] === q.answer
    }))
  };
}
