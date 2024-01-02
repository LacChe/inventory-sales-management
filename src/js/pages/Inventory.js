import React from 'react'
import { useStateContext } from '../utils/StateContext';
import Table from '../components/Table.js';

const Inventory = () => {
  const { inventoryData, inventoryDataFilePath, inventoryDataFields, showInventoryDataFields } = useStateContext();
  
  return (
    <Table fields={inventoryDataFields} data={inventoryData} filePath={inventoryDataFilePath} showFields={showInventoryDataFields} />
  )
}

export default Inventory