import React from "react";
import Popup from "reactjs-popup";
import { useStateContext } from "../../utils/StateContext";

const TableFunctionBar = ({ tableName, schema, tableSettings }) => {
  // TODO
  // add record
  // export to csv
  // filter and search
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
        <input placeholder="Filter..." />
        <input placeholder="Search..." />
      </div>
    </div>
  );
};

export default TableFunctionBar;
