import React, { useState, useEffect } from "react";
import { useStateContext } from "../../utils/StateContext.js";
import FunctionBar from "./FunctionBar.js";
import DataTable from "./DataTable.js";

const Table = ({ fields, data, filePath, showFields, fieldOrder }) => {
  const { settings } = useStateContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");

  useEffect(() => {
    if (settings.search) setSearchTerm(settings.search);
    if (settings.filter) setFilterTerm(settings.filter);
  }, [settings]);

  return (
    <div className="table-wrapper">
      <FunctionBar
        fields={fields}
        showFields={showFields}
        filePath={filePath}
        data={data}
        filterTerm={filterTerm}
        searchTerm={searchTerm}
        setFilterTerm={setFilterTerm}
        setSearchTerm={setSearchTerm}
      />
      <DataTable
        fields={fields}
        fieldOrder={fieldOrder}
        showFields={showFields}
        filePath={filePath}
        data={data}
        searchTerm={searchTerm}
        filterTerm={filterTerm}
      />
      {data.length <= 0 && <div>No Records</div>}
    </div>
  );
};

export default Table;
