import React, { useState } from 'react';
import { Type, Copy, Check, Trash2, Clock, Volume2, BarChart2 } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = trimmed ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = trimmed ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

  // Reading time (~225 words per minute)
  const readingTimeMin = Math.ceil(words / 225);
  // Speaking time (~130 words per minute)
  const speakingTimeMin = Math.ceil(words / 130);

  // Keyword density
  const getKeywordDensity = () => {
    if (!trimmed) return [];
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'i', 'is', 'that', 'it', 'on', 'you', 'this', 'for', 'but', 'with', 'are', 'have', 'be', 'at', 'or', 'as', 'was', 'so', 'if', 'out', 'not']);
    const wordList = trimmed
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    const freqMap = new Map<string, number>();
    wordList.forEach(w => freqMap.set(w, (freqMap.get(w) || 0) + 1));

    return Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / (words || 1)) * 100).toFixed(1),
      }));
  };

  const keywords = getKeywordDensity();

  // Case transforms
  const transformCase = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!text) return;
    let transformed = text;
    if (type === 'upper') {
      transformed = text.toUpperCase();
    } else if (type === 'lower') {
      transformed = text.toLowerCase();
    } else if (type === 'title') {
      transformed = text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
    } else if (type === 'sentence') {
      transformed = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    }
    setText(transformed);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="Word & Character Counter"
        description="Real-time text analysis for writers, editors, and students: count words, characters, sentences, reading duration, and keyword frequencies."
        category="Text & Utilities"
      />

      {/* Metrics Top Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Words</div>
          <div className="text-3xl font-black text-indigo-600">{words.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Characters</div>
          <div className="text-3xl font-black text-slate-900">{charsWithSpaces.toLocaleString()}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Sentences</div>
          <div className="text-3xl font-black text-slate-900">{sentences}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Paragraphs</div>
          <div className="text-3xl font-black text-slate-900">{paragraphs}</div>
        </div>
      </div>

      {/* Main Textarea Area */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 space-y-4">
        
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Case:</span>
            <button
              onClick={() => transformCase('upper')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transformCase('lower')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              lowercase
            </button>
            <button
              onClick={() => transformCase('title')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Title Case
            </button>
            <button
              onClick={() => transformCase('sentence')}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Sentence case
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              disabled={!text}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
              title="Clear Text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here to inspect word count, character density, and speech timing..."
          className="w-full text-slate-800 text-sm leading-relaxed placeholder:text-slate-400 focus:outline-none focus:ring-0 border-0 p-0"
        />

        {/* Footer info stats */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Reading: ~{readingTimeMin} min</span>
            </span>
            <span className="flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Speaking: ~{speakingTimeMin} min</span>
            </span>
            <span>Chars (no spaces): {charsNoSpaces.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Keyword Density Table */}
      {keywords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            <span>Top Keywords & Frequency</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {keywords.map((kw, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">{kw.word}</div>
                  <div className="text-[10px] text-slate-400">{kw.count} occurrences</div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {kw.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
