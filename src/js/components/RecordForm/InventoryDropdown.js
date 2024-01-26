import React, { Fragment, useState } from "react";
import { useStateContext } from "../../utils/StateContext.js";
import Popup from "reactjs-popup";

/* 
  Drop down for choosing inventory items and amounts
*/

const InventoryDropdown = ({ item, displayItem, field }) => {
  const { inventoryData } = useStateContext();
  const [inventoryItems, setInventoryItems] = useState(
    item?.inventory_items ? item?.inventory_items : {}
  );

  let itemIds = inventoryItems ? Object.keys(inventoryItems) : [];

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

  function generateDropdown() {
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

  return (
    <Popup
      nested
      key={field.name + "input"}
      trigger={
        <input
          id={field.name + "input"}
          className="popup-grid-cell"
          value={displayItem ? JSON.stringify(inventoryItems) : ""}
          readOnly
        />
      }
    >
      {generateDropdown()}
    </Popup>
  );
};

export default InventoryDropdown;
