// ==========================================================================
// RUNO HRS MIS - Synthetic Test Fixtures (Zero Production Data)
// ==========================================================================

module.exports = {
  users: [
    {
      id: 'usr-synth-001',
      username: 'TESTADMIN',
      name: 'Test Administrator',
      role: 'ADMIN',
      password: 'ADMIN',
      email: 'admin@synth.test',
      phone: '+91 99999 00001',
      department: 'Executive Management',
      created_at: '2026-04-10'
    },
    {
      id: 'usr-synth-002',
      username: 'TESTSALES',
      name: 'Test Sales Engineer',
      role: 'SALES',
      password: 'USER123',
      email: 'sales@synth.test',
      phone: '+91 99999 00002',
      department: 'Sales & Marketing',
      created_at: '2026-04-11'
    }
  ],

  customers: [
    {
      id: 'cust-synth-001',
      company_name: 'Apex Precision Tools Pvt Ltd',
      customer_code: 'RUNO-CUST-APEX',
      tier: 'Tier-1 OEM Supplier',
      payment_terms: '30 Days Net',
      contact_person: 'Rajiv Malhotra',
      designation: 'Tooling Head',
      phone: '+91 98000 11111',
      email: 'rajiv@apexprecision.test',
      gstin: '07AAACA1234E1Z9',
      pan: 'AAACA1234E',
      city_state: 'Gurugram, Haryana',
      address: 'Plot 10, Udyog Vihar Phase 4, Gurugram',
      industry: 'Automotive Precision Plastics',
      section: 'HRS',
      total_projects: 1,
      created_at: '2026-04-15'
    }
  ],

  projects: [
    {
      id: 'proj-synth-001',
      project_code: 'RUNO-2026-999',
      customer_id: 'cust-synth-001',
      customer_name: 'Apex Precision Tools Pvt Ltd',
      mould_description: 'Front Bumper 4-Drop Prewired Hot Runner',
      category: 'HRS',
      quote_status: 'APPROVED',
      po_received: 'RECEIVED',
      nozzle_count: 4,
      year: '2026',
      order_date: '2026-05-10',
      target_date: '2026-06-30',
      status: 'ACTIVE',
      priority: 'HIGH',
      project_manager: 'Test Administrator',
      lead_engineer: 'Test Sales Engineer',
      value: '₹ 3,50,000',
      owner: 'TESTADMIN',
      created_by: 'TESTADMIN',
      created_at: '2026-05-10'
    }
  ]
};
