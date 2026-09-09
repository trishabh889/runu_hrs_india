class ProjectRepository {
  constructor(db) {
    this.db = db;
  }

  getAll(filters = {}) {
    let list = [...this.db.data.projects];

    if (filters.year && filters.year !== 'ALL') {
      list = list.filter(p => p.year === filters.year);
    }
    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'COMPLETED') {
        list = list.filter(p => p.status === 'COMPLETED');
      } else if (filters.status === 'ACTIVE') {
        list = list.filter(p => p.status !== 'COMPLETED');
      } else {
        list = list.filter(p => p.status === filters.status);
      }
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        (p.project_code && p.project_code.toLowerCase().includes(q)) ||
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        (p.mould_description && p.mould_description.toLowerCase().includes(q))
      );
    }
    return list;
  }

  getById(id) {
    return this.db.data.projects.find(p => p.id === id) || null;
  }

  create(projData) {
    const year = new Date().getFullYear().toString();
    const count = this.db.data.projects.filter(p => p.year === year).length + 1;
    const project_code = projData.project_code || `RUNO-${year}-${String(count).padStart(3, '0')}`;

    const customer = this.db.customers.getById(projData.customer_id);
    const customer_name = customer ? customer.company_name : (projData.customer_name || 'General Customer');

    const newProject = {
      id: `proj-${Date.now()}`,
      project_code,
      customer_id: projData.customer_id || '',
      customer_name,
      mould_description: projData.mould_description || 'Hot Runner System',
      nozzle_count: parseInt(projData.nozzle_count) || 1,
      nozzle_type: projData.nozzle_type || 'Standard Valve Gate',
      manifold_type: projData.manifold_type || 'Custom Balanced Manifold',
      runner_diameter: projData.runner_diameter || '10 mm',
      gate_type: projData.gate_type || 'Direct Gate',
      material: projData.material || 'Polypropylene (PP)',
      shot_weight: projData.shot_weight || '',
      year: projData.year || year,
      order_date: projData.order_date || new Date().toISOString().split('T')[0],
      target_date: projData.target_date || '',
      status: projData.status || 'ACTIVE',
      priority: projData.priority || 'MEDIUM',
      project_manager: projData.project_manager || 'Anand Sharma',
      lead_engineer: projData.lead_engineer || 'Vikram Singh',
      value: projData.value || '',
      notes: projData.notes || '',
      created_at: new Date().toISOString().split('T')[0]
    };

    this.db.data.projects.unshift(newProject);

    if (customer) {
      this.db.customers.incrementProjectsCount(customer.id);
    }

    // Auto initialize manufacturing stages
    this.db.manufacturing.initForProject(newProject.id);

    // Auto initialize design approval
    this.db.approvals.initForProject(newProject);

    this.db.save();
    return { success: true, project: newProject };
  }

  update(id, updates) {
    const idx = this.db.data.projects.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, message: 'Project not found' };

    this.db.data.projects[idx] = { ...this.db.data.projects[idx], ...updates };
    this.db.save();
    return { success: true, project: this.db.data.projects[idx] };
  }

  delete(id) {
    this.db.data.projects = this.db.data.projects.filter(p => p.id !== id);
    this.db.data.manufacturing = this.db.data.manufacturing.filter(m => m.project_id !== id);
    this.db.data.approvals = this.db.data.approvals.filter(a => a.project_id !== id);
    this.db.save();
    return { success: true };
  }
}

module.exports = ProjectRepository;
