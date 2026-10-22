import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CefrLevel } from '@prisma/client';

export interface BundesagenturRawItem {
  refnr?: string;
  titel?: string;
  arbeitgeber?: string;
  arbeitsort?: {
    ort?: string;
    plz?: string;
    region?: string;
    land?: string;
  };
  beruf?: string;
  aktuelleVakanzBeginn?: string;
  eintrittsdatum?: string;
  modifikationsTimestamp?: string;
}

@Injectable()
export class BundesagenturJobsucheService {
  private readonly logger = new Logger(BundesagenturJobsucheService.name);
  private readonly baseUrl = 'https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/app/jobs';
  private readonly apiKey = 'jobboerse-jobsuche';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Queries the live German Federal Employment Agency (Bundesagentur für Arbeit) Jobsuche API.
   * Normalizes returned Ausbildung positions and caches them into PostgreSQL.
   */
  async syncLiveJobs(was = 'Ausbildung', wo = '', limit = 10): Promise<{ fetched: number; saved: number }> {
    const startTime = Date.now();
    const queryTerm = was || 'Ausbildung';
    const location = wo || '';

    try {
      const url = new URL(this.baseUrl);
      url.searchParams.set('was', queryTerm);
      if (location) {
        url.searchParams.set('wo', location);
      }
      url.searchParams.set('angebotsart', '4'); // 4 = Ausbildung / Duale Berufsausbildung
      url.searchParams.set('size', String(limit));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url.toString(), {
        headers: {
          'X-API-Key': this.apiKey,
          Accept: 'application/json',
          'User-Agent': 'AusbildungPortal/1.0',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Bundesagentur API responded with status ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const rawItems: BundesagenturRawItem[] = json.stellenangebote || [];

      let savedCount = 0;
      for (const item of rawItems) {
        if (!item.refnr || !item.titel) continue;

        const city = item.arbeitsort?.ort || (location || 'Deutschland');
        const postalCode = item.arbeitsort?.plz || null;
        const state = item.arbeitsort?.region || null;
        const employer = item.arbeitgeber || 'Ausbildungsbetrieb';
        const category = this.categorizeJob(item.titel, item.beruf);
        const requiredGermanLevel = this.estimateRequiredGermanLevel(item.titel, category);

        await this.prisma.jobListing.upsert({
          where: {
            source_externalId: {
              source: 'BUNDESAGENTUR',
              externalId: item.refnr,
            },
          },
          update: {
            title: item.titel,
            employer,
            city,
            postalCode,
            state,
            category,
            requiredGermanLevel,
            isActive: true,
            metadata: item as any,
          },
          create: {
            externalId: item.refnr,
            source: 'BUNDESAGENTUR',
            title: item.titel,
            employer,
            city,
            postalCode,
            state,
            country: 'Deutschland',
            category,
            requiredGermanLevel,
            description: `Offizielle duale Berufsausbildung (Ref-Nr: ${item.refnr}) vermittelt über die Bundesagentur für Arbeit. Eintrittsdatum: ${item.eintrittsdatum || 'Zum nächstmöglichen Zeitpunkt'}.`,
            externalUrl: `https://www.arbeitsagentur.de/jobsuche/jobdetail/${item.refnr}`,
            isActive: true,
            metadata: item as any,
          },
        });
        savedCount += 1;
      }

      const durationMs = Date.now() - startTime;
      await this.prisma.jobSyncLog.create({
        data: {
          source: 'BUNDESAGENTUR',
          queryTerm,
          location,
          recordsFetched: rawItems.length,
          recordsSaved: savedCount,
          status: 'SUCCESS',
          durationMs,
        },
      });

      this.logger.log(`Synced ${savedCount} jobs from Bundesagentur API in ${durationMs}ms`);
      return { fetched: rawItems.length, saved: savedCount };
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const errorMessage = err?.message || 'Unknown network or parsing error';
      this.logger.warn(`Bundesagentur live sync skipped or failed (${errorMessage}). Utilizing local PostgreSQL cache.`);

      await this.prisma.jobSyncLog.create({
        data: {
          source: 'BUNDESAGENTUR',
          queryTerm,
          location,
          recordsFetched: 0,
          recordsSaved: 0,
          status: 'CACHED',
          errorMessage,
          durationMs,
        },
      });

      return { fetched: 0, saved: 0 };
    }
  }

  private categorizeJob(title: string, vocation?: string): string {
    const text = `${title} ${vocation || ''}`.toLowerCase();
    if (text.includes('pflege') || text.includes('kranken') || text.includes('gesundheit') || text.includes('medizin')) {
      return 'Healthcare / Nursing';
    }
    if (text.includes('informatik') || text.includes('software') || text.includes('it-') || text.includes('fachinformatiker')) {
      return 'IT & Software';
    }
    if (text.includes('mechatronik') || text.includes('kfz') || text.includes('fahrzeug') || text.includes('mechanik')) {
      return 'Engineering & Automotive';
    }
    if (text.includes('elektronik') || text.includes('elektro')) {
      return 'Electrical & Industrial';
    }
    if (text.includes('hotel') || text.includes('koch') || text.includes('gastronom') || text.includes('restaurant')) {
      return 'Hospitality & Gastronomy';
    }
    if (text.includes('spedition') || text.includes('logistik') || text.includes('lager')) {
      return 'Logistics & Supply Chain';
    }
    return 'Vocational Training';
  }

  private estimateRequiredGermanLevel(title: string, category: string): CefrLevel {
    if (category === 'Healthcare / Nursing') {
      return CefrLevel.B2; // German health authorities strictly require B2 for nursing accreditation
    }
    if (title.toLowerCase().includes('kaufmann') || title.toLowerCase().includes('verwaltung')) {
      return CefrLevel.B2;
    }
    return CefrLevel.B1; // Standard vocational threshold for technical and industrial apprenticeships
  }
}
