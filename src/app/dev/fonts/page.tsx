import type { Metadata } from 'next';
import {
  DM_Sans,
  Fraunces,
  Inter,
  Manrope,
  Cormorant,
  Playfair_Display,
} from 'next/font/google';

/*
 * Temporary page for choosing the font pair (module 05). The candidates are
 * loaded only here (preload: false), so they never affect other pages.
 * To switch the site font, change the two imports in app/layout.tsx.
 */

export const metadata: Metadata = { title: 'Font pairings' };

// next/font needs a literal options object in every call (no shared variable).
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  axes: ['opsz'],
});
const inter = Inter({ subsets: ['latin'], display: 'swap', preload: false });
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});
const dmSans = DM_Sans({ subsets: ['latin'], display: 'swap', preload: false });
const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

const pairs = [
  {
    name: 'Fraunces + Inter',
    note: 'Current choice. Warm, soft serif with optical sizing; the most "hand-made wool" feel. Inter is the most legible body text at small sizes.',
    heading: fraunces.className,
    body: inter.className,
  },
  {
    name: 'Playfair Display + DM Sans',
    note: 'Classic fashion-magazine contrast. Very elegant at display sizes, a bit cold for body copy; DM Sans is rounder and friendlier than Inter.',
    heading: playfair.className,
    body: dmSans.className,
  },
  {
    name: 'Cormorant + Manrope',
    note: 'Most luxurious and delicate. Thin strokes need large sizes (weak below ~24px); Manrope is geometric and modern.',
    heading: cormorant.className,
    body: manrope.className,
  },
];

export default function FontsPage() {
  return (
    <>
      <header className="pb-12">
        <p className="text-caption text-muted-fg uppercase">Module 05</p>
        <h1 className="text-h1">Font pairings</h1>
        <p className="mt-4 max-w-prose text-body-lg text-muted-fg">
          The same content in each candidate pair, using the real type scale.
        </p>
      </header>

      <div className="grid gap-8">
        {pairs.map((pair) => (
          <section
            key={pair.name}
            aria-label={pair.name}
            className="rounded-2xl border border-border p-6 md:p-10"
          >
            <p className="mb-6 text-caption text-muted-fg uppercase">
              {pair.name}
            </p>
            <div className={pair.heading}>
              <p className="text-display font-normal">Slow made wool</p>
              <p className="mt-4 text-h2">The winter cardigan edit</p>
              <p className="mt-2 text-h4 italic">Merino crew neck sweater</p>
            </div>
            <div className={`${pair.body} mt-6 max-w-prose`}>
              <p className="text-body-lg">
                Knitted from 100% merino wool in Bangladesh. Warm, breathable
                and soft enough to wear next to the skin.
              </p>
              <p className="mt-3 text-body text-muted-fg">
                Hand wash cold and dry flat. Delivery in 2–3 days inside Dhaka,
                Cash on Delivery available. ৳4,250 · $39.99
              </p>
              <p className="mt-3 text-small font-medium">
                Charcoal / M — Only 3 left
              </p>
              <p className="mt-6 border-t border-border pt-4 text-small text-muted-fg">
                {pair.note}
              </p>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
