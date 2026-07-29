import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Menu, 
  X, 
  User, 
  Building, 
  Kanban, 
  CheckSquare, 
  ArrowUpLeft,
  Check,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Contact, Deal, Task, NotificationItem, ViewType } from '../../types';
import { getViewTitles, Language, UI_TRANSLATIONS } from '../../utils/i18n';

interface HeaderProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenMobileSidebar: () => void;
  onOpenQuickAdd: () => void;
  onOpenAICopilot: () => void;
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onSelectContactFromSearch?: (contact: Contact) => void;
  language?: string;
  onToggleLanguage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenMobileSidebar,
  onOpenQuickAdd,
  onOpenAICopilot,
  contacts,
  deals,
  tasks,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSelectContactFromSearch,
  language = 'ar',
  onToggleLanguage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const t = UI_TRANSLATIONS[language];

  // Bilingual View Titles
  const viewTitles = getViewTitles(language);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search filter calculation
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return { contacts: [], deals: [], tasks: [] };
    const q = searchQuery.toLowerCase();
    
    return {
      contacts: contacts.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3),
      deals: deals.filter(d => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)).slice(0, 3),
      tasks: tasks.filter(t => t.title.toLowerCase().includes(q) || (t.relatedToName && t.relatedToName.toLowerCase().includes(q))).slice(0, 3)
    };
  }, [searchQuery, contacts, deals, tasks]);

  const totalResults = searchResults.contacts.length + searchResults.deals.length + searchResults.tasks.length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Right Side: Mobile Hamburger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base lg:text-lg font-extrabold text-slate-800 dark:text-white truncate">
            {viewTitles[currentView]?.title || 'النظام'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
            {viewTitles[currentView]?.subtitle}
          </p>
        </div>
      </div>

      {/* Center/Left: Global Search Input */}
      <div className="flex-1 max-w-md relative" ref={searchRef}>
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="بحث سريع بالاسم، الشركة، الصفقة أو المهمة..."
            className="w-full pl-9 pr-9 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Instant Search Dropdown Results */}
        {isSearchOpen && searchQuery.length >= 2 && (
          <div className="absolute top-full mt-2 right-0 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50 p-3 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">نتائج البحث ({totalResults})</span>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-semibold">بحث فوري</span>
            </div>

            {totalResults === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                لم يتم العثور على أي بيانات مطابقة لـ "{searchQuery}"
              </div>
            ) : (
              <>
                {/* Contacts Section */}
                {searchResults.contacts.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 px-1">
                      <User className="w-3.5 h-3.5" /> العملاء والحسابات
                    </div>
                    {searchResults.contacts.map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          onSelectView('contacts');
                          if (onSelectContactFromSearch) onSelectContactFromSearch(c);
                        }}
                        className="w-full text-right p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-blue-600">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.company} • {c.phone}</p>
                        </div>
                        <ArrowUpLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Deals Section */}
                {searchResults.deals.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 px-1 pt-1 border-t border-slate-100 dark:border-slate-700">
                      <Kanban className="w-3.5 h-3.5" /> الصفقات المفتوحة
                    </div>
                    {searchResults.deals.map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          onSelectView('deals');
                        }}
                        className="w-full text-right p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-purple-600">{d.title}</p>
                          <p className="text-[10px] text-slate-500">{d.company} • {d.value.toLocaleString()} ر.س</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 font-bold">
                          {d.probability}% احتمال
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tasks Section */}
                {searchResults.tasks.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 px-1 pt-1 border-t border-slate-100 dark:border-slate-700">
                      <CheckSquare className="w-3.5 h-3.5" /> المهام والمواعيد
                    </div>
                    {searchResults.tasks.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          onSelectView('tasks');
                        }}
                        className="w-full text-right p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-amber-600">{t.title}</p>
                          <p className="text-[10px] text-slate-500">استحقاق: {t.dueDate} • {t.assignedTo}</p>
                        </div>
                        <ArrowUpLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Left Action Buttons: Notifications & Quick Add */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Language Toggle Button */}
        {onToggleLanguage && (
          <button
            onClick={onToggleLanguage}
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 border border-slate-200/60 dark:border-slate-700/60"
            title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <span className="text-base leading-none">🌐</span>
            <span className="hidden sm:inline font-black">{language === 'ar' ? 'English' : 'العربية'}</span>
            <span className="sm:hidden font-black">{language === 'ar' ? 'EN' : 'AR'}</span>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative"
            title={t.notifCenter}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse shadow-md shadow-rose-500/30">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {isNotifOpen && (
            <div className="absolute top-full mt-2 left-0 right-auto w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{t.notifCenter}</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300 font-bold">
                      {unreadCount} {t.newNotif}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> {t.markAllRead}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    {t.noNotifs}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && onMarkNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-600 animate-ping' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Gemini AI Copilot Button */}
        <button
          onClick={onOpenAICopilot}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all shrink-0"
          title={language === 'ar' ? 'مساعد المبيعات الذكي (Gemini AI)' : 'Gemini AI Sales Copilot'}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="hidden md:inline">{language === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Copilot'}</span>
          <span className="md:hidden">AI</span>
        </button>

        {/* Quick Add Floating Button (إضافة سريعة) */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t.quickAdd}</span>
        </button>
      </div>
    </header>
  );
};
