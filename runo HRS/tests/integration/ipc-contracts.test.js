// ==========================================================================
// RUNO HRS MIS - Integration Test: IPC Bridge & Partials Contract
// ==========================================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

describe('Renderer IPC & Partials Contract Integration', () => {
  const partialsDir = path.join(__dirname, '..', '..', 'src', 'partials');

  test('All critical application view partials exist on disk', () => {
    const requiredPartials = [
      'login',
      'dashboard',
      'customers',
      'projects',
      'sales',
      'commercial',
      'design',
      'accounts',
      'store',
      'purchase',
      'mfg',
      'approvals',
      'users',
      'modals',
      'assembly',
      'service',
      'vendor',
      'costing'
    ];

    for (const name of requiredPartials) {
      const file = path.join(partialsDir, `${name}.html`);
      assert.equal(fs.existsSync(file), true, `Missing partial: ${name}.html`);
      const stat = fs.statSync(file);
      assert.ok(stat.size > 50, `Partial ${name}.html is suspiciously empty`);
    }
  });

  test('Overview dashboard partial contains required DOM anchors', () => {
    const dashboardHtml = fs.readFileSync(path.join(partialsDir, 'dashboard.html'), 'utf8');
    assert.match(dashboardHtml, /id="kpi-total-projects"/);
    assert.match(dashboardHtml, /id="kpi-completed-projects"/);
    assert.match(dashboardHtml, /id="dropdown-dashboard-year"/);
    assert.match(dashboardHtml, /id="dashboard-recent-table-body"/);
  });
});
