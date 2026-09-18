import React, { useState } from 'react';
import { X, Mail, Lock, CheckCircle2, User, ArrowRight, KeyRound } from 'lucide-react';
import { UserAccount } from '../../types';
import { saveStoredUser } from '../../utils/storage';
import { ToolVerseLogo } from '../common/ToolVerseLogo';
import { loginWithGoogle, loginWithEmail, registerWithEmail, sendPasswordReset } from '../../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleAuthSuccess = (u: any) => {
    const formattedUser: UserAccount = {
      id: u.uid,
      email: u.email,
      name: u.displayName || u.email.split('@')[0],
      plan: u.plan || 'free',
      createdAt: u.createdAt || new Date().toISOString(),
      photoURL: u.photoURL,
    };
    saveStoredUser(formattedUser);
    onSuccess(formattedUser);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot') {
      if (!email || !email.includes('@')) {
        setError('Please provide a valid email address.');
        return;
      }
      setLoading(true);
      try {
        await sendPasswordReset(email.trim());
        setResetSent(true);
      } catch (err: any) {
        setError(err.message || 'Failed to send password recovery email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const u = await registerWithEmail(email, password, name);
        handleAuthSuccess(u);
      } else {
        const u = await loginWithEmail(email, password);
        handleAuthSuccess(u);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const u = await loginWithGoogle();
      handleAuthSuccess(u);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <ToolVerseLogo variant="icon" size="lg" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {mode === 'signin' && 'Sign in to ToolVerse AI'}
            {mode === 'signup' && 'Create Your Free Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {mode === 'signin' && 'Access saved tool history, cloud bookmarks, and daily AI quotas.'}
            {mode === 'signup' && 'Instant access to all 17 high-performance tools with cloud synchronization.'}
            {mode === 'forgot' && 'Enter your verified account email to receive recovery instructions.'}
          </p>
        </div>

        {/* Non-intrusive value callout */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-5 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span><strong>15 AI generations daily</strong> (guests receive 5)</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Cloud bookmarks & saved export histories</span>
          </div>
        </div>

        {mode !== 'forgot' && (
          <>
            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 transition-colors shadow-2xs cursor-pointer mb-4 active:scale-98"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">Or continue with email</span>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
            Password recovery email dispatched. Please check your inbox and follow the link.
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); }}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer mt-3 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === 'signin' ? (
              <><span>Sign In</span> <ArrowRight className="w-3.5 h-3.5" /></>
            ) : mode === 'signup' ? (
              <><span>Create Free Account</span> <ArrowRight className="w-3.5 h-3.5" /></>
            ) : (
              <><span>Send Recovery Email</span> <KeyRound className="w-3.5 h-3.5" /></>
            )}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="text-center mt-5 text-xs text-slate-500">
          {mode === 'signin' && (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Sign up free
              </button>
            </span>
          )}

          {mode === 'signup' && (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}

          {mode === 'forgot' && (
            <span>
              Remembered your credentials?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Return to sign in
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
