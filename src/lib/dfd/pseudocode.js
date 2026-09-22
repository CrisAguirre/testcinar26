/**
 * Generador de pseudocódigo legible en español a partir del AST DFD.
 * Convierte nodos crípticos (.dfd con códigos 1,4,5,6,7...) en texto
 * explicativo que refleja 1:1 el diagrama de flujo visual.
 */

function indent(level) {
  return '  '.repeat(level);
}

function describeOutput(text) {
  const t = (text || '').trim();
  if (!t) return 'Escribir (vacío)';
  // Si mezcla literales '...' con variables separadas por comas, se muestra tal cual
  return `Escribir ${t}`;
}

function genNodes(nodes, level, lines) {
  for (const node of nodes) {
    const pad = indent(level);
    switch (node.type) {
      case 'end':
      case 'return':
        break;

      case 'output': {
        lines.push(`${pad}${describeOutput(node.text)}`);
        break;
      }

      case 'input': {
        const vars = (node.variables || []).join(', ');
        lines.push(`${pad}Leer ${vars}   // pide valor al usuario`);
        break;
      }

      case 'assignment': {
        for (const a of node.assignments || []) {
          lines.push(`${pad}${a.variable} <- ${a.expression}`);
        }
        break;
      }

      case 'decision': {
        const cond = node.condition || '(condición)';
        const hasTrue = node.trueBranch && node.trueBranch.some((n) => n.type !== 'end' && n.type !== 'return');
        const hasFalse = node.falseBranch && node.falseBranch.some((n) => n.type !== 'end' && n.type !== 'return');
        lines.push(`${pad}Si (${cond}) Entonces   // rama Sí`);
        if (hasTrue) {
          genNodes(node.trueBranch, level + 1, lines);
        } else {
          lines.push(`${indent(level + 1)}// (sin acciones en Sí)`);
        }
        if (hasFalse) {
          lines.push(`${pad}Sino   // rama No`);
          genNodes(node.falseBranch, level + 1, lines);
        }
        lines.push(`${pad}FinSi`);
        break;
      }

      case 'while': {
        const cond = node.condition || '(condición)';
        lines.push(`${pad}Mientras (${cond}) Hacer`);
        const hasBody = node.body && node.body.some((n) => n.type !== 'end' && n.type !== 'return');
        if (hasBody) {
          genNodes(node.body, level + 1, lines);
        } else {
          lines.push(`${indent(level + 1)}// (cuerpo vacío)`);
        }
        lines.push(`${pad}FinMientras`);
        break;
      }

      case 'call': {
        lines.push(`${pad}Llamar ${node.funcName || 'función'}(${node.params || ''})`);
        break;
      }

      default:
        break;
    }
  }
}

export function generatePseudocode(ast, fileName = 'ejercicio.dfd') {
  if (!ast || !ast.nodes || ast.nodes.length === 0) {
    return '// Sin algoritmo cargado.\n// Usa el selector de ejercicios o abre un archivo .dfd.';
  }

  const lines = [];
  const cleanName = (fileName || '').replace(/\.dfd$/i, '').replace(/\s+/g, '_');

  lines.push(`Algoritmo ${cleanName || 'Ejercicio'}`);

  if (ast.variables && ast.variables.length > 0) {
    const vars = ast.variables.map((v) => v.name).join(', ');
    lines.push(`// Variables: ${vars}`);
  }
  if (ast.description) {
    lines.push(`// ${ast.description}`);
  }
  lines.push('Inicio');

  genNodes(ast.nodes, 1, lines);

  lines.push('Fin');

  return lines.join('\n');
}
