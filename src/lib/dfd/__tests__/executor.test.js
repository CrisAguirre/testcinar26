import { describe, it, expect } from 'vitest';
import { DfdExecutor } from '../executor.js';

function executorWith(variables = []) {
  return new DfdExecutor(
    { variables, nodes: [] },
    async () => '',
    async () => {}
  );
}

describe('DfdExecutor: palabras clave vs. variables', () => {
  it('un variable llamada div conserva su valor (no se interpreta como operador)', () => {
    const ex = executorWith([{ name: 'div', initValue: '4' }]);
    expect(ex.evaluateExpression('div')).toBe(4);
    expect(ex.evaluateExpression('div + 1')).toBe(5);
  });

  it('las variables y, o, mod no se confunden con operadores', () => {
    const ex = executorWith([
      { name: 'y', initValue: '2' },
      { name: 'o', initValue: '3' },
      { name: 'mod', initValue: '5' }
    ]);
    expect(ex.evaluateExpression('y')).toBe(2);
    expect(ex.evaluateExpression('o')).toBe(3);
    expect(ex.evaluateExpression('mod')).toBe(5);
  });

  it('sin variable declarada, div/mod siguen funcionando como operadores', () => {
    const ex = executorWith();
    expect(ex.evaluateExpression('8 div 2')).toBe(4);
    expect(ex.evaluateExpression('9 mod 2')).toBe(1);
  });
});
