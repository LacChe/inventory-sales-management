import React, { Fragment } from "react";
import { useStateContext } from "../../../utils/StateContext";
import Popup from "reactjs-popup";
import { fillBlankFields } from "../../../utils/dataManip";

const SalesChartParameterBar = ({ chartSettings }) => {
  const { setUserChartSettings, products, tableSchemas } = useStateContext();

  function setParameters(field, value) {
    chartSettings[field] = value;
    setUserChartSettings("sales", chartSettings);
  }

  function toggleProductId(id) {
    let newProductIds = [...chartSettings.productIds];
    if (newProductIds.includes(id)) {
      newProductIds = newProductIds.filter((prodId) => prodId !== id);
    } else {
      newProductIds = [...newProductIds, id];
    }
    chartSettings.productIds = newProductIds;
    setUserChartSettings("sales", chartSettings);
  }

  function toggleAll() {
    if (chartSettings.productIds.length !== Object.keys(products).length) {
      chartSettings.productIds = Object.keys(products);
      setUserChartSettings("sales", chartSettings);
    } else {
      chartSettings.productIds = [];
      setUserChartSettings("sales", chartSettings);
    }
  }

  const displayProducts = {};
  Object.keys(products).forEach(
    (id) =>
      (displayProducts[id] = fillBlankFields(
        products[id],
        tableSchemas.products
      ))
  );

  // filter group range

  function chartParameters() {
    return (
      <div className="chart-parameters">
        <div>
          <button onClick={toggleAll} className="selected">
            Toggle All
          </button>
        </div>
        <div>
          <Popup
            position="bottom left"
            trigger={<button className="selected">Products</button>}
          >
            <div className="chart-record-selection-dropdown">
              {Object.keys(displayProducts).map((id) => (
                <Fragment key={id}>
                  <button
                    className={
                      chartSettings.productIds.includes(id) ? "selected" : ""
                    }
                    onClick={() => toggleProductId(id)}
                  >
                    <div>{id}</div>
                  </button>
                  <button
                    className={
                      chartSettings.productIds.includes(id) ? "selected" : ""
                    }
                    onClick={() => toggleProductId(id)}
                  >
                    <div>{displayProducts[id].name_en}</div>
                  </button>
                  <button
                    className={
                      chartSettings.productIds.includes(id) ? "selected" : ""
                    }
                    onClick={() => toggleProductId(id)}
                  >
                    <div>{displayProducts[id].name_cn}</div>
                  </button>
                </Fragment>
              ))}
            </div>
          </Popup>
        </div>
        <div>
          <div className="label">Range: </div>
          <input
            type="date"
            value={chartSettings.dateRange[0]}
            onChange={(e) => {
              setParameters("dateRange", [
                e.target.value,
                chartSettings.dateRange[1],
              ]);
            }}
          />
          <div className="label">~</div>
          <input
            type="date"
            value={chartSettings.dateRange[1]}
            onChange={(e) => {
              setParameters("dateRange", [
                chartSettings.dateRange[0],
                e.target.value,
              ]);
            }}
          />
        </div>
        <div>
          <div className="label">Precision: </div>
          <button
            className={chartSettings.precision === "day" ? "selected" : ""}
            onClick={() => setParameters("precision", "day")}
          >
            Day
          </button>
          <button
            className={chartSettings.precision === "month" ? "selected" : ""}
            onClick={() => setParameters("precision", "month")}
          >
            Month
          </button>
          <button
            className={chartSettings.precision === "year" ? "selected" : ""}
            onClick={() => setParameters("precision", "year")}
          >
            Year
          </button>
        </div>
        <div>
          <div className="label">Field: </div>
          <button
            className={chartSettings.field === "revenue" ? "selected" : ""}
            onClick={() => setParameters("field", "revenue")}
          >
            Revenue
          </button>
          <button
            className={chartSettings.field === "amount" ? "selected" : ""}
            onClick={() => setParameters("field", "amount")}
          >
            Amount
          </button>
        </div>
      </div>
    );
  }
  return chartParameters();
};

export default SalesChartParameterBar;
