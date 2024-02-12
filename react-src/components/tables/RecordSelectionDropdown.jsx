import React, { Fragment } from "react";
import { generateDisplayData } from "../../utils/dataManip";

const RecordSelectionDropdown = ({
  tableName,
  selectedRecords,
  setRecordSelection,
}) => {
  let dataSet;
  switch (tableName) {
    case "products":
      dataSet = generateDisplayData("inventory");
      break;
    case "transactions":
      dataSet = generateDisplayData("products");
      break;
    default:
      console.error("dropdown does not support table: ", tableName);
      break;
  }

  return (
    <div className="record-selection-dropdown">
      {Object.keys(dataSet).map((id) => {
        return (
          <Fragment key={id}>
            <div
              className={selectedRecords[id] !== undefined ? "selected" : ""}
              onClick={() => setRecordSelection(id)}
            >
              {dataSet[id].name_en}
            </div>
            <div
              className={selectedRecords[id] !== undefined ? "selected" : ""}
              onClick={() => setRecordSelection(id)}
            >
              {dataSet[id].name_cn}
            </div>
            <input
              className={selectedRecords[id] !== undefined ? "selected" : ""}
              defaultValue={selectedRecords[id] || 0}
              onChange={(e) => setRecordSelection(id, e.target.value)}
              readOnly={selectedRecords[id] === undefined}
              type="number"
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default RecordSelectionDropdown;
