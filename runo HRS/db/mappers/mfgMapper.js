// ==========================================================================
// RUNO HRS MIS - Manufacturing Job Data Mapper
// ==========================================================================

function toDomain(row) {
  if (!row) return null;
  return {
    id: row.id,
    project_code: row.project_code || '',
    description: row.description || '',
    customer: row.customer || row.customer_name || '',
    category: row.category || 'HRS',
    vendor: row.vendor || 'In-House',
    planned_start: row.planned_start || '',
    planned_end: row.planned_end || '',
    actual_end: row.actual_end || '-',
    status: row.status || 'NOT STARTED',
    progress: parseInt(row.progress || 0, 10)
  };
}

function toDatabase(data) {
  if (!data) return {};
  const payload = {
    project_code: (data.project_code || '').trim(),
    description: (data.description || '').trim(),
    customer: (data.customer || data.customer_name || '').trim(),
    category: data.category || 'HRS',
    vendor: (data.vendor || 'In-House').trim(),
    planned_start: data.planned_start || null,
    planned_end: data.planned_end || null,
    actual_end: data.actual_end === '-' ? null : data.actual_end,
    status: data.status || 'NOT STARTED',
    progress: parseInt(data.progress || 0, 10)
  };
  if (data.id) payload.id = data.id;
  return payload;
}

module.exports = {
  toDomain,
  toDatabase
};
