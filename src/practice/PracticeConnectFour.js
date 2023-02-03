import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Canvas = React.forwardRef((props, ref) => {
  return <svg viewBox="0 0 278 240" ref={ref} />;
});
Canvas.displayName = "Canvas";

function drawBoard(canvas) {
  let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", 1.5);
  rect.setAttribute("y", 1.5);
  rect.setAttribute("rx", 10);
  rect.setAttribute("ry", 10);
  rect.setAttribute("width", 275);
  rect.setAttribute("height", 237);
  rect.setAttribute("fill", "#77f");
  rect.setAttribute("stroke", "#224");
  rect.setAttribute("stroke-width", 3);
  canvas.appendChild(rect);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#fff");

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      circle = circle.cloneNode(false);
      circle.setAttribute("cx", col * 38 + 25);
      circle.setAttribute("cy", row * 38 + 25);
      canvas.appendChild(circle);
    }
  }
}

function drawYellow(canvas, index) {
  let col = index % 7;
  let row = Math.floor(index / 7);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", col * 38 + 25);
  circle.setAttribute("cy", row * 38 + 25);
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#fd7");
  canvas.appendChild(circle);
}

function drawRed(canvas, index) {
  let col = index % 7;
  let row = Math.floor(index / 7);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", col * 38 + 25);
  circle.setAttribute("cy", row * 38 + 25);
  circle.setAttribute("r", 15);
  circle.setAttribute("stroke", "#224");
  circle.setAttribute("stroke-width", 3);
  circle.setAttribute("fill", "#f77");
  canvas.appendChild(circle);
}

function PracticeConnectFour(/* props */) {
  const canvas = useRef(null);
  // const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    canvas.current.innerHTML = "";

    drawBoard(canvas.current);

    drawYellow(canvas.current, 38);
    drawRed(canvas.current, 31);
    drawYellow(canvas.current, 39);
    drawRed(canvas.current, 37);
  }, []);

  return (
    <div className="practiceContainer">
      <h3 className="practiceTitle">Connect four</h3>
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
