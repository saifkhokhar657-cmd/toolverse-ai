import { ToolItem, ToolCategory } from '../types';

export const TOOLS_CONFIG = {
  limits: {
    guest: 5,
    free: 15,
    pro: 500,
  }
};

export const CATEGORIES: { id: ToolCategory; name: string; path: string; icon: string }[] = [
  { id: 'ai', name: 'AI Tools', path: '/ai-tools', icon: 'Sparkles' },
  { id: 'image', name: 'Image Tools', path: '/image-tools', icon: 'Image' },
  { id: 'pdf', name: 'PDF Tools', path: '/pdf-tools', icon: 'FileText' },
  { id: 'calculators', name: 'Calculators', path: '/calculators', icon: 'Calculator' },
  { id: 'text', name: 'Text & Utilities', path: '/text-tools', icon: 'Type' },
];

export const TOOLS_LIST: ToolItem[] = [
  // AI Tools
  {
    id: 'ai-caption-generator',
    name: 'AI Caption Generator',
    description: 'Craft viral, engaging social media captions for Instagram, TikTok, LinkedIn, and YouTube in seconds.',
    category: 'ai',
    path: '/tools/ai-caption-generator',
    iconName: 'Sparkles',
    badge: 'AI Powered',
    popular: true,
    metaTitle: 'AI Caption Generator — Social Media Captions Online | ToolVerse AI',
    metaDescription: 'Generate high-converting, creative social media captions for Instagram, TikTok, LinkedIn, and X with ToolVerse AI caption generator.'
  },
  {
    id: 'ai-hashtag-generator',
    name: 'AI Hashtag Generator',
    description: 'Generate high-reach, niche-targeted hashtags to maximize visibility and audience growth.',
    category: 'ai',
    path: '/tools/ai-hashtag-generator',
    iconName: 'Hash',
    badge: 'AI Powered',
    popular: false,
    metaTitle: 'AI Hashtag Generator — Boost Reach on Instagram & TikTok | ToolVerse AI',
    metaDescription: 'Discover trending and niche hashtags for your social posts with intelligent categorization and 1-click copy.'
  },
  {
    id: 'ai-bio-generator',
    name: 'AI Bio Generator',
    description: 'Create memorable, charismatic bios for Instagram, Twitter, LinkedIn, and personal portfolios.',
    category: 'ai',
    path: '/tools/ai-bio-generator',
    iconName: 'UserCheck',
    badge: 'AI Powered',
    popular: false,
    metaTitle: 'AI Bio Generator — Craft Killer Social Profiles | ToolVerse AI',
    metaDescription: 'Generate catchy, professional, or funny social media bios tailored to your niche and persona.'
  },
  {
    id: 'ai-text-rewriter',
    name: 'AI Text Rewriter',
    description: 'Rewrite, simplify, expand, or professionalize any article, email, or essay while preserving core meaning.',
    category: 'ai',
    path: '/tools/ai-text-rewriter',
    iconName: 'RefreshCw',
    badge: 'AI Powered',
    popular: false,
    metaTitle: 'AI Text Rewriter & Paraphrasing Tool Online | ToolVerse AI',
    metaDescription: 'Paraphrase and rewrite articles, sentences, or essays with tone control, clarity enhancement, and grammar perfection.'
  },

  // Image Tools
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress JPG, PNG, and WebP files up to 90% without visible quality loss right in your browser.',
    category: 'image',
    path: '/tools/image-compressor',
    iconName: 'Minimize2',
    popular: true,
    badge: 'Fast & Private',
    metaTitle: 'Image Compressor Online — Compress JPG, PNG & WebP | ToolVerse AI',
    metaDescription: 'Compress JPG, PNG and WebP images online with ToolVerse AI. Reduce image file size quickly while maintaining crisp quality.'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize image dimensions by pixels or aspect ratio with presets for Instagram, Twitter, and YouTube.',
    category: 'image',
    path: '/tools/image-resizer',
    iconName: 'Maximize2',
    popular: false,
    metaTitle: 'Image Resizer Online — Resize Dimensions & Social Presets | ToolVerse AI',
    metaDescription: 'Easily resize images online by custom pixel dimensions or preset social media canvas sizes with instant download.'
  },
  {
    id: 'background-remover',
    name: 'Background Remover',
    description: 'Remove solid and high-contrast backgrounds from photos and logos to create clean transparent PNGs.',
    category: 'image',
    path: '/tools/background-remover',
    iconName: 'Scissors',
    badge: 'Client-Side',
    popular: false,
    metaTitle: 'Background Remover Online — Create Transparent PNGs | ToolVerse AI',
    metaDescription: 'Remove image backgrounds directly in your browser with chroma tolerance, color picking, and feather smoothing.'
  },
  {
    id: 'image-converter',
    name: 'JPG / PNG Converter',
    description: 'Convert between JPG, PNG, and modern WebP formats instantly with client-side canvas processing.',
    category: 'image',
    path: '/tools/image-converter',
    iconName: 'Repeat',
    popular: false,
    metaTitle: 'JPG to PNG / WebP Converter Online | ToolVerse AI',
    metaDescription: 'Convert images between JPG, PNG, and WebP format without uploading files to remote servers.'
  },

  // PDF Tools
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert single or multiple JPG and PNG images into a clean, well-formatted PDF document.',
    category: 'pdf',
    path: '/tools/jpg-to-pdf',
    iconName: 'FileText',
    popular: true,
    badge: 'Popular',
    metaTitle: 'JPG to PDF Converter Online — Fast & Free | ToolVerse AI',
    metaDescription: 'Convert JPG, JPEG, and PNG images into high quality PDF documents with page size, orientation, and margin settings.'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Extract and rasterize PDF document pages into high-resolution JPG images with instant download.',
    category: 'pdf',
    path: '/tools/pdf-to-jpg',
    iconName: 'FileImage',
    popular: true,
    metaTitle: 'PDF to JPG Converter Online — Extract PDF Pages | ToolVerse AI',
    metaDescription: 'Convert PDF document pages to crisp JPG images directly in your browser with no upload delay.'
  },
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    description: 'Reduce PDF file size by stripping redundant metadata, optimizing objects, and flattening streams.',
    category: 'pdf',
    path: '/tools/pdf-compressor',
    iconName: 'FileDown',
    popular: false,
    metaTitle: 'PDF Compressor Online — Reduce PDF File Size | ToolVerse AI',
    metaDescription: 'Compress large PDF files online without losing readability. Fast, free, and secure client-side processing.'
  },

  // Calculators
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Solve percentage problems, calculate discounts, tips, tax, and percentage increase or decrease.',
    category: 'calculators',
    path: '/tools/percentage-calculator',
    iconName: 'Percent',
    popular: true,
    metaTitle: 'Percentage Calculator Online — 4-in-1 Math Tool | ToolVerse AI',
    metaDescription: 'Calculate percentages, percent change, markups, and differences with mathematical step-by-step formulas.'
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age down to years, months, days, hours, and next birthday countdown.',
    category: 'calculators',
    path: '/tools/age-calculator',
    iconName: 'Calendar',
    popular: false,
    metaTitle: 'Age Calculator — Exact Age in Years, Months & Days | ToolVerse AI',
    metaDescription: 'Calculate exact chronological age, day of birth, total days lived, and upcoming birthday countdown.'
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Calculate monthly loan EMI payments, total interest payable, and amortization breakdown schedule.',
    category: 'calculators',
    path: '/tools/emi-calculator',
    iconName: 'DollarSign',
    popular: false,
    metaTitle: 'EMI Calculator — Loan EMI & Interest Breakdown | ToolVerse AI',
    metaDescription: 'Calculate monthly home, car, or personal loan EMIs with amortization schedules and total interest calculations.'
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index (BMI) for adults with Metric and Imperial units and healthy range guidance.',
    category: 'calculators',
    path: '/tools/bmi-calculator',
    iconName: 'Activity',
    popular: false,
    metaTitle: 'BMI Calculator — Body Mass Index & Healthy Weight | ToolVerse AI',
    metaDescription: 'Calculate BMI accurately according to World Health Organization standards with healthy weight target guidance.'
  },

  // Text & Utilities
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Generate high-resolution, scannable QR codes for URLs, text, WiFi, contacts, and phone numbers.',
    category: 'text',
    path: '/tools/qr-code-generator',
    iconName: 'QrCode',
    popular: true,
    badge: 'Instant',
    metaTitle: 'QR Code Generator Online — Free Custom QR Codes | ToolVerse AI',
    metaDescription: 'Create custom QR codes for websites, WiFi networks, phone numbers, and text with custom colors and instant PNG download.'
  },
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Analyze text statistics in real time: words, characters, sentences, paragraphs, and reading time.',
    category: 'text',
    path: '/tools/word-counter',
    iconName: 'FileSpreadsheet',
    popular: false,
    metaTitle: 'Word Counter & Character Counter Online | ToolVerse AI',
    metaDescription: 'Count words, characters, sentences, and paragraphs in real time with estimated reading speed and case conversion tools.'
  }
];

export const CATEGORY_INFO: Record<ToolCategory, { title: string; description: string; path: string; icon: string }> = {
  ai: {
    title: 'AI Tools',
    description: 'Supercharge your content creation with intelligent text, caption, hashtag, and bio generation.',
    path: '/ai-tools',
    icon: 'Sparkles'
  },
  image: {
    title: 'Image Tools',
    description: 'Compress, resize, remove backgrounds, and convert image formats with zero quality compromise.',
    path: '/image-tools',
    icon: 'Image'
  },
  pdf: {
    title: 'PDF Tools',
    description: 'Convert images to PDF, turn PDF pages into JPGs, and optimize PDF documents securely.',
    path: '/pdf-tools',
    icon: 'FileText'
  },
  calculators: {
    title: 'Calculators',
    description: 'Mathematically exact calculators for financial EMIs, percentage differences, ages, and BMI health.',
    path: '/calculators',
    icon: 'Calculator'
  },
  text: {
    title: 'Text & Utilities',
    description: 'Handy utilities for character counts, QR code creation, reading times, and text transformations.',
    path: '/text-tools',
    icon: 'Type'
  }
};
