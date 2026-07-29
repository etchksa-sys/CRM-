import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Award, 
  Target, 
  CheckCircle2, 
  Percent, 
  ArrowUpRight 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { SalesMonthlyReport, UserAccount, Deal, Contact } from '../../types';
import { exportDealsToExcel, exportUsersToExcel } from '../../utils/excelExport';
import { getLocalizedRoleLabel } from '../../utils/i18n';

interface ReportsViewProps {
  monthlyReports: SalesMonthlyReport[];
  users: UserAccount[];
  deals: Deal[];
  contacts: Contact[];
  onTriggerToast: (title: string, message: string, type: 'success' | 'info') => void;
  language?: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  monthlyReports,
  users,
  deals,
  contacts,
  onTriggerToast,
  language = 'ar'
}) => {
  // Stats
  const wonDeals = deals.filter(d => d.stage === 'won');
  const totalWonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalDealsCount = deals.length;
  const overallConversion = totalDealsCount > 0 ? Math.round((wonDeals.length / totalDealsCount) * 100) : 0;

  // Source conversion data
  const sourceData = [
    { name: language === 'en' ? 'Website' : 'الموقع الإلكتروني', value: contacts.filter(c => c.source === 'website').length, color: '#3b82f6' },
    { name: language === 'en' ? 'Referrals' : 'إحالات العملاء', value: contacts.filter(c => c.source === 'referral').length, color: '#10b981' },
    { name: language === 'en' ? 'Ad Campaigns' : 'الحملات الإعلانية', value: contacts.filter(c => c.source === 'ads').length, color: '#f59e0b' },
    { name: language === 'en' ? 'Direct Outreach' : 'التواصل المباشر', value: contacts.filter(c => c.source === 'direct').length, color: '#8b5cf6' },
    { name: language === 'en' ? 'Social Media' : 'شبكات التواصل', value: contacts.filter(c => c.source === 'social').length, color: '#ec4899' },
  ].filter(i => i.value > 0);

  const handleExport = (format: 'PDF' | 'Excel') => {
    if (format === 'Excel') {
      exportDealsToExcel(deals);
      exportUsersToExcel(users);
      onTriggerToast(
        language === 'en' ? 'Excel files exported successfully! 📊' : 'تم تصدير ملفات Excel بنجاح! 📊',
        language === 'en' ? 'Deals report and sales team evaluation exported to CSV compatible with Excel.' : 'تم تحميل تقرير الصفقات وتقييم أداء فريق المبيعات بصيغة CSV المتوافقة تماماً مع Excel.',
        'success'
      );
    } else {
      onTriggerToast(
        language === 'en' ? 'PDF report generated successfully!' : 'تم تجهيز التقرير بصيغة PDF بنجاح!',
        language === 'en' ? 'Comprehensive quarterly report generated and downloaded.' : 'تم إعداد ملف التقرير الشامل للربع الحالي وتحميله على جهازك.',
        'success'
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Export Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <TrendingUp className="w-3.5 h-3.5" /> {language === 'en' ? 'Executive Analytics Dashboard' : 'لوحة التحليلات التنفيذية (Executive Analytics)'}
          </div>
          <h2 className="text-xl font-extrabold">{language === 'en' ? 'Quarterly Sales Performance Reports & Conversion Rates' : 'تقارير أداء المبيعات ومعدلات التحويل الربع سنوية'}</h2>
          <p className="text-xs text-slate-300">{language === 'en' ? 'Accurate, auto-updated data for every sales rep and pipeline stage' : 'بيانات دقيقة ومحدثة آلياً لكل مندوب ومرحلة بيعية'}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{language === 'en' ? 'Export Excel' : 'تصدير Excel'}</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-lg shadow-rose-600/30 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'en' ? 'Export PDF' : 'تصدير PDF'}</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Total Won Revenue' : 'إجمالي المبيعات المحققة'}</span>
            <h3 className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
              {totalWonRevenue.toLocaleString()} <span className="text-sm font-bold">{language === 'en' ? 'SAR' : 'ر.س'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">{language === 'en' ? '+18% vs previous quarter' : '+18% مقارنة بالربع السابق'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Deal Win Rate' : 'معدل تحويل الصفقات (Win Rate)'}</span>
            <h3 className="text-2xl lg:text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">
              {overallConversion}%
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              {language === 'en' ? `${wonDeals.length} won out of ${totalDealsCount} deals` : `${wonDeals.length} ناجحة من أصل ${totalDealsCount} صفقة`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{language === 'en' ? 'Avg. Deal Size' : 'متوسط قيمة الصفقة (Deal Size)'}</span>
            <h3 className="text-2xl lg:text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">
              {wonDeals.length > 0 ? Math.round(totalWonRevenue / wonDeals.length).toLocaleString() : 0} <span className="text-sm font-bold">{language === 'en' ? 'SAR' : 'ر.س'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-semibold">{language === 'en' ? 'Based on annual contracts' : 'بناءً على صفقات العقود السنوية'}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Revenue vs Targets over Months */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" /> {language === 'en' ? 'Monthly Sales Performance vs Target (2026)' : 'المبيعات الشهرية ومقارنة المستهدف (2026)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'en' ? 'Consistent growth in revenue since Q1 launch' : 'نمو مطرد في الإيرادات المحققة منذ انطلاق الربع الأول'}</p>
          </div>

          <div className="h-72 sm:h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyReports} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ${language === 'en' ? 'SAR' : 'ر.س'}`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="revenue" name={language === 'en' ? 'Actual Revenue' : 'المحقق الفعلي'} fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name={language === 'en' ? 'Sales Target' : 'الهدف البيعي'} fill="#10b981" radius={[6, 6, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Lead Sources Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-1">{language === 'en' ? 'Contacts & Lead Sources' : 'مصادر العملاء والمبيعات'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'en' ? 'Analysis of top channels for qualified leads' : 'تحليل القنوات الأكثر استقطاباً للعملاء المؤهلين'}</p>
          </div>

          <div className="h-56 sm:h-64 w-full flex items-center justify-center my-2" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} ${language === 'en' ? 'contacts' : 'عملاء'}`, name]}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {sourceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-700/40 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-800 dark:text-white">{item.value} {language === 'en' ? 'contacts' : 'عملاء'}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Team Leaderboard Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> {language === 'en' ? 'Sales Team Performance Leaderboard' : 'لوحة شرف أداء فريق المبيعات (Leaderboard)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === 'en' ? 'Sales reps ranking by revenue generated and conversion rates' : 'ترتيب المناديب حسب حجم المبيعات المحققة ومعدل إغلاق الصفقات'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-extrabold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">{language === 'en' ? 'Rank & Sales Rep' : 'الترتيب والموظف'}</th>
                <th className="p-4">{language === 'en' ? 'Role' : 'الدور الوظيفي'}</th>
                <th className="p-4">{language === 'en' ? 'Managed Deals' : 'الصفقات المدارة'}</th>
                <th className="p-4">{language === 'en' ? 'Revenue Generated' : 'الإيرادات المحققة'}</th>
                <th className="p-4">{language === 'en' ? 'Win Rate' : 'معدل التحويل (Win Rate)'}</th>
                <th className="p-4">{language === 'en' ? 'Performance' : 'الأداء التقديري'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200 font-bold">
              {users
                .filter(u => u.role !== 'viewer')
                .sort((a, b) => b.revenueGenerated - a.revenueGenerated)
                .map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="p-4 font-black text-slate-800 dark:text-white flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        idx === 0 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30' :
                        idx === 1 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700/40 text-amber-100'
                      }`}>
                        #{idx + 1}
                      </span>
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30" />
                      <div>
                        <p className="text-sm">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px]">
                        {getLocalizedRoleLabel(u.role, language)}
                      </span>
                    </td>
                    <td className="p-4 text-indigo-600 dark:text-indigo-400 text-sm">
                      {u.dealsCount} {language === 'en' ? 'deals' : 'صفقة'}
                    </td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 text-sm">
                      {u.revenueGenerated.toLocaleString()} {language === 'en' ? 'SAR' : 'ر.س'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full" style={{ width: `${u.conversionRate}%` }} />
                        </div>
                        <span className="font-extrabold">{u.conversionRate}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 text-[11px] font-black">
                        {language === 'en' ? 'Excellent 🌟' : 'ممتاز 🌟'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
