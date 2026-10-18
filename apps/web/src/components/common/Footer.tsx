'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GraduationCap, ShieldCheck, Heart, MapPin, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Ausbildung<span className="text-amber-500">Portal</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>

            <div className="flex flex-col gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Berlin, Federal Republic of Germany & Dhaka, Bangladesh
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                contact@ausbildungportal.de
              </span>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <ShieldCheck className="w-3.5 h-3.5" />
                GDPR & DSGVO Compliant Data Protection
              </span>
            </div>
          </div>

          {/* Quick Links: Platform */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {t.footer.platformTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/german-learning" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.germanLearning} (A1-B2)
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.jobSearch} (Jobsuche)
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.courses}
                </Link>
              </li>
              <li>
                <Link href="/speaking" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.speaking}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.pricing}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Information */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {t.footer.resourcesTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.faq}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <a
                  href="https://jobsuche.api.bund.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Bundesagentur API <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              {t.footer.legalTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.guidelines}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>{t.footer.copyright}</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for aspiring vocational scholars worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
