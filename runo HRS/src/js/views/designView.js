// ==========================================================================
// RUNO HRS INDIA - Design Department Hot Runner Solutions Controller
// Full interactive controller matching reference dashboard UI
// ==========================================================================

// Complete dataset containing the 28 Hot Runner design projects
const INITIAL_DESIGN_PROJECTS = [
  {
    id: 'proj-001',
    sr_no: 1,
    project_code: 'RUNO-2026-001',
    customer_name: 'Minda Automotive',
    project_description: 'Rear Lamp Housing 4-Drop',
    hrs_type: 'Valve Gate',
    designer: 'Rahul S.',
    concept_hours: 12,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 18,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 24,
    threed_action: 'PLAY',
    threed_status: 'COMPLETED',
    overall_status: 'COMPLETED',
    order_date: '2026-01-15'
  },
  {
    id: 'proj-002',
    sr_no: 2,
    project_code: 'RUNO-2026-002',
    customer_name: 'Tata Motors',
    project_description: 'Bracket Cover',
    hrs_type: 'Open Gate',
    designer: 'Amit K.',
    concept_hours: 10,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 16,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 20,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-01-18'
  },
  {
    id: 'proj-003',
    sr_no: 3,
    project_code: 'RUNO-2026-003',
    customer_name: 'LG Electronics',
    project_description: 'Front Panel',
    hrs_type: 'Valve Gate',
    designer: 'Neha P.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 18,
    threed_action: 'PLAY',
    threed_status: 'COMPLETED',
    overall_status: 'IN REVIEW',
    order_date: '2026-01-20'
  },
  {
    id: 'proj-004',
    sr_no: 4,
    project_code: 'RUNO-2026-004',
    customer_name: 'Bajaj Auto',
    project_description: 'Switch Housing',
    hrs_type: 'Sequential',
    designer: 'Suresh M.',
    concept_hours: 10,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 14,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 16,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-01-22'
  },
  {
    id: 'proj-005',
    sr_no: 5,
    project_code: 'RUNO-2026-005',
    customer_name: 'Bosch India',
    project_description: 'Sensor Cover',
    hrs_type: 'Valve Gate',
    designer: 'Kiran D.',
    concept_hours: 6,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 10,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 14,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'ON HOLD',
    order_date: '2026-01-25'
  },
  {
    id: 'proj-006',
    sr_no: 6,
    project_code: 'RUNO-2026-006',
    customer_name: 'Hero MotoCorp',
    project_description: 'Connector Housing',
    hrs_type: 'Open Gate',
    designer: 'Priya S.',
    concept_hours: 10,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 20,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-01-28'
  },
  {
    id: 'proj-007',
    sr_no: 7,
    project_code: 'RUNO-2026-007',
    customer_name: 'Mahindra',
    project_description: 'Dashboard Housing',
    hrs_type: 'Sequential',
    designer: 'Rohit T.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'BLUE_PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 18,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-02-01'
  },
  {
    id: 'proj-008',
    sr_no: 8,
    project_code: 'RUNO-2026-008',
    customer_name: 'Valeo',
    project_description: 'Actuator Cover',
    hrs_type: 'Valve Gate',
    designer: 'Sneha V.',
    concept_hours: 10,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 16,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 22,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'IN REVIEW',
    order_date: '2026-02-04'
  },
  {
    id: 'proj-009',
    sr_no: 9,
    project_code: 'RUNO-2026-009',
    customer_name: 'Denso',
    project_description: 'EGR Housing',
    hrs_type: 'Open Gate',
    designer: 'Manish G.',
    concept_hours: 12,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 18,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 24,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'PAUSED',
    order_date: '2026-02-07'
  },
  {
    id: 'proj-010',
    sr_no: 10,
    project_code: 'RUNO-2026-010',
    customer_name: 'Motherson',
    project_description: 'Mirror Base',
    hrs_type: 'Valve Gate',
    designer: 'Pooja R.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 20,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-02-10'
  },
  {
    id: 'proj-011',
    sr_no: 11,
    project_code: 'RUNO-2026-011',
    customer_name: 'Suzuki',
    project_description: 'Air Vent',
    hrs_type: 'Open Gate',
    designer: 'Ajay S.',
    concept_hours: 10,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 14,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 18,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-02-12'
  },
  {
    id: 'proj-012',
    sr_no: 12,
    project_code: 'RUNO-2026-012',
    customer_name: 'Hyundai',
    project_description: 'Console Panel',
    hrs_type: 'Sequential',
    designer: 'Ritu M.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 16,
    threed_action: 'PLAY',
    threed_status: 'COMPLETED',
    overall_status: 'COMPLETED',
    order_date: '2026-02-15'
  },
  {
    id: 'proj-013',
    sr_no: 13,
    project_code: 'RUNO-2026-013',
    customer_name: 'TVS',
    project_description: 'Handle Cover',
    hrs_type: 'Open Gate',
    designer: 'Nikhil P.',
    concept_hours: 6,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 10,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 14,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'ON HOLD',
    order_date: '2026-02-18'
  },
  {
    id: 'proj-014',
    sr_no: 14,
    project_code: 'RUNO-2026-014',
    customer_name: 'Continental',
    project_description: 'Connector Bracket',
    hrs_type: 'Open Gate',
    designer: 'Kavita S.',
    concept_hours: 8,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 18,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-02-20'
  },
  {
    id: 'proj-015',
    sr_no: 15,
    project_code: 'RUNO-2026-015',
    customer_name: 'Varroc',
    project_description: 'Lens Housing',
    hrs_type: 'Valve Gate',
    designer: 'Deepak K.',
    concept_hours: 10,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 16,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 20,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'IN REVIEW',
    order_date: '2026-02-22'
  },
  // Projects for Page 2 (16 to 28)
  {
    id: 'proj-016',
    sr_no: 16,
    project_code: 'RUNO-2026-016',
    customer_name: 'Honda Cars',
    project_description: 'Tailgate Trim Bezel',
    hrs_type: 'Valve Gate',
    designer: 'Amit K.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 14,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 18,
    threed_action: 'PLAY',
    threed_status: 'COMPLETED',
    overall_status: 'COMPLETED',
    order_date: '2026-02-23'
  },
  {
    id: 'proj-017',
    sr_no: 17,
    project_code: 'RUNO-2026-017',
    customer_name: 'Toyota Kirloskar',
    project_description: 'Pillar Garnish Mould',
    hrs_type: 'Sequential',
    designer: 'Rahul S.',
    concept_hours: 12,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 16,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 22,
    threed_action: 'PLAY',
    threed_status: 'COMPLETED',
    overall_status: 'COMPLETED',
    order_date: '2026-02-24'
  },
  {
    id: 'proj-018',
    sr_no: 18,
    project_code: 'RUNO-2026-018',
    customer_name: 'Force Motors',
    project_description: 'Radiator Grille Bracket',
    hrs_type: 'Open Gate',
    designer: 'Suresh M.',
    concept_hours: 10,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 16,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-02-25'
  },
  {
    id: 'proj-019',
    sr_no: 19,
    project_code: 'RUNO-2026-019',
    customer_name: 'Endurance Tech',
    project_description: 'Brake Fluid Reservoir',
    hrs_type: 'Valve Gate',
    designer: 'Sneha V.',
    concept_hours: 6,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 10,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 14,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'IN REVIEW',
    order_date: '2026-02-26'
  },
  {
    id: 'proj-020',
    sr_no: 20,
    project_code: 'RUNO-2026-020',
    customer_name: 'Bharat Forge',
    project_description: 'Engine Cover Dampener',
    hrs_type: 'Sequential',
    designer: 'Rohit T.',
    concept_hours: 10,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 14,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 18,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-02-27'
  },
  {
    id: 'proj-021',
    sr_no: 21,
    project_code: 'RUNO-2026-021',
    customer_name: 'Uno Minda',
    project_description: 'Fog Lamp Reflector 2-Drop',
    hrs_type: 'Valve Gate',
    designer: 'Neha P.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 16,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'IN REVIEW',
    order_date: '2026-02-28'
  },
  {
    id: 'proj-022',
    sr_no: 22,
    project_code: 'RUNO-2026-022',
    customer_name: 'Plastic Omnium',
    project_description: 'Bumper Fascia 6-Drop',
    hrs_type: 'Sequential',
    designer: 'Manish G.',
    concept_hours: 14,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 20,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 28,
    threed_action: 'PAUSE',
    threed_status: 'COMPLETED',
    overall_status: 'PAUSED',
    order_date: '2026-03-01'
  },
  {
    id: 'proj-023',
    sr_no: 23,
    project_code: 'RUNO-2026-023',
    customer_name: 'Lumax Auto',
    project_description: 'Headlamp Outer Lens',
    hrs_type: 'Valve Gate',
    designer: 'Kiran D.',
    concept_hours: 10,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 14,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 20,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-03-02'
  },
  {
    id: 'proj-024',
    sr_no: 24,
    project_code: 'RUNO-2026-024',
    customer_name: 'Samvardhana Motherson',
    project_description: 'Glovebox Flap Assembly',
    hrs_type: 'Open Gate',
    designer: 'Pooja R.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 16,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-03-03'
  },
  {
    id: 'proj-025',
    sr_no: 25,
    project_code: 'RUNO-2026-025',
    customer_name: 'Magneti Marelli',
    project_description: 'Throttle Body Adapter',
    hrs_type: 'Valve Gate',
    designer: 'Deepak K.',
    concept_hours: 6,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 8,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 12,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'ON HOLD',
    order_date: '2026-03-04'
  },
  {
    id: 'proj-026',
    sr_no: 26,
    project_code: 'RUNO-2026-026',
    customer_name: 'Yazaki India',
    project_description: 'Junction Box Cover',
    hrs_type: 'Open Gate',
    designer: 'Ajay S.',
    concept_hours: 10,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 14,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 18,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-03-05'
  },
  {
    id: 'proj-027',
    sr_no: 27,
    project_code: 'RUNO-2026-027',
    customer_name: 'Aptiv Mobility',
    project_description: 'ECU Enclosure Shield',
    hrs_type: 'Valve Gate',
    designer: 'Kavita S.',
    concept_hours: 8,
    concept_action: 'PLAY',
    concept_status: 'COMPLETED',
    twod_hours: 12,
    twod_action: 'PLAY',
    twod_status: 'COMPLETED',
    threed_hours: 16,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-03-06'
  },
  {
    id: 'proj-028',
    sr_no: 28,
    project_code: 'RUNO-2026-028',
    customer_name: 'Lucas TVS',
    project_description: 'Starter Motor Endcap',
    hrs_type: 'Open Gate',
    designer: 'Nikhil P.',
    concept_hours: 8,
    concept_action: 'PAUSE',
    concept_status: 'COMPLETED',
    twod_hours: 10,
    twod_action: 'PAUSE',
    twod_status: 'COMPLETED',
    threed_hours: 14,
    threed_action: 'IDLE',
    threed_status: 'COMPLETED',
    overall_status: 'IN DESIGN',
    order_date: '2026-03-07'
  }
];

// Persistent state
let designProjects = JSON.parse(localStorage.getItem('runo_design_projects') || 'null');
if (!designProjects || designProjects.length === 0) {
  designProjects = JSON.parse(JSON.stringify(INITIAL_DESIGN_PROJECTS));
  localStorage.setItem('runo_design_projects', JSON.stringify(designProjects));
}

let designState = {
  currentPage: 1,
  pageSize: 15,
  filters: {
    customer: 'ALL',
    hrsType: 'ALL',
    designer: 'ALL',
    status: 'ALL',
    search: '',
    startDate: '',
    endDate: ''
  }
};

function saveDesignData() {
  localStorage.setItem('runo_design_projects', JSON.stringify(designProjects));
}

function initDesign() {
  // 1. Add New Design Project Button
  document.getElementById('btn-add-new-design-project')?.addEventListener('click', () => {
    openAddDesignProjectModal();
  });

  // 2. Filter Dropdown Listeners
  document.getElementById('filter-design-customer')?.addEventListener('change', (e) => {
    designState.filters.customer = e.target.value;
    designState.currentPage = 1;
    renderDesignView();
  });

  document.getElementById('filter-design-hrs-type')?.addEventListener('change', (e) => {
    designState.filters.hrsType = e.target.value;
    designState.currentPage = 1;
    renderDesignView();
  });

  document.getElementById('filter-design-designer')?.addEventListener('change', (e) => {
    designState.filters.designer = e.target.value;
    designState.currentPage = 1;
    renderDesignView();
  });

  document.getElementById('filter-design-status')?.addEventListener('change', (e) => {
    designState.filters.status = e.target.value;
    designState.currentPage = 1;
    renderDesignView();
  });

  // Date Range Filter Listeners
  const dateStart = document.getElementById('filter-date-start');
  const dateEnd = document.getElementById('filter-date-end');
  const applyFilters = () => {
    if (dateStart) designState.filters.startDate = dateStart.value;
    if (dateEnd) designState.filters.endDate = dateEnd.value;
    const pageSearchEl = document.getElementById('search-design');
    if (pageSearchEl) designState.filters.search = pageSearchEl.value.trim();
    designState.currentPage = 1;
    renderDesignView();
  };

  if (dateStart) {
    dateStart.addEventListener('change', applyFilters);
    dateStart.addEventListener('input', applyFilters);
  }
  if (dateEnd) {
    dateEnd.addEventListener('change', applyFilters);
    dateEnd.addEventListener('input', applyFilters);
  }

  // 3. Search Inputs (Page search & Top global header search)
  const pageSearch = document.getElementById('search-design');
  if (pageSearch) {
    pageSearch.addEventListener('input', (e) => {
      designState.filters.search = e.target.value.trim();
      designState.currentPage = 1;
      renderDesignView();
    });
  }

  const globalSearch = document.getElementById('global-header-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      designState.filters.search = e.target.value.trim();
      if (pageSearch) pageSearch.value = e.target.value;
      designState.currentPage = 1;
      renderDesignView();
    });
  }

  // 4. Filter Buttons: Apply & Reset
  document.getElementById('btn-design-filter')?.addEventListener('click', applyFilters);
  document.getElementById('btn-design-reset')?.addEventListener('click', () => {
    resetDesignFilters();
  });

  // 5. KPI Cards Interactive Click Filtering
  document.querySelectorAll('.design-kpi-card').forEach(card => {
    card.addEventListener('click', () => {
      const kpi = card.getAttribute('data-kpi');
      if (kpi === 'TOTAL') {
        designState.filters.status = 'ALL';
      } else {
        designState.filters.status = kpi;
      }
      const sel = document.getElementById('filter-design-status');
      if (sel) sel.value = designState.filters.status;
      designState.currentPage = 1;
      renderDesignView();
    });
  });

  // 6. Pagination Controls
  document.getElementById('btn-page-prev')?.addEventListener('click', () => {
    if (designState.currentPage > 1) {
      designState.currentPage--;
      renderDesignView();
    }
  });

  document.getElementById('btn-page-next')?.addEventListener('click', () => {
    const totalFiltered = getFilteredProjects().length;
    const maxPage = Math.ceil(totalFiltered / designState.pageSize);
    if (designState.currentPage < maxPage) {
      designState.currentPage++;
      renderDesignView();
    }
  });

  document.getElementById('design-page-size')?.addEventListener('change', (e) => {
    designState.pageSize = parseInt(e.target.value) || 15;
    designState.currentPage = 1;
    renderDesignView();
  });

  // 7. Modals Form Submission
  document.getElementById('form-design-project')?.addEventListener('submit', handleDesignProjectSubmit);
  document.getElementById('btn-confirm-upload')?.addEventListener('click', handleUploadDrawingConfirm);
  document.getElementById('btn-confirm-send-customer')?.addEventListener('click', handleSendToCustomerConfirm);

  // Populate filter dropdowns initially
  populateFilterDropdowns();
  loadDesign();
}

function resetDesignFilters() {
  designState.filters = {
    customer: 'ALL',
    hrsType: 'ALL',
    designer: 'ALL',
    status: 'ALL',
    search: '',
    startDate: '',
    endDate: ''
  };

  const selC = document.getElementById('filter-design-customer');
  if (selC) selC.value = 'ALL';
  const selH = document.getElementById('filter-design-hrs-type');
  if (selH) selH.value = 'ALL';
  const selD = document.getElementById('filter-design-designer');
  if (selD) selD.value = 'ALL';
  const selS = document.getElementById('filter-design-status');
  if (selS) selS.value = 'ALL';
  const searchInp = document.getElementById('search-design');
  if (searchInp) searchInp.value = '';
  const globalSearch = document.getElementById('global-header-search');
  if (globalSearch) globalSearch.value = '';
  const dateStart = document.getElementById('filter-date-start');
  if (dateStart) dateStart.value = '';
  const dateEnd = document.getElementById('filter-date-end');
  if (dateEnd) dateEnd.value = '';

  designState.currentPage = 1;
  renderDesignView();
  if (window.showToast) window.showToast('Design filters reset', 'info');
}

function populateFilterDropdowns() {
  // Populate Customers
  const custSelect = document.getElementById('filter-design-customer');
  if (custSelect) {
    const customers = [...new Set(designProjects.map(p => p.customer_name))].sort();
    let opts = '<option value="ALL">All Customers</option>';
    customers.forEach(c => {
      opts += `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`;
    });
    custSelect.innerHTML = opts;
  }

  // Populate Designers
  const desSelect = document.getElementById('filter-design-designer');
  if (desSelect) {
    const designers = [...new Set(designProjects.map(p => p.designer))].sort();
    let opts = '<option value="ALL">All Designers</option>';
    designers.forEach(d => {
      opts += `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`;
    });
    desSelect.innerHTML = opts;
  }
}

function getFilteredProjects() {
  let list = [...designProjects];
  const { customer, hrsType, designer, status, search, startDate, endDate } = designState.filters;

  if (customer && customer !== 'ALL') {
    list = list.filter(p => p.customer_name === customer);
  }

  if (hrsType && hrsType !== 'ALL') {
    list = list.filter(p => p.hrs_type === hrsType);
  }

  if (designer && designer !== 'ALL') {
    list = list.filter(p => p.designer === designer);
  }

  if (status && status !== 'ALL') {
    list = list.filter(p => (p.overall_status || '').toUpperCase() === status.toUpperCase());
  }

  if (startDate) {
    list = list.filter(p => {
      const d = window.normalizeDateStr ? window.normalizeDateStr(p.order_date || p.created_at) : (p.order_date || '');
      return d && d >= startDate;
    });
  }

  if (endDate) {
    list = list.filter(p => {
      const d = window.normalizeDateStr ? window.normalizeDateStr(p.order_date || p.created_at) : (p.order_date || '');
      return d && d <= endDate;
    });
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      (p.project_code && p.project_code.toLowerCase().includes(q)) ||
      (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
      (p.project_description && p.project_description.toLowerCase().includes(q)) ||
      (p.designer && p.designer.toLowerCase().includes(q)) ||
      (p.hrs_type && p.hrs_type.toLowerCase().includes(q))
    );
  }

  return list;
}

function updateKpiCards() {
  // Total in unfiltered or current set
  const total = designProjects.length;
  const inDesign = designProjects.filter(p => p.overall_status === 'IN DESIGN').length;
  const inReview = designProjects.filter(p => p.overall_status === 'IN REVIEW').length;
  const completed = designProjects.filter(p => p.overall_status === 'COMPLETED').length;
  const paused = designProjects.filter(p => p.overall_status === 'PAUSED').length;
  const onHold = designProjects.filter(p => p.overall_status === 'ON HOLD').length;
  const sent = designProjects.filter(p => p.overall_status === 'SENT TO CUSTOMER').length;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
  };

  setVal('kpi-total-projects', total);
  setVal('kpi-in-design', inDesign);
  setVal('kpi-in-review', inReview);
  setVal('kpi-completed', completed);
  setVal('kpi-paused', paused);
  setVal('kpi-on-hold', onHold);
  setVal('kpi-sent-to-customer', sent);
}

function loadDesign() {
  updateKpiCards();
  renderDesignView();
}

function renderDesignView() {
  const filtered = getFilteredProjects();
  const tbody = document.getElementById('design-table-body');
  if (!tbody) return;

  const { currentPage, pageSize } = designState;
  const totalEntries = filtered.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const validPage = Math.min(currentPage, totalPages);
  designState.currentPage = validPage;

  const startIdx = (validPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalEntries);
  const pageItems = filtered.slice(startIdx, endIdx);

  tbody.innerHTML = '';

  if (pageItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="15" style="padding: 40px; text-align: center; color: #8B9BB4; font-size: 13px;">
          No matching Hot Runner design projects found.
        </td>
      </tr>
    `;
  } else {
    pageItems.forEach((p, idx) => {
      const tr = document.createElement('tr');
      const srNo = startIdx + idx + 1;

      // Status pill class
      let pillClass = 'pill-in-design';
      if (p.overall_status === 'COMPLETED') pillClass = 'pill-completed';
      else if (p.overall_status === 'IN REVIEW') pillClass = 'pill-in-review';
      else if (p.overall_status === 'ON HOLD') pillClass = 'pill-on-hold';
      else if (p.overall_status === 'PAUSED') pillClass = 'pill-paused';
      else if (p.overall_status === 'SENT TO CUSTOMER') pillClass = 'pill-sent';

      // Concept button
      const conceptActionBtn = renderStageActionButton(p.id, 'concept', p.concept_action);
      const conceptStatusBtn = renderStageStatusButton(p.id, 'concept', p.concept_status);

      // 2D button
      const twodActionBtn = renderStageActionButton(p.id, 'twod', p.twod_action);
      const twodStatusBtn = renderStageStatusButton(p.id, 'twod', p.twod_status);

      // 3D button
      const threedActionBtn = renderStageActionButton(p.id, 'threed', p.threed_action);
      const threedStatusBtn = renderStageStatusButton(p.id, 'threed', p.threed_status);

      tr.innerHTML = `
        <td style="color: #8B9BB4; font-weight: 600;">${srNo}</td>
        <td class="td-proj-code">${escapeHtml(p.project_code)}</td>
        <td class="td-customer">${escapeHtml(p.customer_name)}</td>
        <td class="td-desc" title="${escapeHtml(p.project_description)}">${escapeHtml(p.project_description)}</td>
        <td class="td-hrs-type">${escapeHtml(p.hrs_type)}</td>
        <td class="td-designer">${escapeHtml(p.designer)}</td>

        <!-- Concept Design Group -->
        <td class="td-hrs-num">${p.concept_hours || 0}</td>
        <td>${conceptActionBtn}</td>
        <td>${conceptStatusBtn}</td>

        <!-- 2D Design Group -->
        <td class="td-hrs-num">${p.twod_hours || 0}</td>
        <td>${twodActionBtn}</td>
        <td>${twodStatusBtn}</td>

        <!-- 3D Design Group -->
        <td class="td-hrs-num">${p.threed_hours || 0}</td>
        <td>${threedActionBtn}</td>
        <td>${threedStatusBtn}</td>

        <!-- Overall Status -->
        <td>
          <span class="status-pill ${pillClass}">${escapeHtml(p.overall_status)}</span>
        </td>

        <!-- Action Columns -->
        <td>
          <button class="btn-action-icon" title="Upload CAD/Drawing" onclick="openUploadModal('${p.id}')">
            <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
          </button>
        </td>
        <td>
          <button class="btn-action-icon" title="Edit / Copy Project" onclick="openEditDesignProjectModal('${p.id}')">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
        </td>
        <td>
          <button class="btn-action-icon" title="View Technical Drawing" onclick="openViewDocModal('${p.id}')">
            <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </button>
        </td>
        <td>
          <button class="btn-action-icon" title="View 3D Parametric Model" onclick="openView3dModal('${p.id}')">
            <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          </button>
        </td>
        <td>
          <button class="btn-action-icon icon-purple" title="Send Design to Customer" onclick="openSendToCustomerModal('${p.id}')">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Update pagination info
  const pageInfo = document.getElementById('design-pagination-info');
  if (pageInfo) {
    if (totalEntries === 0) {
      pageInfo.innerText = 'Showing 0 to 0 of 0 entries';
    } else {
      pageInfo.innerText = `Showing ${startIdx + 1} to ${endIdx} of ${totalEntries} entries`;
    }
  }

  // Update pagination page buttons
  renderPaginationNumbers(totalPages, validPage);
}

function renderStageActionButton(projId, stage, action) {
  if (action === 'PLAY') {
    return `
      <button class="btn-stage-circle play-green" title="Active Timer (Click to Pause)" onclick="toggleStageAction('${projId}', '${stage}')">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
    `;
  } else if (action === 'PAUSE') {
    return `
      <button class="btn-stage-circle pause-amber" title="Paused Timer (Click to Play)" onclick="toggleStageAction('${projId}', '${stage}')">
        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
    `;
  } else if (action === 'BLUE_PAUSE') {
    return `
      <button class="btn-stage-circle pause-blue" title="Active Milestone (Click to Toggle)" onclick="toggleStageAction('${projId}', '${stage}')">
        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
    `;
  } else {
    return `
      <button class="btn-stage-circle idle-gray" title="Start Tracking" onclick="toggleStageAction('${projId}', '${stage}')">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
    `;
  }
}

function renderStageStatusButton(projId, stage, status) {
  return `
    <button class="btn-stage-circle status-done" title="Stage Complete" onclick="toggleStageStatus('${projId}', '${stage}')">
      <svg viewBox="0 0 24 24" style="width: 10px; height: 10px;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    </button>
  `;
}

function toggleStageAction(projId, stage) {
  const p = designProjects.find(x => x.id === projId);
  if (!p) return;

  const key = `${stage}_action`;
  const current = p[key];
  if (current === 'PLAY') {
    p[key] = 'PAUSE';
    if (window.showToast) window.showToast(`${p.project_code}: ${stage.toUpperCase()} timer paused`, 'info');
  } else {
    p[key] = 'PLAY';
    if (window.showToast) window.showToast(`${p.project_code}: ${stage.toUpperCase()} timer started!`, 'success');
  }

  saveDesignData();
  renderDesignView();
}

function toggleStageStatus(projId, stage) {
  const p = designProjects.find(x => x.id === projId);
  if (!p) return;

  if (window.showToast) window.showToast(`${p.project_code}: ${stage.toUpperCase()} stage is marked completed`, 'success');
}

function renderPaginationNumbers(totalPages, activePage) {
  const container = document.getElementById('design-page-numbers');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = `btn-page-num ${i === activePage ? 'active' : ''}`;
    btn.innerText = i;
    btn.addEventListener('click', () => {
      designState.currentPage = i;
      renderDesignView();
    });
    container.appendChild(btn);
  }

  const prevBtn = document.getElementById('btn-page-prev');
  const nextBtn = document.getElementById('btn-page-next');
  if (prevBtn) prevBtn.disabled = activePage <= 1;
  if (nextBtn) nextBtn.disabled = activePage >= totalPages;
}

// Modal Handlers
function openAddDesignProjectModal() {
  document.getElementById('modal-design-form-title').innerText = 'ADD NEW DESIGN PROJECT';
  document.getElementById('design-edit-id').value = '';
  document.getElementById('inp-design-code').value = `RUNO-2026-0${String(designProjects.length + 1).padStart(2, '0')}`;
  document.getElementById('inp-design-customer').value = '';
  document.getElementById('inp-design-desc').value = '';
  document.getElementById('inp-design-hrs-type').value = 'Valve Gate';
  document.getElementById('inp-design-designer').value = 'Rahul S.';
  document.getElementById('inp-design-concept-hrs').value = '8';
  document.getElementById('inp-design-2d-hrs').value = '14';
  document.getElementById('inp-design-3d-hrs').value = '18';
  document.getElementById('inp-design-status').value = 'IN DESIGN';

  if (window.openModal) window.openModal('modal-add-design-project');
}

function openEditDesignProjectModal(id) {
  const p = designProjects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modal-design-form-title').innerText = `EDIT PROJECT: ${p.project_code}`;
  document.getElementById('design-edit-id').value = p.id;
  document.getElementById('inp-design-code').value = p.project_code;
  document.getElementById('inp-design-customer').value = p.customer_name;
  document.getElementById('inp-design-desc').value = p.project_description;
  document.getElementById('inp-design-hrs-type').value = p.hrs_type;
  document.getElementById('inp-design-designer').value = p.designer;
  document.getElementById('inp-design-concept-hrs').value = p.concept_hours || 8;
  document.getElementById('inp-design-2d-hrs').value = p.twod_hours || 12;
  document.getElementById('inp-design-3d-hrs').value = p.threed_hours || 16;
  document.getElementById('inp-design-status').value = p.overall_status;

  if (window.openModal) window.openModal('modal-add-design-project');
}

function handleDesignProjectSubmit() {
  const editId = document.getElementById('design-edit-id').value;
  const project_code = document.getElementById('inp-design-code').value.trim();
  const customer_name = document.getElementById('inp-design-customer').value.trim();
  const project_description = document.getElementById('inp-design-desc').value.trim();
  const hrs_type = document.getElementById('inp-design-hrs-type').value;
  const designer = document.getElementById('inp-design-designer').value.trim();
  const concept_hours = parseInt(document.getElementById('inp-design-concept-hrs').value) || 0;
  const twod_hours = parseInt(document.getElementById('inp-design-2d-hrs').value) || 0;
  const threed_hours = parseInt(document.getElementById('inp-design-3d-hrs').value) || 0;
  const overall_status = document.getElementById('inp-design-status').value;

  if (!project_code || !customer_name || !project_description) {
    if (window.showToast) window.showToast('Please fill all required project fields', 'error');
    return;
  }

  if (editId) {
    const idx = designProjects.findIndex(x => x.id === editId);
    if (idx !== -1) {
      designProjects[idx] = {
        ...designProjects[idx],
        project_code,
        customer_name,
        project_description,
        hrs_type,
        designer,
        concept_hours,
        twod_hours,
        threed_hours,
        overall_status
      };
      if (window.showToast) window.showToast(`Updated project ${project_code}`, 'success');
    }
  } else {
    const newProj = {
      id: `proj-${Date.now()}`,
      sr_no: designProjects.length + 1,
      project_code,
      customer_name,
      project_description,
      hrs_type,
      designer,
      concept_hours,
      concept_action: 'PLAY',
      concept_status: 'COMPLETED',
      twod_hours,
      twod_action: 'PAUSE',
      twod_status: 'COMPLETED',
      threed_hours,
      threed_action: 'IDLE',
      threed_status: 'COMPLETED',
      overall_status,
      order_date: new Date().toISOString().split('T')[0]
    };
    designProjects.unshift(newProj);
    if (window.showToast) window.showToast(`Added design project ${project_code}`, 'success');
  }

  saveDesignData();
  populateFilterDropdowns();
  updateKpiCards();
  renderDesignView();
  if (window.closeModal) window.closeModal('modal-add-design-project');
}

function openUploadModal(id) {
  const p = designProjects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('upload-project-id').value = id;
  document.getElementById('upload-modal-title').innerText = `UPLOAD CAD / DRAWINGS: ${p.project_code}`;
  const nameEl = document.getElementById('file-cad-selected-name');
  if (nameEl) nameEl.innerText = '';
  const fileInput = document.getElementById('file-cad-input');
  if (fileInput) fileInput.value = '';

  if (window.openModal) window.openModal('modal-design-upload');
}

window.handleCadFileSelected = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const nameEl = document.getElementById('file-cad-selected-name');
    if (nameEl) {
      nameEl.innerText = `✓ Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    }
  }
};

function handleUploadDrawingConfirm() {
  const id = document.getElementById('upload-project-id').value;
  const stage = document.getElementById('upload-stage-select').value;
  const p = designProjects.find(x => x.id === id);
  if (!p) return;

  if (window.showToast) window.showToast(`CAD File uploaded successfully for ${p.project_code} (${stage})!`, 'success');
  if (window.closeModal) window.closeModal('modal-design-upload');
}

function openViewDocModal(id) {
  const p = designProjects.find(x => x.id === id);
  if (!p) return;

  const content = document.getElementById('doc-modal-content');
  if (!content) return;

  content.innerHTML = `
    <div style="background: #0A101D; border: 1px solid #23314A; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; border-bottom: 1px solid #1E293B; padding-bottom: 10px;">
        <div>
          <span style="font-size: 16px; font-weight: 800; color: #FF7043;">${escapeHtml(p.project_code)}</span>
          <span style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-left: 10px;">${escapeHtml(p.customer_name)}</span>
        </div>
        <span class="status-pill pill-completed">${escapeHtml(p.overall_status)}</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 12px;">
        <div>
          <div style="color: #8B9BB4; font-size: 10.5px; font-weight: 700;">PART NAME / DESCRIPTION</div>
          <div style="color: #FFFFFF; font-weight: 600; margin-top: 2px;">${escapeHtml(p.project_description)}</div>
        </div>
        <div>
          <div style="color: #8B9BB4; font-size: 10.5px; font-weight: 700;">HOT RUNNER SYSTEM TYPE</div>
          <div style="color: #FFFFFF; font-weight: 600; margin-top: 2px;">${escapeHtml(p.hrs_type)}</div>
        </div>
        <div>
          <div style="color: #8B9BB4; font-size: 10.5px; font-weight: 700;">LEAD DESIGN ENGINEER</div>
          <div style="color: #FFFFFF; font-weight: 600; margin-top: 2px;">${escapeHtml(p.designer)}</div>
        </div>
        <div>
          <div style="color: #8B9BB4; font-size: 10.5px; font-weight: 700;">CONCEPT HOURS LOGGED</div>
          <div style="color: #10B981; font-weight: 700; margin-top: 2px;">${p.concept_hours} Hours</div>
        </div>
        <div>
          <div style="color: #8B9BB4; font-size: 10.5px; font-weight: 700;">2D AUTOCAD HOURS</div>
          <div style="color: #3B82F6; font-weight: 700; margin-top: 2px;">${p.twod_hours} Hours</div>
        </div>
        <div>
          <div style="color: #8B9BB4; font-size: 10.5px; font-weight: 700;">3D PARAMETRIC HOURS</div>
          <div style="color: #A855F7; font-weight: 700; margin-top: 2px;">${p.threed_hours} Hours</div>
        </div>
      </div>
    </div>

    <!-- Drawing Preview Mockup -->
    <div style="border: 1px solid #23314A; border-radius: 8px; overflow: hidden; background: #070B14; padding: 24px; text-align: center;">
      <svg viewBox="0 0 400 180" style="width: 100%; max-height: 180px;">
        <rect x="20" y="30" width="360" height="70" rx="6" fill="#141E33" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="4 2"/>
        <line x1="200" y1="30" x2="200" y2="100" stroke="#FF5722" stroke-width="2"/>
        <circle cx="80" cy="120" r="14" fill="#0E1626" stroke="#10B981" stroke-width="2"/>
        <line x1="80" y1="100" x2="80" y2="135" stroke="#10B981" stroke-width="2.5"/>
        <circle cx="160" cy="120" r="14" fill="#0E1626" stroke="#10B981" stroke-width="2"/>
        <line x1="160" y1="100" x2="160" y2="135" stroke="#10B981" stroke-width="2.5"/>
        <circle cx="240" cy="120" r="14" fill="#0E1626" stroke="#10B981" stroke-width="2"/>
        <line x1="240" y1="100" x2="240" y2="135" stroke="#10B981" stroke-width="2.5"/>
        <circle cx="320" cy="120" r="14" fill="#0E1626" stroke="#10B981" stroke-width="2"/>
        <line x1="320" y1="100" x2="320" y2="135" stroke="#10B981" stroke-width="2.5"/>
        <text x="200" y="165" font-size="11" fill="#8B9BB4" font-weight="700" text-anchor="middle">RUNO BALANCED MULTI-DROP HOT MANIFOLD SCHEMATIC (AUTO CAD REV 4.2)</text>
      </svg>
    </div>
  `;

  if (window.openModal) window.openModal('modal-design-view-doc');
}

function openView3dModal(id) {
  const p = designProjects.find(x => x.id === id);
  if (!p) return;

  const content = document.getElementById('cad3d-modal-content');
  if (!content) return;

  content.innerHTML = `
    <div style="background: #0A101D; border: 1px solid #23314A; border-radius: 8px; padding: 16px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="font-weight: 800; font-size: 15px; color: #FF7043;">${escapeHtml(p.project_code)}</span>
        <span style="color: #FFFFFF; font-weight: 700; margin-left: 8px;">${escapeHtml(p.project_description)}</span>
      </div>
      <div style="font-size: 11px; color: #10B981; font-weight: 700;">✓ STEP AP214 SOLID MESH VERIFIED</div>
    </div>

    <!-- 3D Hot Runner Model Visual Canvas -->
    <div style="background: radial-gradient(circle at center, #131E36 0%, #080D18 100%); border: 1px solid #23314A; border-radius: 8px; padding: 30px 20px; text-align: center; position: relative;">
      <svg viewBox="0 0 500 220" style="width: 100%; max-height: 220px;">
        <!-- Isometric Manifold Block -->
        <polygon points="120,70 360,70 420,105 180,105" fill="#202D47" stroke="#4A6596" stroke-width="1.5" />
        <polygon points="120,70 180,105 180,150 120,115" fill="#172235" stroke="#4A6596" stroke-width="1.5" />
        <polygon points="180,105 420,105 420,150 180,150" fill="#1B273F" stroke="#4A6596" stroke-width="1.5" />
        
        <!-- Sprue Bushing / Melt Inlet -->
        <cylinder />
        <ellipse cx="270" cy="55" rx="20" ry="8" fill="#FF5722" stroke="#FF7A45" stroke-width="1.5" />
        <path d="M 250 55 L 250 70 L 290 70 L 290 55 Z" fill="#D84315" />
        
        <!-- 4 Hot Runner Nozzle Drops -->
        <!-- Drop 1 -->
        <rect x="155" y="150" width="16" height="40" rx="3" fill="#3B82F6" />
        <polygon points="155,190 171,190 163,205" fill="#F59E0B" />
        <!-- Drop 2 -->
        <rect x="225" y="150" width="16" height="40" rx="3" fill="#3B82F6" />
        <polygon points="225,190 241,190 233,205" fill="#F59E0B" />
        <!-- Drop 3 -->
        <rect x="295" y="150" width="16" height="40" rx="3" fill="#3B82F6" />
        <polygon points="295,190 311,190 303,205" fill="#F59E0B" />
        <!-- Drop 4 -->
        <rect x="365" y="150" width="16" height="40" rx="3" fill="#3B82F6" />
        <polygon points="365,190 381,190 373,205" fill="#F59E0B" />

        <!-- Glow Flow lines -->
        <line x1="270" y1="85" x2="163" y2="150" stroke="#FF5722" stroke-width="2.5" stroke-dasharray="3 3"/>
        <line x1="270" y1="85" x2="233" y2="150" stroke="#FF5722" stroke-width="2.5" stroke-dasharray="3 3"/>
        <line x1="270" y1="85" x2="303" y2="150" stroke="#FF5722" stroke-width="2.5" stroke-dasharray="3 3"/>
        <line x1="270" y1="85" x2="373" y2="150" stroke="#FF5722" stroke-width="2.5" stroke-dasharray="3 3"/>
      </svg>
      <div style="position: absolute; bottom: 12px; right: 18px; font-size: 11px; color: #8B9BB4;">
        Flow Simulation: <span style="color: #10B981; font-weight: 700;">Balanced (ΔP &lt; 28 bar)</span>
      </div>
    </div>
  `;

  if (window.openModal) window.openModal('modal-design-view-3d');
}

function openSendToCustomerModal(id) {
  const p = designProjects.find(x => x.id === id);
  if (!p) return;

  document.getElementById('send-target-id').value = id;
  document.getElementById('send-target-text').innerHTML = `
    Ready to transmit verified Hot Runner design deliverables for project 
    <strong style="color: #FF7043;">${escapeHtml(p.project_code)}</strong> to 
    <strong style="color: #FFFFFF;">${escapeHtml(p.customer_name)}</strong>:
  `;

  if (window.openModal) window.openModal('modal-design-send');
}

function handleSendToCustomerConfirm() {
  const id = document.getElementById('send-target-id').value;
  const p = designProjects.find(x => x.id === id);
  if (!p) return;

  p.overall_status = 'SENT TO CUSTOMER';
  saveDesignData();
  updateKpiCards();
  renderDesignView();

  if (window.showToast) window.showToast(`Design package sent to ${p.customer_name} successfully!`, 'success');
  if (window.closeModal) window.closeModal('modal-design-send');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.initDesign = initDesign;
window.loadDesign = loadDesign;
window.openAddDesignProjectModal = openAddDesignProjectModal;
window.openEditDesignProjectModal = openEditDesignProjectModal;
window.openUploadModal = openUploadModal;
window.openViewDocModal = openViewDocModal;
window.openView3dModal = openView3dModal;
window.openSendToCustomerModal = openSendToCustomerModal;
window.toggleStageAction = toggleStageAction;
window.toggleStageStatus = toggleStageStatus;
