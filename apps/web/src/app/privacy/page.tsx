'use client';

import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          General Data Protection Regulation (GDPR / DSGVO)
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy & Data Security
        </h1>
        <p className="text-xs text-slate-400">Last updated: October 18, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. Controller Information</h2>
          <p>
            The controller responsible for data processing on this platform in accordance with Article 4(7) GDPR is:
            <br />
            <strong>Ausbildung Preparation Portal Team</strong>
            <br />
            Email: privacy@ausbildungportal.de
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Data We Process</h2>
          <p>When you register and use the platform, we process the following categories of data:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Identity:</strong> Email address, hashed password, preferred language.</li>
            <li><strong>Educational & Profile Data:</strong> Target Ausbildung field, German CEFR level, quiz progress.</li>
            <li><strong>Private Application Documents:</strong> Resumes (CVs), cover letters, uploaded transcripts.</li>
            <li><strong>Technical Telemetry:</strong> Anonymized server logs, correlation IDs, and IP addresses.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">3. Storage & Document Security</h2>
          <p>
            Your CVs, passport scans, and academic credentials are never accessible publicly. They reside inside an
            encrypted, private S3-compatible document store. Access is granted solely through short-lived, pre-signed
            URLs valid for 5 minutes only.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">4. WebRTC Speaking Practice Calls</h2>
          <p>
            Audio and video tandem sessions route directly between participants via our managed WebRTC SFU (LiveKit).
            Media streams are ephemeral; no call recordings or voice audio data are saved to disk by default.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">5. Your Rights Under GDPR</h2>
          <p>
            Under European data protection law, you have the right to access (Art. 15), rectification (Art. 16),
            erasure (&quot;right to be forgotten&quot;, Art. 17), restriction of processing (Art. 18), and data portability (Art. 20).
            You may request complete account deletion at any time from your settings.
          </p>
        </section>
      </div>
    </div>
  );
}
