// ==========================================================================
// RUNO HRS INDIA - Test Runtime Bootstrap & Storage Isolation
// Ensures tests run in ephemeral sandbox without touching production data
// ==========================================================================

const fs = require('fs');
const path = require('path');

function configureTestRuntime(app) {
  if (process.env.RUNO_TEST_MODE !== '1') {
    return false;
  }

  const testRoot = process.env.RUNO_TEST_ROOT;
  if (!testRoot || typeof testRoot !== 'string') {
    console.error('[FATAL TEST ISOLATION ERROR] RUNO_TEST_MODE=1 requires valid RUNO_TEST_ROOT');
    process.exit(99);
  }

  const resolvedRoot = path.resolve(testRoot);
  if (!fs.existsSync(resolvedRoot)) {
    console.error(`[FATAL TEST ISOLATION ERROR] RUNO_TEST_ROOT does not exist: ${resolvedRoot}`);
    process.exit(99);
  }

  const markerPath = path.join(resolvedRoot, '.runo-test-workspace');
  if (!fs.existsSync(markerPath)) {
    console.error(`[FATAL TEST ISOLATION ERROR] Missing ownership marker: ${markerPath}`);
    process.exit(99);
  }

  const testUserData = path.join(resolvedRoot, 'userData');
  if (!fs.existsSync(testUserData)) {
    fs.mkdirSync(testUserData, { recursive: true });
  }

  if (app && typeof app.setPath === 'function') {
    app.setPath('userData', testUserData);
  }

  return true;
}

module.exports = configureTestRuntime;
