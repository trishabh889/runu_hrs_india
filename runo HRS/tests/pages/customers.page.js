// ==========================================================================
// RUNO HRS MIS - Customers Page Object
// ==========================================================================

class CustomersPage {
  constructor(page) {
    this.page = page;
    this.addCustomerBtn = page.locator('#btn-add-customer-modal');
    this.searchInput = page.locator('#search-customers');
    this.cityFilter = page.locator('#filter-cust-city');
    this.stateFilter = page.locator('#filter-cust-state');
    this.categoryFilter = page.locator('#filter-cust-project-category');
    this.tableBody = page.locator('#customers-table-body');
    this.form = page.locator('#form-customer');
    this.companyInput = page.locator('#cust-company');
    this.contactInput = page.locator('#cust-contact');
    this.phoneInput = page.locator('#cust-phone');
    this.emailInput = page.locator('#cust-email');
    this.gstinInput = page.locator('#cust-gstin');
    this.cityInput = page.locator('#cust-city');
    this.stateInput = page.locator('#cust-state');
    this.saveBtn = page.locator('#form-customer button[type="submit"]');
  }

  async openAddModal() {
    await this.addCustomerBtn.click();
    await this.form.waitFor({ state: 'visible' });
  }

  async createCustomer(data) {
    await this.openAddModal();
    if (data.company_name) await this.companyInput.fill(data.company_name);
    if (data.contact_person) await this.contactInput.fill(data.contact_person);
    if (data.phone) await this.phoneInput.fill(data.phone);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.gstin) await this.gstinInput.fill(data.gstin);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.state) await this.stateInput.fill(data.state);
    await this.saveBtn.click();
  }

  async search(query) {
    await this.searchInput.fill(query);
    await this.searchInput.dispatchEvent('input');
  }

  async filterByCategory(category) {
    await this.categoryFilter.selectOption(category);
  }

  async getRowCount() {
    return await this.tableBody.locator('tr').count();
  }

  async getRowTexts() {
    return await this.tableBody.locator('tr').allInnerTexts();
  }
}

module.exports = CustomersPage;
