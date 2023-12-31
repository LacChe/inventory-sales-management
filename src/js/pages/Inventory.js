import React from 'react'
import { useStateContext } from '../utils/StateContext';
import Table from '../components/Table.js';

const Inventory = () => {
  const { inventoryData } = useStateContext();
  
  return (
    <>
      {inventoryData.length > 0 && <Table data={inventoryData} />}
    </>
  )
}

export default Inventory