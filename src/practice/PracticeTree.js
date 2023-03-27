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
      for (let child of node.childrenNodes)
        yield* this.dfsPreOrderTraversal(child);
    }
  }
  *dfsPostOrderTraversal(node = this.root) {
    if (node.childrenNodes.length) {
      for (let child of node.childrenNodes)
        yield* this.dfsPostOrderTraversal(child);
    }
    yield node;
  }
  *bfsTraversal(node = this.root) {
    let queue = [node];
    while (queue.length) {
      yield queue[0];
      for (let child of queue[0].childrenNodes) {
        queue.push(child);
      }
      queue.shift();
    }
  }
  insert(parentNodeId, id) {
    for (let node of this.dfsPreOrderTraversal()) {
      if (node.id == parentNodeId) {
        node.childrenNodes.push(new Node(id, node.depth + 1, node.id));
        return;
      }
    }
  }
  getWidth(id) {
    for (let node of this.dfsPreOrderTraversal()) {
      if (node.id == id) return node.width;
    }
  }
  getPosition(id) {
    for (let node of this.dfsPreOrderTraversal()) {
      if (node.id == id) return node.position;
    }
  }
  updateWidths() {
    for (let node of this.dfsPostOrderTraversal()) {
      if (node.childrenNodes.length) {
        node.width = 0;
        for (let child of node.childrenNodes) {
          node.width += child.width;
        }
      } else node.width = 1;
    }
  }
  updatePositions() {
    let prevParentNodeId = undefined;
    let prevWidth = 0;
    let prevPosition = 0;
    for (let node of this.bfsTraversal()) {
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
    for (let node of this.dfsPreOrderTraversal()) {
      if (!node.childrenNodes.length) {
        node.value =
          node.id > range / 2 ? node.id - range / 2 : node.id - range / 2 - 1;
      }
    }
  }
  draw(canvas) {
    let depth = -1;
    const margin = 195.5 - this.root.width * 24;

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("font-size", "20");
    text.setAttribute("fill", "#224");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("font-family", "Nunito, sans-serif");
    text.setAttribute("font-weight", "900");

    let rect_max = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    rect_max.setAttribute("fill-opacity", "0.5");
    rect_max.setAttribute("stroke-width", 3);
    rect_max.setAttribute("stroke-linecap", "round");
    rect_max.setAttribute("stroke-linejoin", "round");
    rect_max.setAttribute("stroke-dasharray", "8 14");
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
    circle.setAttribute("stroke", "#224");
    circle.setAttribute("stroke-width", 3);
    circle.setAttribute("fill", "#fff");

    for (let node of this.bfsTraversal()) {
      if (node.depth != depth) {
        depth = node.depth;
        if (depth % 2) {
          rect_min = rect_min.cloneNode(false);
          rect_min.setAttribute("y", calculateY(depth) - 16.5 - 6);
          canvas.appendChild(rect_min);
          text_min = text_min.cloneNode(false);
          text_min.setAttribute("y", calculateY(depth));
          text_min.textContent = "Min";
          canvas.appendChild(text_min);
        } else {
          rect_max = rect_max.cloneNode(false);
          rect_max.setAttribute("y", calculateY(depth) - 16.5 - 6);
          canvas.appendChild(rect_max);
          text_max = text_max.cloneNode(false);
          text_max.setAttribute("y", calculateY(depth));
          text_max.textContent = "Max";
          canvas.appendChild(text_max);
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
        canvas.appendChild(line);
      }
    }

    for (let node of this.bfsTraversal()) {
      circle = circle.cloneNode(false);
      circle.setAttribute("cx", margin + calculateX(node.position, node.width));
      circle.setAttribute("cy", calculateY(node.depth));
      canvas.appendChild(circle);

      text = text.cloneNode(false);
      text.setAttribute("x", margin + calculateX(node.position, node.width));
      text.setAttribute("y", calculateY(node.depth));
      text.textContent = node.value;
      canvas.appendChild(text);
    }
  }
  generateMiniMaxStepList() {
    let stepList = [];
    function miniMax(n, maximizerTurn) {
      stepList.push("New instance");
      stepList.push("Check if final");
      if (!n.childrenNodes.length) {
        stepList.push("Final state reached");
        return n.value;
      }
      stepList.push("Check if maximizer_turn");
      if (maximizerTurn) {
        stepList.push("Assign -v");
        let v = -Infinity;
        for (const s of n.childrenNodes) {
          stepList.push("Enter new instance");
          v = Math.max(v, miniMax(s, false));
          stepList.push("Update v");
        }
        stepList.push("Update node value");
        return v;
      } else {
        stepList.push("Assign +v");
        let v = +Infinity;
        for (const s of n.childrenNodes) {
          stepList.push("Enter new instance");
          v = Math.min(v, miniMax(s, true));
          stepList.push("Update v");
        }
        stepList.push("Update node value");
        return v;
      }
    }
    const decision = miniMax(this.root, true);
    stepList.push(decision);
    return [1, 2];
  }
  generateMiniMaxAlphaBetaStepList() {
    return [2, 3];
  }
  generateDepthLimitedMiniMaxStepList(depthLimit) {
    let stepList = [];
    function depthLimitedMiniMax(n, d, maximizerTurn) {
      stepList.push("New instance");
      stepList.push("Check if final");
      if (!n.childrenNodes.length || d == 0) {
        stepList.push("Final state reached");
        return n.value ? n.value : 0;
      }
      stepList.push("Check if maximizer_turn");
      if (maximizerTurn) {
        stepList.push("Assign -v");
        let v = -Infinity;
        for (const s of n.childrenNodes) {
          stepList.push("Enter new instance");
          v = Math.max(v, depthLimitedMiniMax(s, d - 1, false));
          stepList.push("Update v");
        }
        stepList.push("Update node value");
        return v;
      } else {
        stepList.push("Assign +v");
        let v = +Infinity;
        for (const s of n.childrenNodes) {
          stepList.push("Enter new instance");
          v = Math.min(v, depthLimitedMiniMax(s, d - 1, true));
          stepList.push("Update v");
        }
        stepList.push("Update node value");
        return v;
      }
    }
    const decision = depthLimitedMiniMax(this.root, depthLimit, true);
    stepList.push(decision);
    return [3, 4];
  }
  generateDepthLimitedMiniMaxAlphaBetaStepList(/* depthLimit */) {
    return [4, 5];
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
    for (let edge of edges) {
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
  const [maximizerTurn, setMaximizerTurn] = useState("");
  const [utilityResult, setUtilityResult] = useState("U(n)");
  const [v, setV] = useState(["v", "v", "v", "v", "v", "v", "v", "v"]);
  const [s, setS] = useState([false, false]);
  const [miniMax, setMiniMax] = useState(["MiniMax(...)", "MiniMax(...)"]);
  // + Depth limit
  const [d, setD] = useState("");
  const [heuristicResult, setHeuristicResult] = useState("H(n)");
  // + Alpha-beta pruning
  const [alpha, setAlpha] = useState("");
  const [beta, setBeta] = useState("");
  const [a, setA] = useState(["α", "α", "α", "α", "α", "α"]);
  const [b, setB] = useState(["β", "β", "β", "β", "β", "β"]);

  useEffect(() => {
    setEvaluatedNodes(1);
  });

  useEffect(() => {
    canvas.current.innerHTML = "";
    const tree = generateTree(pruferSequence);
    tree.draw(canvas.current);
    if (!alphaBetaPruning && !depthLimit) {
      setStepList(tree.generateMiniMaxStepList());
    } else if (alphaBetaPruning && !depthLimit) {
      setStepList(tree.generateMiniMaxAlphaBetaStepList());
    } else if (!alphaBetaPruning && depthLimit) {
      setStepList(tree.generateDepthLimitedMiniMaxStepList());
    } else {
      setStepList(tree.generateDepthLimitedMiniMaxAlphaBetaStepList());
    }
  }, [alphaBetaPruning, depthLimit, depthLimitValue, pruferSequence]);

  // useEffect(() => {
  //   if (evaluatedNodes) console.log("Hi!");
  // }, [stepList]);

  // useEffect(() => {
  //   if (evaluatedNodes) console.log("Hello!");
  // }, [step]);

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
        </div>
      </div>
      <div className="practiceContainerChild">
        <h4 className="pseudocodeLabel">Pseudocode:</h4>
        {!alphaBetaPruning && !depthLimit ? (
          <MiniMax
            highlightLine={highlightLine}
            maximizerTurn={maximizerTurn}
            utilityResult={utilityResult}
            v={v}
            s={s}
            miniMax={miniMax}
          />
        ) : alphaBetaPruning && !depthLimit ? (
          <MiniMaxAlphaBeta
            highlightLine={highlightLine}
            maximizerTurn={maximizerTurn}
            alpha={alpha}
            beta={beta}
            utilityResult={utilityResult}
            s={s}
            a={a}
            b={b}
            miniMax={miniMax}
          />
        ) : !alphaBetaPruning && depthLimit ? (
          <DepthLimitedMiniMax
            highlightLine={highlightLine}
            d={d}
            maximizerTurn={maximizerTurn}
            heuristicResult={heuristicResult}
            v={v}
            s={s}
            miniMax={miniMax}
          />
        ) : (
          <DepthLimitedMiniMaxAlphaBeta
            highlightLine={highlightLine}
            d={d}
            maximizerTurn={maximizerTurn}
            alpha={alpha}
            beta={beta}
            heuristicResult={heuristicResult}
            s={s}
            a={a}
            b={b}
            miniMax={miniMax}
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
