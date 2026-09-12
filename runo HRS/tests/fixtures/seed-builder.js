// ==========================================================================
// RUNO HRS MIS - Schema-Compatible Synthetic Seed Builder
// ==========================================================================

const fs = require('fs');
const mockData = require('./mock-data');

function buildTestSeed(overrides = {}) {
  const base = {
    users: [...mockData.users],
    customers: [...mockData.customers],
    projects: [...mockData.projects],
    purchaseRequests: [],
    manufacturingJobs: [],
    approvals: [],
    accountEntries: [],
    storeItems: [],
    storeTransactions: [],
    systemConfig: {
      version: '1.0.0',
      last_backup: null
    }
  };

  return { ...base, ...overrides };
}

function writeSeedToWorkspace(workspace, customSeed = null) {
  const seed = customSeed || buildTestSeed();
  const dbPath = workspace.getDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2), 'utf8');
  return seed;
}

module.exports = {
  buildTestSeed,
  writeSeedToWorkspace
};
