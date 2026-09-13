// ==========================================================================
// RUNO HRS MIS - Supabase Customer Repository
// ==========================================================================

const mapper = require('../../mappers/customerMapper');

class SupabaseCustomerRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async getAll(search = '') {
    try {
      let query = this.getClient()
        .from('customers')
        .select('*')
        .order('company_name', { ascending: true });

      if (search && search.trim()) {
        const q = search.trim();
        query = query.or(`company_name.ilike.%${q}%,contact_person.ilike.%${q}%,city.ilike.%${q}%,gstin.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapper.toDomain);
    } catch (err) {
      console.error('[SUPABASE] customerRepo.getAll failed:', err.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const { data, error } = await this.getClient()
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      return mapper.toDomain(data);
    } catch (err) {
      return null;
    }
  }

  async create(customerData) {
    try {
      const dbRow = mapper.toDatabase(customerData);
      const { data, error } = await this.getClient()
        .from('customers')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, customer: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async update(id, customerData) {
    try {
      const dbRow = mapper.toDatabase(customerData);
      delete dbRow.id;
      const { data, error } = await this.getClient()
        .from('customers')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, customer: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async delete(id) {
    try {
      const { error } = await this.getClient()
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

module.exports = SupabaseCustomerRepository;
