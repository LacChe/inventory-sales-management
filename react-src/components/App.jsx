import React from "react";
import { useStateContext } from "../utils/StateContext";
import Layout from "./Layout";
import { HashRouter, Route, Routes } from "react-router-dom";
import Table from "./tables/Table";

const App = () => {
  const {
    tableSchemas,
    inventory,
    products,
    equipment,
    transactions,
    userSettings,
  } = useStateContext();

  // TODO get from userSettings
  const lastTab = "products";

  const tabNames = Object.keys(tableSchemas ? tableSchemas : {});

  const recordData = {
    inventory,
    products,
    equipment,
    transactions,
  };
  let tableElements = {};
  // tableSchemas may be undefined, so empty object is provided
  Object.keys(tableSchemas || {}).forEach((tableName) => {
    tableElements[tableName] = (
      <Table
        schema={tableSchemas[tableName]}
        records={recordData[tableName]}
        userSettings={userSettings?.tableSettings[tableName]}
      />
    );
  });

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {tabNames.map((name) => (
            <Route path={`/${name}`} element={tableElements[name]} />
          ))}
          <Route path="/" element={tableElements[lastTab]} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
