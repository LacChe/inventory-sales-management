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
    icon: 'icon.png',
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
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
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
  fs.access(`./${args}`, fs.constants.R_OK, e => {
    if(e) {
      let data = [];
      // if file doesnt exist, create one with empty array
      if(args === 'settings.json') data = {
        "search": "",
        "filter": "",
        "inventory": {
            "order": {
              "field": "name_en",
              "asc": true
            },
            "showInventoryDataFields": [
                "name_en",
                "amount",
                "country",
                "size"
            ],
            "inventoryDataFields": [
                {
                    "name": "id",
                    "type": "string"
                },
                {
                    "name": "amount",
                    "type": "formula"
                },
                {
                    "name": "name_en",
                    "type": "string"
                },
                {
                    "name": "name_cn",
                    "type": "string"
                },
                {
                    "name": "size",
                    "type": "string"
                },
                {
                    "name": "manufacturer",
                    "type": "string"
                },
                {
                    "name": "country",
                    "type": "string"
                },
                {
                    "name": "reminder_amount",
                    "type": "number"
                },
                {
                    "name": "notes",
                    "type": "string"
                }
            ]
        },
        "product": {
            "order": {
              "field": "name_en",
              "asc": true
            },
            "showProductDataFields": [
                "price",
                "name_en",
                "size"
            ],
            "productDataFields": [
                {
                    "name": "id",
                    "type": "string"
                },
                {
                    "name": "name_en",
                    "type": "string"
                },
                {
                    "name": "name_cn",
                    "type": "string"
                },
                {
                    "name": "size",
                    "type": "string"
                },
                {
                    "name": "inventory_items",
                    "type": "dropdown"
                },
                {
                    "name": "price",
                    "type": "string"
                },
                {
                    "name": "sale_price",
                    "type": "string"
                },
                {
                    "name": "notes",
                    "type": "string"
                }
            ]
        },
        "equipment": {
            "order": {
              "field": "name_en",
              "asc": true
            },
            "showEquipmentDataFields": [],
            "equipmentDataFields": [
                {
                    "name": "id",
                    "type": "string"
                },
                {
                    "name": "name_en",
                    "type": "string"
                },
                {
                    "name": "name_cn",
                    "type": "string"
                },
                {
                    "name": "date_bought",
                    "type": "date"
                },
                {
                    "name": "manufacturer",
                    "type": "string"
                },
                {
                    "name": "notes",
                    "type": "string"
                }
            ]
        },
        "transaction": {
            "order": {
                "field": "name_en",
                "asc": true
            },
            "showTransactionDataFields": [
                "revenue",
                "date",
                "amount",
                "notes",
                "name_en"
            ],
            "transactionDataFields": [
                {
                    "name": "id",
                    "type": "string"
                },
                {
                    "name": "date",
                    "type": "date"
                },
                {
                    "name": "name_en",
                    "type": "formula"
                },
                {
                    "name": "name_cn",
                    "type": "formula"
                },
                {
                    "name": "product_id",
                    "type": "dropdown"
                },
                {
                    "name": "amount",
                    "type": "number"
                },
                {
                    "name": "revenue",
                    "type": "number"
                },
                {
                    "name": "notes",
                    "type": "string"
                },
                {
                    "name": "not_a_sale",
                    "type": "boolean"
                }
            ]
        },
        "chartData": {
            "records": "",
            "dateRange": "",
            "precision": "",
            "transactions": "",
            "parameter": ""
        }
      }
      fs.writeFile(`./${args}`, JSON.stringify(data), (error) => {
        if(error){
          console.log("fs write error: ", error);
        } else {
          // then read and send to react
          fs.readFile(`./${args}`, "utf8", (error, data) => {
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
      fs.readFile(`./${args}`, "utf8", (error, data) => {
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
  fs.writeFile(`./${args.filePath}`, JSON.stringify(args.data), (error) => {
    if(error){
      console.log("fs write error: ", error);
    }
  });
});