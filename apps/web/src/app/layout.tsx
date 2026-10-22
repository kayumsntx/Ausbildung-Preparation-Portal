import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export const metadata: Metadata = {
  title: 'Ausbildung Preparation Portal — Your Gateway to Vocational Training in Germany',
  description:
    'Comprehensive preparation platform for vocational training (Ausbildung) in Germany. Learn German A1–B2, discover live job openings, generate DIN 5008 CVs, and practice speaking with peers.',
  keywords: [
    'Ausbildung',
    'Germany vocational training',
    'Learn German online',
    'Ausbildung from Bangladesh',
    'Jobsuche API Germany',
    'German DIN 5008 CV',
    'German speaking practice',
    'A1 A2 B1 B2 German',
  ],
  authors: [{ name: 'Ausbildung Preparation Team' }],
  openGraph: {
    title: 'Ausbildung Preparation Portal — Study & Work in Germany',
    description: 'Learn German, find verified Ausbildung jobs, and prepare your application for Germany.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ausbildung Preparation Portal',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning key="root-html">
      <body className="antialiased flex flex-col min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
