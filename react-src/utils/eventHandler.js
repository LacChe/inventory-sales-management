export async function readFile(fileName) {
  let fileData;
  await window.api.readFile(fileName).then(({ error, data }) => {
    if (error) {
      console.log("read file error", error);
    } else {
      fileData = data;
    }
  });
  return fileData;
}

export async function saveFile(fileName, fileData) {
  let returnMsg;
  await window.api.saveFile(fileName, fileData).then(({ error, data }) => {
    if (error) {
      console.log("read file error", error);
    } else {
      returnMsg = data;
    }
  });
  return returnMsg;
}
