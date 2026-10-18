'use client';

import React from 'react';
import { Users, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Users className="w-3.5 h-3.5" />
          Safe Learning Environment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Community Guidelines & Speaking Etiquette
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Our global community thrives on mutual respect, encouragement, and cultural empathy.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {/* DOs */}
        <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
          <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            What We Encourage (Do)
          </h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc pl-5">
            <li><strong>Encourage Beginners:</strong> Learning German is challenging. Be patient when your partner searches for vocabulary or makes grammar mistakes.</li>
            <li><strong>Punctuality:</strong> Arrive on time for agreed tandem sessions or cancel promptly in advance.</li>
            <li><strong>Constructive Feedback:</strong> Offer gentle pronunciation corrections when mutually agreed.</li>
            <li><strong>Respect Calling Preferences:</strong> Always honor gender and session length filters configured by partners.</li>
          </ul>
        </div>

        {/* DON'Ts */}
        <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
          <h2 className="text-base font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            Zero-Tolerance Behaviors (Don&apos;t)
          </h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc pl-5">
            <li><strong>Harassment or Romantic Advances:</strong> The platform is exclusively an educational vocational preparation tool. Romantic solicitation or sexual comments will result in instant permanent banning.</li>
            <li><strong>Unauthorized Recording:</strong> Taking screenshots, screen recordings, or audio captures of other learners without explicit written consent is strictly prohibited.</li>
            <li><strong>Commercial Spam:</strong> Promoting third-party immigration services or asking for money.</li>
            <li><strong>Hate Speech:</strong> Discriminatory remarks based on nationality, religion, gender, or background.</li>
          </ul>
        </div>

        {/* Reporting */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            How to Report Violations
          </h2>
          <p>
            During or immediately after any audio/video session, you can tap the <strong>Report</strong> button.
            This immediately severs the call, blocks the user from reaching you again, and flags the session identifier
            for immediate review by our safety moderation team.
          </p>
        </div>
      </div>
    </div>
  );
}
