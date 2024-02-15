import React from "react";
import { useStateContext } from "../../utils/StateContext";
import Popup from "reactjs-popup";
import Record from "../records/Record";
import { generateDisplayData, fillBlankFields } from "../../utils/dataManip";
import { AiFillEdit } from "react-icons/ai";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

const TableContent = () => {
  const {
    setUserTableSettings,
    tableSchemas,
    userSettings,
    inventory,
    products,
  } = useStateContext();

  if (tableSchemas[userSettings.currentTab] === undefined) return;
  const displayRecords = generateDisplayData(userSettings.currentTab);
  const schema = tableSchemas[userSettings.currentTab];
  const tableSettings = userSettings.tableSettings[userSettings.currentTab];

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
    setUserTableSettings(userSettings.currentTab, tableSettings);
  }

  /**
   * Generates the table header based on the provided schema and table settings.
   *
   * @return {JSX.Element} The table header JSX element
   */
  function tableHeader() {
    return (
      <thead className="table-content-header">
        <tr>
          {schema.map((field) => {
            if (tableSettings?.hiddenFields?.includes(field.name)) return;
            if (field.name === "unit") return;
            return (
              <th key={field.name} scope="col">
                <button onClick={() => toggleSort(field.name)}>
                  {field.name.replaceAll("_", " ")}
                  {tableSettings.sortingByField === field.name &&
                    (tableSettings.sortingAscending ? (
                      <AiFillCaretUp />
                    ) : (
                      <AiFillCaretDown />
                    ))}
                </button>
              </th>
            );
          })}
          {!tableSettings?.hiddenFields?.includes("edit") && (
            <th scope="col">
              <div>
                <AiFillEdit />
              </div>
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

    let searchTermFound = false;
    if (
      tableSettings?.searchTerm !== undefined &&
      tableSettings?.searchTerm !== ""
    ) {
      searchTermFound =
        JSON.stringify(record[field.name] || "")
          .toLowerCase()
          .indexOf(tableSettings?.searchTerm.toLowerCase()) !== -1;
    }

    if (record[field.name] === undefined)
      return (
        <td key={`${field.name}`}>
          <div></div>
        </td>
      );

    // display object type by listing values then corresponding name
    if (field.type === "object")
      return (
        <td key={`${field.name}`}>
          {Object.keys(record[field.name]).map((id) => {
            let name = "";
            if (userSettings.currentTab === "products")
              name = inventory[id].name_en;
            if (userSettings.currentTab === "transactions")
              name = fillBlankFields(
                products[id],
                tableSchemas.products
              ).name_en;

            return (
              <div className={searchTermFound ? "selected" : ""} key={id}>
                {record[field.name][id]} {name}
              </div>
            );
          })}
        </td>
      );

    // combine size and unit
    if (field.name === "size")
      return (
        <td key={`${field.name}`}>
          <div className={searchTermFound ? "selected" : ""}>{`${
            record[field.name] || ""
          } ${record.unit || ""}`}</div>
        </td>
      );

    // color text red when below threshold
    if (
      field.name === "amount" &&
      record[field.name] < record.reminder_amount
    ) {
      return (
        <td
          style={{
            fontWeight: "600",
            color: `${getComputedStyle(document.body).getPropertyValue(
              "--color-highlight"
            )}`,
          }}
          className={searchTermFound ? "selected" : ""}
          key={`${field.name}`}
        >
          {record[field.name]}
        </td>
      );
    }

    // other field types
    return (
      <td className={searchTermFound ? "selected" : ""} key={`${field.name}`}>
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

    let searchTermFound = false;
    if (
      tableSettings?.searchTerm !== undefined &&
      tableSettings?.searchTerm !== ""
    ) {
      searchTermFound =
        JSON.stringify(recordId)
          .toLowerCase()
          .indexOf(tableSettings?.searchTerm.toLowerCase()) !== -1;
    }

    return (
      <tr key={recordId}>
        {!tableSettings?.hiddenFields?.includes("id") && (
          <th className={searchTermFound ? "selected" : ""} scope="row">
            {recordId}
          </th>
        )}
        {schema.map((field) => {
          return tableData(displayRecord, field);
        })}
        {!tableSettings?.hiddenFields?.includes("edit") && (
          <td>
            <Popup
              modal
              nested
              trigger={
                <button className="edit-button">
                  <AiFillEdit />
                </button>
              }
            >
              <Record
                tableName={userSettings.currentTab}
                schema={schema}
                id={recordId}
                record={displayRecord}
              />
            </Popup>
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
      <tbody className="table-content-body">
        {Object.keys(displayRecords).map((recordId) => {
          return tableRow(recordId);
        })}
      </tbody>
    );
  }

  return (
    <table className="table-content-wrapper">
      {tableHeader()}
      {tableBody()}
    </table>
  );
};

export default TableContent;
