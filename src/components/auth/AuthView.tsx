import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  ArrowLeft, 
  Building2,
  Briefcase
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types';
import { getRoleLabel, getRoleBadge, hasUserCreationPermission } from '../../data/mockData';

interface AuthViewProps {
  existingUsers: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
  onTriggerToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  existingUsers,
  onLogin,
  onRegister,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedQuickUser, setSelectedQuickUser] = useState<string | null>(existingUsers[0]?.id || null);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('sales_engineer');
  const [regTarget, setRegTarget] = useState('150000');
  const [regPeriod, setRegPeriod] = useState<'monthly' | 'quarterly' | 'half_yearly' | 'yearly'>('monthly');
  const [regAuthCode, setRegAuthCode] = useState('CRM-2026');
  const [regAuthManagerId, setRegAuthManagerId] = useState<string>('');

  // Handle Quick Login
  const handleQuickLogin = (user: UserAccount) => {
    onTriggerToast(
      `مرحباً بك مجدداً، ${user.name}! 👋`,
      `تم تسجيل الدخول بنجاح بحساب "${getRoleLabel(user.role)}"`,
      'success'
    );
    onLogin(user);
  };

  // Handle Form Login
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      onTriggerToast('تنبيه', 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم.', 'error');
      return;
    }

    // Try to match with existing users by email or name
    const found = existingUsers.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() ||
           u.name.toLowerCase().includes(loginEmail.trim().toLowerCase())
    );

    if (found) {
      handleQuickLogin(found);
    } else {
      // If not found in demo array, create a temporary session user or prompt to register
      const fallbackUser: UserAccount = {
        id: `u-${Date.now()}`,
        name: loginEmail.split('@')[0] || 'مستخدم جديد',
        email: loginEmail,
        phone: '+966 50 000 0000',
        role: 'sales',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        monthlyTarget: 150000,
        targetPeriod: 'monthly',
        revenueGenerated: 0,
        dealsCount: 0,
        conversionRate: 0,
        kpiScore: 80,
        status: 'active'
      };
      onTriggerToast(
        `تم تسجيل الدخول بنجاح! 🚀`,
        `مرحباً بك في جلسة العمل، ${fallbackUser.name}.`,
        'success'
      );
      onLogin(fallbackUser);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      onTriggerToast('خطأ في التسجيل', 'يرجى تعبئة كافة الحقول المطلوبة لإنشاء الحساب.', 'error');
      return;
    }

    // Enforce authorization rule for creating new accounts
    const isValidAuthCode = regAuthCode.trim().toUpperCase() === 'CRM-2026' || regAuthCode.trim().toUpperCase() === 'ADMIN-2026';
    const isManagerAuthorized = !!regAuthManagerId;

    if (!isValidAuthCode && !isManagerAuthorized) {
      onTriggerToast(
        'تنبيه الصلاحيات 🔒',
        'لا يمكن إنشاء حسابات جديدة إلا بموافقة أو كود تصريح من المدير العام أو من تم منحه صلاحية (تسجيل حسابات جديدة). يرجى إدخال كود موافقة الإدارة (CRM-2026) أو اختيار المدير المعتمد.',
        'error'
      );
      return;
    }

    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: '+966 5x xxx xxxx',
      role: regRole,
      avatar: randomAvatar,
      monthlyTarget: Number(regTarget) || 150000,
      targetPeriod: regPeriod,
      revenueGenerated: 0,
      dealsCount: 0,
      conversionRate: 0,
      kpiScore: 85,
      status: 'active',
      managerFeedback: 'مرحباً بانضمامك لفريق المبيعات! تم اعتماد الحساب بموافقة الإدارة العامة.',
      canCreateUsers: regRole === 'admin' || regRole === 'sales_manager'
    };

    onRegister(newUser);
    onTriggerToast(
      `تم إنشاء الحساب بنجاح! 🎉`,
      `أهلاً بك يا ${newUser.name} في الفريق. تم تفعيل حسابك كمسمى "${getRoleLabel(regRole)}" بموافقة الإدارة المعتمدة.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradient Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-xl shadow-blue-500/20 mb-4">
          <Briefcase className="w-8 h-8 text-white stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          CRM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Pro</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
          نظام إدارة المبيعات وعلاقات العملاء الذكي • مساحة العمل الفورية
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4 sm:px-0">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Tab Selection Bar */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-900/60 border-b border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>حساب جديد</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* TAB 1: LOGIN */}
            {activeTab === 'login' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Quick One-Click Login Section */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>تسجيل دخول سريع بالحسابات المسجلة في النظام:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {existingUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleQuickLogin(user)}
                        className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] ${
                          selectedQuickUser === user.id
                            ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-md'
                            : 'bg-slate-900/50 border-slate-700/60 hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/40"
                          />
                          <span className="text-xs font-bold truncate">{user.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 self-start font-medium border border-slate-700">
                          {getRoleBadge(user.role)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-700 w-full" />
                  <span className="bg-slate-800 px-3 text-[11px] font-bold text-slate-500 absolute">أو تسجيل الدخول اليدوي</span>
                </div>

                {/* Manual Form Login */}
                <form onSubmit={handleFormLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني / اسم المستخدم</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="ahmed@crmpro.com أو أحمد الغامدي"
                        className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                      />
                      <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>دخول إلى النظام</span>
                  </button>
                </form>

              </div>
            )}

            {/* TAB 2: REGISTER */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in duration-300">
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم الكامل</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="مثال: فهد عبد الله"
                      className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">البريد الإلكتروني</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="fahad@company.com"
                        className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">المسمى الوظيفي والدور</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                      className="w-full px-3 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-purple-500 transition-all"
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

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">فترة المستهدف</label>
                    <select
                      value={regPeriod}
                      onChange={(e) => setRegPeriod(e.target.value as any)}
                      className="w-full px-3 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-purple-500 transition-all"
                    >
                      <option value="monthly">شهري (Monthly)</option>
                      <option value="quarterly">ربع سنوي (Quarterly)</option>
                      <option value="half_yearly">نصف سنوي (6 Months)</option>
                      <option value="yearly">سنوي (Yearly)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">المستهدف البيعي المقترح (ر.س)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={regTarget}
                      onChange={(e) => setRegTarget(e.target.value)}
                      placeholder="150000"
                      className="w-full pl-4 pr-10 py-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all font-mono font-bold"
                    />
                    <Target className="w-4 h-4 text-purple-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {/* Authorization Section required by user directive */}
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>اعتماد التسجيل وموافقة الإدارة (إلزامي لإنشاء حساب جديد)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">كود موافقة الإدارة السريع:</label>
                      <input
                        type="text"
                        value={regAuthCode}
                        onChange={(e) => setRegAuthCode(e.target.value)}
                        placeholder="CRM-2026"
                        className="w-full px-3 py-2 bg-slate-900/90 border border-amber-500/40 rounded-xl text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">أو اختر المدير المانح للصلاحية:</label>
                      <select
                        value={regAuthManagerId}
                        onChange={(e) => setRegAuthManagerId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900/90 border border-amber-500/40 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="">-- كود الإدارة يكفي (CRM-2026) --</option>
                        {existingUsers
                          .filter(u => hasUserCreationPermission(u))
                          .map(m => (
                            <option key={m.id} value={m.id}>👑 {m.name} ({getRoleLabel(m.role)})</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-200/80 leading-relaxed">
                    💡 تطبيقاً لسياسة الأمان: لا يمكن تسجيل أي موظف أو حساب جديد إلا بموافقة المدير العام أو من يمتلك صلاحية (تسجيل جديد). الرمز الافتراضي للتجربة: <b>CRM-2026</b>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/50 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0" />
                  <p className="text-[11px] text-purple-200 leading-relaxed font-medium">
                    سيتم حفظ الحساب الجديد آلياً في سجلات النظام المحلية وتفعيل دخولك الفوري للمبيعات.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إنشاء الحساب وبدء العمل</span>
                </button>
              </form>
            )}

          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          🔒 بيانات الاعتماد والحسابات محمية بالتخزين المحلي الآمن داخل المتصفح (Offline-first Persistence)
        </p>
      </div>
    </div>
  );
};
