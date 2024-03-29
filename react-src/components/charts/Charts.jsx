import React from "react";
import { useStateContext } from "../../utils/StateContext";
import SalesChartParameterBar from "./SalesChart/SalesChartParameterBar";
import SalesChartContent from "./SalesChart/SalesChartContent";

const Chart = () => {
  const { setCurrentChart, userSettings } = useStateContext();
  const charts = ["sales"];

  function chartSelectionBar() {
    return (
      <div className="charts-selection-bar">
        {charts.map((chart) => (
          <button
            className={
              userSettings.chartSettings.currentChart === chart
                ? "selected"
                : ""
            }
            key={chart}
            onClick={() => setCurrentChart(chart)}
          >
            {chart}
          </button>
        ))}
      </div>
    );
  }

  function getChart() {
    switch (userSettings.chartSettings.currentChart) {
      case "sales":
        const chartSettings = userSettings.chartSettings.sales;
        return (
          <div className="chart-wrapper">
            <SalesChartParameterBar chartSettings={chartSettings} />
            <SalesChartContent chartSettings={chartSettings} />
          </div>
        );
      default:
        console.error(
          "chart doesn't exist: ",
          userSettings.chartSettings.currentChart
        );
        return <div className="chart-wrapper">No Chart</div>;
    }
  }

  return (
    <>
      {chartSelectionBar()}
      {getChart()}
    </>
  );
};

export default Chart;
