import React, { useState } from 'react';
import { 
  Kanban, 
  Plus, 
  DollarSign, 
  Calendar, 
  User, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  MoreVertical,
  Filter,
  Search,
  GripVertical,
  Move,
  Download
} from 'lucide-react';
import { Deal, DealStage, UserAccount } from '../../types';
import { STAGE_LABELS, STAGE_COLORS } from '../../data/mockData';
import { getLocalizedStageLabel } from '../../utils/i18n';
import { exportDealsToExcel } from '../../utils/excelExport';

interface DealsKanbanViewProps {
  deals: Deal[];
  onMoveDeal: (dealId: string, newStage: DealStage) => void;
  onOpenQuickAdd: (tab?: 'contact' | 'deal' | 'task') => void;
  users: UserAccount[];
  language?: string;
}

export const DealsKanbanView: React.FC<DealsKanbanViewProps> = ({
  deals,
  onMoveDeal,
  onOpenQuickAdd,
  users,
  language = 'ar'
}) => {
  const [filterUser, setFilterUser] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hotDealsOnly, setHotDealsOnly] = useState<boolean>(false);
  
  // Drag and Drop States
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [hoveredStage, setHoveredStage] = useState<DealStage | null>(null);

  const stages: DealStage[] = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];

  // Filter deals
  const filteredDeals = deals.filter(d => {
    const matchesUser = filterUser === 'all' || d.assignedTo === filterUser;
    const matchesSearch = !searchQuery.trim() || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHot = !hotDealsOnly || d.priority === 'high' || d.probability >= 70;
    return matchesUser && matchesSearch && matchesHot;
  });

  // Calculate totals
  const totalOpenValue = filteredDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').reduce((s, d) => s + d.value, 0);
  const totalWonValue = filteredDeals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(deal.id);
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setHoveredStage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (stage: DealStage) => {
    setHoveredStage(stage);
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    setHoveredStage(null);
    setDraggedDealId(null);

    if (dealId) {
      const deal = deals.find(d => d.id === dealId);
      if (deal && deal.stage !== targetStage) {
        onMoveDeal(dealId, targetStage);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Controls & Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-extrabold text-sm border border-purple-200 dark:border-purple-800/40">
            <Kanban className="w-4 h-4" />
            <span>{language === 'en' ? `Open Deals Total: $${totalOpenValue.toLocaleString()}` : `إجمالي الصفقات المفتوحة: ${totalOpenValue.toLocaleString()} ر.س`}</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm border border-emerald-200 dark:border-emerald-800/40">
            <TrendingUp className="w-4 h-4" />
            <span>{language === 'en' ? `Won Revenue: $${totalWonValue.toLocaleString()}` : `المحقق (رابح): ${totalWonValue.toLocaleString()} ر.س`}</span>
          </div>
        </div>

        {/* Filters & Add Deal Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Filter deals...' : 'فلترة الصفقات...'}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-purple-500 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>

          {/* User Filter */}
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-purple-500 text-slate-700 dark:text-slate-300"
          >
            <option value="all">{language === 'en' ? 'All Sales Reps' : 'جميع المناديب'}</option>
            {users.map(u => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>

          {/* Hot Deals Filter */}
          <button
            onClick={() => setHotDealsOnly(!hotDealsOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
              hotDealsOnly 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/50'
            }`}
            title={language === 'en' ? 'Show hot or high priority deals' : 'عرض الصفقات الساخنة أو ذات الأولوية القصوى التي تحتاج إغلاق فوري'}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hotDealsOnly ? (language === 'en' ? 'Show All Deals' : 'عرض كل الصفقات') : (language === 'en' ? '🔥 Hot Deals' : '🔥 صفقات ساخنة')}</span>
          </button>

          <button
            onClick={() => exportDealsToExcel(filteredDeals)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all shrink-0"
            title={language === 'en' ? 'Export deals list to Excel' : 'تصدير قائمة الصفقات المعروضة إلى Excel (CSV)'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={() => onOpenQuickAdd('deal')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-lg shadow-purple-500/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'en' ? 'New Deal' : 'صفقة جديدة'}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Hint Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20 text-slate-700 dark:text-slate-300 text-xs font-extrabold shadow-sm">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span>
            {language === 'en' 
              ? 'Interactive Drag & Drop Pipeline: Drag any deal and drop it into a new sales stage column to update instantly!'
              : 'ميزة السحب والإفلات التفاعلي (Drag & Drop Pipeline): يمكنك سحب أي صفقة وإفلاتها مباشرة في عمود المرحلة البيعية الجديدة لنقلها فوريّاً!'}
          </span>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-300 text-[11px] font-black">
          {language === 'en' ? `${filteredDeals.length} deals in view` : `${filteredDeals.length} صفقات معروضة`}
        </span>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start pb-6">
        {stages.map((stage) => {
          const stageDeals = filteredDeals.filter(d => d.stage === stage);
          const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
          const isHovered = hoveredStage === stage;

          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(stage)}
              onDragLeave={(e) => {
                // Only clear if leaving the column itself, not entering a child card inside
                if (e.currentTarget === e.target) {
                  setHoveredStage(null);
                }
              }}
              onDrop={(e) => handleDrop(e, stage)}
              className={`flex flex-col rounded-3xl p-3 min-h-[520px] transition-all duration-200 border ${
                isHovered 
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 ring-4 ring-purple-500/20 scale-[1.01] shadow-lg shadow-purple-500/10' 
                  : 'bg-slate-100/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800 px-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-xl border ${STAGE_COLORS[stage]}`}>
                    {getLocalizedStageLabel(stage, language)}
                  </span>
                  <span className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                    isHovered ? 'bg-purple-600 text-white animate-bounce' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {stageDeals.length}
                  </span>
                </div>
                {stageValue > 0 && (
                  <span className="text-[11px] font-black text-slate-600 dark:text-slate-400">
                    {(stageValue / 1000).toFixed(0)}k <span className="text-[9px]">{language === 'en' ? 'SAR' : 'ر.س'}</span>
                  </span>
                )}
              </div>

              {/* Drop Zone Visual Feedback when dragging over this column */}
              {isHovered && (
                <div className="mb-3 p-3 rounded-2xl border-2 border-dashed border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-center text-xs font-black animate-pulse flex items-center justify-center gap-2 shadow-inner">
                  <Move className="w-4 h-4" />
                  <span>
                    {language === 'en' 
                      ? `Drop here to move deal to "${getLocalizedStageLabel(stage, language)}"`
                      : `أفلت هنا لنقل الصفقة إلى مرحلة "${getLocalizedStageLabel(stage, language)}"`}
                  </span>
                </div>
              )}

              {/* Deals Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[680px] pr-1">
                {stageDeals.length === 0 && !isHovered ? (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs font-medium gap-2">
                    <span className="text-xl opacity-40">📥</span>
                    <span>{language === 'en' ? 'Drag & drop deals here' : 'اسحب وأفلت الصفقات هنا'}</span>
                  </div>
                ) : (
                  stageDeals.map((deal) => {
                    const isBeingDragged = draggedDealId === deal.id;

                    return (
                      <div
                        key={deal.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, deal)}
                        onDragEnd={handleDragEnd}
                        className={`aspect-square w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border transition-all duration-200 group relative flex flex-col justify-between cursor-grab active:cursor-grabbing select-none ${
                          isBeingDragged
                            ? 'opacity-40 scale-95 border-dashed border-purple-500 ring-2 ring-purple-500/40 shadow-xl'
                            : 'border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700/80'
                        }`}
                      >
                        {/* Top: Grip & Percentage */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors" title="اسحب الصفقة">
                            <GripVertical className="w-4 h-4" />
                          </span>
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                            {deal.probability}%
                          </span>
                        </div>

                        {/* Middle: Part of Name */}
                        <div className="my-auto py-1.5 flex items-center">
                          <h4 
                            className="text-xs font-black text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
                            title={deal.title}
                          >
                            {deal.title}
                          </h4>
                        </div>

                        {/* Bottom: Full Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
                          <span className="font-black text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                            {deal.value.toLocaleString()} <span className="text-[9px]">ر.س</span>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

