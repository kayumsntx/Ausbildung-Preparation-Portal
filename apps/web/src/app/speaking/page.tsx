'use client';

import React from 'react';
import Link from 'next/link';
import {
  Video,
  ShieldAlert,
  UserCheck,
  Lock,
  Headphones,
  ArrowRight,
} from 'lucide-react';

export default function SpeakingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300/40">
          <Video className="w-3.5 h-3.5 text-amber-500" />
          WebRTC Tandem Community
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Safe Audio & Video German Speaking Practice
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Overcome speaking anxiety and prepare for live German employer interviews with verified peer learners
          and native speakers under strict safety, consent, and privacy protocols.
        </p>
      </div>

      {/* Safety & Consent First (High Priority UX) */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Privacy, Consent & Anti-Harassment Safeguards</h2>
            <p className="text-xs text-slate-300">Your safety and comfort are non-negotiable architectural requirements.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Configurable Gender Preferences</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Voluntarily set incoming and outgoing preferences (male, female, or any). Respects personal boundaries.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-sm">One-Tap Block & Instant Report</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Immediate disconnection and account blocking. Moderation team investigates reports with zero tolerance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <Headphones className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Camera Optional & Zero Recording</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calls are pure WebRTC streams. No calls are recorded or stored on server disks by default.
            </p>
          </div>
        </div>
      </div>

      {/* How a Tandem Call Works (3 Steps) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          How Speaking Tandems Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Configure Your Profile</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your CEFR level (e.g. B1), preferred practice topics (Healthcare, IT, Self-introduction), and calling hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Mutual Consent Request</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send or receive a tandem invitation. No call can initiate without explicit bidirectional acceptance.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Live Guided Conversation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connect via HD audio or video with contextual German prompt cards on screen to guide discussion.
            </p>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            Join the Speaking Community <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
