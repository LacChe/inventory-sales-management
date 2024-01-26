import React, { Fragment } from "react";
import Popup from "reactjs-popup";
import { fillEmptyProdFieldsUsingInvFields } from "../../utils/DataManip.js";
import { useStateContext } from "../../utils/StateContext.js";

const ProductDropdown = ({ records, setRecords }) => {
  const { productData, productDataFields, inventoryData } = useStateContext();

  let sortedData = productData
    .map((mapItem) => {
      // create object of ids, names and prices
      let filledRecord = fillEmptyProdFieldsUsingInvFields(
        mapItem,
        productDataFields,
        inventoryData
      );
      let en = filledRecord.name_en;
      let cn = filledRecord.name_cn;
      let size = filledRecord.size ? filledRecord.size : "";
      return {
        id: filledRecord.id,
        name_en: en ? en + " " + size : "",
        name_cn: cn ? cn + " " + size : "",
        price: filledRecord.price,
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

  // wrapper function to toggle values in setRecords usestate
  function setRecordsState(record) {
    setRecords((prev) => {
      if (prev.map((r) => r.id).includes(record.id)) {
        return prev.filter((filterItem) => filterItem.id !== record.id);
      } else {
        return [...prev, record];
      }
    });
  }

  function generateDropdown() {
    return (
      <div className="dropdown grid-col-3">
        {sortedData.map((data) => (
          <Fragment key={data.id}>
            {Object.keys(data).map((key) => {
              // dont include price in dropdown
              if (key !== "price")
                return (
                  <button
                    key={key}
                    className={
                      records.map((r) => r.id).includes(data.id)
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      setRecordsState(data);
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

  return (
    <Popup
      position="bottom left"
      trigger={<button className="clickable-button">Choose Records</button>}
    >
      {generateDropdown()}
    </Popup>
  );
};

export default ProductDropdown;
