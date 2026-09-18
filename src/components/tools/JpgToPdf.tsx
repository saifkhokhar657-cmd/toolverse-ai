import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, Trash2, ArrowUp, ArrowDown, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

export const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfSize, setPdfSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFiles = (files: FileList | File[]) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    const newItems: ImageItem[] = valid.map(file => ({
      id: `img_${Date.now()}_${Math.random()}`,
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newItems]);
    setPdfUrl('');
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const updated = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setImages(updated);
    setPdfUrl('');
  };

  const removeItem = (id: string) => {
    setImages(prev => prev.filter(it => it.id !== id));
    setPdfUrl('');
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // Default to JPG embedding
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        // Standard A4 dimensions in points (72 points = 1 inch)
        let pageWidth = 595.28;
        let pageHeight = 841.89;

        if (orientation === 'landscape') {
          pageWidth = 841.89;
          pageHeight = 595.28;
        }

        const availableWidth = pageWidth - margin * 2;
        const availableHeight = pageHeight - margin * 2;

        const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, {
          x,
          y,
          width: finalWidth,
          height: finalHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfSize(blob.size);
      logToolHistory('JPG to PDF', '/tools/jpg-to-pdf', `Created PDF from ${images.length} images`);
    } catch (err: any) {
      console.error(err);
      alert('Error creating PDF document. Please ensure all uploaded files are valid images.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `ToolVerse-converted-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="JPG to PDF Converter"
        description="Convert single or multiple JPG and PNG images into a clean, professional PDF document in seconds with custom margins and orientation."
        category="PDF Tools"
      />

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8 space-y-5">
        
        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-8 text-center transition-all cursor-pointer bg-slate-50 hover:bg-slate-100/70"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => e.target.files && handleSelectFiles(e.target.files)}
          />
          <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">
            Upload Images to Combine into PDF
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supports multiple JPG and PNG files • Reorder or rotate pages easily
          </p>
        </div>

        {/* Options */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Page Orientation
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setOrientation('portrait'); setPdfUrl(''); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    orientation === 'portrait'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Portrait (A4)
                </button>
                <button
                  type="button"
                  onClick={() => { setOrientation('landscape'); setPdfUrl(''); }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    orientation === 'landscape'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Landscape (A4)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Page Margin: {margin}px
              </label>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={margin}
                onChange={(e) => { setMargin(Number(e.target.value)); setPdfUrl(''); }}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>
        )}

      </div>

      {/* Uploaded Images List / Ordering */}
      {images.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Pages Order ({images.length} pages)
            </h3>
            <button
              onClick={() => { setImages([]); setPdfUrl(''); }}
              className="text-xs text-slate-500 hover:text-rose-600 cursor-pointer"
            >
              Remove All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {images.map((item, idx) => (
              <div
                key={item.id}
                className="relative group border border-slate-200 rounded-xl p-2 bg-slate-50 flex flex-col items-center"
              >
                <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {idx + 1}
                </span>

                <div className="w-full h-24 rounded-lg overflow-hidden bg-white mb-2 flex items-center justify-center">
                  <img src={item.previewUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>

                <div className="text-[10px] text-slate-600 truncate w-full text-center mb-1">
                  {item.name}
                </div>

                <div className="flex items-center gap-1 w-full justify-center">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move earlier"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === images.length - 1}
                    className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move later"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 rounded bg-white hover:bg-rose-50 text-rose-600 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action trigger */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Each image will be rendered on its own dedicated A4 page.
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={generatePdf}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>{pdfUrl ? 'Rebuild PDF' : 'Convert to PDF Now'}</span>
              </button>

              {pdfUrl && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF ({(pdfSize / 1024).toFixed(1)} KB)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {pdfUrl && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Generated PDF Preview
          </div>
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="w-full h-[500px] rounded-xl border border-slate-200"
          />
        </div>
      )}
    </div>
  );
};
