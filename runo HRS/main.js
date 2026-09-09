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

// Enforce single application instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

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

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html')).catch(err => {
    console.error('Failed to load index.html:', err);
  });

  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  });

  // Safety fallback: ensure window shows even if ready-to-show is delayed
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      mainWindow.show();
    }
  }, 1000);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Window failed to load:', errorCode, errorDescription);
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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in Main Process:', err);
});
