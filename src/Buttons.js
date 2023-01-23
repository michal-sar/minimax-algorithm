import React from "react";
import PropTypes from "prop-types";
import "./Buttons.css";

function TheoryButtons(props) {
  const { theory, setTheory } = props;
  return (
    <div className="theoryButtons">
      <button
        className={`theoryButton ${
          theory == "MiniMaxAlgorithm" ? " active" : ""
        }`}
        onClick={() => setTheory("MiniMaxAlgorithm")}
      >
        MiniMax algorithm
      </button>
      <button
        className={`theoryButton ${
          theory == "AlphaBetaPruning" ? " active" : ""
        }`}
        onClick={() => setTheory("AlphaBetaPruning")}
      >
        Alpha-beta pruning
      </button>
      <button
        className={`theoryButton ${theory == "DepthLimit" ? " active" : ""}`}
        onClick={() => setTheory("DepthLimit")}
      >
        Depth limit
      </button>
      <button
        className={`theoryButton ${theory == "Heuristics" ? " active" : ""}`}
        onClick={() => setTheory("Heuristics")}
        id="buttonHeuristics"
      >
        Heuristics
      </button>
    </div>
  );
}

TheoryButtons.propTypes = {
  theory: PropTypes.string,
  setTheory: PropTypes.func,
};

function PracticeButtons(props) {
  const { practice, setPractice } = props;
  return (
    <div className="practiceButtons">
      <button
        className={`practiceButton ${practice == "Tree" ? " active" : ""}`}
        onClick={() => setPractice("Tree")}
      >
        <svg viewBox="0 0 189 189">
          <line
            stroke="#224"
            strokeWidth="4"
            x1="94.5"
            x2="22.5"
            y1="22.5"
            y2="70.5"
          ></line>
          <line
            stroke="#224"
            strokeWidth="4"
            x1="94.5"
            x2="70.5"
            y1="22.5"
            y2="70.5"
          ></line>
          <line
            stroke="#224"
            strokeWidth="4"
            x1="94.5"
            x2="142.5"
            y1="22.5"
            y2="70.5"
          ></line>
          <line
            stroke="#224"
            strokeWidth="4"
            x1="70.5"
            x2="70.5"
            y1="70.5"
            y2="118.5"
          ></line>
          <line
            stroke="#224"
            strokeWidth="4"
            x1="142.5"
            x2="118.5"
            y1="70.5"
            y2="118.5"
          ></line>
          <line
            stroke="#224"
            strokeWidth="4"
            x1="142.5"
            x2="166.5"
            y1="70.5"
            y2="118.5"
          ></line>
          <line
            stroke="#224"
            strokeWidth="4"
            x1="118.5"
            x2="118.5"
            y1="118.5"
            y2="166.5"
          ></line>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="94.5"
            cy="23"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="22.5"
            cy="70.5"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="70.5"
            cy="70.5"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="142.5"
            cy="70.5"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="70.5"
            cy="118.5"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="118.5"
            cy="118.5"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="166.5"
            cy="118.5"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="4"
            fill="#fff"
            cx="118.5"
            cy="166.5"
          ></circle>
          <text
            fontSize="20"
            fill="#224"
            textAnchor="middle"
            dominantBaseline="central"
            x="22.5"
            y="70.5"
          >
            1
          </text>
          <text
            fontSize="20"
            fill="#224"
            textAnchor="middle"
            dominantBaseline="central"
            x="70.5"
            y="118.5"
          >
            -2
          </text>
          <text
            fontSize="20"
            fill="#224"
            textAnchor="middle"
            dominantBaseline="central"
            x="166.5"
            y="118.5"
          >
            -4
          </text>
          <text
            fontSize="20"
            fill="#224"
            textAnchor="middle"
            dominantBaseline="central"
            x="118.5"
            y="167"
          >
            4
          </text>
        </svg>
      </button>
      <button
        className={`practiceButton ${practice == "TicTacToe" ? " active" : ""}`}
        onClick={() => setPractice("TicTacToe")}
      >
        <svg viewBox="0 0 140 140">
          <line
            x1="48.5"
            x2="48.5"
            y1="10"
            y2="130"
            stroke="#224"
            strokeWidth="3"
            strokeLinecap="round"
          ></line>
          <line
            x1="91.5"
            x2="91.5"
            y1="10"
            y2="130"
            stroke="#224"
            strokeWidth="3"
            strokeLinecap="round"
          ></line>
          <line
            x1="10"
            x2="130"
            y1="48.5"
            y2="48.5"
            stroke="#224"
            strokeWidth="3"
            strokeLinecap="round"
          ></line>
          <line
            x1="10"
            x2="130"
            y1="91.5"
            y2="91.5"
            stroke="#224"
            strokeWidth="3"
            strokeLinecap="round"
          ></line>
          <circle
            cx="27"
            cy="27"
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#7df"
          ></circle>
          <circle
            cx="27"
            cy="27"
            r="9"
            stroke="#224"
            strokeWidth="3"
            fill="#fff"
          ></circle>
          <line
            x1="58.5"
            x2="81.5"
            y1="58.5"
            y2="81.5"
            stroke="#224"
            strokeWidth="9"
            strokeLinecap="round"
          ></line>
          <line
            x1="58.5"
            x2="81.5"
            y1="81.5"
            y2="58.5"
            stroke="#224"
            strokeWidth="9"
            strokeLinecap="round"
          ></line>
          <line
            x1="58.5"
            x2="81.5"
            y1="58.5"
            y2="81.5"
            stroke="#f97"
            strokeWidth="3"
            strokeLinecap="round"
          ></line>
          <line
            x1="58.5"
            x2="81.5"
            y1="81.5"
            y2="58.5"
            stroke="#f97"
            strokeWidth="3"
            strokeLinecap="round"
          ></line>
        </svg>
      </button>
      <button
        className={`practiceButton ${
          practice == "ConnectFour" ? " active" : ""
        }`}
        onClick={() => setPractice("ConnectFour")}
      >
        <svg viewBox="0 0 140 140">
          <rect
            x="8.5"
            y="8.5"
            rx="10"
            ry="10"
            width="123"
            height="123"
            fill="#77f"
            stroke="#224"
            strokeWidth="3"
          ></rect>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#fff"
            cx="32"
            cy="32"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#fff"
            cx="70"
            cy="32"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#fff"
            cx="108"
            cy="32"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#fff"
            cx="32"
            cy="70"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#f77"
            cx="70"
            cy="70"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#fff"
            cx="108"
            cy="70"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#f77"
            cx="32"
            cy="108"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#fd7"
            cx="70"
            cy="108"
          ></circle>
          <circle
            r="15"
            stroke="#224"
            strokeWidth="3"
            fill="#fd7"
            cx="108"
            cy="108"
          ></circle>
        </svg>
      </button>
    </div>
  );
}

PracticeButtons.propTypes = {
  practice: PropTypes.string,
  setPractice: PropTypes.func,
};

export { TheoryButtons, PracticeButtons };
