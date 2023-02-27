import React, { useEffect, useRef, useContext, useState } from "react";
import { EnvironmentContext } from "../Environment";

const GameCanvas = React.forwardRef((props, ref) => {
  return (
    <svg className="game" viewBox="0 -19 278 278">
      <g ref={ref} />
    </svg>
  );
});
GameCanvas.displayName = "GameCanvas";

const TreeCanvas = React.forwardRef((props, ref) => {
  return <g ref={ref} />;
});
TreeCanvas.displayName = "TreeCanvas";

const TurnIndicator = React.forwardRef((props, ref) => {
  return (
    <text
      className="turnIndicator"
      fontSize={52.125 * 1.75} // <- ...
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Nunito, sans-serif"
      fontWeight="900"
      x="1390"
      y={-111.2 - 13.9 - 13.9 - 13.9} // <- ...
      paintOrder="stroke"
      stroke="#224"
      strokeWidth={(6 * 1.75 * 278) / 126} // <- ...
      ref={ref}
    ></text>
  );
});
TurnIndicator.displayName = "TurnIndicator";

const LoadingIndicator = React.forwardRef((props, ref) => {
  return (
    <g className="loadingIndicator" ref={ref}>
      <circle
        id="indicatorElement1"
        cx="1181.5"
        cy={-55.6 - 5.56} // <- ...
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
      <circle
        id="indicatorElement2"
        cx="1320.5"
        cy={-55.6 - 5.56} // <- ...
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
      <circle
        id="indicatorElement3"
        cx="1459.5"
        cy={-55.6 - 5.56} // <- ...
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
      <circle
        id="indicatorElement4"
        cx="1598.5"
        cy={-55.6 - 5.56} // <- ...
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
    </g>
  );
});
LoadingIndicator.displayName = "LoadingIndicator";

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

async function handleGameOver(gameCanvas, result, practiceAbortController) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.classList = "resultText";
  text.setAttribute("font-size", 45);
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
  if (practiceAbortController.signal.aborted) return;
  gameCanvas.parentNode.classList = "gameReset";
  await new Promise((r) => setTimeout(r, 1000));
  if (practiceAbortController.signal.aborted) return;
  gameCanvas.parentNode.classList = "game";

  gameCanvas.parentNode.removeChild(text);
}

function checkVictory(board, col) {
  const row = board[col].length - 1;

  const colRangeStart = Math.max(0, col - 3);
  const colRangeEnd = Math.min(6, col + 3);
  const rowRangeStart = Math.max(0, row - 3);
  const rowRangeEnd = Math.min(5, row + 3);

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
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x - 137.5);
  rect.setAttribute("y", y + 20.5);
  rect.setAttribute("rx", 10);
  rect.setAttribute("ry", 10);
  rect.setAttribute("width", 275);
  rect.setAttribute("height", 237);
  rect.setAttribute("fill", "#77f");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", 3 * (1 + (0.2 * 278) / 126));
  treeCanvas.appendChild(rect);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3 * (1 + (0.2 * 278) / 126));

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

async function refocusGameTree(
  treeCanvas,
  currentX,
  currentY,
  gainX,
  gainY,
  practiceAbortController,
) {
  let newX = currentX;
  let newY = currentY;

  gainX /= 25;
  gainY /= 25;

  for (let i = 0; i < 25; i++) {
    if (practiceAbortController.signal.aborted) return;
    newX -= gainX;
    newY -= gainY;
    treeCanvas.setAttribute("transform", `translate(${newX}, ${newY})`);
    await new Promise((r) => setTimeout(r, 25));
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
  rect.setAttribute("width", (46 * 278) / 126);
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
    rect.setAttribute("x", x2 * 0.5 + newX1 * 0.5 - (23 * 278) / 126);
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
    text.textContent = "...";
    treeCanvas.appendChild(text);

    drawGameTreeNode(treeCanvas, children[i], x2, y2);
  }
}

function PracticeConnectFour() {
  const gameCanvas = useRef(null);
  const treeCanvas = useRef(null);
  const turnIndicator = useRef(null);
  const loadingIndicator = useRef(null);

  const board = useRef(new Array(7).fill(new Array()));
  let settingsAbortController = useRef(null);
  let busy = useRef(null);
  let currentX = 0;
  let currentY = 0;

  const { alphaBetaPruning, depthLimit, depthLimitValue } =
    useContext(EnvironmentContext);
  const alphaBetaPruningRef = useRef(alphaBetaPruning);
  const depthLimitRef = useRef(depthLimit);
  const depthLimitValueRef = useRef(depthLimitValue);

  const [status, setStatus] = useState("loading");
  const statusRef = useRef(status);

  async function getEvaluations() {
    if (statusRef.current == "loading") {
      return;
    }

    if (statusRef.current == "offline") {
      let evaluations = [];
      for (let i = 0; i < 7; i++) {
        if (!board.current[i][5]) {
          evaluations.push(Math.floor(Math.random() * 3 - 1));
        }
      }
      getEvaluationsPromiseResolve(evaluations);
      return;
    }

    settingsAbortController.current?.abort();
    settingsAbortController.current = new AbortController();
    const signal = settingsAbortController.current.signal;
    let state = "";
    for (let i = 0; i < 7; i++) {
      let j = 0;
      while (board.current[i][j]) {
        state += board.current[i][j];
        j++;
      }
      if (i < 6) state += ",";
    }
    const evaluationNodes = document.getElementsByClassName("evaluationNode");
    // console.log(
    //   `http://127.0.0.1:8000/connect_four/${state}?alpha_beta_pruning=${alphaBetaPruningRef.current}&depth_limit=${depthLimitRef.current}&depth_limit_value=${depthLimitValueRef.current}`,
    // );
    await fetch(
      `http://127.0.0.1:8000/connect_four/${state}?alpha_beta_pruning=${alphaBetaPruningRef.current}&depth_limit=${depthLimitRef.current}&depth_limit_value=${depthLimitValueRef.current}`,
      { signal },
    )
      .then((response) => response.json())
      .then((data) => {
        const evaluations = data.evaluations;
        let i = evaluationNodes.length;
        let j = 1;
        while (evaluations.length - j >= 0) {
          i--;
          evaluationNodes[i].textContent = evaluations[evaluations.length - j];
          j++;
        }
        loadingIndicator.current.classList.remove("fadeIn");
        loadingIndicator.current.classList.add("fadeOut");
        getEvaluationsPromiseResolve(evaluations);
      })
      .catch((error) => {
        if (error.name != "AbortError") {
          console.error(error.name);
          console.error(error);
        }
      });
  }

  async function startGame() {
    gameCanvas.current.innerHTML = "";

    if (currentY) {
      const lossX = currentX / 50;
      const lossY = currentY / 50;
      let newX = currentX;
      let newY = currentY;
      for (let i = 0; i < 50; i++) {
        newX -= lossX;
        newY -= lossY;
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

    busy.current = false;
    board.current = new Array(7);
    for (let i = 0; i < board.current.length; i++) {
      board.current[i] = new Array();
    }

    turnIndicator.current.classList.remove("fadeOut");
    turnIndicator.current.classList.add("fadeIn");
    turnIndicator.current.setAttribute("fill", "#fd7");
    turnIndicator.current.textContent = "Maximizer's turn";

    drawGameTreeNode(treeCanvas.current, board.current, 1390, 0);
    expandGameTree(treeCanvas.current, board.current, "y", 0, 0);
    loadingIndicator.current.classList.remove("fadeOut");
    loadingIndicator.current.classList.add("fadeIn");
    getEvaluations();
  }

  useEffect(() => {
    const practiceAbortController = new AbortController();

    drawBoard(gameCanvas.current.parentNode);

    currentX = 0;
    currentY = 0;

    let moves, margin, gainX, turnInterval;

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("y", 6);
    rect.setAttribute("width", 38);
    rect.setAttribute("height", 228);
    rect.setAttribute("fill-opacity", 0);

    for (let index = 0; index < 7; index++) {
      rect = rect.cloneNode(false);
      rect.setAttribute("x", index * 38 + 6);
      rect.onclick = async () => {
        if (
          busy.current ||
          board.current[index].filter((tile) => tile).length == 6
        )
          return;
        busy.current = true;

        drawYellow(
          gameCanvas.current,
          35 - board.current[index].filter((tile) => tile).length * 7 + index,
        );

        let newIndex = index;
        for (let i = 0; i < index; i++) {
          if (board.current[i][5]) newIndex--;
        }
        moves = 0;
        for (let i = 0; i < 7; i++) {
          if (!board.current[i][5]) moves++;
        }
        margin = ((10 - moves) * 278) / (moves + 1);
        gainX = newIndex * (278 + margin) + 139 + margin - 1390;

        board.current[index][
          board.current[index].filter((tile) => tile).length
        ] = "y";

        if (checkVictory(board.current, index)) {
          await refocusGameTree(
            treeCanvas.current,
            currentX,
            currentY,
            gainX,
            834,
            practiceAbortController,
          );
          currentX -= gainX;
          currentY -= 834;
          await handleGameOver(
            gameCanvas.current,
            "yellow",
            practiceAbortController,
          );
          if (!practiceAbortController.signal.aborted) {
            startGame();
            turnIndicator.current.classList.remove("fadeIn");
            turnIndicator.current.classList.add("fadeOut");
          }
          return;
        }

        if (practiceAbortController.signal.aborted) return;
        expandGameTree(
          treeCanvas.current,
          board.current,
          "r",
          currentX - gainX,
          currentY - 834,
        );

        getEvaluationsPromise = new Promise((resolve) => {
          getEvaluationsPromiseResolve = resolve;
        });
        loadingIndicator.current.classList.remove("fadeOut");
        loadingIndicator.current.classList.add("fadeIn");
        getEvaluations();

        turnIndicator.current.classList.remove("fadeIn");
        turnIndicator.current.classList.add("fadeOut");
        turnInterval = setInterval(() => {
          if (!practiceAbortController.signal.aborted) {
            turnIndicator.current.classList.remove("fadeOut");
            turnIndicator.current.classList.add("fadeIn");
            turnIndicator.current.textContent = "Minimizer's turn";
            turnIndicator.current.setAttribute("fill", "#f77");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX,
          currentY,
          gainX,
          834,
          practiceAbortController,
        );
        currentX -= gainX;
        currentY -= 834;

        if (practiceAbortController.signal.aborted) return;
        loadingIndicator.current.classList.remove("fadeOut");
        loadingIndicator.current.classList.add("fadeIn");
        const evaluations = await getEvaluationsPromise;
        const newMove = evaluations.indexOf(Math.min(...evaluations));
        let move = -1;
        let skipMoves = newMove;
        do {
          move++;
          if (!board.current[move][5]) skipMoves--;
        } while (skipMoves >= 0);

        if (practiceAbortController.signal.aborted) return;
        drawRed(
          gameCanvas.current,
          35 - board.current[move].filter((tile) => tile).length * 7 + move,
        );

        moves = 0;
        for (let i = 0; i < 7; i++) {
          if (!board.current[i][5]) moves++;
        }
        margin = ((10 - moves) * 278) / (moves + 1);
        gainX = newMove * (278 + margin) + 139 + margin - 1390;

        board.current[move][board.current[move].filter((tile) => tile).length] =
          "r";

        if (checkVictory(board.current, move)) {
          await refocusGameTree(
            treeCanvas.current,
            currentX,
            currentY,
            gainX,
            834,
            practiceAbortController,
          );
          currentX -= gainX;
          currentY -= 834;
          await handleGameOver(
            gameCanvas.current,
            "red",
            practiceAbortController,
          );
          if (!practiceAbortController.signal.aborted) {
            startGame();
            turnIndicator.current.classList.remove("fadeIn");
            turnIndicator.current.classList.add("fadeOut");
          }
          return;
        }

        if (
          !(
            !board.current[0][5] ||
            !board.current[1][5] ||
            !board.current[2][5] ||
            !board.current[3][5] ||
            !board.current[4][5] ||
            !board.current[5][5] ||
            !board.current[6][5]
          )
        ) {
          await refocusGameTree(
            treeCanvas.current,
            currentX,
            currentY,
            gainX,
            834,
            practiceAbortController,
          );
          currentX -= gainX;
          currentY -= 834;
          await handleGameOver(
            gameCanvas.current,
            "draw",
            practiceAbortController,
          );
          if (!practiceAbortController.signal.aborted) {
            startGame();
            turnIndicator.current.classList.remove("fadeIn");
            turnIndicator.current.classList.add("fadeOut");
          }
          return;
        }

        if (practiceAbortController.signal.aborted) return;
        expandGameTree(
          treeCanvas.current,
          board.current,
          "y",
          currentX - gainX,
          currentY - 834,
        );
        loadingIndicator.current.classList.remove("fadeOut");
        loadingIndicator.current.classList.add("fadeIn");
        getEvaluations();

        turnIndicator.current.classList.remove("fadeIn");
        turnIndicator.current.classList.add("fadeOut");
        turnInterval = setInterval(() => {
          if (!practiceAbortController.signal.aborted) {
            turnIndicator.current.classList.remove("fadeOut");
            turnIndicator.current.classList.add("fadeIn");
            turnIndicator.current.textContent = "Maximizer's turn";
            turnIndicator.current.setAttribute("fill", "#fd7");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX,
          currentY,
          gainX,
          834,
          practiceAbortController,
        );
        currentX -= gainX;
        currentY -= 834;

        busy.current = false;
      };
      gameCanvas.current.parentNode.appendChild(rect);
    }

    drawGameTreeNode(treeCanvas.current, board.current, 1390, 0);
    expandGameTree(treeCanvas.current, board.current, "y", 0, 0);
    getStatus();

    async function getStatus() {
      busy.current = true;
      const signal = practiceAbortController.signal;
      await fetch("http://127.0.0.1:8000/status", { signal })
        .then((response) => response.json())
        .then((data) => {
          setStatus(data.status);
        })
        .catch((error) => {
          if (error.name != "AbortError") {
            setStatus("offline");
          }
        });
    }

    return () => {
      practiceAbortController?.abort();
      settingsAbortController.current?.abort();
    };
  }, []);

  useEffect(() => {
    alphaBetaPruningRef.current = alphaBetaPruning;
    depthLimitRef.current = depthLimit;
    depthLimitValueRef.current = depthLimitValue;
    if (statusRef.current != "loading") {
      loadingIndicator.current.classList.remove("fadeOut");
      loadingIndicator.current.classList.add("fadeIn");
      getEvaluations();
    }
  }, [alphaBetaPruning, depthLimit, depthLimitValue]);

  useEffect(() => {
    statusRef.current = status;
    if (status == "offline") {
      turnIndicator.current.classList.add("offline");
      loadingIndicator.current.classList.add("offline");

      let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.classList = "offlineText";
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-family", "Nunito, sans-serif");
      text.setAttribute("font-weight", "900");
      text.setAttribute("x", 1390);
      text.setAttribute("paint-order", "stroke");
      text.setAttribute("stroke", "#224");
      text.setAttribute("fill", "#fff");

      text.setAttribute("font-size", 52.125 * 1.75);
      text.setAttribute("y", -111.2 - 13.9 - 13.9 - 13.9);
      text.setAttribute("stroke-width", (6 * 1.75 * 278) / 126);
      text.textContent = "MiniMax API is offline...";
      treeCanvas.current.parentNode.appendChild(text);

      text = text.cloneNode(false);
      text.setAttribute("font-size", 52.125 * 1);
      text.setAttribute("y", -55.6 - 5.56);
      text.setAttribute("stroke-width", (6 * 1 * 278) / 126);
      treeCanvas.current.parentNode.appendChild(text);

      let tspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan",
      );
      tspan.textContent = "The ";
      tspan.setAttribute("fill", "#fff");
      text.appendChild(tspan);

      tspan = tspan.cloneNode(false);
      tspan.textContent = "minimizer ";
      tspan.setAttribute("fill", "#f77");
      text.appendChild(tspan);

      tspan = tspan.cloneNode(false);
      tspan.textContent = "will make random moves";
      tspan.setAttribute("fill", "#fff");
      text.appendChild(tspan);
    }
    if (status != "loading") startGame();
  }, [status]);

  return (
    <div className="gameContainer">
      <div className="gameContainerChild">
        <h3 className="practiceTitle">Connect four</h3>
        <GameCanvas ref={gameCanvas} />
      </div>
      <svg className="gameTree" viewBox="0 -111.2 2780 1112">
        <TreeCanvas ref={treeCanvas} />
        <TurnIndicator ref={turnIndicator} />
        <LoadingIndicator ref={loadingIndicator} />
      </svg>
    </div>
  );
}

let getEvaluationsPromiseResolve;
let getEvaluationsPromise = new Promise((resolve) => {
  getEvaluationsPromiseResolve = resolve;
});

export default PracticeConnectFour;
