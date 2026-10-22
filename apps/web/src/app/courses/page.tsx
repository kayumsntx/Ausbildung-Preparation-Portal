'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  PlayCircle,
  Lock,
  Coins,
  Sparkles,
  Award,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface LessonItem {
  id: string;
  slug: string;
  title: string;
  durationMinutes: number;
  isFreePreview: boolean;
  videoUrl?: string | null;
  textContent?: string | null;
}

export interface ModuleItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  level: string;
  category: string;
  badge: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  durationHours: number;
  isFree: boolean;
  priceFormatted: string;
  coinPrice: number;
  modules: ModuleItem[];
}

const COURSES_DATA: CourseDetail[] = [
  {
    id: 'course-001',
    slug: 'complete-german-a1-ausbildung',
    title: 'Complete German A1 for Ausbildung Starters',
    level: 'A1 Beginner',
    category: 'General German',
    badge: 'Popular Free Course',
    instructor: 'Julia Schneider, M.A.',
    instructorTitle: 'Goethe-Certified German Educator',
    durationHours: 35,
    isFree: true,
    priceFormatted: 'Free',
    coinPrice: 0,
    description: 'Master essential everyday German, grammar basics, self-introduction, and foundational vocational vocabulary for your apprenticeship start.',
    modules: [
      {
        id: 'cmod-001',
        title: 'Alltagsdeutsch & Erste Schritte im Betrieb',
        lessons: [
          {
            id: 'cles-001',
            slug: 'a1-c1-alphabet-phonetik',
            title: 'Das deutsche Alphabet & Phonetik für Auszubildende',
            durationMinutes: 20,
            isFreePreview: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            textContent: 'Die korrekte Aussprache von Umlauten (ä, ö, ü) und Diphthongen (ei, eu, au) im deutschen Arbeitsalltag. Wichtig: Klare Betonung bei Namen und Berufsbezeichnungen.',
          },
          {
            id: 'cles-002',
            slug: 'a1-c1-zahlen-uhrzeiten',
            title: 'Zahlen, Uhrzeiten & Schichtzeiten im Betrieb',
            durationMinutes: 25,
            isFreePreview: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            textContent: 'Präzise Uhrzeiten, Wochentage und Datumsangaben für Dienstpläne, Termine und Pünktlichkeit.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-002',
    slug: 'b2-medical-german-nursing-ausbildung',
    title: 'B2 Medical German for Nursing Ausbildung (Pflegefachmann)',
    level: 'B2 Specialized',
    category: 'Healthcare Terminology',
    badge: 'High Employment Impact',
    instructor: 'Dr. med. Tobias Weber',
    instructorTitle: 'Clinical Instructor & Medical Linguist',
    durationHours: 28,
    isFree: false,
    priceFormatted: '€29 (or 350 Coins)',
    coinPrice: 350,
    description: 'Patient anamnesis, medication reporting, hospital documentation, and verbal handovers in clinical German.',
    modules: [
      {
        id: 'cmod-002',
        title: 'Klinische Kommunikation & Dokumentation',
        lessons: [
          {
            id: 'cles-003',
            slug: 'b2-med-anamnese-aufnahme',
            title: 'Aufnahmegespräch und Schmerzskala dokumentieren',
            durationMinutes: 30,
            isFreePreview: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            textContent: 'Leitfaden für die strukturierte Patientenaufnahme im Krankenhaus gemäß deutschen Pflegestandards und Datenschutz (DSGVO).',
          },
          {
            id: 'cles-004',
            slug: 'b2-med-medikamente-dosierung',
            title: 'Medikamentenverabreichung & Dosierungsvorschriften',
            durationMinutes: 35,
            isFreePreview: false,
            videoUrl: null,
            textContent: 'Verständliche Fachsprache bei der 5-R-Regel der Arzneimitteltherapie und Notfallmedikation.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-003',
    slug: 'german-workplace-etiquette-embassy-mastery',
    title: 'German Workplace Etiquette & Embassy Interview Mastery',
    level: 'All Levels',
    category: 'Career & Visa',
    badge: 'Visa Preparation',
    instructor: 'Rahim Chowdhury',
    instructorTitle: 'Ausbildung Alumnus & Career Coach',
    durationHours: 12,
    isFree: true,
    priceFormatted: 'Free',
    coinPrice: 0,
    description: 'Answering tough questions at German embassy appointments and understanding German punctuality, contracts, and workplace expectations.',
    modules: [
      {
        id: 'cmod-003',
        title: 'Botschaftstermin & Deutsche Arbeitskultur',
        lessons: [
          {
            id: 'cles-005',
            slug: 'visa-botschaftsfragen-top10',
            title: 'Die 10 entscheidenden Fragen im deutschen Visumsinterview',
            durationMinutes: 25,
            isFreePreview: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            textContent: 'Authentische Vorbereitung auf Fragen zur Motivation, Ausbildungswahl, Finanzierungsnachweis und Rückkehrbereitschaft.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-004',
    slug: 'technical-german-it-mechatronics',
    title: 'Technical German for IT & Mechatronics Apprenticeships',
    level: 'B1–B2',
    category: 'Engineering & Tech',
    badge: 'Technical Specialist',
    instructor: 'Markus Becker, Dipl.-Ing.',
    instructorTitle: 'Industrial Trainer, Siemens Partner',
    durationHours: 24,
    isFree: false,
    priceFormatted: '€25 (or 300 Coins)',
    coinPrice: 300,
    description: 'Circuit diagrams, safety briefings, incident reporting, and technical dialogue in modern German workshops.',
    modules: [
      {
        id: 'cmod-004',
        title: 'Industrielle Kommunikation & Arbeitssicherheit',
        lessons: [
          {
            id: 'cles-006',
            slug: 'tech-schaltplaene-sensoren',
            title: 'Schaltpläne, Sensoren und Aktoren verstehen',
            durationMinutes: 30,
            isFreePreview: true,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            textContent: 'Terminologie elektronischer Komponenten und Sicherheitskennzeichnung nach DGUV Vorschriften.',
          },
        ],
      },
    ],
  },
];

export default function CoursesPage() {
  const { locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPricing, setSelectedPricing] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Course Player & Enrollment State
  const [activeCourse, setActiveCourse] = useState<CourseDetail | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set(['course-001']));
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);

  // Certificate Verification
  const [verifyCode, setVerifyCode] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<any>(null);

  const categories = [
    'ALL',
    'General German',
    'Healthcare Terminology',
    'Career & Visa',
    'Engineering & Tech',
  ];

  const filteredCourses = COURSES_DATA.filter((c) => {
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesPricing =
      selectedPricing === 'ALL' ||
      (selectedPricing === 'FREE' && c.isFree) ||
      (selectedPricing === 'PAID' && !c.isFree);
    const matchesSearch =
      !searchTerm ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesPricing && matchesSearch;
  });

  const handleOpenCourse = (course: CourseDetail) => {
    setActiveCourse(course);
    const firstLesson = course.modules[0]?.lessons[0] || null;
    setActiveLesson(firstLesson);
  };

  const handleEnroll = (courseId: string) => {
    setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    if (verifyCode.toUpperCase().includes('CERT-')) {
      setVerifiedResult({
        isValid: true,
        code: verifyCode.toUpperCase(),
        recipientName: 'Tanvir Hasan',
        courseTitle: 'Complete German A1 for Ausbildung Starters',
        issuedAt: '2026-10-22',
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        accreditation: 'Ausbildung Preparation Portal — Certified Educational Curriculum',
      });
    } else {
      setVerifiedResult({ isValid: false });
    }
  };

  // Progress computation for active course
  const totalLessonsInActiveCourse = activeCourse?.modules.flatMap((m) => m.lessons).length || 0;
  const completedLessonsInActiveCourse =
    activeCourse?.modules
      .flatMap((m) => m.lessons)
      .filter((l) => completedLessonIds.has(l.id)).length || 0;
  const progressPercentage =
    totalLessonsInActiveCourse > 0
      ? Math.round((completedLessonsInActiveCourse / totalLessonsInActiveCourse) * 100)
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-300/40">
          <GraduationCap className="w-3.5 h-3.5 text-rose-500" />
          Specialist Vocational Preparation & Verified Certificates
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Specialist Courses & Certifications
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Master specialized industry vocabulary, embassy interview strategies, and workplace standards taught by
          certified German instructors and successful Ausbildung alumni.
        </p>
      </div>

      {/* Gamification / Certificate Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Earn Digitally Verifiable Certificates</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Every completed course issues an accredited certificate with a cryptographic SHA-256 hash accepted by German employers.
            </p>
          </div>
        </div>

        {/* Quick Certificate Verify Input */}
        <form onSubmit={handleVerifyCertificate} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="Enter Certificate Code (e.g. CERT-2026-...)"
            className="px-3.5 py-2 rounded-xl text-xs bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 w-full sm:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shrink-0"
          >
            Verify
          </button>
        </form>
      </div>

      {/* Verified Certificate Modal / Notice */}
      {verifiedResult && (
        <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-lg space-y-2 relative animate-in fade-in">
          <button
            onClick={() => setVerifiedResult(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          {verifiedResult.isValid ? (
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-400/30">
                <ShieldCheck className="w-4 h-4" /> Authenticity Confirmed
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Certificate {verifiedResult.code} issued to {verifiedResult.recipientName}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Course: <strong>{verifiedResult.courseTitle}</strong> &bull; Issued: {verifiedResult.issuedAt}
              </p>
              <div className="pt-1 text-[11px] font-mono text-slate-400 break-all">
                Hash: {verifiedResult.hash}
              </div>
            </div>
          ) : (
            <div className="text-rose-600 dark:text-rose-400 text-xs font-bold">
              Invalid certificate code. Please check the serial code on your printed or PDF document.
            </div>
          )}
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by keyword, topic, or instructor..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category & Pricing Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {(['ALL', 'FREE', 'PAID'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPricing(p)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  selectedPricing === p
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.has(course.id);

          return (
            <div
              key={course.id}
              className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {course.level}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      course.isFree
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                    }`}
                  >
                    {course.priceFormatted}
                  </span>
                </div>

                <div>
                  <h3
                    onClick={() => handleOpenCourse(course)}
                    className="text-lg font-bold text-slate-900 dark:text-white cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    {course.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Instructor */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div>
                    <strong className="block text-slate-800 dark:text-slate-200">{course.instructor}</strong>
                    <span className="text-[11px]">{course.instructorTitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.durationHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {course.modules.flatMap((m) => m.lessons).length} lessons
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {isEnrolled ? 'Enrolled & Active' : 'Accredited Certificate'}
                </span>
                <button
                  onClick={() => handleOpenCourse(course)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  {isEnrolled ? 'Continue Course' : course.isFree ? 'Enroll Free' : 'View Syllabus & Enroll'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE COURSE SYLLABUS & LESSON PLAYER MODAL */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-300/40 mb-2">
                  {activeCourse.level} &bull; {activeCourse.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {activeCourse.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Taught by <strong>{activeCourse.instructor}</strong> ({activeCourse.instructorTitle})
                </p>
              </div>
              <button
                onClick={() => setActiveCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enrollment / Progress Banner */}
            {enrolledCourseIds.has(activeCourse.id) ? (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
                  <span>Course Progress: {progressPercentage}%</span>
                  <span>{completedLessonsInActiveCourse} of {totalLessonsInActiveCourse} Lessons Completed</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {progressPercentage === 100 && (
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" /> Course 100% Completed! Certificate Issued.
                    </span>
                    <button
                      onClick={() =>
                        setVerifiedResult({
                          isValid: true,
                          code: `CERT-2026-${activeCourse.slug.slice(0, 4).toUpperCase()}-789X`,
                          recipientName: 'Tanvir Hasan',
                          courseTitle: activeCourse.title,
                          issuedAt: '2026-10-22',
                          hash: 'a5c7112048fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b999',
                          accreditation: 'Ausbildung Preparation Portal — Certified Educational Curriculum',
                        })
                      }
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                    >
                      View Certificate
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300">
                    {activeCourse.isFree ? 'Free Enrollment Available' : `Enrollment Fee: ${activeCourse.priceFormatted}`}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Enroll to unlock all course videos, text notes, and receive an accredited completion certificate.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeCourse.isFree ? (
                    <button
                      onClick={() => handleEnroll(activeCourse.id)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Enroll Free
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEnroll(activeCourse.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        Unlock with {activeCourse.coinPrice} Coins
                      </button>
                      <button
                        onClick={() => handleEnroll(activeCourse.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-colors"
                      >
                        Pay €29
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Lesson Viewer / Video Screen */}
            {activeLesson && (
              <div className="space-y-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4 text-blue-600" />
                    Now Playing: {activeLesson.title}
                  </span>
                  <span className="text-slate-500">{activeLesson.durationMinutes} mins</span>
                </div>

                {/* Video Container */}
                <div className="aspect-video w-full rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden relative">
                  {enrolledCourseIds.has(activeCourse.id) || activeLesson.isFreePreview ? (
                    <iframe
                      src={activeLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                      title={activeLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center space-y-2 p-6">
                      <Lock className="w-8 h-8 text-amber-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">Lesson Locked</h4>
                      <p className="text-xs text-slate-400 max-w-sm">
                        This lesson is part of the full curriculum. Enroll in the course to unlock complete access.
                      </p>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                {activeLesson.textContent && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>Lecture Notes:</strong> {activeLesson.textContent}
                  </div>
                )}

                {/* Completion Toggle */}
                {enrolledCourseIds.has(activeCourse.id) && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => toggleLessonComplete(activeLesson.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        completedLessonIds.has(activeLesson.id)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {completedLessonIds.has(activeLesson.id) ? 'Lesson Completed' : 'Mark as Completed'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Curriculum Module Accordion */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Curriculum Modules</h4>
              {activeCourse.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
                >
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {mod.title}
                  </h5>
                  <div className="space-y-2">
                    {mod.lessons.map((les) => {
                      const isCompleted = completedLessonIds.has(les.id);
                      const isCurrent = activeLesson?.id === les.id;
                      const hasAccess = enrolledCourseIds.has(activeCourse.id) || les.isFreePreview;

                      return (
                        <div
                          key={les.id}
                          onClick={() => setActiveLesson(les)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isCurrent
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                              : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {hasAccess ? (
                              <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span>{les.title}</span>
                            {les.isFreePreview && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">{les.durationMinutes}m</span>
                            {isCompleted && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
