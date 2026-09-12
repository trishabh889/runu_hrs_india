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

  if (quickNewProj) quickNewProj.addEventListener('click', () => switchView('new-project'));
  if (openCompleted) openCompleted.addEventListener('click', () => switchView('completed-projects'));
  if (quickExport) quickExport.addEventListener('click', () => window.api.exportCSV('PROJECTS'));

  if (quickNewCust) {
    quickNewCust.addEventListener('click', () => {
      switchView('customers');
      if (window.openAddCustomerModal) window.openAddCustomerModal();
    });
  }

  // Sidebar minimize/expand controls
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnHeaderToggle = document.getElementById('btn-header-toggle-sidebar');
  if (btnToggleSidebar) btnToggleSidebar.addEventListener('click', () => toggleSidebar());
  if (btnHeaderToggle) btnHeaderToggle.addEventListener('click', () => toggleSidebar());

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      toggleSidebar();
    }
  });

  if (localStorage.getItem('runo_sidebar_minimized') === 'true') {
    toggleSidebar(true);
  }
}

function toggleSidebar(forceState) {
  const sidebar = document.querySelector('.app-sidebar');
  if (!sidebar) return;
  const isMinimized = forceState !== undefined ? forceState : !sidebar.classList.contains('minimized');
  sidebar.classList.toggle('minimized', isMinimized);
  localStorage.setItem('runo_sidebar_minimized', isMinimized ? 'true' : 'false');
  const btnToggle = document.getElementById('btn-toggle-sidebar');
  if (btnToggle) {
    btnToggle.title = isMinimized ? 'Expand Sidebar (Ctrl+B)' : 'Minimize Sidebar (Ctrl+B)';
  }
  const btnHeaderToggle = document.getElementById('btn-header-toggle-sidebar');
  if (btnHeaderToggle) {
    btnHeaderToggle.title = isMinimized ? 'Expand Sidebar (Ctrl+B)' : 'Minimize Sidebar (Ctrl+B)';
  }
}

function switchView(viewName) {
  window.AppState.activeView = viewName;

  // Unconditionally remove active state from all nav items to prevent dual highlight
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });

  // Activate matching nav item if one exists for this view
  const activeNav = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (activeNav) {
    activeNav.classList.add('active');
  }

  document.querySelectorAll('.sub-view').forEach(view => {
    view.classList.remove('active');
  });

  const target = document.getElementById(`subview-${viewName}`);
  if (target) target.classList.add('active');

  // Update header context per view
  const headerDeptTitle = document.getElementById('header-dept-title');
  const headerDeptSub = document.getElementById('header-dept-subtitle');
  const globalSearch = document.getElementById('global-header-search');
  const displayUser = document.getElementById('display-user-info');

  const user = window.AppState && window.AppState.currentUser;
  const username = user ? user.username : 'ANAND';
  const userRole = user ? user.role : (viewName === 'purchase' ? 'PURCHASE' : 'MANUFACTURING');

  const deptTitles = {
    'dashboard': 'OVERVIEW DASHBOARD',
    'customers': 'CUSTOMER DIRECTORY',
    'projects': 'PROJECT MANAGEMENT',
    'sales': 'SALES PIPELINE',
    'commercial': 'COMMERCIAL & CONTRACTS',
    'design': 'DESIGN & ENGINEERING',
    'purchase': 'PURCHASE DEPARTMENT',
    'manufacturing': 'MANUFACTURING',
    'accounts': 'ACCOUNTS & FINANCE',
    'assembly': 'ASSEMBLY & TESTING',
    'store': 'STORE & INVENTORY',
    'service': 'CUSTOMER SERVICE & SUPPORT',
    'vendor': 'APPROVED VENDOR DIRECTORY',
    'costing': 'COSTING & ESTIMATION'
  };

  if (headerDeptTitle) {
    headerDeptTitle.innerText = deptTitles[viewName] || viewName.toUpperCase().replace('-', ' ');
  }
  if (headerDeptSub) headerDeptSub.innerText = 'HOT RUNNER SOLUTIONS';
  if (globalSearch) {
    if (viewName === 'purchase') {
      globalSearch.placeholder = 'Search by PR No / Project Code / Item / Vendor...';
    } else if (viewName === 'vendor') {
      globalSearch.placeholder = 'Search by Vendor Name / Code / Commodity...';
    } else if (viewName === 'costing') {
      globalSearch.placeholder = 'Search by Quotation / Project Code / Client...';
    } else {
      globalSearch.placeholder = 'Search by Project Code / Customer / Part Name...';
    }
  }
  if (displayUser) displayUser.innerText = `LOGGED IN: ${username} | ${user ? userRole : 'ADMIN'} ▾`;

  // Trigger view refresh
  if (viewName === 'dashboard' && window.loadDashboard) window.loadDashboard();
  else if (viewName === 'customers' && window.loadCustomers) window.loadCustomers();
  else if (viewName === 'projects' && window.loadProjects) window.loadProjects();
  else if (viewName === 'sales' && window.loadSales) window.loadSales();
  else if (viewName === 'commercial' && window.loadCommercial) window.loadCommercial();
  else if (viewName === 'design' && window.loadDesign) window.loadDesign();
  else if (viewName === 'accounts' && window.loadAccounts) window.loadAccounts();
  else if (viewName === 'store' && window.loadStore) window.loadStore();
  else if (viewName === 'purchase' && window.loadPurchase) window.loadPurchase();
  else if (viewName === 'completed-projects' && window.loadCompletedProjects) window.loadCompletedProjects();
  else if (viewName === 'new-project' && window.prepareNewProjectForm) window.prepareNewProjectForm();
  else if (viewName === 'manufacturing' && window.loadManufacturing) window.loadManufacturing();
  else if (viewName === 'approvals' && window.loadApprovals) window.loadApprovals();
  else if (viewName === 'users' && window.loadUsers) window.loadUsers();
}

window.initNavigation = initNavigation;
window.switchView = switchView;
window.toggleSidebar = toggleSidebar;
