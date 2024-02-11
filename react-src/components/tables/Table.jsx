import React from "react";
import TableContent from "./TableContent";
import TableFunctionBar from "./TableFunctionBar";
import { useStateContext } from "../../utils/StateContext";
import { generateDisplayData } from "../../utils/dataManip";

// pass approriate data to TableFunctionBar and TableContent based on tableName
const Table = ({ tableName }) => {
  const {
    tableSchemas,
    inventory,
    products,
    equipment,
    transactions,
    userSettings,
  } = useStateContext();

  const recordData = {
    inventory,
    products,
    equipment,
    transactions,
  };

  const props = {
    tableName,
    schema: tableSchemas[tableName],
    displayRecords: generateDisplayData(
      { ...recordData[tableName] },
      tableSchemas[tableName],
      userSettings.tableSettings[tableName]
    ),
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
