/**
 * DFD AST Executor
 * Evaluates DFD AST nodes step-by-step.
 * Uses a custom recursive-descent expression evaluator (NO eval/new Function).
 */

// ============================================================
// Tokenizer: converts expression string into tokens
// ============================================================
function tokenize(expr, vars) {
  const tokens = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];

    // whitespace
    if (ch === ' ' || ch === '\t') { i++; continue; }

    // number literal
    if ((ch >= '0' && ch <= '9') || (ch === '.' && i + 1 < expr.length && expr[i + 1] >= '0' && expr[i + 1] <= '9')) {
      let num = '';
      while (i < expr.length && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
        num += expr[i++];
      }
      tokens.push({ type: 'number', value: parseFloat(num) });
      continue;
    }

    // two-char operators
    if (i + 1 < expr.length) {
      const two = expr[i] + expr[i + 1];
      if (two === '>=' || two === '<=' || two === '!=' || two === '==') {
        tokens.push({ type: 'op', value: two });
        i += 2;
        continue;
      }
    }

    // single-char operators
    if ('+-*/%()><='.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    // identifier (variable or function name like MOD, random, etc.)
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_') {
      let id = '';
      while (i < expr.length && ((expr[i] >= 'a' && expr[i] <= 'z') || (expr[i] >= 'A' && expr[i] <= 'Z') || (expr[i] >= '0' && expr[i] <= '9') || expr[i] === '_')) {
        id += expr[i++];
      }

      // Check built-in constants / keywords
      const lower = id.toLowerCase();
      if (lower === 'mod') {
        tokens.push({ type: 'op', value: '%' });
      } else if (lower === 'div') {
        tokens.push({ type: 'op', value: '/' }); // integer div in some DFDs
      } else if (lower === 'and' || lower === 'y') {
        tokens.push({ type: 'op', value: '&&' });
      } else if (lower === 'or' || lower === 'o') {
        tokens.push({ type: 'op', value: '||' });
      } else if (lower === 'not' || lower === 'no') {
        tokens.push({ type: 'op', value: '!' });
      } else if (lower === 'true' || lower === 'verdadero') {
        tokens.push({ type: 'number', value: 1 });
      } else if (lower === 'false' || lower === 'falso') {
        tokens.push({ type: 'number', value: 0 });
      } else {
        // Variable reference – resolve immediately
        tokens.push({ type: 'var', name: id });
      }
      continue;
    }

    // skip unknown characters
    i++;
  }
  return tokens;
}

// ============================================================
// Recursive-descent parser / evaluator
// Grammar:
//   expr     → or_expr
//   or_expr  → and_expr ( '||' and_expr )*
//   and_expr → cmp_expr ( '&&' cmp_expr )*
//   cmp_expr → add_expr ( ('>'|'<'|'>='|'<='|'=='|'!=') add_expr )?
//   add_expr → mul_expr ( ('+'|'-') mul_expr )*
//   mul_expr → unary    ( ('*'|'/'|'%') unary )*
//   unary    → '-' unary | '!' unary | primary
//   primary  → NUMBER | VAR | '(' expr ')'
// ============================================================
function evaluateTokens(tokens, vars) {
  let pos = 0;

  function peek() { return pos < tokens.length ? tokens[pos] : null; }
  function next() { return tokens[pos++]; }

  function resolveVar(name) {
    if (name in vars) return vars[name];
    // Try case-insensitive
    for (const k of Object.keys(vars)) {
      if (k.toLowerCase() === name.toLowerCase()) return vars[k];
    }
    return 0;
  }

  function parseExpr() { return parseOr(); }

  function parseOr() {
    let left = parseAnd();
    while (peek() && peek().type === 'op' && peek().value === '||') {
      next();
      const right = parseAnd();
      left = (left || right) ? 1 : 0;
    }
    return left;
  }

  function parseAnd() {
    let left = parseComparison();
    while (peek() && peek().type === 'op' && peek().value === '&&') {
      next();
      const right = parseComparison();
      left = (left && right) ? 1 : 0;
    }
    return left;
  }

  function parseComparison() {
    let left = parseAdd();
    const t = peek();
    if (t && t.type === 'op' && ['>', '<', '>=', '<=', '==', '!=', '='].includes(t.value)) {
      const op = next().value;
      const right = parseAdd();
      switch (op) {
        case '>':  return left > right ? 1 : 0;
        case '<':  return left < right ? 1 : 0;
        case '>=': return left >= right ? 1 : 0;
        case '<=': return left <= right ? 1 : 0;
        case '==': // fall through
        case '=':  return left == right ? 1 : 0;
        case '!=': return left != right ? 1 : 0;
      }
    }
    return left;
  }

  function parseAdd() {
    let left = parseMul();
    while (peek() && peek().type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = next().value;
      const right = parseMul();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  function parseMul() {
    let left = parseUnary();
    while (peek() && peek().type === 'op' && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
      const op = next().value;
      const right = parseUnary();
      if (op === '*') left = left * right;
      else if (op === '/') left = right !== 0 ? left / right : 0;
      else left = left % right;
    }
    return left;
  }

  function parseUnary() {
    const t = peek();
    if (t && t.type === 'op' && t.value === '-') {
      next();
      return -parseUnary();
    }
    if (t && t.type === 'op' && t.value === '!') {
      next();
      return parseUnary() ? 0 : 1;
    }
    return parsePrimary();
  }

  function parsePrimary() {
    const t = peek();
    if (!t) return 0;

    if (t.type === 'number') {
      next();
      return t.value;
    }

    if (t.type === 'var') {
      next();
      // Check if it's a function call like random(10)
      const name = t.name.toLowerCase();
      if (peek() && peek().type === 'op' && peek().value === '(') {
        next(); // skip '('
        const arg = parseExpr();
        if (peek() && peek().type === 'op' && peek().value === ')') next(); // skip ')'

        // Built-in functions
        if (name === 'random') return Math.floor(Math.random() * arg);
        if (name === 'abs') return Math.abs(arg);
        if (name === 'sqrt' || name === 'raiz') return Math.sqrt(arg);
        if (name === 'floor' || name === 'entero') return Math.floor(arg);
        if (name === 'ceil') return Math.ceil(arg);
        if (name === 'round' || name === 'redondear') return Math.round(arg);
        if (name === 'sin') return Math.sin(arg);
        if (name === 'cos') return Math.cos(arg);
        if (name === 'tan') return Math.tan(arg);
        if (name === 'log' || name === 'ln') return Math.log(arg);
        if (name === 'exp') return Math.exp(arg);
        return arg; // unknown function, return argument
      }
      return resolveVar(t.name);
    }

    if (t.type === 'op' && t.value === '(') {
      next(); // skip '('
      const val = parseExpr();
      if (peek() && peek().type === 'op' && peek().value === ')') next(); // skip ')'
      return val;
    }

    // Unknown token, skip
    next();
    return 0;
  }

  return parseExpr();
}

// ============================================================
// Public API: safe expression evaluator
// ============================================================
function safeEvaluate(expr, vars) {
  const tokens = tokenize(expr, vars);
  return evaluateTokens(tokens, vars);
}

// ============================================================
// DFD Executor
// ============================================================
export class DfdExecutor {
  constructor(ast, onInput, onOutput) {
    this.ast = ast;
    this.variables = {};
    this.onInput = onInput;
    this.onOutput = onOutput;

    // Initialize variables
    if (this.ast.variables) {
      for (const v of this.ast.variables) {
        let val = parseFloat(v.initValue);
        this.variables[v.name] = isNaN(val) ? v.initValue : val;
      }
    }
  }

  evaluateExpression(expr) {
    try {
      return safeEvaluate(expr, this.variables);
    } catch (e) {
      console.warn('Error evaluating expression:', expr, e);
      // Fallback: simple string variable substitution
      let result = expr.replace(/'/g, '');
      for (const k of Object.keys(this.variables)) {
        result = result.replace(new RegExp(`\\b${k}\\b`, 'g'), String(this.variables[k]));
      }
      return result;
    }
  }

  async runNode(node) {
    switch (node.type) {
      case 'output': {
        const parts = node.text.split(/,(?=(?:(?:[^']*'){2})*[^']*$)/);
        let outText = '';
        for (const part of parts) {
          const trimmed = part.trim();
          if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
            outText += trimmed.slice(1, -1);
          } else {
            outText += this.evaluateExpression(trimmed);
          }
        }
        await this.onOutput(outText);
        break;
      }

      case 'input': {
        for (const v of node.variables) {
          const val = await this.onInput(`Ingrese valor para ${v}:`);
          const numVal = parseFloat(val);
          this.variables[v] = isNaN(numVal) ? val : numVal;
        }
        break;
      }

      case 'assignment': {
        for (const a of node.assignments) {
          this.variables[a.variable] = this.evaluateExpression(a.expression);
        }
        break;
      }

      case 'decision': {
        const conditionResult = this.evaluateExpression(node.condition);
        if (conditionResult) {
          await this.runNodes(node.trueBranch);
        } else {
          await this.runNodes(node.falseBranch);
        }
        break;
      }

      case 'while': {
        let safety = 0;
        while (this.evaluateExpression(node.condition)) {
          await this.runNodes(node.body);
          if (++safety > 10000) {
            await this.onOutput('[Error]: Bucle infinito detectado, deteniendo.');
            break;
          }
        }
        break;
      }
    }
  }

  async runNodes(nodes) {
    for (const node of nodes) {
      // Yield to browser event loop to prevent UI freezing
      await new Promise(resolve => setTimeout(resolve, 0));
      if (node.type === 'end' || node.type === 'return') break;
      await this.runNode(node);
    }
  }

  async execute() {
    await this.runNodes(this.ast.nodes);
    await this.onOutput('--- Ejecución Finalizada ---');
  }
}
