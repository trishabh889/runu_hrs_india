// ==========================================================================
// RUNO HRS MIS - Login & Registration Page Object
// ==========================================================================

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#login-username');
    this.passwordInput = page.locator('#login-password');
    this.loginButton = page.locator('#btn-submit-login');
    this.errorMsg = page.locator('#login-error');
    this.loginTabBtn = page.locator('#tab-btn-login');
    this.registerTabBtn = page.locator('#tab-btn-register');
    this.regUsernameInput = page.locator('#reg-username');
    this.regNameInput = page.locator('#reg-name');
    this.regDesignationInput = page.locator('#reg-designation');
    this.regPasswordInput = page.locator('#reg-password');
    this.regButton = page.locator('#btn-submit-register');
    this.regErrorMsg = page.locator('#register-error');
    this.closeApprovalBtn = page.locator('#btn-close-approval-notice');
  }

  async login(username, password) {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }

  async switchToRegister() {
    await this.registerTabBtn.click();
  }

  async switchToLogin() {
    await this.loginTabBtn.click();
  }

  async register(data) {
    await this.switchToRegister();
    if (data.username) await this.regUsernameInput.fill(data.username);
    if (data.name) await this.regNameInput.fill(data.name);
    if (data.designation) await this.regDesignationInput.fill(data.designation);
    if (data.password) await this.regPasswordInput.fill(data.password);
    await this.regButton.click();

    // Close the approval notice popup if shown
    if (await this.closeApprovalBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.closeApprovalBtn.click();
    }
  }

  async getErrorMessage() {
    return await this.errorMsg.innerText();
  }
}

module.exports = LoginPage;
