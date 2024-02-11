import React from "react";
import {
  fillBlankFromInventory,
  calculateCurrentStockAmount,
} from "../../utils/dataManip";

const TableContent = ({ schema, records, tableSettings }) => {
  // TODO sort
  // TODO add columns or delete and edit
  function tableHeader() {
    return (
      <thead>
        <tr>
          {schema.map((field) => {
            if (tableSettings?.hiddenFields?.includes(field.name)) return;
            if (field.name === "unit") return;
            return (
              <th key={field.name} scope="col">
                {field.name.replaceAll("_", " ")}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  }

  function tableData(id, record, field) {
    if (field.name === "id") return;
    if (field.name === "unit") return;
    if (tableSettings?.hiddenFields?.includes(field.name)) return;

    // calculate formula type with appropriate functions
    if (field.type === "formula") {
      let value;
      switch (field.name) {
        case "amount":
          value = calculateCurrentStockAmount(id);
          break;
        default:
          break;
      }
      return (
        <td key={`${id}-${field.name}`} className={field.name}>
          <div>{value}</div>
        </td>
      );
    }

    // TODO display record names instead of ids
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
    let displayRecord = { ...records[recordId] };
    displayRecord = fillBlankFromInventory(displayRecord, schema);
    return (
      <tr key={recordId}>
        <th scope="row" className="recordId">
          {recordId}
        </th>
        {schema.map((field) => {
          return tableData(recordId, displayRecord, field);
        })}
      </tr>
    );
  }

  function tableBody() {
    return (
      <tbody>
        {Object.keys(records).map((recordId) => {
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