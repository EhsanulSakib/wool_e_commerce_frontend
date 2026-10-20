import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/*
 * "Home › Sweaters › Merino crew neck". The last item is the current page:
 * plain text with aria-current="page". (Module 24 adds the BreadcrumbList
 * JSON-LD from the same data.)
 *
 *   <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sweaters', href: '/collections/sweaters' }, { label: 'Merino crew neck' }]} />
 */

export interface Crumb {
  label: string;
  /** Omit for the current (last) page. */
  href?: string;
}

export function Breadcrumbs({
  items,
  label = 'Breadcrumb',
  className,
}: {
  items: Crumb[];
  /** Accessible name of the nav landmark. */
  label?: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-small text-muted-fg">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={`${item.label}-${i}`}
              className="flex items-center gap-1.5"
            >
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded-sm transition-colors duration-fast hover:text-fg hover:underline hover:underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={cn(last && 'font-medium text-fg')}
                >
                  {item.label}
                </span>
              )}
              {!last && <Icon icon={ChevronRight} size="xs" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
