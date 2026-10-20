'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/layout';
import { Drawer } from '@/components/ui/Drawer';
import { Icon } from '@/components/ui/Icon';
import { Input } from '@/components/ui/Input';
import { siteConfig } from '@/lib/site-config';

/*
 * Search overlay shell: slides down from the top, focus goes straight to the
 * input, Escape closes. Submitting goes to /search?q= (a real GET form, so it
 * works without JavaScript). Instant results arrive in module 22.
 */
export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="top"
      title="Search the shop"
      hideTitle
      initialFocus={inputRef}
    >
      <Container size="narrow" className="px-0 pb-4">
        <form
          role="search"
          action="/search"
          method="get"
          className="flex gap-3"
        >
          <Input
            ref={inputRef}
            type="search"
            name="q"
            size="lg"
            aria-label="Search products"
            placeholder="Search sweaters, scarves, colors…"
            enterKeyHint="search"
            autoComplete="off"
            prefix={<Icon icon={Search} />}
            boxClassName="flex-1"
          />
          <Button type="submit" size="lg" className="hidden sm:inline-flex">
            Search
          </Button>
        </form>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <section aria-labelledby="search-popular">
            <h3
              id="search-popular"
              className="mb-3 font-sans text-caption text-muted-fg uppercase"
            >
              Popular
            </h3>
            <ul className="flex flex-wrap gap-2">
              {siteConfig.categories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    prefetch={false}
                    onClick={onClose}
                    className="inline-flex rounded-full border border-border px-4 py-2 text-small transition-colors duration-fast hover:border-fg"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="search-recent">
            <h3
              id="search-recent"
              className="mb-3 font-sans text-caption text-muted-fg uppercase"
            >
              Recent searches
            </h3>
            <p className="text-small text-muted-fg">
              Your recent searches will show up here.
            </p>
          </section>
        </div>
      </Container>
    </Drawer>
  );
}
