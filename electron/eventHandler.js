const { ipcMain } = require("electron");

function initEventListeners() {
  ipcMain.on("event", (event, args) => {
    console.log(
      `event received: : ${JSON.stringify(event)}, args: ${JSON.stringify(
        args
      )}`
    );
  });
}

module.exports = initEventListeners;
