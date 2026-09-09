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
  const table = typeof tableId === 'string' ? document.getElementById(tableId) : tableId;
  if (!table) {
    if (window.showToast) window.showToast('Table not found for export', 'error');
    return;
  }

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>table { border-collapse: collapse; font-family: Segoe UI, sans-serif; font-size: 11px; } th, td { border: 1px solid #999; padding: 6px; } th { background: #E0E0E0; font-weight: bold; }</style></head><body>';

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

window.exportTableToPDF = function(tableId, title = 'RUNO HRS REPORT') {
  const table = typeof tableId === 'string' ? document.getElementById(tableId) : tableId;
  if (!table) {
    if (window.showToast) window.showToast('Table not found for printing', 'error');
    return;
  }
  const clone = table.cloneNode(true);
  clone.querySelectorAll('.action-col, .actions-cell, button').forEach(el => el.remove());
  clone.querySelectorAll('select').forEach(sel => {
    const span = document.createElement('span');
    span.innerText = sel.options[sel.selectedIndex]?.text || sel.value;
    sel.parentNode.replaceChild(span, sel);
  });

  const printWin = window.open('', '_blank', 'width=1000,height=720');
  if (!printWin) {
    window.print();
    return;
  }

  printWin.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #1e293b; }
        .header { border-bottom: 2px solid #FF5722; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .header h2 { margin: 0; color: #FF5722; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .header .meta { font-size: 11px; color: #64748b; text-align: right; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; color: #0f172a; font-weight: 700; text-transform: uppercase; }
        tr:nth-child(even) { background: #f8fafc; }
        @media print {
          body { margin: 0; }
          @page { margin: 12mm; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h2>RUNO HRS INDIA</h2>
          <div style="font-size: 13px; font-weight: 600; color: #334155; margin-top: 2px;">${title}</div>
        </div>
        <div class="meta">
          <div>Printed On: ${new Date().toLocaleString()}</div>
          <div>Industrial Management Information System</div>
        </div>
      </div>
      ${clone.outerHTML}
      <script>
        window.onload = function() {
          window.focus();
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      </script>
    </body>
    </html>
  `);
  printWin.document.close();
};



