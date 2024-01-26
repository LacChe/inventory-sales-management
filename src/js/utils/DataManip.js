/*
  functions for manipulating data
*/
import { useStateContext } from "./StateContext";

// returns a new product object with the names and size of the inventory object used if those fields are empty
export function fillEmptyProdFieldsUsingInvFields(prod, fields, inventoryData) {
  if (!prod || !prod.inventory_items || !inventoryData) return prod;
  let newProd = { ...prod };
  fields.forEach((field) => {
    if (
      (!newProd[field.name] || newProd[field.name] === "") &&
      (field.name === "name_en" ||
        field.name === "name_cn" ||
        field.name === "size")
    ) {
      const dataFromInventory = inventoryData.filter(
        (filterItem) =>
          filterItem.id === Object.keys(newProd.inventory_items)[0]
      )[0];
      newProd[field.name] = dataFromInventory
        ? dataFromInventory[field.name]
        : newProd[field.name];
    }
  });
  return newProd;
}

export function calculateInvFormulaFields(
  inventoryData,
  productData,
  transactionData
) {
  return inventoryData.map((mapItem) => {
    let amount = 0;
    // get products that use this inventory item
    const prodArr = productData.filter((product) => {
      if (product.inventory_items[mapItem.id] !== undefined) return product;
    });
    // get transactions that use this product
    const transArr = transactionData.filter((transaction) => {
      if (prodArr.map((mapItem) => mapItem.id).includes(transaction.product_id))
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
  });
}

export function calculateTransFormulaFields(
  transactionData,
  productData,
  inventoryData,
  productDataFields
) {
  return transactionData.map((transactionRecord) => {
    const names = productData
      .filter((product) => {
        // find product
        if (product.id === transactionRecord.product_id) return product;
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
  });
}

export function filterRecordsByTerm(
  filterTerm,
  records,
  showFields,
  filePath,
  fields
) {
  const { productDataFilePath, inventoryData } = useStateContext();
  return records.filter((data) => {
    let found = false;
    showFields.forEach((field) => {
      let testData = data[field];
      if (filePath === productDataFilePath)
        testData = fillEmptyProdFieldsUsingInvFields(
          data,
          fields,
          inventoryData
        )[field];
      if (filterTerm[0] === ",") {
        // if using filter formula
        // format: start with ','
        // prepending '-' means exclude
        // prepending '+' or no prepend means include
        // separate with ','
        let filtersObj = filterTerm
          .split(",")
          .slice(1)
          .reduce(
            (filters, val) => {
              if (
                !filters ||
                ((val[0] === "-" || val[0] === "+") && val.slice(1) === "")
              )
                return filters;
              if (val[0] === "-") {
                filters.exclude.push(val.slice(1));
              } else {
                filters.include.push(val[0] === "+" ? val.slice(1) : val);
              }
              return filters;
            },
            { include: [], exclude: [] }
          );
        filtersObj?.include.forEach((val) => {
          if (
            JSON.stringify(testData)?.toLowerCase().includes(val?.toLowerCase())
          ) {
            found = true;
            return;
          }
        });
        filtersObj?.exclude.forEach((val) => {
          if (
            JSON.stringify(testData)?.toLowerCase().includes(val?.toLowerCase())
          ) {
            found = false;
            return;
          }
        });
      } else {
        // not using filter formula
        if (
          JSON.stringify(testData)
            ?.toLowerCase()
            .includes(filterTerm?.toLowerCase())
        ) {
          found = true;
          return;
        }
      }
    });
    if (found) return data;
  });
}

export function sortRecords(data, fieldOrder, fields) {
  const { inventoryData } = useStateContext();
  return data.sort((a, b) => {
    // if empty, get field data from inventory
    let filledA = fillEmptyProdFieldsUsingInvFields(a, fields, inventoryData);
    let filledB = fillEmptyProdFieldsUsingInvFields(b, fields, inventoryData);

    // sort as number or string accordingly
    if (
      fieldOrder.field === "amount" ||
      fieldOrder.field === "revenue" ||
      fieldOrder.field === "price"
    ) {
      return (
        ((parseInt(a[fieldOrder.field]) || 0) -
          (parseInt(b[fieldOrder.field]) || 0)) *
        (fieldOrder.asc ? 1 : -1)
      );
    } else if (
      JSON.stringify(filledA[fieldOrder.field])?.toLowerCase() >
      JSON.stringify(filledB[fieldOrder.field])?.toLowerCase()
    ) {
      return 1 * (fieldOrder.asc ? 1 : -1);
    } else if (
      JSON.stringify(filledA[fieldOrder.field])?.toLowerCase() <
      JSON.stringify(filledB[fieldOrder.field])?.toLowerCase()
    ) {
      return -1 * (fieldOrder.asc ? 1 : -1);
    } else {
      return 0;
    }
  });
}
