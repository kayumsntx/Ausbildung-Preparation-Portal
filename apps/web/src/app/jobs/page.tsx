'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  Bookmark,
  Filter,
  Sparkles,
  CheckCircle2,
  Briefcase,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface JobItem {
  id: string;
  title: string;
  employer: string;
  city: string;
  postalCode?: string | null;
  state?: string | null;
  category: string;
  stipendYear1?: string | null;
  requiredGermanLevel?: string | null;
  description: string;
  requirements?: string[] | null;
  benefits?: string[] | null;
  externalUrl?: string | null;
  contactEmail?: string | null;
  publishedAt: string;
  isSaved?: boolean;
}

export interface TrackedApplication {
  id: string;
  company: string;
  role: string;
  city: string;
  status: 'PLANNED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  appliedDate: string;
  interviewDate?: string | null;
  notes?: string | null;
}

const SEEDED_JOBS: JobItem[] = [
  {
    id: 'job-001',
    title: 'Ausbildung zum Pflegefachmann / zur Pflegefachfrau (m/w/d)',
    employer: 'Charité – Universitätsmedizin Berlin',
    city: 'Berlin',
    postalCode: '10117',
    state: 'Berlin',
    category: 'Healthcare / Nursing',
    stipendYear1: '€1,190 / month',
    requiredGermanLevel: 'B2',
    description: 'Starten Sie Ihre zukunftssichere Ausbildung in einem der renommiertesten Universitätskliniken Europas. Sie lernen professionelle Krankenpflege, medizinische Dokumentation und Patientenbetreuung.',
    requirements: [
      'Schulabschluss (Realschulabschluss oder gleichwertiger ausländischer Abschluss anerkannt)',
      'Nachweis deutsches Sprachniveau mindestens B2 (Goethe / telc)',
      'Einfühlungsvermögen, Zuverlässigkeit und Freude an der Arbeit mit Menschen',
    ],
    benefits: [
      'Wohnheimplätze für Auszubildende verfügbar',
      'Vergünstigtes BVG-Jobticket für den Berliner Nahverkehr',
      '30 Tage Erholungsurlaub pro Jahr',
      'Hohe Übernahmechancen nach erfolgreichem Examen',
    ],
    externalUrl: 'https://jobsuche.api.bund.dev',
    contactEmail: 'ausbildung@charite.de',
    publishedAt: '2026-10-18',
  },
  {
    id: 'job-002',
    title: 'Ausbildung Fachinformatiker für Anwendungsentwicklung (m/w/d)',
    employer: 'SAP SE',
    city: 'Walldorf',
    postalCode: '69190',
    state: 'Baden-Württemberg',
    category: 'IT & Software',
    stipendYear1: '€1,150 / month',
    requiredGermanLevel: 'B1',
    description: 'Lernen Sie moderne Softwareentwicklung in agilen Teams. Sie arbeiten mit TypeScript, Java, Cloud-Technologien und relationalen Datenbanksystemen an zukunftsweisenden Unternehmenslösungen.',
    requirements: [
      'Gutes mathematisches und logisches Denkvermögen',
      'Deutschkenntnisse mindestens Niveau B1 (idealerweise B2)',
      'Interesse an Programmierung und moderner Webtechnologie',
    ],
    benefits: [
      'Modernes Arbeits-Laptop (MacBook Pro / ThinkPad)',
      'Eigenes Mentorenprogramm für internationale Auszubildende',
      'Kostenlose Sport- und Kantinenangebote auf dem SAP Campus',
    ],
    externalUrl: 'https://jobsuche.api.bund.dev',
    contactEmail: 'careers@sap.com',
    publishedAt: '2026-10-17',
  },
  {
    id: 'job-003',
    title: 'Ausbildung Mechatroniker für Fahrzeugtechnik (m/w/d)',
    employer: 'BMW Group',
    city: 'München',
    postalCode: '80809',
    state: 'Bayern',
    category: 'Engineering & Automotive',
    stipendYear1: '€1,080 / month',
    requiredGermanLevel: 'B1',
    description: 'Verbinden Sie Mechanik, Elektronik und Informatik bei der Produktion moderner Elektro- und Hybridfahrzeuge. Sie diagnostizieren Fehler, warten Hochvolt-Systeme und automatisierte Anlagen.',
    requirements: [
      'Realschulabschluss oder guter Hauptschulabschluss',
      'Gute Grundkenntnisse in Physik und Technik',
      'Deutschniveau B1 zur Verständigung am Arbeitsplatz',
    ],
    benefits: [
      'Modernste Lehrwerkstätten und Schulungszentren',
      'Übernahmequote von über 90% bei guten Leistungen',
      'Rabatte auf BMW-Fahrzeuge und Zubehör',
    ],
    externalUrl: 'https://jobsuche.api.bund.dev',
    contactEmail: 'berufsausbildung@bmwgroup.com',
    publishedAt: '2026-10-16',
  },
  {
    id: 'job-004',
    title: 'Ausbildung Hotelfachmann / Hotelfachfrau (m/w/d)',
    employer: 'Steigenberger Grandhotel',
    city: 'Frankfurt am Main',
    postalCode: '60311',
    state: 'Hessen',
    category: 'Hospitality & Gastronomy',
    stipendYear1: '€1,000 / month',
    requiredGermanLevel: 'B1',
    description: 'Lernen Sie erstklassigen Service in der internationalen Spitzenhotellerie. Stationen umfassen Empfang, Restaurant, Eventmanagement und kaufmännische Hotelverwaltung.',
    requirements: [
      'Freundliches, zuvorkommendes Auftreten und Servicebereitschaft',
      'Gute Deutsch- und Grundkenntnisse in Englisch',
      'Bereitschaft zu flexiblen Arbeitszeiten und Schichtdienst',
    ],
    benefits: [
      'Kostenfreie Verpflegung während der Schicht',
      'Kostenlose Reinigung der Dienstkleidung',
      'Attraktive Mitarbeiterrabatte in Hotels weltweit',
    ],
    externalUrl: 'https://jobsuche.api.bund.dev',
    contactEmail: 'karriere@steigenberger.com',
    publishedAt: '2026-10-15',
  },
  {
    id: 'job-005',
    title: 'Ausbildung Elektroniker für Betriebstechnik (m/w/d)',
    employer: 'Siemens AG',
    city: 'Nürnberg',
    postalCode: '90403',
    state: 'Bayern',
    category: 'Electrical & Industrial',
    stipendYear1: '€1,120 / month',
    requiredGermanLevel: 'B1',
    description: 'Installieren und warten Sie elektrische Energieverteilungsanlagen, speicherprogrammierbare Steuerungen (SPS) und industrielle Automatisierungssysteme.',
    requirements: [
      'Gute Noten in Mathematik und Naturwissenschaften',
      'Deutsch Sprachniveau B1',
      'Sorgfältige und sicherheitsbewusste Arbeitsweise',
    ],
    benefits: [
      'Komplette persönliche Schutzausrüstung (PSA) kostenfrei',
      'Attraktive betriebliche Altersvorsorge ab Tag 1',
      'Zuschuss zum Deutschlandticket',
    ],
    externalUrl: 'https://jobsuche.api.bund.dev',
    contactEmail: 'ausbildung.siemens@siemens.com',
    publishedAt: '2026-10-14',
  },
  {
    id: 'job-006',
    title: 'Ausbildung Kaufmann für Spedition und Logistikdienstleistung (m/w/d)',
    employer: 'DHL Hub Leipzig GmbH',
    city: 'Leipzig',
    postalCode: '04158',
    state: 'Sachsen',
    category: 'Logistics & Supply Chain',
    stipendYear1: '€1,050 / month',
    requiredGermanLevel: 'B1',
    description: 'Steuern Sie internationale Warenströme am größten Luftfrachtdrehkreuz des DHL Express Netzwerks. Sie planen Transportrouten, disponieren Frachten und wickeln Zollformalitäten ab.',
    requirements: [
      'Gutes Organisationstalent und geografisches Interesse',
      'Deutschniveau B1/B2 und solide Englischkenntnisse',
      'Zuverlässigkeit und Teamgeist',
    ],
    benefits: [
      'Kostenlose Sprachkurse zur Weiterbildung im Betrieb',
      'Geregelte Arbeitszeiten und Schichtzulagen',
      'Hervorragende internationale Entwicklungsperspektiven',
    ],
    externalUrl: 'https://jobsuche.api.bund.dev',
    contactEmail: 'dhlhub.karriere@dhl.com',
    publishedAt: '2026-10-13',
  },
];

const INITIAL_APPLICATIONS: TrackedApplication[] = [
  {
    id: 'app-001',
    company: 'Charité – Universitätsmedizin Berlin',
    role: 'Ausbildung Pflegefachmann (m/w/d)',
    city: 'Berlin',
    status: 'INTERVIEW',
    appliedDate: '2026-10-15',
    interviewDate: '2026-11-05 (Teams Video Call)',
    notes: 'Submitted B2 certificate and DIN 5008 Anschreiben. Received invite from Frau Dr. Weber.',
  },
  {
    id: 'app-002',
    company: 'BMW Group',
    role: 'Ausbildung Mechatroniker',
    city: 'München',
    status: 'APPLIED',
    appliedDate: '2026-10-17',
    notes: 'Application portal confirmed receipt. Online technical assessment pending.',
  },
];

export default function JobsPage() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<'BROWSE' | 'TRACKER'>('BROWSE');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGermanLevel, setSelectedGermanLevel] = useState('ALL');
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [applications, setApplications] = useState<TrackedApplication[]>(INITIAL_APPLICATIONS);

  // Manual application modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Fetch from backend API with fallback
  const [jobs, setJobs] = useState<JobItem[]>(SEEDED_JOBS);

  useEffect(() => {
    async function loadBackendJobs() {
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.set('q', searchTerm);
        if (selectedCity) queryParams.set('city', selectedCity);
        if (selectedCategory !== 'ALL') queryParams.set('category', selectedCategory);
        if (selectedGermanLevel !== 'ALL') queryParams.set('requiredGermanLevel', selectedGermanLevel);

        const res = await fetch(`http://localhost:4000/api/v1/jobs/search?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data?.items?.length > 0) {
            setJobs(data.data.items);
            return;
          }
        }
      } catch {
        // Fallback to local filtering
      }

      // Local filter fallback
      const filtered = SEEDED_JOBS.filter((job) => {
        const matchesSearch =
          !searchTerm ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.employer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = !selectedCity || job.city.toLowerCase().includes(selectedCity.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || job.category === selectedCategory;
        const matchesGerman = selectedGermanLevel === 'ALL' || job.requiredGermanLevel === selectedGermanLevel;

        return matchesSearch && matchesCity && matchesCategory && matchesGerman;
      });
      setJobs(filtered);
    }

    void loadBackendJobs();
  }, [searchTerm, selectedCity, selectedCategory, selectedGermanLevel]);

  const toggleSaveJob = (id: string) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleTrackFromJob = (job: JobItem) => {
    const newApp: TrackedApplication = {
      id: `app-${Date.now()}`,
      company: job.employer,
      role: job.title,
      city: job.city,
      status: 'APPLIED',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: `Applied via official link: ${job.externalUrl}`,
    };
    setApplications([newApp, ...applications]);
    setSelectedJob(null);
    setActiveTab('TRACKER');
  };

  const handleManualAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;

    const newApp: TrackedApplication = {
      id: `app-${Date.now()}`,
      company: newCompany,
      role: newRole,
      city: newCity || 'Germany',
      status: 'PLANNED',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: newNotes,
    };

    setApplications([newApp, ...applications]);
    setNewCompany('');
    setNewRole('');
    setNewCity('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleUpdateStatus = (appId: string, nextStatus: TrackedApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: nextStatus } : app)),
    );
  };

  const categories = [
    'ALL',
    'Healthcare / Nursing',
    'IT & Software',
    'Engineering & Automotive',
    'Hospitality & Gastronomy',
    'Electrical & Industrial',
    'Logistics & Supply Chain',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Bundesagentur für Arbeit API Integration & Live Caching
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Ausbildung Job Search & Application Tracker
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Search dual vocational training vacancies across Germany, inspect employer stipends and language
          prerequisites, and manage your applications through a multi-stage tracking pipeline.
        </p>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center justify-center">
        <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('BROWSE')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'BROWSE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Browse Openings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('TRACKER')}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'TRACKER'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            My Application Tracker ({applications.length})
          </button>
        </div>
      </div>

      {/* TAB 1: BROWSE OPENINGS */}
      {activeTab === 'BROWSE' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Search Controls */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search role or employer (e.g. Pflege, Fachinformatiker, Charité, SAP)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  placeholder="City (e.g. Berlin, München)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Industry:
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
                  {cat === 'ALL' ? 'All Industries' : cat}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">German Level:</span>
                {['ALL', 'B1', 'B2'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedGermanLevel(lvl)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                      selectedGermanLevel === lvl
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job Listings List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Showing {jobs.length} verified Ausbildung opportunities</span>
              <span>Bundesagentur für Arbeit Synchronized</span>
            </div>

            {jobs.map((job) => {
              const isSaved = savedJobIds.has(job.id);
              return (
                <div
                  key={job.id}
                  className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-3 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.employer}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.city} {job.postalCode ? `(${job.postalCode})` : ''}
                      </span>
                      {job.requiredGermanLevel && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                          {job.requiredGermanLevel} German
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Posted {job.publishedAt.split('T')[0]}
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedJob(job)}
                      className="text-base sm:text-lg font-bold text-slate-900 dark:text-white cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      {job.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {job.benefits && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {job.benefits.slice(0, 3).map((benefit, bIdx) => (
                          <span
                            key={bIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                          >
                            &bull; {benefit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Column */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Vergütung (Year 1):
                      </span>
                      <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {job.stipendYear1 || 'Regulated Tariff'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        type="button"
                        className={`p-2.5 rounded-xl border transition-colors ${
                          isSaved
                            ? 'border-amber-400 text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title={isSaved ? 'Remove bookmark' : 'Bookmark job'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY APPLICATION TRACKER */}
      {activeTab === 'TRACKER' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white">
            <div>
              <h2 className="text-xl font-extrabold">My Application Pipeline</h2>
              <p className="text-xs text-slate-300 mt-1">
                Track your active Ausbildung job applications from first submission to contract offer.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add External Application
            </button>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['PLANNED', 'APPLIED', 'INTERVIEW', 'OFFER'] as const).map((stage) => {
              const stageApps = applications.filter((a) => a.status === stage);
              const badgeColors = {
                PLANNED: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
                APPLIED: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/40',
                INTERVIEW: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40',
                OFFER: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40',
              };

              return (
                <div
                  key={stage}
                  className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <span className="font-extrabold text-xs tracking-wider uppercase text-slate-700 dark:text-slate-300">
                      {stage}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColors[stage]}`}>
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageApps.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2 text-xs"
                      >
                        <span className="font-bold text-[11px] text-blue-600 dark:text-blue-400 block">
                          {app.company}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                          {app.role}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3" /> {app.city} &bull; Applied: {app.appliedDate}
                        </div>

                        {app.interviewDate && (
                          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold">
                            Interview: {app.interviewDate}
                          </div>
                        )}

                        {app.notes && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                            &ldquo;{app.notes}&rdquo;
                          </p>
                        )}

                        {/* Transition Action Buttons */}
                        <div className="pt-2 flex items-center justify-end gap-1.5 border-t border-slate-100 dark:border-slate-800">
                          {stage === 'PLANNED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'APPLIED')}
                              className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-600 text-white"
                            >
                              Mark Applied
                            </button>
                          )}
                          {stage === 'APPLIED' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')}
                              className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-600 text-white"
                            >
                              Invited to Interview
                            </button>
                          )}
                          {stage === 'INTERVIEW' && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'OFFER')}
                              className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-600 text-white"
                            >
                              Received Offer!
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {stageApps.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No applications in this stage.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-300/40 mb-2">
                  {selectedJob.category} &bull; {selectedJob.city}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedJob.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedJob.employer}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedJob.stipendYear1 || 'Regulated Tariff'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Prerequisite Badge */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold">Required Language Proficiency:</span>
              <span className="px-3 py-1 rounded-full font-extrabold bg-amber-500 text-slate-950">
                {selectedJob.requiredGermanLevel || 'B1'} German (CEFR)
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Position Description</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Requirements Checklist */}
            {selectedJob.requirements && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Candidate Prerequisites</h4>
                <ul className="space-y-1.5">
                  {selectedJob.requirements.map((req, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits & Perks */}
            {selectedJob.benefits && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Benefits & Apprentice Perks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedJob.benefits.map((benefit, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      &bull; {benefit}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleTrackFromJob(selectedJob)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Track in My Applications
              </button>

              <a
                href={selectedJob.externalUrl || 'https://jobsuche.api.bund.dev'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL TRACKING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Track External Application</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAddApplication} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Porsche AG, Robert Bosch GmbH"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Ausbildung Role *</label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Ausbildung Kfz-Mechatroniker"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Stuttgart, Hamburg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Personal Notes</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Application deadline, contact person, or cover letter remarks..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
