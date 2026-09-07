export const STORAGE_KEY = 'algo_taller_attempts';
export const DETAIL_KEY = 'algo_taller_details';
export const TOTAL_QUESTIONS = 8;
export const TOTAL_TIME = 30 * 60;

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

export const SYNC_QUEUE_KEY = 'algo_taller_sync_queue';
export const SAVED_ANSWERS_KEY = 'algo_taller_saved_answers';
export const HEALTH_CHECK_KEY = 'algo_taller_last_health_check';

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

export function saveAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount) {
  try {
    const snapshot = { questions, answers, timeLeft, currentIndex, tabSwitchCount, savedAt: Date.now() };
    localStorage.setItem(SAVED_ANSWERS_KEY, JSON.stringify(snapshot));
  } catch {}
}

export function clearSavedAnswers() {
  try { localStorage.removeItem(SAVED_ANSWERS_KEY); } catch {}
}

export function calculateScore(questions, answers) {
  let score = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctAnswer) score++;
  }
  return score;
}

export function buildExamData(attemptNum, tabSwitches, timeUsed, questions, answers) {
  return {
    attemptNumber: attemptNum,
    tabSwitches,
    timeUsed,
    mcScore: calculateScore(questions, answers),
    mcTotal: TOTAL_QUESTIONS,
    questions: questions.map(q => ({
      id: q.id, tema: 'Taller', type: q.type, question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      studentAnswer: answers[q.id],
      isCorrect: answers[q.id] === q.correctAnswer
    }))
  };
}
