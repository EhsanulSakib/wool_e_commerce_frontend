/*
 * Money formatting for any currency.
 *
 * Currencies are data, not code (ROADMAP §2): the backend's Currency table
 * returns { code, symbol, decimals, … }. Until that API exists (module 17),
 * `currencies` below has the same shape for BDT and USD.
 *
 *   formatPrice(1250, currencies.BDT)    → "৳1,250"
 *   formatPrice('49.99', currencies.USD) → "$49.99"
 *
 * Amounts come from the API as decimal strings ("1250.00", Postgres
 * numeric); numbers are accepted too. This only formats for display: never
 * do money math with the result, and never trust client-side totals.
 */

export interface Currency {
  /** ISO 4217 code: "BDT", "USD". */
  code: string;
  /** Shown before the amount: "৳", "$". */
  symbol: string;
  /** Digits shown after the point: BDT 0, USD 2. */
  decimals: number;
  /** Locale for digit grouping. */
  locale: string;
}

export const currencies = {
  BDT: { code: 'BDT', symbol: '৳', decimals: 0, locale: 'en-US' },
  USD: { code: 'USD', symbol: '$', decimals: 2, locale: 'en-US' },
} as const satisfies Record<string, Currency>;

export type Amount = number | string;

// One Intl.NumberFormat per (locale, decimals): creating them is slow.
const formatters = new Map<string, Intl.NumberFormat>();
function numberFormat(locale: string, decimals: number) {
  const key = `${locale}|${decimals}`;
  let nf = formatters.get(key);
  if (!nf) {
    nf = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    formatters.set(key, nf);
  }
  return nf;
}

export function toNumber(amount: Amount): number {
  const n = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(n)) throw new Error(`Invalid amount: ${amount}`);
  return n;
}

/**
 * "৳1,250", "$49.99", "−৳120" for negatives (refunds, discounts).
 * Rounds to the currency's display decimals (BDT 1250.5 → "৳1,251").
 */
export function formatPrice(amount: Amount, currency: Currency): string {
  const n = toNumber(amount);
  const digits = numberFormat(currency.locale, currency.decimals).format(
    Math.abs(n),
  );
  const sign = n < 0 && digits.replace(/[^1-9]/g, '') !== '' ? '−' : '';
  return `${sign}${currency.symbol}${digits}`;
}

/**
 * Whole-percent discount from compare-at to price: (2400 → 1800) = 25.
 * null when there's no real discount (missing, equal or higher price).
 */
export function discountPercent(
  price: Amount,
  compareAt: Amount | null | undefined,
): number | null {
  if (compareAt === null || compareAt === undefined) return null;
  const p = toNumber(price);
  const c = toNumber(compareAt);
  if (c <= 0 || p >= c) return null;
  const percent = Math.round((1 - p / c) * 100);
  return percent > 0 ? percent : null;
}
