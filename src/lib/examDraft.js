/**
 * Utilidades del borrador de examen en servidor.
 * Se mantienen puras (sin runes ni fetch) para poder testearlas con Vitest.
 */

/** @param {any[]} a @param {any[]} b */
export function sameQuestionSet(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const idsA = a.map((q) => String(q?.id)).sort();
  const idsB = b.map((q) => String(q?.id)).sort();
  return idsA.every((id, i) => id === idsB[i]);
}

/**
 * Fusiona el borrador del servidor con el snapshot local del mismo intento.
 * Nunca pierde respuestas: si una respuesta solo existe en local, se conserva.
 * La pregunta actual y el tiempo restante se toman del estado más reciente.
 *
 * @param {any} serverDraft
 * @param {any} localSnapshot
 */
export function mergeDraftWithLocal(serverDraft, localSnapshot) {
  if (!serverDraft) return localSnapshot || null;
  if (!localSnapshot) return serverDraft;
  if (!sameQuestionSet(serverDraft.questions, localSnapshot.questions)) return serverDraft;

  const serverTime = new Date(serverDraft.updatedAt || 0).getTime() || 0;
  const localTime = Number(localSnapshot.savedAt || 0) || 0;
  const useLocalPosition = localTime > serverTime;

  const answers = { ...(serverDraft.answers || {}) };
  for (const [key, value] of Object.entries(localSnapshot.answers || {})) {
    if (answers[key] === undefined || answers[key] === '') answers[key] = value;
  }

  const serverIndex = Number.isInteger(serverDraft.currentIndex) ? serverDraft.currentIndex : 0;
  const localIndex = Number.isInteger(localSnapshot.currentIndex) ? localSnapshot.currentIndex : serverIndex;

  const serverTimeLeft = Number.isFinite(serverDraft.timeLeft) ? serverDraft.timeLeft : null;
  const localTimeLeft = Number.isFinite(localSnapshot.timeLeft) ? localSnapshot.timeLeft : serverTimeLeft;

  return {
    ...serverDraft,
    answers,
    currentIndex: useLocalPosition ? localIndex : serverIndex,
    timeLeft: useLocalPosition && localTimeLeft !== null ? localTimeLeft : serverTimeLeft,
    tabSwitchCount: Math.max(serverDraft.tabSwitchCount || 0, localSnapshot.tabSwitchCount || 0),
    uploadedFileNames: {
      ...(serverDraft.uploadedFileNames || {}),
      ...(localSnapshot.uploadedFileNames || {})
    },
    mergedFromLocal: useLocalPosition
  };
}

/**
 * Indica si un borrador tiene contenido suficiente para ofrecer "Continuar".
 * @param {any} draft
 */
export function isResumableDraft(draft) {
  return !!draft
    && Array.isArray(draft.questions)
    && draft.questions.length > 0
    && draft.status !== 'submitted';
}
