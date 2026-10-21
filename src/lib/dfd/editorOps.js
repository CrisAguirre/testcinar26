/**
 * Operaciones puras del editor DFD: navegación por rutas y decisión de
 * inserción desde la paleta. Se separaron del componente para poder probarlas.
 */

/**
 * @param {any} root
 * @param {(number | string)[] | null | undefined} path
 * @returns {any | null}
 */
export function getNodeByPath(root, path) {
  if (!root || !path) return null;
  let list = root.nodes;
  let node = null;
  for (let k = 0; k < path.length; k++) {
    const seg = path[k];
    if (typeof seg === 'number') {
      node = list?.[seg] ?? null;
      if (!node) return null;
      if (k === path.length - 1) return node;
    } else {
      if (!node) return null;
      if (seg === 'true') list = node.trueBranch;
      else if (seg === 'false') list = node.falseBranch;
      else if (seg === 'body') list = node.body;
      else return null;
      node = null;
    }
  }
  return node;
}

/**
 * @param {any} root
 * @param {(number | string)[] | null | undefined} path
 * @returns {any[] | null}
 */
export function getParentList(root, path) {
  if (!root || !path || path.length === 0) return null;
  if (path.length === 1) return root.nodes;
  const parentPath = path.slice(0, -1);
  let list = root.nodes;
  let node = null;
  for (let k = 0; k < parentPath.length; k++) {
    const seg = parentPath[k];
    if (typeof seg === 'number') {
      node = list?.[seg] ?? null;
      if (!node) return null;
    } else {
      if (!node) return null;
      if (seg === 'true') list = node.trueBranch;
      else if (seg === 'false') list = node.falseBranch;
      else if (seg === 'body') list = node.body;
      else return null;
      node = null;
    }
  }
  return list;
}

/**
 * Decide dónde insertar un componente cuando se hace clic en la paleta.
 *
 * Reglas:
 * - Sin selección: antes del `end` del flujo principal (comportamiento previo).
 * - Mientras seleccionado: al final de su cuerpo.
 * - Cualquier nodo seleccionado dentro de una rama o cuerpo: justo después de él.
 *   Esto cubre ramas `true`, `false`, `body` y anidamientos.
 * - Decisión seleccionada en el nivel principal: al final de su rama `Sí`.
 *
 * @param {any} ast
 * @param {(number | string)[] | null | undefined} selectedPath
 * @returns {{ list: any[]; index: number } | null}
 */
export function resolvePaletteInsertion(ast, selectedPath) {
  if (!ast || !Array.isArray(ast.nodes)) return null;

  const mainTarget = () => ({
    list: ast.nodes,
    index: Math.max(0, ast.nodes.length - 1)
  });

  if (!selectedPath) return mainTarget();

  const node = getNodeByPath(ast, selectedPath);
  if (!node) return mainTarget();

  if (node.type === 'while') {
    if (!Array.isArray(node.body)) node.body = [];
    return { list: node.body, index: node.body.length };
  }

  // Nodo dentro de una rama/cuerpo: insertar inmediatamente después.
  if (selectedPath.length > 1) {
    const list = getParentList(ast, selectedPath);
    const idx = selectedPath[selectedPath.length - 1];
    if (Array.isArray(list) && typeof idx === 'number') {
      return { list, index: idx + 1 };
    }
  }

  if (node.type === 'decision') {
    if (!Array.isArray(node.trueBranch)) node.trueBranch = [];
    return { list: node.trueBranch, index: node.trueBranch.length };
  }

  return mainTarget();
}
