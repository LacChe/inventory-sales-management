import React from "react";
import { useStateContext } from "../utils/StateContext";
import Table from "../components/Table/Table.js";

const Inventory = () => {
  const {
    inventoryData,
    inventoryDataFilePath,
    inventoryDataFields,
    showInventoryDataFields,
    inventoryDataFieldsOrder,
  } = useStateContext();

  return (
    <Table
      fields={inventoryDataFields}
      data={inventoryData}
      filePath={inventoryDataFilePath}
      showFields={showInventoryDataFields}
      fieldOrder={inventoryDataFieldsOrder}
    />
  );
};

export default Inventory;
