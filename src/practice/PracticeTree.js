import React, { useState, useEffect, useRef, useContext } from "react";
import { EnvironmentContext } from "../Environment";
import {
  MiniMax,
  MiniMaxAlphaBeta,
  DepthLimitedMiniMax,
  DepthLimitedMiniMaxAlphaBeta,
} from "./Pseudocode";

const Canvas = React.forwardRef((props, ref) => {
  return <svg viewBox="0 -7.5 400 383" ref={ref} />;
});
Canvas.displayName = "Canvas";

class Tree {
  constructor(id) {
    this.root = new Node(id, 0);
  }
  *dfsPreOrderTraversal(node = this.root) {
    yield node;
    if (node.childrenNodes.length) {
      for (const child of node.childrenNodes)
        yield* this.dfsPreOrderTraversal(child);
    }
  }
  *dfsPostOrderTraversal(node = this.root) {
    if (node.childrenNodes.length) {
      for (const child of node.childrenNodes)
        yield* this.dfsPostOrderTraversal(child);
    }
    yield node;
  }
  *bfsTraversal(node = this.root) {
    let queue = [node];
    while (queue.length) {
      yield queue[0];
      for (const child of queue[0].childrenNodes) {
        queue.push(child);
      }
      queue.shift();
    }
  }
  insert(parentNodeId, id) {
    for (const node of this.dfsPreOrderTraversal()) {
      if (node.id == parentNodeId) {
        node.childrenNodes.push(new Node(id, node.depth + 1, node.id));
        return;
      }
    }
  }
  getWidth(id) {
    for (const node of this.dfsPreOrderTraversal()) {
      if (node.id == id) return node.width;
    }
  }
  getPosition(id) {
    for (const node of this.dfsPreOrderTraversal()) {
      if (node.id == id) return node.position;
    }
  }
  getVisibility() {
    let visibility = [];
    for (const node of this.bfsTraversal()) {
      visibility.push(node.value !== undefined);
    }
    return visibility;
  }
  updateWidths() {
    for (const node of this.dfsPostOrderTraversal()) {
      if (node.childrenNodes.length) {
        node.width = 0;
        for (const child of node.childrenNodes) {
          node.width += child.width;
        }
      } else node.width = 1;
    }
  }
  updatePositions() {
    let prevParentNodeId = undefined;
    let prevWidth = 0;
    let prevPosition = 0;
    for (const node of this.bfsTraversal()) {
      if (prevParentNodeId == node.parentNodeId) {
        prevPosition = node.position = prevPosition + prevWidth;
        prevWidth = node.width;
      } else {
        prevParentNodeId = node.parentNodeId;
        prevPosition = node.position = this.getPosition(node.parentNodeId);
        prevWidth = node.width;
      }
    }
  }
  updateValues(range) {
    for (const node of this.dfsPreOrderTraversal()) {
      if (!node.childrenNodes.length) {
        node.value =
          node.id > range / 2 ? node.id - range / 2 : node.id - range / 2 - 1;
      }
    }
  }
  updateValue(id, value) {
    for (const node of this.dfsPreOrderTraversal()) {
      if (node.id == id) node.value = value;
    }
  }
  draw(canvas) {
    canvas.innerHTML = "";
    const background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    background.id = "background";
    canvas.appendChild(background);
    const edges = document.createElementNS("http://www.w3.org/2000/svg", "g");
    edges.id = "edges";
    canvas.appendChild(edges);
    const vertices = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    vertices.id = "vertices";
    canvas.appendChild(vertices);

    let depth = -1;
    const margin = 195.5 - this.root.width * 24;

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("font-size", "20");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("font-family", "Nunito, sans-serif");
    text.setAttribute("font-weight", "900");
    text.setAttribute("stroke", "none");

    let rect_max = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    rect_max.setAttribute("fill-opacity", "0.3");
    rect_max.setAttribute("stroke-width", 3);
    rect_max.setAttribute("stroke-linecap", "round");
    rect_max.setAttribute("stroke-linejoin", "round");
    rect_max.setAttribute("stroke-dasharray", "8 14");
    rect_max.setAttribute("stroke-opacity", "0.6");
    rect_max.setAttribute("height", 44);
    rect_max.setAttribute("width", 374);
    rect_max.setAttribute("x", 13);
    rect_max.setAttribute("fill", "#f97");
    rect_max.setAttribute("stroke", "#f97");
    rect_max.setAttribute("stroke-dashoffset", "4");

    let rect_min = rect_max.cloneNode(false);
    rect_min.setAttribute("fill", "#7df");
    rect_min.setAttribute("stroke", "#7df");
    rect_min.setAttribute("stroke-dashoffset", "15.5");

    let text_max = text.cloneNode(false);
    text_max.setAttribute("text-anchor", "start");
    text_max.setAttribute("fill", "#f97");
    text_max.setAttribute("fill-opacity", "0.6");
    text_max.setAttribute("x", 16.5 + 6);

    let text_min = text_max.cloneNode(false);
    text_min.setAttribute("fill", "#7df");

    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", "#224");
    line.setAttribute("stroke-width", 3);

    let circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("r", 15);
    circle.setAttribute("stroke-width", 3);
    circle.setAttribute("fill", "#fff");

    for (const node of this.bfsTraversal()) {
      if (node.depth != depth) {
        depth = node.depth;
        if (depth % 2) {
          rect_min = rect_min.cloneNode(false);
          rect_min.setAttribute("y", calculateY(depth) - 16.5 - 6);
          background.appendChild(rect_min);
          text_min = text_min.cloneNode(false);
          text_min.setAttribute("y", calculateY(depth));
          text_min.textContent = "Min";
          background.appendChild(text_min);
        } else {
          rect_max = rect_max.cloneNode(false);
          rect_max.setAttribute("y", calculateY(depth) - 16.5 - 6);
          background.appendChild(rect_max);
          text_max = text_max.cloneNode(false);
          text_max.setAttribute("y", calculateY(depth));
          text_max.textContent = "Max";
          background.appendChild(text_max);
        }
      }

      if (node.id != this.root.id) {
        line = line.cloneNode(false);
        line.setAttribute(
          "x1",
          margin +
            calculateX(
              this.getPosition(node.parentNodeId),
              this.getWidth(node.parentNodeId),
            ),
        );
        line.setAttribute("x2", margin + calculateX(node.position, node.width));
        line.setAttribute("y1", calculateY(node.depth - 1));
        line.setAttribute("y2", calculateY(node.depth));
        edges.appendChild(line);
      }
    }

    for (const node of this.bfsTraversal()) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.id = node.id;
      vertices.appendChild(g);

      circle = circle.cloneNode(false);
      circle.setAttribute("cx", margin + calculateX(node.position, node.width));
      circle.setAttribute("cy", calculateY(node.depth));
      g.appendChild(circle);

      text = text.cloneNode(false);
      text.setAttribute("x", margin + calculateX(node.position, node.width));
      text.setAttribute("y", calculateY(node.depth));
      text.textContent = node.value;
      g.appendChild(text);

      if (node.childrenNodes.length) g.setAttribute("fill", "#fff");
      else g.setAttribute("fill", "#224");

      if (node.id != this.root.id) {
        g.setAttribute("stroke", "#224");
      } else {
        g.setAttribute("stroke", "#f77");
      }
    }
  }
  childrenContainValue(id, value) {
    for (const node of this.dfsPreOrderTraversal()) {
      if (node.id == id) {
        for (const child of node.childrenNodes)
          if (child.value && child.value == value) return true;
        return false;
      }
    }
  }
  generateMiniMaxStepList() {
    let tree = this;
    let stepList = [];
    let evaluatedNodes = 0;
    let miniMaxResult, prevV, visibility;

    function miniMax(n, maximizerTurn) {
      evaluatedNodes++;
      visibility = tree.getVisibility();
      // prettier-ignore
      stepList.push([visibility, n.id, null, 1, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"]]);
      // prettier-ignore
      stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"]]);
      if (!n.childrenNodes.length) {
        // prettier-ignore
        stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", n.value, [false, false], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"]]);
        return n.value;
      }
      // prettier-ignore
      stepList.push([visibility, n.id, null, 4, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"]]);
      if (maximizerTurn) {
        // prettier-ignore
        stepList.push([visibility, n.id, null, 5, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["-∞", "v", "v", "v", "v", "v", "v", "v"]]);
        let v = -Infinity;
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, v == -Infinity ? "-∞" : v, "v", "v", "v", "v", "v"]]);
          miniMaxResult = miniMax(s, false);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], [miniMaxResult, "MiniMax(s, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, v == -Infinity ? "-∞" : v, "v", "v", "v", "v", "v"]]);
          prevV = v;
          v = Math.max(v, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], [miniMaxResult, "MiniMax(s, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, prevV == -Infinity ? "-∞" : prevV, "v", "v", "v", "v", "v"]]);
        }
        tree.updateValue(n.id, v);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 8, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], [miniMaxResult, "MiniMax(s, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, prevV == -Infinity ? "-∞" : prevV, v == -Infinity ? "-∞" : v, "v", "v", "v", "v"]]);
        return v;
      } else {
        // prettier-ignore
        stepList.push([visibility, n.id, null, 10, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["v", "v", "v", "v", "+∞", "v", "v", "v"]]);
        let v = Infinity;
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False)", "MiniMax(s, True)"], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, v == Infinity ? "+∞" : v, "v"]]);
          miniMaxResult = miniMax(s, true);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False)", miniMaxResult], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, v == Infinity ? "+∞" : v, "v"]]);
          prevV = v;
          v = Math.min(v, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False)", miniMaxResult], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, prevV == Infinity ? "+∞" : prevV, "v"]]);
        }
        tree.updateValue(n.id, v);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 13, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False)", miniMaxResult], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, prevV == Infinity ? "+∞" : prevV, v == Infinity ? "+∞" : v]]);
        return v;
      }
    }

    miniMax(tree.root, true);
    return stepList;
  }
  generateMiniMaxAlphaBetaStepList() {
    let tree = this;
    let stepList = [];
    let evaluatedNodes = 0;
    let miniMaxResult, prevA, prevB, visibility;

    function miniMaxAlphaBeta(n, maximizerTurn, a, b) {
      evaluatedNodes++;
      const initialA = a == -Infinity ? "=-∞" : "=" + a;
      const initialB = b == Infinity ? "=+∞" : "=" + b;
      visibility = tree.getVisibility();
      // prettier-ignore
      stepList.push([visibility, n.id, null, 1, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False, α, β)", "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"]]);
      // prettier-ignore
      stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False, α, β)", "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"]]);
      if (!n.childrenNodes.length) {
        // prettier-ignore
        stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", n.value, [false, false], ["MiniMax(s, False, α, β)", "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"]]);
        return n.value;
      }
      // prettier-ignore
      stepList.push([visibility, n.id, null, 4, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False, α, β)", "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"]]);
      if (maximizerTurn) {
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 6, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], ["MiniMax(s, False, " + (a == -Infinity ? "-∞" : a) + ", " + (b == Infinity ? "+∞" : b) + ")", "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, a == -Infinity ? "-∞" : a, "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"]]);
          miniMaxResult = miniMaxAlphaBeta(s, false, a, b);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 6, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], [miniMaxResult, "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, a == -Infinity ? "-∞" : a, "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"]]);
          prevA = a == -Infinity ? "-∞" : a;
          a = Math.max(a, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 6, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], [miniMaxResult, "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"]]);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], [miniMaxResult, "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, a == -Infinity ? "-∞" : a, "α", "α", "α"], [b == Infinity ? "+∞" : b, "β", "β", "β", "β", "β"]]);
          if (a >= b) {
            tree.updateValue(n.id, a);
            visibility = tree.getVisibility();
            // prettier-ignore
            stepList.push([visibility, n.id, s.id, 8, maximizerTurn ? "=True" : "=False", "U(n)", [true, false], [miniMaxResult, "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, a == -Infinity ? "-∞" : a, a == -Infinity ? "-∞" : a, "α", "α"], [b == Infinity ? "+∞" : b, "β", "β", "β", "β", "β"]]);
            return a;
          }
        }
        tree.updateValue(n.id, a);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 9, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], [miniMaxResult, "MiniMax(s, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, a == -Infinity ? "-∞" : a, "α", a == -Infinity ? "-∞" : a, "α"], [b == Infinity ? "+∞" : b, "β", "β", "β", "β", "β"]]);
        return a;
      } else {
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False, α, β)", "MiniMax(s, True, " + (a == -Infinity ? "-∞" : a) + ", " + (b == Infinity ? "+∞" : b) + ")"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", b == Infinity ? "+∞" : b, b == Infinity ? "+∞" : b, "β", "β", "β"]]);
          miniMaxResult = miniMaxAlphaBeta(s, true, a, b);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", b == Infinity ? "+∞" : b, b == Infinity ? "+∞" : b, "β", "β", "β"]]);
          prevB = b == Infinity ? "+∞" : b;
          b = Math.min(b, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", b == Infinity ? "+∞" : b, prevB, "β", "β", "β"]]);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 13, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", a == -Infinity ? "-∞" : a], ["β", b == Infinity ? "+∞" : b, prevB, b == Infinity ? "+∞" : b, "β", "β"]]);
          if (a >= b) {
            tree.updateValue(n.id, b);
            visibility = tree.getVisibility();
            // prettier-ignore
            stepList.push([visibility, n.id, s.id, 14, maximizerTurn ? "=True" : "=False", "U(n)", [false, true], ["MiniMax(s, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", a == -Infinity ? "-∞" : a], ["β", b == Infinity ? "+∞" : b, prevB, b == Infinity ? "+∞" : b, b == Infinity ? "+∞" : b, "β"]]);
            return b;
          }
        }
        tree.updateValue(n.id, b);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 15, maximizerTurn ? "=True" : "=False", "U(n)", [false, false], ["MiniMax(s, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", a == -Infinity ? "-∞" : a], ["β", b == Infinity ? "+∞" : b, prevB, b == Infinity ? "+∞" : b, "β", b == Infinity ? "+∞" : b]]);
        return b;
      }
    }

    miniMaxAlphaBeta(this.root, true, -Infinity, Infinity);
    tree.fixValues();
    return stepList;
  }
  generateDepthLimitedMiniMaxStepList(depthLimit) {
    let tree = this;
    let stepList = [];
    let evaluatedNodes = 0;
    let miniMaxResult, prevV, visibility;

    function depthLimitedMiniMax(n, d, maximizerTurn) {
      evaluatedNodes++;
      visibility = tree.getVisibility();
      // prettier-ignore
      stepList.push([visibility, n.id, null, 1, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False)", "MiniMax(s, d - 1, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"], "=" + d]);
      // prettier-ignore
      stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False)", "MiniMax(s, d - 1, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"], "=" + d]);
      if (!n.childrenNodes.length || d == 0) {
        if (!n.value) tree.updateValue(n.id, 0);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", n.value, [false, false], ["MiniMax(s, d - 1, False)", "MiniMax(s, d - 1, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"], "=" + d]);
        return n.value;
      }
      // prettier-ignore
      stepList.push([visibility, n.id, null, 4, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False)", "MiniMax(s, d - 1, True)"], evaluatedNodes, ["v", "v", "v", "v", "v", "v", "v", "v"], "=" + d]);
      if (maximizerTurn) {
        // prettier-ignore
        stepList.push([visibility, n.id, null, 5, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False)", "MiniMax(s, d - 1, True)"], evaluatedNodes, ["-∞", "v", "v", "v", "v", "v", "v", "v"], "=" + d]);
        let v = -Infinity;
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], ["MiniMax(s, " + (d - 1) + ", False)", "MiniMax(s, d - 1, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, v == -Infinity ? "-∞" : v, "v", "v", "v", "v", "v"], "=" + d]);
          miniMaxResult = depthLimitedMiniMax(s, d - 1, false);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], [miniMaxResult, "MiniMax(s, d - 1, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, v == -Infinity ? "-∞" : v, "v", "v", "v", "v", "v"], "=" + d]);
          prevV = v;
          v = Math.max(v, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], [miniMaxResult, "MiniMax(s, d - 1, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, prevV == -Infinity ? "-∞" : prevV, "v", "v", "v", "v", "v"], "=" + d]);
        }
        tree.updateValue(n.id, v);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 8, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], [miniMaxResult, "MiniMax(s, d - 1, True)"], evaluatedNodes, ["-∞", v == -Infinity ? "-∞" : v, prevV == -Infinity ? "-∞" : prevV, v == -Infinity ? "-∞" : v, "v", "v", "v", "v"], "=" + d]);
        return v;
      } else {
        // prettier-ignore
        stepList.push([visibility, n.id, null, 10, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False)", "MiniMax(s, d - 1, True)"], evaluatedNodes, ["v", "v", "v", "v", "+∞", "v", "v", "v"], "=" + d]);
        let v = Infinity;
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False)", "MiniMax(s, " + (d - 1) + ", True)"], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, v == Infinity ? "+∞" : v, "v"], "=" + d]);
          miniMaxResult = depthLimitedMiniMax(s, d - 1, true);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False)", miniMaxResult], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, v == Infinity ? "+∞" : v, "v"], "=" + d]);
          prevV = v;
          v = Math.min(v, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False)", miniMaxResult], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, prevV == Infinity ? "+∞" : prevV, "v"], "=" + d]);
        }
        tree.updateValue(n.id, v);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 13, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False)", miniMaxResult], evaluatedNodes, ["v", "v", "v", "v", "+∞", v == Infinity ? "+∞" : v, prevV == Infinity ? "+∞" : prevV, v == Infinity ? "+∞" : v], "=" + d]);
        return v;
      }
    }

    depthLimitedMiniMax(this.root, depthLimit, true);
    return stepList;
  }
  generateDepthLimitedMiniMaxAlphaBetaStepList(depthLimit) {
    let tree = this;
    let stepList = [];
    let evaluatedNodes = 0;
    let miniMaxResult, prevA, prevB, visibility;

    function depthLimitedMiniMaxAlphaBeta(n, d, maximizerTurn, a, b) {
      evaluatedNodes++;
      const initialA = a == -Infinity ? "=-∞" : "=" + a;
      const initialB = b == Infinity ? "=+∞" : "=" + b;
      visibility = tree.getVisibility();
      // prettier-ignore
      stepList.push([visibility, n.id, null, 1, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False, α, β)", "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"], "=" + d]);
      // prettier-ignore
      stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False, α, β)", "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"], "=" + d]);
      if (!n.childrenNodes.length || d == 0) {
        if (!n.value) tree.updateValue(n.id, 0);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 3, maximizerTurn ? "=True" : "=False", n.value, [false, false], ["MiniMax(s, d - 1, False, α, β)", "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"], "=" + d]);
        return n.value;
      }
      // prettier-ignore
      stepList.push([visibility, n.id, null, 4, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False, α, β)", "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"], "=" + d]);
      if (maximizerTurn) {
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 6, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], ["MiniMax(s, " + (d - 1) + ", False, " + (a == -Infinity ? "-∞" : a) + ", " + (b == Infinity ? "+∞" : b) + ")", "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, a == -Infinity ? "-∞" : a, "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"], "=" + d]);
          miniMaxResult = depthLimitedMiniMaxAlphaBeta(s, d - 1, false, a, b);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 6, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], [miniMaxResult, "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, a == -Infinity ? "-∞" : a, "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"], "=" + d]);
          prevA = a == -Infinity ? "-∞" : a;
          a = Math.max(a, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 6, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], [miniMaxResult, "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, "α", "α", "α", "α"], ["β", "β", "β", "β", "β", "β"], "=" + d]);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 7, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], [miniMaxResult, "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, a == -Infinity ? "-∞" : a, "α", "α", "α"], [b == Infinity ? "+∞" : b, "β", "β", "β", "β", "β"], "=" + d]);
          if (a >= b) {
            tree.updateValue(n.id, a);
            visibility = tree.getVisibility();
            // prettier-ignore
            stepList.push([visibility, n.id, s.id, 8, maximizerTurn ? "=True" : "=False", "H(n)", [true, false], [miniMaxResult, "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, a == -Infinity ? "-∞" : a, a == -Infinity ? "-∞" : a, "α", "α"], [b == Infinity ? "+∞" : b, "β", "β", "β", "β", "β"], "=" + d]);
            return a;
          }
        }
        tree.updateValue(n.id, a);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 9, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], [miniMaxResult, "MiniMax(s, d - 1, True, α, β)"], evaluatedNodes, initialA, initialB, [a == -Infinity ? "-∞" : a, prevA, a == -Infinity ? "-∞" : a, "α", a == -Infinity ? "-∞" : a, "α"], [b == Infinity ? "+∞" : b, "β", "β", "β", "β", "β"], "=" + d]);
        return a;
      } else {
        for (const s of n.childrenNodes) {
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False, α, β)", "MiniMax(s, " + (d - 1) + ", True, " + (a == -Infinity ? "-∞" : a) + ", " + (b == Infinity ? "+∞" : b) + ")"], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", b == Infinity ? "+∞" : b, b == Infinity ? "+∞" : b, "β", "β", "β"], "=" + d]);
          miniMaxResult = depthLimitedMiniMaxAlphaBeta(s, d - 1, true, a, b);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", b == Infinity ? "+∞" : b, b == Infinity ? "+∞" : b, "β", "β", "β"], "=" + d]);
          prevB = b == Infinity ? "+∞" : b;
          b = Math.min(b, miniMaxResult);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 12, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", "α"], ["β", b == Infinity ? "+∞" : b, prevB, "β", "β", "β"], "=" + d]);
          // prettier-ignore
          stepList.push([visibility, n.id, s.id, 13, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", a == -Infinity ? "-∞" : a], ["β", b == Infinity ? "+∞" : b, prevB, b == Infinity ? "+∞" : b, "β", "β"], "=" + d]);
          if (a >= b) {
            tree.updateValue(n.id, b);
            visibility = tree.getVisibility();
            // prettier-ignore
            stepList.push([visibility, n.id, s.id, 14, maximizerTurn ? "=True" : "=False", "H(n)", [false, true], ["MiniMax(s, d - 1, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", a == -Infinity ? "-∞" : a], ["β", b == Infinity ? "+∞" : b, prevB, b == Infinity ? "+∞" : b, b == Infinity ? "+∞" : b, "β"], "=" + d]);
            return b;
          }
        }
        tree.updateValue(n.id, b);
        visibility = tree.getVisibility();
        // prettier-ignore
        stepList.push([visibility, n.id, null, 15, maximizerTurn ? "=True" : "=False", "H(n)", [false, false], ["MiniMax(s, d - 1, False, α, β)", miniMaxResult], evaluatedNodes, initialA, initialB, ["α", "α", "α", "α", "α", a == -Infinity ? "-∞" : a], ["β", b == Infinity ? "+∞" : b, prevB, b == Infinity ? "+∞" : b, "β", b == Infinity ? "+∞" : b], "=" + d]);
        return b;
      }
    }

    depthLimitedMiniMaxAlphaBeta(
      this.root,
      depthLimit,
      true,
      -Infinity,
      Infinity,
    );
    tree.fixValuesDepthLimited(depthLimit);
    return stepList;
  }
  fixValues() {
    let tree = this;
    function miniMax(n, maximizerTurn) {
      if (!n.childrenNodes.length) return n.value;
      if (maximizerTurn) {
        let v = -Infinity;
        for (const s of n.childrenNodes) v = Math.max(v, miniMax(s, false));
        tree.updateValue(n.id, v);
        return v;
      } else {
        let v = Infinity;
        for (const s of n.childrenNodes) v = Math.min(v, miniMax(s, true));
        tree.updateValue(n.id, v);
        return v;
      }
    }
    miniMax(tree.root, true);
  }
  fixValuesDepthLimited(depthLimit) {
    let tree = this;
    function depthLimitedMiniMax(n, d, maximizerTurn) {
      if (!n.childrenNodes.length) return n.value;
      if (!d) {
        tree.updateValue(n.id, 0);
        return n.value;
      }
      if (maximizerTurn) {
        let v = -Infinity;
        for (const s of n.childrenNodes)
          v = Math.max(v, depthLimitedMiniMax(s, d - 1, false));
        tree.updateValue(n.id, v);
        return v;
      } else {
        let v = +Infinity;
        for (const s of n.childrenNodes)
          v = Math.min(v, depthLimitedMiniMax(s, d - 1, true));
        tree.updateValue(n.id, v);
        return v;
      }
    }
    depthLimitedMiniMax(this.root, depthLimit, true);
  }
}

class Node {
  constructor(id, depth, parentNodeId) {
    this.id = id;
    this.depth = depth;
    this.parentNodeId = parentNodeId;
    this.childrenNodes = [];
  }
}

function calculateX(position, width) {
  return position * 48 + width * 24 + 4.5;
}

function calculateY(depth) {
  return 16.5 + depth * 48;
}

function generateTree(pruferSequence) {
  // pruferSequence = []; // <- Enter a specific Prüfer sequence here!

  let vertices = new Array(pruferSequence.length + 2);
  for (let i = 0; i < vertices.length; i++) {
    vertices[i] = 0;
  }
  for (let i = 0; i < pruferSequence.length; i++) {
    vertices[pruferSequence[i] - 1] += 1;
  }

  let edges = [];
  for (let i = 0; i < pruferSequence.length; i++) {
    for (let j = 0; j < vertices.length; j++) {
      if (vertices[j] == 0) {
        vertices[j] = -1;
        edges.push([j + 1, pruferSequence[i]]);
        vertices[pruferSequence[i] - 1]--;
        break;
      }
    }
  }
  for (let i = 0; i < pruferSequence.length; i++) {
    if (vertices[i] == 0) {
      edges.push([i + 1, vertices.length]);
    }
  }

  const occurrences = new Map();
  for (let i = 0; i < edges.length; i++) {
    occurrences.set(
      pruferSequence[i],
      (occurrences.get(pruferSequence[i]) || 0) + 1,
    );
  }

  const rootId = [...occurrences.entries()].reduce((accumulator, value) =>
    accumulator[1] < value[1] ? value : accumulator,
  )[0];

  const tree = new Tree(rootId);

  let potentialParentNodeIds = [rootId];
  while (edges.length) {
    let newPotentialParentNodeIds = [];
    let newEdges = edges;
    for (const edge of edges) {
      if (potentialParentNodeIds.includes(edge[0])) {
        tree.insert(edge[0], edge[1]);
        newPotentialParentNodeIds.push(edge[1]);
        newEdges = newEdges.filter((element) => element != edge);
      }
      if (potentialParentNodeIds.includes(edge[1])) {
        tree.insert(edge[1], edge[0]);
        newPotentialParentNodeIds.push(edge[0]);
        newEdges = newEdges.filter((element) => element != edge);
      }
    }
    potentialParentNodeIds = newPotentialParentNodeIds;
    edges = newEdges;
  }

  tree.updateWidths();
  tree.updatePositions();
  tree.updateValues(vertices.length);

  return tree;
}

function generatePruferSequence(length) {
  let pruferSequence = new Array(10);
  let uniqueElements;
  do {
    for (let i = 0; i < length; i++)
      pruferSequence[i] = Math.ceil(Math.random() * length);
    uniqueElements = new Set(pruferSequence).size;
  } while (uniqueElements < 5 || uniqueElements > 7);
  return pruferSequence;
}

function PracticeTree() {
  const canvas = useRef(null);
  const { alphaBetaPruning, depthLimit, depthLimitValue } =
    useContext(EnvironmentContext);
  const [pruferSequence, setPruferSequence] = useState(
    generatePruferSequence(10),
  );
  const [step, setStep] = useState(1);
  const [stepList, setStepList] = useState([]);
  const [evaluatedNodes, setEvaluatedNodes] = useState(0);
  const [decision, setDecision] = useState("...");
  // MiniMax
  const [highlightLine, setHighlightLine] = useState(0);
  const [maximizerTurn, setMaximizerTurn] = useState("=True");
  const [utilityResult, setUtilityResult] = useState("U(n)");
  const [s, setS] = useState([false, false]);
  const [miniMax, setMiniMax] = useState([
    "MiniMax(s, False)",
    "MiniMax(s, True)",
  ]);
  const [v, setV] = useState(["v", "v", "v", "v", "v", "v", "v", "v"]);
  // + Alpha-beta pruning
  const [alpha, setAlpha] = useState("=-∞");
  const [beta, setBeta] = useState("=+∞");
  const [a, setA] = useState(["α", "α", "α", "α", "α", "α"]);
  const [b, setB] = useState(["β", "β", "β", "β", "β", "β"]);
  // + Depth limit
  const [d, setD] = useState("=10");

  useEffect(() => {
    setEvaluatedNodes(1);
  }, []);

  useEffect(() => {
    const tree = generateTree(pruferSequence);
    if (!alphaBetaPruning && !depthLimit) {
      setStepList(tree.generateMiniMaxStepList());
    } else if (alphaBetaPruning && !depthLimit) {
      setStepList(tree.generateMiniMaxAlphaBetaStepList());
    } else if (!alphaBetaPruning && depthLimit) {
      setStepList(tree.generateDepthLimitedMiniMaxStepList(depthLimitValue));
    } else {
      setStepList(
        tree.generateDepthLimitedMiniMaxAlphaBetaStepList(depthLimitValue),
      );
    }
    tree.draw(canvas.current);
  }, [alphaBetaPruning, depthLimit, depthLimitValue, pruferSequence]);

  useEffect(() => {
    if (evaluatedNodes && step) setStep(0);
  }, [stepList]);

  useEffect(() => {
    if (evaluatedNodes && step > 0) loadStep(step);
    if (evaluatedNodes && step == 0) setStep(1);
  }, [step]);

  function updateClasses(visibility, n, s) {
    const vertices = canvas.current.children[2].children;
    let index = 0;
    for (const vertex of vertices) {
      if (n == vertex.id) {
        vertex.setAttribute("stroke", "#f77");
        if (!visibility[index]) vertex.setAttribute("fill", "#fff");
        else vertex.setAttribute("fill", "#f77");
      } else if (s == vertex.id) {
        vertex.setAttribute("stroke", "#77f");
        if (!visibility[index]) vertex.setAttribute("fill", "#fff");
        else vertex.setAttribute("fill", "#77f");
      } else {
        vertex.setAttribute("stroke", "#224");
        if (!visibility[index]) vertex.setAttribute("fill", "#fff");
        else vertex.setAttribute("fill", "#224");
      }
      index++;
    }
  }

  function loadStep(step) {
    const stepElement = stepList[step - 1];
    updateClasses(stepElement[0], stepElement[1], stepElement[2]);
    if (highlightLine != stepElement[3]) setHighlightLine(stepElement[3]);
    if (maximizerTurn != stepElement[4]) setMaximizerTurn(stepElement[4]);
    if (utilityResult != stepElement[5])
      setUtilityResult(stepElement[5].toString());
    if (s != stepElement[6]) setS(stepElement[6]);
    setMiniMax(stepElement[7]);
    if (evaluatedNodes != stepElement[8]) setEvaluatedNodes(stepElement[8]);
    if (!alphaBetaPruning && !depthLimit) {
      if (v != stepElement[9]) setV(stepElement[9]);
      step == stepList.length
        ? setDecision(stepElement[9][3])
        : setDecision("...");
    } else if (alphaBetaPruning && !depthLimit) {
      if (alpha != stepElement[9]) setAlpha(stepElement[9]);
      if (beta != stepElement[10]) setBeta(stepElement[10]);
      if (a != stepElement[11]) setA(stepElement[11]);
      if (b != stepElement[12]) setB(stepElement[12]);
      step == stepList.length
        ? highlightLine == 8
          ? setDecision(stepElement[11][3])
          : setDecision(stepElement[11][4])
        : setDecision("...");
    } else if (!alphaBetaPruning && depthLimit) {
      if (v != stepElement[9]) setV(stepElement[9]);
      if (d != stepElement[10]) setD(stepElement[10]);
      step == stepList.length
        ? setDecision(stepElement[9][3])
        : setDecision("...");
    } else {
      if (alpha != stepElement[9]) setAlpha(stepElement[9]);
      if (beta != stepElement[10]) setBeta(stepElement[10]);
      if (a != stepElement[11]) setA(stepElement[11]);
      if (b != stepElement[12]) setB(stepElement[12]);
      if (d != stepElement[13]) setD(stepElement[13]);
      step == stepList.length
        ? highlightLine == 8
          ? setDecision(stepElement[11][3])
          : setDecision(stepElement[11][4])
        : setDecision("...");
    }
  }

  return (
    <div className="practiceContainer">
      <div className="treeGraph">
        <h3 className="practiceTitle">Tree</h3>
        <Canvas ref={canvas} />
        <div>
          <button
            className="treePracticeButton"
            onClick={() => {
              setPruferSequence(generatePruferSequence(10));
            }}
          >
            <svg
              width="40"
              viewBox="-10 -10 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                transform="rotate(-140 20 20)"
                fill="transparent"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 0 18 A 20 20, 0, 1, 0, 18 0 M 1 12 L 6.206604869410697 22.81162641482903 L -4.2066048694106986 22.81162641482903 Z"
              />
            </svg>
          </button>
          <button
            className="treePracticeButton"
            disabled={step == 1}
            onClick={() => {
              setStep(1);
            }}
          >
            <svg
              width="40"
              viewBox="-10 -10 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="transparent"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 4 20 L 14.811626414829028 14.793395130589301 M 4 20 L 14.81162641482903 25.206604869410697 M 25 20 L 35.811626414829028 14.793395130589301 M 25 20 L 35.81162641482903 25.206604869410697 Z"
              />
            </svg>
          </button>
          <button
            className="treePracticeButton"
            disabled={step == 1}
            onClick={() => {
              setStep(step - 1);
            }}
          >
            <svg
              width="40"
              viewBox="-10 -10 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="transparent"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 0 20 L 40 20 M 0 20 L 10.811626414829028 14.793395130589301 L 10.81162641482903 25.206604869410697 Z"
              />
            </svg>
          </button>
          <button
            className="treePracticeButton"
            disabled={step == stepList.length}
            onClick={() => {
              setStep(step + 1);
            }}
          >
            <svg
              width="40"
              viewBox="-10 -10 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="transparent"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 0 20 L 40 20 M 40 20 L 29.18837358517097 25.206604869410697 L 29.18837358517097 14.793395130589303 Z"
              />
            </svg>
          </button>
          <button
            className="treePracticeButton"
            disabled={step == stepList.length}
            onClick={() => {
              setStep(stepList.length);
            }}
          >
            <svg
              width="40"
              viewBox="-10 -10 60 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="transparent"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M 15 20 L 5.18837358517097 25.206604869410697 M 15 20 L 4.18837358517097 14.793395130589303 M 36 20 L 25.18837358517097 25.206604869410697 M 36 20 L 25.18837358517097 14.793395130589303 Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="practiceContainerChild">
        <h4 className="pseudocodeLabel">Pseudocode:</h4>
        {!alphaBetaPruning && !depthLimit ? (
          <MiniMax
            highlightLine={highlightLine}
            maximizerTurn={maximizerTurn}
            utilityResult={utilityResult}
            s={s}
            miniMax={miniMax}
            v={v}
          />
        ) : alphaBetaPruning && !depthLimit ? (
          <MiniMaxAlphaBeta
            highlightLine={highlightLine}
            maximizerTurn={maximizerTurn}
            utilityResult={utilityResult}
            s={s}
            miniMax={miniMax}
            alpha={alpha}
            beta={beta}
            a={a}
            b={b}
          />
        ) : !alphaBetaPruning && depthLimit ? (
          <DepthLimitedMiniMax
            highlightLine={highlightLine}
            maximizerTurn={maximizerTurn}
            utilityResult={utilityResult}
            s={s}
            miniMax={miniMax}
            v={v}
            d={d}
          />
        ) : (
          <DepthLimitedMiniMaxAlphaBeta
            highlightLine={highlightLine}
            maximizerTurn={maximizerTurn}
            utilityResult={utilityResult}
            s={s}
            miniMax={miniMax}
            alpha={alpha}
            beta={beta}
            a={a}
            b={b}
            d={d}
          />
        )}
        <h4 className="evaluatedNodesLabel">Evaluated nodes:</h4>
        <span className="monospaced">
          <b>{evaluatedNodes}</b>
        </span>
        <h4 className="decisionLabel">Decision:</h4>
        <span className="monospaced">
          <b>{decision}</b>
        </span>
      </div>
    </div>
  );
}

export default PracticeTree;
