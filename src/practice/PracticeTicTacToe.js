import React, { useEffect, useRef, useContext, useState } from "react";
import { EnvironmentContext } from "../Environment";

const GameCanvas = React.forwardRef((props, ref) => {
  return (
    <svg className="game" viewBox="0 0 126 126">
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
      fontSize={23.625 * 1.75} // <- ...
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Nunito, sans-serif"
      fontWeight="900"
      x="630"
      y={-50.4 - 6.3 - 6.3 - 6.3} // <- ...
      paintOrder="stroke"
      stroke="#224"
      strokeWidth={6 * 1.75} // <- ...
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
        cx="535.5"
        cy={-25.2 - 2.52} // <- ...
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
      <circle
        id="indicatorElement2"
        cx="598.5"
        cy={-25.2 - 2.52} // <- ...
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
      <circle
        id="indicatorElement3"
        cx="661.5"
        cy={-25.2 - 2.52} // <- ...
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
      <circle
        id="indicatorElement4"
        cx="724.5"
        cy={-25.2 - 2.52} // <- ...
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
    </g>
  );
});
LoadingIndicator.displayName = "LoadingIndicator";

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

async function drawX(gameCanvas, index, practiceAbortController) {
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

  if (practiceAbortController.signal.aborted) return;

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

async function handleGameOver(gameCanvas, result, practiceAbortController) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.classList = "resultText";
  text.setAttribute("font-size", 23.625);
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
  if (practiceAbortController.signal.aborted) return;
  gameCanvas.parentNode.classList = "gameReset";
  await new Promise((r) => setTimeout(r, 1000));
  if (practiceAbortController.signal.aborted) return;
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
      const col = i % 3;
      const row = Math.floor(i / 3);
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
    text.textContent = "...";
    treeCanvas.appendChild(text);

    drawGameTreeNode(treeCanvas, children[i], x2, y2);
  }
}

function PracticeTicTacToe() {
  const gameCanvas = useRef(null);
  const treeCanvas = useRef(null);
  const turnIndicator = useRef(null);
  const loadingIndicator = useRef(null);

  const board = useRef(new Array(9).fill(null));
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
      for (let i = 0; i < 9; i++) {
        if (!board.current[i]) {
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
    for (let i = 0; i < 9; i++) {
      if (board.current[i]) {
        state += board.current[i];
      } else state += "_";
    }
    const evaluationNodes = document.getElementsByClassName("evaluationNode");
    // console.log(
    //   `http://127.0.0.1:8000/tic_tac_toe/${state}?alpha_beta_pruning=${alphaBetaPruningRef.current}&depth_limit=${depthLimitRef.current}&depth_limit_value=${depthLimitValueRef.current}`,
    // );
    await fetch(
      `http://127.0.0.1:8000/tic_tac_toe/${state}?alpha_beta_pruning=${alphaBetaPruningRef.current}&depth_limit=${depthLimitRef.current}&depth_limit_value=${depthLimitValueRef.current}`,
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
    board.current = new Array(9);
    for (let i = 0; i < board.current.length; i++) {
      board.current[i] = null;
    }

    turnIndicator.current.classList.remove("fadeOut");
    turnIndicator.current.classList.add("fadeIn");
    turnIndicator.current.setAttribute("fill", "#f97");
    turnIndicator.current.textContent = "Maximizer's turn";

    drawGameTreeNode(treeCanvas.current, board.current, 630, 0);
    expandGameTree(treeCanvas.current, board.current, 0, 0);
    loadingIndicator.current.classList.remove("fadeOut");
    loadingIndicator.current.classList.add("fadeIn");
    getEvaluations();
  }

  useEffect(() => {
    const practiceAbortController = new AbortController();

    drawBoard(gameCanvas.current.parentNode);

    let moves, margin, gainX, turnInterval;

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", 40);
    rect.setAttribute("height", 40);
    rect.setAttribute("fill-opacity", 0);

    for (let index = 0; index < 9; index++) {
      const col = index % 3;
      const row = Math.floor(index / 3);

      rect = rect.cloneNode(false);
      rect.setAttribute("x", col * 43);
      rect.setAttribute("y", row * 43);
      rect.onclick = async () => {
        if (busy.current || board.current[index]) return;
        busy.current = true;

        drawX(gameCanvas.current, index, practiceAbortController);
        board.current[index] = "x";

        const newIndex =
          index -
          board.current.slice(0, index).filter((tile) => tile != null).length;
        moves = board.current.filter((tile) => tile == null).length + 1;
        margin = ((10 - moves) * 126) / (moves + 1);
        gainX = newIndex * (126 + margin) + 63 + margin - 630;

        if (checkVictory(board.current)) {
          await refocusGameTree(
            treeCanvas.current,
            currentX,
            currentY,
            gainX,
            378,
            practiceAbortController,
          );
          currentX -= gainX;
          currentY -= 378;
          await handleGameOver(
            gameCanvas.current,
            "x",
            practiceAbortController,
          );
          if (!practiceAbortController.signal.aborted) {
            startGame();
            turnIndicator.current.classList.remove("fadeIn");
            turnIndicator.current.classList.add("fadeOut");
          }
          return;
        }

        if (!board.current.some((tile) => tile == null)) {
          await refocusGameTree(
            treeCanvas.current,
            currentX,
            currentY,
            gainX,
            378,
            practiceAbortController,
          );
          currentX -= gainX;
          currentY -= 378;
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
          currentX - gainX,
          currentY - 378,
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
            turnIndicator.current.setAttribute("fill", "#7df");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX,
          currentY,
          gainX,
          378,
          practiceAbortController,
        );
        currentX -= gainX;
        currentY -= 378;

        if (practiceAbortController.signal.aborted) return;
        loadingIndicator.current.classList.remove("fadeOut");
        loadingIndicator.current.classList.add("fadeIn");
        const evaluations = await getEvaluationsPromise;
        const newMove = evaluations.indexOf(Math.min(...evaluations));
        let move = -1;
        let skipMoves = newMove;
        do {
          move++;
          if (!board.current[move]) skipMoves--;
        } while (skipMoves >= 0);

        if (practiceAbortController.signal.aborted) return;
        drawO(gameCanvas.current, move);
        board.current[move] = "o";

        moves = board.current.filter((tile) => tile == null).length + 1;
        margin = ((10 - moves) * 126) / (moves + 1);
        gainX = newMove * (126 + margin) + 63 + margin - 630;

        if (checkVictory(board.current)) {
          await refocusGameTree(
            treeCanvas.current,
            currentX,
            currentY,
            gainX,
            378,
            practiceAbortController,
          );
          currentX -= gainX;
          currentY -= 378;
          await handleGameOver(
            gameCanvas.current,
            "o",
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
          currentX - gainX,
          currentY - 378,
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
            turnIndicator.current.setAttribute("fill", "#f97");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX,
          currentY,
          gainX,
          378,
          practiceAbortController,
        );
        currentX -= gainX;
        currentY -= 378;

        busy.current = false;
      };
      gameCanvas.current.parentNode.appendChild(rect);
    }

    drawGameTreeNode(treeCanvas.current, board.current, 630, 0);
    expandGameTree(treeCanvas.current, board.current, 0, 0);
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
      text.setAttribute("x", 630);
      text.setAttribute("paint-order", "stroke");
      text.setAttribute("stroke", "#224");
      text.setAttribute("fill", "#fff");

      text.setAttribute("font-size", 23.625 * 1.75);
      text.setAttribute("y", -50.4 - 6.3 - 6.3 - 6.3);
      text.setAttribute("stroke-width", 6 * 1.75);
      text.textContent = "MiniMax API is offline...";
      treeCanvas.current.parentNode.appendChild(text);

      text = text.cloneNode(false);
      text.setAttribute("font-size", 23.625 * 1);
      text.setAttribute("y", -25.2 - 2.1);
      text.setAttribute("stroke-width", 6 * 1);
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
      tspan.setAttribute("fill", "#7df");
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
        <h3 className="practiceTitle">Tic-tac-toe</h3>
        <GameCanvas ref={gameCanvas} />
      </div>
      <svg className="gameTree" viewBox="0 -50.4 1260 504">
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

export default PracticeTicTacToe;
