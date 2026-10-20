import { describe, expect, it } from 'vitest';
import { computePosition } from './useAnchoredPosition';

const viewport = { width: 1000, height: 800 };
const floating = { width: 200, height: 100 };
const rect = (left: number, top: number, width = 100, height = 40) =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

describe('computePosition', () => {
  it('places below, centered, with the offset', () => {
    const p = computePosition(
      rect(400, 300),
      floating,
      viewport,
      'bottom',
      'center',
      8,
    );
    expect(p).toEqual({ top: 348, left: 350, side: 'bottom' });
  });

  it('flips to the top when there is no room below', () => {
    const p = computePosition(
      rect(400, 720),
      floating,
      viewport,
      'bottom',
      'center',
      8,
    );
    expect(p.side).toBe('top');
    expect(p.top).toBe(720 - 8 - 100);
  });

  it('flips to the bottom when there is no room above (tooltip at the top edge)', () => {
    const p = computePosition(
      rect(400, 20),
      floating,
      viewport,
      'top',
      'center',
      6,
    );
    expect(p.side).toBe('bottom');
    expect(p.top).toBe(20 + 40 + 6);
  });

  it('keeps the side when the other side has even less room', () => {
    const tall = { width: 200, height: 500 };
    const p = computePosition(
      rect(400, 380),
      tall,
      viewport,
      'bottom',
      'center',
      8,
    );
    expect(p.side).toBe('bottom'); // 380px above < 380px below: stay
  });

  it('shifts sideways to stay inside the viewport', () => {
    const left = computePosition(
      rect(0, 300, 40),
      floating,
      viewport,
      'bottom',
      'center',
      8,
    );
    expect(left.left).toBe(8);
    const right = computePosition(
      rect(960, 300, 40),
      floating,
      viewport,
      'bottom',
      'center',
      8,
    );
    expect(right.left).toBe(1000 - 200 - 8);
  });

  it('aligns start/end with the trigger edges', () => {
    expect(
      computePosition(rect(400, 300), floating, viewport, 'bottom', 'start', 8)
        .left,
    ).toBe(400);
    expect(
      computePosition(rect(400, 300), floating, viewport, 'bottom', 'end', 8)
        .left,
    ).toBe(500 - 200);
  });
});
