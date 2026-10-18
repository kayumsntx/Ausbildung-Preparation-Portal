'use client';

import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <FileText className="w-3.5 h-3.5" />
          Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">Effective Date: October 18, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">1. Scope & Acceptance</h2>
          <p>
            By creating an account or accessing the Ausbildung Preparation Portal, you agree to be bound by these
            Terms of Service. If you do not agree, you must not use our platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">2. Educational & Preparatory Nature</h2>
          <p>
            The portal provides German language learning, job research, CV building, and speaking practice tools.
            We are not an employment agency or legal visa advisory. We do not issue Ausbildungsverträge (vocational contracts)
            nor do we grant German visas. Contracts are issued exclusively by German enterprises, and visas are granted
            solely by the German diplomatic missions (Embassies/Consulates) and Ausländerbehörden (Immigration Offices).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">3. Virtual Coins & Ledger Terms</h2>
          <p>
            Virtual coins are an internal digital entitlement designed to gamify learning milestones and enable
            moderated speaking sessions. Coins:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Have no monetary or real-world cash equivalence.</li>
            <li>Cannot be withdrawn, transferred between accounts, or exchanged for currency.</li>
            <li>May expire or be adjusted by administrators in cases of fraudulent referral claims or abuse.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">4. User Conduct & Zero-Tolerance Harassment</h2>
          <p>
            Users participating in speaking tandems or community features must adhere to our Community Guidelines.
            Harassment, discriminatory remarks, unsolicited commercial advertising, and recording peer participants
            without consent will result in immediate permanent suspension.
          </p>
        </section>
      </div>
    </div>
  );
}
