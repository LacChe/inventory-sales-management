import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import Record from './Record.js';
import DeleteConfirmation from './DeleteConfirmation.js';
import { useStateContext } from '../utils/StateContext';

const Table = ({ fields, data, filePath, showFields, fieldOrder }) => {
  
  const { toggleShownField, toggleOrder } = useStateContext();
  //const [sortedData, setSortedData] = useState({});

  let sortedData = data;
  sortedData.sort((a, b) => {
    if(a[fieldOrder.field] > b[fieldOrder.field]){
      return 1 * (fieldOrder.asc ? 1 : -1);
    } else if(a[fieldOrder.field] < b[fieldOrder.field]){
      return -1 * (fieldOrder.asc ? 1 : -1);
    } else {
      return 0;
    }
  });

  return (
    <div className='table-wrapper'>
      {/* toggles for displaying fields */}
      <div className='field-toggle-buttons'>
        <div className='add-button-wrapper'>
          <Popup modal trigger={<button className='add-button'>Add</button>}>
            <Record fields={fields} filePath={filePath} allItems={sortedData} />
          </Popup>
        </div>
        <div>
        <p>Show Field: </p>
          {fields.map(item => {
            return (
              <div key={item}>
                <button className={showFields.includes(item) ? 'selected' : ''} onClick={() => toggleShownField(filePath, item)}>{item.replace('_', ' ')}</button>
              </div>
            )
          })}
          <div>
            <button className={showFields.includes('edit') ? 'selected' : ''} onClick={() => toggleShownField(filePath, 'edit')}>Edit</button>
          </div>
          <div>
            <button className={showFields.includes('delete') ? 'selected' : ''} onClick={() => toggleShownField(filePath, 'delete')}>Delete</button>
          </div>
        </div>
      </div>

      {/* data table */}
      <div className='table'>
        {/* render columns of fields that are shown */}
        {fields.filter(filterItem => showFields.includes(filterItem)).map(col => {
          return (
            <div key={col} className='column'>
              <div className='column-header' onClick={() => toggleOrder(filePath, col)}>{col.replace('_', ' ')}</div>
              {/* render each row for every field*/}
              {sortedData.map(row => {
                return <div className={'cell' + (col==='notes' ? ' notes' : '')} key={row[fields[0]]+col}>{row[col]}</div>
              })}
            </div>
          )
        })}
        {/* edit button column */}
        {showFields.includes('edit') &&
          <div className='edit-button-column'>
            <div className='column-header'>Edit</div>
            {sortedData.map(row => {
              return (
              <Popup key={row.id} modal trigger={<button className='edit-button'>Edit</button>}>
                <Record fields={fields} item={row} filePath={filePath} allItems={sortedData}/>
              </Popup>
            )})}
          </div>
        }
        {/* delete button column */}
        {showFields.includes('delete') &&
          <div className='delete-button-column'>
            <div className='column-header'>Delete</div>
            {sortedData.map(row => {
              return (
              <Popup key={row.id} modal trigger={<button className='delete-button'>Delete</button>}>
                <DeleteConfirmation fields={fields} item={row} filePath={filePath} allItems={sortedData}/>
              </Popup>
            )})}
          </div>
        }
      </div>
      {sortedData.length <=0 && <div>No Records</div>}
    </div>
  )
}

export default Table