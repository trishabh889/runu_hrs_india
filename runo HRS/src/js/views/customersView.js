// ==========================================================================
// RUNO HRS INDIA - Customers Directory View Controller
// ==========================================================================

const getVal = id => (document.getElementById(id) ? document.getElementById(id).value.trim() : '');
const setVal = (id, val) => { if (document.getElementById(id)) document.getElementById(id).value = val || ''; };

function initCustomers() {
  const searchInput = document.getElementById('search-customers');
  const fyFilter = document.getElementById('filter-cust-fy');
  const catFilter = document.getElementById('filter-cust-category');

  const trigger = () => loadCustomers(searchInput ? searchInput.value.trim() : '');

  if (searchInput) searchInput.addEventListener('input', trigger);
  if (fyFilter) fyFilter.addEventListener('change', trigger);
  if (catFilter) catFilter.addEventListener('change', trigger);

  const btnAdd = document.getElementById('btn-add-customer-modal');
  if (btnAdd) btnAdd.addEventListener('click', openAddCustomerModal);

  const btnExcel = document.getElementById('btn-export-customers-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      window.exportTableToExcel('customers-table-body', 'RUNO_Customers_Directory');
    });
  }

  const btnPdf = document.getElementById('btn-export-customers-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      window.exportTableToPDF('customers-table-body', 'RUNO HRS INDIA - CUSTOMERS DIRECTORY');
    });
  }

  const form = document.getElementById('form-customer');
  if (form) {
    form.addEventListener('submit', async () => {
      const id = getVal('cust-id');
      const data = {
        company_name: getVal('cust-company'),
        customer_code: getVal('cust-code'),
        industry: getVal('cust-industry'),
        tier: getVal('cust-tier'),
        payment_terms: getVal('cust-payment-terms'),
        contact_person: getVal('cust-contact'),
        designation: getVal('cust-designation'),
        phone: getVal('cust-phone'),
        email: getVal('cust-email'),
        gstin: getVal('cust-gstin'),
        pan: getVal('cust-pan'),
        city_state: getVal('cust-city'),
        pincode: getVal('cust-pincode'),
        address: getVal('cust-address'),
        section: getVal('cust-section') || 'HRS'
      };

      if (!data.company_name) {
        window.showToast('Please enter company name', 'error');
        return;
      }

      if (id) {
        const res = await window.api.updateCustomer(id, data);
        if (res.success) window.showToast('Client profile updated', 'success');
      } else {
        const res = await window.api.createCustomer(data);
        if (res.success) window.showToast('Client registered successfully', 'success');
      }
      window.closeModal('modal-customer');
      loadCustomers();
    });
  }
}

function openAddCustomerModal() {
  document.getElementById('modal-customer-title').innerText = 'CLIENT ACCOUNT REGISTRATION';
  ['cust-id', 'cust-company', 'cust-code', 'cust-contact', 'cust-designation',
   'cust-phone', 'cust-email', 'cust-gstin', 'cust-pan', 'cust-city',
   'cust-pincode', 'cust-address'].forEach(id => setVal(id, ''));
  setVal('cust-industry', 'Automotive Lighting & Plastics');
  setVal('cust-tier', 'Tier-1 OEM Supplier');
  setVal('cust-payment-terms', '30 Days Net');
  setVal('cust-section', 'HRS');
  window.openModal('modal-customer');
}

async function loadCustomers(search = '') {
  const fy = document.getElementById('filter-cust-fy') ? document.getElementById('filter-cust-fy').value : 'ALL';
  const category = document.getElementById('filter-cust-category') ? document.getElementById('filter-cust-category').value : 'ALL';

  try {
    let list = await window.api.getCustomers(search);

    // Apply category filter if specified
    if (category !== 'ALL') {
      list = list.filter(c => {
        const b = c.breakdown || {};
        if (category === 'HRS') return b.hrs > 0 || (c.section || '').toUpperCase() === 'HRS';
        if (category === 'HRTC') return b.hrtc > 0 || (c.section || '').toUpperCase() === 'HRTC';
        if (category === 'SPARE-HRS') return b.spareHrs > 0 || (c.section || '').toUpperCase().includes('SPARE-HRS');
        if (category === 'SPARE-HRTC') return b.spareHrtc > 0 || (c.section || '').toUpperCase().includes('SPARE-HRTC');
        return true;
      });
    }

    window.AppState.customers = list;
    const tbody = document.getElementById('customers-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No customer records found matching filters.</td></tr>';
      return;
    }

    list.forEach(c => {
      const b = c.breakdown || { hrs: 0, hrtc: 0, spareHrs: 0, spareHrtc: 0 };
      const badges = [];
      if (b.hrs > 0) badges.push(`<span class="badge badge-active">${b.hrs} HRS</span>`);
      if (b.hrtc > 0) badges.push(`<span class="badge badge-completed">${b.hrtc} HRTC</span>`);
      if (b.spareHrs > 0) badges.push(`<span class="badge badge-review">${b.spareHrs} SPARE-HRS</span>`);
      if (b.spareHrtc > 0) badges.push(`<span class="badge badge-review">${b.spareHrtc} SPARE-HRTC</span>`);
      const breakdownHtml = badges.length > 0 ? `<div style="display: flex; gap: 4px; flex-wrap: wrap;">${badges.join('')}</div>` : `<span style="color: var(--text-muted); font-size: 11px;">0 Projects</span>`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 13px;">${c.company_name}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="color: var(--brand-orange); font-weight: 700;">${c.customer_code || 'RUNO-CUST'}</span>
            ${c.city_state ? `<span style="color: var(--text-secondary);">&bull; ${c.city_state}</span>` : ''}
            ${c.tier ? `<span style="background: var(--bg-card-hover); border: 1px solid var(--border-subtle); padding: 1px 5px; border-radius: 3px; font-size: 10px;">${c.tier}</span>` : ''}
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 13px;">${c.contact_person || '-'}</div>
          ${c.designation ? `<div style="font-size: 11px; color: var(--text-muted); margin-top: 1px;">${c.designation}</div>` : ''}
        </td>
        <td style="color: var(--text-secondary); font-size: 12px; font-weight: 600;">${c.phone || '-'}</td>
        <td style="color: var(--text-secondary); font-size: 12px;">${c.email || '-'}</td>
        <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${c.address || ''}">
          <div style="font-size: 12px; color: var(--text-secondary);">${c.city_state || c.address || '-'}</div>
          ${c.gstin ? `<span style="font-family: monospace; font-size: 10px; color: var(--text-muted);">${c.gstin}</span>` : ''}
        </td>
        <td>${breakdownHtml}</td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="Edit" onclick="editCustomer('${c.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon danger" title="Delete" onclick="deleteCustomer('${c.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Failed to load customers:', e);
  }
}

window.editCustomer = function(id) {
  const c = window.AppState.customers.find(item => item.id === id);
  if (!c) return;
  document.getElementById('modal-customer-title').innerText = 'EDIT CLIENT ACCOUNT';
  setVal('cust-id', c.id);
  setVal('cust-company', c.company_name);
  setVal('cust-code', c.customer_code);
  setVal('cust-industry', c.industry || 'Automotive Lighting & Plastics');
  setVal('cust-tier', c.tier || 'Tier-1 OEM Supplier');
  setVal('cust-payment-terms', c.payment_terms || '30 Days Net');
  setVal('cust-contact', c.contact_person);
  setVal('cust-designation', c.designation);
  setVal('cust-phone', c.phone);
  setVal('cust-email', c.email);
  setVal('cust-gstin', c.gstin);
  setVal('cust-pan', c.pan);
  setVal('cust-city', c.city_state);
  setVal('cust-pincode', c.pincode);
  setVal('cust-address', c.address);
  setVal('cust-section', c.section || 'HRS');
  window.openModal('modal-customer');
};

window.deleteCustomer = async function(id) {
  const confirmed = await window.showConfirmDialog({
    title: 'DELETE CUSTOMER PROFILE',
    message: 'Are you sure you want to delete this customer?',
    subtext: 'All associated delivery address and tax info will be removed.',
    confirmText: 'DELETE CUSTOMER',
    cancelText: 'KEEP RECORD',
    danger: true
  });
  if (!confirmed) return;

  const res = await window.api.deleteCustomer(id);
  if (res.success) {
    window.showToast('Customer profile deleted', 'info');
    loadCustomers();
  } else {
    window.showToast(res.message || 'Cannot delete customer', 'error');
  }
};

window.initCustomers = initCustomers;
window.loadCustomers = loadCustomers;
