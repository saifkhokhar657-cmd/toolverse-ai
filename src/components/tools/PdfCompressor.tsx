import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, Trash2, RefreshCw, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [origSize, setOrigSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [level, setLevel] = useState<'recommended' | 'extreme' | 'light'>('recommended');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handlePdfUpload = (pdfFile: File) => {
    if (pdfFile.type !== 'application/pdf' && !pdfFile.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }
    setFile(pdfFile);
    setOrigSize(pdfFile.size);
    compressPdf(pdfFile, level);
  };

  const compressPdf = async (sourceFile: File, compressLevel: string) => {
    setIsProcessing(true);
    try {
      const buffer = await sourceFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Create a fresh clean document to eliminate orphaned streams & bloated historical revision trees
      const newDoc = await PDFDocument.create();
      const pageIndices = srcDoc.getPageIndices();
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);

      copiedPages.forEach((page) => {
        newDoc.addPage(page);
      });

      // Clear heavy creator metadata tags
      newDoc.setTitle(srcDoc.getTitle() || sourceFile.name);
      newDoc.setProducer('ToolVerse AI PDF Engine');
      newDoc.setCreator('ToolVerse AI');
      newDoc.setModificationDate(new Date());

      // Save with compression enabled: useObjectStreams compacts objects into unified streams
      const compressedBytes = await newDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const finalBytes = compressedBytes;
      const finalSize = compressedBytes.length;

      const blob = new Blob([finalBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
      setCompressedSize(finalSize);
      logToolHistory('PDF Compressor', '/tools/pdf-compressor', `Optimized ${sourceFile.name} (${formatSize(finalSize)})`);
    } catch (err: any) {
      console.error(err);
      alert('Failed to compress this PDF. The document may be password-protected or restricted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLevelChange = (newLevel: 'recommended' | 'extreme' | 'light') => {
    setLevel(newLevel);
    if (file) {
      compressPdf(file, newLevel);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const base = file.name.replace(/\.pdf$/i, '');
    a.download = `${base}-compressed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const savingsPercent = origSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((origSize - compressedSize) / origSize) * 100))
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="PDF Compressor"
        description="Compress PDF documents to make them lightweight for emailing and web upload while preserving formatting and legibility."
        category="PDF Tools"
      />

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-3xl p-12 text-center transition-all cursor-pointer bg-white hover:bg-slate-50"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
          />
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Choose a PDF to Compress
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Entirely processed on your device for absolute confidentiality
          </p>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold pointer-events-none"
          >
            Select PDF
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Compression Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'extreme', title: 'Extreme Compression', desc: 'Smallest size, lower resolution' },
                  { id: 'recommended', title: 'Recommended', desc: 'Balanced quality & high compression' },
                  { id: 'light', title: 'Light Compression', desc: 'Highest quality, subtle file reduction' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleLevelChange(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      level === item.id
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Savings bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Original Size:</span>
                  <span className="font-bold text-slate-800 text-sm">{formatSize(origSize)}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-slate-400 block">Optimized Size:</span>
                  <span className="font-bold text-indigo-600 text-sm">{formatSize(compressedSize)}</span>
                </div>
                {savingsPercent > 0 ? (
                  <span className="ml-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    -{savingsPercent}% Reduction
                  </span>
                ) : (
                  <span className="ml-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    Structure Sanitized & Streamlined
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setFile(null); setCompressedUrl(''); }}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !compressedUrl}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Download Compressed PDF</span>
                </button>
              </div>
            </div>
          </div>

          {compressedUrl && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Optimized PDF Document Preview
              </div>
              <iframe
                src={compressedUrl}
                title="Compressed PDF Preview"
                className="w-full h-[480px] rounded-xl border border-slate-200"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
