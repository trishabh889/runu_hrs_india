// ==========================================================================
// RUNO HRS INDIA - Authentication & Registration Controller
// ==========================================================================

function initAuth() {
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorMsg = document.getElementById('login-error');
  const regErrorMsg = document.getElementById('register-error');
  const btnLogout = document.getElementById('btn-logout');

  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');

  function showLoginTab() {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.style.display = 'block';
    formRegister.style.display = 'none';
    errorMsg.style.display = 'none';
    regErrorMsg.style.display = 'none';
  }

  function showRegisterTab() {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.style.display = 'block';
    formLogin.style.display = 'none';
    errorMsg.style.display = 'none';
    regErrorMsg.style.display = 'none';
  }

  tabLogin.addEventListener('click', showLoginTab);
  tabRegister.addEventListener('click', showRegisterTab);
  if (linkToRegister) linkToRegister.addEventListener('click', showRegisterTab);
  if (linkToLogin) linkToLogin.addEventListener('click', showLoginTab);

  // C. Approval Notice Modal Controls
  const modalApproval = document.getElementById('modal-admin-approval-notice');
  const modalApprovalTitle = document.getElementById('approval-notice-title');
  const modalApprovalDesc = document.getElementById('approval-notice-desc');
  const btnCloseApproval = document.getElementById('btn-close-approval-notice');

  function showApprovalModal(title, desc) {
    if (modalApprovalTitle && title) modalApprovalTitle.innerText = title;
    if (modalApprovalDesc && desc) modalApprovalDesc.innerText = desc;
    if (modalApproval) {
      modalApproval.style.display = 'flex';
      modalApproval.classList.add('active');
    }
  }

  function hideApprovalModal() {
    if (modalApproval) {
      modalApproval.style.display = 'none';
      modalApproval.classList.remove('active');
    }
    showLoginTab();
  }

  if (btnCloseApproval) {
    btnCloseApproval.addEventListener('click', hideApprovalModal);
  }
  if (modalApproval) {
    modalApproval.addEventListener('click', (e) => {
      if (e.target === modalApproval) hideApprovalModal();
    });
  }

  // Login submission
  formLogin.addEventListener('submit', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    errorMsg.style.display = 'none';

    try {
      const res = await window.api.login(username, password);
      if (res.success) {
        setSession(res.user);
        usernameInput.value = '';
        passwordInput.value = '';
      } else if (res.pendingApproval) {
        showApprovalModal(
          'ACCOUNT APPROVAL REQUIRED',
          `Admin approve karega tabhi login hoga. User "${username}" is pending administrator approval. Please contact admin.`
        );
      } else {
        errorMsg.innerText = res.message || 'Invalid Username or Password';
        errorMsg.style.display = 'block';
      }
    } catch (err) {
      errorMsg.innerText = 'Error connecting to database';
      errorMsg.style.display = 'block';
    }
  });

  // Registration submission
  formRegister.addEventListener('submit', async () => {
    const username = document.getElementById('reg-username').value.trim();
    const name = document.getElementById('reg-name').value.trim();
    const departmentEl = document.getElementById('reg-department');
    const designationEl = document.getElementById('reg-designation');
    const department = departmentEl ? departmentEl.value : 'DESIGN';
    const designation = designationEl ? designationEl.value.trim() : '';
    const password = document.getElementById('reg-password').value.trim();
    regErrorMsg.style.display = 'none';

    if (!username || !password) {
      regErrorMsg.innerText = 'Username and Password are required!';
      regErrorMsg.style.display = 'block';
      return;
    }

    if (!designation) {
      regErrorMsg.innerText = 'Role / Designation is required!';
      regErrorMsg.style.display = 'block';
      return;
    }

    try {
      const res = await window.api.register({
        username,
        name: name || username,
        role: department,
        designation,
        password,
        department
      });

      if (res.success) {
        formRegister.reset();
        showApprovalModal(
          'REGISTRATION SUCCESSFUL',
          `Account for "${username}" (${department} - ${designation}) has been submitted. Admin approve karega tabhi login hoga. Please contact admin.`
        );
      } else {
        regErrorMsg.innerText = res.message || 'Registration failed!';
        regErrorMsg.style.display = 'block';
      }
    } catch (err) {
      regErrorMsg.innerText = 'Error saving new user';
      regErrorMsg.style.display = 'block';
    }
  });

  if (btnLogout) {
    btnLogout.addEventListener('click', handleLogout);
  }
  initProfileDropdown();
}

async function handleLogout() {
  // Close open profile dropdown
  const profileContainer = document.getElementById('user-profile-container');
  if (profileContainer) {
    profileContainer.classList.remove('open');
    const badge = document.getElementById('btn-user-profile');
    if (badge) badge.setAttribute('aria-expanded', 'false');
  }

  await window.api.logout();
  window.AppState.currentUser = null;
  const viewMain = document.getElementById('view-main');
  const viewLogin = document.getElementById('view-login');
  if (viewMain) {
    viewMain.classList.remove('active');
    viewMain.style.display = 'none';
  }
  if (viewLogin) {
    viewLogin.classList.add('active');
    viewLogin.style.display = 'flex';
  }

  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const errorMsg = document.getElementById('login-error');
  const regErrorMsg = document.getElementById('register-error');
  if (tabLogin && tabRegister && formLogin && formRegister) {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.style.display = 'block';
    formRegister.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
    if (regErrorMsg) regErrorMsg.style.display = 'none';
  }

  window.showToast('Logged out successfully', 'info');
}

function initProfileDropdown() {
  const container = document.getElementById('user-profile-container');
  const badge = document.getElementById('btn-user-profile');

  if (!container || !badge) return;

  function toggleDropdown(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const isOpen = container.classList.toggle('open');
    badge.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function closeDropdown() {
    if (container.classList.contains('open')) {
      container.classList.remove('open');
      badge.setAttribute('aria-expanded', 'false');
    }
  }

  badge.addEventListener('click', toggleDropdown);
  badge.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      closeDropdown();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  // Handle action buttons inside dropdown
  const menuItems = container.querySelectorAll('.profile-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = item.getAttribute('data-action');
      closeDropdown();

      if (action === 'logout') {
        handleLogout();
      } else if (action === 'users') {
        if (window.switchView) window.switchView('users');
      } else if (action === 'change-password') {
        const user = window.AppState && window.AppState.currentUser;
        if (user && window.openChangePasswordModal) {
          window.openChangePasswordModal(user.username);
        }
      } else if (action === 'settings') {
        if (window.switchView) window.switchView('accounts');
      }
    });
  });
}

function applyRBAC(role) {
  const roleUpper = (role || 'ADMIN').toUpperCase();
  const rolePermissions = {
    'ADMIN': ['dashboard', 'projects', 'customers', 'sales', 'commercial', 'design', 'accounts', 'store', 'purchase', 'manufacturing', 'approvals', 'users', 'completed-projects', 'new-project', 'assembly', 'service', 'vendor', 'costing'],
    'CUSTOMER': ['dashboard', 'projects'],
    'VENDOR': ['dashboard', 'store', 'purchase', 'vendor'],
    'SALES': ['dashboard', 'projects', 'customers', 'sales', 'commercial', 'costing', 'completed-projects', 'new-project'],
    'COMMERCIAL': ['dashboard', 'projects', 'customers', 'commercial', 'costing', 'sales', 'completed-projects', 'new-project'],
    'DESIGN': ['dashboard', 'projects', 'design', 'commercial', 'completed-projects'],
    'MANUFACTURING': ['dashboard', 'manufacturing', 'assembly', 'projects'],
    'ACCOUNTS': ['dashboard', 'accounts', 'customers', 'projects', 'costing'],
    'ASSEMBLY': ['dashboard', 'assembly', 'manufacturing', 'projects'],
    'STORE': ['dashboard', 'store', 'purchase', 'vendor'],
    'SERVICE': ['dashboard', 'service', 'projects', 'customers'],
    'PURCHASE': ['dashboard', 'purchase', 'store', 'vendor'],
    'ENGINEER': ['dashboard', 'projects', 'customers', 'sales', 'commercial', 'design', 'manufacturing', 'approvals', 'completed-projects', 'new-project'],
    'OPERATOR': ['dashboard', 'manufacturing']
  };

  const allowed = rolePermissions[roleUpper] || rolePermissions['ADMIN'];

  document.querySelectorAll('.nav-item').forEach(item => {
    const v = item.getAttribute('data-view');
    if (!v) return;
    if (allowed.includes(v)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });

  const usersNav = document.querySelector('.nav-item[data-view="users"]');
  if (usersNav) {
    usersNav.style.display = (roleUpper === 'ADMIN') ? 'flex' : 'none';
  }
}

function setSession(user) {
  window.AppState.currentUser = user;
  const roleDisplay = user.role || 'DESIGN';
  const displayEl = document.getElementById('display-user-info');
  if (displayEl) {
    displayEl.innerText = `LOGGED IN: ${user.username} | ${roleDisplay} ▾`;
  }

  // Populate user profile dropdown details
  const menuName = document.getElementById('menu-user-fullname');
  const menuUser = document.getElementById('menu-username');
  const menuRole = document.getElementById('menu-role-badge');
  const menuInitials = document.getElementById('menu-avatar-initials');
  const itemUsers = document.getElementById('menu-item-users');

  if (menuName) menuName.innerText = user.name || user.username || 'User';
  if (menuUser) menuUser.innerText = `@${user.username}`;
  if (menuRole) menuRole.innerText = roleDisplay;
  if (menuInitials) {
    const displayName = (user.name || user.username || 'U').trim();
    menuInitials.innerText = displayName.charAt(0).toUpperCase();
  }

  // RBAC for User Management in dropdown
  if (itemUsers) {
    const roleUpper = (user.role || '').toUpperCase();
    itemUsers.style.display = (roleUpper === 'ADMIN') ? 'flex' : 'none';
  }

  const viewLogin = document.getElementById('view-login');
  const viewMain = document.getElementById('view-main');
  if (viewLogin) {
    viewLogin.classList.remove('active');
    viewLogin.style.display = 'none';
  }
  if (viewMain) {
    viewMain.classList.add('active');
    viewMain.style.display = 'flex';
  }

  applyRBAC(user.role);
  window.switchView('dashboard');
  window.showToast(`Welcome back, ${user.name || user.username}!`, 'success');
}

window.initAuth = initAuth;
window.setSession = setSession;
window.applyRBAC = applyRBAC;
window.handleLogout = handleLogout;

