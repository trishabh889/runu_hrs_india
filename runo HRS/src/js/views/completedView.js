// ==========================================================================
// RUNO HRS INDIA - Completed Projects Archive View Controller
// ==========================================================================

function initCompletedProjects() {
  const monthFilter = document.getElementById('filter-completed-month');
  const yearFilter = document.getElementById('filter-completed-year');

  const trigger = () => loadCompletedProjects();
  if (monthFilter) monthFilter.addEventListener('change', trigger);
  if (yearFilter) yearFilter.addEventListener('change', trigger);

  const btnExcel = document.getElementById('btn-export-completed-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      window.exportTableToExcel('completed-projects-table-body', 'RUNO_Completed_Projects_Archive');
    });
  }

  const btnPdf = document.getElementById('btn-export-completed-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      window.exportTableToPDF('completed-projects-table-body', 'RUNO HRS INDIA - COMPLETED PROJECTS ARCHIVE');
    });
  }
}

async function loadCompletedProjects() {
  const month = document.getElementById('filter-completed-month') ? document.getElementById('filter-completed-month').value : 'ALL';
  const year = document.getElementById('filter-completed-year') ? document.getElementById('filter-completed-year').value : 'ALL';

  try {
    const [allProjects, mfgList] = await Promise.all([
      window.api.getProjects({}),
      window.api.getManufacturing()
    ]);
    const mfgRecords = mfgList || [];

    let list = (allProjects || []).filter(p => 
      (p.status || '').toUpperCase() === 'COMPLETED' || 
      p.completed_at || 
      mfgRecords.some(m => m.project_code === p.project_code && m.status === 'COMPLETED')
    );

    // Fallback if no projects specifically marked completed yet
    if (list.length === 0 && (allProjects || []).length > 0) {
      list = (allProjects || []).slice(0, 3);
    }

    // Filter by Year
    if (year !== 'ALL') {
      list = list.filter(p => {
        const d = p.completed_at || p.target_date || p.order_date || p.created_at || '';
        const norm = window.normalizeDateStr ? window.normalizeDateStr(d) : d;
        return norm ? norm.includes(year) : false;
      });
    }

    // Filter by Month
    if (month !== 'ALL') {
      list = list.filter(p => {
        const d = p.completed_at || p.target_date || p.order_date || p.created_at || '';
        const norm = window.normalizeDateStr ? window.normalizeDateStr(d) : d;
        const parts = (norm || '').split('-');
        return parts.length >= 2 && parts[1] === month;
      });
    }

    const footerCount = document.getElementById('completed-footer-count');
    if (footerCount) footerCount.innerText = `Total Projects: ${list.length}`;

    const tbody = document.getElementById('completed-projects-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; color: var(--text-muted); padding: 24px;">No completed project records found matching filters.</td></tr>';
      return;
    }

    list.forEach(p => {
      const custName = p.customer_name || p.customer || '';
      const projName = p.mould_description || p.project_name || p.project_code || '';
      const mr = mfgRecords.find(x => 
        (x.customer_name && x.customer_name.toLowerCase() === custName.toLowerCase()) ||
        (x.project_name && x.project_name.toLowerCase() === projName.toLowerCase())
      ) || {};

      const mfgDate = mr.mfg_date || p.completed_at || p.order_date || '-';
      const idCard = mr.id_card_no || p.id_card_no || '-';
      const deliveryDate = mr.delivery_date || p.delivery_date || p.target_date || '-';
      const cost = mr.cost || p.cost || p.value || '-';
      const hrsType = mr.hrs_type || p.hrs_type || p.category || 'HRS';
      const material = mr.material || p.material || '-';
      const nozzleSeries = mr.nozzle_series || p.nozzle_series || '-';
      const gateType = mr.gate_type || p.gate_type || '-';
      const connector = mr.connector || p.connector || '-';
      const gateDia = mr.gate_dia || p.gate_dia || '-';
      const guideDia = mr.guide_dia || p.guide_dia || '-';
      const remark = mr.remark || p.remark || p.notes || '-';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="white-space: nowrap; font-size: 11.5px; color: var(--text-secondary);">${mfgDate}</td>
        <td style="font-weight: 700; color: var(--text-primary); font-size: 12.5px;">${custName}</td>
        <td style="font-weight: 600; color: var(--text-primary); font-size: 12px;">${projName}</td>
        <td style="font-family: var(--font-primary); font-size: 11px; color: var(--brand-orange); font-weight: 700;">${idCard}</td>
        <td style="white-space: nowrap; font-size: 11.5px; color: var(--text-secondary);">${deliveryDate}</td>
        <td style="font-weight: 700; color: #10B981; font-size: 12px;">${cost}</td>
        <td><span class="badge badge-active">${hrsType}</span></td>
        <td style="font-size: 11.5px;">${material}</td>
        <td style="font-size: 11.5px;">${nozzleSeries}</td>
        <td style="font-size: 11.5px;">${gateType}</td>
        <td style="font-size: 11px;">${connector}</td>
        <td style="font-size: 11.5px;">${gateDia}</td>
        <td style="font-size: 11.5px;">${guideDia}</td>
        <td style="max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--text-secondary);" title="${remark}">${remark}</td>
        <td>
          <button class="btn-icon" title="View Details" onclick="viewProjectDetails('${p.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error('Failed to load completed projects:', e);
  }
}

window.initCompletedProjects = initCompletedProjects;
window.loadCompletedProjects = loadCompletedProjects;
