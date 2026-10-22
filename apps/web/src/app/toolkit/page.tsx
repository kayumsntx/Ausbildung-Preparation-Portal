'use client';

import React, { useState } from 'react';
import {
  FileText,
  Mail,
  ShieldCheck,
  CheckSquare,
  Plus,
  Trash2,
  Printer,
  Download,
  Copy,
  Check,
  Upload,
  AlertCircle,
  FileCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  photoUrl: string;
}

interface EducationItem {
  id: string;
  startDate: string;
  endDate: string;
  institution: string;
  degree: string;
  city: string;
  country: string;
  description: string;
}

interface ExperienceItem {
  id: string;
  startDate: string;
  endDate: string;
  company: string;
  role: string;
  city: string;
  country: string;
  tasks: string;
}

interface LanguageItem {
  id: string;
  language: string;
  level: string;
  certificate: string;
}

interface DocumentItem {
  id: string;
  title: string;
  category: 'LANGUAGE_CERTIFICATE' | 'SCHOOL_TRANSCRIPT' | 'PASSPORT' | 'WORK_REFERENCE' | 'OTHER';
  fileName: string;
  fileSizeFormatted: string;
  mimeType: string;
  uploadDate: string;
  isVerified: boolean;
}

interface ChecklistItem {
  id: string;
  category: 'EMBASSY_VISA' | 'INTERVIEW_PREP' | 'DOCUMENT_AUTHENTICATION';
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
}

export default function ApplicationToolkitPage() {
  const [activeTab, setActiveTab] = useState<'cv' | 'coverLetter' | 'vault' | 'checklist'>('cv');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // ===========================================================================
  // 1. CV STATE
  // ===========================================================================
  const [targetVocation, setTargetVocation] = useState('Pflegefachmann / Pflegefachfrau');
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'Max Mustermann',
    birthDate: '15.04.2001',
    birthPlace: 'Dhaka, Bangladesch',
    nationality: 'Bangladeschisch',
    address: 'House 12, Road 4, Dhanmondi, 1205 Dhaka',
    phone: '+880 1712 345678',
    email: 'max.mustermann@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  });

  const [educationList, setEducationList] = useState<EducationItem[]>([
    {
      id: 'edu-1',
      startDate: '09/2019',
      endDate: '06/2023',
      institution: 'Dhaka Residential Model College',
      degree: 'Higher Secondary Certificate (HSC) - Naturwissenschaften',
      city: 'Dhaka',
      country: 'Bangladesch',
      description: 'Abschlussnote: GPA 5.0/5.0 (Schwerpunkte Biologie & Chemie)',
    },
    {
      id: 'edu-2',
      startDate: '01/2014',
      endDate: '05/2019',
      institution: 'St. Joseph Higher Secondary School',
      degree: 'Secondary School Certificate (SSC)',
      city: 'Dhaka',
      country: 'Bangladesch',
      description: 'Abschlussnote: GPA 5.0/5.0',
    },
  ]);

  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([
    {
      id: 'exp-1',
      startDate: '07/2023',
      endDate: '08/2024',
      company: 'Dhaka Community Hospital',
      role: 'Praktikant im Pflegedienst / Krankenpflege',
      city: 'Dhaka',
      country: 'Bangladesch',
      tasks: 'Grundpflege von Patientinnen und Patienten; Erfassung von Vitaldaten (Blutdruck, Puls); Begleitung von Arztvisiten',
    },
  ]);

  const [languageList, setLanguageList] = useState<LanguageItem[]>([
    { id: 'lang-1', language: 'Deutsch', level: 'B2 (Fließend)', certificate: 'Goethe-Zertifikat B2 (Bestanden mit 88/100)' },
    { id: 'lang-2', language: 'Englisch', level: 'B2 (Verhandlungssicher)', certificate: 'IELTS Academic 7.0' },
    { id: 'lang-3', language: 'Bengali', level: 'Muttersprache', certificate: 'Erstsprache' },
  ]);

  const [skillsText, setSkillsText] = useState('MS Office (Word, Excel), Elektronische Patientenakte, Erste-Hilfe-Zertifikat (DRK-Standard)');
  const [interestsText, setInterestsText] = useState('Freiwilliges Engagement im Rettungsdienst, Badminton, Kochen europäischer Gerichte');
  const [locationDate, setLocationDate] = useState('Dhaka, 22. Oktober 2026');

  // ===========================================================================
  // 2. COVER LETTER STATE
  // ===========================================================================
  const [coverSender, setCoverSender] = useState({
    name: 'Max Mustermann',
    address: 'House 12, Road 4, Dhanmondi',
    postalCodeCity: '1205 Dhaka, Bangladesch',
    phone: '+880 1712 345678',
    email: 'max.mustermann@example.com',
  });

  const [coverRecipient, setCoverRecipient] = useState({
    company: 'Charité – Universitätsmedizin Berlin',
    contactPerson: 'Frau Dr. Stefanie Weber',
    department: 'Zentrale Bewerbungsstelle Ausbildung',
    address: 'Charitéplatz 1',
    postalCodeCity: '10117 Berlin',
  });

  const [coverDateLine, setCoverDateLine] = useState('Dhaka, den 22. Oktober 2026');
  const [coverSubject, setCoverSubject] = useState('Bewerbung um einen Ausbildungsplatz als Pflegefachmann (m/w/d) zum 01.09.2027');
  const [coverSalutation, setCoverSalutation] = useState('Sehr geehrte Frau Dr. Weber,');
  const [coverBody, setCoverBody] = useState(
    `mit großem Interesse habe ich Ihre Stellenausschreibung für die generalistische Pflegeausbildung an der Charité verfolgt. Als engagierte und einfühlsame Persönlichkeit mit erfolgreich absolviertem Goethe-Zertifikat B2 ist es mein fester Entschluss, meine berufliche Zukunft in der qualifizierten Krankenpflege in Deutschland aufzubauen.\n\nDurch mein einjähriges Pflegepraktikum am Dhaka Community Hospital konnte ich bereits wertvolle praktische Erfahrungen sammeln und den anspruchsvollen Stationsalltag kennenlernen. Die Patientinnen und Patienten schätzen meine Geduld, meine Zuverlässigkeit und mein hohes Verantwortungsbewusstsein.\n\nDie Charité steht für Spitzenmedizin und erstklassige Ausbildung. Ich möchte von Ihren erfahrenen Fachkräften lernen und mich mit vollem Engagement in Ihr Team einbringen.\n\nÜber die Gelegenheit, mich Ihnen in einem persönlichen oder digitalen Vorstellungsgespräch vorzustellen, freue ich mich sehr.`
  );
  const [coverSignOff, setCoverSignOff] = useState('Mit freundlichen Grüßen');
  const [coverEnclosures, setCoverEnclosures] = useState('Anlagen: Tabellarischer Lebenslauf, Beglaubigte Zeugnisse, Goethe-Zertifikat B2');

  // ===========================================================================
  // 3. DOCUMENT VAULT STATE
  // ===========================================================================
  const [vaultFilter, setVaultFilter] = useState<string>('ALL');
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'doc-1',
      title: 'Goethe-Zertifikat B2 (Gesamtprüfung)',
      category: 'LANGUAGE_CERTIFICATE',
      fileName: 'Goethe_B2_Certificate_Max_Mustermann.pdf',
      fileSizeFormatted: '2.4 MB',
      mimeType: 'application/pdf',
      uploadDate: '15.10.2026',
      isVerified: true,
    },
    {
      id: 'doc-2',
      title: 'HSC Abschlusszeugnis mit Apostille (Übersetzung)',
      category: 'SCHOOL_TRANSCRIPT',
      fileName: 'HSC_Transcript_Certified_German.pdf',
      fileSizeFormatted: '3.1 MB',
      mimeType: 'application/pdf',
      uploadDate: '18.10.2026',
      isVerified: true,
    },
    {
      id: 'doc-3',
      title: 'Biometrischer Reisepass (Gültig bis 2032)',
      category: 'PASSPORT',
      fileName: 'Passport_Scan_HighRes.pdf',
      fileSizeFormatted: '1.8 MB',
      mimeType: 'application/pdf',
      uploadDate: '20.10.2026',
      isVerified: true,
    },
    {
      id: 'doc-4',
      title: 'Praktikumszeugnis Dhaka Community Hospital',
      category: 'WORK_REFERENCE',
      fileName: 'Nursing_Internship_Evaluation.pdf',
      fileSizeFormatted: '950 KB',
      mimeType: 'application/pdf',
      uploadDate: '21.10.2026',
      isVerified: false,
    },
  ]);

  // ===========================================================================
  // 4. CHECKLIST STATE
  // ===========================================================================
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'chk-1',
      category: 'EMBASSY_VISA',
      title: 'Gültiger Reisepass (mindestens 12 Monate Gültigkeit)',
      description: 'Mindestens zwei leere Visaseiten für das nationale Visum D.',
      isCompleted: true,
      dueDate: '2026-11-01',
    },
    {
      id: 'chk-2',
      category: 'EMBASSY_VISA',
      title: 'Ausbildungsvertrag im Original (IHK/HWK eingetragen)',
      description: 'Von Betrieb und Auszubildendem unterschriebenes Dokument mit betrieblichem Ausbildungsplan.',
      isCompleted: true,
      dueDate: '2026-11-15',
    },
    {
      id: 'chk-3',
      category: 'EMBASSY_VISA',
      title: 'Zertifizierter Deutschnachweis (B1 oder B2 Goethe/telc)',
      description: 'Zertifikat nicht älter als 12 Monate für reibungslose Visumerteilung.',
      isCompleted: true,
      dueDate: '2026-11-10',
    },
    {
      id: 'chk-4',
      category: 'EMBASSY_VISA',
      title: 'Finanzierungsnachweis / Sperrkonto (§ 16a AufenthG)',
      description: 'Mindestausbildungsvergütung über 903 €/Monat brutto oder Sperrkonto.',
      isCompleted: false,
      dueDate: '2026-12-01',
    },
    {
      id: 'chk-5',
      category: 'EMBASSY_VISA',
      title: 'Incoming-Krankenversicherung für die Einreise',
      description: 'Gültige Auslandskrankenversicherung bis zum Eintritt in die gesetzliche Krankenkasse.',
      isCompleted: false,
      dueDate: '2026-12-10',
    },
    {
      id: 'chk-6',
      category: 'EMBASSY_VISA',
      title: 'Biometrische Passbilder (ICAO-Standard)',
      description: 'Zwei aktuelle Fotos mit weißem Hintergrund (35 x 45 mm).',
      isCompleted: true,
      dueDate: '2026-11-05',
    },
    {
      id: 'chk-7',
      category: 'INTERVIEW_PREP',
      title: 'Vorbereitung auf typische Ausbildungsfragen',
      description: 'Warum Deutschland? Warum dieser Beruf? Warum dieses Unternehmen?',
      isCompleted: true,
      dueDate: '2026-11-20',
    },
    {
      id: 'chk-8',
      category: 'INTERVIEW_PREP',
      title: 'Simulation eines Vorstellungsgesprächs auf Deutsch',
      description: 'Freies Sprechen über den Lebenslauf und Motivation mit Speaking Partner.',
      isCompleted: false,
      dueDate: '2026-11-25',
    },
    {
      id: 'chk-9',
      category: 'DOCUMENT_AUTHENTICATION',
      title: 'Beglaubigte Übersetzung & Apostille der Schulzeugnisse',
      description: 'Deutsche Übersetzung durch ermächtigte Übersetzer.',
      isCompleted: true,
      dueDate: '2026-10-25',
    },
    {
      id: 'chk-10',
      category: 'DOCUMENT_AUTHENTICATION',
      title: 'Anerkennung des Schulabschlusses (Zeugnisanerkennungsstelle)',
      description: 'Gleichwertigkeitsbescheid (z. B. Mittlere Reife oder Fachhochschulreife).',
      isCompleted: false,
      dueDate: '2026-12-15',
    },
  ]);

  const completedChecklistCount = checklist.filter((i) => i.isCompleted).length;
  const progressPercentage = Math.round((completedChecklistCount / checklist.length) * 100);

  // Helper functions
  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const filteredDocuments =
    vaultFilter === 'ALL'
      ? documents
      : documents.filter((d) => d.category === vaultFilter);

  return (
    <div className="min-h-screen pb-20 pt-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-blue-900/40 mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Offizielle Norm DIN 5008 & DSGVO-Tresor
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Bewerbungs-Toolkit & Dokumenten-Tresor
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              Erstelle normgerechte tabellarische Lebensläufe, überzeugende Anschreiben nach deutscher
              DIN 5008, lade deine beglaubigten Zeugnisse sicher hoch und behalte alle Visum-Schritte im Blick.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Check className="w-4 h-4 text-emerald-400" /> DIN 5008 Standard
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Lock className="w-4 h-4 text-amber-400" /> 15 MB Verschlüsselter Tresor
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Botschafts-Checkliste
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab('cv')}
            className={`flex items-center gap-2.5 py-3.5 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'cv'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Tabellarischer Lebenslauf (CV)
          </button>
          <button
            onClick={() => setActiveTab('coverLetter')}
            className={`flex items-center gap-2.5 py-3.5 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'coverLetter'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            DIN 5008 Anschreiben
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2.5 py-3.5 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'vault'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Bewerbungs-Tresor ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2.5 py-3.5 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Visum & Interview Checkliste
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
              {progressPercentage}%
            </span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: CV BUILDER & LIVE PREVIEW */}
        {/* =================================================================== */}
        {activeTab === 'cv' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form (7 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>1. Ziel-Ausbildungsberuf & Person</span>
                  <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Haupt-Version (Primary)
                  </span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Angestrebte Ausbildung
                    </label>
                    <select
                      value={targetVocation}
                      onChange={(e) => setTargetVocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pflegefachmann / Pflegefachfrau">Pflegefachmann / Pflegefachfrau</option>
                      <option value="Fachinformatiker für Anwendungsentwicklung">Fachinformatiker für Anwendungsentwicklung</option>
                      <option value="Mechatroniker (m/w/d)">Mechatroniker (m/w/d)</option>
                      <option value="Elektroniker für Betriebstechnik">Elektroniker für Betriebstechnik</option>
                      <option value="Hotelfachmann / Hotelfachfrau">Hotelfachmann / Hotelfachfrau</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Vollständiger Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Geburtsdatum & Ort
                      </label>
                      <input
                        type="text"
                        value={personalInfo.birthDate}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, birthDate: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        Staatsangehörigkeit
                      </label>
                      <input
                        type="text"
                        value={personalInfo.nationality}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                        E-Mail
                      </label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Telefonnummer (mit Vorwahl)
                    </label>
                    <input
                      type="text"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Practical Experience */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    2. Praktische Erfahrungen & Praktika
                  </h3>
                  <button
                    onClick={() =>
                      setExperienceList([
                        ...experienceList,
                        {
                          id: `exp-${Date.now()}`,
                          startDate: '01/2024',
                          endDate: 'Heute',
                          company: 'Neues Unternehmen / Klinik',
                          role: 'Pflegehelfer',
                          city: 'Dhaka',
                          country: 'Bangladesch',
                          tasks: 'Erste praktische Tätigkeiten',
                        },
                      ])
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Eintrag hinzufügen
                  </button>
                </div>
                {experienceList.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-3 space-y-3 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Station #{idx + 1}</span>
                      <button
                        onClick={() => setExperienceList(experienceList.filter((e) => e.id !== exp.id))}
                        className="text-rose-500 hover:text-rose-600 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Löschen
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="07/2023 – 08/2024"
                        value={`${exp.startDate} – ${exp.endDate}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('–').map((p) => p.trim());
                          const updated = [...experienceList];
                          updated[idx].startDate = parts[0] || '';
                          updated[idx].endDate = parts[1] || '';
                          setExperienceList(updated);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Position / Rolle"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...experienceList];
                          updated[idx].role = e.target.value;
                          setExperienceList(updated);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Unternehmen / Klinik, Stadt, Land"
                      value={`${exp.company}, ${exp.city} (${exp.country})`}
                      onChange={(e) => {
                        const updated = [...experienceList];
                        updated[idx].company = e.target.value;
                        setExperienceList(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <textarea
                      rows={2}
                      placeholder="Aufgaben und Tätigkeiten..."
                      value={exp.tasks}
                      onChange={(e) => {
                        const updated = [...experienceList];
                        updated[idx].tasks = e.target.value;
                        setExperienceList(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    3. Schulbildung (Education)
                  </h3>
                  <button
                    onClick={() =>
                      setEducationList([
                        ...educationList,
                        {
                          id: `edu-${Date.now()}`,
                          startDate: '01/2012',
                          endDate: '12/2014',
                          institution: 'Schulname',
                          degree: 'Abschluss',
                          city: 'Dhaka',
                          country: 'Bangladesch',
                          description: 'Abschlussnote',
                        },
                      ])
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Schule hinzufügen
                  </button>
                </div>
                {educationList.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 mb-3 space-y-2 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bildungsweg #{idx + 1}</span>
                      <button
                        onClick={() => setEducationList(educationList.filter((e) => e.id !== edu.id))}
                        className="text-rose-500 hover:text-rose-600 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Löschen
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={`${edu.startDate} – ${edu.endDate}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('–').map((p) => p.trim());
                          const updated = [...educationList];
                          updated[idx].startDate = parts[0] || '';
                          updated[idx].endDate = parts[1] || '';
                          setEducationList(updated);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].degree = e.target.value;
                          setEducationList(updated);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <input
                      type="text"
                      value={`${edu.institution}, ${edu.city} (${edu.country})`}
                      onChange={(e) => {
                        const updated = [...educationList];
                        updated[idx].institution = e.target.value;
                        setEducationList(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                ))}
              </div>

              {/* Languages & Additional */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  4. Sprachkenntnisse & Fertigkeiten
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Sprachzertifikate
                    </label>
                    <div className="space-y-2">
                      {languageList.map((lang) => (
                        <div key={lang.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                          <span className="font-bold text-blue-600 dark:text-blue-400 w-24">{lang.language}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{lang.level}</span>
                          <span className="text-slate-400 ml-auto">{lang.certificate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Kenntnisse & IT
                    </label>
                    <input
                      type="text"
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                      Ort und Datum der Unterschrift
                    </label>
                    <input
                      type="text"
                      value={locationDate}
                      onChange={(e) => setLocationDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live DIN 5008 Tabellarischer Preview (5 cols sticky) */}
            <div className="lg:col-span-6 sticky top-24">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      DIN 5008 Druck-Vorschau (A4)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Drucken / Als PDF speichern"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(document.getElementById('din-cv-preview')?.innerText || '')}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                      title="Als Text kopieren"
                    >
                      {copiedNotification ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Simulated A4 Paper */}
                <div
                  id="din-cv-preview"
                  className="bg-white text-slate-900 p-8 rounded-lg shadow-inner border border-slate-300 text-[11px] leading-relaxed font-sans max-h-[750px] overflow-y-auto"
                >
                  {/* Header with Photo */}
                  <div className="flex justify-between items-start border-b-2 border-blue-900 pb-4 mb-4">
                    <div>
                      <h2 className="text-xl font-extrabold uppercase tracking-wider text-blue-950 mb-0.5">
                        Lebenslauf
                      </h2>
                      <div className="text-xs font-bold text-slate-600">{targetVocation}</div>
                    </div>
                    {personalInfo.photoUrl && (
                      <img
                        src={personalInfo.photoUrl}
                        alt="Bewerbungsfoto"
                        className="w-16 h-20 object-cover rounded border border-slate-300 shadow-sm"
                      />
                    )}
                  </div>

                  {/* Section: Persönliche Daten */}
                  <div className="font-bold text-xs uppercase tracking-wide text-blue-950 border-b border-slate-200 pb-1 mb-2">
                    Persönliche Daten
                  </div>
                  <div className="grid grid-cols-12 gap-1 mb-4 text-[10.5px]">
                    <div className="col-span-4 text-slate-500">Name:</div>
                    <div className="col-span-8 font-semibold">{personalInfo.fullName}</div>
                    <div className="col-span-4 text-slate-500">Geburtsdatum & Ort:</div>
                    <div className="col-span-8">{personalInfo.birthDate} in {personalInfo.birthPlace}</div>
                    <div className="col-span-4 text-slate-500">Staatsangehörigkeit:</div>
                    <div className="col-span-8">{personalInfo.nationality}</div>
                    <div className="col-span-4 text-slate-500">Anschrift:</div>
                    <div className="col-span-8">{personalInfo.address}</div>
                    <div className="col-span-4 text-slate-500">Telefon:</div>
                    <div className="col-span-8">{personalInfo.phone}</div>
                    <div className="col-span-4 text-slate-500">E-Mail:</div>
                    <div className="col-span-8">{personalInfo.email}</div>
                  </div>

                  {/* Section: Berufliche Praxis */}
                  <div className="font-bold text-xs uppercase tracking-wide text-blue-950 border-b border-slate-200 pb-1 mb-2">
                    Praktische Erfahrungen & Praktika
                  </div>
                  {experienceList.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-12 gap-1 mb-2.5 text-[10.5px]">
                      <div className="col-span-4 text-slate-600 font-medium">
                        {exp.startDate} – {exp.endDate}
                      </div>
                      <div className="col-span-8">
                        <strong className="text-slate-950">{exp.role}</strong>
                        <div className="text-slate-700">{exp.company}, {exp.city} ({exp.country})</div>
                        <div className="text-slate-600 mt-0.5 italic">{exp.tasks}</div>
                      </div>
                    </div>
                  ))}

                  {/* Section: Schulbildung */}
                  <div className="font-bold text-xs uppercase tracking-wide text-blue-950 border-b border-slate-200 pb-1 mb-2 mt-3">
                    Schulische Ausbildung
                  </div>
                  {educationList.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-12 gap-1 mb-2.5 text-[10.5px]">
                      <div className="col-span-4 text-slate-600 font-medium">
                        {edu.startDate} – {edu.endDate}
                      </div>
                      <div className="col-span-8">
                        <strong className="text-slate-950">{edu.degree}</strong>
                        <div className="text-slate-700">{edu.institution}, {edu.city} ({edu.country})</div>
                        {edu.description && <div className="text-slate-500 text-[10px]">{edu.description}</div>}
                      </div>
                    </div>
                  ))}

                  {/* Section: Sprachkenntnisse */}
                  <div className="font-bold text-xs uppercase tracking-wide text-blue-950 border-b border-slate-200 pb-1 mb-2 mt-3">
                    Sprachkenntnisse
                  </div>
                  {languageList.map((lang) => (
                    <div key={lang.id} className="grid grid-cols-12 gap-1 mb-1.5 text-[10.5px]">
                      <div className="col-span-4 text-slate-600 font-medium">{lang.language}</div>
                      <div className="col-span-8">
                        <strong>{lang.level}</strong>
                        {lang.certificate && <span className="text-slate-600 ml-1.5">({lang.certificate})</span>}
                      </div>
                    </div>
                  ))}

                  {/* Section: Kenntnisse & Fertigkeiten */}
                  <div className="font-bold text-xs uppercase tracking-wide text-blue-950 border-b border-slate-200 pb-1 mb-2 mt-3">
                    Kenntnisse & Interessen
                  </div>
                  <div className="grid grid-cols-12 gap-1 mb-2 text-[10.5px]">
                    <div className="col-span-4 text-slate-600 font-medium">EDV & IT:</div>
                    <div className="col-span-8">{skillsText}</div>
                    <div className="col-span-4 text-slate-600 font-medium">Interessen:</div>
                    <div className="col-span-8">{interestsText}</div>
                  </div>

                  {/* Signature and Location */}
                  <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end">
                    <div>
                      <div className="text-slate-700">{locationDate}</div>
                      <div className="h-7" />
                      <div className="font-bold text-slate-900">{personalInfo.fullName}</div>
                    </div>
                    <div className="text-[9px] text-slate-400 italic">
                      DIN 5008 konform • Erstellt via Ausbildung Portal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: DIN 5008 ANSCHREIBEN GENERATOR */}
        {/* =================================================================== */}
        {activeTab === 'coverLetter' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Anschreiben Inputs (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Presets */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-blue-950 dark:text-blue-200">
                    Deutsche Muster-Vorlagen laden:
                  </div>
                  <div className="text-xs text-blue-800 dark:text-blue-400">
                    Wähle ein professionell formuliertes Anschreiben für dein Fachgebiet
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCoverSubject('Bewerbung um einen Ausbildungsplatz als Pflegefachmann (m/w/d) zum 01.09.2027');
                      setCoverRecipient({
                        company: 'Charité – Universitätsmedizin Berlin',
                        contactPerson: 'Frau Dr. Stefanie Weber',
                        department: 'Zentrale Bewerbungsstelle Pflege',
                        address: 'Charitéplatz 1',
                        postalCodeCity: '10117 Berlin',
                      });
                      setCoverBody(
                        `mit großem Interesse habe ich Ihre Stellenausschreibung für die generalistische Pflegeausbildung an der Charité verfolgt. Als engagierte Persönlichkeit mit erfolgreich absolviertem Goethe-Zertifikat B2 ist es mein fester Entschluss, meine berufliche Zukunft in der qualifizierten Krankenpflege in Deutschland aufzubauen.\n\nDurch mein einjähriges Pflegepraktikum am Dhaka Community Hospital konnte ich bereits wertvolle praktische Erfahrungen sammeln und den Stationsalltag kennenlernen. Die Patientinnen und Patienten schätzen meine Geduld und meine Zuverlässigkeit.\n\nÜber die Gelegenheit, mich Ihnen in einem persönlichen oder digitalen Gespräch vorzustellen, freue ich mich sehr.`
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Pflege
                  </button>
                  <button
                    onClick={() => {
                      setCoverSubject('Bewerbung um eine Ausbildung zum Fachinformatiker für Anwendungsentwicklung');
                      setCoverRecipient({
                        company: 'SAP SE – Head of Vocational Training',
                        contactPerson: 'Herrn Dr. Thomas Schmidt',
                        department: 'Talent Acquisition Europe',
                        address: 'Dietmar-Hopp-Allee 16',
                        postalCodeCity: '69190 Walldorf',
                      });
                      setCoverBody(
                        `mit großer Begeisterung bewerbe ich mich um die Ausbildung zum Fachinformatiker für Anwendungsentwicklung bei der SAP SE.\n\nBereits während meiner schulischen Laufbahn mit Schwerpunkt Naturwissenschaften und Informatik habe ich mich intensiv mit moderner Softwareentwicklung (TypeScript, Python) beschäftigt. Mit meinem Goethe-Zertifikat B2 kann ich komplexe technische Sachverhalte sicher auf Deutsch kommunizieren.\n\nIch freue mich sehr über eine Einladung zum Auswahltag oder Online-Interview.`
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
                  >
                    IT
                  </button>
                </div>
              </div>

              {/* Sender & Recipient Block */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Absender & Empfängerfenster (DIN 5008)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Absender Name
                    </label>
                    <input
                      type="text"
                      value={coverSender.name}
                      onChange={(e) => setCoverSender({ ...coverSender, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Absender Ort
                    </label>
                    <input
                      type="text"
                      value={coverSender.postalCodeCity}
                      onChange={(e) => setCoverSender({ ...coverSender, postalCodeCity: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Empfänger (Anschriftfeld DIN 5008 max. 9 Zeilen):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Firmenname"
                      value={coverRecipient.company}
                      onChange={(e) => setCoverRecipient({ ...coverRecipient, company: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Ansprechpartner (z.B. Frau Dr. Weber)"
                      value={coverRecipient.contactPerson}
                      onChange={(e) => setCoverRecipient({ ...coverRecipient, contactPerson: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Straße und Hausnummer"
                      value={coverRecipient.address}
                      onChange={(e) => setCoverRecipient({ ...coverRecipient, address: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="PLZ und Ort (z.B. 10117 Berlin)"
                      value={coverRecipient.postalCodeCity}
                      onChange={(e) => setCoverRecipient({ ...coverRecipient, postalCodeCity: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Subject & Body */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Betreffzeile (DIN 5008: Fett, ohne das Wort &apos;Betreff&apos;)
                  </label>
                  <input
                    type="text"
                    value={coverSubject}
                    onChange={(e) => setCoverSubject(e.target.value)}
                    className="w-full px-3.5 py-2 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Datum & Ort
                    </label>
                    <input
                      type="text"
                      value={coverDateLine}
                      onChange={(e) => setCoverDateLine(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                      Anrede
                    </label>
                    <input
                      type="text"
                      value={coverSalutation}
                      onChange={(e) => setCoverSalutation(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Anschreiben-Fließtext (Absätze durch Leerzeilen trennen)
                  </label>
                  <textarea
                    rows={8}
                    value={coverBody}
                    onChange={(e) => setCoverBody(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs leading-relaxed rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Anlagenvermerk
                  </label>
                  <input
                    type="text"
                    value={coverEnclosures}
                    onChange={(e) => setCoverEnclosures(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Right: DIN 5008 Anschreiben Live Letter Sheet (6 cols sticky) */}
            <div className="lg:col-span-6 sticky top-24">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      DIN 5008 Geschäftsbrief Norm-Layout
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(document.getElementById('din-letter-preview')?.innerText || '')}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* DIN 5008 Letter Visual Box */}
                <div
                  id="din-letter-preview"
                  className="bg-white text-slate-950 p-8 rounded-lg shadow-inner border border-slate-300 text-[11px] leading-relaxed font-sans max-h-[750px] overflow-y-auto"
                >
                  {/* Sender Header One-line underline */}
                  <div className="text-[8.5px] text-slate-500 border-b border-slate-300 pb-1 mb-8">
                    {coverSender.name} • {coverSender.address} • {coverSender.postalCodeCity}
                  </div>

                  {/* Recipient Address Window (DIN 5008 45mm height approx) */}
                  <div className="min-h-[70px] mb-6 text-[11px] leading-snug">
                    <div className="font-bold">{coverRecipient.company}</div>
                    {coverRecipient.contactPerson && <div>{coverRecipient.contactPerson}</div>}
                    {coverRecipient.department && <div>{coverRecipient.department}</div>}
                    <div>{coverRecipient.address}</div>
                    <div>{coverRecipient.postalCodeCity}</div>
                  </div>

                  {/* Date Line Right-Aligned */}
                  <div className="text-right text-[10.5px] text-slate-700 mb-6">
                    {coverDateLine}
                  </div>

                  {/* Subject Line (DIN 5008: bold, no "Betreff") */}
                  <div className="font-bold text-[12px] text-slate-950 mb-4 leading-snug">
                    {coverSubject}
                  </div>

                  {/* Salutation */}
                  <div className="mb-3 text-[11px] font-medium">
                    {coverSalutation}
                  </div>

                  {/* Body Paragraphs */}
                  <div className="space-y-3 text-[11px] leading-relaxed text-justify mb-6">
                    {coverBody.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Sign-off with 3 empty lines for signature */}
                  <div className="mt-6 mb-8">
                    <div>{coverSignOff}</div>
                    <div className="h-10" />
                    <div className="font-bold text-slate-900">{coverSender.name}</div>
                  </div>

                  {/* Enclosures (Anlagenvermerk) */}
                  {coverEnclosures && (
                    <div className="text-[10px] text-slate-700 pt-3 border-t border-slate-200">
                      <strong>{coverEnclosures}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: BEWERBUNGS-TRESOR (DOCUMENT VAULT) */}
        {/* =================================================================== */}
        {activeTab === 'vault' && (
          <div className="space-y-8">
            {/* Storage summary bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Dokumente gesamt</div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {documents.length} Dateien
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Belegter Speicher</div>
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                  8.25 MB / 15 MB
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Verifizierte Nachweise</div>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {documents.filter((d) => d.isVerified).length} Beglaubigt
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-xs font-semibold text-slate-500 uppercase">Verschlüsselung</div>
                <div className="text-2xl font-extrabold text-amber-500 mt-1">
                  AES-256 (DSGVO)
                </div>
              </div>
            </div>

            {/* Filter Pills & Upload Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'ALL', label: 'Alle Dokumente' },
                  { key: 'LANGUAGE_CERTIFICATE', label: 'Sprachzertifikate' },
                  { key: 'SCHOOL_TRANSCRIPT', label: 'Schulzeugnisse & Apostille' },
                  { key: 'PASSPORT', label: 'Reisepass & Fotos' },
                  { key: 'WORK_REFERENCE', label: 'Praktika & Zeugnisse' },
                ].map((pill) => (
                  <button
                    key={pill.key}
                    onClick={() => setVaultFilter(pill.key)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                      vaultFilter === pill.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors">
                <Upload className="w-4 h-4" />
                Neues Dokument hochladen
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDocuments([
                        ...documents,
                        {
                          id: `doc-${Date.now()}`,
                          title: file.name.replace(/\.[^/.]+$/, ''),
                          category: 'OTHER',
                          fileName: file.name,
                          fileSizeFormatted: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                          mimeType: file.type || 'application/pdf',
                          uploadDate: 'Heute',
                          isVerified: false,
                        },
                      ]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      {doc.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <Check className="w-3 h-3" /> Beglaubigt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Ausstehend
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 line-clamp-1">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono truncate">
                      {doc.fileName}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <span>{doc.fileSizeFormatted}</span> • <span>{doc.uploadDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Herunterladen von ${doc.fileName}...`)}
                        className="p-1.5 hover:text-blue-600 transition-colors"
                        title="Herunterladen"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDocuments(documents.filter((d) => d.id !== doc.id))}
                        className="p-1.5 hover:text-rose-500 transition-colors"
                        title="Aus Tresor entfernen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: BOTSCHAFT & VISUM-CHECKLISTE */}
        {/* =================================================================== */}
        {activeTab === 'checklist' && (
          <div className="space-y-8">
            {/* Progress Card */}
            <div className="p-8 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl shadow-lg border border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  Offizielle Vorbereitung • Deutsches Nationales Visum D (§ 16a AufenthG)
                </div>
                <h3 className="text-2xl font-bold mb-2">Visum & Botschafts-Bereitschaft</h3>
                <p className="text-blue-200 text-sm">
                  {completedChecklistCount} von {checklist.length} Meilensteinen erfolgreich abgeschlossen.
                  Vollständige Unterlagen sind Voraussetzung für die reibungslose Visumerteilung bei der Botschaft.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-blue-950/80 border-4 border-amber-400 text-2xl font-black text-amber-300">
                  {progressPercentage}%
                </div>
              </div>
            </div>

            {/* Checklist Category Groups */}
            <div className="space-y-6">
              {[
                { key: 'EMBASSY_VISA', label: '1. Botschaft & Visumsunterlagen (Botschafts-Termin)' },
                { key: 'DOCUMENT_AUTHENTICATION', label: '2. Zeugnisanerkennung & Beglaubigungen' },
                { key: 'INTERVIEW_PREP', label: '3. Vorstellungsgespräch & Fachsimulation' },
              ].map((categoryGroup) => {
                const items = checklist.filter((i) => i.category === categoryGroup.key);
                if (items.length === 0) return null;

                return (
                  <div
                    key={categoryGroup.key}
                    className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
                  >
                    <h4 className="font-extrabold text-sm uppercase tracking-wide text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
                      {categoryGroup.label}
                    </h4>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-4 ${
                            item.isCompleted
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/50'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="pt-0.5">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                item.isCompleted
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-400 bg-white dark:bg-slate-900'
                              }`}
                            >
                              {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-bold ${
                                  item.isCompleted
                                    ? 'line-through text-slate-500 dark:text-slate-400'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {item.title}
                              </span>
                              {item.dueDate && (
                                <span className="text-[11px] font-medium text-slate-400">
                                  Fällig: {item.dueDate}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
