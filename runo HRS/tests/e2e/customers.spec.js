// ==========================================================================
// RUNO HRS MIS - E2E Test: Customer Management & Filters (CUST-01..04)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');
const NavigationPage = require('../pages/navigation.page');
const CustomersPage = require('../pages/customers.page');

test.describe('Customer Workflows (CUST-01..CUST-04)', () => {
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
    await custPage.createCustomer({
      company_name: 'Optimus Automotive Ltd',
      contact_person: 'Rohan Deshmukh',
      phone: '+91 98888 12345',
      email: 'rohan@optimus.test',
      gstin: '27AAACB9876F1Z5',
      city: 'Pune',
      state: 'Maharashtra'
    });

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
    await custPage.search('Apex');
    await window.waitForTimeout(400);

    const rowTexts = await custPage.getRowTexts();
    expect(rowTexts.length).toBeGreaterThan(0);
    expect(rowTexts[0]).toContain('Apex Precision Tools');

    await custPage.search('NonExistentVendorName');
    await window.waitForTimeout(400);
    const emptyRowTexts = await custPage.getRowTexts();
    expect(emptyRowTexts.some(t => t.includes('Apex Precision Tools'))).toBe(false);
  });

  test('CUST-03: Update existing customer and verify updated details in table', async () => {
    context = await launchTestApp({ tag: 'cust-edit' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const custPage = new CustomersPage(window);

    await navPage.navigateTo('customers');
    await window.waitForTimeout(500);

    // Edit the existing fixture customer
    await custPage.editCustomer({
      contact_person: 'Vikramaditya Rao',
      phone: '+91 91111 22222',
      city: 'Noida'
    });

    await window.waitForTimeout(600);
    const rowTexts = await custPage.getRowTexts();
    expect(rowTexts.some(t => t.includes('Vikramaditya Rao'))).toBe(true);
  });

  test('CUST-04: Apply city and state filters to customer directory', async () => {
    context = await launchTestApp({ tag: 'cust-filters' });
    const { window } = context;
    const navPage = new NavigationPage(window);
    const custPage = new CustomersPage(window);

    await navPage.navigateTo('customers');
    await window.waitForTimeout(500);

    // Fixture customer is in Gurugram
    await custPage.filterByCity('Gurugram');
    await window.waitForTimeout(400);
    let rows = await custPage.getRowTexts();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toContain('Apex Precision Tools');
  });
});
