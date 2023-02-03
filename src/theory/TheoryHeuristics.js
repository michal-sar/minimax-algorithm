import React from "react";
import SimpleBar from "simplebar-react";

function TheoryHeuristics() {
  return (
    <SimpleBar id="theoryContainer">
      <p>
        <b>Heuristics</b> ...
      </p>
      <p>
        Here’s an example of a <u>heuristic function</u> for tic-tac-toe:
      </p>
      <div className="monospaced">
        <div className="functionContainer">
          <div>
            {"       "}⎧ <br />
            H(n) = ⎨ <br />
            {"       "}⎩ <br />
          </div>
          <div className="functionValues">
            U(n), n ∈ F<br />
            0.15 * (X<sub>2</sub>(n) - O<sub>2</sub>(n)), n ∉ F<br />
          </div>
        </div>
        <br />X<sub>2</sub> — returns the number of rows, columns, and diagonals
        containing exactly two X’s
        <br />O<sub>2</sub> — returns the number of rows, columns, and diagonals
        containing exactly two O’s
        <br />
      </div>
      <div className="monospaced">
        d — depth-limit
        <br />
        H — heuristic function
        <br />
        <br />
        <b>function</b> MiniMax(n, d, maximizer_turn)
        <br />
        <b>begin</b>
        <br />
        <span className="line">⎪ </span>
        <span hidden>{"  "}</span>
        <b>if</b> n ∈ F <b>or</b> d = 0 <b>then return</b> H(n)
        <br />
        <span className="line">⎪ </span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
        <span className="line">⎪ ⎪ </span>
        <span hidden>{"    "}</span>v {"<-"} -∞
        <br />
        <span className="line">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="line">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>v {"<-"} Max(v, MiniMax(s, d - 1,{" "}
        <i>false</i>))
        <br />
        <span className="line">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>return</b> v<br />
        <span className="line">⎪ </span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
        <span className="line">⎪ ⎪ </span>
        <span hidden>{"    "}</span>v {"<-"} +∞
        <br />
        <span className="line">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="line">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>v {"<-"} Min(v, MiniMax(s, d - 1,{" "}
        <i>true</i>))
        <br />
        <span className="line">⎪ ⎪ </span>
        <span hidden>{"    "}</span>
        <b>return</b> v<br />
        <span className="line">⎪ </span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
        <b>end</b>
      </div>
      <p>
        Initial call:{" "}
        <span className="monospaced">
          MiniMax(n, d, <i>true</i>)
        </span>
        .
      </p>
      <div className="monospaced">
        <b>function</b> MiniMaxAlphaBeta(n, d, maximizer_turn, α, β)
        <br />
        <b>begin</b>
        <br />
        <span className="unselectable">⎪ </span>
        <span hidden> </span>
        <b>if</b> n ∈ F <b>or</b> d = 0 <b>then return</b> H(n)
        <br />
        <span className="unselectable">⎪ </span>
        <span hidden> </span>
        <b>if</b> maximizer_turn
        <br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden> </span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden> </span>α {"<-"} Max(α, MiniMaxAlphaBeta(s, d - 1,{" "}
        <i>false</i>, α, β))
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>if</b> α {">="} β<br />
        <span className="unselectable">⎪ ⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> α<br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> α<br />
        <span className="unselectable">⎪ </span>
        <span hidden> </span>
        <b>else</b>
        <br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden> </span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden> </span>β {"<-"} Min(β, MiniMaxAlphaBeta(s, d - 1,{" "}
        <i>true</i>, α, β))
        <br />
        <span className="unselectable">⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>if</b> α {">="} β<br />
        <span className="unselectable">⎪ ⎪ ⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> β<br />
        <span className="unselectable">⎪ ⎪ </span>
        <span hidden> </span>
        <b>return</b> β<br />
        <span className="unselectable">⎪ </span>
        <span hidden> </span>
        <b>end</b>
        <br />
        <b>end</b>
      </div>
      <p>
        Initial call:{" "}
        <span className="monospaced">
          MiniMaxAlphaBeta(n, d, <i>true</i>, -∞, +∞)
        </span>
        .
      </p>
    </SimpleBar>
  );
}

export default TheoryHeuristics;
