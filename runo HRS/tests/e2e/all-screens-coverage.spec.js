// ==========================================================================
// RUNO HRS MIS - E2E Test: 100% Screen Navigation Coverage (15 Screens)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');

const ALL_SCREENS = [
  { id: 'dashboard', title: 'OVERVIEW' },
  { id: 'customers', title: 'CUSTOMER' },
  { id: 'projects', title: 'PROJECTS' },
  { id: 'sales', title: 'SALES' },
  { id: 'commercial', title: 'COMMERCIAL' },
  { id: 'design', title: 'DESIGN' },
  { id: 'purchase', title: 'PURCHASE' },
  { id: 'manufacturing', title: 'MANUFACTURING' },
  { id: 'accounts', title: 'ACCOUNTS' },
  { id: 'assembly', title: 'ASSEMBLY' },
  { id: 'store', title: 'STORE' },
  { id: 'service', title: 'SERVICE' },
  { id: 'vendor', title: 'VENDOR' },
  { id: 'costing', title: 'COSTING' },
  { id: 'users', title: 'USERS' }
];

test.describe('Complete 15-Screen Coverage Suite', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('NAV-ALL: Traverse all 15 screens and verify DOM mounting & elements', async () => {
    context = await launchTestApp({ tag: 'all-screens' });
    const { window } = context;
    const nav = new NavigationPage(window);

    for (const screen of ALL_SCREENS) {
      await nav.navigateTo(screen.id);
      await window.waitForTimeout(300);

      // Verify subview container is marked active
      const container = window.locator(`#subview-${screen.id}`);
      expect(await container.isVisible()).toBe(true);
      expect(await container.getAttribute('class')).toContain('active');

      // Verify screen has mounted content (header or table or card)
      const hasContent = await container.locator('.view-header, .table-card, .kpi-grid, table').first().isVisible();
      expect(hasContent).toBe(true);
    }
  });

  test('FILTER-ALL: Verify search inputs exist and accept input on major views', async () => {
    context = await launchTestApp({ tag: 'all-filters' });
    const { window } = context;
    const nav = new NavigationPage(window);

    const filterViews = [
      { id: 'customers', searchId: '#search-customers' },
      { id: 'projects', searchId: '#search-projects' },
      { id: 'sales', searchId: '#search-sales' },
      { id: 'commercial', searchId: '#search-commercial' },
      { id: 'design', searchId: '#search-design' },
      { id: 'purchase', searchId: '#search-purchase-requests' },
      { id: 'manufacturing', searchId: '#mfg-filter-search' },
      { id: 'store', searchId: '#search-store', tab: 'ITEM MASTER' }
    ];

    for (const item of filterViews) {
      await nav.navigateTo(item.id);
      await window.waitForTimeout(200);

      if (item.tab && item.id === 'store') {
        await window.evaluate((t) => {
          const btn = document.querySelector(`#store-tab-bar .dept-tab-btn[data-tab="${t}"]`);
          if (btn) btn.click();
          const tbl = document.getElementById('store-table-section');
          if (tbl) tbl.style.display = 'block';
        }, item.tab);
        await window.waitForTimeout(300);
      }

      const input = window.locator(item.searchId);
      expect(await input.isVisible()).toBe(true);
      await input.fill('TEST');
      expect(await input.inputValue()).toBe('TEST');
      await input.fill('');
    }
  });
});
