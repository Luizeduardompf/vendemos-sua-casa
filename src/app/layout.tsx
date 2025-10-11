import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';  // Tailwind + shadcn styles
import { ThemeProvider } from '@/components/providers/theme-provider';  // Client wrapper
import { cn } from '@/lib/utils';  // shadcn cn helper
import { SpeedInsightsComponent } from '@/components/insights/speed-insights';  // Novo: Speed Insights

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NOVO_PROJETO',
  description: 'Full-stack app with Next.js, Supabase, and shadcn',
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
          {children}
          <SpeedInsightsComponent />
        </ThemeProvider>
      </body>
    </html>
  );
}
