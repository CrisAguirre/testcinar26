const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

export const TALLER_STORAGE_KEY = 'taller_algoritmia_attempts';
export const TALLER_DETAIL_KEY = 'taller_algoritmia_details';

export const TALLER_WINDOW1_END = new Date(y, m, d, 18, 0);
export const TALLER_WINDOW2_START = new Date(y, m, d, 18, 45);
export const TALLER_WINDOW2_END = new Date(y, m, d, 20, 0);

export const TALLER_TOTAL_QUESTIONS = 10;
export const TALLER_TOTAL_TIME = 30 * 60; // 30 minutos

export function getTallerAttemptType(n) {
  return n === 1 ? 'Preparación' : 'Evaluación';
}

export function getTallerAttemptLabel(n) {
  return `Intento ${n} (${getTallerAttemptType(n)})`;
}

export function formatTallerTime(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getTallerProgressPercent(answered, total = TALLER_TOTAL_QUESTIONS) {
  return (answered / total) * 100;
}

export function getTallerAttemptCount(serverAttempts, localAttempts, loadingServer) {
  if (loadingServer) return localAttempts;
  return Math.max(serverAttempts, localAttempts);
}

export function getTallerAvailableSlots(now, used) {
  if (now < TALLER_WINDOW1_END) {
    return { 
      total: 1, 
      used: Math.min(used, 1), 
      remaining: Math.max(0, 1 - used), 
      windowLabel: 'Preparación (hasta 18:00)', 
      enabled: used < 1 
    };
  } else if (now >= TALLER_WINDOW2_START && now < TALLER_WINDOW2_END) {
    const usedInWindow2 = Math.max(0, used - 1);
    return { 
      total: 1, 
      used: usedInWindow2, 
      remaining: Math.max(0, 1 - usedInWindow2), 
      windowLabel: 'Evaluación (18:45 - 20:00)', 
      enabled: used < 2 
    };
  } else {
    return { 
      total: 2, 
      used, 
      remaining: 0, 
      windowLabel: 'Fuera de horario de taller', 
      enabled: false 
    };
  }
}

export function getTallerLocalAttempts(storageKey = TALLER_STORAGE_KEY) {
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export const TALLER_SYNC_QUEUE_KEY = 'taller_algoritmia_sync_queue';

export function getTallerSyncQueue() {
  try {
    const data = localStorage.getItem(TALLER_SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addTallerToSyncQueue(entry) {
  const queue = getTallerSyncQueue();
  queue.push({ ...entry, createdAt: Date.now() });
  localStorage.setItem(TALLER_SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export function removeTallerFromSyncQueue(createdAt) {
  const queue = getTallerSyncQueue().filter(e => e.createdAt !== createdAt);
  localStorage.setItem(TALLER_SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export const TALLER_CHECK_BEFORE_START_KEY = 'taller_algoritmia_last_health_check';
export function setTallerHealthCheckOk() {
  try { localStorage.setItem(TALLER_CHECK_BEFORE_START_KEY, Date.now().toString()); } catch {}
}
export function isTallerHealthCheckRecent() {
  try {
    const last = localStorage.getItem(TALLER_CHECK_BEFORE_START_KEY);
    if (!last) return false;
    return Date.now() - Number(last) < 60000;
  } catch { return false; }
}

export const TALLER_SAVED_ANSWERS_KEY = 'taller_algoritmia_saved_answers';
export function saveTallerAnswersSnapshot(questions, answers, timeLeft, currentIndex, tabSwitchCount) {
  try {
    const snapshot = {
      questions,
      answers,
      timeLeft,
      currentIndex,
      tabSwitchCount,
      savedAt: Date.now()
    };
    localStorage.setItem(TALLER_SAVED_ANSWERS_KEY, JSON.stringify(snapshot));
  } catch {}
}
export function clearTallerSavedAnswers() {
  try { localStorage.removeItem(TALLER_SAVED_ANSWERS_KEY); } catch {}
}
