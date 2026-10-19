import { readFileSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';

/**
 * Reads tokens.css and returns the CSS variables per theme, with var()
 * references resolved. Node-only (reads from disk): used by tokens.test.ts
 * and the /dev/tokens page (rendered at build time).
 */

export type TokenMap = Record<string, string>;

function readBlocks(): Map<string, TokenMap> {
  // Tests and `next build` both run from the project root.
  const css = readFileSync(
    resolvePath(process.cwd(), 'src/styles/tokens.css'),
    'utf8',
  ).replace(/\/\*[\s\S]*?\*\//g, '');

  const out = new Map<string, TokenMap>();
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const key = selector.trim().replace(/\s+/g, ' ');
    const decls = out.get(key) ?? {};
    for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      decls[name] = value.trim().replace(/\s+/g, ' ');
    }
    out.set(key, decls);
  }
  return out;
}

export function loadTokens() {
  const blocks = readBlocks();
  const root = blocks.get(':root') ?? {};
  const light = { ...root, ...blocks.get(":root, [data-theme='light']") };
  const dark = { ...light, ...blocks.get("[data-theme='dark']") };
  return { root, light, dark, theme: blocks.get('@theme') ?? {} };
}

/** Follows var(--x) chains: resolve(light, 'fg') → "#0a0a0a". */
export function resolveToken(vars: TokenMap, name: string): string {
  const value = vars[name];
  if (value === undefined) throw new Error(`Unknown token --${name}`);
  const ref = value.match(/^var\(--([\w-]+)\)$/);
  return ref ? resolveToken(vars, ref[1]) : value;
}
