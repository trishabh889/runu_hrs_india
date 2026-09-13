// ==========================================================================
// RUNO HRS MIS - Customer Data Mapper (Supabase <-> UI Contract)
// ==========================================================================

function toDomain(row) {
  if (!row) return null;
  const city = row.city || (row.city_state ? row.city_state.split(',')[0].trim() : '');
  const state = row.state || (row.city_state ? (row.city_state.split(',')[1] || '').trim() : '');

  return {
    id: row.id,
    company_name: row.company_name || '',
    contact_person: row.contact_person || '',
    phone: row.phone || '',
    email: row.email || '',
    address: row.address || '',
    city: city,
    state: state,
    city_state: row.city_state || (city && state ? `${city}, ${state}` : city || state || ''),
    gstin: row.gstin || '',
    category: row.category || 'PROSPECT',
    total_projects: parseInt(row.total_projects || 0, 10),
    created_at: row.created_at || new Date().toISOString().split('T')[0]
  };
}

function toDatabase(data) {
  if (!data) return {};
  const city = data.city || '';
  const state = data.state || '';
  const cityState = data.city_state || (city && state ? `${city}, ${state}` : city || state || '');

  const payload = {
    company_name: (data.company_name || '').trim(),
    contact_person: (data.contact_person || '').trim(),
    phone: (data.phone || '').trim(),
    email: (data.email || '').trim(),
    address: (data.address || '').trim(),
    city: city.trim(),
    state: state.trim(),
    city_state: cityState.trim(),
    gstin: (data.gstin || '').trim().toUpperCase(),
    category: data.category || 'PROSPECT'
  };

  if (data.id) payload.id = data.id;
  if (data.total_projects !== undefined) payload.total_projects = parseInt(data.total_projects || 0, 10);

  return payload;
}

module.exports = {
  toDomain,
  toDatabase
};
