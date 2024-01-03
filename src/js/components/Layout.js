import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {

  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState('products');
  
  const tabClick = function tabClick(tabName) {
    setSelectedTab(tabName);
    navigate("/"+tabName);
  }

  return (
    <>
      <nav id='layout-nav'>
        <button className={selectedTab==='products' ? 'selected' : ''} onClick={() => tabClick("products")}>Products</button>
        <button className={selectedTab==='transactions' ? 'selected' : ''} onClick={() => tabClick("transactions")}>Transactions</button>
        <button className={selectedTab==='inventory' ? 'selected' : ''} onClick={() => tabClick("inventory")}>Inventory</button>
        <button className={selectedTab==='equipment' ? 'selected' : ''} onClick={() => tabClick("equipment")}>Equipment</button>
      </nav>
      <div id='content-wrapper'>
        <Outlet />
      </div>
    </>
  )
};

export default Layout;