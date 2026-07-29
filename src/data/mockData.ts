import { Contact, Deal, Task, UserAccount, NotificationItem, SalesMonthlyReport, DealStage, ContactStatus, ContactSource } from '../types';

export const STAGE_LABELS: Record<DealStage, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  proposal: 'عرض سعر',
  negotiation: 'تفاوض',
  won: 'مغلق (ناجح)',
  lost: 'مغلق (خاسر)'
};

export const STAGE_COLORS: Record<DealStage, string> = {
  new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  contacted: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  proposal: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  negotiation: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  won: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  lost: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
};

export const STATUS_LABELS: Record<ContactStatus, string> = {
  lead: 'عميل محتمل',
  qualified: 'مؤهل للتفاوض',
  active: 'عميل حالي نشط',
  churned: 'عميل سابق'
};

export const STATUS_COLORS: Record<ContactStatus, string> = {
  lead: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  qualified: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  churned: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 line-through'
};

export const SOURCE_LABELS: Record<ContactSource, string> = {
  website: 'الموقع الإلكتروني',
  referral: 'إحالة / ترشيح',
  social: 'شبكات التواصل',
  ads: 'حملات إعلانية',
  direct: 'تواصل مباشر / معرض'
};

export const PRIORITY_LABELS = {
  high: 'عالية جداً 🔥',
  medium: 'متوسطة ⚡',
  low: 'عادية 📌'
};

export const ROLE_LABELS: Record<string, string> = {
  admin: 'المدير العام',
  sales_manager: 'مدير المبيعات',
  senior_sales_engineer: 'مهندس مبيعات أول',
  sales_engineer: 'مهندس مبيعات',
  sales_consultant: 'استشاري مبيعات',
  sales: 'مندوب مبيعات',
  viewer: 'مراقب ومحلل تقارير'
};

export const ROLE_ICONS: Record<string, string> = {
  admin: '👑',
  sales_manager: '🏆',
  senior_sales_engineer: '⚡',
  sales_engineer: '⚙️',
  sales_consultant: '💡',
  sales: '🚀',
  viewer: '📊'
};

export function getRoleLabel(role?: string): string {
  if (!role) return 'مندوب مبيعات';
  return ROLE_LABELS[role] || role;
}

export function getRoleIcon(role?: string): string {
  if (!role) return '👤';
  return ROLE_ICONS[role] || '💼';
}

export function getRoleBadge(role?: string): string {
  return `${getRoleIcon(role)} ${getRoleLabel(role)}`;
}

export function hasUserCreationPermission(user?: UserAccount | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'sales_manager' || user.canCreateUsers === true;
}

export const initialUsers: UserAccount[] = [
  {
    id: 'u-1',
    name: 'أحمد الغامدي',
    role: 'admin',
    email: 'ahmed@crm-pro.com',
    phone: '+966 50 123 4567',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    dealsCount: 14,
    revenueGenerated: 485000,
    conversionRate: 68,
    status: 'active',
    monthlyTarget: 500000,
    targetPeriod: 'monthly',
    kpiScore: 94,
    lastActiveDate: 'الآن (متصل)',
    managerFeedback: 'أداء قيادي استثنائي ومتابعة مستمرة للفريق وإدارة الحسابات الكبرى بانتظام.',
    stagnantDealsCount: 1,
    canCreateUsers: true
  },
  {
    id: 'u-5',
    name: 'فهد عبد الملك',
    role: 'sales_manager',
    email: 'fahad@crm-pro.com',
    phone: '+966 53 111 2233',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    dealsCount: 22,
    revenueGenerated: 750000,
    conversionRate: 81,
    status: 'active',
    monthlyTarget: 800000,
    targetPeriod: 'monthly',
    kpiScore: 96,
    lastActiveDate: 'قبل 5 دقائق',
    managerFeedback: 'إدارة قيادية ممتازة لفريق مهندسي المبيعات ومتابعة الأداء البيعي بشكل دقيق.',
    stagnantDealsCount: 0,
    canCreateUsers: true
  },
  {
    id: 'u-2',
    name: 'سارة المنصور',
    role: 'senior_sales_engineer',
    email: 'sara@crm-pro.com',
    phone: '+966 54 987 6543',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    dealsCount: 19,
    revenueGenerated: 620000,
    conversionRate: 74,
    status: 'active',
    monthlyTarget: 1500000,
    targetPeriod: 'quarterly',
    kpiScore: 98,
    lastActiveDate: 'قبل 15 دقيقة',
    managerFeedback: 'تجاوزت المستهدف الربع سنوي بنسبة 103%! تم منحها صلاحية تسجيل وتوجيه مهندسي المبيعات الجدد.',
    stagnantDealsCount: 0,
    canCreateUsers: true
  },
  {
    id: 'u-3',
    name: 'خالد العتيبي',
    role: 'sales_engineer',
    email: 'khaled@crm-pro.com',
    phone: '+966 55 333 2211',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    dealsCount: 9,
    revenueGenerated: 210000,
    conversionRate: 52,
    status: 'active',
    monthlyTarget: 400000,
    targetPeriod: 'monthly',
    kpiScore: 71,
    lastActiveDate: 'قبل ساعتين',
    managerFeedback: 'يحتاج إلى تسريع المتابعة في مرحلة تقديم عروض الأسعار؛ هناك صفقات معلقة منذ أسبوعين.',
    stagnantDealsCount: 3,
    canCreateUsers: false
  },
  {
    id: 'u-4',
    name: 'منى الشهري',
    role: 'viewer',
    email: 'm.shehri@crm-pro.com',
    phone: '+966 56 444 8899',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    dealsCount: 0,
    revenueGenerated: 0,
    conversionRate: 0,
    status: 'offline',
    monthlyTarget: 0,
    targetPeriod: 'yearly',
    kpiScore: 85,
    lastActiveDate: 'أمس 04:30 م',
    managerFeedback: 'حساب مخصص لمراجعة التقارير ومؤشرات التحويل.',
    stagnantDealsCount: 0,
    canCreateUsers: false
  }
];

export const initialContacts: Contact[] = [
  {
    id: 'c-1',
    name: 'مهند الفيصل',
    company: 'شركة الأفق التقني للحلول',
    email: 'm.faisal@alufq-tech.sa',
    phone: '0501122334',
    source: 'website',
    status: 'active',
    tags: ['عميل VIP', 'عقود سنوية', 'تقنية معلومات'],
    assignedTo: 'سارة المنصور',
    createdAt: '2026-06-10',
    notes: 'عميل مهتم جداً بحلول السحابة الذكية والأمن السيبراني، يفضل التواصل في الفترة الصباحية.',
    timeline: [
      {
        id: 't-1',
        type: 'meeting',
        title: 'اجتماع عرض النسخة التجريبية (Demo)',
        details: 'تم استعراض مميزات النظام مع المدير التقني وإبداء إعجابهم بسهولة الواجهة ودعم اللغة العربية.',
        date: '2026-07-24',
        performedBy: 'سارة المنصور'
      },
      {
        id: 't-2',
        type: 'email',
        title: 'إرسال عرض السعر المحدث',
        details: 'تم إرسال عرض سعر يشمل خصم 10% للعقد السنوي مع باقة الدعم الفني المتقدمة.',
        date: '2026-07-22',
        performedBy: 'سارة المنصور'
      },
      {
        id: 't-3',
        type: 'call',
        title: 'مكالمة استفسارية أولية',
        details: 'مناقشة احتياجات الفريق (25 مستخدم) وربط النظام مع واتساب وقواعد بياناهم الحالية.',
        date: '2026-07-15',
        performedBy: 'أحمد الغامدي'
      }
    ]
  },
  {
    id: 'c-2',
    name: 'د. نورة السبيعي',
    company: 'مجموعة الرياض الطبية',
    email: 'dr.noura@riyadh-medical.com',
    phone: '0544556677',
    source: 'referral',
    status: 'qualified',
    tags: ['قطاع طبي', 'صفقة كبرى', 'إحالة'],
    assignedTo: 'أحمد الغامدي',
    createdAt: '2026-06-18',
    notes: 'يرغبون في أتمتة حجز المواعيد وتتبع المرضى والمراجعين عبر واتساب.',
    timeline: [
      {
        id: 't-4',
        type: 'call',
        title: 'مكالمة متابعة مع قسم المشتريات',
        details: 'أكدوا استلام الموافقة المبدئية من مجلس الإدارة، في انتظار صياغة العقد النهائي.',
        date: '2026-07-25',
        performedBy: 'أحمد الغامدي'
      }
    ]
  },
  {
    id: 'c-3',
    name: 'عبدالله الحارثي',
    company: 'مؤسسة إعمار وبناء للمقاولات',
    email: 'a.alharthi@emaar-build.sa',
    phone: '0559988776',
    source: 'ads',
    status: 'lead',
    tags: ['مقاولات', 'متابعة عاجلة'],
    assignedTo: 'خالد العتيبي',
    createdAt: '2026-07-01',
    notes: 'جاء عن طريق إعلان لينكد إن الأخير حول إدارة مشاريع المقاولات.',
    timeline: [
      {
        id: 't-5',
        type: 'email',
        title: 'إرسال الكتيب التعريفي (Brochure)',
        details: 'تم إرسال دليل دراسات الحالة لقطاع المقاولات والهندسة.',
        date: '2026-07-20',
        performedBy: 'خالد العتيبي'
      }
    ]
  },
  {
    id: 'c-4',
    name: 'ريم الدوسري',
    company: 'وكالة إبداع للتسويق الرقمي',
    email: 'reem@ebda3-agency.com',
    phone: '0508877665',
    source: 'social',
    status: 'active',
    tags: ['تسويق', 'عميل متكرر', 'عقد شهري'],
    assignedTo: 'سارة المنصور',
    createdAt: '2026-05-15',
    notes: 'وكالة إعلانية تستخدم النظام لخدمة عملائها وإدارة الحملات.',
    timeline: [
      {
        id: 't-6',
        type: 'meeting',
        title: 'جلسة تدريب فريق العمل (Onboarding)',
        details: 'تم تدريب 12 موظف على خصائص الفلترة الذكية والتقارير الدورية.',
        date: '2026-07-10',
        performedBy: 'سارة المنصور'
      }
    ]
  },
  {
    id: 'c-5',
    name: 'فهد القحطاني',
    company: 'شركة سلاسل الإمداد اللوجستية',
    email: 'fahad@logistics-chain.sa',
    phone: '0567788990',
    source: 'direct',
    status: 'qualified',
    tags: ['لوجستيات', 'شحن وتوصيل'],
    assignedTo: 'خالد العتيبي',
    createdAt: '2026-07-12',
    notes: 'تعرفنا عليه في معرض التقنية بجدة، يبحثون عن نظام متكامل لإدارة المناديب.',
    timeline: []
  },
  {
    id: 'c-6',
    name: 'لمى الحربي',
    company: 'أكاديمية النجاح للتدريب',
    email: 'lama@alnajah-edu.com',
    phone: '0533221100',
    source: 'website',
    status: 'lead',
    tags: ['تعلم وتدريب', 'أفراد وشركات'],
    assignedTo: 'سارة المنصور',
    createdAt: '2026-07-21',
    notes: 'طلب تسعيرة لـ 5 مستخدمين فقط مع إمكانية التوسع لاحقاً.',
    timeline: []
  },
  {
    id: 'c-7',
    name: 'عمر باحارث',
    company: 'مجموعة التجزئة الحديثة (ريتايل كورب)',
    email: 'omar.b@retail-corp.sa',
    phone: '0505544332',
    source: 'referral',
    status: 'active',
    tags: ['تجزئة', 'نقاط بيع POS', 'عميل VIP'],
    assignedTo: 'أحمد الغامدي',
    createdAt: '2026-04-20',
    notes: 'تم ربط 14 فرع بنجاح، العميل راضٍ جداً عن سرعة الدعم الفني.',
    timeline: []
  },
  {
    id: 'c-8',
    name: 'تركي الشمري',
    company: 'مصنع الشرق للأغذية',
    email: 't.shammari@alsharq-foods.com',
    phone: '0551100229',
    source: 'ads',
    status: 'churned',
    tags: ['صناعة', 'توقف مؤقت'],
    assignedTo: 'خالد العتيبي',
    createdAt: '2026-03-10',
    notes: 'تم تأجيل المشروع بسبب إعادة هيكلة داخلية في المصنع، يوصى بالتواصل معهم في الربع القادم.',
    timeline: []
  }
];

export const initialDeals: Deal[] = [
  {
    id: 'd-1',
    title: 'تطوير وتفعيل نظام إدارة العلاقات (25 مستخدم)',
    contactId: 'c-1',
    contactName: 'مهند الفيصل',
    company: 'شركة الأفق التقني للحلول',
    value: 85000,
    probability: 80,
    stage: 'negotiation',
    expectedCloseDate: '2026-07-30',
    assignedTo: 'سارة المنصور',
    priority: 'high',
    notes: 'في مرحلة التفاوض النهائي على شروط الدفع والتدريب.'
  },
  {
    id: 'd-2',
    title: 'عقد أتمتة حجز المواعيد ودعم خدمة العملاء',
    contactId: 'c-2',
    contactName: 'د. نورة السبيعي',
    company: 'مجموعة الرياض الطبية',
    value: 180000,
    probability: 90,
    stage: 'proposal',
    expectedCloseDate: '2026-08-15',
    assignedTo: 'أحمد الغامدي',
    priority: 'high',
    notes: 'العرض يشمل ربط بوابة الرسائل وخدمة المساعد الذكي.'
  },
  {
    id: 'd-3',
    title: 'باقة إدارة مشاريع المقاولات والمتابعة الميدانية',
    contactId: 'c-3',
    contactName: 'عبدالله الحارثي',
    company: 'مؤسسة إعمار وبناء للمقاولات',
    value: 45000,
    probability: 50,
    stage: 'contacted',
    expectedCloseDate: '2026-08-20',
    assignedTo: 'خالد العتيبي',
    priority: 'medium',
    notes: 'تم عقد الاجتماع الأول بانتظار تحديد موعد مع مدير المالية.'
  },
  {
    id: 'd-4',
    title: 'ترقية الباقة وتجديد العقد السنوي للوكالة',
    contactId: 'c-4',
    contactName: 'ريم الدوسري',
    company: 'وكالة إبداع للتسويق الرقمي',
    value: 60000,
    probability: 100,
    stage: 'won',
    expectedCloseDate: '2026-07-05',
    assignedTo: 'سارة المنصور',
    priority: 'high',
    notes: 'تم توقيع العقد وتحويل الدفعة الأولى بنجاح!'
  },
  {
    id: 'd-5',
    title: 'نظام إدارة تتبع أسطول النقل والمناديب',
    contactId: 'c-5',
    contactName: 'فهد القحطاني',
    company: 'شركة سلاسل الإمداد اللوجستية',
    value: 120000,
    probability: 30,
    stage: 'proposal',
    expectedCloseDate: '2026-09-01',
    assignedTo: 'خالد العتيبي',
    priority: 'high',
    notes: 'تم تقديم العرض المالي، ينافسنا في الصفقة نظام آخر.'
  },
  {
    id: 'd-6',
    title: 'باقة الأكاديمية والتدريب لـ 5 مستخدمين',
    contactId: 'c-6',
    contactName: 'لمى الحربي',
    company: 'أكاديمية النجاح للتدريب',
    value: 18000,
    probability: 20,
    stage: 'new',
    expectedCloseDate: '2026-08-10',
    assignedTo: 'سارة المنصور',
    priority: 'low',
    notes: 'استفسار جديد عبر الموقع، بحاجة إلى اتصال ترحيبي عاجل.'
  },
  {
    id: 'd-7',
    title: 'توسعة نظام نقاط البيع لـ 14 فرع إضافي',
    contactId: 'c-7',
    contactName: 'عمر باحارث',
    company: 'مجموعة التجزئة الحديثة',
    value: 240000,
    probability: 100,
    stage: 'won',
    expectedCloseDate: '2026-06-28',
    assignedTo: 'أحمد الغامدي',
    priority: 'high',
    notes: 'صفقة استراتيجية ناجحة جداً.'
  },
  {
    id: 'd-8',
    title: 'أتمتة المبيعات لخطوط الإنتاج والتوزيع',
    contactId: 'c-8',
    contactName: 'تركي الشمري',
    company: 'مصنع الشرق للأغذية',
    value: 95000,
    probability: 0,
    stage: 'lost',
    expectedCloseDate: '2026-07-15',
    assignedTo: 'خالد العتيبي',
    priority: 'medium',
    notes: 'خسرنا الصفقة بسبب تأجيل الميزانية لعام 2027.'
  },
  {
    id: 'd-9',
    title: 'ربط واجهة البرمجيات (API Integration) مع نظام ERP',
    contactId: 'c-1',
    contactName: 'مهند الفيصل',
    company: 'شركة الأفق التقني للحلول',
    value: 35000,
    probability: 60,
    stage: 'contacted',
    expectedCloseDate: '2026-08-25',
    assignedTo: 'سارة المنصور',
    priority: 'medium',
    notes: 'صفقة فرعية إضافية للعميل نفسه.'
  },
  {
    id: 'd-10',
    title: 'استشارات هندسية وحلول أرشفة للعملاء',
    contactId: 'c-3',
    contactName: 'عبدالله الحارثي',
    company: 'مؤسسة إعمار وبناء للمقاولات',
    value: 28000,
    probability: 15,
    stage: 'new',
    expectedCloseDate: '2026-09-10',
    assignedTo: 'خالد العتيبي',
    priority: 'low'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'tsk-1',
    title: 'إرسال العقد النهائي المراجع لشركة الأفق التقني',
    dueDate: '2026-07-26',
    dueTime: '01:00 م',
    priority: 'high',
    completed: false,
    relatedToType: 'deal',
    relatedToId: 'd-1',
    relatedToName: 'تطوير وتفعيل نظام إدارة العلاقات',
    assignedTo: 'سارة المنصور'
  },
  {
    id: 'tsk-2',
    title: 'مكالمة متابعة مع د. نورة السبيعي لاعتماد العرض',
    dueDate: '2026-07-26',
    dueTime: '11:30 ص',
    priority: 'high',
    completed: false,
    relatedToType: 'contact',
    relatedToId: 'c-2',
    relatedToName: 'مجموعة الرياض الطبية',
    assignedTo: 'أحمد الغامدي'
  },
  {
    id: 'tsk-3',
    title: 'تجهيز عرض السعر المخصص لشركة سلاسل الإمداد اللوجستية',
    dueDate: '2026-07-27',
    dueTime: '03:00 م',
    priority: 'medium',
    completed: false,
    relatedToType: 'deal',
    relatedToId: 'd-5',
    relatedToName: 'نظام إدارة تتبع أسطول النقل',
    assignedTo: 'خالد العتيبي'
  },
  {
    id: 'tsk-4',
    title: 'اجتماع التدريب الشهري لفريق خدمة العملاء',
    dueDate: '2026-07-28',
    dueTime: '10:00 ص',
    priority: 'medium',
    completed: true,
    relatedToType: 'none',
    assignedTo: 'أحمد الغامدي'
  },
  {
    id: 'tsk-5',
    title: 'التواصل مع أكاديمية النجاح للترحيب وتوضيح الباقات',
    dueDate: '2026-07-26',
    dueTime: '04:30 م',
    priority: 'low',
    completed: false,
    relatedToType: 'contact',
    relatedToId: 'c-6',
    relatedToName: 'أكاديمية النجاح للتدريب',
    assignedTo: 'سارة المنصور'
  },
  {
    id: 'tsk-6',
    title: 'مراجعة أداء الربع الثاني وتجهيز التقرير التنفيذي',
    dueDate: '2026-07-29',
    priority: 'high',
    completed: true,
    relatedToType: 'none',
    assignedTo: 'أحمد الغامدي'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'إغلاق صفقة ناجحة! 🎉',
    message: 'قامت سارة المنصور بإغلاق صفقة "ترقية الباقة وكالة إبداع" بقيمة 60,000 ر.س.',
    time: 'منذ 15 دقيقة',
    read: false,
    type: 'deal'
  },
  {
    id: 'n-2',
    title: 'عميل محتمل جديد',
    message: 'تم تسجيل عميل جديد عبر الموقع: لمى الحربي (أكاديمية النجاح للتدريب).',
    time: 'منذ ساعتين',
    read: false,
    type: 'contact'
  },
  {
    id: 'n-3',
    title: 'تذكير مهمة عاجلة 🔥',
    message: 'حان موعد مكالمة المتابعة مع د. نورة السبيعي لاعتماد العرض.',
    time: 'منذ 3 ساعات',
    read: false,
    type: 'task'
  },
  {
    id: 'n-4',
    title: 'تحديث النظام النسخة 2.4',
    message: 'تم تفعيل خاصية السحب والإفلات السريع باللوحة وتحديث شاشات الوضع الليلي.',
    time: 'أمس',
    read: true,
    type: 'system'
  }
];

export const initialMonthlyReports: SalesMonthlyReport[] = [
  { month: 'يناير', revenue: 145000, target: 150000, dealsCount: 8 },
  { month: 'فبراير', revenue: 180000, target: 170000, dealsCount: 11 },
  { month: 'مارس', revenue: 210000, target: 200000, dealsCount: 14 },
  { month: 'أبريل', revenue: 195000, target: 200000, dealsCount: 12 },
  { month: 'مايو', revenue: 280000, target: 250000, dealsCount: 16 },
  { month: 'يونيو', revenue: 320000, target: 300000, dealsCount: 19 },
  { month: 'يوليو (حالي)', revenue: 385000, target: 350000, dealsCount: 22 }
];

// LocalStorage Persistence Helpers
const STORAGE_KEYS = {
  CONTACTS: 'crm_pro_contacts_v1',
  DEALS: 'crm_pro_deals_v1',
  TASKS: 'crm_pro_tasks_v1',
  NOTIFICATIONS: 'crm_pro_notifs_v1',
  THEME: 'crm_pro_theme_v1',
  USERS: 'crm_pro_users_v1',
  AUTH_USER: 'crm_pro_auth_user_v1',
  LANGUAGE: 'crm_pro_language_v1'
};

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}

export function resetAllStorageToDefaults(): void {
  localStorage.removeItem(STORAGE_KEYS.CONTACTS);
  localStorage.removeItem(STORAGE_KEYS.DEALS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  window.location.reload();
}

export { STORAGE_KEYS };
