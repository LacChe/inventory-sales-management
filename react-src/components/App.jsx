import React from "react";
import { useStateContext } from "../utils/StateContext";
import { readFile } from "../utils/eventHandler";

const App = () => {
  // START test useStateContext
  const state = useStateContext();
  console.log("state", state);
  // END test useStateContext

  // START event and file io testing
  readFileTest();
  // END event and file io testing

  return <h1>Hello Electron React App!</h1>;
};

async function readFileTest() {
  // console.log(await readFile("tableSchemas"));
}

export default App;
