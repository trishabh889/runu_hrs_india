// ==========================================================================
// RUNO HRS MIS - Unit Test: Indian Financial Year Math & April 1 Rollover
// ==========================================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function calculateFinancialYear(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11, April is 3
  const startYear = month >= 3 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
}

describe('Indian Financial Year Calculation', () => {
  test('Dates before April 1 belong to previous financial year', () => {
    assert.equal(calculateFinancialYear('2026-01-15'), '2025-2026');
    assert.equal(calculateFinancialYear('2026-03-31T23:59:59'), '2025-2026');
  });

  test('Dates on or after April 1 roll over to new financial year', () => {
    assert.equal(calculateFinancialYear('2026-04-01T00:00:00'), '2026-2027');
    assert.equal(calculateFinancialYear('2026-09-12'), '2026-2027');
  });

  test('Next year rollover activates precisely on 1 April 2027', () => {
    assert.equal(calculateFinancialYear('2027-03-31'), '2026-2027');
    assert.equal(calculateFinancialYear('2027-04-01'), '2027-2028');
  });
});
