import React, { useState } from 'react';
import { Menu, X, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../../types';
import { ToolVerseLogo } from '../common/ToolVerseLogo';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserAccount | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  user,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'All Tools', path: '/' },
    { label: 'AI Tools', path: '/ai-tools' },
    { label: 'Image Tools', path: '/image-tools' },
    { label: 'PDF Suite', path: '/pdf-tools' },
    { label: 'Calculators', path: '/calculators' },
    { label: 'Editorial Hub', path: '/blog' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full tv-glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => handleLinkClick('/')}
          className="flex items-center text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg group cursor-pointer"
          aria-label="ToolVerse AI Home"
        >
          <ToolVerseLogo variant="full" size="md" showTagline={false} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <button
                key={link.path}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleLinkClick(link.path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'text-indigo-700 bg-indigo-50 shadow-sm'
                    : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/70'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          {user ? (
            <button
              id="nav-dashboard-btn"
              onClick={() => handleLinkClick('/dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                currentPath === '/dashboard'
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/70'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">{user.name || user.email.split('@')[0]}</span>
              {user.plan === 'pro' && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-indigo-600 text-white uppercase">
                  PRO
                </span>
              )}
            </button>
          ) : (
            <button
              id="nav-signin-btn"
              onClick={() => onOpenAuth('signin')}
              className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button
            id="nav-get-started-btn"
            onClick={() => user ? handleLinkClick('/dashboard') : onOpenAuth('signup')}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-950 hover:bg-indigo-600 px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <span>{user ? 'My Workspace' : 'Get Started Free'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    active
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => handleLinkClick('/dashboard')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 bg-slate-50 cursor-pointer"
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span>Account Dashboard ({user.name || user.email})</span>
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('signin'); }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs text-center hover:bg-slate-50 cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); user ? handleLinkClick('/dashboard') : onOpenAuth('signup'); }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white font-bold text-xs text-center shadow-xs cursor-pointer transition-colors"
            >
              {user ? 'Open Workspace' : 'Get Started Free'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
