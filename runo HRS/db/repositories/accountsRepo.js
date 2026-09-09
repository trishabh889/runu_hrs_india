// ==========================================================================
// RUNO HRS INDIA - Accounts Repository (Tally-Style Logic)
// ==========================================================================

class AccountsRepository {
  constructor(db) {
    this.db = db;
  }

  getAll(tabType = 'ALL', search = '') {
    let list = this.db.data.accountEntries || [];
    if (tabType && tabType !== 'ALL' && tabType !== 'DASHBOARD' && tabType !== 'LEDGER' && tabType !== 'REPORTS') {
      list = list.filter(e => (e.tabType || '').toUpperCase() === tabType.toUpperCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        (e.particulars && e.particulars.toLowerCase().includes(q)) ||
        (e.refNo && e.refNo.toLowerCase().includes(q)) ||
        (e.tabType && e.tabType.toLowerCase().includes(q)) ||
        (e.date && e.date.toLowerCase().includes(q))
      );
    }
    return list;
  }

  create(entryData) {
    const newEntry = {
      id: `acc-${Date.now()}`,
      date: entryData.date || new Date().toISOString().split('T')[0],
      tabType: (entryData.tabType || 'SALES').toUpperCase(),
      particulars: entryData.particulars || 'General Entry',
      refNo: entryData.refNo || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      debit: entryData.debit || '0',
      credit: entryData.credit || '0',
      amount: entryData.amount || '0',
      status: entryData.status || 'POSTED',
      created_at: new Date().toISOString()
    };

    // Automatically set debit/credit based on tabType if not provided
    const amt = parseFloat(newEntry.amount.toString().replace(/[^0-9.]/g, '')) || 0;
    if (parseFloat(newEntry.debit) === 0 && parseFloat(newEntry.credit) === 0) {
      if (['SALES', 'RECEIPT', 'CREDIT NOTE'].includes(newEntry.tabType)) {
        newEntry.credit = amt.toString();
        newEntry.debit = '0';
      } else {
        newEntry.debit = amt.toString();
        newEntry.credit = '0';
      }
    }

    if (!this.db.data.accountEntries) this.db.data.accountEntries = [];
    this.db.data.accountEntries.unshift(newEntry);
    this.db.save();
    return { success: true, entry: newEntry };
  }

  getStats() {
    const list = this.db.data.accountEntries || [];
    let totalSales = 0;
    let totalPurchase = 0;
    let receivable = 0;
    let payable = 0;

    list.forEach(e => {
      const amt = parseFloat(e.amount.toString().replace(/[^0-9.]/g, '')) || 0;
      const type = (e.tabType || '').toUpperCase();
      if (type === 'SALES') {
        totalSales += amt;
        receivable += amt;
      } else if (type === 'PURCHASE') {
        totalPurchase += amt;
        payable += amt;
      } else if (type === 'RECEIPT') {
        receivable = Math.max(0, receivable - amt);
      } else if (type === 'PAYMENT') {
        payable = Math.max(0, payable - amt);
      }
    });

    const recentSales = list.filter(e => (e.tabType || '').toUpperCase() === 'SALES').slice(0, 5);
    const recentPurchases = list.filter(e => (e.tabType || '').toUpperCase() === 'PURCHASE').slice(0, 5);

    return {
      totalSales,
      totalPurchase,
      receivable,
      payable,
      cashBalance: 45000,
      bankBalance: 385000,
      recentSales,
      recentPurchases
    };
  }

  getLedger(search = '') {
    const list = [...(this.db.data.accountEntries || [])].reverse(); // chronological
    let running = 0;
    const ledger = [];

    list.forEach(e => {
      let d = parseFloat(e.debit) || 0;
      let c = parseFloat(e.credit) || 0;
      const amt = parseFloat(e.amount.toString().replace(/[^0-9.]/g, '')) || 0;

      if (d === 0 && c === 0) {
        if (['SALES', 'RECEIPT'].includes((e.tabType || '').toUpperCase())) {
          c = amt;
        } else {
          d = amt;
        }
      }

      running = running + c - d;
      ledger.push({
        id: e.id,
        date: e.date,
        particulars: e.particulars,
        refNo: e.refNo,
        tabType: e.tabType,
        debit: d,
        credit: c,
        balance: running
      });
    });

    if (search) {
      const q = search.toLowerCase();
      return ledger.filter(r =>
        (r.particulars && r.particulars.toLowerCase().includes(q)) ||
        (r.refNo && r.refNo.toLowerCase().includes(q)) ||
        (r.date && r.date.toLowerCase().includes(q))
      ).reverse();
    }

    return ledger.reverse();
  }
}

module.exports = AccountsRepository;
