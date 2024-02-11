// filtering, sorting, filling in blank fields

export function fillBlankFields(record, schema, inventory) {
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

export function calculateCurrentStockAmount(recordId, products, transactions) {
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
