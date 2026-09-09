// ==========================================================================
// RUNO HRS INDIA - Store & Inventory Repository (BUSY-Style Logic)
// ==========================================================================

class StoreRepository {
  constructor(db) {
    this.db = db;
  }

  getItems(category = 'ALL', search = '') {
    let items = (this.db.data.storeItems || []).filter(i => (i.category || '').toUpperCase() !== 'GODOWN');
    if (category && category !== 'ALL') {
      items = items.filter(i => (i.category || '').toUpperCase() === category.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        (i.code && i.code.toLowerCase().includes(q)) ||
        (i.name && i.name.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q)) ||
        (i.location && i.location.toLowerCase().includes(q))
      );
    }
    return items;
  }

  getGodowns(search = '') {
    let list = (this.db.data.storeItems || []).filter(i => (i.category || '').toUpperCase() === 'GODOWN');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g =>
        (g.code && g.code.toLowerCase().includes(q)) ||
        (g.name && g.name.toLowerCase().includes(q)) ||
        (g.minStock && g.minStock.toLowerCase().includes(q))
      );
    }
    return list;
  }

  createItem(itemData) {
    const isGodown = (itemData.category || '').toUpperCase() === 'GODOWN';
    const newItem = {
      code: itemData.code || (isGodown ? `LOC-${Date.now().toString().slice(-4)}` : `ITM-${Date.now().toString().slice(-4)}`),
      name: itemData.name || 'New Inventory Item',
      category: itemData.category || 'GENERAL',
      unit: itemData.unit || 'NOS',
      minStock: (itemData.minStock || '0').toString(),
      maxStock: (itemData.maxStock || '0').toString(),
      location: itemData.location || '',
      active: itemData.active || 'YES'
    };

    if (!this.db.data.storeItems) this.db.data.storeItems = [];
    this.db.data.storeItems.push(newItem);
    this.db.save();
    return { success: true, item: newItem };
  }

  getTransactions(tabType = 'ALL', search = '') {
    let list = this.db.data.storeTransactions || [];
    if (tabType && tabType !== 'ALL' && tabType !== 'DASHBOARD' && tabType !== 'REORDER LEVEL' && tabType !== 'STOCK LEDGER') {
      list = list.filter(t => (t.tabType || '').toUpperCase() === tabType.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        (t.refNo && t.refNo.toLowerCase().includes(q)) ||
        (t.itemCode && t.itemCode.toLowerCase().includes(q)) ||
        (t.itemName && t.itemName.toLowerCase().includes(q)) ||
        (t.partyOrDept && t.partyOrDept.toLowerCase().includes(q))
      );
    }
    return list;
  }

  createTransaction(txData) {
    const newTx = {
      id: `stx-${Date.now()}`,
      date: txData.date || new Date().toISOString().split('T')[0],
      refNo: txData.refNo || `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      itemCode: txData.itemCode || '',
      itemName: txData.itemName || txData.itemCode || 'Inventory Part',
      partyOrDept: txData.partyOrDept || 'Assembly Dept',
      qty: (txData.qty || '1').toString(),
      unit: txData.unit || 'NOS',
      location: txData.location || 'Store Bay 1',
      tabType: (txData.tabType || 'STOCK IN').toUpperCase(),
      status: txData.status || 'POSTED',
      created_at: new Date().toISOString()
    };

    if (!this.db.data.storeTransactions) this.db.data.storeTransactions = [];
    this.db.data.storeTransactions.unshift(newTx);
    this.db.save();
    return { success: true, transaction: newTx };
  }

  getStats() {
    const items = (this.db.data.storeItems || []).filter(i => (i.category || '').toUpperCase() !== 'GODOWN');
    const godowns = (this.db.data.storeItems || []).filter(i => (i.category || '').toUpperCase() === 'GODOWN');
    const txs = this.db.data.storeTransactions || [];

    let totalStock = 0;
    let lowStockCount = 0;
    let purchaseQty = 0;
    let issueQty = 0;

    items.forEach(item => {
      const min = parseInt(item.minStock) || 0;
      let inQ = 0;
      let outQ = 0;

      txs.forEach(t => {
        if ((t.itemCode && t.itemCode.toLowerCase() === item.code.toLowerCase()) ||
            (t.itemName && t.itemName.toLowerCase() === item.name.toLowerCase())) {
          const q = parseInt(t.qty) || 0;
          const type = (t.tabType || '').toUpperCase();
          if (['PURCHASE RECEIPT', 'STOCK IN', 'OPENING STOCK'].includes(type)) inQ += q;
          else if (['MATERIAL ISSUE', 'STOCK OUT'].includes(type)) outQ += q;
        }
      });

      const current = Math.max(0, inQ - outQ);
      totalStock += current;
      if (current <= min && min > 0) lowStockCount++;
    });

    txs.forEach(t => {
      const q = parseInt(t.qty) || 0;
      const type = (t.tabType || '').toUpperCase();
      if (type === 'PURCHASE RECEIPT') purchaseQty += q;
      if (type === 'MATERIAL ISSUE') issueQty += q;
    });

    return {
      totalItems: items.length,
      totalStock,
      lowStock: lowStockCount,
      stockValue: `₹ ${(totalStock * 1450).toLocaleString('en-IN')}`,
      purchaseQty,
      issueQty,
      godowns: godowns.length,
      pendingIndents: 0
    };
  }

  getReorderList() {
    const items = (this.db.data.storeItems || []).filter(i => (i.category || '').toUpperCase() !== 'GODOWN');
    const txs = this.db.data.storeTransactions || [];

    return items.map(item => {
      let inQ = 0;
      let outQ = 0;
      const min = parseInt(item.minStock) || 0;

      txs.forEach(t => {
        if ((t.itemCode && t.itemCode.toLowerCase() === item.code.toLowerCase()) ||
            (t.itemName && t.itemName.toLowerCase() === item.name.toLowerCase())) {
          const q = parseInt(t.qty) || 0;
          const type = (t.tabType || '').toUpperCase();
          if (['PURCHASE RECEIPT', 'STOCK IN', 'OPENING STOCK'].includes(type)) inQ += q;
          else if (['MATERIAL ISSUE', 'STOCK OUT'].includes(type)) outQ += q;
        }
      });

      const current = Math.max(0, inQ - outQ);
      const shortage = Math.max(0, min - current);

      return {
        code: item.code,
        name: item.name,
        currentStock: current,
        reorderLevel: min,
        shortage,
        status: shortage > 0 ? 'REORDER' : 'OK',
        unit: item.unit
      };
    });
  }

  getStockLedger() {
    const txs = [...(this.db.data.storeTransactions || [])].reverse();
    let running = 0;

    return txs.map(t => {
      const q = parseInt(t.qty) || 0;
      const type = (t.tabType || '').toUpperCase();
      const isIn = ['PURCHASE RECEIPT', 'STOCK IN', 'OPENING STOCK'].includes(type);
      const inQ = isIn ? q : 0;
      const outQ = isIn ? 0 : q;
      running = running + inQ - outQ;

      return {
        date: t.date,
        itemCode: t.itemCode,
        itemName: t.itemName,
        tabType: t.tabType,
        refNo: t.refNo,
        inQty: inQ,
        outQty: outQ,
        balance: running,
        unit: t.unit
      };
    }).reverse();
  }
}

module.exports = StoreRepository;
