import { cn } from '@/lib/cn';
import {
  discountPercent,
  formatPrice,
  type Amount,
  type Currency,
} from '@/lib/money';
import { Badge } from './Badge';

/*
 * A price in any currency, with the sale treatment when there's a
 * compare-at price: the sale price in the sale color, the old price struck
 * through, and the discount as a badge.
 *
 *   <PriceTag amount="1800.00" compareAt="2400.00" currency={currencies.BDT} />
 *   → ৳1,800 ~~৳2,400~~ −25%
 *
 * Screen readers hear "Sale price ৳1,800, original price ৳2,400, 25% off"
 * instead of two bare numbers.
 */

const sizes = {
  sm: { price: 'text-small', compare: 'text-caption' },
  md: { price: 'text-body', compare: 'text-small' },
  lg: { price: 'text-h4', compare: 'text-body' },
} as const;

export interface PriceTagProps {
  amount: Amount;
  /** The "was" price. Ignored unless higher than `amount`. */
  compareAt?: Amount | null;
  currency: Currency;
  size?: keyof typeof sizes;
  /** Show the "−25%" badge (default true). */
  showDiscount?: boolean;
  className?: string;
}

export function PriceTag({
  amount,
  compareAt,
  currency,
  size = 'md',
  showDiscount = true,
  className,
}: PriceTagProps) {
  const percent = discountPercent(amount, compareAt);
  const s = sizes[size];
  const price = formatPrice(amount, currency);

  if (percent === null) {
    return (
      <p className={cn('font-medium tabular-nums', s.price, className)}>
        {price}
      </p>
    );
  }

  const was = formatPrice(compareAt!, currency);
  return (
    <p
      className={cn(
        'flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums',
        className,
      )}
    >
      <span className="sr-only">Sale price</span>
      <span className={cn('font-semibold text-danger', s.price)}>{price}</span>
      <span className="sr-only">, original price</span>
      <s className={cn('text-muted-fg', s.compare)}>{was}</s>
      {showDiscount && (
        <Badge tone="sale" size="sm" className="self-center">
          <span className="sr-only">, </span>−{percent}%
          <span className="sr-only"> off</span>
        </Badge>
      )}
    </p>
  );
}
