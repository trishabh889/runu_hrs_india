class ManufacturingRepository {
  constructor(db) {
    this.db = db;
  }

  getAll(projectId = null) {
    if (projectId) {
      return this.db.data.manufacturing.find(m => m.project_id === projectId) || null;
    }

    return this.db.data.manufacturing.map(m => {
      const proj = this.db.data.projects.find(p => p.id === m.project_id);
      return { ...m, project: proj || null };
    });
  }

  initForProject(projectId) {
    const newMfg = {
      project_id: projectId,
      stages: {
        design_cad: { status: 'IN_PROGRESS', completed_date: null, notes: 'Design initiated.' },
        cnc_machining: { status: 'PENDING', completed_date: null, notes: '' },
        gun_drilling: { status: 'PENDING', completed_date: null, notes: '' },
        hardening: { status: 'PENDING', completed_date: null, notes: '' },
        assembly: { status: 'PENDING', completed_date: null, notes: '' },
        wiring_testing: { status: 'PENDING', completed_date: null, notes: '' },
        final_inspection: { status: 'PENDING', completed_date: null, notes: '' }
      },
      current_stage: 'design_cad',
      overall_progress: 10,
      updated_at: new Date().toISOString().split('T')[0]
    };
    this.db.data.manufacturing.push(newMfg);
  }

  updateStage(projectId, stageKey, status, notes = '') {
    let mfg = this.db.data.manufacturing.find(m => m.project_id === projectId);
    if (!mfg) {
      this.initForProject(projectId);
      mfg = this.db.data.manufacturing.find(m => m.project_id === projectId);
    }

    if (mfg.stages[stageKey]) {
      mfg.stages[stageKey].status = status;
      if (status === 'COMPLETED') {
        mfg.stages[stageKey].completed_date = new Date().toISOString().split('T')[0];
      }
      if (notes) mfg.stages[stageKey].notes = notes;
    }

    const stageKeys = ['design_cad', 'cnc_machining', 'gun_drilling', 'hardening', 'assembly', 'wiring_testing', 'final_inspection'];
    let completedCount = 0;
    stageKeys.forEach(k => {
      if (mfg.stages[k] && mfg.stages[k].status === 'COMPLETED') completedCount++;
    });

    mfg.overall_progress = Math.round((completedCount / stageKeys.length) * 100);
    mfg.current_stage = stageKey;
    mfg.updated_at = new Date().toISOString().split('T')[0];

    if (mfg.overall_progress === 100) {
      const proj = this.db.data.projects.find(p => p.id === projectId);
      if (proj) proj.status = 'COMPLETED';
    }

    this.db.save();
    return { success: true, manufacturing: mfg };
  }
}

module.exports = ManufacturingRepository;
