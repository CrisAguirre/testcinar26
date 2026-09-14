/**
 * DFD SVG Renderer Data Generator
 * Translates an AST into visually positioned nodes for an SVG canvas.
 */

const NODE_WIDTH = 120;
const NODE_HEIGHT = 50;
const VERTICAL_GAP = 40;
const HORIZONTAL_GAP = 60;

export function buildRenderData(ast) {
  let shapes = [];
  let links = [];
  let currentY = 20;

  // Start Node
  shapes.push({
    id: 'start',
    type: 'terminal',
    text: 'Inicio',
    x: 300,
    y: currentY,
    width: NODE_WIDTH,
    height: NODE_HEIGHT
  });

  let lastNodeId = 'start';
  let lastX = 300;
  
  currentY += NODE_HEIGHT + VERTICAL_GAP;

  const result = layoutNodes(ast.nodes, currentY, 300, lastNodeId, shapes, links, 1);
  
  // End Node
  if (result.lastNodes.length > 0) {
    const endY = result.maxY + VERTICAL_GAP;
    shapes.push({
      id: 'end',
      type: 'terminal',
      text: 'Fin',
      x: 300,
      y: endY,
      width: NODE_WIDTH,
      height: NODE_HEIGHT
    });

    for (const ln of result.lastNodes) {
      links.push({
        source: ln,
        target: 'end',
        sourceX: ln.x + NODE_WIDTH/2,
        sourceY: ln.y + NODE_HEIGHT,
        targetX: 300 + NODE_WIDTH/2,
        targetY: endY
      });
    }
  }

  return { shapes, links, width: 800, height: result.maxY + NODE_HEIGHT * 3 };
}

function layoutNodes(nodes, startY, startX, prevNodeId, shapes, links, idCounter) {
  let currY = startY;
  let currX = startX;
  let activePrevIds = [{ id: prevNodeId, x: startX, y: startY - VERTICAL_GAP - NODE_HEIGHT }];
  let maxY = startY;

  for (const node of nodes) {
    if (node.type === 'end' || node.type === 'return') break;

    const nodeId = `node_${idCounter++}`;
    let shapeType = 'rect';
    let label = '';

    if (node.type === 'output') {
      shapeType = 'output';
      label = node.text.substring(0, 20) + (node.text.length > 20 ? '...' : '');
    } else if (node.type === 'input') {
      shapeType = 'input';
      label = node.variables.join(', ');
    } else if (node.type === 'assignment') {
      shapeType = 'process';
      label = node.assignments.map(a => `${a.variable} = ${a.expression}`).join('\n');
    }

    if (node.type === 'decision') {
      // Decision Node (Rhombus)
      shapes.push({
        id: nodeId,
        type: 'decision',
        text: node.condition,
        x: currX,
        y: currY,
        width: NODE_WIDTH + 20,
        height: NODE_HEIGHT + 20
      });

      for (const p of activePrevIds) {
        links.push({ source: p.id, target: nodeId, sourceX: p.x + NODE_WIDTH/2, sourceY: p.y + NODE_HEIGHT, targetX: currX + (NODE_WIDTH+20)/2, targetY: currY });
      }

      const branchY = currY + NODE_HEIGHT + 20 + VERTICAL_GAP;
      
      // True Branch (Right)
      const trueX = currX + NODE_WIDTH + HORIZONTAL_GAP;
      const trueResult = layoutNodes(node.trueBranch, branchY, trueX, nodeId, shapes, links, idCounter);
      idCounter = trueResult.nextId;
      
      // Link decision to true branch
      links.push({ 
        source: nodeId, target: trueResult.firstNodeId || 'dummy_t', 
        sourceX: currX + NODE_WIDTH + 20, sourceY: currY + (NODE_HEIGHT+20)/2,
        targetX: trueX + NODE_WIDTH/2, targetY: branchY,
        label: 'Si'
      });

      // False Branch (Left)
      const falseX = currX - NODE_WIDTH - HORIZONTAL_GAP;
      const falseResult = layoutNodes(node.falseBranch, branchY, falseX, nodeId, shapes, links, idCounter);
      idCounter = falseResult.nextId;

      // Link decision to false branch
      links.push({ 
        source: nodeId, target: falseResult.firstNodeId || 'dummy_f', 
        sourceX: currX, sourceY: currY + (NODE_HEIGHT+20)/2,
        targetX: falseX + NODE_WIDTH/2, targetY: branchY,
        label: 'No'
      });

      activePrevIds = [...trueResult.lastNodes, ...falseResult.lastNodes];
      
      // Handle empty branches (connect straight down)
      if (trueResult.lastNodes.length === 0) {
        activePrevIds.push({ id: nodeId, x: currX + NODE_WIDTH + 20, y: currY + (NODE_HEIGHT+20)/2, isSide: true });
      }
      if (falseResult.lastNodes.length === 0) {
        activePrevIds.push({ id: nodeId, x: currX, y: currY + (NODE_HEIGHT+20)/2, isSide: true });
      }

      currY = Math.max(trueResult.maxY, falseResult.maxY) + VERTICAL_GAP;
      maxY = currY;

    } else if (node.type === 'while') {
      // Simplification for rendering while loops - treat as process block for visual simplicity for now
       shapes.push({
        id: nodeId,
        type: 'process',
        text: `Mientras: ${node.condition}`,
        x: currX,
        y: currY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT
      });
      
      for (const p of activePrevIds) {
        links.push({ source: p.id, target: nodeId, sourceX: p.x + (p.width||NODE_WIDTH)/2, sourceY: p.y + (p.height||NODE_HEIGHT), targetX: currX + NODE_WIDTH/2, targetY: currY });
      }

      const bodyY = currY + NODE_HEIGHT + VERTICAL_GAP;
      const bodyResult = layoutNodes(node.body, bodyY, currX, nodeId, shapes, links, idCounter);
      idCounter = bodyResult.nextId;
      
      // Loop back
      if (bodyResult.lastNodes.length > 0) {
        const ln = bodyResult.lastNodes[0];
        links.push({ 
          source: ln.id, target: nodeId, 
          sourceX: ln.x + NODE_WIDTH/2, sourceY: ln.y + NODE_HEIGHT, 
          targetX: currX + NODE_WIDTH/2, targetY: currY,
          isLoop: true
        });
      }

      activePrevIds = [{ id: nodeId, x: currX, y: currY }];
      currY = bodyResult.maxY + VERTICAL_GAP;
      maxY = currY;
    } else {
      // Standard block
      shapes.push({
        id: nodeId,
        type: shapeType,
        text: label,
        x: currX,
        y: currY,
        width: NODE_WIDTH,
        height: NODE_HEIGHT
      });

      for (const p of activePrevIds) {
        const sx = p.isSide ? p.x : p.x + (p.width || NODE_WIDTH)/2;
        const sy = p.isSide ? p.y : p.y + (p.height || NODE_HEIGHT);
        links.push({ source: p.id, target: nodeId, sourceX: sx, sourceY: sy, targetX: currX + NODE_WIDTH/2, targetY: currY });
      }

      activePrevIds = [{ id: nodeId, x: currX, y: currY, width: NODE_WIDTH, height: NODE_HEIGHT }];
      maxY = currY + NODE_HEIGHT;
      currY += NODE_HEIGHT + VERTICAL_GAP;
    }
  }

  return { lastNodes: activePrevIds, maxY, nextId: idCounter, firstNodeId: nodes.length > 0 ? `node_${idCounter - nodes.length}` : null };
}
