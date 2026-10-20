'use client';

import { Star } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/*
 * Star ratings.
 *
 *   <Rating value={4.5} count={128} />      display: ★★★★½ (128)
 *   <RatingInput name="rating" label="Your rating" onValueChange={…} />
 *
 * Display: half stars by clipping a filled row over an empty one. Screen
 * readers get "4.5 out of 5 stars, 128 reviews" as one phrase.
 * Input: a native radio group (arrow keys, forms, validation for free);
 * each star is announced as "3 stars, 3 of 5".
 */

const sizes = { sm: 'size-3.5', md: 'size-4', lg: 'size-6' } as const;

function Stars({ className }: { className: string }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={className}
          strokeWidth={1.5}
        />
      ))}
    </>
  );
}

export interface RatingProps {
  /** 0–5; rounded to the nearest half star for display. */
  value: number;
  /** Number of reviews, shown after the stars. */
  count?: number;
  size?: keyof typeof sizes;
  className?: string;
}

export function Rating({ value, count, size = 'md', className }: RatingProps) {
  const clamped = Math.min(5, Math.max(0, value));
  const shown = Math.round(clamped * 2) / 2;
  const label =
    `${clamped.toFixed(1).replace(/\.0$/, '')} out of 5 stars` +
    (count !== undefined
      ? `, ${count} ${count === 1 ? 'review' : 'reviews'}`
      : '');

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span role="img" aria-label={label} className="relative inline-flex">
        <span className="flex text-border-strong">
          <Stars className={sizes[size]} />
        </span>
        <span
          className="absolute inset-y-0 left-0 flex overflow-hidden text-fg"
          style={{ width: `${(shown / 5) * 100}%` }}
        >
          <Stars className={cn(sizes[size], 'shrink-0 fill-current')} />
        </span>
      </span>
      {count !== undefined && (
        <span aria-hidden="true" className="text-small text-muted-fg">
          ({count})
        </span>
      )}
    </span>
  );
}

export interface RatingInputProps {
  label: ReactNode;
  name?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  required?: boolean;
  error?: ReactNode;
  className?: string;
}

export function RatingInput({
  label,
  name: nameProp,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  required = false,
  error,
  className,
}: RatingInputProps) {
  const id = useId();
  const name = nameProp ?? id;
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  // Preview on hover, without changing the value.
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  const errorId = `${id}-error`;

  return (
    <fieldset
      className={cn('grid gap-2', className)}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-2 text-small font-medium text-fg">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-danger">
            *
          </span>
        )}
      </legend>
      <div className="flex" onPointerLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className="group relative cursor-pointer p-0.5"
            onPointerEnter={() => setHover(n)}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              required={required}
              onChange={() => {
                if (valueProp === undefined) setInner(n);
                onValueChange?.(n);
              }}
              className="peer sr-only"
            />
            <span className="sr-only">{n === 1 ? '1 star' : `${n} stars`}</span>
            <Star
              aria-hidden="true"
              strokeWidth={1.5}
              className={cn(
                'size-7 rounded-sm transition-colors duration-fast peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring',
                n <= shown ? 'fill-current text-fg' : 'text-border-strong',
              )}
            />
          </label>
        ))}
        <span
          className="ml-3 self-center text-small text-muted-fg"
          aria-hidden="true"
        >
          {shown ? `${shown} of 5` : ''}
        </span>
      </div>
      {error && (
        <p id={errorId} className="text-small font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
