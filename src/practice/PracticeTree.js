import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Canvas = React.forwardRef((props, ref) => {
  return <svg viewBox="0 0 1000 1000" ref={ref} />;
});
Canvas.displayName = "Canvas";

class Tree {
  constructor(id) {
    this.root = new Node(id, 0);
  }
  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.childrenNodes.length) {
      for (let child of node.childrenNodes)
        yield* this.preOrderTraversal(child);
    }
  }
  *postOrderTraversal(node = this.root) {
    if (node.childrenNodes.length) {
      for (let child of node.childrenNodes) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }
  insert(parentNodeId, id) {
    for (let node of this.preOrderTraversal()) {
      if (node.id == parentNodeId)
        node.childrenNodes.push(new Node(id, node.depth + 1, node.id));
    }
  }
  getWidth(id) {
    for (let node of this.preOrderTraversal()) {
      if (node.id == id) return node.width;
    }
  }
  getPosition(id) {
    for (let node of this.preOrderTraversal()) {
      if (node.id == id) return node.position;
    }
  }
  updateTree() {
    this.updateWidths();
    this.updatePositions();
    this.updateValues();
  }
  updateWidths() {
    for (let node of this.postOrderTraversal()) {
      if (node.childrenNodes.length) {
        node.width = 0;
        for (let child of node.childrenNodes) {
          node.width += child.width;
        }
      } else node.width = 1;
    }
  }
  updatePositions() {
    let queue = [];
    queue.push(this.root);

    let prevParentNodeId = undefined;
    let prevWidth = 0;
    let prevPosition = 0;

    while (queue.length) {
      let node = queue[0];

      for (let child of node.childrenNodes) {
        queue.push(child);
      }

      if (prevParentNodeId != node.parentNodeId) {
        prevParentNodeId = node.parentNodeId;
        prevPosition = node.position = this.getPosition(node.parentNodeId);
        prevWidth = node.width;
      } else {
        prevPosition = node.position = prevPosition + prevWidth;
        prevWidth = node.width;
      }

      queue.shift();
    }
  }
  updateValues() {
    for (let node of this.preOrderTraversal()) {
      if (!node.childrenNodes.length) {
        node.value = node.id < 7 ? node.id - 7 : node.id - 6;
      }
    }
  }
  draw(canvas) {
    for (let node of this.preOrderTraversal()) {
      if (node.id != this.root.id) {
        let line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        line.setAttribute(
          "x1",
          10 +
            this.getPosition(node.parentNodeId) * 45 +
            0.5 *
              (this.getWidth(node.parentNodeId) * 40 +
                (this.getWidth(node.parentNodeId) - 1) * 5),
        );
        line.setAttribute(
          "x2",
          10 +
            node.position * 45 +
            0.5 * (node.width * 40 + (node.width - 1) * 5),
        );
        line.setAttribute("y1", 18 + (node.depth - 1) * 60);
        line.setAttribute("y2", 18 + node.depth * 60);
        line.setAttribute("stroke", "#224");
        line.setAttribute("stroke-width", 3);
        canvas.appendChild(line);
      }
    }
    for (let node of this.preOrderTraversal()) {
      let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute(
        "cx",
        10 +
          node.position * 45 +
          0.5 * (node.width * 40 + (node.width - 1) * 5),
      );
      circle.setAttribute("cy", 18 + node.depth * 60);
      circle.setAttribute("r", 15);
      circle.setAttribute("stroke", "#224");
      circle.setAttribute("stroke-width", 3);
      circle.setAttribute("fill", "#fff");
      canvas.appendChild(circle);

      let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute(
        "x",
        10 +
          node.position * 45 +
          0.5 * (node.width * 40 + (node.width - 1) * 5),
      );
      text.setAttribute("y", 18 + node.depth * 60);
      text.setAttribute("font-size", "20");
      text.setAttribute("fill", "#224");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.textContent = node.value;
      canvas.appendChild(text);
    }
  }
}

class Node {
  constructor(id, depth, parentNodeId) {
    this.id = id;
    this.depth = depth;
    this.parentNodeId = parentNodeId;
    this.width = 1;
    this.childrenNodes = [];
  }
}

function generateTree(pruferSequence) {
  // let pruferSequence = new Array(10);
  // for (let i = 0; i < 10; i++)
  //   pruferSequence[i] = Math.ceil(Math.random() * 10);

  // pruferSequence = []; // <-

  let vertices = new Array(pruferSequence.length + 2);
  for (let i = 0; i < vertices.length; i++) vertices[i] = 0;
  for (let i = 0; i < pruferSequence.length; i++)
    vertices[pruferSequence[i] - 1] += 1;

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
    if (vertices[i] == 0) edges.push([i + 1, vertices.length]);
  }

  let occurrences = new Map();
  for (let i = 0; i < edges.length; i++) {
    occurrences.set(
      pruferSequence[i],
      (occurrences.get(pruferSequence[i]) || 0) + 1,
    );
  }

  let rootId = [...occurrences.entries()].reduce((accumulator, value) =>
    accumulator[1] < value[1] ? value : accumulator,
  )[0];

  let tree = new Tree(rootId);

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

  tree.updateTree();

  return tree;
}

function PracticeTree(props) {
  const canvas = useRef(null);
  const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    canvas.current.innerHTML = "";

    for (let i = 0; i < 10; i++)
      pruferSequence[i] = Math.ceil(Math.random() * 10);

    let tree = generateTree(pruferSequence);
    tree.draw(canvas.current);
  }, []);

  useEffect(() => {
    canvas.current.innerHTML = "";

    let tree = generateTree(pruferSequence);
    tree.draw(canvas.current);
  }, [alphaBetaPruning, depthLimit, depthLimitValue]);

  return (
    <div className="practiceContainer">
      <h3>Tree</h3>
      <p>Alpha-beta pruning: {alphaBetaPruning ? "On" : "Off"}</p>
      <p>Depth limit: {depthLimit ? depthLimitValue : "Off"}</p>
      <p>{Math.random()}</p>
      <Canvas ref={canvas} />
    </div>
  );
}

PracticeTree.propTypes = {
  alphaBetaPruning: PropTypes.bool,
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
};

let pruferSequence = new Array(10);

export default PracticeTree;
