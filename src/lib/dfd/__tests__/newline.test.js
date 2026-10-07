import { describe, it, expect } from 'vitest';
import { parseDfd, serializeDfd } from '../parser.js';
import { buildRenderData } from '../renderer.js';
import { generatePseudocode } from '../pseudocode.js';
import { DfdExecutor } from '../executor.js';

const BASE_AST = {
  variables: [],
  nodes: [
    { type: 'input', variables: ['pesos'] },
    { type: 'newline' },
    { type: 'output', text: "'Dolares: ', dolares" },
    { type: 'end' }
  ]
};

describe('salto de línea: serialize/parse roundtrip', () => {
  it('serializa como llamada SaltoLinea compatible con FreeDFD', () => {
    const text = serializeDfd(BASE_AST);
    expect(text).toMatch(/SaltoLinea/);
    expect(text).toContain('\r\n');
  });

  it('parsea SaltoLinea como newline (insensible a mayúsculas)', () => {
    const text = serializeDfd(BASE_AST);
    const parsed = parseDfd(text);
    expect(parsed.error).toBeFalsy();
    const types = parsed.nodes.map((n) => n.type);
    expect(types).toContain('newline');
    expect(types).toContain('input');
    expect(types).toContain('output');
  });

  it('un archivo sin saltos no inventa newlines', () => {
    const text = serializeDfd({ variables: [], nodes: [{ type: 'output', text: "'hola'" }, { type: 'end' }] });
    const parsed = parseDfd(text);
    expect(parsed.nodes.map((n) => n.type)).not.toContain('newline');
  });
});

describe('salto de línea: renderer', () => {
  it('genera una figura newline con etiqueta ⏎', () => {
    const data = buildRenderData(BASE_AST);
    const shape = data.shapes.find((s) => s.type === 'newline');
    expect(shape).toBeDefined();
    expect(shape.text).toMatch(/Salto de línea/);
  });

  it('también funciona dentro de ramas y cuerpos', () => {
    const ast = {
      variables: [],
      nodes: [
        { type: 'decision', condition: 'x > 0', trueBranch: [{ type: 'newline' }], falseBranch: [], flag: 0 },
        { type: 'end' }
      ]
    };
    const data = buildRenderData(ast);
    expect(data.shapes.some((s) => s.type === 'newline')).toBe(true);
  });
});

describe('salto de línea: pseudocódigo', () => {
  it("emite Escribir '' // salto de línea", () => {
    const pseudo = generatePseudocode(BASE_AST, 'monedas.dfd');
    expect(pseudo).toMatch(/Escribir '' \/\/ salto de línea/);
    expect(pseudo).toMatch(/^Algoritmo monedas/m);
  });
});

describe('salto de línea: executor', () => {
  it('emite una línea en blanco sin pedir nada', async () => {
    const outputs = [];
    const ex = new DfdExecutor(
      { variables: [], nodes: [{ type: 'newline' }, { type: 'end' }] },
      async () => '1',
      async (t) => { outputs.push(t); }
    );
    await ex.execute();
    expect(outputs).toContain('');
    expect(outputs[outputs.length - 1]).toMatch(/Finalizada/);
  });

  it('resalta el paso (onStep con path) igual que otros nodos', async () => {
    const paths = [];
    const ex = new DfdExecutor(
      { variables: [], nodes: [{ type: 'newline' }, { type: 'end' }] },
      async () => '1',
      async () => {},
      async (p) => { paths.push(p); }
    );
    await ex.execute();
    expect(paths.length).toBeGreaterThan(0);
    expect(paths[0]).toEqual([0]);
  });
});
