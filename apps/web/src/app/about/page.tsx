'use client';

import React from 'react';
import {
  Shield,
  Target,
  Compass,
  CheckCircle,
  Building,
  HeartHandshake,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          <Compass className="w-3.5 h-3.5" />
          Our Mission & Values
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Democratizing the Pathway to Vocational Excellence in Germany
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Bridging ambitious candidates from Bangladesh and across the world with the dual vocational training
          system (Duale Ausbildung) in Germany — without predatory consultancy fees.
        </p>
      </div>

      {/* The Challenge & Why We Built This */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            The German Skilled Labor Need Meets Global Talent
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Germany currently faces a critical shortage of qualified professionals (*Fachkräftemangel*) across
            nursing, IT, mechatronics, hospitality, and electrical trades. Simultaneously, thousands of motivated
            international young adults possess the ambition and aptitude to succeed, but encounter insurmountable
            hurdles:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Lack of structured, accessible German language training focused on workplace vocabulary.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Exorbitant charges ($3,000–$8,000) demanded by unregulated middlemen and agencies.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Confusion navigating German DIN 5008 resume standards and official embassy visa criteria.</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-amber-300">Our Core Principles</h3>
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white">Zero Exploitative Agency Fees</strong>
                <span className="text-slate-300">Core preparation, job searching, and resumes are 100% free.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <strong className="block text-white">Direct Official Sourcing</strong>
                <span className="text-slate-300">Jobs connect directly to the German Federal Employment Agency.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block text-white">Peer Empowerment</strong>
                <span className="text-slate-300">Learn together, practice speaking safely, and reward achievements with virtual coins.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification & Transparency Commitment */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Transparency & Legal Disclaimer
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Ausbildung Preparation Portal is an independent preparatory education and technology platform. We do not
          guarantee employment or visas, as final contracts are determined exclusively by authorized German employers
          and German embassies. We provide the tools, language proficiency, and application assets to make you an
          outstanding, self-sufficient applicant.
        </p>
      </div>
    </div>
  );
}
