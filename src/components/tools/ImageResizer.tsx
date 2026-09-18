import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, Lock, Unlock, RefreshCw } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    { label: 'Instagram Post (1:1)', w: 1080, h: 1080 },
    { label: 'Instagram Story (9:16)', w: 1080, h: 1920 },
    { label: 'YouTube Thumbnail (16:9)', w: 1280, h: 720 },
    { label: 'Twitter / X Banner', w: 1500, h: 500 },
    { label: 'Facebook Post', w: 1200, h: 630 },
    { label: 'Web Icon / Favicon', w: 128, h: 128 },
  ];

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImgUrl(url);

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
      renderResized(img.width, img.height, url);
    };
    img.src = url;
  };

  const renderResized = (targetW: number, targetH: number, sourceUrl: string) => {
    if (targetW <= 0 || targetH <= 0) return;
    setIsProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);
      const output = canvas.toDataURL('image/png');
      setResizedUrl(output);
      setIsProcessing(false);
    };
    img.src = sourceUrl;
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && aspectRatio > 0) {
      const newH = Math.round(val / aspectRatio);
      setHeight(newH);
      renderResized(val, newH, imgUrl);
    } else {
      renderResized(val, height, imgUrl);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && aspectRatio > 0) {
      const newW = Math.round(val * aspectRatio);
      setWidth(newW);
      renderResized(newW, val, imgUrl);
    } else {
      renderResized(width, val, imgUrl);
    }
  };

  const applyPreset = (pW: number, pH: number) => {
    setWidth(pW);
    setHeight(pH);
    setLockAspect(false);
    renderResized(pW, pH, imgUrl);
  };

  const handleDownload = () => {
    if (!resizedUrl || !file) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    a.download = `${baseName}_${width}x${height}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    logToolHistory('Image Resizer', '/tools/image-resizer', `Resized image to ${width}x${height}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="Image Resizer"
        description="Resize images to exact pixel dimensions or standard social media resolutions with aspect-ratio locking."
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
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Choose an Image to Resize
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Supports PNG, JPG, GIF, WebP
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
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            
            {/* Dimension inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Width (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={8000}
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-center pb-2">
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    lockAspect
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspect ? 'Locked Aspect Ratio' : 'Free Form'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Height (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={8000}
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Popular Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p.w, p.h)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 transition-colors cursor-pointer font-medium"
                  >
                    {p.label} ({p.w}x{p.h})
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Original: <span className="font-semibold">{origWidth} × {origHeight} px</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setFile(null); setImgUrl(''); setResizedUrl(''); }}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !resizedUrl}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Download Resized ({width}x{height})</span>
                </button>
              </div>
            </div>

          </div>

          {/* Preview Canvas */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Resized Image Preview ({width} × {height})
            </div>
            <div className="min-h-[280px] max-h-[420px] rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 p-2">
              {resizedUrl && (
                <img src={resizedUrl} alt="Resized preview" className="max-h-full max-w-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
