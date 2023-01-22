import React from "react";
import ReactDOM from "react-dom/client";
import Environment from "./Environment";
import "simplebar-react/dist/simplebar.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Environment />
    <footer>© Copyright - Michał Sar</footer>
  </React.StrictMode>,
);
