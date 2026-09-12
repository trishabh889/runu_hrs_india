// ==========================================================================
// RUNO HRS INDIA - Flatpickr Calendar Date Picker Controller
// ==========================================================================
// Provides modern, sleek dark-themed calendar date pickers across all views,
// replacing browser native dd/mm/yyyy pickers.

(function () {
  // 1. Hook HTMLInputElement.prototype.value so programmatic resets & assignments
  // (e.g. dateEl.value = '' or dateEl.value = '2026-03-01') automatically sync with Flatpickr
  if (!window._flatpickrValueHookInstalled) {
    window._flatpickrValueHookInstalled = true;
    const nativeValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (nativeValueDesc && nativeValueDesc.set) {
      Object.defineProperty(HTMLInputElement.prototype, 'value', {
        get() {
          return nativeValueDesc.get.call(this);
        },
        set(val) {
          nativeValueDesc.set.call(this, val);
          if (this._flatpickr && !this._fpSyncing) {
            this._fpSyncing = true;
            try {
              if (!val) {
                this._flatpickr.clear();
              } else {
                this._flatpickr.setDate(val, false);
              }
            } catch (e) {
              // ignore parse errors during initialization
            }
            this._fpSyncing = false;
          }
        },
        configurable: true
      });
    }
  }

  // 2. Base Configuration for Flatpickr in RUNO Dark Theme
  const basePickerConfig = {
    theme: 'dark',
    dateFormat: 'Y-m-d',         // Internal DB standard format (YYYY-MM-DD)
    altInput: true,               // User-friendly visible input
    altFormat: 'd M Y',           // Elegant presentation (e.g. "13 Sep 2026")
    altInputClass: 'runo-date-input flatpickr-alt-input',
    allowInput: false,            // Prevents manual typing errors, encourages calendar select
    animate: true,
    disableMobile: true,          // Always use custom dark theme, avoid mobile native popups
    monthSelectorType: 'dropdown',
    prevArrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
    nextArrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
    onReady: function (selectedDates, dateStr, instance) {
      if (instance.altInput) {
        instance.altInput.classList.add('runo-date-input');
        instance.altInput.setAttribute('readonly', 'readonly');
        if (instance.input && instance.input.placeholder) {
          instance.altInput.placeholder = instance.input.placeholder;
        }
      }
    }
  };

  // 3. Known Date Inputs registry
  const TARGET_INPUTS = [
    // Commercial Filter Dates
    { id: 'filter-comm-date-start', placeholder: '📅 Start Date' },
    { id: 'filter-comm-date-end', placeholder: '📅 End Date' },

    // Design Filter Dates
    { id: 'filter-date-start', placeholder: '📅 Start Date' },
    { id: 'filter-date-end', placeholder: '📅 End Date' },

    // Manufacturing Filter Dates
    { id: 'mfg-filter-start', placeholder: '📅 Start Date' },
    { id: 'mfg-filter-end', placeholder: '📅 End Date' },

    // Projects Filter Dates
    { id: 'filter-projects-start', placeholder: '📅 Start Date' },
    { id: 'filter-projects-end', placeholder: '📅 End Date' },

    // Purchase Filter Dates
    { id: 'filter-pr-start', placeholder: '📅 Start Date' },
    { id: 'filter-pr-end', placeholder: '📅 End Date' },

    // Sales Filter Dates
    { id: 'filter-sales-start', placeholder: '📅 Start Date' },
    { id: 'filter-sales-end', placeholder: '📅 End Date' },

    // Form & Modal Dates
    { id: 'newproj-date', placeholder: '📅 Select Target Date' },
    { id: 'modal-proj-date', placeholder: '📅 Select Target Date' },
    { id: 'mfg-form-start-date', placeholder: '📅 Start Date' },
    { id: 'mfg-form-end-date', placeholder: '📅 End Date' },
    { id: 'mfg-form-target-date', placeholder: '📅 Target Date' },
    { id: 'acc-entry-date', placeholder: '📅 Entry Date' },
    { id: 'st-tx-date', placeholder: '📅 Select Date' },
    { id: 'pr-required-date', placeholder: '📅 Select Required Date' }
  ];

  function initInput(el, placeholder) {
    if (!el || el._flatpickr) return;
    if (el.id === 'modal-proj-date') return;

    if (placeholder && !el.placeholder) {
      el.placeholder = placeholder;
    }

    const instance = flatpickr(el, {
      ...basePickerConfig,
      placeholder: el.placeholder || placeholder || '📅 Select Date',
      onChange: function (selectedDates, dateStr) {
        el._fpSyncing = true;
        el.value = dateStr;
        el._fpSyncing = false;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    if (instance && instance.altInput) {
      instance.altInput.placeholder = el.placeholder || placeholder || '📅 Select Date';
      instance.altInput.title = el.title || el.placeholder || '';
    }
  }

  function initFlatpickrDates() {
    if (typeof flatpickr === 'undefined') {
      return;
    }

    // 1. Initialize registered targets
    TARGET_INPUTS.forEach(({ id, placeholder }) => {
      const el = document.getElementById(id);
      if (el) initInput(el, placeholder);
    });

    // 2. Initialize any other inputs marked with .runo-date-input
    document.querySelectorAll('input.runo-date-input:not([data-fp-initialized])').forEach(el => {
      if (el.classList.contains('flatpickr-alt-input')) return;
      el.setAttribute('data-fp-initialized', 'true');
      initInput(el, el.placeholder || '📅 Select Date');
    });

    // 3. Attach clear handlers to all known Reset buttons
    bindResetButtons();
  }

  function bindResetButtons() {
    const resetBindings = [
      {
        btnId: 'btn-comm-filter-reset',
        inputs: ['filter-comm-date-start', 'filter-comm-date-end']
      },
      {
        btnId: 'btn-design-reset',
        inputs: ['filter-date-start', 'filter-date-end']
      },
      {
        btnId: 'btn-mfg-reset-filter',
        inputs: ['mfg-filter-start', 'mfg-filter-end']
      },
      {
        btnId: 'btn-projects-filter-reset',
        inputs: ['filter-projects-start', 'filter-projects-end']
      },
      {
        btnId: 'btn-pr-filter-reset',
        inputs: ['filter-pr-start', 'filter-pr-end']
      },
      {
        btnId: 'btn-sales-filter-reset',
        inputs: ['filter-sales-start', 'filter-sales-end']
      }
    ];

    resetBindings.forEach(({ btnId, inputs }) => {
      const btn = document.getElementById(btnId);
      if (!btn || btn._fpResetBound) return;
      btn._fpResetBound = true;
      btn.addEventListener('click', () => {
        inputs.forEach(id => {
          const el = document.getElementById(id);
          if (el && el._flatpickr) {
            el._flatpickr.clear();
          }
        });
      });
    });
  }

  // Export globally
  window.initFlatpickrDates = initFlatpickrDates;

  // Auto-init when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initFlatpickrDates, 200);
    });
  } else {
    setTimeout(initFlatpickrDates, 100);
  }
})();
