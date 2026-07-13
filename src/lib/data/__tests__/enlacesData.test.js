import { describe, it, expect } from 'vitest';
import {
  categories, getTagClass, filterCategories, getAllLinks
} from '../enlacesData.ts';

describe('categories', () => {
  it('tiene exactamente 4 categorías', () => {
    expect(categories.length).toBe(4);
  });

  it('cada categoría tiene title, icon, color, links', () => {
    for (const cat of categories) {
      expect(cat.title).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(cat.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(Array.isArray(cat.links)).toBe(true);
      expect(cat.links.length).toBeGreaterThan(0);
    }
  });

  it('cada título de categoría es único', () => {
    const titles = categories.map(c => c.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('Documentación y Tutoriales tiene 4 enlaces', () => {
    const cat = categories.find(c => c.title === 'Documentación y Tutoriales');
    expect(cat?.links.length).toBe(4);
  });

  it('IA y Aprendizaje tiene 4 enlaces', () => {
    const cat = categories.find(c => c.title === 'IA y Aprendizaje');
    expect(cat?.links.length).toBe(4);
  });

  it('Herramientas y Utilidades tiene 4 enlaces', () => {
    const cat = categories.find(c => c.title === 'Herramientas y Utilidades');
    expect(cat?.links.length).toBe(4);
  });

  it('Repositorios del Proyecto tiene 2 enlaces', () => {
    const cat = categories.find(c => c.title === 'Repositorios del Proyecto');
    expect(cat?.links.length).toBe(2);
  });
});

describe('links', () => {
  const allLinks = getAllLinks(categories);

  it('total de 14 enlaces', () => {
    expect(allLinks.length).toBe(14);
  });

  it('cada enlace tiene title, url, desc y tag', () => {
    for (const link of allLinks) {
      expect(link.title).toBeTruthy();
      expect(link.url).toBeTruthy();
      expect(link.desc).toBeTruthy();
      expect(link.tag).toBeTruthy();
    }
  });

  it('cada URL es válida (http/https)', () => {
    for (const link of allLinks) {
      expect(link.url).toMatch(/^https?:\/\//);
    }
  });

  it('cada título de enlace es único', () => {
    const titles = allLinks.map(l => l.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('cada URL de enlace es única', () => {
    const urls = allLinks.map(l => l.url);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe('getTagClass', () => {
  const known = ['Svelte', 'Video', 'Referencia', 'IA', 'Git', 'PDF', 'SEO', 'Opcional', 'Práctica', 'Herramienta', 'GitHub'];

  it('retorna clase para cada tag conocido', () => {
    for (const tag of known) {
      expect(getTagClass(tag)).toMatch(/^tag-/);
    }
  });

  it('retorna string vacío para tag desconocido', () => {
    expect(getTagClass('inexistente')).toBe('');
    expect(getTagClass('')).toBe('');
  });

  it('cada tag conocido tiene clase única', () => {
    const classes = known.map(t => getTagClass(t));
    expect(new Set(classes).size).toBe(classes.length);
  });

  it('tags usados en categorías tienen clase definida', () => {
    const usedTags = new Set(getAllLinks(categories).map(l => l.tag));
    for (const tag of usedTags) {
      expect(getTagClass(tag)).not.toBe('');
    }
  });
});

describe('filterCategories', () => {
  it('retorna todas las categorías con query vacío', () => {
    const result = filterCategories(categories, '');
    expect(result.length).toBe(4);
  });

  it('retorna todas las categorías con query de solo espacios', () => {
    const result = filterCategories(categories, '   ');
    expect(result.length).toBe(4);
  });

  it('filtra por título de enlace', () => {
    const result = filterCategories(categories, 'Svelte');
    expect(result.length).toBeGreaterThanOrEqual(1);
    const links = getAllLinks(result);
    const matched = links.filter(l => l.title.toLowerCase().includes('svelte'));
    expect(matched.length).toBeGreaterThanOrEqual(1);
  });

  it('filtra por descripción', () => {
    const result = filterCategories(categories, 'tutorial interactivo');
    expect(getAllLinks(result).length).toBeGreaterThanOrEqual(1);
  });

  it('filtra por tag', () => {
    const result = filterCategories(categories, 'GitHub');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Repositorios del Proyecto');
    expect(result[0].links.length).toBe(2);
  });

  it('filtra sin distinguir mayúsculas/minúsculas', () => {
    const result = filterCategories(categories, 'svelte');
    const resultUpper = filterCategories(categories, 'SVELTE');
    expect(result.length).toBe(resultUpper.length);
  });

  it('retorna arreglo vacío si no hay coincidencias', () => {
    const result = filterCategories(categories, 'xyz123noexiste');
    expect(result.length).toBe(0);
  });

  it('filtra enlaces dentro de categorías, no elimina categorías sin match', () => {
    const result = filterCategories(categories, 'scrum');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('IA y Aprendizaje');
  });

  it('coincidencia parcial funciona', () => {
    const result = filterCategories(categories, 'skilljar');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('IA y Aprendizaje');
    const links = getAllLinks(result);
    expect(links.length).toBe(1);
    expect(links[0].title).toBe('Anthropic Skilljar — Tutoriales de IA');
  });
});

describe('getAllLinks', () => {
  it('retorna 14 enlaces totales', () => {
    expect(getAllLinks(categories).length).toBe(14);
  });

  it('retorna arreglo vacío para categorías sin enlaces', () => {
    expect(getAllLinks([])).toEqual([]);
  });
});
