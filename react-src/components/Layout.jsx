import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../utils/StateContext";

/**
 * Layout to be used in HashRouter, routes are wrapped as Outlet
 *
 * @return {JSX.Element} the rendered navigation bar and outlet
 */
const Layout = () => {
  const navigate = useNavigate();
  const { tableSchemas, currentTab, setCurrentTab } = useStateContext();

  const tabNames = Object.keys(tableSchemas ? tableSchemas : {});

  /**
   * Navigate to the selected tab and set tab as selected
   *
   * @param {string} tabName - the name of the tab that was clicked
   */
  function tabClickHandler(tabName) {
    setCurrentTab(tabName);
    navigate(`/${tabName}`);
  }

  /**
   * Function to render the navigation bar with selection buttons for tabs.
   *
   * @return {JSX.Element} The navigation bar JSX element
   */
  function navBar() {
    return (
      <nav className="nav-wrapper">
        {/* render selection buttons for tabs */}
        {tabNames.map((name) => {
          return (
            <button
              className={currentTab === name ? "selected" : ""}
              key={name}
              onClick={() => tabClickHandler(name)}
            >
              {name}
            </button>
          );
        })}
        <button
          className={currentTab === "charts" ? "selected" : ""}
          key={"charts"}
          onClick={() => tabClickHandler("charts")}
        >
          Charts
        </button>
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
