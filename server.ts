import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { cert, getApps as getAdminApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

let adminApp: ReturnType<typeof initializeAdminApp> | null = null;
try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (projectId && clientEmail && privateKey) {
    adminApp = getAdminApps().length ? getAdminApps()[0] : initializeAdminApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }
} catch (err) {
  console.warn('Firebase Admin initialization skipped:', err);
}

app.use(express.json({ limit: '10mb' }));

// Central Rate Limiting & Usage Tracking Configuration
const USAGE_LIMITS = {
  guest: 5,
  free: 15,
  pro: 500
};

// In-memory rate limiting map: ip/token -> { count: number, resetAt: number }
interface RateRecord {
  count: number;
  resetAt: number;
}
const ipRateMap = new Map<string, RateRecord>();

async function resolveRequestIdentity(req: Request): Promise<{ id: string; plan: 'guest' | 'free' | 'pro' }> {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ') && adminApp) {
    try {
      const token = authHeader.slice(7);
      const decoded = await getAdminAuth(adminApp).verifyIdToken(token);
      let plan: 'free' | 'pro' = 'free';
      const sub = await getAdminFirestore(adminApp).collection('subscriptions').doc(decoded.uid).get();
      if (sub.exists && sub.data()?.plan === 'pro' && sub.data()?.status === 'active') plan = 'pro';
      return { id: `user_${decoded.uid}`, plan };
    } catch {
      return { id: 'invalid_auth', plan: 'guest' };
    }
  }
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown-client';
  return { id: `ip_${ip}`, plan: 'guest' };
}

async function checkRateLimit(req: Request): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const identity = await resolveRequestIdentity(req);
  const now = Date.now();
  const limit = USAGE_LIMITS[identity.plan];
  const ONE_DAY = 24 * 60 * 60 * 1000;

  let record = ipRateMap.get(identity.id);
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + ONE_DAY };
    ipRateMap.set(identity.id, record);
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetAt };
}

// Lazy initialization of GoogleGenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// 2. Usage Limits Configuration
app.get('/api/ai/limits', (req: Request, res: Response) => {
  res.json({
    limits: USAGE_LIMITS,
    authenticated: false
  });
});

// 3. AI Caption Generator
app.post('/api/ai/caption', async (req: Request, res: Response) => {
  try {
    const { topic, platform, tone, audience } = req.body;
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a topic or idea for your caption.' });
    }

    const rateCheck = await checkRateLimit(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Daily AI generation limit reached. Sign in for a higher free limit or upgrade to Pro.',
        resetTime: rateCheck.resetTime
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI service is currently initializing. Please configure GEMINI_API_KEY in the Secrets panel.'
      });
    }

    const prompt = `You are a world-class social media copywriter for ToolVerse AI.
Generate 3 distinct, high-converting captions for:
Platform: ${platform || 'Instagram'}
Topic: "${topic.trim()}"
Tone: ${tone || 'Engaging & Catchy'}
Target Audience: ${audience || 'General Social Media Users'}

Format your response strictly as JSON with this structure:
{
  "captions": [
    {
      "title": "Short label (e.g. High Engagement, Storytelling, Direct & Punchy)",
      "hook": "Compelling opening hook",
      "body": "Main caption text with appropriate line breaks and tasteful emojis",
      "callToAction": "Clear CTA (e.g. Save this for later, drop your thoughts below)",
      "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
    }
  ]
}
Return only valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      data: parsed,
      remaining: rateCheck.remaining
    });
  } catch (err: any) {
    console.error('Error generating caption:', err);
    return res.status(500).json({
      error: 'Failed to generate captions. Please try again with different inputs.'
    });
  }
});

// 4. AI Hashtag Generator
app.post('/api/ai/hashtag', async (req: Request, res: Response) => {
  try {
    const { topic, platform, count } = req.body;
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide a topic or keywords to generate hashtags.' });
    }

    const rateCheck = await checkRateLimit(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Daily generation limit reached. Sign in or upgrade to Pro for higher limits!',
        resetTime: rateCheck.resetTime
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI service is currently unavailable. Please configure GEMINI_API_KEY.'
      });
    }

    const prompt = `You are a social media hashtag optimization expert.
Generate targeted hashtags for:
Topic: "${topic.trim()}"
Platform: ${platform || 'Instagram'}
Desired Quantity: ${count || 20}

Organize the hashtags into 3 distinct tiers:
1. High Reach / Popular (broad, high volume)
2. Niche & Targeted (specific to topic, medium competition)
3. Trending & Community (engaged sub-communities)

Return JSON with this schema:
{
  "highReach": ["#tag1", "#tag2"],
  "niche": ["#tag3", "#tag4"],
  "community": ["#tag5", "#tag6"],
  "all": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"]
}
Return only valid JSON. Ensure all items start with #.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      data: parsed,
      remaining: rateCheck.remaining
    });
  } catch (err: any) {
    console.error('Error generating hashtags:', err);
    return res.status(500).json({
      error: 'Failed to generate hashtags. Please verify your prompt and try again.'
    });
  }
});

// 5. AI Bio Generator
app.post('/api/ai/bio', async (req: Request, res: Response) => {
  try {
    const { nameOrBrand, profession, vibe, platform } = req.body;
    if (!profession || typeof profession !== 'string' || profession.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide your profession or primary focus.' });
    }

    const rateCheck = await checkRateLimit(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Daily generation limit reached. Sign in or upgrade to Pro for higher limits!',
        resetTime: rateCheck.resetTime
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI service is currently unavailable. Please configure GEMINI_API_KEY.'
      });
    }

    const prompt = `You are a personal branding and bio optimization specialist.
Generate 4 distinct, engaging social bios:
Name or Brand: "${nameOrBrand || 'Creator'}"
Profession/Focus: "${profession.trim()}"
Style/Vibe: "${vibe || 'Professional & Modern'}"
Target Platform: "${platform || 'Instagram'}"

Make sure each bio stays strictly under the character limit (150 characters for Instagram, 160 for Twitter/X).
Return JSON:
{
  "bios": [
    {
      "style": "e.g. Minimalist, Witty & Creative, Authority & Direct, Storyteller",
      "text": "The full bio string with emojis and line breaks",
      "charCount": 120
    }
  ]
}
Return only valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({
      success: true,
      data: parsed,
      remaining: rateCheck.remaining
    });
  } catch (err: any) {
    console.error('Error generating bio:', err);
    return res.status(500).json({
      error: 'Failed to generate bios. Please try again.'
    });
  }
});

// 6. AI Text Rewriter
app.post('/api/ai/rewrite', async (req: Request, res: Response) => {
  try {
    const { text, mode, tone } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide text to rewrite.' });
    }

    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text exceeds maximum limit of 5,000 characters.' });
    }

    const rateCheck = await checkRateLimit(req);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Daily generation limit reached. Sign in or upgrade to Pro for higher limits!',
        resetTime: rateCheck.resetTime
      });
    }

    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error: 'AI service is currently unavailable. Please configure GEMINI_API_KEY.'
      });
    }

    const prompt = `You are a master editor and communications strategist.
Rewrite the following text according to these instructions:
Mode: ${mode || 'Standard Paraphrase'} (Options: Standard Paraphrase, Simplify, Professional & Formal, Casual & Friendly, Expand & Elaborate, Shorten & Concise, Fix Grammar & Polish)
Tone: ${tone || 'Balanced'}

Original Text:
"""
${text.trim()}
"""

Return JSON:
{
  "rewrittenText": "The refined and rewritten version",
  "summaryOfChanges": "Brief 1-sentence note of what was enhanced",
  "keyImprovements": ["Improved clarity", "Polished transitions"]
}
Return only valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);
    return res.json({
      success: true,
      data: parsed,
      remaining: rateCheck.remaining
    });
  } catch (err: any) {
    console.error('Error rewriting text:', err);
    return res.status(500).json({
      error: 'Failed to rewrite text. Please verify input and try again.'
    });
  }
});

// 7. Dynamic XML Sitemap for SEO
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  
  const toolPaths = [
    '/tools/ai-caption-generator',
    '/tools/ai-hashtag-generator',
    '/tools/ai-bio-generator',
    '/tools/ai-text-rewriter',
    '/tools/image-compressor',
    '/tools/image-resizer',
    '/tools/background-remover',
    '/tools/image-converter',
    '/tools/jpg-to-pdf',
    '/tools/pdf-to-jpg',
    '/tools/pdf-compressor',
    '/tools/percentage-calculator',
    '/tools/age-calculator',
    '/tools/emi-calculator',
    '/tools/bmi-calculator',
    '/tools/qr-code-generator',
    '/tools/word-counter'
  ];

  const categoryPaths = [
    '/',
    '/ai-tools',
    '/image-tools',
    '/pdf-tools',
    '/calculators',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
    '/disclaimer'
  ];

  const articleSlugs = [
    'how-to-compress-an-image-without-losing-quality',
    'how-to-reduce-image-size-online',
    'jpg-vs-png-what-is-the-difference',
    'how-to-resize-an-image-for-social-media',
    'how-to-convert-jpg-to-pdf',
    'how-to-convert-pdf-to-jpg',
    'how-to-compress-a-pdf',
    'how-to-create-a-qr-code',
    'what-is-an-ai-caption-generator',
    'how-to-generate-social-media-captions-with-ai',
    'how-to-generate-hashtags-with-ai',
    'how-to-write-a-better-instagram-bio',
    'how-ai-text-rewriting-works',
    'how-to-calculate-percentage',
    'how-to-calculate-age',
    'how-emi-calculators-work',
    'how-to-calculate-bmi',
    'how-to-count-words-in-an-article',
    'how-to-count-characters-in-text',
    'how-to-convert-images-between-jpg-png-and-webp',
    'how-to-make-images-smaller-for-websites',
    'best-image-size-for-websites',
    'how-to-optimize-images-for-faster-websites',
    'what-is-image-compression',
    'what-is-pdf-compression',
    'what-is-a-qr-code',
    'what-are-ai-tools',
    'how-online-calculators-work',
    'how-to-convert-files-online',
    'online-tools-vs-desktop-software'
  ];

  const allUrls = [
    ...categoryPaths.map(p => ({ loc: `${host}${p}`, priority: p === '/' ? '1.0' : '0.8', changefreq: 'daily' })),
    ...toolPaths.map(p => ({ loc: `${host}${p}`, priority: '0.9', changefreq: 'weekly' })),
    ...articleSlugs.map(slug => ({ loc: `${host}/blog/${slug}`, priority: '0.7', changefreq: 'monthly' }))
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemapXml);
});

// 8. Robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${host}/sitemap.xml
`);
});

// Vite Middleware Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ToolVerse AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
