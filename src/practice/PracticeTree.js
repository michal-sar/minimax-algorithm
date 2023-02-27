import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Canvas = React.forwardRef((props, ref) => {
  return <svg className="tree" viewBox="0 0 400 513" ref={ref} />;
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
    const margin = 195.5 - this.root.width * 24;

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

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("font-size", "20");
    text.setAttribute("fill", "#224");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("font-family", "Nunito, sans-serif");
    text.setAttribute("font-weight", "900");

    for (let node of this.dfsPreOrderTraversal()) {
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
        canvas.prepend(line);
      }

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
  return position * 48 + width * 24 - 7.5;
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

function PracticeTree(props) {
  const canvas = useRef(null);
  const pruferSequence = useRef(new Array(10)); // n + 2 <- Change the number of nodes here!
  const { alphaBetaPruning, depthLimit, depthLimitValue } = props;

  useEffect(() => {
    canvas.current.innerHTML = "";

    for (let i = 0; i < pruferSequence.current.length; i++)
      pruferSequence.current[i] = Math.ceil(
        Math.random() * pruferSequence.current.length,
      );

    const tree = generateTree(pruferSequence.current);
    tree.draw(canvas.current);
  }, []);

  useEffect(() => {
    canvas.current.innerHTML = "";

    const tree = generateTree(pruferSequence.current);
    tree.draw(canvas.current);
  }, [alphaBetaPruning, depthLimit, depthLimitValue]);

  return (
    <div className="practiceContainer">
      <h3 className="practiceTitle">Tree</h3>
      <Canvas ref={canvas} />
      <h4 className="codeLabel">Code:</h4>
      <h4>Number of visited nodes:</h4>
      <h4>Decision:</h4>
    </div>
  );
}

PracticeTree.propTypes = {
  alphaBetaPruning: PropTypes.bool,
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
};

export default PracticeTree;
