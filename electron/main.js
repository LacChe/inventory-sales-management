const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = !app.isPackaged;

if (isDev) {
  require("electron-reload")(path.join(__dirname, "../"), {
    ignored: path.join(__dirname, "../data"),
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
  });
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

  // init event listeners
  require("./eventHandler")();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
