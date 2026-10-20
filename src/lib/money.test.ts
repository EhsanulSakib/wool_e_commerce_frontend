import { describe, expect, it } from 'vitest';
import { currencies, discountPercent, formatPrice } from './money';

const { BDT, USD } = currencies;

describe('formatPrice', () => {
  it('formats Taka with the symbol, grouping and no decimals', () => {
    expect(formatPrice(1250, BDT)).toBe('৳1,250');
    expect(formatPrice(125000, BDT)).toBe('৳125,000');
    expect(formatPrice(0, BDT)).toBe('৳0');
  });

  it('rounds Taka to whole units (BDT shows 0 decimals)', () => {
    expect(formatPrice(1250.5, BDT)).toBe('৳1,251');
    expect(formatPrice(1250.49, BDT)).toBe('৳1,250');
  });

  it('formats dollars with 2 decimals', () => {
    expect(formatPrice(49.99, USD)).toBe('$49.99');
    expect(formatPrice(50, USD)).toBe('$50.00');
    expect(formatPrice(1234.5, USD)).toBe('$1,234.50');
  });

  it('accepts decimal strings from the API', () => {
    expect(formatPrice('1250.00', BDT)).toBe('৳1,250');
    expect(formatPrice('49.99', USD)).toBe('$49.99');
  });

  it('puts the minus before the symbol', () => {
    expect(formatPrice(-120, BDT)).toBe('−৳120');
    expect(formatPrice(-0.001, USD)).toBe('$0.00'); // rounds to zero: no sign
  });

  it('works for a currency added later as data', () => {
    const EUR = { code: 'EUR', symbol: '€', decimals: 2, locale: 'en-US' };
    expect(formatPrice(39, EUR)).toBe('€39.00');
  });

  it('rejects amounts that are not numbers', () => {
    expect(() => formatPrice('abc', BDT)).toThrow('Invalid amount');
  });
});

describe('discountPercent', () => {
  it('computes the whole-percent discount', () => {
    expect(discountPercent(1800, 2400)).toBe(25);
    expect(discountPercent('1800.00', '2400.00')).toBe(25);
    expect(discountPercent(39.99, 59.99)).toBe(33);
  });

  it('returns null without a real discount', () => {
    expect(discountPercent(1800, null)).toBeNull();
    expect(discountPercent(1800, undefined)).toBeNull();
    expect(discountPercent(1800, 1800)).toBeNull();
    expect(discountPercent(2000, 1800)).toBeNull();
    expect(discountPercent(1799.9, 1800)).toBeNull(); // rounds to 0%
  });
});
