// ==========================================================================
// RUNO HRS MIS - E2E Test: Overview Dashboard & Financial Year (DASH-01)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');
const OverviewPage = require('../pages/overview.page');

test.describe('Overview Dashboard & FY Filters (DASH-01)', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('DASH-01: Overview KPI summary counters match synthetic data', async () => {
    context = await launchTestApp({ tag: 'dash-kpi' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const overviewPage = new OverviewPage(window);

    await navPage.navigateTo('dashboard');
    await window.waitForTimeout(500);

    const stats = await overviewPage.getKpiStats();
    expect(Number(stats.total)).toBeGreaterThanOrEqual(1);
    expect(Number(stats.customers)).toBeGreaterThanOrEqual(1);
    expect(Number(stats.active)).toBeGreaterThanOrEqual(1);
    expect(Number(stats.completed)).toBe(0);
  });

  test('DASH-01: Recent projects list shows active project records', async () => {
    context = await launchTestApp({ tag: 'dash-recent' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const overviewPage = new OverviewPage(window);

    await navPage.navigateTo('dashboard');
    await window.waitForTimeout(500);

    const count = await overviewPage.getRecentRowCount();
    expect(count).toBeGreaterThan(0);

    const recentText = await window.locator('#dashboard-recent-table-body').innerText();
    expect(recentText).toMatch(/RUNO-2026/);
  });
});
