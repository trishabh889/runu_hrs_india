// ==========================================================================
// RUNO HRS INDIA - Overview / Dashboard View Controller
// ==========================================================================

function getIndianFinancialYears() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 is January, 3 is April
  // Indian Financial Year: April 1 to March 31
  // On or after April 1 (currentMonth >= 3), FY is currentYear-(currentYear+1)
  // Before April 1 (currentMonth < 3), FY is (currentYear-1)-currentYear
  const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
  const currentFY = `${startYear}-${startYear + 1}`;

  const years = [
    { value: 'ALL', label: 'ALL PROJECTS' },
    { value: currentFY, label: `${currentFY} (Current FY)` }
  ];

  // Upcoming FY
  const nextFY = `${startYear + 1}-${startYear + 2}`;
  years.push({ value: nextFY, label: nextFY });

  // Past 4 FYs
  for (let i = 1; i <= 4; i++) {
    const pastFY = `${startYear - i}-${startYear - i + 1}`;
    years.push({ value: pastFY, label: pastFY });
  }

  return { currentFY, years };
}

function renderYearDropdown(activeValue) {
  const menu = document.getElementById('dashboard-year-menu');
  const label = document.getElementById('label-dashboard-year');
  const hiddenInput = document.getElementById('select-dashboard-year');
  if (!menu) return;

  const { currentFY, years } = getIndianFinancialYears();
  const effectiveVal = activeValue || (hiddenInput ? hiddenInput.value : 'ALL') || 'ALL';

  menu.innerHTML = '';
  let activeLabel = 'ALL PROJECTS';

  years.forEach(y => {
    const item = document.createElement('div');
    const isActive = y.value === effectiveVal;
    item.className = 'custom-dropdown-item' + (isActive ? ' active' : '');
    item.dataset.value = y.value;
    item.innerHTML = `
      <span>${y.label}</span>
      <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    `;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (hiddenInput) {
        hiddenInput.value = y.value;
      }
      if (label) {
        label.innerText = y.value === 'ALL' ? 'ALL PROJECTS' : y.value;
      }
      menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const dropdown = document.getElementById('dropdown-dashboard-year');
      if (dropdown) dropdown.classList.remove('open');
      loadDashboard(y.value);
    });

    if (isActive) {
      activeLabel = y.value === 'ALL' ? 'ALL PROJECTS' : y.value;
    }
    menu.appendChild(item);
  });

  if (label) label.innerText = activeLabel;
  if (hiddenInput) hiddenInput.value = effectiveVal;
}

function initDashboard() {
  if (window.initCustomDropdowns) window.initCustomDropdowns();

  // Wire buttons inside dashboard
  const quickNewProj = document.getElementById('btn-quick-new-project');
  const quickNewCust = document.getElementById('btn-quick-new-customer');
  const quickExport = document.getElementById('btn-quick-export');
  const openCompleted = document.getElementById('btn-open-completed-kpi');

  if (quickNewProj) {
    quickNewProj.onclick = () => {
      if (window.switchView) window.switchView('new-project');
    };
  }
  if (openCompleted) {
    openCompleted.onclick = () => {
      if (window.switchView) window.switchView('completed-projects');
    };
  }
  if (quickExport) {
    quickExport.onclick = () => {
      if (window.api && window.api.exportCSV) window.api.exportCSV('PROJECTS');
    };
  }
  if (quickNewCust) {
    quickNewCust.onclick = () => {
      if (window.switchView) {
        window.switchView('customers');
        if (window.openAddCustomerModal) window.openAddCustomerModal();
      }
    };
  }
}

async function loadDashboard(year = null) {
  if (window.initCustomDropdowns) window.initCustomDropdowns();

  initDashboard();

  const hiddenInput = document.getElementById('select-dashboard-year');
  const selectedYear = year !== null ? year : (hiddenInput ? hiddenInput.value : 'ALL');

  renderYearDropdown(selectedYear);

  try {
    const stats = await window.api.getDashboardStats(selectedYear);

    // Update KPI Card Counters
    const totalEl = document.getElementById('kpi-total-projects');
    const usersEl = document.getElementById('kpi-project-users');
    const custEl = document.getElementById('kpi-customers');
    const activeEl = document.getElementById('kpi-active-projects');
    const compEl = document.getElementById('kpi-completed-projects');

    if (totalEl) totalEl.innerText = stats.totalProjects;
    if (usersEl) usersEl.innerText = stats.projectUsers;
    if (custEl) custEl.innerText = stats.customers;
    if (activeEl) activeEl.innerText = stats.activeProjects;
    if (compEl) compEl.innerText = stats.completedProjects;

    // Populate recent projects preview
    const tbody = document.getElementById('dashboard-recent-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const recent = stats.recentProjects || [];
    if (recent.length === 0) {
      const yearLabel = selectedYear === 'ALL' ? '' : ` for FY ${selectedYear}`;
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 26px; font-size: 13px;">No projects found${yearLabel}.</td></tr>`;
      return;
    }

    recent.forEach(p => {
      const tr = document.createElement('tr');
      const isCompleted = p.status === 'COMPLETED';
      tr.innerHTML = `
        <td style="font-weight: 800; color: var(--brand-orange); letter-spacing: 0.5px;">${p.project_code || 'N/A'}</td>
        <td style="font-weight: 600; color: var(--text-primary);">${p.customer_name || 'N/A'}</td>
        <td style="color: var(--text-secondary);">${p.mould_description || 'N/A'}</td>
        <td><span style="font-weight: 700; color: var(--text-primary);">${p.nozzle_count || 1} Drops</span></td>
        <td><span class="badge badge-${(p.status || 'ACTIVE').toLowerCase().replace(/\s+/g, '-')}">${p.status || 'ACTIVE'}</span></td>
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
window.getIndianFinancialYears = getIndianFinancialYears;
