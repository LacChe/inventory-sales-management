import React from "react";
import { useStateContext } from "../utils/StateContext";
import Layout from "./Layout";
import { HashRouter, Route, Routes } from "react-router-dom";
import Table from "./tables/Table";

const App = () => {
  const { tableSchemas } = useStateContext();

  // TODO get from userSettings
  const lastTab = "products";

  const tabNames = Object.keys(tableSchemas ? tableSchemas : {});

  let tableElements = {};
  // tableSchemas may be undefined, so empty object is provided
  Object.keys(tableSchemas || {}).forEach((tableName) => {
    tableElements[tableName] = <Table tableName={tableName} />;
  });

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {tabNames.map((name) => (
            <Route key={name} path={`/${name}`} element={tableElements[name]} />
          ))}
          <Route path="/" element={tableElements[lastTab]} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
