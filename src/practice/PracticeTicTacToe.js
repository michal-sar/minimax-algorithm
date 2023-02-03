import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Canvas = React.forwardRef((props, ref) => {
  return <svg viewBox="0 0 126 126" ref={ref} />;
});
Canvas.displayName = "Canvas";

function drawBoard(canvas) {
  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", 41.5);
  line.setAttribute("x2", 41.5);
  line.setAttribute("y1", 3);
  line.setAttribute("y2", 123);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 3);
  line.setAttribute("stroke-linecap", "round");
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", 84.5);
  line.setAttribute("x2", 84.5);
  line.setAttribute("y1", 3);
  line.setAttribute("y2", 123);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", 3);
  line.setAttribute("x2", 123);
  line.setAttribute("y1", 41.5);
  line.setAttribute("y2", 41.5);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("x1", 3);
  line.setAttribute("x2", 123);
  line.setAttribute("y1", 84.5);
  line.setAttribute("y2", 84.5);
  canvas.appendChild(line);
}

function drawX(canvas, index) {
  let col = index % 3;
  let row = Math.floor(index / 3);

  let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", col * 43 + 8.5);
  line.setAttribute("x2", col * 43 + 31.5);
  line.setAttribute("y1", row * 43 + 8.5);
  line.setAttribute("y2", row * 43 + 31.5);
  line.setAttribute("stroke", "#224");
  line.setAttribute("stroke-width", 9);
  line.setAttribute("stroke-linecap", "round");
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("y1", row * 43 + 31.5);
  line.setAttribute("y2", row * 43 + 8.5);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("stroke", "#f97");
  line.setAttribute("stroke-width", 3);
  canvas.appendChild(line);

  line = line.cloneNode(false);
  line.setAttribute("y1", row * 43 + 8.5);
  line.setAttribute("y2", row * 43 + 31.5);
  canvas.appendChild(line);
}

function drawO(canvas, index) {
  let col = index % 3;
  let row = Math.floor(index / 3);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", col * 43 + 20);
  circle.setAttribute("cy", row * 43 + 20);
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

function PracticeTicTacToe(/* props */) {
  const canvas = useRef(null);
  // const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    canvas.current.innerHTML = "";

    drawBoard(canvas.current);

    drawO(canvas.current, 2);
    drawO(canvas.current, 5);
    drawO(canvas.current, 6);
    drawX(canvas.current, 1);
    drawX(canvas.current, 3);
    drawX(canvas.current, 7);
  }, []);

  return (
    <div className="practiceContainer">
      <h3 className="practiceTitle">Tic-tac-toe</h3>
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
