function drawConnectFourBoard(gameCanvas) {
  let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.classList = "board";
  g.setAttribute("mask", "url(#boardMask)");

  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", 0);
  rect.setAttribute("y", -20);
  rect.setAttribute("width", 278);
  rect.setAttribute("height", 21);
  rect.setAttribute("fill", "#fff");
  gameCanvas.appendChild(rect);

  rect = rect.cloneNode(false);
  rect.setAttribute("x", 1.5);
  rect.setAttribute("y", 1.5);
  rect.setAttribute("rx", 10);
  rect.setAttribute("ry", 10);
  rect.setAttribute("width", 275);
  rect.setAttribute("height", 237);
  rect.setAttribute("fill", "#77f");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", 3);
  g.appendChild(rect);

  const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.id = "boardMask";
  rect = rect.cloneNode(false);
  rect.setAttribute("fill", "#fff");
  rect.setAttribute("stroke", "#fff");
  mask.appendChild(rect);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 15);
  circle.setAttribute("fill", "#000");
  circle.setAttribute("stroke-width", 3);

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      circle = circle.cloneNode(false);
      circle.setAttribute("stroke", "#fff");
      circle.setAttribute("cx", col * 38 + 25);
      circle.setAttribute("cy", row * 38 + 25);
      mask.appendChild(circle);
      circle = circle.cloneNode(false);
      circle.setAttribute("stroke", "#224");
      g.appendChild(circle);
    }
  }

  gameCanvas.appendChild(mask);
  gameCanvas.appendChild(g);
}

async function drawYellow(gameCanvas, index) {
  const col = index % 7;
  const row = Math.floor(index / 7);

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.classList = `circle${row}`;
  circle.setAttribute("cx", col * 38 + 25);
  circle.setAttribute("cy", row * 38 + 25);
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#fd7");
  gameCanvas.prepend(circle);
  await new Promise((r) => setTimeout(r, 125 * (row + 1)));
}

async function drawRed(gameCanvas, index) {
  const col = index % 7;
  const row = Math.floor(index / 7);

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.classList = `circle${row}`;
  circle.setAttribute("cx", col * 38 + 25);
  circle.setAttribute("cy", row * 38 + 25);
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#f77");
  gameCanvas.prepend(circle);
  await new Promise((r) => setTimeout(r, 125 * (row + 1)));
}

function drawConnectFourGameTreeNode(treeCanvas, board, x, y, strokeWidth) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x - 137.5);
  rect.setAttribute("y", y + 20.5);
  rect.setAttribute("rx", 10);
  rect.setAttribute("ry", 10);
  rect.setAttribute("width", 275);
  rect.setAttribute("height", 237);
  rect.setAttribute("fill", "#77f");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", strokeWidth);
  treeCanvas.appendChild(rect);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", strokeWidth);

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      circle = circle.cloneNode(false);
      circle.setAttribute("cx", x + col * 38 - 114);
      circle.setAttribute("cy", y - row * 38 + 234);
      if (board[col][row] == "y") {
        circle.setAttribute("fill", "#fd7");
      }
      if (board[col][row] == "r") {
        circle.setAttribute("fill", "#f77");
      }
      if (board[col][row] == null) {
        circle.setAttribute("fill", "#fff");
      }
      treeCanvas.appendChild(circle);
    }
  }
}

function expandGameTree(treeCanvas, board, player, nextX, nextY) {
  const children = [];
  for (let i = 0; i < 7; i++) {
    if (board[i].length < 6) {
      const child = board.map((row) => row.slice());
      child[i].push(player);
      children.push(child);
    }
  }

  const x1 = -nextX + 1390;
  const y1 = -nextY + 278;
  const margin = ((10 - children.length) * 278) / (children.length + 1);

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke-linecap", "round");

  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("rx", (3 * 278) / 126);
  rect.setAttribute("ry", (3 * 278) / 126);
  rect.setAttribute("width", (56 * 278) / 126);
  rect.setAttribute("height", (26 * 278) / 126);
  rect.setAttribute("fill", "#fff");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", (3 * 278) / 126);

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("font-size", (20 * 278) / 126);
  text.setAttribute("fill", "#224");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "central");
  text.setAttribute("font-family", "Nunito, sans-serif");
  text.setAttribute("font-weight", "900");
  text.classList = "evaluationNode";

  for (let i = 0; i < children.length; i++) {
    const x2 = -nextX + i * (278 + margin) + 139 + margin;
    const y2 = -nextY + 834;

    const newX1 = x1 * 0.85 + x2 * 0.15;
    const newY1 =
      y1 * 0.9 +
      y2 * 0.1 -
      Math.pow(Math.abs(newX1 + (nextX - 1390)), 2) / 1390;
    const newX2 = x2 * 0.95 + x1 * 0.05;
    const newY2 = y2 * 0.95 + y1 * 0.05;

    const angle = (Math.atan2(newY2 - newY1, newX2 - newX1) * 180) / Math.PI;
    const arrowheadWidth = (23 * 278) / 126;
    const arrowheadAngle = 153;
    const arrowheadLine1X1 =
      newX2 +
      arrowheadWidth * Math.cos(((angle - arrowheadAngle) * Math.PI) / 180);
    const arrowheadLine1Y1 =
      newY2 +
      arrowheadWidth * Math.sin(((angle - arrowheadAngle) * Math.PI) / 180);
    const arrowheadLine2X1 =
      newX2 +
      arrowheadWidth * Math.cos(((angle + arrowheadAngle) * Math.PI) / 180);
    const arrowheadLine2Y1 =
      newY2 +
      arrowheadWidth * Math.sin(((angle + arrowheadAngle) * Math.PI) / 180);

    line = line.cloneNode(false);
    line.setAttribute("x1", arrowheadLine1X1);
    line.setAttribute("y1", arrowheadLine1Y1);
    line.setAttribute("x2", newX2);
    line.setAttribute("y2", newY2);
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", (9 * 278) / 126);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", (3 * 278) / 126);
    treeCanvas.appendChild(line);

    line = line.cloneNode(false);
    line.setAttribute("x1", arrowheadLine2X1);
    line.setAttribute("y1", arrowheadLine2Y1);
    line.setAttribute("x2", newX2);
    line.setAttribute("y2", newY2);
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", (9 * 278) / 126);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", (3 * 278) / 126);
    treeCanvas.appendChild(line);

    rect = rect.cloneNode(false);
    rect.setAttribute("x", x2 * 0.5 + newX1 * 0.5 - (28 * 278) / 126);
    rect.setAttribute("y", y2 * 0.5 + newY1 * 0.5 - (13 * 278) / 126);
    treeCanvas.appendChild(rect);

    line = line.cloneNode(false);
    line.setAttribute("x1", newX1);
    line.setAttribute("y1", newY1);
    line.setAttribute("x2", newX2);
    line.setAttribute("y2", newY2);
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", (9 * 278) / 126);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", (3 * 278) / 126);
    treeCanvas.appendChild(line);

    text = text.cloneNode(false);
    text.setAttribute("x", x2 * 0.5 + newX1 * 0.5);
    text.setAttribute("y", y2 * 0.5 + newY1 * 0.5);
    treeCanvas.appendChild(text);

    drawConnectFourGameTreeNode(
      treeCanvas,
      children[i],
      x2,
      y2,
      3 * (1 + (0.2 * 278) / 126),
    );
  }
}

export {
  drawConnectFourBoard,
  drawYellow,
  drawRed,
  drawConnectFourGameTreeNode,
  expandGameTree,
};
