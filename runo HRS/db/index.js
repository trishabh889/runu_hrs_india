const StorageManager = require('./storage');
const seedData = require('./seedData');
const UserRepository = require('./repositories/userRepo');
const CustomerRepository = require('./repositories/customerRepo');
const ProjectRepository = require('./repositories/projectRepo');
const ManufacturingRepository = require('./repositories/mfgRepo');
const ApprovalRepository = require('./repositories/approvalRepo');

class DatabaseCoordinator {
  constructor() {
    this.storage = new StorageManager();
    this.data = this.storage.read() || this.initSeed();

    // Initialize entity repositories
    this.users = new UserRepository(this);
    this.customers = new CustomerRepository(this);
    this.projects = new ProjectRepository(this);
    this.manufacturing = new ManufacturingRepository(this);
    this.approvals = new ApprovalRepository(this);
  }

  initSeed() {
    this.storage.write(seedData);
    return seedData;
  }

  save() {
    return this.storage.write(this.data);
  }

  getDashboardStats(filterYear = 'ALL') {
    let projects = this.data.projects;
    if (filterYear && filterYear !== 'ALL') {
      projects = projects.filter(p => p.year === filterYear);
    }

    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const activeProjects = projects.filter(p => p.status !== 'COMPLETED').length;
    const totalUsers = this.data.users.length;
    const totalCustomers = this.data.customers.length;

    const years = Array.from(new Set(this.data.projects.map(p => p.year))).sort().reverse();
    if (!years.includes('2026')) years.unshift('2026');

    return {
      totalProjects,
      projectUsers: totalUsers,
      customers: totalCustomers,
      activeProjects,
      completedProjects,
      availableYears: years,
      recentProjects: projects.slice(0, 5)
    };
  }

  exportCSV(type = 'PROJECTS') {
    if (type === 'PROJECTS') {
      const headers = ['Project Code', 'Customer', 'Mould Description', 'Drops', 'Year', 'Target Date', 'Status', 'Priority', 'Value'];
      const rows = this.data.projects.map(p => [
        `"${p.project_code}"`, `"${p.customer_name}"`, `"${p.mould_description}"`,
        p.nozzle_count, p.year, p.target_date, p.status, p.priority, `"${p.value}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    if (type === 'CUSTOMERS') {
      const headers = ['Company Name', 'Contact Person', 'Phone', 'Email', 'Address', 'GSTIN', 'Total Projects'];
      const rows = this.data.customers.map(c => [
        `"${c.company_name}"`, `"${c.contact_person}"`, `"${c.phone}"`, `"${c.email}"`,
        `"${c.address}"`, `"${c.gstin}"`, c.total_projects
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    return '';
  }
}

module.exports = new DatabaseCoordinator();
