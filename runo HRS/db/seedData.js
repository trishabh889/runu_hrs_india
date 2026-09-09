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
      role: 'SALES',
      password: 'USER123',
      email: 'vikram@runohrs.com',
      phone: '+91 98111 22334',
      department: 'Sales & Marketing',
      created_at: '2026-02-10'
    },
    {
      id: 'usr-003',
      username: 'PRIYA',
      name: 'Priya Verma',
      role: 'COMMERCIAL',
      password: 'USER123',
      email: 'priya@runohrs.com',
      phone: '+91 98111 55667',
      department: 'Commercial & Costing',
      created_at: '2026-02-12'
    },
    {
      id: 'usr-004',
      username: 'ROHIT',
      name: 'Rohit Sharma',
      role: 'DESIGN',
      password: 'USER123',
      email: 'rohit@runohrs.com',
      phone: '+91 98111 77889',
      department: 'Design & Engineering',
      created_at: '2026-02-15'
    },
    {
      id: 'usr-005',
      username: 'MANISH',
      name: 'Manish Aggarwal',
      role: 'ACCOUNTS',
      password: 'USER123',
      email: 'manish@runohrs.com',
      phone: '+91 98111 99001',
      department: 'Accounts & Finance',
      created_at: '2026-02-18'
    },
    {
      id: 'usr-006',
      username: 'RAJESH',
      name: 'Rajesh Patil',
      role: 'STORE',
      password: 'USER123',
      email: 'rajesh@runohrs.com',
      phone: '+91 98222 33445',
      department: 'Store & Inventory',
      created_at: '2026-03-01'
    },
    {
      id: 'usr-007',
      username: 'SURESH',
      name: 'Suresh Nair',
      role: 'PURCHASE',
      password: 'USER123',
      email: 'suresh@runohrs.com',
      phone: '+91 98333 11223',
      department: 'Procurement & Purchase',
      created_at: '2026-03-05'
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
      section: 'HRS',
      total_projects: 2,
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
      section: 'HRTC',
      total_projects: 1,
      created_at: '2026-02-14'
    },
    {
      id: 'cust-003',
      company_name: 'Varroc Engineering Ltd.',
      customer_code: 'RUNO-CUST-VARC',
      tier: 'Direct OEM',
      payment_terms: '60 Days Net',
      contact_person: 'Deepak Kulkarni',
      designation: 'Tooling General Manager',
      phone: '+91 98444 77889',
      email: 'd.kulkarni@varroc.com',
      gstin: '27AAACV9012F1Z8',
      pan: 'AAACV9012F',
      city_state: 'Aurangabad, Maharashtra',
      address: 'Plot E-4, MIDC Industrial Area, Waluj, Aurangabad',
      industry: 'Polymer Extrusion & Injection',
      section: 'SPARE-HRS',
      total_projects: 1,
      created_at: '2026-02-20'
    }
  ],

  projects: [
    {
      id: 'proj-001',
      project_code: 'RUNO-2026-001',
      customer_id: 'cust-001',
      customer_name: 'Minda Automotive Solutions Ltd.',
      mould_description: 'Rear Lamp Housing 4-Drop Prewired HRS',
      category: 'HRS',
      quote_status: 'APPROVED',
      po_received: 'RECEIVED',
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
      id_card_no: 'IDC-2026-01',
      cost: '485000',
      hrs_type: 'HRS',
      nozzle_series: 'Series 16',
      connector: '16-Pin Heavy Duty Harting',
      gate_dia: '2.5 mm',
      guide_dia: '6.0 mm',
      remark: 'High cosmetic optical clear lens component.',
      design_check: 'CHECKED',
      owner: 'VIKRAM',
      created_by: 'VIKRAM',
      notes: 'RUNO_SOURCE=SALES | ID_CARDNO=IDC-2026-01 | COST=485000 | MATERIAL=Polycarbonate (PC) Clear | NOZZLE_SERIES=Series 16 | GATE_TYPE=Valve Gate 2.5mm | CONNECTOR=16-Pin Heavy Duty | GATE_DIA=2.5 mm | GUIDE_DIA=6.0 mm',
      created_at: '2026-02-01'
    },
    {
      id: 'proj-002',
      project_code: 'RUNO-2026-002',
      customer_id: 'cust-002',
      customer_name: 'Lumax Industries Pvt. Ltd.',
      mould_description: 'Headlamp Bezel 8-Drop Sequential Valve Gate HRTC',
      category: 'HRTC',
      quote_status: 'SENT',
      po_received: 'RECEIVED',
      nozzle_count: 8,
      nozzle_type: 'Hydraulic Sequential Valve Gate',
      manifold_type: 'H-Pattern Naturally Balanced',
      runner_diameter: '14 mm',
      gate_type: 'Valve Gate 3.0mm',
      material: 'PBT-ASA GF20',
      shot_weight: '620 grams',
      year: '2026',
      order_date: '2026-02-15',
      target_date: '2026-04-10',
      status: 'ACTIVE',
      priority: 'HIGH',
      project_manager: 'Anand Sharma',
      lead_engineer: 'Rohit Sharma',
      value: '₹ 8,40,000',
      id_card_no: 'IDC-2026-02',
      cost: '840000',
      hrs_type: 'HRTC',
      nozzle_series: 'Series 20',
      connector: '24-Pin Harting Dual Zone',
      gate_dia: '3.0 mm',
      guide_dia: '8.0 mm',
      remark: 'Sequential pin timer controller required.',
      design_check: 'CHECKED',
      owner: 'ROHIT',
      created_by: 'VIKRAM',
      notes: 'RUNO_SOURCE=SALES | ID_CARDNO=IDC-2026-02 | COST=840000 | MATERIAL=PBT-ASA GF20 | NOZZLE_SERIES=Series 20 | GATE_TYPE=Valve Gate 3.0mm | CONNECTOR=24-Pin Harting | GATE_DIA=3.0 mm | GUIDE_DIA=8.0 mm',
      created_at: '2026-02-15'
    },
    {
      id: 'proj-003',
      project_code: 'RUNO-2026-003',
      customer_id: 'cust-003',
      customer_name: 'Varroc Engineering Ltd.',
      mould_description: 'Indicator Housing 2-Drop Spare Manifold',
      category: 'SPARE-HRS',
      quote_status: 'SENT',
      po_received: 'PENDING',
      nozzle_count: 2,
      nozzle_type: 'Open Torpedo Tip',
      manifold_type: 'Straight Linear Bar Manifold',
      runner_diameter: '10 mm',
      gate_type: 'Torpedo Tip Direct Gate',
      material: 'ABS Natural',
      shot_weight: '110 grams',
      year: '2026',
      order_date: '2026-03-01',
      target_date: '2026-03-30',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      project_manager: 'Anand Sharma',
      lead_engineer: 'Vikram Singh',
      value: '₹ 2,15,000',
      id_card_no: 'IDC-2026-03',
      cost: '215000',
      hrs_type: 'SPARE-HRS',
      nozzle_series: 'Series 12',
      connector: '6-Pin Heavy Duty',
      gate_dia: '1.8 mm',
      guide_dia: '5.0 mm',
      remark: 'Replacement spare manifold for tooling unit 4.',
      design_check: 'NOT CHECKED',
      owner: 'VIKRAM',
      created_by: 'VIKRAM',
      notes: 'RUNO_SOURCE=SALES | ID_CARDNO=IDC-2026-03 | COST=215000 | MATERIAL=ABS Natural | NOZZLE_SERIES=Series 12 | GATE_TYPE=Torpedo Tip | CONNECTOR=6-Pin Heavy Duty | GATE_DIA=1.8 mm | GUIDE_DIA=5.0 mm',
      created_at: '2026-03-01'
    }
  ],

  projectWorkflows: {
    'proj-001': {
      '2dStart': '02-Feb-2026 10:30:00',
      '2dEnd': '05-Feb-2026 17:45:00',
      '3dStart': '06-Feb-2026 09:15:00',
      '3dEnd': '08-Feb-2026 18:00:00',
      'designSend': '09-Feb-2026 11:20:00'
    },
    'proj-002': {
      '2dStart': '16-Feb-2026 11:00:00',
      '2dEnd': '20-Feb-2026 16:30:00',
      '3dStart': '21-Feb-2026 10:00:00',
      '3dEnd': '-',
      'designSend': '-'
    },
    'proj-003': {
      '2dStart': '-',
      '2dEnd': '-',
      '3dStart': '-',
      '3dEnd': '-',
      'designSend': '-'
    }
  },

  storeItems: [
    {
      code: 'ITM-VG-001',
      name: 'Pneumatic Valve Gate Cylinder 16mm',
      category: 'NOZZLE COMPONENTS',
      unit: 'NOS',
      minStock: '5',
      maxStock: '25',
      location: 'Bin A-04 (Tool Store)',
      active: 'YES'
    },
    {
      code: 'ITM-HT-002',
      name: 'Coil Heater Band 230V 650W',
      category: 'HEATING ELEMENTS',
      unit: 'NOS',
      minStock: '10',
      maxStock: '50',
      location: 'Bin B-12 (Electrical)',
      active: 'YES'
    },
    {
      code: 'ITM-TC-003',
      name: 'J-Type Thermocouple Sensor Fe-Const',
      category: 'SENSORS',
      unit: 'NOS',
      minStock: '15',
      maxStock: '60',
      location: 'Bin B-15 (Electrical)',
      active: 'YES'
    },
    {
      code: 'ITM-CN-004',
      name: 'Ceramic Mold Connector 16-Pin Harting',
      category: 'WIRING ACCESSORIES',
      unit: 'NOS',
      minStock: '8',
      maxStock: '30',
      location: 'Bin C-02 (Hardware)',
      active: 'YES'
    },
    {
      code: 'ITM-MF-005',
      name: 'Pre-hardened H13 Forged Manifold Block',
      category: 'RAW MATERIAL STEEL',
      unit: 'KGS',
      minStock: '200',
      maxStock: '800',
      location: 'Bay 2 Steel Yard',
      active: 'YES'
    },
    {
      code: 'ITM-TP-006',
      name: 'Beryllium Copper Torpedo Tip 2.5mm',
      category: 'NOZZLE COMPONENTS',
      unit: 'NOS',
      minStock: '12',
      maxStock: '40',
      location: 'Bin A-08 (Precision Bin)',
      active: 'YES'
    },
    {
      code: 'LOC-MNSR',
      name: 'Main Plant Manesar Godown',
      category: 'GODOWN',
      unit: 'NOS',
      minStock: 'Sector 8 IMT Manesar',
      maxStock: '0',
      location: '+91 98111 00223',
      active: 'YES'
    },
    {
      code: 'LOC-PUNE',
      name: 'Western Hub Chakan Godown',
      category: 'GODOWN',
      unit: 'NOS',
      minStock: 'Phase II MIDC Chakan Pune',
      maxStock: '0',
      location: '+91 98222 55667',
      active: 'YES'
    }
  ],

  storeTransactions: [
    {
      date: '2026-02-10',
      refNo: 'PO-REC-2026-088',
      itemCode: 'ITM-HT-002',
      itemName: 'Coil Heater Band 230V 650W',
      partyOrDept: 'Rotfil Heating Tech Ltd.',
      qty: '30',
      unit: 'NOS',
      location: 'Bin B-12 (Electrical)',
      tabType: 'PURCHASE RECEIPT',
      status: 'POSTED'
    },
    {
      date: '2026-02-12',
      refNo: 'ISS-MFG-014',
      itemCode: 'ITM-HT-002',
      itemName: 'Coil Heater Band 230V 650W',
      partyOrDept: 'Manufacturing Assembly Bay 1',
      qty: '8',
      unit: 'NOS',
      location: 'Bin B-12 (Electrical)',
      tabType: 'MATERIAL ISSUE',
      status: 'POSTED'
    },
    {
      date: '2026-02-18',
      refNo: 'PO-REC-2026-094',
      itemCode: 'ITM-VG-001',
      itemName: 'Pneumatic Valve Gate Cylinder 16mm',
      partyOrDept: 'SMC Pneumatics India',
      qty: '12',
      unit: 'NOS',
      location: 'Bin A-04 (Tool Store)',
      tabType: 'PURCHASE RECEIPT',
      status: 'POSTED'
    },
    {
      date: '2026-02-25',
      refNo: 'ISS-MFG-022',
      itemCode: 'ITM-VG-001',
      itemName: 'Pneumatic Valve Gate Cylinder 16mm',
      partyOrDept: 'Assembly & Testing Dept',
      qty: '4',
      unit: 'NOS',
      location: 'Bin A-04 (Tool Store)',
      tabType: 'MATERIAL ISSUE',
      status: 'POSTED'
    }
  ],

  accountEntries: [
    {
      date: '2026-02-05',
      tabType: 'SALES',
      particulars: 'Minda Automotive Solutions Ltd.',
      refNo: 'INV-2026-012',
      debit: '0',
      credit: '485000',
      amount: '485000',
      status: 'POSTED'
    },
    {
      date: '2026-02-15',
      tabType: 'RECEIPT',
      particulars: 'Minda Automotive Solutions Ltd. (Advance)',
      refNo: 'RC-2026-004',
      debit: '242500',
      credit: '0',
      amount: '242500',
      status: 'POSTED'
    },
    {
      date: '2026-02-12',
      tabType: 'PURCHASE',
      particulars: 'Rotfil Heating Tech Ltd.',
      refNo: 'BILL-8891',
      debit: '45000',
      credit: '0',
      amount: '45000',
      status: 'POSTED'
    },
    {
      date: '2026-02-20',
      tabType: 'PAYMENT',
      particulars: 'Rotfil Heating Tech Ltd.',
      refNo: 'NEFT-55421',
      debit: '0',
      credit: '45000',
      amount: '45000',
      status: 'POSTED'
    },
    {
      date: '2026-02-26',
      tabType: 'EXPENSES',
      particulars: 'Vacuum Heat Treatment Job Work',
      refNo: 'EXP-0412',
      debit: '28000',
      credit: '0',
      amount: '28000',
      status: 'POSTED'
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
    },
    {
      project_id: 'proj-002',
      stages: {
        design_cad: { status: 'IN_PROGRESS', completed_date: null, notes: 'Sequential drop timing 3D model under design.' },
        cnc_machining: { status: 'PENDING', completed_date: null, notes: 'Material block issued.' },
        gun_drilling: { status: 'PENDING', completed_date: null, notes: 'Flow channels awaiting drilling.' },
        hardening: { status: 'PENDING', completed_date: null, notes: 'Heat treatment pending.' },
        assembly: { status: 'PENDING', completed_date: null, notes: 'Assembly pending.' },
        wiring_testing: { status: 'PENDING', completed_date: null, notes: 'Wiring pending.' },
        final_inspection: { status: 'PENDING', completed_date: null, notes: 'Inspection pending.' }
      },
      current_stage: 'design_cad',
      overall_progress: 15,
      updated_at: '2026-02-20'
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
    },
    {
      id: 'appr-002',
      project_id: 'proj-002',
      project_code: 'RUNO-2026-002',
      title: 'Sequential Drop Gate Pitch & Hydraulic Circuit Approval',
      type: 'DESIGN_APPROVAL',
      requested_by: 'Rohit Sharma',
      approved_by: 'ANAND',
      status: 'PENDING',
      submitted_date: '2026-02-22',
      action_date: null,
      remarks: 'Under technical review by Anand Sharma.'
    }
  ]
};
