export interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  schema?: object;
}

export function updatePageSeo({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  schema
}: SeoProps) {
  const fullTitle = title 
    ? (title.includes('ToolVerse AI') ? title : `${title} | ToolVerse AI`)
    : 'ToolVerse AI — Smart Tools. Simple Solutions.';
  
  const fullDesc = description || 'Free online AI, image, PDF, text and calculator tools designed to make everyday tasks faster and easier.';

  document.title = fullTitle;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', fullDesc);

  // OG Title & Description
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', fullTitle);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', fullDesc);

  let ogTypeElem = document.querySelector('meta[property="og:type"]');
  if (ogTypeElem) ogTypeElem.setAttribute('content', ogType);

  // Canonical
  const origin = window.location.origin;
  const currentUrl = canonicalUrl || `${origin}${window.location.pathname}`;
  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', currentUrl);

  // Schema.org script
  let schemaScript = document.getElementById('dynamic-schema-ld');
  if (schema) {
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'dynamic-schema-ld');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  } else if (schemaScript) {
    schemaScript.remove();
  }
}
