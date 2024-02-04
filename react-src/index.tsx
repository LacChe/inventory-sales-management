import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App = () => {
  return (
    <h1 className="bg-blue-500 text-white p-4">
      Hello Electron TypeScript React App!
    </h1>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
