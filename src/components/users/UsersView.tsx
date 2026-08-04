import React, { useState } from 'react';
import { 
  UserCheck, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Lock, 
  Globe, 
  User, 
  MoreVertical,
  Target,
  TrendingUp,
  AlertTriangle,
  FileText,
  X,
  Edit3,
  BarChart2
} from 'lucide-react';
import { UserAccount, Deal, UserRole } from '../../types';
import { getRoleLabel, getRoleBadge, hasUserCreationPermission } from '../../data/mockData';
import { getLocalizedRoleLabel } from '../../utils/i18n';

interface UsersViewProps {
  users: UserAccount[];
  deals?: Deal[];
  currentUser?: UserAccount;
  onAddUser: (user: Omit<UserAccount, 'id'>) => void;
  onUpdateUser?: (user: UserAccount) => void;
  onDeleteUser?: (id: string) => void;
  onTriggerToast: (title: string, message: string, type: 'success' | 'info') => void;
  language?: string;
}

export const UsersView: React.FC<UsersViewProps> = ({
  users,
  deals,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onTriggerToast,
  language = 'ar'
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('sales_engineer');
  const [canCreateUsers, setCanCreateUsers] = useState(false);
  const [authCode, setAuthCode] = useState('CRM-2026');
  const [allowedPages, setAllowedPages] = useState<ViewType[]>(['dashboard', 'contacts', 'deals', 'tasks', 'reports', 'users', 'settings']);

  // Rep Evaluation Audit State
  const [selectedUserForAudit, setSelectedUserForAudit] = useState<UserAccount | null>(null);
  const [editingFeedback, setEditingFeedback] = useState<string>('');
  const [editingTarget, setEditingTarget] = useState<number | ''>('');
  const [editingPeriod, setEditingPeriod] = useState<'monthly' | 'quarterly' | 'half_yearly' | 'yearly'>('monthly');
  const [editingRole, setEditingRole] = useState<UserRole>('sales_engineer');
  const [editingCanCreate, setEditingCanCreate] = useState(false);
  const [editingAllowedPages, setEditingAllowedPages] = useState<ViewType[]>(['dashboard', 'contacts', 'deals', 'tasks', 'reports', 'users', 'settings']);

  const ALL_SYSTEM_PAGES: { id: ViewType; labelAr: string; labelEn: string }[] = [
    { id: 'dashboard', labelAr: '📊 لوحة التحكم والمؤشرات', labelEn: '📊 Dashboard' },
    { id: 'contacts', labelAr: '👥 سجل العملاء والحسابات', labelEn: '👥 Contacts' },
    { id: 'deals', labelAr: '💼 لوحة الصفقات (Kanban)', labelEn: '💼 Deals' },
    { id: 'tasks', labelAr: '📌 المهام والمواعيد', labelEn: '📌 Tasks' },
    { id: 'reports', labelAr: '📈 التقارير والتحليلات', labelEn: '📈 Reports' },
    { id: 'users', labelAr: '👨‍💼 فريق العمل والصلاحيات', labelEn: '👨‍💼 Team' },
    { id: 'settings', labelAr: '⚙️ إعدادات النظام', labelEn: '⚙️ Settings' }
  ];

  const getPeriodLabel = (period?: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly') => {
    switch (period) {
      case 'quarterly': return 'الربع سنوي';
      case 'half_yearly': return 'النصف سنوي';
      case 'yearly': return 'السنوي';
      case 'monthly':
      default:
        return 'الشهري';
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Security Authorization Enforcement
    const isUserAuthorized = hasUserCreationPermission(currentUser);
    const isValidCode = authCode.trim().toUpperCase() === 'CRM-2026' || authCode.trim().toUpperCase() === 'ADMIN-2026';

    if (!isUserAuthorized && !isValidCode) {
      onTriggerToast(
        'تنبيه سياسة الأمان 🔒',
        '💡 تطبيقاً لسياسة الأمان: لا يمكن تسجيل أي موظف أو حساب جديد إلا بموافقة المدير العام أو من يمتلك صلاحية (تسجيل جديد). الرمز الافتراضي للتجربة: CRM-2026.',
        'info'
      );
      return;
    }

    onAddUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+966 5x xxx xxxx',
      role,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 80000000)}?auto=format&fit=crop&q=80&w=250`,
      dealsCount: 0,
      revenueGenerated: 0,
      conversionRate: 0,
      status: 'active',
      monthlyTarget: 450000,
      targetPeriod: 'monthly',
      kpiScore: 80,
      lastActiveDate: 'الآن',
      managerFeedback: 'موظف جديد تحت فترة التقييم والتجربة.',
      stagnantDealsCount: 0,
      canCreateUsers: canCreateUsers || role === 'admin' || role === 'sales_manager',
      allowedPages: allowedPages.length > 0 ? allowedPages : ['dashboard', 'contacts', 'deals', 'tasks', 'reports', 'users', 'settings']
    });

    setName('');
    setEmail('');
    setPhone('');
    setShowAddForm(false);
    onTriggerToast('تم إضافة الموظف بنجاح 🎉', `تم اعتماد التسجيل ومنح الصلاحيات للموظف الجديد: ${name}`, 'success');
  };

  const handleOpenAudit = (user: UserAccount) => {
    setSelectedUserForAudit(user);
    setEditingFeedback(user.managerFeedback || '');
    setEditingTarget(user.monthlyTarget || 500000);
    setEditingPeriod(user.targetPeriod || 'monthly');
    setEditingRole(user.role);
    setEditingCanCreate(user.canCreateUsers || user.role === 'admin' || user.role === 'sales_manager');
    setEditingAllowedPages(user.allowedPages && user.allowedPages.length > 0 ? user.allowedPages : ['dashboard', 'contacts', 'deals', 'tasks', 'reports', 'users', 'settings']);
  };

  const handleSaveFeedback = () => {
    if (selectedUserForAudit) {
      const updatedUser: UserAccount = {
        ...selectedUserForAudit,
        role: editingRole,
        canCreateUsers: editingCanCreate || editingRole === 'admin' || editingRole === 'sales_manager',
        allowedPages: editingAllowedPages,
        managerFeedback: editingFeedback,
        targetPeriod: editingPeriod,
        monthlyTarget: typeof editingTarget === 'number' && editingTarget >= 0 ? editingTarget : selectedUserForAudit.monthlyTarget
      };
      onUpdateUser?.(updatedUser);
      onTriggerToast(
        'تم حفظ التقييم والصلاحيات ✨',
        `تم تحديث التارجت والصفحات المتاحة للموظف ${updatedUser.name} بنجاح.`,
        'success'
      );
      setSelectedUserForAudit(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" /> إدارة فريق العمل وتقييم الأداء والمستهدفات (Audit & KPI)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            متابعة دقيقة لنسب إنجاز التارجت، الصفقات المتأخرة، وتقييم المدير المباشر لكل مندوب مبيعات
          </p>
        </div>

        <button
          onClick={() => {
            if (currentUser && !hasUserCreationPermission(currentUser)) {
              onTriggerToast(
                'تنبيه الصلاحيات 🔒',
                'لا يمكن إنشاء حسابات أو موظفين جدد إلا عن طريق المدير العام أو من تم منحه صلاحية (تسجيل حسابات جديدة) في إعدادات الموظف.',
                'info'
              );
              return;
            }
            setShowAddForm(!showAddForm);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition-all shrink-0 ${
            !currentUser || hasUserCreationPermission(currentUser)
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
              : 'bg-slate-200 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600'
          }`}
          title={currentUser && !hasUserCreationPermission(currentUser) ? 'مقتصر على المدير العام أو من يمتلك صلاحية تسجيل جديد' : 'إضافة موظف جديد'}
        >
          {currentUser && !hasUserCreationPermission(currentUser) ? (
            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
          ) : (
            <UserPlus className="w-4 h-4 shrink-0" />
          )}
          <span>{showAddForm ? 'إغلاق النموذج' : 'إضافة موظف جديد'}</span>
        </button>
      </div>

      {/* Rep Audit & Evaluation Modal / Overlay */}
      {selectedUserForAudit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUserForAudit(null)}
              className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Rep Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <img 
                src={selectedUserForAudit.avatar} 
                alt={selectedUserForAudit.name} 
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-purple-500/20 shadow-md" 
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">{selectedUserForAudit.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-extrabold">
                    {getRoleBadge(selectedUserForAudit.role)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  📧 {selectedUserForAudit.email} | 📞 {selectedUserForAudit.phone} | 🕒 آخر نشاط: {selectedUserForAudit.lastActiveDate || 'اليوم'}
                </p>
              </div>
            </div>

            {/* Target & KPI Grid */}
            {(() => {
              const userDeals = deals?.filter(d => d.assignedTo === selectedUserForAudit.name) || [];
              const openDeals = userDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
              const totalOpenValue = openDeals.reduce((sum, d) => sum + d.value, 0);
              const weightedOpenValue = Math.round(openDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0));
              const forecastedTotalRevenue = selectedUserForAudit.revenueGenerated + weightedOpenValue;
              const targetVal = typeof editingTarget === 'number' && editingTarget > 0 ? editingTarget : (selectedUserForAudit.monthlyTarget || 1);
              const forecastedAchievementPercent = Math.round((forecastedTotalRevenue / targetVal) * 100);

              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Target Achievement with Edit & Period Selector */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                            <Target className="w-4 h-4 text-blue-600" /> المستهدف ({getPeriodLabel(editingPeriod)})
                          </span>
                        </div>

                        {/* Period selector buttons */}
                        <div className="flex items-center gap-1 bg-blue-100/60 dark:bg-blue-900/40 p-1 rounded-xl mb-2.5">
                          {(['monthly', 'quarterly', 'half_yearly', 'yearly'] as const).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setEditingPeriod(p)}
                              className={`flex-1 py-1 px-1.5 text-[10px] font-extrabold rounded-lg transition-all ${
                                editingPeriod === p
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-blue-800 dark:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50'
                              }`}
                              title={`تحويل حساب التارجت إلى ${getPeriodLabel(p)}`}
                            >
                              {p === 'monthly' ? 'شهري' : p === 'quarterly' ? 'ربع سنوي' : p === 'half_yearly' ? 'نصف سنوي' : 'سنوي'}
                            </button>
                          ))}
                        </div>

                        <div className="mt-1 flex items-center gap-1.5">
                          <input
                            type="number"
                            value={editingTarget}
                            onChange={(e) => setEditingTarget(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-28 p-1 text-base font-black text-slate-800 dark:text-white bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-center shadow-inner"
                            title={`تعديل قيمة التارجت (${getPeriodLabel(editingPeriod)})`}
                            placeholder="التارجت"
                          />
                          <span className="text-xs font-bold text-slate-500">ر.س</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                          <span>المحقق: {selectedUserForAudit.revenueGenerated.toLocaleString()}</span>
                          <span>{targetVal ? Math.round((selectedUserForAudit.revenueGenerated / targetVal) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              (selectedUserForAudit.revenueGenerated / targetVal) >= 1 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`} 
                            style={{ width: `${Math.min(100, (selectedUserForAudit.revenueGenerated / targetVal) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* KPI Grade */}
                    <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-purple-600" /> مؤشر الكفاءة (KPI Score)
                      </span>
                      <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
                        {selectedUserForAudit.kpiScore || 85}/100
                      </h4>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-purple-200/60 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-[11px] font-black">
                        {(selectedUserForAudit.kpiScore || 0) >= 90 ? 'أداء ممتاز 🌟' : (selectedUserForAudit.kpiScore || 0) >= 75 ? 'جيد جداً 👍' : 'يحتاج تطوير ⚡'}
                      </span>
                    </div>

                    {/* Stagnant Deals Alert */}
                    <div className={`p-4 rounded-2xl border ${
                      (selectedUserForAudit.stagnantDealsCount || 0) > 0 
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/50 text-amber-900 dark:text-amber-200' 
                        : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                    }`}>
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        {(selectedUserForAudit.stagnantDealsCount || 0) > 0 ? <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        <span>حالة الصفقات الراكدة</span>
                      </span>
                      <h4 className="text-xl font-black mt-2">
                        {selectedUserForAudit.stagnantDealsCount || 0} صفقات متأخرة
                      </h4>
                      <p className="text-[10px] mt-1 opacity-80 font-semibold">
                        {(selectedUserForAudit.stagnantDealsCount || 0) > 0 ? 'لم يتم تحديثها منذ أكثر من 14 يوماً' : 'جميع الصفقات في حركة نشطة وتحديث مستمر'}
                      </p>
                    </div>
                  </div>

                  {/* Weighted Pipeline Forecasting Box */}
                  {deals && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200/80 dark:border-purple-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>حساب الإيراد المتوقع الموزون (Weighted Pipeline Forecast - {getPeriodLabel(editingPeriod)})</span>
                        </h4>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                          احتمالية الإغلاق الموزونة
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        يتم حساب التوقع الموزون بضرب <strong className="text-purple-700 dark:text-purple-300">سعر كل صفقة مفتوحة × نسبة احتماليتها (%)</strong>. يُظهر هذا للمدير والمندوب فرصة تحقيق التارجت ({getPeriodLabel(editingPeriod)}) بناءً على الاحتماليات الحالية:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pt-1">
                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm">
                          <span className="text-[10px] text-slate-400 block font-bold">إجمالي الصفقات المفتوحة</span>
                          <span className="text-xs font-black text-slate-800 dark:text-white mt-0.5 block">
                            {totalOpenValue.toLocaleString()} <span className="text-[9px]">ر.س</span>
                          </span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 shadow-sm">
                          <span className="text-[10px] text-purple-600 dark:text-purple-400 block font-bold">التوقع الموزون (السعر × النسبة)</span>
                          <span className="text-xs font-black text-purple-700 dark:text-purple-300 mt-0.5 block">
                            +{weightedOpenValue.toLocaleString()} <span className="text-[9px]">ر.س</span>
                          </span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">الإيراد المتوقع ({getPeriodLabel(editingPeriod)})</span>
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                            {forecastedTotalRevenue.toLocaleString()} <span className="text-[9px]">({forecastedAchievementPercent}% من التارجت)</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Smart AI Recommendations for this Rep */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg space-y-2">
              <h4 className="text-xs font-extrabold text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> تحليل وتوصية النظام الذكية (AI Rep Performance Coach)
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {(selectedUserForAudit.conversionRate || 0) >= 70 ? (
                  `🌟 يمتلك ${selectedUserForAudit.name} معدل تحويل ممتاز (${selectedUserForAudit.conversionRate}%). يُنصح بإسناد الصفقات المؤسسية الكبرى (VIP) إليه لزيادة إجمالي العوائد، والاستفادة من مهاراته في توجيه الزملاء الجدد.`
                ) : (selectedUserForAudit.stagnantDealsCount || 0) > 0 ? (
                  `⚡ تنبيه: يوجد لدى ${selectedUserForAudit.name} ${selectedUserForAudit.stagnantDealsCount} صفقات معلقة لفترة طويلة في مرحلة التفاوض أو عرض السعر. يُقترح التدخل لمساعدته في تقديم خصومات تشجيعية أو إغلاقها لتفادي تسرب العملاء.`
                ) : (
                  `📌 أداء مستقر ومنتظم. لزيادة تحقيق التارجت الشهري، يُنصح بجدولة 3 اجتماعات مباشرة إضافية مع العملاء المحتملين خلال هذا الأسبوع.`
                )}
              </p>
            </div>

            {/* Position, Account Creation & Page Access Permissions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" /> تعديل المسمى الوظيفي وصلاحيات الوصول والقطاعات
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">المسمى الوظيفي المعتمد:</label>
                  <select
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="admin">👑 المدير العام (General Admin)</option>
                    <option value="sales_manager">🏆 مدير المبيعات (Sales Manager)</option>
                    <option value="senior_sales_engineer">⚡ مهندس مبيعات أول (Senior Sales Engineer)</option>
                    <option value="sales_engineer">⚙️ مهندس مبيعات (Sales Engineer)</option>
                    <option value="sales_consultant">💡 استشاري مبيعات (Sales Consultant)</option>
                    <option value="sales">🚀 مندوب مبيعات (Sales Rep)</option>
                    <option value="viewer">📊 مراقب ومحلل تقارير (Data Analyst)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={editingCanCreate || editingRole === 'admin' || editingRole === 'sales_manager'}
                      disabled={editingRole === 'admin' || editingRole === 'sales_manager'}
                      onChange={(e) => setEditingCanCreate(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>منح صلاحية إنشاء وتسجيل حسابات جديدة في النظام</span>
                  </label>
                </div>
              </div>

              {/* Page Access Selection (UI / Section Visibility Control) */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <label className="block text-xs font-extrabold text-slate-800 dark:text-white">
                  القطاعات والصفحات المسموح لهذا الموظف برؤيتها والوصول إليها:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {ALL_SYSTEM_PAGES.map((page) => {
                    const isChecked = editingAllowedPages.includes(page.id);
                    return (
                      <label
                        key={page.id}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 opacity-60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingAllowedPages(prev => [...prev, page.id]);
                            } else {
                              // Ensure at least one page remains
                              if (editingAllowedPages.length > 1) {
                                setEditingAllowedPages(prev => prev.filter(p => p !== page.id));
                              }
                            }
                          }}
                          className="w-3.5 h-3.5 rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>{page.labelAr}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Manager Review & Feedback Section */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-500" /> مراجعة وتقييم المدير المباشر (Manager Audit Notes):
              </label>
              <textarea
                rows={3}
                value={editingFeedback}
                onChange={(e) => setEditingFeedback(e.target.value)}
                placeholder="اكتب ملاحظات التقييم الدوري، نقاط القوة، أو التوجيهات للموظف..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                {onDeleteUser && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف الموظف ${selectedUserForAudit.name}؟`)) {
                        onDeleteUser(selectedUserForAudit.id);
                        setSelectedUserForAudit(null);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition-all"
                  >
                    حذف الموظف
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForAudit(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  إغلاق
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeedback}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30"
                >
                  حفظ التقييم والملاحظات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleCreateUser} className="p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 space-y-4 animate-in fade-in slide-in-from-top-3">
          <h4 className="text-sm font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" /> بيانات الموظف الجديد والصلاحية الوظيفية
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: عمر السعيد"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="omar@crm-pro.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الجوال</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xxxxxxxx"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المسمى الوظيفي والدور</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">👑 المدير العام (General Admin)</option>
                <option value="sales_manager">🏆 مدير المبيعات (Sales Manager)</option>
                <option value="senior_sales_engineer">⚡ مهندس مبيعات أول (Senior Sales Engineer)</option>
                <option value="sales_engineer">⚙️ مهندس مبيعات (Sales Engineer)</option>
                <option value="sales_consultant">💡 استشاري مبيعات (Sales Consultant)</option>
                <option value="sales">🚀 مندوب مبيعات (Sales Rep)</option>
                <option value="viewer">📊 مراقب ومحلل تقارير (Data Analyst)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="addCanCreateCheckbox"
              checked={canCreateUsers || role === 'admin' || role === 'sales_manager'}
              disabled={role === 'admin' || role === 'sales_manager'}
              onChange={(e) => setCanCreateUsers(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="addCanCreateCheckbox" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>منح هذا الموظف صلاحية إنشاء وتسجيل حسابات وموظفين جدد في النظام</span>
            </label>
          </div>

          {/* Allowed Pages Selection */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 dark:text-white">
              تحديد القطاعات والصفحات المتاحة للموظف (Section Access):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {ALL_SYSTEM_PAGES.map((page) => {
                const isChecked = allowedPages.includes(page.id);
                return (
                  <label
                    key={page.id}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAllowedPages(prev => [...prev, page.id]);
                        } else {
                          if (allowedPages.length > 1) {
                            setAllowedPages(prev => prev.filter(p => p !== page.id));
                          }
                        }
                      }}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{page.labelAr}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Security Authorization Policy Notice & Code Input */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>اعتماد وتصريح تسجيل الحسابات الجديدة (سياسة الأمان)</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-semibold">
              💡 تطبيقاً لسياسة الأمان: لا يمكن تسجيل أي موظف أو حساب جديد إلا بموافقة المدير العام أو من يمتلك صلاحية (تسجيل جديد). الرمز الافتراضي للتجربة: <b>CRM-2026</b>.
            </p>
            <div className="pt-1">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                رمز موافقة وتصريح الإدارة:
              </label>
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="CRM-2026"
                className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-amber-800 dark:text-amber-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/30"
            >
              حفظ بيانات الموظف
            </button>
          </div>
        </form>
      )}

      {/* Team Members Grid - Enhanced with Target progress and Audit Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((user) => {
          const targetPercent = user.monthlyTarget ? Math.min(100, Math.round((user.revenueGenerated / user.monthlyTarget) * 100)) : 0;
          const hasStagnant = (user.stagnantDealsCount || 0) > 0;

          return (
            <div
              key={user.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-50 dark:ring-slate-700 shadow-sm" />
                    {hasStagnant && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-800" title="يوجد صفقات متأخرة">
                        !
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    user.role === 'admin' || user.role === 'sales_manager' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
                    user.role === 'senior_sales_engineer' || user.role === 'sales_engineer' || user.role === 'sales_consultant' || user.role === 'sales' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {getRoleBadge(user.role)}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center justify-between">
                  <span>{user.name}</span>
                  {user.kpiScore && (
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-lg" title="مؤشر الكفاءة العام">
                      {user.kpiScore}%
                    </span>
                  )}
                </h4>
                
                <div className="space-y-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{user.phone}</span>
                  </p>
                </div>

                {/* Target Progress Bar */}
                {user.monthlyTarget !== undefined && user.monthlyTarget > 0 && (
                  <div className="mt-4 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      <span>إنجاز المستهدف ({getPeriodLabel(user.targetPeriod)}):</span>
                      <span className="font-black text-blue-600 dark:text-blue-400">{targetPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          targetPercent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`} 
                        style={{ width: `${targetPercent}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Performance Footer & Audit Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">الصفقات</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white">{user.dealsCount}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">الإيراد</span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{(user.revenueGenerated / 1000).toFixed(0)}k ر.س</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAudit(user)}
                  className="w-full py-2 px-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 dark:hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm group-hover:shadow"
                >
                  <BarChart2 className="w-4 h-4" />
                  <span>بطاقة تقييم ومراجعة الموظف</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Permissions Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" /> جدول الصلاحيات ومستوى التحكم (RBAC)
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          يضمن النظام سرية العملاء والصفقات عبر تحديد دقيق للأدوار:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/60 dark:border-purple-800/40">
            <span className="font-extrabold text-purple-700 dark:text-purple-300 text-sm block mb-2 flex items-center gap-1">👑 1. الإدارة العامة ومدير المبيعات</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> رؤية جميع العملاء والصفقات لكل الفريق</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> صلاحية إنشاء وتسجيل موظفين وحسابات جديدة</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> إدارة حسابات الموظفين وتغيير صلاحياتهم</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> تصدير تقارير الأداء الكاملة Excel/PDF</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/40">
            <span className="font-extrabold text-amber-800 dark:text-amber-300 text-sm block mb-2 flex items-center gap-1">⚡ 2. مهندس مبيعات (أول / عادي)</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> إدارة العروض والصفقات الفنية والمعقدة</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> نقل الصفقات في لوحة الكانبان وإضافة تفاعلات</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> يمكن للإدارة منحه صلاحية تسجيل مساعدين جدد</li>
              <li className="flex items-center gap-1.5 text-slate-400"><Lock className="w-3.5 h-3.5 shrink-0" /> لا يمكنه حذف حسابات الموظفين أو الصفقات الكبرى</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/60 dark:border-blue-800/40">
            <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm block mb-2 flex items-center gap-1">🚀 3. استشاري / مندوب مبيعات</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> إدارة العملاء والصفقات المسندة إليه فقط</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> جدولة المهام والمواعيد ومتابعة التذكيرات</li>
              <li className="flex items-center gap-1.5 text-slate-400 line-through"><Lock className="w-3.5 h-3.5 shrink-0" /> لا يمكنه إنشاء حسابات جديدة في النظام</li>
              <li className="flex items-center gap-1.5 text-slate-400 line-through"><Lock className="w-3.5 h-3.5 shrink-0" /> لا يمكنه التعديل على صفقات زملائه</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 text-sm block mb-2 flex items-center gap-1">📊 4. مراقب ومحلل (Viewer)</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> استعراض لوحة القيادة والرسوم البيانية</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> قراءة ملخصات التقارير العامة</li>
              <li className="flex items-center gap-1.5 text-slate-400 line-through"><Lock className="w-3.5 h-3.5 shrink-0" /> لا يمكنه التعديل أو الحذف أو الإضافة</li>
              <li className="flex items-center gap-1.5 text-slate-400 line-through"><Lock className="w-3.5 h-3.5 shrink-0" /> لا يمكنه إنشاء أو تسجيل حسابات</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Future Integration Readiness Notes (WhatsApp / Email / OAuth) */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-emerald-900/90 to-slate-900 text-white shadow-xl border border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> الجاهزية التقنية للتكامل المستقبلي (WhatsApp & Email Automation)
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              تم تصميم كود هذا النظام (معمارية الـ Frontend والـ Types) ليكون جاهزاً للربط مع بوابات التواصل في الخطوة التالية:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-semibold text-slate-200">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>إشعارات واتساب تلقائية عند إغلاق أو نقل الصفقة (WhatsApp Business API Ready)</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مزامنة البريد عبر SMTP وإرسال عروض الأسعار آلياً (Email Notifications Hooked)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

