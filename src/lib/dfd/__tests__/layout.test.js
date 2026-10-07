import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const PATH = 'src/routes/algoritmos/dfd/+page.svelte';
const src = readFileSync(PATH, 'utf8');

describe('layout desktop del editor DFD', () => {
  it('amplía el lienzo solo en desktop (1280px y Full HD)', () => {
    expect(src).toMatch(/@media\s*\(min-width:\s*1280px\)/);
    expect(src).toMatch(/@media\s*\(min-width:\s*1600px\)/);
  });

  it('da más alto al lienzo en pantallas bajas tipo 1366x768', () => {
    expect(src).toMatch(/@media\s*\(min-width:\s*1280px\)\s*and\s*\(max-height:\s*800px\)/);
  });

  it('conserva los anchos base de los paneles', () => {
    expect(src).toMatch(/\.sidebar\s*\{\s*width:\s*240px/);
    expect(src).toMatch(/\.props-panel\s*\{\s*width:\s*270px/);
  });
});

describe('layout móvil/tablet intacto', () => {
  it('mantiene el apilado en max-width 860px', () => {
    expect(src).toMatch(/@media\s*\(max-width:\s*860px\)/);
    expect(src).toMatch(/\.layout\s*\{\s*flex-direction:\s*column/);
  });

  it('mantiene el ajuste intermedio en max-width 1100px', () => {
    expect(src).toMatch(/@media\s*\(max-width:\s*1100px\)/);
  });
});
