import React, { Fragment, useState } from 'react';
import Popup from 'reactjs-popup';
import { useStateContext } from '../utils/StateContext';

const Record = ({ fields, item, filePath, allItems }) => {

  const [productId, setProductId] = useState(item?.product_id);
  const { productData, inventoryData } = useStateContext();

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  // remove formula fields
  fields = fields.filter(field => {
    if(field.type === 'formula') {
      if(item) delete item[field.name];
      return;
    }
    return field;
  })

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
        newItem[fields[i].name] = JSON.parse(event.target[i].value);
      } else {
        newItem[fields[i].name] = event.target[i].value;
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
          <Fragment key={key.name}>
            <label htmlFor={key.name+'input'} className='popup-grid-cell'>{key.name}</label>
            {key.name!=='id' && key.type!=='object' && key.name!=='notes' && key.type!=='date' && key.type!=='dropdown' && <input id={key.name+'input'} className='popup-grid-cell' defaultValue={item ? item[key.name] : ''} />}
            {key.name==='id' && <input id={key.name+'input'} className='popup-grid-cell' defaultValue={item ? item[key.name] : generateUID()} readOnly/>}
            {key.name==='notes' && <textarea id={key.name+'input'} className='popup-grid-cell' defaultValue={item ? item[key.name] : ''} />}
            {key.type==='date' && <input type='date' id={key.name+'input'} className='popup-grid-cell' defaultValue={item ? item[key.name] : ''} />}
            {key.type==='object' && <input id={key.name+'input'} className='popup-grid-cell' defaultValue={item ? JSON.stringify(item[key.name]) : ''} />}
            {key.type==='dropdown' && 
              <Popup open={open} nested key={key.name+'input'} trigger={<input id={key.name+'input'} className='popup-grid-cell' value={item ? productId : ''} readOnly/>}>
                <div>{productIdDropdown()}</div>
              </Popup>
                
            }
          </Fragment>
        )}
        <button type='submit' className='popup-save-button'>Save</button>
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
        return {id: mapItem.id, name_en: en ? (en + ' ' + size) : '', name_cn: cn ? (cn + ' ' + size) : ''}
      });
    return (
      <div className='dropdown'>
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

  return (
    <div className='popup-comp'>
      {dataTable()}
    </div>
  )
}

export default Record