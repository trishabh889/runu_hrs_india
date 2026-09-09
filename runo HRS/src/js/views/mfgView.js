// ==========================================================================
// RUNO HRS INDIA - Manufacturing Stages View Controller
// ==========================================================================

const stageNames = {
  design_cad: 'Design & CAD',
  cnc_machining: 'CNC Machining',
  gun_drilling: 'Gun Drilling',
  hardening: 'Hardening / Heat Treat',
  assembly: 'Assembly & Nozzles',
  wiring_testing: 'Wiring & Testing',
  final_inspection: 'Inspection & Dispatch'
};

async function loadManufacturing() {
  try {
    const list = await window.api.getManufacturing();
    window.AppState.manufacturing = list;
    const container = document.getElementById('manufacturing-cards-container');
    if (!container) return;
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = '<div style="color: #64748B; text-align: center; padding: 40px;">No active manufacturing records.</div>';
      return;
    }

    list.forEach(m => {
      const proj = m.project || { project_code: 'Unknown', mould_description: 'N/A', customer_name: 'N/A' };
      const card = document.createElement('div');
      card.className = 'mfg-project-card';

      let stageHtml = '';
      Object.keys(stageNames).forEach((key, idx) => {
        const stage = (m.stages && m.stages[key]) || { status: 'PENDING' };
        const statusClass = stage.status.toLowerCase();
        stageHtml += `
          <div class="stage-step ${statusClass}" onclick="advanceStage('${m.project_id}', '${key}', '${stage.status}')" title="Click to advance stage">
            <div class="stage-step-icon">${stage.status === 'COMPLETED' ? '✓' : (idx + 1)}</div>
            <div class="stage-step-name">${stageNames[key]}</div>
            <div style="font-size: 9px; color: ${stage.status === 'COMPLETED' ? '#10B981' : (stage.status === 'IN_PROGRESS' ? '#FF5722' : '#64748B')}; margin-top: 4px; font-weight: 700;">
              ${stage.status}
            </div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="mfg-header">
          <div>
            <div class="mfg-title">${proj.project_code} - ${proj.mould_description}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Customer: <span style="color: var(--text-primary); font-weight: 600;">${proj.customer_name}</span></div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 18px; font-weight: 800; color: #10B981;">${m.overall_progress}%</span>
            <div style="font-size: 10px; color: #64748B; font-weight: 700;">OVERALL PRODUCTION</div>
          </div>
        </div>

        <div class="mfg-progress-wrapper">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${m.overall_progress}%;"></div>
          </div>
        </div>

        <div class="stages-track">
          ${stageHtml}
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load manufacturing:', err);
  }
}

window.advanceStage = async function(projectId, stageKey, currentStatus) {
  let newStatus = 'IN_PROGRESS';
  if (currentStatus === 'PENDING') newStatus = 'IN_PROGRESS';
  else if (currentStatus === 'IN_PROGRESS') newStatus = 'COMPLETED';
  else if (currentStatus === 'COMPLETED') newStatus = 'PENDING';

  const res = await window.api.updateManufacturingStage(projectId, stageKey, newStatus, `Stage updated to ${newStatus}`);
  if (res.success) {
    window.showToast(`Stage updated to ${newStatus}`, 'success');
    loadManufacturing();
  }
};

window.loadManufacturing = loadManufacturing;
