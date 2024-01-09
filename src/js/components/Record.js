import React, { Fragment, useState } from 'react';
import Popup from 'reactjs-popup';
import { useStateContext } from '../utils/StateContext';
import { generateUID } from '../utils/HelperFunctions.js';

const Record = ({ fields, item = {}, filePath, allItems }) => {

  const [productId, setProductId] = useState(item?.product_id ? item?.product_id : '');
  const [inventoryItems, setInventoryItems] = useState(item?.inventory_items ? item?.inventory_items : {});
  const { productData, inventoryData, transactionDataFilePath, productDataFilePath, saveFileToApi } = useStateContext();

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  // remove formula fields
  let displayItem = {...item};
  let fieldsNoFormula = fields.filter(field => {
    if(field.type === 'formula') {
      if(displayItem) delete displayItem[field.name];
      return;
    }
    return field;
  })

  function saveData(event) {
    // create new item
    let newItem = {};
    for(let i = 0; i < fieldsNoFormula.length; i++) {
      if(event.target[i].id === 'inventory_itemsinput') {
        newItem[fieldsNoFormula[i].name] = JSON.parse(event.target[i].value);
      } else if(event.target[i].id === 'not_a_saleinput') {
        newItem[fieldsNoFormula[i].name] = displayItem[fieldsNoFormula[i].name];
      } else {
        newItem[fieldsNoFormula[i].name] = event.target[i].value;
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
    // remove formula fields from saving
    newAllItems.forEach(record => {
      fields.forEach(field => {
        if(field.type === 'formula') delete record[field.name];
      })
    })
    saveFileToApi({ filePath, data: newAllItems });
    // event.preventDefault();
  }

  function dataTable() {
    return (
      <form className='popup-grid' onSubmit={saveData}>
        {fieldsNoFormula.map(key => 
          <Fragment key={key.name}>
            <label htmlFor={key.name+'input'} className='popup-grid-cell'>{key.name.replaceAll('_', ' ')}</label>
            {key.name!=='id' && key.type!=='boolean' && key.name!=='notes' && key.type!=='date' && key.type!=='dropdown' && <input id={key.name+'input'} className='popup-grid-cell' defaultValue={displayItem ? displayItem[key.name] : ''} />}
            {key.name==='id' && <input id={key.name+'input'} className='popup-grid-cell' defaultValue={displayItem.id ? displayItem.id : generateUID()} readOnly/>}
            {key.name==='notes' && <textarea id={key.name+'input'} className='popup-grid-cell' defaultValue={displayItem ? displayItem[key.name] : ''} />}
            {key.type==='date' && <input type='date' id={key.name+'input'} className='popup-grid-cell' defaultValue={displayItem ? displayItem[key.name] : ''} />}
            {key.type==='boolean' && <input type='checkbox' id={key.name+'input'} className='popup-grid-cell' defaultChecked={!(!displayItem || !displayItem.not_a_sale || displayItem.not_a_sale === 'false')} onChange={(e)=>{
              if(!displayItem.not_a_sale || displayItem.not_a_sale === 'false') displayItem.not_a_sale = 'true';
              else displayItem.not_a_sale = 'false';
            }}/>}
            {key.type==='dropdown' && filePath===transactionDataFilePath &&
              <Popup open={open} nested key={key.name+'input'} trigger={<input id={key.name+'input'} className='popup-grid-cell' value={displayItem ? productId : ''} readOnly/>}>
                <div>{productIdDropdown()}</div>
              </Popup>
            }
            {key.type==='dropdown' && filePath===productDataFilePath &&
              <Popup open={open} nested key={key.name+'input'} trigger={<input id={key.name+'input'} className='popup-grid-cell' value={displayItem ? JSON.stringify(inventoryItems) : ''} readOnly/>}>
                <div>{inventoryIdAmountDropdown()}</div>
              </Popup>
            }
          </Fragment>
        )}
        <button type='submit' className='clickable-button popup-save-button'>Save</button>
      </form>
    )
  }

  const productIdDropdown = function productIdDropdown() {
    let sortedData = productData.map(mapItem => { 
        let en = mapItem.name_en;
        let cn = mapItem.name_cn;
        let size = mapItem.size;
        // if product names or size empty, get from inventory item
        if(en === '') {
          const invData = inventoryData.filter(filterItem => filterItem.id === Object.keys(mapItem.inventory_items)[0])[0];
          if(invData) en = invData?.name_en;
        }
        if(cn === '') {
          const invData  = inventoryData.filter(filterItem => filterItem.id === Object.keys(mapItem.inventory_items)[0])[0];
          if(invData) cn = invData?.name_cn;
        }
        if(size === '') {
          const invData  = inventoryData.filter(filterItem => filterItem.id === Object.keys(mapItem.inventory_items)[0])[0];
          if(invData) size = invData?.size;
        }
        return {id: mapItem.id, name_en: en ? (en + ' ' + size) : '', name_cn: cn ? (cn + ' ' + size) : ''}
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
            <button className={data.id === productId ? 'selected' : ''} onClick={() => { setProductId(data.id); closeModal(); }}>{data.id}</button>
            <button className={data.id === productId ? 'selected' : ''} onClick={() => { setProductId(data.id); closeModal(); }}>{data.name_en}</button>
            <button className={data.id === productId ? 'selected' : ''} onClick={() => { setProductId(data.id); closeModal(); }}>{data.name_cn}</button>
          </Fragment>
        )}
      </div>
    )
  }

  const inventoryIdAmountDropdown = function inventoryIdAmountDropdown() {
    let sortedData = inventoryData.sort((a, b) => {
      // sort
      if(JSON.stringify(a.name_en)?.toString().toLowerCase() > JSON.stringify(b.name_en)?.toString().toLowerCase()){
        return 1;
      } else if(JSON.stringify(a.name_en)?.toLowerCase() < JSON.stringify(b.name_en)?.toString().toLowerCase()){
        return -1;
      } else {
        return 0;
      }
    });;

    let itemIds = inventoryItems ? Object.keys(inventoryItems) : [];
    return (
      <div className='dropdown grid-col-5'>
        {sortedData.map(data => 
          <Fragment key={data.id}>
            <button className={itemIds.includes(data.id) ? 'selected' : ''} onClick={() => { toggleInventoryIds(data.id) }}>{data.id}</button>
            <button className={itemIds.includes(data.id) ? 'selected' : ''} onClick={() => { toggleInventoryIds(data.id) }}>{data.name_en}</button>
            <button className={itemIds.includes(data.id) ? 'selected' : ''} onClick={() => { toggleInventoryIds(data.id) }}>{data.name_cn}</button>
            <button className={itemIds.includes(data.id) ? 'selected' : ''} onClick={() => { toggleInventoryIds(data.id) }}>{data.size}</button>
            <input type='number' className={itemIds.includes(data.id) ? 'selected' : ''} onChange={(e) => { toggleInventoryIds(data.id, e.target.value) }} readOnly={itemIds.includes(data.id) ? false : true} value={itemIds.includes(data.id) ? inventoryItems[data.id] : ''} />
          </Fragment>
        )}
      </div>
    )
  }

  const toggleInventoryIds = function toggleInventoryIds(id, amount) {
    setInventoryItems(prev => {
      let newPrev = {...prev};
      if(!amount) {
        // toggle id
        if(Object.keys(newPrev).includes(id)) delete newPrev[id] 
        else newPrev[id] = 0; 
      } else {
        // set amount
        if(Object.keys(newPrev).includes(id)) newPrev[id] = amount;
      }
      return newPrev;
    });
  }

  return (
    <div className='popup-comp'>
      {dataTable()}
    </div>
  )
}

export default Record