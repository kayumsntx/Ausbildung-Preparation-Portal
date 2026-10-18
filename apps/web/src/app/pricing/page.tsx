'use client';

import React from 'react';
import Link from 'next/link';
import {
  Coins,
  Check,
  Sparkles,
  Shield,
} from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border border-yellow-300/40">
          <Coins className="w-3.5 h-3.5 text-yellow-600" />
          Virtual Coin Ledger Economy
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Fair, Transparent & Earnable Rewards
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Virtual coins are an internal platform entitlement earned through verified study milestones or acquired
          through transparent packages. Core learning, job search, and basic CV creation are 100% free forever.
        </p>
      </div>

      {/* Free Core vs Premium Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Essential Learner</span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Free Forever</h2>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white pt-2">€0</div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Everything needed to learn German, discover job vacancies, and generate your application files.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full access to Level A1 German curriculum</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited live Jobsuche Bundesagentur searches</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>German DIN 5008 CV & Anschreiben builder</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Kanban application tracker pipeline</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Earn coins daily by finishing quizzes</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/register"
            className="w-full text-center py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Coin Packages / Premium */}
        <div className="p-8 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-50/20 to-white dark:from-amber-950/20 dark:to-slate-900 shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> High-Speed Preparation
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Coin Packages</h2>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white pt-2">
                From €4.99 <span className="text-xs font-normal text-slate-400">/ 500 Coins</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              For candidates wanting intensive 1-on-1 mock interviews, specialized B2 medical modules, and extended speaking calls.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Speaking tandem sessions with native moderators</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Detailed CV review & German proofreading</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Specialized B2 Nursing & IT terminologies</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Simulated Embassy visa interview questions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Earn 100 bonus coins for every verified referral</span>
              </li>
            </ul>
          </div>

          <Link
            href="/auth/register"
            className="w-full text-center py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all"
          >
            Create Account to Explore
          </Link>
        </div>
      </div>

      {/* Financial Accounting Rules & Anti-Scam Notice */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-w-4xl mx-auto space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          Virtual Currency Governance Rules
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Virtual coins are strictly an internal platform mechanism to reward learning achievements and access
          moderated features. Coins have no cash redemption value, cannot be withdrawn, and cannot be transferred
          peer-to-peer. All transactions are logged in an immutable double-entry ledger.
        </p>
      </div>
    </div>
  );
}
