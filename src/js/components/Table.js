import React from 'react';
import Popup from 'reactjs-popup';
import Record from './Record.js';
import DeleteConfirmation from './DeleteConfirmation.js';
import { useStateContext } from '../utils/StateContext';

const Table = ({ fields, data, filePath, showFields, fieldOrder }) => {
  
  const { toggleShownField, toggleOrder, productDataFilePath, inventoryDataFilePath, transactionDataFilePath, inventoryData, productData, transactionData } = useStateContext();

  let sortedData = data;

  // add fields
  switch (filePath) {
    case inventoryDataFilePath:
      // add amount
      sortedData = sortedData.map(mapItem => {
        let amount = 0
        // get products that use this inventory item
        const prodArr = productData.filter(filterItem => {
          if(filterItem.inventory_items[mapItem.id] !== undefined) return filterItem;
        });
        // get transactions that use this product
        const transArr = transactionData.filter(filterItem => {
          if(prodArr.map(mapItem => mapItem.id).includes(filterItem.product_id)) return filterItem;
        });
        // sum total inventory items
        prodArr.forEach(product => {
          for(let i = 0; i < product.inventory_items[mapItem.id]; i++) {
            transArr.forEach(transaction => amount += parseInt(transaction.amount))
          }
        });
        // add to sortedItems
        return {
          ...mapItem,
          amount: amount*=-1
        }
      });
      break;
    case productDataFilePath:
      break;
    case transactionDataFilePath:
      // add name en name cn with size
      sortedData = sortedData.map(mapItem => {
        const names = productData.filter(filterItem => {
          // find product
          if(filterItem.id === mapItem.product_id) return filterItem;
        }).map(mapItem => { 
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
          return {name_en: en, name_cn: cn, size}
        })[0];
        return {
          ...mapItem,
          name_en: names?.name_en + ' ' + names?.size,
          name_cn: names?.name_cn + ' ' + names?.size
        }
      });
      break;
    default:
      break;
  }

  sortedData.sort((a, b) => {

    // if empty, get data from inventory
    if(filePath===productDataFilePath && a[fieldOrder.field] === '' && 
    (fieldOrder.field === 'name_en' || fieldOrder.field === 'name_cn' || fieldOrder.field === 'size')) {
        const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(a.inventory_items)[0])[0];
        if(dataFromInventory) a = dataFromInventory;
    }
    if(filePath===productDataFilePath && b[fieldOrder.field] === '' && 
    (fieldOrder.field === 'name_en' || fieldOrder.field === 'name_cn' || fieldOrder.field === 'size')) {
        const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(b.inventory_items)[0])[0];
        if(dataFromInventory) b = dataFromInventory;
    }

    // sort by number string accordingly
    if(fieldOrder.field === 'amount' || fieldOrder.field === 'revenue' || fieldOrder.field === 'price') {
      return ((parseInt(a[fieldOrder.field]) || 0) - (parseInt(b[fieldOrder.field]) || 0)) * (fieldOrder.asc ? 1 : -1);
    } else if(JSON.stringify(a[fieldOrder.field])?.toString().toLowerCase() > JSON.stringify(b[fieldOrder.field])?.toString().toLowerCase()){
      return 1 * (fieldOrder.asc ? 1 : -1);
    } else if(JSON.stringify(a[fieldOrder.field])?.toLowerCase() < JSON.stringify(b[fieldOrder.field])?.toString().toLowerCase()){
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
          <Popup modal nested trigger={<button className='add-button'>Add</button>}>
            <Record fields={fields} filePath={filePath} allItems={sortedData} />
          </Popup>
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
              <div className='column-header' onClick={() => toggleOrder(filePath, col.name)}>{col.name.replaceAll('_', ' ')}</div>
              {/* render each row for every field */}
              {sortedData.map(row => {
                let innerHtml = row[col.name];
                if(col.type === 'dropdown') innerHtml = JSON.stringify(innerHtml);
                // if empty, get data from inventory
                if(filePath===productDataFilePath && row[col.name] === '' && 
                (col.name === 'name_en' || col.name === 'name_cn' || col.name === 'size')) {
                    const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(row.inventory_items)[0])[0];
                    if(dataFromInventory) innerHtml = dataFromInventory[col.name];
                }
                return <div className={'cell' + (col.name==='notes' ? ' notes' : '')} key={row[fields[0].name]+col.name}>{innerHtml}</div>
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
              <Popup key={row.id} modal nested trigger={<button className='edit-button'>Edit</button>}>
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