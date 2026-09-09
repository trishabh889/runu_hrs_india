const { ipcMain } = require('electron');
const db = require('../db');

function registerMfgHandlers(sessionState) {
  // Manufacturing handlers
  ipcMain.handle('manufacturing:getAll', (event, projectId) => {
    return db.manufacturing.getAll(projectId);
  });

  ipcMain.handle('manufacturing:updateStage', (event, { projectId, stage, status, notes }) => {
    return db.manufacturing.updateStage(projectId, stage, status, notes);
  });

  // Approvals handlers
  ipcMain.handle('approvals:getAll', () => {
    return db.approvals.getAll();
  });

  ipcMain.handle('approvals:update', (event, { id, status, remarks }) => {
    const user = sessionState.currentUser ? sessionState.currentUser.username : 'ADMIN';
    return db.approvals.updateStatus(id, status, user, remarks);
  });
}

module.exports = registerMfgHandlers;
