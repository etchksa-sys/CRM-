import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Building, 
  Phone, 
  Mail, 
  Tag, 
  ArrowUpLeft, 
  Clock, 
  LayoutGrid, 
  Table as TableIcon,
  CheckCircle2,
  MoreHorizontal,
  Download
} from 'lucide-react';
import { Contact, TimelineInteraction, ContactStatus, ContactSource } from '../../types';
import { STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS } from '../../data/mockData';
import { getLocalizedStatusLabel, getLocalizedSourceLabel } from '../../utils/i18n';
import { ContactDetailModal } from './ContactDetailModal';
import { exportContactsToExcel } from '../../utils/excelExport';

interface ContactsViewProps {
  contacts: Contact[];
  onAddTimelineInteraction: (contactId: string, interaction: Omit<TimelineInteraction, 'id'>) => void;
  onOpenQuickAdd: (tab?: 'contact' | 'deal' | 'task') => void;
  onDeleteContact: (contactId: string) => void;
  language?: string;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onAddTimelineInteraction,
  onOpenQuickAdd,
  onDeleteContact,
  language = 'ar'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || c.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        
        {/* Left: Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search by name, company, phone or email...' : 'بحث بالاسم، الشركة، الهاتف أو البريد...'}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Right: Filters, View Toggle & Add Button */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'en' ? `Status: All (${contacts.length})` : `حالة العميل: الكل (${contacts.length})`}</option>
            {Object.keys(STATUS_LABELS).map((k) => (
              <option key={k} value={k}>
                {getLocalizedStatusLabel(k, language)} ({contacts.filter(c => c.status === k).length})
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 text-slate-700 dark:text-slate-300 hidden sm:block"
          >
            <option value="all">{language === 'en' ? 'Source: All' : 'المصدر: الكل'}</option>
            {Object.keys(SOURCE_LABELS).map((k) => (
              <option key={k} value={k}>{getLocalizedSourceLabel(k, language)}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs' : 'text-slate-400'
              }`}
              title={language === 'en' ? 'Grid Cards View' : 'عرض البطاقات (Cards)'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs' : 'text-slate-400'
              }`}
              title={language === 'en' ? 'Table View' : 'عرض الجدول (Table)'}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Add Contact Button */}
          <button
            onClick={() => exportContactsToExcel(filteredContacts)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all shrink-0"
            title={language === 'en' ? 'Export filtered list to Excel (CSV)' : 'تصدير القائمة المعروضة إلى Excel (CSV)'}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={() => onOpenQuickAdd('contact')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-lg shadow-blue-500/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'en' ? 'New Contact' : 'عميل جديد'}</span>
          </button>
        </div>
      </div>

      {/* Contacts List: Grid Cards Mode */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContacts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              {language === 'en' ? 'No matching contacts or accounts found.' : 'لم يتم العثور على أي عملاء مطابقين لمعايير البحث والفلترة.'}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-lg hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between relative"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-md">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                          {contact.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                          <Building className="w-3 h-3 shrink-0" /> {contact.company}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[contact.status]}`}>
                      {STATUS_LABELS[contact.status]}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 py-3 border-y border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate font-semibold">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {contact.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                        # {tag}
                      </span>
                    ))}
                    {contact.tags.length > 3 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">
                        +{contact.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Timeline count & assigned rep */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{contact.timeline.length} تفاعل</span>
                  </span>
                  <span className="truncate max-w-[120px]">
                    👤 {contact.assignedTo}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contacts List: Table Mode */}
      {viewMode === 'table' && (
        <div className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-extrabold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">اسم العميل والشركة</th>
                  <th className="p-4">بيانات التواصل</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">المصدر</th>
                  <th className="p-4">الموظف المسؤول</th>
                  <th className="p-4">التفاعلات</th>
                  <th className="p-4">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-slate-700 dark:text-slate-200">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">لا توجد نتائج مطابقة</td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-700/40 transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-extrabold text-slate-800 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <p>{contact.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{contact.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">{contact.phone}</p>
                        <p className="text-[10px] text-slate-400">{contact.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-block ${STATUS_COLORS[contact.status]}`}>
                          {STATUS_LABELS[contact.status]}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-500">
                        {SOURCE_LABELS[contact.source]}
                      </td>
                      <td className="p-4 font-bold">
                        {contact.assignedTo}
                      </td>
                      <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                        {contact.timeline.length} تفاعل
                      </td>
                      <td className="p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(contact);
                          }}
                          className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100"
                        >
                          عرض التايم لاين
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full Timeline / Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        onAddTimelineInteraction={onAddTimelineInteraction}
        onDeleteContact={onDeleteContact}
      />

    </div>
  );
};
