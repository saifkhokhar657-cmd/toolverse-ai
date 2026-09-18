import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/layout/AuthModal';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { LegalPages } from './pages/LegalPages';

// Tool Components
import { AiCaptionGenerator } from './components/tools/AiCaptionGenerator';
import { AiHashtagGenerator } from './components/tools/AiHashtagGenerator';
import { AiBioGenerator } from './components/tools/AiBioGenerator';
import { AiTextRewriter } from './components/tools/AiTextRewriter';
import { ImageCompressor } from './components/tools/ImageCompressor';
import { ImageResizer } from './components/tools/ImageResizer';
import { BackgroundRemover } from './components/tools/BackgroundRemover';
import { ImageConverter } from './components/tools/ImageConverter';
import { JpgToPdf } from './components/tools/JpgToPdf';
import { PdfToJpg } from './components/tools/PdfToJpg';
import { PdfCompressor } from './components/tools/PdfCompressor';
import { PercentageCalculator } from './components/tools/PercentageCalculator';
import { AgeCalculator } from './components/tools/AgeCalculator';
import { EmiCalculator } from './components/tools/EmiCalculator';
import { BmiCalculator } from './components/tools/BmiCalculator';
import { QrCodeGenerator } from './components/tools/QrCodeGenerator';
import { WordCounter } from './components/tools/WordCounter';

import { UserAccount, UserUsage } from './types';
import { getStoredUser, getUserUsage, saveStoredUser } from './utils/storage';
import { updatePageSeo } from './utils/seo';
import { subscribeToAuthState } from './lib/firebase';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [user, setUser] = useState<UserAccount | null>(() => getStoredUser());
  const [usage, setUsage] = useState<UserUsage>(() => getUserUsage());
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Sync Firebase authentication state
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((authUser) => {
      if (authUser) {
        const mappedUser: UserAccount = {
          id: authUser.uid,
          email: authUser.email,
          name: authUser.displayName,
          plan: authUser.plan,
          createdAt: authUser.createdAt,
          photoURL: authUser.photoURL,
        };
        setUser(mappedUser);
        saveStoredUser(mappedUser);
      } else {
        // If not authenticated in Firebase and was using a cloud session, clear
        const local = getStoredUser();
        if (local && !local.id.startsWith('guest_') && !local.id.startsWith('email_user_')) {
          // Keep local fallback or synchronize null
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync state on popstate navigation
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setUsage(getUserUsage());
  }, [currentPath]);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  };

  const handleLoginSuccess = (newUser: UserAccount) => {
    setUser(newUser);
    saveStoredUser(newUser);
    setUsage(getUserUsage());
  };

  // Route Dispatcher
  const renderView = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      updatePageSeo({
        title: 'ToolVerse AI — Smart Tools. Simple Solutions.',
        description: 'Free online AI writing, image compression, PDF conversion, calculators, and text utilities. Fast, client-side private, and 100% functional.',
        canonicalUrl: window.location.origin,
      });
      return <HomePage onNavigate={navigate} />;
    }

    // 2. Categories
    if (['/ai-tools', '/image-tools', '/pdf-tools', '/calculators', '/text-tools'].includes(currentPath)) {
      const slug = currentPath.replace('/', '');
      return <CategoryPage categorySlug={slug} onNavigate={navigate} />;
    }

    // 3. AI Tools
    if (currentPath === '/tools/ai-caption-generator') {
      return <AiCaptionGenerator usage={usage} onUsageUpdate={setUsage} onOpenAuth={() => setIsAuthOpen(true)} />;
    }
    if (currentPath === '/tools/ai-hashtag-generator') {
      return <AiHashtagGenerator usage={usage} onUsageUpdate={setUsage} onOpenAuth={() => setIsAuthOpen(true)} />;
    }
    if (currentPath === '/tools/ai-bio-generator') {
      return <AiBioGenerator usage={usage} onUsageUpdate={setUsage} onOpenAuth={() => setIsAuthOpen(true)} />;
    }
    if (currentPath === '/tools/ai-text-rewriter') {
      return <AiTextRewriter usage={usage} onUsageUpdate={setUsage} onOpenAuth={() => setIsAuthOpen(true)} />;
    }

    // 4. Image Tools
    if (currentPath === '/tools/image-compressor') {
      return <ImageCompressor />;
    }
    if (currentPath === '/tools/image-resizer') {
      return <ImageResizer />;
    }
    if (currentPath === '/tools/background-remover') {
      return <BackgroundRemover />;
    }
    if (currentPath === '/tools/image-converter') {
      return <ImageConverter />;
    }

    // 5. PDF Tools
    if (currentPath === '/tools/jpg-to-pdf') {
      return <JpgToPdf />;
    }
    if (currentPath === '/tools/pdf-to-jpg') {
      return <PdfToJpg />;
    }
    if (currentPath === '/tools/pdf-compressor') {
      return <PdfCompressor />;
    }

    // 6. Calculators
    if (currentPath === '/tools/percentage-calculator') {
      return <PercentageCalculator />;
    }
    if (currentPath === '/tools/age-calculator') {
      return <AgeCalculator />;
    }
    if (currentPath === '/tools/emi-calculator') {
      return <EmiCalculator />;
    }
    if (currentPath === '/tools/bmi-calculator') {
      return <BmiCalculator />;
    }

    // 7. Text & Utilities
    if (currentPath === '/tools/qr-code-generator') {
      return <QrCodeGenerator />;
    }
    if (currentPath === '/tools/word-counter') {
      return <WordCounter />;
    }

    // 8. Blog Index & Detail
    if (currentPath === '/blog') {
      return <BlogIndexPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <ArticleDetailPage slug={slug} onNavigate={navigate} />;
    }

    // 9. Dashboard & Admin
    if (currentPath === '/dashboard') {
      return (
        <DashboardPage
          user={user}
          usage={usage}
          onNavigate={navigate}
          onOpenAuth={() => setIsAuthOpen(true)}
          onUserUpdate={setUser}
          onUsageUpdate={setUsage}
        />
      );
    }
    if (currentPath === '/admin') {
      return (
        <AdminPage
          user={user}
          onNavigate={navigate}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      );
    }

    // 10. Legal & Support Pages
    const legalMap: Record<string, 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'disclaimer'> = {
      '/about': 'about',
      '/contact': 'contact',
      '/privacy': 'privacy',
      '/privacy-policy': 'privacy',
      '/terms': 'terms',
      '/terms-of-service': 'terms',
      '/cookies': 'cookies',
      '/cookie-policy': 'cookies',
      '/disclaimer': 'disclaimer',
    };

    if (legalMap[currentPath]) {
      return <LegalPages pageType={legalMap[currentPath]} onNavigate={navigate} />;
    }

    // 404 Not Found Fallback
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-black text-slate-300 mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The tool or page you're looking for might have been relocated.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          Return to ToolVerse AI Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
