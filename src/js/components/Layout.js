import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import toast, { Toaster } from 'react-hot-toast';
import { useStateContext } from '../utils/StateContext';

const Layout = () => {

  const { inventoryData, productData, transactionData } = useStateContext();

  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState('products');
  
  const tabClick = function tabClick(tabName) {
    setSelectedTab(tabName);
    navigate("/"+tabName);
  }

  useEffect(() => {
  
    // add amount
    let invDataWithAmount = inventoryData.map(mapItem => {
      let amount = 0
      // get products that use this inventory item
      const prodArr = productData.filter(filterItem => {
        if(filterItem.inventory_items[mapItem.id] !== undefined) return filterItem;
      });
      // get transactions that use this product
      const transArr = transactionData.filter(filterItem => {
        if(prodArr.map(mapItem => mapItem.id).includes(filterItem.product_id)) return filterItem;
      });
      // sum total inventory items
      prodArr.forEach(product => {
        for(let i = 0; i < product.inventory_items[mapItem.id]; i++) {
          transArr.forEach(transaction => amount += parseInt(transaction.amount))
        }
      });
      return {
        ...mapItem,
        amount: amount*=-1
      }
    });
    
    invDataWithAmount.forEach(data => {
      if(data.reminder_amount && data.reminder_amount > data.amount) {
        toast.custom((t) => (<div 
          className={`toast-low-stock ${t.visible} ? 'animate-enter' : 'animate-leave'`}
          onClick={() => toast.dismiss(data.id)}
        >
          <span>Low Stock!</span> ID: {data.id} Name: {data.name_en}
        </div>), {
          id: data.id,
          duration: Infinity,
          position: 'bottom-left',
        });
      }
    });
  }, [inventoryData])
  
  return (
    <>
      <nav className='layout-nav'>
        <button className={selectedTab==='products' ? 'selected' : ''} onClick={() => tabClick("products")}>Products</button>
        <button className={selectedTab==='transactions' ? 'selected' : ''} onClick={() => tabClick("transactions")}>Transactions</button>
        <button className={selectedTab==='inventory' ? 'selected' : ''} onClick={() => tabClick("inventory")}>Inventory</button>
        <button className={selectedTab==='equipment' ? 'selected' : ''} onClick={() => tabClick("equipment")}>Equipment</button>
        <button className={selectedTab==='charts' ? 'selected' : ''} onClick={() => tabClick("charts")}>Charts</button>
      </nav>
      <div id='content-wrapper'>
        <Outlet />
        <Toaster />
      </div>
    </>
  )
};

export default Layout;