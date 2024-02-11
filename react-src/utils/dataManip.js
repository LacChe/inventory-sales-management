import { useStateContext } from "./StateContext";

/**
 * Apply the correct formula based on the field and id.
 *
 * @param {Object} field - the field to calculate
 * @param {string} id - the record id
 * @return {any} the calculated value based on the field and id
 */
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

/**
 * Fill in blank fields of the record using the provided schema and inventory data.
 *
 * @param {object} record - The record to be filled
 * @param {array} schema - The schema indicates which fields are tagged to be filled
 * @return {object} The updated record with filled blank fields
 */
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

/**
 * Calculate the current stock amount based on the given record ID.
 *
 * @param {number} recordId - The ID of the record to calculate stock amount for
 * @return {number} The calculated current stock amount
 */
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
  amount *= -1;
  if (amount === -0) amount = 0;
  return amount;
}

// TODO sort date and boolean
/**
 * Sorts the given data based on the specified field in either ascending or descending order.
 * sorts sizes first by unit then by size
 * sorts objects as strings
 *
 * @param {object} data - The data to be sorted
 * @param {string} field - The field by which the data should be sorted
 * @param {boolean} asc - Flag to indicate whether sorting should be in ascending order
 * @return {object} The sorted data
 */
export function sortData(data, field, asc) {
  if (!field || field === "") return data;

  let dataArr = Object.keys(data).map((id) => {
    let returnObj = { id };
    Object.keys(data[id]).forEach((field) => {
      returnObj[field] = data[id][field];
    });
    return returnObj;
  });
  dataArr.sort((a, b) => {
    if (field.name === "size") {
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

/**
 * Filters the given data based on include, exlude, and hiddenFields array.
 *
 * @param {Object} data - The data object to be filtered
 * @param {Array} include - The array of terms that should be included, keep record if all include terms appear
 * @param {Array} exlude - The array of terms that should be excluded, remove record if any exclude terms appear
 * @param {Array} hiddenFields - The array of fields that should be excluded from processing
 * @return {Object} The filtered data object
 */
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
        term = term.trim();
        if (term !== "" && testString.indexOf(term.toLowerCase()) === -1) {
          deleteBool = true;
        }
      });
    }
    if (exlude && exlude.length > 0) {
      exlude.forEach((term) => {
        term = term.trim();
        if (term !== "" && testString.indexOf(term.toLowerCase()) !== -1) {
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

/**
 * Generates display data based on the provided records, schema, and table settings.
 * calculates formula fields
 * fills in tagged blank fields
 * filters by tableSettings.filterInclude and tableSettings.filterExclude
 * sorts by tableSettings.sortingByField and tableSettings.sortingAscending
 *
 * @param {Object} records - The object of records to be processed
 * @param {Array} schema - The schema defining the structure of the records
 * @param {Object} tableSettings - The settings for displaying the table
 * @return {Object} The filtered and sorted records for display
 */
export function generateDisplayData(records, schema, tableSettings) {
  let displayRecords = { ...records };
  Object.keys(displayRecords).forEach((id) => {
    displayRecords[id] = fillBlankFields(displayRecords[id], schema);
  });

  Object.keys(displayRecords).forEach((id) => {
    schema.forEach((field) => {
      if (field.type === "formula") {
        displayRecords[id][field.name] = calculateFormula(field, id);
      }
    });
  });

  displayRecords = filterData(
    displayRecords,
    tableSettings.filterInclude,
    tableSettings.filterExclude,
    tableSettings.hiddenFields
  );

  displayRecords = sortData(
    displayRecords,
    schema.filter((field) => field.name === tableSettings.sortingByField)[0],
    tableSettings.sortingAscending
  );

  return displayRecords;
}
