import React from "react";
import PropTypes from "prop-types";
import PracticeTree from "./PracticeTree";
import PracticeTicTacToe from "./PracticeTicTacToe";
import PracticeConnectFour from "./PracticeConnectFour";
import "./Practice.css";

function Practice(props) {
  const { practice, alphaBetaPruning, depthLimit, depthLimitValue } = props;
  switch (practice) {
    case "Tree":
      return (
        <PracticeTree
          alphaBetaPruning={alphaBetaPruning}
          depthLimit={depthLimit}
          depthLimitValue={depthLimitValue}
        />
      );
    case "TicTacToe":
      return (
        <PracticeTicTacToe
          alphaBetaPruning={alphaBetaPruning}
          depthLimit={depthLimit}
          depthLimitValue={depthLimitValue}
        />
      );
    case "ConnectFour":
      return (
        <PracticeConnectFour
          alphaBetaPruning={alphaBetaPruning}
          depthLimit={depthLimit}
          depthLimitValue={depthLimitValue}
        />
      );
  }
}

Practice.propTypes = {
  practice: PropTypes.string,
  alphaBetaPruning: PropTypes.bool,
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
};

export default Practice;
