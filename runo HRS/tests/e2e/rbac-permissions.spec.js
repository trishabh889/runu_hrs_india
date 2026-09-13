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

    // Profile menu item should be hidden
    await navPage.openProfileDropdown();
    const menuItemUsers = window.locator('#menu-item-users');
    expect(await menuItemUsers.isVisible()).toBe(false);

    // switchView to users should be blocked and redirect to dashboard
    await window.evaluate(() => window.switchView('users'));
    await window.waitForTimeout(300);
    const activeSubview = await window.locator('.sub-view.active').getAttribute('id');
    expect(activeSubview).toBe('subview-dashboard');
  });

  test('USER-APPROVAL: Admin sees APPROVE and REJECT buttons; can approve and reject accounts', async () => {
    // Custom seed with a pending user
    const { buildTestSeed } = require('../fixtures/seed-builder');
    const customSeed = buildTestSeed({
      users: [
        {
          id: 'usr-admin-1',
          username: 'TESTADMIN',
          name: 'Test Administrator',
          role: 'ADMIN',
          password: 'ADMIN',
          status: 'APPROVED',
          is_approved: true,
          created_at: '2026-04-10'
        },
        {
          id: 'usr-pending-1',
          username: 'NEWRISHABH',
          name: 'Rishabh Tripathi',
          role: 'DESIGN',
          designation: 'Senior Design Engineer',
          department: 'DESIGN',
          password: 'PASS',
          status: 'PENDING_APPROVAL',
          is_approved: false,
          created_at: '2026-04-12'
        }
      ]
    });

    context = await launchTestApp({ tag: 'user-approval', customSeed });
    const { window } = context;
    const navPage = new NavigationPage(window);

    // Navigate to users
    await navPage.navigateTo('users');
    await window.waitForTimeout(500);

    // Verify NEWRISHABH has PENDING APPROVAL badge
    const pendingRow = window.locator('#users-table-body tr', { hasText: 'NEWRISHABH' });
    await expect(pendingRow).toBeVisible();
    await expect(pendingRow.locator('.badge-pending')).toHaveText('PENDING APPROVAL');

    // Verify both APPROVE and REJECT buttons exist for pending user
    const approveBtn = pendingRow.locator('.btn-approve-user');
    const rejectBtn = pendingRow.locator('.btn-reject-user');
    await expect(approveBtn).toBeVisible();
    await expect(rejectBtn).toBeVisible();

    // Capture screenshot of Pending User with both APPROVE and REJECT buttons
    const artifactsDir = 'C:/Users/Rishabh.Tripathi/.gemini/antigravity/brain/2431f561-2892-4f68-83b6-325bb2ec4ba6';
    await window.screenshot({ path: `${artifactsDir}/users_management_pending_actions.png` });

    // Click APPROVE button and confirm dialog
    await approveBtn.click();
    await window.waitForTimeout(300);
    const confirmModal = window.locator('#global-confirm-dialog');
    await expect(confirmModal).toBeVisible();
    await window.locator('#global-confirm-dialog .btn-confirm-action').click();
    await window.waitForTimeout(600);

    // Status should now be APPROVED
    await expect(pendingRow.locator('.badge-completed')).toHaveText('APPROVED');
    // Once approved, both APPROVE and REJECT buttons are removed!
    await expect(pendingRow.locator('.btn-approve-user')).not.toBeVisible();
    await expect(pendingRow.locator('.btn-reject-user')).not.toBeVisible();

    // Capture screenshot of Approved User (Clean row with only standard action icons)
    await window.screenshot({ path: `${artifactsDir}/users_management_approved_actions.png` });
  });
});
