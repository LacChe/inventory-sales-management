import React from "react";
import { useStateContext } from "../../utils/StateContext";
const TableContent = ({ props }) => {
  const { setUserTableSettings } = useStateContext();
  let { tableName, displayRecords, schema, tableSettings } = props;

  /**
   * Toggles the sorting field and direction in the table settings.
   *
   * @param {string} field - The field to sort by
   */
  function toggleSort(field) {
    if (tableSettings.sortingByField === field) {
      tableSettings.sortingAscending = !tableSettings.sortingAscending;
    } else {
      tableSettings.sortingByField = field;
      tableSettings.sortingAscending = true;
    }

    setUserTableSettings(tableName, tableSettings);
  }

  /**
   * Generates the table header based on the provided schema and table settings.
   *
   * @return {JSX.Element} The table header JSX element
   */
  function tableHeader() {
    return (
      <thead>
        <tr>
          {schema.map((field) => {
            if (tableSettings?.hiddenFields?.includes(field.name)) return;
            if (field.name === "unit") return;
            return (
              <th key={field.name} scope="col">
                <button onClick={() => toggleSort(field.name)}>
                  {field.name.replaceAll("_", " ")}
                </button>
              </th>
            );
          })}
          {!tableSettings?.hiddenFields?.includes("edit") && (
            <th scope="col">
              <button>Edit</button>
            </th>
          )}
          {!tableSettings?.hiddenFields?.includes("delete") && (
            <th scope="col">
              <button>Delete</button>
            </th>
          )}
        </tr>
      </thead>
    );
  }

  /**
   * A function that generates table data based on the provided id, record, and field.
   *
   * @param {type} record - record containing field to be displayed
   * @param {type} field - which field of the record to display
   * @return {JSX.Element} The table cell data JSX element
   */
  function tableData(record, field) {
    if (field.name === "id") return;
    if (field.name === "unit") return;
    if (tableSettings?.hiddenFields?.includes(field.name)) return;

    // display object type by listing key then values
    if (field.type === "object")
      return (
        <td key={`${field.name}`} className={field.name}>
          {Object.keys(record[field.name]).map((key) => {
            return (
              <div key={field.name}>
                {record[field.name][key]} {key}
              </div>
            );
          })}
        </td>
      );

    // combine size and unit
    if (field.name === "size")
      return (
        <td key={`${field.name}`} className={field.name}>
          <div>{`${record[field.name]} ${record.unit || ""}`}</div>
        </td>
      );

    // other field types
    return (
      <td key={`${field.name}`} className={field.name}>
        {record[field.name]}
      </td>
    );
  }

  /**
   * Generate a table row for the given record ID.
   *
   * @param {type} recordId - the ID of the record
   * @return {JSX.Element} The table row JSX element
   */
  function tableRow(recordId) {
    let displayRecord = { ...displayRecords[recordId] };
    return (
      <tr key={recordId}>
        {!tableSettings?.hiddenFields?.includes("id") && (
          <th scope="row" className="recordId">
            {recordId}
          </th>
        )}
        {schema.map((field) => {
          return tableData(displayRecord, field);
        })}
        {!tableSettings?.hiddenFields?.includes("edit") && (
          <td>
            <button>Edit</button>
          </td>
        )}
        {!tableSettings?.hiddenFields?.includes("delete") && (
          <td>
            <button>Delete</button>
          </td>
        )}
      </tr>
    );
  }

  /**
   * A function that generates the body of a table.
   *
   * @return {JSX.Element} The table body as a JSX element
   */
  function tableBody() {
    return (
      <tbody>
        {Object.keys(displayRecords).map((recordId) => {
          return tableRow(recordId);
        })}
      </tbody>
    );
  }

  return (
    <table>
      {tableHeader()}
      {tableBody()}
    </table>
  );
};

export default TableContent;
