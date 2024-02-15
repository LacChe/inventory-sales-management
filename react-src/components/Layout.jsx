import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../utils/StateContext";
import { Toaster } from "react-hot-toast";

/**
 * Layout to be used in HashRouter, routes are wrapped as Outlet
 *
 * @return {JSX.Element} the rendered navigation bar and outlet
 */
const Layout = () => {
  const navigate = useNavigate();
  const { tableSchemas, userSettings, setCurrentTab } = useStateContext();

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
              className={userSettings.currentTab === name ? "selected" : ""}
              key={name}
              onClick={() => tabClickHandler(name)}
            >
              {name}
            </button>
          );
        })}
        <button
          className={userSettings.currentTab === "charts" ? "selected" : ""}
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
      <Toaster
        position="top-right"
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            backgroundColor: getComputedStyle(document.body).getPropertyValue(
              "--color-a"
            ),
            fontWeight: 600,
            color: "white",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "red",
              secondary: "blue",
            },
          },
        }}
      />
    </>
  );
};

export default Layout;
