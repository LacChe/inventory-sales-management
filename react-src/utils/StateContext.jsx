import React, { createContext, useContext, useEffect, useState } from "react";
import { readFile } from "./eventHandler";

const Context = createContext(null);

export const StateContext = ({ children }) => {
  const [fileData, setFileData] = useState({});

  useEffect(async () => {
    // TODO check data for errors
    const inventoryData = JSON.parse(await readFile("inventory"));
    const productsData = JSON.parse(await readFile("products"));
    const equipmentData = JSON.parse(await readFile("equipment"));
    const transactionsData = JSON.parse(await readFile("transactions"));
    const tableSchemasData = JSON.parse(await readFile("tableSchemas"));
    const userSettingsData = JSON.parse(await readFile("userSettings"));
    setFileData({
      inventoryData,
      productsData,
      equipmentData,
      transactionsData,
      tableSchemasData,
      userSettingsData,
    });
  }, []);

  return (
    <Context.Provider
      value={{
        inventory: fileData.inventoryData,
        products: fileData.productsData,
        equipment: fileData.equipmentData,
        transactions: fileData.transactionsData,
        tableSchemas: fileData.tableSchemasData,
        userSettings: fileData.userSettingsData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
