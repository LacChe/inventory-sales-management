import React, { createContext, useContext, useEffect, useState } from "react";
import { fillEmptyProdFieldsUsingInvFields } from "../utils/HelperFunctions.js";

const Context = createContext();

export const StateContext = ({ children }) => {
  const inventoryDataFilePath = "inventoryData.json";
  const productDataFilePath = "productData.json";
  const equipmentDataFilePath = "equipmentData.json";
  const transactionDataFilePath = "transactionData.json";
  const settingsFilePath = "settings.json";

  const [settings, setSettings] = useState({});
  const [loaded, setLoaded] = useState([0, 0, 0, 0, 0]);

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
  const [showTransactionDataFields, setShowTransactionDataFields] = useState(
    []
  );

  const [inventoryDataFieldsOrder, setInventoryDataFieldsOrder] = useState({
    field: "",
    asc: true,
  });
  const [productDataFieldsOrder, setProductDataFieldsOrder] = useState({
    field: "",
    asc: true,
  });
  const [equipmentDataFieldsOrder, setEquipmentDataFieldsOrder] = useState({
    field: "",
    asc: true,
  });
  const [transactionDataFieldsOrder, setTransactionDataFieldsOrder] = useState({
    field: "",
    asc: true,
  });

  // when all files are loaded and product and transaction data is present
  // calculate inventory amount
  useEffect(() => {
    // add amount
    if (!isLoaded) return;
    setInventoryData((prev) =>
      prev.map((mapItem) => {
        let amount = 0;
        // get products that use this inventory item
        const prodArr = productData.filter((product) => {
          if (product.inventory_items[mapItem.id] !== undefined)
            return product;
        });
        // get transactions that use this product
        const transArr = transactionData.filter((transaction) => {
          if (
            prodArr.map((mapItem) => mapItem.id).includes(transaction.product_id)
          )
            return transaction;
        });
        // sum total inventory items
        prodArr.forEach((product) => {
          for (let i = 0; i < product.inventory_items[mapItem.id]; i++) {
            transArr.forEach(
              (transaction) => (amount += parseInt(transaction.amount))
            );
          }
        });
        // add amount field to sortedItems
        return {
          ...mapItem,
          amount: (amount *= -1),
        };
      })
    );
  }, [productData, transactionData, loaded]);

  // when all files are loaded and product data is present
  // calculate transaction names
  useEffect(() => {
    if (!isLoaded) return;
    // add name_en name_cn appended with size
    setTransactionData((prev) =>
      prev.map((transactionRecord) => {
        const names = productData
          .filter((product) => {
            // find product
            if (product.id === transactionRecord.product_id)
              return product;
          })
          .map((product) => {
            let filledRecord = fillEmptyProdFieldsUsingInvFields(
              product,
              productDataFields,
              inventoryData
            );
            return {
              name_en: filledRecord.name_en,
              name_cn: filledRecord.name_cn,
              size: filledRecord.size,
            };
          })[0];
        let size = " " + (names?.size ? names.size : "");
        return {
          ...transactionRecord,
          name_en: names?.name_en + size,
          name_cn: names?.name_cn + size,
        };
      })
    );
  }, [productData, loaded]);

  // ask main for files, sets loaded indexes to true when done
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
          setLoaded((prev) => {
            prev[0] = 1;
            return prev;
          });
          break;
        case productDataFilePath:
          setProductData(JSON.parse(data[1]));
          setLoaded((prev) => {
            prev[1] = 1;
            return prev;
          });
          break;
        case equipmentDataFilePath:
          setEquipmentData(JSON.parse(data[1]));
          setLoaded((prev) => {
            prev[2] = 1;
            return prev;
          });
          break;
        case transactionDataFilePath:
          setTransactionData(JSON.parse(data[1]));
          setLoaded((prev) => {
            prev[3] = 1;
            return prev;
          });
          break;
        case settingsFilePath:
          setSettings(JSON.parse(data[1]));

          setInventoryDataFields(
            JSON.parse(data[1]).inventory.inventoryDataFields
          );
          setProductDataFields(JSON.parse(data[1]).product.productDataFields);
          setEquipmentDataFields(
            JSON.parse(data[1]).equipment.equipmentDataFields
          );
          setTransactionDataFields(
            JSON.parse(data[1]).transaction.transactionDataFields
          );

          setShowInventoryDataFields(
            JSON.parse(data[1]).inventory.showInventoryDataFields
          );
          setShowProductDataFields(
            JSON.parse(data[1]).product.showProductDataFields
          );
          setShowEquipmentDataFields(
            JSON.parse(data[1]).equipment.showEquipmentDataFields
          );
          setShowTransactionDataFields(
            JSON.parse(data[1]).transaction.showTransactionDataFields
          );

          setInventoryDataFieldsOrder(JSON.parse(data[1]).inventory.order);
          setProductDataFieldsOrder(JSON.parse(data[1]).product.order);
          setEquipmentDataFieldsOrder(JSON.parse(data[1]).equipment.order);
          setTransactionDataFieldsOrder(JSON.parse(data[1]).transaction.order);

          setLoaded((prev) => {
            prev[4] = 1;
            return prev;
          });
          break;
        case "error":
          console.log("error: file not found ", data[1]);
          break;
        default:
          console.log("error: unknown file");
          break;
      }
    });
  }, []);

  const saveFileToApi = function saveFileToApi(data) {
    window.api.send("saveFile", data);
  };

  // returns true if all json files are received from main
  const isLoaded = function isLoaded() {
    return (
      loaded[0] === 1 &&
      loaded[1] === 1 &&
      loaded[2] === 1 &&
      loaded[3] === 1 &&
      loaded[4] === 1
    );
  };

  /*
    methods for tables
  */

  // adds or removes the field from the list of shown fields in settings.json
  // for the table corresponding with the filepath 
  const toggleShownField = function toggleShownField(filePath, field) {
    switch (filePath) {
      case inventoryDataFilePath:
        if (showInventoryDataFields.includes(field)) {
          setShowInventoryDataFields((prev) => {
            settings.inventory.showInventoryDataFields = prev.filter(
              (filterItem) => filterItem !== field
            );
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.filter((filterItem) => filterItem !== field);
          });
        } else {
          setShowInventoryDataFields((prev) => {
            settings.inventory.showInventoryDataFields = prev.concat(field);
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.concat(field);
          });
        }
        break;
      case productDataFilePath:
        if (showProductDataFields.includes(field)) {
          setShowProductDataFields((prev) => {
            settings.product.showProductDataFields = prev.filter(
              (filterItem) => filterItem !== field
            );
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.filter((filterItem) => filterItem !== field);
          });
        } else {
          setShowProductDataFields((prev) => {
            settings.product.showProductDataFields = prev.concat(field);
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.concat(field);
          });
        }
        break;
      case equipmentDataFilePath:
        if (showEquipmentDataFields.includes(field)) {
          setShowEquipmentDataFields((prev) => {
            settings.equipment.showEquipmentDataFields = prev.filter(
              (filterItem) => filterItem !== field
            );
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.filter((filterItem) => filterItem !== field);
          });
        } else {
          setShowEquipmentDataFields((prev) => {
            settings.equipment.showEquipmentDataFields = prev.concat(field);
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.concat(field);
          });
        }
        break;
      case transactionDataFilePath:
        if (showTransactionDataFields.includes(field)) {
          setShowTransactionDataFields((prev) => {
            settings.transaction.showTransactionDataFields = prev.filter(
              (filterItem) => filterItem !== field
            );
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.filter((filterItem) => filterItem !== field);
          });
        } else {
          setShowTransactionDataFields((prev) => {
            settings.transaction.showTransactionDataFields = prev.concat(field);
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
            return prev.concat(field);
          });
        }
        break;
      default:
        console.log("error: no field set found");
    }
  };

  // sets the field to be used for ordering and whether it is ascending or not
  // for the table corresponding with the filepath 
  const toggleOrder = function toggleOrder(filePath, field) {
    switch (filePath) {
      case inventoryDataFilePath:
        setInventoryDataFieldsOrder((prev) => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if (newPrev.field === field) {
            newPrev.asc = !newPrev.asc;
            settings.inventory.order.asc = newPrev.asc;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          } else {
            newPrev.field = field;
            settings.inventory.order.field = newPrev.field;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          }
          return newPrev;
        });
        break;
      case productDataFilePath:
        setProductDataFieldsOrder((prev) => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if (newPrev.field === field) {
            newPrev.asc = !newPrev.asc;
            settings.product.order.asc = newPrev.asc;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          } else {
            newPrev.field = field;
            settings.product.order.field = newPrev.field;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          }
          return newPrev;
        });
        break;
      case equipmentDataFilePath:
        setEquipmentDataFieldsOrder((prev) => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if (newPrev.field === field) {
            newPrev.asc = !newPrev.asc;
            settings.equipment.order.asc = newPrev.asc;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          } else {
            newPrev.field = field;
            settings.equipment.order.field = newPrev.field;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          }
          return newPrev;
        });
        break;
      case transactionDataFilePath:
        setTransactionDataFieldsOrder((prev) => {
          let newPrev = { field: prev.field, asc: prev.asc };
          if (newPrev.field === field) {
            newPrev.asc = !newPrev.asc;
            settings.transaction.order.asc = newPrev.asc;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          } else {
            newPrev.field = field;
            settings.transaction.order.field = newPrev.field;
            window.api.send("saveFile", {
              filePath: settingsFilePath,
              data: settings,
            });
          }
          return newPrev;
        });
        break;
      default:
        console.log("error: no field set found");
    }
  };

  const saveSearchTerm = function saveSearchTerm(term) {
    setSettings((prev) => {
      window.api.send("saveFile", {
        filePath: settingsFilePath,
        data: { ...prev, search: term },
      });
      return { ...prev, search: term };
    });
  };

  const saveFilterTerm = function saveFilterTerm(term) {
    setSettings((prev) => {
      window.api.send("saveFile", {
        filePath: settingsFilePath,
        data: { ...prev, filter: term },
      });
      return { ...prev, filter: term };
    });
  };

  /*
    methods for charts
  */

  const saveChartData = function saveChartData(data) {
    if (settings.chartData) {
      setSettings((prev) => {
        window.api.send("saveFile", {
          filePath: settingsFilePath,
          data: { ...prev, chartData: data },
        });
        return { ...prev, chartData: data };
      });
    }
  };

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
        saveChartData,
        isLoaded,
        saveSearchTerm,
        saveFilterTerm,
        loaded
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
