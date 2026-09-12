// ==========================================================================
// RUNO HRS INDIA - Centralized Error Logger
// Logs all crashes, IPC failures & renderer errors to: elog.txt
// Max size: 2MB — auto-rotates to elog.backup.txt when full
// ==========================================================================

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const logBaseDir  = (process.env.RUNO_TEST_MODE === '1' && process.env.RUNO_TEST_ROOT) ? process.env.RUNO_TEST_ROOT : __dirname;
const LOG_FILE    = path.join(logBaseDir, 'elog.txt');
const BACKUP_FILE = path.join(logBaseDir, 'elog.backup.txt');
const MAX_BYTES   = 2 * 1024 * 1024; // 2 MB

// ── Helpers ─────────────────────────────────────────────────────────────────

function timestamp() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
}

function rotate() {
  try {
    if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size >= MAX_BYTES) {
      fs.copyFileSync(LOG_FILE, BACKUP_FILE);
      fs.writeFileSync(LOG_FILE, '', 'utf8');
    }
  } catch (_) {}
}

function write(level, category, message, extra) {
  rotate();
  const extraStr = extra ? '\n    ' + (typeof extra === 'string' ? extra : JSON.stringify(extra, null, 2)).replace(/\n/g, '\n    ') : '';
  const line = `[${timestamp()}] [${level.padEnd(7)}] [${category}] ${message}${extraStr}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (_) {}
}

// ── Public API ───────────────────────────────────────────────────────────────

const logger = {

  // Generic log levels
  info:  (category, msg, extra) => write('INFO',    category, msg, extra),
  warn:  (category, msg, extra) => write('WARN',    category, msg, extra),
  error: (category, msg, extra) => write('ERROR',   category, msg, extra),
  fatal: (category, msg, extra) => write('FATAL',   category, msg, extra),

  // ── Application lifecycle ─────────────────────────────────────────────────
  appStart() {
    write('INFO', 'STARTUP', `RUNO HRS MIS started — Node ${process.version}, Electron ${process.versions.electron || 'n/a'}, OS: ${os.platform()} ${os.release()}`);
  },

  appQuit(code) {
    write('INFO', 'SHUTDOWN', `Application exited with code ${code}`);
  },

  // ── Window / Renderer ─────────────────────────────────────────────────────
  windowCreated()   { write('INFO',  'WINDOW',   'Main window created'); },
  windowLoaded()    { write('INFO',  'WINDOW',   'index.html loaded OK'); },
  windowLoadFail(errCode, desc, url) {
    write('ERROR', 'WINDOW', `Page failed to load — code: ${errCode} | ${desc}`, url);
  },
  rendererCrash(reason, exitCode) {
    write('FATAL', 'RENDERER', `Renderer process gone — reason: ${reason} | exitCode: ${exitCode}`);
  },
  rendererUnresponsive() {
    write('WARN',  'RENDERER', 'Renderer became unresponsive');
  },
  rendererConsoleError(message, sourceId, line) {
    write('ERROR', 'RENDERER', `JS Error: ${message}`, `${sourceId}:${line}`);
  },
  rendererConsoleWarn(message, sourceId, line) {
    write('WARN',  'RENDERER', `JS Warning: ${message}`, `${sourceId}:${line}`);
  },

  // ── IPC Endpoint Failures ─────────────────────────────────────────────────
  ipcError(channel, error) {
    const msg = error instanceof Error ? `${error.message}\n${error.stack}` : String(error);
    write('ERROR', 'IPC', `Handler failed — channel: ${channel}`, msg);
  },

  // ── Database ──────────────────────────────────────────────────────────────
  dbError(operation, error) {
    const msg = error instanceof Error ? `${error.message}\n${error.stack}` : String(error);
    write('ERROR', 'DATABASE', `DB error — op: ${operation}`, msg);
  },

  // ── Main process uncaught errors ──────────────────────────────────────────
  uncaughtException(err) {
    write('FATAL', 'MAIN', `Uncaught Exception: ${err.message}`, err.stack);
  },
  unhandledRejection(reason) {
    const msg = reason instanceof Error ? `${reason.message}\n${reason.stack}` : String(reason);
    write('FATAL', 'MAIN', 'Unhandled Promise Rejection', msg);
  },

  // ── Convenience: wrap an entire handler registry with auto-logging ────────
  /**
   * Wraps all ipcMain.handle() calls so any thrown error is automatically
   * logged. Pass the ipcMain instance and a map of { channel: handlerFn }.
   */
  wrapHandlers(ipcMain, handlers) {
    Object.entries(handlers).forEach(([channel, fn]) => {
      ipcMain.handle(channel, async (event, ...args) => {
        try {
          return await fn(event, ...args);
        } catch (err) {
          logger.ipcError(channel, err);
          return { success: false, error: err.message || 'Internal error' };
        }
      });
    });
  },

  // Log file path (so renderer/other modules can read it if needed)
  logPath:    LOG_FILE,
  backupPath: BACKUP_FILE,
};

module.exports = logger;
