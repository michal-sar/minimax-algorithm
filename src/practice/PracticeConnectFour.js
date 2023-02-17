import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const GameCanvas = React.forwardRef((props, ref) => {
  return (
    <svg className="game" viewBox="0 -19 278 278">
      <g ref={ref} />
    </svg>
  );
});
GameCanvas.displayName = "GameCanvas";

const TreeCanvas = React.forwardRef((props, ref) => {
  return (
    <svg className="gameTree" viewBox="0 0 2780 1112">
      <g ref={ref} />
    </svg>
  );
});
TreeCanvas.displayName = "TreeCanvas";

function drawBoard(gameCanvas) {
  let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.classList = "board";
  g.setAttribute("mask", "url(#boardMask)");

  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", 0);
  rect.setAttribute("y", -19);
  rect.setAttribute("width", 278);
  rect.setAttribute("height", 19);
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

  let mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
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
  let col = index % 7;
  let row = Math.floor(index / 7);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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
  let col = index % 7;
  let row = Math.floor(index / 7);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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

async function handleGameOver(gameCanvas, result) {
  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.classList = "resultText";
  text.setAttribute("font-size", "45");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("font-family", "Nunito, sans-serif");
  text.setAttribute("font-weight", "900");
  text.setAttribute("x", 139);
  text.setAttribute("y", 120);
  text.setAttribute("paint-order", "stroke");
  text.setAttribute("stroke", "#224");
  text.setAttribute("stroke-width", 6);

  gameCanvas.parentNode.appendChild(text);
  gameCanvas.parentNode.classList = "gameComplete";

  switch (result) {
    case "yellow":
      text.setAttribute("fill", "#fd7");
      text.textContent = "Yellow won!";
      break;
    case "red":
      text.setAttribute("fill", "#f77");
      text.textContent = "Red won!";
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

function checkVictory(board, col) {
  let row = board[col].length - 1;

  let colRangeStart = Math.max(0, col - 3);
  let colRangeEnd = Math.min(6, col + 3);
  let rowRangeStart = Math.max(0, row - 3);
  let rowRangeEnd = Math.min(5, row + 3);

  let rowTemp, colTemp;

  if (
    row >= 3 &&
    board[col][row] == board[col][row - 1] &&
    board[col][row] == board[col][row - 2] &&
    board[col][row] == board[col][row - 3]
  )
    return true;

  let count = 0;
  for (colTemp = colRangeStart; colTemp <= colRangeEnd; colTemp++) {
    if (board[col][row] == board[colTemp][row]) {
      count++;
      if (count == 4) return true;
    } else count = 0;
  }

  count = 0;
  colTemp = col;
  rowTemp = row;
  while (colTemp > colRangeStart && rowTemp < rowRangeEnd) {
    colTemp--;
    rowTemp++;
  }
  while (colTemp <= colRangeEnd && rowTemp >= rowRangeStart) {
    if (board[colTemp][rowTemp] == board[col][row]) {
      count++;
      if (count == 4) {
        return true;
      }
    } else {
      count = 0;
    }
    colTemp++;
    rowTemp--;
  }

  count = 0;
  colTemp = col;
  rowTemp = row;
  while (colTemp < colRangeEnd && rowTemp < rowRangeEnd) {
    colTemp++;
    rowTemp++;
  }
  while (colTemp >= colRangeStart && rowTemp >= rowRangeStart) {
    if (board[colTemp][rowTemp] == board[col][row]) {
      count++;
      if (count == 4) {
        return true;
      }
    } else {
      count = 0;
    }
    colTemp--;
    rowTemp--;
  }

  return false;
}

function drawGameTreeNode(treeCanvas, board, x, y) {
  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x - 137.5);
  rect.setAttribute("y", y + 20.5);
  rect.setAttribute("rx", 10);
  rect.setAttribute("ry", 10);
  rect.setAttribute("width", 275);
  rect.setAttribute("height", 237);
  rect.setAttribute("fill", "#77f");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", 3 * (1 + (0.2 * 2780) / 1260));
  treeCanvas.appendChild(rect);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3 * (1 + (0.2 * 2780) / 1260));

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

async function refocusGameTree(treeCanvas, gainX, gainY) {
  let newX = currentX;
  let newY = currentY;

  currentY -= gainY;
  currentX -= gainX;

  gainX /= 25;
  gainY /= 25;

  for (let i = 0; i < 25; i++) {
    newX -= gainX;
    newY -= gainY;
    treeCanvas.setAttribute("transform", `translate(${newX}, ${newY})`);
    await new Promise((r) => setTimeout(r, 25));
  }
}

function expandGameTree(treeCanvas, board, player, nextX, nextY) {
  let children = [];

  for (let i = 0; i < 7; i++) {
    if (board[i].length < 6) {
      const child = board.map((row) => row.slice());
      child[i].push(player);
      children.push(child);
    }
  }

  let x1 = -nextX + 1390;
  let y1 = -nextY + 278;
  let x2, y2, newX1, newX2, newY1, newY2;
  let margin = ((10 - children.length) * 278) / (children.length + 1);

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke-linecap", "round");

  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("rx", (3 * 2780) / 1260);
  rect.setAttribute("ry", (3 * 2780) / 1260);
  rect.setAttribute("width", (46 * 2780) / 1260);
  rect.setAttribute("height", (26 * 2780) / 1260);
  rect.setAttribute("fill", "#fff");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", (3 * 2780) / 1260);

  let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("font-size", (20 * 2780) / 1260);
  text.setAttribute("fill", "#224");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "central");
  text.setAttribute("font-family", "Nunito, sans-serif");
  text.setAttribute("font-weight", "900");

  for (let i = 0; i < children.length; i++) {
    x2 = -nextX + i * (278 + margin) + 139 + margin;
    y2 = -nextY + 834;

    newX1 = x1 * 0.85 + x2 * 0.15;
    newY1 =
      y1 * 0.9 +
      y2 * 0.1 -
      Math.pow(Math.abs(newX1 + (nextX - 1390)), 2) / 1390;
    newX2 = x2 * 0.95 + x1 * 0.05;
    newY2 = y2 * 0.95 + y1 * 0.05;

    const angle = (Math.atan2(newY2 - newY1, newX2 - newX1) * 180) / Math.PI;
    const arrowheadWidth = (23 * 2780) / 1260;
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
    line.setAttribute("stroke-width", (9 * 2780) / 1260);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", (3 * 2780) / 1260);
    treeCanvas.appendChild(line);

    line = line.cloneNode(false);
    line.setAttribute("x1", arrowheadLine2X1);
    line.setAttribute("y1", arrowheadLine2Y1);
    line.setAttribute("x2", newX2);
    line.setAttribute("y2", newY2);
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", (9 * 2780) / 1260);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", (3 * 2780) / 1260);
    treeCanvas.appendChild(line);

    rect = rect.cloneNode(false);
    rect.setAttribute("x", x2 * 0.5 + newX1 * 0.5 - (23 * 2780) / 1260);
    rect.setAttribute("y", y2 * 0.5 + newY1 * 0.5 - (13 * 2780) / 1260);
    treeCanvas.appendChild(rect);

    line = line.cloneNode(false);
    line.setAttribute("x1", newX1);
    line.setAttribute("y1", newY1);
    line.setAttribute("x2", newX2);
    line.setAttribute("y2", newY2);
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", (9 * 2780) / 1260);
    treeCanvas.prepend(line);

    line = line.cloneNode(false);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", (3 * 2780) / 1260);
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

function PracticeConnectFour(/* props */) {
  const gameCanvas = useRef(null);
  const treeCanvas = useRef(null);
  // const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    drawBoard(gameCanvas.current.parentNode);

    currentX = 0;
    currentY = 0;

    let busy,
      board,
      newIndex,
      newMove,
      moves,
      margin,
      gainX,
      gainY,
      nextX,
      nextY;

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("y", 6);
    rect.setAttribute("width", 38);
    rect.setAttribute("height", 228);
    rect.setAttribute("fill-opacity", 0);

    for (let index = 0; index < 7; index++) {
      rect = rect.cloneNode(false);
      rect.setAttribute("x", index * 38 + 6);
      rect.onclick = async () => {
        if (busy || board[index].filter((tile) => tile).length == 6) return;
        busy = true;

        drawYellow(
          gameCanvas.current,
          35 - board[index].filter((tile) => tile).length * 7 + index,
        );

        newIndex = index;
        for (let i = 0; i < index; i++) {
          if (board[i][5]) newIndex--;
        }
        moves = 0;
        for (let i = 0; i < 7; i++) {
          if (!board[i][5]) moves++;
        }
        margin = ((10 - moves) * 278) / (moves + 1);
        gainX = newIndex * (278 + margin) + 139 + margin - 1390;
        gainY = 834;

        board[index][board[index].filter((tile) => tile).length] = "y";

        if (checkVictory(board, index)) {
          await refocusGameTree(treeCanvas.current, gainX, gainY);
          await handleGameOver(gameCanvas.current, "yellow");
          start();
          return;
        }

        nextY = currentY - gainY;
        nextX = currentX - gainX;

        expandGameTree(treeCanvas.current, board, "r", nextX, nextY);

        await refocusGameTree(treeCanvas.current, gainX, gainY);

        let move;
        do {
          move = Math.floor(Math.random() * 7);
        } while (board[move].filter((tile) => tile).length == 6);
        drawRed(
          gameCanvas.current,
          35 - board[move].filter((tile) => tile).length * 7 + move,
        );

        newMove = move;
        for (let i = 0; i < move; i++) {
          if (board[i][5]) newMove--;
        }
        moves = 0;
        for (let i = 0; i < 7; i++) {
          if (!board[i][5]) moves++;
        }
        margin = ((10 - moves) * 278) / (moves + 1);
        gainX = newMove * (278 + margin) + 139 + margin - 1390;
        gainY = 834;

        board[move][board[move].filter((tile) => tile).length] = "r";

        if (checkVictory(board, move)) {
          await refocusGameTree(treeCanvas.current, gainX, gainY);
          await handleGameOver(gameCanvas.current, "red");
          start();
          return;
        }

        if (
          !(
            !board[0][5] ||
            !board[1][5] ||
            !board[2][5] ||
            !board[3][5] ||
            !board[4][5] ||
            !board[5][5] ||
            !board[6][5]
          )
        ) {
          await refocusGameTree(treeCanvas.current, gainX, gainY);
          await handleGameOver(gameCanvas.current, "draw");
          start();
          return;
        }

        nextY = currentY - gainY;
        nextX = currentX - gainX;

        expandGameTree(treeCanvas.current, board, "y", nextX, nextY);

        await refocusGameTree(treeCanvas.current, gainX, gainY);

        busy = false;
      };
      gameCanvas.current.parentNode.appendChild(rect);
    }

    async function start() {
      gameCanvas.current.innerHTML = "";

      if (currentY) {
        gainX = currentX / 50;
        gainY = currentY / 50;
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
      } else treeCanvas.current.setAttribute("transform", "translate(0, 0)");

      treeCanvas.current.innerHTML = "";

      currentX = 0;
      currentY = 0;

      busy = false;
      board = new Array(7);
      for (let i = 0; i < board.length; i++) {
        board[i] = new Array();
      }

      drawGameTreeNode(treeCanvas.current, board, 1390, 0);
      expandGameTree(treeCanvas.current, board, "y", 0, 0);
    }

    start();
  }, []);

  return (
    <div className="gameContainer">
      <div className="gameContainerChild">
        <h3 className="practiceTitle">Connect four</h3>
        <GameCanvas ref={gameCanvas} />
      </div>
      <TreeCanvas ref={treeCanvas} />
    </div>
  );
}

PracticeConnectFour.propTypes = {
  alphaBetaPruning: PropTypes.bool,
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
};

export default PracticeConnectFour;
