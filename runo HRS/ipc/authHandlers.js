// ==========================================================================
// RUNO HRS INDIA - Auth & Profile Management IPC Handlers
// ==========================================================================

const { ipcMain } = require('electron');
const db = require('../db');
const authService = require('../services/auth/authService');
const { config } = require('../config');

function registerAuthHandlers(sessionState) {
  ipcMain.handle('auth:login', async (event, { username, password }) => {
    if (config.backend === 'supabase' && config.supabase.isConfigured) {
      const supaRes = await authService.login(username, password);
      if (supaRes.success) {
        sessionState.currentUser = supaRes.user;
        return supaRes;
      }
    }
    const res = db.users.authenticate(username, password);
    if (res.success) {
      sessionState.currentUser = res.user;
    }
    return res;
  });

  ipcMain.handle('auth:register', async (event, userData) => {
    const res = await db.users.create(userData);
    if (res.success && !res.pendingApproval) {
      sessionState.currentUser = res.user;
    }
    return res;
  });

  ipcMain.handle('auth:getCurrentUser', () => {
    return sessionState.currentUser;
  });

  ipcMain.handle('auth:logout', async () => {
    if (config.backend === 'supabase' && config.supabase.isConfigured) {
      await authService.logout();
    }
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
