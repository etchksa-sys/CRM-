import { ViewType, DealStage, UserRole } from '../types';
import { LayoutDashboard, Users, Kanban, CheckSquare, BarChart3, UserCheck, Settings } from 'lucide-react';

export type Language = 'ar' | 'en';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: any;
  badge: string | null;
}

export function getNavItems(lang: string = 'ar'): NavItem[] {
  if (lang === 'en') {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
      { id: 'contacts', label: 'Accounts & Contacts', icon: Users, badge: null },
      { id: 'deals', label: 'Deals Kanban', icon: Kanban, badge: 'New ⚡' },
      { id: 'tasks', label: 'Tasks & Schedule', icon: CheckSquare, badge: null },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
      { id: 'users', label: 'Team & RBAC', icon: UserCheck, badge: null },
      { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
    ];
  }
  return [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, badge: null },
    { id: 'contacts', label: 'إدارة العملاء', icon: Users, badge: null },
    { id: 'deals', label: 'مسار الصفقات (Kanban)', icon: Kanban, badge: 'جديد ⚡' },
    { id: 'tasks', label: 'المهام والمواعيد', icon: CheckSquare, badge: null },
    { id: 'reports', label: 'التقارير والتحليلات', icon: BarChart3, badge: null },
    { id: 'users', label: 'فريق العمل والصلاحيات', icon: UserCheck, badge: null },
    { id: 'settings', label: 'الإعدادات والنظام', icon: Settings, badge: null },
  ];
}

export function getViewTitles(lang: string = 'ar'): Record<ViewType, { title: string; subtitle: string }> {
  if (lang === 'en') {
    return {
      dashboard: { title: 'Executive Dashboard & KPI Indicators', subtitle: 'Real-time overview of sales performance, deals, and daily targets' },
      contacts: { title: 'Accounts & Contacts Directory', subtitle: 'Manage phone numbers, emails, and communication logs for all accounts' },
      deals: { title: 'Deals Pipeline & Kanban Board', subtitle: 'Drag and drop deals between negotiation stages and proposals' },
      tasks: { title: 'Daily Tasks & Follow-up Schedule', subtitle: 'Schedule meetings and follow-up calls to never miss closing a deal' },
      reports: { title: 'Advanced Reports & Analytics', subtitle: 'Charts, conversion rates, and executive data export (Excel/PDF)' },
      users: { title: 'Team Management & Performance Audit', subtitle: 'Manage sales reps, set targets, audit KPIs, and RBAC permissions' },
      settings: { title: 'System Settings & Integrations', subtitle: 'Customize pipelines, roles, security policies, and backup data' }
    };
  }
  return {
    dashboard: { title: 'لوحة التحكم والمؤشرات الرئيسية', subtitle: 'نظرة شاملة ولحظية على أداء المبيعات والصفقات اليوم' },
    contacts: { title: 'سجل العملاء والحسابات (Accounts)', subtitle: 'إدارة أرقام وإيميلات ومسار التواصل مع جميع العملاء' },
    deals: { title: 'لوحة الصفقات ومراحل البيع (Kanban Board)', subtitle: 'سحب وإفلات الصفقات بين مراحل التفاوض والعروض الدورية' },
    tasks: { title: 'المهام والتذكيرات اليومية', subtitle: 'جدولة المواعيد ومكالمات المتابعة لضمان عدم تفويت أي صفقة' },
    reports: { title: 'التقارير وتحليلات الأداء المتقدمة', subtitle: 'رسوم بيانية ومعدلات التحويل وتصدير البيانات التنفيذية' },
    users: { title: 'إدارة فريق العمل وتقييم الأداء والمستهدفات (Audit & KPI)', subtitle: 'إدارة أداء مهندسي ومندوبي المبيعات، ضبط التارجت الشهري، والصلاحيات' },
    settings: { title: 'إعدادات النظام والتخصيص', subtitle: 'تخصيص مراحل البيع، إدارة الحسابات، صلاحيات الأمان، والنسخ الاحتياطي' }
  };
}

export const STAGE_LABELS_EN: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won (Closed)',
  lost: 'Lost (Closed)'
};

export function getLocalizedStageLabel(stage: string, lang: string = 'ar'): string {
  if (lang === 'en') return STAGE_LABELS_EN[stage] || stage;
  const arMap: Record<string, string> = {
    new: 'جديد',
    contacted: 'تم التواصل',
    proposal: 'عرض سعر',
    negotiation: 'تفاوض',
    won: 'مغلق (ناجح)',
    lost: 'مغلق (خاسر)'
  };
  return arMap[stage] || stage;
}

export const STATUS_LABELS_EN: Record<string, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  active: 'Active Account',
  churned: 'Churned'
};

export function getLocalizedStatusLabel(status: string, lang: string = 'ar'): string {
  if (lang === 'en') return STATUS_LABELS_EN[status] || status;
  const arMap: Record<string, string> = {
    lead: 'عميل محتمل',
    qualified: 'مؤهل للتفاوض',
    active: 'عميل حالي نشط',
    churned: 'عميل سابق'
  };
  return arMap[status] || status;
}

export const SOURCE_LABELS_EN: Record<string, string> = {
  website: 'Website',
  referral: 'Referral',
  social: 'Social Media',
  ads: 'Advertising',
  direct: 'Direct / Exhibition'
};

export function getLocalizedSourceLabel(source: string, lang: string = 'ar'): string {
  if (lang === 'en') return SOURCE_LABELS_EN[source] || source;
  const arMap: Record<string, string> = {
    website: 'الموقع الإلكتروني',
    referral: 'إحالة / ترشيح',
    social: 'شبكات التواصل',
    ads: 'حملات إعلانية',
    direct: 'تواصل مباشر / معرض'
  };
  return arMap[source] || source;
}

export const PRIORITY_LABELS_EN: Record<string, string> = {
  high: 'High 🔥',
  medium: 'Medium ⚡',
  low: 'Normal 📌'
};

export function getLocalizedPriorityLabel(priority: string, lang: string = 'ar'): string {
  if (lang === 'en') return PRIORITY_LABELS_EN[priority] || priority;
  const arMap: Record<string, string> = {
    high: 'عالية جداً 🔥',
    medium: 'متوسطة ⚡',
    low: 'عادية 📌'
  };
  return arMap[priority] || priority;
}

export const ROLE_LABELS_EN: Record<string, string> = {
  admin: 'General Admin',
  sales_manager: 'Sales Manager',
  senior_sales_engineer: 'Senior Sales Engineer',
  sales_engineer: 'Sales Engineer',
  sales_consultant: 'Sales Consultant',
  sales: 'Sales Rep',
  viewer: 'Data Analyst / Viewer'
};

export function getLocalizedRoleLabel(role?: string, lang: string = 'ar'): string {
  if (!role) return lang === 'en' ? 'Sales Rep' : 'مندوب مبيعات';
  if (lang === 'en') {
    return ROLE_LABELS_EN[role] || role;
  }
  const arMap: Record<string, string> = {
    admin: 'المدير العام',
    sales_manager: 'مدير المبيعات',
    senior_sales_engineer: 'مهندس مبيعات أول',
    sales_engineer: 'مهندس مبيعات',
    sales_consultant: 'استشاري مبيعات',
    sales: 'مندوب مبيعات',
    viewer: 'مراقب ومحلل تقارير'
  };
  return arMap[role] || role;
}

export const UI_TRANSLATIONS: Record<string, any> = {
  ar: {
    quickAdd: 'إضافة سريعة +',
    searchPlaceholder: 'بحث بالاسم، الشركة، الجوال، أو رقم الصفقة (Ctrl+K)...',
    notifCenter: 'مركز الإشعارات',
    markAllRead: 'تعليم الكل كمقروء',
    noNotifs: 'لا توجد إشعارات حالياً',
    darkModeActive: 'الوضع الليلي مفعّل',
    lightModeActive: 'الوضع النهاري مفعّل',
    change: 'تغيير',
    langToggleLabel: 'English',
    logout: 'تسجيل الخروج',
    appTagline: 'تطبيق إدارة صفقات وعمليات متطور',
    newNotif: 'جديد'
  },
  en: {
    quickAdd: 'Quick Add +',
    searchPlaceholder: 'Search by name, company, phone, or deal (Ctrl+K)...',
    notifCenter: 'Notification Center',
    markAllRead: 'Mark all read',
    noNotifs: 'No notifications currently',
    darkModeActive: 'Dark Mode Active',
    lightModeActive: 'Light Mode Active',
    change: 'Toggle',
    langToggleLabel: 'العربية',
    logout: 'Logout',
    appTagline: 'Advanced CRM & Pipeline Manager',
    newNotif: 'new'
  }
};
