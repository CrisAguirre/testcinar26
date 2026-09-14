/**
 * DFD AST Executor
 * Evaluates DFD AST nodes step-by-step.
 */

export class DfdExecutor {
  constructor(ast, onInput, onOutput) {
    this.ast = ast;
    this.variables = {};
    this.onInput = onInput; // async function(varName) => returns string
    this.onOutput = onOutput; // async function(text)
    
    // Initialize variables
    if (this.ast.variables) {
      for (const v of this.ast.variables) {
        let val = parseFloat(v.initValue);
        this.variables[v.name] = isNaN(val) ? v.initValue : val;
      }
    }
  }

  // Basic JS expression evaluator with custom functions
  evaluateExpression(expr) {
    // Replace DFD-specific syntax
    let jsExpr = expr
      .replace(/random\((\d+)\)/gi, 'Math.floor(Math.random() * $1)')
      .replace(/=/g, '===') // DFD uses = for equality in conditions sometimes
      .replace(/!=====/g, '!==') // Fix if user wrote !=
      .replace(/>===/g, '>=')
      .replace(/<===/g, '<=');

    // Create a safe evaluation context using the variables
    const keys = Object.keys(this.variables);
    const values = keys.map(k => this.variables[k]);
    
    try {
      // eslint-disable-next-line no-new-func
      const func = new Function(...keys, `return ${jsExpr};`);
      return func(...values);
    } catch (e) {
      console.warn('Error evaluating expression:', expr, e);
      // Fallback simple string eval
      try {
        let safeStr = expr.replace(/'/g, "");
        for (const k of keys) {
           safeStr = safeStr.replace(new RegExp(`\\b${k}\\b`, 'g'), this.variables[k]);
        }
        return safeStr;
      } catch (err) {
         return expr;
      }
    }
  }

  async runNode(node) {
    switch (node.type) {
      case 'output': {
        // Output can be a mix of strings and variables like 'Total: ', total
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
        while (this.evaluateExpression(node.condition)) {
           await this.runNodes(node.body);
        }
        break;
      }
    }
  }

  async runNodes(nodes) {
    for (const node of nodes) {
      if (node.type === 'end' || node.type === 'return') break;
      await this.runNode(node);
    }
  }

  async execute() {
    await this.runNodes(this.ast.nodes);
    await this.onOutput('--- Ejecución Finalizada ---');
  }
}
