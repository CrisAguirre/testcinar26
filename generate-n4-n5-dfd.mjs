// Generador de los archivos .dfd de ejemplo de Nivel 4 (Funciones) y Nivel 5 (Arreglos).
// Usa el serializador del propio editor (src/lib/dfd/parser.js).
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDfd, serializeDfd } from './src/lib/dfd/parser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDirN4 = join(__dirname, 'static', 'dfd', 'nivel4');
const outDirN5 = join(__dirname, 'static', 'dfd', 'nivel5');
mkdirSync(outDirN4, { recursive: true });
mkdirSync(outDirN5, { recursive: true });

// Helpers de AST
const out = (text) => ({ type: 'output', text });
const inp = (...variables) => ({ type: 'input', variables });
const asg = (...pairs) => ({ type: 'assignment', assignments: pairs.map(([variable, expression]) => ({ variable, expression })) });
const wh = (condition, body) => ({ type: 'while', condition, body });
const dec = (condition, trueBranch, falseBranch = []) => ({ type: 'decision', condition, trueBranch, falseBranch, flag: 0 });
const call = (funcName, params = '') => ({ type: 'call', funcName, params });
const end = () => ({ type: 'end' });

const programsN4 = {
  1: {
    variables: [{ name: 'base', initValue: 0 }, { name: 'altura', initValue: 0 }, { name: 'area', initValue: 0 }],
    nodes: [
      out("'Cálculo de Área de Rectángulo con Función:'"),
      inp('base', 'altura'),
      call('areaRectangulo', 'base, altura'),
      asg(['area', 'base * altura']),
      out("'El área del rectángulo es: ', area"),
      end()
    ]
  },
  2: {
    variables: [{ name: 'num', initValue: 0 }],
    nodes: [
      out("'Verificar Paridad con Función:'"),
      inp('num'),
      call('verificarPar', 'num'),
      dec('num mod 2 == 0', [out("num, ' es un número PAR'")], [out("num, ' es un número IMPAR'")]),
      end()
    ]
  },
  3: {
    variables: [{ name: 'x', initValue: 0 }, { name: 'cubo', initValue: 0 }],
    nodes: [
      out("'Cálculo del Cubo con Función Matemática:'"),
      inp('x'),
      call('calcularCubo', 'x'),
      asg(['cubo', 'x * x * x']),
      out("'El cubo de ', x, ' es: ', cubo"),
      end()
    ]
  },
  4: {
    variables: [{ name: 'a', initValue: 0 }, { name: 'b', initValue: 0 }, { name: 'mayor', initValue: 0 }],
    nodes: [
      out("'Determinar el Mayor de Dos Números:'"),
      inp('a', 'b'),
      call('obtenerMayor', 'a, b'),
      dec('a > b', [asg(['mayor', 'a'])], [asg(['mayor', 'b'])]),
      out("'El mayor de los dos números es: ', mayor"),
      end()
    ]
  },
  5: {
    variables: [{ name: 'celsius', initValue: 0 }, { name: 'fahrenheit', initValue: 0 }],
    nodes: [
      out("'Conversión Térmica con Subprograma:'"),
      inp('celsius'),
      call('celsiusAFahrenheit', 'celsius'),
      asg(['fahrenheit', '(celsius * 1.8) + 32']),
      out("celsius, ' °C equivalen a ', fahrenheit, ' °F'"),
      end()
    ]
  },
  6: {
    variables: [
      { name: 'salarioBruto', initValue: 0 }, { name: 'retencion', initValue: 0 },
      { name: 'descuento', initValue: 0 }, { name: 'salarioNeto', initValue: 0 }
    ],
    nodes: [
      out("'Cálculo de Salario Neto con Función:'"),
      inp('salarioBruto', 'retencion'),
      call('calcularDeduccion', 'salarioBruto, retencion'),
      asg(['descuento', 'salarioBruto * (retencion / 100)'], ['salarioNeto', 'salarioBruto - descuento']),
      out("'Descuento: ', descuento, ' - Salario Neto: ', salarioNeto"),
      end()
    ]
  },
  7: {
    variables: [{ name: 'n', initValue: 0 }, { name: 'fact', initValue: 0 }, { name: 'k', initValue: 0 }],
    nodes: [
      out("'Función Factorial de un Número N:'"),
      inp('n'),
      call('calcularFactorial', 'n'),
      asg(['fact', '1'], ['k', '1']),
      wh('k <= n', [asg(['fact', 'fact * k'], ['k', 'k + 1'])]),
      out("'El factorial de ', n, ' es: ', fact"),
      end()
    ]
  },
  8: {
    variables: [{ name: 'base', initValue: 0 }, { name: 'exp', initValue: 0 }, { name: 'pot', initValue: 0 }, { name: 'i', initValue: 0 }],
    nodes: [
      out("'Función de Potencia (B^E):'"),
      inp('base', 'exp'),
      call('calcularPotencia', 'base, exp'),
      asg(['pot', '1'], ['i', '1']),
      wh('i <= exp', [asg(['pot', 'pot * base'], ['i', 'i + 1'])]),
      out("base, ' elevado a la potencia ', exp, ' es: ', pot"),
      end()
    ]
  },
  9: {
    variables: [{ name: 'valor', initValue: 0 }, { name: 'min', initValue: 0 }, { name: 'max', initValue: 0 }],
    nodes: [
      out("'Validación de Rango Numérico:'"),
      inp('valor', 'min', 'max'),
      call('enRango', 'valor, min, max'),
      dec('valor >= min and valor <= max', [out("valor, ' se encuentra DENTRO del rango'")], [out("valor, ' está FUERA del rango especificado'")]),
      end()
    ]
  },
  10: {
    variables: [
      { name: 'precio', initValue: 0 }, { name: 'cantidad', initValue: 0 }, { name: 'pctDesc', initValue: 0 },
      { name: 'subtotal', initValue: 0 }, { name: 'ahorro', initValue: 0 }, { name: 'total', initValue: 0 }
    ],
    nodes: [
      out("'Cálculo de Descuento Comercial:'"),
      inp('precio', 'cantidad', 'pctDesc'),
      call('aplicarDescuento', 'precio, cantidad, pctDesc'),
      asg(['subtotal', 'precio * cantidad'], ['ahorro', 'subtotal * (pctDesc / 100)'], ['total', 'subtotal - ahorro']),
      out("'Subtotal: ', subtotal, ' - Descuento: ', ahorro, ' - Total: ', total"),
      end()
    ]
  }
};

const programsN5 = {
  1: {
    variables: [{ name: 'i', initValue: 0 }, { name: 'num', initValue: 0 }],
    nodes: [
      out("'Llenar y recorrer un vector de 5 elementos:'"),
      asg(['i', '1']),
      wh('i <= 5', [inp('num'), out("'Posición [', i, ']: ', num"), asg(['i', 'i + 1'])]),
      out("'Recorrido de arreglo completado.'"),
      end()
    ]
  },
  2: {
    variables: [{ name: 'i', initValue: 0 }, { name: 'num', initValue: 0 }, { name: 'suma', initValue: 0 }, { name: 'promedio', initValue: 0 }],
    nodes: [
      out("'Suma y promedio de 5 números en vector:'"),
      asg(['suma', '0'], ['i', '1']),
      wh('i <= 5', [inp('num'), asg(['suma', 'suma + num'], ['i', 'i + 1'])]),
      asg(['promedio', 'suma / 5']),
      out("'Suma total: ', suma, ' - Promedio: ', promedio"),
      end()
    ]
  },
  3: {
    variables: [{ name: 'mayor', initValue: 0 }, { name: 'num', initValue: 0 }, { name: 'i', initValue: 0 }],
    nodes: [
      out("'Buscar el mayor de 5 números en un vector:'"),
      inp('mayor'),
      asg(['i', '2']),
      wh('i <= 5', [inp('num'), dec('num > mayor', [asg(['mayor', 'num'])]), asg(['i', 'i + 1'])]),
      out("'El valor mayor del vector es: ', mayor"),
      end()
    ]
  },
  4: {
    variables: [{ name: 'i', initValue: 0 }, { name: 'num', initValue: 0 }, { name: 'pares', initValue: 0 }, { name: 'impares', initValue: 0 }],
    nodes: [
      out("'Contador de pares e impares en vector de 6 posiciones:'"),
      asg(['pares', '0'], ['impares', '0'], ['i', '1']),
      wh('i <= 6', [inp('num'), dec('num mod 2 == 0', [asg(['pares', 'pares + 1'])], [asg(['impares', 'impares + 1'])]), asg(['i', 'i + 1'])]),
      out("'Total pares: ', pares, ' - Total impares: ', impares"),
      end()
    ]
  },
  5: {
    variables: [{ name: 'buscar', initValue: 0 }, { name: 'encontrado', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'elem', initValue: 0 }],
    nodes: [
      out("'Búsqueda de un valor en una secuencia de 5 elementos:'"),
      inp('buscar'),
      asg(['encontrado', '0'], ['i', '1']),
      wh('i <= 5 and encontrado == 0', [inp('elem'), dec('elem == buscar', [asg(['encontrado', '1'])]), asg(['i', 'i + 1'])]),
      dec('encontrado == 1', [out("'El valor ', buscar, ' SÍ fue encontrado en el arreglo'")], [out("'El valor ', buscar, ' NO existe en el arreglo'")]),
      end()
    ]
  },
  6: {
    variables: [{ name: 'K', initValue: 0 }, { name: 'i', initValue: 0 }, { name: 'elem', initValue: 0 }, { name: 'nuevo', initValue: 0 }],
    nodes: [
      out("'Multiplicar elementos de un vector por factor K:'"),
      inp('K'),
      asg(['i', '1']),
      wh('i <= 5', [inp('elem'), asg(['nuevo', 'elem * K']), out("'Posición [', i, '] x ', K, ' = ', nuevo"), asg(['i', 'i + 1'])]),
      out("'Multiplicación escalar completada.'"),
      end()
    ]
  },
  7: {
    variables: [
      { name: 'n1', initValue: 0 }, { name: 'n2', initValue: 0 }, { name: 'n3', initValue: 0 },
      { name: 'prom', initValue: 0 }, { name: 'superan', initValue: 0 }
    ],
    nodes: [
      out("'Contar notas que superan el promedio del grupo:'"),
      inp('n1', 'n2', 'n3'),
      asg(['prom', '(n1 + n2 + n3) / 3'], ['superan', '0']),
      dec('n1 > prom', [asg(['superan', 'superan + 1'])]),
      dec('n2 > prom', [asg(['superan', 'superan + 1'])]),
      dec('n3 > prom', [asg(['superan', 'superan + 1'])]),
      out("'Promedio: ', prom, ' - Notas sobre el promedio: ', superan"),
      end()
    ]
  },
  8: {
    variables: [{ name: 'a', initValue: 0 }, { name: 'b', initValue: 0 }, { name: 'c', initValue: 0 }, { name: 'd', initValue: 0 }],
    nodes: [
      out("'Lectura y visualización de vector en orden inverso:'"),
      inp('a', 'b', 'c', 'd'),
      out("'Elementos en orden inverso:'"),
      out("'Posición 4: ', d"),
      out("'Posición 3: ', c"),
      out("'Posición 2: ', b"),
      out("'Posición 1: ', a"),
      end()
    ]
  },
  9: {
    variables: [
      { name: 'i', initValue: 0 }, { name: 'num', initValue: 0 },
      { name: 'pos', initValue: 0 }, { name: 'neg', initValue: 0 }, { name: 'ceros', initValue: 0 }
    ],
    nodes: [
      out("'Clasificación de 6 números (positivos, negativos, ceros):'"),
      asg(['pos', '0'], ['neg', '0'], ['ceros', '0'], ['i', '1']),
      wh('i <= 6', [inp('num'), dec('num > 0', [asg(['pos', 'pos + 1'])], [dec('num < 0', [asg(['neg', 'neg + 1'])], [asg(['ceros', 'ceros + 1'])])]), asg(['i', 'i + 1'])]),
      out("'Positivos: ', pos, ' - Negativos: ', neg, ' - Ceros: ', ceros"),
      end()
    ]
  },
  10: {
    variables: [{ name: 'i', initValue: 0 }, { name: 'num', initValue: 0 }, { name: 'acum', initValue: 0 }],
    nodes: [
      out("'Generación de serie acumulada en vector:'"),
      asg(['acum', '0'], ['i', '1']),
      wh('i <= 5', [inp('num'), asg(['acum', 'acum + num']), out("'Posición [', i, ']: valor=', num, ' -> acumulado=', acum"), asg(['i', 'i + 1'])]),
      out("'Suma acumulada total del vector: ', acum"),
      end()
    ]
  }
};

function generateFiles(programs, outDir, levelLabel) {
  let ok = 0;
  for (const [num, program] of Object.entries(programs)) {
    const text = serializeDfd(program);
    const parsed = parseDfd(text);
    if (parsed.error) {
      console.error(`Error parseando ${levelLabel} Problema ${num}:`, parsed.error);
    }
    const filePath = join(outDir, `Problema ${num}.dfd`);
    writeFileSync(filePath, text, 'utf8');
    ok++;
  }
  console.log(`${ok} archivos generados para ${levelLabel} en ${outDir}`);
}

generateFiles(programsN4, outDirN4, 'Nivel 4');
generateFiles(programsN5, outDirN5, 'Nivel 5');

