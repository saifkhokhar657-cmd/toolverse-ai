import React from 'react';

interface ToolVisualPreviewProps {
  toolId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const ToolVisualPreview: React.FC<ToolVisualPreviewProps> = ({
  toolId,
  className = '',
  size = 'md',
}) => {
  // Height & scale configuration
  const sizeClasses = {
    sm: 'h-24',
    md: 'h-36',
    lg: 'h-48',
    hero: 'h-56 sm:h-64',
  }[size];

  // Helper renderer based on toolId
  const renderVisual = () => {
    switch (toolId) {
      // 1. AI Caption Generator
      case 'ai-caption-generator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-indigo-500/10">
            {/* Background grid dots */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:12px_12px]" />
            
            {/* Social card concept */}
            <div className="w-48 bg-white rounded-xl shadow-md border border-indigo-100 p-2.5 relative z-10 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                  AI
                </div>
                <div>
                  <div className="h-2 w-16 bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-10 bg-slate-100 rounded-full mt-1" />
                </div>
                <div className="ml-auto flex items-center gap-1 text-[9px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">
                  <span>♥</span> 2.4k
                </div>
              </div>
              
              {/* Image banner inside social post */}
              <div className="h-12 w-full rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white/90 text-[10px] font-bold tracking-wide">
                <span>NEW LAUNCH ✨</span>
              </div>

              {/* AI generated caption bubble */}
              <div className="mt-2 bg-indigo-50/80 rounded-lg p-1.5 border border-indigo-100/80">
                <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-700 mb-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  <span>AI Caption:</span>
                </div>
                <div className="text-[9px] text-slate-700 font-medium leading-tight line-clamp-1">
                  Ready to scale your digital presence? 🚀
                </div>
                <div className="flex gap-1 mt-1 text-[8px] font-semibold text-indigo-600">
                  <span className="bg-white/80 px-1 rounded">#ai</span>
                  <span className="bg-white/80 px-1 rounded">#growth</span>
                  <span className="bg-white/80 px-1 rounded">#viral</span>
                </div>
              </div>
            </div>
          </div>
        );

      // 2. AI Hashtag Generator
      case 'ai-hashtag-generator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-purple-900/10 via-slate-900/5 to-indigo-500/10">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:12px_12px]" />
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-black text-xs shadow-xs">
                  #viral
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-white border border-purple-200 text-purple-700 font-bold text-[11px] shadow-2xs">
                  #trending
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-xs shadow-xs">
                  #creator
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full border border-slate-200 shadow-xs text-[10px] font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>+140% Potential Reach Analysis</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-bold text-[11px] shadow-2xs">
                  #digitaltools
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-xs">
                  #reels2025
                </span>
              </div>
            </div>
          </div>
        );

      // 3. AI Bio Generator
      case 'ai-bio-generator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-blue-900/10 via-slate-900/5 to-cyan-500/10">
            <div className="relative z-10 w-52 bg-white rounded-xl shadow-md border border-slate-200/90 p-3">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                  JD
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900">Alex Rivers</span>
                    <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[7px]">✓</span>
                  </div>
                  <span className="text-[9px] text-slate-400">@alexcreates · 48K Followers</span>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-[9px] text-slate-700 font-medium leading-tight">
                <div>✨ Building useful digital products & tools</div>
                <div>💡 Helping 50k+ creators work smarter</div>
                <div className="text-indigo-600 font-bold">🔗 toolverse.soulverseapps.com/tools</div>
              </div>
            </div>
          </div>
        );

      // 4. AI Text Rewriter
      case 'ai-text-rewriter':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-amber-900/10 via-slate-900/5 to-indigo-500/10">
            <div className="relative z-10 flex items-center gap-2 w-full max-w-[240px]">
              {/* Left Draft */}
              <div className="flex-1 bg-white/90 border border-slate-200 rounded-lg p-2 shadow-2xs">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Draft Text</span>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-1.5" />
                <div className="h-1.5 w-4/5 bg-slate-200 rounded-full mt-1 line-through text-slate-300" />
                <div className="h-1.5 w-3/5 bg-slate-200 rounded-full mt-1" />
              </div>

              {/* Conversion Arrow */}
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                ⚡
              </div>

              {/* Right Polished */}
              <div className="flex-1 bg-indigo-50/90 border border-indigo-200 rounded-lg p-2 shadow-2xs">
                <span className="text-[8px] font-bold text-indigo-700 uppercase">Polished AI</span>
                <div className="h-1.5 w-full bg-indigo-400 rounded-full mt-1.5" />
                <div className="h-1.5 w-full bg-indigo-300 rounded-full mt-1" />
                <div className="h-1.5 w-4/5 bg-indigo-300 rounded-full mt-1" />
              </div>
            </div>
          </div>
        );

      // 5. Image Compressor
      case 'image-compressor':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-cyan-900/10 via-slate-900/5 to-emerald-500/10">
            <div className="relative z-10 flex items-center gap-3 w-full max-w-[240px]">
              {/* Raw File */}
              <div className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs mb-1">
                  RAW
                </div>
                <div className="text-[10px] font-black text-slate-800">2.4 MB</div>
                <span className="text-[8px] text-slate-400 uppercase font-semibold">100% Quality</span>
              </div>

              {/* Reduction Beam */}
              <div className="flex flex-col items-center shrink-0">
                <div className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black shadow-xs">
                  -84%
                </div>
                <div className="text-emerald-600 text-xs font-bold mt-0.5">➔</div>
              </div>

              {/* Compressed File */}
              <div className="flex-1 bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 shadow-2xs text-center">
                <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-1">
                  ✓
                </div>
                <div className="text-[10px] font-black text-emerald-800">380 KB</div>
                <span className="text-[8px] text-emerald-600 uppercase font-bold">Optimized</span>
              </div>
            </div>
          </div>
        );

      // 6. Image Resizer
      case 'image-resizer':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-blue-900/10 via-slate-900/5 to-cyan-500/10">
            <div className="relative z-10 w-44 h-24 border-2 border-dashed border-blue-400 bg-white/80 rounded-lg p-2 flex flex-col justify-between">
              {/* Corner transform handles */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-600 rounded-xs" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-xs" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-600 rounded-xs" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-xs" />

              <div className="flex items-center justify-between text-[9px] font-bold text-blue-700">
                <span>1920 × 1080</span>
                <span className="bg-blue-100 px-1.5 py-0.2 rounded">16:9</span>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-700">
                <span className="px-1.5 py-0.5 rounded bg-slate-100">1:1 Square</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white">Custom PX</span>
              </div>

              <div className="text-right text-[8px] text-slate-400 font-semibold">
                Instant Canvas Rescale
              </div>
            </div>
          </div>
        );

      // 7. Background Remover
      case 'background-remover':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-slate-900/5 to-indigo-900/10">
            <div className="relative z-10 w-44 h-24 rounded-xl border border-slate-300 overflow-hidden shadow-sm flex">
              {/* Left side: solid color */}
              <div className="w-1/2 bg-slate-800 flex items-center justify-center relative">
                <span className="text-[8px] font-bold text-slate-400 absolute top-1 left-2">Solid</span>
                <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-white shadow-xs" />
              </div>

              {/* Divider */}
              <div className="w-0.5 bg-white z-20 relative flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white shadow-xs text-slate-900 text-[8px] font-black flex items-center justify-center">
                  ↔
                </div>
              </div>

              {/* Right side: transparent checkerboard */}
              <div
                className="w-1/2 flex items-center justify-center relative"
                style={{
                  backgroundImage: `linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)`,
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                  backgroundColor: '#ffffff'
                }}
              >
                <span className="text-[8px] font-bold text-slate-600 absolute top-1 right-2">Cutout</span>
                <div className="w-10 h-10 rounded-full bg-amber-400 shadow-xs" />
              </div>
            </div>
          </div>
        );

      // 8. Image Converter
      case 'image-converter':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-indigo-900/10 via-slate-900/5 to-cyan-500/10">
            <div className="relative z-10 flex items-center justify-center gap-2">
              <div className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-center">
                <div className="text-[9px] font-black text-blue-600">JPG</div>
                <div className="text-[7px] text-slate-400">Standard</div>
              </div>

              <div className="text-xs font-bold text-slate-400">⇄</div>

              <div className="px-2.5 py-2 rounded-xl bg-indigo-600 text-white shadow-xs text-center">
                <div className="text-[9px] font-black">PNG</div>
                <div className="text-[7px] text-indigo-200">Alpha</div>
              </div>

              <div className="text-xs font-bold text-slate-400">⇄</div>

              <div className="px-2.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs text-center">
                <div className="text-[9px] font-black text-emerald-600">WEBP</div>
                <div className="text-[7px] text-slate-400">Modern</div>
              </div>
            </div>
          </div>
        );

      // 9. JPG to PDF
      case 'jpg-to-pdf':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-amber-900/10 via-slate-900/5 to-red-500/10">
            <div className="relative z-10 flex items-center gap-3">
              {/* 2 image cards */}
              <div className="relative w-12 h-16">
                <div className="absolute inset-0 bg-blue-400 rounded-lg shadow-2xs transform -rotate-6 flex items-center justify-center text-[8px] text-white font-bold">
                  IMG 1
                </div>
                <div className="absolute inset-0 bg-indigo-500 rounded-lg shadow-xs transform rotate-3 flex items-center justify-center text-[8px] text-white font-bold">
                  IMG 2
                </div>
              </div>

              {/* Conversion Arrow */}
              <div className="text-slate-400 font-black text-xs">➔</div>

              {/* PDF Document */}
              <div className="w-14 h-18 bg-white border-2 border-red-500 rounded-lg shadow-md p-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-red-600">PDF</span>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-slate-200 rounded-full w-full" />
                  <div className="h-1 bg-slate-200 rounded-full w-3/4" />
                </div>
                <span className="text-[7px] font-bold text-slate-500 text-center">Document</span>
              </div>
            </div>
          </div>
        );

      // 10. PDF to JPG
      case 'pdf-to-jpg':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-red-900/10 via-slate-900/5 to-amber-500/10">
            <div className="relative z-10 flex items-center gap-3">
              {/* PDF Document */}
              <div className="w-14 h-18 bg-white border-2 border-red-500 rounded-lg shadow-md p-1.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-red-600">PDF</span>
                  <span className="text-[8px] text-slate-400 font-bold">p.1-3</span>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-slate-200 rounded-full w-full" />
                  <div className="h-1 bg-slate-200 rounded-full w-4/5" />
                </div>
                <span className="text-[7px] font-bold text-red-700">Extract</span>
              </div>

              {/* Arrow */}
              <div className="text-slate-400 font-black text-xs">➔</div>

              {/* 2 JPG previews */}
              <div className="flex flex-col gap-1">
                <div className="px-2 py-1 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-bold text-slate-700">Page_1.jpg</span>
                </div>
                <div className="px-2 py-1 bg-white border border-slate-200 rounded-md shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-bold text-slate-700">Page_2.jpg</span>
                </div>
              </div>
            </div>
          </div>
        );

      // 11. PDF Compressor
      case 'pdf-compressor':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-red-900/10 via-slate-900/5 to-rose-500/10">
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-16 bg-white border border-red-200 rounded-lg p-1.5 text-center shadow-2xs">
                <span className="text-[8px] font-black text-slate-400">ORIGINAL</span>
                <div className="text-[10px] font-black text-slate-800 mt-2">18.4 MB</div>
              </div>

              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] shadow-xs">
                  -75%
                </span>
                <span className="text-red-500 text-xs font-bold mt-0.5">➔</span>
              </div>

              <div className="w-12 h-16 bg-red-50 border border-red-300 rounded-lg p-1.5 text-center shadow-2xs">
                <span className="text-[8px] font-black text-red-600">COMPACT</span>
                <div className="text-[10px] font-black text-red-900 mt-2">4.6 MB</div>
              </div>
            </div>
          </div>
        );

      // 12. Percentage Calculator
      case 'percentage-calculator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-emerald-900/10 via-slate-900/5 to-teal-500/10">
            <div className="relative z-10 flex items-center gap-3">
              {/* Circular Gauge Concept */}
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-emerald-200 bg-white flex items-center justify-center shadow-xs">
                <span className="text-xs font-black text-emerald-700">75%</span>
              </div>

              {/* Math formula breakdown */}
              <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-700">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
                  15% of $240 = <span className="text-emerald-600">$36</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                  Increase: +33.3%
                </span>
              </div>
            </div>
          </div>
        );

      // 13. Age Calculator
      case 'age-calculator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-teal-900/10 via-slate-900/5 to-cyan-500/10">
            <div className="relative z-10 flex items-center gap-2">
              <div className="bg-white border border-teal-200 rounded-xl p-2 shadow-2xs text-center min-w-[50px]">
                <div className="text-base font-black text-teal-700">28</div>
                <span className="text-[8px] text-slate-400 uppercase font-bold">Years</span>
              </div>
              <div className="bg-white border border-teal-200 rounded-xl p-2 shadow-2xs text-center min-w-[50px]">
                <div className="text-base font-black text-teal-700">7</div>
                <span className="text-[8px] text-slate-400 uppercase font-bold">Months</span>
              </div>
              <div className="bg-white border border-teal-200 rounded-xl p-2 shadow-2xs text-center min-w-[50px]">
                <div className="text-base font-black text-teal-700">14</div>
                <span className="text-[8px] text-slate-400 uppercase font-bold">Days</span>
              </div>
            </div>
          </div>
        );

      // 14. EMI Calculator
      case 'emi-calculator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-blue-900/10 via-slate-900/5 to-emerald-500/10">
            <div className="relative z-10 flex items-center gap-3">
              {/* Donut Chart representation */}
              <div className="relative w-14 h-14 rounded-full border-4 border-indigo-600 border-r-cyan-400 bg-white flex items-center justify-center shadow-xs">
                <span className="text-[9px] font-black text-slate-800">$1,420</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Principal: 70%</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Interest: 30%</span>
                </div>
                <div className="text-[8px] font-semibold text-emerald-600">
                  Amortized Schedule
                </div>
              </div>
            </div>
          </div>
        );

      // 15. BMI Calculator
      case 'bmi-calculator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-emerald-900/10 via-slate-900/5 to-amber-500/10">
            <div className="relative z-10 flex flex-col items-center gap-2 w-full max-w-[200px]">
              {/* Health color spectrum bar */}
              <div className="w-full h-3 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-rose-400 relative p-0.5">
                {/* Pointer indicator */}
                <div className="w-2.5 h-4 bg-slate-900 rounded-sm absolute -top-0.5 left-1/2 transform -translate-x-1/2 border border-white shadow-xs" />
              </div>

              <div className="flex items-center justify-between w-full text-[8px] font-bold text-slate-400">
                <span>Under</span>
                <span className="text-emerald-700 font-black">Normal (18.5 - 24.9)</span>
                <span>Over</span>
              </div>

              <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-black text-emerald-700 shadow-2xs">
                BMI 22.4 · Healthy Weight
              </div>
            </div>
          </div>
        );

      // 16. QR Code Generator
      case 'qr-code-generator':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-slate-900/10 via-indigo-900/5 to-slate-900/10">
            <div className="relative z-10 flex items-center gap-3">
              {/* Stylized QR Box */}
              <div className="w-16 h-16 bg-white border border-slate-300 rounded-xl p-1.5 shadow-sm grid grid-cols-4 gap-1 relative overflow-hidden">
                {/* Corner markers */}
                <div className="w-3.5 h-3.5 bg-slate-900 rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-xs" />
                </div>
                <div className="w-2 h-2 bg-slate-800 rounded-xs self-center justify-self-center" />
                <div className="w-2 h-2 bg-slate-800 rounded-xs self-center justify-self-center" />
                <div className="w-3.5 h-3.5 bg-slate-900 rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-xs" />
                </div>

                <div className="w-2 h-2 bg-slate-800 rounded-xs self-center justify-self-center" />
                <div className="w-2 h-2 bg-indigo-600 rounded-xs self-center justify-self-center" />
                <div className="w-2 h-2 bg-slate-800 rounded-xs self-center justify-self-center" />
                <div className="w-2 h-2 bg-slate-800 rounded-xs self-center justify-self-center" />

                <div className="w-3.5 h-3.5 bg-slate-900 rounded-xs flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-xs" />
                </div>
                <div className="w-2 h-2 bg-slate-800 rounded-xs self-center justify-self-center" />
                <div className="w-2 h-2 bg-slate-800 rounded-xs self-center justify-self-center" />
                <div className="w-2 h-2 bg-indigo-600 rounded-xs self-center justify-self-center" />

                {/* Laser scan line overlay */}
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
              </div>

              <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-700">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs">
                  Instant Camera Scan
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  PNG / SVG Export
                </span>
              </div>
            </div>
          </div>
        );

      // 17. Word Counter
      case 'word-counter':
        return (
          <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden bg-gradient-to-br from-slate-900/10 via-slate-900/5 to-cyan-500/10">
            <div className="relative z-10 w-48 bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Real-Time Stats</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>

              <div className="grid grid-cols-3 gap-1.5 mt-2 text-center">
                <div className="bg-slate-50 rounded-lg p-1 border border-slate-100">
                  <div className="text-xs font-black text-slate-900">1,420</div>
                  <div className="text-[7px] font-bold text-slate-400">Words</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-1 border border-slate-100">
                  <div className="text-xs font-black text-slate-900">8.9K</div>
                  <div className="text-[7px] font-bold text-slate-400">Chars</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-1 border border-indigo-100">
                  <div className="text-xs font-black text-indigo-700">5.2m</div>
                  <div className="text-[7px] font-bold text-indigo-500">Read</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center p-3 bg-slate-100/70">
            <span className="text-xs font-bold text-slate-400">ToolVerse AI Engine</span>
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${sizeClasses} rounded-xl overflow-hidden border-b border-slate-100/90 select-none ${className}`}>
      {renderVisual()}
    </div>
  );
};
