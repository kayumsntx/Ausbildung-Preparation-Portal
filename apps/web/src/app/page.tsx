'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_JOBS } from '@/data/mockData';
import {
  BookOpen,
  Briefcase,
  Video,
  FileText,
  Award,
  Coins,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-16 lg:gap-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 lg:pt-16 pb-12 lg:pb-20 border-b border-slate-200/60 dark:border-slate-800/60">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* German Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-500/30 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {t.hero.titleLine1}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
                {t.hero.titleHighlight}
              </span>
              <br />
              <span className="text-slate-800 dark:text-slate-200 text-2xl sm:text-4xl lg:text-5xl font-bold">
                {t.hero.titleLine2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/german-learning"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
              >
                <BookOpen className="w-4 h-4" />
                {t.hero.ctaPrimary}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs transition-all"
              >
                <Briefcase className="w-4 h-4 text-amber-500" />
                {t.hero.ctaSecondary}
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="pt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {t.hero.statCandidates}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t.hero.statCandidatesLabel}
                </div>
              </div>
              <div className="space-y-1 border-x border-slate-200 dark:border-slate-800">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {t.hero.statJobs}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t.hero.statJobsLabel}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {t.hero.statSuccessRate}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {t.hero.statSuccessRateLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-STEP PATHWAY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.pathway.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.pathway.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: t.pathway.step1Title, desc: t.pathway.step1Desc, step: '01', icon: BookOpen },
            { title: t.pathway.step2Title, desc: t.pathway.step2Desc, step: '02', icon: FileText },
            { title: t.pathway.step3Title, desc: t.pathway.step3Desc, step: '03', icon: Briefcase },
            { title: t.pathway.step4Title, desc: t.pathway.step4Desc, step: '04', icon: Video },
            { title: t.pathway.step5Title, desc: t.pathway.step5Desc, step: '05', icon: Award },
          ].map((item, idx) => (
            <div
              key={item.step || `pathway-step-${idx}`}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE INTEGRATED MODULES (6 CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.features.title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: t.features.germanTitle,
              desc: t.features.germanDesc,
              icon: BookOpen,
              href: '/german-learning',
              tag: 'A1–B2 Curriculum',
              color: 'text-blue-600 dark:text-blue-400',
              bgColor: 'bg-blue-50 dark:bg-blue-950/50',
            },
            {
              title: t.features.jobsTitle,
              desc: t.features.jobsDesc,
              icon: Briefcase,
              href: '/jobs',
              tag: 'Bundesagentur API',
              color: 'text-emerald-600 dark:text-emerald-400',
              bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
            },
            {
              title: t.features.cvTitle,
              desc: t.features.cvDesc,
              icon: FileText,
              href: '/auth/register',
              tag: 'DIN 5008 Standards',
              color: 'text-purple-600 dark:text-purple-400',
              bgColor: 'bg-purple-50 dark:bg-purple-950/50',
            },
            {
              title: t.features.speakingTitle,
              desc: t.features.speakingDesc,
              icon: Video,
              href: '/speaking',
              tag: 'WebRTC Tandem',
              color: 'text-amber-600 dark:text-amber-400',
              bgColor: 'bg-amber-50 dark:bg-amber-950/50',
            },
            {
              title: t.features.coinsTitle,
              desc: t.features.coinsDesc,
              icon: Coins,
              href: '/pricing',
              tag: 'Double-Entry Ledger',
              color: 'text-yellow-600 dark:text-yellow-400',
              bgColor: 'bg-yellow-50 dark:bg-yellow-950/50',
            },
            {
              title: t.features.coursesTitle,
              desc: t.features.coursesDesc,
              icon: Award,
              href: '/courses',
              tag: 'Vocational Prep',
              color: 'text-rose-600 dark:text-rose-400',
              bgColor: 'bg-rose-50 dark:bg-rose-950/50',
            },
          ].map((feat, i) => (
            <Link
              key={feat.href || `feature-${i}`}
              href={feat.href}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/40 dark:hover:border-blue-500/40 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${feat.bgColor} flex items-center justify-center ${feat.color}`}>
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {feat.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LIVE JOBS PREVIEW BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Job Feed Preview
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold">Featured Ausbildung Openings</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Synchronized with the German Federal Employment Agency (Jobsuche API).
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors self-start md:self-auto"
            >
              View All 25,000+ Openings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_JOBS.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.city} ({job.postalCode})</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">{job.title}</h3>
                  <p className="text-xs text-slate-300">{job.employer}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-400">{job.stipendYear1}</span>
                  <span className="text-[11px] text-slate-400">{job.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.ctaSection.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            {t.ctaSection.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all"
            >
              {t.ctaSection.buttonText}
            </Link>
          </div>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {t.ctaSection.guarantee}
          </p>
        </div>
      </section>
    </div>
  );
}
