// Reinicio 07/10: claves v2 para dar 2 intentos frescos a todos (Julian hoy, Jairo retoma).
// Se ignoran las colas locales del 06/10 que quedaron por el 403 (el docente ya tiene esas notas manuales).
export const STORAGE_KEY = 'algo_taller1_attempts_v2';
export const DETAIL_KEY = 'algo_taller1_details_v2';
export const TOTAL_QUESTIONS = 7; // 5 selección múltiple + 2 ejercicios prácticos DFD
export const TOTAL_TIME = 90 * 60; // 90 minutos

export const MAX_ATTEMPTS = 2; // Reinicio: 2 intentos frescos hasta 07/10 23:59

export function getAttemptType(n) {
  if (n === 1) return 'Preparación';
  return 'Evaluación';
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

export function getProgressPercent(answered) {
  return (answered / TOTAL_QUESTIONS) * 100;
}

export function getAttemptCount(serverAttempts, localAttempts, loadingServer) {
  if (loadingServer) return localAttempts;
  return Math.max(serverAttempts, localAttempts);
}

export const SYNC_QUEUE_KEY = 'algo_taller1_sync_queue_v2';
export const SAVED_ANSWERS_KEY = 'algo_taller1_saved_answers_v2';
export const HEALTH_CHECK_KEY = 'algo_taller1_last_health_check';

export function getLocalAttempts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function getSyncQueue() {
  try {
    const data = localStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addToSyncQueue(entry) {
  const queue = getSyncQueue();
  queue.push({ ...entry, createdAt: Date.now() });
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

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

export function saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount, uploadedFileNames) {
  try {
    const snapshot = { questions, answers, timeLeft, currentIndex, tabSwitchCount, uploadedFileNames: uploadedFileNames || {}, savedAt: Date.now() };
    localStorage.setItem(SAVED_ANSWERS_KEY, JSON.stringify(snapshot));
  } catch {}
}

export function clearSavedAnswers() {
  try { localStorage.removeItem(SAVED_ANSWERS_KEY); } catch {}
}

export function calculateScore(questions, answers) {
  let score = 0;
  for (const q of questions) {
    if (q.type === 'file') continue; // El archivo se califica manualmente
    if (answers[q.id] === q.answer) score++;
  }
  return score;
}

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
