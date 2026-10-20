'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { Tooltip } from './Tooltip';

/*
 * Color swatches.
 *
 *   <Swatch color="#36454F" label="Charcoal" />              display only (product card)
 *   <SwatchGroup label="Color" options={colors} value={…} onValueChange={…} />
 *
 * SwatchGroup is a native radio group: arrow keys move between colors, the
 * selected one gets a ring, sold-out colors are crossed out and announced
 * ("Cream, sold out") but stay selectable so shoppers can still see that
 * color's photos. Each swatch shows its name in a tooltip.
 */

const sizes = { sm: 'size-5', md: 'size-8', lg: 'size-10' } as const;

export interface SwatchProps {
  /** CSS color of the yarn: hex from the AttributeValue. */
  color: string;
  label: string;
  size?: keyof typeof sizes;
  soldOut?: boolean;
  className?: string;
}

/** Display-only swatch with an accessible name. */
export function Swatch({
  color,
  label,
  size = 'sm',
  soldOut = false,
  className,
}: SwatchProps) {
  return (
    <span
      role="img"
      aria-label={soldOut ? `${label}, sold out` : label}
      className={cn('relative inline-block shrink-0', sizes[size], className)}
    >
      <SwatchDot color={color} soldOut={soldOut} />
    </span>
  );
}

function SwatchDot({ color, soldOut }: { color: string; soldOut: boolean }) {
  return (
    <>
      <span
        aria-hidden="true"
        // A thin inner border keeps white/cream visible on a white page and
        // black visible in dark mode.
        className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_var(--border-strong)]"
        style={{ backgroundColor: color }}
      />
      {soldOut && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),var(--fg)_calc(50%-1px),var(--fg)_calc(50%+1px),transparent_calc(50%+1px))] opacity-70"
        />
      )}
    </>
  );
}

export interface SwatchOption {
  value: string;
  label: string;
  color: string;
  soldOut?: boolean;
}

export interface SwatchGroupProps {
  label: string;
  options: SwatchOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'md' | 'lg';
  className?: string;
}

export function SwatchGroup({
  label,
  options,
  name: nameProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'md',
  className,
}: SwatchGroupProps) {
  const id = useId();
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const selected = options.find((o) => o.value === value);

  return (
    <fieldset className={cn('grid gap-3', className)}>
      <legend className="mb-3 text-small text-muted-fg">
        {label}:{' '}
        <span className="font-medium text-fg">
          {selected ? selected.label : 'choose one'}
          {selected?.soldOut && ' (sold out)'}
        </span>
      </legend>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <Tooltip
            key={o.value}
            content={o.soldOut ? `${o.label} · sold out` : o.label}
          >
            <label className="relative cursor-pointer rounded-full p-1">
              <input
                type="radio"
                name={nameProp ?? id}
                value={o.value}
                checked={value === o.value}
                onChange={() => {
                  if (valueProp === undefined) setInner(o.value);
                  onValueChange?.(o.value);
                }}
                aria-label={o.soldOut ? `${o.label}, sold out` : o.label}
                className="peer absolute inset-0 cursor-pointer appearance-none rounded-full outline-none"
              />
              {/* Selected ring + keyboard focus ring */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-transparent transition-shadow duration-fast peer-checked:ring-2 peer-checked:ring-fg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
              />
              <span
                className={cn(
                  'pointer-events-none relative block',
                  sizes[size],
                )}
              >
                <SwatchDot color={o.color} soldOut={Boolean(o.soldOut)} />
              </span>
            </label>
          </Tooltip>
        ))}
      </div>
    </fieldset>
  );
}
