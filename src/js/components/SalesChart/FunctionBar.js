import React from "react";
import ProductDropdown from "./ProductDropdown.js";
import { useStateContext } from "../../utils/StateContext.js";

const FunctionBar = ({
  records,
  setRecords,
  dateRange,
  setDateRange,
  precision,
  setPrecision,
  parameter,
  setParameter,
}) => {
  const { productData } = useStateContext();

  // dates = [startedate, enddate]
  function setDateRangeState(dates) {
    if (dates[0] && dates[1] && Date.parse(dates[0]) > Date.parse(dates[1]))
      return;
    setDateRange(dates);
  }

  function toggleAllRecords() {
    setRecords((prev) => {
      if (prev.length > 0) return [];
      else return productData;
    });
  }

  return (
    <div className="chart-parameters">
      <div>
        <button className="clickable-button" onClick={() => toggleAllRecords()}>
          Toggle All
        </button>
        <ProductDropdown records={records} setRecords={setRecords} />
      </div>
      <div className="chart-label">Range:</div>
      <div className="chart-date-input-wrapper">
        <input
          type="date"
          value={dateRange[0]}
          onChange={(e) => {
            setDateRangeState([e.target.value, dateRange[1]]);
          }}
        />
        <div>~</div>
        <input
          type="date"
          value={dateRange[1]}
          onChange={(e) => {
            setDateRangeState([dateRange[0], e.target.value]);
          }}
        />
      </div>
      <div className="chart-label">Precision:</div>
      <div>
        <button
          className={precision === "day" ? "selected" : ""}
          onClick={() => setPrecision("day")}
        >
          Day
        </button>
        <button
          className={precision === "month" ? "selected" : ""}
          onClick={() => setPrecision("month")}
        >
          Month
        </button>
        <button
          className={precision === "year" ? "selected" : ""}
          onClick={() => setPrecision("year")}
        >
          Year
        </button>
      </div>
      <div className="chart-label">Field:</div>
      <div>
        <button
          className={parameter === "amount" ? "selected" : ""}
          onClick={() => setParameter("amount")}
        >
          Amount
        </button>
        <button
          className={parameter === "revenue" ? "selected" : ""}
          onClick={() => setParameter("revenue")}
        >
          Revenue
        </button>
      </div>
    </div>
  );
};

export default FunctionBar;
