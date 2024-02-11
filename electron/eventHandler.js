const { ipcMain } = require("electron");
const { readFile, saveFile } = require("./fileIO");

/**
 * Initializes event listeners for testing and file I/O.
 */
function initEventListeners() {
  initTestEvent();
  initFileIOEvent();
}

/**
 * Initializes the test event and sets up a handler for the "event" message.
 *
 * @return {string} The message indicating that the event was received along with the event and arguments.
 */
function initTestEvent() {
  ipcMain.handle("event", (event, args) => {
    return `event received: : ${JSON.stringify(event)}, args: ${JSON.stringify(
      args
    )}`;
  });
}

/**
 * Initializes file IO event handlers for reading and saving files.
 *
 */
function initFileIOEvent() {
  ipcMain.handle("readFile", (event, fileName) => {
    return readFile(fileName);
  });
  ipcMain.handle("saveFile", (event, fileName, data) => {
    return saveFile(fileName, data);
  });
}

module.exports = initEventListeners;
