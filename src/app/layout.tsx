import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Navbar from '@/components/shared/Navbar/Navbar';
import { publicEnv } from '@/lib/env';
import SmoothScrolling from '@/providers/SmoothScrolling';
import StoreProvider from '@/providers/StoreProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import './globals.css';

// Both are variable fonts: one file per family covers every weight, so no
// weight list is needed. next/font self-hosts them and generates a metric-
// matched fallback (no layout shift when they swap in). Tokens map
// --font-heading → font-display and --font-body → font-sans (styles/tokens.css).
// Compare other pairings at /dev/fonts.
const heading = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz'], // optical size: finer details at large sizes
  variable: '--font-heading',
});

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Wool — Premium Wool Knitwear',
    template: '%s | Wool',
  },
  description:
    'Sweaters, cardigans, scarves and beanies made from soft, natural wool. Cash on Delivery across Bangladesh, shipping worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes sets data-theme on <html> before
    // React hydrates, which would otherwise be reported as a mismatch.
    <html
      lang="en"
      className={`${heading.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <StoreProvider>
            <SmoothScrolling>
              <Navbar />
              {children}
            </SmoothScrolling>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
