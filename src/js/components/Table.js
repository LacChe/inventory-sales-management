import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import Record from './Record.js';
import DeleteConfirmation from './DeleteConfirmation.js';
import { useStateContext } from '../utils/StateContext';
import { fillProdValFromInv } from '../utils/HelperFunctions.js';
import { AiFillEdit, AiFillDelete, AiFillCaretUp, AiFillCaretDown  } from "react-icons/ai";

const Table = ({ fields, data, filePath, showFields, fieldOrder }) => {
  
  const { toggleShownField, toggleOrder, productDataFilePath, inventoryData, saveSearchTerm, saveFilterTerm, settings } = useStateContext();

  let sortedData = data;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    if(settings.search) setSearchTerm(settings.search);
    if(settings.filter) setFilterTerm(settings.filter);
  }, [settings])
  

  const [hoverId, setHoverId] = useState('');

  sortedData.sort((a, b) => {

    // if empty, get data from inventory
    let filledA = fillProdValFromInv(a, fields, inventoryData);
    let filledB = fillProdValFromInv(b, fields, inventoryData);

    // sort by number string accordingly
    if(fieldOrder.field === 'amount' || fieldOrder.field === 'revenue' || fieldOrder.field === 'price') {
      return ((parseInt(a[fieldOrder.field]) || 0) - (parseInt(b[fieldOrder.field]) || 0)) * (fieldOrder.asc ? 1 : -1);
    } else if(JSON.stringify(filledA[fieldOrder.field])?.toString().toLowerCase() > JSON.stringify(filledB[fieldOrder.field])?.toString().toLowerCase()){
      return 1 * (fieldOrder.asc ? 1 : -1);
    } else if(JSON.stringify(filledA[fieldOrder.field])?.toLowerCase() < JSON.stringify(filledB[fieldOrder.field])?.toString().toLowerCase()){
      return -1 * (fieldOrder.asc ? 1 : -1);
    } else {
      return 0;
    }
  });

  // filter by filterTerm
  sortedData = sortedData.filter(filterItem => {
    let found = false;
    showFields.forEach(field => {
      let testData = filterItem[field];
      if(filePath===productDataFilePath) testData = fillProdValFromInv(filterItem, fields, inventoryData)[field];
      // if using filter formula
      if(filterTerm[0] === ',') {
        let filtersObj = filterTerm.split(',').slice(1).reduce((filters, val) => {
          console.log(1, val)
          if(!filters || ((val[0] === '-' || val[0] === '+') && val.slice(1) === '')) return filters;
          if(val[0] === '-') {
            filters.exclude.push(val.slice(1));
          } else {
            filters.include.push(val[0] === '+' ? val.slice(1) : val);
          }
          return filters;
        },{include: [], exclude: []});
        console.log(filtersObj)
        filtersObj?.include.forEach(val => {
          if(JSON.stringify(testData)?.toLowerCase().includes(val?.toLowerCase())) {
            found = true;
            return;
          }
        });
        filtersObj?.exclude.forEach(val => {
          if(JSON.stringify(testData)?.toLowerCase().includes(val?.toLowerCase())) {
            found = false;
            return;
          }
        });
      } else {
        if(JSON.stringify(testData)?.toLowerCase().includes(filterTerm?.toLowerCase())) {
          found = true;
          return;
        }
      }
    });
    if(found) return filterItem; 
  });

  const exportSpreadSheet = function exportSpreadSheet() {
    let exportData = '';

    // add column headers
    fields.forEach(field => {if(showFields.includes(field.name)) exportData += (field.name?.replaceAll(',', '-').replaceAll('_', ' ') + ',')});
    exportData = exportData.slice(0, -1) + '\n';

    // add records
    sortedData.forEach(record => {
      let saveRecord = {...record};
      if(filePath === productDataFilePath) saveRecord = fillProdValFromInv(saveRecord, fields, inventoryData);
      fields.forEach(field => {
        if(showFields.includes(field.name)) {
          exportData += (JSON.stringify(saveRecord[field.name])?.replaceAll(',', '-') + ',')
        }
      });
      exportData = exportData.slice(0, -1) + '\n';
    })

    const url = window.URL.createObjectURL(new Blob([exportData])) ;
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${filePath.slice(0, -5)}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className='table-wrapper'>
      {/* toggles for displaying fields */}
      <div className='field-toggle-buttons'>
        <div>
          <div className='add-button-wrapper'>
            <Popup modal nested trigger={<button className='add-button clickable-button'>Add Record</button>}>
              <Record fields={fields} filePath={filePath} allItems={data} />
            </Popup>
          </div>
          <div className='export-button-wrapper'>
            <button className='export-button clickable-button' onClick={() => exportSpreadSheet()}>Export Spreadsheet</button>
          </div>
          <div className='filter-bar-wrapper'>
            <input className='filter-bar' placeholder='Filter...' onBlur={(e) => saveFilterTerm(e.target.value)} onChange={(e) => setFilterTerm(e.target.value)} defaultValue={filterTerm}/>
          </div>
          <div className='search-bar-wrapper'>
            <input className='search-bar' placeholder='Search...' onBlur={(e) => saveSearchTerm(e.target.value)} onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}/>
          </div>
        </div>
        <div>
          <p>Show Columns: </p>
          {fields.map(item => {
            return (
              <div key={item.name}>
                <button className={showFields.includes(item.name) ? 'selected' : ''} onClick={() => toggleShownField(filePath, item.name)}>{item.name.replaceAll('_', ' ')}</button>
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
        {fields.filter(filterItem => showFields.includes(filterItem.name)).map(col => {
          return (
            <div key={col.name} className='column'>
              {/* render header */}
              <div className='column-header' onClick={() => toggleOrder(filePath, col.name)}>
                <div className='header-sort-caret'>{fieldOrder.field === col.name && (fieldOrder.asc ? <AiFillCaretUp /> : <AiFillCaretDown />) }</div>
                <div>{col.name.replaceAll('_', ' ')}</div>
              </div>
              {/* render each row for every field */}
              {sortedData.map(row => {
                let displayRow = {...row};
                // if prod, fill in blanks from inventory
                if(filePath===productDataFilePath) displayRow = fillProdValFromInv(displayRow, fields, inventoryData);
                let innerHtml = displayRow[col.name];
                if(col.type === 'dropdown') innerHtml = JSON.stringify(innerHtml);
                if(col.type === 'boolean') innerHtml = (innerHtml === 'true' ? '#' : '');
                return <div onMouseOver={()=>setHoverId(displayRow.id)} style={{textDecoration: `${(searchTerm !== '' && JSON.stringify(innerHtml)?.toLowerCase().includes(searchTerm?.toLowerCase())) ? `underline 2px ${getComputedStyle(document.body)
                  .getPropertyValue('--color-highlight')}` : `underline 2px #00000000`}`}} className={'cell' + (col.name==='notes' ? ' notes' : '') + (hoverId===displayRow.id ? ' hover' : '')} key={displayRow[fields[0].name]+col.name}>{innerHtml}</div>
              })}
            </div>
          )
        })}
        {/* edit button column */}
        {showFields.includes('edit') &&
          <div className='edit-button-column'>
            <div className='column-header'><AiFillEdit /></div>
            {sortedData.map(row => {
              return (
              <Popup key={row.id} modal nested trigger={<button className='clickable-button edit-button'><AiFillEdit /></button>}>
                <Record fields={fields} item={row} filePath={filePath} allItems={data}/>
              </Popup>
            )})}
          </div>
        }
        {/* delete button column */}
        {showFields.includes('delete') &&
          <div className='delete-button-column'>
            <div className='column-header'><AiFillDelete /></div>
            {sortedData.map(row => {
              return (
              <Popup key={row.id} modal trigger={<button className='clickable-button delete-button'><AiFillDelete /></button>}>
                <DeleteConfirmation fields={fields} item={row} filePath={filePath} allItems={data}/>
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