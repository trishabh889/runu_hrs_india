// ==========================================================================
// RUNO HRS INDIA - Project, Sales, Commercial & Workflow IPC Handlers
// ==========================================================================

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

  // Quote & PO Status Updates
  ipcMain.handle('projects:updateQuoteStatus', (event, { id, quoteStatus }) => {
    return db.projects.update(id, { quote_status: quoteStatus });
  });

  ipcMain.handle('projects:updatePO', (event, { id, poReceived }) => {
    return db.projects.update(id, { po_received: poReceived });
  });

  // 2D / 3D Design Workflow Handlers
  ipcMain.handle('projects:getWorkflow', (event, projectId) => {
    return db.projects.getWorkflow(projectId);
  });

  ipcMain.handle('projects:setWorkflow', (event, { projectId, step, timestamp }) => {
    return db.projects.setWorkflow(projectId, step, timestamp);
  });

  // Bulk data reset / clear handlers
  ipcMain.handle('data:clearAllSampleData', (event) => {
    return db.clearAllSampleData();
  });

  ipcMain.handle('data:resetToDefaultData', (event) => {
    return db.resetToDefaultData();
  });

  // Purchase Requests Handlers (Slide 2)
  ipcMain.handle('purchase:getAll', (event, filters) => db.getPurchaseRequests(filters));
  ipcMain.handle('purchase:create', (event, data) => db.createPurchaseRequest(data));
  ipcMain.handle('purchase:update', (event, { id, data }) => db.updatePurchaseRequest(id, data));
  ipcMain.handle('purchase:delete', (event, id) => db.deletePurchaseRequest(id));
  ipcMain.handle('purchase:getStats', (event) => db.getPurchaseStats());
}

module.exports = registerProjectHandlers;
