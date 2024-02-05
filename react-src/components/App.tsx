import React from "react";
import { useStateContext } from "../utils/StateContext";

const App = () => {
  // START test useStateContext
  const { tempField } = useStateContext();
  console.log(tempField);
  // END test useStateContext

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

export default App;
