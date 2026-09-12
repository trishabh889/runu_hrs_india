// ==========================================================================
// RUNO HRS MIS - E2E Test: Auth Lifecycle & Approval (AUTH-01, AUTH-02, AUTH-03)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const LoginPage = require('../pages/login.page');
const NavigationPage = require('../pages/navigation.page');

test.describe('Authentication Lifecycle (AUTH-01, AUTH-02, AUTH-03) @smoke', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('AUTH-01: Invalid credentials fail; valid admin credentials grant entry', async () => {
    context = await launchTestApp({ tag: 'auth-valid' });
    const { window } = context;
    const loginPage = new LoginPage(window);
    const navPage = new NavigationPage(window);

    // Logout if auto-session is active to test login form
    await navPage.logout();
    await expect(window.locator('#view-login')).toBeVisible();

    // 1. Attempt invalid login
    await loginPage.login('TESTADMIN', 'INCORRECT_PASS');
    const errMsg = await loginPage.getErrorMessage();
    expect(errMsg).toMatch(/Invalid Username or Password/i);

    // 2. Attempt valid login
    await loginPage.login('TESTADMIN', 'ADMIN');
    await expect(window.locator('#view-main')).toBeVisible();
    
    // Verify user display reflects logged-in admin
    const userText = await navPage.getUserDisplay();
    expect(userText).toMatch(/TESTADMIN/i);
  });

  test('AUTH-02: Logout clears active session and returns to login view', async () => {
    context = await launchTestApp({ tag: 'auth-logout' });
    const { window } = context;
    const navPage = new NavigationPage(window);

    await navPage.logout();
    await expect(window.locator('#view-login')).toBeVisible();
    await expect(window.locator('#view-main')).not.toBeVisible();
  });

  test('AUTH-03: Pending user registration is blocked from login until approval', async () => {
    context = await launchTestApp({ tag: 'auth-reg' });
    const { window } = context;
    const loginPage = new LoginPage(window);
    const navPage = new NavigationPage(window);

    await navPage.logout();
    await loginPage.register({
      username: 'PENDINGTEST',
      name: 'Pending User',
      designation: 'Design Engineer',
      password: 'PASSWORD123'
    });

    // Close any approval modal
    const closeBtn = window.locator('#btn-close-approval');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    // Attempt login with newly registered unapproved account
    await loginPage.switchToLogin();
    await loginPage.login('PENDINGTEST', 'PASSWORD123');

    // Verify approval required modal is triggered and user is not logged in
    const approvalModal = window.locator('#modal-admin-approval-notice');
    await expect(approvalModal).toBeVisible();
    await expect(window.locator('#approval-notice-title')).toHaveText(/APPROVAL REQUIRED/i);
    await expect(window.locator('#view-main')).not.toBeVisible();
  });

  test('AUTH-04: Header profile badge click opens dropdown and allows logout', async () => {
    context = await launchTestApp({ tag: 'auth-header-dropdown' });
    const { window } = context;
    const navPage = new NavigationPage(window);

    // Open profile dropdown
    await navPage.openProfileDropdown();
    await expect(window.locator('#user-profile-dropdown')).toBeVisible();
    await expect(window.locator('#btn-header-logout')).toBeVisible();
    await expect(window.locator('#menu-user-fullname')).toContainText('Anand');

    // Click logout in header dropdown
    await window.locator('#btn-header-logout').click();
    await expect(window.locator('#view-login')).toBeVisible();
    await expect(window.locator('#view-main')).not.toBeVisible();
  });
});

