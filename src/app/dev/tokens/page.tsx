import type { Metadata } from 'next';
import Link from 'next/link';
import { contrastPairs, contrastRatio } from '@/lib/contrast';
import { cssEase, duration, ease, type EaseName } from '@/styles/motion';
import { loadTokens, resolveToken } from '@/styles/parseTokens';

/*
 * Temporary token preview (module 05). Every value comes from tokens.css:
 * semantic colors are shown in a light and a dark panel side by side
 * (a nested data-theme switches the variables for that panel only).
 * Contrast ratios are computed at build time from the same file the test uses.
 */

export const metadata: Metadata = { title: 'Design tokens' };

const tokens = loadTokens();

const neutrals = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const statusPrimitives = ['green', 'amber', 'red', 'blue'].map((hue) => ({
  hue,
  steps: Object.keys(tokens.root)
    .filter((k) => k.startsWith(`${hue}-`))
    .map((k) => k.slice(hue.length + 1)),
}));

const semantic = [
  ['bg', 'fg'],
  ['surface', 'fg'],
  ['surface-raised', 'fg'],
  ['muted', 'muted-fg'],
  ['primary', 'primary-fg'],
  ['secondary', 'secondary-fg'],
  ['success-soft', 'success-fg'],
  ['warning-soft', 'warning-fg'],
  ['danger-soft', 'danger-fg'],
  ['info-soft', 'info-fg'],
] as const;

const lineColors = [
  'border',
  'border-strong',
  'ring',
  'success',
  'warning',
  'danger',
  'info',
];

const typeScale = [
  ['display', 'font-display text-display', 'Soft wool, slow made'],
  ['h1', 'font-display text-h1', 'Winter knitwear'],
  ['h2', 'font-display text-h2', 'New cardigans'],
  ['h3', 'font-display text-h3', 'Merino crew neck'],
  ['h4', 'font-display text-h4', 'Material & care'],
  ['h5', 'font-display text-h5', 'Shipping & returns'],
  ['h6', 'font-display text-h6', 'Size guide'],
  [
    'body-lg',
    'text-body-lg',
    'Knitted from 100% merino wool. Warm, breathable and soft enough to wear next to the skin.',
  ],
  [
    'body',
    'text-body',
    'Hand wash cold and dry flat. Delivery in 2–3 days inside Dhaka; Cash on Delivery available.',
  ],
  ['small', 'text-small', 'Free delivery on orders over ৳3,000'],
  ['caption', 'text-caption uppercase', 'New · Low stock'],
] as const;

const spacing = [1, 2, 3, 4, 6, 8, 12, 16, 24];
// Full class names so Tailwind can find them (it can't read `rounded-${r}`).
const radii = [
  'rounded-xs',
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-2xl',
  'rounded-full',
];
const shadows = [
  'shadow-xs',
  'shadow-sm',
  'shadow-md',
  'shadow-lg',
  'shadow-xl',
];
const durationClasses = [
  ['duration-fast', duration.fast],
  ['duration-base', duration.base],
  ['duration-slow', duration.slow],
  ['duration-slower', duration.slower],
] as const;
const layers = [
  'base',
  'raised',
  'dropdown',
  'sticky',
  'overlay',
  'modal',
  'toast',
  'floating',
];
const breakpoints = [
  ['sm', '640px', 'large phones, landscape'],
  ['md', '768px', 'tablets'],
  ['lg', '1024px', 'small laptops: desktop navigation starts here'],
  ['xl', '1280px', 'desktops (max-w-page)'],
  ['2xl', '1536px', 'large screens'],
] as const;

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border py-12">
      <h2 id={id} className="mb-6 text-h3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SemanticPanel({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div
      data-theme={theme}
      className="rounded-xl border border-border bg-bg p-4 text-fg"
    >
      <p className="mb-4 text-small font-medium capitalize">{theme}</p>
      <ul className="grid gap-2">
        {semantic.map(([bg, fg]) => (
          <li
            key={bg}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-small"
            style={{ background: `var(--${bg})`, color: `var(--${fg})` }}
          >
            <span>
              {fg} on {bg}
            </span>
            <code className="text-caption">
              {contrastRatio(
                resolveToken(tokens[theme], fg),
                resolveToken(tokens[theme], bg),
              ).toFixed(2)}
            </code>
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap gap-3">
        {lineColors.map((c) => (
          <li key={c} className="flex items-center gap-2 text-caption">
            <span
              className="size-4 rounded-full"
              style={{ background: `var(--${c})` }}
            />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TokensPage() {
  return (
    <>
      <header className="pb-12">
        <p className="text-caption text-muted-fg uppercase">Module 05</p>
        <h1 className="text-h1">Design tokens</h1>
        <p className="mt-4 max-w-prose text-body-lg text-muted-fg">
          Every value on this page comes from <code>src/styles/tokens.css</code>
          . Toggle the theme in the navbar: semantic colors swap, primitives
          stay the same. See{' '}
          <Link className="underline underline-offset-4" href="/dev/fonts">
            /dev/fonts
          </Link>{' '}
          to compare font pairings.
        </p>
      </header>

      <Section id="primitives" title="Primitive colors">
        <p className="mb-4 text-small text-muted-fg">
          Raw palette. Components never use these directly.
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
          {['ink', 'paper', ...neutrals.map((n) => `neutral-${n}`)].map(
            (name) => (
              <figure key={name} className="text-caption">
                <div
                  className="h-14 rounded-md border border-border"
                  style={{ background: `var(--${name})` }}
                />
                <figcaption className="mt-1">
                  {name}
                  <br />
                  <span className="text-muted-fg">{tokens.root[name]}</span>
                </figcaption>
              </figure>
            ),
          )}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {statusPrimitives.map(({ hue, steps }) => (
            <div key={hue} className="flex gap-2">
              {steps.map((step) => (
                <div
                  key={step}
                  title={`--${hue}-${step}: ${tokens.root[`${hue}-${step}`]}`}
                  className="h-10 flex-1 rounded-sm border border-border"
                  style={{ background: `var(--${hue}-${step})` }}
                />
              ))}
              <span className="w-12 text-caption">{hue}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="semantic" title="Semantic colors">
        <p className="mb-4 text-small text-muted-fg">
          Number = WCAG contrast ratio (AA: 4.5 for text). All pairs are also
          checked by <code>tokens.test.ts</code>.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <SemanticPanel theme="light" />
          <SemanticPanel theme="dark" />
        </div>
      </Section>

      <Section id="contrast" title="Contrast table">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-small">
            <thead className="text-muted-fg">
              <tr>
                <th className="py-2 pr-4 font-medium">Pair</th>
                <th className="py-2 pr-4 font-medium">Light</th>
                <th className="py-2 pr-4 font-medium">Dark</th>
                <th className="py-2 font-medium">Minimum</th>
              </tr>
            </thead>
            <tbody>
              {contrastPairs.map(({ fg, bg, min }) => (
                <tr key={`${fg}/${bg}`} className="border-t border-border">
                  <td className="py-2 pr-4">
                    {fg} / {bg}
                  </td>
                  {(['light', 'dark'] as const).map((t) => (
                    <td key={t} className="py-2 pr-4 tabular-nums">
                      {contrastRatio(
                        resolveToken(tokens[t], fg),
                        resolveToken(tokens[t], bg),
                      ).toFixed(2)}
                    </td>
                  ))}
                  <td className="py-2 tabular-nums">{min}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section id="type" title="Typography">
        <p className="mb-6 text-small text-muted-fg">
          Fluid sizes: resize the window from 360px to 1440px and the text
          scales smoothly, no jumps.
        </p>
        <div className="grid gap-6">
          {typeScale.map(([name, className, sample]) => (
            <div
              key={name}
              className="grid gap-1 md:grid-cols-[8rem_1fr] md:items-baseline"
            >
              <code className="text-caption text-muted-fg">text-{name}</code>
              <p className={className}>{sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="spacing" title="Spacing">
        <div className="grid gap-2">
          {spacing.map((n) => (
            <div key={n} className="flex items-center gap-4 text-caption">
              <code className="w-20 text-muted-fg">
                {n} = {n * 4}px
              </code>
              <div
                className="h-3 rounded-xs bg-primary"
                style={{ width: `calc(var(--spacing) * ${n})` }}
              />
            </div>
          ))}
        </div>
        <dl className="mt-6 grid gap-2 text-small sm:grid-cols-3">
          {[
            ['px-gutter', 'gutter', 'page side padding, 16 → 40px'],
            ['py-section', 'section', 'between page sections, 64 → 128px'],
            ['py-section-sm', 'section-sm', 'compact sections, 40 → 72px'],
          ].map(([cls, token, desc]) => (
            <div key={cls} className="rounded-lg bg-surface p-4">
              <dt>
                <code>{cls}</code>
              </dt>
              <dd className="text-muted-fg">{desc}</dd>
              <dd
                className="mt-2 h-2 rounded-xs bg-primary"
                style={{ width: `var(--${token})` }}
              />
            </div>
          ))}
        </dl>
        <p className="mt-4 text-small text-muted-fg">
          Containers: <code>max-w-narrow</code> 768px · <code>max-w-page</code>{' '}
          1280px · <code>max-w-wide</code> 1920px
        </p>
      </Section>

      <Section id="radius" title="Radius">
        <div className="flex flex-wrap gap-4">
          {radii.map((r) => (
            <figure key={r} className="text-center text-caption">
              <div
                className={`size-20 border border-border-strong bg-muted ${r}`}
              />
              <figcaption className="mt-1">{r}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="shadows" title="Shadows">
        <div className="grid grid-cols-2 gap-6 rounded-xl bg-surface p-6 sm:grid-cols-5">
          {shadows.map((s) => (
            <div
              key={s}
              className={`flex h-24 items-center justify-center rounded-lg bg-surface-raised text-caption ${s}`}
            >
              {s}
            </div>
          ))}
        </div>
      </Section>

      <Section id="layers" title="Z-index">
        <ol className="grid gap-1 text-small">
          {layers.map((l) => (
            <li key={l} className="flex gap-4">
              <code className="w-28">z-{l}</code>
              <span className="text-muted-fg">{tokens.root[`z-${l}`]}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="motion" title="Motion">
        <p className="mb-4 text-small text-muted-fg">
          Hover a row. With reduced motion turned on, the dots jump instantly.
        </p>
        <div className="grid gap-3">
          {(Object.keys(ease) as EaseName[]).map((name) => (
            <div
              key={name}
              className="group flex items-center gap-4 rounded-lg bg-surface p-3"
            >
              <code className="w-44 shrink-0 text-caption">
                {name} · {duration.slower}ms
              </code>
              <div className="@container relative h-4 flex-1">
                <span
                  className="absolute top-0 left-0 size-4 rounded-full bg-primary transition-transform duration-slower group-hover:translate-x-[calc(100cqw-1rem)]"
                  style={{ transitionTimingFunction: cssEase(name) }}
                />
              </div>
            </div>
          ))}
        </div>
        <ul className="mt-4 flex flex-wrap gap-3 text-small">
          {durationClasses.map(([cls, ms]) => (
            <li
              key={cls}
              className={`rounded-md border border-border px-3 py-2 transition-colors ease-standard hover:bg-primary hover:text-primary-fg ${cls}`}
            >
              {cls} · {ms}ms
            </li>
          ))}
        </ul>
      </Section>

      <Section id="details" title="Focus, selection, breakpoints">
        <p className="mb-4 text-body">
          Press Tab to move through these links:{' '}
          <a href="#primitives" className="underline underline-offset-4">
            Primitives
          </a>
          ,{' '}
          <a href="#type" className="underline underline-offset-4">
            Typography
          </a>
          ,{' '}
          <a href="#motion" className="underline underline-offset-4">
            Motion
          </a>
          . Select this sentence to see the selection color.
        </p>
        <ul className="grid gap-1 text-small">
          {breakpoints.map(([name, px, use]) => (
            <li key={name} className="flex gap-4">
              <code className="w-12">{name}:</code>
              <span className="w-16 tabular-nums">{px}</span>
              <span className="text-muted-fg">{use}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
