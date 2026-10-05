export const STORAGE_KEY = 'algo_taller1_attempts';
export const DETAIL_KEY = 'algo_taller1_details';
export const TOTAL_QUESTIONS = 6; // 5 selección múltiple + 1 ejercicio práctico DFD
export const TOTAL_TIME = 90 * 60; // 90 minutos

export function getAttemptType(n) {
  return n === 1 ? 'Preparación' : 'Evaluación';
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

export const SYNC_QUEUE_KEY = 'algo_taller1_sync_queue';
export const SAVED_ANSWERS_KEY = 'algo_taller1_saved_answers';
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

export function saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount, uploadedFile) {
  try {
    const snapshot = { questions, answers, timeLeft, currentIndex, tabSwitchCount, uploadedFile: uploadedFile || null, savedAt: Date.now() };
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

export function buildExamData(attemptNum, tabSwitches, timeUsed, questions, answers, uploadedFileName) {
  return {
    attemptNumber: attemptNum,
    tabSwitches,
    timeUsed,
    mcScore: calculateScore(questions, answers),
    mcTotal: questions.filter(q => q.type !== 'file').length,
    uploadedFile: uploadedFileName || null,
    questions: questions.map(q => ({
      id: q.id, tema: q.tema, type: q.type, question: q.question,
      options: q.options || [],
      correctAnswer: q.type !== 'file' ? q.answer : null,
      studentAnswer: q.type === 'file' ? (uploadedFileName || 'No subido') : answers[q.id],
      isCorrect: q.type === 'file' ? null : answers[q.id] === q.answer
    }))
  };
}
