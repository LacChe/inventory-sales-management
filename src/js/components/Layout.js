import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <Link to="/page1">page1</Link>
        <Link to="/page2">page2</Link>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;