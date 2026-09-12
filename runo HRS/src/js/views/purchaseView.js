// ==========================================================================
// RUNO HRS INDIA - Purchase Department View Controller (Slide 2 Specifications)
// Features: 7 KPI status cards, Search & Project/Status filters, 
// 15 PR table rows, Status Legend, and New Purchase Request Requisition Modal
// ==========================================================================

let prItemCounter = 0;
let currentViewingPR = null;

function initPurchase() {
  const searchInput = document.getElementById('search-purchase-requests');
  if (searchInput) {
    searchInput.addEventListener('input', () => loadPurchase());
  }

  const projectFilter = document.getElementById('filter-pr-project');
  if (projectFilter) {
    projectFilter.addEventListener('change', () => loadPurchase());
  }

  const statusFilter = document.getElementById('filter-pr-status');
  if (statusFilter) {
    statusFilter.addEventListener('change', () => loadPurchase());
  }

  const vendorFilter = document.getElementById('filter-pr-vendor');
  if (vendorFilter) {
    vendorFilter.addEventListener('change', () => loadPurchase());
  }

  const prDateStart = document.getElementById('filter-pr-start');
  if (prDateStart) {
    prDateStart.addEventListener('change', () => loadPurchase());
    prDateStart.addEventListener('input', () => loadPurchase());
  }

  const prDateEnd = document.getElementById('filter-pr-end');
  if (prDateEnd) {
    prDateEnd.addEventListener('change', () => loadPurchase());
    prDateEnd.addEventListener('input', () => loadPurchase());
  }

  const btnApply = document.getElementById('btn-pr-filter-apply');
  if (btnApply) {
    btnApply.addEventListener('click', () => loadPurchase());
  }

  const btnReset = document.getElementById('btn-pr-filter-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (projectFilter) projectFilter.value = 'ALL';
      if (statusFilter) statusFilter.value = 'ALL';
      if (vendorFilter) vendorFilter.value = 'ALL';
      if (searchInput) searchInput.value = '';
      if (prDateStart) prDateStart.value = '';
      if (prDateEnd) prDateEnd.value = '';
      loadPurchase();
    });
  }

  const btnNewPR = document.getElementById('btn-open-new-pr-modal');
  if (btnNewPR) {
    btnNewPR.addEventListener('click', () => openNewPurchaseRequestModal());
  }

  const btnExportExcel = document.getElementById('btn-export-pr-excel');
  if (btnExportExcel) {
    btnExportExcel.addEventListener('click', () => {
      if (window.exportTableToExcel) {
        window.exportTableToExcel('purchase-table-body', 'RUNO_HRS_Purchase_Requests.xlsx');
      } else if (window.api && window.api.exportCSV) {
        window.api.exportCSV('PURCHASE');
      }
    });
  }

  // Bind Dynamic PR Item Table in Modal
  const btnAddItem = document.getElementById('btn-add-pr-item');
  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => addPRItemRow());
  }

  // Bind Project Code Auto-populate description in modal
  const prProjectCodeSelect = document.getElementById('pr-project-code');
  if (prProjectCodeSelect) {
    prProjectCodeSelect.addEventListener('change', async () => {
      const pCode = prProjectCodeSelect.value;
      const descInput = document.getElementById('pr-project-desc');
      if (!pCode || !descInput) return;

      try {
        const projects = await window.api.getProjects({});
        const match = (projects || []).find(p => p.project_code === pCode);
        if (match) {
          descInput.value = match.project_description || match.mould_description || `${match.customer_name || ''} Tooling`;
        }
      } catch (err) {
        console.error('Failed to lookup project:', err);
      }
    });
  }

  // Bind File Dropzone
  const dropzone = document.getElementById('pr-dropzone');
  const fileInput = document.getElementById('pr-file-input');
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      files.forEach(f => addAttachmentBadge(f.name, formatBytes(f.size)));
    });
  }

  // Bind PR Modal Form Submit
  const prForm = document.getElementById('form-purchase-request');
  if (prForm) {
    prForm.addEventListener('submit', handlePRSubmit);
  }
  const btnSubmitPR = document.getElementById('btn-submit-purchase-request');
  if (btnSubmitPR) {
    btnSubmitPR.addEventListener('click', handlePRSubmit);
  }

  // Bind View Modal PDF Button
  const btnPrintPdf = document.getElementById('btn-print-pr-pdf');
  if (btnPrintPdf) {
    btnPrintPdf.addEventListener('click', () => {
      if (window.exportTableToPDF) {
        window.exportTableToPDF('view-pr-items-table', `RUNO_PR_${currentViewingPR ? currentViewingPR.pr_no : 'Document'}`);
      } else {
        window.print();
      }
    });
  }
}

async function loadPurchase() {
  const searchInput = document.getElementById('search-purchase-requests');
  const projectFilter = document.getElementById('filter-pr-project');
  const statusFilter = document.getElementById('filter-pr-status');

  const search = searchInput ? searchInput.value.trim() : '';
  const project = projectFilter ? projectFilter.value : 'ALL';
  const status = statusFilter ? statusFilter.value : 'ALL';

  try {
    // 1. Update 6 KPI stats
    const stats = await window.api.getPurchaseStats();
    if (stats) {
      updateKpi('kpi-pr-total', stats.total || 15);
      updateKpi('kpi-pr-pending-appr', stats.pendingApproval || 5);
      updateKpi('kpi-pr-quote-rcvd', stats.quotationReceived || 3);
      updateKpi('kpi-pr-poreleased', stats.poReleased || 6);
      updateKpi('kpi-pr-intransit', stats.inTransit || 3);
      updateKpi('kpi-pr-received', stats.received || 4);
    }

    // 2. Fetch filtered PRs
    const vendorFilter = document.getElementById('filter-pr-vendor');
    const vendorVal = vendorFilter ? vendorFilter.value : 'ALL';
    let prs = await window.api.getPurchaseRequests({ search, project, status });

    if (vendorVal && vendorVal !== 'ALL') {
      prs = (prs || []).filter(p => (p.vendor || '').toLowerCase() === vendorVal.toLowerCase());
    }

    const prStartDate = document.getElementById('filter-pr-start')?.value || '';
    const prEndDate = document.getElementById('filter-pr-end')?.value || '';
    if (prStartDate || prEndDate) {
      prs = (prs || []).filter(p => {
        const d = window.normalizeDateStr ? window.normalizeDateStr(p.date || p.created_at || p.required_date) : (p.date || '');
        if (prStartDate && d && d < prStartDate) return false;
        if (prEndDate && d && d > prEndDate) return false;
        return true;
      });
    }

    // Populate vendor filter dropdown if empty
    if (vendorFilter && vendorFilter.options.length <= 1) {
      const vendors = ['Watlow', 'Omega', 'Steelage', 'Meusburger', 'Tempco', 'LKM', 'Igus', 'Harting', 'Yudo', 'Festo', 'Misumi', 'Rogers', 'Trelleborg', 'Local', 'CoorsTek'];
      vendors.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.innerText = v;
        vendorFilter.appendChild(opt);
      });
    }

    // Populate project filter dropdown if empty
    if (projectFilter && projectFilter.options.length <= 1) {
      const allProjects = await window.api.getProjects({});
      (allProjects || []).forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.project_code;
        opt.innerText = p.project_code;
        projectFilter.appendChild(opt);
      });
    }

    // 3. Render Table
    const tbody = document.getElementById('purchase-table-body');
    if (!tbody) return;

    if (!prs || prs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="14" style="text-align: center; padding: 32px; color: var(--text-muted);">
            No purchase requests matching filters. Click <strong>+ NEW PURCHASE REQUEST</strong> to create one.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = prs.map((pr, idx) => {
      const badgeClass = getPRStatusBadgeClass(pr.status);
      const prNo = pr.pr_no || `PR-2026-${String(idx + 1).padStart(3, '0')}`;
      const projCode = pr.project_code || '-';
      const date = pr.date || '-';
      const projDesc = pr.project_desc || 'Hot Runner Tooling';
      const itemDesc = pr.item_desc || (pr.items && pr.items[0] ? pr.items[0].desc : 'Hot Runner Item');
      const vendor = pr.vendor || (pr.items && pr.items[0] ? pr.items[0].vendor : 'Local');
      const prStatus = pr.status || 'Pending';
      const qty = pr.qty !== undefined ? pr.qty : (pr.items && pr.items[0] ? pr.items[0].qty : 1);
      const unit = pr.unit || (pr.items && pr.items[0] ? pr.items[0].unit : 'Nos');
      const prBy = pr.pr_by || pr.requested_by || 'Rahul S.';
      const reqDate = pr.required_date || '-';
      const poNo = pr.po_no || '-';

      return `
        <tr data-pr-id="${pr.id}">
          <td style="text-align: center; font-weight: 700; color: #8A9CB5;">${pr.sr || (idx + 1)}</td>
          <td>
            <a href="javascript:void(0)" onclick="window.viewPurchaseRequest('${pr.id}')" class="pr-highlight-code" style="text-decoration: none;">
              ${prNo}
            </a>
          </td>
          <td style="color: #94A3B8;">${date}</td>
          <td>
            <span class="pr-highlight-code">${projCode}</span>
          </td>
          <td style="color: #E2E8F0; max-width: 140px; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(projDesc)}">
            ${escapeHtml(projDesc)}
          </td>
          <td style="color: #E2E8F0; max-width: 170px; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(itemDesc)}">
            ${escapeHtml(itemDesc)}
          </td>
          <td style="text-align: center; color: #E2E8F0;">${qty}</td>
          <td style="color: #94A3B8;">${unit}</td>
          <td style="color: #CBD5E1;">${escapeHtml(prBy)}</td>
          <td style="color: #94A3B8;">${reqDate}</td>
          <td style="text-align: center;">
            <span class="pr-status-badge ${badgeClass}">${prStatus.toUpperCase()}</span>
          </td>
          <td style="color: #94A3B8;">${poNo}</td>
          <td style="color: #CBD5E1;">${escapeHtml(vendor)}</td>
          <td style="text-align: center;">
            <div class="pr-action-group">
              <button type="button" class="pr-action-btn" title="View PR" onclick="window.viewPurchaseRequest('${pr.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              </button>
              <button type="button" class="pr-action-btn" title="Edit PR" onclick="window.editPurchaseRequest('${pr.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button type="button" class="pr-action-btn" title="Export PDF" onclick="window.exportPurchasePDF('${pr.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load purchase requests:', err);
  }
}

function updateKpi(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

function getPRStatusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('received')) return 'badge-status-received';
  if (s.includes('in transit') || s.includes('transit')) return 'badge-status-intransit';
  if (s.includes('po released') || s.includes('released')) return 'badge-status-poreleased';
  if (s.includes('approved')) return 'badge-status-approved';
  if (s.includes('in review') || s.includes('review')) return 'badge-status-inreview';
  if (s.includes('cancelled')) return 'badge-status-cancelled';
  return 'badge-status-pending';
}

// --------------------------------------------------------------------------
// New Purchase Request Modal Helpers
// --------------------------------------------------------------------------
async function openNewPurchaseRequestModal() {
  prItemCounter = 0;
  const form = document.getElementById('form-purchase-request');
  if (form) form.reset();

  // 1. Generate PR No (e.g. PR-2026-016)
  try {
    const prs = await window.api.getPurchaseRequests({});
    const nextNo = (prs || []).length + 1;
    const prNoInput = document.getElementById('pr-number');
    if (prNoInput) prNoInput.value = `PR-2026-${String(nextNo).padStart(3, '0')}`;
  } catch (e) {
    const prNoInput = document.getElementById('pr-number');
    if (prNoInput) prNoInput.value = `PR-2026-016`;
  }

  // 2. Date
  const dateInput = document.getElementById('pr-date');
  if (dateInput) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    dateInput.value = `${dd}-${mm}-${yyyy}`;
  }

  // 3. Required Date
  const reqDateInput = document.getElementById('pr-required-date');
  if (reqDateInput) {
    const req = new Date();
    req.setDate(req.getDate() + 15);
    reqDateInput.value = req.toISOString().split('T')[0];
  }

  // 4. Requested By
  const reqByInput = document.getElementById('pr-requested-by');
  if (reqByInput) {
    reqByInput.value = (window.currentUser && window.currentUser.name) 
      ? `${window.currentUser.name} (${window.currentUser.role || 'Design'})`
      : 'Rohit Sharma (Design)';
  }

  // 5. Category (highlighted in red box in Slide 2)
  const catSelect = document.getElementById('pr-category');
  if (catSelect) catSelect.value = 'HRS';

  // 6. Populate Projects dropdown
  const projSelect = document.getElementById('pr-project-code');
  if (projSelect) {
    projSelect.innerHTML = '<option value="">-- Select Project Code --</option>';
    try {
      const projects = await window.api.getProjects({});
      (projects || []).forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.project_code;
        opt.innerText = `${p.project_code} - ${p.customer_name || ''}`;
        projSelect.appendChild(opt);
      });
      // Pre-select first project
      if (projects && projects.length > 0) {
        projSelect.value = projects[0].project_code;
        const descInput = document.getElementById('pr-project-desc');
        if (descInput) {
          descInput.value = projects[0].project_description || projects[0].mould_description || '';
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 7. Clear and add 1 default item row
  const itemsTbody = document.getElementById('pr-items-table-body');
  if (itemsTbody) {
    itemsTbody.innerHTML = '';
    addPRItemRow({
      desc: 'Manifold Block 4-Drop Prewired H13 Steel',
      drawing: 'RUNO-MNF-001',
      spec: 'H13 Vacuum Degassed Forged',
      qty: 1,
      unit: 'PCS',
      vendor: 'Steelage',
      remarks: 'Standard finish'
    });
  }

  window.openModal('modal-new-purchase-request');
}

function addPRItemRow(data = {}) {
  prItemCounter++;
  const tbody = document.getElementById('pr-items-table-body');
  if (!tbody) return;

  const rowId = `pr-row-${prItemCounter}`;
  const tr = document.createElement('tr');
  tr.id = rowId;

  tr.innerHTML = `
    <td>
      <input type="text" class="form-input pr-item-desc" style="padding: 6px 8px; font-size: 12px;" placeholder="Item description / name" value="${escapeHtml(data.desc || '')}" required>
    </td>
    <td>
      <input type="text" class="form-input pr-item-drawing" style="padding: 6px 8px; font-size: 12px;" placeholder="e.g. DWG-001" value="${escapeHtml(data.drawing || '')}">
    </td>
    <td>
      <input type="text" class="form-input pr-item-spec" style="padding: 6px 8px; font-size: 12px;" placeholder="Grade / Spec" value="${escapeHtml(data.spec || '')}">
    </td>
    <td>
      <input type="number" class="form-input pr-item-qty" style="padding: 6px 8px; font-size: 12px; width: 70px;" min="1" value="${data.qty || 1}" required>
    </td>
    <td>
      <select class="form-select pr-item-unit" style="padding: 6px 6px; font-size: 12px; width: 80px;">
        <option value="PCS" ${data.unit === 'PCS' ? 'selected' : ''}>PCS</option>
        <option value="NOS" ${data.unit === 'NOS' ? 'selected' : ''}>NOS</option>
        <option value="SET" ${data.unit === 'SET' ? 'selected' : ''}>SET</option>
        <option value="MTR" ${data.unit === 'MTR' ? 'selected' : ''}>MTR</option>
        <option value="KG" ${data.unit === 'KG' ? 'selected' : ''}>KG</option>
        <option value="PKT" ${data.unit === 'PKT' ? 'selected' : ''}>PKT</option>
      </select>
    </td>
    <td>
      <input type="text" class="form-input pr-item-vendor" style="padding: 6px 8px; font-size: 12px;" placeholder="Preferred vendor" value="${escapeHtml(data.vendor || '')}">
    </td>
    <td>
      <input type="text" class="form-input pr-item-remarks" style="padding: 6px 8px; font-size: 12px;" placeholder="Remarks / Specs" value="${escapeHtml(data.remarks || '')}">
    </td>
    <td style="text-align: center;">
      <button type="button" class="btn-icon danger" style="width: 26px; height: 26px;" onclick="document.getElementById('${rowId}').remove();" title="Delete item">
        🗑
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}

function addAttachmentBadge(name, size) {
  const container = document.getElementById('pr-attachments-list');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'attachment-pill';
  div.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 4px; font-size: 11px; color: #93C5FD;';
  div.innerHTML = `
    <span>📎 ${escapeHtml(name)} (${size})</span>
    <button type="button" style="background: none; border: none; color: #EF4444; cursor: pointer; font-size: 13px; font-weight: 800;" onclick="this.parentElement.remove();">&times;</button>
  `;
  container.appendChild(div);
}

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

async function handlePRSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const prNo = document.getElementById('pr-number')?.value || '';
  const date = document.getElementById('pr-date')?.value || '';
  const requiredDate = document.getElementById('pr-required-date')?.value || '';
  const projectCode = document.getElementById('pr-project-code')?.value || '';
  const projectDesc = document.getElementById('pr-project-desc')?.value || '';
  const requestedBy = document.getElementById('pr-requested-by')?.value || '';
  const category = document.getElementById('pr-category')?.value || 'HRS';
  const priority = document.getElementById('pr-priority')?.value || 'Normal';
  const purpose = document.getElementById('pr-purpose')?.value || '';
  const internalRemarks = document.getElementById('pr-internal-remarks')?.value || '';

  if (!category) {
    if (window.showToast) window.showToast('Please select a Category (HRS, HRTC, SPARE - HRS, SPARE - HRTC)', 'error');
    return;
  }

  // Collect items
  const itemRows = document.querySelectorAll('#pr-items-table-body tr');
  const items = [];
  itemRows.forEach(row => {
    const desc = row.querySelector('.pr-item-desc')?.value.trim();
    if (desc) {
      items.push({
        desc: desc,
        drawing: row.querySelector('.pr-item-drawing')?.value.trim() || '',
        spec: row.querySelector('.pr-item-spec')?.value.trim() || '',
        qty: parseInt(row.querySelector('.pr-item-qty')?.value) || 1,
        unit: row.querySelector('.pr-item-unit')?.value || 'PCS',
        vendor: row.querySelector('.pr-item-vendor')?.value.trim() || '',
        remarks: row.querySelector('.pr-item-remarks')?.value.trim() || ''
      });
    }
  });

  if (items.length === 0) {
    if (window.showToast) window.showToast('Please add at least one item to the requisition', 'error');
    return;
  }

  const payload = {
    pr_no: prNo,
    date: date,
    required_date: requiredDate,
    project_code: projectCode,
    project_desc: projectDesc,
    requested_by: requestedBy,
    category: category,
    priority: priority,
    item_desc: items[0].desc,
    vendor: items[0].vendor || 'Local Vendor',
    purpose: purpose,
    internal_remarks: internalRemarks,
    status: 'Pending',
    items: items
  };

  try {
    const res = await window.api.createPurchaseRequest(payload);
    if (res && res.success) {
      if (window.showToast) window.showToast(`Purchase Request ${res.pr.pr_no} created successfully!`, 'success');
      window.closeModal('modal-new-purchase-request');
      loadPurchase();
    } else {
      if (window.showToast) window.showToast((res && res.message) || 'Failed to create PR', 'error');
    }
  } catch (err) {
    console.error('Failed to create purchase request:', err);
    if (window.showToast) window.showToast('Error: ' + err.message, 'error');
  }
}

// --------------------------------------------------------------------------
// PR Row Actions (View, Edit, Delete, PDF)
// --------------------------------------------------------------------------
window.viewPurchaseRequest = async function(id) {
  try {
    const prs = await window.api.getPurchaseRequests({});
    const pr = (prs || []).find(p => p.id === id || p.pr_no === id);
    if (!pr) return;
    currentViewingPR = pr;

    const titleEl = document.getElementById('view-pr-modal-title');
    if (titleEl) titleEl.innerText = `PURCHASE REQUISITION: ${pr.pr_no} (${pr.status.toUpperCase()})`;

    const bodyEl = document.getElementById('view-pr-modal-body');
    if (bodyEl) {
      const badgeClass = getPRStatusBadgeClass(pr.status);
      bodyEl.innerHTML = `
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 16px; margin-bottom: 16px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; font-size: 13px;">
            <div>
              <span style="color: var(--text-muted); font-size: 11px;">PR NUMBER:</span>
              <div style="font-weight: 800; color: #F97316; font-size: 14px;">${pr.pr_no}</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-size: 11px;">REQUISITION DATE:</span>
              <div style="font-weight: 600; color: #FFFFFF;">${pr.date}</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-size: 11px;">REQUIRED BY:</span>
              <div style="font-weight: 600; color: #F59E0B;">${pr.required_date || 'Urgent'}</div>
            </div>

            <div>
              <span style="color: var(--text-muted); font-size: 11px;">PROJECT CODE:</span>
              <div style="font-weight: 700; color: #60A5FA;">${pr.project_code}</div>
            </div>
            <div style="grid-column: span 2;">
              <span style="color: var(--text-muted); font-size: 11px;">PROJECT DESCRIPTION:</span>
              <div style="font-weight: 600; color: #E2E8F0;">${escapeHtml(pr.project_desc || '-')}</div>
            </div>

            <div>
              <span style="color: var(--text-muted); font-size: 11px;">CATEGORY:</span>
              <div><span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3);">${pr.category}</span></div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-size: 11px;">REQUESTED BY:</span>
              <div style="font-weight: 600; color: #FFFFFF;">${escapeHtml(pr.requested_by)}</div>
            </div>
            <div>
              <span style="color: var(--text-muted); font-size: 11px;">STATUS:</span>
              <div><span class="badge ${badgeClass}">${pr.status}</span></div>
            </div>
          </div>
        </div>

        <div style="font-size: 12px; font-weight: 700; color: #94A3B8; margin-bottom: 8px; letter-spacing: 0.5px;">REQUISITION ITEM DETAILS:</div>
        <div class="table-responsive" style="border: 1px solid var(--border-subtle); border-radius: 4px; margin-bottom: 16px;">
          <table class="data-table" id="view-pr-items-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th style="width: 40px;">#</th>
                <th>ITEM DESCRIPTION</th>
                <th>DRAWING NO</th>
                <th>SPEC / GRADE</th>
                <th style="text-align: right;">QTY</th>
                <th>UNIT</th>
                <th>VENDOR</th>
                <th>REMARKS</th>
              </tr>
            </thead>
            <tbody>
              ${(pr.items || []).map((item, idx) => `
                <tr>
                  <td style="color: var(--text-muted); font-weight: 700;">${idx + 1}</td>
                  <td style="font-weight: 700; color: #FFFFFF;">${escapeHtml(item.desc || pr.item_desc)}</td>
                  <td style="color: #60A5FA;">${escapeHtml(item.drawing || '-')}</td>
                  <td style="color: var(--text-secondary);">${escapeHtml(item.spec || '-')}</td>
                  <td style="text-align: right; font-weight: 700; color: #10B981;">${item.qty || 1}</td>
                  <td>${item.unit || 'PCS'}</td>
                  <td style="color: #93C5FD;">${escapeHtml(item.vendor || pr.vendor || '-')}</td>
                  <td style="color: var(--text-muted);">${escapeHtml(item.remarks || '-')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${pr.purpose ? `
          <div style="margin-bottom: 10px; font-size: 12px;">
            <strong style="color: #94A3B8;">Purpose / Justification:</strong>
            <div style="color: #E2E8F0; margin-top: 2px;">${escapeHtml(pr.purpose)}</div>
          </div>
        ` : ''}

        ${pr.internal_remarks ? `
          <div style="margin-bottom: 10px; font-size: 12px;">
            <strong style="color: #94A3B8;">Internal Remarks:</strong>
            <div style="color: #E2E8F0; margin-top: 2px;">${escapeHtml(pr.internal_remarks)}</div>
          </div>
        ` : ''}
      `;
    }

    window.openModal('modal-view-purchase-request');
  } catch (err) {
    console.error('Failed to view PR:', err);
  }
};

window.editPurchaseRequest = async function(id) {
  try {
    const prs = await window.api.getPurchaseRequests({});
    const pr = (prs || []).find(p => p.id === id || p.pr_no === id);
    if (!pr) return;

    const newStatus = prompt(`Update Status for ${pr.pr_no}:\nOptions: Pending, In Review, Approved, PO Released, In Transit, Received, Cancelled`, pr.status);
    if (!newStatus || newStatus.trim() === '') return;

    const res = await window.api.updatePurchaseRequest(id, { status: newStatus.trim() });
    if (res && res.success) {
      if (window.showToast) window.showToast(`Updated ${pr.pr_no} status to "${newStatus.trim()}"`, 'success');
      loadPurchase();
    }
  } catch (e) {
    console.error(e);
  }
};

window.deletePurchaseRequest = async function(id) {
  if (!confirm('Are you sure you want to delete this purchase request?')) return;
  try {
    const res = await window.api.deletePurchaseRequest(id);
    if (res && res.success) {
      if (window.showToast) window.showToast('Purchase Request deleted successfully', 'success');
      loadPurchase();
    }
  } catch (err) {
    console.error(err);
  }
};

window.exportPurchasePDF = function(id) {
  window.viewPurchaseRequest(id);
  setTimeout(() => {
    if (window.exportTableToPDF) {
      window.exportTableToPDF('view-pr-items-table', `RUNO_PR_${id}`);
    } else {
      window.print();
    }
  }, 400);
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.initPurchase = initPurchase;
window.loadPurchase = loadPurchase;
window.openNewPurchaseRequestModal = openNewPurchaseRequestModal;
window.addPRItemRow = addPRItemRow;
