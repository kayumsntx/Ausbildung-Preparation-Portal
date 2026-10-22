'use client';

import React, { useState } from 'react';
import {
  Coins,
  Check,
  Sparkles,
  Shield,
  Flame,
  Award,
  Video,
  FileText,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Clock,
  History,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface TransactionItem {
  id: string;
  type: 'REWARD_WELCOME_BONUS' | 'REWARD_QUIZ' | 'REWARD_SPEAKING' | 'REWARD_DAILY_STREAK' | 'PURCHASE_COIN_PACK' | 'SPEND_COURSE' | 'SPEND_MOCK_INTERVIEW';
  amount: number;
  balanceAfter: number;
  description: string;
  date: string;
}

interface UserBadgeItem {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: 'Flame' | 'Award' | 'Video' | 'FileText' | 'Coins';
  isUnlocked: boolean;
}

export default function PricingAndCoinsPage() {
  // Wallet & Gamification State
  const [balance, setBalance] = useState(250);
  const [streakDays, setStreakDays] = useState(5);
  const [streakClaimedToday, setStreakClaimedToday] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Stripe Checkout Modal State
  const [selectedPack, setSelectedPack] = useState<{ id: string; name: string; coins: number; price: string } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Transaction Ledger Filter
  const [filterType, setFilterType] = useState<'ALL' | 'EARNED' | 'SPENT' | 'PURCHASE'>('ALL');

  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'tx-5',
      type: 'REWARD_SPEAKING',
      amount: 25,
      balanceAfter: 250,
      description: '15 Min WebRTC Sprachpraxis mit Partnerin Farhana H. abgeschlossen',
      date: 'Heute, 10:45 Uhr',
    },
    {
      id: 'tx-4',
      type: 'REWARD_DAILY_STREAK',
      amount: 15,
      balanceAfter: 225,
      description: 'Täglicher Streak-Bonus (Tag 5)',
      date: 'Gestern, 09:12 Uhr',
    },
    {
      id: 'tx-3',
      type: 'SPEND_COURSE',
      amount: -50,
      balanceAfter: 210,
      description: 'Freischaltung Modul: Pflegefachbegriffe & Vitalzeichen',
      date: '20. Okt 2026',
    },
    {
      id: 'tx-2',
      type: 'REWARD_QUIZ',
      amount: 10,
      balanceAfter: 260,
      description: 'Grammatik-Quiz B1 Perfekt bestanden (100%)',
      date: '19. Okt 2026',
    },
    {
      id: 'tx-1',
      type: 'REWARD_WELCOME_BONUS',
      amount: 100,
      balanceAfter: 100,
      description: 'Willkommens-Bonus für neue Ausbildungs-Kandidaten',
      date: '18. Okt 2026',
    },
  ]);

  const badges: UserBadgeItem[] = [
    {
      id: 'b-1',
      type: 'STREAK_7_DAYS',
      title: '7-Tage-Lernserie',
      description: 'Eine ganze Woche täglich Deutsch gelernt',
      icon: 'Flame',
      isUnlocked: false,
    },
    {
      id: 'b-2',
      type: 'SPEAKING_CHAMPION',
      title: 'Tandem Champion',
      description: 'Erstes Vorstellungsgespräch auf Deutsch simuliert',
      icon: 'Video',
      isUnlocked: true,
    },
    {
      id: 'b-3',
      type: 'DIN_5008_APPLICANT',
      title: 'Bewerbungsprofi',
      description: 'DIN 5008 tabellarischen Lebenslauf erstellt',
      icon: 'FileText',
      isUnlocked: true,
    },
    {
      id: 'b-4',
      type: 'COIN_COLLECTOR',
      title: 'Coin Sammler',
      description: 'Über 500 Ausbildungs-Coins erspielt',
      icon: 'Coins',
      isUnlocked: false,
    },
  ];

  const handleClaimStreak = () => {
    if (streakClaimedToday) return;

    const newStreak = streakDays + 1;
    let coinsEarned = 15;
    let extraBadge = '';

    if (newStreak === 7) {
      coinsEarned += 50; // Milestone bonus
      extraBadge = ' + 7-Tage-Lernserie Badge freigeschaltet!';
    }

    const newBalance = balance + coinsEarned;
    setBalance(newBalance);
    setStreakDays(newStreak);
    setStreakClaimedToday(true);
    setCelebrationMsg(`🎉 +${coinsEarned} Ausbildungs-Coins erhalten! Streak auf ${newStreak} Tage erhöht!${extraBadge}`);

    // Prepend to ledger
    setTransactions([
      {
        id: `tx-${Date.now()}`,
        type: 'REWARD_DAILY_STREAK',
        amount: coinsEarned,
        balanceAfter: newBalance,
        description: `Täglicher Streak-Bonus (Tag ${newStreak})`,
        date: 'Gerade eben',
      },
      ...transactions,
    ]);

    setTimeout(() => setCelebrationMsg(null), 5000);
  };

  const handleSimulateStripeCheckout = () => {
    if (!selectedPack) return;

    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      const newBalance = balance + selectedPack.coins;
      setBalance(newBalance);

      setTransactions([
        {
          id: `tx-${Date.now()}`,
          type: 'PURCHASE_COIN_PACK',
          amount: selectedPack.coins,
          balanceAfter: newBalance,
          description: `Kauf von ${selectedPack.coins} Coins (${selectedPack.name} via Stripe)`,
          date: 'Gerade eben',
        },
        ...transactions,
      ]);

      setTimeout(() => {
        setCheckoutSuccess(false);
        setSelectedPack(null);
      }, 2500);
    }, 1500);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'EARNED') return t.amount > 0 && t.type !== 'PURCHASE_COIN_PACK';
    if (filterType === 'SPENT') return t.amount < 0;
    if (filterType === 'PURCHASE') return t.type === 'PURCHASE_COIN_PACK';
    return true;
  });

  return (
    <div className="min-h-screen pb-20 pt-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-blue-900/40">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Coins className="w-3.5 h-3.5" />
              Virtuelle Ausbildungs-Coins & Gamification
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Faire Belohnungen für deinen täglichen Lernerfolg
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              Ausbildungs-Coins belohnen deine tägliche Disziplin. Verdiene Coins durch Vokabel-Quizzes,
              Sprachpraxis-Drills und Streak-Meilensteine oder erwerbe transparente Pakete für Fachkurse.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Check className="w-4 h-4 text-emerald-400" /> Grundausbildung 100% Kostenlos
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Flame className="w-4 h-4 text-amber-400" /> +15 Coins Täglicher Streak
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Lock className="w-4 h-4 text-blue-400" /> Verschlüsselt via Stripe (DSGVO)
              </span>
            </div>
          </div>
        </div>

        {/* Celebration Floating Alert */}
        {celebrationMsg && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              {celebrationMsg}
            </div>
            <button onClick={() => setCelebrationMsg(null)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* 1. WALLET & DAILY STREAK SECTION */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Coin Wallet Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-8 rounded-3xl shadow-xl border border-blue-900/40 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dein Guthaben
              </span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Aktiv
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight text-amber-300">
                  {balance}
                </span>
                <span className="text-xl font-bold text-slate-300">Coins</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Gültig für Tandem-Sitzungen, Fachprüfungen & Vokabel-Zertifikate
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Gesamt erspielt
                </div>
                <div className="text-lg font-bold text-slate-200 mt-0.5">300 Coins</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  Eingelöst
                </div>
                <div className="text-lg font-bold text-slate-200 mt-0.5">50 Coins</div>
              </div>
            </div>

            {/* Streak Claim Button */}
            <button
              onClick={handleClaimStreak}
              disabled={streakClaimedToday}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all ${
                streakClaimedToday
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 hover:scale-[1.02]'
              }`}
            >
              <Flame className={`w-5 h-5 ${streakClaimedToday ? 'text-slate-500' : 'text-slate-950 animate-pulse'}`} />
              {streakClaimedToday ? 'Heute bereits abgeholt ✓' : 'Täglichen Streak-Bonus abholen (+15 Coins)'}
            </button>
          </div>

          {/* Right: 7-Day Streak & Badges Progression (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  Deine Lern-Serie: {streakDays} Tage ununterbrochen
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lerne täglich, um Meilenstein-Belohnungen und exklusive Abzeichen freizuschalten.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                Ziel: 7 Tage (+50 Coins)
              </span>
            </div>

            {/* 7-Day Progress Step Visualizer */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isPassed = day <= streakDays;
                const isToday = day === streakDays;
                return (
                  <div
                    key={day}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isPassed
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Tag {day}
                    </div>
                    <Flame
                      className={`w-5 h-5 mx-auto ${
                        isPassed ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                    <div className="text-[11px] font-extrabold mt-1">
                      {day === 7 ? '+65' : '+15'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Badges Carousel Strip */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold uppercase text-slate-400 mb-3">
                Deine freigeschalteten Abzeichen (Badges)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      b.isUnlocked
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-slate-900 dark:text-white shadow-sm'
                        : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-2 ${
                        b.isUnlocked
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {b.icon === 'Flame' && <Flame className="w-4 h-4" />}
                      {b.icon === 'Video' && <Video className="w-4 h-4" />}
                      {b.icon === 'FileText' && <FileText className="w-4 h-4" />}
                      {b.icon === 'Coins' && <Coins className="w-4 h-4" />}
                    </div>
                    <div className="text-xs font-bold truncate">{b.title}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {b.isUnlocked ? 'Erreicht ✓' : 'Gesperrt'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. STRIPE COIN PACKAGES SECTION */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Ausbildungs-Coin Pakete (Stripe Checkout)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Einmalige Aufladung in Euro. Keine versteckten Abonnements. Alle Coins bleiben unbegrenzt gültig.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter 100 Coins */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Starter Pack
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">€4,99</span>
                  <span className="text-xs text-slate-400">/ 100 Coins</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ideal für gelegentliche Vokabel-Tests und erste Tandem-Sprachdrills.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>100 Ausbildungs-Coins</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>4x geführte Tandem-Sprachpraxis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Kein Ablaufdatum</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedPack({ id: 'STARTER_100', name: 'Starter Coin Pack', coins: 100, price: '€4,99' })}
                className="w-full mt-6 py-3.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                100 Coins aufladen
              </button>
            </div>

            {/* Pro 350 Coins (Highlighted) */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-50/30 to-white dark:from-blue-950/20 dark:to-slate-900 border-2 border-blue-600 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                Am beliebtesten
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Pro Applicant Pack
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">€12,99</span>
                  <span className="text-xs text-slate-400">/ 350 Coins (+50 Bonus)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Optimal für aktive Bewerber mit Fachkursen und gezielter Interview-Simulation.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <strong className="text-slate-900 dark:text-white">350 Ausbildungs-Coins</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>14x geführte Tandem-Sprachpraxis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>1x Fachkurs-Freischaltung (z.B. Pflege B2)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Prioritäts-Matching im WebRTC Tandem</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedPack({ id: 'PRO_350', name: 'Pro Applicant Pack', coins: 350, price: '€12,99' })}
                className="w-full mt-6 py-3.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
              >
                350 Coins mit Karte aufladen
              </button>
            </div>

            {/* Master 1000 Coins */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  Bester Wert (40% Rabatt)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">€29,99</span>
                  <span className="text-xs text-slate-400">/ 1.000 Coins (+250 Bonus)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Rundum-Sorglos-Paket für alle Fachkurse, Zertifikate und unbegrenzte Tandem-Sessions.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <strong className="text-slate-900 dark:text-white">1.000 Ausbildungs-Coins</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Alle Spezialkurse & verifizierten Zertifikate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Unbegrenzte Tandem-Sprachpraxis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Exklusives Botschafts-Simulationsinterview</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setSelectedPack({ id: 'MASTER_1000', name: 'Vocational Master Pack', coins: 1000, price: '€29,99' })}
                className="w-full mt-6 py-3.5 rounded-xl font-bold text-xs bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 transition-colors"
              >
                1.000 Coins aufladen
              </button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. IMMUTABLE TRANSACTION LEDGER TABLE */}
        {/* =================================================================== */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Unveränderliches Transaktionsbuch (Ledger)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vollständige Historie aller gutgeschriebenen und eingelösten Ausbildungs-Coins.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2">
              {[
                { key: 'ALL', label: 'Alle' },
                { key: 'EARNED', label: 'Erspielt (+)' },
                { key: 'SPENT', label: 'Eingelöst (-)' },
                { key: 'PURCHASE', label: 'Gekauft (Stripe)' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                    filterType === f.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Datum</th>
                  <th className="py-3 px-4">Typ & Beschreibung</th>
                  <th className="py-3 px-4 text-right">Veränderung</th>
                  <th className="py-3 px-4 text-right">Neuer Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {tx.description}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{tx.type}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold whitespace-nowrap">
                      <span
                        className={
                          tx.amount > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Coins
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-300">
                      {tx.balanceAfter} Coins
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Governance / Legal Notice */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Transparenz & Plattform-Richtlinien
          </div>
          <p>
            Ausbildungs-Coins sind ein internes Plattform-Punktesystem und stellen kein gesetzliches Zahlungsmittel
            oder E-Geld dar. Coins können nicht in Fiat-Geld ausgezahlt oder zwischen Nutzern transferiert werden.
            Alle Zahlungen werden sicher über Stripe nach PCI-DSS-Level-1 verschlüsselt verarbeitet.
          </p>
        </div>

        {/* =================================================================== */}
        {/* STRIPE CHECKOUT MODAL */}
        {/* =================================================================== */}
        {selectedPack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Stripe Sichere Zahlung
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPack(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                >
                  ✕
                </button>
              </div>

              {checkoutSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Zahlung erfolgreich!
                  </h4>
                  <p className="text-xs text-slate-500">
                    +{selectedPack.coins} Ausbildungs-Coins wurden sofort deinem Konto gutgeschrieben.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 uppercase font-bold">Gewähltes Paket</div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-base">
                      {selectedPack.name}
                    </div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {selectedPack.coins} Coins für {selectedPack.price}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>256-Bit SSL-Verschlüsselung nach PCI-DSS Standard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>Akzeptiert: Visa, Mastercard, Maestro, SEPA & Apple/Google Pay</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateStripeCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isCheckingOut ? (
                      'Zahlung wird verarbeitet...'
                    ) : (
                      <>
                        Jetzt {selectedPack.price} sicher bezahlen <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
