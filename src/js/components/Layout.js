import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { useStateContext } from "../utils/StateContext";

const Layout = () => {
  const { inventoryData, isLoaded } = useStateContext();

  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("products");
  const tabNames = [
    "products",
    "transactions",
    "inventory",
    "equipment",
    "charts",
  ];

  function tabClick(tabName) {
    setSelectedTab(tabName);
    navigate(`/${tabName}`);
  }

  if (!isLoaded) {
    return <>Loading...</>;
  }

  return (
    <>
      <nav className="layout-nav">
        {/* render selection buttons for tabs */}
        {tabNames.map((name) => {
          return (
            <button
              key={name}
              className={
                "tab-button" + (selectedTab === name ? " selected" : "")
              }
              onClick={() => tabClick(name)}
            >
              {name}
            </button>
          );
        })}
      </nav>
      <div id="content-wrapper">
        <Outlet />{" "}
        {/* renders the component selected in the route's path in App.js */}
        <Toaster />
      </div>
    </>
  );
};

export default Layout;
