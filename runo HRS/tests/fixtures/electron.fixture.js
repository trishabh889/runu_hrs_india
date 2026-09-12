// ==========================================================================
// RUNO HRS MIS - Playwright Electron Lifecycle Fixture
// Manages launch, window handle capture, and guaranteed teardown
// ==========================================================================

const { _electron: electron } = require('@playwright/test');
const path = require('path');
const TestWorkspace = require('./test-workspace');
const { writeSeedToWorkspace } = require('./seed-builder');

async function launchTestApp(options = {}) {
  const workspace = options.workspace || new TestWorkspace(options.tag || 'e2e');
  
  if (options.seed !== false) {
    writeSeedToWorkspace(workspace, options.customSeed);
  }

  const appPath = path.join(__dirname, '..', '..', 'main.js');
  const env = {
    ...process.env,
    RUNO_TEST_MODE: '1',
    RUNO_TEST_ROOT: workspace.dir,
    NODE_ENV: 'test'
  };
  delete env.ELECTRON_RUN_AS_NODE;

  const electronApp = await electron.launch({
    args: [appPath, '--disable-gpu', '--no-sandbox'],
    env
  });

  const window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');

  return { electronApp, window, workspace };
}

async function closeTestApp(context) {
  if (!context) return;
  const { electronApp, workspace } = context;

  try {
    if (electronApp) {
      await electronApp.close();
    }
  } catch (err) {
    // Process already terminated
  }

  if (workspace && !context.keepWorkspace) {
    workspace.cleanup();
  }
}

module.exports = {
  launchTestApp,
  closeTestApp
};
