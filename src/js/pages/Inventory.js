import React from 'react'
import { useStateContext } from '../utils/StateContext';
import Table from '../components/Table.js';

const Inventory = () => {
  const { inventoryData, inventoryDataFilePath, inventoryDataFields } = useStateContext();
  
  return (
    <Table fields={inventoryDataFields} data={inventoryData} filePath={inventoryDataFilePath} />
  )
}

export default Inventory