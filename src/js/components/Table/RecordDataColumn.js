import React, { useState } from "react";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import { fillEmptyProdFieldsUsingInvFields } from "../../utils/DataManip.js";
import { useStateContext } from "../../utils/StateContext.js";

const RecordDataColumn = ({
  column,
  fieldOrder,
  data,
  filePath,
  fields,
  searchTerm,
}) => {
  const { toggleOrder, productDataFilePath, inventoryData } = useStateContext();
  const [hoverId, setHoverId] = useState("");

  return (
    <div key={column.name} className="column">
      {/* render header */}
      <div
        className="column-header"
        onClick={() => toggleOrder(filePath, column.name)}
      >
        <div className="header-sort-caret">
          {fieldOrder.field === column.name &&
            (fieldOrder.asc ? <AiFillCaretUp /> : <AiFillCaretDown />)}
        </div>
        <div>{column.name.replaceAll("_", " ")}</div>
      </div>
      {/* render each row for every field */}
      {data.map((row) => {
        let displayRow = { ...row };
        // if prod, fill in blanks from inventory
        if (filePath === productDataFilePath)
          displayRow = fillEmptyProdFieldsUsingInvFields(
            displayRow,
            fields,
            inventoryData
          );
        let innerHtml = displayRow[column.name];
        if (column.type === "dropdown") innerHtml = JSON.stringify(innerHtml);
        if (column.type === "boolean")
          innerHtml = innerHtml === "true" ? "#" : "";
        return (
          <div
            onMouseOver={() => setHoverId(displayRow.id)}
            style={{
              textDecoration: `${
                searchTerm !== "" &&
                JSON.stringify(innerHtml)
                  ?.toLowerCase()
                  .includes(searchTerm?.toLowerCase())
                  ? `underline 2px ${getComputedStyle(
                      document.body
                    ).getPropertyValue("--color-highlight")}`
                  : `underline 2px #00000000`
              }`,
            }}
            className={
              "cell" +
              (column.name === "notes" ? " notes" : "") +
              (hoverId === displayRow.id ? " hover" : "")
            }
            key={displayRow[fields[0].name] + column.name}
          >
            {innerHtml}
          </div>
        );
      })}
    </div>
  );
};

export default RecordDataColumn;
