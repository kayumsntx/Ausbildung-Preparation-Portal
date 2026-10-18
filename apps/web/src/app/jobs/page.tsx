'use client';

import React, { useState } from 'react';
import { MOCK_JOBS } from '@/data/mockData';
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  ExternalLink,
  Bookmark,
  Filter,
  Sparkles,
  Info,
} from 'lucide-react';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  const categories = [
    'ALL',
    'Healthcare / Nursing',
    'IT & Software Engineering',
    'Engineering & Automotive',
    'Hospitality & Gastronomy',
    'Electrical & Industrial',
  ];

  const filteredJobs = MOCK_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleSaveJob = (id: string) => {
    if (savedJobIds.includes(id)) {
      setSavedJobIds(savedJobIds.filter((jId) => jId !== id));
    } else {
      setSavedJobIds([...savedJobIds, id]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Bundesagentur für Arbeit API Integration
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Live Ausbildung Openings in Germany
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Browse verified dual vocational training openings across Germany. In Phase 2+, this connects directly to the
          official Jobsuche REST API with real-time employer applications.
        </p>
      </div>

      {/* Development Preview Advisory */}
      <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
        <div>
          <strong>Development Preview Notice:</strong> Listings shown below are preview samples structured to match
          the official Bundesagentur schema. The production API adapter in Phase 4 provides live real-time queries.
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title (e.g. Pflege, Fachinformatiker), city (Berlin, München), or employer..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Vocations' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Job Listings Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filteredJobs.length} openings</span>
          <span>Updated Daily</span>
        </div>

        {filteredJobs.map((job) => {
          const isSaved = savedJobIds.includes(job.id);
          return (
            <div
              key={job.id}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Building2 className="w-3 h-3" />
                    {job.employer}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.city} ({job.postalCode})
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Posted {job.publishedDate}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {job.title}
                </h3>

                <div className="flex flex-wrap items-center gap-1.5">
                  {job.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-400 block">Ausbildungsvergütung (Year 1):</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {job.stipendYear1}
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
                    title={isSaved ? 'Job Bookmarked' : 'Save Job'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
                  </button>

                  <a
                    href={job.externalSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors shadow-xs"
                  >
                    <span>View Opening</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
