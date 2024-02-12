import React from "react";
import TableContent from "./TableContent";
import TableFunctionBar from "./TableFunctionBar";
import { useStateContext } from "../../utils/StateContext";
import { generateDisplayData } from "../../utils/dataManip";

/**
 * Renders a table component with the provided table name.
 * passes approriate data to TableFunctionBar and TableContent based on tableName
 *
 * @param {string} tableName - The name of the table to render
 * @return {JSX.Element} The table component
 */
const Table = ({ tableName }) => {
  const { tableSchemas, userSettings } = useStateContext();

  const props = {
    tableName,
    schema: tableSchemas[tableName],
    displayRecords: generateDisplayData(tableName),
    tableSettings: userSettings.tableSettings[tableName],
  };

  return (
    <div>
      <TableFunctionBar props={props} />
      <TableContent props={props} />
    </div>
  );
};

export default Table;
