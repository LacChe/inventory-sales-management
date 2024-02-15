const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  readFile: (fileName) => ipcRenderer.invoke("readFile", fileName),
  saveFile: (fileName, data) => ipcRenderer.invoke("saveFile", fileName, data),
  event: (message = "defaultMessage") => ipcRenderer.invoke("event", message),
});
