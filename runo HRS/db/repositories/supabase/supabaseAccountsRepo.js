// ==========================================================================
// RUNO HRS MIS - Supabase Accounts Repository
// ==========================================================================

const mapper = require('../../mappers/accountsMapper');

class SupabaseAccountsRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async getEntries(tabType = 'ALL', search = '') {
    try {
      let query = this.getClient()
        .from('vouchers')
        .select('*')
        .order('date', { ascending: false });

      if (tabType && tabType !== 'ALL' && !['DASHBOARD', 'LEDGER', 'REPORTS', 'BANK / CASH', 'GST'].includes(tabType)) {
        query = query.eq('voucher_type', tabType);
      }
      if (search && search.trim()) {
        const q = search.trim();
        query = query.or(`particulars.ilike.%${q}%,ref_no.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapper.toDomain);
    } catch (err) {
      console.error('[SUPABASE] accountsRepo.getEntries failed:', err.message);
      return [];
    }
  }

  async createEntry(entryData) {
    try {
      const dbRow = mapper.toDatabase(entryData);
      const { data, error } = await this.getClient()
        .from('vouchers')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, entry: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async getStats() {
    try {
      const entries = await this.getEntries();
      let totalSales = 0;
      let totalPurchase = 0;
      let receipts = 0;
      let payments = 0;

      entries.forEach(e => {
        const amt = parseFloat(e.amount) || 0;
        const type = (e.tabType || '').toUpperCase();
        if (type === 'SALES') totalSales += amt;
        if (type === 'PURCHASE') totalPurchase += amt;
        if (type === 'RECEIPT') receipts += amt;
        if (type === 'PAYMENT') payments += amt;
      });

      return {
        totalSales,
        totalPurchase,
        receivable: Math.max(0, totalSales - receipts),
        payable: Math.max(0, totalPurchase - payments),
        cashBalance: 45000,
        bankBalance: 385000
      };
    } catch (err) {
      return { totalSales: 0, totalPurchase: 0, receivable: 0, payable: 0, cashBalance: 0, bankBalance: 0 };
    }
  }
}

module.exports = SupabaseAccountsRepository;
