import React from 'react'
import { useStateContext } from '../utils/StateContext';
import Table from '../components/Table.js';

const Equipment = () => {
  const { equipmentData, equipmentDataFilePath, equipmentDataFields, showEquipmentDataFields } = useStateContext();

  return (
    <Table fields={equipmentDataFields} data={equipmentData} filePath={equipmentDataFilePath} showFields={showEquipmentDataFields} />
  )
}

export default Equipment