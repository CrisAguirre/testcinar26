// Utilidades puras para revisar/calificar el Parcial 1 de Desarrollo Web 2.
// Se usan en la interfaz de admin y en las pruebas unitarias.

export const DW2_P1_SUBJECT = 'Desarrollo Web 2 - Parcial 1';
export const DW2_OPEN_MAX = 5;

export interface McStats {
  correct: number;
  total: number;
}

export interface OpenStats {
  total: number;
  graded: number;
  pending: number;
  score: number;
  max: number;
}

export interface GradeUpdate {
  examData: any;
  score: number;
  max_score: number;
  mc: McStats;
  open: OpenStats;
}

export type OpenScores = Record<string | number, number | string | null | undefined>;

export function parseExamData(raw: unknown): any | null {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw as string);
  } catch {
    return null;
  }
}

function questions(data: any): any[] {
  return Array.isArray(data?.questions) ? data.questions : [];
}

export function getMcStats(data: any): McStats {
  const mc = questions(data).filter((q) => q?.type === 'mc');
  const hasFlags = mc.some((q) => typeof q?.isCorrect === 'boolean');
  const correct = hasFlags
    ? mc.filter((q) => q.isCorrect === true).length
    : Number(data?.mcScore) || 0;
  const total = mc.length || Number(data?.mcTotal) || 0;
  return { correct, total };
}

export function getOpenQuestions(data: any): any[] {
  return questions(data).filter((q) => q?.type === 'open');
}

export function openMax(q: any): number {
  const n = Number(q?.openMaxScore);
  return Number.isFinite(n) && n > 0 ? n : DW2_OPEN_MAX;
}

export function isOpenGraded(q: any): boolean {
  return (
    q?.openScore !== null &&
    q?.openScore !== undefined &&
    Number.isFinite(Number(q.openScore))
  );
}

export function getOpenStats(data: any): OpenStats {
  const open = getOpenQuestions(data);
  const graded = open.filter(isOpenGraded);
  return {
    total: open.length,
    graded: graded.length,
    pending: open.length - graded.length,
    score: graded.reduce((sum: number, q: any) => sum + Number(q.openScore), 0),
    max: open.reduce((sum: number, q: any) => sum + openMax(q), 0)
  };
}

export function hasPendingOpen(data: any): boolean {
  return getOpenStats(data).pending > 0;
}

export function getTotals(data: any): {
  mc: McStats;
  open: OpenStats;
  score: number;
  max: number;
} {
  const mc = getMcStats(data);
  const open = getOpenStats(data);
  return { mc, open, score: mc.correct + open.score, max: mc.total + open.max };
}

export function applyOpenScores(data: any, scores: OpenScores | null | undefined): any {
  const clone = JSON.parse(JSON.stringify(data ?? {}));
  for (const q of clone.questions ?? []) {
    if (q.type !== 'open') continue;
    const raw = scores?.[q.id];
    if (raw === undefined || raw === null || raw === '') continue;
    const n = Number(raw);
    if (!Number.isFinite(n)) continue;
    q.openScore = Math.min(Math.max(n, 0), openMax(q));
  }
  return clone;
}

export function buildGradeUpdate(
  data: any,
  scores: OpenScores,
  reviewedBy: string | null = null
): GradeUpdate {
  const examData = applyOpenScores(data, scores);
  const totals = getTotals(examData);
  examData.review = {
    reviewedAt: new Date().toISOString(),
    reviewedBy,
    openScore: totals.open.score,
    openMax: totals.open.max
  };
  return {
    examData,
    score: totals.score,
    max_score: totals.max,
    mc: totals.mc,
    open: totals.open
  };
}

export function stripReviewNote(comments: string | null = ''): string {
  return String(comments ?? '').replace(/\s*\|\s*Revisado.*$/, '').trim();
}

export function buildReviewComments(
  comments: string | null,
  openScore: number,
  openMax: number
): string {
  const base = stripReviewNote(comments);
  const note = `Revisado - Abiertas: ${openScore}/${openMax}`;
  return base ? `${base} | ${note}` : note;
}

export function formatAttemptWindow(createdAt: unknown): string {
  if (!createdAt) return '—';
  const date =
    createdAt instanceof Date
      ? createdAt
      : new Date(createdAt as string | number);
  if (Number.isNaN(date.getTime())) return '—';
  return date >= new Date('2026-10-19T00:00:00-05:00') ? 'Evaluación' : 'Preparación';
}
