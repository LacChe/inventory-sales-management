import React, { createContext, useContext, useEffect, useState } from 'react';

// TODO charts: sales: sales transactions within duration for selected products grouped by day month year
// TODO fill in blank values for delete confimation
// TODO styling
// todo convert json files to objects instead of arrays ?
// todo sometimes submit doesnt refresh
// todo set num input to 0 when deselecting inv item for product

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

  const [inventoryDataFieldsOrder, setInventoryDataFieldsOrder] = useState({field: "", asc: true});
  const [productDataFieldsOrder, setProductDataFieldsOrder] = useState({field: "", asc: true});
  const [equipmentDataFieldsOrder, setEquipmentDataFieldsOrder] = useState({field: "", asc: true});
  const [transactionDataFieldsOrder, setTransactionDataFieldsOrder] = useState({field: "", asc: true});

  // ask main for files
  useEffect(() => {
    window.api.send("readFile", inventoryDataFilePath);
    window.api.send("readFile", productDataFilePath);
    window.api.send("readFile", equipmentDataFilePath);
    window.api.send("readFile", transactionDataFilePath);
    window.api.send("readFile", settingsFilePath);
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
          
          setInventoryDataFields(JSON.parse(data[1]).inventory.inventoryDataFields);
          setProductDataFields(JSON.parse(data[1]).product.productDataFields);
          setEquipmentDataFields(JSON.parse(data[1]).equipment.equipmentDataFields);
          setTransactionDataFields(JSON.parse(data[1]).transaction.transactionDataFields);
  
          setShowInventoryDataFields(JSON.parse(data[1]).inventory.showInventoryDataFields);
          setShowProductDataFields(JSON.parse(data[1]).product.showProductDataFields);
          setShowEquipmentDataFields(JSON.parse(data[1]).equipment.showEquipmentDataFields);
          setShowTransactionDataFields(JSON.parse(data[1]).transaction.showTransactionDataFields);
  
          setInventoryDataFieldsOrder(JSON.parse(data[1]).inventory.order);
          setProductDataFieldsOrder(JSON.parse(data[1]).product.order);
          setEquipmentDataFieldsOrder(JSON.parse(data[1]).equipment.order);
          setTransactionDataFieldsOrder(JSON.parse(data[1]).transaction.order);
          break;
        case "error":
          console.log("error: file not found ", data[1]);
          break;
        default:
          console.log("error: unknown file");
          break;
      }
    });
  }, [])

  const saveFileToApi = function saveFileToApi(data) {
    window.api.send("saveFile", data);
  }

  const toggleShownField = function toggleShownField(filePath, field) {
    switch(filePath) {
      case inventoryDataFilePath:
        if(showInventoryDataFields.includes(field)) {
          setShowInventoryDataFields(prev => {
            settings.inventory.showInventoryDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowInventoryDataFields(prev => {
            settings.inventory.showInventoryDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      case productDataFilePath:
        if(showProductDataFields.includes(field)) {
          setShowProductDataFields(prev => {
            settings.product.showProductDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowProductDataFields(prev => {
            settings.product.showProductDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      case equipmentDataFilePath:
        if(showEquipmentDataFields.includes(field)) {
          setShowEquipmentDataFields(prev => {
            settings.equipment.showEquipmentDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowEquipmentDataFields(prev => {
            settings.equipment.showEquipmentDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      case transactionDataFilePath:
        if(showTransactionDataFields.includes(field)) {
          setShowTransactionDataFields(prev => {
            settings.transaction.showTransactionDataFields = prev.filter(filterItem => filterItem !== field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.filter(filterItem => filterItem !== field);
          });
        } else {
          setShowTransactionDataFields(prev => {
            settings.transaction.showTransactionDataFields = prev.concat(field);
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
            return prev.concat(field);
          });
        }
        break;
      default:
        console.log('error: no field set found');
    }
  }

  const toggleOrder = function toggleOrder(filePath, field) {
    switch(filePath) {
      case inventoryDataFilePath:
        setInventoryDataFieldsOrder(prev => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if(newPrev.field === field){
            newPrev.asc = !newPrev.asc;
            settings.inventory.order.asc = newPrev.asc;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          } else {
            newPrev.field = field;
            settings.inventory.order.field = newPrev.field;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          }
          return newPrev;
        });
        break;
      case productDataFilePath:
        setProductDataFieldsOrder(prev => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if(newPrev.field === field){
            newPrev.asc = !newPrev.asc;
            settings.product.order.asc = newPrev.asc;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          } else {
            newPrev.field = field;
            settings.product.order.field = newPrev.field;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          }
          return newPrev;
        });
        break;
      case equipmentDataFilePath:
        setEquipmentDataFieldsOrder(prev => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if(newPrev.field === field){
            newPrev.asc = !newPrev.asc;
            settings.equipment.order.asc = newPrev.asc;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          } else {
            newPrev.field = field;
            settings.equipment.order.field = newPrev.field;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          }
          return newPrev;
        });
        break;
      case transactionDataFilePath:
        setTransactionDataFieldsOrder(prev => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if(newPrev.field === field){
            newPrev.asc = !newPrev.asc;
            settings.transaction.order.asc = newPrev.asc;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          } else {
            newPrev.field = field;
            settings.transaction.order.field = newPrev.field;
            window.api.send("saveFile", { filePath: settingsFilePath, data: settings});
          }
          return newPrev;
        });
        break;
      default:
        console.log('error: no field set found');
    }
  }

  const saveChartData = function saveChartData(data) {
    if(settings.chartData) {
      setSettings(prev => {
        window.api.send("saveFile", { filePath: settingsFilePath, data: {...prev, 'chartData': data}});
        return {...prev, 'chartData': data}
      });
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

          inventoryDataFieldsOrder,
          productDataFieldsOrder,
          equipmentDataFieldsOrder,
          transactionDataFieldsOrder,

          toggleShownField,
          toggleOrder,
          saveFileToApi,
          saveChartData
        }}
    >
      { children }
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context);