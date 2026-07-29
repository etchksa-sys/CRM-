export type ContactStatus = 'lead' | 'qualified' | 'active' | 'churned';
export type ContactSource = 'website' | 'referral' | 'social' | 'ads' | 'direct';

export interface TimelineInteraction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  details: string;
  date: string;
  performedBy: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: ContactSource;
  status: ContactStatus;
  tags: string[];
  avatar?: string;
  assignedTo: string;
  createdAt: string;
  notes?: string;
  timeline: TimelineInteraction[];
}

export type DealStage = 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  value: number; // in SAR (ر.س)
  probability: number; // 0-100%
  stage: DealStage;
  expectedCloseDate: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  relatedToType?: 'contact' | 'deal' | 'none';
  relatedToId?: string;
  relatedToName?: string;
  assignedTo: string;
}

export type UserRole = 
  | 'admin' 
  | 'sales_manager' 
  | 'senior_sales_engineer' 
  | 'sales_engineer' 
  | 'sales_consultant' 
  | 'sales' 
  | 'viewer';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar: string;
  dealsCount: number;
  revenueGenerated: number;
  conversionRate: number;
  status: 'active' | 'offline';
  monthlyTarget?: number; // المستهدف البيعي (ر.س)
  targetPeriod?: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly'; // فترة المستهدف البيعي (شهري، ربع سنوي، نصف سنوي، سنوي)
  kpiScore?: number; // التقييم العام للأداء (من 100)
  lastActiveDate?: string; // تاريخ آخر نشاط مسجل
  managerFeedback?: string; // مراجعة وتقييم المدير
  stagnantDealsCount?: number; // عدد الصفقات الراكدة أو المتأخرة
  canCreateUsers?: boolean; // صلاحية إنشاء وتسجيل حسابات موظفين ومستخدمين جدد
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'deal' | 'contact' | 'task' | 'system';
  linkTarget?: string;
}

export type ViewType = 'dashboard' | 'contacts' | 'deals' | 'tasks' | 'reports' | 'users' | 'settings';

export interface FilterOptions {
  search: string;
  status: string;
  source: string;
  tag: string;
  assignedTo: string;
}

export interface SalesMonthlyReport {
  month: string;
  revenue: number;
  target: number;
  dealsCount: number;
}
