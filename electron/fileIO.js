const fs = require("fs");

/**
 * Reads a file from the specified path and returns a promise that resolves with the file data or an error object.
 *
 * @param {string} path - the path of the file to be read
 * @return {Promise} a promise that resolves with an object containing the file data and potential error
 */
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.access(`./data/${path}.json`, fs.constants.R_OK, (e) => {
      fs.readFile(`./data/${path}.json`, "utf8", (error, data) => {
        resolve({ data, error });
      });
    });
  });
}

/**
 * Saves data to a file at the specified path.
 *
 * @param {string} path - The path where the file will be saved
 * @param {object} data - The data to be saved to the file
 * @return {Promise} A Promise that resolves to an object containing the saved data and any error that occurred
 */
function saveFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./data/${path}.json`, JSON.stringify(data), (error) => {
      resolve({ data, error });
    });
  });
}

module.exports = { readFile, saveFile };
