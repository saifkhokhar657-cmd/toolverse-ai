import React, { useState } from 'react';
import { Hash, Copy, Check, Trash2, Bookmark, AlertCircle, RefreshCw } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { UserUsage } from '../../types';
import { incrementGenerationsUsed, addSavedItem, logToolHistory } from '../../utils/storage';

interface HashtagData {
  highReach: string[];
  niche: string[];
  community: string[];
  all: string[];
}

interface AiHashtagGeneratorProps {
  usage: UserUsage;
  onUsageUpdate: (usage: UserUsage) => void;
  onOpenAuth: () => void;
}

export const AiHashtagGenerator: React.FC<AiHashtagGeneratorProps> = ({
  usage,
  onUsageUpdate,
  onOpenAuth,
}) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [count, setCount] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<HashtagData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please provide a topic or keywords.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/hashtag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          platform,
          count,
          plan: usage.plan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate hashtags');
      }

      if (data.data) {
        setResult(data.data);
        const updatedUsage = incrementGenerationsUsed();
        onUsageUpdate(updatedUsage);
        logToolHistory('AI Hashtag Generator', '/tools/ai-hashtag-generator', `Generated hashtags for ${topic}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred connecting to the AI service.');
    } finally {
      setLoading(false);
    }
  };

  const copyTags = (tags: string[], key: string) => {
    const text = tags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = () => {
    if (!result) return;
    addSavedItem({
      toolName: 'AI Hashtag Generator',
      toolPath: '/tools/ai-hashtag-generator',
      preview: `${topic} (${result.all?.length || 0} hashtags)`,
      data: result,
    });
    setCopiedKey('saved');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="AI Hashtag Generator"
        description="Discover viral, high-reach, and niche-targeted hashtags categorized by search volume to maximize your social visibility."
        category="AI Content Tools"
        isAiTool={true}
        usage={usage}
        onOpenAuth={onOpenAuth}
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Topic, Niche, or Keywords <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., street photography, SaaS marketing, vegan recipes, personal finance..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
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
                <option value="Instagram">Instagram (up to 30)</option>
                <option value="TikTok">TikTok (Trending & Sounds)</option>
                <option value="Twitter / X">Twitter / X (High Engagement)</option>
                <option value="LinkedIn">LinkedIn (Professional Topics)</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hashtags Count
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              >
                <option value={10}>10 Hashtags (Focused)</option>
                <option value={20}>20 Hashtags (Balanced)</option>
                <option value={30}>30 Hashtags (Maximum Reach)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Generation Error</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => { setTopic(''); setResult(null); setError(''); }}
              disabled={loading || (!topic && !result)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Discovering Tags...</span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4" />
                  <span>Generate Hashtags</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <span className="font-extrabold text-slate-900 text-base">
                {result.all?.length || 0} Hashtags Ready
              </span>
              <p className="text-xs text-slate-500">Categorized across reach tiers for optimal algorithmic ranking</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
              >
                {copiedKey === 'saved' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'saved' ? 'Saved' : 'Save Set'}</span>
              </button>

              <button
                onClick={() => copyTags(result.all || [], 'all')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {copiedKey === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'all' ? 'Copied All!' : 'Copy All Tags'}</span>
              </button>
            </div>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Reach */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    High Reach (Broad)
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {result.highReach?.length || 0} tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {result.highReach?.map((tag, i) => (
                    <span key={i} className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => copyTags(result.highReach || [], 'high')}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'high' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'high' ? 'Copied' : 'Copy High Reach'}</span>
              </button>
            </div>

            {/* Niche */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                    Niche & Targeted
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {result.niche?.length || 0} tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {result.niche?.map((tag, i) => (
                    <span key={i} className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => copyTags(result.niche || [], 'niche')}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'niche' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'niche' ? 'Copied' : 'Copy Niche Tags'}</span>
              </button>
            </div>

            {/* Community */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Community & Trending
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {result.community?.length || 0} tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {result.community?.map((tag, i) => (
                    <span key={i} className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => copyTags(result.community || [], 'community')}
                className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'community' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'community' ? 'Copied' : 'Copy Community'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
