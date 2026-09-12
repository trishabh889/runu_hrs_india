// ==========================================================================
// RUNO HRS INDIA - Utility Functions & UI Helpers
// ==========================================================================

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5722" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const titles = {
    success: 'SUCCESS',
    error: 'ERROR',
    info: 'SYSTEM NOTIFICATION'
  };

  const iconSvg = icons[type] || icons.info;
  const titleText = titles[type] || 'NOTIFICATION';

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${titleText}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" title="Dismiss">&times;</button>
  `;

  let timer = null;
  const dismiss = () => {
    if (timer) clearTimeout(timer);
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  container.appendChild(toast);

  timer = setTimeout(dismiss, 4000);
};

window.formatDate = function(dateStr) {
  if (!dateStr) return 'N/A';
  return dateStr;
};

window.normalizeDateStr = function(dateStr) {
  if (!dateStr || dateStr === '-' || dateStr === 'N/A' || dateStr === 'null' || dateStr === 'undefined') return '';
  let s = String(dateStr).trim();
  if (s.includes('T')) s = s.split('T')[0].trim();
  const ymd = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymd) {
    return `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`;
  }
  const dmy4 = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy4) {
    return `${dmy4[3]}-${dmy4[2].padStart(2, '0')}-${dmy4[1].padStart(2, '0')}`;
  }
  const dmy2 = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2})$/);
  if (dmy2) {
    const year = parseInt(dmy2[3]) >= 70 ? `19${dmy2[3]}` : `20${dmy2[3]}`;
    return `${year}-${dmy2[2].padStart(2, '0')}-${dmy2[1].padStart(2, '0')}`;
  }
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return '';
};

window.isDateInRange = function(dateVal, startVal, endVal) {
  const d = window.normalizeDateStr(dateVal);
  if (!d) return false;
  const normStart = window.normalizeDateStr(startVal);
  const normEnd = window.normalizeDateStr(endVal);
  if (normStart && d < normStart) return false;
  if (normEnd && d > normEnd) return false;
  return true;
};

window.initCustomDropdowns = function() {
  document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    if (dropdown.dataset.initialized) return;
    dropdown.dataset.initialized = 'true';

    const btn = dropdown.querySelector('.custom-dropdown-btn');
    const label = dropdown.querySelector('.custom-dropdown-label');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const items = dropdown.querySelectorAll('.custom-dropdown-item');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      document.querySelectorAll('.custom-dropdown.open').forEach(d => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });

    items.forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation();
        const val = item.dataset.value;
        const text = item.querySelector('span') ? item.querySelector('span').innerText : item.innerText;

        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (label) label.innerText = text;
        if (hiddenInput) {
          hiddenInput.value = val;
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        dropdown.classList.remove('open');
      });
    });
  });
};

document.addEventListener('click', () => {
  document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
  }
});

window.showConfirmDialog = function({
  title = 'Confirmation Required',
  message = 'Are you sure you want to proceed?',
  subtext = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false
} = {}) {
  return new Promise(resolve => {
    let overlay = document.getElementById('global-confirm-dialog');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'global-confirm-dialog';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }

    const iconSvg = danger
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5722" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    overlay.innerHTML = `
      <div class="modal-box confirm-dialog-box" style="max-width: 440px; border-top: 3px solid ${danger ? '#EF4444' : 'var(--brand-orange)'};">
        <div style="padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px;">
          <div style="width: 52px; height: 52px; border-radius: 50%; background: ${danger ? 'rgba(239,68,68,0.12)' : 'rgba(255,87,34,0.12)'}; border: 1px solid ${danger ? 'rgba(239,68,68,0.3)' : 'rgba(255,87,34,0.3)'}; display: flex; align-items: center; justify-content: center;">
            ${iconSvg}
          </div>
          <div>
            <h4 style="margin: 0; font-size: 15px; font-weight: 800; color: var(--text-primary); letter-spacing: 0.8px; text-transform: uppercase;">${title}</h4>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: var(--text-secondary); font-weight: 500; line-height: 1.5;">${message}</p>
            ${subtext ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: var(--text-muted); font-weight: 500;">${subtext}</p>` : ''}
          </div>
        </div>
        <div style="padding: 16px 24px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end; gap: 12px; background: rgba(0,0,0,0.15);">
          <button type="button" class="btn-action-secondary btn-cancel-confirm" style="flex: 1;">${cancelText}</button>
          <button type="button" class="btn-confirm-action" style="flex: 1; padding: 9px 16px; font-size: 12px; font-weight: 700; border-radius: 4px; border: none; cursor: pointer; color: #FFFFFF; background: ${danger ? '#DC2626' : '#FF5722'};">${confirmText}</button>
        </div>
      </div>
    `;

    overlay.classList.add('active');

    const cleanup = (result) => {
      overlay.classList.remove('active');
      resolve(result);
    };

    overlay.querySelector('.btn-cancel-confirm').onclick = () => cleanup(false);
    overlay.querySelector('.btn-confirm-action').onclick = () => cleanup(true);
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanup(false);
    };
  });
};

window.exportTableToExcel = function(tableId, filename = 'export.xls') {
  let el = typeof tableId === 'string' ? document.getElementById(tableId) : tableId;
  if (!el) {
    if (window.showToast) window.showToast('Table not found for export', 'error');
    return;
  }
  const table = el.tagName === 'TBODY' ? (el.closest('table') || el) : el;

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table { border-collapse: collapse; font-family: Cambria, Georgia, serif; font-size: 11px; } th, td { border: 1px solid #999; padding: 6px; } th { background: #E0E0E0; font-weight: bold; }</style></head><body>';

  const clone = table.cloneNode(true);
  clone.querySelectorAll('.action-col, .actions-cell, button').forEach(el => el.remove());
  clone.querySelectorAll('select').forEach(sel => {
    const span = document.createElement('span');
    span.innerText = sel.options[sel.selectedIndex]?.text || sel.value;
    sel.parentNode.replaceChild(span, sel);
  });

  html += clone.outerHTML;
  html += '</body></html>';

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  if (window.showToast) window.showToast(`Exported ${filename} successfully`, 'success');
};

window.exportTableToPDF = async function(tableId, title = 'RUNO HRS REPORT') {
  let el = typeof tableId === 'string' ? document.getElementById(tableId) : tableId;
  if (!el) {
    if (window.showToast) window.showToast('Table not found for printing', 'error');
    return;
  }
  const table = el.tagName === 'TBODY' ? (el.closest('table') || el) : el;

  const clone = table.cloneNode(true);
  clone.querySelectorAll('.action-col, .actions-cell, button').forEach(item => item.remove());
  clone.querySelectorAll('select').forEach(sel => {
    const span = document.createElement('span');
    span.innerText = sel.options[sel.selectedIndex]?.text || sel.value;
    sel.parentNode.replaceChild(span, sel);
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 10mm 12mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: Cambria, Georgia, 'Times New Roman', serif;
      margin: 0;
      padding: 0;
      color: #0f172a;
      background: #ffffff;
      font-size: 10px;
    }
    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #F15A24;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      color: #F15A24;
      letter-spacing: 0.5px;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #475569;
      font-weight: 600;
      margin-top: 2px;
      letter-spacing: 0.3px;
    }
    .report-meta {
      text-align: right;
      font-size: 10px;
      color: #64748b;
      line-height: 1.5;
    }
    .report-title-badge {
      display: inline-block;
      background: #fff7ed;
      color: #ea580c;
      border: 1px solid #fed7aa;
      font-weight: 800;
      font-size: 12px;
      padding: 3px 10px;
      border-radius: 4px;
      margin-top: 5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
      margin-top: 6px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 7px;
      text-align: left;
      font-size: 9.5px;
      vertical-align: middle;
      word-break: break-word;
    }
    th {
      background-color: #1e293b;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      font-size: 9px;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    .badge, .status-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 700;
      text-align: center;
      background: #e2e8f0;
      color: #334155;
    }
    .pdf-footer {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <div>
      <div class="brand-title">RUNO HRS INDIA</div>
      <div class="brand-subtitle">MANAGEMENT INFORMATION SYSTEM (MIS)</div>
      <div class="report-title-badge">${title}</div>
    </div>
    <div class="report-meta">
      <div><strong>Date:</strong> ${dateStr}</div>
      <div><strong>Time:</strong> ${timeStr}</div>
      <div><strong>Generated By:</strong> ${window.AppState?.currentUser?.username || 'ANAND'} (${window.AppState?.currentUser?.role || 'ADMIN'})</div>
    </div>
  </div>

  ${clone.outerHTML}

  <div class="pdf-footer">
    <span>RUNO HRS INDIA &bull; Reliable Precision &bull; Confidential Internal Record</span>
    <span>Generated via RUNO HRS MIS Desktop</span>
  </div>
</body>
</html>`;

  if (window.api && window.api.exportPDF) {
    if (window.showToast) window.showToast('Preparing PDF document...', 'info');
    try {
      const cleanTitle = (title || 'REPORT').replace(/[^a-zA-Z0-9_-]/g, '_');
      const res = await window.api.exportPDF({
        html,
        title,
        filename: `RUNO_${cleanTitle}_${now.toISOString().split('T')[0]}.pdf`
      });
      if (res && res.success) {
        if (window.showToast) window.showToast('PDF exported and opened successfully!', 'success');
      } else if (res && !res.cancelled) {
        if (window.showToast) window.showToast(res.error || 'Failed to export PDF', 'error');
      }
    } catch (e) {
      console.error('Export PDF error:', e);
      if (window.showToast) window.showToast('Export failed: ' + e.message, 'error');
    }
  } else {
    const printWin = window.open('', '_blank', 'width=1100,height=750');
    if (printWin) {
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      printWin.print();
    }
  }
};


