// ==========================================================================
// RUNO HRS MIS - E2E Test: Admin, Store & Accounts Workflows
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');
const AdminStorePage = require('../pages/admin-store.page');

test.describe('Admin, Store & Accounts Workflows', () => {
  let context = null;

  test.beforeEach(() => {
    test.setTimeout(60000);
  });

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('STORE-01: Add store inventory item and search stock list', async () => {
    context = await launchTestApp({ tag: 'store-flow' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const adminStore = new AdminStorePage(window);

    await nav.navigateTo('store');
    await window.waitForTimeout(500);

    // Switch to ITEM MASTER tab
    await adminStore.switchStoreTab('ITEM MASTER');
    await window.waitForTimeout(400);

    // Add new store item
    await adminStore.addStoreItem({
      code: 'NZ-TIP-SYNTH-99',
      name: 'Synthetic BeCu Nozzle Tip 16mm',
      category: 'NOZZLE COMPONENTS',
      unit: 'NOS'
    });

    await window.waitForTimeout(500);
    await adminStore.switchStoreTab('ITEM MASTER');
    await window.waitForTimeout(400);

    // Search for added item
    await adminStore.searchStore('NZ-TIP-SYNTH-99');
    await window.waitForTimeout(400);

    const rows = await window.locator('#store-table-body tr').allInnerTexts();
    expect(rows.some(r => r.includes('NZ-TIP-SYNTH-99'))).toBe(true);
  });

  test('ACCT-01: Add accounts entry and search ledger items', async () => {
    context = await launchTestApp({ tag: 'acct-flow' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const adminStore = new AdminStorePage(window);

    await nav.navigateTo('accounts');
    await window.waitForTimeout(500);

    // Add account entry
    await adminStore.addAccountEntry({
      particulars: 'Advance Token for Synthetic Mould Order',
      amount: 150000,
      type: 'RECEIPT'
    });

    await window.waitForTimeout(600);

    // Switch to RECEIPT tab and search
    await adminStore.switchAccountsTab('RECEIPT');
    await window.waitForTimeout(400);

    await adminStore.searchAccounts('Advance Token');
    await window.waitForTimeout(400);

    const rows = await window.locator('#accounts-table-body tr').allInnerTexts();
    expect(rows.some(r => r.includes('Advance Token'))).toBe(true);
  });

  test('USER-01: Create new system user and verify in users table', async () => {
    context = await launchTestApp({ tag: 'users-flow' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const adminStore = new AdminStorePage(window);

    await nav.navigateTo('users');
    await window.waitForTimeout(500);

    // Add new user
    await adminStore.addUser({
      username: 'SYNTHENGG',
      name: 'Synthetic Design Engineer',
      department: 'DESIGN',
      password: 'PASS123'
    });

    await window.waitForTimeout(600);

    const rows = await adminStore.getUsersRowTexts();
    expect(rows.some(r => r.includes('SYNTHENGG'))).toBe(true);
  });
});
