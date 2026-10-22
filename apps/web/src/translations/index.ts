export type Locale = 'bn' | 'en' | 'de';

export interface TranslationSchema {
  nav: {
    home: string;
    germanLearning: string;
    jobSearch: string;
    courses: string;
    speaking: string;
    toolkit: string;
    pricing: string;
    about: string;
    faq: string;
    contact: string;
    login: string;
    register: string;
    dashboard: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statCandidates: string;
    statCandidatesLabel: string;
    statJobs: string;
    statJobsLabel: string;
    statSuccessRate: string;
    statSuccessRateLabel: string;
  };
  features: {
    title: string;
    subtitle: string;
    germanTitle: string;
    germanDesc: string;
    jobsTitle: string;
    jobsDesc: string;
    cvTitle: string;
    cvDesc: string;
    speakingTitle: string;
    speakingDesc: string;
    coinsTitle: string;
    coinsDesc: string;
    coursesTitle: string;
    coursesDesc: string;
  };
  pathway: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
  };
  ctaSection: {
    title: string;
    subtitle: string;
    buttonText: string;
    guarantee: string;
  };
  footer: {
    tagline: string;
    platformTitle: string;
    resourcesTitle: string;
    legalTitle: string;
    privacy: string;
    terms: string;
    guidelines: string;
    copyright: string;
  };
}

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    nav: {
      home: 'Home',
      germanLearning: 'German Learning',
      jobSearch: 'Ausbildung Jobs',
      courses: 'Courses',
      speaking: 'Speaking Practice',
      toolkit: 'Application Toolkit',
      pricing: 'Coins & Pricing',
      about: 'About Us',
      faq: 'FAQ',
      contact: 'Contact',
      login: 'Sign In',
      register: 'Get Started Free',
      dashboard: 'Dashboard',
    },
    hero: {
      badge: '🇩🇪 Official Gateway to Vocational Training in Germany',
      titleLine1: 'Your Complete Roadmap to',
      titleHighlight: 'Ausbildung in Germany',
      titleLine2: 'From Bangladesh & Worldwide',
      subtitle:
        'Master German from A1 to B2, browse live verified vocational openings from the Federal Employment Agency, practice speaking with peer partners, and generate German-standard DIN 5008 application documents.',
      ctaPrimary: 'Start Learning German',
      ctaSecondary: 'Browse Ausbildung Openings',
      statCandidates: '5,000+',
      statCandidatesLabel: 'Active Learners',
      statJobs: '25,000+',
      statJobsLabel: 'Live Ausbildung Openings',
      statSuccessRate: '92%',
      statSuccessRateLabel: 'Visa & Contract Success',
    },
    features: {
      title: 'Built Specifically for the Ausbildung Journey',
      subtitle: 'Everything an international applicant needs to succeed without high consultancy agency fees.',
      germanTitle: 'A1–B2 Structured German',
      germanDesc: 'Interactive vocabulary, grammar notes, pronunciation audio, and server-scored quizzes tailored for vocational exams.',
      jobsTitle: 'Live Jobsuche API Feed',
      jobsDesc: 'Direct listings from the German Federal Employment Agency with city filters, stipend expectations, and direct application links.',
      cvTitle: 'DIN 5008 CV & Anschreiben',
      cvDesc: 'Build professional German resumes and cover letters matching European enterprise standards with one-click PDF generation.',
      speakingTitle: 'Safe Peer Speaking Practice',
      speakingDesc: 'High-quality WebRTC audio/video sessions with peer learners. Granular consent, gender filtering, and strict moderation.',
      coinsTitle: 'Milestone Virtual Coins',
      coinsDesc: 'Earn coins by completing daily lessons and quizzes. Use coins for speaking sessions or unlock premium mock interviews.',
      coursesTitle: 'Specialist Vocational Courses',
      coursesDesc: 'Master specialized terminology for Nursing (Pflege), IT (Fachinformatiker), Mechatronics, and German workplace culture.',
    },
    pathway: {
      title: 'The Proven 5-Step Ausbildung Pathway',
      subtitle: 'Clear, milestone-based preparation from complete beginner to landing in Germany.',
      step1Title: 'Step 1: German Competency (A1–B2)',
      step1Desc: 'Reach CEFR B1 or B2 proficiency through structured modules, verified quizzes, and vocabulary trainers.',
      step2Title: 'Step 2: German Standard Documents',
      step2Desc: 'Format your Lebenslauf, Anschreiben, and certified educational transcripts matching DIN 5008 conventions.',
      step3Title: 'Step 3: Live Application & Tracking',
      step3Desc: 'Apply to verified German companies and manage interview invites through our Kanban pipeline tracker.',
      step4Title: 'Step 4: Live Interview & Speaking Prep',
      step4Desc: 'Practice spontaneous German dialogue with speaking partners and prepare for employer video interviews.',
      step5Title: 'Step 5: Contract & Visa Guidance',
      step5Desc: 'Secure your vocational contract (Ausbildungsvertrag), prepare visa paperwork, and launch your career in Germany.',
    },
    ctaSection: {
      title: 'Ready to Begin Your German Vocational Journey?',
      subtitle: 'Join thousands of motivated candidates learning German and tracking their Ausbildung applications.',
      buttonText: 'Create Your Free Account',
      guarantee: 'No credit card required. Free core learning and job search.',
    },
    footer: {
      tagline: 'Bridging international talent with German vocational opportunities through language, technology, and transparent guidance.',
      platformTitle: 'Platform',
      resourcesTitle: 'Resources',
      legalTitle: 'Legal & Privacy',
      privacy: 'Privacy Policy (GDPR)',
      terms: 'Terms of Service',
      guidelines: 'Community Guidelines',
      copyright: '© 2026 Ausbildung Preparation Portal. All rights reserved.',
    },
  },
  bn: {
    nav: {
      home: 'হোম',
      germanLearning: 'জার্মান শিক্ষা',
      jobSearch: 'আউসবিল্ডুং চাকরি',
      courses: 'কোর্সসমূহ',
      speaking: 'স্পিকিং প্র্যাকটিস',
      toolkit: 'আবেদন টুলকিট',
      pricing: 'কয়েন ও প্রাইসিং',
      about: 'আমাদের সম্পর্কে',
      faq: 'প্রশ্নোত্তর',
      contact: 'যোগাযোগ',
      login: 'লগইন',
      register: 'ফ্রি শুরু করুন',
      dashboard: 'ড্যাশবোর্ড',
    },
    hero: {
      badge: '🇩🇪 জার্মানিতে বৃত্তিমূলক প্রশিক্ষণের অফিসিয়াল গাইড',
      titleLine1: 'জার্মানিতে আপনার ক্যারিয়ার শুরুর',
      titleHighlight: 'আউসবিল্ডুং সম্পূর্ণ রোডম্যাপ',
      titleLine2: 'বাংলাদেশ থেকে সরাসরি',
      subtitle:
        'A1 থেকে B2 পর্যন্ত প্রমিত জার্মান শিখুন, জার্মান ফেডারেল এমপ্লয়মেন্ট এজেন্সির সরাসরি ভেরিফাইড চাকরি খুঁজুন, সহপাঠীদের সাথে স্পিকিং প্র্যাকটিস করুন এবং নিখুঁত জার্মান স্ট্যান্ডার্ড DIN 5008 সিভি তৈরি করুন।',
      ctaPrimary: 'জার্মান শেখা শুরু করুন',
      ctaSecondary: 'আউসবিল্ডুং ভ্যাকান্সি দেখুন',
      statCandidates: '৫,০০০+',
      statCandidatesLabel: 'সক্রিয় শিক্ষার্থী',
      statJobs: '২৫,০০০+',
      statJobsLabel: 'লাইভ আউসবিল্ডুং সার্কুলার',
      statSuccessRate: '৯২%',
      statSuccessRateLabel: 'ভিসা ও চুক্তি সফলতা',
    },
    features: {
      title: 'আউসবিল্ডুং প্রত্যাশীদের জন্য বিশেষভাবে তৈরি',
      subtitle: 'কোনো উচ্চ এজেন্সি ফি ছাড়াই জার্মানিতে পৌঁছানোর জন্য প্রয়োজনীয় সবকিছু এক প্ল্যাটফর্মে।',
      germanTitle: 'A1–B2 পূর্ণাঙ্গ জার্মান কোর্স',
      germanDesc: 'শব্দভাণ্ডার, ব্যাকরণ নোট, অডিও উচ্চারণ এবং সার্ভার-ভেরিফাইড কুইজের মাধ্যমে দক্ষতা অর্জন।',
      jobsTitle: 'অফিসিয়াল Jobsuche লাইভ ফিড',
      jobsDesc: 'জার্মান শ্রম মন্ত্রণালয়ের ডাটাবেস থেকে রিয়েল-টাইম সার্কুলার, বেতন ও আবেদনের সরাসরি লিংক।',
      cvTitle: 'জার্মান DIN 5008 সিভি বিল্ডার',
      cvDesc: 'জার্মান কোম্পানিগুলোর মানসম্মত আধুনিক লেবেনসলাউফ এবং কভার লেটার এক ক্লিকে পিডিএফ তৈরি করুন।',
      speakingTitle: 'নিরাপদ স্পিকিং পার্টনার প্র্যাকটিস',
      speakingDesc: 'অন্যান্য শিক্ষার্থীদের সাথে উচ্চমানের অডিও/ভিডিও কল। জেন্ডার ফিল্টারিং ও কড়া মডারেশন সুবিধা।',
      coinsTitle: 'মাইলস্টোন ভার্চুয়াল কয়েন',
      coinsDesc: 'প্রতিদিনের লেসন ও কুইজ শেষ করে কয়েন আর্ন করুন। স্পিকিং সেশন ও মক ইন্টারভিউতে ব্যবহার করুন।',
      coursesTitle: 'পেশাভিত্তিক বিশেষ কোর্স',
      coursesDesc: 'নার্সিং (Pflege), আইটি (Fachinformatiker) এবং জার্মান কর্মক্ষেত্রের শিষ্টাচারের বিশেষ প্রস্তুতি।',
    },
    pathway: {
      title: 'আউসবিল্ডুং সফলতার ৫টি ধারাবাহিক ধাপ',
      subtitle: 'শূন্য থেকে শুরু করে জার্মানিতে পৌঁছানো পর্যন্ত স্পষ্ট এবং নির্ভরযোগ্য রোডম্যাপ।',
      step1Title: 'ধাপ ১: জার্মান ভাষা দক্ষতা (A1–B2)',
      step1Desc: 'নিয়মিত পাঠ এবং কুইজের মাধ্যমে বি১/বি২ স্তরের ভাষা পরীক্ষায় উত্তীর্ণ হওয়ার প্রস্তুতি।',
      step2Title: 'ধাপ ২: জার্মান স্ট্যান্ডার্ড আবেদনপত্র',
      step2Desc: 'ইউরোপীয় মানসম্মত DIN 5008 ফরম্যাটে সিভি এবং অনুপ্রেরণামূলক কভার লেটার তৈরি।',
      step3Title: 'ধাপ ৩: চাকরি আবেদন ও ট্র্যাকিং',
      step3Desc: 'সরাসরি জার্মান প্রতিষ্ঠানে আবেদন করুন এবং আমাদের ট্র্যাকার দিয়ে স্ট্যাটাস পর্যবেক্ষণ করুন।',
      step4Title: 'ধাপ ৪: ইন্টারভিউ ও স্পিকিং প্রস্তুতি',
      step4Desc: 'সহপাঠী ও মেন্টরদের সাথে সরাসরি জার্মানিতে কথা বলার জড়তা কাটিয়ে ইন্টারভিউ জয় করুন।',
      step5Title: 'ধাপ ৫: কন্ট্রাক্ট ও ভিসা প্রসেসিং',
      step5Desc: 'চুক্তিনামা (Ausbildungsvertrag) সংগ্রহ, ভিসা ফাইল প্রস্তুতি ও জার্মানিতে আগমন।',
    },
    ctaSection: {
      title: 'আপনি কি জার্মানিতে নিজের ভবিষ্যৎ গড়তে প্রস্তুত?',
      subtitle: 'আজই যোগ দিন হাজারো প্রার্থীর সাথে এবং বিনামূল্যে আপনার প্রস্তুতি শুরু করুন।',
      buttonText: 'বিনামূল্যে অ্যাকাউন্ট খুলুন',
      guarantee: 'কোনো ক্রেডিট কার্ডের প্রয়োজন নেই। বেসিক ফিচারগুলো আজীবন বিনামূল্যে।',
    },
    footer: {
      tagline: 'ভাষা, প্রযুক্তি এবং স্বচ্ছ নির্দেশনার মাধ্যমে আন্তর্জাতিক প্রতিভাকে জার্মান বৃত্তিমূলক শিক্ষার সাথে সংযুক্ত করছি।',
      platformTitle: 'প্ল্যাটফর্ম',
      resourcesTitle: 'রিসোর্স',
      legalTitle: 'নীতিমালা ও শর্তাবলী',
      privacy: 'প্রাইভেসি পলিসি (GDPR)',
      terms: 'ব্যবহারের শর্তাবলী',
      guidelines: 'কমিউনিটি নির্দেশিকা',
      copyright: '© ২০২৬ আউসবিল্ডুং প্রিপারেশন পোর্টাল। সর্বস্বত্ব সংরক্ষিত।',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      germanLearning: 'Deutsch lernen',
      jobSearch: 'Ausbildungsplätze',
      courses: 'Fachkurse',
      speaking: 'Sprachpraxis',
      toolkit: 'Bewerbungs-Toolkit',
      pricing: 'Coins & Preise',
      about: 'Über uns',
      faq: 'FAQ',
      contact: 'Kontakt',
      login: 'Anmelden',
      register: 'Kostenlos starten',
      dashboard: 'Dashboard',
    },
    hero: {
      badge: '🇩🇪 Dein offizielles Tor zur dualen Ausbildung in Deutschland',
      titleLine1: 'Dein ganzheitlicher Weg zur',
      titleHighlight: 'Ausbildung in Deutschland',
      titleLine2: 'Für internationale Bewerber',
      subtitle:
        'Meistere die deutsche Sprache von A1 bis B2, finde tagesaktuelle Ausbildungsstellen der Bundesagentur für Arbeit, übe Sprechen mit Lernpartnern und erstelle DIN 5008-konforme Bewerbungsunterlagen.',
      ctaPrimary: 'Jetzt Deutsch lernen',
      ctaSecondary: 'Ausbildungsstellen finden',
      statCandidates: '5.000+',
      statCandidatesLabel: 'Aktive Lernende',
      statJobs: '25.000+',
      statJobsLabel: 'Offene Ausbildungsplätze',
      statSuccessRate: '92%',
      statSuccessRateLabel: 'Erfolgsquote Vertrag & Visum',
    },
    features: {
      title: 'Speziell für die duale Ausbildung entwickelt',
      subtitle: 'Alles, was internationale Bewerber für einen erfolgreichen Karrierestart in Deutschland benötigen.',
      germanTitle: 'A1–B2 Strukturierter Deutschkurs',
      germanDesc: 'Interaktiver Wortschatz, Grammatikübersichten, Aussprache-Audios und serverseitig geprüfte Quizzes.',
      jobsTitle: 'Offizielle Jobsuche-Schnittstelle',
      jobsDesc: 'Direkte Angebote der Bundesagentur für Arbeit mit Ortsfiltern, Vergütungshinweisen und Direktbewerbungslinks.',
      cvTitle: 'DIN 5008 Lebenslauf & Anschreiben',
      cvDesc: 'Erstelle professionelle deutsche Lebensläufe und Anschreiben mit modernem Design und direktem PDF-Export.',
      speakingTitle: 'Sichere Tandem-Sprachpraxis',
      speakingDesc: 'Hochwertige WebRTC Audio-/Videoanrufe mit Lernpartnern inklusive Geschlechterpräferenzen und strikter Moderation.',
      coinsTitle: 'Virtuelle Leistungs-Coins',
      coinsDesc: 'Sammle Coins durch das Absolvieren täglicher Lektionen und Quizzes für Sprachtandems und Vorstellungsgesprächs-Simulationen.',
      coursesTitle: 'Berufsbezogene Fachkurse',
      coursesDesc: 'Fachdeutsch für Pflegeberufe, Fachinformatiker, Mechatroniker sowie deutsche Unternehmenskultur.',
    },
    pathway: {
      title: 'Der bewährte 5-Schritte-Ausbildungsweg',
      subtitle: 'Strukturierte Vorbereitung vom ersten Wortschatz bis zur Ankunft in Deutschland.',
      step1Title: 'Schritt 1: Sprachkompetenz (A1–B2)',
      step1Desc: 'Erreiche das B1/B2-Niveau durch interaktive Lektionen, Übungen und Zertifikatsvorbereitung.',
      step2Title: 'Schritt 2: DIN 5008 Bewerbungsunterlagen',
      step2Desc: 'Erstelle deinen deutschen Lebenslauf und personalisierte Anschreiben nach aktuellen HR-Standards.',
      step3Title: 'Schritt 3: Bewerbungen & Pipeline-Tracking',
      step3Desc: 'Bewirb dich direkt bei Ausbildungsbetrieben und behalte den Überblick in deinem Kanban-Tracker.',
      step4Title: 'Schritt 4: Vorstellungsgespräch & Sprachtraining',
      step4Desc: 'Trainiere die mündliche Kommunikation in Video-Sessions für ein selbstsicheres Bewerbungsgespräch.',
      step5Title: 'Schritt 5: Ausbildungsvertrag & Visum',
      step5Desc: 'Unterschreibe deinen Ausbildungsvertrag, stelle den Visumsantrag und starte deine Ausbildung in Deutschland.',
    },
    ctaSection: {
      title: 'Bereit für deine berufliche Zukunft in Deutschland?',
      subtitle: 'Schließe dich tausenden motivierten Bewerbern an und starte noch heute kostenlos deine Vorbereitung.',
      buttonText: 'Kostenloses Konto erstellen',
      guarantee: 'Keine Kreditkarte erforderlich. Grundlegende Lern- und Suchfunktionen dauerhaft kostenfrei.',
    },
    footer: {
      tagline: 'Wir verbinden internationale Fachkräfte von morgen mit deutschen Ausbildungsbetrieben durch Sprache, Technologie und Transparenz.',
      platformTitle: 'Plattform',
      resourcesTitle: 'Ressourcen',
      legalTitle: 'Rechtliches',
      privacy: 'Datenschutzerklärung (DSGVO)',
      terms: 'Nutzungsbedingungen',
      guidelines: 'Community-Richtlinien',
      copyright: '© 2026 Ausbildung Preparation Portal. Alle Rechte vorbehalten.',
    },
  },
};
