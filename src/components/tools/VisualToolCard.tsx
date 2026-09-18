import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  Image as ImageIcon,
  FileText,
  Calculator,
  Type,
  Hash,
  UserCheck,
  RefreshCw,
  Scissors,
  Layers,
  FileDown,
  FileType,
  Percent,
  Calendar,
  DollarSign,
  Activity,
  QrCode,
  AlignLeft,
} from 'lucide-react';
import { ToolItem } from '../../types';
import { ToolVisualPreview } from '../common/ToolVisualPreview';

interface VisualToolCardProps {
  tool: ToolItem;
  onNavigate: (path: string) => void;
  featured?: boolean;
}

export const VisualToolCard: React.FC<VisualToolCardProps> = ({
  tool,
  onNavigate,
  featured = false,
}) => {
  const isAiTool = tool.category === 'ai';

  // Category labels and icons
  const renderCategoryIcon = () => {
    const iconClass = 'w-3.5 h-3.5';
    switch (tool.iconName) {
      case 'Sparkles':
        return <Sparkles className={`${iconClass} text-indigo-600`} />;
      case 'Hash':
        return <Hash className={`${iconClass} text-indigo-600`} />;
      case 'UserCheck':
        return <UserCheck className={`${iconClass} text-indigo-600`} />;
      case 'RefreshCw':
        return <RefreshCw className={`${iconClass} text-indigo-600`} />;
      case 'Image':
      case 'Maximize2':
        return <ImageIcon className={`${iconClass} text-cyan-600`} />;
      case 'Scissors':
        return <Scissors className={`${iconClass} text-cyan-600`} />;
      case 'Layers':
        return <Layers className={`${iconClass} text-cyan-600`} />;
      case 'FileDown':
        return <FileDown className={`${iconClass} text-amber-600`} />;
      case 'FileType':
        return <FileType className={`${iconClass} text-amber-600`} />;
      case 'FileArchive':
        return <FileText className={`${iconClass} text-amber-600`} />;
      case 'Percent':
        return <Percent className={`${iconClass} text-emerald-600`} />;
      case 'Calendar':
        return <Calendar className={`${iconClass} text-emerald-600`} />;
      case 'DollarSign':
        return <DollarSign className={`${iconClass} text-emerald-600`} />;
      case 'Activity':
        return <Activity className={`${iconClass} text-emerald-600`} />;
      case 'QrCode':
        return <QrCode className={`${iconClass} text-slate-800`} />;
      case 'AlignLeft':
      case 'FileSpreadsheet':
        return <AlignLeft className={`${iconClass} text-slate-800`} />;
      default:
        return <ShieldCheck className={`${iconClass} text-indigo-600`} />;
    }
  };

  const categoryNames: Record<string, string> = {
    ai: 'AI Tools',
    image: 'Image Tools',
    pdf: 'PDF Tools',
    calculators: 'Calculators',
    text: 'Utilities',
  };

  return (
    <div
      onClick={() => onNavigate(tool.path)}
      className={`group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
        featured ? 'ring-1 ring-indigo-500/20' : ''
      }`}
    >
      <div>
        {/* Visual Illustration Thumbnail */}
        <div className="relative overflow-hidden bg-slate-50/50">
          <ToolVisualPreview toolId={tool.id} size="md" />

          {/* Floating Category Pill */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-2xs text-[10px] font-bold text-slate-700">
            {renderCategoryIcon()}
            <span>{categoryNames[tool.category] || tool.category}</span>
          </div>

          {/* Free / Pro Indicator Badge */}
          <div className="absolute top-2.5 right-2.5 z-20">
            {isAiTool ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-900/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-indigo-300" />
                <span>Free Plan</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-700/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>100% Free</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-1">
              {tool.name}
            </h3>
            {tool.popular && (
              <span className="shrink-0 text-[9px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                Popular
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Footer / CTA Bar */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
            {isAiTool ? 'Gemini 2.5 Flash' : 'Client-side processing'}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-950 group-hover:bg-indigo-600 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <span>Use Tool</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
