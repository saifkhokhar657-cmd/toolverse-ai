import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { ToolVerseLogo } from '../common/ToolVerseLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center text-left focus:outline-hidden cursor-pointer"
            >
              <ToolVerseLogo variant="full" size="md" showTagline={true} />
            </button>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              ToolVerse AI delivers high-performance, private, client-side and intelligent AI utilities for designers, developers, students, and modern digital professionals worldwide.
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% In-Browser Privacy
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" /> Sub-Second Engines
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-4 h-4 text-cyan-400" /> Server-Side Key Security
              </span>
            </div>
          </div>

          {/* Tools Category Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Production Tools
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/ai-tools')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Content Engine (4 Tools)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/image-tools')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Image Studio (4 Tools)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pdf-tools')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  PDF Suite (3 Tools)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/calculators')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Financial & Health Calculators (4)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/tools/qr-code-generator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  QR Code Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/tools/word-counter')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Word & Token Counter
                </button>
              </li>
            </ul>
          </div>

          {/* Knowledge Hub Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Knowledge Hub
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/blog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All 30 Technical Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/how-to-compress-an-image-without-losing-quality')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Image Compression Mastery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/jpg-vs-png-what-is-the-difference')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  JPG vs PNG Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/blog/how-to-convert-pdf-to-jpg')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  PDF Rasterization Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  System Operations Console
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Compliance
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About ToolVerse AI
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Support & Contact
                </button>
              </li>
              <li>
                <button
                  id="footer-link-privacy"
                  onClick={() => onNavigate('/privacy-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-link-terms"
                  onClick={() => onNavigate('/terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  id="footer-link-cookies"
                  onClick={() => onNavigate('/cookie-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  id="footer-link-disclaimer"
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} ToolVerse AI. All rights reserved. <span className="text-slate-400">Smart Tools. Simple Solutions.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Status: <span className="text-emerald-400 font-semibold">100% Operational</span></span>
            <span>Version: 2.0 Enterprise</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
