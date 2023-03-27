function drawTicTacToeBoard(gameCanvas) {
  let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.classList = "board";

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", 41.5);
  line.setAttribute("x2", 41.5);
  line.setAttribute("y1", 3);
  line.setAttribute("y2", 123);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 3);
  line.setAttribute("stroke-linecap", "round");
  g.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", 84.5);
  line.setAttribute("x2", 84.5);
  line.setAttribute("y1", 3);
  line.setAttribute("y2", 123);
  g.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", 3);
  line.setAttribute("x2", 123);
  line.setAttribute("y1", 41.5);
  line.setAttribute("y2", 41.5);
  g.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", 3);
  line.setAttribute("x2", 123);
  line.setAttribute("y1", 84.5);
  line.setAttribute("y2", 84.5);
  g.appendChild(line);

  gameCanvas.appendChild(g);
}

async function drawX(gameCanvas, index) {
  const col = index % 3;
  const row = Math.floor(index / 3);

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.classList = "lineX";
  line.setAttribute("x1", col * 43 + 8.5);
  line.setAttribute("x2", col * 43 + 31.5);
  line.setAttribute("y1", row * 43 + 8.5);
  line.setAttribute("y2", row * 43 + 31.5);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 9);
  line.setAttribute("stroke-linecap", "round");
  gameCanvas.prepend(line);

  line = line.cloneNode(false);
  line.setAttribute("stroke", "#f97");
  line.setAttribute("stroke-width", 3);
  gameCanvas.appendChild(line);
  await new Promise((r) => setTimeout(r, 250));

  if (!gameCanvas) return;

  line = line.cloneNode(false);
  line.setAttribute("x1", col * 43 + 31.5);
  line.setAttribute("x2", col * 43 + 8.5);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 9);
  gameCanvas.prepend(line);

  line = line.cloneNode(false);
  line.setAttribute("stroke", "#f97");
  line.setAttribute("stroke-width", 3);
  gameCanvas.appendChild(line);
  await new Promise((r) => setTimeout(r, 250));
}

async function drawO(gameCanvas, index) {
  const col = index % 3;
  const row = Math.floor(index / 3);

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.classList = "pathO";
  path.setAttribute(
    "d",
    `M ${col * 43 + 20},${
      row * 43 + 20
    } m -12,0 a 12,12 0 1,0 24,0 a 12,12 0 1,0 -24,0`,
  );
  path.setAttribute("stroke", "#224");
  path.setAttribute("stroke-width", 9);
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("fill", "none");
  gameCanvas.appendChild(path);

  path = path.cloneNode(false);
  path.setAttribute("stroke", "#7df");
  path.setAttribute("stroke-width", 3);
  gameCanvas.appendChild(path);
  await new Promise((r) => setTimeout(r, 500));
}

function drawTicTacToeGameTreeNode(treeCanvas, board, x, y, strokeWidth) {
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x - 21.5);
  line.setAttribute("x2", x - 21.5);
  line.setAttribute("y1", y + 3);
  line.setAttribute("y2", y + 123);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", strokeWidth);
  line.setAttribute("stroke-linecap", "round");
  treeCanvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", x + 21.5);
  line.setAttribute("x2", x + 21.5);
  line.setAttribute("y1", y + 3);
  line.setAttribute("y2", y + 123);
  treeCanvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", x - 60);
  line.setAttribute("x2", x + 60);
  line.setAttribute("y1", y + 41.5);
  line.setAttribute("y2", y + 41.5);
  treeCanvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", x - 60);
  line.setAttribute("x2", x + 60);
  line.setAttribute("y1", y + 84.5);
  line.setAttribute("y2", y + 84.5);
  treeCanvas.appendChild(line);

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("fill", "none");

  for (let i = 0; i < 9; i++) {
    if (board[i]) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      if (board[i] == "x") {
        line = line.cloneNode(false);
        line.setAttribute("x1", x + col * 43 - 54.5);
        line.setAttribute("x2", x + col * 43 - 31.5);
        line.setAttribute("y1", y + row * 43 + 8.5);
        line.setAttribute("y2", y + row * 43 + 31.5);
        line.setAttribute("stroke", "#224");
        line.setAttribute("stroke-width", 3 * strokeWidth);
        treeCanvas.appendChild(line);

        line = line.cloneNode(false);
        line.setAttribute("y1", y + row * 43 + 31.5);
        line.setAttribute("y2", y + row * 43 + 8.5);
        treeCanvas.appendChild(line);

        line = line.cloneNode(false);
        line.setAttribute("stroke", "#f97");
        line.setAttribute("stroke-width", strokeWidth);
        treeCanvas.appendChild(line);

        line = line.cloneNode(false);
        line.setAttribute("y1", y + row * 43 + 8.5);
        line.setAttribute("y2", y + row * 43 + 31.5);
        treeCanvas.appendChild(line);
      } else {
        path = path.cloneNode(false);
        path.setAttribute(
          "d",
          `M ${x + col * 43 - 43},${
            y + row * 43 + 20
          } m -12,0 a 12,12 0 1,0 24,0 a 12,12 0 1,0 -24,0`,
        );
        path.setAttribute("stroke", "#224");
        path.setAttribute("stroke-width", 3 * strokeWidth);
        treeCanvas.appendChild(path);

        path = path.cloneNode(false);
        path.setAttribute("stroke", "#7df");
        path.setAttribute("stroke-width", strokeWidth);
        treeCanvas.appendChild(path);
      }
    }
  }
}

function expandGameTree(treeCanvas, board, nextX, nextY) {
  let player = board.filter((tile) => tile != null).length % 2 == 0 ? "x" : "o";

  let children = board.reduce((result, value, index) => {
    if (value == null) {
      const child = [...board];
      child[index] = player;
      result.push(child);
    }
    return result;
  }, []);

  const x1 = -nextX + 630;
  const y1 = -nextY + 126;
  const margin = ((10 - children.length) * 126) / (children.length + 1);

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke-linecap", "round");

  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("rx", 3);
  rect.setAttribute("ry", 3);
  rect.setAttribute("width", 56);
  rect.setAttribute("height", 26);
  rect.setAttribute("fill", "#fff");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", 3);

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("font-size", 20);
  text.setAttribute("fill", "#224");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "central");
  text.setAttribute("font-family", "Nunito, sans-serif");
  text.setAttribute("font-weight", "900");
  text.classList = "evaluationNode";

  for (let i = 0; i < children.length; i++) {
    const x2 = -nextX + i * (126 + margin) + 63 + margin;
    const y2 = -nextY + 378;

    const newX1 = x1 * 0.85 + x2 * 0.15;
    const newY1 =
      y1 * 0.9 + y2 * 0.1 - Math.pow(Math.abs(newX1 + (nextX - 630)), 2) / 630;
    const newX2 = x2 * 0.95 + x1 * 0.05;
    const newY2 = y2 * 0.95 + y1 * 0.05;

    const angle = (Math.atan2(newY2 - newY1, newX2 - newX1) * 180) / Math.PI;

    const arrowheadWidth = 23;
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
    line.setAttribute("stroke-width", 9);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", 3);
    treeCanvas.appendChild(line);

    line = line.cloneNode(false);
    line.setAttribute("x1", arrowheadLine2X1);
    line.setAttribute("y1", arrowheadLine2Y1);
    line.setAttribute("x2", newX2);
    line.setAttribute("y2", newY2);
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", 9);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", 3);
    treeCanvas.appendChild(line);

    rect = rect.cloneNode(false);
    rect.setAttribute("x", x2 * 0.5 + newX1 * 0.5 - 28);
    rect.setAttribute("y", y2 * 0.5 + newY1 * 0.5 - 13);
    treeCanvas.appendChild(rect);

    line = line.cloneNode(false);
    line.setAttribute("x1", newX1);
    line.setAttribute("y1", newY1);
    line.setAttribute("x2", newX2);
    line.setAttribute("y2", newY2);
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", 9);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", 3);
    treeCanvas.appendChild(line);

    text = text.cloneNode(false);
    text.setAttribute("x", x2 * 0.5 + newX1 * 0.5);
    text.setAttribute("y", y2 * 0.5 + newY1 * 0.5);
    treeCanvas.appendChild(text);

    drawTicTacToeGameTreeNode(treeCanvas, children[i], x2, y2, 3.6);
  }
}

export {
  drawTicTacToeBoard,
  drawX,
  drawO,
  drawTicTacToeGameTreeNode,
  expandGameTree,
};
