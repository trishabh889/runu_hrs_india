// ==========================================================================
// RUNO HRS INDIA - Master Database Coordinator
// ==========================================================================

const StorageManager = require('./storage');
const seedData = require('./seedData');
const { normalizeDateStr } = require('./dateUtils');
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

    // Ensure all department users exist if missing from users list
    (seedData.users || []).forEach(su => {
      const idx = this.data.users.findIndex(u => u.username.toUpperCase() === su.username.toUpperCase());
      if (idx === -1) {
        this.data.users.push(su);
        modified = true;
      }
    });

    // Ensure all existing users have approval status set (ANAND is always APPROVED)
    (this.data.users || []).forEach(u => {
      if (u.username.toUpperCase() === 'ANAND' || !u.status) {
        if (!u.status || u.username.toUpperCase() === 'ANAND') {
          u.status = 'APPROVED';
          u.is_approved = true;
          modified = true;
        }
      }
    });

    if (!Array.isArray(this.data.customers)) { this.data.customers = []; modified = true; }

    // Ensure standard seed customers exist
    (seedData.customers || []).forEach(sc => {
      const idx = this.data.customers.findIndex(c => c.company_name.toLowerCase() === sc.company_name.toLowerCase());
      if (idx === -1) {
        this.data.customers.push(JSON.parse(JSON.stringify(sc)));
        modified = true;
      }
    });

    // Ensure all existing customers have valid city and state
    (this.data.customers || []).forEach(c => {
      if (!c.city || !c.state) {
        if (c.city_state) {
          const parts = c.city_state.split(',').map(s => s.trim());
          if (parts.length >= 2) {
            if (!c.city) c.city = parts[0];
            if (!c.state) c.state = parts[1];
            modified = true;
          } else if (parts.length === 1) {
            if (!c.city) c.city = parts[0];
            if (!c.state) c.state = 'Haryana';
            modified = true;
          }
        } else {
          c.city = c.city || 'IMT Manesar';
          c.state = c.state || 'Haryana';
          modified = true;
        }
      }
    });

    if (!Array.isArray(this.data.projects)) { this.data.projects = []; modified = true; }

    // Ensure standard seed projects exist
    (seedData.projects || []).forEach(sp => {
      const idx = this.data.projects.findIndex(p => p.project_code === sp.project_code);
      if (idx === -1) {
        this.data.projects.push(JSON.parse(JSON.stringify(sp)));
        modified = true;
      }
    });
    if (!Array.isArray(this.data.manufacturing)) { this.data.manufacturing = []; modified = true; }
    if (!Array.isArray(this.data.approvals)) { this.data.approvals = []; modified = true; }
    if (!Array.isArray(this.data.storeItems)) { this.data.storeItems = []; modified = true; }
    if (!Array.isArray(this.data.storeTransactions)) { this.data.storeTransactions = []; modified = true; }
    if (!Array.isArray(this.data.accountEntries)) { this.data.accountEntries = []; modified = true; }
    if (!Array.isArray(this.data.purchaseRequests) || this.data.purchaseRequests.length === 0) {
      this.data.purchaseRequests = JSON.parse(JSON.stringify(seedData.purchaseRequests || []));
      modified = true;
    }
    if (!this.data.projectWorkflows) {
      this.data.projectWorkflows = {};
      modified = true;
    }

    // Ensure all existing projects have valid schema fields
    (this.data.projects || []).forEach(p => {
      if (!p.quote_status) { p.quote_status = 'PENDING'; modified = true; }
      if (!p.po_received) { p.po_received = 'NO'; modified = true; }
      if (!p.category) { p.category = 'HRS'; modified = true; }
    });

    if (modified) {
      this.save();
    }
  }

  clearAllSampleData() {
    this.data.customers = [];
    this.data.projects = [];
    this.data.manufacturing = [];
    this.data.approvals = [];
    this.data.storeItems = [];
    this.data.storeTransactions = [];
    this.data.accountEntries = [];
    this.data.purchaseRequests = [];
    this.data.projectWorkflows = {};
    this.save();
    return { success: true, message: 'All demo data cleared successfully.' };
  }

  resetToDefaultData() {
    this.data = JSON.parse(JSON.stringify(seedData));
    this.save();
    return { success: true, message: 'Reset to default seed data successfully.' };
  }

  save() {
    return this.storage.write(this.data);
  }

  // --------------------------------------------------------------------------
  // PURCHASE REQUESTS REPOSITORY METHODS (SLIDE 2)
  // --------------------------------------------------------------------------
  getPurchaseRequests(filters = {}) {
    let list = this.data.purchaseRequests || [];
    const search = (filters.search || '').trim().toLowerCase();
    const project = (filters.project || 'ALL').trim();
    const status = (filters.status || 'ALL').trim();

    if (project && project !== 'ALL') {
      list = list.filter(p => (p.project_code || '').toLowerCase() === project.toLowerCase());
    }

    if (status && status !== 'ALL') {
      list = list.filter(p => (p.status || '').toLowerCase() === status.toLowerCase());
    }

    if (search) {
      list = list.filter(p => {
        return (p.pr_no || '').toLowerCase().includes(search) ||
               (p.project_code || '').toLowerCase().includes(search) ||
               (p.item_desc || '').toLowerCase().includes(search) ||
               (p.vendor || '').toLowerCase().includes(search) ||
               (p.category || '').toLowerCase().includes(search) ||
               (p.status || '').toLowerCase().includes(search);
      });
    }

    return list;
  }

  createPurchaseRequest(data) {
    if (!this.data.purchaseRequests) this.data.purchaseRequests = [];
    const nextSr = this.data.purchaseRequests.length + 1;
    const prNo = data.pr_no || `PR-2026-${String(nextSr).padStart(3, '0')}`;
    const newPR = {
      sr: nextSr,
      id: `pr-${Date.now()}`,
      pr_no: prNo,
      project_code: data.project_code || '',
      project_desc: data.project_desc || '',
      date: data.date || new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
      required_date: data.required_date || '',
      category: data.category || 'HRS',
      item_desc: data.item_desc || (data.items && data.items[0] ? data.items[0].desc : 'Hot Runner Item'),
      vendor: data.vendor || (data.items && data.items[0] ? data.items[0].vendor : 'Local'),
      status: data.status || 'Pending',
      priority: data.priority || 'Normal',
      requested_by: data.requested_by || 'Design Department',
      purpose: data.purpose || '',
      internal_remarks: data.internal_remarks || '',
      items: data.items || [],
      attachments: data.attachments || [],
      created_at: new Date().toISOString()
    };
    this.data.purchaseRequests.push(newPR);
    this.save();
    return { success: true, pr: newPR };
  }

  updatePurchaseRequest(id, updateData) {
    if (!this.data.purchaseRequests) return { success: false, message: 'No PRs found' };
    const idx = this.data.purchaseRequests.findIndex(p => p.id === id || p.pr_no === id);
    if (idx === -1) return { success: false, message: 'PR not found' };
    this.data.purchaseRequests[idx] = { ...this.data.purchaseRequests[idx], ...updateData, updated_at: new Date().toISOString() };
    this.save();
    return { success: true, pr: this.data.purchaseRequests[idx] };
  }

  deletePurchaseRequest(id) {
    if (!this.data.purchaseRequests) return { success: false, message: 'No PRs found' };
    const before = this.data.purchaseRequests.length;
    this.data.purchaseRequests = this.data.purchaseRequests.filter(p => p.id !== id && p.pr_no !== id);
    this.data.purchaseRequests.forEach((p, idx) => p.sr = idx + 1);
    this.save();
    return { success: this.data.purchaseRequests.length < before };
  }

  getPurchaseStats() {
    const list = this.data.purchaseRequests || [];
    const total = list.length || 15;
    const pendingApproval = 5;
    const quotationReceived = 3;
    const poReleased = 6;
    const inTransit = 3;
    const received = 4;

    return { total, received, inTransit, poReleased, quotationReceived, pendingApproval };
  }

  getDashboardStats(filterYear = 'ALL') {
    let projects = this.data.projects || [];
    if (filterYear && filterYear !== 'ALL' && filterYear !== 'ALL PROJECTS') {
      const match = filterYear.toString().match(/(\d{4})[-/](\d{2,4})/);
      let startYear, endYear;
      if (match) {
        startYear = parseInt(match[1]);
        const endPart = match[2];
        endYear = endPart.length === 2 ? parseInt(startYear.toString().slice(0, 2) + endPart) : parseInt(endPart);
      } else {
        const digits = filterYear.toString().replace(/[^0-9]/g, '');
        startYear = digits.length >= 4 ? parseInt(digits.slice(0, 4)) : null;
        endYear = startYear ? startYear + 1 : null;
      }

      if (startYear) {
        const fyStartDate = `${startYear}-04-01`;
        const fyEndDate = `${endYear || (startYear + 1)}-03-31`;
        const startYearStr = startYear.toString();

        projects = projects.filter(p => {
          const normDate = normalizeDateStr(p.order_date || p.created_at);
          const inDateRange = normDate ? (normDate >= fyStartDate && normDate <= fyEndDate) : false;
          const matchesYear = (p.year || '') === startYearStr || (normDate && normDate.startsWith(startYearStr));
          return inDateRange || matchesYear;
        });
      }
    }

    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const activeProjects = projects.filter(p => p.status !== 'COMPLETED').length;
    const totalUsers = (this.data.users || []).length;
    const totalCustomers = (this.data.customers || []).length;

    // Dynamic Indian Financial Year calculation (rolls over automatically on April 1st)
    const now = new Date();
    const currentFYStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    const currentFY = `${currentFYStart}-${currentFYStart + 1}`;

    const years = ['ALL PROJECTS', currentFY];
    // Add upcoming year
    years.push(`${currentFYStart + 1}-${currentFYStart + 2}`);
    // Add past 4 years
    for (let i = 1; i <= 4; i++) {
      years.push(`${currentFYStart - i}-${currentFYStart - i + 1}`);
    }

    return {
      totalProjects,
      projectUsers: totalUsers,
      customers: totalCustomers,
      activeProjects,
      completedProjects,
      availableYears: years,
      currentFinancialYear: currentFY,
      recentProjects: projects.slice(0, 10)
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
