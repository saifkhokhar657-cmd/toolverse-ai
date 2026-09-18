import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Trash2, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(75);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setOriginalFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    compressImage(file, quality, format);
  };

  const compressImage = (file: File, q: number, mimeType: string) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw background white for transparent png to jpg conversion
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              const compressedObjUrl = URL.createObjectURL(blob);
              setCompressedUrl(compressedObjUrl);
              setIsProcessing(false);
              logToolHistory('Image Compressor', '/tools/image-compressor', `Compressed ${file.name}`);
            }
          },
          mimeType,
          q / 100
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (originalFile) {
      compressImage(originalFile, newQuality, format);
    }
  };

  const handleFormatChange = (newFormat: 'image/jpeg' | 'image/webp') => {
    setFormat(newFormat);
    if (originalFile) {
      compressImage(originalFile, quality, newFormat);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !originalFile) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const ext = format === 'image/webp' ? '.webp' : '.jpg';
    const baseName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || originalFile.name;
    a.download = `${baseName}-compressed${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="Image Compressor"
        description="Reduce image file sizes by up to 80% without noticeable visual quality loss. Entirely client-side and 100% private."
        category="Image Tools"
      />

      {!originalFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer bg-white ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50 scale-102'
              : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Drag and drop your image here
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Supports JPG, PNG, WebP up to 25MB
          </p>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-xs hover:bg-indigo-700 transition-colors pointer-events-none"
          >
            Browse Image
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Compression Quality: <span className="text-indigo-600 font-extrabold">{quality}%</span>
                  </label>
                  <span className="text-xs text-slate-400">
                    {quality > 80 ? 'High Fidelity' : quality > 50 ? 'Recommended' : 'Maximum Savings'}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Output Format
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFormatChange('image/jpeg')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      format === 'image/jpeg'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    JPG (Universal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatChange('image/webp')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      format === 'image/webp'
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    WebP (Next-Gen)
                  </button>
                </div>
              </div>
            </div>

            {/* Savings stats */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Original:</span>
                  <span className="font-bold text-slate-800 text-sm">{formatFileSize(originalSize)}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block">Compressed:</span>
                  <span className="font-bold text-indigo-600 text-sm">{formatFileSize(compressedSize)}</span>
                </div>
                {savingsPercent > 0 && (
                  <span className="ml-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    -{savingsPercent}% Saved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Upload Another Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !compressedUrl}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Download Compressed</span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Original Preview ({formatFileSize(originalSize)})
              </div>
              <div className="h-64 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                Compressed Result ({formatFileSize(compressedSize)})
              </div>
              <div className="h-64 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 relative">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                    <span className="text-xs">Optimizing Image...</span>
                  </div>
                ) : (
                  <img src={compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
