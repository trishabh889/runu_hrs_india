// ==========================================================================
// RUNO HRS INDIA - Theme (Dark Mode Only)
// ==========================================================================

function initTheme() {
  // Always dark — remove any previously stored light preference
  localStorage.removeItem('runo_mis_theme');
  document.documentElement.setAttribute('data-theme', 'dark');
}

// Apply immediately on script load to prevent any flash
document.documentElement.setAttribute('data-theme', 'dark');

window.initTheme = initTheme;
