import React, { useState, useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import { drawTicTacToeGameTreeNode } from "../practice/drawTicTacToe";
import { drawConnectFourGameTreeNode } from "../practice/drawConnectFour";
import {
  getRandomTicTacToeState,
  getTicTacToeEstimation,
} from "../practice/helperTicTacToe";
import {
  getRandomConnectFourState,
  getConnectFourEstimation,
} from "../practice/helperConnectFour";

const TicTacToeCanvas = React.forwardRef((_, ref) => {
  return (
    <svg viewBox="0 0 126 126">
      <g ref={ref} />
    </svg>
  );
});
TicTacToeCanvas.displayName = "TicTacToeCanvas";

const ConnectFourCanvas = React.forwardRef((_, ref) => {
  return (
    <svg viewBox="0 -19 278 278">
      <g ref={ref} />
    </svg>
  );
});
ConnectFourCanvas.displayName = "ConnectFourCanvas";

const TicTacToeEstimation = React.forwardRef((_, ref) => {
  return (
    <svg
      width="226.8"
      viewBox="0 -10 226.8 38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        fontSize="23.625"
        textAnchor="middle"
        dominantBaseline="hanging"
        fontFamily="Nunito, sans-serif"
        fontWeight="900"
        x="113.4"
        y="0"
        paintOrder="stroke"
        stroke="#224"
        strokeWidth="6"
        strokeLinejoin="round"
        fill="#fff"
        ref={ref}
      ></text>
    </svg>
  );
});
TicTacToeEstimation.displayName = "TicTacToeEstimation";

const ConnectFourEstimation = React.forwardRef((_, ref) => {
  return (
    <svg
      width="226.8"
      viewBox="0 -10 226.8 38"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        fontSize="23.625"
        textAnchor="middle"
        dominantBaseline="hanging"
        fontFamily="Nunito, sans-serif"
        fontWeight="900"
        x="113.4"
        y="0"
        paintOrder="stroke"
        stroke="#224"
        strokeWidth="6"
        strokeLinejoin="round"
        fill="#fff"
        ref={ref}
      ></text>
    </svg>
  );
});
ConnectFourEstimation.displayName = "ConnectFourEstimation";

function TheoryHeuristics() {
  const ticTacToeCanvas = useRef(null);
  const connectFourCanvas = useRef(null);
  const ticTacToeEstimation = useRef(null);
  const connectFourEstimation = useRef(null);
  const [ticTacToeBoard, setTicTacToeBoard] = useState(
    getRandomTicTacToeState(),
  );
  const [connectFourBoard, setConnectFourBoard] = useState(
    getRandomConnectFourState(),
  );

  useEffect(() => {
    ticTacToeCanvas.current.innerHTML = "";
    drawTicTacToeGameTreeNode(
      ticTacToeCanvas.current,
      ticTacToeBoard,
      63,
      0,
      3,
    );
    getTicTacToeEstimation(ticTacToeEstimation.current, ticTacToeBoard);
  }, [ticTacToeBoard]);

  useEffect(() => {
    connectFourCanvas.current.innerHTML = "";
    drawConnectFourGameTreeNode(
      connectFourCanvas.current,
      connectFourBoard,
      139,
      -19,
      3,
    );
    getConnectFourEstimation(connectFourEstimation.current, connectFourBoard);
  }, [connectFourBoard]);

  return (
    <SimpleBar id="theoryContainer">
      <p>
        In the context of the MiniMax algorithm, <b>heuristics</b> are methods
        of estimating the utility of a state without having to complete the
        execution of the algorithm. They provide a way to make educated guesses
        on which <span className="outlineBlue">non-final states</span> are more
        likely to lead to a favorable outcome for the current player.
      </p>
      <p>
        A <u>heuristic function</u> utilizes heuristics to return an estimation
        of the utility of a given{" "}
        <span className="outlineBlue">non-final state</span> or return the
        utility of a given <span className="outlineRed">final state</span>.
      </p>
      <p>
        Here’s an example of a <u>heuristic function</u> for tic-tac-toe:
      </p>
      <div className="monospaced">
        <div className="functionContainer">
          <div>
            {"       "}⎧ <br />
            H(n) = ⎨ <br />
            {"       "}⎩ <br />
          </div>
          <div className="functionValues">
            U(n), n ∈ F<br />
            0.15 * (X<sub>2</sub>(n) - O<sub>2</sub>(n)), n ∉ F<br />
          </div>
        </div>
        <br />X<sub>2</sub> — returns the number of rows, columns, and diagonals
        containing exactly two X’s
        <br />O<sub>2</sub> — returns the number of rows, columns, and diagonals
        containing exactly two O’s
        <br />
      </div>
      <p>
        Here’s an example of a <u>heuristic function</u> for connect four:
      </p>
      <div className="monospaced">
        <div className="functionContainer">
          <div>
            {"       "}⎧ <br />
            H(n) = ⎨ <br />
            {"       "}⎩ <br />
          </div>
          <div className="functionValues">
            U(n), n ∈ F<br />
            0.02 * (Yellow<sub>2</sub>(n) + 2 * Yellow<sub>3</sub>(n) - Red
            <sub>2</sub>(n) - 2 * Red<sub>3</sub>(n)), n ∉ F<br />
          </div>
        </div>
        <br />
        Yellow<sub>2</sub> — returns the number of unfinished winning patterns
        containing exactly two yellow tokens
        <br />
        Yellow<sub>3</sub> — returns the number of unfinished winning patterns
        containing exactly three yellow tokens
        <br />
        Red<sub>2</sub> — returns the number of unfinished winning patterns
        containing exactly two red tokens
        <br />
        Red<sub>3</sub> — returns the number of unfinished winning patterns
        containing exactly three red tokens
        <br />
      </div>
      <div className="gameContainerDouble">
        <div>
          <TicTacToeCanvas ref={ticTacToeCanvas} />
          <TicTacToeEstimation ref={ticTacToeEstimation} />
          <button
            className="randomizeButton"
            onClick={() => setTicTacToeBoard(getRandomTicTacToeState())}
          >
            <svg
              width="40"
              viewBox="-10 -10 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                transform="rotate(-140 20 20)"
                fill="transparent"
                stroke="#224"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 0 18 A 20 20, 0, 1, 0, 18 0 M 1 12 L 6.206604869410697 22.81162641482903 L -4.2066048694106986 22.81162641482903 Z"
              />
            </svg>
          </button>
        </div>
        <div>
          <ConnectFourCanvas ref={connectFourCanvas} />
          <ConnectFourEstimation ref={connectFourEstimation} />
          <button
            className="randomizeButton"
            onClick={() => setConnectFourBoard(getRandomConnectFourState())}
          >
            <svg
              width="40"
              viewBox="-10 -10 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                transform="rotate(-140 20 20)"
                fill="transparent"
                stroke="#224"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 0 18 A 20 20, 0, 1, 0, 18 0 M 1 12 L 6.206604869410697 22.81162641482903 L -4.2066048694106986 22.81162641482903 Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <p>
        The examples of the heuristic functions provided above are used on this
        website to provide the utility of a state or it’s estimation where
        needed.
      </p>
      <p>
        The following pseudocode describes the depth-limited version of the
        MiniMax algorithm:
      </p>
      <div className="monospaced">
        d — depth limit
        <br />
        H — heuristic function
        <br />
        <br />
        <b>function</b> MiniMax(n, d, maximizer_turn)
        <br />
        <b>begin</b>
        <br />
        <span className="vertical">⎪ </span>
        <span hidden>{"  "}</span>
        <b>if</b> n ∈ F <b>or</b> d = 0 <b>then return</b> H(n)
        <br />
        <span className="vertical">⎪ </span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden>{"    "}</span>v {"<-"} -∞
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="vertical">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>v {"<-"} Max(v, MiniMax(s, d - 1,{" "}
        <i>False</i>))
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>return</b> v<br />
        <span className="vertical">⎪ </span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden>{"    "}</span>v {"<-"} +∞
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="vertical">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>v {"<-"} Min(v, MiniMax(s, d - 1,{" "}
        <i>True</i>))
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>return</b> v<br />
        <span className="vertical">⎪ </span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
        <b>end</b>
      </div>
      <p>
        Initial call:{" "}
        <span className="monospaced">
          MiniMax(n, d, <i>True</i>)
        </span>
        .
      </p>
      <p>
        The following pseudocode describes the depth-limited version of the
        MiniMax algorithm with alpha-beta pruning:
      </p>
      <div className="monospaced">
        <b>function</b> MiniMaxAlphaBeta(n, d, maximizer_turn, α, β)
        <br />
        <b>begin</b>
        <br />
        <span className="vertical">⎪ </span>
        <span hidden> </span>
        <b>if</b> n ∈ F <b>or</b> d = 0 <b>then return</b> H(n)
        <br />
        <span className="vertical">⎪ </span>
        <span hidden> </span>
        <b>if</b> maximizer_turn
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden> </span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="vertical">⎪ ⎪ ⎪ </span>
        <span hidden> </span>α {"<-"} Max(α, MiniMaxAlphaBeta(s, d - 1,{" "}
        <i>False</i>, α, β))
        <br />
        <span className="vertical">⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>if</b> α {">="} β<br />
        <span className="vertical">⎪ ⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> α<br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> α<br />
        <span className="vertical">⎪ </span>
        <span hidden> </span>
        <b>else</b>
        <br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden> </span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="vertical">⎪ ⎪ ⎪ </span>
        <span hidden> </span>β {"<-"} Min(β, MiniMaxAlphaBeta(s, d - 1,{" "}
        <i>True</i>, α, β))
        <br />
        <span className="vertical">⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>if</b> α {">="} β<br />
        <span className="vertical">⎪ ⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> β<br />
        <span className="vertical">⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> β<br />
        <span className="vertical">⎪ </span>
        <span hidden> </span>
        <b>end</b>
        <br />
        <b>end</b>
      </div>
      <p>
        Initial call:{" "}
        <span className="monospaced">
          MiniMaxAlphaBeta(n, d, <i>True</i>, -∞, +∞)
        </span>
        .
      </p>
      <p>
        It should be pointed out that, unlike alpha-beta pruning, using a depth
        limit and a heuristic function will result in the MiniMax algorithm
        making imperfect evaluations unless the heuristic function itself is
        perfect, which, in most cases, is unattainable. Therefore, the
        evaluations obtained from the MiniMax algorithm with or without
        alpha-beta pruning can differ from those obtained from depth-limited
        versions of these algorithms.
      </p>
    </SimpleBar>
  );
}

export default TheoryHeuristics;
