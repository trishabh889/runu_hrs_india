// ==========================================================================
// RUNO HRS INDIA - Purchase View Controller
// ==========================================================================

function initPurchase() {
  const search = document.getElementById('search-purchase');
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('#purchase-table-body tr').forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  document.getElementById('btn-add-purchase-order')?.addEventListener('click', () => {
    window.showToast('Purchase requisition workflow initialized. Supplier RFQ form ready.', 'info');
  });

  document.getElementById('btn-export-purchase-excel')?.addEventListener('click', () => {
    window.exportTableToExcel('purchase-table-body', 'Purchase_Procurement_Orders');
  });
}

function loadPurchase() {
  // Static/dynamic table refresh
}

window.initPurchase = initPurchase;
window.loadPurchase = loadPurchase;
