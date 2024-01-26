import React, { Fragment, useState } from "react";
import Popup from "reactjs-popup";
import { useStateContext } from "../../utils/StateContext.js";
import { fillEmptyProdFieldsUsingInvFields } from "../../utils/DataManip.js";

const ProductDropdown = ({ item, displayItem, fields, field }) => {
  const [productId, setProductId] = useState(
    item?.product_id ? item?.product_id : ""
  );
  const { productData, inventoryData } = useStateContext();

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

  function generateDropdown() {
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
      nested
      key={field.name + "input"}
      trigger={
        <input
          id={field.name + "input"}
          className="popup-grid-cell"
          value={displayItem ? productId : ""}
          readOnly
        />
      }
    >
      {generateDropdown()}
    </Popup>
  );
};

export default ProductDropdown;
