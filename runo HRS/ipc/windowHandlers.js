const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const db = require('../db');

function registerWindowHandlers(getMainWindow) {
  ipcMain.handle('data:exportCSV', async (event, type) => {
    const csvData = db.exportCSV(type);
    const win = getMainWindow();
    const { filePath } = await dialog.showSaveDialog(win, {
      title: `Export ${type} Report`,
      defaultPath: `RUNO_${type}_Report_${new Date().toISOString().split('T')[0]}.csv`,
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });

    if (filePath) {
      fs.writeFileSync(filePath, csvData, 'utf8');
      return { success: true, filePath };
    }
    return { success: false, cancelled: true };
  });

  ipcMain.on('window:minimize', () => {
    const win = getMainWindow();
    if (win) win.minimize();
  });

  ipcMain.on('window:maximize', () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    }
  });

  ipcMain.on('window:close', () => {
    const win = getMainWindow();
    if (win) win.close();
  });
}

module.exports = registerWindowHandlers;
