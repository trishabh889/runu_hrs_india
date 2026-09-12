// ==========================================================================
// RUNO HRS MIS - Unit Test: Universal Date Normalization & Date Range Filter
// ==========================================================================

const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeDateStr, isDateInRange } = require('../../db/dateUtils');
const ProjectRepository = require('../../db/repositories/projectRepo');

test('Date Normalization & Range Filtering Suite', async (t) => {
  await t.test('normalizeDateStr correctly parses diverse date formats', () => {
    assert.equal(normalizeDateStr('2026-05-18'), '2026-05-18');
    assert.equal(normalizeDateStr('18-05-2026'), '2026-05-18');
    assert.equal(normalizeDateStr('18-03-26'), '2026-03-18');
    assert.equal(normalizeDateStr('18/05/2026'), '2026-05-18');
    assert.equal(normalizeDateStr('2026/05/18'), '2026-05-18');
    assert.equal(normalizeDateStr('2026-05-18T10:30:00.000Z'), '2026-05-18');
    assert.equal(normalizeDateStr(''), '');
    assert.equal(normalizeDateStr('N/A'), '');
    assert.equal(normalizeDateStr('-'), '');
    assert.equal(normalizeDateStr(null), '');
  });

  await t.test('isDateInRange checks within boundaries accurately', () => {
    assert.equal(isDateInRange('2026-06-15', '2026-06-01', '2026-06-30'), true);
    assert.equal(isDateInRange('15-06-2026', '2026-06-01', '2026-06-30'), true);
    assert.equal(isDateInRange('18-03-26', '2026-03-01', '2026-03-31'), true);
    assert.equal(isDateInRange('2026-07-01', '2026-06-01', '2026-06-30'), false);
    assert.equal(isDateInRange('2026-05-31', '2026-06-01', '2026-06-30'), false);
    // Open-ended start
    assert.equal(isDateInRange('2026-05-01', '', '2026-06-30'), true);
    assert.equal(isDateInRange('2026-07-01', '', '2026-06-30'), false);
    // Open-ended end
    assert.equal(isDateInRange('2026-07-01', '2026-06-01', ''), true);
    assert.equal(isDateInRange('2026-05-01', '2026-06-01', ''), false);
  });

  await t.test('ProjectRepository.getAll filters by date range correctly', () => {
    const mockDb = {
      data: {
        projects: [
          { id: '1', project_code: 'P1', order_date: '2026-01-15' },
          { id: '2', project_code: 'P2', order_date: '15-05-2026' },
          { id: '3', project_code: 'P3', order_date: '18-03-26' },
          { id: '4', project_code: 'P4', order_date: '2026-11-20' }
        ]
      }
    };
    const repo = new ProjectRepository(mockDb);
    
    // Filter between March and June 2026
    const res = repo.getAll({ startDate: '2026-03-01', endDate: '2026-06-30' });
    assert.equal(res.length, 2);
    const codes = res.map(p => p.project_code);
    assert.ok(codes.includes('P2'));
    assert.ok(codes.includes('P3'));
  });
});
