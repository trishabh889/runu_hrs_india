// ==========================================================================
// RUNO HRS MIS - E2E Test: Operations (Design, Purchase, Manufacturing)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');
const DepartmentPage = require('../pages/department.page');

test.describe('Operations Department Workflows (Design, Purchase, Mfg)', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('DESIGN-01: Filter design projects by search keyword and status', async () => {
    context = await launchTestApp({ tag: 'design-flow' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const dept = new DepartmentPage(window);

    await nav.navigateTo('design');
    await window.waitForTimeout(500);

    // Initial 28 design projects exist in memory/storage
    let rows = await dept.getTableRows('#design-table-body');
    expect(rows.length).toBeGreaterThan(0);

    // Search for a known customer
    await dept.searchDesign('Tata Motors');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#design-table-body');
    expect(rows.some(r => r.includes('Tata Motors'))).toBe(true);

    // Filter by status ALL
    await dept.filterDesignStatus('ALL');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#design-table-body');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('PURCH-01: Search and filter purchase requisitions', async () => {
    context = await launchTestApp({ tag: 'purch-flow' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const dept = new DepartmentPage(window);

    await nav.navigateTo('purchase');
    await window.waitForTimeout(500);

    // Initial purchase table rows
    let rows = await dept.getTableRows('#purchase-table-body');
    expect(rows.length).toBeGreaterThan(0);

    // Filter by status 'PENDING'
    await dept.filterPurchaseStatus('PENDING');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#purchase-table-body');
    expect(rows.length).toBeGreaterThan(0);

    // Search by keyword
    await dept.searchPurchase('Manifold');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#purchase-table-body');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('MFG-01: Filter manufacturing jobs by status and search keyword', async () => {
    context = await launchTestApp({ tag: 'mfg-flow' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const dept = new DepartmentPage(window);

    await nav.navigateTo('manufacturing');
    await window.waitForTimeout(500);

    // Initial manufacturing jobs
    let rows = await dept.getTableRows('#mfg-table-body');
    expect(rows.length).toBeGreaterThan(0);

    // Search for customer
    await dept.searchMfg('Minda');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#mfg-table-body');
    expect(rows.some(r => r.includes('Minda Automotive'))).toBe(true);

    // Filter by status
    await dept.filterMfgStatus('IN PROGRESS');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#mfg-table-body');
    expect(rows.length).toBeGreaterThan(0);
  });
});
