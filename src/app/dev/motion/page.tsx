import type { Metadata } from 'next';
import Link from 'next/link';
import { CountUp } from '@/components/motion/CountUp';
import { Magnetic } from '@/components/motion/Magnetic';
import { Marquee } from '@/components/motion/Marquee';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { TextReveal } from '@/components/motion/TextReveal';
import type { PresetName } from '@/components/motion/presets';
import { Button } from '@/components/ui/Button';
import { LenisControls } from './LenisControls';

/*
 * Motion playground (module 07). Scroll slowly: every reveal runs once.
 * Try it with DevTools: 4× CPU throttling, touch emulation, and
 * "prefers-reduced-motion: reduce" (Rendering panel).
 */

export const metadata: Metadata = { title: 'Motion' };

const presetNames: PresetName[] = [
  'fadeUp',
  'fadeIn',
  'scaleIn',
  'slideLeft',
  'slideRight',
];

// A knit-like pattern from tokens, standing in for product photos.
const knit =
  'bg-muted bg-[repeating-linear-gradient(45deg,var(--border)_0_2px,transparent_2px_14px),repeating-linear-gradient(-45deg,var(--border)_0_2px,transparent_2px_14px)]';

function Block({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-t border-border py-section-sm"
    >
      <h2 id={`${id}-title`} className="text-h3">
        {title}
      </h2>
      <p className="mt-2 mb-8 max-w-prose text-small text-muted-fg">{note}</p>
      {children}
    </section>
  );
}

export default function MotionPage() {
  return (
    <>
      <header className="pb-12">
        <p className="text-caption text-muted-fg uppercase">Module 07</p>
        <h1 className="text-h1">Motion</h1>
        <p className="mt-4 mb-8 max-w-prose text-body-lg text-muted-fg">
          Scroll down slowly. Reveals run once; scroll back up and they stay.
          Compare with touch emulation (native scrolling) and with reduced
          motion (nothing moves, everything visible).
        </p>
        <LenisControls />
      </header>

      <Block
        id="reveal"
        title="Reveal"
        note="Motion whileInView, once. The presets share the hidden/visible states and the reveal transition (700ms, out-expo)."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {presetNames.map((preset, i) => (
            <Reveal key={preset} preset={preset} delay={i * 0.05}>
              <div
                className={`grid aspect-4/5 place-items-end rounded-lg p-4 ${knit}`}
              >
                <code className="rounded-sm bg-bg px-2 py-1 text-caption">
                  {preset}
                </code>
              </div>
            </Reveal>
          ))}
        </div>
      </Block>

      <Block
        id="stagger"
        title="Stagger"
        note="A container reveals its children 80ms apart (delayChildren: stagger(0.08))."
      >
        <Stagger as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            'Sweaters',
            'Cardigans',
            'Scarves',
            'Beanies',
            'Gloves',
            'Socks',
            'Ponchos',
            'Gift cards',
          ].map((name) => (
            <StaggerItem key={name} as="li">
              <div className="rounded-lg border border-border bg-surface p-6 text-body">
                {name}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Block>

      <Block
        id="text"
        title="TextReveal"
        note="GSAP SplitText: lines slide up from behind a mask. Re-splits when fonts load or the width changes; screen readers get the whole sentence."
      >
        <TextReveal as="p" className="max-w-4xl font-display text-h2">
          Knitted slowly from soft merino wool, made to be worn for many
          winters.
        </TextReveal>
        <TextReveal
          as="p"
          by="words"
          delay={0.2}
          className="mt-6 max-w-prose text-body-lg text-muted-fg"
        >
          Word by word works for short phrases and labels.
        </TextReveal>
      </Block>

      <Block
        id="parallax"
        title="Parallax"
        note="GSAP ScrollTrigger scrub on transform. Desktop (≥ 1024px) only; static on phones and with reduced motion."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Parallax className="aspect-4/5 rounded-xl">
            <div className={`size-full ${knit}`} />
          </Parallax>
          <Parallax speed={0.2} className="aspect-4/5 rounded-xl">
            <div className="grid size-full place-items-center bg-primary text-h3 text-primary-fg">
              speed 0.2
            </div>
          </Parallax>
        </div>
      </Block>

      <Block
        id="magnetic"
        title="Magnetic"
        note="Leans toward the cursor; springs back on leave. Mouse/trackpad only (nothing happens with touch)."
      >
        <div className="flex flex-wrap items-center gap-8">
          <Magnetic>
            <Button size="lg">Shop the collection</Button>
          </Magnetic>
          <Magnetic strength={0.5}>
            <Button variant="outline" size="lg">
              Stronger (0.5)
            </Button>
          </Magnetic>
        </div>
      </Block>

      <Block
        id="marquee"
        title="Marquee"
        note="Pure CSS. Pauses on hover and while a link inside has focus; static with reduced motion. The duplicate copy is hidden from screen readers and keyboard."
      >
        <div className="grid gap-4">
          <Marquee className="border-y border-border py-3 text-small uppercase">
            <span>Free delivery over ৳3,000</span>
            <span>Cash on Delivery across Bangladesh</span>
            <span>
              New winter collection —{' '}
              <Link href="/dev/ui" className="underline underline-offset-4">
                see components
              </Link>
            </span>
            <span>Worldwide shipping</span>
          </Marquee>
          <Marquee
            reverse
            speed={50}
            gap="4rem"
            className="font-display text-h3"
          >
            <span>Merino</span>
            <span>Lambswool</span>
            <span>Alpaca</span>
            <span>Cashmere blend</span>
          </Marquee>
        </div>
      </Block>

      <Block
        id="countup"
        title="CountUp"
        note="Counts once when 60% visible. View source: the final numbers are in the HTML."
      >
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: 12500, suffix: '+', label: 'Orders delivered' },
            { value: 64, label: 'Districts served' },
            { value: 4.8, label: 'Average rating' },
            { value: 3000, prefix: '৳', label: 'Free delivery from' },
          ].map((stat) => (
            <div key={stat.label} className="grid gap-1">
              <dt className="order-2 text-small text-muted-fg">{stat.label}</dt>
              <dd className="order-1 font-display text-h2">
                <CountUp
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
            </div>
          ))}
        </dl>
      </Block>

      <section className="border-t border-border py-section-sm">
        <p className="text-body text-muted-fg">
          Navigate away and back to check that nothing duplicates:{' '}
          <Link href="/dev/ui" className="underline underline-offset-4">
            /dev/ui
          </Link>
          .
        </p>
      </section>
    </>
  );
}
