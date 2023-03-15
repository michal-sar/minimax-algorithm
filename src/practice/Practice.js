import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import PracticeTree from "./PracticeTree";
import PracticeTicTacToe from "./PracticeTicTacToe";
import PracticeConnectFour from "./PracticeConnectFour";
import "./Practice.css";

function Practice(props) {
  const { practice } = props;

  const webSocket = useMemo(() => {
    return new WebSocket("ws://localhost:8000/ws");
  }, []);
  const [webSocketState, setWebSocketState] = useState("CONNECTING");

  webSocket.onopen = () => {
    setWebSocketState("OPEN");
  };

  webSocket.onclose = () => {
    setWebSocketState("CLOSED");
  };

  switch (practice) {
    case "Tree":
      return <PracticeTree />;
    case "TicTacToe":
      return (
        <PracticeTicTacToe
          webSocket={webSocket}
          webSocketState={webSocketState}
        />
      );
    case "ConnectFour":
      return (
        <PracticeConnectFour
          webSocket={webSocket}
          webSocketState={webSocketState}
        />
      );
  }
}

Practice.propTypes = { practice: PropTypes.string };

export default Practice;
