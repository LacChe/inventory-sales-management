import React, { createContext, useContext, useEffect, useState } from 'react';

const Context = createContext();

export const StateContext = ({ children }) => {

  const inventoryDataFilePath = "inventoryData.json";
  const productDataFilePath = "productData.json";
  const equipmentDataFilePath = "equipmentData.json";
  const transactionDataFilePath = "transactionData.json";
  const settingsFilePath = "settings.json";

  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  const [inventoryDataFields, setInventoryDataFields] = useState([]);
  const [productDataFields, setProductDataFields] = useState([]);
  const [equipmentDataFields, setEquipmentDataFields] = useState([]);
  const [transactionDataFields, setTransactionDataFields] = useState([]);

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
          setInventoryDataFields(JSON.parse(data[1]).inventoryDataFields);
          setProductDataFields(JSON.parse(data[1]).productDataFields);
          setEquipmentDataFields(JSON.parse(data[1]).equipmentDataFields);
          setTransactionDataFields(JSON.parse(data[1]).transactionDataFields);
          break;
        case "error":
          console.log("error: file not found ", data[1]);
          break;
        default:
          console.log("error: unknown file");
          break;
      }
    });

    return (
        <Context.Provider
            value={{
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
            }}
        >
          { children }
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);