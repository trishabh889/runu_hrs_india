const { ipcMain, dialog, BrowserWindow, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require('../db');

function registerWindowHandlers(getMainWindow) {
  // Open error log file in default text editor
  const elogPath = path.join(__dirname, '..', 'elog.txt');
  ipcMain.handle('elog:open', async () => {
    if (!fs.existsSync(elogPath)) {
      fs.writeFileSync(elogPath, '(No errors logged yet)\n', 'utf8');
    }
    await shell.openPath(elogPath);
    return { success: true };
  });

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

  ipcMain.handle('data:exportPDF', async (event, { html, title, filename }) => {
    const win = getMainWindow();
    const defaultName = filename || `RUNO_${(title || 'REPORT').replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    const { filePath, canceled } = await dialog.showSaveDialog(win, {
      title: `Export PDF - ${title || 'RUNO HRS REPORT'}`,
      defaultPath: defaultName,
      filters: [{ name: 'PDF Documents (*.pdf)', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) {
      return { success: false, cancelled: true };
    }

    const printWindow = new BrowserWindow({
      show: false,
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    const tempHtmlPath = path.join(os.tmpdir(), `runo_print_${Date.now()}_${Math.random().toString(36).slice(2)}.html`);
    fs.writeFileSync(tempHtmlPath, html, 'utf8');

    try {
      await printWindow.loadFile(tempHtmlPath);
      await new Promise(resolve => setTimeout(resolve, 250));

      const pdfBuffer = await printWindow.webContents.printToPDF({
        printBackground: true,
        landscape: true,
        pageSize: 'A4',
        margins: {
          top: 0.35,
          bottom: 0.35,
          left: 0.35,
          right: 0.35
        }
      });

      fs.writeFileSync(filePath, pdfBuffer);

      // Automatically open the exported PDF file for the user
      try {
        shell.openPath(filePath);
      } catch (e) {}

      return { success: true, filePath };
    } catch (err) {
      console.error('PDF export error:', err);
      return { success: false, error: err.message };
    } finally {
      try { printWindow.destroy(); } catch (e) {}
      try { if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath); } catch (e) {}
    }
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
