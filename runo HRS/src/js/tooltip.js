// ==========================================================================
// RUNO HRS INDIA - Global Custom Tooltip System
// Intercepts native HTML title attributes and renders high-fidelity dark tooltips
// ==========================================================================

(function() {
  let tooltipEl = null;
  let showTimer = null;
  let currentTarget = null;

  function createTooltipElement() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'runo-tooltip';
    document.body.appendChild(tooltipEl);
    return tooltipEl;
  }

  function hideTooltip() {
    if (showTimer) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    currentTarget = null;
    if (tooltipEl) {
      tooltipEl.classList.remove('active');
    }
  }

  function showTooltipFor(target) {
    if (!target) return;
    
    // Intercept native title to prevent OS default white tooltip
    if (target.hasAttribute('title')) {
      const titleVal = target.getAttribute('title');
      if (titleVal && titleVal.trim()) {
        target.setAttribute('data-tooltip', titleVal.trim());
      }
      target.removeAttribute('title');
    }

    const text = target.getAttribute('data-tooltip');
    if (!text || !text.trim()) {
      hideTooltip();
      return;
    }

    const tip = createTooltipElement();
    tip.textContent = text.trim();

    // Position tooltip
    const rect = target.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      hideTooltip();
      return;
    }

    // Measure
    tip.style.left = '0px';
    tip.style.top = '0px';
    tip.classList.remove('active', 'arrow-top', 'arrow-bottom');
    tip.style.visibility = 'hidden';
    tip.style.display = 'block';

    const tipWidth = tip.offsetWidth;
    const tipHeight = tip.offsetHeight;

    // Default: Top of element
    let top = rect.top - tipHeight - 8;
    let arrowClass = 'arrow-bottom';

    // If too close to window top, place below
    if (top < 8) {
      top = rect.bottom + 8;
      arrowClass = 'arrow-top';
    }

    // Horizontal centering
    let left = rect.left + (rect.width / 2) - (tipWidth / 2);
    // Boundary check
    left = Math.max(8, Math.min(window.innerWidth - tipWidth - 8, left));

    // Calculate arrow position relative to tooltip box
    const arrowX = Math.max(10, Math.min(tipWidth - 10, (rect.left + rect.width / 2) - left));
    tip.style.setProperty('--arrow-x', `${arrowX}px`);

    tip.style.top = `${Math.round(top)}px`;
    tip.style.left = `${Math.round(left)}px`;
    tip.style.visibility = '';
    tip.classList.add(arrowClass);
    tip.classList.add('active');
  }

  // Pre-process any titles on hover immediately
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[title], [data-tooltip]');
    if (!target) {
      hideTooltip();
      return;
    }

    // Strip title immediately so OS tooltip never triggers
    if (target.hasAttribute('title')) {
      const titleVal = target.getAttribute('title');
      if (titleVal && titleVal.trim()) {
        target.setAttribute('data-tooltip', titleVal.trim());
      }
      target.removeAttribute('title');
    }

    if (target === currentTarget) return;
    currentTarget = target;

    if (showTimer) clearTimeout(showTimer);
    // Snappy, subtle delay (80ms)
    showTimer = setTimeout(() => {
      if (currentTarget === target) {
        showTooltipFor(target);
      }
    }, 80);
  }, true);

  document.addEventListener('mouseout', (e) => {
    const fromEl = e.target.closest('[data-tooltip]');
    const toEl = e.relatedTarget ? e.relatedTarget.closest('[data-tooltip]') : null;
    if (fromEl && fromEl !== toEl) {
      hideTooltip();
    }
  }, true);

  window.addEventListener('scroll', hideTooltip, true);
  document.addEventListener('click', hideTooltip, true);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
  });

  // MutationObserver to sanitize dynamically injected titles
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.hasAttribute && node.hasAttribute('title')) {
              const val = node.getAttribute('title');
              if (val && val.trim()) node.setAttribute('data-tooltip', val.trim());
              node.removeAttribute('title');
            }
            const titledChildren = node.querySelectorAll ? node.querySelectorAll('[title]') : [];
            titledChildren.forEach((child) => {
              const val = child.getAttribute('title');
              if (val && val.trim()) child.setAttribute('data-tooltip', val.trim());
              child.removeAttribute('title');
            });
          }
        });
      } else if (m.type === 'attributes' && m.attributeName === 'title') {
        const el = m.target;
        if (el.hasAttribute('title')) {
          const val = el.getAttribute('title');
          if (val && val.trim()) el.setAttribute('data-tooltip', val.trim());
          el.removeAttribute('title');
        }
      }
    }
  });

  function sanitizeAllTitles() {
    document.querySelectorAll('[title]').forEach((el) => {
      const val = el.getAttribute('title');
      if (val && val.trim()) el.setAttribute('data-tooltip', val.trim());
      el.removeAttribute('title');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      sanitizeAllTitles();
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });
    });
  } else {
    sanitizeAllTitles();
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['title'] });
  }

  window.hideRunoTooltip = hideTooltip;
})();
