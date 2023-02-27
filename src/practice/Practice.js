import React from "react";
import PropTypes from "prop-types";
import PracticeTree from "./PracticeTree";
import PracticeTicTacToe from "./PracticeTicTacToe";
import PracticeConnectFour from "./PracticeConnectFour";
import "./Practice.css";

function Practice(props) {
  const { practice } = props;
  switch (practice) {
    case "Tree":
      return <PracticeTree />;
    case "TicTacToe":
      return <PracticeTicTacToe />;
    case "ConnectFour":
      return <PracticeConnectFour />;
  }
}

Practice.propTypes = { practice: PropTypes.string };

export default Practice;
