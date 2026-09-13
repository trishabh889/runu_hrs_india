// ==========================================================================
// RUNO HRS MIS - Supabase Project Repository
// ==========================================================================

const mapper = require('../../mappers/projectMapper');

class SupabaseProjectRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async getAll(filters = {}) {
    try {
      let query = this.getClient()
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'ALL') {
        query = query.eq('status', filters.status);
      }
      if (filters.section && filters.section !== 'ALL') {
        query = query.eq('section', filters.section);
      }
      if (filters.quote_status && filters.quote_status !== 'ALL') {
        query = query.eq('quote_status', filters.quote_status);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim();
        query = query.or(`project_code.ilike.%${q}%,customer_name.ilike.%${q}%,part_name.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapper.toDomain);
    } catch (err) {
      console.error('[SUPABASE] projectRepo.getAll failed:', err.message);
      return [];
    }
  }

  async getById(id) {
    try {
      const { data, error } = await this.getClient()
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      return mapper.toDomain(data);
    } catch (err) {
      return null;
    }
  }

  async create(projectData) {
    try {
      const dbRow = mapper.toDatabase(projectData);
      if (!dbRow.project_code) {
        // Fallback client code if RPC not yet run
        dbRow.project_code = `RUNO-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
      }

      const { data, error } = await this.getClient()
        .from('projects')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { success: true, project: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async update(id, projectData) {
    try {
      const dbRow = mapper.toDatabase(projectData);
      delete dbRow.id;
      const { data, error } = await this.getClient()
        .from('projects')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, project: mapper.toDomain(data) };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async delete(id) {
    try {
      const { error } = await this.getClient()
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async getWorkflow(projectId) {
    const defaultWf = { '2dStart': '-', '2dEnd': '-', '3dStart': '-', '3dEnd': '-', 'designSend': '-' };
    try {
      const { data, error } = await this.getClient()
        .from('projects')
        .select('workflow_milestones')
        .eq('id', projectId)
        .single();
      if (error || !data || !data.workflow_milestones) return defaultWf;
      return { ...defaultWf, ...data.workflow_milestones };
    } catch (err) {
      return defaultWf;
    }
  }

  async setWorkflow(projectId, step, timestamp = null) {
    const nowStr = timestamp || new Date().toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).replace(',', '');

    try {
      const current = await this.getWorkflow(projectId);
      current[step] = nowStr;
      const { data, error } = await this.getClient()
        .from('projects')
        .update({ workflow_milestones: current })
        .eq('id', projectId)
        .select('workflow_milestones')
        .single();
      if (error) throw error;
      return { success: true, workflow: data?.workflow_milestones || current };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

module.exports = SupabaseProjectRepository;

