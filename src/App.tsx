import React, { useState, useEffect } from 'react';
import { 
  Contact, 
  Deal, 
  Task, 
  UserAccount, 
  NotificationItem, 
  ViewType, 
  DealStage, 
  TimelineInteraction 
} from './types';
import { 
  initialContacts, 
  initialDeals, 
  initialTasks, 
  initialUsers, 
  initialNotifications, 
  initialMonthlyReports,
  loadFromStorage, 
  saveToStorage, 
  STORAGE_KEYS,
  STAGE_LABELS
} from './data/mockData';
import { isSupabaseConfigured } from './lib/supabase';
import { fetchSupabaseData, syncItemToSupabase, seedSupabaseData } from './lib/supabaseService';

import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { QuickAddModal } from './components/common/QuickAddModal';
import { AICopilotModal } from './components/common/AICopilotModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Language } from './utils/i18n';

import { DashboardView } from './components/dashboard/DashboardView';
import { ContactsView } from './components/contacts/ContactsView';
import { DealsKanbanView } from './components/deals/DealsKanbanView';
import { TasksView } from './components/tasks/TasksView';
import { ReportsView } from './components/reports/ReportsView';
import { UsersView } from './components/users/UsersView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthView } from './components/auth/AuthView';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    loadFromStorage(STORAGE_KEYS.THEME, 'light')
  );

  // Language State
  const [language, setLanguage] = useState<Language>(() => 
    loadFromStorage(STORAGE_KEYS.LANGUAGE, 'ar')
  );

  // Auth State
  const [authUser, setAuthUser] = useState<UserAccount | null>(() => 
    loadFromStorage(STORAGE_KEYS.AUTH_USER, null)
  );

  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState<'contact' | 'deal' | 'task'>('contact');

  const userId = authUser?.id || 'default';

  // Data States with Supabase Database Persistence (No LocalStorage for CRM records)
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([{
    id: 'admin-1',
    name: 'مدير النظام (Admin)',
    email: 'admin@crmpro.com',
    role: 'admin',
    phone: '+966 50 000 0000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    monthlyTarget: 1000000,
    targetPeriod: 'yearly',
    revenueGenerated: 0,
    dealsCount: 0,
    conversionRate: 100,
    kpiScore: 100,
    status: 'active',
    canCreateUsers: true
  }]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [monthlyReports] = useState(initialMonthlyReports);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const triggerToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title,
      message,
      type
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reload data when active user changes
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const uid = authUser?.id || 'default';
      setContacts(loadFromStorage(`${STORAGE_KEYS.CONTACTS}_${uid}`, initialContacts));
      setDeals(loadFromStorage(`${STORAGE_KEYS.DEALS}_${uid}`, initialDeals));
      setTasks(loadFromStorage(`${STORAGE_KEYS.TASKS}_${uid}`, initialTasks));
      setNotifications(loadFromStorage(`${STORAGE_KEYS.NOTIFICATIONS}_${uid}`, initialNotifications));
    }
  }, [authUser?.id]);

  // Sync to User-Specific Storage on modifications
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      saveToStorage(`${STORAGE_KEYS.CONTACTS}_${userId}`, contacts);
    }
  }, [contacts, userId]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      saveToStorage(`${STORAGE_KEYS.DEALS}_${userId}`, deals);
    }
  }, [deals, userId]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      saveToStorage(`${STORAGE_KEYS.TASKS}_${userId}`, tasks);
    }
  }, [tasks, userId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      saveToStorage(`${STORAGE_KEYS.NOTIFICATIONS}_${userId}`, notifications);
    }
  }, [notifications, userId]);

  // Load from Supabase if configured or via server config API
  useEffect(() => {
    const initSupabase = async () => {
      let configured = isSupabaseConfigured();
      if (!configured) {
        try {
          const res = await fetch('/api/supabase-config');
          const data = await res.json();
          if (data.url && data.anonKey) {
            (window as any).__SUPABASE_URL__ = data.url;
            (window as any).__SUPABASE_ANON_KEY__ = data.anonKey;
            configured = true;
          }
        } catch (e) {
          // ignore
        }
      }

      if (configured) {
        fetchSupabaseData().then((res) => {
          if (res) {
            setContacts(res.contacts || []);
            setDeals(res.deals || []);
            setTasks(res.tasks || []);
            if (res.users && res.users.length > 0) {
              setUsers(res.users);
            }
            setNotifications(res.notifications || []);
          }
        });
      }
    };
    initSupabase();
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LANGUAGE, language);
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    triggerToast(
      theme === 'light' ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري',
      'تم تغيير ألوان وتصميم الواجهة بما يتناسب مع رغبتك.',
      'info'
    );
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
    triggerToast(
      language === 'ar' ? 'Language switched to English 🌐' : 'تم التبديل إلى اللغة العربية 🌐',
      language === 'ar' ? 'Interface language has been updated.' : 'تم تحديث لغة الواجهة وعرض القوائم.',
      'info'
    );
  };

  // Contact Handlers
  const handleAddContact = async (contactData: Omit<Contact, 'id' | 'createdAt' | 'timeline'>) => {
    const newContact: Contact = {
      ...contactData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: 'note',
          title: 'تسجيل العميل لأول مرة في النظام',
          details: 'تم إنشاء الحساب عبر واجهة إضافة العميل السريعة.',
          date: new Date().toISOString().split('T')[0],
          performedBy: contactData.assignedTo
        }
      ]
    };
    setContacts((prev) => [newContact, ...prev]);

    if (isSupabaseConfigured()) {
      const res = await syncItemToSupabase('contacts', newContact, 'upsert');
      if (!res.success) {
        triggerToast('خطأ المزامنة مع Supabase ⚠️', `فشل حفظ العميل: ${res.error}`, 'info');
      } else {
        triggerToast('تم إضافة العميل بنجاح 🎉', `تم حفظ العميل "${newContact.name}" في Supabase بنجاح.`, 'success');
        return;
      }
    } else {
      triggerToast('تم إضافة العميل محلياً 🎉', `تم إدراج "${newContact.name}" إلى سجل العملاء.`, 'success');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    const target = contacts.find((c) => c.id === contactId);
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
    if (isSupabaseConfigured()) {
      const res = await syncItemToSupabase('contacts', { id: contactId }, 'delete');
      if (!res.success) {
        triggerToast('خطأ Supabase ⚠️', `فشل حذف العميل من قاعدة البيانات: ${res.error}`, 'info');
      }
    }
    if (target) {
      triggerToast('تم حذف العميل', `تم حذف حساب العميل "${target.name}" من النظام.`, 'info');
    }
  };

  const handleAddTimelineInteraction = async (contactId: string, interaction: Omit<TimelineInteraction, 'id'>) => {
    const newInter: TimelineInteraction = {
      ...interaction,
      id: `t-${Date.now()}`
    };
    let updatedContact: Contact | undefined;
    setContacts((prev) => {
      return prev.map((c) => {
        if (c.id === contactId) {
          const up = { ...c, timeline: [newInter, ...(c.timeline || [])] };
          updatedContact = up;
          return up;
        }
        return c;
      });
    });

    if (updatedContact && isSupabaseConfigured()) {
      const res = await syncItemToSupabase('contacts', updatedContact, 'upsert');
      if (!res.success) {
        triggerToast('خطأ Supabase ⚠️', `فشل تحديث سجل العميل: ${res.error}`, 'info');
      }
    }
    triggerToast('تم تحديث التايم لاين ✨', `تم إضافة التفاعل الجديد بنجاح إلى سجل العميل.`, 'success');
  };

  // Deal Handlers
  const handleAddDeal = async (dealData: Omit<Deal, 'id'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: `d-${Date.now()}`
    };
    setDeals((prev) => [newDeal, ...prev]);

    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'صفقة بيع جديدة 💼',
      message: `تم إنشاء صفقة "${newDeal.title}" بقيمة ${newDeal.value.toLocaleString()} ر.س.`,
      time: 'الآن',
      read: false,
      type: 'deal'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if (isSupabaseConfigured()) {
      const res = await syncItemToSupabase('deals', newDeal, 'upsert');
      await syncItemToSupabase('notifications', newNotif, 'upsert');
      if (!res.success) {
        triggerToast('خطأ المزامنة مع Supabase ⚠️', `فشل حفظ الصفقة في قاعدة البيانات: ${res.error}`, 'info');
      } else {
        triggerToast('تم إضافة الصفقة والمزامنة 💰', `تم إدراج الصفقة وحفظها في Supabase بنجاح.`, 'success');
        return;
      }
    } else {
      triggerToast('تم إضافة الصفقة جديدة 💰', `تم إدراج الصفقة بنجاح.`, 'success');
    }
  };

  const handleMoveDeal = async (dealId: string, newStage: DealStage) => {
    let targetDeal: Deal | undefined;
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const updated = { ...d, stage: newStage };
          if (newStage === 'won') updated.probability = 100;
          if (newStage === 'lost') updated.probability = 0;
          targetDeal = updated;
          return updated;
        }
        return d;
      })
    );

    if (targetDeal && isSupabaseConfigured()) {
      const res = await syncItemToSupabase('deals', targetDeal, 'upsert');
      if (!res.success) {
        triggerToast('خطأ Supabase ⚠️', `فشل تحديث مرحلة الصفقة: ${res.error}`, 'info');
      }
    }

    if (targetDeal) {
      triggerToast(
        'تم نقل الصفقة بنجاح 🚀',
        `تم نقل "${targetDeal.title}" إلى مرحلة: ${STAGE_LABELS[newStage]}`,
        newStage === 'won' ? 'success' : 'info'
      );
    }
  };

  // Task Handlers
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      completed: false
    };
    setTasks((prev) => [newTask, ...prev]);

    if (isSupabaseConfigured()) {
      const res = await syncItemToSupabase('tasks', newTask, 'upsert');
      if (!res.success) {
        triggerToast('خطأ Supabase ⚠️', `فشل حفظ المهمة: ${res.error}`, 'info');
      }
    }
    triggerToast('تم إضافة المهمة والتذكير 📌', `تمت جدولة مهمة "${newTask.title}" بتاريخ ${newTask.dueDate}.`, 'success');
  };

  const handleToggleTaskComplete = async (taskId: string) => {
    let updatedTask: Task | undefined;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const up = { ...t, completed: !t.completed };
          updatedTask = up;
          return up;
        }
        return t;
      })
    );

    if (updatedTask && isSupabaseConfigured()) {
      await syncItemToSupabase('tasks', updatedTask, 'upsert');
    }

    if (updatedTask) {
      triggerToast(
        updatedTask.completed ? 'تم إنجاز المهمة! 🌟' : 'تمت إعادة المهمة كقيد الانتظار',
        `المهمة "${updatedTask.title}" ${updatedTask.completed ? 'اكتملت الآن.' : 'أصبحت غير مكتملة.'}`,
        updatedTask.completed ? 'success' : 'info'
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (isSupabaseConfigured()) {
      await syncItemToSupabase('tasks', { id: taskId }, 'delete');
    }
    triggerToast('تم حذف المهمة', 'تم حذف التذكير من قائمة المهام.', 'info');
  };

  // User Handlers
  const handleAddUser = async (userData: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `u-${Date.now()}`
    };
    setUsers((prev) => [...prev, newUser]);
    if (isSupabaseConfigured()) {
      const res = await syncItemToSupabase('users', newUser, 'upsert');
      if (!res.success) {
        triggerToast('خطأ Supabase ⚠️', `فشل حفظ الموظف: ${res.error}`, 'info');
      }
    }
  };

  const handleUpdateUser = async (updatedUser: UserAccount) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (isSupabaseConfigured()) {
      await syncItemToSupabase('users', updatedUser, 'upsert');
    }
    if (authUser && authUser.id === updatedUser.id) {
      setAuthUser(updatedUser);
      saveToStorage(STORAGE_KEYS.AUTH_USER, updatedUser);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (isSupabaseConfigured()) {
      await syncItemToSupabase('users', { id: userId }, 'delete');
    }
    if (authUser && authUser.id === userId) {
      setAuthUser(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
    triggerToast('تم حذف الموظف', 'تم إزالة حساب الموظف بنجاح من النظام.', 'info');
  };

  const handleLogin = (user: UserAccount) => {
    setAuthUser(user);
    saveToStorage(STORAGE_KEYS.AUTH_USER, user);
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    triggerToast('تم تسجيل الخروج 🔒', 'تم خروجك من الحساب بنجاح، يمكنك تسجيل الدخول بحساب آخر أو تسجيل حساب جديد.', 'info');
  };

  // Notification Handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('تم تعليم الإشعارات كمقروءة', 'تم تحديث مركز التنبيهات.', 'info');
  };

  const handleOpenQuickAdd = (tab: 'contact' | 'deal' | 'task' = 'contact') => {
    setQuickAddTab(tab);
    setIsQuickAddOpen(true);
  };

  if (!authUser) {
    return (
      <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AuthView
          existingUsers={users}
          onLogin={handleLogin}
          onRegister={(newUser) => {
            setUsers((prev) => [newUser, ...prev]);
            handleLogin(newUser);
          }}
          onTriggerToast={triggerToast}
          language={language}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50/70 text-slate-900'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      <div className="flex min-h-screen">
        {/* Right Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          theme={theme}
          onToggleTheme={toggleTheme}
          currentUser={authUser || users[0]}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
          language={language}
          onToggleLanguage={toggleLanguage}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Sticky Navbar */}
          <Header
            currentView={currentView}
            onSelectView={setCurrentView}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onOpenQuickAdd={() => handleOpenQuickAdd('contact')}
            onOpenAICopilot={() => setIsAICopilotOpen(true)}
            contacts={contacts}
            deals={deals}
            tasks={tasks}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            language={language}
            onToggleLanguage={toggleLanguage}
          />

          {/* Dynamic Content View Area */}
          <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
            {currentView === 'dashboard' && (
              <DashboardView
                contacts={contacts}
                deals={deals}
                tasks={tasks}
                monthlyReports={monthlyReports}
                onSelectView={setCurrentView}
                onToggleTaskComplete={handleToggleTaskComplete}
                onOpenQuickAdd={handleOpenQuickAdd}
                language={language}
              />
            )}

            {currentView === 'contacts' && (
              <ContactsView
                contacts={contacts}
                onAddTimelineInteraction={handleAddTimelineInteraction}
                onOpenQuickAdd={handleOpenQuickAdd}
                onDeleteContact={handleDeleteContact}
                language={language}
              />
            )}

            {currentView === 'deals' && (
              <DealsKanbanView
                deals={deals}
                onMoveDeal={handleMoveDeal}
                onOpenQuickAdd={handleOpenQuickAdd}
                users={users}
                language={language}
              />
            )}

            {currentView === 'tasks' && (
              <TasksView
                tasks={tasks}
                onToggleTaskComplete={handleToggleTaskComplete}
                onOpenQuickAdd={handleOpenQuickAdd}
                onDeleteTask={handleDeleteTask}
                users={users}
                language={language}
              />
            )}

            {currentView === 'reports' && (
              <ReportsView
                monthlyReports={monthlyReports}
                users={users}
                deals={deals}
                contacts={contacts}
                onTriggerToast={triggerToast}
                language={language}
              />
            )}

            {currentView === 'users' && (
              <UsersView
                users={users}
                deals={deals}
                currentUser={authUser || users[0]}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onTriggerToast={triggerToast}
                language={language}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                theme={theme}
                onToggleTheme={toggleTheme}
                onTriggerToast={triggerToast}
                deals={deals}
                contacts={contacts}
                users={users}
                language={language}
              />
            )}
          </main>

          {/* Footer */}
          <footer className="py-4 px-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
            {language === 'en' 
              ? '© 2026 CRM Pro • Advanced Sales & Relationship Management • Designed with Bilingual & Dark Mode Support'
              : '© 2026 CRM Pro • نظام متكامل لإدارة علاقات العملاء والمبيعات • مصمم بأسلوب Minimalist بدعم RTL والوضع الليلي'}
          </footer>
        </div>
      </div>

      {/* Floating Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddContact={handleAddContact}
        onAddDeal={handleAddDeal}
        onAddTask={handleAddTask}
        contacts={contacts}
        users={users}
        initialTab={quickAddTab}
        language={language}
      />

      {/* Gemini AI Sales Copilot Modal */}
      <AICopilotModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        language={language}
        onTriggerToast={triggerToast}
      />

      {/* Micro-interaction Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
