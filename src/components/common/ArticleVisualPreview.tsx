import React from 'react';
import { Article } from '../../types';

interface ArticleVisualPreviewProps {
  article: Article;
  className?: string;
  size?: 'card' | 'hero';
}

export const ArticleVisualPreview: React.FC<ArticleVisualPreviewProps> = ({
  article,
  className = '',
  size = 'card',
}) => {
  const isHero = size === 'hero';
  const containerHeight = isHero ? 'h-52 sm:h-72' : 'h-36 sm:h-40';

  // Dynamic contextual illustration based on category and slug keywords
  const renderVisual = () => {
    const slug = article.slug.toLowerCase();

    // 1. JPG vs PNG / Format comparison
    if (slug.includes('jpg-vs-png') || slug.includes('format') || slug.includes('webp')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-950/10 via-slate-900/5 to-cyan-500/10">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:14px_14px]" />
          
          <div className="relative z-10 flex items-center gap-3 sm:gap-6">
            {/* JPG Node */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-md text-center w-24 sm:w-28">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs mb-2">
                JPG
              </div>
              <div className="text-[11px] font-bold text-slate-800">Photographs</div>
              <div className="text-[9px] text-slate-400 mt-0.5">High Compression</div>
            </div>

            {/* VS Badge */}
            <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-black text-[10px] shadow-sm">
              VS
            </div>

            {/* PNG Node */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-md text-center w-24 sm:w-28">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs mb-2">
                PNG
              </div>
              <div className="text-[11px] font-bold text-slate-800">Graphics</div>
              <div className="text-[9px] text-indigo-600 font-semibold mt-0.5">Alpha Transparency</div>
            </div>
          </div>
        </div>
      );
    }

    // 2. Compression visualization (Image or PDF)
    if (slug.includes('compress') || slug.includes('reduce-image-size') || slug.includes('reduce-pdf-size')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-cyan-950/10 via-slate-900/5 to-emerald-500/10">
          <div className="relative z-10 flex items-center gap-3 sm:gap-6 max-w-sm w-full">
            {/* Uncompressed */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">Original</span>
              <div className="text-sm sm:text-base font-black text-slate-800 my-1">4.2 MB</div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full" />
            </div>

            {/* Flow */}
            <div className="flex flex-col items-center shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] shadow-xs">
                -85% Optimization
              </span>
              <span className="text-emerald-600 text-sm font-black mt-1">➔</span>
            </div>

            {/* Compressed */}
            <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 shadow-sm text-center">
              <span className="text-[9px] font-black text-emerald-700 uppercase">Optimized</span>
              <div className="text-sm sm:text-base font-black text-emerald-900 my-1">620 KB</div>
              <div className="h-1.5 w-full bg-emerald-400 rounded-full" />
            </div>
          </div>
        </div>
      );
    }

    // 3. Conversion visualization (JPG to PDF, PDF to JPG)
    if (slug.includes('convert') || slug.includes('jpg-to-pdf') || slug.includes('pdf-to-jpg')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-amber-950/10 via-slate-900/5 to-red-500/10">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-20 sm:w-24 h-24 bg-white border border-slate-200 rounded-xl shadow-md p-2 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[9px] font-bold text-slate-700">Images</span>
              </div>
              <div className="w-full h-10 bg-gradient-to-tr from-amber-100 to-amber-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-amber-800">
                .JPG / .PNG
              </div>
              <span className="text-[8px] text-slate-400">High Resolution</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
              ➔
            </div>

            <div className="w-20 sm:w-24 h-24 bg-white border-2 border-red-500 rounded-xl shadow-md p-2 flex flex-col justify-between transform rotate-3 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-red-600">PDF</span>
                <span className="w-2 h-2 rounded-full bg-red-500" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                <div className="h-1.5 bg-slate-200 rounded-full w-3/4" />
              </div>
              <span className="text-[8px] font-bold text-slate-600 text-center">Multi-Page Doc</span>
            </div>
          </div>
        </div>
      );
    }

    // 4. AI & Content Creation (Captions, Bios, Hashtags, Rewriter)
    if (article.category === 'ai' || slug.includes('caption') || slug.includes('hashtag') || slug.includes('bio') || slug.includes('rewrite')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-indigo-950/10 via-purple-900/5 to-pink-500/10">
          <div className="relative z-10 flex items-center gap-3 sm:gap-6">
            <div className="bg-white rounded-2xl border border-indigo-100 p-3 shadow-md w-44 sm:w-52">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-900">Gemini 2.5 AI Engine</span>
                </div>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Smart</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-[9px] font-bold text-slate-800">Engagement Optimization</div>
                <div className="text-[8px] text-slate-500 leading-tight">
                  High-converting captions, curated viral hashtags & audience targeting.
                </div>
              </div>
              <div className="flex gap-1 mt-2 text-[8px] font-bold text-indigo-700">
                <span className="bg-indigo-50 px-1.5 py-0.5 rounded">#Growth</span>
                <span className="bg-indigo-50 px-1.5 py-0.5 rounded">#ViralStrategy</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. Calculators & Financial analysis
    if (article.category === 'calculators' || slug.includes('calculator') || slug.includes('emi') || slug.includes('bmi') || slug.includes('interest')) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-emerald-950/10 via-slate-900/5 to-teal-500/10">
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-white rounded-2xl border border-emerald-200 p-3 shadow-md flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg">
                %
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Mathematical Precision</div>
                <div className="text-[9px] text-slate-500">Exact formula benchmarks</div>
                <div className="text-[9px] font-bold text-emerald-600 mt-1">Verified Calculations</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 6. Default Knowledge Hub graphic
    return (
      <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-950/10 via-indigo-900/5 to-slate-900/10">
        <div className="relative z-10 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            TV
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Technical Tutorial</div>
            <div className="text-[10px] text-slate-500">ToolVerse AI Engineering Research</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${containerHeight} rounded-2xl overflow-hidden border border-slate-200/80 select-none ${className}`}>
      {renderVisual()}
    </div>
  );
};
