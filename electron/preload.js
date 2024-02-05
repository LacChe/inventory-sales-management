const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
  readFile: (fileName) => ipcRenderer.invoke("readFile", fileName),
  event: (message = "defaultMessage") => ipcRenderer.invoke("event", message),
});
