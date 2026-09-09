const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class StorageManager {
  constructor(filename = 'runo_mis_database.json') {
    const baseDir = app ? app.getPath('userData') : path.join(__dirname, '..', 'data');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    this.dbPath = path.join(baseDir, filename);
  }

  read() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const content = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(content);
      }
    } catch (err) {
      console.error('StorageManager read error:', err);
    }
    return null;
  }

  write(data) {
    try {
      const tempPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tempPath, this.dbPath);
      return true;
    } catch (err) {
      console.error('StorageManager write error:', err);
      return false;
    }
  }

  getFilePath() {
    return this.dbPath;
  }
}

module.exports = StorageManager;
