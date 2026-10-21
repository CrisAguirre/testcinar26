#!/usr/bin/env node
/**
 * Calificación del Parcial 1 de Algoritmos (DFD 16-20).
 *
 * Modos:
 *   node scripts/grade-algo-p1.mjs report
 *   node scripts/grade-algo-p1.mjs apply --decisions ../algos/parcial1-review/decisions.json
 *   node scripts/grade-algo-p1.mjs reopen [--grade <id> | --student <email> | --all-incomplete] [--seconds <n>] [--apply]
 *
 * Requiere credenciales de admin/docente de producción:
 *   CINAR_API_URL   (default https://testcinar26bknd.onrender.com/api)
 *   CINAR_ADMIN_USER (default admin)
 *   CINAR_ADMIN_PASS
 * o un token Bearer ya emitido en CINAR_TOKEN.
 *
 * El modo `report` NO modifica nada: descarga los .dfd, los analiza y genera
 * un informe + plantilla de decisiones. `apply` registra la nota definitiva.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDfd } from '../src/lib/dfd/parser.js';
import { generatePseudocode } from '../src/lib/dfd/pseudocode.js';
import { DfdExecutor } from '../src/lib/dfd/executor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_URL = (process.env.CINAR_API_URL || 'https://testcinar26bknd.onrender.com/api').replace(/\/+$/, '');
const SUBJECT = 'Algoritmos - Parcial 1';
const PERIOD = process.env.CINAR_PERIOD || '2026-3';
const TOTAL_TIME = 120 * 60;
const OUT_DIR = path.resolve(process.env.CINAR_OUT_DIR || path.join(__dirname, '..', '..', 'algos', 'parcial1-review'));

const args = process.argv.slice(2);
const MODE = args[0] || 'report';
function argValue(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}
const HAS_FLAG = (name) => args.includes(name);

// ============================================================
// API
// ============================================================
let token = process.env.CINAR_TOKEN || null;

async function request(method, endpoint, body = null, { raw = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== null) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body === null ? undefined : JSON.stringify(body)
  });

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 500); } catch {}
    throw new Error(`${method} ${endpoint} → HTTP ${res.status}: ${detail}`);
  }
  if (raw) return Buffer.from(await res.arrayBuffer());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function login() {
  if (token) return;
  const username = process.env.CINAR_ADMIN_USER || 'admin';
  const password = process.env.CINAR_ADMIN_PASS;
  if (!password) {
    throw new Error('Falta CINAR_ADMIN_PASS (o CINAR_TOKEN). No se puede consultar producción.');
  }
  const res = await request('POST', '/auth/login', { username, password });
  if (!res?.token) throw new Error('Login sin token');
  token = res.token;
}

// ============================================================
// Utilidades de texto / ejecución
// ============================================================
function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function extractNumbers(text) {
  return (String(text).match(/-?\d+(?:[.,]\d+)?/g) || []).map((n) => Number(n.replace(',', '.')));
}

function hasNumber(text, expected, tolerance = 0.02) {
  return extractNumbers(text).some((n) => Math.abs(n - expected) <= tolerance);
}

function containsSequence(list, sequence) {
  for (let i = 0; i <= list.length - sequence.length; i++) {
    if (sequence.every((v, j) => list[i + j] === v)) return true;
  }
  return false;
}

function sanitizeFile(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 90);
}

async function runDfd(ast, inputs) {
  const outputs = [];
  const queue = [...inputs];
  const executor = new DfdExecutor(
    ast,
    async () => (queue.length ? String(queue.shift()) : '0'),
    async (out) => { if (outputs.length < 2000) outputs.push(String(out)); },
    null,
    0
  );

  const timer = setTimeout(() => executor.stop(), 2500);
  try {
    await executor.execute();
  } finally {
    clearTimeout(timer);
  }
  return {
    outputs: outputs.filter((o) => !o.includes('Ejecución Finalizada')),
    variables: executor.variables
  };
}

// ============================================================
// Casos de prueba por pregunta práctica (ids 101-120)
// ============================================================
const CASES = {
  101: [
    { inputs: [8, 2], numbers: [10, 6, 16, 4] },
    { inputs: [5, 2], numbers: [7, 3, 10, 2.5] }
  ],
  102: [
    { inputs: [3], numbers: [28.2744, 18.8496] }
  ],
  103: [
    { inputs: [0], numbers: [32] },
    { inputs: [100], numbers: [212] }
  ],
  104: [
    { inputs: [40, 5000], numbers: [200000], keywords: ['salario'] }
  ],
  105: [
    { inputs: [4, 3, 5], numbers: [4], keywords: ['promedio'] },
    { inputs: [3, 3, 3], numbers: [3], keywords: ['promedio'] }
  ],
  106: [
    { inputs: [100000], numbers: [85000] }
  ],
  107: [
    { inputs: [2500, 4], numbers: [10000] }
  ],
  108: [
    { inputs: [5], keywords: ['positivo'] },
    { inputs: [-3], keywords: ['negativo'] },
    { inputs: [0], keywords: ['cero'] }
  ],
  109: [
    { inputs: [7, 3], numbers: [7], keywords: ['mayor'] },
    { inputs: [3, 7], numbers: [7], keywords: ['mayor'] },
    { inputs: [4, 4], keywords: ['igual'] }
  ],
  110: [
    { inputs: [18], keywords: ['mayor de edad'], absent: ['menor de edad'] },
    { inputs: [17], keywords: ['menor de edad'], absent: ['mayor de edad'] }
  ],
  111: [
    { inputs: [4, 4, 4], keywords: ['aprueba'], absent: ['reprueba'] },
    { inputs: [2, 2, 2], keywords: ['reprueba'], absent: ['aprueba'] }
  ],
  112: [
    { inputs: [150000], numbers: [135000] },
    { inputs: [80000], numbers: [80000] }
  ],
  113: [
    { inputs: [4], keywords: ['par'], absent: ['impar'] },
    { inputs: [7], keywords: ['impar'] }
  ],
  114: [
    { inputs: [2, 3], keywords: ['ambos son positivos'], absent: ['al menos'] },
    { inputs: [2, -3], keywords: ['al menos uno no'], absent: ['ambos son positivos'] }
  ],
  115: [
    { inputs: [], sequence: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
  ],
  116: [
    { inputs: [5], numbers: [15] },
    { inputs: [10], numbers: [55] }
  ],
  117: [
    { inputs: [3], numbers: [3, 30], keywords: ['3 x 1', '3 x 10'] }
  ],
  118: [
    { inputs: [5, 0], numbers: [5, 1] },
    { inputs: [2, 3, 0], numbers: [5, 2] }
  ],
  119: [
    { inputs: [6], sequence: [0, 1, 1, 2, 3, 5] }
  ],
  120: [
    { inputs: [5], numbers: [120] },
    { inputs: [0], numbers: [1] }
  ]
};

function evaluateCase(testCase, outputs) {
  const text = outputs.join(' ');
  const norm = normalize(text);
  const nums = extractNumbers(text);
  const failures = [];

  if (testCase.keywords) {
    for (const keyword of testCase.keywords) {
      if (!norm.includes(normalize(keyword))) failures.push(`falta «${keyword}»`);
    }
  }
  if (testCase.absent) {
    for (const keyword of testCase.absent) {
      if (norm.includes(normalize(keyword))) failures.push(`no debía decir «${keyword}»`);
    }
  }
  if (testCase.numbers) {
    for (const expected of testCase.numbers) {
      if (!nums.some((n) => Math.abs(n - expected) <= 0.02)) failures.push(`falta ${expected}`);
    }
  }
  if (testCase.sequence) {
    if (!containsSequence(nums, testCase.sequence)) {
      failures.push(`secuencia esperada ${testCase.sequence.join(', ')}`);
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    output: outputs.join(' | ').slice(0, 500),
    numbers: nums.slice(0, 40)
  };
}

async function analyzeDfd(questionId, text) {
  const ast = parseDfd(text);
  if (!ast || ast.error || !Array.isArray(ast.nodes) || ast.nodes.length === 0) {
    return {
      questionId,
      parseOk: false,
      error: ast?.error || 'Sin nodos',
      nodes: ast?.nodes?.length || 0,
      pseudocode: '',
      cases: [],
      suggested: 0,
      notes: 'No se pudo interpretar el .dfd'
    };
  }

  let pseudocode = '';
  try {
    pseudocode = generatePseudocode(ast, `q${questionId}.dfd`);
  } catch (err) {
    pseudocode = `[Error generando pseudocódigo: ${err.message}]`;
  }

  const cases = [];
  for (const testCase of CASES[questionId] || []) {
    let result;
    try {
      const run = await runDfd(ast, testCase.inputs);
      result = evaluateCase(testCase, run.outputs);
    } catch (err) {
      result = { ok: false, failures: [`error de ejecución: ${err.message}`], output: '', numbers: [] };
    }
    cases.push({ inputs: testCase.inputs, ...result });
  }

  const allOk = cases.length > 0 && cases.every((c) => c.ok);
  return {
    questionId,
    parseOk: true,
    nodes: ast.nodes.length,
    pseudocode,
    cases,
    suggested: allOk ? 1 : 0,
    notes: allOk
      ? 'Todos los casos de prueba pasaron'
      : cases.map((c) => `[${c.inputs.join(',')}] ${c.failures.join('; ')}`).join(' | ')
  };
}

// ============================================================
// Datos remotos
// ============================================================
function parseExamData(raw) {
  if (!raw) return null;
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch { return null; }
}

function studentName(grade) {
  const s = grade.student;
  if (!s) return '(sin estudiante)';
  return s.full_name || s.username || s.email || String(s._id || s);
}

function studentKey(grade) {
  return String(grade.student?._id || grade.student || 'unknown');
}

async function fetchGrades() {
  const qs = new URLSearchParams({ subject: SUBJECT, period: PERIOD });
  return await request('GET', `/grades?${qs}`);
}

async function fetchSubmissions() {
  const qs = new URLSearchParams({ examType: 'parcial-1', period: PERIOD });
  return await request('GET', `/dfd/submissions?${qs}`);
}

function latestGradePerStudent(grades) {
  const byStudent = new Map();
  for (const grade of grades) {
    if (grade.subject !== SUBJECT) continue;
    const key = studentKey(grade);
    const previous = byStudent.get(key);
    const currentDate = new Date(grade.created_at || grade.createdAt || 0).getTime();
    const previousDate = previous ? new Date(previous.created_at || previous.createdAt || 0).getTime() : -1;
    if (!previous || currentDate >= previousDate) byStudent.set(key, grade);
  }
  return [...byStudent.values()];
}

function normalizeFileName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function fileNameVariants(value) {
  const raw = String(value || '');
  const variants = new Set([raw]);
  // multer puede interpretar el nombre como latin1 y guardar "nÃºmero" en
  // lugar de "número"; se compara también la variante reinterpretada.
  try {
    variants.add(Buffer.from(raw, 'latin1').toString('utf8'));
  } catch {
    // Si no se puede reinterpretar, queda el nombre original.
  }
  return [...variants].map(normalizeFileName).filter(Boolean);
}

function sameFileName(a, b) {
  const av = fileNameVariants(a);
  const bv = fileNameVariants(b);
  return av.some((name) => bv.includes(name));
}

function mapSubmissions(submissions, grade, examData) {
  const uploaded = examData?.uploadedFileNames && typeof examData.uploadedFileNames === 'object'
    ? examData.uploadedFileNames
    : {};
  const fileQuestions = (examData?.questions || []).filter((q) => q.type === 'file');
  const gradeStudent = studentKey(grade);
  const result = new Map();

  const byStudent = submissions.filter(
    (s) => String(s.student?._id || s.student) === gradeStudent
  );

  for (const q of fileQuestions) {
    const filename = uploaded[String(q.id)] || uploaded[q.id];

    // 1) questionId es la fuente autoritativa para las entregas nuevas.
    const byQuestion = byStudent.filter(
      (s) => s.questionId !== undefined && s.questionId !== null && Number(s.questionId) === Number(q.id)
    );
    if (byQuestion.length > 0) {
      byQuestion.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      result.set(q.id, byQuestion[0]);
      continue;
    }

    // 2) Entregas antiguas sin questionId: cruce por nombre de archivo.
    if (!filename) continue;
    const candidates = byStudent.filter(
      (s) => (s.questionId === undefined || s.questionId === null) && sameFileName(s.originalFileName, filename)
    );
    candidates.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (candidates[0]) result.set(q.id, candidates[0]);
  }
  return result;
}

// ============================================================
// REPORT
// ============================================================
async function report() {
  await login();
  console.log(`Consultando ${API_URL} ...`);
  const [grades, submissions] = await Promise.all([fetchGrades(), fetchSubmissions()]);
  const latest = latestGradePerStudent(grades);

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.join(OUT_DIR, 'files'), { recursive: true });

  const decisions = [];
  const analysis = [];
  const lines = [];
  lines.push('# Parcial 1 — Algoritmos: revisión de DFD (16–20)');
  lines.push('');
  lines.push(`- API: ${API_URL}`);
  lines.push(`- Periodo: ${PERIOD}`);
  lines.push(`- Generado: ${new Date().toISOString()}`);
  lines.push(`- Estudiantes con nota: ${latest.length}`);
  lines.push('');
  lines.push('> La nota definitiva se calcula como **teóricas (0–15) + 5 DFD (1 punto cada uno) = 0–20**.');
  lines.push('> La columna "Sugerido" es automática (parseo + ejecución con casos de prueba); el docente puede ajustarla en `decisions.json` antes de aplicar.');
  lines.push('');

  const complete = [];
  const incomplete = [];

  for (const grade of latest.sort((a, b) => studentName(a).localeCompare(studentName(b)))) {
    const examData = parseExamData(grade.examData);
    if (!examData || !Array.isArray(examData.questions)) {
      incomplete.push({ grade, reason: 'sin examData' });
      continue;
    }
    const fileQuestions = examData.questions.filter((q) => q.type === 'file');
    const mapped = mapSubmissions(submissions, grade, examData);
    const missing = fileQuestions.filter((q) => !mapped.has(q.id));
    if (fileQuestions.length === 0 || missing.length > 0) {
      incomplete.push({
        grade,
        reason: `${fileQuestions.length - missing.length}/${fileQuestions.length} DFD`,
        missing: missing.map((q) => q.id)
      });
      continue;
    }
    complete.push({ grade, examData, fileQuestions, mapped });
  }

  for (const { grade, examData, fileQuestions, mapped } of complete) {
    const name = studentName(grade);
    const mcScore = Number(examData.mcScore ?? examData.questions.filter((q) => q.isCorrect).length ?? 0);
    const mcTotal = Number(examData.mcTotal ?? examData.questions.filter((q) => q.type !== 'file').length);
    const dfdDecisions = {};
    const dfdDetails = [];

    lines.push(`## ${name}`);
    lines.push('');
    lines.push(`- **Grade:** \`${grade._id}\``);
    lines.push(`- **Estudiante:** ${grade.student?.email || '—'}`);
    lines.push(`- **Intento:** ${examData.attemptNumber ?? '—'} · **Enviado:** ${new Date(grade.created_at || grade.createdAt || 0).toLocaleString('es-CO')}`);
    lines.push(`- **Teóricas:** ${mcScore}/${mcTotal || 15}`);
    lines.push('');

    for (let i = 0; i < fileQuestions.length; i++) {
      const q = fileQuestions[i];
      const sub = mapped.get(q.id);
      const position = 16 + i;
      const dl = await request('GET', `/dfd/submissions/${sub._id}/download`, null, { raw: true });
      const filename = `${sanitizeFile(name)}__p${position}__q${q.id}__${sanitizeFile(sub.originalFileName)}.dfd`;
      const filePath = path.join(OUT_DIR, 'files', filename);
      await fs.writeFile(filePath, dl);

      const result = await analyzeDfd(q.id, dl.toString('utf8'));
      dfdDecisions[q.id] = result.suggested;
      dfdDetails.push({ position, question: q, submission: sub, result, filePath });

      lines.push(`### Pregunta ${position} — id ${q.id}`);
      lines.push('');
      lines.push(`**Enunciado:** ${String(q.question || '').replace(/\s+/g, ' ').slice(0, 300)}`);
      lines.push('');
      lines.push(`- Archivo: \`${sub.originalFileName}\` · entrega \`${sub._id}\``);
      lines.push(`- Parseo: ${result.parseOk ? `OK (${result.nodes} nodos)` : `ERROR — ${result.error}`}`);
      lines.push(`- Casos: ${result.cases.filter((c) => c.ok).length}/${result.cases.length} · **Sugerido: ${result.suggested}/1**`);
      if (result.notes) lines.push(`- Nota: ${result.notes}`);
      lines.push('');
      for (const c of result.cases) {
        lines.push(`  - Entradas [${c.inputs.join(', ')}]: ${c.ok ? '✅' : '❌'} ${c.failures.join('; ')}`);
        if (c.output) lines.push(`    - Salida: \`${c.output}\``);
      }
      lines.push('');
      lines.push('<details><summary>Pseudocódigo</summary>');
      lines.push('');
      lines.push('```text');
      lines.push(result.pseudocode || '(sin pseudocódigo)');
      lines.push('```');
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }

    const suggestedDfd = Object.values(dfdDecisions).reduce((a, b) => a + b, 0);
    lines.push(`**Nota sugerida: ${mcScore + suggestedDfd}/20** (teóricas ${mcScore} + DFD ${suggestedDfd}/5)`);
    lines.push('');
    lines.push('---');
    lines.push('');

    decisions.push({
      gradeId: String(grade._id),
      student: name,
      email: grade.student?.email || '',
      mcScore,
      mcTotal: mcTotal || 15,
      dfd: dfdDecisions,
      notes: '',
      suggestedFinal: mcScore + suggestedDfd
    });
    analysis.push({
      gradeId: String(grade._id),
      student: name,
      email: grade.student?.email || '',
      mcScore,
      mcTotal: mcTotal || 15,
      dfdDetails: dfdDetails.map((d) => ({
        position: d.position,
        questionId: d.question.id,
        statement: d.question.question,
        submissionId: String(d.submission._id),
        originalFileName: d.submission.originalFileName,
        filePath: d.filePath,
        ...d.result
      }))
    });
  }

  if (incomplete.length > 0) {
    lines.push('## Intentos incompletos (no calificados todavía)');
    lines.push('');
    lines.push('| Estudiante | Grade | Motivo |');
    lines.push('|---|---|---|');
    for (const item of incomplete) {
      lines.push(`| ${studentName(item.grade)} | \`${item.grade._id}\` | ${item.reason} |`);
    }
    lines.push('');
  }

  const reportPath = path.join(OUT_DIR, 'report.md');
  const decisionsPath = path.join(OUT_DIR, 'decisions.json');
  const analysisPath = path.join(OUT_DIR, 'analysis.json');
  await fs.writeFile(reportPath, lines.join('\n'), 'utf8');
  await fs.writeFile(decisionsPath, JSON.stringify({ grades: decisions }, null, 2), 'utf8');
  await fs.writeFile(analysisPath, JSON.stringify({ generatedAt: new Date().toISOString(), complete: analysis, incomplete: incomplete.map((i) => ({ gradeId: String(i.grade._id), student: studentName(i.grade), reason: i.reason })) }, null, 2), 'utf8');

  console.log(`\nInforme:   ${reportPath}`);
  console.log(`Decisiones: ${decisionsPath}`);
  console.log(`Análisis:  ${analysisPath}`);
  console.log(`DFD files: ${path.join(OUT_DIR, 'files')}`);
  console.log(`Completos: ${complete.length} · Incompletos: ${incomplete.length}`);
  console.log('\nRevisa decisions.json y luego ejecuta:');
  console.log(`  node scripts/grade-algo-p1.mjs apply --decisions "${decisionsPath}"`);
}

// ============================================================
// APPLY
// ============================================================
async function apply() {
  const decisionsPath = argValue('--decisions') || path.join(OUT_DIR, 'decisions.json');
  const raw = JSON.parse(await fs.readFile(decisionsPath, 'utf8'));
  const entries = Array.isArray(raw) ? raw : raw.grades;
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('El archivo de decisiones no contiene calificaciones');
  }

  await login();
  const grades = await fetchGrades();
  const byId = new Map(grades.map((g) => [String(g._id), g]));

  let updated = 0;
  for (const entry of entries) {
    const grade = byId.get(String(entry.gradeId));
    if (!grade) {
      console.warn(`⚠ Grade ${entry.gradeId} no encontrado; se omite`);
      continue;
    }
    if (grade.subject !== SUBJECT) {
      console.warn(`⚠ Grade ${entry.gradeId} no es de ${SUBJECT}; se omite`);
      continue;
    }
    const examData = parseExamData(grade.examData);
    if (!examData || !Array.isArray(examData.questions)) {
      console.warn(`⚠ Grade ${entry.gradeId} sin examData; se omite`);
      continue;
    }
    const fileQuestions = examData.questions.filter((q) => q.type === 'file');
    const dfd = entry.dfd || {};
    let dfdScore = 0;
    const review = {};
    for (const q of fileQuestions) {
      const points = Number(dfd[String(q.id)] ?? dfd[q.id] ?? 0);
      const safePoints = points === 1 ? 1 : 0;
      dfdScore += safePoints;
      review[q.id] = {
        points: safePoints,
        notes: entry.notes || '',
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'grade-algo-p1.mjs'
      };
    }
    const mcScore = Number(examData.mcScore ?? examData.questions.filter((q) => q.isCorrect).length ?? 0);
    const finalScore = mcScore + dfdScore;
    // La nota definitiva del Parcial 1 siempre es sobre 20 (15 teóricas + 5 DFD).
    const maxScore = 20;

    const reviewTag = `DFD: ${dfdScore}/5 | Definitiva: ${finalScore}/${maxScore}`;
    const baseComments = String(grade.comments || '').replace(/\s*\|\s*DFD:.*$/s, '').trim();
    const comments = `${baseComments}${baseComments ? ' | ' : ''}${reviewTag}`;

    const updatedExamData = {
      ...examData,
      dfdReview: review,
      dfdScore,
      definitiveScore: finalScore,
      definitiveMax: maxScore,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'grade-algo-p1.mjs'
    };

    const res = await request('PUT', `/grades/${grade._id}`, {
      subject: grade.subject,
      score: finalScore,
      max_score: maxScore,
      period: grade.period,
      comments,
      examData: JSON.stringify(updatedExamData)
    });
    console.log(`✅ ${studentName(grade)}: ${mcScore} + ${dfdScore} = ${finalScore}/${maxScore}`);
    if (!res?.grade) console.warn('   (respuesta sin grade)');
    updated++;
  }

  console.log(`\nActualizados: ${updated}/${entries.length}`);
}

// ============================================================
// REOPEN
// ============================================================
function isIncomplete(grade, examData) {
  if (!examData || !Array.isArray(examData.questions)) return false;
  const files = examData.questions.filter((q) => q.type === 'file');
  const uploaded = examData.uploadedFileNames || {};
  const uploadedCount = files.filter((q) => uploaded[String(q.id)] || uploaded[q.id]).length;
  const unansweredTheory = examData.questions.some(
    (q) => q.type !== 'file' && (q.studentAnswer === undefined || q.studentAnswer === null || q.studentAnswer === '')
  );
  const timedOut = Number(examData.timeUsed || 0) >= TOTAL_TIME - 5;
  return timedOut || uploadedCount < files.length || unansweredTheory;
}

async function reopen() {
  await login();
  const targetGrade = argValue('--grade');
  const targetStudent = (argValue('--student') || '').toLowerCase();
  const allIncomplete = HAS_FLAG('--all-incomplete');
  const doApply = HAS_FLAG('--apply');
  const seconds = Number(argValue('--seconds') || 0);

  // Para --all-incomplete / --student se reabre únicamente el último intento
  // de cada estudiante (el que define la nota definitiva). Un --grade explícito
  // permite apuntar a cualquier intento concreto.
  const allGrades = await fetchGrades();
  const grades = targetGrade ? allGrades : latestGradePerStudent(allGrades);

  if (!targetGrade && !targetStudent && !allIncomplete) {
    throw new Error('Indica --grade <id>, --student <email> o --all-incomplete');
  }

  const candidates = [];
  for (const grade of grades) {
    if (grade.subject !== SUBJECT) continue;
    if (targetGrade && String(grade._id) !== String(targetGrade)) continue;
    if (targetStudent) {
      const haystack = `${grade.student?.email || ''} ${grade.student?.username || ''} ${grade.student?.full_name || ''}`.toLowerCase();
      if (!haystack.includes(targetStudent)) continue;
    }
    const examData = parseExamData(grade.examData);
    if (allIncomplete) {
      if (!isIncomplete(grade, examData)) continue;
      if (examData?.reopened) continue;
    }
    candidates.push({ grade, examData });
  }

  if (candidates.length === 0) {
    console.log('No hay intentos que cumplan el criterio.');
    return;
  }

  console.log(`Candidatos: ${candidates.length}`);
  for (const { grade, examData } of candidates) {
    console.log(`- ${studentName(grade)} · ${grade._id} · intento ${examData?.attemptNumber ?? '?'} · teóricas ${examData?.mcScore ?? '?'} · DFD ${Object.keys(examData?.uploadedFileNames || {}).length}/5 · tiempo ${examData?.timeUsed ?? '?'}s`);
  }

  if (!doApply) {
    console.log('\nDry-run: agrega --apply para reabrir estos intentos.');
    return;
  }

  for (const { grade } of candidates) {
    try {
      const res = await request('POST', '/admin/exams/algo-p1/reopen', {
        gradeId: grade._id,
        ...(Number.isFinite(seconds) && seconds > 0 ? { seconds } : {})
      });
      console.log(`✅ Reabierto ${studentName(grade)} · draft ${res.draftId} · pregunta ${res.currentIndex + 1}`);
    } catch (err) {
      console.error(`❌ ${studentName(grade)}: ${err.message}`);
    }
  }
}

// ============================================================
// MAIN
// ============================================================
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  try {
    if (MODE === 'report') await report();
    else if (MODE === 'apply') await apply();
    else if (MODE === 'reopen') await reopen();
    else {
      console.log('Uso: node scripts/grade-algo-p1.mjs report | apply --decisions <file> | reopen [--grade id|--student email|--all-incomplete] [--seconds n] [--apply]');
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exitCode = 1;
  }
}

export { analyzeDfd, evaluateCase, CASES };

