// ==========================================================================
// RUNO HRS INDIA - Commercial View Controller
// ==========================================================================

function initCommercial() {
  const searchInput = document.getElementById('search-commercial');
  const typeFilter = document.getElementById('filter-comm-hrs-type');
  const quoteFilter = document.getElementById('filter-comm-quote');
  const monthFilter = document.getElementById('filter-comm-month');
  const yearFilter = document.getElementById('filter-comm-year');

  const triggerFilter = () => loadCommercial();

  if (searchInput) searchInput.addEventListener('input', triggerFilter);
  if (typeFilter) typeFilter.addEventListener('change', triggerFilter);
  if (quoteFilter) quoteFilter.addEventListener('change', triggerFilter);
  if (monthFilter) monthFilter.addEventListener('change', triggerFilter);
  if (yearFilter) yearFilter.addEventListener('change', triggerFilter);

  const btnRefresh = document.getElementById('btn-commercial-refresh');
  if (btnRefresh) btnRefresh.addEventListener('click', () => loadCommercial());

  const btnExcel = document.getElementById('btn-export-commercial-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      window.exportTableToExcel('commercial-table-body', 'Commercial_Hot_Runner_Projects');
    });
  }

  const btnPdf = document.getElementById('btn-export-commercial-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      window.exportTableToPDF('commercial-table-body', 'RUNO HRS INDIA - COMMERCIAL PROJECTS');
    });
  }
}

async function loadCommercial() {
  const search = document.getElementById('search-commercial') ? document.getElementById('search-commercial').value.trim() : '';
  const hrsType = document.getElementById('filter-comm-hrs-type') ? document.getElementById('filter-comm-hrs-type').value : 'ALL';
  const quoteStatus = document.getElementById('filter-comm-quote') ? document.getElementById('filter-comm-quote').value : 'ALL';
  const month = document.getElementById('filter-comm-month') ? document.getElementById('filter-comm-month').value : 'ALL';
  const year = document.getElementById('filter-comm-year') ? document.getElementById('filter-comm-year').value : 'ALL';

  try {
    let list = await window.api.getProjects({});

    // Filter by Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        (p.project_code && p.project_code.toLowerCase().includes(q)) ||
        (p.id_card_no && p.id_card_no.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q))
      );
    }

    // Filter by HRS Type
    if (hrsType !== 'ALL') {
      list = list.filter(p => (p.category || 'HRS').toUpperCase() === hrsType.toUpperCase());
    }

    // Filter by Quote Status
    if (quoteStatus !== 'ALL') {
      list = list.filter(p => {
        const norm = normalizeCommercialQuote(p.quote_status);
        return norm.toLowerCase() === quoteStatus.toLowerCase();
      });
    }

    // Filter by Month
    if (month !== 'ALL') {
      list = list.filter(p => {
        const d = p.order_date || '';
        return d.split('-')[1] === month;
      });
    }

    // Filter by Year
    if (year !== 'ALL') {
      list = list.filter(p => {
        const d = p.order_date || p.year || '';
        return d.includes(year);
      });
    }

    const countEl = document.getElementById('commercial-total-count');
    if (countEl) countEl.innerText = `Total Projects: ${list.length}`;

    const tbody = document.getElementById('commercial-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; color: var(--text-muted); padding: 24px;">No commercial hot runner projects match the selected filters.</td></tr>';
      return;
    }

    list.forEach(p => {
      const displayQuote = normalizeCommercialQuote(p.quote_status);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.order_date || '-'}</td>
        <td style="font-weight: 700; color: var(--text-primary); white-space: nowrap;">${p.customer_name}</td>
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${p.project_code}</span></td>
        <td><span style="font-family: monospace; background: var(--bg-surface); padding: 2px 5px; border-radius: 3px;">${p.id_card_no || '-'}</span></td>
        <td>${p.target_date || '-'}</td>
        <td style="font-weight: 700; color: #10B981;">${p.cost ? `₹ ${parseInt(p.cost).toLocaleString('en-IN')}` : (p.value || '-')}</td>
        <td><span class="badge badge-active">${p.category || 'HRS'}</span></td>
        <td style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.material}">${p.material || '-'}</td>
        <td>${p.nozzle_series || '-'}</td>
        <td>${p.gate_type || '-'}</td>
        <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.connector}">${p.connector || '-'}</td>
        <td>${p.gate_dia || '-'}</td>
        <td>${p.guide_dia || '-'}</td>
        <td>
          <select class="quote-inline-select" onchange="updateCommercialQuoteInline('${p.id}', this.value)">
            <option value="Quote Send" ${displayQuote === 'Quote Send' ? 'selected' : ''}>Quote Send</option>
            <option value="Quote Pending" ${displayQuote === 'Quote Pending' ? 'selected' : ''}>Quote Pending</option>
            <option value="Order Cancel" ${displayQuote === 'Order Cancel' ? 'selected' : ''}>Order Cancel</option>
          </select>
        </td>
        <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.remark || p.notes}">${p.remark || p.notes || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load commercial projects:', err);
  }
}

function normalizeCommercialQuote(q) {
  const clean = (q || '').trim().toUpperCase();
  if (['SENT', 'QUOTE SENT', 'SEND', 'QUOTE SEND'].includes(clean)) return 'Quote Send';
  if (['ORDER CANCEL', 'CANCEL', 'CANCELLED'].includes(clean)) return 'Order Cancel';
  return 'Quote Pending';
}

window.updateCommercialQuoteInline = async function(id, val) {
  let internalVal = 'PENDING';
  if (val === 'Quote Send') internalVal = 'SENT';
  else if (val === 'Order Cancel') internalVal = 'ORDER CANCEL';

  const res = await window.api.updateQuoteStatus(id, internalVal);
  if (res.success) {
    window.showToast(`Quote updated to "${val}"`, 'success');
  }
};

window.initCommercial = initCommercial;
window.loadCommercial = loadCommercial;
