import toast from "react-hot-toast";

export function validRecord(record, schema) {
  let errorFields = [];
  schema.forEach((field) => {
    if (field.required && record[field.name] === undefined) {
      errorFields.push({ field, reason: "Field required." });
    }
  });
  if (errorFields.length > 0) {
    errorFields.forEach((error) => {
      toast.error(
        `${error.field.name
          .split("_")
          .map((word) => word[0].toUpperCase() + word.substring(1))
          .join(" ")}: ${error.reason}`
      );
    });
    return false;
  } else {
    return true;
  }
}
