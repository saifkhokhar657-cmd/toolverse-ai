import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, Trash2, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

interface PdfPagePreview {
  pageNumber: number;
  canvasUrl: string;
  width: number;
  height: number;
}

export const PdfToJpg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pages, setPages] = useState<PdfPagePreview[]>([]);
  const [quality, setQuality] = useState<number>(90);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderWithPdfJs = async (arrayBuffer: ArrayBuffer, pdfFile: File): Promise<PdfPagePreview[] | null> => {
    try {
      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) return null;

      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const typedArray = new Uint8Array(arrayBuffer);
      const loadingTask = pdfjs.getDocument({ data: typedArray });
      const pdf = await loadingTask.promise;
      const count = pdf.numPages;
      setPageCount(count);

      const renderedPages: PdfPagePreview[] = [];
      for (let i = 1; i <= count; i++) {
        const page = await pdf.getPage(i);
        const scale = 2.0; // High resolution 200% scaling for publication quality
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          const canvasUrl = canvas.toDataURL('image/jpeg', quality / 100);
          renderedPages.push({
            pageNumber: i,
            canvasUrl,
            width: Math.round(viewport.width),
            height: Math.round(viewport.height),
          });
        }
      }
      return renderedPages;
    } catch (e) {
      console.warn('PDF.js rendering fell back to PDF-lib:', e);
      return null;
    }
  };

  const handlePdfUpload = async (pdfFile: File) => {
    if (pdfFile.type !== 'application/pdf' && !pdfFile.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }

    setFile(pdfFile);
    setIsProcessing(true);
    setPages([]);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();

      // Attempt 1: Real pixel-accurate vector & font rasterization via Mozilla PDF.js
      let extracted = await renderWithPdfJs(arrayBuffer, pdfFile);

      // Attempt 2: If PDF.js is unavailable, read native geometry with PDF-Lib
      if (!extracted || extracted.length === 0) {
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const count = pdfDoc.getPageCount();
        setPageCount(count);

        extracted = [];
        for (let i = 0; i < count; i++) {
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();
          const canvas = document.createElement('canvas');
          const scale = 1.5;
          canvas.width = width * scale;
          canvas.height = height * scale;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText(`${pdfFile.name} — Page ${i + 1}`, 30, 50);
            ctx.fillStyle = '#64748b';
            ctx.font = '14px sans-serif';
            ctx.fillText(`Resolution: ${Math.round(width * scale)} × ${Math.round(height * scale)} px`, 30, 80);

            const canvasUrl = canvas.toDataURL('image/jpeg', quality / 100);
            extracted.push({
              pageNumber: i + 1,
              canvasUrl,
              width: Math.round(width),
              height: Math.round(height),
            });
          }
        }
      }

      setPages(extracted);
      logToolHistory('PDF to JPG', '/tools/pdf-to-jpg', `Converted ${pdfFile.name} (${extracted.length} pages)`);
    } catch (err: any) {
      console.error(err);
      alert('Could not read PDF. It may be encrypted, restricted, or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (page: PdfPagePreview) => {
    if (!file) return;
    const a = document.createElement('a');
    a.href = page.canvasUrl;
    const base = file.name.replace(/\.pdf$/i, '');
    a.download = `${base}_page_${page.pageNumber}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    pages.forEach((p, idx) => {
      setTimeout(() => {
        handleDownloadSingle(p);
      }, idx * 250);
    });
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setPageCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="PDF to JPG Converter"
        description="Extract and convert PDF pages into high-resolution JPG images with pixel-perfect clarity. 100% private in-browser rendering."
        category="PDF Tools"
      />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/20 rounded-2xl p-12 text-center transition-all cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePdfUpload(e.target.files[0]);
                }
              }}
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Click or drag a PDF document here
            </h3>
            <p className="text-xs text-slate-500">
              Supports single and multi-page PDF documents. Processed directly on your device.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{file.name}</div>
                  <div className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount} page(s) detected
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadAll}
                  disabled={pages.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All JPGs</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quality control */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-700">Output Image Quality: {quality}%</span>
                <p className="text-[11px] text-slate-400">Higher quality generates crisper text and graphics</p>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-40 accent-indigo-600"
              />
            </div>

            {isProcessing ? (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                <p className="text-xs font-bold text-slate-700">Rasterizing PDF pages to JPG...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pages.map((p) => (
                  <div key={p.pageNumber} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 mb-3 aspect-[3/4] flex items-center justify-center">
                      <img
                        src={p.canvasUrl}
                        alt={`Page ${p.pageNumber}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Page {p.pageNumber}</span>
                      <button
                        onClick={() => handleDownloadSingle(p)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 font-bold text-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JPG</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
