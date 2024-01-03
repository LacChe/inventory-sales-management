import React, { Fragment } from 'react';
import { useStateContext } from '../utils/StateContext';

const Record = ({ fields, item, filePath, allItems }) => {

  const { inventoryDataFilePath, transactionDataFilePath, productDataFilePath } = useStateContext();

  // remove calculated fields
  if(filePath === inventoryDataFilePath) {
    if(item) {
      delete item.amount;
    }
    fields = fields.filter(filterItem => {
      if(filterItem !== 'amount') return filterItem;
    });
  }
  if(filePath === transactionDataFilePath) {
    if(item) {
      delete item.name_en;
      delete item.name_cn;
    }
    fields = fields.filter(filterItem => {
      if(filterItem !== 'name_en' && filterItem !== 'name_cn') return filterItem;
    });
  }
  if(filePath === productDataFilePath) {
    if(item) {
      delete item.size;
    }
    fields = fields.filter(filterItem => {
      if(filterItem !== 'size') return filterItem;
    });
  }

  function generateUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  function saveData(event) {
    // create new item
    let newItem = {};
    for(let i = 0; i < fields.length; i++) {
      if(event.target[i].id === 'inventory_itemsinput') {
        newItem[fields[i]] = JSON.parse(event.target[i].value);
      } else {
        newItem[fields[i]] = event.target[i].value;
      }
    }
    // add or change in allItems
    let newAllItems = allItems;
    if(newAllItems.filter(filterItem => filterItem.id === newItem.id).length === 0){
      newAllItems = newAllItems.concat(newItem);
    } else {
      newAllItems = newAllItems.map(mapItem => {
        if(mapItem.id === newItem.id) return newItem;
        else return mapItem;
      })
    }

    // send to main for saving
    window.api.send("saveFile", { filePath, data: newAllItems });
    // event.preventDefault();
  }

  function dataTable() {
    return (
      <form className='popup-grid' onSubmit={saveData}>
        {fields.map(key => 
          <Fragment key={key}>
            <label htmlFor={key+'input'} className='popup-grid-cell'>{key}</label>
            {key==='id' && <input id={key+'input'} className='popup-grid-cell' defaultValue={item ? item[key] : generateUID()} readOnly/>}
            {key==='notes' && <textarea id={key+'input'} className='popup-grid-cell' defaultValue={item ? item[key] : ''} />}
            {key==='date' && <input type='date' id={key+'input'} className='popup-grid-cell' defaultValue={item ? item[key] : ''} />}
            {key==='inventory_items' && <input id={key+'input'} className='popup-grid-cell' defaultValue={item ? JSON.stringify(item[key]) : ''} />}
            {key!=='id' && key!=='inventory_items' && key!=='notes' && key!=='date' && <input id={key+'input'} className='popup-grid-cell' defaultValue={item ? item[key] : ''} />}
          </Fragment>
        )}
        <button type='submit' className='popup-save-button'>Save</button>
      </form>
    )
  }

  return (
    <div className='popup-comp'>
      {dataTable()}
    </div>
  )
}

export default Record