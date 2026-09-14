/**
 * DFD File Parser
 * Parses .dfd files (Free DFD format) into an Abstract Syntax Tree.
 *
 * Node types in .dfd binary format:
 *  1  = End of program / return
 *  3  = End of subprogram (return from function)
 *  4  = Output (Escribir)
 *  5  = Input (Leer)
 *  6  = Assignment / Variable declarations
 *  7  = Decision (Si / If)
 *  9  = While loop (Mientras)
 *  11 = End of while loop
 *  12 = Function call
 *  13 = End of decision branch
 */

export function parseDfd(text) {
  const rawLines = text.split(/\r?\n/);
  const lines = [];
  for (const l of rawLines) {
    const trimmed = l.trim();
    if (trimmed !== '') lines.push(trimmed);
  }

  if (lines.length < 6) return { variables: [], nodes: [], error: 'Archivo DFD demasiado corto' };

  const state = { pos: 0, lines };

  // Skip magic header line
  if (lines[0] && (lines[0].includes('Dfd') || lines[0].charCodeAt(0) < 32)) {
    state.pos = 1;
  }

  // Read header values
  const headerCount = 5;
  const header = [];
  for (let i = 0; i < headerCount && state.pos < lines.length; i++) {
    header.push(lines[state.pos++]);
  }

  // Check if there's a description line (for programs with descriptions)
  // If next line is very long text or starts with a letter, it's a description
  let description = '';
  if (state.pos < lines.length) {
    const next = lines[state.pos];
    // Description lines have a length number before them
    if (/^\d+$/.test(next) && parseInt(next) > 20) {
      const descLen = parseInt(next);
      state.pos++;
      if (state.pos < lines.length && lines[state.pos].length >= descLen - 5) {
        description = lines[state.pos++];
      }
    }
  }

  // Parse variable declarations
  const variables = [];
  while (state.pos < lines.length && lines[state.pos] === '6') {
    state.pos++; // skip '6'
    if (state.pos >= lines.length) break;
    const count = parseInt(lines[state.pos++]);
    if (isNaN(count)) break;
    for (let i = 0; i < count && state.pos + 3 < lines.length; i++) {
      state.pos++; // skip name width
      const name = lines[state.pos++];
      state.pos++; // skip value width
      const initValue = lines[state.pos++];
      variables.push({ name, initValue: initValue === '0' ? 0 : initValue });
    }
    // Check if the next token is another '6' (more var declarations)
    // or something else (start of flow)
    if (state.pos < lines.length && lines[state.pos] !== '6') {
      // Might be the start of flow, but could also be a flow '6' assignment
      // We stop parsing vars when we see a non-6 code
      break;
    }
  }

  // Parse flow nodes
  const nodes = parseFlowNodes(state);

  return { variables, nodes, description };
}

function parseFlowNodes(state) {
  const nodes = [];

  while (state.pos < state.lines.length) {
    const codeLine = state.lines[state.pos];
    const code = parseInt(codeLine);

    if (isNaN(code)) {
      state.pos++;
      continue;
    }

    switch (code) {
      case 1: // End
        nodes.push({ type: 'end' });
        state.pos++;
        return nodes;

      case 3: // Return from subprogram
        nodes.push({ type: 'return' });
        state.pos++;
        return nodes;

      case 4: { // Output
        state.pos++; // skip 4
        state.pos++; // skip 1
        state.pos++; // skip width
        const text = state.pos < state.lines.length ? state.lines[state.pos++] : '';
        nodes.push({ type: 'output', text });
        break;
      }

      case 5: { // Input
        state.pos++; // skip 5
        state.pos++; // skip 1
        state.pos++; // skip width
        const varStr = state.pos < state.lines.length ? state.lines[state.pos++] : '';
        nodes.push({ type: 'input', variables: varStr.split(',').map(v => v.trim()) });
        break;
      }

      case 6: { // Assignment
        state.pos++; // skip 6
        const count = parseInt(state.lines[state.pos++]);
        const assignments = [];
        for (let i = 0; i < count && state.pos + 3 <= state.lines.length; i++) {
          state.pos++; // skip name width
          const name = state.lines[state.pos++];
          state.pos++; // skip expression width
          const expression = state.lines[state.pos++];
          assignments.push({ variable: name, expression });
        }
        nodes.push({ type: 'assignment', assignments });
        break;
      }

      case 7: { // Decision
        state.pos++; // skip 7
        const flag = parseInt(state.lines[state.pos++]); // 0 or 1
        state.pos++; // skip 1
        state.pos++; // skip width
        const condition = state.pos < state.lines.length ? state.lines[state.pos++] : '';
        const falseBranch = parseFlowNodes(state); // until 13
        const trueBranch = parseFlowNodes(state);  // until 13
        nodes.push({ type: 'decision', condition, trueBranch, falseBranch, flag });
        break;
      }

      case 9: { // While loop
        state.pos++; // skip 9
        state.pos++; // skip flag
        state.pos++; // skip width
        const condition = state.pos < state.lines.length ? state.lines[state.pos++] : '';
        const body = parseFlowNodes(state); // until 11
        nodes.push({ type: 'while', condition, body });
        break;
      }

      case 11: // End of while loop
        state.pos++;
        return nodes;

      case 12: { // Function call
        state.pos++; // skip 12
        // Parse function call structure
        state.pos++; // skip flag
        state.pos++; // skip width
        const funcName = state.pos < state.lines.length ? state.lines[state.pos++] : '';
        // Skip remaining function call data
        state.pos++; // skip param count
        state.pos++; // skip width
        const params = state.pos < state.lines.length ? state.lines[state.pos++] : '';
        // Skip more data until we see a recognizable node
        while (state.pos < state.lines.length) {
          const peek = parseInt(state.lines[state.pos]);
          if ([1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 13].includes(peek)) break;
          state.pos++;
        }
        nodes.push({ type: 'call', funcName, params });
        break;
      }

      case 13: // End of branch
        state.pos++;
        return nodes;

      default:
        // Unknown code, skip
        state.pos++;
        break;
    }
  }

  return nodes;
}

/**
 * Serialize an AST back to DFD format text
 */
export function serializeDfd(ast) {
  const lines = [];
  lines.push('\x04 Dfd \x02\x08(c)');
  lines.push('1', '1', '1', '0', '0');

  // Variables
  if (ast.variables.length > 0) {
    lines.push('6');
    lines.push(String(ast.variables.length));
    for (const v of ast.variables) {
      const initStr = String(v.initValue || 0);
      lines.push(String(v.name.length), v.name, String(initStr.length), initStr);
    }
  }

  // Nodes
  serializeNodes(ast.nodes, lines);

  return lines.join('\r\n') + '\r\n';
}

function serializeNodes(nodes, lines) {
  for (const node of nodes) {
    switch (node.type) {
      case 'end':
        lines.push('1');
        break;
      case 'output':
        lines.push('4', '1', String(node.text.length), node.text);
        break;
      case 'input':
        const varStr = node.variables.join(',');
        lines.push('5', '1', String(varStr.length), varStr);
        break;
      case 'assignment':
        lines.push('6', String(node.assignments.length));
        for (const a of node.assignments) {
          lines.push(String(a.variable.length), a.variable, String(a.expression.length), a.expression);
        }
        break;
      case 'decision':
        lines.push('7', String(node.flag || 0), '1', String(node.condition.length), node.condition);
        serializeNodes(node.falseBranch, lines);
        lines.push('13');
        serializeNodes(node.trueBranch, lines);
        lines.push('13');
        break;
      case 'while':
        lines.push('9', '1', String(node.condition.length), node.condition);
        serializeNodes(node.body, lines);
        lines.push('11');
        break;
    }
  }
}
