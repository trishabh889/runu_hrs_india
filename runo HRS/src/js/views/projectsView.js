// ==========================================================================
// RUNO HRS INDIA - Projects Repository View Controller
// Aligned with Java RunoMIS ProjectsPanel: Section Filters, 6 KPI cards, 
// 10 Table Columns, Design Check, Gmail Quote, and PDF/Excel Exports
// ==========================================================================

function initProjects() {
  if (window.initCustomDropdowns) window.initCustomDropdowns();

  const searchInput = document.getElementById('search-projects');
  if (searchInput) searchInput.addEventListener('input', () => loadProjects());

  const sectionSelect = document.getElementById('select-projects-section');
  if (sectionSelect) sectionSelect.addEventListener('change', () => loadProjects());

  const filterSelect = document.getElementById('select-projects-filter');
  if (filterSelect) filterSelect.addEventListener('change', () => loadProjects());

  const projStartDate = document.getElementById('filter-projects-start');
  const projEndDate = document.getElementById('filter-projects-end');
  const btnProjReset = document.getElementById('btn-projects-filter-reset');

  if (projStartDate) {
    projStartDate.addEventListener('input', () => loadProjects());
    projStartDate.addEventListener('change', () => loadProjects());
  }
  if (projEndDate) {
    projEndDate.addEventListener('input', () => loadProjects());
    projEndDate.addEventListener('change', () => loadProjects());
  }
  if (btnProjReset) {
    btnProjReset.addEventListener('click', () => {
      if (projStartDate) projStartDate.value = '';
      if (projEndDate) projEndDate.value = '';
      if (searchInput) searchInput.value = '';
      loadProjects();
    });
  }

  const btnNavNew = document.getElementById('btn-nav-new-proj');
  if (btnNavNew) {
    btnNavNew.addEventListener('click', () => {
      if (window.openCreateProjectModal) {
        window.openCreateProjectModal('HRS');
      } else {
        window.switchView('new-project');
      }
    });
  }

  // Wire Top Red Category Buttons matching slide to open modal directly
  const navBtns = [
    { id: 'btn-proj-nav-hrs', cat: 'HRS' },
    { id: 'btn-proj-nav-hrtc', cat: 'HRTC' },
    { id: 'btn-proj-nav-spare-hrs', cat: 'SPARE-HRS' },
    { id: 'btn-proj-nav-spare-hrtc', cat: 'SPARE-HRTC' }
  ];

  navBtns.forEach(item => {
    const btn = document.getElementById(item.id);
    if (btn) {
      btn.addEventListener('click', () => {
        if (window.openCreateProjectModal) {
          window.openCreateProjectModal(item.cat);
        } else if (window.openNewProjectWithCategory) {
          window.openNewProjectWithCategory(item.cat);
        } else {
          window.switchView('new-project');
        }
      });
    }
  });

  const btnQuickExport = document.getElementById('btn-proj-quick-export');
  if (btnQuickExport) {
    btnQuickExport.addEventListener('click', () => {
      if (window.exportTableToExcel) {
        window.exportTableToExcel('projects-table-body', 'RUNO_HRS_Projects_Repository.xlsx');
      } else if (window.api && window.api.exportCSV) {
        window.api.exportCSV('PROJECTS');
      }
    });
  }

  const btnExcel = document.getElementById('btn-export-projects-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      if (window.exportTableToExcel) {
        window.exportTableToExcel('projects-table-body', 'RUNO_HRS_Projects_Repository.xlsx');
      } else if (window.api && window.api.exportCSV) {
        window.api.exportCSV('PROJECTS');
      }
    });
  }

  const btnPdf = document.getElementById('btn-export-projects-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      if (window.exportTableToPDF) {
        window.exportTableToPDF('projects-table-body', 'RUNO HRS INDIA - PROJECTS REPOSITORY');
      }
    });
  }
}

async function loadProjects() {
  if (window.initCustomDropdowns) window.initCustomDropdowns();
  const searchInput = document.getElementById('search-projects');
  const sectionSelect = document.getElementById('select-projects-section');
  const filterSelect = document.getElementById('select-projects-filter');
  const startDate = document.getElementById('filter-projects-start')?.value || '';
  const endDate = document.getElementById('filter-projects-end')?.value || '';

  const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const section = sectionSelect ? sectionSelect.value.toUpperCase() : 'ALL';
  const statusFilter = filterSelect ? filterSelect.value.toUpperCase() : 'ALL';

  try {
    const list = await window.api.getProjects({});
    window.AppState.projects = list || [];

    // Filter projects matching search, section, status, and date range
    const filtered = (list || []).filter(p => {
      const pCat = (p.category || 'HRS').toUpperCase();
      const pStatus = (p.status || 'ACTIVE').toUpperCase();
      const pQuote = (p.quote_status || 'PENDING').toUpperCase();
      const pPO = (p.po_received || 'NO').toUpperCase();
      const pOwner = (p.owner || '').toUpperCase();
      const pCode = (p.project_code || '').toUpperCase();
      const pName = (p.mould_description || '').toUpperCase();
      const pCust = (p.customer_name || '').toUpperCase();

      // Section Filter
      if (section !== 'ALL' && !pCat.includes(section)) {
        return false;
      }

      // Status Filter
      if (statusFilter === 'ACTIVE' && pStatus === 'COMPLETED') return false;
      if (statusFilter === 'COMPLETED' && pStatus !== 'COMPLETED') return false;

      // Date Range Filter
      if ((startDate || endDate) && window.isDateInRange) {
        const pDate = p.order_date || p.target_date || p.created_at || '';
        if (!window.isDateInRange(pDate, startDate, endDate)) return false;
      }

      // Search Query
      if (search) {
        const hay = `${pCode} ${pName} ${pCust} ${pCat} ${pQuote} ${pPO} ${pOwner} ${pStatus}`.toLowerCase();
        if (!hay.contains ? !hay.includes(search) : !hay.includes(search)) return false;
      }

      return true;
    });

    // Calculate 6 KPIs matching Java ProjectsPanel
    let quotes = 0, poPending = 0, poReceived = 0, inProduction = 0, completed = 0;
    filtered.forEach(p => {
      const q = (p.quote_status || '').toUpperCase();
      const po = (p.po_received || '').toUpperCase();
      const s = (p.status || '').toUpperCase();

      if (q === 'PENDING' || q === 'SENT') quotes++;
      if (po === 'NO' || po === 'PENDING') poPending++;
      if (po === 'YES' || po === 'RECEIVED') poReceived++;
      if (s === 'IN PROGRESS' || s === 'ACTIVE') inProduction++;
      if (s === 'COMPLETED') completed++;
    });

    const setCard = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };
    setCard('kpi-proj-total', filtered.length);
    setCard('kpi-proj-quotes', quotes);
    setCard('kpi-proj-popending', poPending);
    setCard('kpi-proj-poreceived', poReceived);
    setCard('kpi-proj-inproduction', inProduction);
    setCard('kpi-proj-completed', completed);

    const tbody = document.getElementById('projects-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 28px;">No projects match current filters.</td></tr>';
      return;
    }

    filtered.forEach((p, idx) => {
      const tr = document.createElement('tr');
      const pCat = (p.category || 'HRS').toUpperCase();
      const pQuote = (p.quote_status || 'PENDING').toUpperCase();
      const isPoReceived = p.po_received === 'YES' || p.po_received === 'RECEIVED';
      const isCompleted = p.status === 'COMPLETED';

      let stage = 'NOT STARTED';
      if (isCompleted) stage = 'COMPLETED';
      else if (p.status === 'IN PROGRESS' || p.status === 'ACTIVE') stage = 'PRODUCTION';
      else if (pQuote === 'APPROVED') stage = 'QUOTATION';

      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
        <td style="font-weight: 700; color: var(--text-primary); cursor: pointer;" onclick="viewProjectDetails('${p.id}')">
          <div style="color: var(--brand-orange); font-size: 13px; font-weight: 800;">${p.mould_description || p.project_code}</div>
          <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-primary);">${p.project_code}</div>
        </td>
        <td style="font-weight: 700; color: var(--text-primary);">${p.customer_name || 'N/A'}</td>
        <td>
          <span class="badge badge-category">
            ${pCat}
          </span>
        </td>
        <td>
          <span class="badge badge-${pQuote === 'APPROVED' ? 'completed' : (pQuote === 'SENT' ? 'active' : 'pending')}">
            ${pQuote}
          </span>
        </td>
        <td>
          <span class="badge badge-${isPoReceived ? 'completed' : 'pending'}">
            ${isPoReceived ? 'RECEIVED' : 'PENDING'}
          </span>
        </td>
        <td>
          <span style="font-weight: 700; font-size: 11px; color: ${isCompleted ? '#10B981' : (stage === 'PRODUCTION' ? '#8B5CF6' : '#94A3B8')};">
            ${stage}
          </span>
        </td>
        <td style="color: var(--text-secondary); font-size: 12px; font-family: var(--font-primary);">${p.target_date || p.order_date || 'N/A'}</td>
        <td>
          <span class="badge badge-${(p.status || 'ACTIVE').toLowerCase().replace(/\s+/g, '-')}">${p.status}</span>
        </td>
        <td style="text-align: center;">
          <div class="table-actions" style="justify-content: center; gap: 6px;">
            <button class="btn-icon" title="View / Edit Specifications" onclick="viewProjectDetails('${p.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
            <button class="btn-icon" title="Design Check" onclick="designCheckProject('${p.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </button>
            <button class="btn-icon" title="Gmail Quote" onclick="gmailQuoteProject('${p.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </button>
            <button class="btn-icon danger" title="Delete Project" onclick="deleteProject('${p.id}')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

// Exact Design Check logic matching Java RunoMIS.designCheckSelected
window.designCheckProject = async function(id) {
  const p = (window.AppState.projects || []).find(item => item.id === id);
  if (!p) return;

  const missing = [];
  if (!p.customer_name) missing.push("CUSTOMER NAME");
  if (!p.mould_description && !p.project_code) missing.push("PROJECT NAME / MOULD DESCRIPTION");
  if (!p.order_date && !p.target_date) missing.push("RECEIVED / ORDER DATE");
  if (!p.quote_status) missing.push("QUOTE STATUS");
  if (!p.owner || p.owner === 'UNASSIGNED') missing.push("ALLOTTED USER");

  const passed = missing.length === 0;
  const newStatus = passed ? 'PASS' : 'ATTENTION';

  await window.api.updateProject(id, { design_check: newStatus });

  if (passed) {
    if (window.showToast) {
      window.showToast(`[DESIGN CHECK PASSED] All required customer and engineering data is verified for ${p.project_code}.`, 'success');
    } else {
      alert(`DESIGN CHECK PASSED: All required customer and engineering data is verified for ${p.project_code}.`);
    }
  } else {
    const msg = `DESIGN CHECK REQUIRES ATTENTION for ${p.project_code}:\n\nMissing Fields:\n- ` + missing.join('\n- ');
    if (window.showToast) {
      window.showToast(msg, 'warning');
    } else {
      alert(msg);
    }
  }
  loadProjects();
};

// Exact Gmail Quote logic matching Java RunoMIS.gmailQuote
window.gmailQuoteProject = async function(id) {
  const p = (window.AppState.projects || []).find(item => item.id === id);
  if (!p) return;

  // Find customer email
  let customerEmail = '';
  try {
    const customers = await window.api.getCustomers();
    const cust = (customers || []).find(c => c.company_name && c.company_name.toLowerCase() === (p.customer_name || '').toLowerCase());
    if (cust && cust.email) customerEmail = cust.email;
  } catch (e) {}

  const subject = encodeURIComponent(`QUOTE - ${p.project_code} - ${p.mould_description || 'Hot Runner System'}`);
  const body = encodeURIComponent(
    `DEAR ${p.customer_name || 'VALUED CUSTOMER'},\n\n` +
    `PLEASE FIND THE QUOTATION DETAILS FOR PROJECT: ${p.project_code} (${p.mould_description || 'HRS'}).\n\n` +
    `SPECIFICATIONS:\n` +
    `- NOZZLE DROPS: ${p.nozzle_count || 4}\n` +
    `- NOZZLE TYPE: ${p.nozzle_type || 'Standard Valve Gate'}\n` +
    `- MATERIAL: ${p.material || 'Polypropylene'}\n` +
    `- ESTIMATED VALUE: ${p.value || '₹ 3,50,000'}\n\n` +
    `REGARDS,\n` +
    `RUNO HRS INDIA\nMANAGEMENT INFORMATION SYSTEM`
  );

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(customerEmail)}&su=${subject}&body=${body}`;
  window.open(gmailUrl, '_blank');

  await window.api.updateProject(id, { quote_status: 'SENT' });
  if (window.showToast) window.showToast(`Gmail compose opened & Quote Status set to SENT for ${p.project_code}`, 'success');
  loadProjects();
};

window.viewProjectDetails = function(id) {
  const p = (window.AppState.projects || []).find(item => item.id === id);
  if (!p) return;

  const modalTitle = document.getElementById('modal-proj-title');
  if (modalTitle) modalTitle.innerText = `SPECIFICATIONS: ${p.project_code}`;

  const content = document.getElementById('modal-proj-content');
  if (content) {
    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 13px;">
        <div><span class="form-label">CUSTOMER:</span> <div style="font-weight: 700; color: var(--text-primary); margin-top: 4px;">${p.customer_name}</div></div>
        <div><span class="form-label">STATUS:</span> <div style="margin-top: 4px;"><span class="badge badge-${(p.status || 'ACTIVE').toLowerCase().replace(/\s+/g, '-')}">${p.status}</span></div></div>
        
        <div style="grid-column: span 2;"><span class="form-label">PROJECT DESCRIPTION:</span> <div style="color: var(--text-primary); margin-top: 4px; font-weight: 600;">${p.mould_description || p.project_description || 'N/A'}</div></div>
        
        <div><span class="form-label">NO OF DROPS:</span> <div style="color: var(--text-primary); margin-top: 4px; font-weight: 700;">${p.nozzle_count || 4} Drops</div></div>
        <div><span class="form-label">HRS TYPE (SCROLL):</span> <div style="color: var(--brand-orange); font-weight: 800; margin-top: 4px;">${p.hrs_type || p.nozzle_type || 'VALVE - RUNNER'}</div></div>
        
        <div><span class="form-label">PLASTIC MATERIAL / GRADE:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.plastic_grade || p.material || 'Polypropylene (PP)'}</div></div>
        <div><span class="form-label">PART WEIGHT (In GRAMS):</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.part_weight || p.shot_weight || 'N/A'}</div></div>
        
        <div><span class="form-label">COLOR CHANGE - YES / NO:</span> <div style="color: var(--text-primary); margin-top: 4px; font-weight: 700;">${p.color_change || 'NO'}</div></div>
        <div><span class="form-label">MOULD TYPE:</span> <div style="color: var(--text-primary); margin-top: 4px; font-weight: 700;">${p.mould_type || p.priority || 'NEW MOULD'}</div></div>

        <div><span class="form-label">SECTION / CATEGORY:</span> <div style="color: var(--brand-orange); font-weight: 700; margin-top: 4px;">${p.category || 'HRS'}</div></div>
        <div><span class="form-label">ALLOTTED TO (OWNER):</span> <div style="color: var(--text-primary); font-weight: 700; margin-top: 4px;">${p.owner || 'ANAND'}</div></div>

        <div><span class="form-label">TARGET DELIVERY:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.target_date || 'N/A'}</div></div>
        <div><span class="form-label">ESTIMATED VALUE:</span> <div style="color: #10B981; font-weight: 700; margin-top: 4px;">${p.value || '₹ 5,50,000'}</div></div>

        <div><span class="form-label">QUOTE STATUS:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.quote_status || 'PENDING'}</div></div>
        <div><span class="form-label">PO STATUS:</span> <div style="color: var(--text-primary); margin-top: 4px;">${p.po_received === 'YES' || p.po_received === 'RECEIVED' ? 'RECEIVED' : 'PENDING'}</div></div>

        <div><span class="form-label">DESIGN CHECK:</span> <div style="color: ${p.design_check === 'PASS' ? '#10B981' : '#F59E0B'}; font-weight: 800; margin-top: 4px;">${p.design_check || 'NOT CHECKED'}</div></div>
        <div><span class="form-label">PROJECT CODE:</span> <div style="font-family: var(--font-primary); color: var(--text-muted); margin-top: 4px;">${p.project_code}</div></div>

        <div style="grid-column: span 2;"><span class="form-label">TECHNICAL SPECIFICATIONS &amp; SPECIAL NOTES:</span> <div style="color: var(--text-secondary); margin-top: 4px; background: var(--bg-card-hover); padding: 10px; border-radius: 4px; border: 1px solid var(--border-subtle);">${p.notes || 'No special instructions recorded.'}</div></div>
      </div>

      <div class="form-actions" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
        <button class="btn-action-primary" onclick="markProjectCompleted('${p.id}')" ${p.status === 'COMPLETED' ? 'disabled style="opacity: 0.5"' : ''}>
          MARK AS COMPLETED
        </button>
        <button class="btn-action-secondary" onclick="closeModal('modal-project-details')">CLOSE</button>
      </div>
    `;
  }
  window.openModal('modal-project-details');
};

window.markProjectCompleted = async function(id) {
  const res = await window.api.updateProject(id, { 
    status: 'COMPLETED',
    completed_at: new Date().toISOString().split('T')[0]
  });
  if (res.success) {
    if (window.showToast) window.showToast('Project marked as completed', 'success');
    window.closeModal('modal-project-details');
    loadProjects();
  }
};

window.deleteProject = async function(id) {
  const confirmed = await window.showConfirmDialog({
    title: 'DELETE TOOLING PROJECT',
    message: 'Are you sure you want to delete this tooling project?',
    subtext: 'Project specifications, drawings, and logs will be permanently removed.',
    confirmText: 'DELETE PROJECT',
    cancelText: 'KEEP PROJECT',
    danger: true
  });
  if (!confirmed) return;

  const res = await window.api.deleteProject(id);
  if (res.success) {
    if (window.showToast) window.showToast('Project deleted successfully', 'info');
    loadProjects();
  }
};

window.initProjects = initProjects;
window.loadProjects = loadProjects;
