import React from "react";
import Layout from "./components/Layout.js";
import { HashRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products.js";
import Transactions from "./pages/Transactions.js";
import Inventory from "./pages/Inventory.js";
import Equipment from "./pages/Equipment.js";
import Charts from "./pages/Charts.js";

export default function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/products" element={<Products />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/" element={<Products />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}
