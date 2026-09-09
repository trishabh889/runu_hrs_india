// ==========================================================================
// RUNO HRS INDIA - Sales Pipeline View Controller
// ==========================================================================

let selectedSalesProjectId = null;

function initSales() {
  const searchInput = document.getElementById('search-sales');
  const catFilter = document.getElementById('filter-sales-category');
  const fyFilter = document.getElementById('filter-sales-fy');

  const trigger = () => loadSales();

  if (searchInput) searchInput.addEventListener('input', trigger);
  if (catFilter) catFilter.addEventListener('change', trigger);
  if (fyFilter) fyFilter.addEventListener('change', trigger);

  // Top action buttons
  document.getElementById('btn-sales-add-project')?.addEventListener('click', () => {
    window.switchView('new-project');
  });

  document.getElementById('btn-sales-update-quote')?.addEventListener('click', () => {
    if (!selectedSalesProjectId) {
      window.showToast('Please select a project row from the table first', 'error');
      return;
    }
    openUpdateQuoteModal(selectedSalesProjectId);
  });

  document.getElementById('btn-sales-update-po')?.addEventListener('click', () => {
    if (!selectedSalesProjectId) {
      window.showToast('Please select a project row from the table first', 'error');
      return;
    }
    openUpdatePOModal(selectedSalesProjectId);
  });

  document.getElementById('btn-export-sales-excel')?.addEventListener('click', () => {
    window.exportTableToExcel('sales-table-body', 'Sales_Project_Pipeline');
  });

  document.getElementById('btn-export-sales-pdf')?.addEventListener('click', () => {
    window.exportTableToPDF('sales-table-body', 'RUNO HRS INDIA - SALES PROJECT PIPELINE');
  });

  // Quote Update Modal Submission
  document.getElementById('form-update-quote')?.addEventListener('submit', async () => {
    const id = document.getElementById('quote-proj-id').value;
    const quoteStatus = document.getElementById('quote-select-status').value;
    const res = await window.api.updateQuoteStatus(id, quoteStatus);
    if (res.success) {
      window.showToast(`Quote updated to ${quoteStatus}`, 'success');
      window.closeModal('modal-update-quote');
      loadSales();
    }
  });

  // PO Update Modal Submission
  document.getElementById('form-update-po')?.addEventListener('submit', async () => {
    const id = document.getElementById('po-proj-id').value;
    const poReceived = document.getElementById('po-select-status').value;
    const res = await window.api.updatePO(id, poReceived);
    if (res.success) {
      window.showToast(`PO Status updated to ${poReceived}`, 'success');
      window.closeModal('modal-update-po');
      loadSales();
    }
  });
}

function openUpdateQuoteModal(id) {
  document.getElementById('quote-proj-id').value = id;
  window.openModal('modal-update-quote');
}

function openUpdatePOModal(id) {
  document.getElementById('po-proj-id').value = id;
  window.openModal('modal-update-po');
}

async function loadSales() {
  const search = document.getElementById('search-sales') ? document.getElementById('search-sales').value.trim() : '';
  const category = document.getElementById('filter-sales-category') ? document.getElementById('filter-sales-category').value : 'ALL';
  const fy = document.getElementById('filter-sales-fy') ? document.getElementById('filter-sales-fy').value : 'ALL';

  try {
    let list = await window.api.getProjects({ category, year: fy, search });
    const tbody = document.getElementById('sales-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: var(--text-muted); padding: 24px;">No sales projects match the selected filters.</td></tr>';
      return;
    }

    for (const p of list) {
      const wf = await window.api.getWorkflow(p.id);
      const isSelected = p.id === selectedSalesProjectId;
      const tr = document.createElement('tr');
      tr.className = isSelected ? 'table-row-selected' : '';
      tr.style.cursor = 'pointer';

      tr.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        selectedSalesProjectId = p.id;
        document.querySelectorAll('#sales-table-body tr').forEach(r => r.classList.remove('table-row-selected'));
        tr.classList.add('table-row-selected');
      });

      const d2Status = wf['2dEnd'] !== '-' ? 'COMPLETED' : (wf['2dStart'] !== '-' ? 'IN PROGRESS' : 'PENDING');
      const d3Status = wf['3dEnd'] !== '-' ? 'COMPLETED' : (wf['3dStart'] !== '-' ? 'IN PROGRESS' : 'PENDING');
      const designSendStatus = wf['designSend'] !== '-' ? 'YES' : 'PENDING';

      tr.innerHTML = `
        <td>${p.order_date || '-'}</td>
        <td style="font-weight: 700; color: var(--text-primary);">${p.customer_name}</td>
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${p.project_code}</span></td>
        <td><span class="badge badge-active">${p.category || 'HRS'}</span></td>
        <td><span class="badge ${['SENT', 'APPROVED'].includes((p.quote_status || '').toUpperCase()) ? 'badge-completed' : 'badge-review'}">${p.quote_status || 'PENDING'}</span></td>
        <td><span class="badge ${(p.po_received || '').toUpperCase() === 'RECEIVED' ? 'badge-completed' : 'badge-inactive'}">${p.po_received || 'PENDING'}</span></td>
        <td><span style="font-size: 11px; font-weight: 600;">${d2Status}</span></td>
        <td><span style="font-size: 11px; font-weight: 600;">${d3Status}</span></td>
        <td><span style="font-size: 11px; font-weight: 700; color: ${designSendStatus === 'YES' ? '#10B981' : 'var(--text-muted)'};">${designSendStatus}</span></td>
        <td><span class="badge badge-active">${p.design_check || 'NOT CHECKED'}</span></td>
        <td>${p.owner || 'VIKRAM'}</td>
        <td><span class="badge badge-${(p.status || 'ACTIVE').toLowerCase()}">${p.status || 'ACTIVE'}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-icon" title="Update Quote" onclick="window.openSalesQuoteModal('${p.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon danger" title="Delete Project" onclick="window.deleteSalesProject('${p.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }
  } catch (err) {
    console.error('Failed to load sales pipeline:', err);
  }
}

window.openSalesQuoteModal = function(id) {
  openUpdateQuoteModal(id);
};

window.deleteSalesProject = async function(id) {
  if (confirm('Are you sure you want to delete this project order?')) {
    const res = await window.api.deleteProject(id);
    if (res.success) {
      window.showToast('Project deleted', 'success');
      loadSales();
    }
  }
};

window.initSales = initSales;
window.loadSales = loadSales;
