import fs from 'fs';
import { parseDfd } from './src/lib/dfd/parser.js';
import { DfdExecutor } from './src/lib/dfd/executor.js';

// ============================================================
// TEST 1: Problema 1 (Condicionales) — promedio >= 10.5 → Aprobado
// ============================================================
async function test1() {
  console.log('=== TEST 1: Problema 1 (notas 10, 12, 15 → promedio 12.33 → APROBADO) ===');
  const content = fs.readFileSync('./src/Docs/trimc26/Algoritmos/Ejercicios/Nivel 2 - Condicionales/Problema 1.dfd', 'utf-8');
  const ast = parseDfd(content);
  if (ast.error) { console.error('PARSE ERROR:', ast.error); return false; }

  const inputs = ['10', '12', '15'];
  const outputs = [];

  const executor = new DfdExecutor(
    ast,
    async (prompt) => { const v = inputs.shift(); console.log(`  [INPUT] ${prompt} → ${v}`); return v; },
    async (text) => { outputs.push(text); console.log(`  [OUTPUT] ${text}`); }
  );
  await executor.execute();

  // Verify: promedio = (10+12+15)/3 = 12.33 >= 10.5 → should say APROBADO
  const aprobado = outputs.some(o => o.toUpperCase().includes('APROBADO'));
  console.log(`  ✅ Result contains "APROBADO": ${aprobado}`);
  return aprobado;
}

// ============================================================
// TEST 2: Problema 1 (Condicionales) — promedio < 10.5 → Desaprobado
// ============================================================
async function test2() {
  console.log('\n=== TEST 2: Problema 1 (notas 2, 3, 4 → promedio 3 → DESAPROBADO) ===');
  const content = fs.readFileSync('./src/Docs/trimc26/Algoritmos/Ejercicios/Nivel 2 - Condicionales/Problema 1.dfd', 'utf-8');
  const ast = parseDfd(content);
  if (ast.error) { console.error('PARSE ERROR:', ast.error); return false; }

  const inputs = ['2', '3', '4'];
  const outputs = [];

  const executor = new DfdExecutor(
    ast,
    async (prompt) => { const v = inputs.shift(); console.log(`  [INPUT] ${prompt} → ${v}`); return v; },
    async (text) => { outputs.push(text); console.log(`  [OUTPUT] ${text}`); }
  );
  await executor.execute();

  // Verify: promedio = (2+3+4)/3 = 3 < 10.5 → should say desaprobado
  const desaprobado = outputs.some(o => o.toLowerCase().includes('desaprobado'));
  console.log(`  ✅ Result contains "desaprobado": ${desaprobado}`);
  return desaprobado;
}

// ============================================================
// TEST 3: Pure math evaluation (no DFD file, just the evaluator)
// ============================================================
async function test3() {
  console.log('\n=== TEST 3: Pure math expressions ===');
  const { DfdExecutor: Exec } = await import('./src/lib/dfd/executor.js');
  
  // Create a minimal executor just to test evaluateExpression
  const exec = new Exec({ variables: [] }, async () => '', async () => {});
  exec.variables = { a: 10, b: 5, c: 3 };

  const tests = [
    ['a+b', 15],
    ['a-b', 5],
    ['a*b', 50],
    ['a/b', 2],
    ['(a+b)*c', 45],
    ['a>=b', 1],
    ['b>a', 0],
    ['a>=10.5', 0], // 10 is not >= 10.5... wait, a=10
  ];

  let allPassed = true;
  for (const [expr, expected] of tests) {
    const result = exec.evaluateExpression(expr);
    const pass = Math.abs(result - expected) < 0.001;
    console.log(`  ${pass ? '✅' : '❌'} ${expr} = ${result} (expected ${expected})`);
    if (!pass) allPassed = false;
  }
  return allPassed;
}

// ============================================================
// RUN ALL TESTS
// ============================================================
async function runAll() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   DFD EXECUTOR - AUTOMATED TEST SUITE       ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  const results = [];
  results.push(await test1());
  results.push(await test2());
  results.push(await test3());

  console.log('\n══════════════════════════════════════════════');
  const passed = results.filter(Boolean).length;
  const total = results.length;
  if (passed === total) {
    console.log(`🎉 ALL ${total} TESTS PASSED!`);
  } else {
    console.log(`⚠️  ${passed}/${total} tests passed, ${total - passed} FAILED`);
  }
  console.log('══════════════════════════════════════════════');
}

runAll().catch(console.error);
