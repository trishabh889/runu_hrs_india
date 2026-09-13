// ==========================================================================
// RUNO HRS MIS - Supabase Approval Repository
// ==========================================================================

class SupabaseApprovalRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async getAll() {
    try {
      const { data, error } = await this.getClient()
        .from('approvals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        item_id: r.item_id || r.id,
        item_type: r.item_type || 'GENERAL',
        submitted_by: r.submitted_by || '',
        submitted_at: r.created_at || new Date().toISOString(),
        details: r.details || {},
        status: r.status || 'PENDING',
        reviewed_by: r.reviewed_by || null,
        reviewed_at: r.reviewed_at || null,
        remarks: r.remarks || ''
      }));
    } catch (err) {
      console.error('[SUPABASE] approvalRepo.getAll failed:', err.message);
      return [];
    }
  }

  async create(data) {
    try {
      const { data: row, error } = await this.getClient()
        .from('approvals')
        .insert([{
          item_type: data.item_type || 'GENERAL',
          submitted_by: data.submitted_by || 'ANAND',
          details: data.details || {},
          status: 'PENDING'
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, approval: row };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async action(id, decision, remarks = '', approvedBy = 'ANAND') {
    try {
      const status = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const { data, error } = await this.getClient()
        .from('approvals')
        .update({
          status,
          remarks,
          reviewed_by: approvedBy,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, approval: data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

module.exports = SupabaseApprovalRepository;
