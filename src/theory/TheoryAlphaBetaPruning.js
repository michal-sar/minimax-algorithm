import React from "react";
import SimpleBar from "simplebar-react";

function TheoryAlphaBetaPruning() {
  return (
    <SimpleBar id="theoryContainer">
      <p>
        <b>Alpha-beta pruning</b> ...
      </p>
      <div className="monospaced">
        α — ...
        <br />
        β — ...
        <br />
        <br />
        <b>function</b> MiniMaxAlphaBeta(n, maximizer_turn, α, β)
        <br />
        <b>begin</b>
        <br />
        <span className="unselectable">⎪ </span>
        <span hidden>{"  "}</span>
        <b>if</b> n ∈ F <b>then return</b> U(n)
        <br />
        <span className="unselectable">⎪ </span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>α {"<-"} Max(α, MiniMaxAlphaBeta(s,{" "}
        <i>false</i>, α, β))
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>
        <b>if</b> α {">="} β<br />
        <span className="unselectable">⎪ ⎪ ⎪ ⎪ </span>
        <span hidden>{"        "}</span>
        <b>return</b> α<br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>return</b> α<br />
        <span className="unselectable">⎪ </span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>β {"<-"} Min(β, MiniMaxAlphaBeta(s,{" "}
        <i>true</i>, α, β))
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>
        <b>if</b> α {">="} β<br />
        <span className="unselectable">⎪ ⎪ ⎪ ⎪ </span>
        <span hidden>{"        "}</span>
        <b>return</b> β<br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>return</b> β<br />
        <span className="unselectable">⎪ </span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
        <b>end</b>
      </div>
      <p>
        Initial call:
        <span className="monospaced">
          {" "}
          MiniMaxAlphaBeta(n, <i>true</i>, -∞, +∞)
        </span>
        .
      </p>
    </SimpleBar>
  );
}

export default TheoryAlphaBetaPruning;
