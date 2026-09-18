import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Calculator,
  Type,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  BookOpen,
  CheckCircle2,
  Hash,
  UserCheck,
  RefreshCw,
  FileDown,
  Scissors,
  Layers,
  FileType,
  Percent,
  Calendar,
  DollarSign,
  Activity,
  QrCode,
  AlignLeft,
  ArrowUpRight
} from 'lucide-react';
import { TOOLS_LIST, CATEGORIES } from '../data/tools';
import { ARTICLES_DATA } from '../data/articles';
import { AdContainer } from '../components/layout/AdContainer';
import { ToolItem } from '../types';
import { VisualToolCard } from '../components/tools/VisualToolCard';
import { ArticleVisualPreview } from '../components/common/ArticleVisualPreview';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Dynamic icon mapper for tools
  const renderToolIcon = (iconName: string, category: string) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={`${iconClass} text-indigo-600`} />;
      case 'Hash':
        return <Hash className={`${iconClass} text-indigo-600`} />;
      case 'UserCheck':
        return <UserCheck className={`${iconClass} text-indigo-600`} />;
      case 'RefreshCw':
        return <RefreshCw className={`${iconClass} text-indigo-600`} />;
      case 'Image':
        return <ImageIcon className={`${iconClass} text-cyan-600`} />;
      case 'Maximize2':
        return <ImageIcon className={`${iconClass} text-cyan-600`} />;
      case 'Scissors':
        return <Scissors className={`${iconClass} text-cyan-600`} />;
      case 'Layers':
        return <Layers className={`${iconClass} text-cyan-600`} />;
      case 'FileDown':
        return <FileDown className={`${iconClass} text-amber-600`} />;
      case 'FileType':
        return <FileType className={`${iconClass} text-amber-600`} />;
      case 'FileArchive':
        return <FileText className={`${iconClass} text-amber-600`} />;
      case 'Percent':
        return <Percent className={`${iconClass} text-emerald-600`} />;
      case 'Calendar':
        return <Calendar className={`${iconClass} text-emerald-600`} />;
      case 'DollarSign':
        return <DollarSign className={`${iconClass} text-emerald-600`} />;
      case 'Activity':
        return <Activity className={`${iconClass} text-emerald-600`} />;
      case 'QrCode':
        return <QrCode className={`${iconClass} text-slate-800`} />;
      case 'AlignLeft':
        return <AlignLeft className={`${iconClass} text-slate-800`} />;
      default:
        return category === 'ai' ? (
          <Sparkles className={`${iconClass} text-indigo-600`} />
        ) : (
          <ShieldCheck className={`${iconClass} text-emerald-600`} />
        );
    }
  };

  const filteredTools = useMemo(() => {
    return TOOLS_LIST.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticles = useMemo(() => ARTICLES_DATA.slice(0, 6), []);

  return (
    <div className="min-h-screen bg-slate-50/40">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800 text-[11px] font-black uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>Smart Tools. Simple Solutions.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Everything you need.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Fast, private, and free.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Access 17 high-performance tools: Google Gemini 2.5 Flash AI writing assistants, instant client-side image compressors, PDF converters, and verified financial calculators.
          </p>

          {/* Instant Search Bar */}
          <div className="max-w-xl mx-auto relative mb-6">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 17 production tools (e.g. compress image, jpg to pdf, captions, emi)..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-slate-300 shadow-sm text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-700 font-bold px-2 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Trust Signals Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 mb-8">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Free to Use
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Private In-Browser Processing
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Zero Sign-Up Needed for Base Tools
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              No Server Storage for Files
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-950 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Tools ({TOOLS_LIST.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Top AdSense Leaderboard Slot */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <AdContainer slotId="home-leaderboard-top" format="horizontal" />
      </div>

      {/* Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {selectedCategory === 'all'
                ? 'Production Utility Suite'
                : CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Tools'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {filteredTools.length} real, fully functional tools ready for immediate use
            </p>
          </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs max-w-md mx-auto">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching tools found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              We couldn't find any tool matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-bold cursor-pointer hover:bg-indigo-600 transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <VisualToolCard
                key={tool.id}
                tool={tool}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mid-Page AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4 my-6">
        <AdContainer slotId="home-mid-banner" format="horizontal" />
      </div>

      {/* Value Pillars Section */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Trust & Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Engineered for Speed, Privacy & Precision
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Why professionals, developers, creators, and students rely on ToolVerse AI daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                100% In-Browser Privacy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Image compression, format conversions, and PDF rasterization execute directly inside your browser sandbox. Zero files are uploaded to external databases.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                Server-Side Gemini 2.5 Flash
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                AI text generation is processed securely on backend microservices. Your API credentials and input prompts are never exposed to the client browser.
              </p>
            </div>

            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                No Friction & No Forced Accounts
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Jump right in. Every calculator, PDF tool, and image utility is immediately usable without registration, subscriptions, or credit card requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Educational Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Knowledge Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Featured Guides & Tutorials
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Clear, step-by-step technical articles on digital optimization, file formats, and AI workflows.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/blog')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <span>View All 30 Technical Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => onNavigate(`/blog/${art.slug}`)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <ArticleVisualPreview article={art} size="card" className="mb-4" />

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-indigo-600 uppercase tracking-wider text-[10px] bg-indigo-50/70 px-2 py-0.5 rounded">
                    {art.category}
                  </span>
                  <span className="text-[11px]">{art.readTime}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-normal">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="text-[11px] text-slate-400">{art.date}</span>
                <span className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Guide</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom AdSense slot */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdContainer slotId="home-footer-leaderboard" format="horizontal" />
      </div>

    </div>
  );
};
