-- ============================================================================
-- RUNO HRS INDIA - Row Level Security (RLS) & Access Control Migration
-- Migration: 20260913000002_rls_policies.sql
-- ============================================================================

-- Enable Row Level Security on all core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is an approved active user
CREATE OR REPLACE FUNCTION public.is_approved_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND (is_approved = TRUE OR status = 'APPROVED')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public read profiles" ON public.profiles
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 2. Domain Data Policies (Full CRUD for approved authenticated users)
CREATE POLICY "Approved users full access customers" ON public.customers
  FOR ALL TO authenticated USING (public.is_approved_user());

CREATE POLICY "Approved users full access projects" ON public.projects
  FOR ALL TO authenticated USING (public.is_approved_user());

CREATE POLICY "Approved users full access manufacturing" ON public.manufacturing_jobs
  FOR ALL TO authenticated USING (public.is_approved_user());

CREATE POLICY "Approved users full access inventory" ON public.inventory_items
  FOR ALL TO authenticated USING (public.is_approved_user());

CREATE POLICY "Approved users full access stock_movements" ON public.stock_movements
  FOR ALL TO authenticated USING (public.is_approved_user());

CREATE POLICY "Approved users full access vouchers" ON public.vouchers
  FOR ALL TO authenticated USING (public.is_approved_user());

CREATE POLICY "Approved users full access purchase_requests" ON public.purchase_requests
  FOR ALL TO authenticated USING (public.is_approved_user());

CREATE POLICY "Approved users full access approvals" ON public.approvals
  FOR ALL TO authenticated USING (public.is_approved_user());

-- Read-only fallback for anon key during setup or public demo viewing
CREATE POLICY "Anon read customers" ON public.customers FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read projects" ON public.projects FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read inventory" ON public.inventory_items FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read purchase" ON public.purchase_requests FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read manufacturing" ON public.manufacturing_jobs FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read vouchers" ON public.vouchers FOR SELECT TO anon USING (true);
CREATE POLICY "Anon read stock_movements" ON public.stock_movements FOR SELECT TO anon USING (true);
