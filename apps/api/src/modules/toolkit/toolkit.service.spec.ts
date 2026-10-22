import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ToolkitService } from './toolkit.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DocumentCategory } from './dto/document.dto.js';
import { ChecklistCategory } from './dto/checklist.dto.js';

describe('ToolkitService (Phase 6 - DIN 5008 CV, Cover Letter & Document Vault)', () => {
  let toolkitService: ToolkitService;
  let prisma: PrismaService;
  let testUserId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ToolkitService],
    }).compile();

    toolkitService = module.get<ToolkitService>(ToolkitService);
    prisma = module.get<PrismaService>(PrismaService);

    // Create a dedicated test candidate user
    const user = await prisma.user.create({
      data: {
        email: `toolkit-candidate-${Date.now()}@example.com`,
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Amina',
            lastName: 'Rahman',
            targetAusbildungField: 'Pflegefachfrau',
          },
        },
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } });
    }
  });

  // ===========================================================================
  // 1. DIN 5008 TABELLARISCHER LEBENSLAUF
  // ===========================================================================
  describe('Tabellarischer Lebenslauf (CV Multi-Version Management)', () => {
    let createdCvId: string;

    it('1. should create a vocational Lebenslauf version and make it primary by default', async () => {
      const cv = await toolkitService.createCv(testUserId, {
        title: 'Pflegefachfrau CV - Charité',
        targetVocation: 'Pflegefachfrau',
        personalInfo: {
          fullName: 'Amina Rahman',
          birthDate: '10.02.2002',
          birthPlace: 'Chittagong, Bangladesch',
          nationality: 'Bangladeschisch',
          address: 'Road 5, House 21, Dhanmondi, 1205 Dhaka',
          phone: '+880 1700 123456',
          email: 'amina.rahman@example.com',
          photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        },
        education: [
          {
            startDate: '07/2018',
            endDate: '06/2022',
            institution: 'Chittagong Government College',
            degree: 'Higher Secondary School Certificate (GPA 5.0/5.0)',
            city: 'Chittagong',
            country: 'Bangladesch',
            description: 'Schwerpunkt Biologie und Naturwissenschaften',
          },
        ],
        experience: [
          {
            startDate: '08/2022',
            endDate: '09/2023',
            company: 'Chittagong Medical Center',
            role: 'Pflegepraktikantin',
            city: 'Chittagong',
            country: 'Bangladesch',
            tasks: [
              'Unterstützung des Fachpersonals bei der Patientenlagerung',
              'Dokumentation von Vitalparametern',
            ],
          },
        ],
        languageSkills: [
          {
            language: 'Deutsch',
            level: 'B2',
            certificate: 'Goethe-Zertifikat B2',
            description: 'Gute mündliche und schriftliche Ausdrucksfähigkeit',
          },
          {
            language: 'Englisch',
            level: 'B2',
            certificate: 'IELTS 6.5',
          },
        ],
        skills: [
          {
            category: 'EDV-Kenntnisse',
            items: ['MS Office (Word, Excel)', 'Patienten-Software'],
          },
        ],
        interests: ['Volleyball', 'Ehrenamtliche Nachbarschaftshilfe'],
        locationDate: 'Dhaka, 22. Oktober 2026',
        isPrimary: true,
      });

      expect(cv).toBeDefined();
      expect(cv.id).toBeDefined();
      expect(cv.isPrimary).toBe(true);
      expect(cv.targetVocation).toBe('Pflegefachfrau');
      createdCvId = cv.id;
    });

    it('2. should duplicate a CV version for a secondary target vocation', async () => {
      const duplicate = await toolkitService.duplicateCv(testUserId, createdCvId);
      expect(duplicate).toBeDefined();
      expect(duplicate.id).not.toBe(createdCvId);
      expect(duplicate.title).toContain('(Kopie)');
      expect(duplicate.isPrimary).toBe(false);

      // Verify list returns both CVs
      const list = await toolkitService.listCvs(testUserId);
      expect(list.length).toBe(2);
      expect(list[0].isPrimary).toBe(true); // primary is first
    });

    it('3. should switch primary CV when setPrimaryCv is called', async () => {
      const cvList = await toolkitService.listCvs(testUserId);
      const secondaryCv = cvList.find((c) => !c.isPrimary)!;

      const updated = await toolkitService.setPrimaryCv(testUserId, secondaryCv.id);
      expect(updated.isPrimary).toBe(true);

      const refreshedOriginal = await toolkitService.getCvById(testUserId, createdCvId);
      expect(refreshedOriginal.isPrimary).toBe(false);
    });

    it('4. should render DIN 5008 print-ready HTML for the CV', async () => {
      const html = await toolkitService.renderCvHtml(testUserId, createdCvId);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Lebenslauf');
      expect(html).toContain('Amina Rahman');
      expect(html).toContain('Pflegefachfrau');
      expect(html).toContain('Goethe-Zertifikat B2');
      expect(html).toContain('Dhaka, 22. Oktober 2026');
      expect(html).toContain('Chittagong Medical Center');
    });
  });

  // ===========================================================================
  // 2. DIN 5008 ANSCHREIBEN (COVER LETTER)
  // ===========================================================================
  describe('DIN 5008 Anschreiben (Cover Letter Generator)', () => {
    let createdLetterId: string;

    it('1. should create a formatted DIN 5008 Anschreiben', async () => {
      const letter = await toolkitService.createCoverLetter(testUserId, {
        title: 'Bewerbung Vivantes Pflege 2027',
        senderBlock: {
          name: 'Amina Rahman',
          address: 'Road 5, House 21, Dhanmondi',
          postalCodeCity: '1205 Dhaka, Bangladesch',
          phone: '+880 1700 123456',
          email: 'amina.rahman@example.com',
        },
        recipientBlock: {
          company: 'Vivantes – Netzwerk für Gesundheit GmbH',
          contactPerson: 'Herrn Markus Becker',
          department: 'Personalabteilung Ausbildung',
          address: 'Aroser Allee 72-76',
          postalCodeCity: '13407 Berlin',
        },
        dateLine: 'Dhaka, den 22. Oktober 2026',
        subjectLine: 'Bewerbung um einen Ausbildungsplatz zur Pflegefachfrau zum 01.09.2027',
        salutation: 'Sehr geehrter Herr Becker,',
        bodyText:
          'mit großem Interesse habe ich Ihre Ausschreibung für die generalistische Ausbildung zur Pflegefachfrau an den Vivantes Kliniken gelesen.\n\nDurch mein einjähriges Pflegepraktikum am Medical Center habe ich bereits praktische Erfahrungen in der Grundpflege und Betreuung von Patienten erworben. Mein Goethe-Zertifikat B2 belegt meine guten deutschen Sprachkenntnisse.\n\nÜber eine Einladung zu einem Online-Vorstellungsgespräch freue ich mich sehr.',
        signOff: 'Mit freundlichen Grüßen',
        enclosures: 'Anlagen: Tabellarischer Lebenslauf, Zeugnisse, B2-Zertifikat',
      });

      expect(letter).toBeDefined();
      expect(letter.id).toBeDefined();
      expect(letter.subjectLine).toContain('Pflegefachfrau');
      createdLetterId = letter.id;
    });

    it('2. should render print-ready DIN 5008 HTML with proper margins and address windows', async () => {
      const html = await toolkitService.renderCoverLetterHtml(testUserId, createdLetterId);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Vivantes – Netzwerk für Gesundheit GmbH');
      expect(html).toContain('Aroser Allee 72-76');
      expect(html).toContain('Dhaka, den 22. Oktober 2026');
      expect(html).toContain('Bewerbung um einen Ausbildungsplatz');
      expect(html).toContain('Sehr geehrter Herr Becker,');
      expect(html).toContain('Mit freundlichen Grüßen');
      expect(html).toContain('Anlagen:');
    });

    it('3. should update and delete cover letters cleanly', async () => {
      const updated = await toolkitService.updateCoverLetter(testUserId, createdLetterId, {
        title: 'Bewerbung Vivantes Pflege 2027 (Final)',
      });
      expect(updated.title).toBe('Bewerbung Vivantes Pflege 2027 (Final)');

      const deleteRes = await toolkitService.deleteCoverLetter(testUserId, createdLetterId);
      expect(deleteRes.success).toBe(true);

      await expect(
        toolkitService.getCoverLetterById(testUserId, createdLetterId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ===========================================================================
  // 3. APPLICANT DOCUMENT VAULT
  // ===========================================================================
  describe('Applicant Document Vault', () => {
    let uploadedDocId: string;

    it('1. should upload and register a verified PDF document in vault', async () => {
      const doc = await toolkitService.uploadDocument(testUserId, {
        title: 'Goethe B2 Zertifikat',
        category: DocumentCategory.LANGUAGE_CERTIFICATE,
        fileName: 'Goethe_Zertifikat_B2_Amina_Rahman.pdf',
        fileSize: 1024 * 1024 * 2, // 2MB
        mimeType: 'application/pdf',
        fileUrl: 'https://storage.ausbildung-portal.de/vault/amina/goethe-b2.pdf',
        isVerified: true,
      });

      expect(doc).toBeDefined();
      expect(doc.id).toBeDefined();
      expect(doc.category).toBe(DocumentCategory.LANGUAGE_CERTIFICATE);
      expect(doc.isVerified).toBe(true);
      uploadedDocId = doc.id;
    });

    it('2. should reject disallowed MIME types (e.g. executable or zip)', async () => {
      await expect(
        toolkitService.uploadDocument(testUserId, {
          title: 'Malicious Archive',
          category: DocumentCategory.OTHER,
          fileName: 'archive.zip',
          fileSize: 50000,
          mimeType: 'application/zip',
          fileUrl: 'https://storage.ausbildung-portal.de/vault/amina/archive.zip',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('3. should reject files exceeding the 15MB limit', async () => {
      await expect(
        toolkitService.uploadDocument(testUserId, {
          title: 'Gigantic Video Scan',
          category: DocumentCategory.PASSPORT,
          fileName: 'passport_scan_oversized.pdf',
          fileSize: 20 * 1024 * 1024, // 20MB
          mimeType: 'application/pdf',
          fileUrl: 'https://storage.ausbildung-portal.de/vault/amina/passport.pdf',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('4. should compute vault storage statistics accurately', async () => {
      // Add a passport photo
      await toolkitService.uploadDocument(testUserId, {
        title: 'Biometrisches Passfoto',
        category: DocumentCategory.PASSPORT,
        fileName: 'passfoto.jpg',
        fileSize: 500 * 1024, // 500KB
        mimeType: 'image/jpeg',
        fileUrl: 'https://storage.ausbildung-portal.de/vault/amina/photo.jpg',
      });

      const stats = await toolkitService.getDocumentStats(testUserId);
      expect(stats.totalCount).toBe(2);
      expect(stats.totalBytes).toBeGreaterThan(2000000);
      expect(stats.formattedTotalSize).toContain('MB');
      expect(stats.categoryBreakdown[DocumentCategory.LANGUAGE_CERTIFICATE]).toBe(1);
      expect(stats.categoryBreakdown[DocumentCategory.PASSPORT]).toBe(1);
    });

    it('5. should delete a document from the vault', async () => {
      const res = await toolkitService.deleteDocument(testUserId, uploadedDocId);
      expect(res.success).toBe(true);

      const list = await toolkitService.listDocuments(testUserId);
      expect(list.some((d) => d.id === uploadedDocId)).toBe(false);
    });
  });

  // ===========================================================================
  // 4. EMBASSY & INTERVIEW READINESS CHECKLIST
  // ===========================================================================
  describe('Embassy & Interview Readiness Checklist', () => {
    it('1. should auto-initialize 10 standard German preparation items for a new user', async () => {
      const checklist = await toolkitService.getChecklist(testUserId);
      expect(checklist.metrics.totalItems).toBe(10);
      expect(checklist.metrics.completedItems).toBe(0);
      expect(checklist.metrics.completionPercentage).toBe(0);
      expect(checklist.items.length).toBe(10);

      // Verify categories present
      expect(
        checklist.items.some((i) => i.category === ChecklistCategory.EMBASSY_VISA),
      ).toBe(true);
      expect(
        checklist.items.some((i) => i.category === ChecklistCategory.INTERVIEW_PREP),
      ).toBe(true);
      expect(
        checklist.items.some((i) => i.category === ChecklistCategory.DOCUMENT_AUTHENTICATION),
      ).toBe(true);
    });

    it('2. should toggle item completion and calculate progress percentage accurately', async () => {
      const initial = await toolkitService.getChecklist(testUserId);
      const itemToComplete = initial.items[0];

      await toolkitService.updateChecklistItem(testUserId, itemToComplete.id, {
        isCompleted: true,
      });

      const updated = await toolkitService.getChecklist(testUserId);
      expect(updated.metrics.completedItems).toBe(1);
      expect(updated.metrics.completionPercentage).toBe(10); // 1 out of 10 = 10%
    });

    it('3. should support adding custom checklist items', async () => {
      const customItem = await toolkitService.createChecklistItem(testUserId, {
        category: ChecklistCategory.INTERVIEW_PREP,
        title: 'Fachbegriffe Herz-Kreislauf-System wiederholen',
        description: 'Vorbereitung auf das Fachgespräch mit der Stationsleitung.',
        sequenceOrder: 15,
      });
      expect(customItem).toBeDefined();
      expect(customItem.title).toContain('Herz-Kreislauf');

      const checklist = await toolkitService.getChecklist(testUserId);
      expect(checklist.metrics.totalItems).toBe(11);
    });

    it('4. should reset checklist to the standard 10 items template', async () => {
      const reset = await toolkitService.resetChecklist(testUserId);
      expect(reset.metrics.totalItems).toBe(10);
      expect(reset.metrics.completedItems).toBe(0);
    });
  });
});
