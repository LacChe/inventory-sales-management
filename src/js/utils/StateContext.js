import React, { createContext, useContext, useEffect, useState } from 'react';

const Context = createContext();

export const StateContext = ({ children }) => {

  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

    // ask main for files
    useEffect(() => {
      window.api.send("readFile", "inventoryData.json");
      window.api.send("readFile", "productData.json");
      window.api.send("readFile", "equipmentData.json");
      window.api.send("readFile", "transactionData.json");
    }, [])
    window.api.receive("receiveFile", (data) => {
      switch (data[0]) {
        case "inventoryData.json":
          console.log(1);
          setInventoryData(JSON.parse(data[1]));
          break;
        case "productData.json":
          console.log(2);
          setProductData(JSON.parse(data[1]));
          break;
        case "equipmentData.json":
          console.log(3);
          setEquipmentData(JSON.parse(data[1]));
          break;
        case "transactionData.json":
          console.log(4);
          setTransactionData(JSON.parse(data[1]));
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
              inventoryData,
              productData,
              equipmentData,
              transactionData
            }}
        >
            { children }
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);