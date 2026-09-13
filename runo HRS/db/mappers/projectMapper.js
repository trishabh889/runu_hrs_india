// ==========================================================================
// RUNO HRS MIS - Project Data Mapper (Supabase <-> UI Contract)
// ==========================================================================

function toDomain(row) {
  if (!row) return null;
  return {
    id: row.id,
    project_code: row.project_code || '',
    customer_id: row.customer_id || '',
    customer_name: row.customer_name || '',
    part_name: row.part_name || row.mould_description || '',
    mould_description: row.mould_description || row.part_name || '',
    manifold_type: row.manifold_type || '',
    num_drops: String(row.num_drops || row.nozzle_count || 1),
    nozzle_count: parseInt(row.nozzle_count || row.num_drops || 1, 10),
    category: row.category || 'HRS',
    section: row.section || 'HOT RUNNER SYSTEM',
    status: row.status || 'ACTIVE',
    quote_status: row.quote_status || 'PENDING',
    po_received: row.po_received || 'NO',
    order_value: parseFloat(row.order_value || 0),
    value: row.value || (row.order_value ? `₹ ${row.order_value}` : ''),
    cost: row.cost || String(row.order_value || ''),
    order_date: row.order_date || '',
    target_date: row.target_date || row.delivery_date || '',
    delivery_date: row.delivery_date || row.target_date || '',
    owner: row.owner || 'VIKRAM',
    id_card_no: row.id_card_no || '',
    material: row.material || '',
    nozzle_series: row.nozzle_series || '',
    gate_type: row.gate_type || '',
    connector: row.connector || '',
    hrs_type: row.hrs_type || '',
    workflow_milestones: row.workflow_milestones || {},
    created_at: row.created_at || new Date().toISOString().split('T')[0],
    created_by: row.created_by || 'ANAND'
  };
}

function toDatabase(data) {
  if (!data) return {};
  const payload = {
    project_code: (data.project_code || '').trim(),
    customer_id: data.customer_id || null,
    customer_name: (data.customer_name || '').trim(),
    part_name: (data.part_name || data.mould_description || '').trim(),
    mould_description: (data.mould_description || data.part_name || '').trim(),
    manifold_type: (data.manifold_type || '').trim(),
    num_drops: String(data.num_drops || data.nozzle_count || 1),
    nozzle_count: parseInt(data.nozzle_count || data.num_drops || 1, 10),
    category: data.category || 'HRS',
    section: data.section || 'HOT RUNNER SYSTEM',
    status: data.status || 'ACTIVE',
    quote_status: data.quote_status || 'PENDING',
    po_received: data.po_received || 'NO',
    order_value: parseFloat(data.order_value || data.cost || 0),
    value: data.value || '',
    cost: String(data.cost || data.order_value || ''),
    order_date: data.order_date || null,
    target_date: data.target_date || data.delivery_date || null,
    delivery_date: data.delivery_date || data.target_date || null,
    owner: data.owner || 'VIKRAM',
    id_card_no: data.id_card_no || null,
    material: data.material || null,
    nozzle_series: data.nozzle_series || null,
    gate_type: data.gate_type || null,
    connector: data.connector || null,
    hrs_type: data.hrs_type || null
  };

  if (data.id) payload.id = data.id;
  if (data.created_by) payload.created_by = data.created_by;
  if (data.workflow_milestones) payload.workflow_milestones = data.workflow_milestones;

  return payload;
}

module.exports = {
  toDomain,
  toDatabase
};
