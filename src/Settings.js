import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Settings.css";

const root = document.querySelector(":root");

function Settings(props) {
  const {
    depthLimit,
    depthLimitValue,
    setAlphaBetaPruning,
    setDepthLimit,
    setDepthLimitValue,
  } = props;

  const [top, setTop] = useState(139);

  useEffect(() => {
    const handleScroll = () => {
      setTop(Math.min(139 + window.pageYOffset * 2.784, 1124.54));
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const updateAlphaBetaPruning = (event) => {
    setAlphaBetaPruning(event.currentTarget.checked);
  };

  const updateDepthLimit = (event) => {
    setDepthLimit(event.currentTarget.checked);
  };

  const updateDepthLimitValue = (event) => {
    if (depthLimit) {
      setDepthLimitValue(Number(event.target.value));
      root.style.setProperty("--depth-slider-value", event.target.value);
    }
  };

  return (
    <div className="settings" style={{ top: `${top}px` }}>
      <h2>Settings:</h2>
      <div className="settingsGrid">
        <span className="setting">Alpha-beta pruning</span>
        <label className="toggleSwitchContainer">
          <input
            className="toggleAlphaBetaPruning"
            type="checkbox"
            onChange={updateAlphaBetaPruning}
            autoComplete="off"
          ></input>
          <span className="toggleSwitch"></span>
        </label>
        <span className="setting">Depth limit</span>
        <label className="toggleSwitchContainer">
          <input
            className="toggleDepthLimit"
            type="checkbox"
            onChange={updateDepthLimit}
            autoComplete="off"
          ></input>
          <span className="toggleSwitch"></span>
        </label>
      </div>
      <input
        className="sliderDepthLimit"
        disabled={!depthLimit}
        type="range"
        onChange={updateDepthLimitValue}
        min="1"
        max="25"
        value={depthLimitValue}
        autoComplete="off"
      ></input>
      <span
        className="depthLimitValue"
        style={depthLimit ? {} : { opacity: "0.5" }}
      >
        {depthLimitValue}
      </span>
    </div>
  );
}

Settings.propTypes = {
  depthLimit: PropTypes.bool,
  depthLimitValue: PropTypes.number,
  setAlphaBetaPruning: PropTypes.func,
  setDepthLimit: PropTypes.func,
  setDepthLimitValue: PropTypes.func,
};

export default Settings;
