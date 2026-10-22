'use client';

import React, { useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  ShieldAlert,
  UserCheck,
  Lock,
  Headphones,
  Sparkles,
  Users,
  Clock,
  Coins,
  Star,
  Check,
  ChevronRight,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  Award,
} from 'lucide-react';

interface PromptCard {
  id: string;
  level: string;
  category: string;
  title: string;
  situation: string;
  roleA: string;
  roleB: string;
  keywords: string[];
  questions: string[];
}

const PROMPT_CARDS: PromptCard[] = [
  {
    id: 'b2-pflege',
    level: 'B2',
    category: 'Pflege & Gesundheit',
    title: 'Vorstellungsgespräch: Universitätsklinik Berlin',
    situation:
      'Du bewirbst dich um einen Ausbildungsplatz als Pflegefachmann / Pflegefachfrau. Die Pflegedienstleitung prüft deine Motivation, Empathie und deine Deutschkenntnisse im Stationsalltag.',
    roleA: 'Pflegedienstleitung (stellt Fragen zu Schichtdienst, Empathie und Belastbarkeit)',
    roleB: 'Bewerber/in (erklärt praktische Vorerfahrungen und Motivation für Deutschland)',
    keywords: ['die Stationsübergabe', 'die Empathie', 'der Schichtdienst', 'die Grundpflege', 'das Verantwortungsbewusstsein'],
    questions: [
      'Warum haben Sie sich für die generalistische Pflegeausbildung entschieden?',
      'Wie gehen Sie mit emotional schwierigen Patientensituationen um?',
      'Welche praktischen Erfahrungen bringen Sie bereits mit?',
    ],
  },
  {
    id: 'b1-uebergabe',
    level: 'B1',
    category: 'Pflege & Gesundheit',
    title: 'Schichtübergabe auf der Station: Patient Herr Müller',
    situation:
      'Der Frühdienst übergibt den Patienten Herrn Müller (72 Jahre, postoperativ nach Hüft-OP) an den Spätdienst. Wichtige Vitalwerte müssen mitgeteilt werden.',
    roleA: 'Pflegekraft Frühdienst (berichtet über Blutdruck, Schmerzen und Mobilisation)',
    roleB: 'Pflegekraft Spätdienst (stellt Rückfragen zur Medikation und Wundversorgung)',
    keywords: ['der Blutdruck (RR 135/85)', 'die Schmerzskala (NRS 4/10)', 'der Verbandswechsel', 'die Mobilisation'],
    questions: [
      'Wie hat der Patient die Vormittagsmobilisation vertragen?',
      'Wann wurde das letzte Schmerzmittel verabreicht?',
    ],
  },
  {
    id: 'b2-it',
    level: 'B2',
    category: 'IT & Software',
    title: 'Ticket-Besprechung: Server-Bug vor Release',
    situation:
      'Ein Auszubildender zum Fachinformatiker bespricht mit der Teamleitung einen 500-Internal-Server-Error in der API kurz vor dem Release.',
    roleA: 'Senior Entwickler (analysiert Logs und priorisiert den Hotfix)',
    roleB: 'Fachinformatiker Azubi (erklärt Fehlermeldung und Lösungsvorschlag)',
    keywords: ['die Fehlermeldung', 'der Stacktrace', 'die Fehlerbehebung (Bugfix)', 'das Unit-Testing'],
    questions: [
      'In welchem API-Endpunkt tritt der Fehler auf?',
      'Konntest du das Problem lokal reproduzieren?',
    ],
  },
  {
    id: 'b1-hotel',
    level: 'B1',
    category: 'Hotellerie & Gastronomie',
    title: 'Reklamation an der Hotelrezeption',
    situation:
      'Ein Gast an der Hotelrezeption beschwert sich über eine ausgefallene Klimaanlage und bittet um eine kulante Lösung.',
    roleA: 'Hotelgast (verärgert, aber höflich; bittet um Zimmerwechsel)',
    roleB: 'Hotelfachmann/frau Azubi (empathisch, bietet Zimmerwechsel und Frühstücksgutschein an)',
    keywords: ['die Unannehmlichkeit', 'die Kulanz', 'das Ersatzzimmer', 'die Entschuldigung'],
    questions: [
      'Guten Tag, in Zimmer 204 funktioniert die Klimaanlage nicht!',
      'Haben Sie ein ruhiges Ersatzzimmer für mich?',
    ],
  },
];

export default function SpeakingPage() {
  // Navigation & Matching state
  const [matchingState, setMatchingState] = useState<'IDLE' | 'SEARCHING' | 'IN_CALL' | 'COMPLETED'>('IDLE');
  const [targetLevel, setTargetLevel] = useState('B2');
  const [selectedTopic, setSelectedTopic] = useState('Pflege & Gesundheit');
  const [genderFilter, setGenderFilter] = useState('ANY');

  // Active call state
  const [callDuration, setCallDuration] = useState(900); // 15 mins = 900 seconds
  const [timerSeconds, setTimerSeconds] = useState(900);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activePrompt, setActivePrompt] = useState<PromptCard>(PROMPT_CARDS[0]);

  // End of call rating modal
  const [selectedStars, setSelectedStars] = useState(5);
  const [selectedBadge, setSelectedBadge] = useState('SEHR_FREUNDLICH');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // User Stats
  const [userCoins, setUserCoins] = useState(150);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(4);

  // Timer tick during active call
  useEffect(() => {
    let interval: any = null;
    if (matchingState === 'IN_CALL' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && matchingState === 'IN_CALL') {
      handleCompleteCall();
    }
    return () => clearInterval(interval);
  }, [matchingState, timerSeconds]);

  const startSearching = () => {
    setMatchingState('SEARCHING');
    // Simulated peer matching delay: 3 seconds to connect with peer
    setTimeout(() => {
      const prompt =
        PROMPT_CARDS.find((p) => p.category === selectedTopic && p.level === targetLevel) ||
        PROMPT_CARDS[0];
      setActivePrompt(prompt);
      setTimerSeconds(900);
      setMatchingState('IN_CALL');
    }, 2800);
  };

  const handleCompleteCall = () => {
    setMatchingState('COMPLETED');
    setUserCoins((prev) => prev + 25);
    setCompletedSessionsCount((prev) => prev + 1);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pb-20 pt-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =================================================================== */}
        {/* 1. STATE: IN_CALL (ACTIVE WEBRTC CALL SCREEN) */}
        {/* =================================================================== */}
        {matchingState === 'IN_CALL' ? (
          <div className="space-y-6">
            {/* Call Header Micro-Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-sm">Live WebRTC Sprachpraxis</span>
                <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-md text-amber-300 font-mono">
                  Raum: room_spk_berlin_tandem
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 font-mono text-sm font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {formatTime(timerSeconds)}
                </div>
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
                  Melden
                </button>
              </div>
            </div>

            {/* Split Screen Video Grid & Roleplay Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Video Streams (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Remote Peer Stream */}
                  <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                      alt="Tandem Partnerin"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-semibold border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Farhana H. (Dhaka) • B2 Pflege
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md px-2 py-1 rounded-lg text-white text-xs">
                      Rolle B: Bewerberin
                    </div>
                  </div>

                  {/* Local User Stream */}
                  <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg">
                    {isVideoOff ? (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <VideoOff className="w-10 h-10" />
                        <span className="text-xs">Kamera deaktiviert</span>
                      </div>
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                        alt="Du (Local Preview)"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-semibold border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Du • Rolle A
                    </div>
                    {isMicMuted && (
                      <div className="absolute top-3 right-3 bg-rose-600/90 p-1.5 rounded-lg text-white">
                        <MicOff className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* In-Call Controls Bar */}
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-3.5 rounded-2xl transition-all ${
                      isMicMuted
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isMicMuted ? 'Mikrofon einschalten' : 'Mikrofon stummschalten'}
                  >
                    {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3.5 rounded-2xl transition-all ${
                      isVideoOff
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                    title={isVideoOff ? 'Kamera einschalten' : 'Kamera ausschalten'}
                  >
                    {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleCompleteCall}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105"
                  >
                    <PhoneOff className="w-5 h-5" />
                    Gespräch beenden
                  </button>
                </div>
              </div>

              {/* Right: Guided Dialog Card & In-Call Prompt (5 cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Geführte Dialogkarte ({activePrompt.level})
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                    {activePrompt.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">
                    {activePrompt.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activePrompt.situation}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50">
                    <strong className="text-blue-900 dark:text-blue-300">Deine Rolle (A):</strong>
                    <div className="text-slate-700 dark:text-slate-300 mt-0.5">{activePrompt.roleA}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <strong className="text-slate-800 dark:text-slate-200">Partner-Rolle (B):</strong>
                    <div className="text-slate-600 dark:text-slate-400 mt-0.5">{activePrompt.roleB}</div>
                  </div>
                </div>

                {/* Key German Vocabulary */}
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Wichtige Fachbegriffe & Redemittel
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activePrompt.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/40"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Questions */}
                <div>
                  <div className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Musterfragen zum Anleiten
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {activePrompt.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : matchingState === 'COMPLETED' ? (
          /* =================================================================== */
          /* 2. STATE: COMPLETED (CALL RATING & COIN CELEBRATION MODAL) */
          /* =================================================================== */
          <div className="max-w-xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
                <Coins className="w-3.5 h-3.5" /> +25 Ausbildungs-Coins gutgeschrieben!
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Großartige Sprachpraxis!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Du hast 15 Minuten Fachdeutsch mit Farhana H. geübt. Bewerte deine Partnerin für die Community.
              </p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedStars(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= selectedStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Badges Selection */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
                Badge verleihen:
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { key: 'SEHR_FREUNDLICH', label: '🤝 Sehr freundlich' },
                  { key: 'GUTE_AUSSPRACHE', label: '🗣️ Klare Aussprache' },
                  { key: 'HILFREICH', label: '💡 Geduldig & Hilfreich' },
                ].map((b) => (
                  <button
                    key={b.key}
                    onClick={() => setSelectedBadge(b.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                      selectedBadge === b.key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMatchingState('IDLE')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
            >
              Bewertung absenden & Zurück zur Übersicht
            </button>
          </div>
        ) : (
          /* =================================================================== */
          /* 3. STATE: IDLE / SEARCHING (MATCHMAKING LOBBY) */
          /* =================================================================== */
          <div className="space-y-12">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-blue-900/40">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                  <Video className="w-3.5 h-3.5" />
                  Live WebRTC Tandem Plattform
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                  Sichere Deutsch-Sprachpraxis mit Gleichgesinnten
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
                  Überwinde die Sprechhemmung und bereite dich gezielt auf deutsche Vorstellungsgespräche und
                  den Stationsalltag vor. Wähle dein Sprachniveau und übe mit geführten Dialogkarten.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <UserCheck className="w-4 h-4 text-emerald-400" /> Geschlechter-Filter wählbar
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Coins className="w-4 h-4 text-amber-400" /> +25 Coins pro Gespräch
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> Sofort-Meldesystem & Moderation
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Statistics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Absolvierte Drills</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {completedSessionsCount} Sessions
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Sprechzeit gesamt</div>
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                  {completedSessionsCount * 15} Minuten
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Partner-Bewertung</div>
                <div className="text-2xl font-extrabold text-amber-500 mt-1 flex items-center gap-1">
                  5.0 <Star className="w-5 h-5 fill-amber-400" />
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Erspielte Coins</div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  {userCoins} <Coins className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Matchmaking Radar & Control Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Configuration Form (7 cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Gesprächspartner/in suchen
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Wähle dein Sprachniveau und das Szenario. Unser Matching-Algorithmus verbindet dich in Echtzeit.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* CEFR Level Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                      Dein Ziel-Sprachniveau (CEFR)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['A1', 'A2', 'B1', 'B2'].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setTargetLevel(lvl)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            targetLevel === lvl
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vocational Scenario */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                      Fachgebiet / Szenario
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Pflege & Gesundheit',
                        'IT & Software',
                        'Hotellerie & Gastronomie',
                        'Alltag in Deutschland',
                      ].map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setSelectedTopic(topic)}
                          className={`p-3 rounded-xl text-left text-xs font-bold transition-all border ${
                            selectedTopic === topic
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cultural & Gender Privacy Filter */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                      Geschlechter-Präferenz (Safety & Komfort)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'ANY', label: 'Egal (Jeder)' },
                        { key: 'SAME_GENDER', label: 'Gleiches Geschlecht' },
                        { key: 'FEMALE_ONLY', label: 'Nur Frauen (Geschützt)' },
                      ].map((pref) => (
                        <button
                          key={pref.key}
                          onClick={() => setGenderFilter(pref.key)}
                          className={`py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                            genderFilter === pref.key
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {pref.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Match Button */}
                  <div className="pt-2">
                    {matchingState === 'SEARCHING' ? (
                      <div className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-3 animate-pulse shadow-lg">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Suche kompatiblen Speaking Partner ({targetLevel} • {selectedTopic})...
                      </div>
                    ) : (
                      <button
                        onClick={startSearching}
                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                      >
                        <Users className="w-5 h-5" />
                        Jetzt Tandem-Partner finden (15 Min Drill)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Live Available Partners & Safe Community Policy (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      Aktive Lernpartner online (24)
                    </h4>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Live Feed</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: 'Farhana H.',
                        city: 'Dhaka',
                        target: 'Pflegefachfrau B2',
                        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
                        stars: 5.0,
                      },
                      {
                        name: 'Tanvir A.',
                        city: 'Chittagong',
                        target: 'Fachinformatiker B2',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                        stars: 4.9,
                      },
                      {
                        name: 'Sumaya R.',
                        city: 'Sylhet',
                        target: 'Hotelfachfrau B1',
                        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
                        stars: 5.0,
                      },
                    ].map((p, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white">
                              {p.name} • <span className="font-normal text-slate-500">{p.city}</span>
                            </div>
                            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                              {p.target}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          {p.stars} <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Guarantee Box */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                    <Lock className="w-4 h-4" />
                    100% Peer-to-Peer & DSGVO
                  </div>
                  <h4 className="font-bold text-sm">Keine Video-Aufzeichnung</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Alle Video- und Audiodaten laufen direkt verschlüsselt von Browser zu Browser via WebRTC. Es werden
                    zu keinem Zeitpunkt Videoaufnahmen auf Servern gespeichert.
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt Library Cards Preview */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Geführte Dialogkarten-Bibliothek
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Praxisnahe Rollenspiele, die dir im echten Vorstellungsgespräch oder auf Station begegnen.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROMPT_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          Niveau {card.level}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{card.category}</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {card.situation}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        {card.keywords.length} Fachbegriffe inklusive
                      </div>
                      <button
                        onClick={() => {
                          setTargetLevel(card.level);
                          setSelectedTopic(card.category);
                          startSearching();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Jetzt dieses Thema üben <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* REPORT MODAL */}
        {/* =================================================================== */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-500">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Verstoß oder Belästigung melden</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Wir tolerieren keinerlei unangemessenes Verhalten, Belästigung oder Spam. Deine Meldung wird umgehend
                von Moderatoren geprüft.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Grund:</label>
                <select className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <option>Unangemessenes oder beleidigendes Verhalten</option>
                  <option>Verstoß gegen die Community-Richtlinien</option>
                  <option>Teilnehmer hat nicht gesprochen / Kein Ton</option>
                  <option>Technische Störung</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Details:</label>
                <textarea
                  rows={3}
                  placeholder="Beschreibe kurz den Vorfall..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    setReportSuccess(true);
                    setTimeout(() => {
                      setReportModalOpen(false);
                      setReportSuccess(false);
                      handleCompleteCall();
                    }, 1200);
                  }}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {reportSuccess ? 'Meldung eingereicht!' : 'Meldung absenden & Anruf trennen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
