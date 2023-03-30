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
      <span className="author">
        Author – <a href="https://github.com/michal-sar">Michał Sar</a>
      </span>
      <br />
      <a href="https://www.ii.pw.edu.pl/ii_en">Institute of Computer Science</a>
      ,
      <br />
      <a href="https://www.elka.pw.edu.pl/eng">
        The Faculty of Electronics and Information Technology
      </a>
      ,
      <br />
      <a href="https://www.pw.edu.pl/engpw">Warsaw University of Technology</a>
    </footer>
  </div>,
);
