import React, { useState } from "react";
import { useStateContext } from "../../../utils/StateContext";
import { fillBlankFields } from "../../../utils/dataManip";
import {
  generateRandomHexColor,
  getContrastingHexColor,
} from "../../../utils/helpers";

const SalesChartContent = ({ chartSettings }) => {
  const { transactions, products, tableSchemas } = useStateContext();

  const [selectedRecord, setSelectedRecord] = useState("");
  let displayTransactions = [];

  // used for scaling bar widths
  let max = -1,
    min = -1;

  function filterTransactions() {
    Object.keys(transactions).forEach((transactionId) => {
      chartSettings.productIds.forEach((productId) => {
        // return if product not in transactions or if not a sale
        if (
          transactions[transactionId].products[productId] === undefined ||
          transactions[transactionId].not_a_sale === "true"
        ) {
          return;
        }
        // return if out of date range
        if (
          chartSettings.dateRange[0] !== "" &&
          Date.parse(transactions[transactionId].date) <
            Date.parse(chartSettings.dateRange[0])
        ) {
          return;
        }
        if (
          chartSettings.dateRange[1] !== "" &&
          Date.parse(transactions[transactionId].date) >
            Date.parse(chartSettings.dateRange[1])
        ) {
          return;
        }

        displayTransactions.push({
          productId,
          name_en: fillBlankFields(products[productId], tableSchemas.products)
            .name_en,
          name_cn: fillBlankFields(products[productId], tableSchemas.products)
            .name_cn,
          amount: transactions[transactionId].products[productId],
          revenue: transactions[transactionId].revenue,
          date: transactions[transactionId].date,
        });
      });
    });
  }

  function reduceTransactions() {
    displayTransactions = displayTransactions.reduce(
      (groupedByDate, transaction) => {
        let date = transaction.date;
        if (chartSettings.precision === "month") date = date.slice(0, -3);
        if (chartSettings.precision === "year") date = date.slice(0, -6);
        (groupedByDate[date] = groupedByDate[date] || []).push(transaction);
        return groupedByDate;
      },
      {}
    );

    // then group by products
    Object.keys(displayTransactions).forEach((dateGroup) => {
      displayTransactions[dateGroup] = displayTransactions[dateGroup].reduce(
        (groupedbyProduct, transaction) => {
          if (!groupedbyProduct[transaction.productId]) {
            groupedbyProduct[transaction.productId] = {
              name_en: transaction.name_en,
              name_cn: transaction.name_cn,
              amount: Number.parseFloat(transaction.amount),
              revenue: Number.parseFloat(transaction.revenue),
            };
          } else {
            groupedbyProduct[transaction.productId] = {
              name_en: groupedbyProduct[transaction.productId].name_en,
              name_cn: groupedbyProduct[transaction.productId].name_cn,
              amount:
                groupedbyProduct[transaction.productId].amount +
                Number.parseFloat(transaction.amount),
              revenue:
                groupedbyProduct[transaction.productId].revenue +
                Number.parseFloat(transaction.revenue),
            };
          }
          return groupedbyProduct;
        },
        {}
      );
    });
  }

  function findMinMax() {
    Object.keys(displayTransactions).forEach((dateGroup) => {
      Object.keys(displayTransactions[dateGroup]).forEach((prodId) => {
        let checkVal =
          displayTransactions[dateGroup][prodId][chartSettings.field];
        if (max === -1) max = checkVal;
        if (max < checkVal) max = checkVal;
        if (min === -1) min = checkVal;
        if (min > checkVal) min = checkVal;
      });
    });
  }

  function barCSS(precision, prodId) {
    return {
      outline: `${
        selectedRecord === prodId
          ? `2px solid ${getComputedStyle(document.body).getPropertyValue(
              "--color-highlight"
            )}`
          : ""
      }`,
      width: `${
        (displayTransactions[precision][prodId][chartSettings.field] / max) *
          600 +
        20
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
        {Object.keys(displayTransactions).map((precision) => {
          return (
            <div className="chart-group" key={precision}>
              <div className="chart-group-header">{precision}</div>
              {Object.keys(displayTransactions[precision]).map((prodId) => (
                <div
                  style={labelCSS(prodId)}
                  className="chart-bar-label"
                  onClick={() => setSelectedRecord(prodId)}
                  key={prodId}
                >
                  {displayTransactions[precision][prodId].name_en}
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
        {Object.keys(displayTransactions).map((precision) => {
          return (
            <div className="chart-bars" key={precision}>
              <div className="chart-group-header"></div>
              {Object.keys(displayTransactions[precision]).map((prodId) => (
                <div
                  onClick={() => setSelectedRecord(prodId)}
                  key={prodId}
                  className="chart-bar"
                  style={barCSS(precision, prodId)}
                >
                  {displayTransactions[precision][prodId][chartSettings.field]}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  filterTransactions();
  reduceTransactions();
  findMinMax();

  return (
    <div className="chart">
      {generateChartLabels()}
      {generateChartBars()}
    </div>
  );
};

export default SalesChartContent;
