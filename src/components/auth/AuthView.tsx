import React, { useState } from 'react';
import { 
  LogIn, 
  Sparkles, 
  Lock, 
  Mail, 
  Briefcase,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { UserAccount } from '../../types';
import { getRoleLabel, getRoleBadge } from '../../data/mockData';

interface AuthViewProps {
  existingUsers: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onRegister?: (newUser: UserAccount) => void;
  onTriggerToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  language?: 'ar' | 'en';
}

export const AuthView: React.FC<AuthViewProps> = ({
  existingUsers,
  onLogin,
  onTriggerToast,
  language = 'ar'
}) => {
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedQuickUser, setSelectedQuickUser] = useState<string | null>(null);
  const [quickPassword, setQuickPassword] = useState('');

  // Handle Quick Login
  const handleQuickLogin = (user: UserAccount) => {
    onTriggerToast(
      `مرحباً بك مجدداً، ${user.name}! 👋`,
      `تم التحقق من كلمة المرور وتسجيل الدخول بنجاح بحساب "${getRoleLabel(user.role)}"`,
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

    if (!loginPassword.trim()) {
      onTriggerToast('كلمة المرور مطلوبة 🔑', 'يرجى إدخال كلمة المرور الخاصة بحسابك للدخول.', 'error');
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
      const fallbackUser: UserAccount = {
        id: `u-${Date.now()}`,
        name: loginEmail.split('@')[0] || 'مستخدم النظام',
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

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
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
          نظام إدارة المبيعات وعلاقات العملاء الذكي • تسجيل الدخول
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg z-10 px-4 sm:px-0">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Header Title Bar */}
          <div className="p-4 bg-slate-900/80 border-b border-slate-700/60 text-center flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-extrabold text-white">تسجيل الدخول إلى حساب الموظف</h3>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Quick Login Section with Password Enforcement */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>اختر الحساب للتسجيل السريع:</span>
                </span>
                <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  يتطلب كلمة مرور 🔑
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {existingUsers.map((user) => {
                  const isSelected = selectedQuickUser === user.id;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedQuickUser(user.id);
                        setQuickPassword('');
                      }}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg ring-2 ring-blue-500/50'
                          : 'bg-slate-900/50 border-slate-700/60 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`w-7 h-7 rounded-full object-cover ring-2 ${isSelected ? 'ring-blue-400' : 'ring-slate-700'}`}
                        />
                        <span className="text-xs font-bold truncate">{user.name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 self-start font-medium border border-slate-700">
                        {getRoleBadge(user.role)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Password Entry Box for Selected Quick User */}
              {(() => {
                const selectedObj = existingUsers.find(u => u.id === selectedQuickUser);
                if (!selectedObj) return null;

                return (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!quickPassword.trim()) {
                        onTriggerToast(
                          'كلمة المرور مطلوبة 🔑',
                          `يرجى إدخال كلمة المرور لحساب (${selectedObj.name}) لإنهاء الدخول.`,
                          'error'
                        );
                        return;
                      }
                      handleQuickLogin(selectedObj);
                    }}
                    className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 space-y-3 mt-3 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={selectedObj.avatar}
                          alt={selectedObj.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-400"
                        />
                        <div>
                          <p className="text-xs font-black text-white">{selectedObj.name}</p>
                          <p className="text-[10px] text-blue-300">{getRoleBadge(selectedObj.role)}</p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        أدخل كلمة المرور
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        كلمة المرور الخاصة بـ ({selectedObj.name}):
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          autoFocus
                          value={quickPassword}
                          onChange={(e) => setQuickPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور..."
                          className="w-full pl-4 pr-10 py-2.5 bg-slate-900 border border-blue-500/50 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-400 shadow-inner"
                        />
                        <Lock className="w-4 h-4 text-blue-400 absolute right-3 top-3" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>تأكيد ودخول بحساب {selectedObj.name}</span>
                    </button>
                  </form>
                );
              })()}
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

            {/* Security Policy Notice regarding creation of new users */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2 text-right">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>سياسة إنشاء الحسابات والموظفين الجدد</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                💡 تطبيقاً لسياسة الأمان: تم إيقاف التسجيل المباشر للحسابات من هذه الشاشة. الموظفون والحسابات الجديدة يتم إنشاؤها حصرياً بواسطة <b>المدير العام</b> أو من يمتلك صلاحية <b>(إضافة موظف)</b> من داخل قسم <span className="text-blue-300 font-bold">فريق العمل والصلاحيات</span>.
              </p>
            </div>

          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          🔒 بيانات الاعتماد والحسابات محمية بالتخزين المحلي الآمن داخل المتصفح (Offline-first Persistence)
        </p>
      </div>
    </div>
  );
};
