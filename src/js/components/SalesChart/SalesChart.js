import React, { useState, useEffect } from "react";
import { useStateContext } from "../../utils/StateContext.js";
import FunctionBar from "./FunctionBar.js";
import Chart from "./Chart.js";

const SalesChart = () => {
  const { transactionData, saveChartData, settings } = useStateContext();

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

  return (
    <>
      <FunctionBar
        records={records}
        setRecords={setRecords}
        dateRange={dateRange}
        setDateRange={setDateRange}
        precision={precision}
        setPrecision={setPrecision}
        parameter={parameter}
        setParameter={setParameter}
      />
      <Chart
        transactions={transactions}
        precision={precision}
        parameter={parameter}
      />
    </>
  );
};

export default SalesChart;
