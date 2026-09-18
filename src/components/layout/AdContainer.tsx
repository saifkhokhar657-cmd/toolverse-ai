import React from 'react';

interface AdContainerProps {
  slotId?: string;
  format?: 'banner' | 'rectangle' | 'horizontal' | 'in-feed';
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({
  slotId = 'tv-ad-default',
  format = 'horizontal',
  className = ''
}) => {
  const getFormatClasses = () => {
    switch (format) {
      case 'banner':
        return 'w-full max-w-[728px] min-h-[90px] md:h-[90px]';
      case 'rectangle':
        return 'w-full max-w-[300px] min-h-[250px]';
      case 'in-feed':
        return 'w-full min-h-[120px]';
      case 'horizontal':
      default:
        return 'w-full max-w-4xl min-h-[90px]';
    }
  };

  return (
    <aside
      aria-label="Advertisement Container"
      id={`ad-slot-${slotId}`}
      className={`my-8 mx-auto flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-300 bg-slate-100/70 text-slate-400 text-xs transition-colors hover:border-slate-400 ${getFormatClasses()} ${className}`}
    >
      <div className="flex items-center gap-2 mb-1.5 opacity-75">
        <span className="uppercase tracking-wider font-semibold text-[10px] text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
          Advertisement
        </span>
        <span className="text-[11px] text-slate-400">Reserved Google AdSense Placement</span>
      </div>
      <div className="text-[11px] text-slate-500 text-center font-medium">
        ToolVerse AI is free thanks to responsible, non-intrusive sponsor ads.
      </div>
    </aside>
  );
};
