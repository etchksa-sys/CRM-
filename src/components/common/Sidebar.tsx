import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  CheckSquare, 
  BarChart3, 
  UserCheck, 
  Settings, 
  Moon, 
  Sun, 
  Building2, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { ViewType, UserAccount } from '../../types';
import { getRoleLabel } from '../../data/mockData';
import { getNavItems, Language, getLocalizedRoleLabel } from '../../utils/i18n';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentUser: UserAccount;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  language?: string;
  onToggleLanguage?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  theme,
  onToggleTheme,
  currentUser,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  language = 'ar',
  onToggleLanguage
}) => {
  const allNavItems = getNavItems(language);
  const userAllowedPages = currentUser?.allowedPages;
  const navItems = (userAllowedPages && userAllowedPages.length > 0)
    ? allNavItems.filter(item => userAllowedPages.includes(item.id))
    : allNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 right-0 z-50 h-screen w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Logo & Title */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-800 dark:text-white">CRM</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">PRO</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">إدارة علاقات العملاء الذكية</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            القائمة الرئيسية
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-blue-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Theme & User Info */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Language Toggle Button */}
          {onToggleLanguage && (
            <button
              onClick={onToggleLanguage}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200/60 dark:border-blue-800/60"
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">🌐</span>
                <span>{language === 'en' ? 'Language: English' : 'اللغة: العربية'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-black shadow-sm">
                {language === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
              </span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <span>{theme === 'dark' ? (language === 'en' ? 'Dark Mode Active' : 'الوضع الليلي مفعّل') : (language === 'en' ? 'Light Mode Active' : 'الوضع النهاري مفعّل')}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold">
              {language === 'en' ? 'Toggle' : 'تغيير'}
            </span>
          </button>

          {/* User Account Pill */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onSelectView('settings');
                onCloseMobile();
              }}
              className="flex items-center gap-2.5 min-w-0 text-right flex-1 hover:opacity-80 transition-opacity"
              title={language === 'en' ? 'Edit Profile & Settings' : 'تعديل الملف الشخصي والصورة'}
            >
              <div className="relative shrink-0">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border border-white dark:border-slate-800 flex items-center justify-center text-[8px] text-white">
                  ⚙️
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate hover:text-blue-600 transition-colors">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {getLocalizedRoleLabel(currentUser.role, language)}
                </p>
              </div>
            </button>
            <button 
              type="button"
              onClick={onLogout}
              title={language === 'en' ? 'Logout' : 'تسجيل الخروج أو تبديل الحساب'}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> تطبيق إدارة صفقات وعمليات متطور
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
