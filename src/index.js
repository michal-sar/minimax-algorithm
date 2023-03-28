import React from "react";
import ReactDOM from "react-dom/client";
import Environment from "./Environment";
import "simplebar-react/dist/simplebar.min.css";
import "./index.css";

require("../public/images/shortcut-icon-512.png");
require("../public/images/shortcut-icon-192.png");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <Environment />
    <footer>
      © Copyright – <a href="https://github.com/michal-sar">Michał Sar</a>
    </footer>
  </div>,
);
