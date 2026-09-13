-- ============================================================================
-- RUNO HRS INDIA - Stored Procedures (RPC) & Automation Triggers Migration
-- Migration: 20260913000003_rpc_functions.sql
-- ============================================================================

-- 1. Atomic Project Code Generator
CREATE OR REPLACE FUNCTION public.generate_project_code(prefix_val TEXT DEFAULT 'RUNO', yr_val TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  target_year TEXT;
  next_seq INT;
  formatted_code TEXT;
BEGIN
  IF yr_val IS NULL OR yr_val = '' THEN
    target_year := TO_CHAR(NOW(), 'YYYY');
  ELSE
    target_year := yr_val;
  END IF;

  SELECT COALESCE(MAX(SUBSTRING(project_code FROM '[0-9]+$')::INT), 0) + 1
  INTO next_seq
  FROM public.projects
  WHERE project_code LIKE prefix_val || '-' || target_year || '-%';

  formatted_code := prefix_val || '-' || target_year || '-' || LPAD(next_seq::TEXT, 3, '0');
  RETURN formatted_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Store Reorder Alerts Calculator
CREATE OR REPLACE FUNCTION public.get_reorder_alerts()
RETURNS TABLE (
  item_id TEXT,
  item_code TEXT,
  item_name TEXT,
  category TEXT,
  current_qty BIGINT,
  min_stock INT,
  deficit BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH item_balances AS (
    SELECT
      ii.id,
      ii.code,
      ii.name,
      ii.category AS cat,
      ii.min_stock AS m_stock,
      COALESCE(SUM(CASE WHEN sm.tab_type IN ('STOCK IN', 'RETURN') THEN sm.qty ELSE -sm.qty END), 0) AS balance
    FROM public.inventory_items ii
    LEFT JOIN public.stock_movements sm ON sm.item_code = ii.code
    WHERE ii.active = 'YES'
    GROUP BY ii.id, ii.code, ii.name, ii.category, ii.min_stock
  )
  SELECT
    ib.id,
    ib.code,
    ib.name,
    ib.cat,
    ib.balance,
    ib.m_stock,
    (ib.m_stock - ib.balance) AS deficit
  FROM item_balances ib
  WHERE ib.balance <= ib.m_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
