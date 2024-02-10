import React from "react";
import { fillBlankFromInventory } from "../../utils/dataManip";

const Table = ({ schema, records, userSettings }) => {
  // TODO split into components and export to default and specialized files

  function tableHeader() {
    return (
      <thead>
        <tr>
          {schema.map((field) => {
            if (userSettings.hiddenFields.includes(field.name)) return;
            return <th scope="col">{field.name.replaceAll("_", " ")}</th>;
          })}
        </tr>
      </thead>
    );
  }

  function tableData(record, field) {
    if (field.name === "id") return;
    if (userSettings.hiddenFields.includes(field.name)) return;

    // TODO display record names instead of ids
    // display object type by listing key then values
    if (field.type === "object")
      return (
        <td className={field.name}>
          {Object.keys(record[field.name]).map((key) => {
            return (
              <div>
                {record[field.name][key]} {key}
              </div>
            );
          })}
        </td>
      );

    // other field types
    return <td className={field.name}>{record[field.name]}</td>;
  }

  function tableBody() {
    return (
      <tbody>
        {Object.keys(records).map((recordId) => {
          let displayRecord = { ...records[recordId] };
          displayRecord = fillBlankFromInventory(displayRecord, schema);
          return (
            <tr>
              <th scope="row" className="recordId">
                {recordId}
              </th>
              {schema.map((field) => {
                return tableData(displayRecord, field);
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }

  return (
    <div>
      <div>buttons</div>
      <table>
        {tableHeader()}
        {tableBody()}
      </table>
    </div>
  );
};

export default Table;
