import React from "react";
import PropTypes from "prop-types";

function MiniMax(props) {
  const { highlightLine, maximizerTurn, utilityResult, v, s, miniMax } = props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlightLine" : ""}>
        <b>function</b> MiniMax(<span className="highlightN">n</span>,
        maximizer_turn{maximizerTurn})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlightLine" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> <span className="highlightN">n</span> ∈ F <b>then return</b>{" "}
        {utilityResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[0]} {"<-"} -∞
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[0] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[1]} {"<-"} Max({v[2]}, {miniMax[0]})
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[4]} {"<-"} +∞
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[1] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[5]} {"<-"} Min({v[6]}, {miniMax[1]})
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[7]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlightLine" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

MiniMax.propTypes = {
  highlightLine: PropTypes.number,
  maximizerTurn: PropTypes.string,
  utilityResult: PropTypes.string,
  v: PropTypes.array,
  s: PropTypes.array,
  miniMax: PropTypes.array,
};

function MiniMaxAlphaBeta(props) {
  const {
    highlightLine,
    maximizerTurn,
    alpha,
    beta,
    utilityResult,
    s,
    a,
    b,
    miniMax,
  } = props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlightLine" : ""}>
        <b>function</b> MiniMax(<span className="highlightN">n</span>,
        maximizer_turn{maximizerTurn}, α{alpha}, β{beta})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlightLine" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> <span className="highlightN">n</span> ∈ F <b>then return</b>{" "}
        {utilityResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[0] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {a[0]} {"<-"} Max({a[1]}, {miniMax[0]})
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        <b>if</b> {a[2]} {">="} {b[0]}
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden>{"        "}</span>
        <b>return</b> {a[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {a[4]}
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[1] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {b[1]} {"<-"} Min({b[2]}, {miniMax[1]})
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        <b>if</b> {a[5]} {">="} {b[3]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden>{"        "}</span>
        <b>return</b> {b[4]}
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {b[5]}
        <br />
      </div>
      <div className={highlightLine == 16 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 17 ? "highlightLine" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

MiniMaxAlphaBeta.propTypes = {
  highlightLine: PropTypes.number,
  maximizerTurn: PropTypes.string,
  alpha: PropTypes.string,
  beta: PropTypes.string,
  utilityResult: PropTypes.string,
  s: PropTypes.array,
  a: PropTypes.array,
  b: PropTypes.array,
  miniMax: PropTypes.array,
};

function DepthLimitedMiniMax(props) {
  const { highlightLine, d, maximizerTurn, heuristicResult, v, s, miniMax } =
    props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlightLine" : ""}>
        <b>function</b> MiniMax(<span className="highlightN">n</span>, d{d},
        maximizer_turn{maximizerTurn})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlightLine" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> <span className="highlightN">n</span> ∈ F <b>or</b> d = 0{" "}
        <b>then return</b> {heuristicResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[0]} {"<-"} -∞
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[0] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[1]} {"<-"} Max({v[2]}, {miniMax[0]})
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        {v[4]} {"<-"} +∞
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>for each</b> <span className={s[1] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden>{"      "}</span>
        {v[5]} {"<-"} Min({v[6]}, {miniMax[1]})
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden>{"    "}</span>
        <b>return</b> {v[7]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden>{"  "}</span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlightLine" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

DepthLimitedMiniMax.propTypes = {
  highlightLine: PropTypes.number,
  d: PropTypes.string,
  maximizerTurn: PropTypes.string,
  heuristicResult: PropTypes.string,
  v: PropTypes.array,
  s: PropTypes.array,
  miniMax: PropTypes.array,
};

function DepthLimitedMiniMaxAlphaBeta(props) {
  const {
    highlightLine,
    d,
    maximizerTurn,
    alpha,
    beta,
    heuristicResult,
    s,
    a,
    b,
    miniMax,
  } = props;

  return (
    <div className="monospaced">
      <div className={highlightLine == 1 ? "highlightLine" : ""}>
        <b>function</b> MiniMax(<span className="highlightN">n</span>, d{d},
        maximizer_turn{maximizerTurn}, α{alpha}, β{beta})
        <br />
      </div>
      <div className={highlightLine == 2 ? "highlightLine" : ""}>
        <b>begin</b>
        <br />
      </div>
      <div className={highlightLine == 3 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>if</b> <span className="highlightN">n</span> ∈ F <b>or</b> d = 0{" "}
        <b>then return</b> {heuristicResult}
        <br />
      </div>
      <div className={highlightLine == 4 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>if</b> maximizer_turn
        <br />
      </div>
      <div className={highlightLine == 5 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>for each</b> <span className={s[0] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 6 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        {a[0]} {"<-"} Max({a[1]}, {miniMax[0]})
        <br />
      </div>
      <div className={highlightLine == 7 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        <b>if</b> {a[2]} {">="} {b[0]}
        <br />
      </div>
      <div className={highlightLine == 8 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {a[3]}
        <br />
      </div>
      <div className={highlightLine == 9 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {a[4]}
        <br />
      </div>
      <div className={highlightLine == 10 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>else</b>
        <br />
      </div>
      <div className={highlightLine == 11 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>for each</b> <span className={s[1] ? "highlightS" : ""}>s</span> ∈ S(
        <span className="highlightN">n</span>) <b>do</b>
        <br />
      </div>
      <div className={highlightLine == 12 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        {b[1]} {"<-"} Min({b[2]}, {miniMax[1]})
        <br />
      </div>
      <div className={highlightLine == 13 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪</span>
        <span hidden> </span>
        <b>if</b> {a[5]} {">="} {b[3]}
        <br />
      </div>
      <div className={highlightLine == 14 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {b[4]}
        <br />
      </div>
      <div className={highlightLine == 15 ? "highlightLine" : ""}>
        <span className="vertical">⎪⎪</span>
        <span hidden> </span>
        <b>return</b> {b[5]}
        <br />
      </div>
      <div className={highlightLine == 16 ? "highlightLine" : ""}>
        <span className="vertical">⎪</span>
        <span hidden> </span>
        <b>end</b>
        <br />
      </div>
      <div className={highlightLine == 17 ? "highlightLine" : ""}>
        <b>end</b>
      </div>
    </div>
  );
}

DepthLimitedMiniMaxAlphaBeta.propTypes = {
  highlightLine: PropTypes.number,
  d: PropTypes.string,
  maximizerTurn: PropTypes.string,
  alpha: PropTypes.string,
  beta: PropTypes.string,
  heuristicResult: PropTypes.string,
  s: PropTypes.array,
  a: PropTypes.array,
  b: PropTypes.array,
  miniMax: PropTypes.array,
};

export {
  MiniMax,
  MiniMaxAlphaBeta,
  DepthLimitedMiniMax,
  DepthLimitedMiniMaxAlphaBeta,
};
