export interface LinkItem {
  title: string;
  url: string;
  desc: string;
  tag: string;
}

export interface Category {
  title: string;
  icon: string;
  color: string;
  links: LinkItem[];
}

export const categories: Category[] = [
  {
    title: 'Documentación y Tutoriales',
    icon: '📚',
    color: '#3b82f6',
    links: [
      { title: 'Svelte — Documentación Oficial', url: 'https://svelte.dev/tutorial/svelte/welcome-to-svelte', desc: 'Guía oficial y tutorial interactivo de Svelte 5', tag: 'Svelte' },
      { title: 'Tutorial Completo de Svelte', url: 'https://www.youtube.com/watch?v=pze2JJj82XA&list=PLTd5ehIj0goM-5mQxXLmCr5nHZX_yc2QT', desc: 'Lista de reproducción con tutorial paso a paso de Svelte', tag: 'Video' },
      { title: 'Component Party — Svelte 5', url: 'https://component-party.dev/?f=svelte5#templating.loop', desc: 'Comparativa visual de componentes entre frameworks', tag: 'Referencia' },
      { title: 'Opencode — Tutorial', url: 'https://www.youtube.com/watch?v=ZZq4TpNgnvg&t=900s', desc: 'Aprende a usar Opencode como asistente de desarrollo', tag: 'Video' }
    ]
  },
  {
    title: 'IA y Aprendizaje',
    icon: '🤖',
    color: '#8b5cf6',
    links: [
      { title: 'Anthropic Skilljar — Tutoriales de IA', url: 'https://anthropic.skilljar.com/', desc: 'Cursos oficiales de Anthropic sobre inteligencia artificial', tag: 'IA' },
      { title: 'Novedades ES2024 — ES2025', url: 'https://www.youtube.com/watch?v=v6WZI1Zs9aY', desc: 'Las últimas características de JavaScript explicadas', tag: 'Video' },
      { title: 'FreeCodeCamp — 10 Comandos de Git', url: 'https://www.freecodecamp.org/espanol/news/10-comandos-de-git-que-todo-desarrollador-deberia-saber/', desc: 'Guía esencial de comandos de Git para desarrolladores', tag: 'Git' },
      { title: 'Guía Scrum', url: 'https://drive.google.com/file/d/19is_XbX2ml9Du1tJ9jspwOCiwj6loLeu/view?usp=sharing', desc: 'Documento completo con la guía de metodología Scrum', tag: 'PDF' }
    ]
  },
  {
    title: 'Herramientas y Utilidades',
    icon: '🛠️',
    color: '#059669',
    links: [
      { title: 'SEO Studio Tools', url: 'https://seostudio.tools/es', desc: 'Suite de herramientas SEO para análisis y optimización web', tag: 'SEO' },
      { title: 'Coddy — Aprende Programación', url: 'https://coddy.tech/', desc: 'Plataforma interactiva para aprender a programar', tag: 'Opcional' },
      { title: 'Exercism — Trazabilidad de Componentes', url: 'https://exercism.org/', desc: 'Ejercicios prácticos de programación en múltiples lenguajes', tag: 'Práctica' },
      { title: 'Portal de Evaluaciones', url: 'https://examscinar2026.vercel.app/', desc: 'Acceso al portal de evaluaciones y exámenes', tag: 'Herramienta' },
      { title: 'alg0.dev — Visualizador de Algoritmos', url: 'https://www.alg0.dev/es/', desc: 'Plataforma interactiva para aprender y visualizar algoritmos en español', tag: 'Herramienta' }
    ]
  },
  {
    title: 'Repositorios del Proyecto',
    icon: '💻',
    color: '#dc2626',
    links: [
      { title: 'Front-end — testcinar26', url: 'https://github.com/CrisAguirre/testcinar26', desc: 'Repositorio del frontend con SvelteKit', tag: 'GitHub' },
      { title: 'Back-end — testcinar26bknd', url: 'https://github.com/CrisAguirre/testcinar26bknd', desc: 'Repositorio del backend con Express y MongoDB', tag: 'GitHub' },
      { title: 'Deploy Front-end — Vercel', url: 'https://vercel.com/crisaguirres-projects/examscinar2026', desc: 'Despliegue del frontend en Vercel', tag: 'Herramienta' },
      { title: 'Deploy Back-end — Render', url: 'https://dashboard.render.com/web/srv-d9a5lst8nd3s73agud80', desc: 'Despliegue del backend en Render', tag: 'Herramienta' }
    ]
  }
];

export function getTagClass(tag: string): string {
  const map: Record<string, string> = {
    'Svelte': 'tag-svelte',
    'Video': 'tag-video',
    'Referencia': 'tag-ref',
    'IA': 'tag-ai',
    'Git': 'tag-git',
    'PDF': 'tag-pdf',
    'SEO': 'tag-seo',
    'Opcional': 'tag-opt',
    'Práctica': 'tag-practice',
    'Herramienta': 'tag-tool',
    'GitHub': 'tag-gh'
  };
  return map[tag] || '';
}

export function filterCategories(cats: Category[], query: string): Category[] {
  if (!query.trim()) return cats;
  const q = query.toLowerCase();
  return cats
    .map(c => ({
      ...c,
      links: c.links.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.desc.toLowerCase().includes(q) ||
        l.tag.toLowerCase().includes(q)
      )
    }))
    .filter(c => c.links.length > 0);
}

export function getAllLinks(cats: Category[]): LinkItem[] {
  return cats.flatMap(c => c.links);
}
