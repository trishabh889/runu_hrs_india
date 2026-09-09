const { ipcMain } = require('electron');
const db = require('../db');

function registerProjectHandlers() {
  // Dashboard stats
  ipcMain.handle('dashboard:getStats', (event, year) => {
    return db.getDashboardStats(year);
  });

  // Customers handlers
  ipcMain.handle('customers:getAll', (event, search) => db.customers.getAll(search));
  ipcMain.handle('customers:create', (event, data) => db.customers.create(data));
  ipcMain.handle('customers:update', (event, { id, data }) => db.customers.update(id, data));
  ipcMain.handle('customers:delete', (event, id) => db.customers.delete(id));

  // Projects handlers
  ipcMain.handle('projects:getAll', (event, filters) => db.projects.getAll(filters));
  ipcMain.handle('projects:create', (event, data) => db.projects.create(data));
  ipcMain.handle('projects:update', (event, { id, data }) => db.projects.update(id, data));
  ipcMain.handle('projects:delete', (event, id) => db.projects.delete(id));
}

module.exports = registerProjectHandlers;
