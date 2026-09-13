// ==========================================================================
// RUNO HRS MIS - User Profile Data Mapper
// ==========================================================================

function toDomain(row) {
  if (!row) return null;
  const username = (row.username || '').toUpperCase();
  const isSuperAdmin = username === 'ANAND';
  const isApproved = isSuperAdmin || (row.status === 'APPROVED' && row.is_approved !== false);

  return {
    id: row.id,
    username: row.username || '',
    name: row.name || row.full_name || '',
    email: row.email || '',
    phone: row.phone || '',
    role: (row.role || row.department || 'DESIGN').toUpperCase(),
    department: row.department || 'DESIGN',
    designation: row.designation || 'Staff',
    status: isApproved ? 'APPROVED' : (row.status === 'REJECTED' ? 'REJECTED' : 'PENDING_APPROVAL'),
    is_approved: isApproved,
    created_at: row.created_at || new Date().toISOString().split('T')[0]
  };
}

function toDatabase(data) {
  if (!data) return {};
  const username = (data.username || '').trim().toUpperCase();
  const isSuperAdmin = username === 'ANAND';
  const status = isSuperAdmin ? 'APPROVED' : (data.status || 'PENDING_APPROVAL');

  const payload = {
    username: username,
    full_name: (data.name || data.fullname || '').trim(),
    email: (data.email || '').trim().toLowerCase(),
    phone: (data.phone || '').trim(),
    role: (data.role || data.department || 'DESIGN').toUpperCase(),
    department: data.department || 'DESIGN',
    designation: (data.designation || 'Staff').trim(),
    status: status,
    is_approved: status === 'APPROVED'
  };

  if (data.id) payload.id = data.id;
  return payload;
}

module.exports = {
  toDomain,
  toDatabase
};
