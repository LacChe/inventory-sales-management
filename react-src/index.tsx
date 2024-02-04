import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

declare global {
  interface Window {
    api: any;
  }
}

const App = () => {
  // START event and file io testing
  window.api.send("file", "tableSchemas");
  window.api.receive("file", (data: Array<string>) => {
    console.log(`received: ${JSON.stringify(data[0])}`);
    console.log("payload: ", JSON.parse(data[1]));
  });
  window.api.receive("error", (data: Array<string>) => {
    console.log(`received: ${JSON.stringify(data[0])}`);
    console.log("error: ", JSON.parse(data[1]));
  });
  // END event and file io testing

  return <h1>Hello Electron TypeScript React App!</h1>;
};

ReactDOM.render(<App />, document.getElementById("app"));
