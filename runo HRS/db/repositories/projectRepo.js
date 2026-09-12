// ==========================================================================
// RUNO HRS INDIA - Project Repository (Sales, Commercial & Design Lifecycle)
// ==========================================================================

const { normalizeDateStr, isDateInRange } = require('../dateUtils');

class ProjectRepository {
  constructor(db) {
    this.db = db;
  }

  getAll(filters = {}) {
    let list = [...(this.db.data.projects || [])];

    if (filters.startDate || filters.endDate) {
      list = list.filter(p => isDateInRange(p.order_date || p.target_date || p.created_at, filters.startDate, filters.endDate));
    }

    if (filters.year && filters.year !== 'ALL' && filters.year !== 'ALL PROJECTS') {
      const match = filters.year.toString().match(/(\d{4})[-/](\d{2,4})/);
      if (match) {
        const startYr = parseInt(match[1]);
        const endPart = match[2];
        const endYr = endPart.length === 2 ? parseInt(startYr.toString().slice(0, 2) + endPart) : parseInt(endPart);
        const fyStart = `${startYr}-04-01`;
        const fyEnd = `${endYr}-03-31`;
        list = list.filter(p => {
          const norm = normalizeDateStr(p.order_date || p.created_at);
          if (norm && norm >= fyStart && norm <= fyEnd) return true;
          return (p.year || '') === startYr.toString();
        });
      } else {
        const targetYear = filters.year.toString().replace(/[^0-9]/g, '').slice(0, 4);
        list = list.filter(p => {
          const norm = normalizeDateStr(p.order_date || p.created_at);
          return (p.year || '').includes(targetYear) || (norm && norm.startsWith(targetYear));
        });
      }
    }

    if (filters.status && filters.status !== 'ALL') {
      if (filters.status === 'COMPLETED') {
        list = list.filter(p => p.status === 'COMPLETED');
      } else if (filters.status === 'ACTIVE') {
        list = list.filter(p => p.status !== 'COMPLETED');
      } else {
        list = list.filter(p => (p.status || '').toUpperCase() === filters.status.toUpperCase());
      }
    }

    if (filters.category && filters.category !== 'ALL' && filters.category !== 'ALL CATEGORIES') {
      list = list.filter(p => (p.category || 'HRS').toUpperCase() === filters.category.toUpperCase());
    }

    if (filters.quoteStatus && filters.quoteStatus !== 'ALL') {
      list = list.filter(p => (p.quote_status || 'PENDING').toUpperCase() === filters.quoteStatus.toUpperCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        (p.project_code && p.project_code.toLowerCase().includes(q)) ||
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        (p.mould_description && p.mould_description.toLowerCase().includes(q)) ||
        (p.id_card_no && p.id_card_no.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.owner && p.owner.toLowerCase().includes(q))
      );
    }

    return list;
  }

  getById(id) {
    return (this.db.data.projects || []).find(p => p.id === id || p.project_code === id) || null;
  }

  create(projData) {
    const year = new Date().getFullYear().toString();
    const count = (this.db.data.projects || []).filter(p => p.year === year).length + 1;
    const project_code = projData.project_code || `RUNO-${year}-${String(count).padStart(3, '0')}`;

    const customer = this.db.customers.getById(projData.customer_id);
    const customer_name = customer ? customer.company_name : (projData.customer_name || 'General Customer');

    const newProject = {
      id: `proj-${Date.now()}`,
      project_code,
      customer_id: projData.customer_id || '',
      customer_name,
      mould_description: projData.mould_description || 'Hot Runner System',
      category: (projData.category || 'HRS').toUpperCase(),
      quote_status: (projData.quote_status || 'PENDING').toUpperCase(),
      po_received: (projData.po_received || 'PENDING').toUpperCase(),
      nozzle_count: parseInt(projData.nozzle_count) || 1,
      nozzle_type: projData.nozzle_type || 'Valve Gate Pneumatic',
      manifold_type: projData.manifold_type || 'Balanced Manifold H13',
      runner_diameter: projData.runner_diameter || '12 mm',
      gate_type: projData.gate_type || 'Valve Gate 2.5mm',
      material: projData.plastic_grade || projData.material || 'Polycarbonate (PC)',
      plastic_grade: projData.plastic_grade || projData.material || 'Polycarbonate (PC)',
      shot_weight: projData.part_weight || projData.shot_weight || '',
      part_weight: projData.part_weight || projData.shot_weight || '',
      color_change: projData.color_change || 'NO',
      mould_type: projData.mould_type || 'NEW MOULD',
      year_month: projData.year_month || '',
      year: projData.year || year,
      order_date: projData.order_date || new Date().toISOString().split('T')[0],
      target_date: projData.target_date || '',
      status: projData.status || 'ACTIVE',
      priority: projData.mould_type || projData.priority || 'MEDIUM',
      project_manager: projData.project_manager || 'Anand Sharma',
      lead_engineer: projData.lead_engineer || 'Vikram Singh',
      value: projData.value || '₹ 5,50,000',
      id_card_no: projData.id_card_no || `IDC-${year}-${String(count).padStart(2, '0')}`,
      cost: projData.cost || '550000',
      hrs_type: projData.hrs_type || projData.nozzle_type || 'VALVE - RUNNER',
      nozzle_series: projData.nozzle_series || 'Series 16',
      connector: projData.connector || '16-Pin Heavy Duty',
      gate_dia: projData.gate_dia || '2.5 mm',
      guide_dia: projData.guide_dia || '6.0 mm',
      remark: projData.remark || '',
      design_check: projData.design_check || 'NOT CHECKED',
      owner: projData.owner || 'VIKRAM',
      created_by: projData.created_by || 'SALES',
      notes: projData.notes || 'RUNO_SOURCE=SALES',
      created_at: new Date().toISOString().split('T')[0]
    };

    if (!this.db.data.projects) this.db.data.projects = [];
    this.db.data.projects.unshift(newProject);

    if (customer) {
      this.db.customers.incrementProjectsCount(customer.id);
    }

    // Auto-init workflow milestones
    if (!this.db.data.projectWorkflows) this.db.data.projectWorkflows = {};
    this.db.data.projectWorkflows[newProject.id] = {
      '2dStart': '-',
      '2dEnd': '-',
      '3dStart': '-',
      '3dEnd': '-',
      'designSend': '-'
    };

    // Auto initialize manufacturing stages
    if (this.db.manufacturing && this.db.manufacturing.initForProject) {
      this.db.manufacturing.initForProject(newProject.id);
    }

    // Auto initialize design approval
    if (this.db.approvals && this.db.approvals.initForProject) {
      this.db.approvals.initForProject(newProject);
    }

    this.db.save();
    return { success: true, project: newProject };
  }

  update(id, updates) {
    const idx = (this.db.data.projects || []).findIndex(p => p.id === id || p.project_code === id);
    if (idx === -1) return { success: false, message: 'Project not found' };

    this.db.data.projects[idx] = { ...this.db.data.projects[idx], ...updates };
    this.db.save();
    return { success: true, project: this.db.data.projects[idx] };
  }

  delete(id) {
    this.db.data.projects = (this.db.data.projects || []).filter(p => p.id !== id && p.project_code !== id);
    if (this.db.data.manufacturing) {
      this.db.data.manufacturing = this.db.data.manufacturing.filter(m => m.project_id !== id);
    }
    if (this.db.data.approvals) {
      this.db.data.approvals = this.db.data.approvals.filter(a => a.project_id !== id);
    }
    if (this.db.data.projectWorkflows) {
      delete this.db.data.projectWorkflows[id];
    }
    this.db.save();
    return { success: true };
  }

  // 2D / 3D Design Workflow
  getWorkflow(projectId) {
    if (!this.db.data.projectWorkflows) this.db.data.projectWorkflows = {};
    return this.db.data.projectWorkflows[projectId] || {
      '2dStart': '-',
      '2dEnd': '-',
      '3dStart': '-',
      '3dEnd': '-',
      'designSend': '-'
    };
  }

  setWorkflow(projectId, step, timestamp = null) {
    if (!this.db.data.projectWorkflows) this.db.data.projectWorkflows = {};
    if (!this.db.data.projectWorkflows[projectId]) {
      this.db.data.projectWorkflows[projectId] = {
        '2dStart': '-',
        '2dEnd': '-',
        '3dStart': '-',
        '3dEnd': '-',
        'designSend': '-'
      };
    }

    const nowStr = timestamp || new Date().toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', '');

    this.db.data.projectWorkflows[projectId][step] = nowStr;
    this.db.save();
    return { success: true, workflow: this.db.data.projectWorkflows[projectId] };
  }
}

module.exports = ProjectRepository;
