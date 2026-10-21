import { describe, it, expect } from 'vitest';
import { getNodeByPath, getParentList, resolvePaletteInsertion } from '../editorOps.js';

/** @param {any} target @returns {any} */
function requireTarget(target) {
  if (!target) throw new Error('Se esperaba un destino de inserción');
  return target;
}

describe('editorOps: inserción desde la paleta', () => {
  it('sin selección inserta antes del fin del flujo principal', () => {
    const ast = { variables: [], nodes: [{ type: 'process' }, { type: 'end' }] };
    const target = requireTarget(resolvePaletteInsertion(ast, null));

    expect(target.list).toBe(ast.nodes);
    expect(target.index).toBe(1);
  });

  it('con un Mientras seleccionado inserta al final de su cuerpo', () => {
    const whileNode = {
      type: 'while',
      condition: 'i <= 5',
      body: [{ type: 'output', text: 'i' }]
    };
    const ast = { variables: [], nodes: [whileNode, { type: 'end' }] };
    const target = requireTarget(resolvePaletteInsertion(ast, [0]));

    expect(target.list).toBe(whileNode.body);
    expect(target.index).toBe(1);
  });

  it('con una Decisión seleccionada en el nivel principal inserta en la rama Sí', () => {
    const decision = {
      type: 'decision',
      condition: 'x > 0',
      trueBranch: [{ type: 'output', text: 'positivo' }],
      falseBranch: []
    };
    const ast = { variables: [], nodes: [decision, { type: 'end' }] };
    const target = requireTarget(resolvePaletteInsertion(ast, [0]));

    expect(target.list).toBe(decision.trueBranch);
    expect(target.index).toBe(1);
  });

  it('con un nodo seleccionado dentro de la rama No inserta justo después de él', () => {
    const decision = {
      type: 'decision',
      condition: 'x > 0',
      trueBranch: [],
      falseBranch: [{ type: 'output', text: 'negativo' }]
    };
    const ast = { variables: [], nodes: [decision, { type: 'end' }] };
    const target = requireTarget(resolvePaletteInsertion(ast, [0, 'false', 0]));

    expect(target.list).toBe(decision.falseBranch);
    expect(target.index).toBe(1);
  });

  it('con un nodo dentro de una rama anidada inserta en esa misma rama', () => {
    const nestedDecision = {
      type: 'decision',
      condition: 'x > 0',
      trueBranch: [{ type: 'output', text: 'positivo' }],
      falseBranch: []
    };
    const whileNode = {
      type: 'while',
      condition: 'i < 3',
      body: [
        { type: 'assignment', assignments: [{ variable: 'i', expression: 'i + 1' }] },
        nestedDecision
      ]
    };
    const ast = { variables: [], nodes: [whileNode, { type: 'end' }] };
    const target = requireTarget(resolvePaletteInsertion(ast, [0, 'body', 1, 'true', 0]));

    expect(target.list).toBe(nestedDecision.trueBranch);
    expect(target.index).toBe(1);
  });

  it('con un Mientras anidado seleccionado inserta en su propio cuerpo', () => {
    const nestedWhile = {
      type: 'while',
      condition: 'j < 2',
      body: [{ type: 'assignment', assignments: [{ variable: 'j', expression: 'j + 1' }] }]
    };
    const outerWhile = {
      type: 'while',
      condition: 'i < 2',
      body: [nestedWhile]
    };
    const ast = { variables: [], nodes: [outerWhile, { type: 'end' }] };
    const target = requireTarget(resolvePaletteInsertion(ast, [0, 'body', 0]));

    expect(target.list).toBe(nestedWhile.body);
    expect(target.index).toBe(1);
  });

  it('una ruta inválida cae de forma segura al flujo principal', () => {
    const ast = { variables: [], nodes: [{ type: 'process' }, { type: 'end' }] };
    const target = requireTarget(resolvePaletteInsertion(ast, [99]));

    expect(target.list).toBe(ast.nodes);
    expect(target.index).toBe(1);
  });
});

describe('editorOps: navegación por rutas', () => {
  it('getNodeByPath y getParentList respetan las ramas', () => {
    const output = { type: 'output', text: 'hola' };
    const decision = {
      type: 'decision',
      condition: 'x > 0',
      trueBranch: [],
      falseBranch: [output]
    };
    const ast = { variables: [], nodes: [decision, { type: 'end' }] };

    expect(getNodeByPath(ast, [0, 'false', 0])).toBe(output);
    expect(getParentList(ast, [0, 'false', 0])).toBe(decision.falseBranch);
  });
});
