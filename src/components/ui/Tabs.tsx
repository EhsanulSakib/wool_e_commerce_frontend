'use client';

import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { transitions } from '@/components/motion/presets';
import { cn } from '@/lib/cn';

/*
 * Tabs (WAI-ARIA tabs pattern, automatic activation): product details /
 * material & care / reviews, account sections.
 *
 *   <Tabs defaultValue="details" label="Product information">
 *     <TabList>
 *       <Tab value="details">Details</Tab>
 *       <Tab value="care">Material & care</Tab>
 *     </TabList>
 *     <TabPanel value="details">…</TabPanel>
 *     <TabPanel value="care">…</TabPanel>
 *   </Tabs>
 *
 * Keyboard: Tab enters the list on the selected tab (roving tabindex),
 * ←/→ select the previous/next tab (wrapping), Home/End the first/last,
 * Tab again moves into the panel. The underline slides between tabs
 * (Motion layoutId: a transform animation).
 */

interface TabsContextValue {
  baseId: string;
  value: string;
  select: (value: string) => void;
  label?: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab components must be used inside <Tabs>');
  return ctx;
}

const slug = (v: string) => v.replace(/[^\w-]/g, '_');

export interface TabsProps {
  children: ReactNode;
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the tab list. */
  label?: string;
  className?: string;
}

export function Tabs({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  className,
}: TabsProps) {
  const baseId = useId();
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;

  const select = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext value={{ baseId, value, select, label }}>
      <div className={className}>{children}</div>
    </TabsContext>
  );
}

export function TabList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { label } = useTabs();
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [
      ...(ref.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])',
      ) ?? []),
    ];
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    const targets: Record<string, number> = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    tabs[target].focus();
    tabs[target].click(); // automatic activation: focus selects
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'flex [scrollbar-width:none] gap-6 overflow-x-auto border-b border-border',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Tab({
  value,
  children,
  disabled = false,
  className,
}: {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const { baseId, value: selectedValue, select } = useTabs();
  const reduced = useReducedMotion() ?? false;
  const selected = value === selectedValue;

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${slug(value)}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${slug(value)}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => select(value)}
      className={cn(
        'relative -mb-px shrink-0 rounded-sm pt-2 pb-3 text-small font-medium whitespace-nowrap transition-colors duration-fast disabled:opacity-50',
        selected ? 'text-fg' : 'text-muted-fg hover:text-fg',
        className,
      )}
    >
      {children}
      {selected && (
        <m.span
          // Shared between the tabs of one list: Motion slides it across.
          layoutId={`${baseId}-indicator`}
          transition={reduced ? { duration: 0 } : transitions.base}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 bg-fg"
        />
      )}
    </button>
  );
}

export function TabPanel({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const { baseId, value: selectedValue } = useTabs();
  const selected = value === selectedValue;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${slug(value)}`}
      aria-labelledby={`${baseId}-tab-${slug(value)}`}
      // Focusable so keyboard users can reach panels without links/buttons.
      tabIndex={0}
      hidden={!selected}
      className={cn('rounded-sm pt-5', className)}
    >
      {children}
    </div>
  );
}
