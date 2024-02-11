// handles formatting and importing/exporting files from/to device

// exports as .csv
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
