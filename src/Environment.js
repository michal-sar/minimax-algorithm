import React, { createContext, useState } from "react";
import { PracticeButtons, TheoryButtons } from "./Buttons";
import Theory from "./theory/Theory";
import Practice from "./practice/Practice";
import Settings from "./Settings";
import "./Environment.css";

export const EnvironmentContext = createContext();

function Environment() {
  const [theory, setTheory] = useState("MiniMaxAlgorithm");
  const [practice, setPractice] = useState("Tree");
  const [alphaBetaPruning, setAlphaBetaPruning] = useState(false);
  const [depthLimit, setDepthLimit] = useState(false);
  const [depthLimitValue, setDepthLimitValue] = useState(10);

  return (
    <main>
      <section>
        <h1>MiniMax algorithm</h1>
        <TheoryButtons theory={theory} setTheory={setTheory} />
        <Theory theory={theory} />
        <h3>
          Choose how you want to learn or experiment with the MiniMax algorithm
          and alpha-beta pruning:
        </h3>
        <PracticeButtons practice={practice} setPractice={setPractice} />
        <EnvironmentContext.Provider
          value={{ alphaBetaPruning, depthLimit, depthLimitValue }}
        >
          <Practice practice={practice} />
        </EnvironmentContext.Provider>
      </section>
      <section>
        <EnvironmentContext.Provider
          value={{
            depthLimit,
            depthLimitValue,
            setAlphaBetaPruning,
            setDepthLimit,
            setDepthLimitValue,
          }}
        >
          <Settings practice={practice} />
        </EnvironmentContext.Provider>
      </section>
    </main>
  );
}

export default Environment;
