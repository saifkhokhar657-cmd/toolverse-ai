import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Share2,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Check,
  Twitter,
  Linkedin,
  Copy,
  BookOpen,
  HelpCircle,
  ArrowUpRight,
  List
} from 'lucide-react';
import { ARTICLES_DATA } from '../data/articles';
import { TOOLS_LIST, CATEGORIES } from '../data/tools';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { AdContainer } from '../components/layout/AdContainer';
import { updatePageSeo } from '../utils/seo';
import { ArticleVisualPreview } from '../components/common/ArticleVisualPreview';
import { ToolVisualPreview } from '../components/common/ToolVisualPreview';

interface ArticleDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug, onNavigate }) => {
  const article = ARTICLES_DATA.find((a) => a.slug === slug) || ARTICLES_DATA[0];
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Find linked tool from relatedToolSlugs
  const linkedTool = TOOLS_LIST.find((t) => article.relatedToolSlugs?.includes(t.id)) || TOOLS_LIST[0];

  // Related articles in same category
  const related = ARTICLES_DATA.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  const categoryItem = CATEGORIES.find((c) => c.id === article.category);
  const categoryName = categoryItem?.name || 'Knowledge Base';

  // Dynamic SEO
  useEffect(() => {
    if (article) {
      updatePageSeo({
        title: article.metaTitle || `${article.title} | ToolVerse AI`,
        description: article.metaDescription || article.summary,
        canonicalUrl: `${window.location.origin}/blog/${article.slug}`,
        ogType: 'article',
        schema: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.summary,
          author: {
            '@type': 'Organization',
            name: 'ToolVerse AI Editorial Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'ToolVerse AI',
            logo: {
              '@type': 'ImageObject',
              url: `${window.location.origin}/favicon.svg`,
            },
          },
          datePublished: article.date,
          dateModified: article.date,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${window.location.origin}/blog/${article.slug}`,
          },
        },
      });
    }
  }, [article]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${article.title} via @ToolVerseAI`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50/40 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Knowledge Hub', path: '/blog' },
              { label: article.title },
            ]}
            onNavigate={onNavigate}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Column */}
          <main className="lg:col-span-8">
            <article className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10">
              
              {/* Article Meta Header */}
              <header className="pb-8 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {categoryName}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {article.date}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.2] mb-4">
                  {article.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {article.summary}
                </p>

                {/* Author attribution & Social Sharing */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      TV
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">ToolVerse AI Editorial Team</div>
                      <div className="text-[11px] text-slate-500">Technical guides from the ToolVerse AI editorial team</div>
                    </div>
                  </div>

                  {/* Social share actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={shareOnTwitter}
                      title="Share on X"
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={shareOnLinkedIn}
                      title="Share on LinkedIn"
                      className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopyLink}
                      title="Copy URL"
                      className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </header>

              {/* Featured Article Visual Illustration */}
              <div className="my-6">
                <ArticleVisualPreview article={article} size="hero" className="shadow-xs" />
              </div>

              {/* Key Takeaways Callout */}
              <div className="my-8 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-900 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Executive Key Takeaways</span>
                </div>
                <p className="text-xs text-indigo-950/80 leading-relaxed font-normal">
                  This comprehensive guide covers actionable performance benchmarks, step-by-step best practices, and security-first considerations for digital workflows without vendor lock-in.
                </p>
              </div>

              {/* Top Ad Container */}
              <div className="my-6">
                <AdContainer slotId={`art-top-${article.slug}`} format="horizontal" />
              </div>

              {/* Recommended Tool Callout Banner */}
              {linkedTool && (
                <div className="my-8 p-6 rounded-2xl bg-slate-950 text-white shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="max-w-md">
                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-900/60 border border-indigo-700 px-2 py-0.5 rounded">
                      Featured Interactive Tool
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      Launch Free {linkedTool.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-normal leading-relaxed">
                      {linkedTool.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate(linkedTool.path)}
                    className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span>Open Tool Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Structured Body Sections */}
              <div className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
                {article.sections.map((section, sIdx) => {
                  const headingId = `section-${sIdx}`;
                  return (
                    <section key={sIdx} id={headingId} className="space-y-3">
                      {section.level === 3 ? (
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2">
                          {section.heading}
                        </h3>
                      ) : (
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-8 mb-3">
                          {section.heading}
                        </h2>
                      )}

                      {section.body.map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-slate-600 leading-relaxed text-sm sm:text-[15px] font-normal">
                          {paragraph}
                        </p>
                      ))}
                    </section>
                  );
                })}
              </div>

              {/* Mid-content Ad Container */}
              <div className="my-8">
                <AdContainer slotId={`art-mid-${article.slug}`} format="horizontal" />
              </div>

              {/* Frequently Asked Questions */}
              {article.faqs && article.faqs.length > 0 && (
                <section className="mt-12 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">
                      Frequently Asked Questions
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {article.faqs.map((faq, fIdx) => (
                      <div key={fIdx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 flex items-start gap-2">
                          <span className="text-indigo-600 font-black">Q:</span>
                          <span>{faq.question}</span>
                        </h3>
                        <p className="text-xs text-slate-600 pl-4 leading-relaxed font-normal">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Editorial Attribution Footer */}
              <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                  TV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">About ToolVerse AI Editorial</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 font-normal">
                    ToolVerse AI publishes technical tutorials, comparison benchmarks, and digital utility manuals authored by software engineers and digital design specialists.
                  </p>
                </div>
              </div>

            </article>

            {/* Bottom Ad Container */}
            <div className="mt-6">
              <AdContainer slotId={`art-bottom-${article.slug}`} format="horizontal" />
            </div>
          </main>

          {/* Sticky Sidebar on Desktop */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Table of Contents Widget */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sticky top-24">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 mb-4 pb-3 border-b border-slate-100">
                <List className="w-4 h-4 text-indigo-600" />
                <span>Table of Contents</span>
              </div>

              <nav className="space-y-2 text-xs font-medium">
                {article.sections.map((sec, idx) => (
                  <a
                    key={idx}
                    href={`#section-${idx}`}
                    className="block text-slate-600 hover:text-indigo-600 transition-colors py-1 pl-2 border-l-2 border-transparent hover:border-indigo-600 truncate"
                  >
                    {sec.heading}
                  </a>
                ))}
              </nav>

              {/* Quick Tool Launch in Sidebar */}
              {linkedTool && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Direct Interactive Tool
                  </span>
                  <div className="rounded-xl overflow-hidden border border-slate-200 mt-2 mb-2 shadow-2xs">
                    <ToolVisualPreview toolId={linkedTool.id} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">
                    {linkedTool.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {linkedTool.description}
                  </p>
                  <button
                    onClick={() => onNavigate(linkedTool.path)}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Launch Utility</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Related Articles in Sidebar */}
            {related.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900 mb-4 pb-3 border-b border-slate-100">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Related Guides</span>
                </div>

                <div className="space-y-3">
                  {related.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onNavigate(`/blog/${rel.slug}`)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">
                        {rel.readTime}
                      </span>
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-0.5">
                        {rel.title}
                      </h5>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>

      </div>
    </div>
  );
};
