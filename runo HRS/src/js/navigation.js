// ==========================================================================
// RUNO HRS INDIA - Navigation & View Router
// ==========================================================================

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewName = item.getAttribute('data-view');
      switchView(viewName);
    });
  });

  // Header and Dashboard Quick Action buttons
  const quickNewProj = document.getElementById('btn-quick-new-project');
  const quickNewCust = document.getElementById('btn-quick-new-customer');
  const quickExport = document.getElementById('btn-quick-export');
  const openCompleted = document.getElementById('btn-open-completed-kpi');
  const navNewProj = document.getElementById('btn-nav-new-proj');

  if (quickNewProj) quickNewProj.addEventListener('click', () => switchView('new-project'));
  if (navNewProj) navNewProj.addEventListener('click', () => switchView('new-project'));
  if (openCompleted) openCompleted.addEventListener('click', () => switchView('completed-projects'));
  if (quickExport) quickExport.addEventListener('click', () => window.api.exportCSV('PROJECTS'));

  if (quickNewCust) {
    quickNewCust.addEventListener('click', () => {
      switchView('customers');
      if (window.openAddCustomerModal) window.openAddCustomerModal();
    });
  }
}

function switchView(viewName) {
  window.AppState.activeView = viewName;

  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-view') === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  document.querySelectorAll('.sub-view').forEach(view => {
    view.classList.remove('active');
  });

  const target = document.getElementById(`subview-${viewName}`);
  if (target) target.classList.add('active');

  // Trigger view refresh
  if (viewName === 'dashboard' && window.loadDashboard) window.loadDashboard();
  else if (viewName === 'customers' && window.loadCustomers) window.loadCustomers();
  else if (viewName === 'projects' && window.loadProjects) window.loadProjects();
  else if (viewName === 'completed-projects' && window.loadCompletedProjects) window.loadCompletedProjects();
  else if (viewName === 'new-project' && window.prepareNewProjectForm) window.prepareNewProjectForm();
  else if (viewName === 'manufacturing' && window.loadManufacturing) window.loadManufacturing();
  else if (viewName === 'approvals' && window.loadApprovals) window.loadApprovals();
  else if (viewName === 'users' && window.loadUsers) window.loadUsers();
}

window.initNavigation = initNavigation;
window.switchView = switchView;
