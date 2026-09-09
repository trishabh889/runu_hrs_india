// ==========================================================================
// RUNO HRS INDIA - Completed Projects Archive View Controller
// ==========================================================================

function initCompletedProjects() {
  const btnExport = document.getElementById('btn-export-completed');
  if (btnExport) {
    btnExport.addEventListener('click', () => window.api.exportCSV('PROJECTS'));
  }
}

async function loadCompletedProjects() {
  try {
    const list = await window.api.getProjects({ status: 'COMPLETED' });
    const tbody = document.getElementById('completed-projects-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #64748B;">No completed projects recorded yet.</td></tr>';
      return;
    }

    list.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: #10B981; cursor: pointer;" onclick="viewProjectDetails('${p.id}')">${p.project_code}</td>
        <td>${p.customer_name}</td>
        <td>${p.mould_description}</td>
        <td>${p.nozzle_count} Drops</td>
        <td>${p.target_date || 'N/A'}</td>
        <td><span class="badge badge-completed">COMPLETED</span></td>
        <td>
          <button class="btn-icon" title="View Details" onclick="viewProjectDetails('${p.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Failed to load completed projects:', e);
  }
}

window.initCompletedProjects = initCompletedProjects;
window.loadCompletedProjects = loadCompletedProjects;
