// ==========================================================================
// RUNO HRS MIS - Store Inventory Data Mapper
// ==========================================================================

function itemToDomain(row) {
  if (!row) return null;
  return {
    id: row.id,
    code: row.code || '',
    name: row.name || '',
    category: row.category || 'GENERAL',
    unit: row.unit || 'NOS',
    minStock: String(row.min_stock !== undefined ? row.min_stock : row.minStock || 5),
    maxStock: String(row.max_stock !== undefined ? row.max_stock : row.maxStock || 50),
    location: row.location || '',
    active: row.active || 'YES'
  };
}

function itemToDatabase(data) {
  if (!data) return {};
  const payload = {
    code: (data.code || '').trim(),
    name: (data.name || '').trim(),
    category: data.category || 'GENERAL',
    unit: data.unit || 'NOS',
    min_stock: parseInt(data.minStock || data.min_stock || 0, 10),
    max_stock: parseInt(data.maxStock || data.max_stock || 0, 10),
    location: (data.location || '').trim(),
    active: data.active || 'YES'
  };
  if (data.id) payload.id = data.id;
  return payload;
}

function txToDomain(row) {
  if (!row) return null;
  return {
    id: row.id,
    date: row.date || new Date().toISOString().split('T')[0],
    tabType: row.tab_type || row.tabType || 'STOCK IN',
    refNo: row.ref_no || row.refNo || '',
    itemCode: row.item_code || row.itemCode || '',
    itemName: row.item_name || row.itemName || '',
    partyOrDept: row.party_or_dept || row.partyOrDept || '',
    qty: String(row.qty || 0),
    unit: row.unit || 'NOS',
    location: row.location || '',
    status: row.status || 'COMPLETED'
  };
}

function txToDatabase(data) {
  if (!data) return {};
  const payload = {
    date: data.date || new Date().toISOString().split('T')[0],
    tab_type: data.tabType || data.tab_type || 'STOCK IN',
    ref_no: (data.refNo || data.ref_no || '').trim(),
    item_code: (data.itemCode || data.item_code || '').trim(),
    item_name: (data.itemName || data.item_name || '').trim(),
    party_or_dept: (data.partyOrDept || data.party_or_dept || '').trim(),
    qty: parseInt(data.qty || 0, 10),
    unit: data.unit || 'NOS',
    location: (data.location || '').trim(),
    status: data.status || 'COMPLETED'
  };
  if (data.id) payload.id = data.id;
  return payload;
}

module.exports = {
  itemToDomain,
  itemToDatabase,
  txToDomain,
  txToDatabase
};
