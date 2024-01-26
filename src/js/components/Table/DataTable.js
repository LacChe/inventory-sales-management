import React, { Fragment } from "react";
import { filterRecordsByTerm, sortRecords } from "../../utils/DataManip.js";
import EditColumn from "./EditColumn.js";
import DeleteColumn from "./DeleteColumn.js";
import RecordDataColumn from "./RecordDataColumn.js";

const DataTable = ({
  fields,
  fieldOrder,
  showFields,
  filePath,
  data,
  filterTerm,
  searchTerm,
}) => {
  // id of the record that mouse is hovering over

  let sortedData = sortRecords(data, fieldOrder, fields);

  // filter by filterTerm
  sortedData = filterRecordsByTerm(
    filterTerm,
    sortedData,
    showFields,
    filePath,
    fields
  );

  return (
    <div className="table">
      {/* render columns of fields that are shown */}
      {fields
        .filter((field) => showFields.includes(field.name)) // remove unshown fields
        .map((column) => {
          return (
            <Fragment key={JSON.stringify(column)}>
              <RecordDataColumn
                column={column}
                fieldOrder={fieldOrder}
                data={sortedData}
                filePath={filePath}
                fields={fields}
                searchTerm={searchTerm}
              />
            </Fragment>
          );
        })}
      {/* edit button column */}
      {showFields.includes("edit") && (
        <EditColumn data={sortedData} filePath={filePath} fields={fields} />
      )}
      {/* delete button column */}
      {showFields.includes("delete") && (
        <DeleteColumn data={sortedData} filePath={filePath} fields={fields} />
      )}
    </div>
  );
};

export default DataTable;
