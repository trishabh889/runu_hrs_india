// ==========================================================================
// RUNO HRS MIS - Supabase Manufacturing Repository
// ==========================================================================

const mapper = require('../../mappers/mfgMapper');

class SupabaseManufacturingRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async getAll(filters = {}) {
    try {
      let query = this.getClient()
        .from('manufacturing_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'ALL') {
        query = query.eq('status', filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim();
        query = query.or(`project_code.ilike.%${q}%,description.ilike.%${q}%,customer.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapper.toDomain);
    } catch (err) {
      console.error('[SUPABASE] mfgRepo.getAll failed:', err.message);
      return [];
    }
  }

  async create(jobData) {
    try {
      const dbRow = mapper.toDatabase(jobData);
      const { data, error } = await this.getClient()
        .from('manufacturing_jobs')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, job: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async update(id, jobData) {
    try {
      const dbRow = mapper.toDatabase(jobData);
      delete dbRow.id;
      const { data, error } = await this.getClient()
        .from('manufacturing_jobs')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, job: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

module.exports = SupabaseManufacturingRepository;
