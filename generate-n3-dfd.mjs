// Generador de los archivos .dfd de ejemplo del Nivel 3 (Ciclos).
// Usa el serializador del propio editor (src/lib/dfd/parser.js) para garantizar
// el mismo formato FreeDFD que ya cargan los niveles 1 y 2.
// Uso: node generate-n3-dfd.mjs   (desde la carpeta testcinar26)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDfd, serializeDfd } from './src/lib/dfd/parser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, 'static', 'dfd', 'nivel3');
mkdirSync(outDir, { recursive: true });

// Helpers de AST
const out = (text) => ({ type: 'output', text });
const inp = (...variables) => ({ type: 'input', variables });
const asg = (...pairs) => ({ type: 'assignment', assignments: pairs.map(([variable, expression]) => ({ variable, expression })) });
const wh = (condition, body) => ({ type: 'while', condition, body });
const dec = (condition, trueBranch, falseBranch = []) => ({ type: 'decision', condition, trueBranch, falseBranch, flag: 0 });
const end = () => ({ type: 'end' });

const programs = {
  // 1. Mostrar los números del 1 al 10
  1: {
    variables: [{ name: 'i', initValue: 0 }],
    nodes: [
      out("'Números del 1 al 10:'"),
      asg(['i', '1']),
      wh('i<=10', [
        out('i'),
        asg(['i', 'i+1'])
      ]),
      end()
    ]
  },

  // 2. Suma de 1 hasta N
  2: {
    variables: [{ name: 'N', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'suma', initValue: 0 }],
    nodes: [
      inp('N'),
      asg(['i', '1']),
      wh('i<=N', [
        asg(['suma', 'suma+i']),
        asg(['i', 'i+1'])
      ]),
      out("'La suma de 1 hasta ', N, ' es: ', suma"),
      end()
    ]
  },

  // 3. Tabla de multiplicar de N (1 al 10)
  3: {
    variables: [{ name: 'N', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'resultado', initValue: 0 }],
    nodes: [
      inp('N'),
      out("'Tabla de multiplicar del ', N"),
      asg(['i', '1']),
      wh('i<=10', [
        asg(['resultado', 'N*i']),
        out("N, ' x ', i, ' = ', resultado"),
        asg(['i', 'i+1'])
      ]),
      end()
    ]
  },

  // 4. Contar cuántos números pares hay entre 1 y N
  4: {
    variables: [{ name: 'N', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'contador', initValue: 0 }],
    nodes: [
      inp('N'),
      asg(['i', '1']),
      wh('i<=N', [
        dec('i mod 2 == 0', [
          asg(['contador', 'contador+1'])
        ]),
        asg(['i', 'i+1'])
      ]),
      out("'Cantidad de números pares entre 1 y ', N, ': ', contador"),
      end()
    ]
  },

  // 5. Promedio de N notas
  5: {
    variables: [
      { name: 'N', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'nota', initValue: 0 },
      { name: 'suma', initValue: 0 }, { name: 'promedio', initValue: 0 }
    ],
    nodes: [
      inp('N'),
      asg(['i', '1']),
      wh('i<=N', [
        inp('nota'),
        asg(['suma', 'suma+nota']),
        asg(['i', 'i+1'])
      ]),
      dec('N>0', [
        asg(['promedio', 'suma/N'])
      ], [
        asg(['promedio', '0'])
      ]),
      out("'Promedio de las ', N, ' notas: ', promedio"),
      end()
    ]
  },

  // 6. Factorial de N
  6: {
    variables: [{ name: 'N', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'factorial', initValue: 0 }],
    nodes: [
      inp('N'),
      asg(['factorial', '1']),
      asg(['i', '1']),
      wh('i<=N', [
        asg(['factorial', 'factorial*i']),
        asg(['i', 'i+1'])
      ]),
      out("'El factorial de ', N, ' es: ', factorial"),
      end()
    ]
  },

  // 7. Potencia: base elevado a exponente
  7: {
    variables: [
      { name: 'base', initValue: 0 }, { name: 'exponente', initValue: 0 },
      { name: 'i', initValue: 0 }, { name: 'potencia', initValue: 0 }
    ],
    nodes: [
      inp('base'),
      inp('exponente'),
      asg(['potencia', '1']),
      asg(['i', '1']),
      wh('i<=exponente', [
        asg(['potencia', 'potencia*base']),
        asg(['i', 'i+1'])
      ]),
      out("base, ' elevado a ', exponente, ' = ', potencia"),
      end()
    ]
  },

  // 8. K primeros múltiplos de M
  8: {
    variables: [
      { name: 'M', initValue: 0 }, { name: 'K', initValue: 0 },
      { name: 'i', initValue: 0 }, { name: 'multiplo', initValue: 0 }
    ],
    nodes: [
      inp('M'),
      inp('K'),
      asg(['i', '1']),
      wh('i<=K', [
        asg(['multiplo', 'M*i']),
        out('multiplo'),
        asg(['i', 'i+1'])
      ]),
      end()
    ]
  },

  // 9. Suma de números hasta que se ingrese 0 (centinela)
  9: {
    variables: [{ name: 'numero', initValue: 0 }, { name: 'suma', initValue: 0 }],
    nodes: [
      inp('numero'),
      wh('numero!=0', [
        asg(['suma', 'suma+numero']),
        inp('numero')
      ]),
      out("'Suma total: ', suma"),
      end()
    ]
  },

  // 10. Validar clave numérica (2026)
  10: {
    variables: [{ name: 'clave', initValue: 0 }],
    nodes: [
      inp('clave'),
      wh('clave!=2026', [
        out("'Clave incorrecta, intenta de nuevo'"),
        inp('clave')
      ]),
      out("'Clave correcta. Acceso concedido'"),
      end()
    ]
  },

  // 11. Serie de cuadrados hasta N
  11: {
    variables: [{ name: 'N', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'cuadrado', initValue: 0 }],
    nodes: [
      inp('N'),
      out("'Serie de cuadrados hasta ', N, ':'"),
      asg(['i', '1']),
      wh('i<=N', [
        asg(['cuadrado', 'i*i']),
        out('cuadrado'),
        asg(['i', 'i+1'])
      ]),
      end()
    ]
  },

  // 12. Primeros N términos de Fibonacci
  12: {
    variables: [
      { name: 'N', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'a', initValue: 0 },
      { name: 'b', initValue: 0 }, { name: 'temp', initValue: 0 }
    ],
    nodes: [
      inp('N'),
      asg(['a', '0']),
      asg(['b', '1']),
      asg(['i', '1']),
      wh('i<=N', [
        out('a'),
        asg(['temp', 'a+b']),
        asg(['a', 'b']),
        asg(['b', 'temp']),
        asg(['i', 'i+1'])
      ]),
      end()
    ]
  }
};

// Verificación round-trip: serialize → parse → comparar AST
function sameNode(a, b) {
  if (a.type !== b.type) return false;
  switch (a.type) {
    case 'end': return true;
    case 'output': return a.text === b.text;
    case 'input': return JSON.stringify(a.variables) === JSON.stringify(b.variables);
    case 'assignment': return JSON.stringify(a.assignments) === JSON.stringify(b.assignments);
    case 'decision':
      return a.condition === b.condition && sameList(a.trueBranch, b.trueBranch) && sameList(a.falseBranch, b.falseBranch);
    case 'while':
      return a.condition === b.condition && sameList(a.body, b.body);
    default: return false;
  }
}
function sameList(x, y) {
  return x.length === y.length && x.every((n, i) => sameNode(n, y[i]));
}

let ok = 0;
let fail = 0;
for (const [num, program] of Object.entries(programs)) {
  const text = serializeDfd(program);
  const parsed = parseDfd(text);
  const roundTripOk = !parsed.error && sameList(program.nodes, parsed.nodes) &&
    JSON.stringify(program.variables.map((v) => v.name)) === JSON.stringify(parsed.variables.map((v) => v.name));

  const filePath = join(outDir, `Problema ${num}.dfd`);
  writeFileSync(filePath, text, 'utf8');

  if (roundTripOk) {
    ok++;
    console.log(`OK  Problema ${num}.dfd (${program.nodes.length} nodos)`);
  } else {
    fail++;
    console.error(`FAIL Problema ${num}.dfd — round-trip no coincide`, parsed.error || '');
  }
}
console.log(`\n${ok} archivos generados en static/dfd/nivel3, ${fail} con errores.`);
process.exit(fail > 0 ? 1 : 0);
