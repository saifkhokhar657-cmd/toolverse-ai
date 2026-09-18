import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode as QrIcon, Download, Copy, Check, Sparkles, Wifi, Link2, Type, Mail } from 'lucide-react';
import { ToolHeader } from './ToolHeader';
import { logToolHistory } from '../../utils/storage';

export const QrCodeGenerator: React.FC = () => {
  const [type, setType] = useState<'url' | 'text' | 'wifi' | 'email'>('url');
  
  // Specific data inputs
  const [url, setUrl] = useState<string>('https://toolverse.soulverseapps.com');
  const [text, setText] = useState<string>('');
  const [emailTo, setEmailTo] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPass, setWifiPass] = useState<string>('');
  const [wifiSecurity, setWifiSecurity] = useState<string>('WPA');

  // Custom styling
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [size, setSize] = useState<number>(320);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute final QR content string
  const getPayload = (): string => {
    switch (type) {
      case 'url':
        return url.startsWith('http') ? url : `https://${url}`;
      case 'text':
        return text || 'ToolVerse AI';
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPass};;`;
      default:
        return 'ToolVerse AI';
    }
  };

  useEffect(() => {
    const payload = getPayload();
    if (canvasRef.current && payload) {
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorCorrection,
        },
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  }, [type, url, text, emailTo, emailSubject, wifiSsid, wifiPass, wifiSecurity, fgColor, bgColor, size, errorCorrection]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    logToolHistory('QR Code Generator', '/tools/qr-code-generator', `Generated ${type} QR Code`);
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (blob && navigator.clipboard) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          alert('Copying image directly to clipboard is not supported in this browser. Please use Download.');
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToolHeader
        title="QR Code Generator"
        description="Create customized, scan-ready QR codes for websites, plain text, Wi-Fi networks, and contact emails with custom brand colors."
        category="Text & Utilities"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Configuration (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          
          {/* QR Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              QR Code Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'url', label: 'Website URL', icon: Link2 },
                { id: 'text', label: 'Plain Text', icon: Type },
                { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
                { id: 'email', label: 'Email', icon: Mail },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setType(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      type === item.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Inputs according to type */}
          {type === 'url' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}

          {type === 'text' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Text Content to Encode
              </label>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter notes, promo codes, or serial numbers..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}

          {type === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="MyHomeWifi"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Network password"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {type === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Inquiry from ToolVerse AI"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* Color pickers */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                QR Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Error correction */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Error Correction Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'L', label: '7% (Low)' },
                { id: 'M', label: '15% (Med)' },
                { id: 'Q', label: '25% (High)' },
                { id: 'H', label: '30% (Best)' },
              ].map((ec) => (
                <button
                  key={ec.id}
                  type="button"
                  onClick={() => setErrorCorrection(ec.id as any)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    errorCorrection === ec.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ec.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Live QR Output View (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col items-center justify-between space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Live QR Preview
            </span>
            <p className="text-xs text-slate-500">Scan with any smartphone camera</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-sm" />
          </div>

          <div className="w-full flex items-center gap-2">
            <button
              onClick={handleCopyImage}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Image' : 'Copy Image'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
