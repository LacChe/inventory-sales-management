const { ipcMain } = require("electron");
const { readFile } = require("./fileIO");

function initEventListeners(window) {
  // test event
  ipcMain.on("event", (event, args) => {
    console.log(
      `event received: : ${JSON.stringify(event)}, args: ${JSON.stringify(
        args
      )}`
    );
  });

  // file io
  ipcMain.on("file", (event, args) => {
    readFile(args).then(({ error, data }) => {
      if (error) {
        window.webContents.send("error", ["fileIO", error]);
      } else {
        window.webContents.send("file", [args, data]);
      }
    });
  });
}

module.exports = initEventListeners;
