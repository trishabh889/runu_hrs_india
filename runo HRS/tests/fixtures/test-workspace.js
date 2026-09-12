// ==========================================================================
// RUNO HRS MIS - Ephemeral Test Workspace Allocator
// Guarantees zero pollution of production storage and profile
// ==========================================================================

const fs = require('fs');
const path = require('path');
const os = require('os');

class TestWorkspace {
  constructor(tag = 'test') {
    const rnd = Math.random().toString(36).substring(2, 8);
    const folderName = `runo-test-${tag}-${Date.now()}-${rnd}`;
    this.dir = path.join(os.tmpdir(), folderName);
    this.userData = path.join(this.dir, 'userData');
    this.markerPath = path.join(this.dir, '.runo-test-workspace');
    this.init();
  }

  init() {
    fs.mkdirSync(this.dir, { recursive: true });
    fs.mkdirSync(this.userData, { recursive: true });
    fs.writeFileSync(this.markerPath, JSON.stringify({
      created_at: new Date().toISOString(),
      pid: process.pid
    }), 'utf8');
  }

  getDbPath() {
    return path.join(this.userData, 'runo_mis_database.json');
  }

  getLogPath() {
    return path.join(this.dir, 'elog.txt');
  }

  cleanup() {
    try {
      if (fs.existsSync(this.markerPath)) {
        fs.rmSync(this.dir, { recursive: true, force: true });
      }
    } catch (err) {
      // Deferred cleanup on lock
    }
  }
}

module.exports = TestWorkspace;
