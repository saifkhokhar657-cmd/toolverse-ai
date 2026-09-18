import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, Sliders, RefreshCw, Wand2, Eye } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

export const BackgroundRemover: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [tolerance, setTolerance] = useState<number>(30);
  const [smoothing, setSmoothing] = useState<number>(1);
  const [targetColor, setTargetColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [previewBg, setPreviewBg] = useState<'transparent' | 'dark' | 'white'>('transparent');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image.');
      return;
    }
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);

    // Auto-detect corner color
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // sample top-left pixel
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setTargetColor(hex);
        processBackgroundRemoval(url, hex, tolerance, smoothing);
      }
    };
    img.src = url;
  };

  const processBackgroundRemoval = (src: string, colorHex: string, tol: number, smooth: number) => {
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Parse target color
      const rTarget = parseInt(colorHex.slice(1, 3), 16);
      const gTarget = parseInt(colorHex.slice(3, 5), 16);
      const bTarget = parseInt(colorHex.slice(5, 7), 16);

      const maxDist = (tol / 100) * 441.67; // max euclidean distance in RGB space

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean distance
        const dist = Math.sqrt(
          Math.pow(r - rTarget, 2) +
          Math.pow(g - gTarget, 2) +
          Math.pow(b - bTarget, 2)
        );

        if (dist <= maxDist) {
          if (smooth > 0) {
            // Smooth alpha transition
            const alphaRatio = dist / maxDist;
            data[i + 3] = Math.round(alphaRatio * 255);
          } else {
            data[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setProcessedUrl(canvas.toDataURL('image/png'));
      setIsProcessing(false);
    };
    img.src = src;
  };

  const handleApply = () => {
    if (!originalUrl) return;
    processBackgroundRemoval(originalUrl, targetColor, tolerance, smoothing);
  };

  const handleDownload = () => {
    if (!processedUrl || !file) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${baseName}-transparent.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    logToolHistory('Background Remover', '/tools/background-remover', `Removed background for ${file.name}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="Background Remover"
        description="Extract subjects and remove solid or studio backgrounds with precise tolerance controls and edge softening. 100% private in-browser canvas rendering."
        category="Image Tools"
      />

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-12 text-center transition-all cursor-pointer bg-white hover:bg-slate-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
            <Wand2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Choose an Image to Remove Background
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Best results with photos taken against solid, white, or distinct backdrop colors
          </p>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold pointer-events-none"
          >
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Color to Remove
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={targetColor}
                    onChange={(e) => {
                      setTargetColor(e.target.value);
                      processBackgroundRemoval(originalUrl, e.target.value, tolerance, smoothing);
                    }}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={targetColor}
                    onChange={(e) => {
                      setTargetColor(e.target.value);
                      processBackgroundRemoval(originalUrl, e.target.value, tolerance, smoothing);
                    }}
                    className="w-28 px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono uppercase font-bold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Tolerance: {tolerance}%
                  </label>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  value={tolerance}
                  onChange={(e) => {
                    setTolerance(Number(e.target.value));
                    processBackgroundRemoval(originalUrl, targetColor, Number(e.target.value), smoothing);
                  }}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Preview Canvas Backdrop
                </label>
                <div className="flex gap-1.5">
                  {(['transparent', 'dark', 'white'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreviewBg(mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                        previewBg === mode
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => { setFile(null); setOriginalUrl(''); setProcessedUrl(''); }}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Upload Different Photo</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isProcessing || !processedUrl}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>Download Transparent PNG</span>
              </button>
            </div>
          </div>

          {/* Canvas Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Original Image
              </div>
              <div className="h-72 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 p-2">
                <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                Transparent Cutout Result
              </div>
              <div
                className={`h-72 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 p-2 transition-colors ${
                  previewBg === 'transparent'
                    ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50'
                    : previewBg === 'dark'
                    ? 'bg-slate-900'
                    : 'bg-white'
                }`}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                    <span className="text-xs">Removing background...</span>
                  </div>
                ) : (
                  <img src={processedUrl} alt="Transparent cutout" className="max-h-full max-w-full object-contain" />
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
