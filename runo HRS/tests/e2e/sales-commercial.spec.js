// ==========================================================================
// RUNO HRS MIS - E2E Test: Sales Pipeline & Commercial Dual Tabs
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');
const DepartmentPage = require('../pages/department.page');

test.describe('Sales & Commercial Department Workflows', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('SALES-01: Filter sales pipeline by category and search keywords', async () => {
    context = await launchTestApp({ tag: 'sales-filters' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const dept = new DepartmentPage(window);

    await nav.navigateTo('sales');
    await window.waitForTimeout(500);

    // Initial fixture project exists
    let rows = await dept.getTableRows('#sales-table-body');
    expect(rows.length).toBeGreaterThan(0);

    // Search by customer name
    await dept.searchSales('Apex');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#sales-table-body');
    expect(rows[0]).toContain('Apex Precision Tools');

    // Filter by category
    await dept.filterSalesCategory('HRS');
    await window.waitForTimeout(400);
    rows = await dept.getTableRows('#sales-table-body');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('SALES-02: Update PO status inline in sales table and verify state', async () => {
    context = await launchTestApp({ tag: 'sales-update' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const dept = new DepartmentPage(window);

    await nav.navigateTo('sales');
    await window.waitForTimeout(500);

    // Update PO status to SUBMITTED
    await dept.updateSalesPoStatus('SUBMITTED');
    await window.waitForTimeout(600);

    const select = window.locator('#sales-table-body select.sales-status-select').first();
    expect(await select.inputValue()).toBe('SUBMITTED');
  });

  test('COMM-01: Commercial tabs switch and quote status filter', async () => {
    context = await launchTestApp({ tag: 'comm-tabs' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const dept = new DepartmentPage(window);

    await nav.navigateTo('commercial');
    await window.waitForTimeout(500);

    // Switch to HRTC tab
    await dept.switchCommercialTab('hrtc');
    const hrtcContainer = window.locator('#container-comm-hrtc');
    expect(await hrtcContainer.isVisible()).toBe(true);

    // Switch back to HRS tab
    await dept.switchCommercialTab('hrs');
    const hrsContainer = window.locator('#container-comm-hrs');
    expect(await hrsContainer.isVisible()).toBe(true);

    // Filter quote status
    await dept.filterCommercialQuote('ALL');
    await window.waitForTimeout(400);
    const rows = await dept.getTableRows('#commercial-table-hrs-body');
    expect(rows.length).toBeGreaterThan(0);
  });

  test('COMM-02: Update commercial status inline and verify reflection', async () => {
    context = await launchTestApp({ tag: 'comm-update' });
    const { window } = context;
    const nav = new NavigationPage(window);
    const dept = new DepartmentPage(window);

    await nav.navigateTo('commercial');
    await window.waitForTimeout(500);

    // Update quote_status to QUOTE SUBMITTED
    await dept.updateCommercialField(0, 'quote_status', 'QUOTE SUBMITTED');
    await window.waitForTimeout(600);

    const select = window.locator('#commercial-table-hrs-body tr select').first();
    expect(await select.inputValue()).toBe('QUOTE SUBMITTED');
  });
});
