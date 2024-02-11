import React, { createContext, useContext, useEffect, useState } from "react";
import { readFile, saveFile } from "./eventHandler";

const Context = createContext(null);

// TODO
// highlight search term
// export to csv
// add record
// edit record
// delete record
// save scroll pos
// styling
// display record names instead of ids
// first load very slow
// check user inputs
// check for errors

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

  function setUserTableSettings(tableName, newSettings) {
    setFileData((prev) => {
      let newFileData = { ...prev };
      newFileData.userSettingsData.tableSettings[tableName] = newSettings;
      saveFileHandler("userSettings", newFileData.userSettingsData);
      return newFileData;
    });
  }

  async function saveFileHandler(fileName, data) {
    const msg = await saveFile(fileName, data);
  }

  return (
    <Context.Provider
      value={{
        inventory: fileData.inventoryData,
        products: fileData.productsData,
        equipment: fileData.equipmentData,
        transactions: fileData.transactionsData,
        tableSchemas: fileData.tableSchemasData,
        userSettings: fileData.userSettingsData,

        setUserTableSettings,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
