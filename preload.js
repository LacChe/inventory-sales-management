const { ipcRenderer, contextBridge } = require('electron');

const validChannels = ["readFile", "receiveFile", "saveFile"];

contextBridge.exposeInMainWorld(
  "api", {
      send: (channel, data) => {
          if (validChannels.includes(channel)) {
              ipcRenderer.send(channel, data);
          }
      },
      receive: (channel, func) => {
          if (validChannels.includes(channel)) {
              // Deliberately strip event as it includes `sender` 
              ipcRenderer.on(channel, (event, ...args) => func(...args));
          }
      }
  }
);