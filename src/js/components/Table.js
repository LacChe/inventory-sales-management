import React, { useState } from 'react'

const Table = ({ data }) => {
  
  const fields = Object.keys(data[0]);
  const [shownFields, setShownFields] = useState(fields.filter(filterItem => !filterItem.includes('_id')));

  function toggleShownField(item) {
    if(shownFields.includes(item)) {
      setShownFields(prev => prev.filter(filterItem => filterItem !== item));
    } else {
      setShownFields(prev => prev.concat(item));
    }
  }

  // todo open in modal window and send to main to save to files
  // order by clicking table header

  function editRow() {
    // todo
    console.log('edit roe');
  }

  function addRow() {
    // todo
    console.log('add roe');
  }

  return (
    <div>
      {/* toggles for displaying fields */}
      <div className='field-toggle-buttons'>
        <div><button className='add-button' onClick={addRow}>Add</button></div>
        <p>Show Field: </p>
        {fields.map(item => {
          return (
            <div key={item}>
              <button className={shownFields.includes(item) ? 'selected' : ''} onClick={() => toggleShownField(item)}>{item.replace('_', ' ')}</button>
            </div>
          )
        })}
      </div>

      {/* data table */}
      <div className='table'>
        {/* render columns of fields that are shown */}
        {data.length > 0 && fields.filter(filterItem => shownFields.includes(filterItem)).map(col => {
          return (
            <div key={col} className='column'>
              <div className='column-header'>{col}</div>
              {/* render each row for every field*/}
              {data.map(row => {
                return <div className='cell' key={row[fields[0]]+col}>{row[col]}</div>
              })}
            </div>
          )
        })}
        {/* edit button column */}
        <div className='edit-button-column'>
          <div className='column-header'>Edit</div>
          {data.map(row => {
            return <button onClick={editRow} className='edit-button' key={row[fields[0]]}>Edit</button>
          })}
        </div>
      </div>
    </div>
  )
}

export default Table