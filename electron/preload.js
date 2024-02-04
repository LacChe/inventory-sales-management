const { ipcRenderer, contextBridge } = require("electron");

// whitelisted channels used to communicate between electron and react code
const validChannels = new Set(["event", "file", "error"]);

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (validChannels.has(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validChannels.has(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
