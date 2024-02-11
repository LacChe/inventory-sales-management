const { ipcMain } = require("electron");
const { readFile, saveFile } = require("./fileIO");

function initEventListeners() {
  initTestEvent();
  initFileIOEvent();
}

function initTestEvent() {
  ipcMain.handle("event", (event, args) => {
    return `event received: : ${JSON.stringify(event)}, args: ${JSON.stringify(
      args
    )}`;
  });
}

function initFileIOEvent() {
  ipcMain.handle("readFile", (event, fileName) => {
    return readFile(fileName);
  });
  ipcMain.handle("saveFile", (event, fileName, data) => {
    return saveFile(fileName, data);
  });
}

module.exports = initEventListeners;
