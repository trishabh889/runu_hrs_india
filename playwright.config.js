// ==========================================================================
// RUNO HRS MIS - Playwright Test Configuration for Electron E2E
// ==========================================================================

const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: path.join(__dirname, 'runo HRS', 'tests', 'e2e'),
  timeout: 35000,
  expect: {
    timeout: 6000
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(__dirname, 'playwright-report') }],
    ['junit', { outputFile: path.join(__dirname, 'test-results', 'junit.xml') }]
  ],
  outputDir: path.join(__dirname, 'test-results'),
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  }
});
