// ==========================================================================
// RUNO HRS INDIA - Commercial View Controller (Dual Workspace & RBAC)
// ==========================================================================

let activeCommercialTab = 'hrs';

function initCommercial() {
  const trigger = () => loadCommercial();
  ['search-commercial', 'filter-comm-quote', 'filter-comm-po', 'filter-comm-date-start', 'filter-comm-date-end'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', trigger);
  });

  const btnReset = document.getElementById('btn-comm-filter-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      ['search-commercial', 'filter-comm-date-start', 'filter-comm-date-end'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      ['filter-comm-quote', 'filter-comm-po'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = 'ALL';
      });
      loadCommercial();
    });
  }

  const btnRefresh = document.getElementById('btn-commercial-refresh');
  if (btnRefresh) btnRefresh.addEventListener('click', trigger);

  ['hrs', 'hrtc'].forEach(tab => {
    document.getElementById(`tab-btn-comm-${tab}`)?.addEventListener('click', (e) => {
      activeCommercialTab = tab;
      document.querySelectorAll('.commercial-tab-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const hC = document.getElementById('container-comm-hrs'), tC = document.getElementById('container-comm-hrtc');
      if (hC) hC.style.display = tab === 'hrs' ? 'block' : 'none';
      if (tC) tC.style.display = tab === 'hrtc' ? 'block' : 'none';
    });
  });

  const btnExcel = document.getElementById('btn-export-commercial-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      const tableId = activeCommercialTab === 'hrs' ? 'commercial-table-hrs-body' : 'commercial-table-hrtc-body';
      window.exportTableToExcel(tableId, `Commercial_${activeCommercialTab.toUpperCase()}`);
    });
  }
}

async function loadCommercial() {
  const search = (document.getElementById('search-commercial')?.value || '').trim().toLowerCase();
  const fQuote = document.getElementById('filter-comm-quote')?.value || 'ALL';
  const fPo = document.getElementById('filter-comm-po')?.value || 'ALL';
  const dStart = document.getElementById('filter-comm-date-start')?.value || '';
  const dEnd = document.getElementById('filter-comm-date-end')?.value || '';

  try {
    let list = await window.api.getProjects({});
    if (search) {
      list = list.filter(p => [p.customer_name, p.project_code, p.mould_description, p.material]
        .some(val => val && val.toLowerCase().includes(search)));
    }
    if (fQuote !== 'ALL') list = list.filter(p => getCommQuote(p) === fQuote);
    if (fPo !== 'ALL') list = list.filter(p => getCommPo(p) === fPo);
    if (dStart || dEnd) {
      list = list.filter(p => {
        const d = window.normalizeDateStr ? window.normalizeDateStr(p.order_date || p.created_at) : (p.order_date || '');
        if (dStart && d && d < dStart) return false;
        if (dEnd && d && d > dEnd) return false;
        return true;
      });
    }

    const hrsList = list.filter(p => !['HRTC', 'SPARE-HRTC'].includes((p.category || '').toUpperCase()));
    const hrtcList = list.filter(p => ['HRTC', 'SPARE-HRTC'].includes((p.category || '').toUpperCase()));

    const cHrs = document.getElementById('badge-count-hrs');
    const cHrtc = document.getElementById('badge-count-hrtc');
    if (cHrs) cHrs.innerText = hrsList.length;
    if (cHrtc) cHrtc.innerText = hrtcList.length;

    const role = (window.AppState?.currentUser?.role || 'ADMIN').toUpperCase();
    renderHrsTable(hrsList, role);
    renderHrtcTable(hrtcList, role);
  } catch (err) {
    console.error('Failed to load commercial workspace:', err);
  }
}

function renderHrsTable(list, role) {
  const tbody = document.getElementById('commercial-table-hrs-body');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="17" style="text-align: center; color: var(--text-muted); padding: 24px;">No HRS projects found.</td></tr>';
    return;
  }
  const canDesign = ['DESIGN', 'ADMIN'].includes(role), canAdmin = role === 'ADMIN', canComm = ['COMMERCIAL', 'ADMIN'].includes(role);

  tbody.innerHTML = list.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td style="white-space: nowrap;">${p.order_date || '2026-02-01'}</td>
      <td style="font-weight: 700; color: #F1F5F9; max-width: 200px;" title="${p.mould_description || p.project_code}">${p.mould_description || p.project_code}</td>
      <td style="text-align: center;"><span class="badge badge-active">${p.nozzle_count || p.drops || 1} Drops</span></td>
      <td><span style="color: var(--brand-orange); font-weight: 700;">${p.category || p.hrs_type || 'HRS'}</span></td>
      <td>${p.material || 'Polycarbonate (PC)'}</td>
      <td>${makeEditable(p.id, 'manifold_size', p.manifold_size || '320x240x65mm', canDesign)}</td>
      <td>${makeEditable(p.id, 'nozzle_series', p.nozzle_series || p.nozzle || 'Series 16', canDesign)}</td>
      <td>${makeEditable(p.id, 'cylinder', p.cylinder || 'Pneumatic Ø40', canDesign)}</td>
      <td>${makeEditable(p.id, 'solenoid_valve', p.solenoid_valve || 'Festo 24V', canDesign)}</td>
      <td>${makeEditable(p.id, 'connector', p.connector || '16-Pin Harting', canDesign)}</td>
      <td>${makeEditable(p.id, 'unit_price', p.unit_price || (p.cost ? `₹${p.cost}` : '₹4,85,000'), canAdmin)}</td>
      <td>${makeEditable(p.id, 'discount', p.discount || '₹25,000', canAdmin)}</td>
      <td style="font-weight: 700; color: #34D399;">${makeEditable(p.id, 'final_price', p.final_price || (p.cost ? `₹${p.cost}` : '₹4,60,000'), canAdmin)}</td>
      <td>${makeEditable(p.id, 'remark', p.remark || '-', canComm)}</td>
      <td>${makeQuoteSelect(p, canComm)}</td>
      <td>${makePoSelect(p, canComm)}</td>
    </tr>
  `).join('');
}

function renderHrtcTable(list, role) {
  const tbody = document.getElementById('commercial-table-hrtc-body');
  if (!tbody) return;
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">No HRTC projects found.</td></tr>';
    return;
  }
  const canComm = ['COMMERCIAL', 'ADMIN'].includes(role);

  tbody.innerHTML = list.map((p, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td style="white-space: nowrap;">${p.order_date || '2026-02-15'}</td>
      <td style="font-weight: 700; color: #F1F5F9; max-width: 240px;" title="${p.mould_description || p.project_code}">${p.mould_description || p.project_code}</td>
      <td style="text-align: center;"><span class="badge badge-active">${p.no_of_zone || (p.nozzle_count ? p.nozzle_count + ' Zones' : '8 Zones')}</span></td>
      <td>${p.connector || '24-Pin Harting'}</td>
      <td><span style="color: #38BDF8; font-weight: 700;">${p.hrtc_type || 'Microprocessor Dual'}</span></td>
      <td>${p.cable_length || '3.5 Meters'}</td>
      <td>${makeEditable(p.id, 'remark', p.remark || '-', canComm)}</td>
      <td>${makeQuoteSelect(p, canComm)}</td>
      <td>${makePoSelect(p, canComm)}</td>
    </tr>
  `).join('');
}

function makeEditable(id, field, value, canEdit) {
  if (!canEdit) return `<span style="color: #CBD5E1;">${value || '-'}</span>`;
  return `<input type="text" class="comm-inline-input" value="${value || ''}" onchange="window.saveCommField('${id}', '${field}', this.value)" />`;
}

function getCommQuote(p) {
  const val = (p.quote_status || '').toUpperCase();
  if (['SUBMITTED', 'QUOTE SUBMITTED', 'SENT', 'APPROVED'].includes(val)) return 'QUOTE SUBMITTED';
  if (['CANCEL', 'CANCELLED', 'ORDER CANCEL'].includes(val)) return 'CANCEL';
  return 'QUOTE PENDING';
}

function getCommPo(p) {
  const val = (p.po_received || p.po_status || '').toUpperCase();
  if (['RECEIVED', 'PO RECEIVED'].includes(val)) return 'PO RECEIVED';
  if (['CANCEL', 'ORDER CANCEL', 'CANCELLED'].includes(val)) return 'ORDER CANCEL';
  return 'PO PENDING';
}

function makeQuoteSelect(p, canEdit) {
  const cur = getCommQuote(p);
  const cls = cur === 'QUOTE SUBMITTED' ? 'badge-comm-submitted' : (cur === 'CANCEL' ? 'badge-comm-cancel' : 'badge-comm-pending');
  if (!canEdit) return `<span class="${cls}">${cur}</span>`;
  const valCls = cur === 'QUOTE SUBMITTED' ? 'val-submitted' : (cur === 'CANCEL' ? 'val-cancel' : 'val-pending');
  return `<select class="comm-cell-select ${valCls}" onchange="window.saveCommField('${p.id}','quote_status',this.value);loadCommercial();">
    <option value="QUOTE PENDING" ${cur === 'QUOTE PENDING' ? 'selected' : ''}>QUOTE PENDING</option>
    <option value="QUOTE SUBMITTED" ${cur === 'QUOTE SUBMITTED' ? 'selected' : ''}>QUOTE SUBMITTED</option>
    <option value="CANCEL" ${cur === 'CANCEL' ? 'selected' : ''}>CANCEL</option>
  </select>`;
}

function makePoSelect(p, canEdit) {
  const cur = getCommPo(p);
  const cls = cur === 'PO RECEIVED' ? 'badge-comm-submitted' : (cur === 'ORDER CANCEL' ? 'badge-comm-cancel' : 'badge-comm-pending');
  if (!canEdit) return `<span class="${cls}">${cur}</span>`;
  const valCls = cur === 'PO RECEIVED' ? 'val-submitted' : (cur === 'ORDER CANCEL' ? 'val-cancel' : 'val-pending');
  return `<select class="comm-cell-select ${valCls}" onchange="window.saveCommField('${p.id}','po_received',this.value);loadCommercial();">
    <option value="PO PENDING" ${cur === 'PO PENDING' ? 'selected' : ''}>PO PENDING</option>
    <option value="PO RECEIVED" ${cur === 'PO RECEIVED' ? 'selected' : ''}>PO RECEIVED</option>
    <option value="ORDER CANCEL" ${cur === 'ORDER CANCEL' ? 'selected' : ''}>ORDER CANCEL</option>
  </select>`;
}

window.saveCommField = async function(id, field, value) {
  try {
    await window.api.updateProject(id, { [field]: value });
    window.showToast && window.showToast(`Updated ${field.replace('_', ' ')}`, 'success');
  } catch (e) { console.error('Error saving field:', e); }
};

window.initCommercial = initCommercial;
window.loadCommercial = loadCommercial;
