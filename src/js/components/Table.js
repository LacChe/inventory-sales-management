import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import PopupComp from './PopupComp.js';

const Table = ({ data, filePath }) => {
  
  const fields = Object.keys(data[0]);
  const [shownFields, setShownFields] = useState(fields.filter(filterItem => filterItem !== 'id'));

  function toggleShownField(item) {
    if(shownFields.includes(item)) {
      setShownFields(prev => prev.filter(filterItem => filterItem !== item));
    } else {
      setShownFields(prev => prev.concat(item));
    }
  }

  return (
    <div>
      {/* toggles for displaying fields */}
      <div className='field-toggle-buttons'>
        <div>
          <Popup modal trigger={<button className='add-button'>Add</button>}>
            <PopupComp fields={fields} filePath={filePath} allItems={data} />
          </Popup>
        </div>
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
            return (
            <Popup key={row.id} modal trigger={<button className='edit-button'>Edit</button>}>
              <PopupComp fields={fields} item={row} filePath={filePath} allItems={data}/>
            </Popup>
          )})}
        </div>
      </div>
    </div>
  )
}

export default Table