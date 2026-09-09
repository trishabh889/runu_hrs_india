// ==========================================================================
// RUNO HRS INDIA - Design View Controller (2D/3D Engineering Lifecycle)
// ==========================================================================

let selectedDesignProjectId = null;

function initDesign() {
  const searchInput = document.getElementById('search-design');
  if (searchInput) {
    searchInput.addEventListener('input', () => loadDesign());
  }

  const btnRefresh = document.getElementById('btn-design-refresh');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => loadDesign());
  }

  // Step Action Handlers
  document.getElementById('btn-step-2d-start')?.addEventListener('click', () => handleDesignStep('2dStart', '2D DESIGN STARTED'));
  document.getElementById('btn-step-2d-end')?.addEventListener('click', () => handleDesignStep('2dEnd', '2D DESIGN COMPLETED'));
  document.getElementById('btn-step-3d-start')?.addEventListener('click', () => handleDesignStep('3dStart', '3D DESIGN STARTED'));
  document.getElementById('btn-step-3d-end')?.addEventListener('click', () => handleDesignStep('3dEnd', '3D DESIGN COMPLETED'));
  document.getElementById('btn-step-design-send')?.addEventListener('click', () => handleDesignStep('designSend', 'DESIGN SENT TO CLIENT'));

  // Export Buttons
  document.getElementById('btn-export-design-excel')?.addEventListener('click', () => {
    window.exportTableToExcel('design-table-body', 'Design_2D_3D_Lifecycle');
  });

  document.getElementById('btn-export-design-pdf')?.addEventListener('click', () => {
    window.exportTableToPDF('design-table-body', 'RUNO HRS INDIA - DESIGN ENGINEERING LIFECYCLE');
  });
}

async function loadDesign() {
  const search = document.getElementById('search-design') ? document.getElementById('search-design').value.trim() : '';

  try {
    let list = await window.api.getProjects({});

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        (p.customer_name && p.customer_name.toLowerCase().includes(q)) ||
        (p.project_code && p.project_code.toLowerCase().includes(q)) ||
        (p.owner && p.owner.toLowerCase().includes(q))
      );
    }

    const tbody = document.getElementById('design-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: var(--text-muted); padding: 24px;">No design projects found.</td></tr>';
      return;
    }

    for (const p of list) {
      const wf = await window.api.getWorkflow(p.id);
      const overall = computeDesignOverallStatus(wf);
      const isSelected = p.id === selectedDesignProjectId;

      const tr = document.createElement('tr');
      tr.className = isSelected ? 'table-row-selected' : '';
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', () => {
        selectedDesignProjectId = p.id;
        document.querySelectorAll('#design-table-body tr').forEach(r => r.classList.remove('table-row-selected'));
        tr.classList.add('table-row-selected');
        const hint = document.getElementById('design-selected-hint');
        if (hint) hint.innerText = `Active Project: ${p.project_code} (${p.customer_name})`;
      });

      const quoteBadgeClass = ['SENT', 'APPROVED'].includes((p.quote_status || '').toUpperCase()) ? 'badge-completed' : 'badge-review';
      const poBadgeClass = (p.po_received || '').toUpperCase() === 'RECEIVED' ? 'badge-completed' : 'badge-review';

      tr.innerHTML = `
        <td>${p.order_date || '-'}</td>
        <td style="font-weight: 700; color: var(--text-primary);">${p.customer_name}</td>
        <td><span style="font-family: monospace; font-weight: 700; color: var(--brand-orange);">${p.project_code}</span></td>
        <td><span class="badge badge-active">${p.category || 'HRS'}</span></td>
        <td><span class="badge ${quoteBadgeClass}">${p.quote_status || 'PENDING'}</span></td>
        <td><span class="badge ${poBadgeClass}">${p.po_received || 'PENDING'}</span></td>
        <td style="font-size: 11px; color: var(--text-secondary);">${wf['2dStart'] || '-'}</td>
        <td style="font-size: 11px; color: var(--text-secondary);">${wf['2dEnd'] || '-'}</td>
        <td style="font-size: 11px; color: var(--text-secondary);">${wf['3dStart'] || '-'}</td>
        <td style="font-size: 11px; color: var(--text-secondary);">${wf['3dEnd'] || '-'}</td>
        <td style="font-size: 11px; font-weight: 700; color: ${wf['designSend'] !== '-' ? '#10B981' : 'var(--text-muted)'};">${wf['designSend'] !== '-' ? 'SENT' : 'PENDING'}</td>
        <td><span class="badge ${overall.badgeClass}">${overall.status}</span></td>
        <td>${p.lead_engineer || p.owner || 'ENGINEER'}</td>
      `;
      tbody.appendChild(tr);
    }
  } catch (err) {
    console.error('Failed to load design lifecycle:', err);
  }
}

function computeDesignOverallStatus(wf) {
  if (wf['designSend'] && wf['designSend'] !== '-') {
    return { status: 'DESIGN SENT', badgeClass: 'badge-completed' };
  }
  const d2 = wf['2dEnd'] && wf['2dEnd'] !== '-';
  const d3 = wf['3dEnd'] && wf['3dEnd'] !== '-';
  if (d2 && d3) {
    return { status: 'DESIGN READY', badgeClass: 'badge-completed' };
  }
  if (d2 || d3) {
    return { status: 'PARTIALLY FINISHED', badgeClass: 'badge-review' };
  }
  if ((wf['2dStart'] && wf['2dStart'] !== '-') || (wf['3dStart'] && wf['3dStart'] !== '-')) {
    return { status: 'IN PROGRESS', badgeClass: 'badge-active' };
  }
  return { status: 'NOT STARTED', badgeClass: 'badge-inactive' };
}

async function handleDesignStep(step, successMessage) {
  if (!selectedDesignProjectId) {
    window.showToast('Please select a project row first', 'error');
    return;
  }

  const projects = await window.api.getProjects({});
  const p = projects.find(x => x.id === selectedDesignProjectId);
  if (!p) return;

  const wf = await window.api.getWorkflow(selectedDesignProjectId);

  // Business Rule Validations matching Java MasterPatch
  if (step === '2dStart' || step === '3dStart') {
    const q = (p.quote_status || '').toUpperCase();
    if (!['SENT', 'APPROVED', 'QUOTE SEND'].includes(q)) {
      window.showToast('Commercial must send or approve the Quote before Design can start!', 'error');
      return;
    }
    const po = (p.po_received || '').toUpperCase();
    if (po !== 'RECEIVED') {
      window.showToast('Sales must mark PO as RECEIVED before Design can start!', 'error');
      return;
    }
  }

  if (step === '2dEnd' && (!wf['2dStart'] || wf['2dStart'] === '-')) {
    window.showToast('Start 2D Design first before marking it completed!', 'error');
    return;
  }

  if (step === '3dEnd' && (!wf['3dStart'] || wf['3dStart'] === '-')) {
    window.showToast('Start 3D Design first before marking it completed!', 'error');
    return;
  }

  if (step === 'designSend') {
    if (!wf['2dEnd'] || wf['2dEnd'] === '-' || !wf['3dEnd'] || wf['3dEnd'] === '-') {
      window.showToast('Both 2D and 3D designs must be completed before sending design to client!', 'error');
      return;
    }
  }

  if (wf[step] && wf[step] !== '-') {
    window.showToast(`${successMessage} was already recorded at ${wf[step]}`, 'info');
    return;
  }

  const res = await window.api.setWorkflow(selectedDesignProjectId, step);
  if (res.success) {
    window.showToast(`${successMessage} recorded!`, 'success');
    loadDesign();
  }
}

window.initDesign = initDesign;
window.loadDesign = loadDesign;
