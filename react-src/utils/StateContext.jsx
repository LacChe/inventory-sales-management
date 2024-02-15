import React, { createContext, useContext, useEffect, useState } from "react";
import { readFile, saveFile } from "./eventHandler";
import toast from "react-hot-toast";

const Context = createContext(null);

// TODO
// first load very slow
// check user inputs
// check for errors
// dynamic object selection for any amount of object field tpes

/**
 * Creates a context provider for managing state data.
 *
 * @param {Object} children - The child components to be wrapped by the context provider.
 * @return {JSX.Element} The context provider component.
 */
export const StateContext = ({ children }) => {
  const [fileData, setFileData] = useState({});

  // TODO, save in settings
  const [currentTab, setCurrentTab] = useState("inventory");
  const [currentChart, setCurrentChart] = useState("sales");

  useEffect(async () => {
    // TODO check data for errors
    const inventory = JSON.parse(await readFile("inventory"));
    const products = JSON.parse(await readFile("products"));
    const equipment = JSON.parse(await readFile("equipment"));
    const transactions = JSON.parse(await readFile("transactions"));
    const tableSchemas = JSON.parse(await readFile("tableSchemas"));
    const userSettings = JSON.parse(await readFile("userSettings"));
    setFileData({
      inventory,
      products,
      equipment,
      transactions,
      tableSchemas,
      userSettings,
    });
  }, []);

  /**
   * Sets and saves the table settings for a specified table in the user settings data.
   *
   * @param {string} tabName - The name of the tab
   * @param {object} newSettings - The new settings to be applied to the table
   */
  function setUserTableSettings(tabName, newSettings) {
    setFileData((prev) => {
      let newFileData = { ...prev };
      newFileData.userSettings.tableSettings[tabName] = newSettings;
      saveFileHandler("userSettings", newFileData.userSettings);
      return newFileData;
    });
  }

  function setUserChartSettings(chartName, newSettings) {
    setFileData((prev) => {
      let newFileData = { ...prev };
      newFileData.userSettings.chartSettings[chartName] = newSettings;
      saveFileHandler("userSettings", newFileData.userSettings);
      return newFileData;
    });
  }

  /**
   * Adds a record to the specified table and saves the file.
   *
   * @param {string} table - the table to save the record to
   * @param {string} id - the id of the record
   * @param {object} record - the record data to be saved
   */
  function saveRecord(table, id, record) {
    setFileData((prev) => {
      let newFileData = { ...prev };
      newFileData[table] = { ...newFileData[table], [id]: record };
      saveFileHandler(table, newFileData[table]);
      toast.success("Saved!");
      return newFileData;
    });
  }

  /**
   * Removes a record from the specified table and saves the file.
   *
   * @param {string} table - the table to remove the record from
   * @param {string} id - the id of the record
   */
  function deleteRecord(table, id) {
    setFileData((prev) => {
      let newFileData = { ...prev };
      delete newFileData[table][id];
      saveFileHandler(table, newFileData[table]);
      toast.success("Deleted!");
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
        inventory: fileData.inventory,
        products: fileData.products,
        equipment: fileData.equipment,
        transactions: fileData.transactions,
        tableSchemas: fileData.tableSchemas,
        userSettings: fileData.userSettings,
        currentTab,
        currentChart,

        setUserTableSettings,
        setUserChartSettings,
        saveRecord,
        deleteRecord,
        setCurrentTab,
        setCurrentChart,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
