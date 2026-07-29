import React, { useState } from 'react';
import { Settings as SettingsIcon, RefreshCw, Download, Upload, Moon, Sun, Globe, Bell, ShieldCheck, Database, CheckCircle2, AlertTriangle, Sparkles, Cloud, ExternalLink } from 'lucide-react';
import { resetAllStorageToDefaults } from '../../data/mockData';
import { Deal, Contact, UserAccount } from '../../types';
import { exportFullSystemToExcel } from '../../utils/excelExport';
import { isSupabaseConfigured, saveSupabaseConfig } from '../../lib/supabase';

interface SettingsViewProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onTriggerToast: (title: string, message: string, type: 'success' | 'info') => void;
  deals?: Deal[];
  contacts?: Contact[];
  users?: UserAccount[];
  language?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onToggleTheme,
  onTriggerToast,
  deals = [],
  contacts = [],
  users = [],
  language = 'ar'
}) => {
  const [emailNotifs, setEmailNotifs] = useState({
    dealWon: true,
    newLead: true,
    taskDue: true,
    weeklyReport: false
  });

  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('crm_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('crm_supabase_key') || '');
  const [supabaseConnected, setSupabaseConnected] = useState(isSupabaseConfigured());

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      onTriggerToast(
        language === 'en' ? 'Missing fields' : 'حقول ناقصة',
        language === 'en' ? 'Please enter both Supabase URL and Anon Key.' : 'يرجى إدخال رابط مشروع Supabase ومفتاح الـ Anon Key.',
        'info'
      );
      return;
    }
    saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
    setSupabaseConnected(true);
    onTriggerToast(
      language === 'en' ? 'Supabase Connected Successfully! 🚀' : 'تم ربط Supabase بنجاح! 🚀',
      language === 'en' ? 'Database client initialized and synced.' : 'تم تهيئة اتصال قاعدة البيانات بنجاح.',
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
    const data = { deals, contacts, users, exportedAt: new Date().toISOString() };
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
            {language === 'en' ? 'System Settings & Integrations' : 'إعدادات النظام، الربط السحابي (Supabase) والنشر (Vercel)'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'en' ? 'Manage database connections, Vercel deployment config, dark mode & notifications' : 'إدارة قواعد البيانات السحابية Supabase، النشر على Vercel، الوضع الليلي، والتنبيهات التلقائية'}
          </p>
        </div>
      </div>

      {/* Section 0: Supabase Cloud Database Integration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
          <Cloud className="w-4 h-4 text-emerald-500" /> 
          {language === 'en' ? 'Supabase Database Integration' : 'ربط قاعدة بيانات سحابية (Supabase Database)'}
        </h4>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {language === 'en' 
            ? 'Connect your Supabase project to persist all CRM contacts, deals, and tasks in a real-time PostgreSQL database.' 
            : 'قم بربط مشروعك على Supabase لحفظ وتخزين جميع سجلات العملاء، الصفقات، والمهام في قاعدة بيانات PostgreSQL حية وآمنة.'}
        </p>

        <form onSubmit={handleSaveSupabase} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                {language === 'en' ? 'Supabase Project URL' : 'رابط المشروع (Supabase URL)'}
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzproject.supabase.co"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3 text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                {language === 'en' ? 'Supabase Anon Key' : 'مفتاح الأمان (Anon / Public Key)'}
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3 text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${supabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {supabaseConnected 
                  ? (language === 'en' ? 'Supabase Status: Connected & Active' : 'حالة الاتصال: متصل بقاعدة بيانات Supabase بنجاح ✓') 
                  : (language === 'en' ? 'Status: Local Storage Mode (Enter keys to switch to Supabase)' : 'حالة الاتصال: وضع التخزين المحلي (أدخل بيانات Supabase للتفعيل)')}
              </span>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>{language === 'en' ? 'Save & Connect Supabase' : 'حفظ وربط Supabase'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 1: Vercel Deployment Guide */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
          <Globe className="w-4 h-4 text-blue-500" /> 
          {language === 'en' ? 'Vercel Deployment Instructions' : 'تعليمات النشر على منصة Vercel'}
        </h4>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {language === 'en'
              ? 'This project is fully configured for seamless deployment on Vercel with support for frontend SPA and backend API routes (/api/*).'
              : 'هذا المشروع مهيأ بالكامل للنشر الفوري على منصة Vercel مع دعم الواجهة الأمامية (SPA) ومسارات الخلفية (Backend API).'}
          </p>

          <ol className="list-decimal list-inside space-y-2 font-medium">
            <li>
              {language === 'en' ? 'Export this project to GitHub or use Vercel CLI.' : 'قم برفع المشروع إلى مستودع GitHub الخاص بك أو استخدم أداة Vercel CLI.'}
            </li>
            <li>
              {language === 'en' ? 'Import the repository in your Vercel Dashboard.' : 'قم باستيراد المستودع من لوحة تحكم Vercel Dashboard.'}
            </li>
            <li>
              {language === 'en' ? 'Add Environment Variables in Vercel project settings:' : 'أضف متغيرات البيئة التالية في إعدادات المشروع على Vercel:'}
              <ul className="list-disc list-inside mr-6 mt-1 space-y-1 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                <li>GEMINI_API_KEY = your_gemini_api_key</li>
                <li>VITE_SUPABASE_URL = your_supabase_project_url</li>
                <li>VITE_SUPABASE_ANON_KEY = your_supabase_anon_key</li>
              </ul>
            </li>
            <li>
              {language === 'en' ? 'Click Deploy and your CRM Pro app will be live globally!' : 'اضغط على Deploy وسيعمل نظام CRM Pro على الإنترنت خلال ثوانٍ!'}
            </li>
          </ol>
        </div>
      </div>

      {/* Section 2: Appearance & RTL Layout */}
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
