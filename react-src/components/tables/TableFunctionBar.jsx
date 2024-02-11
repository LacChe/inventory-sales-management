import React from "react";
import Popup from "reactjs-popup";
import { useStateContext } from "../../utils/StateContext";

const TableFunctionBar = ({ tableName, schema, tableSettings }) => {
  // TODO
  // add record
  // export to csv
  const { setUserTableSettings } = useStateContext();

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
    let termArr = term
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term !== "");
    tableSettings.filterInclude = termArr;
    setUserTableSettings(tableName, tableSettings);
  }

  function filterExcludeOnChangeHandler(term) {
    let termArr = term
      .split(",")
      .map((term) => term.trim())
      .filter((term) => term !== "");
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
        <button>Export</button>
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
          onChange={(e) => filterIncludeOnChangeHandler(e.target.value)}
        />
        <input
          placeholder="Exclude..."
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
