import React, { Fragment, useState } from "react";
import Popup from "reactjs-popup";
import { useStateContext } from "../utils/StateContext";
import {
  generateUID,
  fillEmptyProdFieldsUsingInvFields,
} from "../utils/HelperFunctions.js";

const Record = ({ fields, item = {}, filePath, allItems }) => {
  const [productId, setProductId] = useState(
    item?.product_id ? item?.product_id : ""
  );
  const [inventoryItems, setInventoryItems] = useState(
    item?.inventory_items ? item?.inventory_items : {}
  );
  const {
    productData,
    inventoryData,
    transactionDataFilePath,
    productDataFilePath,
    saveFileToApi,
  } = useStateContext();

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  let displayItem = { ...item };

  // array of non formula fields for generating record creation/edit form
  let fieldsNoFormula = fields.filter((field) => {
    if (field.type === "formula") {
      if (displayItem) delete displayItem[field.name];
      return;
    }
    return field;
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
    let newAllItems = { ...allItems };
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
          <Popup
            open={open}
            nested
            key={key.name + "input"}
            trigger={
              <input
                id={key.name + "input"}
                className="popup-grid-cell"
                value={displayItem ? productId : ""}
                readOnly
              />
            }
          >
            <div>{productIdDropdown()}</div>
          </Popup>
        )}
        {key.type === "dropdown" && filePath === productDataFilePath && (
          <Popup
            open={open}
            nested
            key={key.name + "input"}
            trigger={
              <input
                id={key.name + "input"}
                className="popup-grid-cell"
                value={displayItem ? JSON.stringify(inventoryItems) : ""}
                readOnly
              />
            }
          >
            <div>{inventoryIdAmountDropdown()}</div>
          </Popup>
        )}
      </Fragment>
    );
  }

  function productIdDropdown() {
    let sortedData = productData
      .map((product) => {
        // create object array of names and sizes
        product = fillEmptyProdFieldsUsingInvFields(
          product,
          fields,
          inventoryData
        );
        let en = product.name_en;
        let cn = product.name_cn;
        let size = product.size;
        return {
          id: product.id,
          name_en: en ? en + " " + size : "",
          name_cn: cn ? cn + " " + size : "",
        };
      })
      .sort((a, b) => {
        if (
          JSON.stringify(a.name_en)?.toString().toLowerCase() >
          JSON.stringify(b.name_en)?.toString().toLowerCase()
        ) {
          return 1;
        } else if (
          JSON.stringify(a.name_en)?.toLowerCase() <
          JSON.stringify(b.name_en)?.toString().toLowerCase()
        ) {
          return -1;
        } else {
          return 0;
        }
      });
    return (
      <div className="dropdown grid-col-3">
        {sortedData.map((data) => (
          <Fragment key={data.id}>
            {Object.keys(data).map((key) => {
              return (
                <button
                  key={key}
                  className={data.id === productId ? "selected" : ""}
                  onClick={() => {
                    setProductId(data.id);
                    closeModal();
                  }}
                >
                  {data[key]}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>
    );
  }

  function inventoryIdAmountDropdown() {
    let sortedData = inventoryData.sort((a, b) => {
      if (
        JSON.stringify(a.name_en)?.toString().toLowerCase() >
        JSON.stringify(b.name_en)?.toString().toLowerCase()
      ) {
        return 1;
      } else if (
        JSON.stringify(a.name_en)?.toLowerCase() <
        JSON.stringify(b.name_en)?.toString().toLowerCase()
      ) {
        return -1;
      } else {
        return 0;
      }
    });

    let itemIds = inventoryItems ? Object.keys(inventoryItems) : [];
    return (
      <div className="dropdown grid-col-5">
        {sortedData.map((data) => (
          <Fragment key={data.id}>
            <button
              className={itemIds.includes(data.id) ? "selected" : ""}
              onClick={() => {
                toggleInventoryIds(data.id);
              }}
            >
              {data.id}
            </button>
            <button
              className={itemIds.includes(data.id) ? "selected" : ""}
              onClick={() => {
                toggleInventoryIds(data.id);
              }}
            >
              {data.name_en}
            </button>
            <button
              className={itemIds.includes(data.id) ? "selected" : ""}
              onClick={() => {
                toggleInventoryIds(data.id);
              }}
            >
              {data.name_cn}
            </button>
            <button
              className={itemIds.includes(data.id) ? "selected" : ""}
              onClick={() => {
                toggleInventoryIds(data.id);
              }}
            >
              {data.size}
            </button>
            <input
              type="number"
              className={itemIds.includes(data.id) ? "selected" : ""}
              onChange={(e) => {
                toggleInventoryIds(data.id, e.target.value);
              }}
              readOnly={itemIds.includes(data.id) ? false : true}
              value={itemIds.includes(data.id) ? inventoryItems[data.id] : ""}
            />
          </Fragment>
        ))}
      </div>
    );
  }

  function toggleInventoryIds(id, amount) {
    setInventoryItems((prev) => {
      let newPrev = { ...prev };
      if (!amount) {
        // toggle id
        if (Object.keys(newPrev).includes(id)) delete newPrev[id];
        else newPrev[id] = 0;
      } else {
        // set amount
        if (Object.keys(newPrev).includes(id)) newPrev[id] = amount;
      }
      return newPrev;
    });
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

export default Record;
