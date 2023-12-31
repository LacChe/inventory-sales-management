import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav id='layout-nav'>
        <button onClick={() => navigate("/products")}>Products</button>
        <button onClick={() => navigate("/transactions")}>Transactions</button>
        <button onClick={() => navigate("/inventory")}>Inventory</button>
        <button onClick={() => navigate("/equipment")}>Equipment</button>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;