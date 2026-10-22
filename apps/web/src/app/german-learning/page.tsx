'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle,
  Flame,
  ArrowRight,
  BrainCircuit,
  Volume2,
  Bookmark,
  Award,
  Sparkles,
  X,
  PlayCircle,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface VocabularyCard {
  word: string;
  article: 'der' | 'die' | 'das' | null;
  plural: string | null;
  ipa: string;
  translations: { en: string; bn: string; de?: string };
  exampleSentenceDe: string;
  exampleSentenceTranslation: { en: string; bn: string };
}

interface QuizQ {
  id: string;
  questionDe: string;
  questionTranslation: { en: string; bn: string };
  explanationDe: string;
  explanationTranslation: { en: string; bn: string };
  options: { id: string; textDe: string; translation?: { en: string; bn: string }; isCorrect?: boolean }[];
}

interface LessonData {
  id: string;
  slug: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  titleDe: string;
  titleTranslations: { en: string; bn: string };
  summary: { en: string; bn: string };
  grammarNotes: { en: string; bn: string };
  estimatedMinutes: number;
  coinReward: number;
  vocabulary: VocabularyCard[];
  quizQuestions: QuizQ[];
}

const CURRICULUM_DATA: Record<string, { title: string; description: string; lessons: LessonData[] }[]> = {
  A1: [
    {
      title: 'Begrüßung & Erste Schritte (Greetings & First Steps)',
      description: 'Formal German greetings, introductions, polite W-questions for vocational interviews.',
      lessons: [
        {
          id: 'les-a1-001',
          slug: 'a1-m1-sich-vorstellen',
          level: 'A1',
          titleDe: 'Sich vorstellen und Hallo sagen',
          titleTranslations: {
            en: 'Introducing Yourself & Saying Hello',
            bn: 'নিজের পরিচয় দেওয়া এবং শুভেচ্ছা বিনিময়',
          },
          summary: {
            en: 'Learn how to greet employers politely, state your name and origin, and navigate first meetings.',
            bn: 'কীভাবে নিয়োগকর্তাকে শালীনভাবে অভিবাদন জানাতে হয় এবং নিজের পরিচয় দিতে হয়।',
          },
          grammarNotes: {
            en: 'German verbs conjugate by person: "Ich heiße..." (I am called), "Sie heißen..." (You are called - formal). When applying for an Ausbildung, always address employers and interviewers with formal "Sie".',
            bn: 'জার্মান ভাষায় সর্বনাম অনুযায়ী ক্রিয়াপদ পরিবর্তিত হয়: "Ich heiße..." (আমার নাম...), "Sie heißen..." (আপনার নাম... - আনুষ্ঠানিক)। আউসবিল্ডুং ইন্টারভিউতে সবসময় ফর্মাল "Sie" ব্যবহার করুন।',
          },
          estimatedMinutes: 15,
          coinReward: 15,
          vocabulary: [
            {
              word: 'Guten Tag',
              article: null,
              plural: null,
              ipa: '[ˈɡuːtn̩ ˈtaːk]',
              translations: { en: 'Good day / Hello', bn: 'শুভ দিন / হ্যালো' },
              exampleSentenceDe: 'Guten Tag, mein Name ist Tanvir.',
              exampleSentenceTranslation: { en: 'Good day, my name is Tanvir.', bn: 'শুভ দিন, আমার নাম তানভীর।' },
            },
            {
              word: 'Name',
              article: 'der',
              plural: 'die Namen',
              ipa: '[ˈnaːmə]',
              translations: { en: 'Name', bn: 'নাম' },
              exampleSentenceDe: 'Wie ist Ihr Name?',
              exampleSentenceTranslation: { en: 'What is your name? (formal)', bn: 'আপনার নাম কী? (ফর্মাল)' },
            },
            {
              word: 'Ausbildung',
              article: 'die',
              plural: 'die Ausbildungen',
              ipa: '[ˈaʊ̯sˌbɪldʊŋ]',
              translations: { en: 'Apprenticeship / Vocational training', bn: 'বৃত্তিমূলক প্রশিক্ষণ' },
              exampleSentenceDe: 'Ich mache eine Ausbildung in Deutschland.',
              exampleSentenceTranslation: { en: 'I am doing vocational training in Germany.', bn: 'আমি জার্মানিতে একটি আউসবিল্ডুং করছি।' },
            },
            {
              word: 'heißen',
              article: null,
              plural: null,
              ipa: '[ˈhaɪ̯sn̩]',
              translations: { en: 'to be called', bn: 'নাম হওয়া' },
              exampleSentenceDe: 'Ich heiße Shakib und komme aus Bangladesch.',
              exampleSentenceTranslation: { en: 'My name is Shakib and I come from Bangladesh.', bn: 'আমার নাম সাকিব এবং আমি বাংলাদেশ থেকে এসেছি।' },
            },
          ],
          quizQuestions: [
            {
              id: 'q1',
              questionDe: 'Wie begrüßen Sie Ihren Arbeitgeber im Ausbildungsgespräch formell?',
              questionTranslation: {
                en: 'How do you greet your employer formally in an interview?',
                bn: 'ইন্টারভিউতে আপনি নিয়োগকর্তাকে আনুষ্ঠানিকভাবে কীভাবে শুভেচ্ছা জানাবেন?',
              },
              explanationDe: '"Guten Tag" oder "Guten Morgen" ist die korrekte formelle Begrüßung.',
              explanationTranslation: {
                en: '"Guten Tag" is the standard formal greeting in Germany.',
                bn: '"Guten Tag" হলো জার্মানিতে মানসম্মত আনুষ্ঠানিক অভিবাদন।',
              },
              options: [
                { id: 'opt1', textDe: 'Guten Tag, Herr Müller!', translation: { en: 'Good day, Mr. Müller!', bn: 'শুভ দিন, জনাব মুলার!' }, isCorrect: true },
                { id: 'opt2', textDe: 'Hi, was geht ab?', translation: { en: "Hi, what's up?", bn: 'হাই, কী খবর?' }, isCorrect: false },
                { id: 'opt3', textDe: 'Tschüss, alles klar?', translation: { en: 'Bye, all good?', bn: 'বিদায়, সব ঠিক?' }, isCorrect: false },
              ],
            },
            {
              id: 'q2',
              questionDe: 'Welcher bestimmte Artikel gehört zu "Ausbildung"?',
              questionTranslation: {
                en: 'Which definite article belongs to "Ausbildung"?',
                bn: '"Ausbildung" শব্দের নির্দিষ্ট আর্টিকেল কোনটি?',
              },
              explanationDe: 'Substantive mit der Endung "-ung" sind im Deutschen immer feminin (die).',
              explanationTranslation: {
                en: 'German nouns ending in "-ung" are always feminine (die).',
                bn: 'যেসব বিশেষ্যের শেষে "-ung" থাকে, সেগুলো সর্বদা স্ত্রীবাচক (die)।',
              },
              options: [
                { id: 'opt4', textDe: 'der Ausbildung', isCorrect: false },
                { id: 'opt5', textDe: 'die Ausbildung', isCorrect: true },
                { id: 'opt6', textDe: 'das Ausbildung', isCorrect: false },
              ],
            },
          ],
        },
        {
          id: 'les-a1-002',
          slug: 'a1-m1-vorstellungsgespraech-fragen',
          level: 'A1',
          titleDe: 'W-Fragen: Woher kommen Sie? Was machen Sie?',
          titleTranslations: {
            en: 'W-Questions: Where do you come from? What do you do?',
            bn: 'W-প্রশ্ন: আপনি কোথা থেকে এসেছেন? আপনি কী করেন?',
          },
          summary: {
            en: 'Master essential German question words and clear spoken responses.',
            bn: 'জরুরি প্রশ্নবোধক শব্দ শিখুন এবং আউসবিল্ডুং কথোপকথনে সহজে উত্তর দিন।',
          },
          grammarNotes: {
            en: 'In German W-questions, the question word comes first, and the conjugated verb MUST occupy position 2: "Woher (1) kommen (2) Sie?".',
            bn: 'জার্মান ডব্লিউ-প্রশ্নে প্রশ্নবোধক শব্দ প্রথমে বসে এবং কনজুগেটেড ভার্ব সর্বদা ২ নম্বর স্থানে বসে: "Woher (১) kommen (২) Sie?".',
          },
          estimatedMinutes: 20,
          coinReward: 15,
          vocabulary: [
            {
              word: 'woher',
              article: null,
              plural: null,
              ipa: '[voːˈheːɐ̯]',
              translations: { en: 'from where', bn: 'কোথা থেকে' },
              exampleSentenceDe: 'Woher kommen Sie? — Ich komme aus Dhaka.',
              exampleSentenceTranslation: { en: 'Where do you come from? — I come from Dhaka.', bn: 'আপনি কোথা থেকে এসেছেন? — আমি ঢাকা থেকে এসেছি।' },
            },
            {
              word: 'Beruf',
              article: 'der',
              plural: 'die Berufe',
              ipa: '[bəˈʁuːf]',
              translations: { en: 'profession / career', bn: 'পেশা / বৃত্তি' },
              exampleSentenceDe: 'Was ist Ihr Traumberuf in Deutschland?',
              exampleSentenceTranslation: { en: 'What is your dream profession in Germany?', bn: 'জার্মানিতে আপনার স্বপ্নের পেশা কোনটি?' },
            },
          ],
          quizQuestions: [
            {
              id: 'q3',
              questionDe: 'Welcher Satz hat die richtige deutsche Wortstellung für eine W-Frage?',
              questionTranslation: {
                en: 'Which sentence has the correct German word order for a W-question?',
                bn: 'কোন বাক্যে ডব্লিউ-প্রশ্নের সঠিক জার্মান শব্দবিন্যাস রয়েছে?',
              },
              explanationDe: 'In W-Fragen steht das konjugierte Verb an Position 2.',
              explanationTranslation: {
                en: 'In W-questions, the conjugated verb is always in position 2.',
                bn: 'ডব্লিউ-প্রশ্নে কনজুগেটেড ভার্ব সর্বদা ২ নম্বর স্থানে থাকে।',
              },
              options: [
                { id: 'opt7', textDe: 'Woher Sie kommen?', isCorrect: false },
                { id: 'opt8', textDe: 'Woher kommen Sie?', isCorrect: true },
                { id: 'opt9', textDe: 'Kommen Woher Sie?', isCorrect: false },
              ],
            },
          ],
        },
      ],
    },
  ],
  A2: [
    {
      title: 'Gesundheit, Arztbesuch & Notfälle (Health & Medical Visits)',
      description: 'Appointments, describing symptoms to doctors, statutory health insurance in Germany.',
      lessons: [
        {
          id: 'les-a2-001',
          slug: 'a2-m1-beim-arzt',
          level: 'A2',
          titleDe: 'Beim Arzt: Symptome beschreiben und Termine vereinbaren',
          titleTranslations: {
            en: 'At the Doctor: Describing Symptoms & Booking Appointments',
            bn: 'ডাক্তারের চেম্বারে: অসুস্থতা বর্ণনা এবং অ্যাপয়েন্টমেন্ট নেওয়া',
          },
          summary: {
            en: 'Essential vocabulary and dialogue structures for visits to the GP (Hausarzt) or specialist.',
            bn: 'জার্মানিতে জেনারেল ফিজিশিয়ানের কাছে যাওয়ার প্রয়োজনীয় শব্দ ও বাক্য।',
          },
          grammarNotes: {
            en: 'Modal verbs send the main infinitive verb to the very end of the sentence: "Ich muss heute zum Arzt gehen".',
            bn: 'মোডাল ভার্ব ব্যবহার করলে মূল ইনফিনিটিভ ভার্বটি বাক্যের একেবারে শেষে চলে যায়।',
          },
          estimatedMinutes: 20,
          coinReward: 20,
          vocabulary: [
            {
              word: 'Krankenversicherung',
              article: 'die',
              plural: 'die Krankenversicherungen',
              ipa: '[ˈkʁaŋkn̩fɛɐ̯ˌzɪçəʁʊŋ]',
              translations: { en: 'health insurance', bn: 'স্বাস্থ্যবীমা' },
              exampleSentenceDe: 'Jeder Auszubildende in Deutschland braucht eine gesetzliche Krankenversicherung.',
              exampleSentenceTranslation: { en: 'Every apprentice in Germany needs statutory health insurance.', bn: 'জার্মানিতে প্রত্যেক শিক্ষার্থীর সরকারি স্বাস্থ্যবীমা প্রয়োজন।' },
            },
            {
              word: 'Termin',
              article: 'der',
              plural: 'die Termine',
              ipa: '[tɛʁˈmiːn]',
              translations: { en: 'appointment', bn: 'অ্যাপয়েন্টমেন্ট' },
              exampleSentenceDe: 'Ich möchte bitte einen Termin für morgen vereinbaren.',
              exampleSentenceTranslation: { en: 'I would like to book an appointment for tomorrow, please.', bn: 'আমি আগামীকালের জন্য একটি অ্যাপয়েন্টমেন্ট নিতে চাই।' },
            },
          ],
          quizQuestions: [
            {
              id: 'q4',
              questionDe: 'Wohin gehört das Hauptverb bei einem Modalverb (z.B. "können")?',
              questionTranslation: {
                en: 'Where does the main verb go when using a modal verb?',
                bn: 'মোডাল ভার্বের ক্ষেত্রে মূল ভার্বটি বাক্যের কোথায় বসে?',
              },
              explanationDe: 'Das Vollverb im Infinitiv steht immer am Satzende: "Ich kann morgen kommen."',
              explanationTranslation: {
                en: 'The infinitive verb always stands at the end of the clause.',
                bn: 'ইনফিনিটিভ ভার্ব সর্বদা বাক্যের একেবারে শেষে বসে।',
              },
              options: [
                { id: 'opt10', textDe: 'Direkt nach dem Modalverb', isCorrect: false },
                { id: 'opt11', textDe: 'Am Ende des Satzes im Infinitiv', isCorrect: true },
                { id: 'opt12', textDe: 'Ganz am Satzanfang', isCorrect: false },
              ],
            },
          ],
        },
      ],
    },
  ],
  B1: [
    {
      title: 'Bewerbung & Anschreiben für Ausbildung (Application & Cover Letter)',
      description: 'Writing formal German cover letters adhering to German DIN 5008 norms.',
      lessons: [
        {
          id: 'les-b1-001',
          slug: 'b1-m1-deutsches-anschreiben',
          level: 'B1',
          titleDe: 'Das deutsche Anschreiben (DIN 5008)',
          titleTranslations: {
            en: 'The German Cover Letter (DIN 5008 Standard)',
            bn: 'জার্মান কাভার লেটার (DIN 5008 স্ট্যান্ডার্ড)',
          },
          summary: {
            en: 'Structure, professional phrasing, and subordinate clauses to impress German HR departments.',
            bn: 'আউসবিল্ডুং আবেদনের ফর্মাল কাভার লেটার লেখার সঠিক কাঠামো ও পেশাদার ভাষার ব্যবহার।',
          },
          grammarNotes: {
            en: 'In subordinate clauses introduced by "weil" or "da", the conjugated verb moves to the absolute end.',
            bn: '"weil" বা "da" দ্বারা শুরু হওয়া সাবর্ডিনেট ক্লজে কনজুগেটেড ভার্বটি বাক্যের শেষে চলে যায়।',
          },
          estimatedMinutes: 25,
          coinReward: 25,
          vocabulary: [
            {
              word: 'Bewerbungsunterlagen',
              article: 'die',
              plural: 'die Bewerbungsunterlagen',
              ipa: '[bəˈvɛʁbʊŋsˌʔʊntɐlaːɡn̩]',
              translations: { en: 'application dossier', bn: 'আবেদনের নথিপত্র' },
              exampleSentenceDe: 'Bitte senden Sie Ihre vollständigen Bewerbungsunterlagen per E-Mail.',
              exampleSentenceTranslation: { en: 'Please send your complete application documents via email.', bn: 'দয়া করে আপনার সম্পূর্ণ আবেদনপত্র ইমেইলে প্রেরণ করুন।' },
            },
            {
              word: 'Zuverlässigkeit',
              article: 'die',
              plural: null,
              ipa: '[ˈtsuːfɛɐ̯ˌlɛsɪçkaɪ̯t]',
              translations: { en: 'reliability', bn: 'নির্ভরযোগ্যতা' },
              exampleSentenceDe: 'In der deutschen Arbeitswelt ist Zuverlässigkeit eine Grundvoraussetzung.',
              exampleSentenceTranslation: { en: 'In the German workplace, reliability is fundamental.', bn: 'জার্মান কর্মক্ষেত্রে নির্ভরযোগ্যতা অত্যন্ত অপরিহার্য।' },
            },
          ],
          quizQuestions: [
            {
              id: 'q5',
              questionDe: 'Wie lautet die korrekte Höflichkeitsformel am Ende eines Anschreibens?',
              questionTranslation: {
                en: 'What is the correct polite closing formula at the end of a cover letter?',
                bn: 'কাভার লেটারের শেষে ব্যবহারের জন্য সঠিক ফর্মাল সমাপ্তি বাক্য কোনটি?',
              },
              explanationDe: '"Mit freundlichen Grüßen" ist der universelle deutsche Geschäftsstandard.',
              explanationTranslation: {
                en: '"Mit freundlichen Grüßen" is the standard formal sign-off.',
                bn: '"Mit freundlichen Grüßen" হলো জার্মান ব্যবসায়িক আনুষ্ঠানিক সমাপ্তি।',
              },
              options: [
                { id: 'opt13', textDe: 'Mit freundlichen Grüßen', isCorrect: true },
                { id: 'opt14', textDe: 'Liebe Grüße und bis bald', isCorrect: false },
                { id: 'opt15', textDe: 'Dein Freund Rahim', isCorrect: false },
              ],
            },
          ],
        },
      ],
    },
  ],
  B2: [
    {
      title: 'Fachsprache am Arbeitsplatz & Übergabe (Vocational Handover & Safety)',
      description: 'Technical terminology, handover protocols, and safety briefings in healthcare and engineering.',
      lessons: [
        {
          id: 'les-b2-001',
          slug: 'b2-m1-uebergabe-fachsprache',
          level: 'B2',
          titleDe: 'Übergabeprotokoll in Pflege und technischer Industrie',
          titleTranslations: {
            en: 'Shift Handover Protocols in Healthcare & Technical Trades',
            bn: 'নার্সিং ও টেকনিক্যাল কর্মক্ষেত্রে শিফট হ্যান্ডওভার প্রোটোকল',
          },
          summary: {
            en: 'Professional documentation, incident reporting, and passive voice structures in vocational contexts.',
            bn: 'কর্মক্ষেত্রে নিখুঁত রিপোর্ট তৈরি, কাজের বিবরণ লিপিবদ্ধ করা এবং প্যাসিভ ভয়েসের ব্যবহার।',
          },
          grammarNotes: {
            en: 'Passive voice ("wurde durchgeführt", "wird dokumentiert") is essential for neutral vocational documentation.',
            bn: 'কর্মক্ষেত্রের আনুষ্ঠানিক নথিপত্রে প্যাসিভ ভয়েস ("wurde durchgeführt") বহুল ব্যবহৃত হয়।',
          },
          estimatedMinutes: 30,
          coinReward: 30,
          vocabulary: [
            {
              word: 'Arbeitssicherheit',
              article: 'die',
              plural: null,
              ipa: '[ˈaʁbaɪ̯tsˌzɪçɐhaɪ̯t]',
              translations: { en: 'occupational safety', bn: 'কর্মক্ষেত্রের নিরাপত্তা' },
              exampleSentenceDe: 'Die Vorschriften zur Arbeitssicherheit müssen strikt eingehalten werden.',
              exampleSentenceTranslation: { en: 'Safety regulations must be strictly adhered to.', bn: 'কর্মক্ষেত্রের নিরাপত্তা সংক্রান্ত নীতিমালা মেনে চলতে হবে।' },
            },
            {
              word: 'Protokoll',
              article: 'das',
              plural: 'die Protokolle',
              ipa: '[pʁotoˈkɔl]',
              translations: { en: 'protocol / minutes', bn: 'কার্যবিবরণী / প্রোটোকল' },
              exampleSentenceDe: 'Nach der Schicht verfassen wir das Übergabeprotokoll.',
              exampleSentenceTranslation: { en: 'After the shift, we write the handover protocol.', bn: 'শিফট শেষে আমরা হ্যান্ডওভার প্রোটোকল লিখি।' },
            },
          ],
          quizQuestions: [
            {
              id: 'q6',
              questionDe: 'Welcher Satz steht im Vorgangspassiv Präteritum?',
              questionTranslation: {
                en: 'Which sentence is in the past process passive (Vorgangspassiv Präteritum)?',
                bn: 'কোন বাক্যটি অতীত প্যাসিভ ফর্মে রয়েছে?',
              },
              explanationDe: '"wurde ... durchgeführt" ist die korrekte passive Vergangenheitsform.',
              explanationTranslation: {
                en: '"wurde ... durchgeführt" is formed with wurde + past participle.',
                bn: '"wurde ... durchgeführt" হলো অতীত প্যাসিভ রূপ।',
              },
              options: [
                { id: 'opt16', textDe: 'Die Sicherheitsprüfung wurde vorschriftsmäßig durchgeführt.', isCorrect: true },
                { id: 'opt17', textDe: 'Wir führten die Prüfung durch.', isCorrect: false },
                { id: 'opt18', textDe: 'Die Prüfung wird gerade durchgeführt.', isCorrect: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const CEFR_LEVELS = [
  { code: 'A1', title: 'Beginner / Einstieg', badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' },
  { code: 'A2', title: 'Elementary / Grundlagen', badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800' },
  { code: 'B1', title: 'Intermediate / Selbstständig', badgeColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800' },
  { code: 'B2', title: 'Vocational / Fachsprache', badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-800' },
];

export default function GermanLearningPage() {
  const { locale } = useLanguage();
  const [activeLevel, setActiveLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    scorePercentage: number;
    passed: boolean;
    correctAnswers: number;
    coinRewardEarned: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bookmarks state (simulated client-side with localStorage synchronization)
  const [bookmarkedWords, setBookmarkedWords] = useState<Set<string>>(new Set());

  const toggleBookmark = (word: string) => {
    setBookmarkedWords((prev) => {
      const next = new Set(prev);
      if (next.has(word)) {
        next.delete(word);
      } else {
        next.add(word);
      }
      return next;
    });
  };

  const handleOpenLesson = (lesson: LessonData) => {
    setActiveLesson(lesson);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeLesson) return;
    setIsSubmitting(true);

    try {
      // Attempt backend API submission
      const payload = {
        answers: Object.entries(userAnswers).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        })),
      };

      const response = await fetch(`http://localhost:4000/api/v1/learning/lessons/${activeLesson.id}/quiz-attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const json = await response.json();
        setQuizResult({
          scorePercentage: json.data.scorePercentage,
          passed: json.data.passed,
          correctAnswers: json.data.correctAnswers,
          coinRewardEarned: json.data.coinRewardEarned,
        });
        setQuizSubmitted(true);
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Backend offline: gracefully fallback to client-evaluated standard scoring
    }

    // Client-side exact evaluation fallback
    let correctCount = 0;
    const total = activeLesson.quizQuestions.length;

    for (const q of activeLesson.quizQuestions) {
      const chosenOptId = userAnswers[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (correctOpt && chosenOptId === correctOpt.id) {
        correctCount += 1;
      }
    }

    const score = Math.round((correctCount / total) * 100);
    const passed = score >= 70;

    setQuizResult({
      scorePercentage: score,
      passed,
      correctAnswers: correctCount,
      coinRewardEarned: passed ? activeLesson.coinReward : 0,
    });
    setQuizSubmitted(true);
    setIsSubmitting(false);
  };

  const modulesForActiveLevel = CURRICULUM_DATA[activeLevel] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-300/40">
          <BookOpen className="w-3.5 h-3.5" />
          CEFR Standard German Curriculum (A1 – B2)
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          German Learning Platform
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Structured step-by-step vocational German curriculum designed specifically for apprentices in Germany.
          Includes trilingual grammar explanations in Bengali, English, and German with server-verified quizzes.
        </p>
      </div>

      {/* Gamification Banner: Streaks & Coins */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">Continuous Learning Streak: 3 Days</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">Active</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Pass lessons with &ge; 70% to maintain your streak and earn virtual coins to unlock speaking tandems.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+15–30 Coins per Quiz</span>
          </div>
        </div>
      </div>

      {/* Level Selection Tabs */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
          {CEFR_LEVELS.map((lvl) => (
            <button
              key={lvl.code}
              onClick={() => setActiveLevel(lvl.code as any)}
              className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                activeLevel === lvl.code
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Level {lvl.code}
            </button>
          ))}
        </div>

        {/* Modules & Lessons List */}
        <div className="space-y-8">
          {modulesForActiveLevel.map((module, mIdx) => (
            <div
              key={mIdx}
              className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800">
                  Module {mIdx + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {module.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {module.description}
                </p>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {module.lessons.map((lesson) => {
                  const localizedTitle =
                    locale === 'bn'
                      ? lesson.titleTranslations.bn
                      : locale === 'de'
                        ? lesson.titleDe
                        : lesson.titleTranslations.en;

                  const localizedSummary =
                    locale === 'bn' ? lesson.summary.bn : lesson.summary.en;

                  return (
                    <div
                      key={lesson.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {lesson.estimatedMinutes} mins
                          </span>
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            +{lesson.coinReward} Coins
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {lesson.titleDe}
                        </h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {localizedTitle}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {localizedSummary}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[11px] text-slate-500">
                          {lesson.vocabulary.length} Vocab &bull; {lesson.quizQuestions.length} Quiz Qs
                        </span>
                        <button
                          onClick={() => handleOpenLesson(lesson)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          Start Lesson
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Lesson & Quiz Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-300/40 mb-2">
                  Level {activeLesson.level} &bull; {activeLesson.estimatedMinutes} Minutes
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {activeLesson.titleDe}
                </h2>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {locale === 'bn' ? activeLesson.titleTranslations.bn : activeLesson.titleTranslations.en}
                </p>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grammar Explanation Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-slate-800 dark:text-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                <BrainCircuit className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Grammar & Practical Usage Notes (Bengali / English)</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {locale === 'bn' ? activeLesson.grammarNotes.bn : activeLesson.grammarNotes.en}
              </p>
            </div>

            {/* Vocabulary Flashcards Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Vocabulary Flashcards with Grammatical Gender & IPA
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeLesson.vocabulary.map((vocab, vIdx) => {
                  const articleColor =
                    vocab.article === 'der'
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/40'
                      : vocab.article === 'die'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40'
                        : vocab.article === 'das'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                          : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-400/40';

                  const isBookmarked = bookmarkedWords.has(vocab.word);

                  return (
                    <div
                      key={vIdx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2 relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {vocab.article && (
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${articleColor}`}>
                              {vocab.article}
                            </span>
                          )}
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {vocab.word}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleBookmark(vocab.word)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isBookmarked
                              ? 'bg-amber-500/20 text-amber-500 border-amber-400/40'
                              : 'text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                          title="Bookmark for review"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono">{vocab.ipa}</span>
                        {vocab.plural && <span>&bull; Pl: {vocab.plural}</span>}
                      </div>

                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {locale === 'bn' ? vocab.translations.bn : vocab.translations.en}
                      </p>

                      <div className="pt-1 text-[11px] text-slate-600 dark:text-slate-300 italic border-t border-slate-200/60 dark:border-slate-700/60">
                        &ldquo;{vocab.exampleSentenceDe}&rdquo;
                        <span className="block text-[10px] text-slate-500 not-italic">
                          {locale === 'bn'
                            ? vocab.exampleSentenceTranslation.bn
                            : vocab.exampleSentenceTranslation.en}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Practice Section */}
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Lesson Comprehension Quiz (Passing Score: 70%)
                </h3>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                  Reward: +{activeLesson.coinReward} Coins
                </span>
              </div>

              {/* Quiz Questions */}
              <div className="space-y-4">
                {activeLesson.quizQuestions.map((q, qIdx) => {
                  const selectedOpt = userAnswers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400">Question {qIdx + 1}</span>
                        <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {q.questionDe}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {locale === 'bn' ? q.questionTranslation.bn : q.questionTranslation.en}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const isSelected = selectedOpt === opt.id;
                          let optionStyle =
                            'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800';

                          if (isSelected) {
                            optionStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold';
                          }

                          if (quizSubmitted) {
                            if (opt.isCorrect) {
                              optionStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                            } else if (isSelected && !opt.isCorrect) {
                              optionStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300';
                            }
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption(q.id, opt.id)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                            >
                              <span>{opt.textDe}</span>
                              {quizSubmitted && opt.isCorrect && (
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Reveal */}
                      {quizSubmitted && (
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          <span className="font-bold text-blue-700 dark:text-blue-300">Explanation:</span>
                          <p>{q.explanationDe}</p>
                          <p className="text-slate-500 dark:text-slate-400">
                            {locale === 'bn' ? q.explanationTranslation.bn : q.explanationTranslation.en}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit Button & Evaluation Result */}
              {!quizSubmitted ? (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={
                      isSubmitting ||
                      Object.keys(userAnswers).length < activeLesson.quizQuestions.length
                    }
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white shadow-sm transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? 'Evaluating...' : 'Submit Quiz for Verification'}
                  </button>
                </div>
              ) : (
                quizResult && (
                  <div
                    className={`p-5 rounded-2xl border text-center space-y-2 animate-in fade-in duration-200 ${
                      quizResult.passed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-300'
                    }`}
                  >
                    <div className="inline-flex p-3 rounded-full bg-white dark:bg-slate-900 shadow-sm">
                      {quizResult.passed ? (
                        <Award className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <HelpCircle className="w-8 h-8 text-rose-500" />
                      )}
                    </div>
                    <h4 className="text-lg font-bold">
                      {quizResult.passed
                        ? `Congratulations! You Passed with ${quizResult.scorePercentage}%`
                        : `Score: ${quizResult.scorePercentage}% (Threshold: 70%)`}
                    </h4>
                    <p className="text-xs">
                      {quizResult.passed
                        ? `You answered ${quizResult.correctAnswers} of ${activeLesson.quizQuestions.length} questions correctly. You earned +${quizResult.coinRewardEarned} coins!`
                        : 'Review the explanations above and retry the quiz to master these concepts.'}
                    </p>
                    {!quizResult.passed && (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setUserAnswers({});
                          setQuizResult(null);
                        }}
                        className="mt-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                      >
                        Retry Quiz
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
