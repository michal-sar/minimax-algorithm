import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Canvas = React.forwardRef((props, ref) => {
  return <svg viewBox="0 0 500 500" ref={ref} />;
});
Canvas.displayName = "Canvas";

function drawBoard(canvas, x1, y1) {
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1 + 41.5);
  line.setAttribute("x2", x1 + 41.5);
  line.setAttribute("y1", y1 + 3);
  line.setAttribute("y2", y1 + 123);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 3);
  line.setAttribute("stroke-linecap", "round");
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", x1 + 84.5);
  line.setAttribute("x2", x1 + 84.5);
  line.setAttribute("y1", y1 + 3);
  line.setAttribute("y2", y1 + 123);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", x1 + 3);
  line.setAttribute("x2", x1 + 123);
  line.setAttribute("y1", y1 + 41.5);
  line.setAttribute("y2", y1 + 41.5);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", x1 + 3);
  line.setAttribute("x2", x1 + 123);
  line.setAttribute("y1", y1 + 84.5);
  line.setAttribute("y2", y1 + 84.5);
  canvas.appendChild(line);
}

function drawX(canvas, index, x1, y1) {
  let col = index % 3;
  let row = Math.floor(index / 3);

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1 + col * 43 + 8.5);
  line.setAttribute("x2", x1 + col * 43 + 31.5);
  line.setAttribute("y1", y1 + row * 43 + 8.5);
  line.setAttribute("y2", y1 + row * 43 + 31.5);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 9);
  line.setAttribute("stroke-linecap", "round");
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("y1", y1 + row * 43 + 31.5);
  line.setAttribute("y2", y1 + row * 43 + 8.5);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("stroke", "#f97");
  line.setAttribute("stroke-width", 3);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("y1", y1 + row * 43 + 8.5);
  line.setAttribute("y2", y1 + row * 43 + 31.5);
  canvas.appendChild(line);
}

function drawO(canvas, index, x1, y1) {
  let col = index % 3;
  let row = Math.floor(index / 3);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x1 + col * 43 + 20);
  circle.setAttribute("cy", y1 + row * 43 + 20);
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#7df");
  canvas.appendChild(circle);

  circle = circle.cloneNode(false);
  circle.setAttribute("r", 9);
  circle.setAttribute("fill", "#fff");
  canvas.appendChild(circle);
}

function PracticeTicTacToe(props) {
  const canvas = useRef(null);
  const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    canvas.current.innerHTML = "";

    drawBoard(canvas.current, 20, 10);

    drawO(canvas.current, 2, 20, 10);
    drawO(canvas.current, 5, 20, 10);
    drawO(canvas.current, 6, 20, 10);
    drawX(canvas.current, 1, 20, 10);
    drawX(canvas.current, 3, 20, 10);
    drawX(canvas.current, 7, 20, 10);
  }, []);

  return (
    <div className="practiceContainer">
      <h3 className="practiceTitle">Tic-tac-toe</h3>
      <p className="practiceText">
        Alpha-beta pruning: {alphaBetaPruning ? "On" : "Off"}
      </p>
      <p className="practiceText">
        Depth limit: {depthLimit ? depthLimitValue : "Off"}
      </p>
      <p className="practiceText">{Math.random()}</p>
      <Canvas ref={canvas} />
      <h4>Game tree:</h4>
    </div>
  );
}

PracticeTicTacToe.propTypes = {
  alphaBetaPruning: PropTypes.bool,
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
};

export default PracticeTicTacToe;
