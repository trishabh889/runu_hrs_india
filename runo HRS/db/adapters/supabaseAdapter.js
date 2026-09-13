// ==========================================================================
// RUNO HRS MIS - Supabase Database Adapter
// ==========================================================================

const { createClient } = require('@supabase/supabase-js');
const BaseDatabaseAdapter = require('./baseAdapter');
const { config } = require('../../config');

class SupabaseAdapter extends BaseDatabaseAdapter {
  constructor(customConfig = null) {
    super('supabase');
    const cfg = customConfig || config.supabase;
    this.url = cfg.url;
    this.key = cfg.key;
    this.client = null;

    if (this.url && this.key) {
      this.client = createClient(this.url, this.key, {
        auth: {
          persistSession: false,
          autoRefreshToken: true
        }
      });
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Supabase client is not initialized. Please verify SUPABASE_URL and SUPABASE_KEY.');
    }
    return this.client;
  }

  async isHealthy() {
    if (!this.client) return false;
    try {
      const { data, error } = await this.client.from('customers').select('id').limit(1);
      return !error;
    } catch (err) {
      return false;
    }
  }

  async executeQuery(table, operation, ...args) {
    const client = this.getClient();
    try {
      let query = client.from(table);
      if (typeof query[operation] === 'function') {
        return await query[operation](...args);
      }
      throw new Error(`Unsupported operation "${operation}" on table "${table}"`);
    } catch (err) {
      console.error(`[SUPABASE ERROR] ${table}.${operation}:`, err.message);
      return { data: null, error: err };
    }
  }
}

module.exports = SupabaseAdapter;
