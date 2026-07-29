import React, { useState } from 'react';
import { X, Sparkles, Send, Copy, Check, Bot, Zap, MessageSquare, ArrowRight } from 'lucide-react';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  initialContext?: { type: string; data?: any };
  onTriggerToast: (title: string, message: string, type: 'success' | 'info') => void;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  language = 'ar',
  initialContext,
  onTriggerToast
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quickActions = language === 'en' ? [
    { label: '✉️ Draft Follow-up Email', prompt: 'Draft a professional and persuasive follow-up email for this client.' },
    { label: '📊 Analyze Deal Win Rate', prompt: 'Analyze this deal and provide recommendations to increase win probability.' },
    { label: '💬 Objection Handling', prompt: 'How should I respond if the client says our pricing is too high compared to competitors?' },
    { label: '🚀 Closing Strategy', prompt: 'Suggest 3 actionable steps to close this deal before the end of the month.' }
  ] : [
    { label: '✉️ مسودة بريد متابعة احترافي', prompt: 'اكتب مسودة بريد إلكتروني احترافي ومقنع لمتابعة العميل وإقناعه بإتمام الصفقة.' },
    { label: '📊 تحليل فرص الفوز بالصفقة', prompt: 'قم بتحليل هذه الصفقة واقترح توصيات عملية لرفع احتمالية إغلاقها بنجاح.' },
    { label: '💬 الرد على اعتراضات الأسعار', prompt: 'كيف أجيب بحرافية إذا اعترض العميل أن السعر مرتفع مقارنة بالمنافسين؟' },
    { label: '🚀 استراتيجية الإغلاق السريع', prompt: 'اقترح 3 خطوات عملية لإغلاق هذه الصفقة قبل نهاية الشهر.' }
  ];

  const handleAskAI = async (customPrompt?: string) => {
    const queryToRun = customPrompt || prompt;
    if (!queryToRun.trim()) return;

    setLoading(true);
    setResult('');
    setCopied(false);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToRun,
          contextType: initialContext?.type || 'general',
          data: initialContext?.data || {},
          language
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setResult(language === 'en' ? 'Failed to generate AI response. Please try again.' : 'تعذر توليد الرد من المساعد الذكي. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setResult(language === 'en'
        ? 'AI Assistant Suggestion: Follow up with the client with a clear value proposition and offer a flexible payment milestone to secure agreement.'
        : 'توصية المساعد الذكي: احرص على التواصل مع العميل بتقديم قيمة مضافة واضحة مع إمكانية جدولة الدفعات لتسهيل اتخاذ قرار الشراء.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    onTriggerToast(
      language === 'en' ? 'Copied to Clipboard! 📋' : 'تم النسخ إلى الحافظة! 📋',
      language === 'en' ? 'AI response text successfully copied.' : 'تم نسخ نص الرد بنجاح.',
      'success'
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black flex items-center gap-2">
                {language === 'en' ? 'Gemini AI Sales Copilot' : 'مساعد المبيعات الذكي (Gemini AI)'}
              </h3>
              <p className="text-xs text-blue-100 opacity-90">
                {language === 'en' ? 'Your smart assistant for CRM, deals & closing strategies' : 'مساعدك الذكي لإدارة الصفقات، صياغة الرسائل، وتسريع الإغلاق'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick Action Pills */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 block">
              {language === 'en' ? 'Quick AI Prompts:' : 'مقترحات سريعة للمساعد الذكي:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickActions.map((act, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(act.prompt);
                    handleAskAI(act.prompt);
                  }}
                  className="text-right p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{act.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {language === 'en' ? 'Ask Gemini AI anything about this deal or client:' : 'اسأل مساعد الذكاء الاصطناعي أي استفسار حول الصفقة أو العميل:'}
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={language === 'en' ? 'Type your prompt here...' : 'اكتب سؤالك أو طلبك هنا (مثال: اقترح رسالة واتساب لعميل متأخر في الرد)...'}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                onClick={() => handleAskAI()}
                disabled={loading || !prompt.trim()}
                className="absolute bottom-3 left-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition-all"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{language === 'en' ? 'Generate' : 'إرسال واستشارة'}</span>
              </button>
            </div>
          </div>

          {/* AI Result Box */}
          {(loading || result) && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200">
                    {language === 'en' ? 'Gemini AI Response' : 'رد وتوصيات مساعد الذكاء الاصطناعي'}
                  </span>
                </div>
                {result && !loading && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (language === 'en' ? 'Copied' : 'تم النسخ') : (language === 'en' ? 'Copy Text' : 'نسخ النص')}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-8 text-center space-y-2">
                  <div className="inline-block w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold animate-pulse">
                    {language === 'en' ? 'Analyzing and generating smart insights...' : 'جاري تحليل البيانات وصياغة الرد الذكي...'}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900">
                  {result}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
          <span>{language === 'en' ? 'Powered by Google Gemini 2.5 Flash API' : 'مدعوم بنظام Google Gemini 2.5 Flash الذكي'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            {language === 'en' ? 'Close' : 'إغلاق'}
          </button>
        </div>

      </div>
    </div>
  );
};
