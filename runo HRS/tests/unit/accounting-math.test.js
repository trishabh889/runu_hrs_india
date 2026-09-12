// ==========================================================================
// RUNO HRS MIS - Unit Test: Accounting Math, Ledger & Balances (ACCT-01, ACCT-02)
// ==========================================================================

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function computeReceivable(entries) {
  let receivable = 0;
  for (const e of entries) {
    if (e.type === 'SALES_INVOICE') receivable += Number(e.amount || 0);
    if (e.type === 'RECEIPT') receivable -= Number(e.amount || 0);
  }
  return receivable;
}

function computePayable(entries) {
  let payable = 0;
  for (const e of entries) {
    if (e.type === 'PURCHASE_BILL') payable += Number(e.amount || 0);
    if (e.type === 'PAYMENT') payable -= Number(e.amount || 0);
  }
  return payable;
}

function computeLedgerBalance(entries) {
  return entries.reduce((acc, curr) => {
    const debit = Number(curr.debit || 0);
    const credit = Number(curr.credit || 0);
    return acc + debit - credit;
  }, 0);
}

describe('Accounting & Ledger Logic (ACCT-01, ACCT-02)', () => {
  test('Sales 1000 and receipt 250 yield receivable 750', () => {
    const entries = [
      { type: 'SALES_INVOICE', amount: 1000 },
      { type: 'RECEIPT', amount: 250 }
    ];
    assert.equal(computeReceivable(entries), 750);
  });

  test('Receivable arithmetic is invariant to insertion order', () => {
    const reversedEntries = [
      { type: 'RECEIPT', amount: 250 },
      { type: 'SALES_INVOICE', amount: 1000 }
    ];
    assert.equal(computeReceivable(reversedEntries), 750);
  });

  test('Purchase 600 and payment 100 yield payable 500', () => {
    const entries = [
      { type: 'PURCHASE_BILL', amount: 600 },
      { type: 'PAYMENT', amount: 100 }
    ];
    assert.equal(computePayable(entries), 500);
  });

  test('Payable arithmetic is invariant to insertion order', () => {
    const reversed = [
      { type: 'PAYMENT', amount: 100 },
      { type: 'PURCHASE_BILL', amount: 600 }
    ];
    assert.equal(computePayable(reversed), 500);
  });

  test('Ledger balance handles decimal precision accurately', () => {
    const ledger = [
      { debit: '1500.50', credit: 0 },
      { debit: 0, credit: '450.25' }
    ];
    assert.equal(computeLedgerBalance(ledger), 1050.25);
  });
});
