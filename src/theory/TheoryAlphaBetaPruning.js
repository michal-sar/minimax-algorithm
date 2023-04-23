import React from "react";
import SimpleBar from "simplebar-react";
import MiniMaxAlphaBeta from "../../public/images/minimax-alpha-beta.svg";

function TheoryAlphaBetaPruning() {
  return (
    <SimpleBar id="theoryContainer">
      <p>
        The entire partial game tree is traversed by the MiniMax algorithm, as
        described in the previous section. This can be too computationally
        expensive for some states of games with a deep game tree and a large{" "}
        <u>average branching factor</u> (average number of moves that can be
        made in a specific state of the game). Because of that, techniques
        limiting the number of necessary evaluations were introduced.
      </p>
      <p>
        <b>Alpha-beta pruning</b> allows for ignoring parts of the game tree
        that would not influence the determination of the optimal move.
      </p>
      <p>
        This optimization can be done by keeping track of{" "}
        <u>the highest score reachable for the maximizer</u> (
        <span className="monospaced">α</span>) and{" "}
        <u>the lowest score reachable for the minimizer</u> (
        <span className="monospaced">β</span>) out of the scores assigned so
        far. That way, if a node with a score worse than or equal to{" "}
        <span className="monospaced">α</span> is available on a given path
        during the minimizer’s turn, further evaluations can be omitted, as we
        know that the maximizer will not choose this branch in the first place.
        Likewise, if a node with a score better than or equal to{" "}
        <span className="monospaced">β</span> is available on a given path
        during the maximizer’s turn, further evaluations can also be omitted.
      </p>
      <p>
        The results obtained from the MiniMax algorithm with and without
        alpha-beta pruning are identical despite the significant improvement in
        performance provided by alpha-beta pruning.
      </p>
      <p>
        The following pseudocode describes the MiniMax algorithm with alpha-beta
        pruning:
      </p>
      <div className="monospaced">
        α — <u>the highest score reachable for the maximizer</u>
        <br />β — <u>the lowest score reachable for the minimizer</u>
        <br />
        <br />
        <b>function</b> MiniMaxAlphaBeta(n, maximizer_turn, α, β)
        <br />
        <b>begin</b>
        <br />
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> n ∈ F <b>then return</b> U(n)
        <br />
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>α {"<-"} Max(α, MiniMaxAlphaBeta(s, False,
        α, β))
        <br />
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        <b>if</b> α {">="} β<br />
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden>{"        "}</span>
        <b>return</b> α<br />
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> α<br />
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> s ∈ S(n) <b>do</b>
        <br />
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>β {"<-"} Min(β, MiniMaxAlphaBeta(s, True,
        α, β))
        <br />
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        <b>if</b> α {">="} β<br />
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden>{"        "}</span>
        <b>return</b> β<br />
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> β<br />
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
        <b>end</b>
      </div>
      <p>
        Initial call:{" "}
        <span className="monospaced">MiniMaxAlphaBeta(n, True, -∞, +∞)</span>.
      </p>
      <p>
        Below you can see the MiniMax algorithm with alpha-beta pruning in
        action:
      </p>
      <div className="imageContainerSingle">
        <div>
          <MiniMaxAlphaBeta />
          <p className="imageDescription">
            <b>Image 4:</b> MiniMax algorithm with alpha-beta pruning in action.
          </p>
        </div>
      </div>
      <p>
        Unfortunately, even with this optimization, the calculation can still be
        too computationally expensive. Luckily, other methods of limiting the
        number of node evaluations are available – one of them is using a{" "}
        <b>depth limit</b>.
      </p>
    </SimpleBar>
  );
}

export default TheoryAlphaBetaPruning;
