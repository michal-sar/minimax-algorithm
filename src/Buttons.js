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
        id="buttonTree"
      ></button>
      <button
        className={`practiceButton ${practice == "TicTacToe" ? " active" : ""}`}
        onClick={() => setPractice("TicTacToe")}
        id="buttonTicTacToe"
      ></button>
      <button
        className={`practiceButton ${
          practice == "ConnectFour" ? " active" : ""
        }`}
        onClick={() => setPractice("ConnectFour")}
        id="buttonConnectFour"
      ></button>
    </div>
  );
}

PracticeButtons.propTypes = {
  practice: PropTypes.string,
  setPractice: PropTypes.func,
};

export { TheoryButtons, PracticeButtons };
