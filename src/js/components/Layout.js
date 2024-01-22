import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
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

  const tabClick = function tabClick(tabName) {
    setSelectedTab(tabName);
    navigate("/" + tabName);
  };

  // generate toasts for inventory items where amount is less than reminder_amount
  useEffect(() => {
    inventoryData.forEach((data) => {
      if (data.reminder_amount && data.reminder_amount > data.amount) {
        toast.custom(
          (t) => (
            <div
              className={`toast-low-stock ${t.visible} ? 'animate-enter' : 'animate-leave'`}
              onClick={() => toast.dismiss(data.id)}
            >
              <span>Low Stock!</span> ID: {data.id} Name: {data.name_en}
            </div>
          ),
          {
            id: data.id,
            duration: Infinity,
            position: "bottom-left",
          }
        );
      }
    });
  }, [inventoryData]);

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
