const { app, ipcMain, BrowserWindow } = require("electron");
const pty = require("node-pty");
const os = require("os");
const path = require("path");
var shell = os.platform() === "win32" ? "powershell.exe" : "zsh";

try {
  require("electron-reloader")(module);
} catch (_) {}

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(app.getAppPath(), "preload.js"),
    },
  });
  mainWindow.maximize();
  mainWindow.show()
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();

  //ipcing
  var ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env,
  });

  ptyProcess.on("data", function (data) {
    mainWindow.webContents.send("terminal.incomingData", data);
  });
  ipcMain.on("terminal.keystroke", (event, key) => {
    ptyProcess.write(key);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
