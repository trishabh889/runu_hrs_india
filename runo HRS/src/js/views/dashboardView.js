// ==========================================================================
// RUNO HRS INDIA - Dashboard View Controller
// ==========================================================================

function initDashboard() {
  if (window.initCustomDropdowns) window.initCustomDropdowns();
  const yearSelect = document.getElementById('select-dashboard-year');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      loadDashboard(yearSelect.value);
    });
  }
}

async function loadDashboard(year = null) {
  if (window.initCustomDropdowns) window.initCustomDropdowns();
  const yearSelect = document.getElementById('select-dashboard-year');
  const selectedYear = year || (yearSelect ? yearSelect.value : 'ALL');

  try {
    const stats = await window.api.getDashboardStats(selectedYear);

    // Update KPI Card Counters
    document.getElementById('kpi-total-projects').innerText = stats.totalProjects;
    document.getElementById('kpi-project-users').innerText = stats.projectUsers;
    document.getElementById('kpi-customers').innerText = stats.customers;
    document.getElementById('kpi-active-projects').innerText = stats.activeProjects;
    document.getElementById('kpi-completed-projects').innerText = stats.completedProjects;

    // Refresh year filter dropdown if native select
    if (yearSelect && yearSelect.tagName === 'SELECT') {
      const curVal = yearSelect.value;
      yearSelect.innerHTML = '<option value="ALL">ALL PROJECTS</option>';
      stats.availableYears.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.innerText = y;
        if (y === curVal) opt.selected = true;
        yearSelect.appendChild(opt);
      });
    }

    // Populate recent projects preview
    const tbody = document.getElementById('dashboard-recent-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (stats.recentProjects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No recent projects found.</td></tr>';
      return;
    }

    stats.recentProjects.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--brand-orange);">${p.project_code}</td>
        <td style="font-weight: 600; color: var(--text-primary);">${p.customer_name}</td>
        <td style="color: var(--text-secondary);">${p.mould_description}</td>
        <td><span style="font-weight: 700; color: var(--text-primary);">${p.nozzle_count} Drops</span></td>
        <td><span class="badge badge-${p.status === 'COMPLETED' ? 'completed' : 'active'}">${p.status}</span></td>
        <td style="color: var(--text-secondary);">${p.target_date || 'N/A'}</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load dashboard:', err);
  }
}

window.initDashboard = initDashboard;
window.loadDashboard = loadDashboard;
