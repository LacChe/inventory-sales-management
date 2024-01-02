import React, { Fragment } from 'react';

const DeleteConfirmation = ({ fields, item, filePath, allItems }) => {

  function generateUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  function saveData(event) {
    // remove from allItems
    let newAllItems = allItems.filter(filterItem => filterItem.id !== item.id);

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
            <input id={key+'input'} className='popup-grid-cell' defaultValue={item ? item[key] : generateUID()} readOnly></input>
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