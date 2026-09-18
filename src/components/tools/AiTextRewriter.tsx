import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Trash2, Bookmark, AlertCircle, ArrowRight } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { UserUsage } from '../../types';
import { incrementGenerationsUsed, addSavedItem, logToolHistory } from '../../utils/storage';
import { getCurrentUserIdToken } from '../../lib/firebase';

interface RewriteResult {
  rewrittenText: string;
  summaryOfChanges: string;
  keyImprovements: string[];
}

interface AiTextRewriterProps {
  usage: UserUsage;
  onUsageUpdate: (usage: UserUsage) => void;
  onOpenAuth: () => void;
}

export const AiTextRewriter: React.FC<AiTextRewriterProps> = ({
  usage,
  onUsageUpdate,
  onOpenAuth,
}) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('Standard Paraphrase');
  const [tone, setTone] = useState('Balanced');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [copied, setCopied] = useState(false);

  const modes = [
    { label: 'Standard Paraphrase', desc: 'Preserve exact meaning with natural new wording' },
    { label: 'Simplify & Clarify', desc: 'Remove jargon for high readability' },
    { label: 'Professional & Formal', desc: 'Elevate tone for executive and business emails' },
    { label: 'Casual & Conversational', desc: 'Friendly, warm, and approachable phrasing' },
    { label: 'Shorten & Concise', desc: 'Eliminate fluff and cut to the chase' },
    { label: 'Expand & Elaborate', desc: 'Add descriptive richness and depth' },
    { label: 'Fix Grammar & Polish', desc: 'Correct syntax, punctuation, and typos seamlessly' },
  ];

  const handleRewrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please paste or type the text you want to rewrite.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const idToken = await getCurrentUserIdToken();
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          text: inputText.trim(),
          mode,
          tone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to rewrite text');
      }

      if (data.data) {
        setResult(data.data);
        const updatedUsage = incrementGenerationsUsed();
        onUsageUpdate(updatedUsage);
        logToolHistory('AI Text Rewriter', '/tools/ai-text-rewriter', `Rewrote text in ${mode} mode`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while rewriting text.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.rewrittenText) return;
    navigator.clipboard.writeText(result.rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!result) return;
    addSavedItem({
      toolName: 'AI Text Rewriter',
      toolPath: '/tools/ai-text-rewriter',
      preview: result.rewrittenText.slice(0, 70) + '...',
      data: { original: inputText, ...result },
    });
  };

  const wordCount = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="AI Text Rewriter"
        description="Paraphrase, simplify, professionalize, or expand any article, essay, or email while preserving your foundational intent."
        category="AI Content Tools"
        isAiTool={true}
        usage={usage}
        onOpenAuth={onOpenAuth}
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        <form onSubmit={handleRewrite} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Rewriting Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              >
                {modes.map((m) => (
                  <option key={m.label} value={m.label}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tone Level
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              >
                <option value="Balanced">Balanced & Natural</option>
                <option value="Persuasive & Engaging">Persuasive & Engaging</option>
                <option value="Direct & Minimal">Direct & Minimal</option>
                <option value="Warm & Empathetic">Warm & Empathetic</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Original Text to Rewrite <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {inputText.length}/5,000 chars ({wordCount(inputText)} words)
              </span>
            </div>
            <textarea
              required
              rows={5}
              maxLength={5000}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the sentences, paragraph, or email you want to enhance..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm leading-relaxed"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to Rewrite</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => { setInputText(''); setResult(null); setError(''); }}
              disabled={loading || (!inputText && !result)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Rewriting Text...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Rewrite Text</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comparison Output */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {mode}
              </span>
              <p className="text-xs text-slate-500 mt-1">{result.summaryOfChanges}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original</span>
                <span className="text-[11px] text-slate-400">{wordCount(inputText)} words</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line opacity-80">
                {inputText}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Polished Result</span>
                <span className="text-[11px] text-indigo-600 font-semibold">{wordCount(result.rewrittenText)} words</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed whitespace-pre-line">
                {result.rewrittenText}
              </p>
            </div>
          </div>

          {result.keyImprovements?.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Key Enhancements
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.keyImprovements.map((imp, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                    ✓ {imp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
