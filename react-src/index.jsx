import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { StateContext } from "./utils/StateContext";
import App from "./components/App";

ReactDOM.render(
  <React.StrictMode>
    <StateContext>
      <App />
    </StateContext>
  </React.StrictMode>,
  document.getElementById("app")
);
