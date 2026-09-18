import React, { useState } from 'react';
import { Sparkles, Copy, Check, Trash2, Bookmark, AlertCircle, RefreshCw } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { UserUsage } from '../../types';
import { incrementGenerationsUsed, addSavedItem, logToolHistory } from '../../utils/storage';
import { getCurrentUserIdToken } from '../../lib/firebase';

interface CaptionItem {
  title: string;
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
}

interface AiCaptionGeneratorProps {
  usage: UserUsage;
  onUsageUpdate: (usage: UserUsage) => void;
  onOpenAuth: () => void;
}

export const AiCaptionGenerator: React.FC<AiCaptionGeneratorProps> = ({
  usage,
  onUsageUpdate,
  onOpenAuth,
}) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Engaging & Catchy');
  const [audience, setAudience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set());

  const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter / X', 'YouTube Shorts', 'Facebook'];
  const tones = ['Engaging & Catchy', 'Professional & Thought Leadership', 'Witty & Humorous', 'Inspirational & Motivating', 'Educational & Actionable', 'Minimalist & Direct'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a topic or post concept.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const idToken = await getCurrentUserIdToken();
      const res = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          topic: topic.trim(),
          platform,
          tone,
          audience: audience.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate captions');
      }

      if (data.data?.captions) {
        setCaptions(data.data.captions);
        const updatedUsage = incrementGenerationsUsed();
        onUsageUpdate(updatedUsage);
        logToolHistory('AI Caption Generator', '/tools/ai-caption-generator', `Generated captions for ${platform}`);
      } else {
        throw new Error('Unexpected response format from AI service');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to the AI service.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (caption: CaptionItem, index: number) => {
    const fullText = `${caption.hook}\n\n${caption.body}\n\n${caption.callToAction}\n\n${caption.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = (caption: CaptionItem, index: number) => {
    const fullText = `${caption.hook}\n\n${caption.body}\n\n${caption.callToAction}`;
    addSavedItem({
      toolName: 'AI Caption Generator',
      toolPath: '/tools/ai-caption-generator',
      preview: caption.hook || caption.title,
      data: { caption, fullText },
    });
    setSavedIndices(prev => new Set(prev).add(index));
  };

  const handleClear = () => {
    setTopic('');
    setAudience('');
    setCaptions([]);
    setError('');
    setSavedIndices(new Set());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="AI Caption Generator"
        description="Generate high-converting, tailored captions with viral hooks, persuasive copy, and targeted hashtags for any social channel."
        category="AI Content Tools"
        isAiTool={true}
        usage={usage}
        onOpenAuth={onOpenAuth}
      />

      {/* Input Configuration Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        <form onSubmit={handleGenerate} className="space-y-5">
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                What is your post about? <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {topic.length}/500 characters
              </span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={500}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Announcing the launch of our new productivity app with 50% discount for early adopters..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              >
                {platforms.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              >
                {tones.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Target Audience (Optional)
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., Freelancers, founders, Gen-Z fitness enthusiasts..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to Generate</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || (!topic && captions.length === 0)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Crafting Captions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Captions</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Results Section */}
      {captions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <span>Generated Captions</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {captions.length} Options
              </span>
            </h2>
            <span className="text-xs text-slate-500">Ready to copy and paste</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {captions.map((cap, idx) => {
              const isCopied = copiedIndex === idx;
              const isSaved = savedIndices.has(idx);
              const totalCharacters = `${cap.hook} ${cap.body} ${cap.callToAction} ${cap.hashtags.join(' ')}`.length;
              const totalWords = `${cap.hook} ${cap.body} ${cap.callToAction}`.split(/\s+/).filter(Boolean).length;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-6 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {cap.title || `Option ${idx + 1}`}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSave(cap, idx)}
                        disabled={isSaved}
                        title="Save to Workspace"
                        className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                          isSaved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'text-slate-600 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => handleCopy(cap, idx)}
                        className={`p-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                          isCopied
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied!' : 'Copy Caption'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Caption Content */}
                  <div className="space-y-3 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
                    {cap.hook && (
                      <p className="font-bold text-slate-900 border-l-2 border-indigo-500 pl-3">
                        {cap.hook}
                      </p>
                    )}
                    <p>{cap.body}</p>
                    {cap.callToAction && (
                      <p className="italic text-indigo-900 font-medium">
                        {cap.callToAction}
                      </p>
                    )}
                  </div>

                  {/* Hashtags */}
                  {cap.hashtags?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {cap.hashtags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs text-indigo-600 bg-indigo-50/60 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Word & Char counter */}
                  <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{totalWords} words • {totalCharacters} characters</span>
                    <span>Platform: {platform}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
