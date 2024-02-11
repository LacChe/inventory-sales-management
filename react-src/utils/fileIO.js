/**
 * Export data to a CSV file with specified file name, fields, and records.
 *
 * @param {string} tableName - the name of the file
 * @param {Array} fields - an array of field names
 * @param {Object} records - an object containing records
 */
export function exportSpreadSheet(tableName, fields, records) {
  let exportData = "";

  // add column headers
  fields.forEach((field) => {
    exportData += field?.replaceAll(",", "-").replaceAll("_", " ") + ",";
  });
  exportData = exportData.slice(0, -1) + "\n";

  // add records
  Object.keys(records).forEach((key) => {
    let saveLine = "";
    fields.forEach((field) => {
      if (field === "id") {
        saveLine +=
          key?.toString()?.replaceAll(",", "-").replaceAll("_", " ") + ",";
      } else if (!records[key][field]) {
        saveLine += ",";
      } else {
        saveLine +=
          records[key][field]
            ?.toString()
            ?.replaceAll(",", "-")
            .replaceAll("_", " ") + ",";
      }
    });
    exportData += saveLine;
    exportData = exportData.slice(0, -1) + "\n";
  });

  // download data
  const url = window.URL.createObjectURL(new Blob([exportData]));
  const link = document.createElement("a");
  link.href = url;
  const fileName = `${tableName}.csv`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
