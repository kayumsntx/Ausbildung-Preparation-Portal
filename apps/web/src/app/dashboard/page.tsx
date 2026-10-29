'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Loader2,
  User as UserIcon,
  Mail,
  CheckCircle2,
  RefreshCw,
  LogIn,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface DashboardApplicationItem {
  id: string;
  title: string;
  employer: string;
  city: string;
  status: string;
  stipend: string;
  interviewDate: string | null;
  appliedAt: string;
}

interface DashboardCourseItem {
  id: string;
  courseId: string;
  title: string;
  status: string;
  progressPercentage: number;
}

interface DashboardCertificateItem {
  id: string;
  courseTitle: string;
  verificationCode: string;
  sha256Hash: string;
  issuedAt: string;
}

interface StudentDashboardData {
  candidate: {
    id: string;
    email: string;
    profile?: {
      firstName?: string | null;
      lastName?: string | null;
      preferredLanguage?: string | null;
      targetAusbildungField?: string | null;
      phoneNumber?: string | null;
    } | null;
    roles: string[];
  };
  learning: {
    completedLessonsCount: number;
    inProgressLessonsCount: number;
    levelCounts: Record<string, number>;
    totalQuizAttempts: number;
    avgQuizScore: number;
  };
  applications: {
    savedJobsCount: number;
    funnel: {
      PLANNED: number;
      APPLIED: number;
      INTERVIEW: number;
      OFFER: number;
      REJECTED: number;
      WITHDRAWN: number;
      total: number;
    };
    items?: DashboardApplicationItem[];
  };
  courses: {
    activeEnrollments: number;
    completedCourses: number;
    certificates: DashboardCertificateItem[];
    items?: DashboardCourseItem[];
  };
  speaking: {
    totalSessions: number;
    hostedCount: number;
    joinedCount: number;
    averageRating: number;
    totalRatingsReceived: number;
  };
  wallet: {
    balance: number;
    streakDays: number;
    lastStreakClaim: string | null;
    badges: Array<{ badgeType: string; unlockedAt: string }>;
  };
  recentActivity: Array<{
    type: string;
    title: string;
    timestamp: string;
  }>;
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'INTERVIEW':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'OFFER':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'APPLIED':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'REJECTED':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    default:
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
  }
}

function formatDateShort(isoString?: string | null): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function StudentDashboardPage() {
  useLanguage();
  const { user, accessToken, isAuthenticated, isLoading: authLoading, displayName } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'learning' | 'applications' | 'courses' | 'speaking'>('overview');
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!accessToken) return;
    setFetching(true);
    setFetchError(null);
    try {
      const res = await fetch('/api/v1/dashboard/student', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(
          errBody?.message ||
            errBody?.error?.message ||
            `Could not load dashboard metrics (HTTP ${res.status})`,
        );
      }

      const body = await res.json();
      const payload: StudentDashboardData = body?.data || body;
      setDashboardData(payload);
    } catch (err: any) {
      setFetchError(err?.message || 'Unable to load latest metrics from server.');
    } finally {
      setFetching(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadDashboard();
    }
  }, [isAuthenticated, accessToken, loadDashboard]);

  if (authLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3 px-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Loading your authenticated profile...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-5 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Sign In Required
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Please sign in to your account or register a new candidate profile to view your live German progress, job applications, and coin wallet.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/auth/login"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derive real user & database values from AuthContext + backend response
  const profile = dashboardData?.candidate?.profile || user.profile;
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim() ||
    displayName ||
    user.email;
  const userEmail = dashboardData?.candidate?.email || user.email;
  const targetField =
    profile?.targetAusbildungField || 'Ausbildung Vocational Pathway in Germany';
  const roles = dashboardData?.candidate?.roles || user.roles || ['STUDENT'];

  const completedLessons = dashboardData?.learning?.completedLessonsCount ?? 0;
  const totalLessons = 60;
  const lessonProgressPct = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

  const levelCounts = dashboardData?.learning?.levelCounts || { A1: 0, A2: 0, B1: 0, B2: 0 };
  const currentLevel =
    (levelCounts.B2 ?? 0) > 0
      ? 'B2'
      : (levelCounts.B1 ?? 0) > 0
      ? 'B1'
      : (levelCounts.A2 ?? 0) > 0
      ? 'A2'
      : 'A1';

  const cefrBreakdown = {
    A1: {
      completed: levelCounts.A1 ?? 0,
      total: 15,
      pct: Math.min(100, Math.round(((levelCounts.A1 ?? 0) / 15) * 100)),
    },
    A2: {
      completed: levelCounts.A2 ?? 0,
      total: 15,
      pct: Math.min(100, Math.round(((levelCounts.A2 ?? 0) / 15) * 100)),
    },
    B1: {
      completed: levelCounts.B1 ?? 0,
      total: 15,
      pct: Math.min(100, Math.round(((levelCounts.B1 ?? 0) / 15) * 100)),
    },
    B2: {
      completed: levelCounts.B2 ?? 0,
      total: 15,
      pct: Math.min(100, Math.round(((levelCounts.B2 ?? 0) / 15) * 100)),
    },
  };

  const walletBalance = dashboardData?.wallet?.balance ?? 0;
  const streakDays = dashboardData?.wallet?.streakDays ?? 0;
  const avgQuizAccuracy = dashboardData?.learning?.avgQuizScore ?? 0;
  const totalQuizAttempts = dashboardData?.learning?.totalQuizAttempts ?? 0;

  const speakingAvgStars = dashboardData?.speaking?.averageRating ?? 5.0;
  const speakingTotalCalls = dashboardData?.speaking?.totalSessions ?? 0;
  const unlockedBadges = dashboardData?.wallet?.badges ?? [];

  const applicationsList = dashboardData?.applications?.items ?? [];
  const savedJobsCount = dashboardData?.applications?.savedJobsCount ?? 0;
  const applicationFunnel = dashboardData?.applications?.funnel ?? {
    PLANNED: 0,
    APPLIED: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
    total: 0,
  };

  const coursesList = dashboardData?.courses?.items ?? [];
  const certificatesList = dashboardData?.courses?.certificates ?? [];

  const recentActivities =
    dashboardData?.recentActivity && dashboardData.recentActivity.length > 0
      ? dashboardData.recentActivity.map((act) => ({
          type: act.type,
          title: act.title,
          time: formatDateShort(act.timestamp),
        }))
      : [
          {
            type: 'ACCOUNT',
            title: `Account registered & connected (${userEmail})`,
            time: formatDateShort(user.createdAt) || 'Active now',
          },
        ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Real User Greeting */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Target Pathway: {targetField}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {roles.join(', ')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Willkommen,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                  {fullName}
                </span>
                !
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {userEmail}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  ID: {user.id.slice(0, 8)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={loadDashboard}
                disabled={fetching}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                title="Refresh live data from PostgreSQL"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
              <Link
                href="/german-learning"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Start German Lesson
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

          {fetchError && (
            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
              {fetchError}
            </div>
          )}
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
            <div className="text-2xl font-black">{currentLevel} Track</div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                {completedLessons}/{totalLessons} Lessons
              </span>
              <span className="font-semibold text-blue-500">{lessonProgressPct}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${lessonProgressPct}%` }}
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
            <div className="text-2xl font-black text-amber-500">{streakDays} Days</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {streakDays > 0 ? 'Keep your daily streak going!' : 'Complete a lesson to start your streak'}
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
            <div className="text-2xl font-black text-yellow-500">{walletBalance} Coins</div>
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
            <div className="text-2xl font-black text-emerald-500">{speakingAvgStars} ★</div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {speakingTotalCalls} Tandem Calls Completed
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Dashboard Overview' },
            { id: 'learning', label: 'German Curriculum' },
            { id: 'applications', label: `Job Applications (${applicationFunnel.total})` },
            { id: 'courses', label: `Certificates & Courses (${coursesList.length})` },
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
                    Full Tracker ({savedJobsCount} Saved) <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {applicationsList.length > 0 ? (
                  <div className="space-y-3">
                    {applicationsList.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadgeColor(
                                app.status,
                              )}`}
                            >
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
                              <Clock className="w-3 h-3" /> {formatDateShort(app.interviewDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      You have not tracked any Ausbildung job applications yet. Search live verified German openings and add them to your pipeline.
                    </p>
                    <Link
                      href="/jobs"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Explore German Jobs <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* CEFR Level Breakdown Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-base font-bold">CEFR German Learning Journey</h2>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Quiz Accuracy: {avgQuizAccuracy}% ({totalQuizAttempts} attempts)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(cefrBreakdown).map(([lvl, data]) => (
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
                  <h2 className="text-base font-bold">Recent Activity</h2>
                </div>

                <div className="space-y-4">
                  {recentActivities.map((act, idx) => (
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

                {certificatesList.length > 0 ? (
                  <div className="space-y-3">
                    {certificatesList.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {cert.courseTitle}
                          </span>
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 break-all">
                          Hash: {cert.sha256Hash.slice(0, 24)}...
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-400">{formatDateShort(cert.issuedAt)}</span>
                          <Link
                            href="/courses"
                            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                          >
                            View Certificate
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                    <p>No certificates earned yet. Complete a vocational course to unlock your SHA-256 certificate.</p>
                    <Link
                      href="/courses"
                      className="inline-block text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Browse Vocational Courses →
                    </Link>
                  </div>
                )}
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
                <p className="text-xs text-slate-500">
                  Interactive grammar, vocabulary lists with native pronunciation, and server-scored quizzes.
                </p>
              </div>
              <Link
                href="/german-learning"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Go to Classroom <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                [
                  { code: 'A1', title: 'A1 Beginner', desc: 'Essential greetings, DIN date formats, introducing yourself in Germany.' },
                  { code: 'A2', title: 'A2 Elementary', desc: 'Daily routines, public transport, doctor visits, vocational vocabulary.' },
                  { code: 'B1', title: 'B1 Intermediate', desc: 'Workplace safety, patient handovers, technical manuals, email writing.' },
                  { code: 'B2', title: 'B2 Vocational', desc: 'Advanced negotiation, German labor contracts, complex documentation.' },
                ] as const
              ).map((lvl) => {
                const stats = cefrBreakdown[lvl.code];
                return (
                  <div
                    key={lvl.code}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{lvl.title}</span>
                      <span className="text-xs font-semibold text-blue-500">
                        {stats.completed}/{stats.total} Lessons ({stats.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${stats.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{lvl.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Applications Tracker */}
        {activeTab === 'applications' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Ausbildung Job Pipeline</h2>
                <p className="text-xs text-slate-500">
                  Track and manage every stage of your vocational training applications in Germany.
                </p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Search Bundesagentur Jobs <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {applicationsList.length > 0 ? (
              <div className="space-y-4">
                {applicationsList.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getStatusBadgeColor(
                            app.status,
                          )}`}
                        >
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
                          <span className="text-xs text-amber-500 font-medium">
                            {formatDateShort(app.interviewDate)}
                          </span>
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
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                <p className="text-sm font-semibold">No Job Applications Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Browse verified German Ausbildung listings or prepare your DIN 5008 CV in the Application Toolkit to start applying.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/jobs"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    href="/toolkit"
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Open CV Builder
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Courses & Certificates */}
        {activeTab === 'courses' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Vocational LMS & Certificates</h2>
                <p className="text-xs text-slate-500">
                  Specialist vocational training with verifiable digital certificate generation.
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
              >
                Browse Course Catalog <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {coursesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesList.map((course) => {
                  const matchingCert = certificatesList.find((c) => c.courseTitle === course.title);
                  return (
                    <div
                      key={course.id}
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm">{course.title}</h3>
                        <span className="text-xs font-bold text-emerald-500">
                          {course.progressPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${course.progressPercentage}%` }}
                        />
                      </div>
                      {matchingCert ? (
                        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs space-y-1">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400">
                            Certificate Verified: {matchingCert.verificationCode}
                          </div>
                          <div className="font-mono text-[10px] text-slate-500 break-all">
                            {matchingCert.sha256Hash}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">
                          Complete remaining lessons to earn your verified PDF certificate.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                <p className="text-sm font-semibold">No Enrolled Courses Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Enroll in specialized German nursing, IT, or workplace readiness courses to earn verified SHA-256 certificates.
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Explore Courses
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Speaking Practice */}
        {activeTab === 'speaking' && (
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Speaking Tandem & Mock Interviews</h2>
                <p className="text-xs text-slate-500">
                  Live peer matchmaking with vocational dialog cue cards and rating reviews.
                </p>
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
                <div className="text-3xl font-black text-emerald-500">{speakingAvgStars} ★</div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Average Partner Rating
                </div>
                <p className="text-xs text-slate-400">
                  Based on {speakingTotalCalls} verified peer conversation{speakingTotalCalls === 1 ? '' : 's'}
                </p>
              </div>

              <div className="md:col-span-2 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 space-y-3">
                <h3 className="font-bold text-sm">Earned Badges & Achievements</h3>
                {unlockedBadges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {unlockedBadges.map((badge, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        🏆 {badge.badgeType}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Complete tandem speaking sessions and daily German quizzes to unlock achievement badges.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
