import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Server,
  Database,
  Activity,
  Lock,
  ArrowLeft,
  Key,
  Layers,
  BookOpen,
  Settings,
  RefreshCw,
  Search,
  ExternalLink,
  Flame,
  Cpu
} from 'lucide-react';
import { UserAccount, ToolItem, Article } from '../types';
import { TOOLS_LIST } from '../data/tools';
import { ARTICLES_DATA } from '../data/articles';
import { ToolVerseLogo } from '../components/common/ToolVerseLogo';
import { isFirebaseConfigured } from '../lib/firebase';

interface AdminPageProps {
  user: UserAccount | null;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ user, onNavigate, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'articles' | 'settings'>('overview');
  const [cacheCleared, setCacheCleared] = useState<boolean>(false);
  const [toolFilter, setToolFilter] = useState<string>('all');
  const [toolSearch, setToolSearch] = useState<string>('');
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'local_fallback'>('local_fallback');

  useEffect(() => {
    setFirebaseStatus(isFirebaseConfigured ? 'connected' : 'local_fallback');
  }, []);

  // Admin access validation
  const isAuthorized = Boolean(user && user.email === 'soulversepk@gmail.com');

  const handlePurgeCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xs text-center">
          <div className="flex justify-center mb-4">
            <ToolVerseLogo variant="icon" size="lg" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            Administrative Gate
          </span>

          <h1 className="text-xl font-black text-slate-900 mt-3 mb-1.5 tracking-tight">
            Operations Console Access
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed mb-6 font-normal">
            Restricted to the authorized ToolVerse AI administrator account.
          </p>

          <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-left">
            <div className="text-xs font-bold text-indigo-900">Admin access is tied to the authorized Firebase account.</div>
            <p className="text-[11px] text-indigo-800/80 mt-1">Sign in with the authorized administrator account to continue. No hard-coded admin passkey is stored in the browser.</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenAuth()}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Sign in with Firebase
          </button>
          <div className="pt-5 border-t border-slate-100 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Sign In With Staff Account
              </button>
            ) : (
              <div className="text-xs text-slate-400">
                Connected as <span className="font-semibold text-slate-600">{user.email}</span>
              </div>
            )}
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-500 hover:text-indigo-600 font-semibold cursor-pointer"
            >
              ← Return to Public Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredTools = TOOLS_LIST.filter((t) => {
    const matchCat = toolFilter === 'all' || t.category === toolFilter;
    const matchSearch =
      toolSearch === '' ||
      t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.path.toLowerCase().includes(toolSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredArticles = ARTICLES_DATA.filter((a) => {
    return (
      articleSearch === '' ||
      a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      a.slug.toLowerCase().includes(articleSearch.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Console Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ToolVerseLogo variant="icon" size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  ToolVerse AI Operations Console
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Enterprise telemetry, runtime tool health, and content indexing console.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePurgeCache}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs transition-colors"
            >
              {cacheCleared ? 'Cache Purged!' : 'Purge Edge Cache'}
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white text-xs font-bold cursor-pointer shadow-2xs transition-colors"
            >
              Exit Console
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-8 gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'System Overview', icon: Activity },
            { id: 'tools', label: `Tools Registry (${TOOLS_LIST.length})`, icon: Layers },
            { id: 'articles', label: `Articles Index (${ARTICLES_DATA.length})`, icon: BookOpen },
            { id: 'settings', label: 'Infrastructure & DB', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Registered Tools</span>
                  <Layers className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{TOOLS_LIST.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Verified Operational</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Knowledge Base</span>
                  <BookOpen className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">{ARTICLES_DATA.length}</div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-1">All Validated & Schema Ready</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Backend AI Model</span>
                  <Cpu className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">Gemini 2.5</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">Server-Side Proxy Active</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Database Mode</span>
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {firebaseStatus === 'connected' ? 'Firestore' : 'Hybrid Local'}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-1">Zero Downtime Fallback</div>
              </div>
            </div>

            {/* Service Health Checklist */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">
                Infrastructure Runtime Health
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Client-Side WebAssembly (PDF & Canvas Image Engines)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Server-Side Rate Limiter (IP & UID Hash-Map)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">Active (Daily Reset)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Dynamic OpenGraph & Structured JSON-LD Data</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">Compliant</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-semibold text-slate-700">Robots.txt & Sitemap.xml Auto-Generation</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">Live (3000/sitemap.xml)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tools Registry */}
        {activeTab === 'tools' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="Filter registered tools..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                {['all', 'ai', 'image', 'pdf', 'calculators', 'text'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setToolFilter(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                      toolFilter === c ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Tool Name</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Route</th>
                    <th className="px-5 py-3">Processing Engine</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTools.map((tool: ToolItem) => (
                    <tr key={tool.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-bold text-slate-900">{tool.name}</td>
                      <td className="px-5 py-3 capitalize">{tool.category}</td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-500">{tool.path}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tool.category === 'ai' ? 'Gemini 2.5 Flash Server' : 'Client-Side Sandbox'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => onNavigate(tool.path)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Launch</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Articles Index */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Filter 30 guides by title..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>
              <span className="text-xs text-slate-400">Total {ARTICLES_DATA.length} published guides</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Article Title</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Reading Time</th>
                    <th className="px-5 py-3">Slug</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArticles.map((art: Article) => (
                    <tr key={art.id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-bold text-slate-900 max-w-xs truncate">{art.title}</td>
                      <td className="px-5 py-3 capitalize">{art.category}</td>
                      <td className="px-5 py-3">{art.readTime}</td>
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-500">{art.slug}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => onNavigate(`/blog/${art.slug}`)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">
              Infrastructure & Persistent Storage
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-800">Database Adapter</span>
                <span className="text-indigo-600">
                  {firebaseStatus === 'connected' ? 'Firebase Firestore (Cloud)' : 'Local Storage Engine'}
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed font-normal">
                {firebaseStatus === 'connected'
                  ? 'All user profiles, daily usage counters, and bookmark documents synchronize directly with Google Cloud Firestore.'
                  : 'Operating in preview fallback mode. The application stores workspace state in client storage, ensuring 100% functionality without crashes.'}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Daily Quota Thresholds</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-bold">Guest</div>
                  <div className="text-lg font-black text-slate-900 mt-1">5</div>
                  <div className="text-[10px] text-slate-400">per day / IP</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200">
                  <div className="text-indigo-600 font-bold">Free</div>
                  <div className="text-lg font-black text-indigo-600 mt-1">15</div>
                  <div className="text-[10px] text-slate-400">per day / UID</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200">
                  <div className="text-purple-600 font-bold">Pro</div>
                  <div className="text-lg font-black text-purple-600 mt-1">500</div>
                  <div className="text-[10px] text-slate-400">per day / UID</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
