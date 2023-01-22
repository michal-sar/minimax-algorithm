import React from "react";
import PropTypes from "prop-types";
import TheoryMiniMaxAlgorithm from "./TheoryMiniMaxAlgorithm";
import TheoryAlphaBetaPruning from "./TheoryAlphaBetaPruning";
import TheoryDepthLimit from "./TheoryDepthLimit";
import TheoryHeuristics from "./TheoryHeuristics";
import "./Theory.css";

function Theory(props) {
  const { theory } = props;
  switch (theory) {
    case "MiniMaxAlgorithm":
      return <TheoryMiniMaxAlgorithm />;
    case "AlphaBetaPruning":
      return <TheoryAlphaBetaPruning />;
    case "DepthLimit":
      return <TheoryDepthLimit />;
    case "Heuristics":
      return <TheoryHeuristics />;
  }
}

Theory.propTypes = {
  theory: PropTypes.string,
};

export default Theory;
