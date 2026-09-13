// ==========================================================================
// RUNO HRS MIS - Projects Page Object
// ==========================================================================

class ProjectsPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.locator('#search-projects');
    this.tableBody = page.locator('#projects-table-body');
    this.sectionDropdown = page.locator('#dropdown-projects-section');
    this.statusDropdown = page.locator('#dropdown-projects-filter');
    this.kpiTotal = page.locator('#kpi-proj-total');
  }

  async clickNewProject() {
    await this.page.locator('#btn-nav-new-proj').click();
    await this.page.locator('#modal-create-project').waitFor({ state: 'visible', timeout: 5000 });
  }

  async fillNewProject({ desc, drops = 4, material = 'Polypropylene (PP)', targetDate = '2026-12-31' }) {
    await this.page.locator('#modal-proj-desc').fill(desc);
    if (drops) await this.page.locator('#modal-proj-drops').fill(String(drops));
    if (material) await this.page.locator('#modal-proj-material').fill(material);
    if (targetDate) await this.page.locator('#modal-proj-date').fill(targetDate);
  }

  async submitNewProject() {
    await this.page.locator('#modal-btn-submit-project').click();
    await this.page.locator('#modal-create-project').waitFor({ state: 'hidden', timeout: 5000 });
  }

  async search(query) {
    await this.searchInput.fill(query);
    await this.searchInput.dispatchEvent('input');
  }

  async filterByStatus(statusValue) {
    await this.statusDropdown.locator('.custom-dropdown-btn').click();
    await this.statusDropdown.locator(`.custom-dropdown-item[data-value="${statusValue}"]`).click();
  }

  async filterBySection(sectionValue) {
    await this.sectionDropdown.locator('.custom-dropdown-btn').click();
    await this.sectionDropdown.locator(`.custom-dropdown-item[data-value="${sectionValue}"]`).click();
  }

  async getRowCount() {
    return await this.tableBody.locator('tr').count();
  }

  async getRowTexts() {
    return await this.tableBody.locator('tr').allInnerTexts();
  }
}

module.exports = ProjectsPage;
