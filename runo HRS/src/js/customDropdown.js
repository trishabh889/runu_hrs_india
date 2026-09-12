// ==========================================================================
// RUNO HRS INDIA - Unified Custom Dropdown Engine
// ==========================================================================
// Replaces native <select> elements across the entire application with
// high-performance, dark-mode custom dropdowns matching the Dashboard
// Overview Financial Year Dropdown (media_1789247801060.png).

(function () {
  'use strict';

  // 1. Hook HTMLSelectElement.prototype.value setter to automatically sync
  // programmatic assignments (e.g. selectEl.value = 'ALL')
  if (!window._customDropdownValueHookInstalled) {
    window._customDropdownValueHookInstalled = true;
    const nativeSelectValueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    if (nativeSelectValueDesc && nativeSelectValueDesc.set) {
      Object.defineProperty(HTMLSelectElement.prototype, 'value', {
        get() {
          return nativeSelectValueDesc.get.call(this);
        },
        set(val) {
          nativeSelectValueDesc.set.call(this, val);
          if (this._customDropdownSync && !this._customDropdownSyncing) {
            this._customDropdownSyncing = true;
            try {
              this._customDropdownSync();
            } catch (e) {}
            this._customDropdownSyncing = false;
          }
        },
        configurable: true
      });
    }
  }

  // 2. Selectors to identify selects to upgrade
  const UPGRADE_SELECTORS = [
    // Registered View Filter Selects
    '#filter-comm-quote',
    '#filter-comm-po',
    '#filter-design-customer',
    '#filter-design-hrs-type',
    '#filter-design-designer',
    '#filter-design-status',
    '#design-page-size',
    '#mfg-filter-project',
    '#mfg-filter-category',
    '#mfg-filter-status',
    '#filter-pr-project',
    '#filter-pr-vendor',
    '#filter-pr-status',
    '#filter-sales-category',
    '#filter-sales-fy',
    '#filter-completed-month',
    '#filter-completed-year',
    '#filter-cust-city',
    '#filter-cust-state',
    '#filter-cust-project-category',
    '#filter-costing-category',
    '#filter-vendor-category',
    '#filter-service-priority',
    '#filter-assembly-bay',
    '#filter-assembly-status',
    // Class-based Selects
    'select.filter-select-compact',
    'select.pr-filter-select',
    'select.filter-item-select',
    'select.mfg-select-filter',
    'select.form-select',
    'select.page-size-select',
    'select.login-input',
    // Modals and New Project
    '.modal-card select',
    '.modal-body select',
    '.form-group select',
    '#new-project-view select',
    '#subview-new-project select'
  ];

  // 3. Upgrade single <select> into a .custom-dropdown component
  function upgradeSelect(selectEl) {
    if (!selectEl) return;
    if (selectEl._customDropdownConverted || selectEl.dataset.customDropdownReady) return;
    if (selectEl.classList.contains('no-custom-dropdown') ||
        selectEl.classList.contains('comm-cell-select') ||
        selectEl.classList.contains('table-cell-select')) {
      return;
    }

    selectEl._customDropdownConverted = true;
    selectEl.dataset.customDropdownReady = 'true';
    selectEl.classList.add('custom-dropdown-native-hidden');
    selectEl.tabIndex = -1;
    selectEl.setAttribute('aria-hidden', 'true');

    // Create wrapper matching .custom-dropdown
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-dropdown';
    if (selectEl.id) wrapper.dataset.forSelect = selectEl.id;

    // Preserve contextual sizing classes
    if (selectEl.classList.contains('page-size-select')) {
      wrapper.classList.add('custom-dropdown-page-size');
    }
    if (selectEl.classList.contains('filter-select-compact') ||
        selectEl.classList.contains('filter-item-select') ||
        selectEl.classList.contains('pr-filter-select') ||
        selectEl.classList.contains('mfg-select-filter')) {
      wrapper.classList.add('custom-dropdown-filter');
    }

    // Trigger button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'custom-dropdown-btn';

    const label = document.createElement('span');
    label.className = 'custom-dropdown-label';

    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('class', 'custom-dropdown-arrow');
    arrowSvg.setAttribute('width', '12');
    arrowSvg.setAttribute('height', '12');
    arrowSvg.setAttribute('viewBox', '0 0 24 24');
    arrowSvg.innerHTML = '<path fill="currentColor" d="M7 10l5 5 5-5z"/>';

    btn.appendChild(label);
    btn.appendChild(arrowSvg);
    wrapper.appendChild(btn);

    // Dropdown menu
    const menu = document.createElement('div');
    menu.className = 'custom-dropdown-menu';
    wrapper.appendChild(menu);

    // Insert wrapper right after native select
    selectEl.insertAdjacentElement('afterend', wrapper);

    // Build options list
    function buildOptions() {
      menu.innerHTML = '';
      const options = Array.from(selectEl.options);
      let activeText = '';
      const curVal = selectEl.value;

      // Optional search box if more than 8 options
      if (options.length > 8) {
        const searchBox = document.createElement('div');
        searchBox.className = 'custom-dropdown-search-box';
        searchBox.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#64748B" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" class="custom-dropdown-search-input" placeholder="Search options..." autocomplete="off">
        `;
        const searchInput = searchBox.querySelector('input');
        searchInput.addEventListener('click', e => e.stopPropagation());
        searchInput.addEventListener('input', e => {
          const q = e.target.value.trim().toLowerCase();
          menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
            const txt = (item.dataset.searchText || '').toLowerCase();
            item.style.display = txt.includes(q) ? 'flex' : 'none';
          });
        });
        menu.appendChild(searchBox);
      }

      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'custom-dropdown-items-container';

      options.forEach(opt => {
        const item = document.createElement('div');
        const isMatch = opt.value === curVal || (!curVal && opt.selected);
        item.className = 'custom-dropdown-item' + (isMatch ? ' active' : '');
        item.dataset.value = opt.value;
        item.dataset.searchText = opt.text;

        item.innerHTML = `
          <span>${opt.text}</span>
          <svg class="check-icon" width="13" height="13" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        `;

        if (isMatch) {
          activeText = opt.text;
        }

        item.addEventListener('click', e => {
          e.stopPropagation();
          const newVal = opt.value;
          const newText = opt.text;

          itemsContainer.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          label.textContent = newText;
          label.title = newText;

          if (selectEl.value !== newVal) {
            selectEl._customDropdownSyncing = true;
            selectEl.value = newVal;
            selectEl._customDropdownSyncing = false;
            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
            selectEl.dispatchEvent(new Event('input', { bubbles: true }));
          }

          closeDropdown();
          btn.focus();
        });

        itemsContainer.appendChild(item);
      });

      menu.appendChild(itemsContainer);

      // Default label if not found
      if (!activeText) {
        const firstOpt = options[0];
        activeText = firstOpt ? firstOpt.text : (curVal || 'ALL');
      }
      label.textContent = activeText;
      label.title = activeText;
    }

    // Sync selected state from native select.value
    function syncSelected() {
      const val = selectEl.value;
      let matchedText = '';
      menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
        if (item.dataset.value === val) {
          item.classList.add('active');
          matchedText = item.querySelector('span')?.textContent || item.textContent;
        } else {
          item.classList.remove('active');
        }
      });

      if (matchedText) {
        label.textContent = matchedText;
        label.title = matchedText;
      } else {
        const opt = selectEl.querySelector(`option[value="${val}"]`);
        if (opt) {
          label.textContent = opt.text;
          label.title = opt.text;
        }
      }
    }

    function openDropdown() {
      document.querySelectorAll('.custom-dropdown.open').forEach(d => {
        if (d !== wrapper) d.classList.remove('open');
      });

      wrapper.classList.add('open');

      const searchInput = menu.querySelector('.custom-dropdown-search-input');
      if (searchInput) {
        searchInput.value = '';
        menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.style.display = 'flex');
        setTimeout(() => searchInput.focus(), 60);
      }

      // Check viewport collision
      const rect = menu.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 15 && rect.top > rect.height) {
        wrapper.classList.add('dropdown-flip-up');
      } else {
        wrapper.classList.remove('dropdown-flip-up');
      }
    }

    function closeDropdown() {
      wrapper.classList.remove('open');
      wrapper.classList.remove('dropdown-flip-up');
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (wrapper.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Attach hooks to selectEl
    selectEl._customDropdownSync = syncSelected;
    selectEl._customDropdownRebuild = buildOptions;

    // React to native change event
    selectEl.addEventListener('change', () => {
      syncSelected();
    });

    // Observe dynamic changes to <option> children
    const observer = new MutationObserver(() => {
      buildOptions();
    });
    observer.observe(selectEl, { childList: true });

    // Initial build
    buildOptions();
  }

  // 4. Initialize pre-existing .custom-dropdown elements (like in dashboard.html & projects.html)
  function initPreExistingDropdowns() {
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
      if (dropdown.dataset.preExistingInit) return;
      // Skip if generated by upgradeSelect
      if (dropdown.dataset.forSelect) return;
      dropdown.dataset.preExistingInit = 'true';

      const btn = dropdown.querySelector('.custom-dropdown-btn');
      const label = dropdown.querySelector('.custom-dropdown-label');
      const hiddenInput = dropdown.querySelector('input[type="hidden"]');
      const menu = dropdown.querySelector('.custom-dropdown-menu');
      if (!btn || !menu) return;

      btn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.custom-dropdown.open').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        if (isOpen) {
          dropdown.classList.remove('open');
          dropdown.classList.remove('dropdown-flip-up');
        } else {
          dropdown.classList.add('open');
          const rect = menu.getBoundingClientRect();
          if (rect.bottom > window.innerHeight - 15 && rect.top > rect.height) {
            dropdown.classList.add('dropdown-flip-up');
          } else {
            dropdown.classList.remove('dropdown-flip-up');
          }
        }
      });

      menu.querySelectorAll('.custom-dropdown-item').forEach(item => {
        if (item._itemBound) return;
        item._itemBound = true;
        item.addEventListener('click', e => {
          e.stopPropagation();
          const val = item.dataset.value;
          const text = item.querySelector('span') ? item.querySelector('span').textContent : item.textContent;

          menu.querySelectorAll('.custom-dropdown-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          if (label) {
            label.textContent = text;
            label.title = text;
          }
          if (hiddenInput) {
            hiddenInput.value = val;
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
            hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          dropdown.classList.remove('open');
          dropdown.classList.remove('dropdown-flip-up');
        });
      });
    });
  }

  // 5. Main Initialization Function
  function initAllDropdowns() {
    // A. Upgrade registered and matching native selects
    const selectorStr = UPGRADE_SELECTORS.join(', ');
    document.querySelectorAll(selectorStr).forEach(el => {
      upgradeSelect(el);
    });

    // B. Handle pre-existing custom dropdowns (dashboard / projects)
    initPreExistingDropdowns();
  }

  // 6. Global outside click & Escape listeners
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown.open').forEach(d => {
      d.classList.remove('open');
      d.classList.remove('dropdown-flip-up');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.classList.remove('dropdown-flip-up');
      });
    }
  });

  // 7. Global Exports
  window.initCustomDropdowns = initAllDropdowns;
  window.initTomSelectDropdowns = initAllDropdowns; // Compatibility alias

  window.syncCustomDropdown = function (idOrEl) {
    const el = typeof idOrEl === 'string' ? document.getElementById(idOrEl) : idOrEl;
    if (el) {
      if (el._customDropdownRebuild) el._customDropdownRebuild();
      else if (el._customDropdownSync) el._customDropdownSync();
    }
  };
  window.syncTomSelect = window.syncCustomDropdown; // Compatibility alias

  // 8. Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initAllDropdowns, 200);
    });
  } else {
    setTimeout(initAllDropdowns, 80);
  }
})();

