import React, { Fragment } from "react";
import { useStateContext } from "../../utils/StateContext.js";
import { generateUID } from "../../utils/HelperFunctions.js";
import InventoryDropdown from "./InventoryDropdown.js";
import ProductDropdown from "./ProductDropdown.js";

const RecordForm = ({ fields, item = {}, filePath, allItems }) => {
  const { transactionDataFilePath, productDataFilePath, saveFileToApi } =
    useStateContext();

  let displayItem = { ...item };

  // array of non formula fields for generating record creation/edit form
  let fieldsNoFormula = fields.filter((field) => {
    if (field.type === "formula") {
      if (displayItem) delete displayItem[field.name];
    } else {
      return field;
    }
  });

  function saveData(event) {
    // create new item
    let newItem = {};
    fieldsNoFormula.forEach((field, index) => {
      if (event.target[index].id === "inventory_itemsinput") {
        // this is a generated json string
        newItem[field.name] = JSON.parse(event.target[index].value);
      } else if (event.target[index].id === "not_a_saleinput") {
        // this is a checkbox
        newItem[field.name] = displayItem[field.name];
      } else {
        newItem[field.name] = event.target[index].value;
      }
    });
    // add or change in allItems
    let newAllItems = [...allItems];
    if (
      newAllItems.filter((filterItem) => filterItem.id === newItem.id)
        .length === 0
    ) {
      newAllItems = newAllItems.concat(newItem);
    } else {
      newAllItems = newAllItems.map((mapItem) => {
        if (mapItem.id === newItem.id) return newItem;
        else return mapItem;
      });
    }

    // remove formula fields from saving
    // send to main for saving
    newAllItems.forEach((record) => {
      fields.forEach((field) => {
        if (field.type === "formula") delete record[field.name];
      });
    });
    saveFileToApi({ filePath, data: newAllItems });
    // event.preventDefault();
  }

  function inputForm(key) {
    return (
      <Fragment key={key.name}>
        <label htmlFor={key.name + "input"} className="popup-grid-cell">
          {key.name.replaceAll("_", " ")}
        </label>

        {/* default */}
        {key.name !== "id" &&
          key.type !== "boolean" &&
          key.name !== "notes" &&
          key.type !== "date" &&
          key.type !== "dropdown" && (
            <input
              id={key.name + "input"}
              className="popup-grid-cell"
              defaultValue={displayItem ? displayItem[key.name] : ""}
            />
          )}

        {/* special cases */}
        {key.name === "id" && (
          <input
            id={key.name + "input"}
            className="popup-grid-cell"
            defaultValue={displayItem.id ? displayItem.id : generateUID()}
            readOnly
          />
        )}
        {key.name === "notes" && (
          <textarea
            id={key.name + "input"}
            className="popup-grid-cell"
            defaultValue={displayItem ? displayItem[key.name] : ""}
          />
        )}
        {key.type === "date" && (
          <input
            type="date"
            id={key.name + "input"}
            className="popup-grid-cell"
            defaultValue={displayItem ? displayItem[key.name] : ""}
          />
        )}
        {key.type === "boolean" && (
          <input
            type="checkbox"
            id={key.name + "input"}
            className="popup-grid-cell"
            defaultChecked={
              !(
                !displayItem ||
                !displayItem.not_a_sale ||
                displayItem.not_a_sale === "false"
              )
            }
            onChange={(e) => {
              if (!displayItem.not_a_sale || displayItem.not_a_sale === "false")
                displayItem.not_a_sale = "true";
              else displayItem.not_a_sale = "false";
            }}
          />
        )}
        {key.type === "dropdown" && filePath === transactionDataFilePath && (
          <ProductDropdown
            item={item}
            displayItem={displayItem}
            fields={fields}
            field={key}
          />
        )}
        {key.type === "dropdown" && filePath === productDataFilePath && (
          <InventoryDropdown
            item={item}
            displayItem={displayItem}
            field={key}
          />
        )}
      </Fragment>
    );
  }

  return (
    <div className="popup-comp">
      <form className="popup-grid" onSubmit={saveData}>
        {fieldsNoFormula.map((key) => inputForm(key))}
        <button type="submit" className="clickable-button popup-save-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default RecordForm;
