import fs from 'node:fs';
import { describe, it, expect } from 'vitest';
import { analyzeDfd } from '../../../../scripts/grade-algo-p1.mjs';

describe('grade-algo-p1: casos de prueba DFD', () => {
  it('el Problema 1 de ejemplo (suma/resta/mult/div) pasa la pregunta 101', async () => {
    const text = fs.readFileSync(new URL('../../../../static/dfd/nivel1/Problema 1.dfd', import.meta.url), 'utf8');
    const result = await analyzeDfd(101, text);
    expect(result.parseOk).toBe(true);
    expect(result.suggested).toBe(1);
    expect(result.cases.every((c) => c.ok)).toBe(true);
  });

  it('un archivo vacío o inválido se marca 0', async () => {
    const result = await analyzeDfd(101, '');
    expect(result.parseOk).toBe(false);
    expect(result.suggested).toBe(0);
  });
});
