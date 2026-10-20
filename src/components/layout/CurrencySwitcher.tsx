'use client';

import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/DropdownMenu';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCurrency,
  setCurrency,
  type CurrencyCode,
} from '@/store/slices/uiSlice';

/*
 * ৳ BDT / $ USD picker. UI only for now: it stores the choice in Redux so
 * the navbar and mobile menu agree. Module 21 makes it real (a cookie, and
 * the page re-rendered in that currency).
 */

export const currencyOptions: {
  code: CurrencyCode;
  symbol: string;
  name: string;
}[] = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
];

/** Compact dropdown for the navbar. */
export function CurrencySwitcher({ className }: { className?: string }) {
  const currency = useAppSelector(selectCurrency);
  const dispatch = useAppDispatch();
  const current = currencyOptions.find((c) => c.code === currency)!;

  return (
    <DropdownMenu
      align="end"
      trigger={
        <Button
          variant="ghost"
          size="sm"
          iconRight={<Icon icon={ChevronDown} size="xs" />}
          className={cn('px-3 tabular-nums', className)}
        >
          {/* Name = "Currency: ৳ BDT": contains the visible text (WCAG 2.5.3). */}
          <span className="sr-only">Currency: </span>
          {current.symbol} {current.code}
        </Button>
      }
    >
      <DropdownMenuLabel>Shop in</DropdownMenuLabel>
      {currencyOptions.map((c) => (
        <DropdownMenuItem
          key={c.code}
          onSelect={() => dispatch(setCurrency(c.code))}
          icon={
            <Icon
              icon={Check}
              size="sm"
              className={c.code === currency ? '' : 'invisible'}
            />
          }
        >
          <span className="w-4 tabular-nums">{c.symbol}</span>
          {c.code}
          <span className="text-muted-fg">· {c.name}</span>
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}

/** Two-button version for the mobile menu. */
export function CurrencyToggle() {
  const currency = useAppSelector(selectCurrency);
  const dispatch = useAppDispatch();

  return (
    <div role="group" aria-label="Currency" className="flex gap-2">
      {currencyOptions.map((c) => (
        <Button
          key={c.code}
          size="sm"
          variant={c.code === currency ? 'primary' : 'outline'}
          aria-pressed={c.code === currency}
          onClick={() => dispatch(setCurrency(c.code))}
        >
          {c.symbol} {c.code}
        </Button>
      ))}
    </div>
  );
}
