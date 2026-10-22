import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Ausbildung Preparation Portal...');

  // 1. Seed Roles
  const roles = [
    { name: 'STUDENT', description: 'Standard vocational learner and applicant' },
    { name: 'INSTRUCTOR', description: 'Verified course instructor or educator' },
    { name: 'MODERATOR', description: 'Speaking community moderator & report reviewer' },
    { name: 'ADMIN', description: 'System administrator with least-privilege security clearance' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name as any },
      update: { description: r.description },
      create: { name: r.name as any, description: r.description },
    });
  }
  console.log('✅ Core roles verified (STUDENT, INSTRUCTOR, MODERATOR, ADMIN).');

  // 2. Seed Development Admin (DEV ONLY)
  const adminEmail = 'admin.dev@ausbildungportal.de';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminDevPassword2026!', 12);
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' as any } });

    if (adminRole) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          status: 'ACTIVE',
          emailVerified: true,
          profile: {
            create: {
              firstName: 'System',
              lastName: 'Administrator',
              preferredLanguage: 'de',
              targetAusbildungField: 'Administration',
            },
          },
          roles: {
            create: {
              roleId: adminRole.id,
            },
          },
          notificationPreference: {
            create: {},
          },
        },
      });
      console.log('✅ Local development administrator seeded (admin.dev@ausbildungportal.de).');
    }
  }

  // 3. Seed CEFR Levels (A1, A2, B1, B2)
  const levelsData = [
    {
      code: 'A1',
      title: 'A1 - Beginner (Einstieg)',
      description: 'Foundations of German: Alphabet, greetings, personal introduction, shopping, and everyday basics.',
      sequenceOrder: 1,
    },
    {
      code: 'A2',
      title: 'A2 - Elementary (Grundlagen)',
      description: 'Daily life in Germany: Doctor visits, living arrangements, directions, and routine workplace dialogue.',
      sequenceOrder: 2,
    },
    {
      code: 'B1',
      title: 'B1 - Intermediate (Selbstständig - Visa Threshold)',
      description: 'Independence in Germany: Job interviews, vocational applications, writing formal emails, expressing opinions.',
      sequenceOrder: 3,
    },
    {
      code: 'B2',
      title: 'B2 - Upper Intermediate (Fachsprache & Beruf)',
      description: 'Professional vocational proficiency: Technical discussions, medical reporting protocols, workplace safety regulations.',
      sequenceOrder: 4,
    },
  ];

  for (const lvl of levelsData) {
    await prisma.learningLevel.upsert({
      where: { code: lvl.code as any },
      update: { title: lvl.title, description: lvl.description, sequenceOrder: lvl.sequenceOrder },
      create: { code: lvl.code as any, title: lvl.title, description: lvl.description, sequenceOrder: lvl.sequenceOrder },
    });
  }
  console.log('✅ CEFR Levels seeded (A1, A2, B1, B2).');

  // 4. Seed Level A1 Modules & Lessons
  const a1Level = await prisma.learningLevel.findUnique({ where: { code: 'A1' as any } });
  if (a1Level) {
    // Module 1: Begrüßung & Erste Schritte
    const module1 = await prisma.learningModule.upsert({
      where: { id: 'mod-a1-001' },
      update: { title: 'Begrüßung & Erste Schritte', levelId: a1Level.id, sequenceOrder: 1 },
      create: {
        id: 'mod-a1-001',
        levelId: a1Level.id,
        title: 'Begrüßung & Erste Schritte',
        description: 'German greetings, formal vs. informal address, and introducing yourself in interviews.',
        sequenceOrder: 1,
      },
    });

    // Lesson 1: Sich vorstellen und Hallo sagen
    const lesson1 = await prisma.lesson.upsert({
      where: { slug: 'a1-m1-sich-vorstellen' },
      update: {
        titleDe: 'Sich vorstellen und Hallo sagen',
        grammarNotesDe: 'Personalpronomen (ich, du, Sie) und die Verben "sein" und "heißen".',
        estimatedMinutes: 15,
        sequenceOrder: 1,
        coinReward: 15,
      },
      create: {
        id: 'les-a1-001',
        moduleId: module1.id,
        slug: 'a1-m1-sich-vorstellen',
        titleDe: 'Sich vorstellen und Hallo sagen',
        grammarNotesDe: 'Personalpronomen (ich, du, Sie) und die Verben "sein" und "heißen".',
        estimatedMinutes: 15,
        sequenceOrder: 1,
        coinReward: 15,
      },
    });

    // Trilingual Lesson Translations
    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lesson1.id, languageCode: 'en' } },
      update: {
        title: 'Introducing Yourself & Saying Hello',
        summary: 'Learn how to greet someone politely, introduce your name and origin, and ask others politely.',
        grammarNotes: 'In German, verbs conjugate depending on the subject pronoun: "Ich heiße..." (I am called), "Du heißt..." (You are called - informal), "Sie heißen..." (You are called - formal). When applying for an Ausbildung, always use the formal "Sie" with employers.',
      },
      create: {
        lessonId: lesson1.id,
        languageCode: 'en',
        title: 'Introducing Yourself & Saying Hello',
        summary: 'Learn how to greet someone politely, introduce your name and origin, and ask others politely.',
        grammarNotes: 'In German, verbs conjugate depending on the subject pronoun: "Ich heiße..." (I am called), "Du heißt..." (You are called - informal), "Sie heißen..." (You are called - formal). When applying for an Ausbildung, always use the formal "Sie" with employers.',
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lesson1.id, languageCode: 'bn' } },
      update: {
        title: 'নিজের পরিচয় দেওয়া এবং শুভেচ্ছা বিনিময়',
        summary: 'কীভাবে জার্মান ভাষায় শালীনভাবে অভিবাদন জানাতে হয়, নিজের নাম ও দেশের পরিচয় দিতে হয় এবং অপরকে প্রশ্ন করতে হয়।',
        grammarNotes: 'জার্মান ভাষায় সর্বনাম (Pronoun) অনুযায়ী ক্রিয়াপদ পরিবর্তিত হয়: "Ich heiße..." (আমার নাম...), "Du heißt..." (তোমার নাম... - অনানুষ্ঠানিক), "Sie heißen..." (আপনার নাম... - আনুষ্ঠানিক)। আউসবিল্ডুং ইন্টারভিউতে সবসময় ফর্মাল "Sie" ব্যবহার করতে হবে।',
      },
      create: {
        lessonId: lesson1.id,
        languageCode: 'bn',
        title: 'নিজের পরিচয় দেওয়া এবং শুভেচ্ছা বিনিময়',
        summary: 'কীভাবে জার্মান ভাষায় শালীনভাবে অভিবাদন জানাতে হয়, নিজের নাম ও দেশের পরিচয় দিতে হয় এবং অপরকে প্রশ্ন করতে হয়।',
        grammarNotes: 'জার্মান ভাষায় সর্বনাম (Pronoun) অনুযায়ী ক্রিয়াপদ পরিবর্তিত হয়: "Ich heiße..." (আমার নাম...), "Du heißt..." (তোমার নাম... - অনানুষ্ঠানিক), "Sie heißen..." (আপনার নাম... - আনুষ্ঠানিক)। আউসবিল্ডুং ইন্টারভিউতে সবসময় ফর্মাল "Sie" ব্যবহার করতে হবে।',
      },
    });

    // Vocabulary Items
    const vocabData = [
      {
        word: 'Guten Tag',
        article: null,
        pluralForm: null,
        ipaPronunciation: '[ˈɡuːtn̩ ˈtaːk]',
        partOfSpeech: 'phrase',
        translations: { en: 'Good day / Hello', bn: 'শুভ দিন / হ্যালো' },
        exampleSentenceDe: 'Guten Tag, mein Name ist Tanvir.',
        exampleSentenceTranslation: { en: 'Good day, my name is Tanvir.', bn: 'শুভ দিন, আমার নাম তানভীর।' },
      },
      {
        word: 'Name',
        article: 'der',
        pluralForm: 'die Namen',
        ipaPronunciation: '[ˈnaːmə]',
        partOfSpeech: 'noun',
        translations: { en: 'Name', bn: 'নাম' },
        exampleSentenceDe: 'Wie ist Ihr Name?',
        exampleSentenceTranslation: { en: 'What is your name? (formal)', bn: 'আপনার নাম কী? (ফর্মাল)' },
      },
      {
        word: 'Ausbildung',
        article: 'die',
        pluralForm: 'die Ausbildungen',
        ipaPronunciation: '[ˈaʊ̯sˌbɪldʊŋ]',
        partOfSpeech: 'noun',
        translations: { en: 'Vocational training / Apprenticeship', bn: 'বৃত্তিমূলক প্রশিক্ষণ' },
        exampleSentenceDe: 'Ich mache eine Ausbildung in Deutschland.',
        exampleSentenceTranslation: { en: 'I am doing vocational training in Germany.', bn: 'আমি জার্মানিতে একটি আউসবিল্ডুং করছি।' },
      },
      {
        word: 'heißen',
        article: null,
        pluralForm: null,
        ipaPronunciation: '[ˈhaɪ̯sn̩]',
        partOfSpeech: 'verb',
        translations: { en: 'to be called', bn: 'নাম হওয়া' },
        exampleSentenceDe: 'Ich heiße Shakib und komme aus Bangladesch.',
        exampleSentenceTranslation: { en: 'My name is Shakib and I come from Bangladesh.', bn: 'আমার নাম সাকিব এবং আমি বাংলাদেশ থেকে এসেছি।' },
      },
    ];

    for (const v of vocabData) {
      const existingVocab = await prisma.vocabularyItem.findFirst({
        where: { word: v.word, lessonId: lesson1.id },
      });
      if (!existingVocab) {
        await prisma.vocabularyItem.create({
          data: {
            lessonId: lesson1.id,
            word: v.word,
            article: v.article,
            pluralForm: v.pluralForm,
            ipaPronunciation: v.ipaPronunciation,
            partOfSpeech: v.partOfSpeech,
            translations: v.translations,
            exampleSentenceDe: v.exampleSentenceDe,
            exampleSentenceTranslation: v.exampleSentenceTranslation,
          },
        });
      }
    }

    // Exercises
    const existingExercise = await prisma.exercise.findFirst({ where: { lessonId: lesson1.id } });
    if (!existingExercise) {
      await prisma.exercise.create({
        data: {
          lessonId: lesson1.id,
          type: 'FILL_IN_BLANK',
          promptDe: 'Ergänzen Sie das richtige Verb: "Guten Tag! Ich _____ (heißen) Rahim."',
          instructions: {
            en: 'Fill in the correct conjugated verb for the subject "Ich".',
            bn: '"Ich" সর্বনামের সাথে সঠিক কনজুগেশন বসান।',
          },
          content: {
            sentenceTemplate: 'Guten Tag! Ich {gap} Rahim.',
            verbHint: 'heißen',
          },
          correctAnswer: 'heiße',
          sequenceOrder: 1,
        },
      });
    }

    // Quiz Questions & Options
    const existingQuestion = await prisma.quizQuestion.findFirst({ where: { lessonId: lesson1.id } });
    if (!existingQuestion) {
      const q1 = await prisma.quizQuestion.create({
        data: {
          lessonId: lesson1.id,
          questionDe: 'Wie begrüßen Sie Ihren Arbeitgeber im Ausbildungsgespräch formell?',
          questionTranslation: {
            en: 'How do you greet your employer formally in a vocational training interview?',
            bn: 'আউসবিল্ডুং ইন্টারভিউতে আপনি নিয়োগকর্তাকে আনুষ্ঠানিকভাবে কীভাবে শুভেচ্ছা জানাবেন?',
          },
          explanationDe: '"Guten Tag" oder "Guten Morgen" ist die korrekte formelle Begrüßung. "Hallo" oder "Hi" ist zu informell für das erste Vorstellungsgespräch.',
          explanationTranslation: {
            en: '"Guten Tag" or "Guten Morgen" is the correct formal greeting. "Hallo" or "Hi" is too casual for a job interview.',
            bn: '"Guten Tag" বা "Guten Morgen" হলো সঠিক আনুষ্ঠানিক অভিবাদন। ইন্টারভিউতে "Hallo" বা "Hi" ব্যবহার করা অনাকাঙ্ক্ষিত।',
          },
          sequenceOrder: 1,
          options: {
            create: [
              {
                optionTextDe: 'Guten Tag, Herr Müller!',
                optionTranslation: { en: 'Good day, Mr. Müller!', bn: 'শুভ দিন, জনাব মুলার!' },
                isCorrect: true,
                sequenceOrder: 1,
              },
              {
                optionTextDe: 'Hi, was geht ab?',
                optionTranslation: { en: "Hi, what's up?", bn: 'হাই, কী খবর?' },
                isCorrect: false,
                sequenceOrder: 2,
              },
              {
                optionTextDe: 'Tschüss, alles klar?',
                optionTranslation: { en: 'Bye, all good?', bn: 'বিদায়, সব ঠিক আছে?' },
                isCorrect: false,
                sequenceOrder: 3,
              },
            ],
          },
        },
      });

      const q2 = await prisma.quizQuestion.create({
        data: {
          lessonId: lesson1.id,
          questionDe: 'Welcher bestimmte Artikel gehört zu "Ausbildung"?',
          questionTranslation: {
            en: 'Which definite article belongs to "Ausbildung"?',
            bn: '"Ausbildung" শব্দের নির্দিষ্ট আর্টিকেল (Article) কোনটি?',
          },
          explanationDe: 'Substantive mit der Endung "-ung" sind im Deutschen immer feminin (die).',
          explanationTranslation: {
            en: 'German nouns ending with "-ung" are always feminine (die).',
            bn: 'জার্মান ভাষায় যেসব বিশেষ্যের শেষে "-ung" থাকে, সেগুলো সর্বদা স্ত্রীবাচক (die)।',
          },
          sequenceOrder: 2,
          options: {
            create: [
              { optionTextDe: 'der Ausbildung', isCorrect: false, sequenceOrder: 1 },
              { optionTextDe: 'die Ausbildung', isCorrect: true, sequenceOrder: 2 },
              { optionTextDe: 'das Ausbildung', isCorrect: false, sequenceOrder: 3 },
            ],
          },
        },
      });
    }

    // A1 Lesson 2: Die ersten Fragen im Gespräch
    const lesson2 = await prisma.lesson.upsert({
      where: { slug: 'a1-m1-vorstellungsgespraech-fragen' },
      update: {
        titleDe: 'W-Fragen: Woher kommen Sie? Was machen Sie?',
        grammarNotesDe: 'Fragewörter (W-Fragen: Wer, Wie, Woher, Was) und Satzbau bei Fragen.',
        estimatedMinutes: 20,
        sequenceOrder: 2,
        coinReward: 15,
      },
      create: {
        id: 'les-a1-002',
        moduleId: module1.id,
        slug: 'a1-m1-vorstellungsgespraech-fragen',
        titleDe: 'W-Fragen: Woher kommen Sie? Was machen Sie?',
        grammarNotesDe: 'Fragewörter (W-Fragen: Wer, Wie, Woher, Was) und Satzbau bei Fragen.',
        estimatedMinutes: 20,
        sequenceOrder: 2,
        coinReward: 15,
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lesson2.id, languageCode: 'en' } },
      update: {
        title: 'W-Questions: Where do you come from? What do you do?',
        summary: 'Learn key German question words and how to respond clearly in your first vocational conversation.',
        grammarNotes: 'In German W-questions, the question word comes first, and the conjugated verb MUST occupy position 2: "Woher (1) kommen (2) Sie?".',
      },
      create: {
        lessonId: lesson2.id,
        languageCode: 'en',
        title: 'W-Questions: Where do you come from? What do you do?',
        summary: 'Learn key German question words and how to respond clearly in your first vocational conversation.',
        grammarNotes: 'In German W-questions, the question word comes first, and the conjugated verb MUST occupy position 2: "Woher (1) kommen (2) Sie?".',
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lesson2.id, languageCode: 'bn' } },
      update: {
        title: 'W-প্রশ্ন: আপনি কোথা থেকে এসেছেন? আপনি কী করেন?',
        summary: 'জরুরি প্রশ্নবোধক শব্দ শিখুন এবং আউসবিল্ডুং কথোপকথনে সহজে উত্তর দিন।',
        grammarNotes: 'জার্মান ডব্লিউ-প্রশ্নে (W-Fragen) প্রশ্নবোধক শব্দটি প্রথমে বসে এবং কনজুগেটেড ভার্ব সর্বদা ২ নম্বর স্থানে বসে: "Woher (১) kommen (২) Sie?".',
      },
      create: {
        lessonId: lesson2.id,
        languageCode: 'bn',
        title: 'W-প্রশ্ন: আপনি কোথা থেকে এসেছেন? আপনি কী করেন?',
        summary: 'জরুরি প্রশ্নবোধক শব্দ শিখুন এবং আউসবিল্ডুং কথোপকথনে সহজে উত্তর দিন।',
        grammarNotes: 'জার্মান ডব্লিউ-প্রশ্নে (W-Fragen) প্রশ্নবোধক শব্দটি প্রথমে বসে এবং কনজুগেটেড ভার্ব সর্বদা ২ নম্বর স্থানে বসে: "Woher (১) kommen (২) Sie?".',
      },
    });

    const vocab2 = [
      {
        word: 'woher',
        article: null,
        pluralForm: null,
        ipaPronunciation: '[voːˈheːɐ̯]',
        partOfSpeech: 'adverb',
        translations: { en: 'from where / whence', bn: 'কোথা থেকে' },
        exampleSentenceDe: 'Woher kommen Sie? — Ich komme aus Dhaka.',
        exampleSentenceTranslation: { en: 'Where do you come from? — I come from Dhaka.', bn: 'আপনি কোথা থেকে এসেছেন? — আমি ঢাকা থেকে এসেছি।' },
      },
      {
        word: 'Beruf',
        article: 'der',
        pluralForm: 'die Berufe',
        ipaPronunciation: '[bəˈʁuːf]',
        partOfSpeech: 'noun',
        translations: { en: 'profession / occupation', bn: 'পেশা / বৃত্তি' },
        exampleSentenceDe: 'Was ist Ihr Traumberuf in Deutschland?',
        exampleSentenceTranslation: { en: 'What is your dream profession in Germany?', bn: 'জার্মানিতে আপনার স্বপ্নের পেশা কোনটি?' },
      },
    ];

    for (const v of vocab2) {
      const existing = await prisma.vocabularyItem.findFirst({ where: { word: v.word, lessonId: lesson2.id } });
      if (!existing) {
        await prisma.vocabularyItem.create({
          data: {
            lessonId: lesson2.id,
            word: v.word,
            article: v.article,
            pluralForm: v.pluralForm,
            ipaPronunciation: v.ipaPronunciation,
            partOfSpeech: v.partOfSpeech,
            translations: v.translations,
            exampleSentenceDe: v.exampleSentenceDe,
            exampleSentenceTranslation: v.exampleSentenceTranslation,
          },
        });
      }
    }

    const q2Exists = await prisma.quizQuestion.findFirst({ where: { lessonId: lesson2.id } });
    if (!q2Exists) {
      await prisma.quizQuestion.create({
        data: {
          lessonId: lesson2.id,
          questionDe: 'Welcher Satz hat die richtige deutsche Wortstellung für eine W-Frage?',
          questionTranslation: {
            en: 'Which sentence has the correct German word order for a W-question?',
            bn: 'কোন বাক্যে ডব্লিউ-প্রশ্নের সঠিক জার্মান শব্দবিন্যাস রয়েছে?',
          },
          explanationDe: 'In W-Fragen steht das konjugierte Verb an Position 2.',
          explanationTranslation: {
            en: 'In W-questions, the conjugated verb must be in position 2.',
            bn: 'ডব্লিউ-প্রশ্নে কনজুগেটেড ভার্ব সর্বদা ২ নম্বর পজিশনে থাকে।',
          },
          sequenceOrder: 1,
          options: {
            create: [
              { optionTextDe: 'Woher Sie kommen?', isCorrect: false, sequenceOrder: 1 },
              { optionTextDe: 'Woher kommen Sie?', isCorrect: true, sequenceOrder: 2 },
              { optionTextDe: 'Kommen Woher Sie?', isCorrect: false, sequenceOrder: 3 },
            ],
          },
        },
      });
    }
  }

  // 5. Seed Level A2 Module & Lesson
  const a2Level = await prisma.learningLevel.findUnique({ where: { code: 'A2' as any } });
  if (a2Level) {
    const moduleA2 = await prisma.learningModule.upsert({
      where: { id: 'mod-a2-001' },
      update: { title: 'Gesundheit, Arztbesuch & Notfälle', levelId: a2Level.id, sequenceOrder: 1 },
      create: {
        id: 'mod-a2-001',
        levelId: a2Level.id,
        title: 'Gesundheit, Arztbesuch & Notfälle',
        description: 'Appointments, describing symptoms to doctors, health insurance in Germany.',
        sequenceOrder: 1,
      },
    });

    const lessonA2 = await prisma.lesson.upsert({
      where: { slug: 'a2-m1-beim-arzt' },
      update: {
        titleDe: 'Beim Arzt: Symptome beschreiben und Termine vereinbaren',
        grammarNotesDe: 'Modalverben "müssen", "können", "dürfen" und Imperativ.',
        estimatedMinutes: 20,
        sequenceOrder: 1,
        coinReward: 20,
      },
      create: {
        id: 'les-a2-001',
        moduleId: moduleA2.id,
        slug: 'a2-m1-beim-arzt',
        titleDe: 'Beim Arzt: Symptome beschreiben und Termine vereinbaren',
        grammarNotesDe: 'Modalverben "müssen", "können", "dürfen" und Imperativ.',
        estimatedMinutes: 20,
        sequenceOrder: 1,
        coinReward: 20,
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lessonA2.id, languageCode: 'en' } },
      update: {
        title: 'At the Doctor: Describing Symptoms & Booking Appointments',
        summary: 'Essential vocabulary and polite dialogue structures for visits to the GP (Hausarzt) or specialist.',
        grammarNotes: 'Modal verbs send the main infinitive verb to the very end of the sentence: "Ich muss heute zum Arzt gehen".',
      },
      create: {
        lessonId: lessonA2.id,
        languageCode: 'en',
        title: 'At the Doctor: Describing Symptoms & Booking Appointments',
        summary: 'Essential vocabulary and polite dialogue structures for visits to the GP (Hausarzt) or specialist.',
        grammarNotes: 'Modal verbs send the main infinitive verb to the very end of the sentence: "Ich muss heute zum Arzt gehen".',
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lessonA2.id, languageCode: 'bn' } },
      update: {
        title: 'ডাক্তারের চেম্বারে: অসুস্থতা বর্ণনা এবং অ্যাপয়েন্টমেন্ট নেওয়া',
        summary: 'জার্মানিতে জেনারেল ফিজিশিয়ান (Hausarzt)-এর কাছে যাওয়ার প্রয়োজনীয় শব্দ ও বাক্য।',
        grammarNotes: 'মোডাল ভার্ব (Modalverb) ব্যবহার করলে মূল ইনফিনিটিভ ভার্বটি বাক্যের একেবারে শেষে চলে যায়: "Ich muss heute zum Arzt gehen".',
      },
      create: {
        lessonId: lessonA2.id,
        languageCode: 'bn',
        title: 'ডাক্তারের চেম্বারে: অসুস্থতা বর্ণনা এবং অ্যাপয়েন্টমেন্ট নেওয়া',
        summary: 'জার্মানিতে জেনারেল ফিজিশিয়ান (Hausarzt)-এর কাছে যাওয়ার প্রয়োজনীয় শব্দ ও বাক্য।',
        grammarNotes: 'মোডাল ভার্ব (Modalverb) ব্যবহার করলে মূল ইনফিনিটিভ ভার্বটি বাক্যের একেবারে শেষে চলে যায়: "Ich muss heute zum Arzt gehen".',
      },
    });

    const vocabA2 = [
      {
        word: 'Krankenversicherung',
        article: 'die',
        pluralForm: 'die Krankenversicherungen',
        ipaPronunciation: '[ˈkʁaŋkn̩fɛɐ̯ˌzɪçəʁʊŋ]',
        partOfSpeech: 'noun',
        translations: { en: 'health insurance', bn: 'স্বাস্থ্যবীমা' },
        exampleSentenceDe: 'Jeder Auszubildende in Deutschland braucht eine gesetzliche Krankenversicherung.',
        exampleSentenceTranslation: { en: 'Every apprentice in Germany needs statutory health insurance.', bn: 'জার্মানিতে প্রত্যেক আউসবিল্ডুং শিক্ষার্থীর সরকারি স্বাস্থ্যবীমা প্রয়োজন।' },
      },
      {
        word: 'Termin',
        article: 'der',
        pluralForm: 'die Termine',
        ipaPronunciation: '[tɛʁˈmiːn]',
        partOfSpeech: 'noun',
        translations: { en: 'appointment', bn: 'অ্যাপয়েন্টমেন্ট / সাক্ষাতের সময়' },
        exampleSentenceDe: 'Ich möchte bitte einen Termin für morgen vereinbaren.',
        exampleSentenceTranslation: { en: 'I would like to book an appointment for tomorrow, please.', bn: 'আমি আগামীকালের জন্য একটি অ্যাপয়েন্টমেন্ট নিতে চাই।' },
      },
    ];

    for (const v of vocabA2) {
      const existing = await prisma.vocabularyItem.findFirst({ where: { word: v.word, lessonId: lessonA2.id } });
      if (!existing) {
        await prisma.vocabularyItem.create({
          data: {
            lessonId: lessonA2.id,
            word: v.word,
            article: v.article,
            pluralForm: v.pluralForm,
            ipaPronunciation: v.ipaPronunciation,
            partOfSpeech: v.partOfSpeech,
            translations: v.translations,
            exampleSentenceDe: v.exampleSentenceDe,
            exampleSentenceTranslation: v.exampleSentenceTranslation,
          },
        });
      }
    }

    const qA2Exists = await prisma.quizQuestion.findFirst({ where: { lessonId: lessonA2.id } });
    if (!qA2Exists) {
      await prisma.quizQuestion.create({
        data: {
          lessonId: lessonA2.id,
          questionDe: 'Wohin gehört das Hauptverb bei einem Modalverb (z.B. "können")?',
          questionTranslation: {
            en: 'Where does the main verb go when using a modal verb (e.g. "können")?',
            bn: 'মোডাল ভার্বের ক্ষেত্রে মূল ভার্বটি বাক্যের কোথায় বসে?',
          },
          explanationDe: 'Das Vollverb im Infinitiv steht immer am Satzende: "Ich kann morgen um 10 Uhr kommen."',
          explanationTranslation: {
            en: 'The infinitive verb always stands at the end of the clause: "Ich kann morgen um 10 Uhr kommen."',
            bn: 'ইনফিনিটিভ ভার্ব সর্বদা বাক্যের একেবারে শেষে বসে।',
          },
          sequenceOrder: 1,
          options: {
            create: [
              { optionTextDe: 'Direkt nach dem Modalverb', isCorrect: false, sequenceOrder: 1 },
              { optionTextDe: 'Am Ende des Satzes im Infinitiv', isCorrect: true, sequenceOrder: 2 },
              { optionTextDe: 'Ganz am Satzanfang', isCorrect: false, sequenceOrder: 3 },
            ],
          },
        },
      });
    }
  }

  // 6. Seed Level B1 Module & Lesson
  const b1Level = await prisma.learningLevel.findUnique({ where: { code: 'B1' as any } });
  if (b1Level) {
    const moduleB1 = await prisma.learningModule.upsert({
      where: { id: 'mod-b1-001' },
      update: { title: 'Bewerbung & Anschreiben für Ausbildung', levelId: b1Level.id, sequenceOrder: 1 },
      create: {
        id: 'mod-b1-001',
        levelId: b1Level.id,
        title: 'Bewerbung & Anschreiben für Ausbildung',
        description: 'Writing formal cover letters adhering to German DIN 5008 norms.',
        sequenceOrder: 1,
      },
    });

    const lessonB1 = await prisma.lesson.upsert({
      where: { slug: 'b1-m1-deutsches-anschreiben' },
      update: {
        titleDe: 'Das deutsche Anschreiben (DIN 5008)',
        grammarNotesDe: 'Nebensätze mit "weil", "da", "obwohl" und Konjunktiv II für Höflichkeit ("Ich würde mich freuen").',
        estimatedMinutes: 25,
        sequenceOrder: 1,
        coinReward: 25,
      },
      create: {
        id: 'les-b1-001',
        moduleId: moduleB1.id,
        slug: 'b1-m1-deutsches-anschreiben',
        titleDe: 'Das deutsche Anschreiben (DIN 5008)',
        grammarNotesDe: 'Nebensätze mit "weil", "da", "obwohl" und Konjunktiv II für Höflichkeit ("Ich würde mich freuen").',
        estimatedMinutes: 25,
        sequenceOrder: 1,
        coinReward: 25,
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lessonB1.id, languageCode: 'en' } },
      update: {
        title: 'The German Cover Letter (DIN 5008 Standard)',
        summary: 'Structure, professional phrasing, and subordinate clauses to impress German HR departments.',
        grammarNotes: 'In subordinate clauses introduced by "weil" or "da", the conjugated verb moves to the absolute end.',
      },
      create: {
        lessonId: lessonB1.id,
        languageCode: 'en',
        title: 'The German Cover Letter (DIN 5008 Standard)',
        summary: 'Structure, professional phrasing, and subordinate clauses to impress German HR departments.',
        grammarNotes: 'In subordinate clauses introduced by "weil" or "da", the conjugated verb moves to the absolute end.',
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lessonB1.id, languageCode: 'bn' } },
      update: {
        title: 'জার্মান কাভার লেটার (DIN 5008 স্ট্যান্ডার্ড)',
        summary: 'আউসবিল্ডুং আবেদনের ফর্মাল কাভার লেটার লেখার সঠিক কাঠামো ও পেশাদার ভাষার ব্যবহার।',
        grammarNotes: '"weil" বা "da" দ্বারা শুরু হওয়া সাবর্ডিনেট ক্লজে কনজুগেটেড ভার্বটি বাক্যের শেষে চলে যায়।',
      },
      create: {
        lessonId: lessonB1.id,
        languageCode: 'bn',
        title: 'জার্মান কাভার লেটার (DIN 5008 স্ট্যান্ডার্ড)',
        summary: 'আউসবিল্ডুং আবেদনের ফর্মাল কাভার লেটার লেখার সঠিক কাঠামো ও পেশাদার ভাষার ব্যবহার।',
        grammarNotes: '"weil" বা "da" দ্বারা শুরু হওয়া সাবর্ডিনেট ক্লজে কনজুগেটেড ভার্বটি বাক্যের শেষে চলে যায়।',
      },
    });

    const vocabB1 = [
      {
        word: 'Bewerbungsunterlagen',
        article: 'die',
        pluralForm: 'die Bewerbungsunterlagen',
        ipaPronunciation: '[bəˈvɛʁbʊŋsˌʔʊntɐlaːɡn̩]',
        partOfSpeech: 'noun',
        translations: { en: 'application documents / dossier', bn: 'আবেদনের নথিপত্র' },
        exampleSentenceDe: 'Bitte senden Sie Ihre vollständigen Bewerbungsunterlagen per E-Mail.',
        exampleSentenceTranslation: { en: 'Please send your complete application documents via email.', bn: 'দয়া করে আপনার সম্পূর্ণ আবেদনপত্র ইমেইলের মাধ্যমে প্রেরণ করুন।' },
      },
      {
        word: 'Zuverlässigkeit',
        article: 'die',
        pluralForm: null,
        ipaPronunciation: '[ˈtsuːfɛɐ̯ˌlɛsɪçkaɪ̯t]',
        partOfSpeech: 'noun',
        translations: { en: 'reliability / dependability', bn: 'নির্ভরযোগ্যতা' },
        exampleSentenceDe: 'In der deutschen Arbeitswelt ist Zuverlässigkeit eine Grundvoraussetzung.',
        exampleSentenceTranslation: { en: 'In the German workplace, reliability is a fundamental prerequisite.', bn: 'জার্মান কর্মক্ষেত্রে নির্ভরযোগ্যতা অত্যন্ত অপরিহার্য।' },
      },
    ];

    for (const v of vocabB1) {
      const existing = await prisma.vocabularyItem.findFirst({ where: { word: v.word, lessonId: lessonB1.id } });
      if (!existing) {
        await prisma.vocabularyItem.create({
          data: {
            lessonId: lessonB1.id,
            word: v.word,
            article: v.article,
            pluralForm: v.pluralForm,
            ipaPronunciation: v.ipaPronunciation,
            partOfSpeech: v.partOfSpeech,
            translations: v.translations,
            exampleSentenceDe: v.exampleSentenceDe,
            exampleSentenceTranslation: v.exampleSentenceTranslation,
          },
        });
      }
    }

    const qB1Exists = await prisma.quizQuestion.findFirst({ where: { lessonId: lessonB1.id } });
    if (!qB1Exists) {
      await prisma.quizQuestion.create({
        data: {
          lessonId: lessonB1.id,
          questionDe: 'Wie lautet die korrekte Höflichkeitsformel am Ende eines Anschreibens?',
          questionTranslation: {
            en: 'What is the correct polite closing formula at the end of a cover letter?',
            bn: 'কাভার লেটারের শেষে ব্যবহারের জন্য সঠিক ফর্মাল সমাপ্তি বাক্য কোনটি?',
          },
          explanationDe: '"Über eine Einladung zu einem persönlichen Gespräch freue ich mich sehr" oder "Mit freundlichen Grüßen" ist der deutsche Standard.',
          explanationTranslation: {
            en: '"Mit freundlichen Grüßen" is the standard German business sign-off.',
            bn: '"Mit freundlichen Grüßen" হলো জার্মান ব্যবসায়িক চিঠিপত্রের আনুষ্ঠানিক সমাপ্তি।',
          },
          sequenceOrder: 1,
          options: {
            create: [
              { optionTextDe: 'Mit freundlichen Grüßen', isCorrect: true, sequenceOrder: 1 },
              { optionTextDe: 'Liebe Grüße und bis bald', isCorrect: false, sequenceOrder: 2 },
              { optionTextDe: 'Dein Freund Rahim', isCorrect: false, sequenceOrder: 3 },
            ],
          },
        },
      });
    }
  }

  // 7. Seed Level B2 Module & Lesson
  const b2Level = await prisma.learningLevel.findUnique({ where: { code: 'B2' as any } });
  if (b2Level) {
    const moduleB2 = await prisma.learningModule.upsert({
      where: { id: 'mod-b2-001' },
      update: { title: 'Fachsprache am Arbeitsplatz & Übergabe', levelId: b2Level.id, sequenceOrder: 1 },
      create: {
        id: 'mod-b2-001',
        levelId: b2Level.id,
        title: 'Fachsprache am Arbeitsplatz & Übergabe',
        description: 'Technical terminology, handover protocols, safety instructions.',
        sequenceOrder: 1,
      },
    });

    const lessonB2 = await prisma.lesson.upsert({
      where: { slug: 'b2-m1-uebergabe-fachsprache' },
      update: {
        titleDe: 'Übergabeprotokoll in Pflege und technischer Industrie',
        grammarNotesDe: 'Passiv (Präsens & Präteritum) zur sachlichen Dokumentation von Vorgängen.',
        estimatedMinutes: 30,
        sequenceOrder: 1,
        coinReward: 30,
      },
      create: {
        id: 'les-b2-001',
        moduleId: moduleB2.id,
        slug: 'b2-m1-uebergabe-fachsprache',
        titleDe: 'Übergabeprotokoll in Pflege und technischer Industrie',
        grammarNotesDe: 'Passiv (Präsens & Präteritum) zur sachlichen Dokumentation von Vorgängen.',
        estimatedMinutes: 30,
        sequenceOrder: 1,
        coinReward: 30,
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lessonB2.id, languageCode: 'en' } },
      update: {
        title: 'Shift Handover Protocols in Healthcare & Technical Trades',
        summary: 'Professional documentation, reporting incidents, and passive voice structures in vocational contexts.',
        grammarNotes: 'Passiv voice ("wurde durchgeführt", "wird dokumentiert") is essential for neutral vocational reporting.',
      },
      create: {
        lessonId: lessonB2.id,
        languageCode: 'en',
        title: 'Shift Handover Protocols in Healthcare & Technical Trades',
        summary: 'Professional documentation, reporting incidents, and passive voice structures in vocational contexts.',
        grammarNotes: 'Passiv voice ("wurde durchgeführt", "wird dokumentiert") is essential for neutral vocational reporting.',
      },
    });

    await prisma.lessonTranslation.upsert({
      where: { lessonId_languageCode: { lessonId: lessonB2.id, languageCode: 'bn' } },
      update: {
        title: 'নার্সিং ও টেকনিক্যাল কর্মক্ষেত্রে শিফট হ্যান্ডওভার প্রোটোকল',
        summary: 'কর্মক্ষেত্রে নিখুঁত রিপোর্ট তৈরি, কাজের বিবরণ লিপিবদ্ধ করা এবং প্যাসিভ ভয়েসের ব্যবহার।',
        grammarNotes: 'কর্মক্ষেত্রের আনুষ্ঠানিক নথিপত্রে প্যাসিভ ভয়েস ("wurde durchgeführt") বহুল ব্যবহৃত হয়।',
      },
      create: {
        lessonId: lessonB2.id,
        languageCode: 'bn',
        title: 'নার্সিং ও টেকনিক্যাল কর্মক্ষেত্রে শিফট হ্যান্ডওভার প্রোটোকল',
        summary: 'কর্মক্ষেত্রে নিখুঁত রিপোর্ট তৈরি, কাজের বিবরণ লিপিবদ্ধ করা এবং প্যাসিভ ভয়েসের ব্যবহার।',
        grammarNotes: 'কর্মক্ষেত্রের আনুষ্ঠানিক নথিপত্রে প্যাসিভ ভয়েস ("wurde durchgeführt") বহুল ব্যবহৃত হয়।',
      },
    });

    const vocabB2 = [
      {
        word: 'Arbeitssicherheit',
        article: 'die',
        pluralForm: null,
        ipaPronunciation: '[ˈaʁbaɪ̯tsˌzɪçɐhaɪ̯t]',
        partOfSpeech: 'noun',
        translations: { en: 'occupational safety', bn: 'কর্মক্ষেত্রের নিরাপত্তা' },
        exampleSentenceDe: 'Die Vorschriften zur Arbeitssicherheit müssen strikt eingehalten werden.',
        exampleSentenceTranslation: { en: 'Occupational safety regulations must be strictly adhered to.', bn: 'কর্মক্ষেত্রের নিরাপত্তা সংক্রান্ত নীতিমালা কঠোরভাবে মেনে চলতে হবে।' },
      },
      {
        word: 'Protokoll',
        article: 'das',
        pluralForm: 'die Protokolle',
        ipaPronunciation: '[pʁotoˈkɔl]',
        partOfSpeech: 'noun',
        translations: { en: 'protocol / official record', bn: 'কার্যবিবরণী / প্রোটোকল' },
        exampleSentenceDe: 'Nach der Schicht verfassen wir das Übergabeprotokoll.',
        exampleSentenceTranslation: { en: 'After the shift, we write the handover protocol.', bn: 'শিফট শেষে আমরা হ্যান্ডওভার প্রোটোকল লিখি।' },
      },
    ];

    for (const v of vocabB2) {
      const existing = await prisma.vocabularyItem.findFirst({ where: { word: v.word, lessonId: lessonB2.id } });
      if (!existing) {
        await prisma.vocabularyItem.create({
          data: {
            lessonId: lessonB2.id,
            word: v.word,
            article: v.article,
            pluralForm: v.pluralForm,
            ipaPronunciation: v.ipaPronunciation,
            partOfSpeech: v.partOfSpeech,
            translations: v.translations,
            exampleSentenceDe: v.exampleSentenceDe,
            exampleSentenceTranslation: v.exampleSentenceTranslation,
          },
        });
      }
    }

    const qB2Exists = await prisma.quizQuestion.findFirst({ where: { lessonId: lessonB2.id } });
    if (!qB2Exists) {
      await prisma.quizQuestion.create({
        data: {
          lessonId: lessonB2.id,
          questionDe: 'Welcher Satz steht im Vorgangspassiv Präteritum?',
          questionTranslation: {
            en: 'Which sentence is in the past process passive (Vorgangspassiv Präteritum)?',
            bn: 'কোন বাক্যটি অতীত প্যাসিভ (Vorgangspassiv Präteritum) ফর্মে রয়েছে?',
          },
          explanationDe: '"wurde ... durchgeführt" ist die passive Vergangenheitsform (wurde + Partizip II).',
          explanationTranslation: {
            en: '"wurde ... durchgeführt" is formed with wurde + past participle.',
            bn: '"wurde ... durchgeführt" হলো অতীত প্যাসিভ রূপ।',
          },
          sequenceOrder: 1,
          options: {
            create: [
              { optionTextDe: 'Die Sicherheitsprüfung wurde vorschriftsmäßig durchgeführt.', isCorrect: true, sequenceOrder: 1 },
              { optionTextDe: 'Wir führten die Prüfung durch.', isCorrect: false, sequenceOrder: 2 },
              { optionTextDe: 'Die Prüfung wird gerade durchgeführt.', isCorrect: false, sequenceOrder: 3 },
            ],
          },
        },
      });
    }
  }

  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
