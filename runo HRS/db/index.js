// ==========================================================================
// RUNO HRS INDIA - Master Database Coordinator
// ==========================================================================

const StorageManager = require('./storage');
const seedData = require('./seedData');
const UserRepository = require('./repositories/userRepo');
const CustomerRepository = require('./repositories/customerRepo');
const ProjectRepository = require('./repositories/projectRepo');
const ManufacturingRepository = require('./repositories/mfgRepo');
const ApprovalRepository = require('./repositories/approvalRepo');
const AccountsRepository = require('./repositories/accountsRepo');
const StoreRepository = require('./repositories/storeRepo');

class DatabaseCoordinator {
  constructor() {
    this.storage = new StorageManager();
    this.data = this.storage.read() || this.initSeed();
    this.ensureSchema();

    // Initialize all domain repositories
    this.users = new UserRepository(this);
    this.customers = new CustomerRepository(this);
    this.projects = new ProjectRepository(this);
    this.manufacturing = new ManufacturingRepository(this);
    this.approvals = new ApprovalRepository(this);
    this.accounts = new AccountsRepository(this);
    this.store = new StoreRepository(this);
  }

  initSeed() {
    this.storage.write(seedData);
    return JSON.parse(JSON.stringify(seedData));
  }

  ensureSchema() {
    let modified = false;
    if (!this.data.users || this.data.users.length === 0) {
      this.data.users = seedData.users;
      modified = true;
    }
    // Ensure ANAND admin account exists
    if (!this.data.users.some(u => u.username.toUpperCase() === 'ANAND')) {
      this.data.users.unshift({
        id: 'usr-001',
        username: 'ANAND',
        name: 'Anand Sharma',
        role: 'ADMIN',
        password: 'ADMIN',
        email: 'anand@runohrs.com',
        phone: '+91 98765 43210',
        department: 'Executive Management',
        created_at: '2026-01-15'
      });
      modified = true;
    }

    // Ensure all department users exist
    (seedData.users || []).forEach(su => {
      const idx = this.data.users.findIndex(u => u.username.toUpperCase() === su.username.toUpperCase());
      if (idx === -1) {
        this.data.users.push(su);
        modified = true;
      }
    });

    if (!this.data.customers) { this.data.customers = seedData.customers; modified = true; }
    else {
      (seedData.customers || []).forEach(sc => {
        if (!this.data.customers.some(c => c.id === sc.id || c.customer_code === sc.customer_code)) {
          this.data.customers.push(sc);
          modified = true;
        }
      });
    }

    if (!this.data.projects) { this.data.projects = seedData.projects; modified = true; }
    else {
      (seedData.projects || []).forEach(sp => {
        if (!this.data.projects.some(p => p.id === sp.id || p.project_code === sp.project_code)) {
          this.data.projects.push(sp);
          modified = true;
        }
      });
    }

    // Ensure all projects have quote_status and po_received defaults
    (this.data.projects || []).forEach(p => {
      if (!p.quote_status) { p.quote_status = 'QUOTE SEND'; modified = true; }
      if (!p.po_received) { p.po_received = 'RECEIVED'; modified = true; }
      if (!p.category) { p.category = 'HRS'; modified = true; }
    });

    if (!this.data.manufacturing) { this.data.manufacturing = seedData.manufacturing; modified = true; }
    if (!this.data.approvals) { this.data.approvals = seedData.approvals; modified = true; }
    if (!this.data.storeItems || this.data.storeItems.length === 0) {
      this.data.storeItems = seedData.storeItems;
      modified = true;
    }
    if (!this.data.storeTransactions || this.data.storeTransactions.length === 0) {
      this.data.storeTransactions = seedData.storeTransactions;
      modified = true;
    }
    if (!this.data.accountEntries || this.data.accountEntries.length === 0) {
      this.data.accountEntries = seedData.accountEntries;
      modified = true;
    }
    if (!this.data.projectWorkflows) {
      this.data.projectWorkflows = seedData.projectWorkflows || {};
      modified = true;
    }

    if (modified) {
      this.save();
    }
  }

  save() {
    return this.storage.write(this.data);
  }

  getDashboardStats(filterYear = 'ALL') {
    let projects = this.data.projects || [];
    if (filterYear && filterYear !== 'ALL' && filterYear !== 'ALL PROJECTS') {
      const targetYear = filterYear.toString().replace(/[^0-9]/g, '').slice(0, 4);
      projects = projects.filter(p => (p.year || '').includes(targetYear) || (p.order_date || '').includes(targetYear));
    }

    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const activeProjects = projects.filter(p => p.status !== 'COMPLETED').length;
    const totalUsers = (this.data.users || []).length;
    const totalCustomers = (this.data.customers || []).length;

    const years = ['ALL PROJECTS'];
    for (let y = 2026; y <= 2035; y++) {
      years.push(`FY ${y}-${(y + 1).toString().slice(-2)}`);
    }

    return {
      totalProjects,
      projectUsers: totalUsers,
      customers: totalCustomers,
      activeProjects,
      completedProjects,
      availableYears: years,
      recentProjects: projects.slice(0, 6)
    };
  }

  exportCSV(type = 'PROJECTS') {
    if (type === 'PROJECTS' || type === 'SALES') {
      const headers = ['Project Code', 'Customer', 'Category', 'Quote Status', 'PO Received', 'Mould Description', 'Drops', 'Target Date', 'Status', 'Owner', 'Value'];
      const rows = (this.data.projects || []).map(p => [
        `"${p.project_code || ''}"`, `"${p.customer_name || ''}"`, `"${p.category || 'HRS'}"`,
        `"${p.quote_status || 'PENDING'}"`, `"${p.po_received || 'PENDING'}"`, `"${p.mould_description || ''}"`,
        p.nozzle_count || 1, `"${p.target_date || ''}"`, `"${p.status || 'ACTIVE'}"`, `"${p.owner || ''}"`, `"${p.value || ''}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    if (type === 'COMMERCIAL') {
      const headers = ['Mfg Date', 'Customer', 'Project Name', 'ID Card No', 'Delivery Date', 'Cost', 'HRS Type', 'Material', 'Nozzle Series', 'Gate Type', 'Connector', 'Quote Status'];
      const rows = (this.data.projects || []).map(p => [
        `"${p.order_date || ''}"`, `"${p.customer_name || ''}"`, `"${p.project_code || ''}"`,
        `"${p.id_card_no || ''}"`, `"${p.target_date || ''}"`, `"${p.cost || ''}"`,
        `"${p.category || 'HRS'}"`, `"${p.material || ''}"`, `"${p.nozzle_series || ''}"`,
        `"${p.gate_type || ''}"`, `"${p.connector || ''}"`, `"${p.quote_status || 'PENDING'}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    if (type === 'CUSTOMERS') {
      const headers = ['Company Name', 'Contact Person', 'Phone', 'Email', 'Address', 'GSTIN', 'Total Projects'];
      const rows = (this.data.customers || []).map(c => [
        `"${c.company_name || ''}"`, `"${c.contact_person || ''}"`, `"${c.phone || ''}"`, `"${c.email || ''}"`,
        `"${c.address || ''}"`, `"${c.gstin || ''}"`, c.total_projects || 0
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    if (type === 'ACCOUNTS') {
      const headers = ['Date', 'Type', 'Particulars', 'Ref No', 'Debit', 'Credit', 'Amount', 'Status'];
      const rows = (this.data.accountEntries || []).map(a => [
        `"${a.date}"`, `"${a.tabType}"`, `"${a.particulars}"`, `"${a.refNo}"`, a.debit, a.credit, a.amount, `"${a.status}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    if (type === 'STORE') {
      const headers = ['Date', 'Ref No', 'Item Code', 'Item Name', 'Party / Dept', 'Qty', 'Unit', 'Location', 'Type', 'Status'];
      const rows = (this.data.storeTransactions || []).map(s => [
        `"${s.date}"`, `"${s.refNo}"`, `"${s.itemCode}"`, `"${s.itemName}"`, `"${s.partyOrDept}"`, s.qty, `"${s.unit}"`, `"${s.location}"`, `"${s.tabType}"`, `"${s.status}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    return '';
  }
}

module.exports = new DatabaseCoordinator();
