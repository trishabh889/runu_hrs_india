// ==========================================================================
// RUNO HRS MIS - E2E Test: Boot Smoke & Window Lifecycle (BOOT-01)
// ==========================================================================

const { test, expect } = require('@playwright/test');
const { launchTestApp, closeTestApp } = require('../fixtures/electron.fixture');

test.describe('Desktop Shell & Boot Smoke (BOOT-01) @smoke', () => {
  let context = null;

  test.afterEach(async () => {
    await closeTestApp(context);
    context = null;
  });

  test('BOOT-01: Real Electron window initializes with no crash and closes cleanly', async () => {
    context = await launchTestApp({ tag: 'boot-smoke' });
    const { window } = context;

    // Verify window is loaded
    await expect(window).toHaveTitle(/RUNO/i);

    // Verify main app container mounted
    const appContainer = window.locator('#app');
    await expect(appContainer).toBeVisible();

    // Verify isolated log file was created in test workspace
    const fs = require('fs');
    const logPath = context.workspace.getLogPath();
    expect(fs.existsSync(logPath)).toBe(true);
  });
});
