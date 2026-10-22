'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Video,
  Coins,
  Menu,
  X,
  Sparkles,
  HelpCircle,
  Info,
  FileText,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.germanLearning, href: '/german-learning', icon: BookOpen },
    { name: t.nav.jobSearch, href: '/jobs', icon: Briefcase },
    { name: t.nav.courses, href: '/courses', icon: GraduationCap },
    { name: t.nav.toolkit, href: '/toolkit', icon: FileText },
    { name: t.nav.speaking, href: '/speaking', icon: Video },
    { name: t.nav.pricing, href: '/pricing', icon: Coins },
  ];

  const secondaryNav = [
    { name: t.nav.about, href: '/about', icon: Info },
    { name: t.nav.faq, href: '/faq', icon: HelpCircle },
    { name: t.nav.contact, href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top micro-bar with German colors subtle accent */}
      <div className="h-1 w-full german-gradient-bar" />

      {/* Main Navigation Glass Panel */}
      <div className="glass-panel border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                    Ausbildung<span className="text-amber-500">Portal</span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
                    Germany Pathway
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all ${
                      active
                        ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Tools & Auth */}
            <div className="hidden md:flex items-center gap-2.5">
              <LanguageSwitcher />
              <ThemeToggle />

              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

              <Link
                href="/auth/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t.nav.login}
              </Link>

              <Link
                href="/auth/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all hover:shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {t.nav.register}
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(item.href)
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 text-slate-400" />}
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              {secondaryNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm"
              >
                {t.nav.register}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
