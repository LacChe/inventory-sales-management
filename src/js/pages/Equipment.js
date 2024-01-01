import React from 'react'
import { useStateContext } from '../utils/StateContext';
import Table from '../components/Table.js';

const Equipment = () => {
  const { equipmentData, equipmentDataFilePath, equipmentDataFields } = useStateContext();

  return (
    <Table fields={equipmentDataFields} data={equipmentData} filePath={equipmentDataFilePath} />
  )
}

export default Equipment