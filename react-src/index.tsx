import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

declare global {
  interface Window {
    api: any;
  }
}

const App = () => {
  window.api.send("event", "test data");
  return <h1>Hello Electron TypeScript React App!</h1>;
};

ReactDOM.render(<App />, document.getElementById("app"));
