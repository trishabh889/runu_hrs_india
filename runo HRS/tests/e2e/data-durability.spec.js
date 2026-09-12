// ==========================================================================
// RUNO HRS MIS - E2E Test: Data Durability Across Relaunch (DATA-01)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const TestWorkspace = require('../fixtures/test-workspace');
const NavigationPage = require('../pages/navigation.page');
const CustomersPage = require('../pages/customers.page');

test.describe('Data Persistence & Durability (DATA-01)', () => {
  test('DATA-01: Record created in session 1 persists across application restart', async () => {
    const workspace = new TestWorkspace('durability');
    let context1 = null;
    let context2 = null;

    try {
      // Session 1: Launch and create record
      context1 = await launchTestApp({ workspace, seed: true });
      const nav1 = new NavigationPage(context1.window);
      const cust1 = new CustomersPage(context1.window);

      await nav1.navigateTo('customers');
      await cust1.createCustomer({
        company_name: 'Durable Hardware Industries',
        contact_person: 'Vikas Batra',
        phone: '+91 97777 66666',
        email: 'vikas@durablehw.test',
        gstin: '03AAACD5555G1Z1',
        city: 'Ludhiana',
        state: 'Punjab'
      });

      // Close session 1 without wiping workspace
      await closeTestApp({ ...context1, keepWorkspace: true });
      context1 = null;

      // Session 2: Relaunch into SAME workspace without re-seeding
      context2 = await launchTestApp({ workspace, seed: false });
      const nav2 = new NavigationPage(context2.window);
      const cust2 = new CustomersPage(context2.window);

      await nav2.navigateTo('customers');
      await context2.window.waitForTimeout(500);

      const rowTexts = await cust2.getRowTexts();
      expect(rowTexts.some(t => t.includes('Durable Hardware Industries'))).toBe(true);
    } finally {
      if (context1) await closeTestApp(context1);
      if (context2) await closeTestApp(context2);
      workspace.cleanup();
    }
  });
});
