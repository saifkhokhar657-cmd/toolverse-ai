import React, { useState } from 'react';
import { UserCheck, Copy, Check, Trash2, Bookmark, AlertCircle, RefreshCw } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { UserUsage } from '../../types';
import { incrementGenerationsUsed, addSavedItem, logToolHistory } from '../../utils/storage';

interface BioItem {
  style: string;
  text: string;
  charCount: number;
}

interface AiBioGeneratorProps {
  usage: UserUsage;
  onUsageUpdate: (usage: UserUsage) => void;
  onOpenAuth: () => void;
}

export const AiBioGenerator: React.FC<AiBioGeneratorProps> = ({
  usage,
  onUsageUpdate,
  onOpenAuth,
}) => {
  const [nameOrBrand, setNameOrBrand] = useState('');
  const [profession, setProfession] = useState('');
  const [vibe, setVibe] = useState('Modern & Professional');
  const [platform, setPlatform] = useState('Instagram');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bios, setBios] = useState<BioItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const vibes = [
    'Modern & Professional',
    'Witty, Punchy & Creative',
    'Minimalist & High-Impact',
    'Authority, Founder & Thought Leader',
    'Casual, Friendly & Warm',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profession.trim()) {
      setError('Please specify your profession or brand focus.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameOrBrand: nameOrBrand.trim() || undefined,
          profession: profession.trim(),
          vibe,
          platform,
          plan: usage.plan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate bios');
      }

      if (data.data?.bios) {
        setBios(data.data.bios);
        const updatedUsage = incrementGenerationsUsed();
        onUsageUpdate(updatedUsage);
        logToolHistory('AI Bio Generator', '/tools/ai-bio-generator', `Generated bios for ${profession}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating bios.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSave = (bio: BioItem) => {
    addSavedItem({
      toolName: 'AI Bio Generator',
      toolPath: '/tools/ai-bio-generator',
      preview: bio.text.slice(0, 60) + '...',
      data: bio,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="AI Bio Generator"
        description="Craft memorable, attention-grabbing bios tailored to your target platform character limits and personal brand archetype."
        category="AI Content Tools"
        isAiTool={true}
        usage={usage}
        onOpenAuth={onOpenAuth}
      />

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Name or Brand Name (Optional)
              </label>
              <input
                type="text"
                value={nameOrBrand}
                onChange={(e) => setNameOrBrand(e.target.value)}
                placeholder="e.g. Sarah Jenkins or TechStack Labs"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
              >
                <option value="Instagram">Instagram (Max 150 chars)</option>
                <option value="Twitter / X">Twitter / X (Max 160 chars)</option>
                <option value="LinkedIn">LinkedIn (Professional Summary)</option>
                <option value="TikTok">TikTok (Punchy & Short)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Profession, Niche, or What You Do <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. UX Designer helping B2B SaaS convert more trials into paid users..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tone & Vibe
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-white"
            >
              {vibes.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
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

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => { setProfession(''); setNameOrBrand(''); setBios([]); setError(''); }}
              disabled={loading || (!profession && bios.length === 0)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={loading || !profession.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Writing Profiles...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Generate Bios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {bios.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">
              Generated Bios for {platform}
            </h2>
            <span className="text-xs text-slate-500">Click to copy with 1 click</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bios.map((bio, idx) => {
              const charLimit = platform === 'Instagram' ? 150 : platform === 'Twitter / X' ? 160 : 300;
              const charCount = bio.text.length;
              const isOver = charCount > charLimit;
              const isCopied = copiedIndex === idx;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between hover:border-indigo-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {bio.style || `Style ${idx + 1}`}
                      </span>
                      <span className={`text-xs font-mono font-semibold ${isOver ? 'text-rose-600' : 'text-slate-400'}`}>
                        {charCount}/{charLimit} chars
                      </span>
                    </div>

                    <div className="text-sm text-slate-800 whitespace-pre-line leading-relaxed mb-4">
                      {bio.text}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleSave(bio)}
                      className="p-1.5 text-xs text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>

                    <button
                      onClick={() => handleCopy(bio.text, idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied!' : 'Copy Bio'}</span>
                    </button>
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
