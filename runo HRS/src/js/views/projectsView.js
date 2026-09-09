// ==========================================================================
// RUNO HRS INDIA - Projects Repository View Controller
// ==========================================================================

function initProjects() {
  if (window.initCustomDropdowns) window.initCustomDropdowns();

  const searchInput = document.getElementById('search-projects');
  if (searchInput) searchInput.addEventListener('input', () => loadProjects());

  const filterSelect = document.getElementById('select-projects-filter');
  if (filterSelect) filterSelect.addEventListener('change', () => loadProjects());

  const btnExport = document.getElementById('btn-export-projects');
  if (btnExport) btnExport.addEventListener('click', () => window.api.exportCSV('PROJECTS'));
}

async function loadProjects() {
  if (window.initCustomDropdowns) window.initCustomDropdowns();
  const searchInput = document.getElementById('search-projects');
  const filterSelect = document.getElementById('select-projects-filter');
  const search = searchInput ? searchInput.value.trim() : '';
  const status = filterSelect ? filterSelect.value : 'ALL';

  try {
    const list = await window.api.getProjects({ search, status });
    window.AppState.projects = list;
    const tbody = document.getElementById('projects-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No projects match current filters.</td></tr>';
      return;
    }

    list.forEach(p => {
      const tr = document.createElement('tr');
      const badgeClass = p.status === 'COMPLETED' ? 'completed' : (p.status === 'PENDING_APPROVAL' ? 'pending' : 'active');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--brand-orange); cursor: pointer;" onclick="viewProjectDetails('${p.id}')">${p.project_code}</td>
        <td style="font-weight: 700; color: var(--text-primary);">${p.customer_name}</td>
        <td style="color: var(--text-secondary);">${p.mould_description}</td>
        <td><span style="font-weight: 700; color: var(--text-primary);">${p.nozzle_count} Drops</span></td>
        <td style="color: var(--text-secondary); font-size: 12px;">${p.target_date || 'N/A'}</td>
        <td><span class="badge badge-${badgeClass}">${p.status}</span></td>

        <td><span style="font-size: 11px; font-weight: 700; color: ${p.priority === 'HIGH' || p.priority === 'CRITICAL' ? '#EF4444' : '#94A3B8'};">${p.priority}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="View Details" onclick="viewProjectDetails('${p.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
            <button class="btn-icon danger" title="Delete" onclick="deleteProject('${p.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

window.viewProjectDetails = function(id) {
  const p = window.AppState.projects.find(item => item.id === id);
  if (!p) return;

  document.getElementById('modal-proj-title').innerText = `SPECIFICATIONS: ${p.project_code}`;
  const content = document.getElementById('modal-proj-content');
  content.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px;">
      <div><span class="form-label">CUSTOMER:</span> <div style="font-weight: 700; color: var(--text-primary); margin-top: 4px;">${p.customer_name}</div></div>
      <div><span class="form-label">STATUS:</span> <div style="margin-top: 4px;"><span class="badge badge-${p.status === 'COMPLETED' ? 'completed' : 'active'}">${p.status}</span></div></div>
      <div style="grid-column: span 2;"><span class="form-label">MOULD DESCRIPTION:</span> <div style="color: var(--text-primary); margin-top: 4px; font-weight: 600;">${p.mould_description}</div></div>
      <div><span class="form-label">NOZZLE DROPS:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.nozzle_count} Drops</div></div>
      <div><span class="form-label">NOZZLE TYPE:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.nozzle_type || 'Standard'}</div></div>
      <div><span class="form-label">MANIFOLD TYPE:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.manifold_type || 'Balanced H13'}</div></div>
      <div><span class="form-label">RUNNER DIAMETER:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.runner_diameter || '10 mm'}</div></div>
      <div><span class="form-label">TARGET DELIVERY:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.target_date || 'N/A'}</div></div>
      <div><span class="form-label">ESTIMATED VALUE:</span> <div style="color: #10B981; font-weight: 700; margin-top: 4px;">${p.value || 'N/A'}</div></div>
      <div style="grid-column: span 2;"><span class="form-label">SPECIAL ENGINEERING NOTES:</span> <div style="color: var(--text-secondary); margin-top: 4px; background: var(--bg-card-hover); padding: 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">${p.notes || 'No special instructions recorded.'}</div></div>
    </div>

    <div class="form-actions" style="margin-top: 20px;">
      <button class="btn-action-primary" onclick="markProjectCompleted('${p.id}')" ${p.status === 'COMPLETED' ? 'disabled style="opacity: 0.5"' : ''}>
        MARK AS COMPLETED
      </button>
      <button class="btn-action-secondary" onclick="closeModal('modal-project-details')">CLOSE</button>
    </div>
  `;
  window.openModal('modal-project-details');
};

window.markProjectCompleted = async function(id) {
  const res = await window.api.updateProject(id, { status: 'COMPLETED' });
  if (res.success) {
    window.showToast('Project marked as completed', 'success');
    window.closeModal('modal-project-details');
    loadProjects();
  }
};

window.deleteProject = async function(id) {
  const confirmed = await window.showConfirmDialog({
    title: 'DELETE TOOLING PROJECT',
    message: 'Are you sure you want to delete this tooling project?',
    subtext: 'Project drawings, manifold specs, and machining logs will be permanently deleted.',
    confirmText: 'DELETE PROJECT',
    cancelText: 'KEEP PROJECT',
    danger: true
  });
  if (!confirmed) return;

  const res = await window.api.deleteProject(id);
  if (res.success) {
    window.showToast('Tooling project deleted successfully', 'info');
    loadProjects();
  }
};

window.initProjects = initProjects;
window.loadProjects = loadProjects;
