// ==========================================================================
// RUNO HRS MIS - E2E Test: Customer Management & Filters (CUST-01, CUST-02)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');
const CustomersPage = require('../pages/customers.page');

test.describe('Customer Workflows (CUST-01, CUST-02)', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('CUST-01: Create new customer through UI and verify persistence', async () => {
    context = await launchTestApp({ tag: 'cust-create' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const custPage = new CustomersPage(window);

    await navPage.navigateTo('customers');
    const initialRows = await custPage.getRowCount();

    await custPage.createCustomer({
      company_name: 'Optimus Automotive Ltd',
      contact_person: 'Rohan Deshmukh',
      phone: '+91 98888 12345',
      email: 'rohan@optimus.test',
      gstin: '27AAACB9876F1Z5',
      city: 'Pune',
      state: 'Maharashtra'
    });

    // Verify row added to table
    await window.waitForTimeout(600);
    const rowTexts = await custPage.getRowTexts();
    expect(rowTexts.some(t => t.includes('Optimus Automotive Ltd'))).toBe(true);
  });

  test('CUST-02: Live customer search filters matching rows accurately', async () => {
    context = await launchTestApp({ tag: 'cust-search' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const custPage = new CustomersPage(window);

    await navPage.navigateTo('customers');

    // Search for fixture customer 'Apex'
    await custPage.search('Apex');
    await window.waitForTimeout(400);

    const rowTexts = await custPage.getRowTexts();
    expect(rowTexts.length).toBeGreaterThan(0);
    expect(rowTexts[0]).toContain('Apex Precision Tools');

    // Search for non-existent customer
    await custPage.search('NonExistentVendorName');
    await window.waitForTimeout(400);
    const emptyRowTexts = await custPage.getRowTexts();
    expect(emptyRowTexts.some(t => t.includes('Apex Precision Tools'))).toBe(false);
  });
});
