class CustomerRepository {
  constructor(db) {
    this.db = db;
  }

  getAll(search = '') {
    if (!search) return this.db.data.customers;
    const q = search.toLowerCase();
    return this.db.data.customers.filter(c =>
      (c.company_name && c.company_name.toLowerCase().includes(q)) ||
      (c.customer_code && c.customer_code.toLowerCase().includes(q)) ||
      (c.contact_person && c.contact_person.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.city_state && c.city_state.toLowerCase().includes(q)) ||
      (c.gstin && c.gstin.toLowerCase().includes(q))
    );
  }

  getById(id) {
    return this.db.data.customers.find(c => c.id === id) || null;
  }

  create(custData) {
    const newCust = {
      id: `cust-${Date.now()}`,
      company_name: custData.company_name || 'Unnamed Client',
      customer_code: custData.customer_code || `CUST-${Math.floor(100 + Math.random() * 900)}`,
      industry: custData.industry || 'Automotive Lighting & Plastics',
      tier: custData.tier || 'Tier-1 OEM Supplier',
      payment_terms: custData.payment_terms || '30 Days Net',
      contact_person: custData.contact_person || '',
      designation: custData.designation || '',
      phone: custData.phone || '',
      email: custData.email || '',
      gstin: (custData.gstin || '').toUpperCase(),
      pan: (custData.pan || '').toUpperCase(),
      city_state: custData.city_state || '',
      pincode: custData.pincode || '',
      address: custData.address || '',
      total_projects: 0,
      created_at: new Date().toISOString().split('T')[0]
    };

    this.db.data.customers.unshift(newCust);
    this.db.save();
    return { success: true, customer: newCust };
  }

  update(id, updates) {
    const idx = this.db.data.customers.findIndex(c => c.id === id);
    if (idx === -1) return { success: false, message: 'Customer not found' };

    this.db.data.customers[idx] = { ...this.db.data.customers[idx], ...updates };
    this.db.save();
    return { success: true, customer: this.db.data.customers[idx] };
  }

  delete(id) {
    const hasProjects = this.db.data.projects.some(p => p.customer_id === id);
    if (hasProjects) {
      return { success: false, message: 'Cannot delete customer with active projects' };
    }

    this.db.data.customers = this.db.data.customers.filter(c => c.id !== id);
    this.db.save();
    return { success: true };
  }

  incrementProjectsCount(id) {
    const customer = this.getById(id);
    if (customer) {
      customer.total_projects = (customer.total_projects || 0) + 1;
      this.db.save();
    }
  }
}

module.exports = CustomerRepository;
