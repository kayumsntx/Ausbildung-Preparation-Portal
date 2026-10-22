import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateCvDto,
  EducationItem,
  ExperienceItem,
  LanguageSkillItem,
  PersonalInfoItem,
  SkillCategoryItem,
  UpdateCvDto,
} from './dto/cv.dto.js';
import {
  CreateCoverLetterDto,
  RecipientBlockDto,
  SenderBlockDto,
  UpdateCoverLetterDto,
} from './dto/cover-letter.dto.js';
import {
  ALLOWED_MIME_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
  UploadDocumentDto,
} from './dto/document.dto.js';
import {
  ChecklistCategory,
  CreateChecklistItemDto,
  UpdateChecklistItemDto,
} from './dto/checklist.dto.js';

const DEFAULT_CHECKLIST_TEMPLATES = [
  {
    category: ChecklistCategory.EMBASSY_VISA,
    title: 'Gültiger Reisepass (mindestens 12 Monate Gültigkeit)',
    description: 'Reisepass mit mindestens zwei leeren Seiten für das nationale Visum D.',
    sequenceOrder: 1,
  },
  {
    category: ChecklistCategory.EMBASSY_VISA,
    title: 'Ausbildungsvertrag im Original (IHK/HWK eingetragen)',
    description: 'Von Betrieb und Auszubildendem unterschriebener Vertrag inkl. betrieblichem Ausbildungsplan.',
    sequenceOrder: 2,
  },
  {
    category: ChecklistCategory.EMBASSY_VISA,
    title: 'Betrieblicher Ausbildungsplan (Rahmenlehrplan)',
    description: 'Detaillierter Ausbildungsablaufplan für die 3-jährige duale Ausbildung.',
    sequenceOrder: 3,
  },
  {
    category: ChecklistCategory.EMBASSY_VISA,
    title: 'Zertifizierter Deutschnachweis (B1 oder B2 Goethe/telc)',
    description: 'Zertifikat nicht älter als 12 Monate für reibungslose Visumerteilung.',
    sequenceOrder: 4,
  },
  {
    category: ChecklistCategory.EMBASSY_VISA,
    title: 'Finanzierungsnachweis / Sperrkonto (§ 16a AufenthG)',
    description: 'Monatlicher Mindestbetrag oder Ausbildungsvergütung über 903 € brutto (Stand 2026).',
    sequenceOrder: 5,
  },
  {
    category: ChecklistCategory.EMBASSY_VISA,
    title: 'Incoming-Krankenversicherung für die Einreise',
    description: 'Gültige Reisekrankenversicherung bis zum Antritt der gesetzlichen Kassenversicherung.',
    sequenceOrder: 6,
  },
  {
    category: ChecklistCategory.EMBASSY_VISA,
    title: 'Biometrische Passbilder (ICAO-Standard)',
    description: 'Zwei aktuelle Passfotos mit hellem Hintergrund (35 x 45 mm).',
    sequenceOrder: 7,
  },
  {
    category: ChecklistCategory.INTERVIEW_PREP,
    title: 'Vorbereitung auf typische Ausbildungs-Interviewfragen',
    description: 'Motivation für den Beruf, Wissen über den Betrieb und Berufsschulablauf.',
    sequenceOrder: 8,
  },
  {
    category: ChecklistCategory.INTERVIEW_PREP,
    title: 'Simulation eines Vorstellungsgesprächs auf Deutsch',
    description: 'Freies Sprechen über den bisherigen schulischen und praktischen Lebenslauf.',
    sequenceOrder: 9,
  },
  {
    category: ChecklistCategory.DOCUMENT_AUTHENTICATION,
    title: 'Beglaubigte Übersetzung & Apostille der Schulzeugnisse',
    description: 'Notariell beglaubigte deutsche Übersetzung des Abschlusszeugnisses.',
    sequenceOrder: 10,
  },
];

@Injectable()
export class ToolkitService {
  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // 1. DIN 5008 TABELLARISCHER LEBENSLAUF (CV VERSIONS)
  // ===========================================================================

  async listCvs(userId: string) {
    return this.prisma.cvVersion.findMany({
      where: { userId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getCvById(userId: string, cvId: string) {
    const cv = await this.prisma.cvVersion.findFirst({
      where: { id: cvId, userId },
    });
    if (!cv) {
      throw new NotFoundException(`CV with ID '${cvId}' was not found.`);
    }
    return cv;
  }

  async createCv(userId: string, dto: CreateCvDto) {
    const existingCount = await this.prisma.cvVersion.count({ where: { userId } });
    const shouldBePrimary = dto.isPrimary || existingCount === 0;

    if (shouldBePrimary) {
      await this.prisma.cvVersion.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.cvVersion.create({
      data: {
        userId,
        title: dto.title,
        targetVocation: dto.targetVocation,
        personalInfo: dto.personalInfo as any,
        education: dto.education as any,
        experience: dto.experience as any,
        languageSkills: dto.languageSkills as any,
        skills: dto.skills as any,
        interests: (dto.interests || []) as any,
        locationDate: dto.locationDate || 'Dhaka, 22. Oktober 2026',
        isPrimary: shouldBePrimary,
      },
    });
  }

  async updateCv(userId: string, cvId: string, dto: UpdateCvDto) {
    await this.getCvById(userId, cvId);

    if (dto.isPrimary === true) {
      await this.prisma.cvVersion.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    return this.prisma.cvVersion.update({
      where: { id: cvId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.targetVocation && { targetVocation: dto.targetVocation }),
        ...(dto.personalInfo && { personalInfo: dto.personalInfo as any }),
        ...(dto.education && { education: dto.education as any }),
        ...(dto.experience && { experience: dto.experience as any }),
        ...(dto.languageSkills && { languageSkills: dto.languageSkills as any }),
        ...(dto.skills && { skills: dto.skills as any }),
        ...(dto.interests !== undefined && { interests: dto.interests as any }),
        ...(dto.locationDate !== undefined && { locationDate: dto.locationDate }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
      },
    });
  }

  async deleteCv(userId: string, cvId: string) {
    const cv = await this.getCvById(userId, cvId);
    await this.prisma.cvVersion.delete({ where: { id: cvId } });

    if (cv.isPrimary) {
      const remaining = await this.prisma.cvVersion.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (remaining) {
        await this.prisma.cvVersion.update({
          where: { id: remaining.id },
          data: { isPrimary: true },
        });
      }
    }

    return { success: true, message: `CV '${cv.title}' has been deleted.` };
  }

  async setPrimaryCv(userId: string, cvId: string) {
    await this.getCvById(userId, cvId);

    await this.prisma.cvVersion.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    });

    return this.prisma.cvVersion.update({
      where: { id: cvId },
      data: { isPrimary: true },
    });
  }

  async duplicateCv(userId: string, cvId: string) {
    const source = await this.getCvById(userId, cvId);

    return this.prisma.cvVersion.create({
      data: {
        userId,
        title: `${source.title} (Kopie)`,
        targetVocation: source.targetVocation,
        personalInfo: source.personalInfo as any,
        education: source.education as any,
        experience: source.experience as any,
        languageSkills: source.languageSkills as any,
        skills: source.skills as any,
        interests: source.interests as any,
        locationDate: source.locationDate,
        isPrimary: false,
      },
    });
  }

  async renderCvHtml(userId: string, cvId: string): Promise<string> {
    const cv = await this.getCvById(userId, cvId);
    const pInfo = cv.personalInfo as unknown as PersonalInfoItem;
    const eduList = (cv.education as unknown as EducationItem[]) || [];
    const expList = (cv.experience as unknown as ExperienceItem[]) || [];
    const langList = (cv.languageSkills as unknown as LanguageSkillItem[]) || [];
    const skillList = (cv.skills as unknown as SkillCategoryItem[]) || [];
    const interests = (cv.interests as unknown as string[]) || [];

    const eduHtml = eduList
      .map(
        (e) => `
        <div class="row">
          <div class="date-col">${e.startDate} – ${e.endDate}</div>
          <div class="content-col">
            <strong>${e.degree}</strong><br>
            <span>${e.institution}, ${e.city} (${e.country})</span>
            ${e.description ? `<p class="desc">${e.description}</p>` : ''}
          </div>
        </div>`,
      )
      .join('');

    const expHtml = expList
      .map(
        (e) => `
        <div class="row">
          <div class="date-col">${e.startDate} – ${e.endDate}</div>
          <div class="content-col">
            <strong>${e.role}</strong><br>
            <span>${e.company}, ${e.city} (${e.country})</span>
            ${
              e.tasks && e.tasks.length > 0
                ? `<ul class="tasks-list">${e.tasks.map((t) => `<li>${t}</li>`).join('')}</ul>`
                : ''
            }
          </div>
        </div>`,
      )
      .join('');

    const langHtml = langList
      .map(
        (l) => `
        <div class="row">
          <div class="date-col"><strong>${l.language}</strong></div>
          <div class="content-col">
            <span>${l.level}</span>
            ${l.certificate ? `<span class="badge">${l.certificate}</span>` : ''}
            ${l.description ? `<p class="desc">${l.description}</p>` : ''}
          </div>
        </div>`,
      )
      .join('');

    const skillsHtml = skillList
      .map(
        (s) => `
        <div class="row">
          <div class="date-col"><strong>${s.category}</strong></div>
          <div class="content-col">
            <span>${s.items.join(', ')}</span>
          </div>
        </div>`,
      )
      .join('');

    const interestsHtml =
      interests.length > 0
        ? `
        <div class="row">
          <div class="date-col"><strong>Interessen</strong></div>
          <div class="content-col">
            <span>${interests.join(', ')}</span>
          </div>
        </div>`
        : '';

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Lebenslauf - ${pInfo.fullName}</title>
  <style>
    @page { size: A4; margin: 25mm 20mm 20mm 25mm; }
    body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #1a1a1a;
      margin: 0;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #003366;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 20pt;
      color: #003366;
      margin: 0 0 5px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .header .subtitle {
      font-size: 12pt;
      color: #555;
      font-weight: bold;
    }
    .header .photo {
      width: 110px;
      height: 140px;
      object-fit: cover;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .section-title {
      font-size: 12pt;
      color: #003366;
      border-bottom: 1px solid #ddd;
      padding-bottom: 3px;
      margin-top: 18px;
      margin-bottom: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .row {
      display: flex;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .date-col {
      width: 32%;
      color: #444;
      font-size: 9.5pt;
    }
    .content-col {
      width: 68%;
    }
    .content-col strong {
      color: #111;
    }
    .desc {
      margin: 3px 0;
      font-size: 9pt;
      color: #555;
    }
    .tasks-list {
      margin: 4px 0 6px 16px;
      padding: 0;
      font-size: 9pt;
      color: #333;
    }
    .badge {
      display: inline-block;
      background: #eef4f9;
      color: #003366;
      padding: 1px 6px;
      font-size: 8.5pt;
      border-radius: 3px;
      margin-left: 6px;
    }
    .signature-block {
      margin-top: 35px;
      page-break-inside: avoid;
    }
    .signature-space {
      height: 40px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Lebenslauf</h1>
      <div class="subtitle">${cv.targetVocation}</div>
    </div>
    ${pInfo.photoUrl ? `<img class="photo" src="${pInfo.photoUrl}" alt="${pInfo.fullName}">` : ''}
  </div>

  <div class="section-title">Persönliche Daten</div>
  <div class="row"><div class="date-col">Name:</div><div class="content-col"><strong>${pInfo.fullName}</strong></div></div>
  <div class="row"><div class="date-col">Geburtsdatum & -ort:</div><div class="content-col">${pInfo.birthDate} in ${pInfo.birthPlace}</div></div>
  <div class="row"><div class="date-col">Staatsangehörigkeit:</div><div class="content-col">${pInfo.nationality}</div></div>
  <div class="row"><div class="date-col">Anschrift:</div><div class="content-col">${pInfo.address}</div></div>
  <div class="row"><div class="date-col">Telefon:</div><div class="content-col">${pInfo.phone}</div></div>
  <div class="row"><div class="date-col">E-Mail:</div><div class="content-col">${pInfo.email}</div></div>

  <div class="section-title">Berufliche Praxis & Praktika</div>
  ${expHtml || '<div class="row"><div class="date-col">-</div><div class="content-col">Keine praktischen Erfahrungen angegeben</div></div>'}

  <div class="section-title">Schulische Ausbildung</div>
  ${eduHtml || '<div class="row"><div class="date-col">-</div><div class="content-col">Keine Schulbildung angegeben</div></div>'}

  <div class="section-title">Sprachkenntnisse</div>
  ${langHtml || '<div class="row"><div class="date-col">-</div><div class="content-col">Keine Angaben</div></div>'}

  <div class="section-title">Kenntnisse & Fertigkeiten</div>
  ${skillsHtml}
  ${interestsHtml}

  <div class="signature-block">
    <div>${cv.locationDate || 'Dhaka, 22. Oktober 2026'}</div>
    <div class="signature-space"></div>
    <div>${pInfo.fullName}</div>
  </div>
</body>
</html>`;
  }

  // ===========================================================================
  // 2. DIN 5008 ANSCHREIBEN (COVER LETTER)
  // ===========================================================================

  async listCoverLetters(userId: string) {
    return this.prisma.coverLetter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCoverLetterById(userId: string, letterId: string) {
    const letter = await this.prisma.coverLetter.findFirst({
      where: { id: letterId, userId },
    });
    if (!letter) {
      throw new NotFoundException(`Cover letter with ID '${letterId}' was not found.`);
    }
    return letter;
  }

  async createCoverLetter(userId: string, dto: CreateCoverLetterDto) {
    return this.prisma.coverLetter.create({
      data: {
        userId,
        title: dto.title,
        senderBlock: dto.senderBlock as any,
        recipientBlock: dto.recipientBlock as any,
        dateLine: dto.dateLine,
        subjectLine: dto.subjectLine,
        salutation: dto.salutation,
        bodyText: dto.bodyText,
        signOff: dto.signOff || 'Mit freundlichen Grüßen',
        enclosures: dto.enclosures || 'Anlagen: Lebenslauf, Zeugnisse, Sprachzertifikat',
      },
    });
  }

  async updateCoverLetter(userId: string, letterId: string, dto: UpdateCoverLetterDto) {
    await this.getCoverLetterById(userId, letterId);

    return this.prisma.coverLetter.update({
      where: { id: letterId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.senderBlock && { senderBlock: dto.senderBlock as any }),
        ...(dto.recipientBlock && { recipientBlock: dto.recipientBlock as any }),
        ...(dto.dateLine && { dateLine: dto.dateLine }),
        ...(dto.subjectLine && { subjectLine: dto.subjectLine }),
        ...(dto.salutation && { salutation: dto.salutation }),
        ...(dto.bodyText && { bodyText: dto.bodyText }),
        ...(dto.signOff && { signOff: dto.signOff }),
        ...(dto.enclosures !== undefined && { enclosures: dto.enclosures }),
      },
    });
  }

  async deleteCoverLetter(userId: string, letterId: string) {
    const letter = await this.getCoverLetterById(userId, letterId);
    await this.prisma.coverLetter.delete({ where: { id: letterId } });
    return { success: true, message: `Cover letter '${letter.title}' has been deleted.` };
  }

  async renderCoverLetterHtml(userId: string, letterId: string): Promise<string> {
    const letter = await this.getCoverLetterById(userId, letterId);
    const sender = letter.senderBlock as unknown as SenderBlockDto;
    const recipient = letter.recipientBlock as unknown as RecipientBlockDto;

    const formattedParagraphs = letter.bodyText
      .split('\n\n')
      .filter((p: string) => p.trim().length > 0)
      .map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>${letter.title} - DIN 5008</title>
  <style>
    @page {
      size: A4;
      margin: 25mm 20mm 20mm 25mm; /* DIN 5008 Margins: left 25mm, right 20mm */
    }
    body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      margin: 0;
      padding: 20px;
    }
    .sender-header {
      font-size: 9pt;
      color: #444;
      margin-bottom: 25px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }
    .sender-one-line {
      font-size: 8pt;
      color: #777;
      text-decoration: underline;
      margin-bottom: 5px;
    }
    .recipient-window {
      height: 45mm; /* DIN 5008 Anschriftfeld */
      margin-bottom: 20px;
      font-size: 10.5pt;
      line-height: 1.4;
    }
    .date-line {
      text-align: right;
      margin-bottom: 25px;
      font-size: 10.5pt;
    }
    .subject-line {
      font-size: 12pt;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .salutation {
      margin-bottom: 15px;
    }
    .body-content {
      text-align: justify;
      margin-bottom: 25px;
    }
    .body-content p {
      margin: 0 0 12px 0;
    }
    .sign-off {
      margin-bottom: 40px;
    }
    .signature-name {
      font-weight: bold;
    }
    .enclosures {
      margin-top: 35px;
      font-size: 10pt;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="sender-header">
    <strong>${sender.name}</strong> • ${sender.address} • ${sender.postalCodeCity} • Tel: ${sender.phone} • E-Mail: ${sender.email}
  </div>

  <div class="sender-one-line">
    ${sender.name} – ${sender.address} – ${sender.postalCodeCity}
  </div>

  <div class="recipient-window">
    <strong>${recipient.company}</strong><br>
    ${recipient.contactPerson ? `${recipient.contactPerson}<br>` : ''}
    ${recipient.department ? `${recipient.department}<br>` : ''}
    ${recipient.address}<br>
    ${recipient.postalCodeCity}
  </div>

  <div class="date-line">
    ${letter.dateLine}
  </div>

  <div class="subject-line">
    ${letter.subjectLine}
  </div>

  <div class="salutation">
    ${letter.salutation}
  </div>

  <div class="body-content">
    ${formattedParagraphs}
  </div>

  <div class="sign-off">
    ${letter.signOff}<br><br><br>
    <span class="signature-name">${sender.name}</span>
  </div>

  ${letter.enclosures ? `<div class="enclosures"><strong>${letter.enclosures}</strong></div>` : ''}
</body>
</html>`;
  }

  // ===========================================================================
  // 3. APPLICANT DOCUMENT VAULT
  // ===========================================================================

  async listDocuments(userId: string, category?: string) {
    return this.prisma.userDocument.findMany({
      where: {
        userId,
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadDocument(userId: string, dto: UploadDocumentDto) {
    if (!ALLOWED_MIME_TYPES.includes(dto.mimeType)) {
      throw new BadRequestException(
        `Invalid MIME type '${dto.mimeType}'. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (dto.fileSize > MAX_DOCUMENT_SIZE_BYTES) {
      throw new BadRequestException(
        `File size (${dto.fileSize} bytes) exceeds maximum allowable limit of 15 MB.`,
      );
    }

    return this.prisma.userDocument.create({
      data: {
        userId,
        title: dto.title,
        category: dto.category,
        fileName: dto.fileName,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        fileUrl: dto.fileUrl,
        isVerified: dto.isVerified ?? false,
      },
    });
  }

  async deleteDocument(userId: string, documentId: string) {
    const doc = await this.prisma.userDocument.findFirst({
      where: { id: documentId, userId },
    });
    if (!doc) {
      throw new NotFoundException(`Document with ID '${documentId}' was not found.`);
    }

    await this.prisma.userDocument.delete({ where: { id: documentId } });
    return { success: true, message: `Document '${doc.title}' has been removed from vault.` };
  }

  async getDocumentStats(userId: string) {
    const docs = await this.prisma.userDocument.findMany({
      where: { userId },
      select: { category: true, fileSize: true },
    });

    const totalCount = docs.length;
    const totalBytes = docs.reduce((acc: number, curr: { fileSize: number }) => acc + curr.fileSize, 0);

    const categoryBreakdown: Record<string, number> = {};
    for (const d of docs) {
      categoryBreakdown[d.category] = (categoryBreakdown[d.category] || 0) + 1;
    }

    const formattedTotalSize =
      totalBytes < 1024 * 1024
        ? `${(totalBytes / 1024).toFixed(1)} KB`
        : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;

    return {
      totalCount,
      totalBytes,
      formattedTotalSize,
      categoryBreakdown,
    };
  }

  // ===========================================================================
  // 4. EMBASSY & INTERVIEW READINESS CHECKLIST
  // ===========================================================================

  async getChecklist(userId: string) {
    let items = await this.prisma.applicationChecklist.findMany({
      where: { userId },
      orderBy: [{ sequenceOrder: 'asc' }, { createdAt: 'asc' }],
    });

    // Auto-seed user default checklist if brand new
    if (items.length === 0) {
      await this.prisma.applicationChecklist.createMany({
        data: DEFAULT_CHECKLIST_TEMPLATES.map((tpl) => ({
          userId,
          category: tpl.category,
          title: tpl.title,
          description: tpl.description,
          sequenceOrder: tpl.sequenceOrder,
        })),
      });

      items = await this.prisma.applicationChecklist.findMany({
        where: { userId },
        orderBy: [{ sequenceOrder: 'asc' }, { createdAt: 'asc' }],
      });
    }

    const totalItems = items.length;
    const completedItems = items.filter((i: { isCompleted: boolean }) => i.isCompleted).length;
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      metrics: {
        totalItems,
        completedItems,
        completionPercentage,
      },
      items,
    };
  }

  async createChecklistItem(userId: string, dto: CreateChecklistItemDto) {
    return this.prisma.applicationChecklist.create({
      data: {
        userId,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        sequenceOrder: dto.sequenceOrder ?? 1,
      },
    });
  }

  async updateChecklistItem(userId: string, itemId: string, dto: UpdateChecklistItemDto) {
    const item = await this.prisma.applicationChecklist.findFirst({
      where: { id: itemId, userId },
    });
    if (!item) {
      throw new NotFoundException(`Checklist item with ID '${itemId}' was not found.`);
    }

    return this.prisma.applicationChecklist.update({
      where: { id: itemId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isCompleted !== undefined && { isCompleted: dto.isCompleted }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.sequenceOrder !== undefined && { sequenceOrder: dto.sequenceOrder }),
      },
    });
  }

  async deleteChecklistItem(userId: string, itemId: string) {
    const item = await this.prisma.applicationChecklist.findFirst({
      where: { id: itemId, userId },
    });
    if (!item) {
      throw new NotFoundException(`Checklist item with ID '${itemId}' was not found.`);
    }

    await this.prisma.applicationChecklist.delete({ where: { id: itemId } });
    return { success: true, message: `Checklist item '${item.title}' has been deleted.` };
  }

  async resetChecklist(userId: string) {
    await this.prisma.applicationChecklist.deleteMany({ where: { userId } });

    await this.prisma.applicationChecklist.createMany({
      data: DEFAULT_CHECKLIST_TEMPLATES.map((tpl) => ({
        userId,
        category: tpl.category,
        title: tpl.title,
        description: tpl.description,
        sequenceOrder: tpl.sequenceOrder,
      })),
    });

    return this.getChecklist(userId);
  }
}
