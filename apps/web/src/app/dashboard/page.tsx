'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Flame,
  Coins,
  Briefcase,
  Video,
  Award,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function StudentDashboardPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'applications' | 'courses' | 'speaking'>('overview');

  // Realistic mock data reflecting backend getStudentDashboard endpoint
  const candidate = {
    name: 'Rahim Khan',
    email: 'rahim.khan@example.de',
    targetField: 'Pflegefachkraft (General Nursing)',
    targetCity: 'München, Bayern',
    currentLevel: 'B1',
    walletBalance: 450,
    streakDays: 7,
    avgQuizAccuracy: 88,
    completedLessons: 42,
    totalLessons: 60,
    cefrBreakdown: {
      A1: { completed: 20, total: 20, pct: 100 },
      A2: { completed: 18, total: 20, pct: 90 },
      B1: { completed: 4, total: 20, pct: 20 },
      B2: { completed: 0, total: 20, pct: 0 },
    },
    applications: [
      {
        id: 'app-1',
        title: 'Ausbildung zum Pflegefachmann (m/w/d)',
        employer: 'Klinikum Großhadern München',
        city: 'München',
        status: 'INTERVIEW',
        statusColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        interviewDate: '28. Okt 2026, 10:30 CET',
        stipend: '€1,340 / month',
      },
      {
        id: 'app-2',
        title: 'Auszubildender Pflege (m/w/d)',
        employer: 'Asklepios Kliniken Hamburg',
        city: 'Hamburg',
        status: 'APPLIED',
        statusColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        appliedDate: '18. Okt 2026',
        stipend: '€1,280 / month',
      },
      {
        id: 'app-3',
        title: 'Pflegefachassistent Ausbildung 2027',
        employer: 'Charité Universitätsmedizin Berlin',
        city: 'Berlin',
        status: 'PLANNED',
        statusColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        stipend: '€1,310 / month',
      },
    ],
    courses: [
      {
        id: 'c-1',
        title: 'Medizinisches Deutsch für Pflegeberufe',
        progress: 100,
        certificate: {
          code: 'CERT-2026-NURS-9921',
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
          issuedDate: '15. Okt 2026',
        },
      },
      {
        id: 'c-2',
        title: 'German Workplace Culture & Labor Rights (BGB / ArbZG)',
        progress: 65,
        certificate: null,
      },
    ],
    speaking: {
      totalCalls: 8,
      avgStars: 4.9,
      receivedBadges: ['Sehr freundlich', 'Gute Aussprache', 'Hilfreich'],
      recentPartner: 'Lukas M. (Native Speaker, Munich)',
    },
    recentActivities: [
      { type: 'COIN', title: '+50 Coins for 7-Day Flame Streak Milestone', time: '1 hour ago' },
      { type: 'APPLICATION', title: 'Interview Invitation confirmed with Klinikum Großhadern', time: 'Yesterday' },
      { type: 'QUIZ', title: 'Scored 90% in B1 Konjunktiv II Medical Practice Quiz', time: '2 days ago' },
      { type: 'SPEAKING', title: 'Completed 15-min vocational dialog with Lukas M.', time: '3 days ago' },
      { type: 'CERT', title: 'Earned digital SHA-256 certificate in Medical German', time: '7 days ago' },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Greeting */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 blur-3xl -z-10 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Target Pathway: {candidate.targetField}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Willkommen zurück, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{candidate.name}</span>!
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Track your German proficiency milestones, active vocational job applications in {candidate.targetCity}, and verified credentials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/german-learning"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Next German Lesson
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <Briefcase className="w-4 h-4" />
                Search Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Real-time KPI Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* German CEFR Level Progress */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">German Level</span>
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <GraduationCap className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black">{candidate.currentLevel} Working</div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{candidate.completedLessons}/{candidate.totalLessons} Lessons</span>
              <span className="font-semibold text-blue-500">{Math.round((candidate.completedLessons / candidate.totalLessons) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${(candidate.completedLessons / candidate.totalLessons) * 100}%` }}
              />
            </div>
          </div>

          {/* Flame Streak Days */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Streak</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Flame className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-amber-500">{candidate.streakDays} Days</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              +50 Bonus Coins Unlocked!
            </p>
          </div>

          {/* Coin Wallet Balance */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Coin Balance</span>
              <span className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Coins className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-yellow-500">{candidate.walletBalance} Coins</div>
            <Link
              href="/pricing"
              className="mt-2 text-xs font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              Get More Coins <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Speaking Rating */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Speaking Rating</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Video className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-500">{candidate.speaking.avgStars} ★</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {candidate.speaking.totalCalls} Tandem Calls Completed
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'learning', label: 'German Curriculum' },
            { id: 'applications', label: 'Job Applications' },
            { id: 'courses', label: 'Certificates & Courses' },
            { id: 'speaking', label: 'Speaking Practice' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Main Activities & Pipeline */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Pipeline Kanban Snapshot */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <h2 className="text-base font-bold">Active Application Pipeline</h2>
                  </div>
                  <Link href="/jobs" className="text-xs font-semibold text-blue-500 hover:underline flex items-center gap-1">
                    Full Tracker <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {candidate.applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${app.statusColor}`}>
                            {app.status}
                          </span>
                          <span className="text-xs text-slate-500">{app.city}</span>
                        </div>
                        <h3 className="text-sm font-bold">{app.title}</h3>
                        <p className="text-xs text-slate-500">{app.employer}</p>
                      </div>

                      <div className="text-right sm:self-center flex sm:flex-col items-center sm:items-end justify-between gap-1">
                        <span className="text-xs font-semibold text-emerald-500">{app.stipend}</span>
                        {app.interviewDate && (
                          <span className="text-[11px] font-medium text-amber-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {app.interviewDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CEFR Level Breakdown Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-base font-bold">CEFR German Learning Journey</h2>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Quiz Accuracy: {candidate.avgQuizAccuracy}%</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(candidate.cefrBreakdown).map(([lvl, data]) => (
                    <div
                      key={lvl}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-center space-y-2"
                    >
                      <div className="text-lg font-black text-blue-600 dark:text-blue-400">{lvl}</div>
                      <div className="text-xs text-slate-500">
                        {data.completed}/{data.total} lessons
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-full rounded-full"
                          style={{ width: `${data.pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{data.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Timeline & Badges */}
            <div className="space-y-6">
              {/* Recent Activity Timeline */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <h2 className="text-base font-bold">Recent Milestones</h2>
                </div>

                <div className="space-y-4">
                  {candidate.recentActivities.map((act, idx) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{act.title}</p>
                        <span className="text-[11px] text-slate-400">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Certificate Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-500/5 to-transparent">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-base font-bold">Verified Credentials</h2>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Official certificates generated with cryptographic SHA-256 verification hashes recognized by German employers.
                </p>

                {candidate.courses.filter(c => c.certificate).map(c => (
                  <div key={c.id} className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{c.title}</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 break-all">
                      Hash: {c.certificate?.sha256.slice(0, 24)}...
                    </p>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">{c.certificate?.issuedDate}</span>
                      <Link href="/courses" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                        View Certificate
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: German Learning Tab */}
        {activeTab === 'learning' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">German Language Curriculum (A1–B2)</h2>
                <p className="text-xs text-slate-500">Interactive grammar, vocabulary lists with native pronunciation, and server-scored quizzes.</p>
              </div>
              <Link
                href="/german-learning"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Go to Classroom <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Vocational'].map((lvl, index) => (
                <div key={lvl} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{lvl}</span>
                    <span className="text-xs font-semibold text-blue-500">
                      {index === 0 ? '100% Completed' : index === 1 ? '90% In Progress' : index === 2 ? '20% Active' : 'Locked'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${index === 0 ? 100 : index === 1 ? 90 : index === 2 ? 20 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {index === 0
                      ? 'Essential greetings, DIN date formats, introducing yourself in Germany.'
                      : index === 1
                      ? 'Daily routines, public transport, doctor visits, vocational vocabulary.'
                      : index === 2
                      ? 'Workplace safety, patient handovers, technical manuals, email writing.'
                      : 'Advanced negotiation, German labor contracts, complex documentation.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Applications Tracker */}
        {activeTab === 'applications' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Ausbildung Job Pipeline</h2>
                <p className="text-xs text-slate-500">Track and manage every stage of your vocational training applications in Germany.</p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Search Bundesagentur Jobs <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {candidate.applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${app.statusColor}`}>
                        {app.status}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{app.city}</span>
                    </div>
                    <h3 className="text-base font-bold">{app.title}</h3>
                    <p className="text-xs text-slate-500">{app.employer}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-500 block">{app.stipend}</span>
                      {app.interviewDate && (
                        <span className="text-xs text-amber-500 font-medium">{app.interviewDate}</span>
                      )}
                    </div>
                    <Link
                      href="/toolkit"
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      DIN 5008 CV
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Courses & Certificates */}
        {activeTab === 'courses' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Vocational LMS & Certificates</h2>
                <p className="text-xs text-slate-500">Specialist vocational training with verifiable digital certificate generation.</p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Browse Course Catalog <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidate.courses.map((course) => (
                <div key={course.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">{course.title}</h3>
                    <span className="text-xs font-bold text-emerald-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                  {course.certificate ? (
                    <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">Certificate Verified: {course.certificate.code}</div>
                      <div className="font-mono text-[10px] text-slate-500 break-all">{course.certificate.sha256}</div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Complete remaining lessons to earn your verified PDF certificate.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Speaking Practice */}
        {activeTab === 'speaking' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Speaking Tandem & Mock Interviews</h2>
                <p className="text-xs text-slate-500">Live peer matchmaking with vocational dialog cue cards and rating reviews.</p>
              </div>
              <Link
                href="/speaking"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Enter Matchmaking Pool <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-center space-y-2">
                <div className="text-3xl font-black text-emerald-500">{candidate.speaking.avgStars} ★</div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Average Partner Rating</div>
                <p className="text-xs text-slate-400">Based on 8 verified peer conversations</p>
              </div>

              <div className="md:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-3">
                <h3 className="font-bold text-sm">Earned Speaking Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.speaking.receivedBadges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    >
                      🏆 {badge}
                    </span>
                  ))}
                </div>
                <div className="pt-2 text-xs text-slate-500">
                  Last Partner: <span className="font-semibold text-slate-700 dark:text-slate-300">{candidate.speaking.recentPartner}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
