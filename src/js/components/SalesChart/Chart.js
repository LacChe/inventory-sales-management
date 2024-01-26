import React, { useState } from "react";
import {
  getContrastingHexColor,
  generateRandomHexColor,
} from "../../utils/HelperFunctions.js";

const Chart = ({ transactions, precision, parameter }) => {
  const [selectedRecord, setSelectedRecord] = useState("");

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

  function generateChartLabels() {
    return (
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
    );
  }

  function generateChartBars() {
    return (
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
    );
  }

  return (
    <div className="chart">
      {generateChartLabels()}
      {generateChartBars()}
    </div>
  );
};

export default Chart;
