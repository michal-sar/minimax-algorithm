import React, { useContext } from "react";
import SimpleBar from "simplebar-react";
import { EnvironmentContext } from "../Environment";
import DepthLimit1 from "../../public/images/depth-limit-1.svg";
import DepthLimit2 from "../../public/images/depth-limit-2.svg";
import DepthLimit3 from "../../public/images/depth-limit-3.svg";

function TheoryDepthLimit() {
  const { depthLimit, depthLimitValue } = useContext(EnvironmentContext);

  return (
    <SimpleBar id="theoryContainer">
      <p>
        <b>Depth limit</b>, as the name suggests, limits the maximum depth the
        MiniMax algorithm is allowed to reach. It can be implemented by
        decrementing the current depth limit value as the MiniMax algorithm
        ventures deeper into the game tree.
      </p>
      <p>
        Below you can see a partial game tree representing tic-tac-toe
        depth-limited to the current value of <b>Depth limit</b> in the{" "}
        <span className="settingsText">Settings</span> panel.
      </p>
      <div className="imageContainerSingle">
        <div>
          {depthLimit && depthLimitValue == 1 && <DepthLimit1 />}
          {depthLimit && depthLimitValue == 2 && <DepthLimit2 />}
          {(!depthLimit || depthLimitValue > 2) && <DepthLimit3 />}
          <svg
            width="567"
            viewBox="0 -10 567 38"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              fontSize="23.625"
              textAnchor="middle"
              dominantBaseline="hanging"
              fontFamily="Nunito, sans-serif"
              fontWeight="900"
              x="283.5"
              y="0"
              paintOrder="stroke"
              stroke="#224"
              strokeWidth="6"
              strokeLinejoin="round"
              fill="#fff"
            >
              {depthLimit
                ? "Depth limit: " + depthLimitValue
                : "Depth limit: Off"}
            </text>
          </svg>
          <p className="imageDescription">
            <b>Image 5:</b> Depth-limited partial game tree representing
            tic-tac-toe.
          </p>
        </div>
      </div>
      <p>
        Using a depth limit creates a possibility that a{" "}
        <span className="outlineBlue">
          non-final state will need to be evaluated
        </span>
        . But how would we assign a score to a state where the outcome of the
        game is not known without applying the MiniMax algorithm? One way to do
        this is through the use of <b>heuristics</b>.
      </p>
    </SimpleBar>
  );
}

export default TheoryDepthLimit;
