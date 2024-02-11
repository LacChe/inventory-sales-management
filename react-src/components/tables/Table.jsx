import React from "react";
import TableContent from "./TableContent";
import TableFunctionBar from "./TableFunctionBar";
import { useStateContext } from "../../utils/StateContext";

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
  return (
    <div>
      <TableFunctionBar
        tableName={tableName}
        schema={tableSchemas[tableName]}
        tableSettings={userSettings.tableSettings[tableName]}
      />
      <TableContent
        tableName={tableName}
        schema={tableSchemas[tableName]}
        records={recordData[tableName]}
        tableSettings={userSettings.tableSettings[tableName]}
      />
    </div>
  );
};

export default Table;
