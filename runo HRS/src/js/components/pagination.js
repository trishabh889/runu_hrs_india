// ==========================================================================
// RUNO HRS INDIA - Shared Table Pagination Engine
// ==========================================================================
// Provides universal array pagination and footer rendering across all
// application tables with a standardized default size of 10 entries.

(function () {
  /**
   * Slices an array of items for the requested page and calculates boundary metrics.
   * @param {Array} items - The full array of records to paginate.
   * @param {number} currentPage - 1-indexed page number.
   * @param {number} pageSize - Number of entries per page (default 10).
   * @returns {Object} Sliced page items and pagination metadata.
   */
  function paginateArray(items, currentPage = 1, pageSize = 10) {
    const list = Array.isArray(items) ? items : [];
    const size = parseInt(pageSize, 10) || 10;
    const totalEntries = list.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / size));
    const validPage = Math.max(1, Math.min(parseInt(currentPage, 10) || 1, totalPages));
    const startIdx = (validPage - 1) * size;
    const endIdx = Math.min(startIdx + size, totalEntries);
    const pageItems = list.slice(startIdx, endIdx);

    return {
      pageItems,
      totalEntries,
      totalPages,
      validPage,
      startIdx,
      endIdx,
      pageSize: size
    };
  }

  /**
   * Helper to resolve element by ID or Element instance.
   */
  function getEl(target) {
    if (!target) return null;
    return typeof target === 'string' ? document.getElementById(target) : target;
  }

  /**
   * Renders the standardized pagination footer UI.
   * @param {Object} config - Configuration object.
   */
  function renderTablePagination(config) {
    if (!config) return;

    const infoEl = getEl(config.infoEl || config.infoId);
    const numbersEl = getEl(config.numbersEl || config.numbersId);
    const prevBtn = getEl(config.prevBtn || config.prevBtnId);
    const nextBtn = getEl(config.nextBtn || config.nextBtnId);
    const sizeSelectEl = getEl(config.sizeSelectEl || config.sizeSelectId);

    const totalEntries = config.totalEntries || 0;
    const currentPage = config.currentPage || 1;
    const totalPages = config.totalPages || 1;
    const startIdx = config.startIdx !== undefined ? config.startIdx : (currentPage - 1) * (config.pageSize || 10);
    const endIdx = config.endIdx !== undefined ? config.endIdx : Math.min(startIdx + (config.pageSize || 10), totalEntries);
    const pageSize = config.pageSize || 10;
    const onPageChange = typeof config.onPageChange === 'function' ? config.onPageChange : () => {};
    const onPageSizeChange = typeof config.onPageSizeChange === 'function' ? config.onPageSizeChange : () => {};

    // 1. Update Info Text
    if (infoEl) {
      if (totalEntries === 0) {
        infoEl.innerText = 'Showing 0 to 0 of 0 entries';
      } else {
        infoEl.innerText = `Showing ${startIdx + 1} to ${endIdx} of ${totalEntries} entries`;
      }
    }

    // 2. Configure Previous Button
    if (prevBtn) {
      prevBtn.disabled = currentPage <= 1;
      prevBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
          onPageChange(currentPage - 1);
        }
      };
    }

    // 3. Configure Next Button
    if (nextBtn) {
      nextBtn.disabled = currentPage >= totalPages;
      nextBtn.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      };
    }

    // 4. Render Numeric Page Buttons (Windowed for large page counts)
    if (numbersEl) {
      numbersEl.innerHTML = '';

      let startPage = 1;
      let endPage = totalPages;

      if (totalPages > 7) {
        if (currentPage <= 4) {
          startPage = 1;
          endPage = 5;
        } else if (currentPage >= totalPages - 3) {
          startPage = totalPages - 4;
          endPage = totalPages;
        } else {
          startPage = currentPage - 2;
          endPage = currentPage + 2;
        }
      }

      if (startPage > 1) {
        const firstBtn = createPageBtn(1, 1 === currentPage, onPageChange);
        numbersEl.appendChild(firstBtn);
        if (startPage > 2) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.innerText = '...';
          numbersEl.appendChild(ellipsis);
        }
      }

      for (let p = startPage; p <= endPage; p++) {
        const btn = createPageBtn(p, p === currentPage, onPageChange);
        numbersEl.appendChild(btn);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'pagination-ellipsis';
          ellipsis.innerText = '...';
          numbersEl.appendChild(ellipsis);
        }
        const lastBtn = createPageBtn(totalPages, totalPages === currentPage, onPageChange);
        numbersEl.appendChild(lastBtn);
      }
    }

    // 5. Configure Page Size Dropdown
    if (sizeSelectEl) {
      if (sizeSelectEl.value !== String(pageSize)) {
        sizeSelectEl.value = String(pageSize);
      }
      if (!sizeSelectEl._tsPageSizeBound) {
        sizeSelectEl._tsPageSizeBound = true;
        sizeSelectEl.addEventListener('change', (e) => {
          const newSize = parseInt(e.target.value, 10) || 10;
          onPageSizeChange(newSize);
        });
      }
    }
  }

  function createPageBtn(page, isActive, onPageChange) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn-page-num ${isActive ? 'active' : ''}`;
    btn.innerText = page;
    btn.setAttribute('data-page', page);
    btn.onclick = (e) => {
      e.preventDefault();
      if (!isActive) {
        onPageChange(page);
      }
    };
    return btn;
  }

  // Export functions globally
  window.paginateArray = paginateArray;
  window.renderTablePagination = renderTablePagination;
})();
