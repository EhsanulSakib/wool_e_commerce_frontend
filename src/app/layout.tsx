import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/shared/Navbar/Navbar';
import { publicEnv } from '@/lib/env';
import SmoothScrolling from '@/providers/SmoothScrolling';
import StoreProvider from '@/providers/StoreProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import './globals.css';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
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
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
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
