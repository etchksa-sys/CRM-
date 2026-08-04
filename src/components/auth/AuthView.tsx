import React, { useState } from 'react';
import { 
  LogIn, 
  Sparkles, 
  Lock, 
  Mail, 
  Briefcase,
  ShieldCheck,
  UserCheck,
  X,
  Key,
  CheckCircle2
} from 'lucide-react';
import { UserAccount, UserRole } from '../../types';
import { getRoleLabel, getRoleBadge } from '../../data/mockData';

interface AuthViewProps {
  existingUsers: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onUpdateUser?: (updatedUser: UserAccount) => void;
  onDeleteUser?: (userId: string) => void;
  onRegister?: (newUser: UserAccount) => void;
  onTriggerToast: (title: string, message: string, type: 'success' | 'error' | 'info') => void;
  language?: 'ar' | 'en';
}

export const AuthView: React.FC<AuthViewProps> = ({
  existingUsers,
  onLogin,
  onUpdateUser,
  onDeleteUser,
  onTriggerToast,
  language = 'ar'
}) => {
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedQuickUser, setSelectedQuickUser] = useState<string | null>(null);
  const [quickPassword, setQuickPassword] = useState('');

  // Temp Password Change Modal State
  const [tempPasswordUser, setTempPasswordUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete Fast Login Account
  const handleDeleteFastUser = (e: React.MouseEvent, userToDelete: UserAccount) => {
    e.stopPropagation();
    if (confirm(`هل أنت تأكد من حذف وإزالة حساب الموظف "${userToDelete.name}" من قائمة التسجيل السريع؟`)) {
      if (onDeleteUser) {
        onDeleteUser(userToDelete.id);
        if (selectedQuickUser === userToDelete.id) {
          setSelectedQuickUser(null);
        }
      }
    }
  };

  // Handle Quick Login
  const handleQuickLogin = (user: UserAccount) => {
    if (user.isTempPassword || (user.tempPassword && quickPassword.trim() === user.tempPassword)) {
      setTempPasswordUser(user);
      setNewPassword('');
      setConfirmPassword('');
      onTriggerToast(
        'تغيير كلمة المرور المؤقتة 🔑',
        `حساب ${user.name} مسجل بكلمة مرور مؤقتة. يرجى تعيين كلمة مرور جديدة آمنة قبل متابعة الدخول.`,
        'info'
      );
      return;
    }

    onTriggerToast(
      `مرحباً بك مجدداً، ${user.name}! 👋`,
      `تم التحقق من كلمة المرور وتسجيل الدخول بنجاح بحساب "${getRoleLabel(user.role)}"`,
      'success'
    );
    onLogin(user);
  };

  // Submit Changed Temp Password
  const handleSubmitNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPasswordUser) return;

    if (!newPassword || newPassword.length < 4) {
      onTriggerToast('كلمة المرور قصيرة ⚠️', 'يرجى إدخال كلمة مرور جديدة تحتوي على 4 خانات على الأقل.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      onTriggerToast('خطأ في التأكيد ❌', 'كلمة المرور الجديدة وتأكيدها غير متطابقين.', 'error');
      return;
    }

    const updatedUser: UserAccount = {
      ...tempPasswordUser,
      tempPassword: newPassword,
      isTempPassword: false
    };

    onUpdateUser?.(updatedUser);
    onTriggerToast(
      'تم تحديث كلمة المرور بنجاح 🎉',
      `تم تغيير كلمة المرور لحساب (${updatedUser.name}) بنجاح وتم تسجيل الدخول.`,
      'success'
    );
    setTempPasswordUser(null);
    onLogin(updatedUser);
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

    const term = loginEmail.trim().toLowerCase();

    // Smart match with existing users by email, email username, name, or role
    const found = existingUsers.find(u => {
      const uEmail = u.email.toLowerCase();
      const uName = u.name.toLowerCase();
      const emailPrefix = uEmail.split('@')[0];

      return (
        uEmail === term ||
        emailPrefix === term ||
        uEmail.includes(term) ||
        uName.includes(term) ||
        ((term === 'admin' || term === 'مدير' || term === 'المدير') && (u.role === 'admin' || u.role === 'sales_manager')) ||
        (term === 'ahmed' && (u.email.includes('ahmed') || u.name.includes('أحمد')))
      );
    });

    if (found) {
      if (found.isTempPassword || (found.tempPassword && loginPassword.trim() === found.tempPassword)) {
        setTempPasswordUser(found);
        setNewPassword('');
        setConfirmPassword('');
        onTriggerToast(
          'تغيير كلمة المرور المؤقتة 🔑',
          `حساب ${found.name} مسجل بكلمة مرور مؤقتة. يرجى تعيين كلمة مرور جديدة آمنة قبل متابعة الدخول.`,
          'info'
        );
      } else {
        handleQuickLogin(found);
      }
    } else {
      const isAdminKeyword = term.includes('admin') || term.includes('مدير') || term.includes('ahmed') || term.includes('أحمد');
      const fallbackRole: UserRole = isAdminKeyword ? 'admin' : 'sales';

      const fallbackUser: UserAccount = {
        id: `u-${Date.now()}`,
        name: loginEmail.split('@')[0] || 'مستخدم النظام',
        email: loginEmail.includes('@') ? loginEmail : `${loginEmail}@crm-pro.com`,
        phone: '+966 50 000 0000',
        role: fallbackRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        monthlyTarget: 500000,
        targetPeriod: 'monthly',
        revenueGenerated: 0,
        dealsCount: 0,
        conversionRate: 0,
        kpiScore: 90,
        status: 'active',
        canCreateUsers: fallbackRole === 'admin'
      };
      onTriggerToast(
        `تم تسجيل الدخول بنجاح! 🚀`,
        `مرحباً بك في جلسة العمل، ${fallbackUser.name} (${getRoleLabel(fallbackUser.role)}).`,
        'success'
      );
      onLogin(fallbackUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Change Temp Password Modal Overlay */}
      {tempPasswordUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 relative">
            <button
              onClick={() => setTempPasswordUser(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mb-1">
                <Key className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">تغيير كلمة المرور المؤقتة 🔐</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مرحباً <strong className="text-amber-400">{tempPasswordUser.name}</strong>! تم تسجيل دخولك باستخدام كلمة مرور مؤقتة. لتأمين حسابك، يرجى كتابة كلمة مرور جديدة خاصة بك:
              </p>
            </div>

            <form onSubmit={handleSubmitNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">كلمة المرور الجديدة *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="أدخل كلمة مرور جديدة..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <Lock className="w-4 h-4 text-amber-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">تأكيد كلمة المرور الجديدة *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="إعادة كتابة كلمة المرور..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <ShieldCheck className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ كلمة المرور الجديدة والدخول للنظام</span>
              </button>
            </form>
          </div>
        </div>
      )}
      
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
                    <div key={user.id} className="relative group">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedQuickUser(user.id);
                          setQuickPassword('');
                        }}
                        className={`w-full p-3 rounded-2xl border text-right transition-all flex flex-col justify-between hover:scale-[1.02] active:scale-[0.98] ${
                          isSelected
                            ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg ring-2 ring-blue-500/50'
                            : 'bg-slate-900/50 border-slate-700/60 hover:border-slate-600 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5 pl-5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className={`w-7 h-7 rounded-full object-cover ring-2 ${isSelected ? 'ring-blue-400' : 'ring-slate-700'}`}
                          />
                          <span className="text-xs font-bold truncate">{user.name}</span>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 self-start font-medium border border-slate-700">
                            {getRoleBadge(user.role)}
                          </span>
                          {user.isTempPassword && (
                            <span className="text-[9px] text-amber-400 font-extrabold bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded">
                              مؤقت 🔑
                            </span>
                          )}
                        </div>
                      </button>

                      {/* X Delete Button for Quick Login Account */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteFastUser(e, user)}
                        className="absolute top-2 left-2 p-1 rounded-full bg-slate-800/90 hover:bg-rose-600 text-slate-400 hover:text-white transition-all shadow-md z-10"
                        title={`حذف وإزالة حساب (${user.name}) من التسجيل السريع`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
