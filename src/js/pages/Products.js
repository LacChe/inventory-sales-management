import React from 'react'
import { useStateContext } from '../utils/StateContext';
import Table from '../components/Table.js';

const Products = () => {
  const { productData, productDataFilePath, productDataFields, showProductDataFields } = useStateContext();

  return (
    <Table fields={productDataFields} data={productData} filePath={productDataFilePath} showFields={showProductDataFields} />
  )
}

export default Products