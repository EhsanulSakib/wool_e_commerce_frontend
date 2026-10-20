import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

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
    <>
      {/* Dev pages sit outside the storefront shell: a minimal bar with
          page links and the theme toggle (for checking dark mode). */}
      <header className="sticky top-0 z-sticky border-b border-border bg-bg">
        <nav
          aria-label="Dev pages"
          className="mx-auto flex h-14 max-w-page items-center gap-5 px-gutter text-small"
        >
          <Link href="/" className="font-medium">
            ← Store
          </Link>
          {['tokens', 'fonts', 'ui', 'motion', 'error'].map((p) => (
            <Link
              key={p}
              href={`/dev/${p}`}
              className="text-muted-fg hover:text-fg"
            >
              /dev/{p}
            </Link>
          ))}
          <ThemeToggle className="ml-auto" />
        </nav>
      </header>
      <main id="content" className="mx-auto max-w-page px-gutter py-section-sm">
        {children}
      </main>
    </>
  );
}
