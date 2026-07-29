-- ==========================================================
-- Supabase SQL Schema for CRM Pro
-- Run this SQL in your Supabase project SQL Editor:
-- (Dashboard -> SQL Editor -> New Query -> Paste & Run)
-- ==========================================================

-- 1. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT,
  value NUMERIC,
  created_at TEXT,
  avatar TEXT,
  assigned_to TEXT,
  tags JSONB,
  notes JSONB
);

-- 2. Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  value NUMERIC,
  stage TEXT,
  probability INTEGER,
  expected_close_date TEXT,
  contact_id TEXT,
  assigned_to TEXT,
  notes JSONB
);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT,
  completed BOOLEAN,
  deal_id TEXT,
  contact_id TEXT,
  assigned_to TEXT
);

-- 4. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT,
  avatar TEXT,
  active BOOLEAN
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  timestamp TEXT,
  read BOOLEAN,
  type TEXT
);

-- Enable Row Level Security (Optional: disable or add policies for public development access)
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
