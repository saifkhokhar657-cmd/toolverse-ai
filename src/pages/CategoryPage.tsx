import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, ArrowUpRight, BookOpen } from 'lucide-react';
import { TOOLS_LIST, CATEGORIES, CATEGORY_INFO } from '../data/tools';
import { ARTICLES_DATA } from '../data/articles';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { AdContainer } from '../components/layout/AdContainer';
import { ToolCategory } from '../types';
import { VisualToolCard } from '../components/tools/VisualToolCard';
import { ArticleVisualPreview } from '../components/common/ArticleVisualPreview';

interface CategoryPageProps {
  categorySlug: string;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, onNavigate }) => {
  // Normalize slug to ToolCategory
  const slugToCat: Record<string, ToolCategory> = {
    'ai-tools': 'ai',
    'image-tools': 'image',
    'pdf-tools': 'pdf',
    'calculators': 'calculators',
    'text-tools': 'text',
  };

  const catKey: ToolCategory = slugToCat[categorySlug] || 'ai';
  const info = CATEGORY_INFO[catKey] || {
    title: 'Online Tools',
    description: 'Explore our catalog of fast, private online tools.',
    path: `/${categorySlug}`,
  };

  const tools = TOOLS_LIST.filter((t) => t.category === catKey);
  const relatedArticles = ARTICLES_DATA.filter((a) => a.category === catKey).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: info.title },
          ]}
          onNavigate={onNavigate}
        />

        <div className="my-8 text-center sm:text-left">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
            Category Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            {info.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
            {info.description}
          </p>
        </div>

        <div className="my-6">
          <AdContainer slotId={`cat-top-${categorySlug}`} format="horizontal" />
        </div>

        {/* Tool Cards Grid with Visual Thumbnails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool) => (
            <VisualToolCard
              key={tool.id}
              tool={tool}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* Related Educational Guides with Thumbnails */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Educational Guides for {info.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => onNavigate(`/blog/${art.slug}`)}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <ArticleVisualPreview article={art} size="card" className="mb-3" />
                    <span className="text-[10px] text-slate-400 font-semibold">{art.readTime}</span>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 line-clamp-2 mt-1 mb-2">
                      {art.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span>Read guide</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="my-6">
          <AdContainer slotId={`cat-bottom-${categorySlug}`} format="horizontal" />
        </div>
      </div>
    </div>
  );
};
