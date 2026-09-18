import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  // Generate JSON-LD BreadcrumbList
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: window.location.origin,
      },
      ...items.map((it, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: it.label,
        item: it.path ? `${window.location.origin}${it.path}` : undefined,
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="my-3 text-xs text-slate-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="flex items-center">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-800 line-clamp-1 max-w-[240px]">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => item.path && onNavigate(item.path)}
                  className="hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 max-w-[200px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
