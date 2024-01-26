import React, { createContext, useContext, useEffect, useState } from "react";
import { generateToasts } from "../utils/HelperFunctions.js";
import {
  calculateTransFormulaFields,
  calculateInvFormulaFields,
} from "../utils/DataManip.js";

// TODO
// !!! records not saving
// chart doesnt display in dev
// chart labels sometimes dont show unless refreshed
// do setting fields need individual usestates?

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

  // generate toasts for inventory items where amount is less than reminder_amount
  useEffect(() => {
    generateToasts(inventoryData);
  }, [inventoryData]);

  // when all files are loaded and product and transaction data is present
  // calculate inventory amount
  useEffect(() => {
    if (!isLoaded) return;
    setInventoryData((prev) =>
      calculateInvFormulaFields(prev, productData, transactionData)
    );
  }, [productData, transactionData, loaded]);

  // when all files are loaded and product data is present
  // calculate transaction names
  useEffect(() => {
    if (!isLoaded) return;
    // add name_en name_cn appended with size
    setTransactionData((prev) =>
      calculateTransFormulaFields(
        prev,
        productData,
        inventoryData,
        productDataFields
      )
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

  // TODO this function shouldn't be exported (delete and records pages)
  // centralize calls to main instead
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
    function toggleFieldOrderForFile(previousSettings, file) {
      let newPrev = {
        field: previousSettings.field,
        asc: previousSettings.asc,
      };
      if (newPrev.field === field) {
        newPrev.asc = !newPrev.asc;
        settings[file].order.asc = newPrev.asc;
        window.api.send("saveFile", {
          filePath: settingsFilePath,
          data: settings,
        });
      } else {
        newPrev.field = field;
        settings[file].order.field = newPrev.field;
        window.api.send("saveFile", {
          filePath: settingsFilePath,
          data: settings,
        });
      }
      return newPrev;
    }

    switch (filePath) {
      case inventoryDataFilePath:
        setInventoryDataFieldsOrder((prev) => {
          return toggleFieldOrderForFile(prev, "inventory");
        });
        break;
      case productDataFilePath:
        setProductDataFieldsOrder((prev) => {
          return toggleFieldOrderForFile(prev, "product");
        });
        break;
      case equipmentDataFilePath:
        setEquipmentDataFieldsOrder((prev) => {
          return toggleFieldOrderForFile(prev, "equipment");
        });
        break;
      case transactionDataFilePath:
        setTransactionDataFieldsOrder((prev) => {
          return toggleFieldOrderForFile(prev, "transaction");
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
        loaded,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
