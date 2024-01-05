import React, { useState, Fragment, useEffect } from 'react';
import { useStateContext } from '../utils/StateContext';
import Popup from 'reactjs-popup';

const Charts = () => {

  const [selectedChart, setSelectedChart] = useState('sales');
  const { productData, inventoryData, transactionData, productDataFilePath, saveChartData, settings } = useStateContext();
  
  // START sales chart data
  const [records, setRecords] = useState(settings.chartData?.records ? JSON.parse(settings.chartData.records) : []);
  const [dateRange, setDateRange] = useState(settings.chartData?.dateRange ? JSON.parse(settings.chartData.dateRange) : ['','']);
  const [precision, setPrecision] = useState(settings.chartData?.precision ? JSON.parse(settings.chartData.precision) : 'day');
  const [transactions, setTransactions] = useState(settings.chartData?.transactions ? JSON.parse(settings.chartData.transactions) : []);
  const [parameter, setParameter] = useState(settings.chartData?.parameter ? JSON.parse(settings.chartData.parameter) : 'amount');
  const filePath = productDataFilePath;

  useEffect(() => {
    // get transactions containing product ids within date range, excluding not_a_sale
    setTransactions(() => {
      const filteredTransactions = transactionData.filter(filterItem => {
        if(records.map(r=>r.id).includes(filterItem.product_id) && !(filterItem.not_a_sale === 'true')
        ) {
          if(dateRange[0] !== '' && Date.parse(filterItem.date) < Date.parse(dateRange[0])) return;
          if(dateRange[1] !== '' && Date.parse(filterItem.date) > Date.parse(dateRange[1])) return;
          return filterItem;
        }
      })
      return filteredTransactions;
    });
  }, [records, dateRange]) 

  useEffect(() => {
    saveChartData({
      'records': JSON.stringify(records),
      'dateRange': JSON.stringify(dateRange),
      'precision': JSON.stringify(precision),
      'transactions': JSON.stringify(transactions),
      'parameter': JSON.stringify(parameter)
    });
  }, [records, dateRange, precision, transactions, parameter]) 

  const setRecordsState = function setRecordsState(record) {
    setRecords(prev => {
      if(prev.map(r=>r.id).includes(record.id)){
        return prev.filter(filterItem => filterItem.id !== record.id);
      } else {
        return [
          ...prev,
          record
        ]
      }
    });
  }
  // END sales chart data

  const setDateRangeState = function setDateRangeState(dates) {
    if(dates[0] && dates[1] && Date.parse(dates[0]) > Date.parse(dates[1])) return;
    setDateRange(dates);
  }

  const productIdDropdown = function productIdDropdown() {
    let sortedData = productData.map(mapItem => { 
        let en = mapItem.name_en;
        let cn = mapItem.name_cn;
        let size = mapItem.size;
        // if product names or size empty, get from inventory item
        if(en === '') {
          const invData = inventoryData.filter(filterItem => filterItem.id === Object.keys(mapItem.inventory_items)[0])[0];
          if(invData) en = invData.name_en;
        }
        if(cn === '') {
          const invData  = inventoryData.filter(filterItem => filterItem.id === Object.keys(mapItem.inventory_items)[0])[0];
          if(invData) cn = invData.name_cn;
        }
        if(size === '') {
          const invData  = inventoryData.filter(filterItem => filterItem.id === Object.keys(mapItem.inventory_items)[0])[0];
          if(invData) size = invData.size;
        }
        return {id: mapItem.id, name_en: en ? (en + ' ' + size) : '', name_cn: cn ? (cn + ' ' + size) : '', price: mapItem.price}
      }).sort((a, b) => {
        // if empty, get data from inventory
        if(filePath===productDataFilePath && a.name_en === '') {
            const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(a.inventory_items)[0])[0];
            if(dataFromInventory) a = dataFromInventory;
        }
        if(filePath===productDataFilePath && b.name_en === '') {
            const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(b.inventory_items)[0])[0];
            if(dataFromInventory) b = dataFromInventory;
        }
        // sort
        if(JSON.stringify(a.name_en)?.toString().toLowerCase() > JSON.stringify(b.name_en)?.toString().toLowerCase()){
          return 1;
        } else if(JSON.stringify(a.name_en)?.toLowerCase() < JSON.stringify(b.name_en)?.toString().toLowerCase()){
          return -1;
        } else {
          return 0;
        }
      });
    return (
      <div className='dropdown grid-col-3'>
        {sortedData.map(data => 
          <Fragment key={data.id}>
            <button className={records.map(r=>r.id).includes(data.id)? 'selected' : ''} onClick={() => { setRecordsState(data) }}>{data.id}</button>
            <button className={records.map(r=>r.id).includes(data.id) ? 'selected' : ''} onClick={() => { setRecordsState(data) }}>{data.name_en}</button>
            <button className={records.map(r=>r.id).includes(data.id)? 'selected' : ''} onClick={() => { setRecordsState(data) }}>{data.name_cn}</button>
          </Fragment>
        )}
      </div>
    )
  }

  function djb2(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  function generateRandomHexColor(seed) {
      const hash = djb2(seed);
      const hexColor = '#' + (hash & 0xFFFFFF).toString(16).padStart(6, '0');
      return hexColor;
  }
  
  function getContrastingHexColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Decide on contrasting color
    const contrastingColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

    return contrastingColor;
}

  const renderChart = function renderChart() {
    let max = -1, min = -1;

    // group by precision
    let groupedTransactions = transactions.reduce((grouped, transaction)=>{
      let date = transaction.date;
      if(precision === 'month') date = date.slice(0, -3);
      if(precision === 'year') date = date.slice(0, -6);
      (grouped[date] = grouped[date] || []).push(transaction);
      return grouped;
    },{});

    // group by products
    Object.keys(groupedTransactions).forEach(dateGroup => {
      groupedTransactions[dateGroup] = groupedTransactions[dateGroup].reduce((grouped, transaction)=>{
        if(!grouped[transaction.product_id]) {
          grouped[transaction.product_id] = {name_en: transaction.name_en, amount: parseInt(transaction.amount), revenue: parseInt(transaction.revenue)}
        }
        else {
          grouped[transaction.product_id] = {name_en: grouped[transaction.product_id].name_en, amount: grouped[transaction.product_id].amount + parseInt(transaction.amount), revenue: grouped[transaction.product_id].revenue + parseInt(transaction.revenue)}
        }
        return grouped;
      },{});
    });

    // find min max
    Object.keys(groupedTransactions).forEach(dateGroup => {
      Object.keys(groupedTransactions[dateGroup]).forEach(prodId => {
        if(max === -1) max = groupedTransactions[dateGroup][prodId][parameter];
        if(max < groupedTransactions[dateGroup][prodId][parameter]) max = groupedTransactions[dateGroup][prodId][parameter];
        if(min === -1) min = groupedTransactions[dateGroup][prodId][parameter];
        if(min > groupedTransactions[dateGroup][prodId][parameter]) min = groupedTransactions[dateGroup][prodId][parameter];
      });
    });

    return (
      <div className='chart'>
        <div className='chart-section'>
          {Object.keys(groupedTransactions).map(precision => {
            return (
              <div className='chart-group' key={precision}>
                <div style={{height: '1rem'}}>{precision}</div>
                {Object.keys(groupedTransactions[precision]).map(prodId => <div key={prodId}>{groupedTransactions[precision][prodId].name_en}</div>)}
              </div>
            )
          })}
        </div>
        <div className='chart-section'>
          {Object.keys(groupedTransactions).map(precision => {
            return (
              <div className='chart-bars' key={precision}>
                <div style={{height: '1rem'}}></div>
                {Object.keys(groupedTransactions[precision]).map(prodId => 
                  <div
                    key={prodId}
                    className='chart-bar'
                    style={{width: `${(groupedTransactions[precision][prodId][parameter] / max) * 600 + 20}px`, backgroundColor: generateRandomHexColor(prodId), color: getContrastingHexColor(generateRandomHexColor(prodId))}}
                    //style={{width: `${(groupedTransactions[precision][prodId][parameter] / max - min / max) * 600 + 20}px`, backgroundColor: generateRandomHexColor(prodId)}}
                  >
                    {groupedTransactions[precision][prodId][parameter]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className='chart-wrapper'>
      <div className='chart-selection'>
        <button className={selectedChart === 'sales' ? 'selected' : ''} onClick={() => setSelectedChart('sales')}>Sales</button>
      </div>
      <div className='chart-parameters'>
        <div>
          <Popup position='bottom left' trigger={<button>Choose Records</button>}>
            <div>{productIdDropdown()}</div>
          </Popup>
        </div>
        <div className='chart-label'>Range:</div>
        <div>
          <input type='date' value={dateRange[0]} onChange={e => {setDateRangeState([e.target.value, dateRange[1]])}} />
          -
          <input type='date' value={dateRange[1]} onChange={e => {setDateRangeState([dateRange[0], e.target.value])}} />
        </div>
        <div className='chart-label'>Precision:</div>
        <div>
          <button className={precision === 'day' ? 'selected' : ''} onClick={() => setPrecision('day')}>Day</button>
          <button className={precision === 'month' ? 'selected' : ''} onClick={() => setPrecision('month')}>Month</button>
          <button className={precision === 'year' ? 'selected' : ''} onClick={() => setPrecision('year')}>Year</button>
        </div>
        <div className='chart-label'>Field:</div>
        <div>
          <button className={parameter === 'amount' ? 'selected' : ''} onClick={() => setParameter('amount')}>Amount</button>
          <button className={parameter === 'revenue' ? 'selected' : ''} onClick={() => setParameter('revenue')}>Revenue</button>
        </div>
      </div>
      {renderChart()}
    </div>
  )
}

export default Charts