// ==========================================================================
// RUNO HRS INDIA - Manufacturing Dashboard View Controller
// Fully aligned with User Screenshot:
// 6 KPI Cards, Filter Toolbar, 12-Column Table with VENDOR, Badges & Progress Bars,
// Status Legend, and Multi-Tab "New Manufacturing Entry" Modal
// ==========================================================================

const defaultManufacturingData = [
  { sr: 1, project_code: 'RUNO-2026-001', project_desc: 'Rear Lamp Housing', customer: 'Minda Automotive', category: 'HRS', vendor: 'Watlow', planned_start: '18-03-26', planned_end: '28-03-26', actual_end: '-', status: 'IN PROGRESS', progress: 60, priority: 'High', mfg_type: 'New', qty: '1 Set', incharge: 'Vikram Singh', machine: 'CNC Milling 01', remarks: '5-Axis roughing completed. Finishing underway.' },
  { sr: 2, project_code: 'RUNO-2026-002', project_desc: 'Bracket Cover', customer: 'Tata Motors', category: 'HRTC', vendor: 'Omega', planned_start: '20-03-26', planned_end: '02-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 40, priority: 'Normal', mfg_type: 'New', qty: '2 Sets', incharge: 'Rajesh Sharma', machine: 'EDM Wirecut 01', remarks: 'Electrode manufacturing done.' },
  { sr: 3, project_code: 'RUNO-2026-003', project_desc: 'Front Panel', customer: 'LG Electronics', category: 'HRS', vendor: 'Steelage', planned_start: '22-03-26', planned_end: '30-03-26', actual_end: '29-03-26', status: 'COMPLETED', progress: 100, priority: 'Normal', mfg_type: 'New', qty: '1 Set', incharge: 'Anand Sharma', machine: 'Assembly Bay 1', remarks: 'CMM inspection passed. Ready for dispatch.' },
  { sr: 4, project_code: 'RUNO-2026-004', project_desc: 'Switch Housing', customer: 'Bajaj Auto', category: 'SPARE - HRS', vendor: 'Meusburger', planned_start: '25-03-26', planned_end: '05-04-26', actual_end: '-', status: 'NOT STARTED', progress: 0, priority: 'Normal', mfg_type: 'New', qty: '4 Sets', incharge: 'Vikram Singh', machine: 'Surface Grinder 01', remarks: 'Raw material block received.' },
  { sr: 5, project_code: 'RUNO-2026-005', project_desc: 'Sensor Cover', customer: 'Bosch India', category: 'HRS', vendor: 'Tempco', planned_start: '26-03-26', planned_end: '06-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 50, priority: 'High', mfg_type: 'New', qty: '1 Set', incharge: 'Rakesh Verma', machine: 'CNC Milling 02', remarks: 'Gun drilling completed.' },
  { sr: 6, project_code: 'RUNO-2026-006', project_desc: 'Connector Housing', customer: 'Hero MotoCorp', category: 'HRTC', vendor: 'LKM', planned_start: '28-03-26', planned_end: '07-04-26', actual_end: '-', status: 'ON HOLD', progress: 30, priority: 'Critical', mfg_type: 'Modification', qty: '1 Set', incharge: 'Rajesh Sharma', machine: 'EDM Wirecut 01', remarks: 'Awaiting customer drawing revision.' },
  { sr: 7, project_code: 'RUNO-2026-007', project_desc: 'Dashboard Housing', customer: 'Mahindra', category: 'SPARE - HRTC', vendor: 'Igus', planned_start: '29-03-26', planned_end: '10-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 70, priority: 'Normal', mfg_type: 'New', qty: '2 Sets', incharge: 'Vikram Singh', machine: 'Assembly Bay 2', remarks: 'Heater and thermocouple wiring ongoing.' },
  { sr: 8, project_code: 'RUNO-2026-008', project_desc: 'Actuator Cover', customer: 'Valeo', category: 'HRS', vendor: 'Harting', planned_start: '01-04-26', planned_end: '12-04-26', actual_end: '-', status: 'REWORK', progress: 20, priority: 'High', mfg_type: 'Rework', qty: '1 Set', incharge: 'Rakesh Verma', machine: 'CNC Milling 01', remarks: 'Gate orifice re-machining required.' },
  { sr: 9, project_code: 'RUNO-2026-009', project_desc: 'EGR Housing', customer: 'Denso', category: 'HRTC', vendor: 'Yudo', planned_start: '02-04-26', planned_end: '14-04-26', actual_end: '13-04-26', status: 'COMPLETED', progress: 100, priority: 'Normal', mfg_type: 'New', qty: '1 Set', incharge: 'Anand Sharma', machine: 'Assembly Bay 1', remarks: 'Hot test & leakage test certified.' },
  { sr: 10, project_code: 'RUNO-2026-010', project_desc: 'Mirror Base', customer: 'Motherson', category: 'SPARE - HRS', vendor: 'Festo', planned_start: '03-04-26', planned_end: '16-04-26', actual_end: '-', status: 'NOT STARTED', progress: 0, priority: 'Normal', mfg_type: 'New', qty: '2 Sets', incharge: 'Vikram Singh', machine: 'CNC Milling 02', remarks: 'Tool path generation scheduled.' },
  { sr: 11, project_code: 'RUNO-2026-011', project_desc: 'Valve Bracket', customer: 'Hyundai', category: 'HRS', vendor: 'Misumi', planned_start: '04-04-26', planned_end: '18-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 45, priority: 'Normal', mfg_type: 'New', qty: '1 Set', incharge: 'Rajesh Sharma', machine: 'Surface Grinder 01', remarks: 'Manifold plates ground flat.' },
  { sr: 12, project_code: 'RUNO-2026-012', project_desc: 'Manifold Block', customer: 'Kia', category: 'HRTC', vendor: 'Rogers', planned_start: '05-04-26', planned_end: '20-04-26', actual_end: '-', status: 'ON HOLD', progress: 25, priority: 'Urgent', mfg_type: 'New', qty: '1 Set', incharge: 'Vikram Singh', machine: 'CNC Milling 01', remarks: 'Material metallurgical certification awaited.' },
  { sr: 13, project_code: 'RUNO-2026-013', project_desc: 'Nozzle Tip', customer: 'Maruti Suzuki', category: 'SPARE - HRTC', vendor: 'Trelleborg', planned_start: '06-04-26', planned_end: '22-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 55, priority: 'High', mfg_type: 'New', qty: '8 Sets', incharge: 'Rakesh Verma', machine: 'CNC Lathe 01', remarks: 'Beryllium copper tips precision turned.' },
  { sr: 14, project_code: 'RUNO-2026-014', project_desc: 'Heater Band', customer: 'Ashok Leyland', category: 'HRS', vendor: 'Local', planned_start: '07-04-26', planned_end: '24-04-26', actual_end: '-', status: 'NOT STARTED', progress: 0, priority: 'Normal', mfg_type: 'New', qty: '6 Sets', incharge: 'Rajesh Sharma', machine: 'Assembly Bay 2', remarks: 'Purchase requisition raised.' },
  { sr: 15, project_code: 'RUNO-2026-015', project_desc: 'Air Vent', customer: 'TVS Motors', category: 'SPARE - HRS', vendor: 'CoorsTek', planned_start: '08-04-26', planned_end: '26-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 35, priority: 'Normal', mfg_type: 'New', qty: '3 Sets', incharge: 'Vikram Singh', machine: 'EDM Wirecut 01', remarks: 'Vent slit EDM erosion 35% done.' }
];

const mfgTabsOrder = ['basic', 'plan', 'process', 'resources', 'attachments', 'remarks'];
let currentMfgTab = 'basic';

function switchMfgTab(tabName) {
  if (!mfgTabsOrder.includes(tabName)) return;
  currentMfgTab = tabName;
  const currentIdx = mfgTabsOrder.indexOf(tabName);

  // Update tabs buttons
  document.querySelectorAll('.mfg-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update tab panels
  document.querySelectorAll('.mfg-tab-panel').forEach(panel => {
    if (panel.getAttribute('data-panel') === tabName) {
      panel.style.display = 'block';
      panel.classList.add('active');
    } else {
      panel.style.display = 'none';
      panel.classList.remove('active');
    }
  });

  // Update footer button states
  const prevBtn = document.getElementById('btn-prev-mfg-tab');
  const nextBtn = document.getElementById('btn-next-mfg-tab');
  const saveBtn = document.getElementById('btn-save-mfg-modal');

  if (prevBtn) prevBtn.style.display = currentIdx > 0 ? 'inline-flex' : 'none';
  if (currentIdx === mfgTabsOrder.length - 1) {
    if (nextBtn) nextBtn.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'inline-flex';
  } else {
    if (nextBtn) nextBtn.style.display = 'inline-flex';
    if (saveBtn) saveBtn.style.display = 'none';
  }
}

function initManufacturing() {
  // Hook open modal button
  const btnOpenModal = document.getElementById('btn-open-new-mfg');
  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => openNewMfgModal());
  }

  // Hook close modal button & cancel
  const btnCloseModal = document.getElementById('btn-close-mfg-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => closeNewMfgModal());
  }
  const btnCancelModal = document.getElementById('btn-cancel-mfg-modal');
  if (btnCancelModal) {
    btnCancelModal.addEventListener('click', () => closeNewMfgModal());
  }

  // Hook Modal Tabs & Navigation
  const tabBtns = document.querySelectorAll('.mfg-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchMfgTab(tab);
    });
  });

  const nextTabBtn = document.getElementById('btn-next-mfg-tab');
  if (nextTabBtn) {
    nextTabBtn.addEventListener('click', () => {
      const currentIdx = mfgTabsOrder.indexOf(currentMfgTab);
      if (currentIdx < mfgTabsOrder.length - 1) {
        switchMfgTab(mfgTabsOrder[currentIdx + 1]);
      }
    });
  }

  const prevTabBtn = document.getElementById('btn-prev-mfg-tab');
  if (prevTabBtn) {
    prevTabBtn.addEventListener('click', () => {
      const currentIdx = mfgTabsOrder.indexOf(currentMfgTab);
      if (currentIdx > 0) {
        switchMfgTab(mfgTabsOrder[currentIdx - 1]);
      }
    });
  }

  // Hook dropzone in attachments tab
  const dropzone = document.getElementById('mfg-dropzone');
  const fileInput = document.getElementById('mfg-file-input');
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      const attachList = document.getElementById('mfg-attachment-list');
      if (attachList && files.length > 0) {
        files.forEach(f => {
          const itemDiv = document.createElement('div');
          itemDiv.style.cssText = 'background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between;';
          itemDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">📎</span>
              <div>
                <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">${f.name}</div>
                <div style="font-size: 10px; color: #64748B;">Uploaded File</div>
              </div>
            </div>
            <span style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 4px; font-size: 9.5px; font-weight: 800; padding: 2px 6px;">ATTACHED</span>
          `;
          attachList.appendChild(itemDiv);
        });
        if (window.showToast) window.showToast(`${files.length} file(s) attached!`, 'success');
      }
    });
  }

  // Filter triggers
  const filterProj = document.getElementById('mfg-filter-project');
  const filterCat = document.getElementById('mfg-filter-category');
  const filterStat = document.getElementById('mfg-filter-status');
  const filterSearch = document.getElementById('mfg-filter-search');
  const filterStart = document.getElementById('mfg-filter-start');
  const filterEnd = document.getElementById('mfg-filter-end');
  const btnApplyFilter = document.getElementById('btn-mfg-apply-filter');

  const btnResetFilter = document.getElementById('btn-mfg-reset-filter');

  const triggerFilter = () => renderMfgTable();
  if (filterProj) filterProj.addEventListener('change', triggerFilter);
  if (filterCat) filterCat.addEventListener('change', triggerFilter);
  if (filterStat) filterStat.addEventListener('change', triggerFilter);
  if (filterSearch) filterSearch.addEventListener('input', triggerFilter);
  if (filterStart) {
    filterStart.addEventListener('change', triggerFilter);
    filterStart.addEventListener('input', triggerFilter);
  }
  if (filterEnd) {
    filterEnd.addEventListener('change', triggerFilter);
    filterEnd.addEventListener('input', triggerFilter);
  }
  if (btnApplyFilter) btnApplyFilter.addEventListener('click', triggerFilter);
  if (btnResetFilter) {
    btnResetFilter.addEventListener('click', () => {
      if (filterProj) filterProj.value = 'ALL';
      if (filterCat) filterCat.value = 'ALL';
      if (filterStat) filterStat.value = 'ALL';
      if (filterSearch) filterSearch.value = '';
      if (filterStart) filterStart.value = '';
      if (filterEnd) filterEnd.value = '';
      renderMfgTable();
    });
  }

  // Auto-fill project description and customer when project code is selected in modal
  const codeSelect = document.getElementById('mfg-form-project-code');
  if (codeSelect) {
    codeSelect.addEventListener('change', () => {
      const pCode = codeSelect.value;
      const descInput = document.getElementById('mfg-form-project-desc');
      const custInput = document.getElementById('mfg-form-customer');
      const catSelect = document.getElementById('mfg-form-category');

      if (!pCode) {
        if (descInput) descInput.value = '';
        if (custInput) custInput.value = '';
        return;
      }

      // Check projects in AppState or default data
      const allProjects = window.AppState?.projects || [];
      const matched = allProjects.find(p => (p.project_code || '').toUpperCase() === pCode.toUpperCase()) ||
                      defaultManufacturingData.find(d => d.project_code.toUpperCase() === pCode.toUpperCase());

      if (matched) {
        if (descInput) descInput.value = matched.mould_description || matched.project_desc || '';
        if (custInput) custInput.value = matched.customer_name || matched.customer || '';
        if (catSelect && (matched.category || matched.hrs_type)) {
          catSelect.value = matched.category || matched.hrs_type;
        }
      }
    });
  }

  // Handle Form Submit
  const form = document.getElementById('form-new-manufacturing');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSaveMfgEntry();
    });
  }
}

async function loadManufacturing() {
  try {
    // Try loading saved data from db or initialize with the 15 screenshot records
    let saved = [];
    try {
      if (window.api && window.api.getManufacturing) {
        saved = await window.api.getManufacturing();
      }
    } catch (e) {}

    if (saved && saved.length >= 10 && saved[0].vendor) {
      mfgList = saved;
    } else {
      mfgList = JSON.parse(JSON.stringify(defaultManufacturingData));
    }

    // Populate filter dropdown with all unique project codes
    populateProjectFilters();

    // Render KPIs & Table
    renderKPIs();
    renderMfgTable();
  } catch (err) {
    console.error('Failed to load manufacturing:', err);
  }
}

function populateProjectFilters() {
  const select = document.getElementById('mfg-filter-project');
  if (!select) return;

  const curVal = select.value || 'ALL';
  select.innerHTML = '<option value="ALL">All Projects</option>';

  const codes = [...new Set(mfgList.map(item => item.project_code))];
  codes.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.innerText = c;
    select.appendChild(opt);
  });
  select.value = curVal;
}

function renderKPIs() {
  let inProgress = 0, completed = 0, onHold = 0, rework = 0, notStarted = 0;

  mfgList.forEach(item => {
    const s = (item.status || '').toUpperCase();
    if (s === 'IN PROGRESS') inProgress++;
    else if (s === 'COMPLETED') completed++;
    else if (s === 'ON HOLD') onHold++;
    else if (s === 'REWORK') rework++;
    else if (s === 'NOT STARTED') notStarted++;
  });

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setVal('kpi-mfg-total', mfgList.length);
  setVal('kpi-mfg-in-progress', inProgress);
  setVal('kpi-mfg-completed', completed);
  setVal('kpi-mfg-on-hold', onHold);
  setVal('kpi-mfg-rework', rework);
  setVal('kpi-mfg-not-started', notStarted);
}

function renderMfgTable() {
  const tbody = document.getElementById('mfg-table-body');
  if (!tbody) return;

  const projFilter = document.getElementById('mfg-filter-project')?.value || 'ALL';
  const catFilter = document.getElementById('mfg-filter-category')?.value || 'ALL';
  const statFilter = document.getElementById('mfg-filter-status')?.value || 'ALL';
  const search = (document.getElementById('mfg-filter-search')?.value || '').trim().toLowerCase();
  const startDate = document.getElementById('mfg-filter-start')?.value || '';
  const endDate = document.getElementById('mfg-filter-end')?.value || '';

  const filtered = mfgList.filter(item => {
    if (projFilter !== 'ALL' && item.project_code !== projFilter) return false;
    if (catFilter !== 'ALL' && item.category !== catFilter) return false;
    if (statFilter !== 'ALL' && item.status.toUpperCase() !== statFilter.toUpperCase()) return false;
    if (startDate || endDate) {
      const sDate = window.normalizeDateStr ? window.normalizeDateStr(item.planned_start) : item.planned_start;
      const eDate = window.normalizeDateStr ? window.normalizeDateStr(item.planned_end || item.actual_end) : item.planned_end;
      const jobDate = sDate || eDate;
      if (startDate && jobDate && jobDate < startDate) return false;
      if (endDate && jobDate && jobDate > endDate) return false;
    }
    if (search) {
      const hay = `${item.project_code} ${item.project_desc} ${item.customer} ${item.vendor} ${item.category} ${item.status}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: #94A3B8; padding: 24px;">No matching manufacturing jobs found.</td></tr>`;
  } else {
    filtered.forEach((item, index) => {
      const tr = document.createElement('tr');
      const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
      const progressNum = parseInt(item.progress) || 0;

      tr.innerHTML = `
        <td style="text-align: center; color: #64748B; font-weight: 700;">${index + 1}</td>
        <td><span class="mfg-code">${item.project_code}</span></td>
        <td style="color: #E2E8F0; font-weight: 600; max-width: 130px; overflow: hidden; text-overflow: ellipsis;">${item.project_desc}</td>
        <td style="color: #CBD5E1; max-width: 110px; overflow: hidden; text-overflow: ellipsis;">${item.customer}</td>
        <td><span style="font-size: 11px; color: #94A3B8; font-weight: 600;">${item.category}</span></td>
        <td class="mfg-vendor-col">${item.vendor}</td>
        <td style="color: #94A3B8; font-size: 11px; text-align: center;">${item.planned_start}</td>
        <td style="color: #94A3B8; font-size: 11px; text-align: center;">${item.planned_end}</td>
        <td style="color: ${item.actual_end !== '-' ? '#10B981' : '#64748B'}; font-size: 11px; font-weight: 600; text-align: center;">${item.actual_end}</td>
        <td style="text-align: center;">
          <span class="mfg-badge ${statusClass}">${item.status}</span>
        </td>
        <td>
          <div class="mfg-progress-cell">
            <div class="mfg-progress-track">
              <div class="mfg-progress-fill" style="width: ${progressNum}%;"></div>
            </div>
            <span class="mfg-progress-text">${progressNum}%</span>
          </div>
        </td>
        <td style="text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
            <button type="button" class="btn-icon" title="View Details" onclick="viewMfgDetails('${item.project_code}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
            <button type="button" class="btn-icon" title="Edit Job" onclick="editMfgEntry('${item.project_code}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Update Showing X to Y of Z entries
  const entriesCount = document.getElementById('mfg-showing-entries');
  if (entriesCount) {
    entriesCount.innerText = `Showing 1 to ${filtered.length} of ${filtered.length} entries`;
  }
}

function openNewMfgModal() {
  const modal = document.getElementById('modal-new-manufacturing');
  if (!modal) return;

  const form = document.getElementById('form-new-manufacturing');
  if (form) form.reset();

  document.getElementById('mfg-entry-id').value = '';

  // Populate Project Code dropdown from all projects & current data
  const codeSelect = document.getElementById('mfg-form-project-code');
  if (codeSelect) {
    codeSelect.innerHTML = '<option value="">Select Project</option>';
    const codes = [...new Set(mfgList.map(item => item.project_code))];
    codes.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.innerText = c;
      codeSelect.appendChild(opt);
    });
  }

  // Default dates
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 10);

  const startInput = document.getElementById('mfg-form-start-date');
  if (startInput) startInput.value = today;
  const endInput = document.getElementById('mfg-form-end-date');
  if (endInput) endInput.value = nextWeek.toISOString().split('T')[0];

  switchMfgTab('basic');
  modal.classList.add('active');
}

function closeNewMfgModal() {
  const modal = document.getElementById('modal-new-manufacturing');
  if (modal) modal.classList.remove('active');
}

function handleSaveMfgEntry() {
  const pCode = document.getElementById('mfg-form-project-code')?.value;
  const vendor = document.getElementById('mfg-form-vendor')?.value;

  if (!pCode) {
    if (window.showToast) window.showToast('Please select Project Code', 'error');
    return;
  }
  if (!vendor) {
    if (window.showToast) window.showToast('Please select Vendor', 'error');
    return;
  }

  const desc = document.getElementById('mfg-form-project-desc')?.value || 'Hot Runner Component';
  const customer = document.getElementById('mfg-form-customer')?.value || 'General Customer';
  const category = document.getElementById('mfg-form-category')?.value || 'HRS';
  const startDate = document.getElementById('mfg-form-start-date')?.value || '';
  const endDate = document.getElementById('mfg-form-end-date')?.value || '';
  const priority = document.getElementById('mfg-form-priority')?.value || 'Normal';
  const status = document.getElementById('mfg-form-status')?.value || 'In Progress';
  const mfgType = document.getElementById('mfg-form-mfg-type')?.value || 'New';
  const qty = document.getElementById('mfg-form-qty')?.value || '1 Set';
  const incharge = document.getElementById('mfg-form-incharge')?.value || 'Vikram Singh';
  const machine = document.getElementById('mfg-form-machine')?.value || 'CNC Milling 01';
  const remarks = document.getElementById('mfg-form-remarks')?.value || '';

  // Format date as DD-MM-YY
  const fmtDate = (dStr) => {
    if (!dStr) return '-';
    const parts = dStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0].slice(-2)}`;
    return dStr;
  };

  const existingIdx = mfgList.findIndex(item => item.project_code === pCode);
  const newEntry = {
    sr: existingIdx >= 0 ? mfgList[existingIdx].sr : mfgList.length + 1,
    project_code: pCode,
    project_desc: desc,
    customer: customer,
    category: category,
    vendor: vendor,
    planned_start: fmtDate(startDate),
    planned_end: fmtDate(endDate),
    actual_end: status === 'Completed' ? fmtDate(new Date().toISOString().split('T')[0]) : '-',
    status: status.toUpperCase(),
    progress: status === 'Completed' ? 100 : (status === 'Not Started' ? 0 : 50),
    priority: priority,
    mfg_type: mfgType,
    qty: qty,
    incharge: incharge,
    machine: machine,
    remarks: remarks
  };

  if (existingIdx >= 0) {
    mfgList[existingIdx] = { ...mfgList[existingIdx], ...newEntry };
  } else {
    mfgList.unshift(newEntry);
  }

  // Persist to backend if API is available
  try {
    if (window.api && window.api.createManufacturingRecord) {
      window.api.createManufacturingRecord(newEntry);
    }
  } catch (e) {}

  closeNewMfgModal();
  renderKPIs();
  renderMfgTable();

  if (window.showToast) {
    window.showToast(`Manufacturing entry for ${pCode} saved successfully!`, 'success');
  }
}

window.viewMfgDetails = function(code) {
  const item = mfgList.find(i => i.project_code === code);
  if (!item) return;

  const codeBadge = document.getElementById('view-mfg-code-badge');
  if (codeBadge) codeBadge.innerText = item.project_code;

  const modalBody = document.getElementById('view-mfg-modal-body');
  if (!modalBody) return;

  const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
  const progressNum = parseInt(item.progress) || 0;

  modalBody.innerHTML = `
    <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="mfg-badge ${statusClass}" style="font-size: 11px; padding: 4px 12px; font-weight: 800;">${item.status}</span>
        <span style="background: #1E293B; color: #94A3B8; border: 1px solid #334155; border-radius: 4px; font-size: 10px; font-weight: 700; padding: 3px 8px; text-transform: uppercase;">Priority: ${item.priority || 'Normal'}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px; min-width: 220px; flex: 1; justify-content: flex-end;">
        <span style="font-size: 11px; color: #94A3B8; font-weight: 700;">Progress:</span>
        <div style="flex: 1; max-width: 140px; height: 8px; background: #1E293B; border-radius: 4px; overflow: hidden;">
          <div style="width: ${progressNum}%; height: 100%; background: #3B82F6; border-radius: 4px;"></div>
        </div>
        <span style="font-size: 12px; font-weight: 800; color: #FFFFFF; min-width: 35px; text-align: right;">${progressNum}%</span>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Project Code</div>
        <div style="font-size: 13px; font-weight: 800; color: #F97316;">${item.project_code}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Job / Item Description</div>
        <div style="font-size: 13px; font-weight: 700; color: #E2E8F0;">${item.project_desc}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Customer Name</div>
        <div style="font-size: 12.5px; font-weight: 700; color: #CBD5E1;">${item.customer}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Category</div>
        <div style="font-size: 12.5px; font-weight: 700; color: #38BDF8;">${item.category}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Vendor / Partner</div>
        <div style="font-size: 12.5px; font-weight: 700; color: #CBD5E1;">${item.vendor}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Manufacturing Type &amp; Qty</div>
        <div style="font-size: 12.5px; font-weight: 700; color: #E2E8F0;">${item.mfg_type || 'New'} &bull; ${String(item.qty || 1).toLowerCase().includes('set') ? (item.qty || 1) : `${item.qty || 1} Sets`}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Shop Incharge</div>
        <div style="font-size: 12.5px; font-weight: 700; color: #E2E8F0;">${item.incharge || 'Vikram Singh'}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Machine / Workstation</div>
        <div style="font-size: 12.5px; font-weight: 700; color: #E2E8F0;">${item.machine || 'CNC Milling 01'}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Planned Timeline</div>
        <div style="font-size: 12px; font-weight: 700; color: #94A3B8;">${item.planned_start} &rarr; ${item.planned_end}</div>
      </div>
      <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 10px 12px;">
        <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">Actual Completion</div>
        <div style="font-size: 12px; font-weight: 700; color: ${item.actual_end !== '-' ? '#10B981' : '#64748B'};">${item.actual_end || '-'}</div>
      </div>
    </div>

    <div style="background: #0B1220; border: 1px solid #1B2842; border-radius: 6px; padding: 12px 14px;">
      <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 4px;">Shopfloor Remarks / Job Notes</div>
      <div style="font-size: 12px; color: #CBD5E1; line-height: 1.5; font-style: italic;">"${item.remarks || 'No specific remarks entered for this manufacturing job.'}"</div>
    </div>
  `;

  const editBtn = document.getElementById('btn-edit-from-view-mfg');
  if (editBtn) {
    editBtn.onclick = () => {
      window.closeModal('modal-view-mfg-details');
      window.editMfgEntry(item.project_code);
    };
  }

  const printBtn = document.getElementById('btn-print-mfg-card');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }

  window.openModal('modal-view-mfg-details');
};

window.editMfgEntry = function(code) {
  const item = mfgList.find(i => i.project_code === code);
  if (!item) return;

  openNewMfgModal();

  const codeSelect = document.getElementById('mfg-form-project-code');
  if (codeSelect) codeSelect.value = item.project_code;

  const descInput = document.getElementById('mfg-form-project-desc');
  if (descInput) descInput.value = item.project_desc;

  const custInput = document.getElementById('mfg-form-customer');
  if (custInput) custInput.value = item.customer;

  const catSelect = document.getElementById('mfg-form-category');
  if (catSelect) catSelect.value = item.category;

  const vendorSelect = document.getElementById('mfg-form-vendor');
  if (vendorSelect) vendorSelect.value = item.vendor;

  const statusSelect = document.getElementById('mfg-form-status');
  if (statusSelect) {
    const s = item.status.toLowerCase();
    Array.from(statusSelect.options).forEach(opt => {
      if (opt.value.toLowerCase() === s) opt.selected = true;
    });
  }

  const remarksInput = document.getElementById('mfg-form-remarks');
  if (remarksInput) remarksInput.value = item.remarks || '';
};

window.initManufacturing = initManufacturing;
window.loadManufacturing = loadManufacturing;
