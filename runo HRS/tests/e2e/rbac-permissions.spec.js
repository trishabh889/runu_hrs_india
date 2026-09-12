// ==========================================================================
// RUNO HRS MIS - E2E Test: Role-Based Access Control (RBAC-01)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const LoginPage = require('../pages/login.page');
const NavigationPage = require('../pages/navigation.page');

test.describe('Role-Based Access Control (RBAC-01)', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('RBAC-01: ADMIN role sees full navigation including user management', async () => {
    context = await launchTestApp({ tag: 'rbac-admin' });
    const { window } = context;
    const navPage = new NavigationPage(window);

    // Verify admin navigation visibility
    expect(await navPage.isNavVisible('dashboard')).toBe(true);
    expect(await navPage.isNavVisible('projects')).toBe(true);
    expect(await navPage.isNavVisible('customers')).toBe(true);
    expect(await navPage.isNavVisible('users')).toBe(true);
  });

  test('RBAC-01: SALES role hides privileged user management and shows sales views', async () => {
    context = await launchTestApp({ tag: 'rbac-sales' });
    const { window } = context;
    const loginPage = new LoginPage(window);
    const navPage = new NavigationPage(window);

    await navPage.logout();
    await loginPage.login('TESTSALES', 'USER123');

    expect(await navPage.isNavVisible('dashboard')).toBe(true);
    expect(await navPage.isNavVisible('sales')).toBe(true);
    expect(await navPage.isNavVisible('customers')).toBe(true);
    expect(await navPage.isNavVisible('users')).toBe(false);
  });
});
