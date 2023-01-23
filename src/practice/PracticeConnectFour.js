import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Canvas = React.forwardRef((props, ref) => {
  return <svg viewBox="0 0 500 500" ref={ref} />;
});
Canvas.displayName = "Canvas";

function drawBoard(canvas, x1, y1) {
  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x1 + 1.5);
  rect.setAttribute("y", y1 + 1.5);
  rect.setAttribute("rx", 10);
  rect.setAttribute("ry", 10);
  rect.setAttribute("width", 123);
  rect.setAttribute("height", 123);
  rect.setAttribute("fill", "#77f");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", 3);
  canvas.appendChild(rect);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#fff");

  for (let row = 0; row < 3; row++) {
    // -> 6
    for (let col = 0; col < 3; col++) {
      // -> 7
      circle = circle.cloneNode(false);
      circle.setAttribute("cx", x1 + col * 38 + 25);
      circle.setAttribute("cy", y1 + row * 38 + 25);
      canvas.appendChild(circle);
    }
  }
}

function drawYellow(canvas, index, x1, y1) {
  let col = index % 3; // -> 7
  let row = Math.floor(index / 3); // -> 7

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x1 + col * 38 + 25);
  circle.setAttribute("cy", y1 + row * 38 + 25);
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#fd7");
  canvas.appendChild(circle);
}

function drawRed(canvas, index, x1, y1) {
  let col = index % 3; // -> 7
  let row = Math.floor(index / 3); // -> 7

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x1 + col * 38 + 25);
  circle.setAttribute("cy", y1 + row * 38 + 25);
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#f77");
  canvas.appendChild(circle);
}

function PracticeConnectFour(props) {
  const canvas = useRef(null);
  const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    canvas.current.innerHTML = "";

    drawBoard(canvas.current, 20, 10);

    drawRed(canvas.current, 4, 20, 10);
    drawRed(canvas.current, 6, 20, 10);
    drawYellow(canvas.current, 8, 20, 10);
    drawYellow(canvas.current, 7, 20, 10);
  }, []);

  return (
    <div className="practiceContainer">
      <h3 className="practiceTitle">Connect four</h3>
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

PracticeConnectFour.propTypes = {
  alphaBetaPruning: PropTypes.bool,
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
};

export default PracticeConnectFour;
