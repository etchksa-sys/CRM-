import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Clock, 
  Plus, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Building, 
  Trash2,
  Check
} from 'lucide-react';
import { Task, UserAccount } from '../../types';
import { PRIORITY_LABELS } from '../../data/mockData';
import { getLocalizedPriorityLabel } from '../../utils/i18n';

interface TasksViewProps {
  tasks: Task[];
  onToggleTaskComplete: (id: string) => void;
  onOpenQuickAdd: (tab?: 'contact' | 'deal' | 'task') => void;
  onDeleteTask: (id: string) => void;
  users: UserAccount[];
  language?: string;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTaskComplete,
  onOpenQuickAdd,
  onDeleteTask,
  users,
  language = 'ar'
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');
  const [filterUser, setFilterUser] = useState<string>('all');

  const filteredTasks = tasks.filter(t => {
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'pending' && !t.completed) || 
      (filterStatus === 'completed' && t.completed);
    const matchesUser = filterUser === 'all' || t.assignedTo === filterUser;
    return matchesPriority && matchesStatus && matchesUser;
  });

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        
        {/* Status Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              filterStatus === 'pending'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{language === 'en' ? `Pending (${pendingCount})` : `قيد الانتظار (${pendingCount})`}</span>
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              filterStatus === 'completed'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'en' ? `Completed (${completedCount})` : `المكتملة (${completedCount})`}</span>
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {language === 'en' ? `All (${tasks.length})` : `الكل (${tasks.length})`}
          </button>
        </div>

        {/* Priority Filter & Add Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-amber-500 text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'en' ? 'Priority: All' : 'الأولوية: الكل'}</option>
            <option value="high">{language === 'en' ? 'High 🔥' : 'عالية جداً 🔥'}</option>
            <option value="medium">{language === 'en' ? 'Medium ⚡' : 'متوسطة ⚡'}</option>
            <option value="low">{language === 'en' ? 'Normal 📌' : 'عادية 📌'}</option>
          </select>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-amber-500 text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'en' ? 'Assigned: All' : 'المكلف: الكل'}</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>

          <button
            onClick={() => onOpenQuickAdd('task')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-lg shadow-amber-500/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'en' ? 'New Task' : 'مهمة جديدة'}</span>
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'No matching tasks or follow-ups found.' : 'لا توجد مهام أو مواعيد مطابقة حالياً.'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTaskComplete(task.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-amber-500/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTaskComplete(task.id);
                  }}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    task.completed
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                      : 'border-2 border-slate-300 dark:border-slate-600 hover:border-amber-500 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="min-w-0">
                  <h4 className={`text-sm font-extrabold transition-all ${
                    task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'
                  }`}>
                    {task.title}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-lg font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" /> {task.dueDate} {task.dueTime ? `• ${task.dueTime}` : ''}
                    </span>

                    {task.relatedToName && (
                      <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg font-bold">
                        <Building className="w-3.5 h-3.5" /> مرتبطة بـ: {task.relatedToName}
                      </span>
                    )}

                    <span className={`px-2.5 py-1 rounded-lg font-extrabold ${
                      task.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignee & Delete action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 rounded-xl">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {task.assignedTo}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('هل ترغب بحذف هذا التذكير؟')) {
                      onDeleteTask(task.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                  title="حذف المهمة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
