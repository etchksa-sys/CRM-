-- ==========================================================
-- Supabase SQL Schema for CRM Pro (Full Support)
-- Run this SQL in your Supabase project SQL Editor:
-- (Dashboard -> SQL Editor -> New Query -> Paste & Run)
-- ==========================================================

-- 1. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  status TEXT,
  tags JSONB,
  avatar TEXT,
  assigned_to TEXT,
  created_at TEXT,
  notes TEXT,
  timeline JSONB
);

-- 2. Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  contact_id TEXT,
  contact_name TEXT,
  company TEXT,
  value NUMERIC,
  probability INTEGER,
  stage TEXT,
  expected_close_date TEXT,
  assigned_to TEXT,
  priority TEXT,
  notes TEXT
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  due_date TEXT,
  due_time TEXT,
  priority TEXT,
  completed BOOLEAN,
  related_to_type TEXT,
  related_to_id TEXT,
  related_to_name TEXT,
  assigned_to TEXT
);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  avatar TEXT,
  deals_count INTEGER,
  revenue_generated NUMERIC,
  conversion_rate NUMERIC,
  status TEXT,
  monthly_target NUMERIC,
  target_period TEXT,
  kpi_score NUMERIC,
  last_active_date TEXT,
  manager_feedback TEXT,
  stagnant_deals_count INTEGER,
  can_create_users BOOLEAN
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  time TEXT,
  read BOOLEAN,
  type TEXT,
  link_target TEXT
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create public access policies for development/production demo
CREATE POLICY "Enable all access for contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for deals" ON deals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
