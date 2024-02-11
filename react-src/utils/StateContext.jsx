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
// toasts for inventory below threshold and data added deleted edited
// display record names instead of ids
// first load very slow
// check user inputs
// check for errors

/**
 * Creates a context provider for managing state data.
 *
 * @param {Object} children - The child components to be wrapped by the context provider.
 * @return {JSX.Element} The context provider component.
 */
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

  /**
   * Sets and saves the table settings for a specified table in the user settings data.
   *
   * @param {string} tableName - The name of the table
   * @param {object} newSettings - The new settings to be applied to the table
   */
  function setUserTableSettings(tableName, newSettings) {
    setFileData((prev) => {
      let newFileData = { ...prev };
      newFileData.userSettingsData.tableSettings[tableName] = newSettings;
      saveFileHandler("userSettings", newFileData.userSettingsData);
      return newFileData;
    });
  }

  /**
   * An asynchronous function that handles the saving of a file.
   *
   * @param {string} fileName - the name of the file to be saved
   * @param {any} data - the data to be saved in the file
   */
  async function saveFileHandler(fileName, data) {
    await saveFile(fileName, data);
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
