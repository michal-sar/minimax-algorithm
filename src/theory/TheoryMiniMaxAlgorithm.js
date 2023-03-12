import React from "react";
import SimpleBar from "simplebar-react";
import GameTree from "../../public/images/game-tree.svg";
import DepthFirst from "../../public/images/depth-first.svg";
import MiniMax from "../../public/images/minimax.svg";

function TheoryMiniMaxAlgorithm() {
  return (
    <SimpleBar id="theoryContainer">
      <p>
        The <b>MiniMax algorithm</b> determines the optimal move in two-player,{" "}
        <u>zero-sum games</u> with <u>perfect information</u>.{" "}
        <u>Zero-sum games</u> are games where the interests of the players are
        opposite to one another – one player’s gain is equivalent to another
        player’s loss. A game has <u>perfect information</u> when every player
        knows the game’s current state and is aware of all previously made
        moves.
      </p>
      <p>
        In games involving an element of chance, such as backgammon, a variation
        of the MiniMax algorithm called expectiMiniMax must be used. This
        website focuses on the standard version. We will explore games without
        randomizing devices (tossing a coin, rolling dice, etc.), such as
        tic-tac-toe and connect four.
      </p>
      <p>
        Most games can be represented in an abstract way by a <u>game tree</u>.
        The nodes of a game tree represent the specific states of the game, and
        the edges represent moves made by the players. The root node is the{" "}
        <span className="outlineGreen">initial state</span>, and the leaf nodes
        are the <span className="outlineRed">final states</span> of the game –
        states where the outcome is known.
      </p>
      <p>
        To determine the optimal move in the given situation, the MiniMax
        algorithm performs a <u>depth-first traversal</u> of the{" "}
        <u>partial game tree</u> starting at the node representing the{" "}
        <span className="outlineYellow">current state</span> of the game. It
        evaluates every node it encounters.
      </p>
      <div className="imageContainer">
        <div>
          <GameTree />
          <p className="imageDescription">
            <b>Image 1:</b> <u>Game tree</u> representing tic-tac-toe.
          </p>
        </div>
        <div>
          <DepthFirst />
          <p className="imageDescription">
            <b>Image 2:</b> <u>Depth-first traversal</u> of a{" "}
            <u>partial game tree</u> representing tic-tac-toe.
          </p>
        </div>
      </div>
      <p>
        If the evaluated state is final, a <u>utility function</u> (also called
        a <u>payoff function</u>) assigns a score to the state based on the
        outcome of the game. Here{"'"}s an example of a <u>utility function</u>:
      </p>
      <div className="monospaced">
        <div className="functionContainer">
          <div>
            {"       "}⎧ <br />
            {"       "}⎪ <br />
            U(f) = ⎨ <br />
            {"       "}⎪ <br />
            {"       "}⎩ <br />
          </div>
          <div className="functionValues">
            +1, win
            <br /> 0, draw
            <br />
            -1, loss
            <br />
          </div>
        </div>
      </div>
      <p>
        If the evaluated state is non-final, the assigned score will be chosen
        from the scores assigned to the children nodes, which are found using a{" "}
        <u>successor function</u>. The score choice depends on whether it is the
        player’s (the maximizer’s) or the opponent’s (the minimizer’s) turn. The
        maximizer selects the highest out of the assigned scores and the
        minimizer – the lowest. Of course, the children nodes have not been
        evaluated yet, so for every reachable non-final state, another instance
        of the MiniMax algorithm must be called to perform the score assignment.
      </p>
      <p>The following pseudocode describes the MiniMax algorithm:</p>
      <div className="monospaced">
        n — state
        <br />
        N — set of all states (n ∈ N)
        <br />
        f — final state
        <br />
        F — set of all final states (f ∈ F, F ⊆ N)
        <br />U — <u>utility function</u>
        <br />S — <u>successor function</u>
        <br />
        Max — returns the highest number given as an input parameter
        <br />
        Min — returns the lowest number given as an input parameter
        <br />
        maximizer_turn — binary variable (<i>true</i> when it’s the maximizer’s
        turn)
        <br />
        <br />
        <b>function</b> MiniMax(n, maximizer_turn)
        <br />
        <b>begin</b>
        <br />
        <span className="line">⎪ </span>
        <span hidden>{"  "}</span>
        <b>if</b> n ∈ F <b>then return</b> U(n)
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
        <span hidden>{"      "}</span>v {"<-"} Max(v, MiniMax(s, <i>false</i>))
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
        <b>for each</b> s ∈ S(s) <b>do</b>
        <br />
        <span className="line">⎪ ⎪ ⎪ </span>
        <span hidden>{"      "}</span>v {"<-"} Min(v, MiniMax(s, <i>true</i>))
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
          MiniMax(n, <i>true</i>)
        </span>
        .
      </p>
      <p>Below you can see the MiniMax algorithm in action:</p>
      <div className="imageContainer">
        <div>
          <MiniMax />
          <p className="imageDescription">
            <b>Image 3:</b> MiniMax algorithm in action.
          </p>
        </div>
      </div>
      <p>
        The example above shows a certain redundancy in the MiniMax algorithm.
        After a score of 0 has been assigned to the left branch,{" "}
        <span className="outlineBlue">these evaluations</span> of the other
        branches are unnecessary. The maximizer will choose the left branch (
        <span className="monospaced">score = 0</span>) over the other branches (
        <span className="monospaced">score = Min(-1, x) ≤ -1</span>) because{" "}
        <span className="monospaced">Max(0, Min(-1, x)) = 0</span> no matter
        what the value of <span className="monospaced">x</span> is.
      </p>
      <p>
        These redundancies can be eliminated with the use of{" "}
        <b>Alpha-beta pruning</b>.
      </p>
    </SimpleBar>
  );
}

export default TheoryMiniMaxAlgorithm;
