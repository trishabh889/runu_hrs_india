-- ============================================================================
-- RUNO HRS INDIA - Initial Database Schema Migration
-- Migration: 20260913000001_initial_schema.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'DESIGN',
    department TEXT DEFAULT 'DESIGN',
    designation TEXT DEFAULT 'Staff',
    status TEXT DEFAULT 'PENDING_APPROVAL',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    customer_code TEXT,
    contact_person TEXT,
    designation TEXT,
    phone TEXT,
    email TEXT,
    gstin TEXT,
    pan TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    city_state TEXT,
    pincode TEXT,
    category TEXT DEFAULT 'PROSPECT',
    section TEXT DEFAULT 'HRS',
    total_projects INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    project_code TEXT UNIQUE NOT NULL,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    part_name TEXT,
    mould_description TEXT,
    category TEXT DEFAULT 'HRS',
    section TEXT DEFAULT 'HOT RUNNER SYSTEM',
    quote_status TEXT DEFAULT 'PENDING',
    po_received TEXT DEFAULT 'NO',
    nozzle_count INT DEFAULT 1,
    num_drops TEXT DEFAULT '1',
    manifold_type TEXT,
    runner_diameter TEXT,
    gate_type TEXT,
    material TEXT,
    plastic_grade TEXT,
    shot_weight TEXT,
    part_weight TEXT,
    color_change TEXT DEFAULT 'NO',
    mould_type TEXT,
    year TEXT,
    order_date DATE,
    target_date DATE,
    delivery_date DATE,
    status TEXT DEFAULT 'ACTIVE',
    priority TEXT DEFAULT 'MEDIUM',
    project_manager TEXT,
    lead_engineer TEXT,
    order_value NUMERIC(14, 2) DEFAULT 0,
    value TEXT,
    cost TEXT,
    hrs_type TEXT,
    nozzle_series TEXT,
    connector TEXT,
    gate_dia TEXT,
    guide_dia TEXT,
    remark TEXT,
    design_check TEXT DEFAULT 'NOT CHECKED',
    owner TEXT DEFAULT 'VIKRAM',
    created_by TEXT DEFAULT 'ANAND',
    notes TEXT,
    workflow_milestones JSONB DEFAULT '{"2dStart": "-", "2dEnd": "-", "3dStart": "-", "3dEnd": "-", "designSend": "-"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Manufacturing Jobs Table
CREATE TABLE IF NOT EXISTS public.manufacturing_jobs (
    id TEXT PRIMARY KEY,
    project_code TEXT REFERENCES public.projects(project_code) ON DELETE CASCADE,
    description TEXT,
    customer TEXT,
    category TEXT DEFAULT 'HRS',
    vendor TEXT DEFAULT 'In-House',
    planned_start DATE,
    planned_end DATE,
    actual_end DATE,
    status TEXT DEFAULT 'NOT STARTED',
    progress INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Inventory Items Table
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'GENERAL',
    unit TEXT DEFAULT 'NOS',
    min_stock INT DEFAULT 5,
    max_stock INT DEFAULT 50,
    location TEXT,
    active TEXT DEFAULT 'YES',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Stock Movements Table
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    tab_type TEXT NOT NULL,
    ref_no TEXT,
    item_code TEXT REFERENCES public.inventory_items(code) ON DELETE CASCADE,
    item_name TEXT,
    party_or_dept TEXT,
    qty INT DEFAULT 0,
    unit TEXT DEFAULT 'NOS',
    location TEXT,
    status TEXT DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Accounts Vouchers Table
CREATE TABLE IF NOT EXISTS public.vouchers (
    id TEXT PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    voucher_type TEXT NOT NULL,
    particulars TEXT,
    ref_no TEXT,
    amount NUMERIC(14, 2) DEFAULT 0,
    debit NUMERIC(14, 2) DEFAULT 0,
    credit NUMERIC(14, 2) DEFAULT 0,
    status TEXT DEFAULT 'POSTED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Purchase Requests Table
CREATE TABLE IF NOT EXISTS public.purchase_requests (
    id TEXT PRIMARY KEY,
    pr_number TEXT UNIQUE NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    project_code TEXT,
    category TEXT DEFAULT 'HRS',
    item_name TEXT,
    qty INT DEFAULT 1,
    unit TEXT DEFAULT 'NOS',
    supplier_vendor TEXT,
    estimated_cost NUMERIC(14, 2) DEFAULT 0,
    status TEXT DEFAULT 'Pending',
    priority TEXT DEFAULT 'Normal',
    requested_by TEXT,
    purpose TEXT,
    internal_remarks TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Approvals Table
CREATE TABLE IF NOT EXISTS public.approvals (
    id TEXT PRIMARY KEY,
    item_type TEXT NOT NULL,
    submitted_by TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'PENDING',
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Audit Events Table
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
