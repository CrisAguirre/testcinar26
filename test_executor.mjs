import fs from 'fs';
import { parseDfd } from './src/lib/dfd/parser.js';
import { DfdExecutor } from './src/lib/dfd/executor.js';

async function runTest() {
  const content = fs.readFileSync('./src/Docs/trimc26/Algoritmos/Ejercicios/Nivel 2 - Condicionales/Problema 1.dfd', 'utf-8');
  
  const ast = parseDfd(content);
  if (ast.error) {
    console.error("Parse error:", ast.error);
    return;
  }

  let inputs = ["10", "12", "15"]; // nota1, nota2, nota3
  
  const executor = new DfdExecutor(
    ast,
    async (prompt) => {
      const val = inputs.shift();
      console.log(`[Input Prompt]: ${prompt} -> User typed: ${val}`);
      return val;
    },
    async (out) => {
      console.log(`[Console Output]: ${out}`);
    }
  );

  console.log("--- Executing DFD AST ---");
  await executor.execute();
  console.log("--- Execution Complete ---");
}

runTest().catch(console.error);
