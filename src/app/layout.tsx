import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  // Tailwind + shadcn styles
import { ThemeProvider } from '@/components/providers/theme-provider';  // Client wrapper
import { cn } from '@/lib/utils';  // shadcn cn helper
import { SpeedInsightsComponent } from '@/components/insights/speed-insights';  // Novo: Speed Insights
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VENDEMOSSUACASA.PT - Portal de Angariação de Propriedades',
  description: 'Portal focado na angariação de propriedades. Ponte entre proprietários e agentes imobiliários. Sistema completo de agendamentos, propostas, CPCV e formalização.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <SpeedInsightsComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}
