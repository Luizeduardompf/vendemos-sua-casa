import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  // Tailwind + shadcn styles
import { ThemeProvider } from '@/components/providers/theme-provider';  // Client wrapper
import { cn } from '@/lib/utils';  // shadcn cn helper
import { SpeedInsightsComponent } from '@/components/insights/speed-insights';  // Novo: Speed Insights
import { ConditionalHeader } from '@/components/conditional-header';
import { ConditionalFooter } from '@/components/conditional-footer';
import { ThemeEnforcer } from '@/components/theme-enforcer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vendemos Sua Casa - Portal de Angariação de Propriedades',
  description: 'Portal focado na angariação de propriedades. Ponte entre proprietários e agentes imobiliários. Sistema completo de agendamentos, propostas, CPCV e formalização.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: { url: '/favicon.svg', type: 'image/svg+xml' }
  }
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
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeEnforcer />
          <div className="min-h-screen flex flex-col">
            <ConditionalHeader />
            <main className="flex-1">
              {children}
            </main>
            <ConditionalFooter />
          </div>
          <SpeedInsightsComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}
