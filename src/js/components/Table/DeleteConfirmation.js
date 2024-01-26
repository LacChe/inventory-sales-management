import React, { Fragment } from "react";
import { useStateContext } from "../../utils/StateContext.js";
import { fillEmptyProdFieldsUsingInvFields } from "../../utils/DataManip.js";

const DeleteConfirmation = ({ fields, item, filePath, allItems }) => {
  const { saveFileToApi, productDataFilePath, inventoryData } =
    useStateContext();

  // fill in blank product fields
  let filledRecord = { ...item };
  if (filePath === productDataFilePath)
    filledRecord = fillEmptyProdFieldsUsingInvFields(
      filledRecord,
      fields,
      inventoryData
    );

  function saveData() {
    let newAllItems = allItems.filter(
      (filterItem) => filterItem.id !== filledRecord.id
    );
    saveFileToApi({ filePath, data: newAllItems });
    // event.preventDefault();
  }

  function dataTable() {
    return (
      <form className="popup-grid" onSubmit={saveData}>
        {/* show user all values and keys to confirm record deletion */}
        {fields.map((key) => (
          <Fragment key={key.name}>
            <label htmlFor={key.name + "input"} className="popup-grid-cell">
              {key.name.replaceAll("_", " ")}
            </label>
            <input
              id={key.name + "input"}
              className="popup-grid-cell"
              defaultValue={JSON.stringify(filledRecord[key.name])}
              readOnly
            ></input>
          </Fragment>
        ))}
        <button type="submit" className="clickable-button popup-delete-button">
          Delete
        </button>
      </form>
    );
  }

  return (
    <div className="popup-comp">
      <div>Confirm Deletion?</div>
      {dataTable()}
    </div>
  );
};

export default DeleteConfirmation;
