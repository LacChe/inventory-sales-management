import React, { Fragment } from 'react';

const DeleteConfirmation = ({ fields, item, filePath, allItems }) => {

  const { saveFileToApi } = useStateContext();

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