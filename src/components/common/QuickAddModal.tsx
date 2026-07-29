import React, { useState } from 'react';
import { X, UserPlus, Kanban, CheckSquare, Sparkles, Building, Phone, Mail, DollarSign, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Contact, Deal, Task, ContactSource, ContactStatus, DealStage, UserAccount } from '../../types';
import { SOURCE_LABELS, STATUS_LABELS, STAGE_LABELS } from '../../data/mockData';
import { getLocalizedStageLabel, getLocalizedStatusLabel, getLocalizedSourceLabel, getLocalizedPriorityLabel } from '../../utils/i18n';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'timeline'>) => void;
  onAddDeal: (deal: Omit<Deal, 'id'>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  contacts: Contact[];
  users: UserAccount[];
  initialTab?: 'contact' | 'deal' | 'task';
  language?: string;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddContact,
  onAddDeal,
  onAddTask,
  contacts,
  users,
  initialTab = 'contact',
  language = 'ar'
}) => {
  const [activeTab, setActiveTab] = useState<'contact' | 'deal' | 'task'>(initialTab);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSource, setContactSource] = useState<ContactSource>('website');
  const [contactStatus, setContactStatus] = useState<ContactStatus>('lead');
  const [contactAssigned, setContactAssigned] = useState(users[1]?.name || 'سارة المنصور');
  const [contactNotes, setContactNotes] = useState('');

  // Deal Form State
  const [dealTitle, setDealTitle] = useState('');
  const [dealContactId, setDealContactId] = useState(contacts[0]?.id || '');
  const [dealValue, setDealValue] = useState('25000');
  const [dealProb, setDealProb] = useState('60');
  const [dealStage, setDealStage] = useState<DealStage>('new');
  const [dealDate, setDealDate] = useState('2026-08-30');
  const [dealPriority, setDealPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [dealAssigned, setDealAssigned] = useState(users[1]?.name || 'سارة المنصور');

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('2026-07-28');
  const [taskTime, setTaskTime] = useState('10:00 ص');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskAssigned, setTaskAssigned] = useState(users[0]?.name || 'أحمد الغامدي');
  const [taskRelatedType, setTaskRelatedType] = useState<'contact' | 'none'>('contact');
  const [taskRelatedContactId, setTaskRelatedContactId] = useState(contacts[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    
    onAddContact({
      name: contactName.trim(),
      company: contactCompany.trim() || 'فردي / مستقل',
      phone: contactPhone.trim(),
      email: contactEmail.trim() || 'no-email@crm.sa',
      source: contactSource,
      status: contactStatus,
      tags: ['عميل جديد'],
      assignedTo: contactAssigned,
      notes: contactNotes.trim()
    });
    
    // Reset & Close
    setContactName('');
    setContactCompany('');
    setContactPhone('');
    setContactEmail('');
    onClose();
  };

  const handleSubmitDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;

    const selectedContact = contacts.find(c => c.id === dealContactId) || contacts[0];

    onAddDeal({
      title: dealTitle.trim(),
      contactId: selectedContact?.id || 'c-new',
      contactName: selectedContact?.name || 'عميل محتمل',
      company: selectedContact?.company || 'شركة تجارية',
      value: Number(dealValue) || 10000,
      probability: Number(dealProb) || 50,
      stage: dealStage,
      expectedCloseDate: dealDate,
      assignedTo: dealAssigned,
      priority: dealPriority
    });

    setDealTitle('');
    onClose();
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const selectedContact = contacts.find(c => c.id === taskRelatedContactId);

    onAddTask({
      title: taskTitle.trim(),
      dueDate: taskDate,
      dueTime: taskTime,
      priority: taskPriority,
      assignedTo: taskAssigned,
      relatedToType: taskRelatedType === 'contact' ? 'contact' : 'none',
      relatedToId: selectedContact?.id,
      relatedToName: selectedContact ? selectedContact.company : undefined
    });

    setTaskTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header & Tabs */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white">
                {language === 'en' ? 'Quick Add - CRM System' : 'إضافة سريعة لنظام CRM'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-200/60 dark:bg-slate-900/60 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'contact'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'en' ? 'New Contact' : 'عميل جديد'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deal')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'deal'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>{language === 'en' ? 'New Deal' : 'صفقة جديدة'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('task')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'task'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>{language === 'en' ? 'Task / Follow-up' : 'مهمة / موعد'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Forms */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* TAB 1: ADD CONTACT */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم العميل *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="مثال: خالد العبدالله"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الشركة / المؤسسة</label>
                  <input
                    type="text"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    placeholder="مثال: شركة الحلول الرقمية"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="05xxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.sa"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المصدر</label>
                  <select
                    value={contactSource}
                    onChange={(e) => setContactSource(e.target.value as ContactSource)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(SOURCE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الحالة</label>
                  <select
                    value={contactStatus}
                    onChange={(e) => setContactStatus(e.target.value as ContactStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(STATUS_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الموظف المسؤول</label>
                  <select
                    value={contactAssigned}
                    onChange={(e) => setContactAssigned(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ملاحظات أولية</label>
                <textarea
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  placeholder="أضف أي ملاحظات حول اهتمامات العميل، متطلباته، أو وقت التواصل المفضل..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/30 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> إضافة العميل الآن
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ADD DEAL */}
          {activeTab === 'deal' && (
            <form onSubmit={handleSubmitDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان الصفقة / المشروع *</label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="مثال: ترقية النظام وتدريب الفريق (15 مستخدم)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اختر العميل / المؤسسة</label>
                  <select
                    value={dealContactId}
                    onChange={(e) => setDealContactId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                  >
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">قيمة الصفقة (ر.س) *</label>
                  <input
                    type="number"
                    required
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المرحلة الحالية</label>
                  <select
                    value={dealStage}
                    onChange={(e) => setDealStage(e.target.value as DealStage)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                  >
                    {Object.entries(STAGE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">احتمالية النجاح (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={dealProb}
                    onChange={(e) => setDealProb(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الأولوية</label>
                  <select
                    value={dealPriority}
                    onChange={(e) => setDealPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="high">عالية 🔥</option>
                    <option value="medium">متوسطة ⚡</option>
                    <option value="low">عادية 📌</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">التاريخ المتوقع للإغلاق</label>
                  <input
                    type="date"
                    value={dealDate}
                    onChange={(e) => setDealDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">مسؤول الصفقة</label>
                  <select
                    value={dealAssigned}
                    onChange={(e) => setDealAssigned(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-purple-500"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-500/30 flex items-center gap-1.5"
                >
                  <Kanban className="w-4 h-4" /> إضافة الصفقة الآن
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ADD TASK */}
          {activeTab === 'task' && (
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان المهمة / التذكير *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="مثال: الاتصال بمدير المشتريات لمناقشة الخصم النهائي"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الوقت المتوقع</label>
                  <input
                    type="text"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    placeholder="10:00 ص"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الأولوية</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="high">عالية 🔥</option>
                    <option value="medium">متوسطة ⚡</option>
                    <option value="low">عادية 📌</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">مرتبطة بعميل؟</label>
                  <select
                    value={taskRelatedType}
                    onChange={(e) => setTaskRelatedType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="contact">نعم، مرتبطة بعميل</option>
                    <option value="none">مهمة عامة / داخلية</option>
                  </select>
                </div>
                {taskRelatedType === 'contact' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اختر العميل</label>
                    <select
                      value={taskRelatedContactId}
                      onChange={(e) => setTaskRelatedContactId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                    >
                      {contacts.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الموظف المكلف</label>
                <select
                  value={taskAssigned}
                  onChange={(e) => setTaskAssigned(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-1.5"
                >
                  <CheckSquare className="w-4 h-4" /> إضافة المهمة الآن
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
