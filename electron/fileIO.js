const fs = require("fs");

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.access(`./data/${path}.json`, fs.constants.R_OK, (e) => {
      fs.readFile(`./data/${path}.json`, "utf8", (error, data) => {
        resolve({ data, error });
      });
    });
  });
}

function saveFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./data/${path}.json`, JSON.stringify(data), (error) => {
      let data = error ? null : "saved";
      resolve({ data, error });
    });
  });
}

module.exports = { readFile, saveFile };
