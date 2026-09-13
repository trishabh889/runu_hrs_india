// ==========================================================================
// RUNO HRS INDIA - Sales Pipeline View Controller
// ==========================================================================

let selectedSalesProjectId = null;

let salesState = {
  currentPage: 1,
  pageSize: 10
};

function initSales() {
  const searchInput = document.getElementById('search-sales');
  const catFilter = document.getElementById('filter-sales-category');
  const fyFilter = document.getElementById('filter-sales-fy');
  const startDateInput = document.getElementById('filter-sales-start');
  const endDateInput = document.getElementById('filter-sales-end');
  const btnReset = document.getElementById('btn-sales-filter-reset');

  const trigger = () => {
    salesState.currentPage = 1;
    loadSales();
  };

  if (searchInput) searchInput.addEventListener('input', trigger);
  if (catFilter) catFilter.addEventListener('change', trigger);
  if (fyFilter) fyFilter.addEventListener('change', trigger);

  if (startDateInput) {
    startDateInput.addEventListener('input', trigger);
    startDateInput.addEventListener('change', trigger);
  }
  if (endDateInput) {
    endDateInput.addEventListener('input', trigger);
    endDateInput.addEventListener('change', trigger);
  }
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catFilter) catFilter.value = 'ALL';
      if (fyFilter) fyFilter.value = 'ALL';
      if (startDateInput) startDateInput.value = '';
      if (endDateInput) endDateInput.value = '';
      salesState.currentPage = 1;
      loadSales();
    });
  }

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
  const startDate = document.getElementById('filter-sales-start')?.value || '';
  const endDate = document.getElementById('filter-sales-end')?.value || '';

  try {
    let list = await window.api.getProjects({ category, year: fy, search, startDate, endDate });

    // Client-side date filtering safety
    if ((startDate || endDate) && window.isDateInRange) {
      list = (list || []).filter(p => window.isDateInRange(p.order_date || p.created_at, startDate, endDate));
    }

    // Load manufacturing records for stage linking
    let mfgList = [];
    try {
      if (window.api && window.api.getManufacturing) {
        mfgList = await window.api.getManufacturing() || [];
      }
    } catch (e) {
      console.warn('Could not load mfg records for sales view:', e);
    }
    const mfgMap = {};
    (Array.isArray(mfgList) ? mfgList : []).forEach(m => {
      if (m.project_code) mfgMap[m.project_code] = m;
      if (m.project_id) mfgMap[m.project_id] = m;
      if (m.id) mfgMap[m.id] = m;
    });

    const tbody = document.getElementById('sales-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; color: var(--text-muted); padding: 28px;">No sales projects match the selected filters.</td></tr>';
      if (window.renderTablePagination) {
        window.renderTablePagination({
          infoId: 'sales-pagination-info',
          numbersId: 'sales-page-numbers',
          prevBtnId: 'btn-sales-prev',
          nextBtnId: 'btn-sales-next',
          sizeSelectId: 'sales-page-size',
          totalEntries: 0,
          totalPages: 1,
          currentPage: 1,
          startIdx: 0,
          endIdx: 0,
          pageSize: salesState.pageSize,
          onPageChange: () => {},
          onPageSizeChange: (newSize) => {
            salesState.pageSize = newSize;
            salesState.currentPage = 1;
            loadSales();
          }
        });
      }
      return;
    }

    const { pageItems, totalEntries, totalPages, validPage, startIdx, endIdx } = (window.paginateArray
      ? window.paginateArray(list, salesState.currentPage, salesState.pageSize)
      : { pageItems: list, totalEntries: list.length, totalPages: 1, validPage: 1, startIdx: 0, endIdx: list.length });
    salesState.currentPage = validPage;

    // RBAC: Check if current user can edit PO (Admin, Sales, Commercial, Design)
    const userRole = (window.AppState?.currentUser?.role || 'ADMIN').toUpperCase();
    const canEditPO = ['ADMIN', 'SALES', 'COMMERCIAL', 'DESIGN'].includes(userRole);

    for (const p of pageItems) {
      const isSelected = p.id === selectedSalesProjectId;
      const tr = document.createElement('tr');
      tr.className = isSelected ? 'table-row-selected' : '';
      tr.style.cursor = 'pointer';

      tr.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'SELECT') return;
        selectedSalesProjectId = p.id;
        document.querySelectorAll('#sales-table-body tr').forEach(r => r.classList.remove('table-row-selected'));
        tr.classList.add('table-row-selected');
      });

      // 1. Project Specifications
      const projCode = p.project_code || 'RUNO-2026-000';
      const custName = p.customer_name || p.customer || '-';
      const mouldDesc = p.mould_description || p.project_name || 'Hot Runner System';
      const typeVal = getProjectType(p);
      const dropsCount = parseInt(p.nozzle_count || p.drops) || 1;
      const dropsLabel = `${dropsCount} Drop${dropsCount > 1 ? 's' : ''}`;

      // 2. Department Pipeline Statuses (PENDING / SUBMITTED / CANCEL)
      const quoteStatus = getQuoteStatus(p);
      const designStatus = getDesignStatus(p);
      const poStatus = getPOStatus(p);
      const mfgStatus = getMfgStatus(p, mfgMap);
      const assemblyStatus = getAssemblyStatus(p, mfgMap);
      const dispatchStatus = getDispatchStatus(p);
      const serviceStatus = getServiceStatus(p);
      const paymentStatus = getPaymentStatus(p);
      const finalStatus = getFinalStatus(p);

      // PO cell rendering: inline interactive select for authorized roles, else static badge
      let poCellHtml = '';
      if (canEditPO) {
        const poCls = poStatus === 'SUBMITTED' ? 'sel-submitted' : (poStatus === 'CANCEL' ? 'sel-cancel' : 'sel-pending');
        poCellHtml = `
          <select class="sales-status-select ${poCls}" onchange="window.changeSalesPO('${p.id}', this.value)" title="Click to change PO status (Admin/Sales/Commercial/Design)">
            <option value="PENDING" ${poStatus === 'PENDING' ? 'selected' : ''}>PENDING</option>
            <option value="SUBMITTED" ${poStatus === 'SUBMITTED' ? 'selected' : ''}>SUBMITTED</option>
            <option value="CANCEL" ${poStatus === 'CANCEL' ? 'selected' : ''}>CANCEL</option>
          </select>
        `;
      } else {
        poCellHtml = renderStatusBadge(poStatus);
      }

      tr.innerHTML = `
        <td style="font-weight: 800; color: var(--brand-orange); font-size: 13px; font-family: var(--font-primary); white-space: nowrap;">
          ${projCode}
        </td>
        <td style="font-weight: 700; color: var(--text-primary); font-size: 12.5px;">
          ${custName}
        </td>
        <td style="color: #E2E8F0; font-size: 12px; font-weight: 500;">
          ${mouldDesc}
        </td>
        <td style="text-align: center;">
          <span class="sales-type-box">${typeVal}</span>
        </td>
        <td style="text-align: center;">
          <span class="sales-drops-box">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            ${dropsLabel}
          </span>
        </td>
        <td style="text-align: center;">${renderStatusBadge(quoteStatus)}</td>
        <td style="text-align: center;">${renderStatusBadge(designStatus)}</td>
        <td style="text-align: center;">${poCellHtml}</td>
        <td style="text-align: center;">${renderStatusBadge(mfgStatus)}</td>
        <td style="text-align: center;">${renderStatusBadge(assemblyStatus)}</td>
        <td style="text-align: center;">${renderStatusBadge(dispatchStatus)}</td>
        <td style="text-align: center;">${renderStatusBadge(serviceStatus)}</td>
        <td style="text-align: center;">${renderStatusBadge(paymentStatus)}</td>
        <td style="text-align: center;">${renderStatusBadge(finalStatus)}</td>
        <td style="text-align: center;">
          <div class="table-actions" style="justify-content: center; gap: 4px;">
            <button class="btn-icon" title="Update Quote" onclick="window.openSalesQuoteModal('${p.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" title="Update PO Modal" onclick="openUpdatePOModal('${p.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </button>
            <button class="btn-icon danger" title="Delete Project" onclick="window.deleteSalesProject('${p.id}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    }

    if (window.renderTablePagination) {
      window.renderTablePagination({
        infoId: 'sales-pagination-info',
        numbersId: 'sales-page-numbers',
        prevBtnId: 'btn-sales-prev',
        nextBtnId: 'btn-sales-next',
        sizeSelectId: 'sales-page-size',
        totalEntries,
        totalPages,
        currentPage: validPage,
        startIdx,
        endIdx,
        pageSize: salesState.pageSize,
        onPageChange: (newPage) => {
          salesState.currentPage = newPage;
          loadSales();
        },
        onPageSizeChange: (newSize) => {
          salesState.pageSize = newSize;
          salesState.currentPage = 1;
          loadSales();
        }
      });
    }
  } catch (err) {
    console.error('Failed to load sales pipeline:', err);
  }
}

// Helper: Determine TYPE (OPEN / VALVE / HRTC / SPARE)
function getProjectType(p) {
  if (p.type) {
    const t = String(p.type).toUpperCase().trim();
    if (['OPEN', 'VALVE', 'HRTC', 'SPARE'].includes(t)) return t;
  }
  const cat = (p.category || '').toUpperCase();
  if (cat.includes('HRTC')) return 'HRTC';
  if (cat.includes('SPARE')) return 'SPARE';
  const nozzle = (p.nozzle_type || p.hrs_type || p.mould_description || '').toUpperCase();
  if (nozzle.includes('VALVE')) return 'VALVE';
  if (nozzle.includes('OPEN')) return 'OPEN';
  return 'VALVE';
}

// 3-State Status Logic: PENDING (Yellow) / SUBMITTED (Green) / CANCEL (Red)
function renderStatusBadge(status) {
  const s = (status || 'PENDING').toUpperCase();
  const cls = s === 'SUBMITTED' ? 'sales-status-submitted' : (s === 'CANCEL' ? 'sales-status-cancel' : 'sales-status-pending');
  return `<span class="sales-status-badge ${cls}">${s}</span>`;
}

function getQuoteStatus(p) {
  const val = (p.quote_status || '').toUpperCase();
  if (['SUBMITTED', 'QUOTE SUBMITTED', 'SENT', 'APPROVED'].includes(val)) return 'SUBMITTED';
  if (['CANCEL', 'CANCELLED', 'ORDER CANCEL', 'REJECTED'].includes(val)) return 'CANCEL';
  return 'PENDING';
}

function getDesignStatus(p) {
  const val = (p.design_status || p.design_check || '').toUpperCase();
  if (['SUBMITTED', 'APPROVED', 'CHECKED', 'PASS', 'COMPLETED'].includes(val)) return 'SUBMITTED';
  if (['CANCEL', 'CANCELLED', 'REJECTED', 'FAIL'].includes(val)) return 'CANCEL';
  return 'PENDING';
}

function getPOStatus(p) {
  const val = (p.po_received || p.po_status || '').toUpperCase();
  if (['RECEIVED', 'YES', 'SUBMITTED', 'PO RECEIVED'].includes(val)) return 'SUBMITTED';
  if (['CANCEL', 'ORDER CANCEL', 'CANCELLED'].includes(val)) return 'CANCEL';
  return 'PENDING';
}

function getMfgStatus(p, mfgMap) {
  if (p.mfg_status) {
    const val = p.mfg_status.toUpperCase();
    if (['SUBMITTED', 'COMPLETED'].includes(val)) return 'SUBMITTED';
    if (['CANCEL', 'CANCELLED'].includes(val)) return 'CANCEL';
    return 'PENDING';
  }
  const mfg = mfgMap && (mfgMap[p.project_code] || mfgMap[p.id]);
  if (mfg) {
    const s = (mfg.status || '').toUpperCase();
    if (s === 'COMPLETED' || mfg.overall_progress === 100) return 'SUBMITTED';
    if (s === 'CANCELLED' || s === 'CANCEL') return 'CANCEL';
    return 'PENDING';
  }
  return 'PENDING';
}

function getAssemblyStatus(p, mfgMap) {
  if (p.assembly_status) {
    const val = p.assembly_status.toUpperCase();
    if (['SUBMITTED', 'COMPLETED'].includes(val)) return 'SUBMITTED';
    if (['CANCEL', 'CANCELLED'].includes(val)) return 'CANCEL';
    return 'PENDING';
  }
  const mfg = mfgMap && (mfgMap[p.project_code] || mfgMap[p.id]);
  if (mfg && mfg.stages && mfg.stages.assembly) {
    const st = (mfg.stages.assembly.status || '').toUpperCase();
    if (st === 'COMPLETED') return 'SUBMITTED';
    if (st === 'CANCELLED') return 'CANCEL';
  }
  return 'PENDING';
}

function getDispatchStatus(p) {
  const val = (p.dispatch_status || '').toUpperCase();
  if (['SUBMITTED', 'DISPATCHED', 'COMPLETED'].includes(val) || (p.status === 'COMPLETED' && val !== 'CANCEL')) return 'SUBMITTED';
  if (['CANCEL', 'CANCELLED'].includes(val)) return 'CANCEL';
  return 'PENDING';
}

function getServiceStatus(p) {
  const val = (p.service_status || '').toUpperCase();
  if (['SUBMITTED', 'COMPLETED', 'INSTALLED', 'DONE'].includes(val)) return 'SUBMITTED';
  if (['CANCEL', 'CANCELLED'].includes(val)) return 'CANCEL';
  return 'PENDING';
}

function getPaymentStatus(p) {
  const val = (p.payment_status || '').toUpperCase();
  if (['SUBMITTED', 'PAID', 'RECEIVED', 'COMPLETED'].includes(val)) return 'SUBMITTED';
  if (['CANCEL', 'CANCELLED', 'BAD DEBT'].includes(val)) return 'CANCEL';
  return 'PENDING';
}

function getFinalStatus(p) {
  const val = (p.status || '').toUpperCase();
  if (['COMPLETED', 'DELIVERED'].includes(val)) return 'SUBMITTED';
  if (['CANCEL', 'CANCELLED', 'CLOSED'].includes(val)) return 'CANCEL';
  return 'PENDING';
}

// Inline PO updater (Admin, Sales, Commercial, Design)
window.changeSalesPO = async function(id, status) {
  try {
    const poVal = status === 'SUBMITTED' ? 'RECEIVED' : status;
    const res = await window.api.updatePO(id, poVal);
    if (res && res.success) {
      window.showToast(`PO Status updated to ${status}`, 'success');
      loadSales();
    } else {
      window.showToast('Failed to update PO status', 'error');
    }
  } catch (err) {
    console.error('Error updating PO status:', err);
    window.showToast('Error updating PO status', 'error');
  }
};

window.openSalesQuoteModal = function(id) {
  openUpdateQuoteModal(id);
};

window.deleteSalesProject = async function(id) {
  const confirmed = await window.showConfirmDialog({
    title: 'Delete Project Order',
    message: 'Are you sure you want to delete this project order?',
    subtext: 'This action cannot be undone.',
    confirmText: 'Delete',
    danger: true
  });
  if (confirmed) {
    const res = await window.api.deleteProject(id);
    if (res.success) {
      window.showToast('Project deleted', 'success');
      loadSales();
    }
  }
};

window.initSales = initSales;
window.loadSales = loadSales;

