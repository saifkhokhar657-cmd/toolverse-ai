import React, { useState } from 'react';
import { ShieldCheck, Mail, CheckCircle2, Send, HelpCircle, FileText, AlertCircle, Building2, PhoneCall } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';

interface LegalPageProps {
  pageType: 'about' | 'contact' | 'privacy' | 'terms' | 'cookies' | 'disclaimer';
  onNavigate: (path: string) => void;
}

export const LegalPages: React.FC<LegalPageProps> = ({ pageType, onNavigate }) => {
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback / Suggestion');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name || !email || !message) {
      setFormError('Please fill out all required fields.');
      return;
    }
    setIsSubmitted(true);
  };

  const titles: Record<string, string> = {
    about: 'About ToolVerse AI',
    contact: 'Contact & Community Support',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookies: 'Cookie Policy',
    disclaimer: 'Disclaimer & Liability Notice',
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: titles[pageType] || 'Information' },
          ]}
          onNavigate={onNavigate}
        />

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs my-6">
          
          {/* About Page */}
          {pageType === 'about' && (
            <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Company & Mission
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3 mb-2">
                  About ToolVerse AI
                </h1>
                <p className="text-base text-slate-600 font-medium">
                  Smart Tools. Simple Solutions.
                </p>
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900"><Building2 className="w-4 h-4 text-indigo-600" /> SAWAX ENTERPRISES PRIVATE LIMITED</div>
                  <p className="text-xs text-slate-500 mt-1">Registered with the Securities and Exchange Commission of Pakistan (SECP) in 2026. Head Office: Lahore, Punjab, Pakistan.</p>
                </div>
              </div>

              <p className="font-normal text-slate-600">
                ToolVerse AI was established with a singular focus: delivering lightning-fast, privacy-respecting, and beautifully crafted online utilities without ad traps, forced account paywalls, or software installation bloat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <div className="text-xl font-black text-indigo-600">17+</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">Core Online Tools</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Free forever with zero friction</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <div className="text-xl font-black text-cyan-600">30</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">Technical Guides</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Original benchmarks & research</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <div className="text-xl font-black text-emerald-600">100%</div>
                  <div className="text-xs font-bold text-slate-800 mt-1">Client-First Privacy</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Browser sandbox file execution</div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mt-8 mb-2">Architectural Principles</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm font-normal">
                <li>
                  <strong className="text-slate-900">In-Browser Sandboxing:</strong> Images, documents, and calculations execute directly inside your browser using HTML5 Canvas, WebAssembly, and PDF-Lib engines. Your media files are never transferred or stored on external servers.
                </li>
                <li>
                  <strong className="text-slate-900">Responsible AI Integration:</strong> Text generation features leverage Google Gemini via secure server-side proxies, shielding API credentials and enforcing strict daily rate quotas.
                </li>
                <li>
                  <strong className="text-slate-900">Zero Mandatory Lock-in:</strong> Tools are completely usable without requiring registration. Registered users receive expanded cloud sync capabilities and increased daily quotas.
                </li>
              </ul>
            </div>
          )}

          {/* Contact Page */}
          {pageType === 'contact' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Support & Relations
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-2">
                  Contact & Community Support
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Have an inquiry, found a browser incompatibility, or want to suggest a new utility? Our team answers all tickets within 24–48 hours.
                </p>
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900"><Building2 className="w-4 h-4 text-indigo-600" /> SAWAX ENTERPRISES PRIVATE LIMITED</div>
                  <p className="text-xs text-slate-500 mt-1">Registered with SECP, Pakistan • Registration year: 2026 • Head Office: Lahore, Punjab, Pakistan</p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-900">Inquiry Dispatched Successfully!</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto font-normal">
                    Thank you, {name}. Your ticket has been logged and assigned to our systems support team. You will receive a response at {email}.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Send Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department / Reason
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      <option value="Feedback / Suggestion">Feedback / New Tool Suggestion</option>
                      <option value="Bug Report">Technical Issue / Browser Bug</option>
                      <option value="Partnership & Sponsorship">Partnership / Enterprise API</option>
                      <option value="Account or Limits">Account or Quota Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Detailed Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your request or technical observations in detail..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600 font-medium"
                    />
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white font-bold text-xs shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Privacy Policy */}
          {pageType === 'privacy' && (
            <div className="space-y-6 text-slate-700 text-sm leading-relaxed font-normal">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Legal & Compliance
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-1">
                  Privacy Policy
                </h1>
                <p className="text-xs text-slate-400">Effective Date: September 2026</p>
                <p className="text-xs text-slate-500 mt-2"><strong>ToolVerse AI</strong> is a product of <strong>SAWAX ENTERPRISES PRIVATE LIMITED</strong>, registered with SECP, Pakistan in 2026. Head Office: Lahore, Punjab, Pakistan.</p>
              </div>

              <p>
                At ToolVerse AI (accessible from toolverse.soulverseapps.com), we prioritize digital privacy and transparent data governance. This Privacy Policy details our operational data handling procedures.
              </p>

              <h2 className="text-base font-bold text-slate-900">1. Client-First Execution Paradigm</h2>
              <p>
                Unlike conventional online converters, ToolVerse AI executes image compression, format transcoding, resizing, background removal, JPG-to-PDF merging, and mathematical computations directly inside your client browser sandbox using WebAssembly and Canvas APIs. Your files are not transmitted to or stored on our servers.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. Generative AI Query Processing</h2>
              <p>
                When using AI creative tools (such as AI Caption Generator, AI Bio Generator, or Text Rewriter), text inputs are transmitted over encrypted TLS/HTTPS directly to our server-side API proxy to query Google Gemini models. We never sell your proprietary prompts or use them to train commercial models.
              </p>

              <h2 className="text-base font-bold text-slate-900">3. Cookies & Local Storage</h2>
              <p>
                We use standard HTML5 LocalStorage to maintain your session preferences, daily usage quotas, and bookmarked workspace items locally on your hardware. You can clear this data at any time via your browser settings.
              </p>

              <h2 className="text-base font-bold text-slate-900">4. Advertising & Analytics</h2>
              <p>
                We may use analytics and advertising services to understand site usage and support the operation of the platform. Third-party providers may process information according to their own privacy policies. Where required, appropriate consent controls will be provided.
              </p>

              <h2 className="text-base font-bold text-slate-900">5. Company & Contact Identity</h2>
              <p>
                ToolVerse AI is a product of SAWAX ENTERPRISES PRIVATE LIMITED, registered with the Securities and Exchange Commission of Pakistan (SECP) in 2026, with its Head Office in Lahore, Punjab, Pakistan.
              </p>
            </div>
          )}

          {/* Terms of Service */}
          {pageType === 'terms' && (
            <div className="space-y-6 text-slate-700 text-sm leading-relaxed font-normal">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Terms of Agreement
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-1">
                  Terms of Service
                </h1>
                <p className="text-xs text-slate-400">Effective Date: September 2026</p>
                <p className="text-xs text-slate-500 mt-2"><strong>ToolVerse AI</strong> is a product of <strong>SAWAX ENTERPRISES PRIVATE LIMITED</strong>, registered with SECP, Pakistan in 2026. Head Office: Lahore, Punjab, Pakistan.</p>
              </div>

              <p>
                By accessing or using ToolVerse AI, you agree to comply with and be bound by the terms, conditions, and notices stated herein.
              </p>

              <h2 className="text-base font-bold text-slate-900">1. Permitted Personal & Commercial Usage</h2>
              <p>
                You are granted a worldwide, non-exclusive license to utilize ToolVerse AI utilities for individual, commercial, and professional projects without attribution obligations.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. Prohibited Conduct</h2>
              <p>
                You agree not to execute distributed denial-of-service (DDoS) campaigns, automated scraping scripts that overload our endpoints, or submit unlawful or abusive materials to our generative AI interfaces.
              </p>

              <h2 className="text-base font-bold text-slate-900">3. AI-Generated Content</h2>
              <p>
                AI-generated text is provided as an assistive output and may contain errors or omissions. You are responsible for reviewing, editing, and verifying generated content before publishing, relying on, or commercially using it.
              </p>

              <h2 className="text-base font-bold text-slate-900">4. User Content & Files</h2>
              <p>
                You must have the necessary rights and permissions for any text, images, documents, or other material you process through ToolVerse AI. You must not use the service to process unlawful material or to infringe another person's rights.
              </p>

              <h2 className="text-base font-bold text-slate-900">5. Intellectual Property</h2>
              <p>
                ToolVerse AI, its software, branding, interface, original articles, and underlying technology are owned by or licensed to SAWAX ENTERPRISES PRIVATE LIMITED and are protected by applicable intellectual-property laws.
              </p>

              <h2 className="text-base font-bold text-slate-900">6. Service Availability</h2>
              <p>
                We may update, suspend, limit, or discontinue features when necessary for maintenance, security, legal compliance, or product development. We do not guarantee uninterrupted availability.
              </p>

              <h2 className="text-base font-bold text-slate-900">7. Limitation of Liability</h2>
              <p>
                To the extent permitted by applicable law, ToolVerse AI and SAWAX ENTERPRISES PRIVATE LIMITED are not liable for indirect, incidental, special, consequential, or business losses arising from use of the service.
              </p>

              <h2 className="text-base font-bold text-slate-900">8. Changes to These Terms</h2>
              <p>
                These Terms may be updated from time to time. Continued use of ToolVerse AI after an update constitutes acceptance of the revised Terms.
              </p>
            </div>
          )}

          {/* Cookie Policy */}
          {pageType === 'cookies' && (
            <div className="space-y-6 text-slate-700 text-sm leading-relaxed font-normal">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Cookie Standards
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-1">
                  Cookie Policy
                </h1>
                <p className="text-xs text-slate-400">Effective Date: September 2026</p>
                <p className="text-xs text-slate-500 mt-2"><strong>ToolVerse AI</strong> is a product of <strong>SAWAX ENTERPRISES PRIVATE LIMITED</strong>, registered with SECP, Pakistan in 2026. Head Office: Lahore, Punjab, Pakistan.</p>
              </div>

              <p>
                This Cookie Policy informs visitors how ToolVerse AI uses storage tokens and tracking pixels to ensure platform stability.
              </p>

              <h2 className="text-base font-bold text-slate-900">1. Functional Local Storage</h2>
              <p>
                ToolVerse AI avoids invasive tracking cookies and relies predominantly on browser LocalStorage to maintain your daily rate limits, UI preferences, and bookmarked workspace items.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. Advertising & Third-Party Services</h2>
              <p>
                If advertising is enabled, third-party advertising providers such as Google may use cookies or similar technologies to serve and measure advertisements in accordance with their own policies. Users can manage available cookie and advertising preferences through their browser or applicable consent controls.
              </p>
            </div>
          )}

          {/* Disclaimer */}
          {pageType === 'disclaimer' && (
            <div className="space-y-6 text-slate-700 text-sm leading-relaxed font-normal">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Legal Notice
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3 mb-1">
                  Disclaimer & Liability Notice
                </h1>
                <p className="text-xs text-slate-400">Effective Date: September 2026</p>
                <p className="text-xs text-slate-500 mt-2"><strong>ToolVerse AI</strong> is a product of <strong>SAWAX ENTERPRISES PRIVATE LIMITED</strong>, registered with SECP, Pakistan in 2026. Head Office: Lahore, Punjab, Pakistan.</p>
              </div>

              <p>
                The utilities and calculators on ToolVerse AI are provided strictly on an "as-is" basis for informational and productivity assistance.
              </p>

              <h2 className="text-base font-bold text-slate-900">1. Financial & Health Disclaimer</h2>
              <p>
                Calculations rendered by tools such as the EMI Loan Calculator or BMI Calculator do not constitute formal certified financial advice, loan agreements, or medical diagnoses. Always consult licensed practitioners for professional guidance.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. Accuracy & Third-Party Services</h2>
              <p>
                Tool results, AI outputs, articles, and third-party integrations are provided for general informational and productivity purposes. Verify important information independently before making decisions based on any result.
              </p>

              <h2 className="text-base font-bold text-slate-900">3. Company</h2>
              <p>
                ToolVerse AI is a product of SAWAX ENTERPRISES PRIVATE LIMITED, registered with SECP, Pakistan in 2026. Head Office: Lahore, Punjab, Pakistan.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
