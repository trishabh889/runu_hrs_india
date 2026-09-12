// ==========================================================================
// RUNO HRS INDIA - Customers Directory View Controller
// ==========================================================================

const getVal = id => (document.getElementById(id) ? document.getElementById(id).value.trim() : '');
const setVal = (id, val) => { if (document.getElementById(id)) document.getElementById(id).value = val || ''; };

function extractCityState(cust) {
  let city = (cust.city || '').trim();
  let state = (cust.state || '').trim();

  if ((!city || !state) && cust.city_state) {
    const parts = cust.city_state.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      if (!city) city = parts[0];
      if (!state) state = parts[1];
    } else if (parts.length === 1 && !city) {
      city = parts[0];
    }
  }

  if (!state && cust.address) {
    const knownStates = ['Haryana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 'Rajasthan', 'Delhi', 'Punjab'];
    for (const st of knownStates) {
      if (cust.address.toLowerCase().includes(st.toLowerCase())) {
        state = st;
        break;
      }
    }
  }

  return {
    city: city || 'Other',
    state: state || 'Other'
  };
}

function populateCityStateDropdowns(allCustomers) {
  const citySelect = document.getElementById('filter-cust-city');
  const stateSelect = document.getElementById('filter-cust-state');
  if (!citySelect || !stateSelect) return;

  const currentCity = citySelect.value || 'ALL';
  const currentState = stateSelect.value || 'ALL';

  const citiesSet = new Set();
  const statesSet = new Set();

  (allCustomers || []).forEach(c => {
    const cs = extractCityState(c);
    if (cs.city && cs.city !== 'Other') citiesSet.add(cs.city);
    if (cs.state && cs.state !== 'Other') statesSet.add(cs.state);
  });

  const sortedCities = Array.from(citiesSet).sort();
  const sortedStates = Array.from(statesSet).sort();

  citySelect.innerHTML = '<option value="ALL">City: All</option>' +
    sortedCities.map(ct => `<option value="${ct}" ${ct === currentCity ? 'selected' : ''}>${ct}</option>`).join('');

  stateSelect.innerHTML = '<option value="ALL">State: All</option>' +
    sortedStates.map(st => `<option value="${st}" ${st === currentState ? 'selected' : ''}>${st}</option>`).join('');
}

function getCustomerMatchingProjects(customer, allProjects, category) {
  const custName = (customer.company_name || '').toLowerCase().trim();
  const custId = customer.id;

  const custProjects = (allProjects || []).filter(p => {
    const pName = (p.customer_name || p.customer || '').toLowerCase().trim();
    return (pName && pName === custName) || (p.customer_id && p.customer_id === custId);
  });

  if (!category || category === 'ALL') {
    return custProjects;
  }

  const catTarget = category.toUpperCase().replace(/\s*-\s*/g, '-').trim();
  return custProjects.filter(p => {
    const pCat = (p.category || p.hrs_type || '').toUpperCase().replace(/\s*-\s*/g, '-').trim();
    return pCat === catTarget || pCat.includes(catTarget);
  });
}

function initCustomers() {
  const searchInput = document.getElementById('search-customers');
  const cityFilter = document.getElementById('filter-cust-city');
  const stateFilter = document.getElementById('filter-cust-state');
  const categoryFilter = document.getElementById('filter-cust-project-category');

  const trigger = () => loadCustomers();

  if (searchInput) searchInput.addEventListener('input', trigger);
  if (cityFilter) cityFilter.addEventListener('change', trigger);
  if (stateFilter) stateFilter.addEventListener('change', trigger);
  if (categoryFilter) categoryFilter.addEventListener('change', trigger);

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
      const city = getVal('cust-city');
      const state = getVal('cust-state');
      const city_state = (city && state) ? `${city}, ${state}` : (city || state || '');

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
        city: city,
        state: state,
        city_state: city_state,
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
   'cust-phone', 'cust-email', 'cust-gstin', 'cust-pan', 'cust-city', 'cust-state',
   'cust-pincode', 'cust-address'].forEach(id => setVal(id, ''));
  setVal('cust-industry', 'Automotive Lighting & Plastics');
  setVal('cust-tier', 'Tier-1 OEM Supplier');
  setVal('cust-payment-terms', '30 Days Net');
  setVal('cust-section', 'HRS');
  window.openModal('modal-customer');
}

async function loadCustomers() {
  const searchInput = document.getElementById('search-customers');
  const cityFilter = document.getElementById('filter-cust-city');
  const stateFilter = document.getElementById('filter-cust-state');
  const categoryFilter = document.getElementById('filter-cust-project-category');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedCity = cityFilter ? cityFilter.value : 'ALL';
  const selectedState = stateFilter ? stateFilter.value : 'ALL';
  const selectedCat = categoryFilter ? categoryFilter.value : 'ALL';

  try {
    let [rawCustomers, allProjects] = await Promise.all([
      window.api.getCustomers(''),
      window.api.getProjects()
    ]);
    rawCustomers = rawCustomers || [];
    allProjects = allProjects || [];

    // Populate City and State dropdowns dynamically on first load or refresh
    populateCityStateDropdowns(rawCustomers);

    // Filter customers
    let filtered = rawCustomers.filter(c => {
      const cs = extractCityState(c);

      // Search keyword filter
      if (query) {
        const match =
          (c.company_name && c.company_name.toLowerCase().includes(query)) ||
          (c.customer_code && c.customer_code.toLowerCase().includes(query)) ||
          (c.contact_person && c.contact_person.toLowerCase().includes(query)) ||
          (c.designation && c.designation.toLowerCase().includes(query)) ||
          (c.phone && c.phone.toLowerCase().includes(query)) ||
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.gstin && c.gstin.toLowerCase().includes(query)) ||
          (cs.city && cs.city.toLowerCase().includes(query)) ||
          (cs.state && cs.state.toLowerCase().includes(query)) ||
          (c.address && c.address.toLowerCase().includes(query));
        if (!match) return false;
      }

      // City filter
      if (selectedCity !== 'ALL' && cs.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // State filter
      if (selectedState !== 'ALL' && cs.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      return true;
    });

    // Compute matching project count per customer for selected category
    filtered.forEach(c => {
      const matching = getCustomerMatchingProjects(c, allProjects, selectedCat);
      c._matchingProjects = matching;
      c._matchingCount = matching.length;
    });

    // Sort: if specific category selected, bubble customers with matching projects first
    if (selectedCat !== 'ALL') {
      filtered.sort((a, b) => (b._matchingCount - a._matchingCount) || a.company_name.localeCompare(b.company_name));
    } else {
      filtered.sort((a, b) => a.company_name.localeCompare(b.company_name));
    }

    window.AppState.customers = filtered;
    window.AppState.allProjects = allProjects;

    const tbody = document.getElementById('customers-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 28px;">No customer records found matching the selected filters.</td></tr>';
      return;
    }

    filtered.forEach(c => {
      const cs = extractCityState(c);
      const cityStateText = (cs.city && cs.state && cs.city !== 'Other')
        ? `${cs.city}, ${cs.state}`
        : (c.city_state || c.address || 'India');

      const count = c._matchingCount || 0;
      const isCountActive = count > 0;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight: 700; color: #FFFFFF; font-size: 13.5px; letter-spacing: 0.2px;">${c.company_name}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 3px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="color: var(--brand-orange); font-weight: 800;">${c.customer_code || 'RUNO-CUST'}</span>
            <span style="color: #64748B;">&bull;</span>
            <span style="color: #CBD5E1;">${cityStateText}</span>
            <span style="color: #64748B;">|</span>
            <span style="color: #94A3B8;">${c.tier || 'Tier-1 OEM Supplier'}</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: #FFFFFF; font-size: 12.5px;">${c.contact_person || '-'}</div>
          ${c.designation ? `<div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">${c.designation}</div>` : ''}
        </td>
        <td style="color: #E2E8F0; font-size: 12px; font-weight: 600; white-space: nowrap;">${c.phone || '-'}</td>
        <td style="color: #94A3B8; font-size: 12px;">${c.email || '-'}</td>
        <td style="font-family: var(--font-primary); font-size: 11px; color: #CBD5E1; letter-spacing: 0.5px; white-space: nowrap;">${c.gstin || '-'}</td>
        <td style="text-align: center;">
          <button class="btn-cust-projects-pill ${isCountActive ? 'has-projects' : 'zero-projects'}" 
                  onclick="openCustomerProjectsModal('${c.id}', '${selectedCat}')" 
                  title="Click to view ${count} ${selectedCat} projects for ${c.company_name}">
            ${count} PROJECTS
          </button>
        </td>
        <td style="text-align: center;">
          <div class="table-actions" style="justify-content: center;">
            <button class="btn-icon" title="Edit Client Account" onclick="editCustomer('${c.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon danger" title="Delete Client Account" onclick="deleteCustomer('${c.id}')">
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

window.openCustomerProjectsModal = function(customerId, category = 'ALL') {
  const c = (window.AppState.customers || []).find(item => item.id === customerId);
  if (!c) return;

  const allProjects = window.AppState.allProjects || [];
  const matchingProjects = getCustomerMatchingProjects(c, allProjects, category);

  const titleEl = document.getElementById('modal-cust-proj-title');
  const subEl = document.getElementById('modal-cust-proj-subtitle');
  const catEl = document.getElementById('modal-cust-proj-category');
  const countEl = document.getElementById('modal-cust-proj-count');
  const tbody = document.getElementById('cust-projects-table-body');

  if (titleEl) titleEl.innerText = `PROJECTS: ${c.company_name.toUpperCase()}`;
  if (subEl) subEl.innerText = `${c.customer_code || 'RUNO-CUST'} • Associated Engineering & Tooling Projects`;
  if (catEl) catEl.innerText = category === 'ALL' ? 'ALL PROJECTS' : category;
  if (countEl) countEl.innerText = `${matchingProjects.length} PROJECTS`;

  if (tbody) {
    tbody.innerHTML = '';
    if (matchingProjects.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94A3B8; padding: 24px;">No ${category === 'ALL' ? '' : category + ' '}projects found for ${c.company_name}.</td></tr>`;
    } else {
      matchingProjects.forEach(p => {
        const cat = p.category || p.hrs_type || 'HRS';
        const st = (p.status || 'ACTIVE').toUpperCase();
        const po = (p.po_received || 'PENDING').toUpperCase();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight: 700; color: var(--brand-orange);">${p.project_code || '-'}</td>
          <td style="color: #FFFFFF; font-weight: 600;">${p.mould_description || p.project_name || '-'}</td>
          <td><span class="badge badge-category">${cat}</span></td>
          <td><span class="badge badge-${st.toLowerCase().replace(/\s+/g, '-')}">${st}</span></td>
          <td><span class="badge ${po === 'RECEIVED' ? 'badge-completed' : 'badge-pending'}">${po}</span></td>
          <td style="color: #38BDF8; font-weight: 700;">${p.value || (p.cost ? '₹ ' + Number(p.cost).toLocaleString('en-IN') : '-')}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  window.openModal('modal-customer-projects');
};

window.editCustomer = function(id) {
  const c = (window.AppState.customers || []).find(item => item.id === id);
  if (!c) return;
  const cs = extractCityState(c);

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
  setVal('cust-city', c.city || cs.city);
  setVal('cust-state', c.state || cs.state);
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
