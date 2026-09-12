// ==========================================================================
// RUNO HRS INDIA - New Project Creation View Controller
// Aligned with Slide Requirements: +HRS, +HRTC, +SPARE HRS, +SPARE HRTC, EXPORT
// and 8 field transformations:
// 1. PROJECT DESCRIPTION
// 2. NO OF DROPS
// 3. HRS TYPE (SCROLL)
// 4. PLASTIC MATERIAL / GRADE
// 5. PART WEIGHT (In GRAMS)
// 6. COLOR CHANGE - YES/NO
// 7. MOULD TYPE - NEW / EXISTING
// 8. YEAR AND MONTH (PROJECT CODE)
// ==========================================================================

function initNewProjectForm() {
  const form = document.getElementById('form-create-project');
  const btnCancel = document.getElementById('btn-cancel-new-project');
  if (btnCancel) {
    btnCancel.addEventListener('click', () => window.switchView('projects'));
  }

  const btnReset = document.getElementById('btn-reset-new-project');
  if (btnReset && form) {
    btnReset.addEventListener('click', () => {
      form.reset();
      prepareNewProjectForm(document.getElementById('newproj-category')?.value || 'HRS');
    });
  }

  // Handle Top Red Category Action Buttons on Page
  const catButtons = [
    { id: 'btn-cat-hrs', cat: 'HRS' },
    { id: 'btn-cat-hrtc', cat: 'HRTC' },
    { id: 'btn-cat-spare-hrs', cat: 'SPARE-HRS' },
    { id: 'btn-cat-spare-hrtc', cat: 'SPARE-HRTC' }
  ];

  catButtons.forEach(btnInfo => {
    const btn = document.getElementById(btnInfo.id);
    if (btn) {
      btn.addEventListener('click', () => {
        setProjectCategory(btnInfo.cat);
      });
    }
  });

  // Export Button in Slide Action Bar
  const btnExport = document.getElementById('btn-cat-export');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      if (window.exportTableToExcel) {
        window.switchView('projects');
        setTimeout(() => window.exportTableToExcel('projects-table-body', 'RUNO_HRS_Projects.xlsx'), 300);
      } else if (window.api && window.api.exportCSV) {
        window.api.exportCSV('PROJECTS');
      }
    });
  }

  // Handle Year & Month Change -> Auto generate code suggestion
  const yearSelect = document.getElementById('newproj-year');
  const monthSelect = document.getElementById('newproj-month');
  const codeInput = document.getElementById('newproj-code');

  const updateAutoCode = () => {
    if (!codeInput) return;
    const y = yearSelect ? yearSelect.value : new Date().getFullYear();
    const m = monthSelect ? monthSelect.value : String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Auto populate if user hasn't typed a custom code
    if (!codeInput.dataset.userEdited || codeInput.value === '') {
      codeInput.value = `RUNO-${y}-${m}-001`;
    }
  };

  if (yearSelect) yearSelect.addEventListener('change', updateAutoCode);
  if (monthSelect) monthSelect.addEventListener('change', updateAutoCode);
  if (codeInput) {
    codeInput.addEventListener('input', () => {
      codeInput.dataset.userEdited = 'true';
    });
  }

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const customerSelect = document.getElementById('newproj-customer');
    const custId = customerSelect ? customerSelect.value : '';
    const custName = (customerSelect && customerSelect.selectedIndex >= 0 && customerSelect.options[customerSelect.selectedIndex])
      ? customerSelect.options[customerSelect.selectedIndex].text
      : 'General Customer';

    const desc = getVal('newproj-desc');
    const targetDate = getVal('newproj-date');
    const category = getVal('newproj-category') || 'HRS';
    const industry = getVal('newproj-industry');

    if (!desc) {
      if (window.showToast) window.showToast('Please enter Project Description', 'error');
      return;
    }

    const y = getVal('newproj-year') || new Date().getFullYear().toString();
    const m = getVal('newproj-month') || String(new Date().getMonth() + 1).padStart(2, '0');
    let code = getVal('newproj-code');
    if (!code) {
      code = `RUNO-${y}-${m}-001`;
    }

    const hrsType = getVal('newproj-hrs-type') || '2. VALVE - RUNNER';
    const plasticMaterial = getVal('newproj-material') || 'Polypropylene (PP)';
    const partWeight = getVal('newproj-part-weight') || '';
    const colorChange = getVal('newproj-color-change') || 'NO';
    const mouldType = getVal('newproj-mould-type') || 'NEW MOULD';
    const receivedDate = new Date().toISOString().split('T')[0];

    const data = {
      project_code: code,
      customer_id: custId,
      customer_name: custName,
      mould_description: desc,
      project_description: desc,
      category: category,
      quote_status: 'PENDING',
      po_received: 'NO',
      owner: (window.currentUser && window.currentUser.username) ? window.currentUser.username.toUpperCase() : 'ANAND',
      order_date: receivedDate,
      nozzle_count: parseInt(getVal('newproj-drops')) || 4,
      nozzle_type: hrsType,
      hrs_type: hrsType,
      manifold_type: 'H13 Balanced Manifold',
      plastic_grade: plasticMaterial,
      material: plasticMaterial,
      shot_weight: partWeight,
      part_weight: partWeight,
      color_change: colorChange,
      mould_type: mouldType,
      industry: industry,
      target_date: targetDate || new Date().toISOString().split('T')[0],
      priority: mouldType,
      value: getVal('newproj-value') || '₹ 5,50,000',
      notes: getVal('newproj-notes') || `RUNO_SOURCE=SALES; COLOR_CHANGE=${colorChange}; MOULD=${mouldType}; WEIGHT=${partWeight}; INDUSTRY=${industry}`
    };

    try {
      const res = await window.api.createProject(data);
      if (res && res.success) {
        if (window.showToast) window.showToast(`Project ${res.project.project_code} created successfully!`, 'success');
        if (form) form.reset();
        window.switchView('projects');
      } else {
        if (window.showToast) window.showToast((res && res.message) || 'Failed to create project', 'error');
      }
    } catch (err) {
      console.error('Project creation failed:', err);
      if (window.showToast) window.showToast('Error: ' + err.message, 'error');
    }
  };

  if (form) form.addEventListener('submit', handleSubmit);
  const btnSubmit = document.getElementById('btn-submit-project');
  if (btnSubmit) btnSubmit.addEventListener('click', handleSubmit);

  // Also bind Modal Project Form
  initModalProjectForm();
}

function setProjectCategory(category = 'HRS') {
  const input = document.getElementById('newproj-category');
  if (input) input.value = category;

  const mapping = {
    'HRS': 'btn-cat-hrs',
    'HRTC': 'btn-cat-hrtc',
    'SPARE-HRS': 'btn-cat-spare-hrs',
    'SPARE-HRTC': 'btn-cat-spare-hrtc'
  };

  Object.values(mapping).forEach(btnId => {
    const b = document.getElementById(btnId);
    if (b) b.classList.remove('active');
  });

  const activeBtnId = mapping[category] || 'btn-cat-hrs';
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) activeBtn.classList.add('active');
}

function setModalProjectCategory(category = 'HRS') {
  const input = document.getElementById('modal-proj-category');
  if (input) input.value = category;

  const mapping = {
    'HRS': 'modal-cat-hrs',
    'HRTC': 'modal-cat-hrtc',
    'SPARE-HRS': 'modal-cat-spare-hrs',
    'SPARE-HRTC': 'modal-cat-spare-hrtc'
  };

  Object.values(mapping).forEach(btnId => {
    const b = document.getElementById(btnId);
    if (b) b.classList.remove('active');
  });

  const activeBtnId = mapping[category] || 'modal-cat-hrs';
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) activeBtn.classList.add('active');
}

async function prepareNewProjectForm(defaultCategory) {
  const cat = defaultCategory || window.pendingNewProjectCategory || 'HRS';
  window.pendingNewProjectCategory = null;
  setProjectCategory(cat);

  // Populate Year options
  const yearSelect = document.getElementById('newproj-year');
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';
    for (let yr = currentYear - 2; yr <= currentYear + 3; yr++) {
      const opt = document.createElement('option');
      opt.value = yr.toString();
      opt.innerText = yr.toString();
      if (yr === currentYear) opt.selected = true;
      yearSelect.appendChild(opt);
    }
  }

  // Set Current Month
  const monthSelect = document.getElementById('newproj-month');
  if (monthSelect) {
    const curMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    monthSelect.value = curMonth;
  }

  // Pre-fill Project Code
  const codeInput = document.getElementById('newproj-code');
  if (codeInput && !codeInput.value) {
    const y = yearSelect ? yearSelect.value : new Date().getFullYear();
    const m = monthSelect ? monthSelect.value : '09';
    codeInput.value = `RUNO-${y}-${m}-001`;
  }

  // Populate Customers
  try {
    const customers = await window.api.getCustomers();
    const select = document.getElementById('newproj-customer');
    if (select) {
      select.innerHTML = '';
      if (customers.length === 0) {
        select.innerHTML = '<option value="">-- No Customers Registered. Please Add One First --</option>';
      } else {
        customers.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.innerText = c.company_name;
          select.appendChild(opt);
        });
      }
    }
  } catch (err) {
    console.error('Failed to load customers for project form:', err);
  }

  const target = new Date();
  target.setDate(target.getDate() + 30);
  const dateInput = document.getElementById('newproj-date');
  if (dateInput && !dateInput.value) dateInput.value = target.toISOString().split('T')[0];
}

// --------------------------------------------------------------------------
// Modal Project Creation Controller
// --------------------------------------------------------------------------
function initModalProjectForm() {
  const form = document.getElementById('form-modal-create-project');
  if (!form || form.dataset.initialized) return;
  form.dataset.initialized = 'true';

  const modalCatBtns = [
    { id: 'modal-cat-hrs', cat: 'HRS' },
    { id: 'modal-cat-hrtc', cat: 'HRTC' },
    { id: 'modal-cat-spare-hrs', cat: 'SPARE-HRS' },
    { id: 'modal-cat-spare-hrtc', cat: 'SPARE-HRTC' }
  ];

  modalCatBtns.forEach(btnInfo => {
    const btn = document.getElementById(btnInfo.id);
    if (btn) {
      btn.addEventListener('click', () => {
        setModalProjectCategory(btnInfo.cat);
      });
    }
  });

  const modalBtnExport = document.getElementById('modal-cat-export');
  if (modalBtnExport) {
    modalBtnExport.addEventListener('click', () => {
      if (window.exportTableToExcel) {
        window.closeModal('modal-create-project');
        window.switchView('projects');
        setTimeout(() => window.exportTableToExcel('projects-table-body', 'RUNO_HRS_Projects.xlsx'), 300);
      }
    });
  }

  const yearSelect = document.getElementById('modal-proj-year');
  const monthSelect = document.getElementById('modal-proj-month');
  const codeInput = document.getElementById('modal-proj-code');

  const updateModalAutoCode = () => {
    if (!codeInput) return;
    const y = yearSelect ? yearSelect.value : new Date().getFullYear();
    const m = monthSelect ? monthSelect.value : String(new Date().getMonth() + 1).padStart(2, '0');
    if (!codeInput.dataset.userEdited || codeInput.value === '') {
      codeInput.value = `RUNO-${y}-${m}-001`;
    }
  };

  if (yearSelect) yearSelect.addEventListener('change', updateModalAutoCode);
  if (monthSelect) monthSelect.addEventListener('change', updateModalAutoCode);
  if (codeInput) {
    codeInput.addEventListener('input', () => {
      codeInput.dataset.userEdited = 'true';
    });
  }

  const getModalVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const handleModalSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const customerSelect = document.getElementById('modal-proj-customer');
    const custId = customerSelect ? customerSelect.value : '';
    const custName = (customerSelect && customerSelect.selectedIndex >= 0 && customerSelect.options[customerSelect.selectedIndex])
      ? customerSelect.options[customerSelect.selectedIndex].text
      : 'General Customer';

    const desc = getModalVal('modal-proj-desc');
    const targetDate = getModalVal('modal-proj-date');
    const category = getModalVal('modal-proj-category') || 'HRS';
    const industry = getModalVal('modal-proj-industry');

    if (!desc) {
      if (window.showToast) window.showToast('Please enter Project Description', 'error');
      return;
    }

    const y = getModalVal('modal-proj-year') || new Date().getFullYear().toString();
    const m = getModalVal('modal-proj-month') || String(new Date().getMonth() + 1).padStart(2, '0');
    let code = getModalVal('modal-proj-code');
    if (!code) {
      code = `RUNO-${y}-${m}-001`;
    }

    const hrsType = getModalVal('modal-proj-hrs-type') || '2. VALVE - RUNNER';
    const plasticMaterial = getModalVal('modal-proj-material') || 'Polypropylene (PP)';
    const partWeight = getModalVal('modal-proj-part-weight') || '';
    const colorChange = getModalVal('modal-proj-color-change') || 'NO';
    const mouldType = getModalVal('modal-proj-mould-type') || 'NEW MOULD';
    const receivedDate = new Date().toISOString().split('T')[0];

    const data = {
      project_code: code,
      customer_id: custId,
      customer_name: custName,
      mould_description: desc,
      project_description: desc,
      category: category,
      quote_status: 'PENDING',
      po_received: 'NO',
      owner: (window.currentUser && window.currentUser.username) ? window.currentUser.username.toUpperCase() : 'ANAND',
      order_date: receivedDate,
      nozzle_count: parseInt(getModalVal('modal-proj-drops')) || 4,
      nozzle_type: hrsType,
      hrs_type: hrsType,
      manifold_type: 'H13 Balanced Manifold',
      plastic_grade: plasticMaterial,
      material: plasticMaterial,
      shot_weight: partWeight,
      part_weight: partWeight,
      color_change: colorChange,
      mould_type: mouldType,
      industry: industry,
      target_date: targetDate || new Date().toISOString().split('T')[0],
      priority: mouldType,
      value: getModalVal('modal-proj-value') || '₹ 5,50,000',
      notes: getModalVal('modal-proj-notes') || `RUNO_SOURCE=SALES; COLOR_CHANGE=${colorChange}; MOULD=${mouldType}; WEIGHT=${partWeight}; INDUSTRY=${industry}`
    };

    try {
      const res = await window.api.createProject(data);
      if (res && res.success) {
        if (window.showToast) window.showToast(`Project ${res.project.project_code} created successfully!`, 'success');
        if (form) form.reset();
        window.closeModal('modal-create-project');
        if (window.loadProjects) window.loadProjects();
      } else {
        if (window.showToast) window.showToast((res && res.message) || 'Failed to create project', 'error');
      }
    } catch (err) {
      console.error('Modal project creation failed:', err);
      if (window.showToast) window.showToast('Error: ' + err.message, 'error');
    }
  };

  form.addEventListener('submit', handleModalSubmit);
  const btnSubmitModal = document.getElementById('modal-btn-submit-project');
  if (btnSubmitModal) btnSubmitModal.addEventListener('click', handleModalSubmit);
}

// Global function to open the New Project Modal from any screen
window.openCreateProjectModal = async function(category = 'HRS') {
  initModalProjectForm();
  setModalProjectCategory(category);

  // Populate Year options
  const yearSelect = document.getElementById('modal-proj-year');
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';
    for (let yr = currentYear - 2; yr <= currentYear + 3; yr++) {
      const opt = document.createElement('option');
      opt.value = yr.toString();
      opt.innerText = yr.toString();
      if (yr === currentYear) opt.selected = true;
      yearSelect.appendChild(opt);
    }
  }

  // Current Month
  const monthSelect = document.getElementById('modal-proj-month');
  if (monthSelect) {
    const curMonth = String(new Date().getMonth() + 1).padStart(2, '0');
    monthSelect.value = curMonth;
  }

  // Pre-fill Project Code
  const codeInput = document.getElementById('modal-proj-code');
  if (codeInput) {
    const y = yearSelect ? yearSelect.value : new Date().getFullYear();
    const m = monthSelect ? monthSelect.value : '09';
    try {
      const allProjects = await window.api.getProjects({});
      const count = (allProjects || []).length + 1;
      codeInput.value = `RUNO-${y}-${m}-${String(count).padStart(3, '0')}`;
    } catch (e) {
      codeInput.value = `RUNO-${y}-${m}-001`;
    }
  }

  // Populate Customers
  try {
    const customers = await window.api.getCustomers();
    const select = document.getElementById('modal-proj-customer');
    if (select) {
      select.innerHTML = '';
      if (customers.length === 0) {
        select.innerHTML = '<option value="">-- No Customers Registered. Please Add One First --</option>';
      } else {
        customers.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.innerText = c.company_name;
          select.appendChild(opt);
        });
      }
    }
  } catch (err) {
    console.error('Failed to load customers for modal:', err);
  }

  const target = new Date();
  target.setDate(target.getDate() + 30);
  const dateInput = document.getElementById('modal-proj-date');
  if (dateInput) dateInput.value = target.toISOString().split('T')[0];

  window.openModal('modal-create-project');
};

// Global helper to open New Project view with a specific category pre-selected
window.openNewProjectWithCategory = function(cat = 'HRS') {
  window.switchView('new-project');
  setTimeout(() => {
    setProjectCategory(cat);
  }, 50);
};

window.initNewProjectForm = initNewProjectForm;
window.prepareNewProjectForm = prepareNewProjectForm;
window.setProjectCategory = setProjectCategory;
window.setModalProjectCategory = setModalProjectCategory;
