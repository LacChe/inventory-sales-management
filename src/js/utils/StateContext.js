import React, { createContext, useContext, useEffect, useState } from 'react';

const Context = createContext();

export const StateContext = ({ children }) => {

  const inventoryDataFilePath = "inventoryData.json";
  const productDataFilePath = "productData.json";
  const equipmentDataFilePath = "equipmentData.json";
  const transactionDataFilePath = "transactionData.json";
  const settingsFilePath = "settings.json";

  const [settings, setSettings] = useState({});

  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const [inventoryDataFields, setInventoryDataFields] = useState([]);
  const [productDataFields, setProductDataFields] = useState([]);
  const [equipmentDataFields, setEquipmentDataFields] = useState([]);
  const [transactionDataFields, setTransactionDataFields] = useState([]);

  const [showInventoryDataFields, setShowInventoryDataFields] = useState([]);
  const [showProductDataFields, setShowProductDataFields] = useState([]);
  const [showEquipmentDataFields, setShowEquipmentDataFields] = useState([]);
  const [showTransactionDataFields, setShowTransactionDataFields] = useState([]);

  // ask main for files
  useEffect(() => {
    window.api.send("readFile", inventoryDataFilePath);
    window.api.send("readFile", productDataFilePath);
    window.api.send("readFile", equipmentDataFilePath);
    window.api.send("readFile", transactionDataFilePath);
    window.api.send("readFile", settingsFilePath);
  }, [])
  window.api.receive("receiveFile", (data) => {
    switch (data[0]) {
      case inventoryDataFilePath:
        setInventoryData(JSON.parse(data[1]));
        break;
      case productDataFilePath:
        setProductData(JSON.parse(data[1]));
        break;
      case equipmentDataFilePath:
        setEquipmentData(JSON.parse(data[1]));
        break;
      case transactionDataFilePath:
        setTransactionData(JSON.parse(data[1]));
        break;
      case settingsFilePath:
        setSettings(JSON.parse(data[1]));

        setInventoryDataFields(JSON.parse(data[1]).inventoryDataFields);
        setProductDataFields(JSON.parse(data[1]).productDataFields);
        setEquipmentDataFields(JSON.parse(data[1]).equipmentDataFields);
        setTransactionDataFields(JSON.parse(data[1]).transactionDataFields);

        setShowInventoryDataFields(JSON.parse(data[1]).showInventoryDataFields);
        setShowProductDataFields(JSON.parse(data[1]).showProductDataFields);
        setShowEquipmentDataFields(JSON.parse(data[1]).showEquipmentDataFields);
        setShowTransactionDataFields(JSON.parse(data[1]).showTransactionDataFields);
        break;
      case "error":
        console.log("error: file not found ", data[1]);
        break;
      default:
        console.log("error: unknown file");
        break;
    }
  });

  const toggleShownField = function toggleShownField(filePath, field) {
    switch(filePath) {
      case inventoryDataFilePath:
        if(showInventoryDataFields.includes(field)) {
          setShowInventoryDataFields(prev => {
            settings.showInventoryDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowInventoryDataFields(prev => {
            settings.showInventoryDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      case productDataFilePath:
        if(showProductDataFields.includes(field)) {
          setShowProductDataFields(prev => {
            settings.showProductDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowProductDataFields(prev => {
            settings.showProductDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      case equipmentDataFilePath:
        if(showEquipmentDataFields.includes(field)) {
          setShowEquipmentDataFields(prev => {
            settings.showEquipmentDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowEquipmentDataFields(prev => {
            settings.showEquipmentDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      case transactionDataFilePath:
        if(showTransactionDataFields.includes(field)) {
          setShowTransactionDataFields(prev => {
            settings.showTransactionDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowTransactionDataFields(prev => {
            settings.showTransactionDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      default:
        console.log('error: no field set found');
    }
  }

  return (
    <Context.Provider
        value={{
          settings,

          inventoryDataFilePath,
          productDataFilePath,
          equipmentDataFilePath,
          transactionDataFilePath,

          inventoryData,
          productData,
          equipmentData,
          transactionData,

          inventoryDataFields,
          productDataFields,
          equipmentDataFields,
          transactionDataFields,

          showInventoryDataFields,
          showProductDataFields,
          showEquipmentDataFields,
          showTransactionDataFields,

          toggleShownField
        }}
    >
      { children }
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context);