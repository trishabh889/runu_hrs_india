// ==========================================================================
// RUNO HRS MIS - Accounts Voucher Data Mapper
// ==========================================================================

function toDomain(row) {
  if (!row) return null;
  const isDebit = ['PURCHASE', 'PAYMENT', 'EXPENSES', 'DEBIT NOTE'].includes(
    (row.voucher_type || row.tabType || '').toUpperCase()
  );

  return {
    id: row.id,
    date: row.date || new Date().toISOString().split('T')[0],
    tabType: row.voucher_type || row.tabType || 'RECEIPT',
    particulars: row.particulars || '',
    refNo: row.ref_no || row.refNo || '',
    amount: parseFloat(row.amount || 0),
    debit: isDebit ? parseFloat(row.amount || 0) : 0,
    credit: !isDebit ? parseFloat(row.amount || 0) : 0,
    status: row.status || 'POSTED'
  };
}

function toDatabase(data) {
  if (!data) return {};
  const amt = parseFloat(data.amount || 0);
  const vType = (data.tabType || data.voucher_type || 'RECEIPT').toUpperCase();
  const isDebit = ['PURCHASE', 'PAYMENT', 'EXPENSES', 'DEBIT NOTE'].includes(vType);

  const payload = {
    date: data.date || new Date().toISOString().split('T')[0],
    voucher_type: vType,
    particulars: (data.particulars || '').trim(),
    ref_no: (data.refNo || data.ref_no || '').trim(),
    amount: amt,
    debit: isDebit ? amt : 0,
    credit: !isDebit ? amt : 0,
    status: data.status || 'POSTED'
  };

  if (data.id) payload.id = data.id;
  return payload;
}

module.exports = {
  toDomain,
  toDatabase
};
