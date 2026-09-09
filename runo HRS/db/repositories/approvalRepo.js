class ApprovalRepository {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.data.approvals.map(a => {
      const proj = this.db.data.projects.find(p => p.id === a.project_id);
      return { ...a, project_details: proj || null };
    });
  }

  initForProject(project) {
    const newApproval = {
      id: `appr-${Date.now()}`,
      project_id: project.id,
      project_code: project.project_code,
      title: `CAD & Manifold Specs for ${project.project_code}`,
      type: 'INITIAL_DESIGN',
      requested_by: project.lead_engineer || 'Vikram Singh',
      approved_by: 'Pending',
      status: 'PENDING',
      submitted_date: new Date().toISOString().split('T')[0],
      action_date: null,
      remarks: 'Awaiting engineering manager sign-off.'
    };
    this.db.data.approvals.unshift(newApproval);
  }

  updateStatus(id, status, approved_by = 'ANAND', remarks = '') {
    const idx = this.db.data.approvals.findIndex(a => a.id === id);
    if (idx === -1) return { success: false, message: 'Approval item not found' };

    this.db.data.approvals[idx].status = status;
    this.db.data.approvals[idx].approved_by = approved_by;
    this.db.data.approvals[idx].action_date = new Date().toISOString().split('T')[0];
    if (remarks) this.db.data.approvals[idx].remarks = remarks;

    this.db.save();
    return { success: true, approval: this.db.data.approvals[idx] };
  }
}

module.exports = ApprovalRepository;
