import React, { useEffect, useRef, useContext } from "react";
import { EnvironmentContext } from "../Environment";
import PropTypes from "prop-types";
import {
  drawConnectFourBoard,
  drawYellow,
  drawRed,
  drawGameTreeNode,
  expandGameTree,
} from "./drawConnectFour";
import {
  handleWaiting,
  handleRunning,
  handleTimeout,
  handleComplete,
} from "./handleRequestStatus";

const GameCanvas = React.forwardRef((_, ref) => {
  return (
    <svg className="game" viewBox="0 -19 278 278">
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
      fontSize={91.21875}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Nunito, sans-serif"
      fontWeight="900"
      x="1390"
      y={-152.9}
      paintOrder="stroke"
      stroke="#224"
      strokeWidth={(10.5 * 278) / 126}
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
        cx="1181.5"
        cy={-61.16}
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
      <circle
        id="indicatorElement2"
        cx="1320.5"
        cy={-61.16}
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
      <circle
        id="indicatorElement3"
        cx="1459.5"
        cy={-61.16}
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
      <circle
        id="indicatorElement4"
        cx="1598.5"
        cy={-61.16}
        r={(8 * 278) / 126}
        fill="#fff"
        stroke="#224"
        strokeWidth={(5 * 278) / 126}
      ></circle>
    </g>
  );
});
WaitingIndicator.displayName = "WaitingIndicator";

const EvaluatedNodesIndicator = React.forwardRef((_, ref) => {
  return (
    <text
      className="evaluatedNodesIndicator"
      fontSize={52.125}
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="Nunito, sans-serif"
      fontWeight="900"
      x="1390"
      y={-61.16}
      paintOrder="stroke"
      fill="#fff"
      stroke="#224"
      strokeWidth={(8.5 * 278) / 126}
      ref={ref}
    ></text>
  );
});
EvaluatedNodesIndicator.displayName = "EvaluatedNodesIndicator";

async function handleGameOver(gameCanvas, result) {
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
  text.setAttribute("stroke-width", (6 * 278) / 126);

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
  if (!gameCanvas.parentNode) return;
  gameCanvas.parentNode.classList = "gameReset";
  await new Promise((r) => setTimeout(r, 1000));
  if (!gameCanvas.parentNode) return;
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

function PracticeConnectFour(props) {
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

  const board = useRef(new Array(7).fill(new Array()));
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
      for (let i = 0; i < 7; i++) {
        if (!board.current[i][5]) {
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
      for (let j = 0; j < 7; j++) {
        if (board.current[j].length < 6) {
          i--;
          evaluationNodes[i].textContent = "...";
        }
      }

      let state = "";
      for (let i = 0; i < 7; i++) {
        let j = 0;
        while (board.current[i][j]) {
          state += board.current[i][j];
          j++;
        }
        if (i < 6) state += ",";
      }
      webSocket.send(
        JSON.stringify({
          type: "connect_four",
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
    board.current = new Array(7);
    for (let i = 0; i < board.current.length; i++) {
      board.current[i] = new Array();
    }

    requestStatusIndicator.current.classList.remove("fadeOut");
    requestStatusIndicator.current.classList.add("fadeIn");
    requestStatusIndicator.current.setAttribute("fill", "#fd7");
    requestStatusIndicator.current.textContent = "Maximizer's turn";

    drawGameTreeNode(treeCanvas.current, board.current, 1390, 0);
    expandGameTree(treeCanvas.current, board.current, "y", 0, 0);
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
            "#fd7",
            "#f77",
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
            "#fd7",
            "#f77",
          );
          break;
      }
    };

    drawConnectFourBoard(gameCanvas.current.parentNode);

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
            currentX + offsetX,
            currentY + offsetY,
            gainX + offsetX,
            834 + offsetY,
          );
          if (!gameCanvas.current) return;
          offsetX = 0;
          offsetY = 0;
          currentX -= gainX;
          currentY -= 834;
          await handleGameOver(gameCanvas.current, "yellow");
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
          "r",
          currentX - gainX,
          currentY - 834,
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
            requestStatusIndicator.current.setAttribute("fill", "#f77");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX + offsetX,
          currentY + offsetY,
          gainX + offsetX,
          834 + offsetY,
        );
        offsetX = 0;
        offsetY = 0;
        currentX -= gainX;
        currentY -= 834;

        const evaluations = await getEvaluationsPromise;
        await new Promise((r) => setTimeout(r, 1000));
        const newMove = evaluations.indexOf(Math.min(...evaluations));
        let move = -1;
        let skipMoves = newMove;
        do {
          move++;
          if (!board.current[move][5]) skipMoves--;
        } while (skipMoves >= 0);

        if (!gameCanvas.current) return;
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
            currentX + offsetX,
            currentY + offsetY,
            gainX + offsetX,
            834 + offsetY,
          );
          if (!gameCanvas.current) return;
          offsetX = 0;
          offsetY = 0;
          currentX -= gainX;
          currentY -= 834;
          await handleGameOver(gameCanvas.current, "red");
          if (gameCanvas.current) {
            startGame();
            requestStatusIndicator.current.classList.remove("fadeIn");
            requestStatusIndicator.current.classList.add("fadeOut");
            evaluatedNodesIndicator.current.classList.remove("fadeIn");
            evaluatedNodesIndicator.current.classList.add("fadeOut");
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
            currentX + offsetX,
            currentY + offsetY,
            gainX + offsetX,
            834 + offsetY,
          );
          if (!gameCanvas.current) return;
          offsetX = 0;
          offsetY = 0;
          currentX -= gainX;
          currentY -= 834;
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
          "y",
          currentX - gainX,
          currentY - 834,
        );
        getEvaluations();

        requestStatusIndicator.current.classList.remove("fadeIn");
        requestStatusIndicator.current.classList.add("fadeOut");
        turnInterval = setInterval(() => {
          if (requestStatusIndicator.current) {
            requestStatusIndicator.current.classList.remove("fadeOut");
            requestStatusIndicator.current.classList.add("fadeIn");
            turn.current = "Maximizer";
            requestStatusIndicator.current.textContent = "Maximizer's turn";
            requestStatusIndicator.current.setAttribute("fill", "#fd7");
            clearInterval(turnInterval);
          }
        }, 312.5);

        await refocusGameTree(
          treeCanvas.current,
          currentX + offsetX,
          currentY + offsetY,
          gainX + offsetX,
          834 + offsetY,
        );
        offsetX = 0;
        offsetY = 0;
        currentX -= gainX;
        currentY -= 834;

        busy.current = false;
      };
      gameCanvas.current.parentNode.appendChild(rect);
    }

    treeCanvas.current.parentNode.addEventListener("mousemove", (event) => {
      if (event.buttons == 1) {
        offsetX += parseFloat((event.movementX * (1.62 * 278)) / 126);
        offsetY += parseFloat((event.movementY * (1.62 * 278)) / 126);
        treeCanvas.current.setAttribute(
          "transform",
          `translate(${currentX + offsetX}, ${currentY + offsetY})`,
        );
      }
    });

    drawGameTreeNode(treeCanvas.current, board.current, 1390, 0);
    expandGameTree(treeCanvas.current, board.current, "y", 0, 0);

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
      text.setAttribute("x", 1390);
      text.setAttribute("paint-order", "stroke");
      text.setAttribute("stroke", "#224");
      text.setAttribute("fill", "#fff");
      text.setAttribute("font-size", 91.21875);
      text.setAttribute("y", -152.9);
      text.setAttribute("stroke-width", (10.5 * 278) / 126);
      if (webSocketState == "1006")
        text.textContent = "Could not connect to the server...";
      else if (webSocketState == "1008")
        text.textContent = "There are too many concurrent users...";
      else
        text.textContent = `WebSocket close with status code ${webSocketState}`;
      treeCanvas.current.parentNode.appendChild(text);

      text = text.cloneNode(false);
      text.setAttribute("font-size", 52.125);
      text.setAttribute("y", -61.16);
      text.setAttribute("stroke-width", (8.5 * 278) / 126);
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
    if (webSocketState != "CONNECTING") startGame();
    else busy.current = true;
  }, [webSocketState]);

  return (
    <div className="gameContainer">
      <div className="gameContainerChild">
        <h3 className="practiceTitle">Connect four</h3>
        <GameCanvas ref={gameCanvas} />
      </div>
      <svg className="gameTree" viewBox="0 -111.2 2780 1112">
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

PracticeConnectFour.propTypes = {
  webSocket: PropTypes.instanceOf(WebSocket).isRequired,
  webSocketState: PropTypes.string,
};

export default PracticeConnectFour;
