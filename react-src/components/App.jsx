import React from "react";
import { useStateContext } from "../utils/StateContext";
import Layout from "./Layout";
import { HashRouter, Route, Routes } from "react-router-dom";

const App = () => {
  const { tableSchemas } = useStateContext();

  const tabNames = Object.keys(tableSchemas ? tableSchemas : {});

  // TODO map appropriate tables to routes
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {tabNames.map((name) => (
            <Route path={`/${name}`} element={<>{name}</>} />
          ))}
          <Route path="/" element={<>products</>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
