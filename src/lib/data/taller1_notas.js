/**
 * Notas manuales del Taller 1 de Algoritmos (06/10/2026).
 * Fuente: "notas taller 1.xlsx" (Hoja1, actualizado 19/10/2026) —
 * P1-P5 de selección múltiple + ejercicios DFD 6 (monedas) y 7 (zapatería).
 * Cada DFD se califica sobre 5. null = todavía en revisión.
 */

export const TALLER1_META = {
  title: 'Taller 1 — Algoritmos (Niveles 1 y 2)',
  date: '06/10/2026',
  mcMax: 5,
  dfdMax: 5,
  dfdQuestions: [
    { id: 6, label: 'Ej. 6 · Monedas (Nivel 1)' },
    { id: 7, label: 'Ej. 7 · Zapatería (Nivel 2)' }
  ]
};

// mc: aciertos en P1-P5. dfd6/dfd7: null = en revisión, número = nota sobre 5.
export const TALLER1_MCQ = [
  { short: 'Veronica', full: 'Claudia Verónica Angulo', mc: 5, dfd6: null, dfd7: 3 },
  { short: 'Lisseth', full: 'Andrea Lisseth Quiscualtud', mc: 5, dfd6: 5, dfd7: 1 },
  { short: 'Ivan', full: 'Iván Felipe Guancha Galindres', mc: 5, dfd6: null, dfd7: null },
  { short: 'Brayan', full: 'Brayan Buesaquillo', mc: 5, dfd6: null, dfd7: null },
  { short: 'Jhohan', full: 'Johan Sebastian Rodríguez Rosero', mc: 4, dfd6: 5, dfd7: null },
  { short: 'David Moncayo', full: 'David Santiago Erazo Moncayo', mc: 4, dfd6: null, dfd7: null },
  { short: 'Juan Carlos', full: 'Juan Carlos Bastidas Montilla', mc: 4, dfd6: 3, dfd7: null },
  { short: 'Jairo', full: 'Jairo Granja Bravo', mc: 4, dfd6: 4, dfd7: 2 },
  { short: 'David Narvaez', full: 'David Felipe Narváez', mc: 3, dfd6: null, dfd7: null },
  { short: 'Oscar Rodriguez', full: 'Oscar Alexander Rodríguez Insuasti', mc: 5, dfd6: 5, dfd7: 5 },
  { short: 'Julián Reina', full: 'Julián David Reina Cabrera', mc: 4, dfd6: null, dfd7: null }
];

export function getTaller1Rows() {
  return TALLER1_MCQ.map((r) => ({
    ...r,
    displayName: r.full || r.short,
    mcPct: parseFloat(((r.mc / TALLER1_META.mcMax) * 100).toFixed(1))
  }));
}

export function getTaller1Avg() {
  if (TALLER1_MCQ.length === 0) return 0;
  return parseFloat(
    (TALLER1_MCQ.reduce((s, r) => s + r.mc, 0) / TALLER1_MCQ.length).toFixed(2)
  );
}

export function getTaller1DfdStats() {
  const total = TALLER1_MCQ.length * TALLER1_META.dfdQuestions.length;
  const graded = TALLER1_MCQ.reduce(
    (n, r) => n + (r.dfd6 !== null ? 1 : 0) + (r.dfd7 !== null ? 1 : 0),
    0
  );
  return { graded, pending: total - graded, total };
}
