import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/*
 * Page links for listings: real links (crawlable, open in a new tab, work
 * without JavaScript), with an ellipsis for long ranges.
 *
 *   <Pagination page={6} pageCount={12} hrefFor={(p) => `/shop?page=${p}`} />
 *   → ‹ 1 … 5 6 7 … 12 ›     (near an end: ‹ 1 2 3 4 5 … 12 ›)
 */

/** Page numbers to show, with null for an ellipsis. Pure; unit-tested. */
export function pageRange(
  page: number,
  pageCount: number,
  siblings = 1,
): (number | null)[] {
  // first + last + current + siblings + 2 ellipses
  const slots = siblings * 2 + 5;
  if (pageCount <= slots) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const start = Math.max(2, page - siblings);
  const end = Math.min(pageCount - 1, page + siblings);
  const showLeft = start > 2;
  const showRight = end < pageCount - 1;

  if (!showLeft) {
    const count = slots - 2; // pages before the right ellipsis
    return [...Array.from({ length: count }, (_, i) => i + 1), null, pageCount];
  }
  if (!showRight) {
    const count = slots - 2;
    return [
      1,
      null,
      ...Array.from({ length: count }, (_, i) => pageCount - count + 1 + i),
    ];
  }
  return [
    1,
    null,
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    null,
    pageCount,
  ];
}

export interface PaginationProps {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  /** Accessible name; make it unique if a page has two (e.g. "Reviews pages"). */
  label?: string;
  className?: string;
}

const cell =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-small tabular-nums transition-colors duration-fast';

export function Pagination({
  page,
  pageCount,
  hrefFor,
  label = 'Pagination',
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;
  const range = pageRange(page, pageCount);

  const edge = (target: number, label: string, icon: typeof ChevronLeft) => {
    const disabled = target < 1 || target > pageCount;
    return disabled ? (
      <span
        aria-disabled="true"
        className={cn(cell, 'text-muted-fg opacity-50')}
      >
        <Icon icon={icon} size="sm" />
        <span className="sr-only">{label}</span>
      </span>
    ) : (
      <Link
        href={hrefFor(target)}
        rel={label === 'Previous page' ? 'prev' : 'next'}
        className={cn(cell, 'hover:bg-muted')}
      >
        <Icon icon={icon} size="sm" />
        <span className="sr-only">{label}</span>
      </Link>
    );
  };

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>{edge(page - 1, 'Previous page', ChevronLeft)}</li>
        {range.map((p, i) =>
          p === null ? (
            <li
              key={`gap-${i}`}
              aria-hidden="true"
              className={cn(cell, 'px-1 text-muted-fg')}
            >
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={cn(
                  cell,
                  p === page
                    ? 'bg-primary font-medium text-primary-fg'
                    : 'hover:bg-muted',
                )}
              >
                {p}
              </Link>
            </li>
          ),
        )}
        <li>{edge(page + 1, 'Next page', ChevronRight)}</li>
      </ul>
    </nav>
  );
}
