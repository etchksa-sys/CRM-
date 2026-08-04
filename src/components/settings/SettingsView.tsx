import React, { useState } from 'react';
import { Settings as SettingsIcon, RefreshCw, Download, Upload, Moon, Sun, Globe, Bell, ShieldCheck, Database, CheckCircle2, AlertTriangle, Sparkles, Cloud, ExternalLink, Code, Copy, Check } from 'lucide-react';
import { resetAllStorageToDefaults } from '../../data/mockData';
import { Deal, Contact, UserAccount, Task, NotificationItem } from '../../types';
import { exportFullSystemToExcel } from '../../utils/excelExport';
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseConfig } from '../../lib/supabase';
import { seedSupabaseData } from '../../lib/supabaseService';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onTriggerToast: (title: string, message: string, type: 'success' | 'info') => void;
  deals?: Deal[];
  contacts?: Contact[];
  users?: UserAccount[];
  tasks?: Task[];
  notifications?: NotificationItem[];
  language?: string;
}

const SUPABASE_SQL_CODE = `-- ==========================================================
-- Supabase SQL Schema for CRM Pro
-- Run this SQL in your Supabase project SQL Editor:
-- (Dashboard -> SQL Editor -> New Query -> Paste & Run)
-- ==========================================================

-- 1. Contacts Table
CREATE TABLE IF NOT EXISTS public.contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  source TEXT,
  status TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  avatar TEXT,
  assigned_to TEXT,
  created_at TEXT,
  notes TEXT,
  timeline JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS created_at TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;

-- 2. Deals Table
CREATE TABLE IF NOT EXISTS public.deals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  contact_id TEXT,
  contact_name TEXT,
  company TEXT,
  value NUMERIC DEFAULT 0,
  probability INT4 DEFAULT 50,
  stage TEXT,
  expected_close_date TEXT,
  assigned_to TEXT,
  priority TEXT,
  notes TEXT
);

ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS contact_id TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS value NUMERIC DEFAULT 0;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS probability INT4 DEFAULT 50;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS stage TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS expected_close_date TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS priority TEXT;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  due_date TEXT,
  due_time TEXT,
  priority TEXT,
  completed BOOLEAN DEFAULT false,
  related_to_type TEXT,
  related_to_id TEXT,
  related_to_name TEXT,
  assigned_to TEXT
);

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_date TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_time TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS priority TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS related_to_type TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS related_to_id TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS related_to_name TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- 4. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  phone TEXT,
  avatar TEXT,
  deals_count INT4 DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 100,
  status TEXT DEFAULT 'active',
  monthly_target NUMERIC,
  target_period TEXT,
  kpi_score NUMERIC DEFAULT 100,
  last_active_date TEXT,
  manager_feedback TEXT,
  stagnant_deals_count INT4 DEFAULT 0,
  can_create_users BOOLEAN DEFAULT true
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deals_count INT4 DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS revenue_generated NUMERIC DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS conversion_rate NUMERIC DEFAULT 100;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS monthly_target NUMERIC;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS target_period TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kpi_score NUMERIC DEFAULT 100;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_active_date TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS manager_feedback TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS stagnant_deals_count INT4 DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS can_create_users BOOLEAN DEFAULT true;

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  time TEXT,
  read BOOLEAN DEFAULT false,
  type TEXT,
  link_target TEXT
);

ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS time TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT false;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS link_target TEXT;

-- Enable Row Level Security (RLS) and grant full public access for anon role
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon all on contacts" ON public.contacts;
CREATE POLICY "Allow anon all on contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on deals" ON public.deals;
CREATE POLICY "Allow anon all on deals" ON public.deals FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on tasks" ON public.tasks;
CREATE POLICY "Allow anon all on tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on users" ON public.users;
CREATE POLICY "Allow anon all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on notifications" ON public.notifications;
CREATE POLICY "Allow anon all on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);`;

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  onTriggerToast,
  deals = [],
  contacts = [],
  users = [],
  tasks = [],
  notifications = [],
  language = 'ar'
}) => {
  const handleResetDemoData = () => {
    if (confirm(language === 'en' ? 'Are you sure you want to reset all demo data to default?' : 'هل أنت متأكد من إعادة ضبط كافة العينات والبيانات إلى الوضع الأصلي (الافتراضي)؟ سيتم حذف أي إضافات جديدة قمت بها.')) {
      resetAllStorageToDefaults();
    }
  };

  const handleExportExcel = () => {
    exportFullSystemToExcel(deals, contacts, users);
    onTriggerToast(
      language === 'en' ? 'Excel Export Successful 📊' : 'تم تصدير ملف Excel بنجاح 📊',
      language === 'en' ? 'All CRM records exported to Excel compatible CSV.' : 'تم تحميل كافة سجلات العملاء والصفقات والموظفين في ملف CSV متوافق مع Excel.',
      'success'
    );
  };

  const handleExportJSON = () => {
    const data = { deals, contacts, users, tasks, notifications, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'crm_pro_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onTriggerToast(
      language === 'en' ? 'JSON Backup Created 💾' : 'تم إنشاء نسخة احتياطية (JSON) بنجاح 💾',
      language === 'en' ? 'All CRM system records saved locally.' : 'تم حفظ جميع سجلات النظام في ملف محلي.',
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" /> 
            {language === 'en' ? 'System Settings & Data Management' : 'إعدادات النظام وإدارة البيانات النسخ الاحتياطي'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'en' ? 'Manage system options, data export, dark mode & preferences' : 'إدارة خيارات النظام، تصدير البيانات والنسخ الاحتياطي، الوضع الليلي، والتنبيهات التلقائية'}
          </p>
        </div>
      </div>

      {/* Section 1: Appearance & RTL Layout */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
          <Globe className="w-4 h-4 text-blue-500" /> {language === 'en' ? 'Appearance & Localization' : 'المظهر العام واللغة (Localization & UI)'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">{language === 'en' ? 'Theme Mode' : 'وضع الألوان (Light / Dark Mode)'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{language === 'en' ? 'Switch between day and night mode' : 'تبديل الواجهة بين الوضع النهاري والمريح للعين ليلاً'}</p>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? (language === 'en' ? 'Dark' : 'ليلي') : (language === 'en' ? 'Light' : 'نهاري')}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">{language === 'en' ? 'UI Direction' : 'اتجاه الواجهة (RTL Arabic Support)'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{language === 'en' ? 'Optimized for Arabic & English' : 'مفعل بنجاح لدعم العربية والإنجليزية'}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-xs font-black">
              {language === 'en' ? 'Active ✓' : 'مفعّل بنجاح ✓'}
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Data Management & Backup */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
          <Database className="w-4 h-4 text-purple-500" /> {language === 'en' ? 'Data Management & Export' : 'إدارة البيانات، الاستيراد والتصدير (Data Management)'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">{language === 'en' ? 'System Backup & Export' : 'نسخ احتياطي وتصدير البيانات (Export)'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {language === 'en' ? 'Export all CRM records to Excel (CSV) or JSON backup' : 'تصدير كافة سجلات العملاء والصفقات والفريق بملف Excel (CSV) أو JSON للحفظ والنقل'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> {language === 'en' ? 'Excel Export' : 'تصدير Excel'}
              </button>
              <button
                onClick={handleExportJSON}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> {language === 'en' ? 'JSON Export' : 'تصدير JSON'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 flex flex-col justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> {language === 'en' ? 'Reset Demo Data' : 'إعادة ضبط البيانات التوضيحية (Reset Demo)'}
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-400 mt-1">
                {language === 'en' ? 'Restore original sample records and clean test data' : 'إذا قمت بتجربة الإضافة أو التعديل وترغب بالعودة إلى البيانات التوضيحية الأصلية للنظام'}
              </p>
            </div>
            <button
              onClick={handleResetDemoData}
              className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-4 h-4" /> {language === 'en' ? 'Reset Demo Data Now' : 'إعادة ضبط البيانات الآن'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
