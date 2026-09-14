/**
 * DFD SVG Renderer – v2
 * Produces a clean, vertically-centred flowchart with proper branching.
 *
 * The algorithm works in two passes:
 *   1. **Measure** – walk the AST and compute the width/height each sub-tree
 *      will require.  Decisions propagate the max width of their two branches.
 *   2. **Place** – assign absolute (x, y) positions top-down, centring each
 *      block within its allocated column.
 */

const NODE_H = 48;
const DECISION_H = 56;
const V_GAP = 36;
const H_GAP = 40;
const MIN_NODE_W = 140;
const MAX_NODE_W = 280;
const CHAR_W = 7.2;          // approx px per character for label sizing
const PADDING_X = 24;        // horizontal text padding inside a shape

// ── helpers ──────────────────────────────────────────────────────────────────

function labelFor(node) {
  if (node.type === 'output')     return node.text || '';
  if (node.type === 'input')      return node.variables.join(', ');
  if (node.type === 'assignment') return node.assignments.map(a => `${a.variable} ← ${a.expression}`).join('\n');
  if (node.type === 'decision')   return node.condition || '';
  if (node.type === 'while')      return node.condition || '';
  if (node.type === 'call')       return `${node.funcName}(${node.params})`;
  return '';
}

function nodeWidth(label) {
  const lines = label.split('\n');
  const longest = Math.max(...lines.map(l => l.length));
  return Math.min(MAX_NODE_W, Math.max(MIN_NODE_W, longest * CHAR_W + PADDING_X * 2));
}

// ── Pass 1: measure sub-tree widths ─────────────────────────────────────────

function measureNodes(nodes) {
  let maxW = 0;
  let totalH = 0;

  for (const node of nodes) {
    if (node.type === 'end' || node.type === 'return') break;

    const label = labelFor(node);
    const w = nodeWidth(label);
    const h = node.type === 'decision' ? DECISION_H : NODE_H;

    if (node.type === 'decision') {
      const mTrue  = measureNodes(node.trueBranch  || []);
      const mFalse = measureNodes(node.falseBranch || []);
      const branchW = Math.max(w, mTrue.width + H_GAP + mFalse.width);
      maxW = Math.max(maxW, branchW);
      const branchH = Math.max(mTrue.height, mFalse.height);
      totalH += h + V_GAP + (branchH > 0 ? branchH + V_GAP : 0);
    } else if (node.type === 'while') {
      const mBody = measureNodes(node.body || []);
      const loopW = Math.max(w, mBody.width) + 60; // extra for loop-back arrow
      maxW = Math.max(maxW, loopW);
      totalH += h + V_GAP + (mBody.height > 0 ? mBody.height + V_GAP : 0);
    } else {
      maxW = Math.max(maxW, w);
      totalH += h + V_GAP;
    }
  }
  return { width: maxW, height: totalH };
}

// ── Pass 2: place shapes ────────────────────────────────────────────────────

let _id = 0;

function placeNodes(nodes, cx, startY, shapes, links, parentId) {
  let y = startY;
  let prevId = parentId;

  for (const node of nodes) {
    if (node.type === 'end' || node.type === 'return') break;

    const id = `n${_id++}`;
    const label = labelFor(node);
    const w = nodeWidth(label);

    // ── Decision ────────────────────────────────────────────────────────
    if (node.type === 'decision') {
      const h = DECISION_H;
      shapes.push({ id, type: 'decision', text: label, x: cx, y, width: w, height: h });
      if (prevId) links.push(makeLink(prevId, id, shapes));

      const mTrue  = measureNodes(node.trueBranch  || []);
      const mFalse = measureNodes(node.falseBranch || []);

      const leftW  = Math.max(MIN_NODE_W, mTrue.width);
      const rightW = Math.max(MIN_NODE_W, mFalse.width);

      const branchY = y + h + V_GAP;

      // TRUE branch (left side)
      const trueCx = cx - leftW / 2 - H_GAP / 2;
      let trueLastId = null;
      let trueEndY = branchY;
      if (node.trueBranch && node.trueBranch.length > 0 && node.trueBranch[0].type !== 'end') {
        const res = placeNodes(node.trueBranch, trueCx, branchY, shapes, links, null);
        trueLastId = res.lastId;
        trueEndY = res.endY;
        // link decision → first true node
        links.push(makeSideLink(id, res.firstId, shapes, 'Sí', 'left'));
      } else {
        trueLastId = id;
        links.push(makeLabelledVertLink(id, null, shapes, 'Sí', 'left', cx, y + h, trueCx, branchY));
      }

      // FALSE branch (right side)
      const falseCx = cx + rightW / 2 + H_GAP / 2;
      let falseLastId = null;
      let falseEndY = branchY;
      if (node.falseBranch && node.falseBranch.length > 0 && node.falseBranch[0].type !== 'end') {
        const res = placeNodes(node.falseBranch, falseCx, branchY, shapes, links, null);
        falseLastId = res.lastId;
        falseEndY = res.endY;
        links.push(makeSideLink(id, res.firstId, shapes, 'No', 'right'));
      } else {
        falseLastId = id;
        links.push(makeLabelledVertLink(id, null, shapes, 'No', 'right', cx, y + h, falseCx, branchY));
      }

      // Merge point
      const mergeY = Math.max(trueEndY, falseEndY) + V_GAP;
      const mergeId = `merge_${id}`;
      // invisible merge point
      shapes.push({ id: mergeId, type: 'merge', text: '', x: cx, y: mergeY, width: 0, height: 0 });

      if (trueLastId && trueLastId !== id) {
        links.push(makeMergeLink(trueLastId, mergeId, shapes, cx));
      } else if (trueLastId === id) {
        // empty true branch – draw line from branch entry down to merge
        links.push({ sourceX: trueCx, sourceY: branchY, targetX: cx, targetY: mergeY });
      }

      if (falseLastId && falseLastId !== id) {
        links.push(makeMergeLink(falseLastId, mergeId, shapes, cx));
      } else if (falseLastId === id) {
        links.push({ sourceX: falseCx, sourceY: branchY, targetX: cx, targetY: mergeY });
      }

      y = mergeY;
      prevId = mergeId;

    // ── While loop ──────────────────────────────────────────────────────
    } else if (node.type === 'while') {
      const h = DECISION_H;
      shapes.push({ id, type: 'while', text: label, x: cx, y, width: w, height: h });
      if (prevId) links.push(makeLink(prevId, id, shapes));

      const bodyY = y + h + V_GAP;
      if (node.body && node.body.length > 0 && node.body[0].type !== 'end') {
        const res = placeNodes(node.body, cx, bodyY, shapes, links, id);
        // loop-back arrow from last body node back to while
        if (res.lastId) {
          links.push(makeLoopBack(res.lastId, id, shapes, cx, w));
        }
      }

      // Exit link to the right (will point down past the body)
      const mBody = measureNodes(node.body || []);
      y = bodyY + (mBody.height > 0 ? mBody.height : 0) + V_GAP;
      const exitId = `exit_${id}`;
      shapes.push({ id: exitId, type: 'merge', text: '', x: cx, y, width: 0, height: 0 });
      links.push(makeExitWhile(id, exitId, shapes, cx, w, y));
      prevId = exitId;

    // ── Standard blocks ─────────────────────────────────────────────────
    } else {
      let shapeType = 'process';
      if (node.type === 'output')     shapeType = 'output';
      if (node.type === 'input')      shapeType = 'input';
      if (node.type === 'call')       shapeType = 'call';

      shapes.push({ id, type: shapeType, text: label, x: cx, y, width: w, height: NODE_H });
      if (prevId) links.push(makeLink(prevId, id, shapes));

      y += NODE_H + V_GAP;
      prevId = id;
    }
  }

  // Return tracking info
  const firstShape = shapes.find(s => s.id === `n${_id - nodes.filter(n => n.type !== 'end' && n.type !== 'return').length}`);
  return { lastId: prevId, endY: y, firstId: shapes.length > 0 ? findFirstPlacedId(nodes, shapes) : null };
}

function findFirstPlacedId(nodes, shapes) {
  for (const node of nodes) {
    if (node.type === 'end' || node.type === 'return') continue;
    // The first node placed should be the one matching
    const placed = shapes.find(s => {
      if (node.type === 'decision') return s.type === 'decision' && s.text === (node.condition || '');
      if (node.type === 'while') return s.type === 'while' && s.text === (node.condition || '');
      if (node.type === 'output') return s.type === 'output' && s.text === (node.text || '');
      if (node.type === 'input') return s.type === 'input' && s.text === node.variables.join(', ');
      return false;
    });
    if (placed) return placed.id;
    // fallback: return last non-merge shape
    break;
  }
  return null;
}

// ── Link builders ───────────────────────────────────────────────────────────

function getCenter(id, shapes) {
  const s = shapes.find(sh => sh.id === id);
  if (!s) return { cx: 0, top: 0, bottom: 0, left: 0, right: 0 };
  return {
    cx: s.x,
    top: s.y,
    bottom: s.y + s.height,
    left: s.x - s.width / 2,
    right: s.x + s.width / 2
  };
}

function makeLink(fromId, toId, shapes) {
  const from = getCenter(fromId, shapes);
  const to = getCenter(toId, shapes);
  return { sourceX: from.cx, sourceY: from.bottom, targetX: to.cx, targetY: to.top };
}

function makeSideLink(fromId, toId, shapes, label, side) {
  const from = getCenter(fromId, shapes);
  const to = getCenter(toId, shapes);
  const sx = side === 'left' ? from.left : from.right;
  return { sourceX: sx, sourceY: from.top + (from.bottom - from.top) / 2, targetX: to.cx, targetY: to.top, label };
}

function makeLabelledVertLink(fromId, toId, shapes, label, side, cx, sy, tx, ty) {
  const from = getCenter(fromId, shapes);
  const sx = side === 'left' ? from.left : from.right;
  return { sourceX: sx, sourceY: from.top + (from.bottom - from.top) / 2, targetX: tx, targetY: ty, label };
}

function makeMergeLink(fromId, mergeId, shapes, mergeCx) {
  const from = getCenter(fromId, shapes);
  return { sourceX: from.cx, sourceY: from.bottom, targetX: mergeCx, targetY: getCenter(mergeId, shapes).top };
}

function makeLoopBack(fromId, whileId, shapes, cx, w) {
  const from = getCenter(fromId, shapes);
  const to = getCenter(whileId, shapes);
  return {
    sourceX: from.cx, sourceY: from.bottom,
    targetX: to.cx, targetY: to.top,
    isLoop: true,
    loopOffsetX: w / 2 + 30
  };
}

function makeExitWhile(whileId, exitId, shapes, cx, w, exitY) {
  const from = getCenter(whileId, shapes);
  return {
    sourceX: from.right, sourceY: from.top + (from.bottom - from.top) / 2,
    targetX: cx, targetY: exitY,
    label: 'No'
  };
}

// ── Public entry point ──────────────────────────────────────────────────────

export function buildRenderData(ast) {
  _id = 0;
  const shapes = [];
  const links = [];

  // Measure total width
  const m = measureNodes(ast.nodes);
  const canvasW = Math.max(600, m.width + 200);
  const centerX = canvasW / 2;

  // Start terminal
  shapes.push({ id: 'start', type: 'terminal', text: 'Inicio', x: centerX, y: 30, width: MIN_NODE_W, height: NODE_H });

  const result = placeNodes(ast.nodes, centerX, 30 + NODE_H + V_GAP, shapes, links, 'start');

  // End terminal
  const endY = result.endY + V_GAP / 2;
  shapes.push({ id: 'end', type: 'terminal', text: 'Fin', x: centerX, y: endY, width: MIN_NODE_W, height: NODE_H });
  if (result.lastId) {
    links.push(makeLink(result.lastId, 'end', shapes));
  }

  const canvasH = endY + NODE_H + 40;
  return { shapes, links, width: canvasW, height: canvasH };
}
