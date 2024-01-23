import React, { useState, Fragment, useEffect } from "react";
import Popup from "reactjs-popup";
import { useStateContext } from "../utils/StateContext.js";
import {
  getContrastingHexColor,
  generateRandomHexColor,
  fillEmptyProdFieldsUsingInvFields,
} from "../utils/HelperFunctions.js";

const SalesChart = () => {
  const {
    productData,
    productDataFields,
    inventoryData,
    transactionData,
    saveChartData,
    settings,
  } = useStateContext();

  const [selectedRecord, setSelectedRecord] = useState("");
  // selected product records to find transactions with
  const [records, setRecords] = useState(
    settings.chartData?.records ? JSON.parse(settings.chartData.records) : []
  );
  const [dateRange, setDateRange] = useState(
    settings.chartData?.dateRange
      ? JSON.parse(settings.chartData.dateRange)
      : ["", ""]
  );
  // day month or year
  const [precision, setPrecision] = useState(
    settings.chartData?.precision
      ? JSON.parse(settings.chartData.precision)
      : "day"
  );
  const [transactions, setTransactions] = useState(
    settings.chartData?.transactions
      ? JSON.parse(settings.chartData.transactions)
      : []
  );
  // amount or revenue
  const [parameter, setParameter] = useState(
    settings.chartData?.parameter
      ? JSON.parse(settings.chartData.parameter)
      : "amount"
  );

  // get transactions containing product ids within date range, excluding not_a_sale
  useEffect(() => {
    setTransactions(() => {
      const filteredTransactions = transactionData.filter((transaction) => {
        if (
          records.map((r) => r.id).includes(transaction.product_id) &&
          !(transaction.not_a_sale === "true")
        ) {
          if (
            dateRange[0] !== "" &&
            Date.parse(transaction.date) < Date.parse(dateRange[0])
          )
            return;
          if (
            dateRange[1] !== "" &&
            Date.parse(transaction.date) > Date.parse(dateRange[1])
          )
            return;
          return transaction;
        }
      });
      return filteredTransactions;
    });
  }, [records, dateRange]);

  // save the chart data if ui parameters change
  useEffect(() => {
    saveChartData({
      records: JSON.stringify(records),
      dateRange: JSON.stringify(dateRange),
      precision: JSON.stringify(precision),
      transactions: JSON.stringify(transactions),
      parameter: JSON.stringify(parameter),
    });
  }, [records, dateRange, precision, transactions, parameter]);

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

  function toggleAllRecords() {
    setRecords((prev) => {
      if (prev.length > 0) return [];
      else return productData;
    });
  }

  // dates = [startedate, enddate]
  function setDateRangeState(dates) {
    if (dates[0] && dates[1] && Date.parse(dates[0]) > Date.parse(dates[1]))
      return;
    setDateRange(dates);
  }

  function productIdDropdown() {
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

  function barCSS(groupedTransactions, precision, prodId, max) {
    return {
      outline: `${
        selectedRecord === prodId
          ? `2px solid ${getComputedStyle(document.body).getPropertyValue(
              "--color-highlight"
            )}`
          : ""
      }`,
      width: `${
        (groupedTransactions[precision][prodId][parameter] / max) * 600 + 20
      }px`,
      backgroundColor: generateRandomHexColor(prodId),
      color: getContrastingHexColor(generateRandomHexColor(prodId)),
    };
  }

  function labelCSS(prodId) {
    return {
      textDecoration: `${
        selectedRecord === prodId
          ? `underline 2px ${getComputedStyle(document.body).getPropertyValue(
              "--color-highlight"
            )}`
          : `underline 2px #00000000`
      }`,
    };
  }

  function renderChart() {
    // group by precision
    let groupedTransactions = transactions.reduce((grouped, transaction) => {
      let date = transaction.date;
      if (precision === "month") date = date.slice(0, -3);
      if (precision === "year") date = date.slice(0, -6);
      (grouped[date] = grouped[date] || []).push(transaction);
      return grouped;
    }, {});

    // then group by products
    Object.keys(groupedTransactions).forEach((dateGroup) => {
      groupedTransactions[dateGroup] = groupedTransactions[dateGroup].reduce(
        (grouped, transaction) => {
          if (!grouped[transaction.product_id]) {
            grouped[transaction.product_id] = {
              name_en: transaction.name_en,
              amount: parseInt(transaction.amount),
              revenue: parseInt(transaction.revenue),
            };
          } else {
            grouped[transaction.product_id] = {
              name_en: grouped[transaction.product_id].name_en,
              amount:
                grouped[transaction.product_id].amount +
                parseInt(transaction.amount),
              revenue:
                grouped[transaction.product_id].revenue +
                parseInt(transaction.revenue),
            };
          }
          return grouped;
        },
        {}
      );
    });

    // find min max
    // used for scaling bar widths
    let max = -1,
      min = -1;
    Object.keys(groupedTransactions).forEach((dateGroup) => {
      Object.keys(groupedTransactions[dateGroup]).forEach((prodId) => {
        let checkVal = groupedTransactions[dateGroup][prodId][parameter];
        if (max === -1) max = checkVal;
        if (max < checkVal) max = checkVal;
        if (min === -1) min = checkVal;
        if (min > checkVal) min = checkVal;
      });
    });

    return (
      <div className="chart">
        {/* left hand side of chart: labels */}
        <div className="chart-section">
          {Object.keys(groupedTransactions).map((precision) => {
            return (
              <div className="chart-group" key={precision}>
                <div className="chart-group-header">{precision}</div>
                {Object.keys(groupedTransactions[precision]).map((prodId) => (
                  <div
                    style={labelCSS(prodId)}
                    className="chart-bar-label"
                    onClick={() => setSelectedRecord(prodId)}
                    key={prodId}
                  >
                    {groupedTransactions[precision][prodId].name_en}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {/* right hand side of chart: bars */}
        <div className="chart-section">
          {Object.keys(groupedTransactions).map((precision) => {
            return (
              <div className="chart-bars" key={precision}>
                <div className="chart-group-header"></div>
                {Object.keys(groupedTransactions[precision]).map((prodId) => (
                  <div
                    onClick={() => setSelectedRecord(prodId)}
                    key={prodId}
                    className="chart-bar"
                    style={barCSS(groupedTransactions, precision, prodId, max)}
                  >
                    {groupedTransactions[precision][prodId][parameter]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderChartParameterInputs() {
    return (
      <div className="chart-parameters">
        <div>
          <button
            className="clickable-button"
            onClick={() => toggleAllRecords()}
          >
            Toggle All
          </button>
          <Popup
            position="bottom left"
            trigger={
              <button className="clickable-button">Choose Records</button>
            }
          >
            <div>{productIdDropdown()}</div>
          </Popup>
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
  }

  return (
    <>
      {renderChartParameterInputs()}
      {renderChart()}
    </>
  );
};

export default SalesChart;
