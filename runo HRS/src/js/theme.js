// ==========================================================================
// RUNO HRS INDIA - Theme Management (Light & Dark Mode)
// ==========================================================================

const THEME_STORAGE_KEY = 'runo_mis_theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const iconEl = document.getElementById('theme-icon');
  const textEl = document.getElementById('theme-text');

  if (iconEl && textEl) {
    if (theme === 'light') {
      iconEl.innerText = '☀️';
      textEl.innerText = 'LIGHT';
    } else {
      iconEl.innerText = '🌙';
      textEl.innerText = 'DARK';
    }
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  if (window.showToast) {
    window.showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
  }
}

function initTheme() {
  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  const toggleBtn = document.getElementById('btn-theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
}

// Immediately apply stored theme to avoid visual flicker
applyTheme(getStoredTheme());

window.initTheme = initTheme;
window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;
