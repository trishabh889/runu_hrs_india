// ==========================================================================
// RUNO HRS MIS - Department Workflow Page Object (Sales, Commercial, Design, etc.)
// ==========================================================================

class DepartmentPage {
  constructor(page) {
    this.page = page;
  }

  // --- Sales ---
  async searchSales(query) {
    const input = this.page.locator('#search-sales');
    await input.fill(query);
    await input.dispatchEvent('input');
  }

  async filterSalesCategory(cat) {
    await this.page.evaluate((c) => {
      const el = document.getElementById('filter-sales-category');
      if (el) {
        el.value = c;
        el.dispatchEvent(new Event('change'));
      }
    }, cat);
  }

  async updateSalesPoStatus(newStatus) {
    await this.page.evaluate((st) => {
      const sel = document.querySelector('#sales-table-body select.sales-status-select');
      if (sel) {
        sel.value = st;
        sel.dispatchEvent(new Event('change'));
      }
    }, newStatus);
    await this.page.waitForTimeout(400);
  }

  // --- Commercial ---
  async switchCommercialTab(tabName) {
    await this.page.locator(`#tab-btn-comm-${tabName}`).click();
    await this.page.waitForTimeout(300);
  }

  async searchCommercial(query) {
    const input = this.page.locator('#search-commercial');
    await input.fill(query);
    await input.dispatchEvent('input');
  }

  async filterCommercialQuote(status) {
    await this.page.evaluate((st) => {
      const el = document.getElementById('filter-comm-quote');
      if (el) {
        el.value = st;
        el.dispatchEvent(new Event('change'));
      }
    }, status);
  }

  async updateCommercialField(rowIdx, fieldName, value) {
    await this.page.evaluate(({ rowIdx, fieldName, value }) => {
      const rows = document.querySelectorAll('#commercial-table-hrs-body tr');
      if (rows[rowIdx]) {
        const sel = rows[rowIdx].querySelector(`select[onchange*="${fieldName}"]`);
        if (sel) {
          sel.value = value;
          sel.dispatchEvent(new Event('change'));
        }
      }
    }, { rowIdx, fieldName, value });
    await this.page.waitForTimeout(400);
  }

  // --- Design ---
  async searchDesign(query) {
    const input = this.page.locator('#search-design');
    await input.fill(query);
    await input.dispatchEvent('input');
  }

  async filterDesignStatus(status) {
    await this.page.evaluate((st) => {
      const el = document.getElementById('filter-design-status');
      if (el) {
        el.value = st;
        el.dispatchEvent(new Event('change'));
      }
    }, status);
  }

  // --- Purchase ---
  async searchPurchase(query) {
    const input = this.page.locator('#search-purchase-requests');
    await input.fill(query);
    await input.dispatchEvent('input');
  }

  async filterPurchaseStatus(status) {
    await this.page.evaluate((st) => {
      const el = document.getElementById('filter-pr-status');
      if (el) {
        el.value = st;
        el.dispatchEvent(new Event('change'));
      }
    }, status);
  }

  // --- Manufacturing ---
  async searchMfg(query) {
    const input = this.page.locator('#mfg-filter-search, #search-mfg').first();
    await input.fill(query);
    await input.dispatchEvent('input');
  }

  async filterMfgStatus(status) {
    await this.page.evaluate((st) => {
      const el = document.getElementById('mfg-filter-status') || document.getElementById('filter-mfg-status');
      if (el) {
        el.value = st;
        el.dispatchEvent(new Event('change'));
      }
      const applyBtn = document.getElementById('btn-mfg-apply-filter');
      if (applyBtn) applyBtn.click();
    }, status);
  }

  async getTableRows(tableBodySelector) {
    return await this.page.locator(`${tableBodySelector} tr`).allInnerTexts();
  }
}

module.exports = DepartmentPage;
