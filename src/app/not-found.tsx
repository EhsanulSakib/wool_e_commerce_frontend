import { Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShopShell } from '@/components/layout/ShopShell';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { Container } from '@/components/ui/layout';
import { siteConfig } from '@/lib/site-config';

/*
 * 404 for every unknown URL (status 404, noindex). The root not-found
 * renders outside the (shop) group, so it wraps itself in the storefront
 * shell: visitors keep the navbar, a search box and the main categories.
 * The "404" floats gently (CSS, off with reduced motion).
 */

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <ShopShell>
      <Container size="narrow" className="py-section text-center">
        <p
          aria-hidden="true"
          className="animate-[float_6s_ease-in-out_infinite] font-display text-[clamp(6rem,4rem+10vw,12rem)] leading-none text-border-strong select-none"
        >
          404
        </p>
        <h1 className="mt-4 text-h2">This page has unravelled</h1>
        <p className="mx-auto mt-4 max-w-prose text-body text-muted-fg">
          The link may be old, or the product is no longer available. Try a
          search, or pick up the thread from one of these.
        </p>

        <form
          role="search"
          action="/search"
          method="get"
          className="mx-auto mt-8 flex max-w-md gap-2"
        >
          <Input
            type="search"
            name="q"
            aria-label="Search products"
            placeholder="Search the shop"
            prefix={<Icon icon={Search} size="sm" />}
            boxClassName="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <Reveal as="div" preset="fadeUp" delay={0.1}>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {[
              ...siteConfig.categories,
              { label: 'New In', href: '/collections/new-in' },
            ].map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  prefetch={false}
                  className="inline-flex rounded-full border border-border px-4 py-2 text-small transition-colors duration-fast hover:border-fg"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/" variant="link" className="mt-8">
            Back to the home page
          </Button>
        </Reveal>
      </Container>
    </ShopShell>
  );
}
