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
    { id: 'mfg-001', sr: 1, project_code: 'RUNO-2026-001', project_desc: 'Rear Lamp Housing', customer: 'Minda Automotive', category: 'HRS', vendor: 'Watlow', planned_start: '18-03-26', planned_end: '28-03-26', actual_end: '-', status: 'IN PROGRESS', progress: 60, priority: 'High', mfg_type: 'New', qty: '1 Set', incharge: 'Vikram Singh', machine: 'CNC Milling 01', remarks: '5-Axis roughing completed.' },
    { id: 'mfg-002', sr: 2, project_code: 'RUNO-2026-002', project_desc: 'Bracket Cover', customer: 'Tata Motors', category: 'HRTC', vendor: 'Omega', planned_start: '20-03-26', planned_end: '02-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 40, priority: 'Normal', mfg_type: 'New', qty: '2 Sets', incharge: 'Rajesh Sharma', machine: 'EDM Wirecut 01', remarks: 'Electrode manufacturing done.' },
    { id: 'mfg-003', sr: 3, project_code: 'RUNO-2026-003', project_desc: 'Front Panel', customer: 'LG Electronics', category: 'HRS', vendor: 'Steelage', planned_start: '22-03-26', planned_end: '30-03-26', actual_end: '29-03-26', status: 'COMPLETED', progress: 100, priority: 'Normal', mfg_type: 'New', qty: '1 Set', incharge: 'Anand Sharma', machine: 'Assembly Bay 1', remarks: 'CMM inspection passed.' },
    { id: 'mfg-004', sr: 4, project_code: 'RUNO-2026-004', project_desc: 'Switch Housing', customer: 'Bajaj Auto', category: 'SPARE - HRS', vendor: 'Meusburger', planned_start: '25-03-26', planned_end: '05-04-26', actual_end: '-', status: 'NOT STARTED', progress: 0, priority: 'Normal', mfg_type: 'New', qty: '4 Sets', incharge: 'Vikram Singh', machine: 'Surface Grinder 01', remarks: 'Raw material block received.' },
    { id: 'mfg-005', sr: 5, project_code: 'RUNO-2026-005', project_desc: 'Sensor Cover', customer: 'Bosch India', category: 'HRS', vendor: 'Tempco', planned_start: '26-03-26', planned_end: '06-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 50, priority: 'High', mfg_type: 'New', qty: '1 Set', incharge: 'Rakesh Verma', machine: 'CNC Milling 02', remarks: 'Gun drilling completed.' },
    { id: 'mfg-006', sr: 6, project_code: 'RUNO-2026-006', project_desc: 'Connector Housing', customer: 'Hero MotoCorp', category: 'HRTC', vendor: 'LKM', planned_start: '28-03-26', planned_end: '07-04-26', actual_end: '-', status: 'ON HOLD', progress: 30, priority: 'Critical', mfg_type: 'Modification', qty: '1 Set', incharge: 'Rajesh Sharma', machine: 'EDM Wirecut 01', remarks: 'Awaiting customer drawing revision.' },
    { id: 'mfg-007', sr: 7, project_code: 'RUNO-2026-007', project_desc: 'Dashboard Housing', customer: 'Mahindra', category: 'SPARE - HRTC', vendor: 'Igus', planned_start: '29-03-26', planned_end: '10-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 70, priority: 'Normal', mfg_type: 'New', qty: '2 Sets', incharge: 'Vikram Singh', machine: 'Assembly Bay 2', remarks: 'Wiring ongoing.' },
    { id: 'mfg-008', sr: 8, project_code: 'RUNO-2026-008', project_desc: 'Actuator Cover', customer: 'Valeo', category: 'HRS', vendor: 'Harting', planned_start: '01-04-26', planned_end: '12-04-26', actual_end: '-', status: 'REWORK', progress: 20, priority: 'High', mfg_type: 'Rework', qty: '1 Set', incharge: 'Rakesh Verma', machine: 'CNC Milling 01', remarks: 'Gate orifice re-machining required.' },
    { id: 'mfg-009', sr: 9, project_code: 'RUNO-2026-009', project_desc: 'EGR Housing', customer: 'Denso', category: 'HRTC', vendor: 'Yudo', planned_start: '02-04-26', planned_end: '14-04-26', actual_end: '13-04-26', status: 'COMPLETED', progress: 100, priority: 'Normal', mfg_type: 'New', qty: '1 Set', incharge: 'Anand Sharma', machine: 'Assembly Bay 1', remarks: 'Hot test certified.' },
    { id: 'mfg-010', sr: 10, project_code: 'RUNO-2026-010', project_desc: 'Mirror Base', customer: 'Motherson', category: 'SPARE - HRS', vendor: 'Festo', planned_start: '03-04-26', planned_end: '16-04-26', actual_end: '-', status: 'NOT STARTED', progress: 0, priority: 'Normal', mfg_type: 'New', qty: '2 Sets', incharge: 'Vikram Singh', machine: 'CNC Milling 02', remarks: 'Tool path generation scheduled.' },
    { id: 'mfg-011', sr: 11, project_code: 'RUNO-2026-011', project_desc: 'Valve Bracket', customer: 'Hyundai', category: 'HRS', vendor: 'Misumi', planned_start: '04-04-26', planned_end: '18-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 45, priority: 'Normal', mfg_type: 'New', qty: '1 Set', incharge: 'Rajesh Sharma', machine: 'Surface Grinder 01', remarks: 'Plates ground flat.' },
    { id: 'mfg-012', sr: 12, project_code: 'RUNO-2026-012', project_desc: 'Manifold Block', customer: 'Kia', category: 'HRTC', vendor: 'Rogers', planned_start: '05-04-26', planned_end: '20-04-26', actual_end: '-', status: 'ON HOLD', progress: 25, priority: 'Urgent', mfg_type: 'New', qty: '1 Set', incharge: 'Vikram Singh', machine: 'CNC Milling 01', remarks: 'Certification awaited.' },
    { id: 'mfg-013', sr: 13, project_code: 'RUNO-2026-013', project_desc: 'Nozzle Tip', customer: 'Maruti Suzuki', category: 'SPARE - HRTC', vendor: 'Trelleborg', planned_start: '06-04-26', planned_end: '22-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 55, priority: 'High', mfg_type: 'New', qty: '8 Sets', incharge: 'Rakesh Verma', machine: 'CNC Lathe 01', remarks: 'Copper tips turned.' },
    { id: 'mfg-014', sr: 14, project_code: 'RUNO-2026-014', project_desc: 'Heater Band', customer: 'Ashok Leyland', category: 'HRS', vendor: 'Local', planned_start: '07-04-26', planned_end: '24-04-26', actual_end: '-', status: 'NOT STARTED', progress: 0, priority: 'Normal', mfg_type: 'New', qty: '6 Sets', incharge: 'Rajesh Sharma', machine: 'Assembly Bay 2', remarks: 'Requisition raised.' },
    { id: 'mfg-015', sr: 15, project_code: 'RUNO-2026-015', project_desc: 'Air Vent', customer: 'TVS Motors', category: 'SPARE - HRS', vendor: 'CoorsTek', planned_start: '08-04-26', planned_end: '26-04-26', actual_end: '-', status: 'IN PROGRESS', progress: 35, priority: 'Normal', mfg_type: 'New', qty: '3 Sets', incharge: 'Vikram Singh', machine: 'EDM Wirecut 01', remarks: 'Slit EDM done.' }
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
  ],

  purchaseRequests: [
    {
      sr: 1, id: 'pr-001', pr_no: 'PR-2026-001', date: '10-03-26', project_code: 'RUNO-2026-001',
      project_desc: 'Rear Lamp Housing', item_desc: 'Heater Cartridge Ø8x100', qty: 10, unit: 'Nos',
      pr_by: 'Rahul S.', required_date: '15-03-26', status: 'Pending', po_no: '-', vendor: 'Watlow', category: 'HRS'
    },
    {
      sr: 2, id: 'pr-002', pr_no: 'PR-2026-002', date: '10-03-26', project_code: 'RUNO-2026-001',
      project_desc: 'Rear Lamp Housing', item_desc: 'Thermocouple Type J', qty: 10, unit: 'Nos',
      pr_by: 'Rahul S.', required_date: '15-03-26', status: 'Approved', po_no: '-', vendor: 'Omega', category: 'HRS'
    },
    {
      sr: 3, id: 'pr-003', pr_no: 'PR-2026-003', date: '11-03-26', project_code: 'RUNO-2026-002',
      project_desc: 'Bracket Cover', item_desc: 'Manifold Block (H13)', qty: 1, unit: 'Set',
      pr_by: 'Amit K.', required_date: '20-03-26', status: 'PO Released', po_no: 'PO-2026-008', vendor: 'Steelage', category: 'HRS'
    },
    {
      sr: 4, id: 'pr-004', pr_no: 'PR-2026-004', date: '12-03-26', project_code: 'RUNO-2026-003',
      project_desc: 'Front Panel', item_desc: 'Nozzle Tip', qty: 8, unit: 'Nos',
      pr_by: 'Neha P.', required_date: '18-03-26', status: 'In Transit', po_no: 'PO-2026-009', vendor: 'Meusburger', category: 'HRS'
    },
    {
      sr: 5, id: 'pr-005', pr_no: 'PR-2026-005', date: '12-03-26', project_code: 'RUNO-2026-004',
      project_desc: 'Switch Housing', item_desc: 'Heater Band', qty: 6, unit: 'Nos',
      pr_by: 'Suresh M.', required_date: '20-03-26', status: 'Received', po_no: 'PO-2026-010', vendor: 'Tempco', category: 'HRS'
    },
    {
      sr: 6, id: 'pr-006', pr_no: 'PR-2026-006', date: '13-03-26', project_code: 'RUNO-2026-004',
      project_desc: 'Switch Housing', item_desc: 'Mould Base Plate', qty: 2, unit: 'Nos',
      pr_by: 'Suresh M.', required_date: '22-03-26', status: 'PO Released', po_no: 'PO-2026-011', vendor: 'LKM', category: 'HRS'
    },
    {
      sr: 7, id: 'pr-007', pr_no: 'PR-2026-007', date: '13-03-26', project_code: 'RUNO-2026-005',
      project_desc: 'Sensor Cover', item_desc: 'Cables (High Temp)', qty: 20, unit: 'Mtr',
      pr_by: 'Kiran D.', required_date: '18-03-26', status: 'In Transit', po_no: 'PO-2026-012', vendor: 'Igus', category: 'HRS'
    },
    {
      sr: 8, id: 'pr-008', pr_no: 'PR-2026-008', date: '14-03-26', project_code: 'RUNO-2026-006',
      project_desc: 'Connector Housing', item_desc: 'Connector 16 Pin', qty: 10, unit: 'Nos',
      pr_by: 'Priya S.', required_date: '20-03-26', status: 'Approved', po_no: '-', vendor: 'Harting', category: 'HRS'
    },
    {
      sr: 9, id: 'pr-009', pr_no: 'PR-2026-009', date: '14-03-26', project_code: 'RUNO-2026-007',
      project_desc: 'Dashboard Housing', item_desc: 'Temperature Controller', qty: 2, unit: 'Nos',
      pr_by: 'Rohit T.', required_date: '21-03-26', status: 'Pending', po_no: '-', vendor: 'Yudo', category: 'HRTC'
    },
    {
      sr: 10, id: 'pr-010', pr_no: 'PR-2026-010', date: '15-03-26', project_code: 'RUNO-2026-008',
      project_desc: 'Actuator Cover', item_desc: 'Actuator Cylinder', qty: 4, unit: 'Nos',
      pr_by: 'Sneha V.', required_date: '25-03-26', status: 'PO Released', po_no: 'PO-2026-013', vendor: 'Festo', category: 'HRS'
    },
    {
      sr: 11, id: 'pr-011', pr_no: 'PR-2026-011', date: '15-03-26', project_code: 'RUNO-2026-009',
      project_desc: 'EGR Housing', item_desc: 'Spring', qty: 20, unit: 'Nos',
      pr_by: 'Manish G.', required_date: '22-03-26', status: 'Received', po_no: 'PO-2026-014', vendor: 'Misumi', category: 'HRS'
    },
    {
      sr: 12, id: 'pr-012', pr_no: 'PR-2026-012', date: '16-03-26', project_code: 'RUNO-2026-010',
      project_desc: 'Mirror Base', item_desc: 'Insulation Plate', qty: 4, unit: 'Nos',
      pr_by: 'Pooja R.', required_date: '24-03-26', status: 'In Transit', po_no: 'PO-2026-015', vendor: 'Rogers', category: 'HRS'
    },
    {
      sr: 13, id: 'pr-013', pr_no: 'PR-2026-013', date: '16-03-26', project_code: 'RUNO-2026-011',
      project_desc: 'Air Vent', item_desc: 'Sealing Ring', qty: 50, unit: 'Nos',
      pr_by: 'Ajay S.', required_date: '22-03-26', status: 'Approved', po_no: '-', vendor: 'Trelleborg', category: 'HRS'
    },
    {
      sr: 14, id: 'pr-014', pr_no: 'PR-2026-014', date: '17-03-26', project_code: 'RUNO-2026-012',
      project_desc: 'Console Panel', item_desc: 'Fasteners (SS)', qty: 100, unit: 'Nos',
      pr_by: 'Ritu M.', required_date: '24-03-26', status: 'Pending', po_no: '-', vendor: 'Local', category: 'HRS'
    },
    {
      sr: 15, id: 'pr-015', pr_no: 'PR-2026-015', date: '17-03-26', project_code: 'Handle 2026-013',
      project_desc: 'Handle Cover', item_desc: 'Ceramic Insulator', qty: 20, unit: 'Nos',
      pr_by: 'Nikhil P.', required_date: '25-03-26', status: 'In Review', po_no: '-', vendor: 'CoorsTek', category: 'HRS'
    }
  ]
};
