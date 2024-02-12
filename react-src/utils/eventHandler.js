/**
 * Asynchronously reads a file and returns the file data.
 *
 * @param {string} fileName - The name of the file to be read
 * @return {string} The data read from the file
 */
export async function readFile(fileName) {
  let fileData;
  await window.api.readFile(fileName).then(({ error, data }) => {
    if (error) {
      console.error("read file error", error);
    } else {
      fileData = data;
    }
  });
  return fileData;
}

/**
 * Saves a file with the given fileName and fileData using the window.api.saveFile method.
 *
 * @param {string} fileName - The name of the file to be saved
 * @param {any} fileData - The data to be saved in the file
 */
export async function saveFile(fileName, fileData) {
  await window.api.saveFile(fileName, fileData).then(({ error, data }) => {
    if (error) {
      console.error("read file error", error);
    }
  });
}
