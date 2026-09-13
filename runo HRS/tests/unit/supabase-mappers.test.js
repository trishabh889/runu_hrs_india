// ==========================================================================
// RUNO HRS MIS - Unit Test: Supabase Data Mappers & Config Resolver
// ==========================================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const customerMapper = require('../../db/mappers/customerMapper');
const projectMapper = require('../../db/mappers/projectMapper');
const storeMapper = require('../../db/mappers/storeMapper');
const accountsMapper = require('../../db/mappers/accountsMapper');
const userMapper = require('../../db/mappers/userMapper');
const { config, resolveConfig } = require('../../config');

describe('Supabase Configuration Resolver', () => {
  test('Defaults to local mode when Supabase keys are not set', () => {
    const resolved = resolveConfig();
    assert.ok(['local', 'supabase'].includes(resolved.backend));
    if (!resolved.supabase.isConfigured) {
      assert.strictEqual(resolved.backend, 'local');
    }
  });
});

describe('Customer Mapper Bi-directional Tests', () => {
  test('customerMapper.toDatabase maps domain format to DB schema', () => {
    const domain = {
      id: 'cust-123',
      company_name: 'Hero MotoCorp Ltd',
      contact_person: 'Rajiv Mehra',
      city: 'Gurugram',
      state: 'Haryana',
      gstin: '06AAACH1234D1Z5'
    };
    const dbRow = customerMapper.toDatabase(domain);
    assert.strictEqual(dbRow.id, 'cust-123');
    assert.strictEqual(dbRow.company_name, 'Hero MotoCorp Ltd');
    assert.strictEqual(dbRow.city_state, 'Gurugram, Haryana');
    assert.strictEqual(dbRow.gstin, '06AAACH1234D1Z5');
  });

  test('customerMapper.toDomain extracts city and state from city_state', () => {
    const row = {
      id: 'cust-456',
      company_name: 'Minda Corp',
      city_state: 'Pune, Maharashtra',
      total_projects: 4
    };
    const domain = customerMapper.toDomain(row);
    assert.strictEqual(domain.city, 'Pune');
    assert.strictEqual(domain.state, 'Maharashtra');
    assert.strictEqual(domain.total_projects, 4);
  });
});

describe('Project Mapper Bi-directional Tests', () => {
  test('projectMapper preserves UI fields and workflow milestones', () => {
    const uiData = {
      project_code: 'RUNO-2026-042',
      customer_name: 'Varroc Engineering',
      part_name: 'Rear Lamp Housing',
      mould_description: 'Rear Lamp Housing',
      category: 'HRS',
      quote_status: 'APPROVED',
      po_received: 'YES',
      nozzle_count: 8,
      workflow_milestones: { '2dStart': '10-Mar-2026', '2dEnd': '12-Mar-2026' }
    };
    const dbRow = projectMapper.toDatabase(uiData);
    assert.strictEqual(dbRow.project_code, 'RUNO-2026-042');
    assert.strictEqual(dbRow.nozzle_count, 8);
    assert.strictEqual(dbRow.num_drops, '8');
    assert.strictEqual(dbRow.quote_status, 'APPROVED');
    assert.strictEqual(dbRow.po_received, 'YES');
    assert.deepStrictEqual(dbRow.workflow_milestones, uiData.workflow_milestones);

    const domain = projectMapper.toDomain(dbRow);
    assert.strictEqual(domain.project_code, 'RUNO-2026-042');
    assert.strictEqual(domain.nozzle_count, 8);
    assert.strictEqual(domain.mould_description, 'Rear Lamp Housing');
  });
});

describe('Store Inventory Mapper Tests', () => {
  test('storeMapper maps item between DB and UI correctly', () => {
    const item = { code: 'NOZ-001', name: 'Nozzle Body 16mm', minStock: '10', maxStock: '60' };
    const dbRow = storeMapper.itemToDatabase(item);
    assert.strictEqual(dbRow.min_stock, 10);
    assert.strictEqual(dbRow.max_stock, 60);

    const domain = storeMapper.itemToDomain(dbRow);
    assert.strictEqual(domain.minStock, '10');
    assert.strictEqual(domain.maxStock, '60');
  });

  test('storeMapper maps transactions correctly', () => {
    const tx = { tabType: 'STOCK IN', itemCode: 'NOZ-001', qty: '15', refNo: 'MRN-2026-01' };
    const dbRow = storeMapper.txToDatabase(tx);
    assert.strictEqual(dbRow.tab_type, 'STOCK IN');
    assert.strictEqual(dbRow.qty, 15);
    const domain = storeMapper.txToDomain(dbRow);
    assert.strictEqual(domain.tabType, 'STOCK IN');
    assert.strictEqual(domain.qty, '15');
  });
});

describe('Accounts Voucher & User Mapper Tests', () => {
  test('accountsMapper calculates debit and credit based on voucher type', () => {
    const receipt = { tabType: 'RECEIPT', amount: 50000, particulars: 'Payment from client' };
    const dbReceipt = accountsMapper.toDatabase(receipt);
    assert.strictEqual(dbReceipt.credit, 50000);
    assert.strictEqual(dbReceipt.debit, 0);

    const payment = { tabType: 'PAYMENT', amount: 15000, particulars: 'Vendor advance' };
    const dbPayment = accountsMapper.toDatabase(payment);
    assert.strictEqual(dbPayment.debit, 15000);
    assert.strictEqual(dbPayment.credit, 0);
  });

  test('userMapper enforces superadmin status and profile fields', () => {
    const anandRow = { username: 'ANAND', full_name: 'Anand Sharma', role: 'ADMIN' };
    const domain = userMapper.toDomain(anandRow);
    assert.strictEqual(domain.status, 'APPROVED');
    assert.strictEqual(domain.is_approved, true);

    const newUser = { username: 'newbie', name: 'New Staff', role: 'DESIGN' };
    const dbNew = userMapper.toDatabase(newUser);
    assert.strictEqual(dbNew.status, 'PENDING_APPROVAL');
    assert.strictEqual(dbNew.is_approved, false);
  });
});
