'use client';

import Link from 'next/link';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import type { NavLink } from '@/lib/site-config';

/*
 * Footer link columns: plain columns from md up, accordions on phones (so
 * the footer isn't a wall of links). Both are rendered and CSS shows one;
 * the hidden copy is display:none, so screen readers meet the links once.
 */

export interface FooterColumn {
  title: string;
  links: readonly NavLink[];
}

function LinkList({ links }: { links: readonly NavLink[] }) {
  return (
    <ul className="grid gap-2.5">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            prefetch={false}
            className="rounded-sm text-small text-muted-fg transition-colors duration-fast hover:text-fg"
          >
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FooterLinks({ columns }: { columns: FooterColumn[] }) {
  return (
    <>
      <div className="hidden gap-8 md:grid md:grid-cols-3">
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="mb-4 font-sans text-caption font-medium text-fg uppercase">
              {c.title}
            </h2>
            <LinkList links={c.links} />
          </nav>
        ))}
      </div>
      <Accordion type="multiple" headingLevel={2} className="md:hidden">
        {columns.map((c) => (
          <AccordionItem key={c.title} value={c.title} title={c.title}>
            <nav aria-label={c.title}>
              <LinkList links={c.links} />
            </nav>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
