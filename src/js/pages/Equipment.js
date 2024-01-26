import React from "react";
import { useStateContext } from "../utils/StateContext";
import Table from "../components/Table/Table.js";

const Equipment = () => {
  const {
    equipmentData,
    equipmentDataFilePath,
    equipmentDataFields,
    showEquipmentDataFields,
    equipmentDataFieldsOrder,
  } = useStateContext();

  return (
    <Table
      fields={equipmentDataFields}
      data={equipmentData}
      filePath={equipmentDataFilePath}
      showFields={showEquipmentDataFields}
      fieldOrder={equipmentDataFieldsOrder}
    />
  );
};

export default Equipment;
