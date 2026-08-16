import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, RefreshCw, Download, Upload, Moon, Sun, Globe, Bell, ShieldCheck, Database, CheckCircle2, AlertTriangle, Sparkles, User, Camera, Mail, Phone, Lock, Save, Image as ImageIcon } from 'lucide-react';
import { resetAllStorageToDefaults, getRoleBadge, getRoleLabel } from '../../data/mockData';
import { Deal, Contact, UserAccount, Task, NotificationItem } from '../../types';
import { exportFullSystemToExcel } from '../../utils/excelExport';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onTriggerToast: (title: string, message: string, type: 'success' | 'info') => void;
  deals?: Deal[];
  contacts?: Contact[];
  users?: UserAccount[];
  tasks?: Task[];
  notifications?: NotificationItem[];
  currentUser?: UserAccount;
  onUpdateCurrentUser?: (updatedUser: UserAccount) => void;
  language?: string;
}

const PRESET_AVATARS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', label: 'صورة 1' },
  { id: '2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', label: 'صورة 2' },
  { id: '3', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', label: 'صورة 3' },
  { id: '4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', label: 'صورة 4' },
  { id: '5', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250', label: 'صورة 5' },
  { id: '6', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', label: 'صورة 6' },
  { id: '7', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', label: 'صورة 7' },
  { id: '8', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250', label: 'صورة 8' },
];

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
  currentUser,
  onUpdateCurrentUser,
  language = 'ar'
}) => {
  // Profile Settings Form State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [profilePassword, setProfilePassword] = useState(currentUser?.tempPassword || '');
  const [profileNotes, setProfileNotes] = useState(currentUser?.managerFeedback || '');

  // Keep state synced with currentUser if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfilePhone(currentUser.phone || '');
      setProfileAvatar(currentUser.avatar || '');
      setProfilePassword(currentUser.tempPassword || '');
      setProfileNotes(currentUser.managerFeedback || '');
    }
  }, [currentUser]);

  // Handle Local Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        onTriggerToast(
          language === 'en' ? 'File Too Large ⚠️' : 'حجم الصورة كبير جداً ⚠️',
          language === 'en' ? 'Please choose an image under 5MB.' : 'يرجى اختيار صورة بحجم أصل من 5 ميجابايت.',
          'info'
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileAvatar(reader.result);
          onTriggerToast(
            language === 'en' ? 'Photo Loaded 📸' : 'تم اختيار الصورة بنجاح 📸',
            language === 'en' ? 'Click Save Changes to apply to your profile.' : 'اضغط على حفظ التعديلات لتحديث حسابك والصورة.',
            'success'
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Profile Form
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !onUpdateCurrentUser) return;

    const updatedUser: UserAccount = {
      ...currentUser,
      name: profileName.trim() || currentUser.name,
      email: profileEmail.trim() || currentUser.email,
      phone: profilePhone.trim() || currentUser.phone,
      avatar: profileAvatar.trim() || currentUser.avatar,
      tempPassword: profilePassword.trim() || currentUser.tempPassword,
      managerFeedback: profileNotes.trim()
    };

    onUpdateCurrentUser(updatedUser);
    onTriggerToast(
      language === 'en' ? 'Profile Updated 🎉' : 'تم حفظ الملف الشخصي بنجاح 🎉',
      language === 'en' ? 'Your personal details and profile picture have been updated.' : `تم حفظ وتحديث بيانات وقوالب الحساب الخاص بـ (${updatedUser.name}).`,
      'success'
    );
  };

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
            {language === 'en' ? 'System Settings & Data Management' : 'إعدادات النظام وإدارة البيانات والملف الشخصي'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'en' ? 'Manage system options, profile photo, dark mode & preferences' : 'إدارة الملف الشخصي، تغيير الصورة والمعلومات، التصدير، الوضع الليلي والتفضيلات'}
          </p>
        </div>
      </div>

      {/* Profile Settings Card */}
      {currentUser && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                  {language === 'en' ? 'User Profile & Avatar Settings' : 'إعدادات الملف الشخصي وصورة الحساب (My Profile)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'en' ? 'Update your display name, contact info, login credentials and photo' : 'قم بتعديل اسمك، بريدك الإلكتروني، رقم الجوال، والصورة الشخصية الخاصة بك'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {getRoleBadge(currentUser.role)} {getRoleLabel(currentUser.role)}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            {/* Avatar Selection & Preview */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-500" />
                <span>{language === 'en' ? 'Profile Picture / Avatar' : 'الصورة الشخصية (Profile Picture)'}</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Current Avatar Circle */}
                <div className="relative group shrink-0">
                  <img
                    src={profileAvatar || currentUser.avatar}
                    alt={currentUser.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/30 dark:ring-blue-400/40 shadow-md"
                  />
                  <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 w-full space-y-3">
                  {/* Upload File or Enter URL */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span>{language === 'en' ? 'Upload Photo from Device' : 'رفع صورة من جهازك 📁'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex-1 min-w-[200px] relative">
                      <input
                        type="url"
                        value={profileAvatar}
                        onChange={(e) => setProfileAvatar(e.target.value)}
                        placeholder={language === 'en' ? 'Or paste image URL link...' : 'أو ألصق رابط صورة مباشر (URL)...'}
                        className="w-full pl-3 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  {/* Preset Avatars Gallery */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                      {language === 'en' ? 'Or pick a professional preset avatar:' : 'أو اختر صورة رمزية من القائمة الجاهزة:'}
                    </p>
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                      {PRESET_AVATARS.map((preset) => {
                        const isSelected = profileAvatar === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setProfileAvatar(preset.url)}
                            className={`relative shrink-0 rounded-full transition-transform hover:scale-110 ${
                              isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : 'opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Full Name' : 'الاسم الكامل *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Email Address' : 'البريد الإلكتروني *'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Phone Number' : 'رقم الجوال'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+966 50 000 0000"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Password / Security Pin' : 'كلمة المرور / الرمز السري'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="كلمة المرور..."
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <Lock className="w-4 h-4 text-amber-500 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Job Title / Bio Notes' : 'المسمى الوظيفي أو الملاحظات الشخصية'}
              </label>
              <textarea
                rows={2}
                value={profileNotes}
                onChange={(e) => setProfileNotes(e.target.value)}
                placeholder={language === 'en' ? 'Add any notes about your responsibilities...' : 'اكتب نبذة أو ملاحظات عن المهام والمسؤوليات...'}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'en' ? 'Save Profile Changes' : 'حفظ التعديلات والبيانات الشخصية'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

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
