import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const GameCanvas = React.forwardRef((props, ref) => {
  return (
    <svg className="game" viewBox="0 0 126 126">
      <g ref={ref} />
    </svg>
  );
});
GameCanvas.displayName = "GameCanvas";

const TreeCanvas = React.forwardRef((props, ref) => {
  return (
    <svg className="gameTree" viewBox="0 0 1260 504">
      <g ref={ref}></g>
    </svg>
  );
});
TreeCanvas.displayName = "TreeCanvas";

function drawBoard(gameCanvas) {
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
  let col = index % 3;
  let row = Math.floor(index / 3);

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
  let col = index % 3;
  let row = Math.floor(index / 3);

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

async function handleGameOver(gameCanvas, result) {
  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.classList = "resultText";
  text.setAttribute("font-size", "23.625");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-family", "Nunito, sans-serif");
  text.setAttribute("font-weight", "900");
  text.setAttribute("x", 63);
  text.setAttribute("y", 63);
  text.setAttribute("paint-order", "stroke");
  text.setAttribute("stroke", "#224");
  text.setAttribute("stroke-width", 6);

  gameCanvas.parentNode.appendChild(text);
  gameCanvas.parentNode.classList = "gameComplete";

  switch (result) {
    case "x":
      text.setAttribute("fill", "#f97");
      text.textContent = "X won!";
      break;
    case "o":
      text.setAttribute("fill", "#7df");
      text.textContent = "O won!";
      break;
    case "draw":
      text.setAttribute("fill", "#fff");
      text.textContent = "Draw!";
      break;
  }

  await new Promise((r) => setTimeout(r, 2000));
  gameCanvas.parentNode.classList = "gameReset";
  await new Promise((r) => setTimeout(r, 1000));
  gameCanvas.parentNode.classList = "game";

  gameCanvas.parentNode.removeChild(text);
}

function checkVictory(board) {
  return (
    (board[0] && board[0] == board[1] && board[1] == board[2]) ||
    (board[3] && board[3] == board[4] && board[4] == board[5]) ||
    (board[6] && board[6] == board[7] && board[7] == board[8]) ||
    (board[0] && board[0] == board[3] && board[3] == board[6]) ||
    (board[1] && board[1] == board[4] && board[4] == board[7]) ||
    (board[2] && board[2] == board[5] && board[5] == board[8]) ||
    (board[0] && board[0] == board[4] && board[4] == board[8]) ||
    (board[2] && board[2] == board[4] && board[4] == board[6])
  );
}

function drawGameTreeNode(treeCanvas, board, x, y) {
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x - 21.5);
  line.setAttribute("x2", x - 21.5);
  line.setAttribute("y1", y + 3);
  line.setAttribute("y2", y + 123);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 3 * 1.2);
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
      let col = i % 3;
      let row = Math.floor(i / 3);
      if (board[i] == "x") {
        line = line.cloneNode(false);
        line.setAttribute("x1", x + col * 43 - 54.5);
        line.setAttribute("x2", x + col * 43 - 31.5);
        line.setAttribute("y1", y + row * 43 + 8.5);
        line.setAttribute("y2", y + row * 43 + 31.5);
        line.setAttribute("stroke", "#224");
        line.setAttribute("stroke-width", 9 * 1.2);
        treeCanvas.appendChild(line);

        line = line.cloneNode(false);
        line.setAttribute("y1", y + row * 43 + 31.5);
        line.setAttribute("y2", y + row * 43 + 8.5);
        treeCanvas.appendChild(line);

        line = line.cloneNode(false);
        line.setAttribute("stroke", "#f97");
        line.setAttribute("stroke-width", 3 * 1.2);
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
        path.setAttribute("stroke-width", 9 * 1.2);
        treeCanvas.appendChild(path);

        path = path.cloneNode(false);
        path.setAttribute("stroke", "#7df");
        path.setAttribute("stroke-width", 3 * 1.2);
        treeCanvas.appendChild(path);
      }
    }
  }
}

async function refocusGameTree(treeCanvas, board, index) {
  let newIndex =
    index - board.slice(0, index).filter((tile) => tile != null).length;

  let moves = board.filter((tile) => tile == null).length + 1;

  let margin = ((10 - moves) * 126) / (moves + 1);

  let newX = currentX;
  let newY = currentY;
  let gainX = (newIndex * (126 + margin) + 63 + margin - 630) / 25;
  let gainY = 378 / 25;

  currentY = newY - gainY * 25;
  currentX = newX - gainX * 25;

  for (let i = 0; i < 25; i++) {
    newX -= gainX;
    newY -= gainY;
    treeCanvas.setAttribute("transform", `translate(${newX}, ${newY})`);
    await new Promise((r) => setTimeout(r, 25));
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

  let x1 = -nextX + 630;
  let y1 = -nextY + 126;
  let x2, y2, newX1, newX2, newY1, newY2;
  let margin = ((10 - children.length) * 126) / (children.length + 1);

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke-linecap", "round");

  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("rx", 3);
  rect.setAttribute("ry", 3);
  rect.setAttribute("width", 46);
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

  for (let i = 0; i < children.length; i++) {
    x2 = -nextX + i * (126 + margin) + 63 + margin;
    y2 = -nextY + 378;

    newX1 = x1 * 0.85 + x2 * 0.15;
    newY1 =
      y1 * 0.9 + y2 * 0.1 - Math.pow(Math.abs(newX1 + (nextX - 630)), 2) / 630;
    newX2 = x2 * 0.95 + x1 * 0.05;
    newY2 = y2 * 0.95 + y1 * 0.05;

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
    rect.setAttribute("x", x2 * 0.5 + newX1 * 0.5 - 23);
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
    text.textContent = (Math.floor(Math.random() * 21) - 10) / 10;
    treeCanvas.appendChild(text);

    drawGameTreeNode(treeCanvas, children[i], x2, y2);
  }
}

var currentX, currentY;

function PracticeTicTacToe(/* props */) {
  const gameCanvas = useRef(null);
  const treeCanvas = useRef(null);
  // const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    drawBoard(gameCanvas.current.parentNode);

    let busy, board;

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", 40);
    rect.setAttribute("height", 40);
    rect.setAttribute("fill-opacity", 0);

    for (let index = 0; index < 9; index++) {
      let col = index % 3;
      let row = Math.floor(index / 3);

      rect = rect.cloneNode(false);
      rect.setAttribute("x", col * 43);
      rect.setAttribute("y", row * 43);
      rect.onclick = async () => {
        if (busy || board[index]) return;
        busy = true;

        drawX(gameCanvas.current, index);
        board[index] = "x";

        if (checkVictory(board)) {
          await refocusGameTree(treeCanvas.current, board, index);
          await handleGameOver(gameCanvas.current, "x");
          start();
          return;
        }

        if (!board.some((tile) => tile == null)) {
          await refocusGameTree(treeCanvas.current, board, index);
          await handleGameOver(gameCanvas.current, "draw");
          start();
          return;
        }

        let newIndex =
          index - board.slice(0, index).filter((tile) => tile != null).length;

        let moves = board.filter((tile) => tile == null).length + 1;

        let margin = ((10 - moves) * 126) / (moves + 1);

        let newX = currentX;
        let newY = currentY;
        let gainX = (newIndex * (126 + margin) + 63 + margin - 630) / 25;
        let gainY = 378 / 25;

        let nextY = newY - gainY * 25;
        let nextX = newX - gainX * 25;

        expandGameTree(treeCanvas.current, board, nextX, nextY);

        await refocusGameTree(treeCanvas.current, board, index);

        let move;
        do {
          move = Math.floor(Math.random() * 9);
        } while (board[move]);
        drawO(gameCanvas.current, move);
        board[move] = "o";

        if (checkVictory(board)) {
          await refocusGameTree(treeCanvas.current, board, move);
          await handleGameOver(gameCanvas.current, "o");
          start();
          return;
        }

        newIndex =
          move - board.slice(0, move).filter((tile) => tile != null).length;

        moves = board.filter((tile) => tile == null).length + 1;

        margin = ((10 - moves) * 126) / (moves + 1);

        newX = currentX;
        newY = currentY;
        gainX = (newIndex * (126 + margin) + 63 + margin - 630) / 25;
        gainY = 378 / 25;

        nextY = newY - gainY * 25;
        nextX = newX - gainX * 25;

        expandGameTree(treeCanvas.current, board, nextX, nextY);

        await refocusGameTree(treeCanvas.current, board, move);

        busy = false;
      };
      gameCanvas.current.parentNode.appendChild(rect);
    }

    async function start() {
      gameCanvas.current.innerHTML = "";

      if (currentY) {
        let gainX = currentX / 50;
        let gainY = currentY / 50;
        let newX = currentX;
        let newY = currentY;
        for (let i = 0; i < 50; i++) {
          newX -= gainX;
          newY -= gainY;
          treeCanvas.current.setAttribute(
            "transform",
            `translate(${newX}, ${newY})`,
          );
          await new Promise((r) => setTimeout(r, 25));
        }

        currentY = newY;
        currentX = newX;
      } else treeCanvas.current.setAttribute("transform", "translate(0, 0)");

      treeCanvas.current.innerHTML = "";

      currentX = 0;
      currentY = 0;

      busy = false;
      board = new Array(9);
      for (let i = 0; i < board.length; i++) {
        board[i] = null;
      }

      drawGameTreeNode(treeCanvas.current, board, currentX + 630, currentY);
      expandGameTree(treeCanvas.current, board, 0, 0);
    }

    start();
  }, []);

  return (
    <div className="practiceContainer">
      <h3 className="practiceTitle">Tic-tac-toe</h3>
      <GameCanvas ref={gameCanvas} />
      <h4 className="gameTreeLabel">Game tree:</h4>
      <TreeCanvas ref={treeCanvas} />
    </div>
  );
}

PracticeTicTacToe.propTypes = {
  alphaBetaPruning: PropTypes.bool,
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
};

export default PracticeTicTacToe;
