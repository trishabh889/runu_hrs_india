// ==========================================================================
// RUNO HRS INDIA - Tom Select Dropdown Controller
// ==========================================================================
// Upgrades native <select> elements across the application into ultra-smooth,
// animated, searchable dropdowns matching the RUNO HRS Bluish Dark Mode theme
// (#0D213F / #0a1324 / #3B82F6).

(function () {
  // 1. Hook HTMLSelectElement.prototype.value so programmatic assignments
  // (e.g. selectEl.value = 'ALL' or selectEl.value = '') automatically sync
  if (!window._tomSelectValueHookInstalled) {
    window._tomSelectValueHookInstalled = true;
    const nativeSelectValueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    if (nativeSelectValueDesc && nativeSelectValueDesc.set) {
      Object.defineProperty(HTMLSelectElement.prototype, 'value', {
        get() {
          return nativeSelectValueDesc.get.call(this);
        },
        set(val) {
          nativeSelectValueDesc.set.call(this, val);
          if (this.tomselect && !this._tsSyncing && !this._tsInternalUpdate) {
            this._tsSyncing = true;
            try {
              this.tomselect.setValue(val !== undefined && val !== null ? String(val) : '', true);
            } catch (e) {
              // ignore sync errors during dynamic option updates
            }
            this._tsSyncing = false;
          }
        },
        configurable: true
      });
    }
  }

  // 2. Base Configuration for Tom Select
  const baseSelectConfig = {
    create: false,
    maxItems: 1,
    allowEmptyOption: true,
    closeAfterSelect: true,
    hideSelected: false,
    openOnFocus: true,
    selectOnTab: true,
    dropdownParent: 'body', // Appends dropdown to body to avoid overflow clipping issues in tables/cards
    render: {
      no_results: function (data, escape) {
        return '<div class="no-results">No matching options found</div>';
      }
    }
  };

  // 3. Known Target Selects Registry (Filter Bars across all views)
  const TARGET_FILTER_SELECTS = [
    // Commercial View
    'filter-comm-quote',
    'filter-comm-po',

    // Design View
    'filter-design-customer',
    'filter-design-hrs-type',
    'filter-design-designer',
    'filter-design-status',

    // Manufacturing View
    'mfg-filter-project',
    'mfg-filter-category',
    'mfg-filter-status',

    // Purchase View
    'filter-pr-project',
    'filter-pr-vendor',
    'filter-pr-status',

    // Sales View
    'filter-sales-category',
    'filter-sales-fy',

    // Completed View
    'filter-completed-month',
    'filter-completed-year',

    // Customers View
    'filter-cust-city',
    'filter-cust-state',
    'filter-cust-project-category',

    // Costing View
    'filter-costing-category',

    // Vendor View
    'filter-vendor-category',

    // Service View
    'filter-service-priority',

    // Assembly View
    'filter-assembly-bay',
    'filter-assembly-status'
  ];

  function initSelect(el) {
    if (!el || el.tomselect || el.classList.contains('no-tomselect')) return;

    try {
      const ts = new TomSelect(el, {
        ...baseSelectConfig,
        onChange: function (value) {
          el._tsSyncing = true;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el._tsSyncing = false;
        }
      });

      // Wrap updateOriginalInput so internal mutations are flagged
      const origUpdate = ts.updateOriginalInput;
      ts.updateOriginalInput = function (...args) {
        el._tsInternalUpdate = true;
        try {
          return origUpdate.apply(this, args);
        } finally {
          setTimeout(() => { el._tsInternalUpdate = false; }, 60);
        }
      };

      // Debounced observer for external option mutations (e.g. dynamic customer lists added by JS)
      if (window.MutationObserver && !el._tsObserverAttached) {
        el._tsObserverAttached = true;
        let syncTimer = null;
        const observer = new MutationObserver(() => {
          if (el._tsInternalUpdate || el._tsSyncing) return;
          if (el.tomselect) {
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => {
              if (el.tomselect && !el._tsInternalUpdate && !el._tsSyncing) {
                el._tsInternalUpdate = true;
                try {
                  el.tomselect.sync();
                } catch (e) {}
                setTimeout(() => { el._tsInternalUpdate = false; }, 60);
              }
            }, 35);
          }
        });
        observer.observe(el, { childList: true });
      }
    } catch (err) {
      console.warn('Failed to init TomSelect on', el.id || el, err);
    }
  }

  function initTomSelectDropdowns() {
    if (typeof TomSelect === 'undefined') {
      return;
    }

    // 1. Initialize registered filter selects
    TARGET_FILTER_SELECTS.forEach(id => {
      const el = document.getElementById(id);
      if (el) initSelect(el);
    });

    // 2. Initialize filter, modal and form selects
    const selectors = [
      'select.filter-select-compact:not(.tomselected)',
      'select.pr-filter-select:not(.tomselected)',
      'select.filter-item-select:not(.tomselected)',
      'select.mfg-select-filter:not(.tomselected)',
      'select.form-select:not(.tomselected)',
      '.modal-card select:not(.tomselected)',
      '.modal-body select:not(.tomselected)',
      '.form-group select:not(.tomselected)',
      '#new-project-view select:not(.tomselected)',
      '#subview-new-project select:not(.tomselected)',
      'select.login-input:not(.tomselected)'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach(el => {
      if (!el.classList.contains('page-size-select') && !el.classList.contains('no-tomselect')) {
        initSelect(el);
      }
    });
  }

  // Export globally
  window.initTomSelectDropdowns = initTomSelectDropdowns;

  // Helper to re-sync a specific dropdown after options change
  window.syncTomSelect = function (id) {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el && el.tomselect) {
      el.tomselect.sync();
    }
  };

  // Auto-init on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initTomSelectDropdowns, 250);
    });
  } else {
    setTimeout(initTomSelectDropdowns, 100);
  }
})();
