import React from "react";
import PropTypes from "prop-types";

function MiniMax(props) {
  const { highlightLine, maximizerTurn, utilityResult, s, miniMax, v } = props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlight" : ""}>
        <b>function</b> MiniMax(<span className="n">n</span>, maximizer_turn
        {maximizerTurn})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlight" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> <span className="n">n</span> ∈ F <b>then return</b>{" "}
        {utilityResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[0]} <span className="ligature">{"<-"}</span> -∞
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[0] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[1]} <span className="ligature">{"<-"}</span> Max({v[2]}, {miniMax[0]}
        )
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[4]} <span className="ligature">{"<-"}</span> +∞
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[1] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[5]} <span className="ligature">{"<-"}</span> Min({v[6]}, {miniMax[1]}
        )
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[7]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlight" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

MiniMax.propTypes = {
  highlightLine: PropTypes.number,
  maximizerTurn: PropTypes.string,
  utilityResult: PropTypes.string,
  s: PropTypes.array,
  miniMax: PropTypes.array,
  v: PropTypes.array,
};

function MiniMaxAlphaBeta(props) {
  const {
    highlightLine,
    maximizerTurn,
    utilityResult,
    s,
    miniMax,
    alpha,
    beta,
    a,
    b,
  } = props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlight" : ""}>
        <b>function</b> MiniMax(<span className="n">n</span>, maximizer_turn
        {maximizerTurn}, α{alpha}, β{beta})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlight" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> <span className="n">n</span> ∈ F <b>then return</b>{" "}
        {utilityResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[0] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {a[0]} <span className="ligature">{"<-"}</span> Max({a[1]}, {miniMax[0]}
        )
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        <b>if</b> {a[2]} <span className="ligature">{">="}</span> {b[0]}
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden>{"        "}</span>
        <b>return</b> {a[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {a[4]}
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[1] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {b[1]} <span className="ligature">{"<-"}</span> Min({b[2]}, {miniMax[1]}
        )
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        <b>if</b> {a[5]} <span className="ligature">{">="}</span> {b[3]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden>{"        "}</span>
        <b>return</b> {b[4]}
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {b[5]}
        <br />
      </div>
      <div className={highlightLine == 16 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 17 ? "highlight" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

MiniMaxAlphaBeta.propTypes = {
  highlightLine: PropTypes.number,
  maximizerTurn: PropTypes.string,
  utilityResult: PropTypes.string,
  s: PropTypes.array,
  miniMax: PropTypes.array,
  alpha: PropTypes.string,
  beta: PropTypes.string,
  a: PropTypes.array,
  b: PropTypes.array,
};

function DepthLimitedMiniMax(props) {
  const { highlightLine, maximizerTurn, utilityResult, s, miniMax, v, d } =
    props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlight" : ""}>
        <b>function</b> MiniMax(<span className="n">n</span>, d{d},
        maximizer_turn{maximizerTurn})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlight" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> <span className="n">n</span> ∈ F <b>or</b> d = 0{" "}
        <b>then return</b> {utilityResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[0]} <span className="ligature">{"<-"}</span> -∞
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[0] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[1]} <span className="ligature">{"<-"}</span> Max({v[2]}, {miniMax[0]}
        )
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[4]} <span className="ligature">{"<-"}</span> +∞
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[1] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[5]} <span className="ligature">{"<-"}</span> Min({v[6]}, {miniMax[1]}
        )
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[7]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlight" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

DepthLimitedMiniMax.propTypes = {
  highlightLine: PropTypes.number,
  maximizerTurn: PropTypes.string,
  utilityResult: PropTypes.string,
  s: PropTypes.array,
  miniMax: PropTypes.array,
  v: PropTypes.array,
  d: PropTypes.string,
};

function DepthLimitedMiniMaxAlphaBeta(props) {
  const {
    highlightLine,
    maximizerTurn,
    utilityResult,
    s,
    miniMax,
    alpha,
    beta,
    a,
    b,
    d,
  } = props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlight" : ""}>
        <b>function</b> MiniMax(<span className="n">n</span>, d{d},
        maximizer_turn{maximizerTurn}, α{alpha}, β{beta})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlight" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>if</b> <span className="n">n</span> ∈ F <b>or</b> d = 0{" "}
        <b>then return</b> {utilityResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>for each</b> <span className={s[0] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        {a[0]} <span className="ligature">{"<-"}</span> Max({a[1]}, {miniMax[0]}
        )
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        <b>if</b> {a[2]} <span className="ligature">{">="}</span> {b[0]}
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {a[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {a[4]}
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>for each</b> <span className={s[1] ? "s highlight" : "s"}>s</span> ∈
        S(
        <span className="n">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        {b[1]} <span className="ligature">{"<-"}</span> Min({b[2]}, {miniMax[1]}
        )
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        <b>if</b> {a[5]} <span className="ligature">{">="}</span> {b[3]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlight" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {b[4]}
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlight" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {b[5]}
        <br />
      </div>
      <div className={highlightLine == 16 ? "highlight" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 17 ? "highlight" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

DepthLimitedMiniMaxAlphaBeta.propTypes = {
  highlightLine: PropTypes.number,
  maximizerTurn: PropTypes.string,
  utilityResult: PropTypes.string,
  s: PropTypes.array,
  miniMax: PropTypes.array,
  alpha: PropTypes.string,
  beta: PropTypes.string,
  a: PropTypes.array,
  b: PropTypes.array,
  d: PropTypes.string,
};

export {
  MiniMax,
  MiniMaxAlphaBeta,
  DepthLimitedMiniMax,
  DepthLimitedMiniMaxAlphaBeta,
};
