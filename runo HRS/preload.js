const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const ELOG_PATH = path.join(__dirname, 'elog.txt');

contextBridge.exposeInMainWorld('api', {
  getPartial: (name) => {
    const file = path.join(__dirname, 'src', 'partials', `${name}.html`);
    if (fs.existsSync(file)) {
      return fs.readFileSync(file, 'utf8');
    }
    return `<div class="empty-view-state">Partial "${name}" not found.</div>`;
  },

  // Auth & Profile Management
  login: (username, password) => ipcRenderer.invoke('auth:login', { username, password }),
  register: (userData) => ipcRenderer.invoke('auth:register', userData),
  getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser'),
  logout: () => ipcRenderer.invoke('auth:logout'),

  // Dashboard
  getDashboardStats: (year) => ipcRenderer.invoke('dashboard:getStats', year),

  // Customers
  getCustomers: (search) => ipcRenderer.invoke('customers:getAll', search),
  createCustomer: (data) => ipcRenderer.invoke('customers:create', data),
  updateCustomer: (id, data) => ipcRenderer.invoke('customers:update', { id, data }),
  deleteCustomer: (id) => ipcRenderer.invoke('customers:delete', id),

  // Projects, Sales & Commercial
  getProjects: (filters) => ipcRenderer.invoke('projects:getAll', filters),
  createProject: (data) => ipcRenderer.invoke('projects:create', data),
  updateProject: (id, data) => ipcRenderer.invoke('projects:update', { id, data }),
  deleteProject: (id) => ipcRenderer.invoke('projects:delete', id),
  updateQuoteStatus: (id, quoteStatus) => ipcRenderer.invoke('projects:updateQuoteStatus', { id, quoteStatus }),
  updatePO: (id, poReceived) => ipcRenderer.invoke('projects:updatePO', { id, poReceived }),

  // 2D / 3D Design Workflow
  getWorkflow: (projectId) => ipcRenderer.invoke('projects:getWorkflow', projectId),
  setWorkflow: (projectId, step, timestamp) => ipcRenderer.invoke('projects:setWorkflow', { projectId, step, timestamp }),

  // Bulk Data Management
  clearAllSampleData: () => ipcRenderer.invoke('data:clearAllSampleData'),
  resetToDefaultData: () => ipcRenderer.invoke('data:resetToDefaultData'),

  // Manufacturing & Approvals
  getManufacturing: (projectId) => ipcRenderer.invoke('manufacturing:getAll', projectId),
  createManufacturingRecord: (data) => ipcRenderer.invoke('manufacturing:create', data),
  updateManufacturingRecord: (id, data) => ipcRenderer.invoke('manufacturing:update', { id, data }),
  deleteManufacturingRecord: (id) => ipcRenderer.invoke('manufacturing:delete', id),
  updateManufacturingStage: (projectId, stage, status, notes) => 
    ipcRenderer.invoke('manufacturing:updateStage', { projectId, stage, status, notes }),
  getApprovals: () => ipcRenderer.invoke('approvals:getAll'),
  updateApproval: (id, status, remarks) => ipcRenderer.invoke('approvals:update', { id, status, remarks }),

  // Accounts (Tally-Style)
  getAccounts: (tabType, search) => ipcRenderer.invoke('accounts:getAll', { tabType, search }),
  createAccountEntry: (data) => ipcRenderer.invoke('accounts:create', data),
  getAccountsStats: () => ipcRenderer.invoke('accounts:getStats'),
  getAccountsLedger: (search) => ipcRenderer.invoke('accounts:getLedger', search),

  // Store & Inventory (BUSY-Style)
  getStoreItems: (category, search) => ipcRenderer.invoke('store:getItems', { category, search }),
  getGodowns: (search) => ipcRenderer.invoke('store:getGodowns', search),
  createStoreItem: (data) => ipcRenderer.invoke('store:createItem', data),
  getStoreTransactions: (tabType, search) => ipcRenderer.invoke('store:getTransactions', { tabType, search }),
  createStoreTransaction: (data) => ipcRenderer.invoke('store:createTransaction', data),
  getStoreStats: () => ipcRenderer.invoke('store:getStats'),
  getReorderList: () => ipcRenderer.invoke('store:getReorderList'),
  getStockLedger: () => ipcRenderer.invoke('store:getStockLedger'),

  // Purchase Department (Slide 2)
  getPurchaseRequests: (filters) => ipcRenderer.invoke('purchase:getAll', filters),
  createPurchaseRequest: (data) => ipcRenderer.invoke('purchase:create', data),
  updatePurchaseRequest: (id, data) => ipcRenderer.invoke('purchase:update', { id, data }),
  deletePurchaseRequest: (id) => ipcRenderer.invoke('purchase:delete', id),
  getPurchaseStats: () => ipcRenderer.invoke('purchase:getStats'),

  // Users & Password
  getUsers: () => ipcRenderer.invoke('users:getAll'),
  createUser: (data) => ipcRenderer.invoke('users:create', data),
  updateUser: (id, data) => ipcRenderer.invoke('users:update', { id, data }),
  deleteUser: (id) => ipcRenderer.invoke('users:delete', id),
  changePassword: (username, newPassword) => ipcRenderer.invoke('users:changePassword', { username, newPassword }),

  // Data Export
  exportCSV: (type) => ipcRenderer.invoke('data:exportCSV', type),
  exportPDF: (params) => ipcRenderer.invoke('data:exportPDF', params),

  // Window Controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // Error Log (elog.txt)
  readElog: () => {
    try {
      if (fs.existsSync(ELOG_PATH)) return fs.readFileSync(ELOG_PATH, 'utf8');
      return '(No errors logged yet)';
    } catch (e) { return 'Error reading log: ' + e.message; }
  },
  elogPath: ELOG_PATH,
  openElog: () => ipcRenderer.invoke('elog:open')
});
