// ==========================================================================
// RUNO HRS INDIA - Store View Controller (BUSY-Style Warehouse System)
// ==========================================================================

let activeStoreTab = 'DASHBOARD';

function initStore() {
  const tabButtons = document.querySelectorAll('#store-tab-bar .dept-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStoreTab = btn.getAttribute('data-tab');
      renderStoreTab(activeStoreTab);
    });
  });

  const searchInput = document.getElementById('search-store');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderStoreTable(activeStoreTab, searchInput.value.trim());
    });
  }

  const btnAdd = document.getElementById('btn-add-store-entry');
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      if (activeStoreTab === 'ITEM MASTER' || activeStoreTab === 'GODOWN / LOCATION') {
        const catSelect = document.getElementById('st-item-category');
        if (catSelect) catSelect.value = activeStoreTab === 'GODOWN / LOCATION' ? 'GODOWN' : 'NOZZLE COMPONENTS';
        window.openModal('modal-store-item');
      } else {
        const typeSelect = document.getElementById('st-tx-type');
        if (typeSelect && !['DASHBOARD', 'REORDER LEVEL', 'STOCK LEDGER', 'REPORTS'].includes(activeStoreTab)) {
          typeSelect.value = activeStoreTab;
        }
        const dateInput = document.getElementById('st-tx-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
        window.openModal('modal-store-transaction');
      }
    });
  }

  const btnExcel = document.getElementById('btn-export-store-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      window.exportTableToExcel('store-table', `Store_${activeStoreTab.replace(/\s+/g, '_')}`);
    });
  }

  const btnPdf = document.getElementById('btn-export-store-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      window.exportTableToPDF('store-table', `RUNO HRS INDIA - STORE (${activeStoreTab})`);
    });
  }

  // Modal Item Form Submission
  const formItem = document.getElementById('form-store-item');
  if (formItem) {
    formItem.addEventListener('submit', async () => {
      const code = document.getElementById('st-item-code').value.trim();
      const name = document.getElementById('st-item-name').value.trim();
      const category = document.getElementById('st-item-category').value;
      const unit = document.getElementById('st-item-unit').value;
      const minStock = document.getElementById('st-item-min').value;
      const maxStock = document.getElementById('st-item-max').value;
      const location = document.getElementById('st-item-location').value.trim();

      if (!name) {
        window.showToast('Please enter item or godown name', 'error');
        return;
      }

      const res = await window.api.createStoreItem({ code, name, category, unit, minStock, maxStock, location });
      if (res.success) {
        window.showToast(`Saved ${name} into Inventory`, 'success');
        window.closeModal('modal-store-item');
        formItem.reset();
        loadStore();
      }
    });
  }

  // Modal Transaction Form Submission
  const formTx = document.getElementById('form-store-transaction');
  if (formTx) {
    formTx.addEventListener('submit', async () => {
      const date = document.getElementById('st-tx-date').value;
      const tabType = document.getElementById('st-tx-type').value;
      const refNo = document.getElementById('st-tx-ref').value.trim();
      const itemCode = document.getElementById('st-tx-code').value.trim();
      const itemName = document.getElementById('st-tx-name').value.trim();
      const partyOrDept = document.getElementById('st-tx-party').value.trim();
      const qty = document.getElementById('st-tx-qty').value.trim();
      const unit = document.getElementById('st-tx-unit').value;
      const location = document.getElementById('st-tx-loc').value.trim();

      if (!itemCode || !partyOrDept || !qty) {
        window.showToast('Item code, party/dept and quantity are required', 'error');
        return;
      }

      const res = await window.api.createStoreTransaction({
        date, tabType, refNo, itemCode, itemName, partyOrDept, qty, unit, location
      });

      if (res.success) {
        window.showToast(`Transaction ${refNo || itemCode} posted`, 'success');
        window.closeModal('modal-store-transaction');
        formTx.reset();
        loadStore();
      }
    });
  }
}

async function loadStore() {
  await renderStoreTab(activeStoreTab);
}

async function renderStoreTab(tab) {
  const dashboardSec = document.getElementById('store-dashboard-section');
  const tableSec = document.getElementById('store-table-section');
  const tabTitle = document.getElementById('store-active-tab-title');

  if (tab === 'DASHBOARD') {
    if (dashboardSec) dashboardSec.style.display = 'block';
    if (tableSec) tableSec.style.display = 'none';

    try {
      const stats = await window.api.getStoreStats();
      document.getElementById('store-stat-items').innerText = stats.totalItems;
      document.getElementById('store-stat-stock').innerText = stats.totalStock.toLocaleString();
      document.getElementById('store-stat-low').innerText = stats.lowStock;
      document.getElementById('store-stat-value').innerText = stats.stockValue;
      document.getElementById('store-stat-purchase').innerText = stats.purchaseQty.toLocaleString();
      document.getElementById('store-stat-issue').innerText = stats.issueQty.toLocaleString();
      document.getElementById('store-stat-godowns').innerText = stats.godowns;

      // Populate Reorder Alerts Table
      const reorderList = await window.api.getReorderList();
      const summaryBody = document.getElementById('store-reorder-summary-body');
      if (summaryBody) {
        summaryBody.innerHTML = '';
        const alerts = reorderList.filter(r => r.status === 'REORDER');
        if (alerts.length === 0) {
          summaryBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #10B981; padding: 18px;">All stock levels are above minimum reorder threshold.</td></tr>';
        } else {
          alerts.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><span style="color: var(--brand-orange); font-weight: 700;">${r.code}</span></td>
              <td style="font-weight: 600;">${r.name}</td>
              <td style="font-weight: 700; color: #EF4444;">${r.currentStock} ${r.unit}</td>
              <td>${r.reorderLevel} ${r.unit}</td>
              <td style="font-weight: 700; color: #EF4444;">-${r.shortage} ${r.unit}</td>
              <td><span class="badge badge-review">REORDER</span></td>
            `;
            summaryBody.appendChild(tr);
          });
        }
      }
    } catch (err) {
      console.error('Failed to load store stats:', err);
    }
  } else {
    if (dashboardSec) dashboardSec.style.display = 'none';
    if (tableSec) tableSec.style.display = 'block';
    if (tabTitle) tabTitle.innerText = `${tab} DIRECTORY`;
    await renderStoreTable(tab);
  }
}

async function renderStoreTable(tab, search = '') {
  const tbody = document.getElementById('store-table-body');
  const thead = document.getElementById('store-table-head');
  if (!tbody || !thead) return;

  tbody.innerHTML = '';

  if (tab === 'ITEM MASTER') {
    thead.innerHTML = `
      <tr>
        <th>SKU CODE</th>
        <th>ITEM NAME</th>
        <th>CATEGORY</th>
        <th>UNIT</th>
        <th>MIN STOCK</th>
        <th>MAX STOCK</th>
        <th>STORAGE BIN</th>
        <th>ACTIVE</th>
      </tr>
    `;
    const items = await window.api.getStoreItems('ALL', search);
    if (items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No inventory items registered.</td></tr>';
      return;
    }
    items.forEach(i => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${i.code}</span></td>
        <td style="font-weight: 600;">${i.name}</td>
        <td><span class="badge badge-active">${i.category}</span></td>
        <td>${i.unit}</td>
        <td>${i.minStock}</td>
        <td>${i.maxStock}</td>
        <td>${i.location || '-'}</td>
        <td><span class="badge badge-completed">${i.active}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } else if (tab === 'GODOWN / LOCATION') {
    thead.innerHTML = `
      <tr>
        <th>LOCATION CODE</th>
        <th>GODOWN / WAREHOUSE</th>
        <th>ADDRESS / AREA</th>
        <th>PHONE CONTACT</th>
        <th>STATUS</th>
      </tr>
    `;
    const godowns = await window.api.getGodowns(search);
    if (godowns.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No godown locations registered.</td></tr>';
      return;
    }
    godowns.forEach(g => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${g.code}</span></td>
        <td style="font-weight: 700;">${g.name}</td>
        <td>${g.minStock || '-'}</td>
        <td>${g.location || '-'}</td>
        <td><span class="badge badge-completed">${g.active}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } else if (tab === 'REORDER LEVEL') {
    thead.innerHTML = `
      <tr>
        <th>SKU CODE</th>
        <th>ITEM NAME</th>
        <th>CURRENT STOCK</th>
        <th>REORDER LEVEL</th>
        <th>SHORTAGE</th>
        <th>STATUS</th>
      </tr>
    `;
    const list = await window.api.getReorderList();
    list.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${r.code}</span></td>
        <td style="font-weight: 600;">${r.name}</td>
        <td style="font-weight: 700;">${r.currentStock} ${r.unit}</td>
        <td>${r.reorderLevel} ${r.unit}</td>
        <td style="font-weight: 700; color: ${r.shortage > 0 ? '#EF4444' : '#10B981'};">${r.shortage > 0 ? `-${r.shortage}` : '0'} ${r.unit}</td>
        <td><span class="badge ${r.status === 'REORDER' ? 'badge-review' : 'badge-completed'}">${r.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  } else if (tab === 'STOCK LEDGER') {
    thead.innerHTML = `
      <tr>
        <th>DATE</th>
        <th>SKU CODE</th>
        <th>ITEM NAME</th>
        <th>TYPE</th>
        <th>REF NO</th>
        <th>IN QTY</th>
        <th>OUT QTY</th>
        <th>RUNNING BALANCE</th>
      </tr>
    `;
    const ledger = await window.api.getStockLedger();
    ledger.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.date}</td>
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${row.itemCode}</span></td>
        <td style="font-weight: 600;">${row.itemName}</td>
        <td><span class="badge badge-active">${row.tabType}</span></td>
        <td>${row.refNo}</td>
        <td style="font-weight: 700; color: #10B981;">${row.inQty > 0 ? `+${row.inQty}` : '-'}</td>
        <td style="font-weight: 700; color: #EF4444;">${row.outQty > 0 ? `-${row.outQty}` : '-'}</td>
        <td style="font-weight: 700; color: var(--text-primary); font-size: 13px;">${row.balance} ${row.unit}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    thead.innerHTML = `
      <tr>
        <th>DATE</th>
        <th>REF NO</th>
        <th>ITEM CODE</th>
        <th>ITEM / MATERIAL</th>
        <th>PARTY / DEPARTMENT</th>
        <th>QUANTITY</th>
        <th>LOCATION</th>
        <th>STATUS</th>
      </tr>
    `;
    const txs = await window.api.getStoreTransactions(tab, search);
    if (txs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No transactions recorded for ${tab}.</td></tr>`;
      return;
    }
    txs.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.date}</td>
        <td><span style="font-family: monospace; font-size: 11px;">${t.refNo}</span></td>
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${t.itemCode}</span></td>
        <td style="font-weight: 600;">${t.itemName}</td>
        <td>${t.partyOrDept}</td>
        <td style="font-weight: 700;">${t.qty} ${t.unit}</td>
        <td>${t.location || '-'}</td>
        <td><span class="badge badge-completed">${t.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

window.initStore = initStore;
window.loadStore = loadStore;
