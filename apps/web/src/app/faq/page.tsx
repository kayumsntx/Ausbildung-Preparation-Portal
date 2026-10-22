'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_FAQS } from '@/data/mockData';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FaqPage() {
  const { locale } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <HelpCircle className="w-3.5 h-3.5" />
          Clear Answers for Ausbildung Applicants
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Everything you need to know about the German dual vocational training system, language prerequisites,
          visas, and platform features.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {MOCK_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const question =
            locale === 'bn'
              ? faq.questionBn
              : locale === 'de'
              ? faq.questionDe
              : faq.questionEn;

          const answer =
            locale === 'bn'
              ? faq.answerBn
              : locale === 'de'
              ? faq.answerDe
              : faq.answerEn;

          return (
            <div
              key={faq.questionEn || `faq-${idx}`}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4 animate-in fade-in duration-150">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
