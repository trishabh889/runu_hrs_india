// ==========================================================================
// RUNO HRS MIS - Supabase Authentication & Session Service
// ==========================================================================

const { config } = require('../../config');
const SupabaseAdapter = require('../../db/adapters/supabaseAdapter');

class AuthService {
  constructor(adapter = null) {
    this.adapter = adapter || new SupabaseAdapter();
    this.currentUser = null;
  }

  getClient() {
    return this.adapter.getClient();
  }

  async login(identifier, password) {
    if (!config.supabase.isConfigured) {
      return { success: false, message: 'Supabase is not configured on this workstation' };
    }

    try {
      const client = this.getClient();
      let email = identifier.trim();

      // If username provided, look up email in profiles table
      if (!email.includes('@')) {
        const { data: profile } = await client
          .from('profiles')
          .select('email')
          .ilike('username', email)
          .maybeSingle();

        if (!profile || !profile.email) {
          return { success: false, message: 'Invalid username or credentials' };
        }
        email = profile.email;
      }

      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, message: error.message };
      }

      // Fetch profile and check approval status
      const { data: profile, error: profErr } = await client
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profErr || !profile) {
        return { success: false, message: 'User profile not found in system' };
      }

      if (profile.status === 'PENDING_APPROVAL' || profile.is_approved === false) {
        await client.auth.signOut();
        return {
          success: false,
          message: 'Your account is pending administrator approval. Access is currently restricted.'
        };
      }

      this.currentUser = {
        id: profile.id,
        username: profile.username || identifier,
        name: profile.full_name || profile.username,
        role: profile.role || 'ADMIN',
        department: profile.department || 'MANAGEMENT',
        status: profile.status
      };

      return { success: true, user: this.currentUser };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async logout() {
    try {
      if (config.supabase.isConfigured) {
        await this.getClient().auth.signOut();
      }
      this.currentUser = null;
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

module.exports = new AuthService();
