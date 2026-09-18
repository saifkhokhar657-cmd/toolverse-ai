import React, { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  Bookmark,
  History,
  Trash2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  LogOut,
  Settings,
  CreditCard,
  Layers,
  FileCheck,
  Calculator,
  ShieldAlert,
  Save,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { UserAccount, UserUsage, SavedItem } from '../types';
import {
  getSavedItems,
  removeSavedItem,
  getHistory,
  HistoryEntry,
  saveStoredUser,
  saveUserUsage
} from '../utils/storage';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import {
  logoutUser,
  getUserProfile,
  updateUserProfileDoc,
  fetchUserBookmarks,
  fetchUserSubscription,
  getDailyUsage
} from '../lib/firebase';

interface DashboardPageProps {
  user: UserAccount | null;
  usage: UserUsage;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  onUserUpdate: (user: UserAccount | null) => void;
  onUsageUpdate?: (usage: UserUsage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  usage,
  onNavigate,
  onOpenAuth,
  onUserUpdate,
  onUsageUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'history' | 'plans' | 'settings'>('overview');
  const [savedList, setSavedList] = useState<SavedItem[]>([]);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Settings form state
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    // Load local history and bookmarks
    const localSaved = getSavedItems();
    setSavedList(localSaved);
    setHistoryList(getHistory());
    if (user?.name) {
      setDisplayName(user.name);
    }

    // If authenticated, sync cloud bookmarks and quota
    if (user?.id) {
      fetchUserBookmarks(user.id).then((cloudBookmarks) => {
        if (cloudBookmarks && cloudBookmarks.length > 0) {
          const mapped: SavedItem[] = cloudBookmarks.map((cb) => ({
            id: cb.id,
            toolName: cb.category || cb.itemType,
            toolPath: cb.path,
            preview: cb.title,
            data: { title: cb.title, path: cb.path },
            createdAt: cb.createdAt,
          }));
          // Merge without duplicates
          setSavedList((prev) => {
            const combined = [...mapped];
            prev.forEach((p) => {
              if (!combined.some((c) => c.id === p.id || c.preview === p.preview)) {
                combined.push(p);
              }
            });
            return combined;
          });
        }
      }).catch((e) => console.warn('Could not sync cloud bookmarks:', e));

      // Refresh daily usage from Firestore
      getDailyUsage(user.id).then((daily) => {
        if (daily && onUsageUpdate) {
          onUsageUpdate({
            ...usage,
            dailyGenerationsUsed: Math.max(usage.dailyGenerationsUsed, daily.generationsUsed),
            dailyGenerationsLimit: daily.generationsLimit || usage.dailyGenerationsLimit,
          });
        }
      }).catch(() => {});
    }
  }, [user]);

  const handleDeleteSaved = (id: string) => {
    removeSavedItem(id);
    setSavedList(getSavedItems());
  };

  const handleCopySaved = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Firebase logout failed, clearing local session', e);
    }
    saveStoredUser(null);
    onUserUpdate(null);
    onNavigate('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingSettings(true);
    setSettingsSuccess(false);

    const updatedUser: UserAccount = {
      ...user,
      name: displayName.trim() || user.email.split('@')[0],
    };

    try {
      if (user.id) {
        await updateUserProfileDoc(user.id, {
          displayName: updatedUser.name,
        });
      }
    } catch (err) {
      console.warn('Could not sync profile to Firestore, saved locally', err);
    }

    saveStoredUser(updatedUser);
    onUserUpdate(updatedUser);
    setSavingSettings(false);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const handleUpgradePlan = (targetPlan: 'free' | 'pro') => {
    if (!user) {
      onOpenAuth();
      return;
    }
    const updatedUser: UserAccount = {
      ...user,
      plan: targetPlan,
    };
    const updatedUsage: UserUsage = {
      ...usage,
      plan: targetPlan,
      dailyGenerationsLimit: targetPlan === 'pro' ? 500 : 15,
    };

    saveStoredUser(updatedUser);
    saveUserUsage(updatedUsage);
    onUserUpdate(updatedUser);
    if (onUsageUpdate) {
      onUsageUpdate(updatedUsage);
    }
    setActiveTab('overview');
  };

  const used = usage.dailyGenerationsUsed;
  const limit = usage.dailyGenerationsLimit;
  const percentUsed = Math.min(100, Math.round((used / limit) * 100));

  // Compute stats from local activity
  const aiGensCount = historyList.filter((h) => h.toolName.toLowerCase().includes('ai')).length;
  const imageCount = historyList.filter((h) => h.toolName.toLowerCase().includes('image')).length;
  const pdfCount = historyList.filter((h) => h.toolName.toLowerCase().includes('pdf')).length;
  const calcCount = historyList.filter((h) => h.toolName.toLowerCase().includes('calculator') || h.toolName.toLowerCase().includes('bmi') || h.toolName.toLowerCase().includes('emi')).length;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'User Dashboard & Workspace' },
            ]}
            onNavigate={onNavigate}
          />
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-black text-xl shadow-xs">
              {user ? (user.name || user.email).charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user ? (user.name || user.email) : 'Guest Workspace'}
                </h1>
                <span
                  className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border ${
                    user?.plan === 'pro'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : user
                      ? 'bg-slate-100 text-slate-800 border-slate-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {user?.plan === 'pro' ? 'Pro Member' : user ? 'Free Account' : 'Guest Tier'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                {user
                  ? `Signed in as ${user.email} • ID: ${user.id.slice(0, 10)}...`
                  : 'Operating in guest mode. Sign in to sync bookmarks to cloud and unlock 15 daily requests.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8 gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Quota', icon: Zap },
            { id: 'saved', label: `Saved Items (${savedList.length})`, icon: Bookmark },
            { id: 'history', label: `Activity (${historyList.length})`, icon: History },
            { id: 'plans', label: 'Plans & Upgrade', icon: CreditCard },
            { id: 'settings', label: 'Account Settings', icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === t.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Daily Usage Quota Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Daily AI Generation Quota
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-normal">
                    Server-side rate limiter resets every 24 hours (Universal Time)
                  </p>
                </div>

                <span className="text-sm font-black text-indigo-600">
                  {used} / {limit} Requests Consumed
                </span>
              </div>

              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2.5">
                <div
                  style={{ width: `${percentUsed}%` }}
                  className={`h-full transition-all ${
                    percentUsed >= 90 ? 'bg-rose-500' : percentUsed >= 60 ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>{Math.max(0, limit - used)} generations remaining today</span>
                <span>{percentUsed}% capacity utilized</span>
              </div>
            </div>

            {/* Lifetime Metrics Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Operations</div>
                <div className="text-2xl font-black text-indigo-600 mt-1">{aiGensCount || used}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Captions, hashtags, bios</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Images Processed</div>
                <div className="text-2xl font-black text-cyan-600 mt-1">{imageCount}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Compressed & converted</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PDF Operations</div>
                <div className="text-2xl font-black text-amber-600 mt-1">{pdfCount}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Converted & compressed</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Calculations</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">{calcCount}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">EMI, BMI, percentages</div>
              </div>
            </div>

            {/* Quick Actions / Jump */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">
                Quick Shortcuts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => onNavigate('/tools/ai-caption-generator')}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 text-left transition-all group cursor-pointer"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-600">AI Caption Generator</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Social media posts</div>
                </button>
                <button
                  onClick={() => onNavigate('/tools/image-compressor')}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/40 text-left transition-all group cursor-pointer"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-cyan-600">Image Compressor</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Lossy & lossless tuning</div>
                </button>
                <button
                  onClick={() => onNavigate('/tools/jpg-to-pdf')}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 text-left transition-all group cursor-pointer"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-amber-600">JPG to PDF Converter</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Multi-image document stitch</div>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Saved Items */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {savedList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No saved items bookmarked yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-normal">
                  Click the "Save" icon on any generated caption, hashtag set, bio, or rewritten text to pin it to your workspace.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {item.toolName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 line-clamp-3 leading-relaxed mb-4 font-normal">
                        {item.preview}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleCopySaved(item.preview, item.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy Content'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSaved(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Activity History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden divide-y divide-slate-100">
            {historyList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No tool activity recorded in this session yet. Launch any tool to populate recent activity.
              </div>
            ) : (
              historyList.map((hist) => (
                <div key={hist.id} className="p-4 sm:px-6 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{hist.toolName}</div>
                    <div className="text-[11px] text-slate-500">{hist.action}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Plans & Pricing */}
        {activeTab === 'plans' && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Membership Plans & Capabilities
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Transparent quotas designed for independent creators, high-volume developers, and digital teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Guest Tier */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">Guest Tier</div>
                  <div className="text-2xl font-black text-slate-900 mt-2">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
                  <p className="text-xs text-slate-500 mt-2">Instant access without creating an account.</p>

                  <ul className="mt-6 space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>5 Daily AI requests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>All 17 Tools functional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>In-browser local processing</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400">Default for non-signed-in users</span>
                </div>
              </div>

              {/* Free Registered Tier */}
              <div className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-2xs ${
                user?.plan === 'free' ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600">Free Account</span>
                    {user?.plan === 'free' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded">Current Plan</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">$0 <span className="text-xs font-normal text-slate-400">/ free</span></div>
                  <p className="text-xs text-slate-500 mt-2">Standard tier with cloud workspace persistence.</p>

                  <ul className="mt-6 space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span><strong>15 Daily AI requests</strong> (3x guest)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Saved favorites & cloud bookmarks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Cross-device synchronization</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  {user?.plan === 'free' ? (
                    <button disabled className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                      Active Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgradePlan('free')}
                      className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                    >
                      Select Free Tier
                    </button>
                  )}
                </div>
              </div>

              {/* Pro Member Tier */}
              <div className={`bg-slate-950 text-white rounded-3xl border p-6 flex flex-col justify-between shadow-xl ${
                user?.plan === 'pro' ? 'border-indigo-400 ring-2 ring-indigo-400/40' : 'border-slate-800'
              }`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Pro Member</span>
                    {user?.plan === 'pro' && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-indigo-500 text-white rounded">Active Pro</span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-white mt-2">$9 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                  <p className="text-xs text-slate-300 mt-2">Maximum throughput for power users and agencies.</p>

                  <ul className="mt-6 space-y-2 text-xs text-slate-200 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span><strong>500 Daily AI generations</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Zero advertisements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Priority backend compute lane</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>Unlimited batch image compression</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800">
                  {user?.plan === 'pro' ? (
                    <button
                      onClick={() => handleUpgradePlan('free')}
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold cursor-pointer"
                    >
                      Downgrade to Free
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgradePlan('pro')}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      Upgrade to Pro (Demo Activation)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Account Profile & Preferences
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-normal">
              Manage your identity, connected email, and workspace persistence settings.
            </p>

            {settingsSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Account settings successfully saved and synced.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'guest@soulverseapps.com'}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-normal">
                  Email addresses are permanently linked to your security credentials.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Plan
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                  <span className="font-bold text-slate-800 capitalize">
                    {user?.plan || 'guest'} tier
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plans')}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Change plan →
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={savingSettings || !user}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white font-bold text-xs shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSettings ? 'Saving...' : 'Save Changes'}</span>
                </button>

                {!user && (
                  <span className="text-[11px] text-amber-700 font-medium">
                    Sign in to enable persistent profile saving.
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
