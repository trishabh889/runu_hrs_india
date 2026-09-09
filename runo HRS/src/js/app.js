// ==========================================================================
// RUNO HRS INDIA - Master Application Bootstrapper
// ==========================================================================

function mountPartials() {
  const mapping = {
    'view-login': 'login',
    'subview-dashboard': 'dashboard',
    'subview-customers': 'customers',
    'subview-projects': 'projects',
    'subview-sales': 'sales',
    'subview-commercial': 'commercial',
    'subview-design': 'design',
    'subview-accounts': 'accounts',
    'subview-store': 'store',
    'subview-purchase': 'purchase',
    'subview-completed-projects': 'completed',
    'subview-new-project': 'newProject',
    'subview-manufacturing': 'mfg',
    'subview-approvals': 'approvals',
    'subview-users': 'users',
    'mount-modals': 'modals'
  };

  Object.entries(mapping).forEach(([containerId, partialName]) => {
    const el = document.getElementById(containerId);
    if (el && window.api.getPartial) {
      el.innerHTML = window.api.getPartial(partialName);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Mount HTML partials
  mountPartials();
  if (window.initCustomDropdowns) window.initCustomDropdowns();

  // 2. Initialize domain controllers
  if (window.initTheme) window.initTheme();
  if (window.initAuth) window.initAuth();
  if (window.initNavigation) window.initNavigation();
  if (window.initDashboard) window.initDashboard();
  if (window.initCustomers) window.initCustomers();
  if (window.initProjects) window.initProjects();
  if (window.initSales) window.initSales();
  if (window.initCommercial) window.initCommercial();
  if (window.initDesign) window.initDesign();
  if (window.initAccounts) window.initAccounts();
  if (window.initStore) window.initStore();
  if (window.initPurchase) window.initPurchase();
  if (window.initCompletedProjects) window.initCompletedProjects();
  if (window.initNewProjectForm) window.initNewProjectForm();
  if (window.initUsers) window.initUsers();

  // 3. Restore active session
  try {
    const user = await window.api.getCurrentUser();
    if (user && window.setSession) {
      window.setSession(user);
    }
  } catch (err) {
    console.error('Session check failed:', err);
  }
});

