const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('api', {
  getPartial: (name) => {
    const file = path.join(__dirname, 'src', 'partials', `${name}.html`);
    return fs.readFileSync(file, 'utf8');
  },
  // Auth
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

  // Projects
  getProjects: (filters) => ipcRenderer.invoke('projects:getAll', filters),
  createProject: (data) => ipcRenderer.invoke('projects:create', data),
  updateProject: (id, data) => ipcRenderer.invoke('projects:update', { id, data }),
  deleteProject: (id) => ipcRenderer.invoke('projects:delete', id),

  // Manufacturing
  getManufacturing: (projectId) => ipcRenderer.invoke('manufacturing:getAll', projectId),
  updateManufacturingStage: (projectId, stage, status, notes) => 
    ipcRenderer.invoke('manufacturing:updateStage', { projectId, stage, status, notes }),

  // Approvals
  getApprovals: () => ipcRenderer.invoke('approvals:getAll'),
  updateApproval: (id, status, remarks) => ipcRenderer.invoke('approvals:update', { id, status, remarks }),

  // Users
  getUsers: () => ipcRenderer.invoke('users:getAll'),
  createUser: (data) => ipcRenderer.invoke('users:create', data),
  updateUser: (id, data) => ipcRenderer.invoke('users:update', { id, data }),
  deleteUser: (id) => ipcRenderer.invoke('users:delete', id),

  // Export
  exportCSV: (type) => ipcRenderer.invoke('data:exportCSV', type),

  // Window Controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close')
});
