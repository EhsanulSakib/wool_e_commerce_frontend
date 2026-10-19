import { describe, expect, it } from 'vitest';
import { contrastPairs, contrastRatio } from '@/lib/contrast';
import { duration, ease } from './motion';
import { loadTokens, resolveToken } from './parseTokens';

const { root, light, dark, theme } = loadTokens();

describe('color contrast (WCAG AA)', () => {
  for (const [name, vars] of [
    ['light', light],
    ['dark', dark],
  ] as const) {
    for (const { fg, bg, min } of contrastPairs) {
      it(`${name}: ${fg} on ${bg} ≥ ${min}`, () => {
        const ratio = contrastRatio(
          resolveToken(vars, fg),
          resolveToken(vars, bg),
        );
        expect(ratio).toBeGreaterThanOrEqual(min);
      });
    }
  }
});

describe('motion tokens', () => {
  it('CSS durations match motion.ts', () => {
    for (const [name, ms] of Object.entries(duration)) {
      expect(root[`duration-${name}`]).toBe(`${ms}ms`);
    }
  });

  it('CSS easings match motion.ts', () => {
    const kebab = (n: string) =>
      n.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    for (const [name, points] of Object.entries(ease)) {
      expect(theme[`ease-${kebab(name)}`]).toBe(
        `cubic-bezier(${points.join(', ')})`,
      );
    }
  });
});
