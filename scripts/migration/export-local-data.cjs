// ==========================================================================
// RUNO HRS MIS - Export Local JSON Database Script
// Usage: node scripts/migration/export-local-data.cjs
// ==========================================================================

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'runo HRS', 'runo_mis_database.json');
const BACKUP_DIR = path.join(__dirname, '..', '..', 'backups');

function getDatabaseData() {
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'runo HRS', 'data', 'runo_mis_database.json'),
    path.join(__dirname, '..', '..', 'runo HRS', 'runo_mis_database.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        console.log('[EXPORT] Found database file at:', p);
        return JSON.parse(raw);
      } catch (err) {
        console.warn('[EXPORT] Failed reading', p, err.message);
      }
    }
  }

  // Fallback to database coordinator
  console.log('[EXPORT] Loading database state from db coordinator...');
  const db = require('../../runo HRS/db');
  return db.data;
}

function exportLocalData() {
  const data = getDatabaseData();
  if (!data) {
    console.error('[EXPORT ERROR] Unable to load database data.');
    process.exit(1);
  }


  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const exportPath = path.join(BACKUP_DIR, `runo_export_${timestamp}.json`);

  fs.writeFileSync(exportPath, JSON.stringify(data, null, 2), 'utf8');

  console.log('---------------------------------------------------------');
  console.log('✅ Export successfully written to:', exportPath);
  console.log('   - Users:', (data.users || []).length);
  console.log('   - Customers:', (data.customers || []).length);
  console.log('   - Projects:', (data.projects || []).length);
  console.log('   - Manufacturing Jobs:', (data.manufacturing || []).length);
  console.log('   - Store Items:', (data.storeItems || []).length);
  console.log('   - Store Transactions:', (data.storeTransactions || []).length);
  console.log('   - Account Entries:', (data.accountEntries || []).length);
  console.log('   - Purchase Requests:', (data.purchaseRequests || []).length);
  console.log('---------------------------------------------------------');

  return exportPath;
}

if (require.main === module) {
  exportLocalData();
}

module.exports = exportLocalData;
