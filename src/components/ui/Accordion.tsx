'use client';

import { ChevronDown } from 'lucide-react';
import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/*
 * Accordion (WAI-ARIA pattern: a heading containing a button that controls
 * a region): product page details, FAQ.
 *
 *   <Accordion type="single" defaultValue={['care']}>
 *     <AccordionItem value="details" title="Details">…</AccordionItem>
 *     <AccordionItem value="care" title="Material & care">…</AccordionItem>
 *   </Accordion>
 *
 * - type="single": opening one closes the others; "multiple": independent.
 * - Height animates with the CSS grid-rows technique (0fr → 1fr): no JS
 *   measuring, works with any content, instant with reduced motion.
 * - Panels are plain divs, not role="region" (optional in the pattern):
 *   a long FAQ would otherwise add a landmark per question.
 * - Closed content is `inert`: not focusable, hidden from screen readers,
 *   but still in the HTML (good for SEO, and Ctrl+F can't reach it anyway).
 */

interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
  headingLevel: 2 | 3 | 4;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  children: ReactNode;
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  /** Heading level of the item titles, to fit the page outline. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

export function Accordion({
  children,
  type = 'single',
  defaultValue = [],
  value: valueProp,
  onValueChange,
  headingLevel = 3,
  className,
}: AccordionProps) {
  const [inner, setInner] = useState(defaultValue);
  const openValues = valueProp ?? inner;

  const toggle = (value: string) => {
    const isOpen = openValues.includes(value);
    const next =
      type === 'single'
        ? isOpen
          ? []
          : [value]
        : isOpen
          ? openValues.filter((v) => v !== value)
          : [...openValues, value];
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <AccordionContext value={{ openValues, toggle, headingLevel }}>
      <div
        className={cn(
          'divide-y divide-border border-y border-border',
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext>
  );
}

export function AccordionItem({
  value,
  title,
  children,
  className,
}: {
  value: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> must be used inside <Accordion>');
  const id = useId();
  const open = ctx.openValues.includes(value);
  const Heading = `h${ctx.headingLevel}` as const;

  return (
    <div className={className}>
      <Heading className="text-base">
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => ctx.toggle(value)}
          className="flex w-full items-center justify-between gap-4 rounded-sm py-4 text-left font-medium text-fg"
        >
          {title}
          <Icon
            icon={ChevronDown}
            className={cn(
              'text-muted-fg transition-transform duration-base ease-standard',
              open && 'rotate-180',
            )}
          />
        </button>
      </Heading>
      <div
        id={`${id}-panel`}
        inert={!open}
        className={cn(
          'grid transition-[grid-template-rows] duration-base ease-standard',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-small text-muted-fg">{children}</div>
        </div>
      </div>
    </div>
  );
}
