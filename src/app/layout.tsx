import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { announcementScript } from '@/components/layout/AnnouncementBar';
import { Toaster } from '@/components/ui/Toast';
import { publicEnv } from '@/lib/env';
import StoreProvider from '@/providers/StoreProvider';
import { MotionProvider } from '@/providers/motion-provider';
import { SmoothScrollProvider } from '@/providers/smooth-scroll-provider';
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

export const viewport: Viewport = {
  // Lets the page extend under the phone's notch/home indicator; fixed UI
  // (floating buttons) uses env(safe-area-inset-*) to stay clear of them.
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
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
      <head>
        {/* Runs before first paint: hides a dismissed announcement bar. */}
        <script dangerouslySetInnerHTML={{ __html: announcementScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (Grammarly, ColorZilla…)
          add attributes to <body> before React hydrates. Only affects this
          element's own attributes. */}
      <body suppressHydrationWarning>
        <ThemeProvider>
          <StoreProvider>
            <MotionProvider>
              <SmoothScrollProvider>
                {children}
                <Toaster />
              </SmoothScrollProvider>
            </MotionProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
