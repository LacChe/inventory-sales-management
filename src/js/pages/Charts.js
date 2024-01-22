import React, { useState } from "react";
import SalesChart from "../components/SalesChart.js";

const Charts = () => {
  const chartNames = ["sales"]; // keep this info in its own file if more than a few charts
  const [selectedChart, setSelectedChart] = useState("sales");

  function getChartSelectedCSSClass(chartName) {
    return "tab-button" + (selectedChart === chartName ? " selected" : "");
  }

  function generateSelectedChart() {
    return <>{selectedChart === "sales" && <SalesChart />}</>;
  }

  return (
    <>
      <div className="chart-wrapper">
        {/* render selection buttons for all charts */}
        <div className="chart-selection">
          {chartNames.map((name) => {
            return (
              <button
                key={name}
                className={getChartSelectedCSSClass(name)}
                onClick={() => setSelectedChart(name)}
              >
                {name}
              </button>
            );
          })}
        </div>
        {generateSelectedChart()}
      </div>
    </>
  );
};

export default Charts;
