'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle,
  Flame,
  ArrowRight,
  BookCheck,
  BrainCircuit,
} from 'lucide-react';

const CEFR_LEVELS = [
  {
    code: 'A1',
    title: 'Beginner / Einstieg',
    modulesCount: 8,
    lessonsCount: 48,
    vocabularyCount: '650+ Words',
    targetHours: '60–80 Hours',
    focus: 'Alphabet, Pronunciation, Personal Introduction, Everyday Situations, Basic Numbers & Shopping',
    badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
  },
  {
    code: 'A2',
    title: 'Elementary / Grundlagen',
    modulesCount: 10,
    lessonsCount: 60,
    vocabularyCount: '1,200+ Words',
    targetHours: '100–120 Hours',
    focus: 'Past Tense (Perfekt/Präteritum), Living, Doctor Visits, Directions, Workplace Communication',
    badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800',
  },
  {
    code: 'B1',
    title: 'Intermediate / Selbstständig (Visa Threshold)',
    modulesCount: 12,
    lessonsCount: 72,
    vocabularyCount: '2,400+ Words',
    targetHours: '150–180 Hours',
    focus: 'Subjunctive II (Konjunktiv II), Passive Voice, Professional Emails, Apprenticeship Interviews, Opinions',
    badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800',
  },
  {
    code: 'B2',
    title: 'Vantage / Fachsprachliche Kompetenz',
    modulesCount: 12,
    lessonsCount: 75,
    vocabularyCount: '4,000+ Words',
    targetHours: '200–240 Hours',
    focus: 'Technical Documentation, Medical Handover Protocols, Complex Grammar, Contract Law Basics',
    badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800',
  },
];

export default function GermanLearningPage() {
  const [activeLevel, setActiveLevel] = useState('A1');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300/40">
          <BookOpen className="w-3.5 h-3.5" />
          CEFR Standard German Curriculum
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          German Learning Platform (A1 – B2)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Structured step-by-step German curriculum customized specifically for vocational students. Available with
          trilingual explanations in Bengali, English, and German.
        </p>
      </div>

      {/* Gamification Banner: Streaks & Coins */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-base">Earn Daily Streaks & Virtual Coins</h3>
            <p className="text-xs text-slate-300">
              Complete at least 1 lesson daily to maintain your streak and unlock free speaking tandem calls.
            </p>
          </div>
        </div>
        <Link
          href="/auth/register"
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shrink-0"
        >
          Start A1 Lesson 1 Free
        </Link>
      </div>

      {/* CEFR Level Selection Tabs */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
          {CEFR_LEVELS.map((lvl) => (
            <button
              key={lvl.code}
              onClick={() => setActiveLevel(lvl.code)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                activeLevel === lvl.code
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              Level {lvl.code}
            </button>
          ))}
        </div>

        {/* Selected Level Deep Dive */}
        {CEFR_LEVELS.filter((l) => l.code === activeLevel).map((lvl) => (
          <div
            key={lvl.code}
            className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-8 animate-in fade-in duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${lvl.badgeColor}`}>
                  Level {lvl.code}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{lvl.title}</h2>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white text-sm">{lvl.lessonsCount}</span>
                  Lessons
                </div>
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white text-sm">{lvl.vocabularyCount}</span>
                  Vocabulary
                </div>
                <div>
                  <span className="block font-bold text-slate-900 dark:text-white text-sm">{lvl.targetHours}</span>
                  Study Time
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  Key Curriculum Focus Areas
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {lvl.focus}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <BookCheck className="w-4 h-4 text-emerald-600" />
                  Interactive Exercise Formats
                </h3>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Vocabulary trainer with native German audio and Bengali/English translations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Grammar drill tables with color-coded gender articles (der = blue, die = red, das = green)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Server-verified multiple-choice quizzes with instant answer rationale</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                Enroll in Level {lvl.code} Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
