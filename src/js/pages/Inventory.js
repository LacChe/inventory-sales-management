import React from 'react'
import { useStateContext } from '../utils/StateContext';

const Inventory = () => {
  const { 
    inventoryData
  } = useStateContext();
  return (
    <>
      <div>Inventory {inventoryData[0].name["en"]}</div>
    </>
  )
}

export default Inventory