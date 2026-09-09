// ==========================================================================
// RUNO HRS INDIA - Accounts IPC Handlers
// ==========================================================================

const { ipcMain } = require('electron');
const db = require('../db');

function registerAccountsHandlers() {
  ipcMain.handle('accounts:getAll', (event, { tabType, search }) => {
    return db.accounts.getAll(tabType, search);
  });

  ipcMain.handle('accounts:create', (event, entryData) => {
    return db.accounts.create(entryData);
  });

  ipcMain.handle('accounts:getStats', () => {
    return db.accounts.getStats();
  });

  ipcMain.handle('accounts:getLedger', (event, search) => {
    return db.accounts.getLedger(search);
  });
}

module.exports = registerAccountsHandlers;
