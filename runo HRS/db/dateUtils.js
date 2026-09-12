// ==========================================================================
// RUNO HRS INDIA - Universal Date Utility Functions
// ==========================================================================

function normalizeDateStr(dateStr) {
  if (!dateStr) return '';
  let str = String(dateStr).trim();
  if (!str || str === 'N/A' || str === '-' || str === 'null' || str === 'undefined') return '';
  
  if (str.includes('T')) str = str.split('T')[0].trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // DD-MM-YYYY or DD-MM-YY
  const partsDash = str.split('-');
  if (partsDash.length === 3) {
    if (partsDash[0].length === 4) {
      return `${partsDash[0]}-${partsDash[1].padStart(2, '0')}-${partsDash[2].padStart(2, '0')}`;
    }
    let yr = partsDash[2];
    if (yr.length === 2) yr = '20' + yr;
    return `${yr}-${partsDash[1].padStart(2, '0')}-${partsDash[0].padStart(2, '0')}`;
  }

  // DD/MM/YYYY or YYYY/MM/DD
  const partsSlash = str.split('/');
  if (partsSlash.length === 3) {
    if (partsSlash[0].length === 4) {
      return `${partsSlash[0]}-${partsSlash[1].padStart(2, '0')}-${partsSlash[2].padStart(2, '0')}`;
    }
    let yr = partsSlash[2];
    if (yr.length === 2) yr = '20' + yr;
    return `${yr}-${partsSlash[1].padStart(2, '0')}-${partsSlash[0].padStart(2, '0')}`;
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
}

function isDateInRange(dateVal, startVal, endVal) {
  const normDate = normalizeDateStr(dateVal);
  if (!normDate) return false;
  const normStart = normalizeDateStr(startVal);
  const normEnd = normalizeDateStr(endVal);
  if (normStart && normDate < normStart) return false;
  if (normEnd && normDate > normEnd) return false;
  return true;
}

module.exports = {
  normalizeDateStr,
  isDateInRange
};
