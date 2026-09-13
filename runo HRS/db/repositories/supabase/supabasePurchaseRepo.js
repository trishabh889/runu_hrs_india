// ==========================================================================
// RUNO HRS MIS - Supabase Purchase Repository
// ==========================================================================

class SupabasePurchaseRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async getRequests(filters = {}) {
    try {
      let query = this.getClient()
        .from('purchase_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status && filters.status !== 'ALL') {
        query = query.eq('status', filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const q = filters.search.trim();
        query = query.or(`pr_number.ilike.%${q}%,project_code.ilike.%${q}%,item_name.ilike.%${q}%,supplier_vendor.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        pr_no: r.pr_number || r.pr_no || '',
        prNumber: r.pr_number || r.pr_no || '',
        date: r.date || r.created_at || new Date().toISOString().split('T')[0],
        project_code: r.project_code || '',
        projectCode: r.project_code || '',
        project_desc: r.project_desc || 'Hot Runner Tooling',
        category: r.category || 'HRS',
        item_desc: r.item_name || r.item_desc || '',
        itemName: r.item_name || r.item_desc || '',
        qty: r.qty !== undefined ? r.qty : 1,
        unit: r.unit || 'NOS',
        vendor: r.supplier_vendor || r.vendor || 'Local',
        supplierVendor: r.supplier_vendor || r.vendor || 'Local',
        estimatedCost: parseFloat(r.estimated_cost || 0),
        status: r.status || 'Pending',
        priority: r.priority || 'Normal',
        requested_by: r.requested_by || 'Design Department',
        purpose: r.purpose || '',
        internal_remarks: r.internal_remarks || '',
        items: r.items || []
      }));
    } catch (err) {
      console.error('[SUPABASE] purchaseRepo.getRequests failed:', err.message);
      return [];
    }
  }

  async createRequest(data) {
    try {
      const prNo = data.pr_no || data.prNumber || `PR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
      const payload = {
        pr_number: prNo,
        date: data.date || new Date().toISOString().split('T')[0],
        project_code: data.project_code || data.projectCode || '',
        category: data.category || 'HRS',
        item_name: data.item_desc || data.itemName || (data.items && data.items[0] ? data.items[0].desc : 'Item'),
        qty: parseInt(data.qty !== undefined ? data.qty : (data.items && data.items[0] ? data.items[0].qty : 1), 10),
        unit: data.unit || (data.items && data.items[0] ? data.items[0].unit : 'NOS'),
        supplier_vendor: data.vendor || data.supplierVendor || 'Local',
        estimated_cost: parseFloat(data.estimatedCost || 0),
        status: data.status || 'Pending'
      };

      const { data: row, error } = await this.getClient()
        .from('purchase_requests')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      const formatted = { ...row, pr_no: row.pr_number || prNo };
      return { success: true, pr: formatted, request: formatted };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async updateRequest(id, data) {
    try {
      const payload = {};
      if (data.status) payload.status = data.status;
      if (data.vendor || data.supplierVendor) payload.supplier_vendor = data.vendor || data.supplierVendor;

      const { data: row, error } = await this.getClient()
        .from('purchase_requests')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      const formatted = { ...row, pr_no: row.pr_number };
      return { success: true, pr: formatted, request: formatted };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async deleteRequest(id) {
    try {
      const { error } = await this.getClient()
        .from('purchase_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
}

module.exports = SupabasePurchaseRepository;
