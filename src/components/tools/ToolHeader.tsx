import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';
import { UserUsage } from '../../types';

interface ToolHeaderProps {
  title: string;
  description: string;
  category: string;
  isAiTool?: boolean;
  usage?: UserUsage;
  onOpenAuth?: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  description,
  category,
  isAiTool = false,
  usage,
  onOpenAuth,
}) => {
  return (
    <div className="mb-8 text-center sm:text-left sm:flex sm:items-start sm:justify-between sm:gap-6 border-b border-indigo-100/70 pb-6">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
          <span className="uppercase text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {category}
          </span>
          {isAiTool ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              <Sparkles className="w-3 h-3" /> Gemini AI
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield className="w-3 h-3" /> 100% Client-Side Private
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight tv-section-title">
          {title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      {isAiTool && usage && (
        <div className="mt-4 sm:mt-0 shrink-0 flex flex-col items-center sm:items-end tv-ai-panel rounded-2xl p-3 text-xs shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950 mb-1">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Daily AI Generations</span>
          </div>
          <div className="text-slate-600 font-medium">
            <span className="font-bold text-indigo-700 text-sm">
              {Math.max(0, usage.dailyGenerationsLimit - usage.dailyGenerationsUsed)}
            </span>{' '}
            of {usage.dailyGenerationsLimit} remaining
          </div>
          {usage.plan === 'guest' && onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="mt-1 text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              Sign in for 15/day →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
