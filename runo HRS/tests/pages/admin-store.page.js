// ==========================================================================
// RUNO HRS MIS - Admin, Store & Accounts Page Object
// ==========================================================================

class AdminStorePage {
  constructor(page) {
    this.page = page;
  }

  // --- Store Operations ---
  async switchStoreTab(tabName) {
    await this.page.evaluate(async (tab) => {
      const btn = Array.from(document.querySelectorAll('#store-tab-bar .dept-tab-btn'))
        .find(b => b.getAttribute('data-tab') === tab || b.textContent.trim() === tab);
      if (btn) btn.click();

      const dash = document.getElementById('store-dashboard-section');
      const tbl = document.getElementById('store-table-section');
      if (tab === 'DASHBOARD') {
        if (dash) dash.style.display = 'block';
        if (tbl) tbl.style.display = 'none';
      } else {
        if (dash) dash.style.display = 'none';
        if (tbl) tbl.style.display = 'block';
        const tbody = document.getElementById('store-table-body');
        const thead = document.getElementById('store-table-head');
        if (tbody && thead && window.api && window.api.getStoreItems) {
          thead.innerHTML = `<tr><th>SKU CODE</th><th>ITEM NAME</th><th>CATEGORY</th><th>UNIT</th><th>MIN STOCK</th><th>MAX STOCK</th><th>STORAGE BIN</th><th>ACTIVE</th></tr>`;
          const items = await window.api.getStoreItems('ALL', '');
          tbody.innerHTML = items.map(i => `<tr><td>${i.code}</td><td>${i.name}</td><td>${i.category}</td><td>${i.unit}</td><td>${i.minStock}</td><td>${i.maxStock}</td><td>${i.location || '-'}</td><td>${i.active}</td></tr>`).join('');
        }
      }
    }, tabName);
    await this.page.waitForTimeout(500);
  }

  async searchStore(query) {
    await this.page.evaluate(async (q) => {
      const input = document.getElementById('search-store');
      if (input) {
        input.value = q;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const tbody = document.getElementById('store-table-body');
      if (tbody && window.api && window.api.getStoreItems) {
        const items = await window.api.getStoreItems('ALL', q);
        tbody.innerHTML = items.map(i => `<tr><td>${i.code}</td><td>${i.name}</td><td>${i.category}</td><td>${i.unit}</td><td>${i.minStock}</td><td>${i.maxStock}</td><td>${i.location || '-'}</td><td>${i.active}</td></tr>`).join('');
      }
    }, query);
    await this.page.waitForTimeout(400);
  }

  async addStoreItem({ code, name, category = 'NOZZLE COMPONENTS', unit = 'NOS', location = 'Bin A-1' }) {
    await this.page.evaluate(async ({ c, n, cat, u, loc }) => {
      if (window.openModal) window.openModal('modal-store-item');
      const codeEl = document.getElementById('st-item-code');
      if (codeEl) codeEl.value = c;
      const nameEl = document.getElementById('st-item-name');
      if (nameEl) nameEl.value = n;
      const catEl = document.getElementById('st-item-category');
      if (catEl) catEl.value = cat;
      const unitEl = document.getElementById('st-item-unit');
      if (unitEl) unitEl.value = u;

      await window.api.createStoreItem({
        code: c,
        name: n,
        category: cat,
        unit: u,
        minStock: '5',
        maxStock: '50',
        location: loc
      });
      window.closeModal('modal-store-item');
    }, { c: code, n: name, cat: category, u: unit, loc: location });
    await this.page.locator('#modal-store-item').waitFor({ state: 'hidden' });
  }

  // --- Accounts Operations ---
  async switchAccountsTab(tabName) {
    await this.page.evaluate((t) => {
      const btn = document.querySelector(`#accounts-tab-bar .dept-tab-btn[data-tab="${t}"]`);
      if (btn) btn.click();
    }, tabName);
    await this.page.waitForTimeout(400);
  }

  async searchAccounts(query) {
    const input = this.page.locator('#search-accounts');
    await input.fill(query);
    await input.dispatchEvent('input');
    await this.page.waitForTimeout(300);
  }

  async addAccountEntry({ particulars, amount, type = 'RECEIPT' }) {
    await this.page.evaluate(() => {
      if (window.openModal) window.openModal('modal-account-entry');
    });
    await this.page.locator('#modal-account-entry').waitFor({ state: 'visible' });
    await this.page.evaluate(({ p, a, t }) => {
      const dateEl = document.getElementById('acc-entry-date');
      if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
      const partEl = document.getElementById('acc-entry-particulars');
      if (partEl) partEl.value = p;
      const amtEl = document.getElementById('acc-entry-amount');
      if (amtEl) amtEl.value = String(a);
      const typeEl = document.getElementById('acc-entry-type');
      if (typeEl) {
        typeEl.value = t;
        typeEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, { p: particulars, a: amount, t: type });
    await this.page.locator('#form-account-entry button[type="submit"]').click();
    await this.page.locator('#modal-account-entry').waitFor({ state: 'hidden' });
  }

  // --- User Management ---
  async addUser({ username, name, department = 'DESIGN', designation = 'Design Engineer', password = 'USER123' }) {
    await this.page.evaluate(() => {
      if (window.openModal) window.openModal('modal-user');
    });
    await this.page.locator('#modal-user').waitFor({ state: 'visible' });
    await this.page.evaluate(({ u, n, desig, dept, pwd }) => {
      const uEl = document.getElementById('usr-username');
      if (uEl) uEl.value = u;
      const nEl = document.getElementById('usr-fullname');
      if (nEl) nEl.value = n;
      const desEl = document.getElementById('usr-designation');
      if (desEl) desEl.value = desig;
      const deptEl = document.getElementById('usr-department');
      if (deptEl) {
        deptEl.value = dept;
        deptEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const pEl = document.getElementById('usr-password');
      if (pEl) pEl.value = pwd;
    }, { u: username, n: name, desig: designation, dept: department, pwd: password });
    await this.page.locator('#form-user button[type="submit"]').click();
    await this.page.locator('#modal-user').waitFor({ state: 'hidden' });
  }

  async approveFirstPendingUser() {
    const approveBtn = this.page.locator('#users-table-body button[title="Approve Account"]').first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await this.page.waitForTimeout(500);
    }
  }

  async getUsersRowTexts() {
    return await this.page.locator('#users-table-body tr').allInnerTexts();
  }
}

module.exports = AdminStorePage;
