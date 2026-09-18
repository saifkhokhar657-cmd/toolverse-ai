import React from 'react';

interface ToolVerseLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const ToolVerseLogo: React.FC<ToolVerseLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  // Dimension configurations
  const dimensions = {
    sm: { icon: 26, text: 'text-base', badge: 'text-[9px] px-1.5 py-0.5', tagline: 'text-[10px]' },
    md: { icon: 34, text: 'text-xl', badge: 'text-[10px] px-2 py-0.5', tagline: 'text-xs' },
    lg: { icon: 42, text: 'text-2xl', badge: 'text-xs px-2.5 py-1', tagline: 'text-sm' },
    xl: { icon: 56, text: 'text-3xl sm:text-4xl', badge: 'text-xs px-3 py-1', tagline: 'text-sm sm:text-base' },
  }[size];

  const iconDim = dimensions.icon;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision SaaS Logo Mark: Hexagonal Tech Vortex with Central Intelligent Core */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: iconDim, height: iconDim }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="tv-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="tv-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>
            <linearGradient id="tv-grad-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Isometric Hexagon Base */}
          <path
            d="M50 6 L86 26.5 L86 67.5 L50 88 L14 67.5 L14 26.5 Z"
            fill="url(#tv-grad-dark)"
            stroke="url(#tv-grad-primary)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Upper Facet with subtle transparency */}
          <path
            d="M50 6 L86 26.5 L50 48 L14 26.5 Z"
            fill="#FFFFFF"
            fillOpacity="0.08"
          />

          {/* Left Wing Facet */}
          <path
            d="M14 26.5 L50 48 L50 88 L14 67.5 Z"
            fill="#000000"
            fillOpacity="0.18"
          />

          {/* Interlocking Dynamic "T" and "V" Prisms */}
          {/* Top T-Bar Horizon */}
          <path
            d="M28 32 L72 32 L68 40 L32 40 Z"
            fill="url(#tv-grad-primary)"
          />
          {/* Central Converging V Core */}
          <path
            d="M50 42 L66 42 L50 74 L34 42 L50 42 Z"
            fill="url(#tv-grad-glow)"
          />

          {/* Precision Neural Spark Core */}
          <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="8" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
        </svg>
      </div>

      {/* Brand Typographic Identity */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white ${dimensions.text}`}
              style={{ fontFamily: "'Space Grotesk', -apple-system, sans-serif" }}
            >
              ToolVerse
            </span>
            <span
              className={`inline-flex items-center font-extrabold rounded-md bg-gradient-to-r from-indigo-600 to-cyan-600 text-white tracking-wider uppercase shadow-2xs ${dimensions.badge}`}
            >
              AI
            </span>
          </div>

          {showTagline && (
            <span className={`text-slate-500 font-medium tracking-tight mt-0.5 ${dimensions.tagline}`}>
              Smart Tools. Simple Solutions.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
