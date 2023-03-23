import React, { useEffect, useRef, useContext } from "react";
import { EnvironmentContext } from "../Environment";
import PropTypes from "prop-types";
import {
  drawTicTacToeBoard,
  drawX,
  drawO,
  drawGameTreeNode,
  expandGameTree,
} from "./drawTicTacToe";
import {
  handleWaiting,
  handleRunning,
  handleTimeout,
  handleComplete,
} from "./handleRequestStatus";

const GameCanvas = React.forwardRef((_, ref) => {
  return (
    <svg className="game" viewBox="0 0 126 126">
      <g ref={ref} />
    </svg>
  );
});
GameCanvas.displayName = "GameCanvas";

const TreeCanvas = React.forwardRef((_, ref) => {
  return <g ref={ref} />;
});
TreeCanvas.displayName = "TreeCanvas";

const RequestStatusIndicator = React.forwardRef((_, ref) => {
  return (
    <text
      className="requestStatusIndicator"
      fontSize={41.34375}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Nunito, sans-serif"
      fontWeight="900"
      x="630"
      y={-69.3}
      paintOrder="stroke"
      stroke="#224"
      strokeWidth={10.5}
      ref={ref}
    ></text>
  );
});
RequestStatusIndicator.displayName = "RequestStatusIndicator";

const WaitingIndicator = React.forwardRef((_, ref) => {
  return (
    <g className="waitingIndicator" ref={ref}>
      <circle
        id="indicatorElement1"
        cx="535.5"
        cy={-27.72}
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
      <circle
        id="indicatorElement2"
        cx="598.5"
        cy={-27.72}
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
      <circle
        id="indicatorElement3"
        cx="661.5"
        cy={-27.72}
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
      <circle
        id="indicatorElement4"
        cx="724.5"
        cy={-27.72}
        r="8"
        fill="#fff"
        stroke="#224"
        strokeWidth="5"
      ></circle>
    </g>
  );
});
WaitingIndicator.displayName = "WaitingIndicator";

const EvaluatedNodesIndicator = React.forwardRef((_, ref) => {
  return (
    <text
      className="evaluatedNodesIndicator"
      fontSize={23.625}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Nunito, sans-serif"
      fontWeight="900"
      x="630"
      y={-27.3}
      paintOrder="stroke"
      fill="#fff"
      stroke="#224"
      strokeWidth={8.5}
      ref={ref}
    ></text>
  );
});
EvaluatedNodesIndicator.displayName = "EvaluatedNodesIndicator";

async function handleGameOver(gameCanvas, result) {
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
  if (!gameCanvas.parentNode) return;
  gameCanvas.parentNode.classList = "gameReset";
  await new Promise((r) => setTimeout(r, 1000));
  if (!gameCanvas.parentNode) return;
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

async function refocusGameTree(treeCanvas, currentX, currentY, gainX, gainY) {
  let newX = currentX;
  let newY = currentY;

  gainX /= 25;
  gainY /= 25;

  for (let i = 0; i < 25; i++) {
    if (!treeCanvas) return;
    newX -= gainX;
    newY -= gainY;
    treeCanvas.setAttribute("transform", `translate(${newX}, ${newY})`);
    await new Promise((r) => setTimeout(r, 25));
  }
}

function PracticeTicTacToe(props) {
  const { webSocket, webSocketState } = props;
  const webSocketStateRef = useRef(webSocketState);

  const { alphaBetaPruning, depthLimit, depthLimitValue } =
    useContext(EnvironmentContext);
  const alphaBetaPruningRef = useRef(null);
  const depthLimitRef = useRef(null);
  const depthLimitValueRef = useRef(null);

  const gameCanvas = useRef(null);
  const treeCanvas = useRef(null);
  const requestStatusIndicator = useRef(null);
  const waitingIndicator = useRef(null);
  const evaluatedNodesIndicator = useRef(null);

  const instructionInterval = useRef(null);

  const board = useRef(new Array(9).fill(null));
  let busy = useRef(null);
  let turn = useRef("Maximizer");
  let currentX = 0;
  let currentY = 0;
  let offsetX = 0;
  let offsetY = 0;

  async function getEvaluations() {
    if (webSocketStateRef.current == "CONNECTING") {
      return;
    }

    if (
      webSocketStateRef.current != "CONNECTING" &&
      webSocketStateRef.current != "OPEN"
    ) {
      let evaluations = [];
      for (let i = 0; i < 9; i++) {
        if (!board.current[i]) {
          evaluations.push(Math.floor(Math.random() * 3 - 1));
        }
      }
      getEvaluationsPromiseResolve(evaluations);
      return;
    }

    if (webSocketStateRef.current == "OPEN") {
      waitingIndicator.current.classList.remove("fadeOut");
      waitingIndicator.current.classList.add("fadeIn");

      evaluatedNodesIndicator.current.classList.remove("fadeIn");
      evaluatedNodesIndicator.current.classList.add("fadeOut");

      const evaluationNodes = document.getElementsByClassName("evaluationNode");
      let i = evaluationNodes.length;
      for (let j = 0; j < 9; j++) {
        if (board.current[j] == null) {
          i--;
          evaluationNodes[i].textContent = "...";
        }
      }

      let state = "";
      for (let i = 0; i < 9; i++) {
        if (board.current[i]) {
          state += board.current[i];
        } else state += "_";
      }
      webSocket.send(
        JSON.stringify({
          type: "tic_tac_toe",
          board: state,
          alpha_beta_pruning: alphaBetaPruningRef.current,
          depth_limit: depthLimitRef.current,
          depth_limit_value: depthLimitValueRef.current,
        }),
      );
    }
  }

  async function startGame() {
    gameCanvas.current.innerHTML = "";

    turn.current = "Maximizer";

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

    requestStatusIndicator.current.classList.remove("fadeOut");
    requestStatusIndicator.current.classList.add("fadeIn");
    requestStatusIndicator.current.setAttribute("fill", "#f97");
    requestStatusIndicator.current.textContent = "Maximizer's turn";

    drawGameTreeNode(treeCanvas.current, board.current, 630, 0);
    expandGameTree(treeCanvas.current, board.current, 0, 0);
    getEvaluations();
  }

  useEffect(() => {
    webSocket.onmessage = (event) => {
      if (!requestStatusIndicator.current) return;

      const message = JSON.parse(event.data);
      switch (message.status) {
        case "waiting":
          handleWaiting(
            requestStatusIndicator.current,
            instructionInterval.current,
          );
          break;
        case "running":
          handleRunning(
            requestStatusIndicator.current,
            instructionInterval.current,
            turn.current,
            "#f97",
            "#7df",
          );
          break;
        case "timeout":
          handleTimeout(
            requestStatusIndicator.current,
            instructionInterval.current,
            waitingIndicator.current,
            evaluatedNodesIndicator.current,
          );
          break;
        case "complete":
          handleComplete(
            requestStatusIndicator.current,
            instructionInterval.current,
            waitingIndicator.current,
            evaluatedNodesIndicator.current,
            turn.current,
            message,
            getEvaluationsPromiseResolve,
            "#f97",
            "#7df",
          );
          break;
      }
    };

    drawTicTacToeBoard(gameCanvas.current.parentNode);

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

        drawX(gameCanvas.current, index);
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
            currentX + offsetX,
            currentY + offsetY,
            gainX + offsetX,
            378 + offsetY,
          );
          if (!gameCanvas.current) return;
          offsetX = 0;
          offsetY = 0;
          currentX -= gainX;
          currentY -= 378;
          await handleGameOver(gameCanvas.current, "x");
          if (gameCanvas.current) {
            startGame();
            requestStatusIndicator.current.classList.remove("fadeIn");
            requestStatusIndicator.current.classList.add("fadeOut");
            evaluatedNodesIndicator.current.classList.remove("fadeIn");
            evaluatedNodesIndicator.current.classList.add("fadeOut");
          }
          return;
        }

        if (!board.current.some((tile) => tile == null)) {
          await refocusGameTree(
            treeCanvas.current,
            currentX + offsetX,
            currentY + offsetY,
            gainX + offsetX,
            378 + offsetY,
          );
          if (!gameCanvas.current) return;
          offsetX = 0;
          offsetY = 0;
          currentX -= gainX;
          currentY -= 378;
          await handleGameOver(gameCanvas.current, "draw");
          if (gameCanvas.current) {
            startGame();
            requestStatusIndicator.current.classList.remove("fadeIn");
            requestStatusIndicator.current.classList.add("fadeOut");
            evaluatedNodesIndicator.current.classList.remove("fadeIn");
            evaluatedNodesIndicator.current.classList.add("fadeOut");
          }
          return;
        }

        if (!treeCanvas.current) return;
        expandGameTree(
          treeCanvas.current,
          board.current,
          currentX - gainX,
          currentY - 378,
        );

        getEvaluationsPromise = new Promise((resolve) => {
          getEvaluationsPromiseResolve = resolve;
        });
        getEvaluations();

        requestStatusIndicator.current.classList.remove("fadeIn");
        requestStatusIndicator.current.classList.add("fadeOut");
        turnInterval = setInterval(() => {
          if (requestStatusIndicator.current) {
            requestStatusIndicator.current.classList.remove("fadeOut");
            requestStatusIndicator.current.classList.add("fadeIn");
            turn.current = "Minimizer";
            requestStatusIndicator.current.textContent = "Minimizer's turn";
            requestStatusIndicator.current.setAttribute("fill", "#7df");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX + offsetX,
          currentY + offsetY,
          gainX + offsetX,
          378 + offsetY,
        );
        offsetX = 0;
        offsetY = 0;
        currentX -= gainX;
        currentY -= 378;

        const evaluations = await getEvaluationsPromise;
        const newMove = evaluations.indexOf(Math.min(...evaluations));
        let move = -1;
        let skipMoves = newMove;
        do {
          move++;
          if (!board.current[move]) skipMoves--;
        } while (skipMoves >= 0);

        if (!gameCanvas.current) return;
        drawO(gameCanvas.current, move);
        board.current[move] = "o";

        moves = board.current.filter((tile) => tile == null).length + 1;
        margin = ((10 - moves) * 126) / (moves + 1);
        gainX = newMove * (126 + margin) + 63 + margin - 630;

        if (checkVictory(board.current)) {
          await refocusGameTree(
            treeCanvas.current,
            currentX + offsetX,
            currentY + offsetY,
            gainX + offsetX,
            378 + offsetY,
          );
          if (!gameCanvas.current) return;
          offsetX = 0;
          offsetY = 0;
          currentX -= gainX;
          currentY -= 378;
          await handleGameOver(gameCanvas.current, "o");
          if (gameCanvas.current) {
            startGame();
            requestStatusIndicator.current.classList.remove("fadeIn");
            requestStatusIndicator.current.classList.add("fadeOut");
            evaluatedNodesIndicator.current.classList.remove("fadeIn");
            evaluatedNodesIndicator.current.classList.add("fadeOut");
          }
          return;
        }

        if (!treeCanvas.current) return;
        expandGameTree(
          treeCanvas.current,
          board.current,
          currentX - gainX,
          currentY - 378,
        );
        await new Promise((r) => setTimeout(r, 1000));
        getEvaluations();

        requestStatusIndicator.current.classList.remove("fadeIn");
        requestStatusIndicator.current.classList.add("fadeOut");
        turnInterval = setInterval(() => {
          if (requestStatusIndicator.current) {
            requestStatusIndicator.current.classList.remove("fadeOut");
            requestStatusIndicator.current.classList.add("fadeIn");
            turn.current = "Maximizer";
            requestStatusIndicator.current.textContent = "Maximizer's turn";
            requestStatusIndicator.current.setAttribute("fill", "#f97");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX + offsetX,
          currentY + offsetY,
          gainX + offsetX,
          378 + offsetY,
        );
        offsetX = 0;
        offsetY = 0;
        currentX -= gainX;
        currentY -= 378;

        busy.current = false;
      };
      gameCanvas.current.parentNode.appendChild(rect);
    }

    treeCanvas.current.parentNode.addEventListener("mousemove", (event) => {
      if (event.buttons == 1) {
        offsetX += parseFloat(event.movementX * 1.46);
        offsetY += parseFloat(event.movementY * 1.46);
        treeCanvas.current.setAttribute(
          "transform",
          `translate(${currentX + offsetX}, ${currentY + offsetY})`,
        );
      }
    });

    drawGameTreeNode(treeCanvas.current, board.current, 630, 0);
    expandGameTree(treeCanvas.current, board.current, 0, 0);

    return () => {
      if (webSocketStateRef.current == "OPEN")
        webSocket.send(JSON.stringify({ type: "cancel_task" }));
    };
  }, []);

  useEffect(() => {
    if (
      webSocketStateRef.current != "CONNECTING" &&
      depthLimitValueRef.current
    ) {
      alphaBetaPruningRef.current = alphaBetaPruning;
      depthLimitRef.current = depthLimit;
      depthLimitValueRef.current = depthLimitValue;
      getEvaluations();
    } else {
      alphaBetaPruningRef.current = alphaBetaPruning;
      depthLimitRef.current = depthLimit;
      depthLimitValueRef.current = depthLimitValue;
    }
  }, [alphaBetaPruning, depthLimit, depthLimitValue]);

  useEffect(() => {
    webSocketStateRef.current = webSocketState;
    if (webSocketState != "CONNECTING" && webSocketState != "OPEN") {
      requestStatusIndicator.current.classList.add("offline");
      waitingIndicator.current.classList.add("offline");
      evaluatedNodesIndicator.current.classList.add("offline");

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
      text.setAttribute("font-size", 41.34375);
      text.setAttribute("y", -69.3);
      text.setAttribute("stroke-width", 10.5);
      if (webSocketState == "1006")
        text.textContent = "Could not connect to the server...";
      else if (webSocketState == "1008")
        text.textContent = "There are too many concurrent users...";
      else
        text.textContent = `WebSocket close with status code ${webSocketState}`;
      treeCanvas.current.parentNode.appendChild(text);

      text = text.cloneNode(false);
      text.setAttribute("font-size", 23.625);
      text.setAttribute("y", -27.3);
      text.setAttribute("stroke-width", 8.5);
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
    if (webSocketState != "CONNECTING") startGame();
    else busy.current = true;
  }, [webSocketState]);

  return (
    <div className="gameContainer">
      <div className="gameContainerChild">
        <h3 className="practiceTitle">Tic-tac-toe</h3>
        <GameCanvas ref={gameCanvas} />
      </div>
      <svg className="gameTree" viewBox="0 -50.4 1260 504">
        <TreeCanvas ref={treeCanvas} />
        <RequestStatusIndicator ref={requestStatusIndicator} />
        <EvaluatedNodesIndicator ref={evaluatedNodesIndicator} />
        <WaitingIndicator ref={waitingIndicator} />
      </svg>
    </div>
  );
}

let getEvaluationsPromiseResolve;
let getEvaluationsPromise = new Promise((resolve) => {
  getEvaluationsPromiseResolve = resolve;
});

PracticeTicTacToe.propTypes = {
  webSocket: PropTypes.instanceOf(WebSocket).isRequired,
  webSocketState: PropTypes.string,
};

export default PracticeTicTacToe;
