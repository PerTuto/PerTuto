import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/use-auth';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';

// Zero Layout Shift Fonts imported via Next.js
const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: {
    default: 'PerTuto — Expert Tutoring in Dubai',
    template: '%s | PerTuto',
  },
  description: 'Personalized tutoring for students and professionals in Dubai. IB, IGCSE, A-Level, CBSE + AI, Data Science & more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${fontBody.variable} ${fontHeadline.variable}`} style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
