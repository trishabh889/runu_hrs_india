// ==========================================================================
// RUNO HRS MIS - Unit Test: Customer Repository (CUST-02, CUST-03)
// ==========================================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const CustomerRepository = require('../../db/repositories/customerRepo');

describe('CustomerRepository Isolation Tests (CUST-02, CUST-03)', () => {
  const fakeDb = {
    data: {
      customers: [
        {
          id: 'cust-001',
          company_name: 'Minda Automotive',
          customer_code: 'RUNO-CUST-MIND',
          city_state: 'Manesar, Haryana',
          gstin: '06AAACM1234D1Z5'
        },
        {
          id: 'cust-002',
          company_name: 'Lumax Industries',
          customer_code: 'RUNO-CUST-LUMX',
          city_state: 'Pune, Maharashtra',
          gstin: '27AAACL5678E1Z2'
        }
      ],
      projects: [
        { customer_id: 'cust-001', category: 'HRS' },
        { customer_id: 'cust-001', category: 'HRTC' },
        { customer_id: 'cust-002', category: 'SPARE-HRS' }
      ]
    },
    save: () => true
  };

  const repo = new CustomerRepository(fakeDb);

  test('getAll returns all customers with attached category breakdown', () => {
    const list = repo.getAll();
    assert.equal(list.length, 2);
    
    const minda = list.find(c => c.id === 'cust-001');
    assert.equal(minda.total_projects, 2);
    assert.equal(minda.breakdown.hrs, 1);
    assert.equal(minda.breakdown.hrtc, 1);
    assert.equal(minda.breakdown.spareHrs, 0);

    const lumax = list.find(c => c.id === 'cust-002');
    assert.equal(lumax.total_projects, 1);
    assert.equal(lumax.breakdown.spareHrs, 1);
  });

  test('Search filter matches company name and customer code accurately', () => {
    const searchName = repo.getAll('minda');
    assert.equal(searchName.length, 1);
    assert.equal(searchName[0].id, 'cust-001');

    const searchCode = repo.getAll('LUMX');
    assert.equal(searchCode.length, 1);
    assert.equal(searchCode[0].id, 'cust-002');

    const noMatch = repo.getAll('NonExistentCompany');
    assert.equal(noMatch.length, 0);
  });

  test('Create new customer validates and assigns id with cust- prefix', () => {
    const res = repo.create({
      company_name: 'Varroc Engineering',
      customer_code: 'RUNO-CUST-VARC'
    });

    assert.equal(res.success, true);
    assert.ok(res.customer.id.startsWith('cust-'));
    assert.equal(res.customer.company_name, 'Varroc Engineering');
  });
});
