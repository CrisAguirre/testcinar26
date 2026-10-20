import { describe, it, expect } from 'vitest';
import { parseDfd, serializeDfd } from '../parser.js';
import { buildRenderData } from '../renderer.js';
import { DfdExecutor } from '../executor.js';

describe('DFD While (Ciclo Mientras): renderizado y dropzones', () => {
  it('un Mientras vacío genera zona de soltado interior separada y flechas Sí y No', () => {
    const ast = {
      variables: [],
      nodes: [
        { type: 'while', condition: 'contador <= 5', body: [] },
        { type: 'end' }
      ]
    };
    const data = buildRenderData(ast);

    // Debe haber flecha Sí hacia el cuerpo y flecha No de salida
    const siLink = data.links.find((l) => l.label === 'Sí');
    const noLink = data.links.find((l) => l.label === 'No');
    expect(siLink).toBeDefined();
    expect(noLink).toBeDefined();

    // Las zonas de soltado del cuerpo y la posterior NO deben solaparse
    const bodyZone = data.dropZones.find((dz) => dz.targetList === ast.nodes[0].body);
    const afterZone = data.dropZones.find((dz) => dz.targetList === ast.nodes && dz.index === 1);
    expect(bodyZone).toBeDefined();
    expect(afterZone).toBeDefined();
    expect(bodyZone.cy).not.toEqual(afterZone.cy);
    expect(Math.abs(bodyZone.cy - afterZone.cy)).toBeGreaterThanOrEqual(40);
  });

  it('un Mientras con instrucciones genera flecha Sí hacia el primer nodo del cuerpo y No de salida', () => {
    const ast = {
      variables: [],
      nodes: [
        {
          type: 'while',
          condition: 'i <= 10',
          body: [
            { type: 'output', text: 'i' },
            { type: 'assignment', assignments: [{ variable: 'i', expression: 'i+1' }] }
          ]
        },
        { type: 'end' }
      ]
    };
    const data = buildRenderData(ast);
    const siLink = data.links.find((l) => l.label === 'Sí');
    const noLink = data.links.find((l) => l.label === 'No');
    const loopBack = data.links.find((l) => l.isLoop === true);

    expect(siLink).toBeDefined();
    expect(noLink).toBeDefined();
    expect(loopBack).toBeDefined();
  });
});

describe('DFD While (Ciclo Mientras): evaluación de condiciones y strings', () => {
  it('soporta operador <> (diferente de) numérico y cadenas', () => {
    const exec = new DfdExecutor({ variables: [] }, async () => '', async () => {});
    exec.variables = { i: 5, clave: 2026, x: 's' };

    expect(exec.evaluateExpression('i <> 10')).toBe(1);
    expect(exec.evaluateExpression('clave <> 2026')).toBe(0);
    expect(exec.evaluateExpression('x <> "n"')).toBe(1);
    expect(exec.evaluateExpression('x <> "s"')).toBe(0);
  });

  it('soporta literales de cadena entre comillas simples y dobles', () => {
    const exec = new DfdExecutor({ variables: [] }, async () => '', async () => {});
    exec.variables = { letra: 's', respuesta: 'SI' };

    expect(exec.evaluateExpression("letra == 's'")).toBe(1);
    expect(exec.evaluateExpression("letra = 's'")).toBe(1);
    expect(exec.evaluateExpression("letra != 'n'")).toBe(1);
    expect(exec.evaluateExpression("respuesta == 'si'")).toBe(1); // case-insensitive
  });

  it('ejecuta un ciclo Mientras de 1 a 5 correctamente', async () => {
    const ast = {
      variables: [],
      nodes: [
        { type: 'assignment', assignments: [{ variable: 'i', expression: '1' }] },
        {
          type: 'while',
          condition: 'i <= 5',
          body: [
            { type: 'assignment', assignments: [{ variable: 'i', expression: 'i + 1' }] }
          ]
        },
        { type: 'end' }
      ]
    };

    const outputs = [];
    const exec = new DfdExecutor(ast, async () => '', async (t) => outputs.push(t));
    await exec.execute();

    expect(exec.variables.i).toBe(6);
  });
});
