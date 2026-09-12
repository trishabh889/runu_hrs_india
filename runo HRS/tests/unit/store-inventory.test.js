// ==========================================================================
// RUNO HRS MIS - Unit Test: Store & Inventory Logic (STORE-01, STORE-02)
// ==========================================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function processTransactions(initialItems, transactions) {
  const stock = new Map();
  for (const item of initialItems) {
    stock.set(item.item_code, { ...item, current_stock: Number(item.opening_stock || 0) });
  }

  for (const tx of transactions) {
    const item = stock.get(tx.item_code);
    if (!item) continue;
    const qty = Number(tx.qty || 0);
    if (qty <= 0) continue;

    if (tx.type === 'IN') {
      item.current_stock += qty;
    } else if (tx.type === 'OUT') {
      if (item.current_stock >= qty) {
        item.current_stock -= qty;
      } else {
        throw new Error(`Insufficient stock for item ${tx.item_code}`);
      }
    }
  }

  return stock;
}

function checkReorderWarning(item) {
  return item.current_stock <= Number(item.reorder_level || 0);
}

describe('Store & Inventory Deductions (STORE-01, STORE-02)', () => {
  test('Stock-in 10 minus issue 3 yields 7 and preserves other items', () => {
    const items = [
      { item_code: 'NOZZLE-16', opening_stock: 0, reorder_level: 7 },
      { item_code: 'VALVE-PIN', opening_stock: 20, reorder_level: 5 }
    ];
    const txs = [
      { item_code: 'NOZZLE-16', type: 'IN', qty: 10 },
      { item_code: 'NOZZLE-16', type: 'OUT', qty: 3 }
    ];

    const updated = processTransactions(items, txs);
    assert.equal(updated.get('NOZZLE-16').current_stock, 7);
    assert.equal(updated.get('VALVE-PIN').current_stock, 20);
  });

  test('Current stock <= reorder level raises reorder alert', () => {
    const itemAtThreshold = { item_code: 'NOZZLE-16', current_stock: 7, reorder_level: 7 };
    assert.equal(checkReorderWarning(itemAtThreshold), true);

    const itemAboveThreshold = { item_code: 'NOZZLE-16', current_stock: 8, reorder_level: 7 };
    assert.equal(checkReorderWarning(itemAboveThreshold), false);
  });

  test('Issue transaction exceeding available stock throws error', () => {
    const items = [{ item_code: 'SEAL-O-RING', opening_stock: 2 }];
    const txs = [{ item_code: 'SEAL-O-RING', type: 'OUT', qty: 5 }];

    assert.throws(() => {
      processTransactions(items, txs);
    }, /Insufficient stock/);
  });
});
