import React from "react";
import { useStateContext } from "../utils/StateContext";
import Layout from "./Layout";
import { HashRouter, Route, Routes } from "react-router-dom";
import Charts from "./charts/Charts";
import TableFunctionBar from "./tables/TableFunctionBar";
import TableContent from "./tables/TableContent";

/**
 * Function component for rendering the main application.
 *
 * @return {JSX.Element} The JSX for the main application
 */
const App = () => {
  const { tableSchemas, userSettings } = useStateContext();

  if (!tableSchemas) return <>Loading...</>;

  const tabNames = Object.keys(tableSchemas);

  let tableElements = {};
  // tableSchemas may be undefined, so empty object is provided
  Object.keys(tableSchemas || {}).forEach((tableName) => {
    tableElements[tableName] = (
      <div>
        <TableFunctionBar />
        <TableContent />
      </div>
    );
  });

  tableElements["charts"] = <Charts />;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {tabNames.map((name) => (
            <Route key={name} path={`/${name}`} element={tableElements[name]} />
          ))}
          <Route path="/Charts" element={<Charts />} />
          <Route path="/" element={tableElements[userSettings.currentTab]} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
