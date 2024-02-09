import React from "react";
import { useStateContext } from "../utils/StateContext";

const App = () => {
  // START test useStateContext
  const { inventory } = useStateContext();
  console.log("inventory", inventory);
  // END test useStateContext

  return <h1>Hello Electron React App!</h1>;
};

export default App;
