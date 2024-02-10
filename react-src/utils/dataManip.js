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
