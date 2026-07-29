import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  Tag, 
  User, 
  Clock, 
  PhoneCall, 
  FileText, 
  Users, 
  Send, 
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit3
} from 'lucide-react';
import { Contact, TimelineInteraction, ContactStatus, ContactSource } from '../../types';
import { STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS } from '../../data/mockData';

interface ContactDetailModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onAddTimelineInteraction: (contactId: string, interaction: Omit<TimelineInteraction, 'id'>) => void;
  onDeleteContact?: (contactId: string) => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  isOpen,
  onClose,
  onAddTimelineInteraction,
  onDeleteContact
}) => {
  const [interType, setInterType] = useState<'call' | 'email' | 'meeting' | 'note'>('call');
  const [interTitle, setInterTitle] = useState('');
  const [interDetails, setInterDetails] = useState('');
  const [performedBy, setPerformedBy] = useState('سارة المنصور');

  if (!isOpen || !contact) return null;

  const handleSubmitInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interTitle.trim() || !interDetails.trim()) return;

    onAddTimelineInteraction(contact.id, {
      type: interType,
      title: interTitle.trim(),
      details: interDetails.trim(),
      date: new Date().toISOString().split('T')[0],
      performedBy
    });

    setInterTitle('');
    setInterDetails('');
  };

  const icons = {
    call: <PhoneCall className="w-4 h-4 text-emerald-500" />,
    email: <Mail className="w-4 h-4 text-blue-500" />,
    meeting: <Users className="w-4 h-4 text-purple-500" />,
    note: <FileText className="w-4 h-4 text-amber-500" />
  };

  const typeNames = {
    call: 'مكالمة هاتفية',
    email: 'بريد إلكتروني',
    meeting: 'اجتماع / جلسة',
    note: 'ملاحظة داخلية'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" dir="rtl">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Profile Summary */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-900/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              {contact.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 dark:text-white">{contact.name}</h3>
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[contact.status]}`}>
                  {STATUS_LABELS[contact.status]}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {contact.company}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-blue-600 font-semibold">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-blue-600 font-semibold">
                  <Mail className="w-3.5 h-3.5 text-blue-500" /> {contact.email}
                </a>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-purple-500" /> مسؤول: {contact.assignedTo}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onDeleteContact && (
              <button
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف العميل "${contact.name}"؟`)) {
                    onDeleteContact(contact.id);
                    onClose();
                  }
                }}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                title="حذف العميل"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Tags, Notes, and Timeline */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Tags & Notes Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-blue-500" /> الوسوم والتصنيفات (Tags)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    # {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">ملاحظات العميل الأولية</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {contact.notes || 'لا توجد ملاحظات إضافية مسجلة.'}
              </p>
              <div className="mt-2 text-[10px] text-slate-400">
                المصدر: {SOURCE_LABELS[contact.source]} • تاريخ التسجيل: {contact.createdAt}
              </div>
            </div>
          </div>

          {/* Section: Add New Interaction to Timeline */}
          <div className="p-5 rounded-3xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-200/60 dark:border-blue-800/40">
            <h4 className="text-sm font-extrabold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> إضافة تفاعل جديد للسجل (Timeline)
            </h4>
            <form onSubmit={handleSubmitInteraction} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">نوع التفاعل</label>
                  <select
                    value={interType}
                    onChange={(e) => setInterType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="call">📞 مكالمة هاتفية</option>
                    <option value="email">📧 بريد إلكتروني</option>
                    <option value="meeting">🤝 اجتماع / جلسة</option>
                    <option value="note">📝 ملاحظة</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">عنوان التفاعل (ملخص قصير) *</label>
                  <input
                    type="text"
                    required
                    value={interTitle}
                    onChange={(e) => setInterTitle(e.target.value)}
                    placeholder="مثال: مناقشة السعر وإرسال العقد المبدئي"
                    className="w-full px-3 py-1.5 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">تفاصيل التفاعل والملاحظات *</label>
                <textarea
                  required
                  rows={2}
                  value={interDetails}
                  onChange={(e) => setInterDetails(e.target.value)}
                  placeholder="اكتب تفاصيل ما حدث في المكالمة أو الاجتماع والنقاط المتفق عليها..."
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-slate-500">
                  بواسطة: <strong className="text-slate-700 dark:text-slate-300">{performedBy}</strong> • التاريخ: اليوم
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 rotate-180" /> إضافة للسجل
                </button>
              </div>
            </form>
          </div>

          {/* Section: Timeline List */}
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" /> سجل التفاعلات الكامل ({contact.timeline.length})
            </h4>

            <div className="space-y-4 border-r-2 border-slate-200 dark:border-slate-700 pr-4 mr-2">
              {contact.timeline.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
                  لا توجد تفاعلات سابقة مسجلة في التايم لاين. ابدأ بإضافة تفاعل أعلاه!
                </div>
              ) : (
                contact.timeline.map((inter) => (
                  <div key={inter.id} className="relative bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
                    {/* Circle marker on border line */}
                    <div className="absolute -right-[23px] top-4 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-800" />

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {icons[inter.type]}
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white">{inter.title}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-bold">
                        {inter.date}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{inter.details}</p>

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>النوع: {typeNames[inter.type]}</span>
                      <span className="text-blue-600 dark:text-blue-400">سُجل بواسطة: {inter.performedBy}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-extrabold hover:bg-slate-300 transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
