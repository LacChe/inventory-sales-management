import React from "react";
import Popup from "reactjs-popup";
import Record from "../RecordForm/RecordForm.js";
import { useStateContext } from "../../utils/StateContext.js";

const FunctionBar = ({
  fields,
  showFields,
  filePath,
  data,
  filterTerm,
  searchTerm,
  setFilterTerm,
  setSearchTerm,
}) => {
  const {
    toggleShownField,
    productDataFilePath,
    inventoryData,
    saveSearchTerm,
    saveFilterTerm,
  } = useStateContext();

  // TODO move to helpers.js
  // exports as .csv
  function exportSpreadSheet() {
    let exportData = "";

    // add column headers
    fields.forEach((field) => {
      if (showFields.includes(field.name))
        exportData +=
          field.name?.replaceAll(",", "-").replaceAll("_", " ") + ",";
    });
    exportData = exportData.slice(0, -1) + "\n";

    // add records
    sortedData.forEach((record) => {
      let saveRecord = { ...record };
      if (filePath === productDataFilePath)
        saveRecord = fillEmptyProdFieldsUsingInvFields(
          saveRecord,
          fields,
          inventoryData
        );
      fields.forEach((field) => {
        if (showFields.includes(field.name)) {
          exportData +=
            JSON.stringify(saveRecord[field.name])?.replaceAll(",", "-") + ",";
        }
      });
      exportData = exportData.slice(0, -1) + "\n";
    });

    // download data
    const url = window.URL.createObjectURL(new Blob([exportData]));
    const link = document.createElement("a");
    link.href = url;
    const fileName = `${filePath.slice(0, -5)}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="field-toggle-buttons">
      <div>
        {/* function buttons */}
        <div className="add-button-wrapper">
          <Popup
            modal
            nested
            trigger={
              <button className="add-button clickable-button">
                Add Record
              </button>
            }
          >
            <Record fields={fields} filePath={filePath} allItems={data} />
          </Popup>
        </div>
        <div className="export-button-wrapper">
          <button
            className="export-button clickable-button"
            onClick={() => exportSpreadSheet()}
          >
            Export Spreadsheet
          </button>
        </div>

        {/* ui input params */}
        <div className="filter-bar-wrapper">
          <input
            className="filter-bar"
            placeholder="Filter..."
            onBlur={(e) => saveFilterTerm(e.target.value)}
            onChange={(e) => setFilterTerm(e.target.value)}
            defaultValue={filterTerm}
          />
        </div>
        <div className="search-bar-wrapper">
          <input
            className="search-bar"
            placeholder="Search..."
            onBlur={(e) => saveSearchTerm(e.target.value)}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>

      {/* toggles for displaying fields */}
      <div>
        <p>Show Columns: </p>
        {fields.map((item) => {
          return (
            <div key={item.name}>
              <button
                className={showFields.includes(item.name) ? "selected" : ""}
                onClick={() => toggleShownField(filePath, item.name)}
              >
                {item.name.replaceAll("_", " ")}
              </button>
            </div>
          );
        })}
        <div>
          <button
            className={showFields.includes("edit") ? "selected" : ""}
            onClick={() => toggleShownField(filePath, "edit")}
          >
            Edit
          </button>
        </div>
        <div>
          <button
            className={showFields.includes("delete") ? "selected" : ""}
            onClick={() => toggleShownField(filePath, "delete")}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FunctionBar;
