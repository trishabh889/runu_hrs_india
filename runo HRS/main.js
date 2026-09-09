const { app, BrowserWindow } = require('electron');
const path = require('path');
const registerAuthHandlers = require('./ipc/authHandlers');
const registerProjectHandlers = require('./ipc/projectHandlers');
const registerMfgHandlers = require('./ipc/mfgHandlers');
const registerAccountsHandlers = require('./ipc/accountsHandlers');
const registerStoreHandlers = require('./ipc/storeHandlers');
const registerWindowHandlers = require('./ipc/windowHandlers');

let mainWindow = null;
const sessionState = { currentUser: null };

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: 'RUNO HRS - MIS | MANAGEMENT INFORMATION SYSTEM',
    backgroundColor: '#0d0f12',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    icon: path.join(__dirname, 'src', 'assets', 'icon.png'),
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register all modular IPC handlers
registerAuthHandlers(sessionState);
registerProjectHandlers();
registerMfgHandlers(sessionState);
registerAccountsHandlers();
registerStoreHandlers();
registerWindowHandlers(() => mainWindow);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
