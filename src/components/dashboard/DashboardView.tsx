import React, { useState } from 'react';
import { 
  Users, 
  Kanban, 
  DollarSign, 
  CheckSquare, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  Mail, 
  FileText, 
  ChevronLeft,
  X,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { Contact, Deal, Task, SalesMonthlyReport, ViewType } from '../../types';
import { STAGE_LABELS, STAGE_COLORS } from '../../data/mockData';
import { getLocalizedStageLabel } from '../../utils/i18n';

interface DashboardViewProps {
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  monthlyReports: SalesMonthlyReport[];
  onSelectView: (view: ViewType) => void;
  onToggleTaskComplete: (id: string) => void;
  onOpenQuickAdd: (tab?: 'contact' | 'deal' | 'task') => void;
  language?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contacts,
  deals,
  tasks,
  monthlyReports,
  onSelectView,
  onToggleTaskComplete,
  onOpenQuickAdd,
  language = 'ar'
}) => {
  const [showWelcome, setShowWelcome] = useState(true);

  // Key Metrics Calculations
  const totalContacts = contacts.length;
  const activeLeads = contacts.filter(c => c.status === 'lead' || c.status === 'qualified').length;
  
  const openDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
  const openDealsValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  
  const wonDeals = deals.filter(d => d.stage === 'won');
  const totalRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Pipeline Chart Data
  const stageDistribution = [
    { name: getLocalizedStageLabel('new', language), value: deals.filter(d => d.stage === 'new').length, color: '#3b82f6' },
    { name: getLocalizedStageLabel('contacted', language), value: deals.filter(d => d.stage === 'contacted').length, color: '#6366f1' },
    { name: getLocalizedStageLabel('proposal', language), value: deals.filter(d => d.stage === 'proposal').length, color: '#f59e0b' },
    { name: getLocalizedStageLabel('negotiation', language), value: deals.filter(d => d.stage === 'negotiation').length, color: '#a855f7' },
    { name: getLocalizedStageLabel('won', language), value: deals.filter(d => d.stage === 'won').length, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Recent timeline activities across all contacts
  const allActivities = contacts.flatMap(c => 
    c.timeline.map(t => ({ ...t, contactName: c.name, company: c.company, contactId: c.id }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Onboarding / Welcome Banner */}
      {showWelcome && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 lg:p-8 shadow-2xl border border-blue-500/20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {language === 'en' ? 'Smart Integrated Enterprise CRM' : 'نظام CRM الذكي المتكامل للشركات'}
              </div>
              <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight leading-snug">
                {language === 'en' ? 'Welcome to your Dashboard! Ready to boost enterprise sales today?' : 'مرحباً بك في لوحة القيادة! جاهز لرفع كفاءة مبيعات شركتك اليوم؟'}
              </h2>
              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
                {language === 'en' 
                  ? 'This interactive workspace features a clean minimalist design with full bilingual support and dark mode. Track deals on Kanban, log interactions, and manage daily tasks smoothly.'
                  : 'تم تصميم هذه النسخة التفاعلية بأسلوب الـ Minimalist بدعم عربي كامل (RTL) والوضع الليلي. يمكنك متابعة مسار الصفقات عبر لوحة الكانبان، تسجيل المكالمات، وإدارة المهام اليومية لفريقك بسلاسة.'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto">
              <button
                onClick={() => onOpenQuickAdd('deal')}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs lg:text-sm font-extrabold shadow-lg shadow-blue-500/30 transition-all text-center"
              >
                {language === 'en' ? '+ New Deal' : '+ إضافة صفقة جديدة'}
              </button>
              <button
                onClick={() => setShowWelcome(false)}
                className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title={language === 'en' ? 'Hide Welcome' : 'إخفاء الترحيب'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Leads */}
        <div 
          onClick={() => onSelectView('contacts')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Accounts & Contacts' : 'العملاء والحسابات'}</span>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white">{totalContacts}</h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{language === 'en' ? `${activeLeads} active leads` : `${activeLeads} عميل محتمل ونشط`}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Open Deals */}
        <div 
          onClick={() => onSelectView('deals')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Open Deals (Pipeline)' : 'الصفقات المفتوحة (Pipeline)'}</span>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Kanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white">{openDeals.length}</h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-purple-600 dark:text-purple-400 font-semibold">
              <span>{language === 'en' ? `Expected Value: $${openDealsValue.toLocaleString()}` : `قيمة متوقعة: ${openDealsValue.toLocaleString()} ر.س`}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Revenue Won */}
        <div 
          onClick={() => onSelectView('reports')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Won Revenue (Closed)' : 'الإيرادات المحققة (المغلقة)'}</span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {totalRevenue.toLocaleString()} <span className="text-sm font-bold">{language === 'en' ? 'SAR' : 'ر.س'}</span>
            </h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-semibold">
              <span>{language === 'en' ? `${wonDeals.length} won deals this quarter` : `${wonDeals.length} صفقات ناجحة هذا الربع`}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Today's Tasks */}
        <div 
          onClick={() => onSelectView('tasks')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Daily Follow-up Tasks' : 'المهام والمتابعات اليومية'}</span>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white">{pendingTasks.length}</h3>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">{language === 'en' ? 'pending' : 'متبقية'}</span>
            </div>
            {/* Completion Progress bar */}
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row: Monthly Revenue & Pipeline Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Sales Revenue (Area Chart) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" /> {language === 'en' ? 'Monthly Sales & Revenue Growth (2026)' : 'نمو المبيعات والإيرادات الشهرية (2026)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{language === 'en' ? 'Actual performance vs monthly sales targets' : 'مقارنة المحقق الفعلي مع الأهداف البيعية الشهرية'}</p>
            </div>
            <button
              onClick={() => onSelectView('reports')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              {language === 'en' ? 'View Detailed Report' : 'عرض التقرير التفصيلي'} <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyReports} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ${language === 'en' ? 'SAR' : 'ر.س'}`, '']}
                  labelFormatter={(label) => language === 'en' ? `Month ${label}` : `شهر ${label}`}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" name={language === 'en' ? 'Actual Revenue' : 'المحقق الفعلي'} stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="target" name={language === 'en' ? 'Monthly Target' : 'الهدف الشهري'} stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorTarget)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-around text-center">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">{language === 'en' ? 'Total Revenue (July)' : 'إجمالي المحقق في يوليو'}</p>
              <p className="text-sm font-extrabold text-blue-600 dark:text-blue-400">385,000 {language === 'en' ? 'SAR' : 'ر.س'}</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">{language === 'en' ? 'Target Achievement' : 'نسبة تحقيق الهدف'}</p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">+10% {language === 'en' ? 'vs Target 🚀' : 'عن المستهدف 🚀'}</p>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-[11px] text-slate-400 font-semibold">{language === 'en' ? 'Monthly Deals Count' : 'عدد صفقات الشهر'}</p>
              <p className="text-sm font-extrabold text-slate-800 dark:text-white">22 {language === 'en' ? 'deals' : 'صفقة'}</p>
            </div>
          </div>
        </div>

        {/* Chart 2: Pipeline Stage Distribution (Donut Chart) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-1">
              {language === 'en' ? 'Deals Distribution by Stage' : 'توزيع الصفقات حسب المرحلة'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Quick overview of bottlenecks & pipeline' : 'نظرة سريعة على اختناقات ومسار التفاوض'}
            </p>
          </div>

          <div className="h-56 sm:h-64 w-full flex items-center justify-center my-2" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} ${language === 'en' ? 'deals' : 'صفقات'}`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Legend */}
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {stageDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-700/40 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-800 dark:text-white">{item.value} {language === 'en' ? 'deals' : 'صفقات'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activities Timeline & Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Today's Tasks Checklist */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-500" /> {language === 'en' ? 'Daily Tasks & Reminders' : 'المهام والتذكيرات اليومية'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? 'Click checkbox to mark task completion' : 'انقر على مربع الاختيار لتحديد إنجاز المهمة'}
              </p>
            </div>
            <button
              onClick={() => onOpenQuickAdd('task')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              {language === 'en' ? '+ New Task' : '+ مهمة جديدة'}
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
            {tasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {language === 'en' ? 'No tasks registered yet' : 'لا توجد مهام مسجلة حتى الآن'}
              </div>
            ) : (
              tasks.slice(0, 5).map((t) => (
                <div 
                  key={t.id}
                  onClick={() => onToggleTaskComplete(t.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    t.completed 
                      ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-500/40 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    t.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold transition-all ${t.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                      {t.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3" /> {t.dueDate} {t.dueTime ? `• ${t.dueTime}` : ''}
                      </span>
                      {t.relatedToName && (
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-semibold truncate max-w-[150px]">
                          {t.relatedToName}
                        </span>
                      )}
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        t.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                        t.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {t.priority === 'high' ? (language === 'en' ? 'High 🔥' : 'عاجلة 🔥') : t.priority === 'medium' ? (language === 'en' ? 'Medium ⚡' : 'متوسطة') : (language === 'en' ? 'Normal 📌' : 'عادية')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-center">
            <button
              onClick={() => onSelectView('tasks')}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {language === 'en' ? `View all tasks and reminders (${tasks.length}) →` : `عرض جميع المهام والتذكيرات (${tasks.length}) ←`}
            </button>
          </div>
        </div>

        {/* Widget 2: Recent Timeline Interactions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> {language === 'en' ? 'Recent Client Interactions (Timeline)' : 'أحدث التفاعلات مع العملاء (Timeline)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'en' ? 'Call logs, meetings, and recent messages' : 'سجل المكالمات، الاجتماعات، والرسائل الأخيرة'}
              </p>
            </div>
            <button
              onClick={() => onSelectView('contacts')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {language === 'en' ? 'Contacts Directory' : 'سجل العملاء'}
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-72 pr-1">
            {allActivities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                {language === 'en' ? 'No interactions recorded in timeline yet' : 'لا توجد تفاعلات مسجلة في التايم لاين بعد'}
              </div>
            ) : (
              allActivities.map((act, idx) => {
                const icons = {
                  call: <PhoneCall className="w-4 h-4 text-emerald-500" />,
                  email: <Mail className="w-4 h-4 text-blue-500" />,
                  meeting: <Users className="w-4 h-4 text-purple-500" />,
                  note: <FileText className="w-4 h-4 text-amber-500" />
                };

                return (
                  <div key={idx} className="flex gap-3 items-start relative pb-3 border-b border-slate-100 dark:border-slate-700/40 last:border-0 last:pb-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0 shadow-sm">
                      {icons[act.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate">{act.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{act.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">{act.details}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{act.contactName} ({act.company})</span>
                        <span>• {language === 'en' ? 'By:' : 'بواسطة:'} {act.performedBy}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 text-center">
            <button
              onClick={() => onSelectView('contacts')}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {language === 'en' ? 'Go to Contacts to add a new interaction →' : 'الانتقال لإدارة العملاء لإضافة تفاعل جديد ←'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
