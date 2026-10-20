import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CountUp } from './CountUp';
import { Marquee } from './Marquee';
import { fadeUp, withTransition } from './presets';

describe('CountUp', () => {
  it('puts the final, formatted number in the server HTML', () => {
    const html = renderToString(<CountUp value={30000} suffix="+" />);
    expect(html).toContain('30,000+');
  });

  it('keeps the decimals of the value', () => {
    expect(renderToString(<CountUp value={4.8} />)).toContain('4.8');
    expect(renderToString(<CountUp value={1250} decimals={2} />)).toContain(
      '1,250.00',
    );
  });

  it('gives screen readers the final number once', () => {
    render(<CountUp value={3000} prefix="৳" />);
    // Two copies in the DOM: the animated one is aria-hidden.
    const copies = screen.getAllByText('৳3,000');
    expect(copies).toHaveLength(2);
    expect(
      copies.filter((el) => el.closest('[aria-hidden="true"]')),
    ).toHaveLength(1);
  });
});

describe('Marquee', () => {
  it('hides the duplicate copy from screen readers and keyboard', () => {
    render(
      <Marquee>
        <a href="/shop">Shop</a>
      </Marquee>,
    );
    const links = screen.getAllByRole('link', { hidden: true });
    expect(links).toHaveLength(2);
    // Only one is exposed to assistive tech…
    expect(screen.getAllByRole('link')).toHaveLength(1);
    // …and the copy can't be focused.
    const copy = links[1].closest('[aria-hidden="true"]');
    expect(copy).toHaveAttribute('inert');
  });
});

describe('presets', () => {
  it('reduced motion zeroes the transition but keeps the final state', () => {
    const reduced = withTransition(fadeUp, { reduced: true });
    expect(reduced.visible).toMatchObject({
      opacity: 1,
      y: 0,
      transition: { duration: 0 },
    });
  });

  it('adds a delay without losing the token transition', () => {
    const delayed = withTransition(fadeUp, { delay: 0.2 });
    expect(delayed.visible).toMatchObject({
      transition: { delay: 0.2, duration: 0.7 },
    });
  });
});
