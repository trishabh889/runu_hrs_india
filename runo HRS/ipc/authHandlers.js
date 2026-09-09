// ==========================================================================
// RUNO HRS INDIA - Auth & Profile Management IPC Handlers
// ==========================================================================

const { ipcMain } = require('electron');
const db = require('../db');

function registerAuthHandlers(sessionState) {
  ipcMain.handle('auth:login', (event, { username, password }) => {
    const res = db.users.authenticate(username, password);
    if (res.success) {
      sessionState.currentUser = res.user;
    }
    return res;
  });

  ipcMain.handle('auth:register', (event, userData) => {
    const res = db.users.create(userData);
    if (res.success) {
      sessionState.currentUser = res.user;
    }
    return res;
  });

  ipcMain.handle('auth:getCurrentUser', () => {
    return sessionState.currentUser;
  });

  ipcMain.handle('auth:logout', () => {
    sessionState.currentUser = null;
    return { success: true };
  });

  // User management handlers
  ipcMain.handle('users:getAll', () => db.users.getAll());
  ipcMain.handle('users:create', (event, data) => db.users.create(data));
  ipcMain.handle('users:update', (event, { id, data }) => db.users.update(id, data));
  ipcMain.handle('users:delete', (event, id) => db.users.delete(id));
  ipcMain.handle('users:changePassword', (event, { username, newPassword }) => {
    return db.users.changePassword(username, newPassword);
  });
}

module.exports = registerAuthHandlers;
