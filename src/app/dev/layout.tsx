import type { Metadata } from 'next';

// Internal preview pages (/dev/tokens, /dev/fonts, later /dev/ui).
// Never indexed by search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-page px-gutter py-section-sm">
      {children}
    </main>
  );
}
