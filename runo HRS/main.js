const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Bootstrap test isolation before singletons or handlers load when explicitly enabled.
if (process.env.RUNO_TEST_MODE === '1') {
  const configureTestRuntime = require('./testing/configure-test-runtime');
  configureTestRuntime(app);
}

// Fix for Windows GPU / network service crashes
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('no-sandbox');

const logger = require('./logger');

const registerAuthHandlers    = require('./ipc/authHandlers');
const registerProjectHandlers = require('./ipc/projectHandlers');
const registerMfgHandlers     = require('./ipc/mfgHandlers');
const registerAccountsHandlers= require('./ipc/accountsHandlers');
const registerStoreHandlers   = require('./ipc/storeHandlers');
const registerWindowHandlers  = require('./ipc/windowHandlers');

let mainWindow = null;
const sessionState = { currentUser: null };

// ── Global crash catchers ────────────────────────────────────────────────────

process.on('uncaughtException', (err) => {
  logger.uncaughtException(err);
  console.error('[FATAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  logger.unhandledRejection(reason);
  console.error('[FATAL] Unhandled Rejection:', reason);
});

// ── Single-instance lock ─────────────────────────────────────────────────────

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  logger.warn('STARTUP', 'Second instance blocked — another instance is already running');
  app.quit();
} else {
  app.on('second-instance', () => {
    logger.info('STARTUP', 'Second instance attempt — focusing existing window');
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

// ── Window creation ──────────────────────────────────────────────────────────

function createWindow() {
  logger.windowCreated();

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
    icon: process.platform === 'win32'
      ? path.join(__dirname, 'src', 'assets', 'app.ico')
      : path.join(__dirname, 'src', 'assets', 'icon.png'),
    show: false
  });

  const indexPath = path.join(__dirname, 'src', 'index.html');
  logger.info('WINDOW', `Loading: ${indexPath}`);

  mainWindow.loadFile(indexPath).then(() => {
    logger.windowLoaded();
  }).catch(err => {
    logger.error('WINDOW', 'Failed to load index.html', err.stack || err.message);
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show();
  });

  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
      logger.info('WINDOW', 'Window shown to user (ready-to-show)');
    }
  });

  // Safety fallback — always show within 3 seconds
  setTimeout(() => {
    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.isVisible()) {
      logger.warn('WINDOW', 'Window not shown after 3s — forcing visibility');
      mainWindow.show();
      mainWindow.focus();
    }
  }, 3000);

  // Page load failure
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    logger.windowLoadFail(errorCode, errorDescription, validatedURL);
  });

  // Page fully rendered
  mainWindow.webContents.on('did-finish-load', () => {
    logger.info('WINDOW', 'Page fully rendered OK');
  });

  // Renderer process crash
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    logger.rendererCrash(details.reason, details.exitCode);
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        logger.info('WINDOW', 'Reloading window after renderer crash');
        mainWindow.reload();
        mainWindow.show();
      }
    }, 500);
  });

  // Renderer became unresponsive
  mainWindow.webContents.on('unresponsive', () => {
    logger.rendererUnresponsive();
  });

  // Capture JS console errors & warnings from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const levelMap = ['verbose', 'info', 'warning', 'error'];
    const lvl = levelMap[level] || 'verbose';
    if (lvl === 'error') {
      logger.rendererConsoleError(message, sourceId, line);
    } else if (lvl === 'warning') {
      logger.rendererConsoleWarn(message, sourceId, line);
    }
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.on('closed', () => {
    logger.info('WINDOW', 'Main window closed');
    mainWindow = null;
  });
}

// ── IPC handler registration with auto error-logging ─────────────────────────

/**
 * Wraps a handler registration function so every ipcMain.handle()
 * call inside it automatically catches and logs errors to elog.txt.
 * We monkey-patch ipcMain.handle temporarily during registration.
 */
function registerWithLogging(registerFn, ...args) {
  const originalHandle = ipcMain.handle.bind(ipcMain);
  ipcMain.handle = (channel, handler) => {
    return originalHandle(channel, async (event, ...handlerArgs) => {
      try {
        return await handler(event, ...handlerArgs);
      } catch (err) {
        logger.ipcError(channel, err);
        return { success: false, error: err.message || 'Internal server error' };
      }
    });
  };
  registerFn(...args);
  ipcMain.handle = originalHandle; // restore
}

registerWithLogging(registerAuthHandlers,     sessionState);
registerWithLogging(registerProjectHandlers);
registerWithLogging(registerMfgHandlers,      sessionState);
registerWithLogging(registerAccountsHandlers);
registerWithLogging(registerStoreHandlers);
registerWindowHandlers(() => mainWindow); // window handlers use ipcMain.on not handle

// ── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  logger.appStart();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logger.appQuit(0);
    app.quit();
  }
});
