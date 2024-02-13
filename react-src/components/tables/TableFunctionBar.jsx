import React from "react";
import Popup from "reactjs-popup";
import Record from "../records/Record";
import { useStateContext } from "../../utils/StateContext";
import { exportSpreadSheet } from "../../utils/fileIO";

/**
 * Generate the table function bar component.
 *
 * @param {object} props - formatted as { tableName, displayRecords, schema, tableSettings }
 * @return {JSX} the table function bar component
 */
const TableFunctionBar = ({ props }) => {
  const { setUserTableSettings } = useStateContext();
  let { tableName, displayRecords, schema, tableSettings } = props;

  /**
   * Format shown data then download
   *
   */
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

  /**
   * Toggles the visibility of the specified field in the table settings.
   *
   * @param {string} field - The field to toggle the visibility for
   */
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

  /**
   * A function that handles the onChange event for the filter inclusion input,
   * splits the provided term into an array, assigns it to tableSettings.filterInclude,
   * and sets the user table settings.
   *
   * @param {string} term - The term to be processed for filtering.
   */
  function filterIncludeOnChangeHandler(term) {
    let termArr = term.split(",");
    tableSettings.filterInclude = termArr;
    setUserTableSettings(tableName, tableSettings);
  }

  /**
   * A function that handles the onChange event for the filter exclusion input,
   * splits the provided term into an array, assigns it to tableSettings.filterExclude,
   * and sets the user table settings.
   *
   * @param {string} term - the term to be processed
   */
  function filterExcludeOnChangeHandler(term) {
    let termArr = term.split(",");
    tableSettings.filterExclude = termArr;
    setUserTableSettings(tableName, tableSettings);
  }

  /**
   * Handles the onChange event for the search input and updates the table settings accordingly.
   *
   * @param {string} term - the search term entered by the user
   */
  function searchOnChangeHandler(term) {
    tableSettings.searchTerm = term;
    setUserTableSettings(tableName, tableSettings);
  }

  return (
    <div className="table-function-bar-wrapper">
      <div>
        <Popup modal nested trigger={<button>Add</button>}>
          <Record tableName={tableName} schema={schema} />
        </Popup>
        <button onClick={downloadData}>Export</button>
        <Popup position="bottom left" trigger={<button>Toggle Columns</button>}>
          <div className="table-function-bar-field-toggle">
            {schema.map((field) => {
              if (field.name !== "unit")
                return (
                  <button
                    className={
                      !tableSettings.hiddenFields.includes(field.name)
                        ? "selected"
                        : ""
                    }
                    key={field.name}
                    onClick={() => toggleHiddenField(field.name)}
                  >
                    {field.name.replaceAll("_", " ")}
                  </button>
                );
            })}
            <button
              className={
                !tableSettings.hiddenFields.includes("edit") ? "selected" : ""
              }
              onClick={() => toggleHiddenField("edit")}
            >
              Edit
            </button>
          </div>
        </Popup>
      </div>
      <div>
        <input
          placeholder="Include..."
          defaultValue={tableSettings.filterInclude.join(",")}
          onChange={(e) => filterIncludeOnChangeHandler(e.target.value)}
        />
        <input
          placeholder="Exclude..."
          defaultValue={tableSettings.filterExclude.join(",")}
          onChange={(e) => filterExcludeOnChangeHandler(e.target.value)}
        />
        <input
          placeholder="Search..."
          defaultValue={tableSettings.searchTerm}
          onChange={(e) => searchOnChangeHandler(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TableFunctionBar;
