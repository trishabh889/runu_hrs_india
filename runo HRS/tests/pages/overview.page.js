// ==========================================================================
// RUNO HRS MIS - Overview / Dashboard Page Object
// ==========================================================================

class OverviewPage {
  constructor(page) {
    this.page = page;
    const root = page.locator('#subview-dashboard');
    this.totalProjectsKpi = root.locator('#kpi-total-projects');
    this.projectUsersKpi = root.locator('#kpi-project-users');
    this.customersKpi = root.locator('#kpi-customers');
    this.activeProjectsKpi = root.locator('#kpi-active-projects');
    this.completedProjectsKpi = root.locator('#kpi-completed-projects');
    this.yearDropdownBtn = root.locator('#dropdown-dashboard-year .custom-dropdown-btn');
    this.yearDropdownMenu = root.locator('#dashboard-year-menu');
    this.recentTableBody = root.locator('#dashboard-recent-table-body');
    this.newProjectQuickBtn = root.locator('#btn-quick-new-project');
    this.openCompletedBtn = root.locator('#btn-open-completed-kpi');
  }

  async getKpiStats() {
    return {
      total: await this.totalProjectsKpi.innerText(),
      users: await this.projectUsersKpi.innerText(),
      customers: await this.customersKpi.innerText(),
      active: await this.activeProjectsKpi.innerText(),
      completed: await this.completedProjectsKpi.innerText()
    };
  }

  async selectFinancialYear(yearValue) {
    await this.yearDropdownBtn.click();
    const item = this.yearDropdownMenu.locator(`.custom-dropdown-item[data-value="${yearValue}"]`);
    await item.click();
  }

  async getRecentRowCount() {
    return await this.recentTableBody.locator('tr').count();
  }
}

module.exports = OverviewPage;
