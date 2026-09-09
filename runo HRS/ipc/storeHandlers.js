// ==========================================================================
// RUNO HRS INDIA - Store & Inventory IPC Handlers
// ==========================================================================

const { ipcMain } = require('electron');
const db = require('../db');

function registerStoreHandlers() {
  ipcMain.handle('store:getItems', (event, { category, search }) => {
    return db.store.getItems(category, search);
  });

  ipcMain.handle('store:getGodowns', (event, search) => {
    return db.store.getGodowns(search);
  });

  ipcMain.handle('store:createItem', (event, itemData) => {
    return db.store.createItem(itemData);
  });

  ipcMain.handle('store:getTransactions', (event, { tabType, search }) => {
    return db.store.getTransactions(tabType, search);
  });

  ipcMain.handle('store:createTransaction', (event, txData) => {
    return db.store.createTransaction(txData);
  });

  ipcMain.handle('store:getStats', () => {
    return db.store.getStats();
  });

  ipcMain.handle('store:getReorderList', () => {
    return db.store.getReorderList();
  });

  ipcMain.handle('store:getStockLedger', () => {
    return db.store.getStockLedger();
  });
}

module.exports = registerStoreHandlers;
