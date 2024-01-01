import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import Record from './Record.js';
import DeleteConfirmation from './DeleteConfirmation.js';

const Table = ({ fields, data, filePath }) => {
  
  const [shownFields, setShownFields] = useState([]);
  useEffect(() => {
    if(fields.length > 0) setShownFields(fields.filter(filterItem => filterItem !== 'id'));
  }, [fields])
  

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
            <Record fields={fields} filePath={filePath} allItems={data} />
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
        {fields.filter(filterItem => shownFields.includes(filterItem)).map(col => {
          return (
            <div key={col} className='column'>
              <div className='column-header'>{col}</div>
              {/* render each row for every field*/}
              {data.map(row => {
                return <div className={'cell' + (col==='notes' ? ' notes' : '')} key={row[fields[0]]+col}>{row[col]}</div>
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
              <Record fields={fields} item={row} filePath={filePath} allItems={data}/>
            </Popup>
          )})}
        </div>
        {/* delete button column */}
        <div className='delete-button-column'>
          <div className='column-header'>Delete</div>
          {data.map(row => {
            return (
            <Popup key={row.id} modal trigger={<button className='delete-button'>Delete</button>}>
              <DeleteConfirmation fields={fields} item={row} filePath={filePath} allItems={data}/>
            </Popup>
          )})}
        </div>
      </div>
      {data.length <=0 && <div>No Records</div>}
    </div>
  )
}

export default Table