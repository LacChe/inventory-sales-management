const { ipcMain } = require("electron");
const { readFile } = require("./fileIO");

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
}

module.exports = initEventListeners;
