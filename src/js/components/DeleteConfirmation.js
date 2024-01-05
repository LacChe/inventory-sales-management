import React, { Fragment } from 'react';
import { useStateContext } from '../utils/StateContext';

const DeleteConfirmation = ({ fields, item, filePath, allItems }) => {

  const { saveFileToApi, productDataFilePath, inventoryData } = useStateContext();

  // fill in blank product fields
  if(filePath===productDataFilePath) {
    if(item.name_en === '') {
      const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(item.inventory_items)[0])[0];
      item.name_en = dataFromInventory.name_en;
    }
    if(item.name_cn === '') {
      const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(item.inventory_items)[0])[0];
      item.name_cn = dataFromInventory.name_cn;
    }
    if(item.size === '') {
      const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(item.inventory_items)[0])[0];
      item.size = dataFromInventory.size;
    }
  }

  function saveData() {
    // remove from allItems
    let newAllItems = allItems.filter(filterItem => filterItem.id !== item.id);

    // send to main for saving
    saveFileToApi({ filePath, data: newAllItems });
    // event.preventDefault();
  }

  function dataTable() {
    return (
      <form className='popup-grid' onSubmit={saveData}>
        {fields.map(key => 
          <Fragment key={key.name}>
            <label htmlFor={key.name+'input'} className='popup-grid-cell'>{key.name}</label>
            <input id={key.name+'input'} className='popup-grid-cell' defaultValue={JSON.stringify(item[key.name])} readOnly></input>
          </Fragment>
        )}
        <button type='submit' className='popup-delete-button'>Delete</button>
      </form>
    )
  }

  return (
    <div className='popup-comp'>
      <div>Confirm Deletion?</div>
      {dataTable()}
    </div>
  )
}

export default DeleteConfirmation