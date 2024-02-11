import React from "react";
import Popup from "reactjs-popup";
import { useStateContext } from "../../utils/StateContext";
import { exportSpreadSheet } from "../../utils/fileIO";

const TableFunctionBar = ({ props }) => {
  const { setUserTableSettings } = useStateContext();
  let { tableName, displayRecords, schema, tableSettings } = props;

  function downloadData() {
    // only export shown fields
    let fields = schema
      .filter((field) => {
        return !tableSettings.hiddenFields.includes(field.name);
      })
      .map((field) => field.name);

    // only export units along with size
    if (!fields.includes("size"))
      fields = fields.filter((field) => field !== "unit");

    exportSpreadSheet(tableName, fields, displayRecords);
  }

  function toggleHiddenField(field) {
    if (tableSettings.hiddenFields.includes(field)) {
      tableSettings.hiddenFields = tableSettings.hiddenFields.filter((item) => {
        return item !== field;
      });
    } else {
      tableSettings.hiddenFields.push(field);
    }
    setUserTableSettings(tableName, tableSettings);
  }

  function filterIncludeOnChangeHandler(term) {
    let termArr = term.split(",");
    tableSettings.filterInclude = termArr;
    setUserTableSettings(tableName, tableSettings);
  }

  function filterExcludeOnChangeHandler(term) {
    let termArr = term.split(",");
    tableSettings.filterExclude = termArr;
    setUserTableSettings(tableName, tableSettings);
  }

  function searchOnChangeHandler(term) {
    tableSettings.searchTerm = term;
    setUserTableSettings(tableName, tableSettings);
  }

  return (
    <div>
      <div>
        <button>Add</button>
        <button onClick={downloadData}>Export</button>
        <Popup position="bottom left" trigger={<button>Toggle Columns</button>}>
          <div>
            {schema.map((field) => {
              if (field.name !== "unit")
                return (
                  <button
                    key={field.name}
                    onClick={() => toggleHiddenField(field.name)}
                  >
                    {field.name.replaceAll("_", " ")}
                  </button>
                );
            })}
            <button onClick={() => toggleHiddenField("edit")}>Edit</button>
            <button onClick={() => toggleHiddenField("delete")}>Delete</button>
          </div>
        </Popup>
      </div>
      <div>
        <input
          placeholder="Include..."
          value={tableSettings.filterInclude.join(",")}
          onChange={(e) => filterIncludeOnChangeHandler(e.target.value)}
        />
        <input
          placeholder="Exclude..."
          value={tableSettings.filterExclude.join(",")}
          onChange={(e) => filterExcludeOnChangeHandler(e.target.value)}
        />
        <input
          placeholder="Search..."
          onChange={(e) => searchOnChangeHandler(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TableFunctionBar;
