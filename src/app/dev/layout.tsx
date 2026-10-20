import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Internal preview pages (/dev/tokens, /dev/fonts, /dev/ui).
// Always available in `next dev`. In production builds they 404 unless
// ENABLE_DEV_PAGES=true is set at build time (these pages are static, so the
// value is read once, during `next build`). Never indexed either way.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const devPagesEnabled =
  process.env.NODE_ENV !== 'production' ||
  process.env.ENABLE_DEV_PAGES === 'true';

export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (!devPagesEnabled) notFound();

  return (
    <main className="mx-auto max-w-page px-gutter py-section-sm">
      {children}
    </main>
  );
}
