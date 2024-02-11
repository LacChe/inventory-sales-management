import React from "react";
import { useStateContext } from "../../utils/StateContext";
const TableContent = ({ tableName, schema, displayRecords, tableSettings }) => {
  const { setUserTableSettings } = useStateContext();

  function toggleSort(field) {
    if (tableSettings.sortingByField === field) {
      tableSettings.sortingAscending = !tableSettings.sortingAscending;
    } else {
      tableSettings.sortingByField = field;
      tableSettings.sortingAscending = true;
    }

    setUserTableSettings(tableName, tableSettings);
  }

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

  function tableData(id, record, field) {
    if (field.name === "id") return;
    if (field.name === "unit") return;
    if (tableSettings?.hiddenFields?.includes(field.name)) return;

    // display object type by listing key then values
    if (field.type === "object")
      return (
        <td key={`${id}-${field.name}`} className={field.name}>
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
        <td key={`${id}-${field.name}`} className={field.name}>
          <div>{`${record[field.name]} ${record.unit || ""}`}</div>
        </td>
      );

    // other field types
    return (
      <td key={`${id}-${field.name}`} className={field.name}>
        {record[field.name]}
      </td>
    );
  }

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
          return tableData(recordId, displayRecord, field);
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
