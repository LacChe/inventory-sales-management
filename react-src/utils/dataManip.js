// filtering, sorting, filling in blank fields
import { useStateContext } from "../utils/StateContext";

export function fillBlankFromInventory(record, schema) {
  const { inventory } = useStateContext();
  if (Object.keys(record.inventory_items || {}).length <= 0) return record;
  if (!inventory) return record;

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

export function calculateCurrentStockAmount(recordId) {
  const { products, transactions } = useStateContext();

  let amount = 0;

  let productsWithItem = [];
  Object.keys(products).forEach((key) => {
    if (Object.keys(products[key].inventory_items).includes(recordId))
      productsWithItem = [...productsWithItem, key];
  });

  let transactionsWithItem = [];
  productsWithItem.forEach((productId) => {
    let itemCountInProduct = products[productId].inventory_items[recordId];
    Object.keys(transactions).forEach((key) => {
      if (Object.keys(transactions[key].products).includes(productId))
        amount += itemCountInProduct * transactions[key].products[productId];
    });
  });

  return amount * -1;
}
