// ==========================================================================
// RUNO HRS MIS - Import Local Data to Supabase Script (Idempotent)
// Usage: node scripts/migration/import-to-supabase.cjs [path-to-json]
// ==========================================================================

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { config } = require('../../runo HRS/config');
const customerMapper = require('../../runo HRS/db/mappers/customerMapper');
const projectMapper = require('../../runo HRS/db/mappers/projectMapper');
const storeMapper = require('../../runo HRS/db/mappers/storeMapper');
const accountsMapper = require('../../runo HRS/db/mappers/accountsMapper');
const mfgMapper = require('../../runo HRS/db/mappers/mfgMapper');

async function runImport() {
  const jsonArg = process.argv[2];
  let targetPath = jsonArg ? path.resolve(jsonArg) : path.join(__dirname, '..', '..', 'runo HRS', 'data', 'runo_mis_database.json');
  if (!fs.existsSync(targetPath)) {
    targetPath = path.join(__dirname, '..', '..', 'runo HRS', 'runo_mis_database.json');
  }

  if (!fs.existsSync(targetPath)) {
    console.error('[IMPORT ERROR] Database file not found:', targetPath);
    process.exit(1);
  }

  const { url, key, isConfigured } = config.supabase;
  if (!isConfigured) {
    console.error('[IMPORT ERROR] Supabase URL and KEY are not configured in environment or supabase.config.json');
    process.exit(1);
  }

  const client = createClient(url, key);
  console.log('[IMPORT] Connected to Supabase at:', url);
  console.log('[IMPORT] Reading source file:', targetPath);

  const raw = fs.readFileSync(targetPath, 'utf8');
  const data = JSON.parse(raw);

  // 1. Customers
  if (Array.isArray(data.customers) && data.customers.length > 0) {
    console.log(`[IMPORT] Upserting ${data.customers.length} customers...`);
    const payload = data.customers.map(customerMapper.toDatabase);
    const { error } = await client.from('customers').upsert(payload, { onConflict: 'id' });
    if (error) console.error('  ❌ Error upserting customers:', error.message);
    else console.log('  ✅ Customers successfully upserted.');
  }

  // 2. Projects
  if (Array.isArray(data.projects) && data.projects.length > 0) {
    console.log(`[IMPORT] Upserting ${data.projects.length} projects...`);
    const payload = data.projects.map(projectMapper.toDatabase);
    const { error } = await client.from('projects').upsert(payload, { onConflict: 'id' });
    if (error) console.error('  ❌ Error upserting projects:', error.message);
    else console.log('  ✅ Projects successfully upserted.');
  }

  // 3. Store Items
  if (Array.isArray(data.storeItems) && data.storeItems.length > 0) {
    console.log(`[IMPORT] Upserting ${data.storeItems.length} inventory items...`);
    const payload = data.storeItems.map(storeMapper.itemToDatabase);
    const { error } = await client.from('inventory_items').upsert(payload, { onConflict: 'code' });
    if (error) console.error('  ❌ Error upserting storeItems:', error.message);
    else console.log('  ✅ Inventory items successfully upserted.');
  }

  // 4. Store Transactions
  if (Array.isArray(data.storeTransactions) && data.storeTransactions.length > 0) {
    console.log(`[IMPORT] Upserting ${data.storeTransactions.length} store movements...`);
    const payload = data.storeTransactions.map(storeMapper.txToDatabase);
    const { error } = await client.from('stock_movements').upsert(payload, { onConflict: 'id' });
    if (error) console.error('  ❌ Error upserting storeTransactions:', error.message);
    else console.log('  ✅ Stock movements successfully upserted.');
  }

  // 5. Account Entries (Vouchers)
  if (Array.isArray(data.accountEntries) && data.accountEntries.length > 0) {
    console.log(`[IMPORT] Upserting ${data.accountEntries.length} vouchers...`);
    const payload = data.accountEntries.map(accountsMapper.toDatabase);
    const { error } = await client.from('vouchers').upsert(payload, { onConflict: 'id' });
    if (error) console.error('  ❌ Error upserting vouchers:', error.message);
    else console.log('  ✅ Vouchers successfully upserted.');
  }

  // 6. Manufacturing
  if (Array.isArray(data.manufacturing) && data.manufacturing.length > 0) {
    console.log(`[IMPORT] Upserting ${data.manufacturing.length} manufacturing jobs...`);
    const payload = data.manufacturing.map(mfgMapper.toDatabase);
    const { error } = await client.from('manufacturing_jobs').upsert(payload, { onConflict: 'id' });
    if (error) console.error('  ❌ Error upserting manufacturing:', error.message);
    else console.log('  ✅ Manufacturing jobs successfully upserted.');
  }

  // 7. Purchase Requests
  if (Array.isArray(data.purchaseRequests) && data.purchaseRequests.length > 0) {
    console.log(`[IMPORT] Upserting ${data.purchaseRequests.length} purchase requests...`);
    const payload = data.purchaseRequests.map(pr => ({
      id: pr.id,
      pr_number: pr.pr_no || `PR-${pr.sr || Date.now()}`,
      date: pr.date || new Date().toISOString().split('T')[0],
      project_code: pr.project_code || '',
      category: pr.category || 'HRS',
      item_name: pr.item_desc || '',
      qty: pr.qty || (pr.items && pr.items[0] ? pr.items[0].qty : 1),
      unit: pr.unit || 'NOS',
      supplier_vendor: pr.vendor || 'Local',
      estimated_cost: parseFloat(pr.estimated_cost || 0),
      status: pr.status || 'Pending',
      items: pr.items || []
    }));
    const { error } = await client.from('purchase_requests').upsert(payload, { onConflict: 'id' });
    if (error) console.error('  ❌ Error upserting purchaseRequests:', error.message);
    else console.log('  ✅ Purchase requests successfully upserted.');
  }

  console.log('[IMPORT] Finished importing data into Supabase.');
}

if (require.main === module) {
  runImport().catch(err => {
    console.error('[FATAL IMPORT EXCEPTION]', err);
    process.exit(1);
  });
}

module.exports = runImport;
