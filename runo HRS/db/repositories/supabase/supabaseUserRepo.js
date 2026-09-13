// ==========================================================================
// RUNO HRS MIS - Supabase User Profile Repository
// ==========================================================================

const mapper = require('../../mappers/userMapper');

class SupabaseUserRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async getAll() {
    try {
      const { data, error } = await this.getClient()
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapper.toDomain);
    } catch (err) {
      console.error('[SUPABASE] userRepo.getAll failed:', err.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const { data, error } = await this.getClient()
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      return mapper.toDomain(data);
    } catch (err) {
      return null;
    }
  }

  async getByUsername(username) {
    try {
      const { data, error } = await this.getClient()
        .from('profiles')
        .select('*')
        .ilike('username', (username || '').trim())
        .maybeSingle();

      if (error || !data) return null;
      return mapper.toDomain(data);
    } catch (err) {
      return null;
    }
  }

  async create(userData) {
    try {
      const dbRow = mapper.toDatabase(userData);
      const { data, error } = await this.getClient()
        .from('profiles')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async update(id, userData) {
    try {
      const dbRow = mapper.toDatabase(userData);
      delete dbRow.id;
      const { data, error } = await this.getClient()
        .from('profiles')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async approve(id) {
    return this.update(id, { status: 'APPROVED', is_approved: true });
  }

  async reject(id) {
    return this.update(id, { status: 'REJECTED', is_approved: false });
  }
}

module.exports = SupabaseUserRepository;
