import React, { useState } from 'react';
import { Search, BookOpen, Clock, Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ARTICLES_DATA } from '../data/articles';
import { CATEGORIES } from '../data/tools';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { AdContainer } from '../components/layout/AdContainer';
import { ArticleVisualPreview } from '../components/common/ArticleVisualPreview';

interface BlogIndexPageProps {
  onNavigate: (path: string) => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filterCategories = [
    { id: 'all', name: 'All Guides' },
    ...CATEGORIES.map((c) => ({ id: c.id, name: c.name })),
  ];

  const filtered = ARTICLES_DATA.filter((a) => {
    const matchesCat = selectedCat === 'all' || a.category === selectedCat;
    const matchesSearch =
      search.trim() === '' ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/40 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Knowledge Hub & Technical Tutorials' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="text-center max-w-3xl mx-auto my-10">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            Knowledge Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Technical Guides, Tutorials & Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto font-normal">
            Deep dives into browser WebAssembly pipelines, lossy vs lossless image compression algorithms, PDF rasterization, and social algorithms across 30 original articles.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 30 technical guides..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-medium shadow-2xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {filterCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === c.id
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="my-6">
          <AdContainer slotId="blog-index-top" format="horizontal" />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {filtered.map((art) => (
            <article
              key={art.id}
              onClick={() => onNavigate(`/blog/${art.slug}`)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              <ArticleVisualPreview article={art} size="card" className="rounded-none border-0" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                  <span className="font-bold text-indigo-600 uppercase tracking-wider text-[10px] bg-indigo-50/80 px-2 py-0.5 rounded">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" /> {art.readTime}
                  </span>
                </div>

                <h2 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                  {art.title}
                </h2>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4 font-normal">
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

        <div className="my-6">
          <AdContainer slotId="blog-index-bottom" format="horizontal" />
        </div>

      </div>
    </div>
  );
};
