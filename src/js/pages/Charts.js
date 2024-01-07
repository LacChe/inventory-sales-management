import React, { useState } from 'react';
import SalesChart from '../components/SalesChart.js';

const Charts = () => {

  const [selectedChart, setSelectedChart] = useState('sales');

  return (
    <>
      <div className='chart-wrapper'>
        <div className='chart-selection'>
          <button className={selectedChart === 'sales' ? 'selected' : ''} onClick={() => setSelectedChart('sales')}>Sales</button>
        </div>
        {selectedChart === 'sales' && <SalesChart />}
      </div>
    </>
  )
}

export default Charts