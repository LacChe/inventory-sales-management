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
