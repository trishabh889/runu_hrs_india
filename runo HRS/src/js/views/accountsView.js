// ==========================================================================
// RUNO HRS INDIA - Accounts View Controller (Tally-Style Interface)
// ==========================================================================

let activeAccountsTab = 'DASHBOARD';

function initAccounts() {
  // Tab Bar handling
  const tabButtons = document.querySelectorAll('#accounts-tab-bar .dept-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAccountsTab = btn.getAttribute('data-tab');
      renderAccountsTab(activeAccountsTab);
    });
  });

  // Search input
  const searchInput = document.getElementById('search-accounts');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderAccountsTable(activeAccountsTab, searchInput.value.trim());
    });
  }

  // Action Buttons
  const btnAdd = document.getElementById('btn-add-account-entry');
  if (btnAdd) {
    btnAdd.addEventListener('click', openAddAccountEntryModal);
  }

  const btnExcel = document.getElementById('btn-export-accounts-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      window.exportTableToExcel('accounts-table', `Accounts_${activeAccountsTab.replace(/\s+/g, '_')}`);
    });
  }

  const btnPdf = document.getElementById('btn-export-accounts-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      window.exportTableToPDF('accounts-table', `RUNO HRS INDIA - ACCOUNTS (${activeAccountsTab})`);
    });
  }

  // Modal Form Submission
  const form = document.getElementById('form-account-entry');
  if (form) {
    form.addEventListener('submit', async () => {
      const date = document.getElementById('acc-entry-date').value;
      const tabType = document.getElementById('acc-entry-type').value;
      const particulars = document.getElementById('acc-entry-particulars').value.trim();
      const refNo = document.getElementById('acc-entry-ref').value.trim();
      const amount = document.getElementById('acc-entry-amount').value.trim();

      if (!particulars || !amount) {
        window.showToast('Please enter particulars and amount', 'error');
        return;
      }

      const res = await window.api.createAccountEntry({ date, tabType, particulars, refNo, amount });
      if (res.success) {
        window.showToast(`Voucher posted successfully for ${particulars}`, 'success');
        window.closeModal('modal-account-entry');
        form.reset();
        loadAccounts();
      }
    });
  }
}

function openAddAccountEntryModal() {
  const dateInput = document.getElementById('acc-entry-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
  const typeSelect = document.getElementById('acc-entry-type');
  if (typeSelect && !['DASHBOARD', 'LEDGER', 'REPORTS', 'BANK / CASH', 'GST', 'RECEIVABLE', 'PAYABLE'].includes(activeAccountsTab)) {
    typeSelect.value = activeAccountsTab;
  }
  window.openModal('modal-account-entry');
}

async function loadAccounts() {
  await renderAccountsTab(activeAccountsTab);
}

async function renderAccountsTab(tab) {
  const dashboardSec = document.getElementById('accounts-dashboard-section');
  const tableSec = document.getElementById('accounts-table-section');
  const tabTitle = document.getElementById('accounts-active-tab-title');

  if (tab === 'DASHBOARD') {
    if (dashboardSec) dashboardSec.style.display = 'block';
    if (tableSec) tableSec.style.display = 'none';

    try {
      const stats = await window.api.getAccountsStats();
      document.getElementById('acc-stat-sales').innerText = `₹ ${stats.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      document.getElementById('acc-stat-purchase').innerText = `₹ ${stats.totalPurchase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      document.getElementById('acc-stat-receivable').innerText = `₹ ${stats.receivable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      document.getElementById('acc-stat-payable').innerText = `₹ ${stats.payable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      // Populate recent sales
      const salesBody = document.getElementById('acc-recent-sales-body');
      if (salesBody) {
        salesBody.innerHTML = '';
        (stats.recentSales || []).forEach(s => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${s.date}</td>
            <td style="font-weight: 600;">${s.particulars}</td>
            <td><span style="font-family: var(--font-primary); color: var(--brand-orange);">${s.refNo}</span></td>
            <td style="font-weight: 700; color: #10B981;">₹ ${parseFloat(s.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          `;
          salesBody.appendChild(tr);
        });
      }

      // Populate recent purchases
      const purBody = document.getElementById('acc-recent-purchase-body');
      if (purBody) {
        purBody.innerHTML = '';
        (stats.recentPurchases || []).forEach(p => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${p.date}</td>
            <td style="font-weight: 600;">${p.particulars}</td>
            <td><span style="font-family: var(--font-primary); color: var(--text-secondary);">${p.refNo}</span></td>
            <td style="font-weight: 700; color: #EF4444;">₹ ${parseFloat(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          `;
          purBody.appendChild(tr);
        });
      }
    } catch (err) {
      console.error('Failed to load account stats:', err);
    }
  } else {
    if (dashboardSec) dashboardSec.style.display = 'none';
    if (tableSec) tableSec.style.display = 'block';
    if (tabTitle) tabTitle.innerText = `${tab} VOUCHERS`;
    await renderAccountsTable(tab);
  }
}

async function renderAccountsTable(tab, search = '') {
  const tbody = document.getElementById('accounts-table-body');
  const thead = document.getElementById('accounts-table-head');
  if (!tbody || !thead) return;

  tbody.innerHTML = '';

  if (tab === 'LEDGER') {
    thead.innerHTML = `
      <tr>
        <th>DATE</th>
        <th>PARTICULARS</th>
        <th>VOUCHER / REF</th>
        <th>VOUCHER TYPE</th>
        <th>DEBIT (₹)</th>
        <th>CREDIT (₹)</th>
        <th>BALANCE (₹)</th>
      </tr>
    `;

    const ledger = await window.api.getAccountsLedger(search);
    if (ledger.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No ledger entries found.</td></tr>';
      return;
    }

    ledger.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.date}</td>
        <td style="font-weight: 700; color: var(--text-primary);">${row.particulars}</td>
        <td><span style="font-family: var(--font-primary); font-size: 11px;">${row.refNo}</span></td>
        <td><span class="badge badge-active">${row.tabType}</span></td>
        <td style="color: ${row.debit > 0 ? '#EF4444' : 'var(--text-muted)'}; font-weight: 600;">${row.debit > 0 ? `₹ ${row.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}</td>
        <td style="color: ${row.credit > 0 ? '#10B981' : 'var(--text-muted)'}; font-weight: 600;">${row.credit > 0 ? `₹ ${row.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}</td>
        <td style="font-weight: 700; color: var(--brand-orange);">₹ ${row.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      `;
      tbody.appendChild(tr);
    });
  } else {
    thead.innerHTML = `
      <tr>
        <th>DATE</th>
        <th>PARTICULARS / PARTY</th>
        <th>REFERENCE NO</th>
        <th>TYPE</th>
        <th>AMOUNT (₹)</th>
        <th>STATUS</th>
      </tr>
    `;

    const entries = await window.api.getAccounts(tab, search);
    if (entries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No vouchers recorded for ${tab}. Click "+ NEW ENTRY" to post one.</td></tr>`;
      return;
    }

    entries.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${e.date}</td>
        <td style="font-weight: 700; color: var(--text-primary);">${e.particulars}</td>
        <td><span style="font-family: var(--font-primary); font-size: 11px; background: var(--bg-surface); padding: 2px 6px; border-radius: 3px;">${e.refNo}</span></td>
        <td><span class="badge badge-active">${e.tabType}</span></td>
        <td style="font-weight: 700; color: var(--brand-orange); font-size: 13px;">₹ ${parseFloat(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td><span class="badge badge-completed">${e.status}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

window.initAccounts = initAccounts;
window.loadAccounts = loadAccounts;
