import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { currencies } from '@/lib/money';
import { initials } from './Avatar';
import { pageRange } from './Pagination';
import { PriceTag } from './PriceTag';
import { Rating } from './Rating';
import { Swatch } from './Swatch';

describe('pageRange', () => {
  it('lists every page when they fit', () => {
    expect(pageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('puts ellipses on both sides in the middle', () => {
    expect(pageRange(6, 12)).toEqual([1, null, 5, 6, 7, null, 12]);
  });

  it('keeps a constant width near the ends', () => {
    expect(pageRange(1, 12)).toEqual([1, 2, 3, 4, 5, null, 12]);
    expect(pageRange(3, 12)).toEqual([1, 2, 3, 4, 5, null, 12]);
    expect(pageRange(12, 12)).toEqual([1, null, 8, 9, 10, 11, 12]);
  });
});

describe('PriceTag', () => {
  it('shows a regular price', () => {
    render(<PriceTag amount="1250.00" currency={currencies.BDT} />);
    expect(screen.getByText('৳1,250')).toBeInTheDocument();
  });

  it('reads a sale as one sentence and shows the discount', () => {
    const { container } = render(
      <PriceTag amount={1800} compareAt={2400} currency={currencies.BDT} />,
    );
    expect(container.textContent?.replace(/\s+/g, ' ')).toBe(
      'Sale price৳1,800, original price৳2,400, −25% off',
    );
    expect(screen.getByText('৳2,400').tagName).toBe('S');
  });

  it('ignores a compare-at price that is not higher', () => {
    render(
      <PriceTag amount={1800} compareAt={1800} currency={currencies.BDT} />,
    );
    expect(screen.queryByText(/Sale price/)).not.toBeInTheDocument();
  });
});

describe('Rating', () => {
  it('has one accessible phrase', () => {
    render(<Rating value={4.5} count={128} />);
    expect(
      screen.getByRole('img', { name: '4.5 out of 5 stars, 128 reviews' }),
    ).toBeInTheDocument();
  });
});

describe('Swatch', () => {
  it('announces sold-out colors', () => {
    render(<Swatch color="#F3EBDD" label="Cream" soldOut />);
    expect(
      screen.getByRole('img', { name: 'Cream, sold out' }),
    ).toBeInTheDocument();
  });
});

describe('initials', () => {
  it('uses the first and last name', () => {
    expect(initials('Sakib Hasan')).toBe('SH');
    expect(initials('  nusrat  jahan  khan ')).toBe('NK');
    expect(initials('Rafi')).toBe('R');
    expect(initials('')).toBe('?');
  });
});
