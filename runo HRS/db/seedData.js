module.exports = {
  users: [
    {
      id: 'usr-001',
      username: 'ANAND',
      name: 'Anand Sharma',
      role: 'ADMIN',
      password: 'ADMIN',
      email: 'anand@runohrs.com',
      phone: '+91 98765 43210',
      department: 'Executive Management',
      created_at: '2026-01-15'
    },
    {
      id: 'usr-002',
      username: 'VIKRAM',
      name: 'Vikram Singh',
      role: 'ENGINEER',
      password: 'USER123',
      email: 'vikram@runohrs.com',
      phone: '+91 98111 22334',
      department: 'Design & Tooling',
      created_at: '2026-02-10'
    },
    {
      id: 'usr-003',
      username: 'RAJESH',
      name: 'Rajesh Patil',
      role: 'OPERATOR',
      password: 'USER123',
      email: 'rajesh@runohrs.com',
      phone: '+91 98222 33445',
      department: 'CNC Machining',
      created_at: '2026-03-01'
    }
  ],
  customers: [
    {
      id: 'cust-001',
      company_name: 'Minda Automotive Solutions Ltd.',
      customer_code: 'RUNO-CUST-MIND',
      tier: 'Tier-1 OEM Supplier',
      payment_terms: '30 Days Net',
      contact_person: 'Ramesh Verma',
      designation: 'Head - Tooling & NPD',
      phone: '+91 98200 11223',
      email: 'r.verma@minda.com',
      gstin: '06AAACM1234D1Z5',
      pan: 'AAACM1234D',
      city_state: 'IMT Manesar, Haryana',
      address: 'Plot 42, Sector 8, IMT Manesar, Gurugram, Haryana',
      industry: 'Automotive Lighting & Plastics',
      total_projects: 1,
      created_at: '2026-01-20'
    },
    {
      id: 'cust-002',
      company_name: 'Lumax Industries Pvt. Ltd.',
      customer_code: 'RUNO-CUST-LUMX',
      tier: 'Tier-1 OEM Supplier',
      payment_terms: '45 Days Net',
      contact_person: 'Sunil Mehta',
      designation: 'Senior Purchase Manager',
      phone: '+91 98333 44556',
      email: 's.mehta@lumax.co.in',
      gstin: '27AAACL5678E1Z2',
      pan: 'AAACL5678E',
      city_state: 'Chakan Pune, Maharashtra',
      address: 'Chakan MIDC Phase II, Pune, Maharashtra',
      industry: 'Automotive Components',
      total_projects: 0,
      created_at: '2026-02-14'
    }
  ],

  projects: [
    {
      id: 'proj-001',
      project_code: 'RUNO-2026-001',
      customer_id: 'cust-001',
      customer_name: 'Minda Automotive Solutions Ltd.',
      mould_description: 'Rear Lamp Housing 4-Drop Prewired HRS',
      nozzle_count: 4,
      nozzle_type: 'Valve Gate Pneumatic (Series 16)',
      manifold_type: 'X-Style Balanced Manifold (H13 Hardened)',
      runner_diameter: '12 mm',
      gate_type: 'Valve Gate 2.5mm',
      material: 'Polycarbonate (PC) Clear',
      shot_weight: '340 grams',
      year: '2026',
      order_date: '2026-02-01',
      target_date: '2026-03-25',
      status: 'ACTIVE',
      priority: 'HIGH',
      project_manager: 'Anand Sharma',
      lead_engineer: 'Vikram Singh',
      value: '₹ 4,85,000',
      notes: 'Pre-wired heavy duty ceramic connector assembly with J-Type thermocouple.',
      created_at: '2026-02-01'
    }
  ],
  manufacturing: [
    {
      project_id: 'proj-001',
      stages: {
        design_cad: { status: 'COMPLETED', completed_date: '2026-02-08', notes: '3D CAD flow simulation approved.' },
        cnc_machining: { status: 'COMPLETED', completed_date: '2026-02-18', notes: 'Manifold block 5-axis CNC machining done.' },
        gun_drilling: { status: 'COMPLETED', completed_date: '2026-02-23', notes: 'Flow channels precision drilled (0.4 Ra).' },
        hardening: { status: 'IN_PROGRESS', completed_date: null, notes: 'Vacuum heat treatment (48-50 HRC).' },
        assembly: { status: 'PENDING', completed_date: null, notes: 'Nozzle fitment pending.' },
        wiring_testing: { status: 'PENDING', completed_date: null, notes: 'Heater and thermocouple testing.' },
        final_inspection: { status: 'PENDING', completed_date: null, notes: 'CMM inspection and dispatch packaging.' }
      },
      current_stage: 'hardening',
      overall_progress: 55,
      updated_at: '2026-02-23'
    }
  ],
  approvals: [
    {
      id: 'appr-001',
      project_id: 'proj-001',
      project_code: 'RUNO-2026-001',
      title: 'Manifold Flow Channel & Drop Pitch Sign-off',
      type: 'DESIGN_APPROVAL',
      requested_by: 'Vikram Singh',
      approved_by: 'ANAND',
      status: 'APPROVED',
      submitted_date: '2026-02-05',
      action_date: '2026-02-06',
      remarks: 'Drawing v2 approved. Safe for CNC machining.'
    }
  ]
};
