// filtering, sorting, filling in blank fields

import { useStateContext } from "./StateContext";

// calculate formula type with appropriate functions
export function calculateFormula(field, id) {
  let value;
  switch (field.name) {
    case "amount":
      value = calculateCurrentStockAmount(id);
      break;
    default:
      break;
  }
  return value;
}

// fills in tagged blank fields in record from inventory
export function fillBlankFields(record, schema) {
  const { inventory } = useStateContext();
  if (Object.keys(record.inventory_items || {}).length <= 0) return record;

  let newRecord = { ...record };

  schema.forEach((field) => {
    if (field.fill_blank_from_inventory) {
      newRecord[field.name] = field.fill_blank_from_inventory
        .map((invField) => {
          return inventory[Object.keys(newRecord.inventory_items)[0]][invField];
        })
        .join(" ");
    }
  });
  return newRecord;
}

// sums all items that appear in transactions
export function calculateCurrentStockAmount(recordId) {
  const { products, transactions } = useStateContext();
  let amount = 0;

  let productsWithItem = [];
  Object.keys(products).forEach((key) => {
    if (Object.keys(products[key].inventory_items).includes(recordId))
      productsWithItem = [...productsWithItem, key];
  });

  productsWithItem.forEach((productId) => {
    let itemCountInProduct = products[productId].inventory_items[recordId];
    Object.keys(transactions).forEach((key) => {
      if (Object.keys(transactions[key].products).includes(productId))
        amount += itemCountInProduct * transactions[key].products[productId];
    });
  });

  return amount * -1;
}

// return sorted data
// sorts sizes first by unit then by size
// sorts objects as strings
// calculates formulas before sorting
export function sortData(data, field, asc, schema) {
  if (!field || field === "") return data;

  let dataArr = Object.keys(data).map((id) => {
    let returnObj = { id };
    Object.keys(data[id]).forEach((field) => {
      returnObj[field] = data[id][field];
    });
    return returnObj;
  });
  dataArr.sort((a, b) => {
    if (field.type === "formula") {
      a = calculateFormula(field, a.id);
      b = calculateFormula(field, b.id);
    } else if (field.name === "size") {
      if (a.unit < b.unit) return asc ? -1 : 1;
      if (a.unit > b.unit) return asc ? 1 : -1;
      if (a.size < b.size) return asc ? -1 : 1;
      if (a.size > b.size) return asc ? 1 : -1;
      return 0;
    } else {
      a = a[field.name];
      b = b[field.name];
    }

    if (typeof a !== "number" && typeof b !== "number") {
      a = JSON.stringify(a);
      b = JSON.stringify(b);
    }

    if (a < b) return asc ? -1 : 1;
    if (a > b) return asc ? 1 : -1;
    return 0;
  });

  let sortedData = {};
  dataArr.forEach((record) => {
    let newRecord = {};
    Object.keys(record).forEach((field) => {
      if (field === "id") return;
      newRecord[field] = record[field];
    });
    sortedData[record.id] = newRecord;
  });

  return sortedData;
}

// return filtered data, ignoring hidden fields
// only keep if all include terms appear in record
// remove if any exclude terms appear in record
export function filterData(data, include, exlude, hiddenFields) {
  Object.keys(data).forEach((id) => {
    let deleteBool = false;
    const valueArray = Object.keys(data[id]).map((field) => {
      if (hiddenFields.includes(field)) return "";
      return JSON.stringify(data[id][field]);
    });
    const testString = `${id} ${valueArray.join(" ")}`.toLowerCase();

    if (include && include.length > 0) {
      include.forEach((term) => {
        if (testString.indexOf(term.toLowerCase()) === -1) {
          deleteBool = true;
        }
      });
    }
    if (exlude && exlude.length > 0) {
      exlude.forEach((term) => {
        if (testString.indexOf(term.toLowerCase()) !== -1) {
          deleteBool = true;
        }
      });
    }

    if (deleteBool === true) {
      delete data[id];
    }
  });
  return data;
}
