import React from 'react';
import { useStateContext } from '../utils/StateContext';
import Table from '../components/Table.js';

const Products = () => {
  const { productData, productDataFilePath, productDataFields, showProductDataFields, productDataFieldsOrder } = useStateContext();

  return (
    <Table fields={productDataFields} data={productData} filePath={productDataFilePath} showFields={showProductDataFields} fieldOrder={productDataFieldsOrder} />
  )
}

export default Products;