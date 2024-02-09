import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../utils/StateContext";

const Layout = () => {
  const navigate = useNavigate();
  const { tableSchemas } = useStateContext();

  const tabNames = Object.keys(tableSchemas ? tableSchemas : {});
  const [selectedTab, setSelectedTab] = useState("products");

  function tabClickHandler(tabName) {
    setSelectedTab(tabName);
    navigate(`/${tabName}`);
  }

  function navBar() {
    return (
      <nav>
        {/* render selection buttons for tabs */}
        {tabNames.map((name) => {
          // TODO style selected tab
          return (
            <button key={name} onClick={() => tabClickHandler(name)}>
              {name}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      {navBar()}
      {/* Outlet renders the component selected in the route's path in App.js */}
      <Outlet />
    </>
  );
};

export default Layout;
