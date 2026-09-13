// ==========================================================================
// RUNO HRS MIS - Runtime Configuration & Supabase Environment Loader
// ==========================================================================

const fs = require('fs');
const path = require('path');

function loadConfigFile() {
  const possiblePaths = [
    path.join(process.cwd(), 'supabase.config.json'),
    path.join(__dirname, '..', 'supabase.config.json')
  ];

  for (const cfgPath of possiblePaths) {
    if (fs.existsSync(cfgPath)) {
      try {
        const raw = fs.readFileSync(cfgPath, 'utf8');
        return JSON.parse(raw);
      } catch (err) {
        console.warn('[CONFIG] Failed to parse', cfgPath, err.message);
      }
    }
  }
  return {};
}

function resolveConfig() {
  const fileConfig = loadConfigFile();

  const backend = (
    process.env.RUNO_DATA_BACKEND ||
    fileConfig.RUNO_DATA_BACKEND ||
    'local'
  ).toLowerCase();

  const supabaseUrl = (
    process.env.SUPABASE_URL ||
    fileConfig.SUPABASE_URL ||
    ''
  ).trim();

  const supabaseKey = (
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    fileConfig.SUPABASE_PUBLISHABLE_KEY ||
    fileConfig.SUPABASE_ANON_KEY ||
    ''
  ).trim();

  const isConfigured = Boolean(supabaseUrl && supabaseKey);

  if (backend === 'supabase' && !isConfigured) {
    console.warn(
      '[CONFIG WARNING] RUNO_DATA_BACKEND is set to "supabase" but SUPABASE_URL or SUPABASE_KEY is missing. Falling back to "local" mode.'
    );
  }

  return {
    backend: (backend === 'supabase' && isConfigured) ? 'supabase' : 'local',
    requestedBackend: backend,
    supabase: {
      url: supabaseUrl,
      key: supabaseKey,
      isConfigured
    },
    version: '1.0.0'
  };
}

const config = resolveConfig();

module.exports = {
  config,
  resolveConfig,
  isSupabaseConfigured: () => config.supabase.isConfigured
};
