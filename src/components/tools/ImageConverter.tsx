import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Trash2, ArrowRight } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

interface ConvertedFile {
  id: string;
  name: string;
  originalSize: number;
  newSize: number;
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  url: string;
}

export const ImageConverter: React.FC = () => {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFilesSelect = (fileList: FileList | File[]) => {
    setIsProcessing(true);
    const incoming = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (incoming.length === 0) {
      setIsProcessing(false);
      return;
    }

    let completed = 0;
    const newConverted: ConvertedFile[] = [];

    incoming.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            if (targetFormat === 'image/jpeg') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const ext = targetFormat === 'image/png' ? '.png' : targetFormat === 'image/webp' ? '.webp' : '.jpg';
                  const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                  newConverted.push({
                    id: `conv_${Date.now()}_${Math.random()}`,
                    name: `${baseName}${ext}`,
                    originalSize: file.size,
                    newSize: blob.size,
                    targetFormat,
                    url,
                  });
                }
                completed += 1;
                if (completed === incoming.length) {
                  setFiles(prev => [...prev, ...newConverted]);
                  setIsProcessing(false);
                  logToolHistory('Image Converter', '/tools/image-converter', `Converted ${incoming.length} image(s)`);
                }
              },
              targetFormat,
              0.92
            );
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (item: ConvertedFile) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    files.forEach(f => handleDownload(f));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="Image Converter"
        description="Convert photos between JPG, PNG, and WebP instantly without uploading them to external cloud servers."
        category="Image Tools"
      />

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Target Output Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Convert to PNG', val: 'image/png', desc: 'Lossless with transparency' },
              { label: 'Convert to JPG', val: 'image/jpeg', desc: 'Universal compatibility' },
              { label: 'Convert to WebP', val: 'image/webp', desc: 'Modern small web format' },
            ].map((fmt) => (
              <button
                key={fmt.val}
                type="button"
                onClick={() => setTargetFormat(fmt.val as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  targetFormat === fmt.val
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-800">{fmt.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{fmt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center transition-all cursor-pointer bg-slate-50 hover:bg-slate-100/70 mt-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFilesSelect(e.target.files)}
          />
          <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">
            Select or drag images to convert
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            JPG, PNG, WebP supported • Multi-file batch selection
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Converted Files ({files.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFiles([])}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Download All ({files.length})
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {files.map((file) => (
              <div key={file.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-1">{file.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {formatFileSize(file.originalSize)} <ArrowRight className="inline w-3 h-3 mx-1" /> {formatFileSize(file.newSize)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(file)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
