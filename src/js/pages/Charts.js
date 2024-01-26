import React, { useState } from "react";
import SalesChart from "../components/SalesChart/SalesChart.js";

const Charts = () => {
  const [selectedChart, setSelectedChart] = useState("sales");

  const charts = {
    sales: <SalesChart />,
  };

  return (
    <>
      <div className="chart-wrapper">
        {/* render selection buttons for all charts */}
        <div className="chart-selection">
          {Object.keys(charts).map((name) => {
            return (
              <button
                key={name}
                className={
                  "tab-button" + (selectedChart === name ? " selected" : "")
                }
                onClick={() => setSelectedChart(name)}
              >
                {name}
              </button>
            );
          })}
        </div>
        {charts[selectedChart]}
      </div>
    </>
  );
};

export default Charts;
