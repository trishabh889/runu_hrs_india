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
    const role = document.getElementById('reg-role').value;
    const password = document.getElementById('reg-password').value.trim();
    regErrorMsg.style.display = 'none';

    if (!username || !password) {
      regErrorMsg.innerText = 'Username and Password are required!';
      regErrorMsg.style.display = 'block';
      return;
    }

    try {
      const res = await window.api.register({
        username,
        name: name || username,
        role,
        password,
        department: role === 'ADMIN' ? 'Management' : (role === 'OPERATOR' ? 'Machining' : 'Engineering')
      });

      if (res.success) {
        window.showToast(`Account for ${username} created!`, 'success');
        setSession(res.user);
        formRegister.reset();
        showLoginTab();
      } else {
        regErrorMsg.innerText = res.message || 'Registration failed!';
        regErrorMsg.style.display = 'block';
      }
    } catch (err) {
      regErrorMsg.innerText = 'Error saving new user';
      regErrorMsg.style.display = 'block';
    }
  });

  btnLogout.addEventListener('click', async () => {
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
    showLoginTab();
    window.showToast('Logged out successfully', 'info');
  });
}

function setSession(user) {
  window.AppState.currentUser = user;
  document.getElementById('display-user-info').innerText = 
    `LOGGED IN: ${user.username} | ${user.role}`;

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

  window.switchView('dashboard');
  window.showToast(`Welcome back, ${user.name || user.username}!`, 'success');
}

window.initAuth = initAuth;
window.setSession = setSession;
