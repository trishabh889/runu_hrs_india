// ==========================================================================
// RUNO HRS MIS - Navigation & Sidebar Page Object
// ==========================================================================

class NavigationPage {
  constructor(page) {
    this.page = page;
    this.userInfo = page.locator('#display-user-info');
    this.logoutBtn = page.locator('#btn-logout');
    this.userProfileBadge = page.locator('#btn-user-profile');
    this.userProfileDropdown = page.locator('#user-profile-dropdown');
    this.headerLogoutBtn = page.locator('#btn-header-logout');
  }

  getNavItem(viewName) {
    return this.page.locator(`.nav-item[data-view="${viewName}"]`);
  }

  async navigateTo(viewName) {
    const item = this.getNavItem(viewName);
    await item.click();
    await this.page.locator(`#subview-${viewName}`).waitFor({ state: 'visible' });
  }

  async isNavVisible(viewName) {
    const item = this.getNavItem(viewName);
    return await item.isVisible();
  }

  async getActiveViewName() {
    const activeNav = this.page.locator('.nav-item.active');
    return await activeNav.getAttribute('data-view');
  }

  async getUserDisplay() {
    return await this.userInfo.innerText();
  }

  async openProfileDropdown() {
    await this.userProfileBadge.click();
  }

  async isProfileDropdownVisible() {
    return await this.userProfileDropdown.isVisible();
  }

  async logoutViaHeader() {
    await this.openProfileDropdown();
    await this.headerLogoutBtn.click();
  }

  async logout() {
    if (await this.logoutBtn.isVisible()) {
      await this.logoutBtn.click();
    } else if (await this.headerLogoutBtn.isVisible()) {
      await this.headerLogoutBtn.click();
    } else {
      // Fallback: trigger logout via profile click or bridge
      await this.page.evaluate(() => {
        const btn = document.getElementById('btn-header-logout') || document.getElementById('btn-logout');
        if (btn) btn.click();
        else if (window.handleLogout) window.handleLogout();
      });
    }
  }
}

module.exports = NavigationPage;
