/**
 * DEVELOPMENT PREVIEW MOCK DATA
 *
 * NOTE: This data is strictly utilized for visual preview & UI design testing during Phase 1.
 * In Phase 2+ and production, all data is fetched exclusively from the NestJS REST API (/api/v1).
 * DO NOT use this module in production API response paths.
 */

export interface MockJobListing {
  id: string;
  title: string;
  employer: string;
  city: string;
  postalCode: string;
  category: string;
  stipendYear1: string;
  publishedDate: string;
  externalSourceUrl: string;
  tags: string[];
}

export const MOCK_JOBS: MockJobListing[] = [
  {
    id: 'job-001',
    title: 'Ausbildung zum Pflegefachmann / zur Pflegefachfrau (m/w/d)',
    employer: 'Charité – Universitätsmedizin Berlin',
    city: 'Berlin',
    postalCode: '10117',
    category: 'Healthcare / Nursing',
    stipendYear1: '€1,190 / month',
    publishedDate: '2026-10-15',
    externalSourceUrl: 'https://jobsuche.api.bund.dev',
    tags: ['B2 German Recommended', 'Housing Support Available', 'High Demand'],
  },
  {
    id: 'job-002',
    title: 'Ausbildung Fachinformatiker für Anwendungsentwicklung (m/w/d)',
    employer: 'SAP SE',
    city: 'Walldorf / Heidelberg',
    postalCode: '69190',
    category: 'IT & Software Engineering',
    stipendYear1: '€1,150 / month',
    publishedDate: '2026-10-14',
    externalSourceUrl: 'https://jobsuche.api.bund.dev',
    tags: ['B1/B2 German', 'Laptop Provided', 'Mentorship Program'],
  },
  {
    id: 'job-003',
    title: 'Ausbildung Mechatroniker (m/w/d) für Fahrzeugtechnik',
    employer: 'BMW Group',
    city: 'Munich (München)',
    postalCode: '80809',
    category: 'Engineering & Automotive',
    stipendYear1: '€1,080 / month',
    publishedDate: '2026-10-13',
    externalSourceUrl: 'https://jobsuche.api.bund.dev',
    tags: ['B1 German', 'Modern Workshop', 'Canteen Subsidy'],
  },
  {
    id: 'job-004',
    title: 'Ausbildung Hotelfachmann / Hotelfachfrau (m/w/d)',
    employer: 'Steigenberger Grandhotel',
    city: 'Frankfurt am Main',
    postalCode: '60311',
    category: 'Hospitality & Gastronomy',
    stipendYear1: '€1,000 / month',
    publishedDate: '2026-10-12',
    externalSourceUrl: 'https://jobsuche.api.bund.dev',
    tags: ['B1 German', 'Staff Meal Included', 'Immediate Start'],
  },
  {
    id: 'job-005',
    title: 'Ausbildung Elektroniker für Betriebstechnik (m/w/d)',
    employer: 'Siemens AG',
    city: 'Nürnberg',
    postalCode: '90403',
    category: 'Electrical & Industrial',
    stipendYear1: '€1,120 / month',
    publishedDate: '2026-10-11',
    externalSourceUrl: 'https://jobsuche.api.bund.dev',
    tags: ['B1 German', 'Safety Equipment Provided', 'High Takeover Rate'],
  },
];

export interface MockCourse {
  id: string;
  title: string;
  level: string;
  instructor: string;
  instructorTitle: string;
  durationHours: number;
  lessonsCount: number;
  price: string;
  isFree: boolean;
  category: string;
  badge: string;
  description: string;
}

export const MOCK_COURSES: MockCourse[] = [
  {
    id: 'course-001',
    title: 'Complete German A1 for Ausbildung Starters',
    level: 'A1 Beginner',
    instructor: 'Julia Schneider, M.A.',
    instructorTitle: 'Goethe-Certified German Educator',
    durationHours: 35,
    lessonsCount: 48,
    price: 'Free',
    isFree: true,
    category: 'General German',
    badge: 'Popular Free Course',
    description: 'Master essential everyday German, grammar basics, self-introduction, and foundational vocational vocabulary.',
  },
  {
    id: 'course-002',
    title: 'B2 Medical German for Nursing Ausbildung (Pflegefachmann)',
    level: 'B2 Specialized',
    instructor: 'Dr. med. Tobias Weber',
    instructorTitle: 'Clinical Instructor & Medical Linguist',
    durationHours: 28,
    lessonsCount: 36,
    price: '€29 (or 350 Coins)',
    isFree: false,
    category: 'Healthcare Terminology',
    badge: 'High Employment Impact',
    description: 'Patient anamnesis, medication reporting, hospital documentation, and verbal handovers in German.',
  },
  {
    id: 'course-003',
    title: 'German Workplace Etiquette & Embassy Interview Mastery',
    level: 'All Levels',
    instructor: 'Rahim Chowdhury',
    instructorTitle: 'Ausbildung Alumnus & Career Coach',
    durationHours: 12,
    lessonsCount: 16,
    price: 'Free',
    isFree: true,
    category: 'Career & Visa',
    badge: 'Visa Preparation',
    description: 'Answering tough questions at German embassy appointments and understanding German punctuality & contracts.',
  },
  {
    id: 'course-004',
    title: 'Technical German for IT & Mechatronics Apprenticeships',
    level: 'B1–B2',
    instructor: 'Markus Becker, Dipl.-Ing.',
    instructorTitle: 'Industrial Trainer, Siemens Partner',
    durationHours: 24,
    lessonsCount: 30,
    price: '€25 (or 300 Coins)',
    isFree: false,
    category: 'Engineering & Tech',
    badge: 'Technical Specialist',
    description: 'Circuit diagrams, safety briefings, bug reports, and customer service communication in technical German.',
  },
];

export interface MockFaq {
  questionEn: string;
  questionBn: string;
  questionDe: string;
  answerEn: string;
  answerBn: string;
  answerDe: string;
  category: string;
}

export const MOCK_FAQS: MockFaq[] = [
  {
    category: 'Ausbildung Basics',
    questionEn: 'Do I need a blocked account (Sperrkonto) for an Ausbildung in Germany?',
    questionBn: 'জার্মানিতে আউসবিল্ডুং করার জন্য কি ব্লকড অ্যাকাউন্ট (Sperrkonto) লাগে?',
    questionDe: 'Benötige ich ein Sperrkonto für eine Ausbildung in Deutschland?',
    answerEn:
      'In most cases, NO! Dual vocational training in Germany provides a monthly company stipend (typically €950–€1,400/month). As long as your training contract specifies a salary meeting the legal minimum living cost (currently ~€903 net/month), you are exempt from a blocked account.',
    answerBn:
      'বেশিরভাগ ক্ষেত্রে প্রয়োজন হয় না! কারণ জার্মানিতে আউসবিল্ডুং চলাকালীন কোম্পানি প্রতি মাসে নির্দিষ্ট বেতন (সাধারণত ৯৫০ থেকে ১৪০০ ইউরো) প্রদান করে। আপনার মাসিক বেতন যদি নির্ধারিত ন্যূনতম জীবনযাত্রার খরচ পূরণ করে, তবে ব্লকড একাউন্ট ছাড়াই ভিসা পাওয়া সম্ভব।',
    answerDe:
      'In den meisten Fällen NEIN! Da du eine monatliche Ausbildungsvergütung (in der Regel 950–1.400 €/Monat) erhältst, ist ein Sperrkonto in der Regel nicht erforderlich, sofern der gesetzliche Mindestbetrag gedeckt ist.',
  },
  {
    category: 'Language Requirements',
    questionEn: 'Which German language certificate is required for the visa?',
    questionBn: 'ভিসার জন্য কোন জার্মান ভাষার সার্টিফিকেট প্রয়োজন?',
    questionDe: 'Welches Sprachzertifikat wird für das Visum verlangt?',
    answerEn:
      'Most vocations and embassies require an officially accredited Goethe-Institut, Telc, ÖSD, or TestDaF certificate at B1 or B2 level. For healthcare (Pflege), B2 is strongly recommended and often legally required by regional authorities.',
    answerBn:
      'অধিকাংশ প্রফেশন ও দূতাবাসের জন্য গোয়েথে ইনস্টিটিউট (Goethe-Institut), Telc বা ÖSD থেকে অর্জিত অফিসিয়াল B1 বা B2 সার্টিফিকেট প্রয়োজন হয়। নার্সিং বা স্বাস্থ্যখাতের জন্য B2 অত্যন্ত গুরুত্বপূর্ণ।',
    answerDe:
      'Die meisten Berufe und Botschaften verlangen ein offizielles Goethe-, telc- oder ÖSD-Zertifikat auf B1- oder B2-Niveau. Für Pflegeberufe ist B2 oft gesetzlich vorgeschrieben.',
  },
  {
    category: 'Fees & Platform Cost',
    questionEn: 'Does Ausbildung Preparation Portal charge high agency placement fees?',
    questionBn: 'এই পোর্টাল কি অন্যান্য এজেন্সির মতো কোনো উচ্চ ফি গ্রহণ করে?',
    questionDe: 'Verlangt das Portal hohe Vermittlungsgebühren?',
    answerEn:
      'No! Our mission is to democratize education. Core learning materials, live job searches, and CV builders are completely free. You only pay transparent modest fees (or earn virtual coins for free) for advanced mock interviews and speaking tandem sessions.',
    answerBn:
      'একেবারেই না! আমাদের প্ল্যাটফর্মের মূল লক্ষ্য হলো অতিরিক্ত ফি ছাড়া প্রার্থীদের প্রস্তুত করা। ভাষা শিক্ষা, লাইভ চাকরির তথ্য ও সিভি বিল্ডার সম্পূর্ণ ফ্রি। শুধুমাত্র এডভান্সড মক ইন্টারভিউ বা অতিরিক্ত সুবিধার জন্য কয়েন বা নামমাত্র ফি প্রযোজ্য।',
    answerDe:
      'Nein! Die Kernplattform, die Stellenrecherche und der Lebenslauf-Generator sind komplett kostenfrei. Optionale Premium-Mock-Interviews können durch erlernte Coins oder faire Pauschalen freigeschaltet werden.',
  },
];
