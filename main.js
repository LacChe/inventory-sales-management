const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require("fs");

const isDev = !app.isPackaged;

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 800,
    autoHideMenuBar: true,
    icon: 'res/icon.png',
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.setBackgroundColor('#263A29');
  win.loadFile('index.html')
}

if(isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    ignored: path.join(__dirname, 'files')
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("readFile", (event, args) => {
  fs.access(`./files/${args}`, fs.constants.R_OK, e => {
    if(e) {
      // if file doesnt exist, create one with empty array
      fs.writeFile(`./files/${args}`, '[]', (error) => {
        if(error){
          console.log("fs write error: ", error);
        } else {
          // then read and send to react
          fs.readFile(`./files/${args}`, "utf8", (error, data) => {
            if(error){
              console.log("fs read error: ", error);
              win.webContents.send("receiveFile", ['error', error]);
            } else {
              win.webContents.send("receiveFile", [args, data]);
            }
          });
        }
      });
    } else {
      // else read and send to react
      fs.readFile(`./files/${args}`, "utf8", (error, data) => {
        if(error){
          console.log("fs read error: ", error);
          win.webContents.send("receiveFile", ['error', error]);
        } else {
          win.webContents.send("receiveFile", [args, data]);
        }
      });
    }
  });
});

ipcMain.on("saveFile", (event, args) => {
  fs.writeFile(`./files/${args.filePath}`, JSON.stringify(args.data), (error) => {
    if(error){
      console.log("fs write error: ", error);
    }
  });
});