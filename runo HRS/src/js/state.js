// ==========================================================================
// RUNO HRS INDIA - Global State Management
// ==========================================================================

const AppState = {
  currentUser: null,
  activeView: 'dashboard',
  customers: [],
  projects: [],
  manufacturing: [],
  approvals: [],
  users: []
};

window.AppState = AppState;
